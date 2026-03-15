import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import {
  Briefcase, Building2, Users, Star,
  Sparkles, Zap, BarChart2, Bell,
  AlertTriangle, Search, ClipboardList,
} from 'lucide-react';

const stats = [
  { label: 'Jobs Available', value: '10K+', Icon: Briefcase },
  { label: 'Companies', value: '500+', Icon: Building2 },
  { label: 'Job Seekers', value: '50K+', Icon: Users },
  { label: 'Placements', value: '8K+', Icon: Star },
];

const features = [
  {
    Icon: Sparkles,
    title: 'Smart AI Matching',
    desc: 'Our AI scores exactly how well your resume fits each job — no more guessing.',
    gradient: 'from-indigo-500 to-violet-600',
    bg: 'bg-indigo-50',
  },
  {
    Icon: Zap,
    title: 'One-Click Apply',
    desc: 'Apply to any job instantly with your saved profile and resume.',
    gradient: 'from-orange-400 to-rose-500',
    bg: 'bg-orange-50',
  },
  {
    Icon: BarChart2,
    title: 'Real-Time Tracking',
    desc: 'Monitor all your applications and their statuses from a single dashboard.',
    gradient: 'from-teal-400 to-cyan-500',
    bg: 'bg-teal-50',
  },
  {
    Icon: Bell,
    title: 'Instant Updates',
    desc: 'Get notified the moment a recruiter updates your application status.',
    gradient: 'from-violet-500 to-indigo-600',
    bg: 'bg-violet-50',
  },
];

const steps = [
  { num: '01', title: 'Create Your Profile', desc: 'Sign up, upload your resume, and let our AI parse your skills automatically.' },
  { num: '02', title: 'Get AI Match Scores', desc: 'Browse jobs with personalized match percentages based on your actual skills.' },
  { num: '03', title: 'Apply & Get Hired', desc: 'Apply in one click and track every application through to offer.' },
];

export default function Home() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const forbidden = searchParams.get('forbidden') === '1';
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-48 -right-48 w-[500px] h-[500px] opacity-[0.12] animate-blob"
          style={{ background: 'linear-gradient(135deg, #6366f1, #0d9488)', animationDelay: '0s' }}
        />
        <div
          className="absolute -bottom-48 -left-32 w-96 h-96 opacity-[0.1] animate-blob"
          style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)', animationDelay: '4s' }}
        />
        <div
          className="absolute top-1/3 -left-24 w-80 h-80 opacity-[0.08] animate-blob"
          style={{ background: 'linear-gradient(135deg, #14b8a6, #6366f1)', animationDelay: '8s' }}
        />
      </div>

      {/* ── Hero ── */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 md:pt-32 md:pb-24">
        {forbidden && user && (
          <div className="mb-8 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-center text-sm font-medium animate-fade-in flex items-center justify-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            You don't have permission to access that page. Use the menu for your role.
          </div>
        )}

        <div
          className={`text-center max-w-4xl mx-auto transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-semibold mb-8">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            AI-Powered Career Platform
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.05]">
            Land your{' '}
            <span className="gradient-text">dream job</span>
            <br />
            <span className="text-slate-600 font-black">faster than ever</span>
          </h1>

          <p className="mt-7 text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            HireHub uses AI to match your skills with the perfect opportunities. Upload your resume once and apply anywhere instantly.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/jobs"
              className="btn-primary text-lg px-10 py-4 rounded-2xl animate-pulse-glow"
            >
              Browse Jobs →
            </Link>
            {!user && (
              <Link
                to="/register"
                className="btn-secondary text-lg px-10 py-4 rounded-2xl"
              >
                Get Started Free
              </Link>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div
          className={`mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto transition-all duration-700 delay-200 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="card p-5 text-center group hover:-translate-y-1 transition-all duration-300"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex justify-center mb-2">
                <s.Icon className="w-6 h-6 text-indigo-500" />
              </div>
              <p className="text-2xl sm:text-3xl font-black gradient-text">{s.value}</p>
              <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── How it works ── */}
      <div className="relative py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-header">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-wider mb-4">
              How it works
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-800">
              Get hired in <span className="gradient-text">3 simple steps</span>
            </h2>
            <p className="mt-3 text-slate-500 text-lg">No complicated process. Just upload, match, and apply.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {steps.map((item, i) => (
              <div
                key={item.num}
                className="card p-8 group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 relative overflow-hidden"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ background: `linear-gradient(90deg, #6366f1, #0d9488)` }}
                />
                <div className="text-5xl font-black gradient-text opacity-20 group-hover:opacity-40 transition-opacity duration-300 leading-none">
                  {item.num}
                </div>
                <h3 className="mt-4 font-bold text-slate-800 text-xl">{item.title}</h3>
                <p className="mt-2 text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Features ── */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-header">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4">
              Features
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-800">
              Everything you <span className="gradient-text">need to succeed</span>
            </h2>
            <p className="mt-3 text-slate-500 text-lg">Powerful tools for job seekers and recruiters alike.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="card p-6 group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-default"
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg`}
                >
                  <f.Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg">{f.title}</h3>
                <p className="mt-2 text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recruiter CTA ── */}
      {!user && (
        <div className="py-16 bg-slate-50 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card p-8 border-2 border-indigo-100 group hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">Looking for a job?</h3>
                <p className="text-slate-500 mb-6">Upload your resume, get AI match scores, and apply to hundreds of jobs instantly.</p>
                <Link to="/register" className="btn-primary px-6 py-3 rounded-xl">
                  Start Job Hunting →
                </Link>
              </div>
              <div className="card p-8 border-2 border-teal-100 group hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center mb-4">
                  <ClipboardList className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">Hiring talent?</h3>
                <p className="text-slate-500 mb-6">Post jobs, get AI-ranked applicants, and find the perfect match faster than ever.</p>
                <Link to="/register" className="btn-secondary px-6 py-3 rounded-xl border-teal-200 hover:border-teal-400 hover:text-teal-700 hover:bg-teal-50">
                  Start Recruiting →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Bottom CTA ── */}
      {!user && (
        <div className="relative py-24 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #0d9488 100%)' }}
          />
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '32px 32px',
            }}
          />
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 animate-blob" style={{ background: 'radial-gradient(circle, white, transparent)' }} />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10 animate-blob" style={{ background: 'radial-gradient(circle, white, transparent)', animationDelay: '5s' }} />

          <div className="relative max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Ready to find your next opportunity?
            </h2>
            <p className="text-indigo-100 text-xl mb-10">
              Join 50,000+ professionals who found their dream job on HireHub.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-white text-indigo-600 font-bold text-lg hover:bg-indigo-50 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
              >
                Create Free Account
              </Link>
              <Link
                to="/jobs"
                className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-white/15 text-white font-bold text-lg border border-white/30 hover:bg-white/25 transition-all duration-200 backdrop-blur-sm"
              >
                Browse Jobs →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
