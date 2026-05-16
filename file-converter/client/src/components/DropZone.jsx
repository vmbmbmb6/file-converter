import { useCallback } from 'react';

export default function DropZone({ file, setFile }) {
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  }, [setFile]);

  const handleDragOver = (e) => e.preventDefault();

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => document.getElementById('fileInput').click()}
      style={{
        border: `2px dashed ${file ? '#86efac' : '#d1d5db'}`,
        borderRadius: 14,
        padding: '2.5rem 1.5rem',
        textAlign: 'center',
        cursor: 'pointer',
        background: file ? '#f0fdf4' : '#fafafa',
        transition: 'all 0.2s'
      }}
    >
      <input
        id="fileInput"
        type="file"
        hidden
        onChange={(e) => setFile(e.target.files[0])}
      />

      {file ? (
        <>
          <div style={{ fontSize: 40 }}>📄</div>
          <p style={{ fontWeight: 600, marginTop: 10, color: '#15803d', fontSize: 15 }}>
            {file.name}
          </p>
          <p style={{ color: '#6b7280', fontSize: 13, marginTop: 4 }}>
            {(file.size / 1024 / 1024).toFixed(2)} MB · click to change
          </p>
        </>
      ) : (
        <>
          <div style={{ fontSize: 44 }}>📂</div>
          <p style={{ fontWeight: 600, marginTop: 10, color: '#374151', fontSize: 16 }}>
            Drag & drop your file here
          </p>
          <p style={{ color: '#9ca3af', fontSize: 13, marginTop: 4 }}>
            or click to browse · max 100MB
          </p>
        </>
      )}
    </div>
  );
}
