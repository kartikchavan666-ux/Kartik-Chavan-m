import { useMemo } from 'react';
import {
  CheckSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Calendar,
  Briefcase
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import { useTasks } from '../context/TaskContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { TaskCard } from '../components/tasks/TaskCard.tsx';
import { PriorityBadge } from '../components/tasks/PriorityBadge.tsx';
import { CategoryBadge } from '../components/tasks/CategoryBadge.tsx';

interface DashboardPageProps {
  onNavigate: (route: string) => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { user } = useAuth();
  const {
    totalTasksCount,
    completedTasksCount,
    pendingTasksCount,
    overdueTasksCount,
    completionPercentage,
    todayTasks,
    upcomingTasks,
    weeklyProductivity,
    openCreateModal,
    setViewingTask,
  } = useTasks();

  // Dynamic greeting based on current hour
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const pendingToday = todayTasks.filter(t => !t.completed);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-linear-to-r from-indigo-900/90 via-indigo-950 to-slate-900 text-white shadow-xl relative overflow-hidden border border-indigo-500/20">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold backdrop-blur-xs border border-indigo-400/20">
            <Sparkles size={13} />
            <span>Smart Prioritization Active</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {greeting}, {user?.name || 'Alex'}! Ready to get things done?
          </h1>

          <p className="text-xs sm:text-sm text-indigo-200/80 max-w-xl">
            You have {pendingToday.length} task{pendingToday.length === 1 ? '' : 's'} scheduled for today
            {overdueTasksCount > 0 ? ` and ${overdueTasksCount} overdue task${overdueTasksCount === 1 ? '' : 's'} requiring urgency` : '.'}
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 shrink-0">
          <button
            type="button"
            onClick={() => openCreateModal()}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-xl shadow-md active:scale-98 transition-all cursor-pointer"
          >
            <Plus size={16} className="text-indigo-600" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Tasks */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-800/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Total Tasks
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <CheckSquare size={18} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            {totalTasksCount}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 mt-2 font-medium">
            <TrendingUp size={13} />
            <span>Across all 4 categories</span>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-800/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Completed Tasks
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
            {completedTasksCount}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
            <span>{completionPercentage}% complete</span>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-amber-300 dark:hover:border-amber-800/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Pending Tasks
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock size={18} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-2">
            {pendingTasksCount}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
            <span>{pendingToday.length} due today</span>
          </div>
        </div>

        {/* Overdue Tasks */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-rose-300 dark:hover:border-rose-800/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Overdue Tasks
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertCircle size={18} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-rose-600 dark:text-rose-400 mt-2">
            {overdueTasksCount}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 mt-2 font-medium">
            <span>{overdueTasksCount > 0 ? 'High urgency attention' : 'No overdue items!'}</span>
          </div>
        </div>
      </div>

      {/* Productivity Progress Section & Weekly Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Breakdown */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Productivity Progress
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Overall task completion and velocity
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-600 dark:text-slate-400">Completion Rate</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">{completionPercentage}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 block">Completed</span>
              <span className="text-xl font-bold text-emerald-500">{completedTasksCount}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 block">Remaining</span>
              <span className="text-xl font-bold text-slate-700 dark:text-slate-200">{pendingTasksCount}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-700 dark:text-indigo-300">
            <span className="font-bold">Smart Prioritization Active:</span> High priority items and upcoming deadlines are weighted automatically to maximize focus.
          </div>
        </div>

        {/* Weekly Productivity Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Weekly Productivity
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Daily task completion statistics
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/analytics')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Analytics</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyProductivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <Tooltip
                  cursor={{ fill: 'rgba(99, 102, 241, 0.06)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 text-xs">
                          <p className="font-bold text-slate-900 dark:text-white">{data.day} ({data.date})</p>
                          <p className="text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                            {data.completed} task{data.completed === 1 ? '' : 's'} completed
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="completed" radius={[6, 6, 0, 0]}>
                  {weeklyProductivity.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 || index === 1 ? '#6366F1' : '#8B5CF6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Today's Tasks Section & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Tasks (2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Today's Tasks
              </h3>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                {todayTasks.length}
              </span>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('/today')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All Today</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="space-y-3">
            {todayTasks.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                <CheckCircle2 size={32} className="text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">No tasks due today</p>
                <p className="text-xs text-slate-400 mt-1">Great job! All caught up or plan upcoming work.</p>
                <button
                  type="button"
                  onClick={() => openCreateModal(undefined, new Date().toISOString().split('T')[0])}
                  className="mt-4 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors cursor-pointer"
                >
                  Add a task for today
                </button>
              </div>
            ) : (
              todayTasks.slice(0, 4).map(task => (
                <TaskCard key={task.id} task={task} showSmartScore />
              ))
            )}
          </div>
        </div>

        {/* Upcoming Deadlines (1 Column) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-violet-600 dark:text-violet-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Upcoming Deadlines
              </h3>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('/upcoming')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>See All</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800/80 shadow-xs">
            {upcomingTasks.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No upcoming deadlines in the next 14 days.</p>
            ) : (
              upcomingTasks.slice(0, 5).map(task => (
                <div
                  key={task.id}
                  onClick={() => setViewingTask(task)}
                  className="py-3 first:pt-1 last:pb-1 flex items-start justify-between gap-3 cursor-pointer group"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <PriorityBadge priority={task.priority} size="sm" />
                      <span className="text-[10px] text-slate-400">{task.category}</span>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded shrink-0">
                    {task.due_date ? new Date(task.due_date).toLocaleDateString([], { month: 'short', day: 'numeric' }) : ''}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
