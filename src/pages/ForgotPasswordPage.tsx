import React, { useState } from 'react';
import { Layers, ArrowLeft, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface ForgotPasswordPageProps {
  onNavigate: (route: string) => void;
}

export function ForgotPasswordPage({ onNavigate }: ForgotPasswordPageProps) {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setError(null);
    setIsLoading(true);

    const res = await resetPassword(email);
    setIsLoading(false);

    if (res.success) {
      setSubmitted(true);
    } else {
      setError(res.error || 'Failed to send reset link.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="flex items-center justify-center gap-2.5 cursor-pointer mb-6" onClick={() => onNavigate('/')}>
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Layers size={22} className="text-white" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">
            TaskFlow
          </span>
        </div>

        <h2 className="text-center text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-xs text-slate-600 dark:text-slate-400">
          Enter your email and we'll send you recovery instructions
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-10 shadow-xl border border-slate-200/80 dark:border-slate-800 rounded-2xl">
          {submitted ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Check your email</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                We sent a password reset link to <span className="font-semibold">{email}</span>. Please check your inbox and spam folder.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('/login')}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Return to sign in</span>
              </button>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
                  <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-500" />
                  <span>{error}</span>
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="alex@example.com"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold text-white bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl shadow-md shadow-indigo-500/20 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? <span>Sending link...</span> : <span>Send Reset Link</span>}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => onNavigate('/login')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>Back to login</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
