const FORMAT_MAP = {
  // Documents
  pdf:  ['docx', 'pptx', 'xlsx', 'odt', 'txt'],
  docx: ['pdf', 'odt', 'txt'],
  doc:  ['pdf', 'docx', 'odt', 'txt'],
  pptx: ['pdf', 'ppt'],
  ppt:  ['pdf', 'pptx'],
  xlsx: ['pdf', 'csv', 'xls'],
  xls:  ['pdf', 'xlsx', 'csv'],
  odt:  ['pdf', 'docx', 'txt'],
  txt:  ['pdf', 'docx'],
  csv:  ['xlsx', 'pdf'],
  // Images
  jpg:  ['png', 'webp', 'avif', 'gif', 'tiff'],
  jpeg: ['png', 'webp', 'avif', 'gif', 'tiff'],
  png:  ['jpg', 'webp', 'avif', 'gif', 'tiff'],
  webp: ['jpg', 'png', 'avif', 'gif'],
  gif:  ['jpg', 'png', 'webp'],
  avif: ['jpg', 'png', 'webp'],
  tiff: ['jpg', 'png', 'webp'],
  // Video
  mp4:  ['webm', 'avi', 'mov', 'mkv', 'mp3'],
  mov:  ['mp4', 'webm', 'avi', 'mp3'],
  avi:  ['mp4', 'webm', 'mov'],
  mkv:  ['mp4', 'webm', 'avi'],
  webm: ['mp4', 'avi', 'mov'],
  // Audio
  mp3:  ['wav', 'ogg', 'aac', 'flac'],
  wav:  ['mp3', 'ogg', 'aac', 'flac'],
  ogg:  ['mp3', 'wav', 'aac'],
  aac:  ['mp3', 'wav', 'ogg'],
  flac: ['mp3', 'wav', 'ogg'],
};

const FORMAT_GROUPS = {
  'Documents': ['pdf', 'docx', 'doc', 'pptx', 'ppt', 'xlsx', 'xls', 'odt', 'txt', 'csv'],
  'Images':    ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif', 'tiff'],
  'Video':     ['mp4', 'mov', 'avi', 'mkv', 'webm'],
  'Audio':     ['mp3', 'wav', 'ogg', 'aac', 'flac'],
};

export default function FormatSelector({ file, targetFormat, setTargetFormat }) {
  const ext = file?.name.split('.').pop().toLowerCase();
  const options = FORMAT_MAP[ext] || [];

  if (!options.length) return (
    <div style={{
      marginTop: '1.2rem', padding: '0.8rem 1rem',
      background: '#fef2f2', borderRadius: 10,
      color: '#dc2626', fontSize: 13, textAlign: 'center'
    }}>
      ⚠️ No supported output formats for <strong>.{ext}</strong> files
    </div>
  );

  return (
    <div style={{ marginTop: '1.2rem' }}>
      <p style={{ fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 10 }}>
        Convert to:
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {options.map(fmt => (
          <button
            key={fmt}
            onClick={() => setTargetFormat(fmt)}
            style={{
              padding: '7px 16px',
              borderRadius: 8,
              border: '1.5px solid',
              borderColor: targetFormat === fmt ? '#2563eb' : '#e5e7eb',
              background: targetFormat === fmt ? '#eff6ff' : '#fff',
              color: targetFormat === fmt ? '#1d4ed8' : '#6b7280',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 13,
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
              transition: 'all 0.15s'
            }}
          >
            .{fmt}
          </button>
        ))}
      </div>
    </div>
  );
}
