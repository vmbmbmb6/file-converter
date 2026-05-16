import { useState } from 'react';
import DropZone from './components/DropZone';
import FormatSelector from './components/FormatSelector';
import ProgressBar from './components/ProgressBar';
import axios from 'axios';

const API_URL = '/api';

export default function App() {
  const [file, setFile] = useState(null);
  const [targetFormat, setTargetFormat] = useState('');
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [error, setError] = useState('');

  const handleConvert = async () => {
    if (!file || !targetFormat) return;
    setStatus('uploading');
    setProgress(0);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('targetFormat', targetFormat);

    let p = 60;
    let interval = null;

    try {
      const res = await axios.post(`${API_URL}/convert`, formData, {
        onUploadProgress: (e) => {
          setProgress(Math.round((e.loaded / e.total) * 60));
        }
      });

      // Simulate conversion progress 60% → 95%
      interval = setInterval(() => {
        p += 5;
        setProgress(p);
        if (p >= 95) clearInterval(interval);
      }, 400);

      clearInterval(interval);
      setProgress(100);
      setStatus('done');
      setDownloadUrl(res.data.downloadUrl);

    } catch (err) {
      clearInterval(interval);
      setStatus('error');
      setError(err.response?.data?.error || 'Conversion failed. Please try again.');
    }
  };

  const handleReset = () => {
    setFile(null);
    setStatus('idle');
    setTargetFormat('');
    setDownloadUrl('');
    setError('');
    setProgress(0);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'linear-gradient(135deg, #f0f4ff 0%, #faf8f5 100%)'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>⚡</div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: '0.4rem', color: '#1a1a1a' }}>
          FileFlip
        </h1>
        <p style={{ color: '#6b7280', fontSize: 16 }}>
          Convert any file to any format — free & instant
        </p>
      </div>

      {/* Main card */}
      <div style={{
        width: '100%',
        maxWidth: 580,
        background: '#fff',
        borderRadius: 20,
        padding: '2rem',
        boxShadow: '0 4px 32px rgba(0,0,0,0.08)',
        border: '1px solid #f0f0f0'
      }}>
        <DropZone file={file} setFile={setFile} setTargetFormat={setTargetFormat} />

        {file && status === 'idle' && (
          <>
            <FormatSelector
              file={file}
              targetFormat={targetFormat}
              setTargetFormat={setTargetFormat}
            />
            <button
              onClick={handleConvert}
              disabled={!targetFormat}
              style={{
                width: '100%',
                marginTop: '1.2rem',
                padding: '0.9rem',
                background: targetFormat ? '#2563eb' : '#e5e7eb',
                color: targetFormat ? '#fff' : '#9ca3af',
                border: 'none',
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 600,
                cursor: targetFormat ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s'
              }}
            >
              Convert File →
            </button>
          </>
        )}

        {status === 'uploading' && (
          <>
            <FormatSelector
              file={file}
              targetFormat={targetFormat}
              setTargetFormat={setTargetFormat}
            />
            <button disabled style={{
              width: '100%', marginTop: '1.2rem', padding: '0.9rem',
              background: '#93c5fd', color: '#fff', border: 'none',
              borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: 'not-allowed'
            }}>
              Converting...
            </button>
            <ProgressBar progress={progress} />
          </>
        )}

        {status === 'done' && (
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{
              textAlign: 'center', padding: '1rem',
              background: '#f0fdf4', borderRadius: 12, marginBottom: '1rem'
            }}>
              <div style={{ fontSize: 32 }}>✅</div>
              <p style={{ color: '#15803d', fontWeight: 600, marginTop: 8 }}>
                Conversion complete!
              </p>
            </div>
            <a
              href={downloadUrl}
              download
              style={{
                display: 'block', textAlign: 'center',
                padding: '0.9rem', background: '#16a34a',
                color: '#fff', borderRadius: 12,
                textDecoration: 'none', fontWeight: 600, fontSize: 16
              }}
            >
              ⬇ Download Converted File
            </a>
            <button
              onClick={handleReset}
              style={{
                width: '100%', marginTop: '8px', padding: '0.7rem',
                background: 'transparent', color: '#6b7280',
                border: '1px solid #e5e7eb', borderRadius: 12,
                fontSize: 14, cursor: 'pointer'
              }}
            >
              Convert another file
            </button>
          </div>
        )}

        {status === 'error' && (
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{
              textAlign: 'center', padding: '1rem',
              background: '#fef2f2', borderRadius: 12, marginBottom: '1rem'
            }}>
              <div style={{ fontSize: 32 }}>❌</div>
              <p style={{ color: '#dc2626', fontWeight: 600, marginTop: 8 }}>{error}</p>
            </div>
            <button
              onClick={handleReset}
              style={{
                width: '100%', padding: '0.9rem',
                background: '#2563eb', color: '#fff',
                border: 'none', borderRadius: 12,
                fontSize: 15, fontWeight: 600, cursor: 'pointer'
              }}
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Supported formats */}
      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <p style={{ color: '#9ca3af', fontSize: 13 }}>
          Supports PDF · DOCX · PPTX · XLSX · JPG · PNG · WEBP · MP4 · MP3 · WAV and more
        </p>
      </div>
    </div>
  );
}
