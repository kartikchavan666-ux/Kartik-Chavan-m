import { useState } from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  SunMedium,
  CalendarDays,
  Calendar,
  BarChart3,
  Briefcase,
  User as UserIcon,
  GraduationCap,
  FolderKanban,
  Settings,
  HelpCircle,
  LogOut,
  X,
  Plus,
  Layers
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { Category } from '../../types/index.ts';
import { ShortcutsModal } from './ShortcutsModal.tsx';

interface SidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ currentRoute, onNavigate, isOpenMobile, onCloseMobile }: SidebarProps) {
  const { tasks, todayTasks, upcomingTasks, categoryBreakdown, openCreateModal, updateFilter, filterState } = useTasks();
  const { user, logout } = useAuth();
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const pendingTotal = tasks.filter(t => !t.completed).length;
  const pendingToday = todayTasks.filter(t => !t.completed).length;
  const pendingUpcoming = upcomingTasks.length;

  const navLinks = [
    { label: 'Dashboard', route: '/dashboard', icon: LayoutDashboard },
    { label: 'My Tasks', route: '/tasks', icon: CheckSquare, badge: pendingTotal },
    { label: 'Today', route: '/today', icon: SunMedium, badge: pendingToday, badgeColor: 'bg-amber-500' },
    { label: 'Upcoming', route: '/upcoming', icon: CalendarDays, badge: pendingUpcoming },
    { label: 'Calendar', route: '/calendar', icon: Calendar },
    { label: 'Analytics', route: '/analytics', icon: BarChart3 },
  ];

  const categories: { name: Category; icon: any; color: string; dotClass: string }[] = [
    { name: 'Work', icon: Briefcase, color: '#6366F1', dotClass: 'bg-indigo-500' },
    { name: 'Personal', icon: UserIcon, color: '#10B981', dotClass: 'bg-emerald-500' },
    { name: 'Study', icon: GraduationCap, color: '#F59E0B', dotClass: 'bg-amber-500' },
    { name: 'Projects', icon: FolderKanban, color: '#8B5CF6', dotClass: 'bg-violet-500' },
  ];

  const handleCategoryClick = (catName: Category) => {
    updateFilter({ category: catName, status: 'ALL' });
    onNavigate('/tasks');
    onCloseMobile();
  };

  const content = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-5 border-b border-slate-100 dark:border-slate-800">
        <div
          onClick={() => {
            onNavigate('/dashboard');
            onCloseMobile();
          }}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Layers size={18} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight bg-linear-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              TaskFlow
            </span>
            <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold tracking-wider uppercase -mt-0.5">
              SaaS Pro
            </span>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Close navigation"
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X size={18} />
        </button>
      </div>

      {/* Main Nav Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Core Routes */}
        <div className="space-y-1">
          <p className="px-3 mb-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Navigation
          </p>
          {navLinks.map(link => {
            const Icon = link.icon;
            const isActive = currentRoute === link.route;
            return (
              <button
                key={link.route}
                type="button"
                onClick={() => {
                  onNavigate(link.route);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={16} className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'} />
                  <span>{link.label}</span>
                </div>
                {typeof link.badge === 'number' && link.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.2 text-[10px] font-bold rounded-full text-white ${
                      link.badgeColor || 'bg-slate-400 dark:bg-slate-700'
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Categories Section */}
        <div className="space-y-1">
          <div className="flex items-center justify-between px-3 mb-2">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Categories
            </p>
            <button
              type="button"
              onClick={() => openCreateModal()}
              title="Add task to a category"
              className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-0.5 rounded cursor-pointer"
            >
              <Plus size={13} />
            </button>
          </div>

          {categories.map(cat => {
            const Icon = cat.icon;
            const isFilterActive = currentRoute === '/tasks' && filterState.category === cat.name;
            const catStat = categoryBreakdown.find(c => c.name === cat.name);
            const count = catStat ? catStat.count - catStat.completed : 0;

            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => handleCategoryClick(cat.name)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isFilterActive
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-2 h-2 rounded-full ${cat.dotClass}`} />
                  <span>{cat.name}</span>
                </div>
                {count > 0 && (
                  <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Section: Settings, Help, Profile & Logout */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-1">
        <button
          type="button"
          onClick={() => {
            onNavigate('/settings');
            onCloseMobile();
          }}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
            currentRoute === '/settings'
              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <Settings size={16} />
          <span>Settings</span>
        </button>

        <button
          type="button"
          onClick={() => setIsHelpOpen(true)}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
        >
          <HelpCircle size={16} />
          <span>Keyboard Shortcuts</span>
        </button>

        {/* User Card */}
        <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between px-2 py-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={user?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.email || 'Alex')}`}
              alt={user?.name || 'User'}
              className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {user?.name || 'Alex Rivera'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {user?.email || 'alex@taskflow.dev'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={async () => {
              await logout();
              onNavigate('/');
            }}
            title="Sign out"
            aria-label="Sign out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>

      <ShortcutsModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden lg:block w-64 h-screen shrink-0 sticky top-0 z-40">
        {content}
      </aside>

      {/* Mobile drawer with backdrop */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity" onClick={onCloseMobile} />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
