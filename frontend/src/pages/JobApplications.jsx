import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

const STATUS_OPTIONS = ['Applied', 'Shortlisted', 'Rejected'];

export default function JobApplications() {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/applications/job/${jobId}`);
        setApplications(data);
        if (data[0]?.jobId?.title) setJobTitle(data[0].jobId.title);
        else if (data.length === 0) {
          const jobRes = await api.get(`/jobs/${jobId}`).catch(() => ({}));
          if (jobRes.data) setJobTitle(jobRes.data.title);
        }
      } catch {
        setApplications([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [jobId]);

  const updateStatus = async (appId, status) => {
    setUpdating(appId);
    try {
      await api.put(`/applications/${appId}`, { status });
      setApplications((prev) => prev.map((a) => (a._id === appId ? { ...a, status } : a)));
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-2 border-teal-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/recruiter/jobs" className="text-teal-600 hover:text-teal-700 text-sm font-medium mb-4 inline-block">
        ← Back to my jobs
      </Link>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Applications</h1>
      {jobTitle && <p className="text-slate-600 mb-6">{jobTitle}</p>}
      {applications.length === 0 ? (
        <div className="card p-12 text-center text-slate-600">No applications yet.</div>
      ) : (
        <ul className="space-y-4">
          {applications.map((app) => (
            <li key={app._id} className="card p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start gap-3">
                  {app.userId?.profilePhoto && (
                    <img src={app.userId.profilePhoto} alt="" className="w-12 h-12 rounded-xl object-cover" />
                  )}
                  <div>
                    <p className="font-medium text-slate-800">{app.userId?.name || app.userId?.email}</p>
                    <p className="text-slate-600 text-sm">{app.userId?.email}</p>
                    {app.matchScore != null && (
                      <p className="text-sm mt-1">Match: <strong>{app.matchScore}%</strong> {app.recommended && <span className="text-teal-600">Recommended</span>}</p>
                    )}
                    {app.userId?.resume && (
                      <a href={app.userId.resume} target="_blank" rel="noopener noreferrer" className="link text-sm mt-1 inline-block">
                        Resume
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <select
                    value={app.status}
                    onChange={(e) => updateStatus(app._id, e.target.value)}
                    disabled={updating === app._id}
                    className="input w-auto py-1.5 text-sm"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {updating === app._id && <span className="text-slate-500 text-sm">Updating…</span>}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
