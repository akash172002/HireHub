import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const SKILL_COLORS = [
  'bg-indigo-50 text-indigo-700 border-indigo-100',
  'bg-violet-50 text-violet-700 border-violet-100',
  'bg-teal-50 text-teal-700 border-teal-100',
  'bg-orange-50 text-orange-700 border-orange-100',
  'bg-pink-50 text-pink-700 border-pink-100',
];

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
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          Browse <span className="gradient-text">Jobs</span>
        </h1>
        <p className="text-slate-500 mt-1">Discover opportunities that match your skills</p>
      </div>

      {/* Search bar */}
      <form
        onSubmit={handleSearch}
        className="card p-4 sm:p-5 mb-8 flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">🔍</span>
          <input
            type="text"
            className="input pl-10"
            placeholder="Search title, skills, or keywords…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="relative sm:w-44">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">📍</span>
          <input
            type="text"
            className="input pl-10"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="relative sm:w-44">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🏢</span>
          <input
            type="text"
            className="input pl-10"
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-primary sm:shrink-0">
          Search
        </button>
      </form>

      {/* Results */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="spinner" />
          <p className="text-slate-400 text-sm">Loading jobs…</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="text-5xl mb-4">🔎</div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">No jobs found</h3>
          <p className="text-slate-500">Try adjusting your search filters.</p>
        </div>
      ) : (
        <>
          <p className="text-slate-500 text-sm mb-5 font-medium">
            <span className="font-black text-slate-800">{total}</span> job{total !== 1 ? 's' : ''} found
          </p>

          <ul className="space-y-4">
            {jobs.map((job, idx) => (
              <li key={job._id} style={{ animationDelay: `${idx * 40}ms` }} className="animate-fade-in-up">
                <Link
                  to={`/jobs/${job._id}`}
                  className="card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 group hover:border-indigo-200 hover:-translate-y-0.5 transition-all duration-200 block relative overflow-hidden"
                >
                  {/* Left accent bar */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ background: 'linear-gradient(180deg, #6366f1, #0d9488)' }}
                  />

                  <div className="pl-1">
                    {/* Company initial avatar */}
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0 shadow-sm"
                        style={{
                          background: `hsl(${(job.company?.charCodeAt(0) || 200) * 3 % 360}, 60%, 50%)`,
                        }}
                      >
                        {(job.company || '?')[0].toUpperCase()}
                      </div>
                      <div>
                        <h2 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-indigo-700 transition-colors">
                          {job.title}
                        </h2>
                        <p className="text-indigo-600 font-semibold text-sm">{job.company}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 mb-2 ml-13">
                      {job.location && (
                        <span className="flex items-center gap-1">
                          <span>📍</span> {job.location}
                        </span>
                      )}
                      {job.salary && (
                        <span className="flex items-center gap-1">
                          <span>💰</span> {job.salary}
                        </span>
                      )}
                    </div>

                    {job.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {job.skills.slice(0, 5).map((s, i) => (
                          <span
                            key={s}
                            className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${SKILL_COLORS[i % SKILL_COLORS.length]}`}
                          >
                            {s}
                          </span>
                        ))}
                        {job.skills.length > 5 && (
                          <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold border bg-slate-50 text-slate-500 border-slate-100">
                            +{job.skills.length - 5} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="sm:shrink-0 flex items-center gap-2">
                    <span
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-bold text-indigo-600 border border-indigo-100 bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all duration-200"
                    >
                      View Job →
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-10">
              <button
                type="button"
                className="btn-secondary px-4 py-2 rounded-xl text-sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                ← Previous
              </button>

              <div className="flex gap-1">
                {Array.from({ length: Math.min(pages, 5) }, (_, i) => {
                  const p = page <= 3 ? i + 1 : page - 2 + i;
                  if (p < 1 || p > pages) return null;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${
                        p === page
                          ? 'text-white shadow-md'
                          : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
                      }`}
                      style={p === page ? { background: 'linear-gradient(135deg, #6366f1, #0d9488)' } : {}}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                className="btn-secondary px-4 py-2 rounded-xl text-sm"
                disabled={page >= pages}
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
