const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const convertRouter = require('./routes/convert');

const app = express();
const PORT = process.env.PORT || 5000;

// Create required folders
['uploads', 'outputs'].forEach(dir => {
  const p = path.join(__dirname, dir);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

app.use(cors());
app.use(express.json());

// API routes
app.use('/api', convertRouter);

// Serve converted files for download
app.use('/outputs', express.static(path.join(__dirname, 'outputs')));

// Serve React frontend (built files)
const clientBuild = path.join(__dirname, 'public');
if (fs.existsSync(clientBuild)) {
  app.use(express.static(clientBuild));
  app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(clientBuild, 'index.html'));
  });
}

// Auto-delete files older than 1 hour
setInterval(() => {
  ['uploads', 'outputs'].forEach(dir => {
    const folder = path.join(__dirname, dir);
    if (!fs.existsSync(folder)) return;
    fs.readdirSync(folder).forEach(file => {
      const filePath = path.join(folder, file);
      try {
        const age = Date.now() - fs.statSync(filePath).mtimeMs;
        if (age > 60 * 60 * 1000) fs.unlinkSync(filePath);
      } catch (e) {}
    });
  });
}, 15 * 60 * 1000);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
