import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const STATUS_CONFIG = {
  PENDING: { badge: 'badge-orange', icon: '⏳', label: 'Pending Review' },
  APPROVED: { badge: 'badge-green', icon: '✅', label: 'Approved' },
  REJECTED: { badge: 'badge-red', icon: '❌', label: 'Rejected' },
};

export default function RecruiterJobs() {
  const [data, setData] = useState({ jobs: [], total: 0, pages: 0 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data: res } = await api.get(`/jobs/my?page=${page}&limit=10`);
        setData(res);
      } catch {
        setData({ jobs: [], total: 0, pages: 0 });
      } finally {
        setLoading(false);
      }
    })();
  }, [page]);

  const approved = data.jobs.filter((j) => j.status === 'APPROVED').length;
  const pending = data.jobs.filter((j) => j.status === 'PENDING').length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
            My <span className="gradient-text">Jobs</span>
          </h1>
          <p className="text-slate-500 mt-1">Manage your job postings</p>
        </div>
        <Link to="/recruiter/post" className="btn-primary rounded-xl px-6 py-3 shrink-0">
          + Post New Job
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="spinner" />
          <p className="text-slate-400 text-sm">Loading your jobs…</p>
        </div>
      ) : data.jobs.length === 0 ? (
        <div className="card p-16 text-center animate-fade-in-up">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">No jobs posted yet</h3>
          <p className="text-slate-500 mb-6">Create your first job listing to start finding talent.</p>
          <Link to="/recruiter/post" className="btn-primary px-6 py-3 rounded-xl">
            Post Your First Job →
          </Link>
        </div>
      ) : (
        <>
          {/* Stats summary */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Total Jobs', value: data.total, icon: '📋', color: 'from-indigo-500 to-violet-600' },
              { label: 'Approved', value: approved, icon: '✅', color: 'from-teal-400 to-emerald-500' },
              { label: 'Pending', value: pending, icon: '⏳', color: 'from-orange-400 to-amber-500' },
            ].map((s) => (
              <div key={s.label} className="card p-4 sm:p-5 text-center group hover:-translate-y-1 transition-all duration-200">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-lg mx-auto mb-2 group-hover:scale-110 transition-transform`}
                >
                  {s.icon}
                </div>
                <p className="text-2xl font-black text-slate-800">{s.value}</p>
                <p className="text-slate-500 text-xs sm:text-sm font-medium">{s.label}</p>
              </div>
            ))}
          </div>

          <ul className="space-y-4">
            {data.jobs.map((job, idx) => {
              const cfg = STATUS_CONFIG[job.status] || { badge: 'badge-blue', icon: '📄', label: job.status };
              const companyColor = `hsl(${(job.company?.charCodeAt(0) || 200) * 3 % 360}, 60%, 50%)`;
              return (
                <li
                  key={job._id}
                  className="card group hover:border-indigo-200 hover:-translate-y-0.5 transition-all duration-200 animate-fade-in-up"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg shrink-0 shadow-sm"
                        style={{ background: companyColor }}
                      >
                        {(job.company || '?')[0].toUpperCase()}
                      </div>
                      <div>
                        <h2 className="font-bold text-slate-800 text-lg group-hover:text-indigo-700 transition-colors">
                          {job.title}
                        </h2>
                        <p className="text-indigo-600 font-semibold text-sm">{job.company}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className={`${cfg.badge} badge flex items-center gap-1`}>
                            {cfg.icon} {cfg.label}
                          </span>
                          {job.location && (
                            <span className="text-slate-400 text-xs">📍 {job.location}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <Link
                      to={`/recruiter/jobs/${job._id}/applications`}
                      className="btn-secondary text-sm px-4 py-2 rounded-xl shrink-0 flex items-center gap-1.5"
                    >
                      👥 View Applications
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>

          {data.pages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-10">
              <button
                type="button"
                className="btn-secondary px-4 py-2 rounded-xl text-sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                ← Previous
              </button>
              <span className="text-slate-600 text-sm font-semibold">
                Page {page} of {data.pages}
              </span>
              <button
                type="button"
                className="btn-secondary px-4 py-2 rounded-xl text-sm"
                disabled={page >= data.pages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
