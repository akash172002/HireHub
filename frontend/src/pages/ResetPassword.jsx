import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { Ban, Key, CheckCircle, AlertTriangle } from 'lucide-react';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) setError('Missing reset token. Request a new reset link.');
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, newPassword });
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center px-4 bg-slate-50">
        <div className="card p-10 text-center max-w-md w-full animate-fade-in-up">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
            <Ban className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-black text-slate-800 mb-2">Invalid Reset Link</h2>
          <p className="text-slate-500 mb-6">This link is invalid or has expired. Request a new one.</p>
          <Link to="/forgot-password" className="btn-primary px-6 py-3 rounded-xl">
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

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

        <div className="card p-8 relative overflow-hidden">
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{ background: 'linear-gradient(90deg, #6366f1, #0d9488)' }}
          />

          {done ? (
            <div className="text-center py-4 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
              <h1 className="text-2xl font-black text-slate-800 mb-2">Password Updated!</h1>
              <p className="text-slate-500 mb-6">
                Your password has been successfully changed. You can now sign in with your new password.
              </p>
              <Link to="/login" className="btn-primary w-full py-3.5 rounded-xl inline-flex items-center justify-center">
                Sign In →
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-3">
                  <Key className="w-7 h-7 text-indigo-600" />
                </div>
                <h1 className="text-2xl font-black text-slate-800">Set New Password</h1>
                <p className="text-slate-500 mt-1 text-sm">Choose a strong password for your account.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2 animate-fade-in">
                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">New Password</label>
                  <input
                    type="password"
                    className="input"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    minLength={6}
                    required
                    autoComplete="new-password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Confirm Password</label>
                  <input
                    type="password"
                    className={`input ${confirm && confirm !== newPassword ? 'border-red-300 focus:border-red-400' : ''}`}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Repeat your password"
                    minLength={6}
                    required
                    autoComplete="new-password"
                  />
                  {confirm && confirm !== newPassword && (
                    <p className="text-red-500 text-xs mt-1 font-medium">Passwords don't match</p>
                  )}
                </div>

                {/* Password strength indicator */}
                {newPassword && (
                  <div>
                    <div className="flex gap-1 mt-2">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className={`flex-1 h-1.5 rounded-full transition-all ${
                            i < Math.min(4, Math.floor(newPassword.length / 2))
                              ? newPassword.length >= 10
                                ? 'bg-emerald-400'
                                : 'bg-indigo-400'
                              : 'bg-slate-100'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {newPassword.length < 6 ? 'Too short' : newPassword.length < 8 ? 'Weak' : newPassword.length < 12 ? 'Good' : 'Strong'}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  className="btn-primary w-full py-3.5 rounded-xl"
                  disabled={loading || (confirm && confirm !== newPassword)}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Updating…
                    </span>
                  ) : (
                    'Update Password →'
                  )}
                </button>
              </form>
            </>
          )}

          <p className="mt-6 text-center text-slate-500 text-sm">
            <Link to="/login" className="link font-semibold">
              ← Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
