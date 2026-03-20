function JobCard({ job, onApply }) {
  const getScoreColor = (score) => {
    if (score >= 70) return '#22c55e';
    if (score >= 40) return '#eab308';
    return '#9ca3af';
  };

  const getScoreBadge = (score) => {
    if (score >= 70) return '🟢';
    if (score >= 40) return '🟡';
    return '⚪';
  };

  const handleApply = () => {
    window.open(job.applyUrl || 'https://www.linkedin.com/jobs', '_blank');
    if (onApply) onApply(job);
  };

  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '16px',
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#111827' }}>{job.title}</h3>
          <p style={{ margin: '0 0 8px 0', color: '#6b7280', fontSize: '14px' }}>
            {job.company} • {job.location}
          </p>
        </div>
        {job.matchScore !== undefined && (
          <div style={{
            backgroundColor: getScoreColor(job.matchScore) + '20',
            color: getScoreColor(job.matchScore),
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            {getScoreBadge(job.matchScore)} {job.matchScore}%
          </div>
        )}
      </div>

      <p style={{ color: '#374151', fontSize: '14px', margin: '8px 0' }}>{job.description}</p>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '12px 0' }}>
        <span style={{ backgroundColor: '#eff6ff', color: '#3b82f6', padding: '2px 10px', borderRadius: '20px', fontSize: '12px' }}>
          {job.type}
        </span>
        <span style={{ backgroundColor: '#f0fdf4', color: '#22c55e', padding: '2px 10px', borderRadius: '20px', fontSize: '12px' }}>
          {job.mode}
        </span>
        {job.skills.map(skill => (
          <span key={skill} style={{ backgroundColor: '#f9fafb', color: '#6b7280', padding: '2px 10px', borderRadius: '20px', fontSize: '12px', border: '1px solid #e5e7eb' }}>
            {skill}
          </span>
        ))}
      </div>

      <button
        onClick={handleApply}
        style={{
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          padding: '8px 20px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500'
        }}>
        Apply Now
      </button>
    </div>
  );
}

export default JobCard;