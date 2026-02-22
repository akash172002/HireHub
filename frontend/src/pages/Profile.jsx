import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ name: '', bio: '', skills: '' });
  const [photoFile, setPhotoFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/users/me');
        setProfile(data);
        setForm({
          name: data.name || '',
          bio: data.bio || '',
          skills: Array.isArray(data.skills) ? data.skills.join(', ') : '',
        });
      } catch {
        setProfile({});
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('bio', form.bio);
    fd.append('skills', form.skills);
    if (photoFile) fd.append('photo', photoFile);
    if (resumeFile) fd.append('resume', resumeFile);
    try {
      const { data } = await api.put('/users/me', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProfile(data);
      updateUser(data);
      setMessage('Profile updated.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-2 border-teal-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Profile</h1>
      <div className="card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {profile?.profilePhoto && (
            <img
              src={profile.profilePhoto}
              alt="Profile"
              className="w-24 h-24 rounded-xl object-cover border border-slate-200"
            />
          )}
          <div className="flex-1 w-full">
            <form onSubmit={handleSubmit} className="space-y-4">
              {message && (
                <div className={`p-3 rounded-xl text-sm ${message.includes('failed') ? 'bg-red-50 text-red-700' : 'bg-teal-50 text-teal-800'}`}>
                  {message}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input
                  type="text"
                  className="input"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                <textarea
                  className="input min-h-[100px]"
                  value={form.bio}
                  onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Skills (comma-separated)</label>
                <input
                  type="text"
                  className="input"
                  value={form.skills}
                  onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))}
                  placeholder="React, Node.js, Python"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Profile photo</label>
                <input
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-teal-50 file:text-teal-700"
                  onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                />
              </div>
              {user?.role === 'SEEKER' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Resume (PDF)</label>
                  {profile?.resume && (
                    <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="link text-sm block mb-1">
                      Current resume
                    </a>
                  )}
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-teal-50 file:text-teal-700"
                    onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                  />
                </div>
              )}
              <button type="submit" className="btn-primary rounded-xl" disabled={saving}>
                {saving ? 'Saving…' : 'Save profile'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
