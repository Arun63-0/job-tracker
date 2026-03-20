function Dashboard({ applications, onStatusUpdate, onClose }) {
  const getStatusColor = (status) => {
    if (status === 'Applied') return '#3b82f6';
    if (status === 'Interview') return '#f59e0b';
    if (status === 'Offer') return '#22c55e';
    if (status === 'Rejected') return '#ef4444';
    return '#6b7280';
  };

  const getStatusEmoji = (status) => {
    if (status === 'Applied') return '📝';
    if (status === 'Interview') return '🎯';
    if (status === 'Offer') return '🎉';
    if (status === 'Rejected') return '❌';
    return '📋';
  };

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
        padding: '24px',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '22px' }}>📋 My Applications</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#6b7280'
            }}>✕</button>
        </div>

        {applications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            <p style={{ fontSize: '40px' }}>📭</p>
            <p>No applications yet! Click Apply on any job to get started.</p>
          </div>
        ) : (
          applications.map(app => (
            <div key={app.id} style={{
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>{app.title}</h3>
                  <p style={{ margin: '0 0 8px 0', color: '#6b7280', fontSize: '13px' }}>
                    {app.company} • Applied {new Date(app.appliedAt).toLocaleDateString()}
                  </p>
                </div>
                <span style={{
                  backgroundColor: getStatusColor(app.status) + '20',
                  color: getStatusColor(app.status),
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: 'bold'
                }}>
                  {getStatusEmoji(app.status)} {app.status}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['Applied', 'Interview', 'Offer', 'Rejected'].map(status => (
                  <button
                    key={status}
                    onClick={() => onStatusUpdate(app.id, status)}
                    style={{
                      backgroundColor: app.status === status ? getStatusColor(status) : '#f3f4f6',
                      color: app.status === status ? 'white' : '#374151',
                      border: 'none',
                      padding: '4px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}>
                    {status}
                  </button>
                ))}
              </div>

              <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #f3f4f6' }}>
                <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>Timeline:</p>
                {app.timeline.map((event, i) => (
                  <p key={i} style={{ margin: '4px 0', fontSize: '12px', color: '#374151' }}>
                    • {event.status} — {new Date(event.date).toLocaleString()}
                  </p>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;