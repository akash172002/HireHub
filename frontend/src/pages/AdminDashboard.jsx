import { useState, useEffect } from 'react';
import api from '../api/axios';

const MONTHS = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function AdminDashboard() {
  const [counts, setCounts] = useState(null);
  const [jobsChart, setJobsChart] = useState([]);
  const [approvalChart, setApprovalChart] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [jobsPage, setJobsPage] = useState(1);
  const [jobsTotal, setJobsTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [countsRes, jobsChartRes, approvalRes] = await Promise.all([
          api.get('/admin/dashboard/counts'),
          api.get('/admin/dashboard/jobs-chart'),
          api.get('/admin/dashboard/approval-chart'),
        ]);
        setCounts(countsRes.data);
        setJobsChart(jobsChartRes.data);
        setApprovalChart(approvalRes.data);
      } catch {
        setCounts({});
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/admin/jobs?page=${jobsPage}&limit=8&status=${statusFilter}`);
        setJobs(data.jobs);
        setJobsTotal(data.total);
      } catch {
        setJobs([]);
      }
    })();
  }, [jobsPage, statusFilter]);

  const updateJobStatus = async (jobId, status) => {
    setUpdating(jobId);
    try {
      await api.put(`/admin/job/${jobId}/status`, { status });
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
      if (counts) {
        setCounts((c) => ({
          ...c,
          totalJobs: c.totalJobs - 1,
          approvedJobs: status === 'APPROVED' ? c.approvedJobs + 1 : c.approvedJobs,
          rejectedJobs: status === 'REJECTED' ? c.rejectedJobs + 1 : c.rejectedJobs,
        }));
      }
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

  const maxJobs = Math.max(1, ...jobsChart.map((d) => d.jobs));

  const approvalColors = {
    APPROVED: 'bg-gradient-to-r from-teal-400 to-emerald-500',
    PENDING: 'bg-gradient-to-r from-orange-400 to-amber-400',
    REJECTED: 'bg-gradient-to-r from-red-400 to-rose-500',
  };

  const statCards = [
    { label: 'Total Jobs', value: counts?.totalJobs ?? 0, icon: '📋', gradient: 'from-indigo-500 to-violet-600', change: 'All time' },
    { label: 'Approved', value: counts?.approvedJobs ?? 0, icon: '✅', gradient: 'from-teal-400 to-emerald-500', change: 'Live jobs' },
    { label: 'Rejected', value: counts?.rejectedJobs ?? 0, icon: '❌', gradient: 'from-red-400 to-rose-500', change: 'Declined' },
    { label: 'Companies', value: counts?.totalCompanies ?? 0, icon: '🏢', gradient: 'from-orange-400 to-amber-500', change: 'Hiring' },
    { label: 'Recruiters', value: counts?.totalRecruiters ?? 0, icon: '👔', gradient: 'from-violet-500 to-purple-600', change: 'Active' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          Admin <span className="gradient-text">Dashboard</span>
        </h1>
        <p className="text-slate-500 mt-1">Manage jobs, users, and platform activity</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {statCards.map((s, i) => (
          <div
            key={s.label}
            className="card p-5 group hover:-translate-y-1 transition-all duration-200 animate-fade-in-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div
              className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform shadow-md`}
            >
              {s.icon}
            </div>
            <p className="text-2xl font-black text-slate-800">{s.value}</p>
            <p className="text-slate-500 text-sm font-semibold">{s.label}</p>
            <p className="text-slate-400 text-xs mt-0.5">{s.change}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Bar chart – jobs by month */}
        <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-black text-slate-800 text-lg">Jobs Posted by Month</h2>
              <p className="text-slate-400 text-sm">Monthly posting activity</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-xl">📊</div>
          </div>
          {jobsChart.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-slate-400 text-sm">No data available</div>
          ) : (
            <div className="flex items-end gap-1.5 h-40">
              {jobsChart.map((d, i) => (
                <div key={d._id} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-500">{d.jobs}</span>
                  <div
                    className="w-full rounded-t-lg min-h-[4px] transition-all duration-700 hover:opacity-80 cursor-default"
                    style={{
                      height: `${(d.jobs / maxJobs) * 100}%`,
                      background: `linear-gradient(180deg, #818cf8 0%, #6366f1 100%)`,
                      animationDelay: `${i * 50}ms`,
                    }}
                    title={`${MONTHS[d._id]}: ${d.jobs} jobs`}
                  />
                  <span className="text-xs text-slate-400 font-medium">{MONTHS[d._id]}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Approval status chart */}
        <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-black text-slate-800 text-lg">Jobs by Status</h2>
              <p className="text-slate-400 text-sm">Approval breakdown</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-xl">🥧</div>
          </div>

          {approvalChart.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-slate-400 text-sm">No data available</div>
          ) : (
            <div className="space-y-4">
              {approvalChart.map((d) => {
                const total = approvalChart.reduce((sum, x) => sum + x.count, 0);
                const pct = total > 0 ? Math.round((d.count / total) * 100) : 0;
                return (
                  <div key={d._id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-700">{d._id}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500">{d.count} jobs</span>
                        <span className="text-sm font-black text-slate-800">{pct}%</span>
                      </div>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${approvalColors[d._id] || 'bg-slate-400'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Job approval section */}
      <div className="card animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="font-black text-slate-800 text-lg">Job Approvals</h2>
            <p className="text-slate-400 text-sm">Review and approve job postings</p>
          </div>
          <div className="flex items-center gap-2">
            {['PENDING', 'APPROVED', 'REJECTED'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => { setStatusFilter(s); setJobsPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === s
                    ? 'text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                style={statusFilter === s ? { background: 'linear-gradient(135deg, #6366f1, #0d9488)' } : {}}
              >
                {s === 'PENDING' ? '⏳' : s === 'APPROVED' ? '✅' : '❌'} {s}
              </button>
            ))}
          </div>
        </div>

        {jobs.length === 0 ? (
          <div className="p-16 text-center text-slate-500">
            <div className="text-5xl mb-3">📭</div>
            <p className="font-semibold">No {statusFilter.toLowerCase()} jobs.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-50">
            {jobs.map((job, idx) => (
              <li
                key={job._id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-slate-50/50 transition-colors animate-fade-in-up"
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black shrink-0"
                    style={{ background: `hsl(${(job.company?.charCodeAt(0) || 200) * 3 % 360}, 55%, 50%)` }}
                  >
                    {(job.company || '?')[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{job.title}</p>
                    <p className="text-indigo-600 text-sm font-semibold">{job.company}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{job.postedBy?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {job.status === 'PENDING' ? (
                    <>
                      <button
                        type="button"
                        className="btn-primary text-sm py-2 px-4 rounded-xl"
                        disabled={updating === job._id}
                        onClick={() => updateJobStatus(job._id, 'APPROVED')}
                      >
                        {updating === job._id ? (
                          <span className="flex items-center gap-1">
                            <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                            …
                          </span>
                        ) : (
                          '✅ Approve'
                        )}
                      </button>
                      <button
                        type="button"
                        className="btn-danger text-sm py-2 px-4 rounded-xl"
                        disabled={updating === job._id}
                        onClick={() => updateJobStatus(job._id, 'REJECTED')}
                      >
                        ❌ Reject
                      </button>
                    </>
                  ) : (
                    <span
                      className={`badge ${job.status === 'APPROVED' ? 'badge-green' : 'badge-red'} flex items-center gap-1`}
                    >
                      {job.status === 'APPROVED' ? '✅' : '❌'} {job.status}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {jobsTotal > 8 && (
          <div className="p-4 border-t border-slate-100 flex justify-center items-center gap-3">
            <button
              type="button"
              className="btn-ghost text-sm px-4 py-2"
              disabled={jobsPage <= 1}
              onClick={() => setJobsPage((p) => p - 1)}
            >
              ← Previous
            </button>
            <span className="text-slate-600 text-sm font-semibold">
              Page {jobsPage} of {Math.ceil(jobsTotal / 8)}
            </span>
            <button
              type="button"
              className="btn-ghost text-sm px-4 py-2"
              disabled={jobsPage >= Math.ceil(jobsTotal / 8)}
              onClick={() => setJobsPage((p) => p + 1)}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
