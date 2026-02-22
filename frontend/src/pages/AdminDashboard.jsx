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
        <div className="animate-spin w-10 h-10 border-2 border-teal-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const maxJobs = Math.max(1, ...jobsChart.map((d) => d.jobs));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-8">Admin dashboard</h1>

      {/* Counts */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="card p-5">
          <p className="text-slate-600 text-sm">Total jobs</p>
          <p className="text-2xl font-bold text-slate-800">{counts?.totalJobs ?? 0}</p>
        </div>
        <div className="card p-5">
          <p className="text-slate-600 text-sm">Approved</p>
          <p className="text-2xl font-bold text-teal-600">{counts?.approvedJobs ?? 0}</p>
        </div>
        <div className="card p-5">
          <p className="text-slate-600 text-sm">Rejected</p>
          <p className="text-2xl font-bold text-red-600">{counts?.rejectedJobs ?? 0}</p>
        </div>
        <div className="card p-5">
          <p className="text-slate-600 text-sm">Companies</p>
          <p className="text-2xl font-bold text-slate-800">{counts?.totalCompanies ?? 0}</p>
        </div>
        <div className="card p-5">
          <p className="text-slate-600 text-sm">Recruiters</p>
          <p className="text-2xl font-bold text-slate-800">{counts?.totalRecruiters ?? 0}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card p-6">
          <h2 className="font-semibold text-slate-800 mb-4">Jobs posted by month</h2>
          <div className="flex items-end gap-1 h-40">
            {jobsChart.map((d) => (
              <div key={d._id} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-teal-500 rounded-t min-h-[4px] transition-all"
                  style={{ height: `${(d.jobs / maxJobs) * 100}%` }}
                />
                <span className="text-xs text-slate-500">{MONTHS[d._id]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-6">
          <h2 className="font-semibold text-slate-800 mb-4">Jobs by status</h2>
          <div className="space-y-2">
            {approvalChart.map((d) => (
              <div key={d._id} className="flex items-center justify-between">
                <span className="text-slate-600">{d._id}</span>
                <span className="font-semibold text-slate-800">{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending jobs */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center gap-3">
          <h2 className="font-semibold text-slate-800">Job approvals</h2>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setJobsPage(1); }}
            className="input w-auto py-1.5 text-sm"
          >
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
        {jobs.length === 0 ? (
          <div className="p-12 text-center text-slate-600">No jobs in this category.</div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {jobs.map((job) => (
              <li key={job._id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-800">{job.title}</p>
                  <p className="text-teal-600 text-sm">{job.company}</p>
                  <p className="text-slate-500 text-xs">{job.postedBy?.email}</p>
                </div>
                {job.status === 'PENDING' && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="btn-primary text-sm py-1.5 px-3 rounded-lg"
                      disabled={updating === job._id}
                      onClick={() => updateJobStatus(job._id, 'APPROVED')}
                    >
                      {updating === job._id ? '…' : 'Approve'}
                    </button>
                    <button
                      type="button"
                      className="btn-secondary text-sm py-1.5 px-3 rounded-lg"
                      disabled={updating === job._id}
                      onClick={() => updateJobStatus(job._id, 'REJECTED')}
                    >
                      Reject
                    </button>
                  </div>
                )}
                {job.status !== 'PENDING' && (
                  <span className={`px-2 py-0.5 rounded text-sm ${job.status === 'APPROVED' ? 'bg-teal-100 text-teal-800' : 'bg-red-100 text-red-800'}`}>
                    {job.status}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
        {jobsTotal > 8 && (
          <div className="p-3 border-t border-slate-100 flex justify-center gap-2">
            <button
              type="button"
              className="btn-ghost text-sm"
              disabled={jobsPage <= 1}
              onClick={() => setJobsPage((p) => p - 1)}
            >
              Previous
            </button>
            <span className="text-slate-600 text-sm">Page {jobsPage}</span>
            <button
              type="button"
              className="btn-ghost text-sm"
              disabled={jobsPage >= Math.ceil(jobsTotal / 8)}
              onClick={() => setJobsPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
