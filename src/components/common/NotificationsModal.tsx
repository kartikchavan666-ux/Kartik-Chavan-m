import { useState } from 'react';
import { X, Bell, AlertTriangle, Clock, Check, BellRing } from 'lucide-react';
import { useTasks } from '../../context/TaskContext.tsx';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsModal({ isOpen, onClose }: NotificationsModalProps) {
  const { notifications, dismissNotification, toggleTaskComplete, setViewingTask, tasks } = useTasks();
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>(() => {
    return typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default';
  });

  if (!isOpen) return null;

  const requestBrowserNotifications = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const perm = await Notification.requestPermission();
      setBrowserPermission(perm);
      if (perm === 'granted') {
        new Notification('TaskFlow Notifications Enabled', {
          body: 'You will receive reminders for upcoming and overdue tasks.',
          icon: '/favicon.ico',
        });
      }
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="fixed top-16 right-4 sm:right-8 z-50 w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-bold text-slate-900 dark:text-white">Notifications &amp; Reminders</span>
            {notifications.length > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white">
                {notifications.length}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close notifications"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Browser Permission Banner */}
        {browserPermission !== 'granted' && (
          <div className="px-4 py-2.5 bg-indigo-50 dark:bg-indigo-950/40 border-b border-indigo-100 dark:border-indigo-900/30 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
              <BellRing size={14} className="shrink-0" />
              <span>Enable desktop notifications</span>
            </div>
            <button
              type="button"
              onClick={requestBrowserNotifications}
              className="px-2.5 py-1 text-[11px] font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors cursor-pointer"
            >
              Enable
            </button>
          </div>
        )}

        {/* List of Notifications */}
        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 p-2">
          {notifications.length === 0 ? (
            <div className="py-8 text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2">
                <Check size={20} />
              </div>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">All caught up!</p>
              <p className="text-[11px] text-slate-400 mt-0.5">No overdue tasks or immediate deadlines right now.</p>
            </div>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                className="p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-start gap-3"
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    n.type === 'urgent'
                      ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-500'
                      : 'bg-amber-50 dark:bg-amber-950/60 text-amber-500'
                  }`}
                >
                  {n.type === 'urgent' ? <AlertTriangle size={15} /> : <Clock size={15} />}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">{n.title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{n.message}</p>
                  
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        const t = tasks.find(item => item.id === n.taskId);
                        if (t) {
                          setViewingTask(t);
                          onClose();
                        }
                      }}
                      className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                      View Task
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        toggleTaskComplete(n.taskId);
                        dismissNotification(n.id);
                      }}
                      className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                    >
                      Mark Done
                    </button>
                    <button
                      type="button"
                      onClick={() => dismissNotification(n.id)}
                      className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 ml-auto cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
