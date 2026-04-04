import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  Search, ClipboardList, Settings, CheckCircle,
  AlertTriangle, FileText, Camera, Paperclip, Check,
} from 'lucide-react';

function RoleIcon({ role }) {
  if (role === 'RECRUITER') return <ClipboardList className="w-3 h-3" />;
  if (role === 'ADMIN') return <Settings className="w-3 h-3" />;
  return <Search className="w-3 h-3" />;
}

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ name: '', bio: '', skills: '' });
  const [photoFile, setPhotoFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(false);

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

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0] || null;
    setPhotoFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    }
  };

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
      const { data } = await api.put('/users/me', fd);
      setProfile(data);
      updateUser(data);
      setMessage('success');
      setPhotoFile(null);
      setPhotoPreview(null);
      setResumeFile(null);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  const openResume = async () => {
    setResumeLoading(true);
    try {
      const { data } = await api.get('/users/me/resume');
      window.open(data.url, '_blank');
    } catch {
      setMessage('Could not load resume. Please try again.');
    } finally {
      setResumeLoading(false);
    }
  };

  const displayPhoto = photoPreview || profile?.profilePhoto;
  const initial = ((profile?.name || user?.email || '?')[0]).toUpperCase();
  const skillsList = form.skills
    ? form.skills.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          My <span className="gradient-text">Profile</span>
        </h1>
        <p className="text-slate-500 mt-1">Keep your profile updated for better job matches</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="lg:col-span-1">
          <div className="card p-6 text-center animate-fade-in-up">
            {/* Avatar */}
            <div className="relative inline-block mb-4">
              {displayPhoto ? (
                <img
                  src={displayPhoto}
                  alt="Profile"
                  className="w-28 h-28 rounded-2xl object-cover ring-4 ring-indigo-100 shadow-lg"
                />
              ) : (
                <div
                  className="w-28 h-28 rounded-2xl flex items-center justify-center text-white font-black text-4xl shadow-lg ring-4 ring-indigo-100"
                  style={{ background: 'linear-gradient(135deg, #6366f1 0%, #0d9488 100%)' }}
                >
                  {initial}
                </div>
              )}
              {photoFile && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </div>

            <h2 className="font-black text-slate-800 text-xl">{profile?.name || 'Your Name'}</h2>
            <p className="text-slate-500 text-sm mt-0.5">{user?.email}</p>

            <div
              className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-xs font-bold"
              style={{
                background: user?.role === 'RECRUITER' ? '#eff6ff' : user?.role === 'ADMIN' ? '#fdf4ff' : '#f0fdf4',
                color: user?.role === 'RECRUITER' ? '#1d4ed8' : user?.role === 'ADMIN' ? '#7e22ce' : '#15803d',
              }}
            >
              <RoleIcon role={user?.role} /> {user?.role}
            </div>

            {/* Skills preview */}
            {skillsList.length > 0 && (
              <div className="mt-5 pt-5 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Skills</p>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {skillsList.slice(0, 6).map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100"
                    >
                      {s}
                    </span>
                  ))}
                  {skillsList.length > 6 && (
                    <span className="px-2 py-1 rounded-lg bg-slate-50 text-slate-500 text-xs font-semibold">
                      +{skillsList.length - 6}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Resume link */}
            {profile?.resume && (
              <button
                onClick={openResume}
                disabled={resumeLoading}
                className="mt-5 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-teal-50 text-teal-700 text-sm font-bold border border-teal-100 hover:bg-teal-100 transition-colors disabled:opacity-60"
              >
                {resumeLoading
                  ? <span className="w-4 h-4 border-2 border-teal-300 border-t-teal-700 rounded-full animate-spin" />
                  : <FileText className="w-4 h-4" />}
                {resumeLoading ? 'Loading…' : 'View Resume'}
              </button>
            )}
          </div>
        </div>

        {/* Edit form */}
        <div className="lg:col-span-2">
          <div className="card p-6 sm:p-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <h3 className="font-black text-slate-800 text-lg mb-6 flex items-center gap-2">
              <span className="w-1 h-6 rounded-full" style={{ background: 'linear-gradient(180deg, #6366f1, #0d9488)' }} />
              Edit Profile
            </h3>

            {message === 'success' && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2 mb-5 animate-fade-in">
                <CheckCircle className="w-4 h-4 shrink-0" /> Profile updated successfully!
              </div>
            )}
            {message && message !== 'success' && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2 mb-5 animate-fade-in">
                <AlertTriangle className="w-4 h-4 shrink-0" /> {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  className="input"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Bio</label>
                <textarea
                  className="input min-h-[100px] resize-y"
                  value={form.bio}
                  onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                  rows={3}
                  placeholder="Tell recruiters about yourself…"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Skills{' '}
                  <span className="font-normal text-slate-400">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  className="input"
                  value={form.skills}
                  onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))}
                  placeholder="React, Node.js, Python, TypeScript…"
                />
                {skillsList.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {skillsList.map((s) => (
                      <span key={s} className="skill-tag">{s}</span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Profile Photo</label>
                <div className="flex items-center gap-3">
                  {displayPhoto && (
                    <img src={displayPhoto} alt="" className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                  )}
                  <label className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer transition-all text-sm font-medium text-slate-500 hover:text-indigo-600">
                    <Camera className="w-4 h-4 shrink-0" />
                    {photoFile ? photoFile.name : 'Choose photo'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                  </label>
                </div>
              </div>

              {user?.role === 'SEEKER' && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Resume (PDF)</label>
                  <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-slate-200 hover:border-teal-300 hover:bg-teal-50 cursor-pointer transition-all text-sm font-medium text-slate-500 hover:text-teal-600 w-full">
                    <Paperclip className="w-4 h-4 shrink-0" />
                    {resumeFile ? resumeFile.name : 'Upload new resume (.pdf)'}
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      className="hidden"
                      onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                    />
                  </label>
                  {profile?.resume && !resumeFile && (
                    <button onClick={openResume} className="text-xs link mt-1 inline-block">
                      View current resume →
                    </button>
                  )}
                </div>
              )}

              <div className="pt-2">
                <button type="submit" className="btn-primary px-8 py-3 rounded-xl" disabled={saving}>
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving…
                    </span>
                  ) : (
                    'Save Profile'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </div>
  );
}
