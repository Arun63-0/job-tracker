function ApplyPopup({ job, onResponse }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '32px',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <p style={{ fontSize: '32px', textAlign: 'center', margin: '0 0 16px 0' }}>🤔</p>
        <h2 style={{ textAlign: 'center', margin: '0 0 8px 0', fontSize: '20px' }}>
          Did you apply?
        </h2>
        <p style={{ textAlign: 'center', color: '#6b7280', margin: '0 0 24px 0', fontSize: '14px' }}>
          <strong>{job.title}</strong> at <strong>{job.company}</strong>
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={() => onResponse('applied')}
            style={{
              backgroundColor: '#22c55e',
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: '10px',
              fontSize: '15px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}>
            ✅ Yes, I Applied!
          </button>

          <button
            onClick={() => onResponse('applied_earlier')}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: '10px',
              fontSize: '15px',
              cursor: 'pointer'
            }}>
            📅 Applied Earlier
          </button>

          <button
            onClick={() => onResponse('browsing')}
            style={{
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: 'none',
              padding: '12px',
              borderRadius: '10px',
              fontSize: '15px',
              cursor: 'pointer'
            }}>
            👀 Just Browsing
          </button>
        </div>
      </div>
    </div>
  );
}

export default ApplyPopup;