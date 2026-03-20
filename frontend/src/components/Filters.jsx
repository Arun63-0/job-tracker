function Filters({ filters, setFilters }) {
  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      title: '',
      skills: '',
      type: '',
      mode: '',
      location: '',
      date: '',
      matchScore: ''
    });
  };

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      marginBottom: '24px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#111827' }}>🔍 Filter Jobs</h2>
        <button onClick={clearFilters} style={{
          backgroundColor: '#f3f4f6',
          border: 'none',
          padding: '6px 14px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '13px'
        }}>Clear All</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        <input
          placeholder="Search by title..."
          value={filters.title}
          onChange={e => handleChange('title', e.target.value)}
          style={inputStyle}
        />
        <input
          placeholder="Skills (React, Python...)"
          value={filters.skills}
          onChange={e => handleChange('skills', e.target.value)}
          style={inputStyle}
        />
        <input
          placeholder="Location..."
          value={filters.location}
          onChange={e => handleChange('location', e.target.value)}
          style={inputStyle}
        />
        <select value={filters.type} onChange={e => handleChange('type', e.target.value)} style={inputStyle}>
          <option value="">All Job Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Internship">Internship</option>
        </select>
        <select value={filters.mode} onChange={e => handleChange('mode', e.target.value)} style={inputStyle}>
          <option value="">All Work Modes</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
          <option value="On-site">On-site</option>
        </select>
        <select value={filters.date} onChange={e => handleChange('date', e.target.value)} style={inputStyle}>
          <option value="">Any Time</option>
          <option value="24h">Last 24 Hours</option>
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
        </select>
        <select value={filters.matchScore} onChange={e => handleChange('matchScore', e.target.value)} style={inputStyle}>
          <option value="">All Match Scores</option>
          <option value="high">High (70%+)</option>
          <option value="medium">Medium (40-70%)</option>
        </select>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: '8px 12px',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
  fontSize: '14px',
  width: '100%',
  boxSizing: 'border-box',
  outline: 'none'
};

export default Filters;