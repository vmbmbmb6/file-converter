const { exec } = require('child_process');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const OUTPUT_DIR = path.join(__dirname, '../outputs');

function run(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, { timeout: 120000 }, (err, stdout, stderr) => {
      if (err) reject(new Error(stderr || err.message));
      else resolve(stdout);
    });
  });
}

async function convertFile(inputPath, originalName, targetFormat) {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const ext = path.extname(originalName).toLowerCase().replace('.', '');
  const outputName = uuidv4() + '.' + targetFormat;
  const outputPath = path.join(OUTPUT_DIR, outputName);

  // ── Image conversions (Sharp) ──────────────────────────────────
  const imageFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif', 'tiff'];
  if (imageFormats.includes(ext) && imageFormats.includes(targetFormat)) {
    const sharp = require('sharp');
    const fmt = targetFormat === 'jpg' ? 'jpeg' : targetFormat;
    await sharp(inputPath).toFormat(fmt).toFile(outputPath);
    return outputPath;
  }

  // ── Document conversions (LibreOffice) ─────────────────────────
  const libreFormats = ['pdf', 'docx', 'doc', 'pptx', 'ppt', 'xlsx', 'xls', 'odt', 'csv', 'txt'];
  if (libreFormats.includes(ext) && libreFormats.includes(targetFormat)) {
    const tempName = path.basename(inputPath, path.extname(inputPath));
    await run(`libreoffice --headless --convert-to ${targetFormat} --outdir "${OUTPUT_DIR}" "${inputPath}"`);
    const libreOutput = path.join(OUTPUT_DIR, tempName + '.' + targetFormat);
    if (fs.existsSync(libreOutput)) {
      fs.renameSync(libreOutput, outputPath);
    } else {
      throw new Error('LibreOffice conversion failed — output file not found');
    }
    return outputPath;
  }

  // ── Video/Audio conversions (FFmpeg) ───────────────────────────
  const mediaFormats = ['mp4', 'avi', 'mov', 'mkv', 'webm', 'mp3', 'wav', 'ogg', 'aac', 'flac'];
  if (mediaFormats.includes(ext) && mediaFormats.includes(targetFormat)) {
    await run(`ffmpeg -i "${inputPath}" -y "${outputPath}"`);
    return outputPath;
  }

  throw new Error(`Conversion from .${ext} to .${targetFormat} is not supported`);
}

module.exports = { convertFile };
