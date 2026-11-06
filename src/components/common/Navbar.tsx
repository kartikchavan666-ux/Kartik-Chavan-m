import { useState, useRef, useEffect } from 'react';
import { Search, Plus, Bell, Sun, Moon, Menu, Sparkles, User, Settings, LogOut, CheckCircle } from 'lucide-react';
import { useTasks } from '../../context/TaskContext.tsx';
import { useTheme } from '../../context/ThemeContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { NotificationsModal } from './NotificationsModal.tsx';

interface NavbarProps {
  onToggleSidebar: () => void;
  onNavigate: (route: string) => void;
  currentRoute: string;
}

export function Navbar({ onToggleSidebar, onNavigate }: NavbarProps) {
  const { openCreateModal, filterState, updateFilter, unreadNotificationCount } = useTasks();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === '/') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        openCreateModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openCreateModal]);

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80">
        {/* Left: Mobile Menu Trigger & Search */}
        <div className="flex items-center gap-3 flex-1 max-w-lg">
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Menu size={20} />
          </button>

          {/* Search Bar */}
          <div className="relative w-full">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search tasks, descriptions... (Press '/' to focus)"
              value={filterState.search}
              onChange={e => updateFilter({ search: e.target.value })}
              className="w-full pl-10 pr-9 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-transparent focus:border-indigo-500 dark:focus:border-indigo-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:bg-white dark:focus:bg-slate-800 transition-all"
            />
            {filterState.search ? (
              <button
                type="button"
                onClick={() => updateFilter({ search: '' })}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                &times;
              </button>
            ) : (
              <span className="hidden sm:inline-block absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-slate-200 dark:bg-slate-700/60 px-1.5 py-0.5 rounded">
                /
              </span>
            )}
          </div>
        </div>

        {/* Right Action Icons & Profile */}
        <div className="flex items-center gap-2 sm:gap-3 ml-3">
          {/* Quick Create Task button */}
          <button
            type="button"
            onClick={() => openCreateModal()}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs font-semibold text-white bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl shadow-sm shadow-indigo-500/20 active:scale-98 transition-all cursor-pointer"
          >
            <Plus size={15} strokeWidth={2.5} />
            <span className="hidden sm:inline">New Task</span>
          </button>

          {/* Notifications Button */}
          <button
            type="button"
            onClick={() => setIsNotifOpen(prev => !prev)}
            aria-label="View notifications"
            className="relative p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Bell size={18} />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            )}
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-600" />}
          </button>

          {/* User Profile Avatar / Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen(prev => !prev)}
              aria-label="Open user menu"
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <img
                src={user?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.email || 'Alex')}`}
                alt={user?.name || 'User'}
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700"
              />
            </button>

            {isProfileMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-56 py-1.5 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-700/60">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {user?.name || 'Alex Rivera'}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {user?.email || 'alex@taskflow.dev'}
                    </p>
                  </div>

                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onNavigate('/settings');
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors cursor-pointer text-left"
                    >
                      <Settings size={15} />
                      <span>Account Settings</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onNavigate('/analytics');
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors cursor-pointer text-left"
                    >
                      <Sparkles size={15} className="text-indigo-500" />
                      <span>Productivity Analytics</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-700/60 pt-1">
                    <button
                      type="button"
                      onClick={async () => {
                        setIsProfileMenuOpen(false);
                        await logout();
                        onNavigate('/');
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer text-left"
                    >
                      <LogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Notifications modal panel */}
      <NotificationsModal isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </>
  );
}
