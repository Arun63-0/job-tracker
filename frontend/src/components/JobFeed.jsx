import { useState, useEffect } from 'react';
import JobCard from './JobCard';
import Filters from './Filters';
import ResumeUpload from './ResumeUpload';
import ChatBubble from './ChatBubble';
import ApplyPopup from './ApplyPopup';
import Dashboard from './Dashboard';

function JobFeed() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    title: '',
    skills: '',
    type: '',
    mode: '',
    location: '',
    date: '',
    matchScore: ''
  });
  const [pendingJob, setPendingJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [showDashboard, setShowDashboard] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.title) params.append('title', filters.title);
      if (filters.skills) params.append('skills', filters.skills);
      if (filters.type) params.append('type', filters.type);
      if (filters.mode) params.append('mode', filters.mode);
      if (filters.location) params.append('location', filters.location);
      if (filters.date) params.append('date', filters.date);
      if (filters.matchScore) params.append('matchScore', filters.matchScore);

      const res = await fetch(`https://job-tracker-rujx.onrender.com/api/jobs?${params}`);
      const data = await res.json();
      setJobs(data.jobs);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const handleApply = (job) => {
    setTimeout(() => {
      setPendingJob(job);
    }, 2000);
  };

  const handlePopupResponse = (response) => {
    if (response === 'applied' || response === 'applied_earlier') {
      const newApp = {
        id: Date.now(),
        title: pendingJob.title,
        company: pendingJob.company,
        status: 'Applied',
        appliedAt: new Date().toISOString(),
        timeline: [{ status: 'Applied', date: new Date().toISOString() }]
      };
      setApplications(prev => [...prev, newApp]);
    }
    setPendingJob(null);
  };

  const handleStatusUpdate = (appId, newStatus) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          status: newStatus,
          timeline: [...app.timeline, { status: newStatus, date: new Date().toISOString() }]
        };
      }
      return app;
    }));
  };

  const handleFiltersUpdate = (newFilters) => {
    setFilters(newFilters);
  };

  const bestMatches = jobs.filter(j => j.matchScore >= 70);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h1 style={{ fontSize: '32px', margin: 0, fontWeight: '800', color: '#111827', letterSpacing: '-0.5px' }}>🎯 AI Job Tracker</h1>
        <button
          onClick={() => setShowDashboard(true)}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px'
          }}>
          📋 My Applications ({applications.length})
        </button>
      </div>
      <p style={{ color: '#6b7280', marginBottom: '24px' }}>
        Find your perfect job match
      </p>

      <ResumeUpload onUpload={fetchJobs} />

      {bestMatches.length > 0 && (
        <div style={{
          backgroundColor: '#fefce8',
          border: '1px solid #fde047',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <h2 style={{ margin: '0 0 12px 0', fontSize: '18px' }}>
            ⭐ Best Matches for You
          </h2>
          {bestMatches.slice(0, 6).map(job => (
            <JobCard key={job.id} job={job} onApply={handleApply} />
          ))}
        </div>
      )}

      <Filters filters={filters} setFilters={setFilters} />

      {loading ? (
        <p style={{ textAlign: 'center', color: '#6b7280' }}>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#6b7280' }}>No jobs found!</p>
      ) : (
        <div>
          <p style={{ color: '#6b7280', marginBottom: '16px' }}>
            Found {jobs.length} jobs
          </p>
          {jobs.map(job => (
            <JobCard key={job.id} job={job} onApply={handleApply} />
          ))}
        </div>
      )}

      {pendingJob && (
        <ApplyPopup job={pendingJob} onResponse={handlePopupResponse} />
      )}

      {showDashboard && (
        <Dashboard
          applications={applications}
          onStatusUpdate={handleStatusUpdate}
          onClose={() => setShowDashboard(false)}
        />
      )}

      <ChatBubble onFiltersUpdate={handleFiltersUpdate} />
    </div>
  );
}

export default JobFeed;