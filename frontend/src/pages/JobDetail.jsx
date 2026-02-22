import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/jobs/${id}`);
        setJob(data);
      } catch {
        setJob(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleApply = async () => {
    if (!user) return;
    setApplying(true);
    setError('');
    try {
      await api.post('/applications', { jobId: id });
      setApplied(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Apply failed');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-2 border-teal-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-slate-600">Job not found.</p>
        <Link to="/jobs" className="link mt-4 inline-block">Back to jobs</Link>
      </div>
    );
  }

  const canApply = user?.role === 'SEEKER' && job.status === 'APPROVED';

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/jobs" className="text-teal-600 hover:text-teal-700 text-sm font-medium mb-6 inline-block">
        ← Back to jobs
      </Link>
      <div className="card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{job.title}</h1>
            <p className="text-teal-600 font-medium mt-1">{job.company}</p>
            <div className="flex flex-wrap gap-3 mt-3 text-slate-600 text-sm">
              {job.location && <span>{job.location}</span>}
              {job.salary && <span>{job.salary}</span>}
            </div>
          </div>
          {canApply && (
            <div className="sm:shrink-0">
              {applied ? (
                <span className="inline-block px-4 py-2 rounded-xl bg-teal-100 text-teal-800 font-medium">
                  Applied
                </span>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn-primary rounded-xl"
                    onClick={handleApply}
                    disabled={applying}
                  >
                    {applying ? 'Applying…' : 'Apply now'}
                  </button>
                  {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
                </>
              )}
            </div>
          )}
        </div>
        {job.description && (
          <div className="mt-6 pt-6 border-t border-slate-200">
            <h2 className="font-semibold text-slate-800 mb-2">Description</h2>
            <p className="text-slate-600 whitespace-pre-wrap">{job.description}</p>
          </div>
        )}
        {job.skills?.length > 0 && (
          <div className="mt-6">
            <h2 className="font-semibold text-slate-800 mb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((s) => (
                <span key={s} className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-sm">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
