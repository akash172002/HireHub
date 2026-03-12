import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data.token, data.user);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex">
      {/* Left panel – brand */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12"
        style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #0d9488 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* Floating blobs */}
        <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-white/10 animate-blob" />
        <div className="absolute -top-24 -left-24 w-56 h-56 rounded-full bg-white/10 animate-blob" style={{ animationDelay: '4s' }} />
        <div className="absolute top-1/2 right-8 w-32 h-32 rounded-full bg-white/5 animate-float" style={{ animationDelay: '2s' }} />

        <div className="relative text-center text-white max-w-sm">
          <div
            className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-5xl font-black mx-auto mb-6 animate-float"
            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}
          >
            H
          </div>
          <h2 className="text-4xl font-black mb-3">Welcome back!</h2>
          <p className="text-indigo-100 text-lg leading-relaxed">
            Your next career milestone is just a login away.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-3 text-left">
            {[
              { icon: '🎯', text: 'AI-powered matching' },
              { icon: '⚡', text: 'Instant applications' },
              { icon: '📊', text: 'Application tracking' },
              { icon: '🔒', text: 'Secure & private' },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                <span className="text-xl">{f.icon}</span>
                <span className="text-sm text-white/90 font-semibold">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel – form */}
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

          <h1 className="text-3xl font-black text-slate-900">Sign in</h1>
          <p className="text-slate-500 mt-1">
            Don't have an account?{' '}
            <Link to="/register" className="link font-semibold">
              Sign up free →
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2 animate-fade-in">
                <span className="mt-0.5">⚠️</span>
                <span>{error}</span>
              </div>
            )}

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
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-bold text-slate-700">Password</label>
                <Link to="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-3.5 text-base rounded-xl"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : (
                'Sign in →'
              )}
            </button>
          </form>

          <div className="mt-8 p-4 rounded-xl bg-indigo-50 border border-indigo-100 text-center">
            <p className="text-indigo-700 text-sm font-medium">
              New to HireHub?{' '}
              <Link to="/register" className="font-bold hover:underline">
                Create your free account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
