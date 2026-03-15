import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Search, ClipboardList, AlertTriangle, CheckCircle, Bot, Mail, TrendingUp } from 'lucide-react';

const ROLES = [
  { value: 'SEEKER', label: 'Job Seeker', Icon: Search, desc: 'Find and apply to jobs' },
  { value: 'RECRUITER', label: 'Recruiter', Icon: ClipboardList, desc: 'Post jobs & find talent' },
];

const brandFeatures = [
  { Icon: CheckCircle, text: 'Free forever — no credit card needed' },
  { Icon: Bot, text: 'AI parses your resume automatically' },
  { Icon: Mail, text: 'Get matched to jobs that fit you' },
  { Icon: TrendingUp, text: 'Track every application in real time' },
];

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('SEEKER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/register', { name, email, password, role });
      const { data } = await api.post('/auth/login', { email, password });
      login(data.token, data.user);
      navigate('/', { replace: true });
    } catch (err) {
      const e = err.response?.data;
      setError(e?.message || (e?.errors ? JSON.stringify(e.errors) : 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex">
      {/* Left brand panel */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12"
        style={{ background: 'linear-gradient(135deg, #0d9488 0%, #4f46e5 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-white/10 animate-blob" />
        <div className="absolute -top-24 -right-24 w-56 h-56 rounded-full bg-white/10 animate-blob" style={{ animationDelay: '5s' }} />

        <div className="relative text-center text-white max-w-sm">
          <div
            className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-5xl font-black mx-auto mb-6 animate-float"
          >
            H
          </div>
          <h2 className="text-4xl font-black mb-3">Join HireHub</h2>
          <p className="text-teal-100 text-lg leading-relaxed">
            Set up your free account in under 2 minutes and start your journey.
          </p>

          <div className="mt-10 space-y-3 text-left">
            {brandFeatures.map((f) => (
              <div key={f.text} className="flex items-center gap-3 bg-white/10 rounded-xl p-3 border border-white/10">
                <f.Icon className="w-5 h-5 text-white shrink-0" />
                <span className="text-sm text-white/90 font-medium">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12 bg-slate-50">
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <div className="inline-flex items-center gap-2.5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-lg"
                style={{ background: 'linear-gradient(135deg, #6366f1 0%, #0d9488 100%)' }}
              >
                H
              </div>
              <span className="text-2xl font-black text-slate-900">
                Hire<span className="gradient-text">Hub</span>
              </span>
            </div>
          </div>

          <h1 className="text-3xl font-black text-slate-900">Create account</h1>
          <p className="text-slate-500 mt-1">
            Already have one?{' '}
            <Link to="/login" className="link font-semibold">
              Sign in →
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2 animate-fade-in">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Full name</label>
              <input
                type="text"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                required
                autoComplete="name"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Email address</label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                minLength={6}
                required
                autoComplete="new-password"
              />
            </div>

            {/* Role selector */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">I am a…</label>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                      role === r.value
                        ? 'border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-100'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <r.Icon
                      className={`w-6 h-6 mb-1.5 ${role === r.value ? 'text-indigo-600' : 'text-slate-400'}`}
                    />
                    <div className={`font-bold text-sm ${role === r.value ? 'text-indigo-700' : 'text-slate-700'}`}>
                      {r.label}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-3.5 text-base rounded-xl"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account…
                </span>
              ) : (
                'Create Account →'
              )}
            </button>
          </form>

          <p className="mt-4 text-center text-slate-400 text-xs">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
