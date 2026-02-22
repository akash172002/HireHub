import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setMessage('If that email exists, we sent a reset link. Check your inbox.');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <h1 className="text-2xl font-bold text-slate-800 text-center">Forgot password</h1>
          <p className="text-slate-600 text-center mt-1 text-sm">We'll send a reset link to your email</p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm">{error}</div>
            )}
            {message && (
              <div className="p-3 rounded-xl bg-teal-50 text-teal-800 text-sm">{message}</div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full py-3 rounded-xl" disabled={loading}>
              {loading ? 'Sending…' : 'Send reset link'}
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
