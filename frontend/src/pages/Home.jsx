import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const forbidden = searchParams.get('forbidden') === '1';

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-white to-cyan-50" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        {forbidden && user && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 text-amber-800 text-center text-sm">
            You don’t have permission to access that page. Use the menu to open pages for your role.
          </div>
        )}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800 tracking-tight">
            Find your next <span className="text-teal-600">opportunity</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600">
            HireHub connects job seekers with recruiters. Upload your resume, get match scores, and apply in one place.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/jobs" className="btn-primary text-lg px-8 py-3 rounded-xl">
              Browse Jobs
            </Link>
            {!user && (
              <Link to="/register" className="btn-secondary text-lg px-8 py-3 rounded-xl">
                Create account
              </Link>
            )}
          </div>
        </div>
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="card p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center mx-auto text-xl font-bold">1</div>
            <h3 className="mt-4 font-semibold text-slate-800">Create profile</h3>
            <p className="mt-2 text-slate-600 text-sm">Sign up and upload your resume for smarter matching.</p>
          </div>
          <div className="card p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center mx-auto text-xl font-bold">2</div>
            <h3 className="mt-4 font-semibold text-slate-800">Get match scores</h3>
            <p className="mt-2 text-slate-600 text-sm">Our AI scores how well your resume fits each job.</p>
          </div>
          <div className="card p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center mx-auto text-xl font-bold">3</div>
            <h3 className="mt-4 font-semibold text-slate-800">Apply & track</h3>
            <p className="mt-2 text-slate-600 text-sm">Apply with one click and track your applications.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
