import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Mail, Lock, AlertTriangle } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setMessage('If that email exists, we sent a reset link. Check your inbox.');
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-2xl shadow-lg"
              style={{ background: 'linear-gradient(135deg, #6366f1 0%, #0d9488 100%)' }}
            >
              H
            </div>
            <span className="text-2xl font-black text-slate-900">
              Hire<span className="gradient-text">Hub</span>
            </span>
          </Link>
        </div>

        <div className="card p-8">
          {/* Top gradient bar */}
          <div
            className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
            style={{ background: 'linear-gradient(90deg, #6366f1, #0d9488)' }}
          />

          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-teal-600" />
              </div>
              <h1 className="text-2xl font-black text-slate-800 mb-2">Check your inbox!</h1>
              <p className="text-slate-500 leading-relaxed">{message}</p>
              <Link
                to="/login"
                className="mt-6 btn-primary w-full py-3 rounded-xl inline-flex items-center justify-center"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-7 h-7 text-indigo-600" />
                </div>
                <h1 className="text-2xl font-black text-slate-800">Forgot password?</h1>
                <p className="text-slate-500 mt-1 text-sm">
                  Enter your email and we'll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2 animate-fade-in">
                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
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

                <button
                  type="submit"
                  className="btn-primary w-full py-3.5 rounded-xl"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending…
                    </span>
                  ) : (
                    'Send Reset Link →'
                  )}
                </button>
              </form>
            </>
          )}

          <p className="mt-6 text-center text-slate-500 text-sm">
            Remember your password?{' '}
            <Link to="/login" className="link font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
