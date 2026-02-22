import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [company, setCompany] = useState('');

  const limit = 10;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page, limit });
        if (search) params.set('search', search);
        if (location) params.set('location', location);
        if (company) params.set('company', company);
        const { data } = await api.get(`/jobs?${params}`);
        setJobs(data.jobs);
        setTotal(data.total);
        setPages(data.pages);
      } catch {
        setJobs([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [page, search, location, company]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6">Browse jobs</h1>
      <form onSubmit={handleSearch} className="card p-4 mb-6 flex flex-col sm:flex-row gap-3 flex-wrap">
        <input
          type="text"
          className="input flex-1 min-w-[180px]"
          placeholder="Search title or description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="text"
          className="input w-full sm:w-40"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          type="text"
          className="input w-full sm:w-40"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <button type="submit" className="btn-primary">Search</button>
      </form>
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin w-10 h-10 border-2 border-teal-500 border-t-transparent rounded-full" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="card p-12 text-center text-slate-600">No jobs found. Try different filters.</div>
      ) : (
        <>
          <p className="text-slate-600 text-sm mb-4">{total} job{total !== 1 ? 's' : ''} found</p>
          <ul className="space-y-4">
            {jobs.map((job) => (
              <li key={job._id}>
                <Link
                  to={`/jobs/${job._id}`}
                  className="card p-5 sm:p-6 block hover:border-teal-300 hover:shadow-md transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h2 className="font-semibold text-slate-800 text-lg">{job.title}</h2>
                      <p className="text-teal-600 font-medium">{job.company}</p>
                      <div className="flex flex-wrap gap-2 mt-2 text-sm text-slate-600">
                        {job.location && <span>{job.location}</span>}
                        {job.salary && <span>• {job.salary}</span>}
                      </div>
                      {job.skills?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {job.skills.slice(0, 4).map((s) => (
                            <span key={s} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-teal-600 font-medium text-sm sm:self-center">View →</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                type="button"
                className="btn-secondary rounded-lg"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>
              <span className="flex items-center px-4 text-slate-600">
                Page {page} of {pages}
              </span>
              <button
                type="button"
                className="btn-secondary rounded-lg"
                disabled={page >= pages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
