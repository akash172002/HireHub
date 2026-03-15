import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { Mail, Star, XCircle, ClipboardList, Users, Trophy, FileText, Inbox, Sparkles } from 'lucide-react';

const STATUS_OPTIONS = ['Applied', 'Shortlisted', 'Rejected'];

const STATUS_CONFIG = {
  Applied: { badge: 'badge-orange', Icon: Mail },
  Shortlisted: { badge: 'badge-blue', Icon: Star },
  Rejected: { badge: 'badge-red', Icon: XCircle },
};

function MatchBar({ score }) {
  const color =
    score >= 75
      ? 'from-emerald-400 to-teal-500'
      : score >= 50
      ? 'from-indigo-400 to-violet-500'
      : 'from-orange-400 to-red-400';
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs font-black text-slate-700 w-8 text-right">{score}%</span>
    </div>
  );
}

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
        <div className="spinner" />
      </div>
    );
  }

  const shortlisted = applications.filter((a) => a.status === 'Shortlisted').length;
  const avgScore =
    applications.filter((a) => a.matchScore != null).length > 0
      ? Math.round(
          applications
            .filter((a) => a.matchScore != null)
            .reduce((sum, a) => sum + a.matchScore, 0) /
            applications.filter((a) => a.matchScore != null).length
        )
      : null;

  const summaryStats = [
    { label: 'Total Applicants', value: applications.length, Icon: Users, color: 'from-indigo-500 to-violet-600' },
    { label: 'Shortlisted', value: shortlisted, Icon: Star, color: 'from-teal-400 to-emerald-500' },
    {
      label: 'Avg. Match Score',
      value: avgScore != null ? `${avgScore}%` : 'N/A',
      Icon: Sparkles,
      color: 'from-orange-400 to-rose-500',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link
        to="/recruiter/jobs"
        className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 text-sm font-semibold mb-6 transition-colors"
      >
        ← Back to My Jobs
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          Applications <span className="gradient-text">Overview</span>
        </h1>
        {jobTitle && (
          <p className="text-slate-500 mt-1 font-medium flex items-center gap-1.5">
            <ClipboardList className="w-4 h-4" /> {jobTitle}
          </p>
        )}
      </div>

      {applications.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {summaryStats.map((s) => (
            <div key={s.label} className="card p-4 sm:p-5 text-center group hover:-translate-y-1 transition-all duration-200">
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}
              >
                <s.Icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-black text-slate-800">{s.value}</p>
              <p className="text-slate-500 text-xs sm:text-sm font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {applications.length === 0 ? (
        <div className="card p-16 text-center animate-fade-in-up">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Inbox className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">No applications yet</h3>
          <p className="text-slate-500">Candidates haven't applied to this job yet.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {applications
            .slice()
            .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
            .map((app, idx) => {
              const cfg = STATUS_CONFIG[app.status] || { badge: 'badge-blue', Icon: Mail };
              const initial = ((app.userId?.name || app.userId?.email || '?')[0]).toUpperCase();
              return (
                <li
                  key={app._id}
                  className="card group hover:border-indigo-200 hover:-translate-y-0.5 transition-all duration-200 animate-fade-in-up"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      {/* Candidate info */}
                      <div className="flex items-start gap-4">
                        {app.userId?.profilePhoto ? (
                          <img
                            src={app.userId.profilePhoto}
                            alt=""
                            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-100 shrink-0"
                          />
                        ) : (
                          <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shrink-0 shadow-md"
                            style={{ background: 'linear-gradient(135deg, #6366f1, #0d9488)' }}
                          >
                            {initial}
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center flex-wrap gap-2 mb-0.5">
                            <p className="font-bold text-slate-800 text-lg">
                              {app.userId?.name || 'Anonymous'}
                            </p>
                            {app.recommended && (
                              <span className="badge badge-green flex items-center gap-1">
                                <Star className="w-3 h-3" /> Recommended
                              </span>
                            )}
                            {idx === 0 && app.matchScore != null && (
                              <span className="badge badge-purple flex items-center gap-1">
                                <Trophy className="w-3 h-3" /> Top Match
                              </span>
                            )}
                          </div>
                          <p className="text-slate-500 text-sm">{app.userId?.email}</p>

                          {app.matchScore != null && (
                            <div className="mt-2 max-w-48">
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Match Score</p>
                              <MatchBar score={app.matchScore} />
                            </div>
                          )}

                          {app.userId?.resume && (
                            <a
                              href={app.userId.resume}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold text-teal-600 hover:text-teal-700 transition-colors"
                            >
                              <FileText className="w-3.5 h-3.5" /> View Resume →
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Status selector */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className={`${cfg.badge} badge flex items-center gap-1`}>
                          <cfg.Icon className="w-3 h-3" /> {app.status}
                        </span>
                        <select
                          value={app.status}
                          onChange={(e) => updateStatus(app._id, e.target.value)}
                          disabled={updating === app._id}
                          className="input w-auto py-1.5 text-sm font-semibold min-w-[140px]"
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        {updating === app._id && (
                          <span className="text-indigo-500 text-xs flex items-center gap-1">
                            <span className="w-3 h-3 border-2 border-indigo-400/30 border-t-indigo-500 rounded-full animate-spin" />
                            Updating…
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
}
