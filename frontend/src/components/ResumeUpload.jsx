import { useState } from 'react';

function ResumeUpload({ onUpload }) {
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [filename, setFilename] = useState('');

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('http://localhost:3000/api/resume/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      setFilename(data.filename);
      setUploaded(true);
      onUpload();
    } catch (err) {
      console.error('Upload error:', err);
    }
    setUploading(false);
  };

  return (
    <div style={{
      backgroundColor: uploaded ? '#f0fdf4' : '#eff6ff',
      border: `2px dashed ${uploaded ? '#22c55e' : '#3b82f6'}`,
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '24px',
      textAlign: 'center'
    }}>
      {uploaded ? (
        <div>
          <p style={{ color: '#22c55e', fontWeight: 'bold', margin: '0 0 8px 0' }}>
            ✅ Resume Uploaded: {filename}
          </p>
          <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 12px 0' }}>
            AI is now matching jobs to your resume!
          </p>
          <label style={{ cursor: 'pointer', color: '#3b82f6', fontSize: '13px' }}>
            Replace Resume
            <input
              type="file"
              accept=".pdf,.txt"
              onChange={handleUpload}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      ) : (
        <div>
          <p style={{ fontSize: '32px', margin: '0 0 8px 0' }}>📄</p>
          <p style={{ fontWeight: 'bold', margin: '0 0 4px 0', color: '#1e40af' }}>
            Upload Your Resume
          </p>
          <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 12px 0' }}>
            PDF or TXT file — AI will match jobs to your skills!
          </p>
          <label style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '8px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px'
          }}>
            {uploading ? 'Uploading...' : 'Choose File'}
            <input
              type="file"
              accept=".pdf,.txt"
              onChange={handleUpload}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      )}
    </div>
  );
}

export default ResumeUpload;