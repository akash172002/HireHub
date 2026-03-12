import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const SKILL_COLORS = [
  'bg-indigo-50 text-indigo-700 border-indigo-100',
  'bg-violet-50 text-violet-700 border-violet-100',
  'bg-teal-50 text-teal-700 border-teal-100',
  'bg-orange-50 text-orange-700 border-orange-100',
  'bg-pink-50 text-pink-700 border-pink-100',
];

export default function PostJob() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    salary: '',
    skills: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const payload = {
      ...form,
      skills: form.skills ? form.skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
    };
    try {
      await api.post('/jobs', payload);
      navigate('/recruiter/jobs');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  const skillsList = form.skills
    ? form.skills.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          Post a <span className="gradient-text">New Job</span>
        </h1>
        <p className="text-slate-500 mt-1">Fill in the details — your job will be reviewed before going live.</p>
      </div>

      <div className="card animate-fade-in-up">
        {/* Gradient top bar */}
        <div className="h-1.5" style={{ background: 'linear-gradient(90deg, #6366f1, #0d9488)' }} />

        <div className="p-6 sm:p-8">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2 mb-6 animate-fade-in">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic info */}
            <div>
              <h3 className="font-black text-slate-700 text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs">1</span>
                Basic Info
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    className="input"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Senior Frontend Developer"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="company"
                    className="input"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Your company name"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100" />

            {/* Details */}
            <div>
              <h3 className="font-black text-slate-700 text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600 text-xs">2</span>
                Job Details
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Description</label>
                <textarea
                  name="description"
                  className="input min-h-[140px] resize-y"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Describe the role, responsibilities, and what you're looking for…"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    📍 Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    className="input"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Remote, New York, London"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    💰 Salary Range
                  </label>
                  <input
                    type="text"
                    name="salary"
                    className="input"
                    value={form.salary}
                    onChange={handleChange}
                    placeholder="e.g. $80k–120k / year"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100" />

            {/* Skills */}
            <div>
              <h3 className="font-black text-slate-700 text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600 text-xs">3</span>
                Required Skills
              </h3>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Skills{' '}
                <span className="font-normal text-slate-400">(comma-separated)</span>
              </label>
              <input
                type="text"
                name="skills"
                className="input"
                value={form.skills}
                onChange={handleChange}
                placeholder="React, Node.js, TypeScript, MongoDB…"
              />
              {skillsList.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {skillsList.map((s, i) => (
                    <span
                      key={s}
                      className={`px-3 py-1 rounded-lg text-sm font-semibold border ${SKILL_COLORS[i % SKILL_COLORS.length]}`}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="pt-2 flex items-center gap-4">
              <button type="submit" className="btn-primary px-8 py-3.5 rounded-xl text-base" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Posting…
                  </span>
                ) : (
                  '📤 Post Job'
                )}
              </button>
              <p className="text-xs text-slate-400">
                Your job will be reviewed by an admin before it appears publicly.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
