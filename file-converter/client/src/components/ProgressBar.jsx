export default function ProgressBar({ progress }) {
  return (
    <div style={{ marginTop: '1.2rem' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        fontSize: 13, color: '#6b7280', marginBottom: 8
      }}>
        <span>
          {progress < 60 ? '⬆ Uploading...' : progress < 100 ? '⚙️ Converting...' : '✅ Done!'}
        </span>
        <span style={{ fontWeight: 600 }}>{progress}%</span>
      </div>
      <div style={{ height: 10, background: '#f3f4f6', borderRadius: 999 }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: progress === 100
            ? '#16a34a'
            : 'linear-gradient(90deg, #2563eb, #7c3aed)',
          borderRadius: 999,
          transition: 'width 0.4s ease'
        }} />
      </div>
    </div>
  );
}
