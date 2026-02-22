import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const STATUS_COLORS = { Applied: 'bg-amber-100 text-amber-800', Shortlisted: 'bg-teal-100 text-teal-800', Rejected: 'bg-red-100 text-red-800' };

export default function MyApplications() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/applications/my');
        setList(data);
      } catch {
        setList([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-2 border-teal-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">My applications</h1>
      {list.length === 0 ? (
        <div className="card p-12 text-center text-slate-600">
          <p>You haven't applied to any jobs yet.</p>
          <Link to="/jobs" className="link mt-4 inline-block">Browse jobs</Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {list.map((app) => (
            <li key={app._id} className="card p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <Link to={`/jobs/${app.jobId?._id}`} className="font-semibold text-slate-800 hover:text-teal-600">
                    {app.jobId?.title}
                  </Link>
                  <p className="text-teal-600 text-sm">{app.jobId?.company}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {app.matchScore != null && (
                      <span className="text-sm text-slate-600">Match: {app.matchScore}%</span>
                    )}
                    {app.recommended && (
                      <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 text-xs font-medium">
                        Recommended
                      </span>
                    )}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-lg text-sm font-medium ${STATUS_COLORS[app.status] || 'bg-slate-100 text-slate-700'}`}>
                  {app.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
