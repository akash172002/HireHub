import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/axios';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) setError('Missing reset token');
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
      setMessage('Password updated. You can log in now.');
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="card p-8 text-center">
          <p className="text-red-600">Invalid reset link. Request a new one from the login page.</p>
          <Link to="/forgot-password" className="link mt-4 inline-block">Forgot password</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <h1 className="text-2xl font-bold text-slate-800 text-center">Set new password</h1>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm">{error}</div>
            )}
            {message && (
              <div className="p-3 rounded-xl bg-teal-50 text-teal-800 text-sm">{message}</div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">New password</label>
              <input
                type="password"
                className="input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 6 characters"
                minLength={6}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Confirm password</label>
              <input
                type="password"
                className="input"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat password"
                minLength={6}
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full py-3 rounded-xl" disabled={loading}>
              {loading ? 'Updating…' : 'Update password'}
            </button>
          </form>
          <p className="mt-6 text-center text-slate-600 text-sm">
            <Link to="/login" className="link">Back to login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
