import { useState } from 'react';
import {
  Layers,
  Sparkles,
  CheckCircle2,
  Calendar,
  BarChart3,
  ShieldCheck,
  Zap,
  ArrowRight,
  ChevronDown,
  Star,
  Users,
  Lock,
  Clock,
  Play
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useTheme } from '../context/ThemeContext.tsx';

interface LandingPageProps {
  onNavigate: (route: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const { user, loginAsDemo } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does Smart Task Prioritization work?',
      a: 'TaskFlow combines priority weighting (High = 3x, Medium = 2x, Low = 1x) with dynamic deadline proximity (overdue, due today, due in 48 hours). The mathematical algorithm computes a real-time urgency score between 0 and 100, bringing what matters most directly to the top.',
    },
    {
      q: 'Is my data secure with Supabase PostgreSQL?',
      a: 'Yes! TaskFlow is engineered with strict Row Level Security (RLS) policies in PostgreSQL. Each authenticated user has their own cryptographically isolated partition. Nobody else can read, modify, or delete your tasks.',
    },
    {
      q: 'Can I use TaskFlow offline or without setting up a database first?',
      a: 'Absolutely. TaskFlow includes an instant local persistence engine out of the box with zero configuration required. When you are ready to connect to your Supabase project, simply add your credentials in Settings or your environment variables.',
    },
    {
      q: 'Can I export my tasks and productivity metrics?',
      a: 'Yes, TaskFlow provides 1-click JSON and CSV export directly in your Account Settings so you always own your data.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white transition-colors">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate('/')}>
            <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-500/25">
              <Layers size={18} className="text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-linear-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              TaskFlow
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</a>
            <a href="#preview" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Preview</a>
            <a href="#pricing" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            {user ? (
              <button
                type="button"
                onClick={() => onNavigate('/dashboard')}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl shadow-md shadow-indigo-500/20 active:scale-98 transition-all cursor-pointer"
              >
                <span>Go to Dashboard</span>
                <ArrowRight size={14} />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => onNavigate('/login')}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('/register')}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl shadow-md shadow-indigo-500/20 active:scale-98 transition-all cursor-pointer"
                >
                  <span>Get Started Free</span>
                  <ArrowRight size={14} />
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 sm:pt-28 sm:pb-32">
        <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-30 dark:opacity-20 pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full bg-linear-to-tr from-indigo-500 to-violet-500 blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-xs font-semibold text-indigo-700 dark:text-indigo-300 shadow-xs">
            <Sparkles size={14} className="text-indigo-500" />
            <span>Next-Generation Productivity Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-slate-900 dark:text-white">
            Take Control of Your Time. <br className="hidden sm:inline" />
            <span className="bg-linear-to-r from-indigo-600 via-violet-600 to-indigo-400 bg-clip-text text-transparent">
              Get More Done.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
            TaskFlow combines intelligent deadline scoring, automated prioritization, interactive calendar workflows, and deep productivity analytics to help you focus on high-impact work.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              type="button"
              onClick={() => onNavigate('/register')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-linear-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl shadow-lg shadow-indigo-500/25 active:scale-98 transition-all cursor-pointer"
            >
              <span>Get Started Free</span>
              <ArrowRight size={16} />
            </button>

            <button
              type="button"
              onClick={async () => {
                await loginAsDemo();
                onNavigate('/dashboard');
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Play size={14} className="text-indigo-500" />
              <span>Instant Interactive Demo</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-6 pt-6 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-500" /> No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-500" /> Supabase PostgreSQL
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-500" /> Row-Level Security
            </span>
          </div>
        </div>
      </section>

      {/* Product Dashboard Preview */}
      <section id="preview" className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <div className="rounded-2xl p-2 sm:p-4 bg-linear-to-b from-indigo-500/10 via-transparent to-transparent border border-slate-200/80 dark:border-slate-800/80 shadow-2xl">
          <div className="rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            {/* Mock Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-xs font-mono text-slate-400">taskflow.app/dashboard</span>
              <div className="w-12" />
            </div>

            {/* Mock Dashboard Preview Content */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-400">Total Tasks</span>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">10</p>
                <span className="text-[11px] text-emerald-500 font-medium">100% synchronized</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-400">Completed</span>
                <p className="text-2xl font-bold text-emerald-500 mt-1">2</p>
                <span className="text-[11px] text-slate-400">20% completion rate</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-400">Pending</span>
                <p className="text-2xl font-bold text-indigo-500 mt-1">8</p>
                <span className="text-[11px] text-indigo-500 font-medium">Smart prioritized</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-400">Overdue</span>
                <p className="text-2xl font-bold text-rose-500 mt-1">2</p>
                <span className="text-[11px] text-rose-500 font-medium">Needs attention</span>
              </div>
            </div>

            {/* Mock Task list preview */}
            <div className="px-6 pb-6 space-y-2.5">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/20 dark:bg-rose-950/20">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-md border border-slate-300 dark:border-slate-600" />
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">Review PR #412: Supabase RLS security audit</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 font-bold">1d overdue</span>
                </div>
                <span className="text-xs font-bold text-indigo-600">Score 95</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-md border border-slate-300 dark:border-slate-600" />
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">Q4 Product Roadmap Presentation</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 font-bold">Due today</span>
                </div>
                <span className="text-xs font-bold text-indigo-600">Score 85</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section id="features" className="py-20 bg-white dark:bg-slate-900/50 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Core Capabilities
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Engineered for Focus and Execution
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Everything you need to organize your daily work, prioritize with clarity, and keep momentum going.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Zap size={20} />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Smart Prioritization</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Automatically calculates a priority score factoring in task importance (High, Medium, Low) alongside approaching deadlines and overdue urgency.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                <Calendar size={20} />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Interactive Calendar</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Switch seamlessly between Month, Week, and Day views. Inspect tasks on their due dates, color-coded by priority, and schedule directly on the grid.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <BarChart3 size={20} />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Productivity Analytics</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Powered by Recharts. Track weekly completion trends, category velocity, completion percentages, and productivity patterns over time.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Clock size={20} />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Deadline Reminders</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Overdue task highlights, tasks due today indicators, desktop notification permission support, and real-time alerts.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Supabase PostgreSQL &amp; RLS</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Production-grade PostgreSQL schema with indexes on foreign keys, Row Level Security policies, and secure Supabase Auth integration.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <Layers size={20} />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Fluid Dark / Light Modes</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Hand-crafted dark and light color palettes inspired by Linear and Notion with smooth micro-interactions and celebratory confetti animations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Pricing</h2>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">Simple, Transparent Pricing</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Start free today. Upgrade when you need team collaboration.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Free Tier */}
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Starter</span>
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">Free Forever</h4>
              <p className="text-xs text-slate-500 mt-1">Perfect for individuals organizing personal and work goals.</p>
            </div>
            <div className="text-4xl font-extrabold text-slate-900 dark:text-white">
              $0 <span className="text-sm font-normal text-slate-400">/ month</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Unlimited tasks &amp; categories</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Smart Prioritization Engine</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Interactive Month/Week/Day Calendar</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Productivity Analytics &amp; Charts</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Supabase PostgreSQL persistence</li>
            </ul>

            <button
              type="button"
              onClick={() => onNavigate('/register')}
              className="w-full py-2.5 text-xs font-semibold text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              Get Started Free
            </button>
          </div>

          {/* Pro Tier */}
          <div className="relative p-8 rounded-2xl bg-white dark:bg-slate-900 border-2 border-indigo-600 dark:border-indigo-500 shadow-xl space-y-6">
            <span className="absolute -top-3 right-6 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-xs">
              Most Popular
            </span>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Pro Cloud</span>
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">Power Productivity</h4>
              <p className="text-xs text-slate-500 mt-1">For professionals and teams needing advanced automation.</p>
            </div>
            <div className="text-4xl font-extrabold text-slate-900 dark:text-white">
              $9 <span className="text-sm font-normal text-slate-400">/ month</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-indigo-500" /> Everything in Starter</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-indigo-500" /> Multi-user shared workspaces</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-indigo-500" /> Scheduled automated email reminders</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-indigo-500" /> Custom category color palettes</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-indigo-500" /> Priority 24/7 dedicated support</li>
            </ul>

            <button
              type="button"
              onClick={() => onNavigate('/register')}
              className="w-full py-2.5 text-xs font-semibold text-white bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl shadow-md shadow-indigo-500/25 active:scale-98 transition-all cursor-pointer"
            >
              Start 14-Day Free Trial
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Got Questions?</h2>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">Frequently Asked Questions</h3>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={faq.q}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-4 text-left text-xs sm:text-sm font-semibold text-slate-900 dark:text-white cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  size={16}
                  className={`text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180 text-indigo-500' : ''}`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Layers size={14} />
            </div>
            <span className="font-bold text-slate-900 dark:text-white">TaskFlow</span>
            <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#features" className="hover:text-indigo-500 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-indigo-500 transition-colors">Pricing</a>
            <button type="button" onClick={() => onNavigate('/login')} className="hover:text-indigo-500 transition-colors cursor-pointer">
              Login
            </button>
            <button type="button" onClick={() => onNavigate('/register')} className="hover:text-indigo-500 transition-colors cursor-pointer">
              Sign Up
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
