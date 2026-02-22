import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const STATUS_STYLE = { PENDING: 'bg-amber-100 text-amber-800', APPROVED: 'bg-teal-100 text-teal-800', REJECTED: 'bg-red-100 text-red-800' };

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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-800">My jobs</h1>
        <Link to="/recruiter/post" className="btn-primary rounded-xl">Post new job</Link>
      </div>
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin w-10 h-10 border-2 border-teal-500 border-t-transparent rounded-full" />
        </div>
      ) : data.jobs.length === 0 ? (
        <div className="card p-12 text-center text-slate-600">
          <p>You haven't posted any jobs yet.</p>
          <Link to="/recruiter/post" className="link mt-4 inline-block">Post a job</Link>
        </div>
      ) : (
        <>
          <ul className="space-y-4">
            {data.jobs.map((job) => (
              <li key={job._id} className="card p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-slate-800">{job.title}</h2>
                  <p className="text-teal-600 text-sm">{job.company}</p>
                  <span className={`inline-block mt-2 px-2 py-0.5 rounded text-sm font-medium ${STATUS_STYLE[job.status] || ''}`}>
                    {job.status}
                  </span>
                </div>
                <Link to={`/recruiter/jobs/${job._id}/applications`} className="btn-secondary text-sm rounded-lg">
                  View applications
                </Link>
              </li>
            ))}
          </ul>
          {data.pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button type="button" className="btn-secondary rounded-lg" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
              <span className="flex items-center px-4 text-slate-600">Page {page} of {data.pages}</span>
              <button type="button" className="btn-secondary rounded-lg" disabled={page >= data.pages} onClick={() => setPage((p) => p + 1)}>Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
