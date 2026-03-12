import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const STATUS_CONFIG = {
  Applied: {
    badge: 'badge-orange',
    icon: '📬',
    label: 'Applied',
    bar: 'bg-orange-400',
    step: 1,
  },
  Shortlisted: {
    badge: 'badge-blue',
    icon: '⭐',
    label: 'Shortlisted',
    bar: 'bg-indigo-500',
    step: 2,
  },
  Rejected: {
    badge: 'badge-red',
    icon: '❌',
    label: 'Rejected',
    bar: 'bg-red-400',
    step: 0,
  },
};

function MatchBar({ score }) {
  const color =
    score >= 75
      ? 'from-emerald-400 to-teal-500'
      : score >= 50
      ? 'from-indigo-400 to-violet-500'
      : 'from-orange-400 to-red-400';

  return (
    <div className="flex items-center gap-3 mt-2">
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-1000`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-sm font-bold text-slate-700 shrink-0 w-10 text-right">{score}%</span>
    </div>
  );
}

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
        <div className="spinner" />
      </div>
    );
  }

  const statusCounts = list.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          My <span className="gradient-text">Applications</span>
        </h1>
        <p className="text-slate-500 mt-1">Track all your job applications in one place</p>
      </div>

      {list.length === 0 ? (
        <div className="card p-16 text-center animate-fade-in-up">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">No applications yet</h3>
          <p className="text-slate-500 mb-6">Start applying to jobs and track your progress here.</p>
          <Link to="/jobs" className="btn-primary px-6 py-3 rounded-xl">
            Browse Jobs →
          </Link>
        </div>
      ) : (
        <>
          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Total Applied', value: list.length, icon: '📬', color: 'from-indigo-500 to-violet-600' },
              { label: 'Shortlisted', value: statusCounts['Shortlisted'] || 0, icon: '⭐', color: 'from-teal-400 to-cyan-500' },
              { label: 'Rejected', value: statusCounts['Rejected'] || 0, icon: '❌', color: 'from-red-400 to-rose-500' },
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

          {/* Applications list */}
          <ul className="space-y-4">
            {list.map((app, idx) => {
              const cfg = STATUS_CONFIG[app.status] || { badge: 'badge-blue', icon: '📄', label: app.status };
              return (
                <li
                  key={app._id}
                  className="card group hover:border-indigo-200 hover:-translate-y-0.5 transition-all duration-200 animate-fade-in-up"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <Link
                            to={`/jobs/${app.jobId?._id}`}
                            className="font-bold text-slate-800 text-lg hover:text-indigo-600 transition-colors"
                          >
                            {app.jobId?.title}
                          </Link>
                          {app.recommended && (
                            <span className="badge badge-green flex items-center gap-1">
                              ⭐ Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-indigo-600 font-semibold text-sm">{app.jobId?.company}</p>

                        {app.matchScore != null && (
                          <div className="mt-3">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Match Score</p>
                            <MatchBar score={app.matchScore} />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                        <span className={`${cfg.badge} badge flex items-center gap-1`}>
                          {cfg.icon} {cfg.label}
                        </span>
                      </div>
                    </div>

                    {/* Progress tracker */}
                    {app.status !== 'Rejected' && (
                      <div className="mt-4 pt-4 border-t border-slate-50">
                        <div className="flex items-center gap-0">
                          {['Applied', 'Under Review', 'Shortlisted', 'Hired'].map((step, i) => {
                            const active = (cfg.step || 1) > i;
                            const current = (cfg.step || 1) === i + 1;
                            return (
                              <div key={step} className="flex items-center flex-1">
                                <div className={`flex flex-col items-center ${i < 3 ? 'flex-1' : ''}`}>
                                  <div
                                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                                      active || current
                                        ? 'bg-indigo-500 ring-2 ring-indigo-200'
                                        : 'bg-slate-200'
                                    }`}
                                  />
                                  <span className="text-[10px] text-slate-400 mt-1 font-medium hidden sm:block">{step}</span>
                                </div>
                                {i < 3 && (
                                  <div
                                    className={`flex-1 h-0.5 mx-1 rounded transition-all ${active ? 'bg-indigo-400' : 'bg-slate-100'}`}
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
