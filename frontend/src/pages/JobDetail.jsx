import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { MapPin, IndianRupee, CheckCircle, Clock, XCircle, Building2 } from 'lucide-react';

const SKILL_COLORS = [
  'bg-indigo-50 text-indigo-700 border-indigo-100',
  'bg-violet-50 text-violet-700 border-violet-100',
  'bg-teal-50 text-teal-700 border-teal-100',
  'bg-orange-50 text-orange-700 border-orange-100',
  'bg-pink-50 text-pink-700 border-pink-100',
];

function StatusIcon({ status }) {
  if (status === 'APPROVED') return <CheckCircle className="w-3.5 h-3.5" />;
  if (status === 'PENDING') return <Clock className="w-3.5 h-3.5" />;
  return <XCircle className="w-3.5 h-3.5" />;
}

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
        <div className="spinner" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-700 mb-3">Job not found</h2>
        <p className="text-slate-500 mb-6">This job may have been removed or never existed.</p>
        <Link to="/jobs" className="btn-primary px-6 py-3 rounded-xl">← Back to Jobs</Link>
      </div>
    );
  }

  const canApply = user?.role === 'SEEKER' && job.status === 'APPROVED';
  const companyInitial = (job.company || '?')[0].toUpperCase();
  const companyColor = `hsl(${(job.company?.charCodeAt(0) || 200) * 3 % 360}, 60%, 50%)`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Back link */}
      <Link
        to="/jobs"
        className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 text-sm font-semibold mb-6 transition-colors"
      >
        ← Back to Jobs
      </Link>

      {/* Hero header card */}
      <div className="card overflow-visible mb-6 animate-fade-in-up">
        {/* Gradient top bar */}
        <div className="h-2" style={{ background: 'linear-gradient(90deg, #6366f1, #0d9488)' }} />

        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
            <div className="flex items-start gap-4">
              {/* Company avatar */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl shrink-0 shadow-lg"
                style={{ background: companyColor }}
              >
                {companyInitial}
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">{job.title}</h1>
                <p className="text-indigo-600 font-bold text-lg mt-0.5">{job.company}</p>

                <div className="flex flex-wrap gap-3 mt-3 text-sm text-slate-500">
                  {job.location && (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 font-medium">
                      <MapPin className="w-3.5 h-3.5" /> {job.location}
                    </span>
                  )}
                  {job.salary && (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 font-medium">
                      <IndianRupee className="w-3.5 h-3.5" /> {job.salary}
                    </span>
                  )}
                  {job.status && (
                    <span
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold text-xs ${
                        job.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-700'
                          : job.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      <StatusIcon status={job.status} /> {job.status}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Apply button */}
            {canApply && (
              <div className="sm:shrink-0">
                {applied ? (
                  <div className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-50 border-2 border-emerald-200 text-emerald-700 font-bold">
                    <CheckCircle className="w-4 h-4" /> Applied!
                  </div>
                ) : (
                  <div>
                    <button
                      type="button"
                      className="btn-primary px-8 py-3.5 rounded-xl text-base animate-pulse-glow"
                      onClick={handleApply}
                      disabled={applying}
                    >
                      {applying ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Applying…
                        </span>
                      ) : (
                        'Apply Now →'
                      )}
                    </button>
                    {error && (
                      <p className="text-red-600 text-sm mt-2 text-center">{error}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {!user && (
              <Link to="/login" className="btn-primary px-6 py-3 rounded-xl sm:shrink-0">
                Sign in to Apply →
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {job.description && (
            <div className="card p-6 sm:p-8">
              <h2 className="font-black text-slate-800 text-xl mb-4 flex items-center gap-2">
                <span className="w-1 h-6 rounded-full inline-block" style={{ background: 'linear-gradient(180deg, #6366f1, #0d9488)' }} />
                Job Description
              </h2>
              <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">{job.description}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Skills */}
          {job.skills?.length > 0 && (
            <div className="card p-6">
              <h2 className="font-black text-slate-800 text-lg mb-4 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full inline-block" style={{ background: 'linear-gradient(180deg, #6366f1, #0d9488)' }} />
                Required Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((s, i) => (
                  <span
                    key={s}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${SKILL_COLORS[i % SKILL_COLORS.length]}`}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Job info */}
          <div className="card p-6">
            <h2 className="font-black text-slate-800 text-lg mb-4 flex items-center gap-2">
              <span className="w-1 h-5 rounded-full inline-block" style={{ background: 'linear-gradient(180deg, #6366f1, #0d9488)' }} />
              Job Details
            </h2>
            <div className="space-y-3">
              {job.company && (
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Company</p>
                    <p className="text-slate-700 font-semibold">{job.company}</p>
                  </div>
                </div>
              )}
              {job.location && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Location</p>
                    <p className="text-slate-700 font-semibold">{job.location}</p>
                  </div>
                </div>
              )}
              {job.salary && (
                <div className="flex items-center gap-3">
                  <IndianRupee className="w-5 h-5 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Salary</p>
                    <p className="text-slate-700 font-semibold">{job.salary}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
