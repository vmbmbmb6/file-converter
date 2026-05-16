const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const rateLimit = require('express-rate-limit');
const { convertFile } = require('../utils/converter');

const router = express.Router();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 10 : 100
});

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, uuidv4() + path.extname(file.originalname))
});

// Allowed file types
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (req, file, cb) => {
    const allowed = [
      // Documents
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.oasis.opendocument.text',
      // Images
      'image/jpeg', 'image/png', 'image/gif',
      'image/webp', 'image/avif', 'image/tiff',
      // Video
      'video/mp4', 'video/quicktime',
      'video/x-msvideo', 'video/x-matroska', 'video/webm',
      // Audio
      'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/flac',
      // Text
      'text/plain', 'text/csv'
    ];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error(`Unsupported file type: ${file.mimetype}`));
  }
});

router.post('/convert', limiter, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const { targetFormat } = req.body;
  if (!targetFormat) return res.status(400).json({ error: 'Target format required' });

  try {
    const outputPath = await convertFile(req.file.path, req.file.originalname, targetFormat);

    // Clean up uploaded file after conversion
    fs.unlink(req.file.path, () => {});

    const filename = path.basename(outputPath);
    res.json({
      success: true,
      downloadUrl: `/outputs/${filename}`,
      filename
    });

  } catch (err) {
    // Clean up uploaded file on error
    if (req.file) fs.unlink(req.file.path, () => {});
    console.error(err);
    res.status(500).json({ error: err.message || 'Conversion failed' });
  }
});

module.exports = router;
