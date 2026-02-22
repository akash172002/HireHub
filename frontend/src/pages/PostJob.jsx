import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

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

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Post a job</h1>
      <div className="card p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Job title *</label>
            <input type="text" name="title" className="input" value={form.title} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Company *</label>
            <input type="text" name="company" className="input" value={form.company} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea name="description" className="input min-h-[120px]" value={form.description} onChange={handleChange} rows={4} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
              <input type="text" name="location" className="input" value={form.location} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Salary</label>
              <input type="text" name="salary" className="input" value={form.salary} onChange={handleChange} placeholder="e.g. $80k-120k" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Skills (comma-separated)</label>
            <input type="text" name="skills" className="input" value={form.skills} onChange={handleChange} placeholder="React, Node.js" />
          </div>
          <button type="submit" className="btn-primary rounded-xl" disabled={loading}>
            {loading ? 'Posting…' : 'Post job'}
          </button>
        </form>
      </div>
    </div>
  );
}
