import { useState } from 'react';
import {
  Settings,
  Database,
  Bell,
  Sun,
  Moon,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Shield,
  Key,
  ExternalLink,
  Save,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import { useTasks } from '../context/TaskContext.tsx';
import { getSupabaseCredentials, saveCustomSupabaseCredentials } from '../lib/supabase.ts';

export function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { tasks, resetToDemoData } = useTasks();

  const [creds, setCreds] = useState(() => getSupabaseCredentials());
  const [supabaseUrl, setSupabaseUrl] = useState(creds.url);
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(creds.key);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testedStatus, setTestedStatus] = useState<string | null>(null);

  // Profile fields
  const [displayName, setDisplayName] = useState(user?.name || 'Alex Rivera');
  const [profileSaved, setProfileSaved] = useState(false);

  // Notification settings
  const [notifyOverdue, setNotifyOverdue] = useState(true);
  const [notifyDueToday, setNotifyDueToday] = useState(true);
  const [notifyUpcoming, setNotifyUpcoming] = useState(true);

  const handleSaveSupabase = (e: React.FormEvent) => {
    e.preventDefault();
    saveCustomSupabaseCredentials(supabaseUrl, supabaseAnonKey);
    const updated = getSupabaseCredentials();
    setCreds(updated);
    setSavedSuccess(true);
    setTestedStatus('Settings saved. Refresh the page to initialize the updated Supabase client.');
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleTestConnection = async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      setTestedStatus('Please provide both Project URL and Anon API key.');
      return;
    }
    if (!supabaseUrl.startsWith('https://')) {
      setTestedStatus('Invalid URL. Supabase project URLs must start with https://');
      return;
    }
    setTestedStatus('Testing Supabase endpoint connectivity...');
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/`, {
        headers: { apikey: supabaseAnonKey },
      });
      if (res.ok || res.status === 200 || res.status === 404 || res.status === 401) {
        setTestedStatus('✅ Connection successful! Supabase API responded.');
      } else {
        setTestedStatus(`⚠️ Server responded with HTTP status ${res.status}.`);
      }
    } catch (e: any) {
      setTestedStatus(`❌ Connection error: ${e.message}`);
    }
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute('href', dataStr);
    dl.setAttribute('download', `taskflow_export_${new Date().toISOString().split('T')[0]}.json`);
    dl.click();
  };

  const handleExportCSV = () => {
    const headers = ['id', 'title', 'description', 'priority', 'category', 'due_date', 'completed', 'created_at'];
    const rows = tasks.map(t => [
      t.id,
      `"${(t.title || '').replace(/"/g, '""')}"`,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      t.priority,
      t.category,
      t.due_date || '',
      t.completed ? 'true' : 'false',
      t.created_at,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const dl = document.createElement('a');
    dl.setAttribute('href', encodeURI(csvContent));
    dl.setAttribute('download', `taskflow_tasks_${new Date().toISOString().split('T')[0]}.csv`);
    dl.click();
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <Settings size={24} className="text-indigo-600 dark:text-indigo-400" />
          <span>Settings</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage your account profile, appearance, notifications, and Supabase database connection
        </p>
      </div>

      {/* 1. Theme & Appearance */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Appearance &amp; Theme
            </h3>
            <p className="text-xs text-slate-400">Choose your preferred visual theme</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-md pt-2">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              theme === 'light'
                ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-semibold shadow-xs'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
              <Sun size={18} />
            </div>
            <div>
              <p className="text-xs font-bold">Light Mode</p>
              <p className="text-[10px] text-slate-500">Crisp slate &amp; white</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              theme === 'dark'
                ? 'border-indigo-500 bg-indigo-950/40 text-white font-semibold shadow-xs'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <div className="p-2 rounded-lg bg-indigo-950 text-indigo-400">
              <Moon size={18} />
            </div>
            <div>
              <p className="text-xs font-bold">Dark Mode</p>
              <p className="text-[10px] text-slate-400">Deep navy &amp; charcoal</p>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Supabase PostgreSQL Configuration */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Database size={18} className="text-emerald-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Supabase PostgreSQL Database
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Connect TaskFlow directly to your Supabase project with Row Level Security (RLS)
            </p>
          </div>

          <span
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-full border ${
              creds.isReal
                ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400'
                : 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-400'
            }`}
          >
            {creds.isReal ? '● Live Supabase Connected' : '● Instant Local Persistence Active'}
          </span>
        </div>

        <form onSubmit={handleSaveSupabase} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Project URL
            </label>
            <input
              type="text"
              value={supabaseUrl}
              onChange={e => setSupabaseUrl(e.target.value)}
              placeholder="https://your-project-id.supabase.co"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Anon / Public API Key
            </label>
            <input
              type="password"
              value={supabaseAnonKey}
              onChange={e => setSupabaseAnonKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Only provide the public anon key. Never expose your service-role secret key.
            </p>
          </div>

          {testedStatus && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200">
              {testedStatus}
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all cursor-pointer"
            >
              <Save size={14} />
              <span>Save Supabase Credentials</span>
            </button>

            <button
              type="button"
              onClick={handleTestConnection}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Test Connection
            </button>
          </div>
        </form>
      </div>

      {/* 3. Notification Preferences */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Bell size={16} className="text-indigo-500" />
            <span>Notification &amp; Deadline Reminders</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Control which deadline triggers send badges and notifications</p>
        </div>

        <div className="space-y-3 pt-2">
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 cursor-pointer">
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-white">Overdue Task Alerts</p>
              <p className="text-[11px] text-slate-400">Receive red urgency indicators for incomplete overdue tasks</p>
            </div>
            <input
              type="checkbox"
              checked={notifyOverdue}
              onChange={e => setNotifyOverdue(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 cursor-pointer">
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-white">Due Today Notifications</p>
              <p className="text-[11px] text-slate-400">Receive daily morning notifications for tasks due before midnight</p>
            </div>
            <input
              type="checkbox"
              checked={notifyDueToday}
              onChange={e => setNotifyDueToday(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 cursor-pointer">
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-white">Approaching Deadlines (48h)</p>
              <p className="text-[11px] text-slate-400">Include high-urgency smart score boosts for items due soon</p>
            </div>
            <input
              type="checkbox"
              checked={notifyUpcoming}
              onChange={e => setNotifyUpcoming(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* 4. Data Export & Backup */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Download size={16} className="text-indigo-500" />
            <span>Data Export &amp; Backup</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Download your task records for backups or spreadsheet analytics</p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <Download size={14} />
            <span>Export JSON</span>
          </button>
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={() => {
              resetToDemoData();
              alert('Demo dataset reset successfully!');
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 rounded-xl transition-colors cursor-pointer ml-auto"
          >
            <RotateCcw size={14} />
            <span>Reload Initial Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
