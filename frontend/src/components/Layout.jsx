import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  const navLinks = [
    { to: '/jobs', label: 'Browse Jobs', show: true },
    { to: '/recruiter/jobs', label: 'My Jobs', show: user?.role === 'RECRUITER' },
    { to: '/recruiter/post', label: 'Post Job', show: user?.role === 'RECRUITER' },
    { to: '/my-applications', label: 'My Applications', show: user?.role === 'SEEKER' },
    { to: '/admin', label: 'Admin', show: user?.role === 'ADMIN' },
  ].filter((l) => l.show);

  const initial = ((user?.name || user?.email || '?')[0]).toUpperCase();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-100" style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.06), 0 4px 16px rgba(99,102,241,0.06)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group" onClick={() => setMobileOpen(false)}>
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-lg transition-transform duration-200 group-hover:scale-105 group-hover:rotate-3"
                style={{ background: 'linear-gradient(135deg, #6366f1 0%, #0d9488 100%)', boxShadow: '0 4px 12px rgba(99,102,241,0.4)' }}
              >
                H
              </div>
              <span className="text-xl font-black text-slate-900">
                Hire<span className="gradient-text">Hub</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
                    isActive(link.to)
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-all duration-150"
                  >
                    {user.profilePhoto ? (
                      <img src={user.profilePhoto} alt="" className="w-7 h-7 rounded-lg object-cover ring-2 ring-indigo-100" />
                    ) : (
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                        style={{ background: 'linear-gradient(135deg, #6366f1 0%, #0d9488 100%)' }}
                      >
                        {initial}
                      </div>
                    )}
                    <span className="text-sm font-semibold text-slate-700">
                      {user.name || user.email.split('@')[0]}
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="btn-secondary text-sm px-4 py-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-ghost text-sm px-4 py-2">Log in</Link>
                  <Link to="/register" className="btn-primary text-sm px-4 py-2">Sign up</Link>
                </>
              )}

              {/* Mobile hamburger */}
              {user && (
                <button
                  type="button"
                  className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors ml-1"
                  onClick={() => setMobileOpen((v) => !v)}
                  aria-label="Toggle menu"
                >
                  <div className="w-5 space-y-1">
                    <span className={`block h-0.5 bg-slate-600 transition-all duration-200 origin-center ${mobileOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                    <span className={`block h-0.5 bg-slate-600 transition-all duration-200 ${mobileOpen ? 'opacity-0 scale-x-0' : ''}`} />
                    <span className={`block h-0.5 bg-slate-600 transition-all duration-200 origin-center ${mobileOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="border-t border-slate-100 bg-white px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive(link.to) ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/profile"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
            >
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                style={{ background: 'linear-gradient(135deg, #6366f1, #0d9488)' }}
              >
                {initial}
              </div>
              Profile
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)' }} className="text-white pt-12 pb-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-lg"
                  style={{ background: 'linear-gradient(135deg, #6366f1 0%, #0d9488 100%)' }}
                >
                  H
                </div>
                <span className="text-xl font-black">
                  Hire<span style={{ background: 'linear-gradient(135deg, #818cf8, #14b8a6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Hub</span>
                </span>
              </div>
              <p className="text-slate-400 text-sm">AI-powered job matching platform.</p>
            </div>

            <nav className="flex gap-6 text-slate-400 text-sm">
              <Link to="/jobs" className="hover:text-white transition-colors">Browse Jobs</Link>
              {!user && <Link to="/register" className="hover:text-white transition-colors">Sign Up</Link>}
              {!user && <Link to="/login" className="hover:text-white transition-colors">Log In</Link>}
            </nav>

            <p className="text-slate-600 text-sm">© {new Date().getFullYear()} HireHub</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
