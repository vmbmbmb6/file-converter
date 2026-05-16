# FileFlip — File Converter

Convert any file to any format — free & instant.

## Supported Conversions
- **Documents**: PDF ↔ DOCX, PPTX, XLSX, ODT, TXT, CSV
- **Images**: JPG, PNG, WEBP, AVIF, GIF, TIFF
- **Video**: MP4, AVI, MOV, MKV, WEBM
- **Audio**: MP3, WAV, OGG, AAC, FLAC

## Tech Stack
- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Conversion**: LibreOffice + FFmpeg + Sharp
- **Deployment**: Docker + Railway

## Local Development

```bash
# Run with Docker
docker compose up --build

# Open http://localhost:5000
```

## Deploy to Railway
1. Push to GitHub
2. Connect repo on railway.app
3. Railway auto-detects Dockerfile and deploys
