import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-teal-700">
              <span className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold">H</span>
              HireHub
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/jobs" className="text-slate-600 hover:text-teal-600 font-medium">Jobs</Link>
              {user?.role === 'RECRUITER' && (
                <>
                  <Link to="/recruiter/jobs" className="text-slate-600 hover:text-teal-600 font-medium">My Jobs</Link>
                  <Link to="/recruiter/post" className="text-slate-600 hover:text-teal-600 font-medium">Post Job</Link>
                </>
              )}
              {user?.role === 'SEEKER' && (
                <Link to="/my-applications" className="text-slate-600 hover:text-teal-600 font-medium">My Applications</Link>
              )}
              {user?.role === 'ADMIN' && (
                <Link to="/admin" className="text-slate-600 hover:text-teal-600 font-medium">Admin</Link>
              )}
            </nav>
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <Link to="/profile" className="hidden sm:inline btn-ghost text-sm">
                    {user.name || user.email}
                  </Link>
                  <button type="button" onClick={handleLogout} className="btn-secondary text-sm">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-ghost text-sm">Log in</Link>
                  <Link to="/register" className="btn-primary text-sm">Sign up</Link>
                </>
              )}
            </div>
          </div>
        </div>
        {/* Mobile menu */}
        {user && (
          <div className="md:hidden border-t border-slate-100 px-4 py-3 flex flex-wrap gap-2">
            <Link to="/jobs" className="text-sm text-slate-600 hover:text-teal-600">Jobs</Link>
            {user?.role === 'RECRUITER' && (
              <>
                <Link to="/recruiter/jobs" className="text-sm text-slate-600 hover:text-teal-600">My Jobs</Link>
                <Link to="/recruiter/post" className="text-sm text-slate-600 hover:text-teal-600">Post Job</Link>
              </>
            )}
            {user?.role === 'SEEKER' && (
              <Link to="/my-applications" className="text-sm text-slate-600 hover:text-teal-600">My Applications</Link>
            )}
            {user?.role === 'ADMIN' && (
              <Link to="/admin" className="text-sm text-slate-600 hover:text-teal-600">Admin</Link>
            )}
          </div>
        )}
      </header>
      <main className="flex-1">{children}</main>
      <footer className="bg-slate-800 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          <p>© {new Date().getFullYear()} HireHub. Find your next opportunity.</p>
        </div>
      </footer>
    </div>
  );
}
