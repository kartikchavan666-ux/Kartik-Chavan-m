import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { TaskProvider } from './context/TaskContext.tsx';

import { Navbar } from './components/common/Navbar.tsx';
import { Sidebar } from './components/common/Sidebar.tsx';
import { TaskModal } from './components/common/TaskModal.tsx';
import { TaskDetailsModal } from './components/common/TaskDetailsModal.tsx';
import { DeleteConfirmModal } from './components/common/DeleteConfirmModal.tsx';

import { LandingPage } from './pages/LandingPage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { RegisterPage } from './pages/RegisterPage.tsx';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { TasksPage } from './pages/TasksPage.tsx';
import { TodayPage } from './pages/TodayPage.tsx';
import { UpcomingPage } from './pages/UpcomingPage.tsx';
import { CalendarPage } from './pages/CalendarPage.tsx';
import { AnalyticsPage } from './pages/AnalyticsPage.tsx';
import { SettingsPage } from './pages/SettingsPage.tsx';

function MainApp() {
  const { user, loading } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);

  // Sync route with window history
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (route: string) => {
    if (window.location.pathname !== route) {
      window.history.pushState({}, '', route);
    }
    setCurrentRoute(route);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Loading TaskFlow...</p>
        </div>
      </div>
    );
  }

  // Public Landing / Auth Routes
  if (currentRoute === '/' && !user) {
    return <LandingPage onNavigate={navigate} />;
  }

  if (currentRoute === '/login') {
    if (user) {
      navigate('/dashboard');
      return null;
    }
    return <LoginPage onNavigate={navigate} />;
  }

  if (currentRoute === '/register') {
    if (user) {
      navigate('/dashboard');
      return null;
    }
    return <RegisterPage onNavigate={navigate} />;
  }

  if (currentRoute === '/forgot-password') {
    return <ForgotPasswordPage onNavigate={navigate} />;
  }

  // If user is not logged in and tries to access protected route, redirect to login
  if (!user) {
    return <LoginPage onNavigate={navigate} />;
  }

  // Fallback for root path when logged in
  const activeRoute = currentRoute === '/' ? '/dashboard' : currentRoute;

  // Protected App Shell Layout
  return (
    <TaskProvider>
      <div className="flex min-h-screen bg-slate-50/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">
        {/* Sidebar */}
        <Sidebar
          currentRoute={activeRoute}
          onNavigate={navigate}
          isOpenMobile={isSidebarOpenMobile}
          onCloseMobile={() => setIsSidebarOpenMobile(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar
            onToggleSidebar={() => setIsSidebarOpenMobile(prev => !prev)}
            onNavigate={navigate}
            currentRoute={activeRoute}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {activeRoute === '/dashboard' && <DashboardPage onNavigate={navigate} />}
            {activeRoute === '/tasks' && <TasksPage />}
            {activeRoute === '/today' && <TodayPage />}
            {activeRoute === '/upcoming' && <UpcomingPage />}
            {activeRoute === '/calendar' && <CalendarPage />}
            {activeRoute === '/analytics' && <AnalyticsPage />}
            {activeRoute === '/settings' && <SettingsPage />}
          </main>
        </div>

        {/* Modals */}
        <TaskModal />
        <TaskDetailsModal />
        <DeleteConfirmModal />
      </div>
    </TaskProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
