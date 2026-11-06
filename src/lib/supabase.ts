import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Task, User } from '../types/index.ts';

// Initial default demo user
const DEMO_USER_ID = 'demo-user-1111-2222-3333-444455556666';
const DEMO_EMAIL = 'alex@taskflow.dev';

// Seed initial tasks relative to current date
function generateInitialTasks(): Task[] {
  const now = new Date();
  
  const formatDate = (offsetDays: number, hours = 17, mins = 0) => {
    const d = new Date(now);
    d.setDate(d.getDate() + offsetDays);
    d.setHours(hours, mins, 0, 0);
    return d.toISOString();
  };

  return [
    {
      id: 'task-1',
      user_id: DEMO_USER_ID,
      title: 'Q4 Product Roadmap Presentation',
      description: 'Prepare executive slides outlining key deliverables, OKRs, and design system updates for the leadership team.',
      priority: 'HIGH',
      category: 'Work',
      due_date: formatDate(0, 15, 0), // Today
      completed: false,
      created_at: formatDate(-3),
      updated_at: formatDate(-1),
    },
    {
      id: 'task-2',
      user_id: DEMO_USER_ID,
      title: 'Review PR #412: Supabase RLS security audit',
      description: 'Verify row-level security policies, JWT validation checks, and foreign key indexes.',
      priority: 'HIGH',
      category: 'Projects',
      due_date: formatDate(-1, 18, 0), // Overdue!
      completed: false,
      created_at: formatDate(-4),
      updated_at: formatDate(-2),
    },
    {
      id: 'task-3',
      user_id: DEMO_USER_ID,
      title: 'Deep Work: Read TypeScript 5.8 Decorators Guide',
      description: 'Read the architectural changes and experiment with stage-3 decorators in our monorepo prototype.',
      priority: 'MEDIUM',
      category: 'Study',
      due_date: formatDate(0, 20, 0), // Today
      completed: false,
      created_at: formatDate(-2),
      updated_at: formatDate(0),
    },
    {
      id: 'task-4',
      user_id: DEMO_USER_ID,
      title: 'Sign up for Sunday Half-Marathon',
      description: 'Complete registration form, pay entry fee, and sync confirmation to calendar.',
      priority: 'LOW',
      category: 'Personal',
      due_date: formatDate(3, 12, 0), // Upcoming
      completed: false,
      created_at: formatDate(-5),
      updated_at: formatDate(-1),
    },
    {
      id: 'task-5',
      user_id: DEMO_USER_ID,
      title: 'Refactor Recharts productivity widgets',
      description: 'Implement responsive SVG containers and clean tooltip formatters for weekly completion chart.',
      priority: 'MEDIUM',
      category: 'Projects',
      due_date: formatDate(1, 14, 0), // Tomorrow
      completed: false,
      created_at: formatDate(-3),
      updated_at: formatDate(0),
    },
    {
      id: 'task-6',
      user_id: DEMO_USER_ID,
      title: 'Renew Annual Health Insurance Policy',
      description: 'Review updated policy terms, compare premium tiers, and submit reimbursement claims.',
      priority: 'HIGH',
      category: 'Personal',
      due_date: formatDate(-2, 10, 0), // Overdue
      completed: false,
      created_at: formatDate(-6),
      updated_at: formatDate(-3),
    },
    {
      id: 'task-7',
      user_id: DEMO_USER_ID,
      title: 'Database indexing optimization workshop',
      description: 'Participate in team workshop discussing B-tree vs BRIN indexes for high volume event logs.',
      priority: 'LOW',
      category: 'Study',
      due_date: formatDate(5, 16, 0), // Upcoming
      completed: false,
      created_at: formatDate(-2),
      updated_at: formatDate(-2),
    },
    {
      id: 'task-8',
      user_id: DEMO_USER_ID,
      title: 'Weekly Sprint Planning & Backlog Grooming',
      description: 'Align sprint commitments, assign high-priority story points, and resolve team blockers.',
      priority: 'HIGH',
      category: 'Work',
      due_date: formatDate(-1, 11, 0),
      completed: true,
      created_at: formatDate(-5),
      updated_at: formatDate(-1),
    },
    {
      id: 'task-9',
      user_id: DEMO_USER_ID,
      title: 'Order ergonomics monitor arm',
      description: 'Dual monitor gas spring mount with cable management channel.',
      priority: 'LOW',
      category: 'Personal',
      due_date: formatDate(-4, 15, 0),
      completed: true,
      created_at: formatDate(-7),
      updated_at: formatDate(-4),
    },
    {
      id: 'task-10',
      user_id: DEMO_USER_ID,
      title: 'Deploy TaskFlow v1.0 Production Release to Vercel',
      description: 'Execute production build verification, check lighthouse scores, and verify SSL certificate.',
      priority: 'HIGH',
      category: 'Projects',
      due_date: formatDate(2, 17, 30),
      completed: false,
      created_at: formatDate(-1),
      updated_at: formatDate(0),
    }
  ];
}

// Local Storage Keys
const STORAGE_KEY_TASKS = 'taskflow_tasks_db';
const STORAGE_KEY_USERS = 'taskflow_users_db';
const STORAGE_KEY_SESSION = 'taskflow_auth_session';
const STORAGE_KEY_CUSTOM_URL = 'taskflow_supabase_url';
const STORAGE_KEY_CUSTOM_KEY = 'taskflow_supabase_anon_key';

// Initialize mock DB in localStorage
function getStoredTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TASKS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load local tasks', e);
  }
  const initial = generateInitialTasks();
  saveStoredTasks(initial);
  return initial;
}

function saveStoredTasks(tasks: Task[]) {
  try {
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save local tasks', e);
  }
}

function getStoredUsers(): User[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load local users', e);
  }
  const defaultUsers: User[] = [
    {
      id: DEMO_USER_ID,
      email: DEMO_EMAIL,
      name: 'Alex Rivera',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
    }
  ];
  try {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(defaultUsers));
  } catch (e) {
    console.error('Failed to save default users', e);
  }
  return defaultUsers;
}

// Check configured Supabase credentials
export function getSupabaseCredentials() {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  const localUrl = localStorage.getItem(STORAGE_KEY_CUSTOM_URL) || '';
  const localKey = localStorage.getItem(STORAGE_KEY_CUSTOM_KEY) || '';

  const url = localUrl || envUrl;
  const key = localKey || envKey;

  const isReal = Boolean(url && key && url.startsWith('https://') && !url.includes('your-project-id'));

  return { url, key, isReal };
}

export function saveCustomSupabaseCredentials(url: string, key: string) {
  if (url) localStorage.setItem(STORAGE_KEY_CUSTOM_URL, url.trim());
  else localStorage.removeItem(STORAGE_KEY_CUSTOM_URL);

  if (key) localStorage.setItem(STORAGE_KEY_CUSTOM_KEY, key.trim());
  else localStorage.removeItem(STORAGE_KEY_CUSTOM_KEY);
}

// Real Supabase client instance (if configured)
let realSupabaseClient: SupabaseClient | null = null;
const { url, key, isReal } = getSupabaseCredentials();

if (isReal) {
  try {
    realSupabaseClient = createClient(url, key);
  } catch (e) {
    console.warn('Could not initialize real Supabase client, falling back to local simulation:', e);
  }
}

export const isLiveSupabase = () => Boolean(realSupabaseClient && getSupabaseCredentials().isReal);

/**
 * Robust Supabase wrapper providing unified API for both live Supabase
 * and the zero-friction local persistent engine.
 */
export const supabaseService = {
  // Auth Operations
  async signUp(email: string, password: string, name?: string) {
    if (isLiveSupabase() && realSupabaseClient) {
      const res = await realSupabaseClient.auth.signUp({
        email,
        password,
        options: { data: { name } }
      });
      return res;
    }

    // Local simulation
    const users = getStoredUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return { data: { user: null, session: null }, error: new Error('User already exists with this email address.') };
    }

    const newUser: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36),
      email,
      name: name || email.split('@')[0],
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || email)}`,
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));

    const session = {
      user: newUser,
      access_token: 'mock-jwt-token-' + Date.now(),
      expires_at: Date.now() + 86400000,
    };
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));

    return { data: { user: newUser, session }, error: null };
  },

  async signInWithPassword(email: string, _password: string) {
    if (isLiveSupabase() && realSupabaseClient) {
      return await realSupabaseClient.auth.signInWithPassword({ email, password: _password });
    }

    // Local simulation
    const users = getStoredUsers();
    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    // If logging in as demo user or first time user, auto-create
    if (!user && (email.toLowerCase() === DEMO_EMAIL || email.includes('@'))) {
      user = {
        id: email === DEMO_EMAIL ? DEMO_USER_ID : 'usr_' + Date.now(),
        email,
        name: email === DEMO_EMAIL ? 'Alex Rivera' : email.split('@')[0],
        avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(email)}`,
      };
      users.push(user);
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    }

    if (!user) {
      return { data: { user: null, session: null }, error: new Error('Invalid email or password.') };
    }

    const session = {
      user,
      access_token: 'mock-jwt-token-' + Date.now(),
      expires_at: Date.now() + 86400000,
    };
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));

    return { data: { user, session }, error: null };
  },

  async signOut() {
    if (isLiveSupabase() && realSupabaseClient) {
      return await realSupabaseClient.auth.signOut();
    }
    localStorage.removeItem(STORAGE_KEY_SESSION);
    return { error: null };
  },

  async resetPasswordForEmail(email: string) {
    if (isLiveSupabase() && realSupabaseClient) {
      return await realSupabaseClient.auth.resetPasswordForEmail(email);
    }
    // Simulated successful recovery email
    return { data: {}, error: null };
  },

  async getCurrentSession(): Promise<{ user: User | null; session: any }> {
    if (isLiveSupabase() && realSupabaseClient) {
      const { data, error } = await realSupabaseClient.auth.getSession();
      if (error || !data.session) return { user: null, session: null };
      const user: User = {
        id: data.session.user.id,
        email: data.session.user.email || '',
        name: data.session.user.user_metadata?.name || data.session.user.email?.split('@')[0],
        avatar_url: data.session.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.session.user.email || 'User')}`,
      };
      return { user, session: data.session };
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY_SESSION);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.user) return { user: parsed.user, session: parsed };
      }
    } catch (e) {
      console.error('Error reading session', e);
    }

    // Default to demo session for instant usability if nothing stored
    const demoUser = getStoredUsers()[0];
    const defaultSession = {
      user: demoUser,
      access_token: 'mock-jwt-demo',
      expires_at: Date.now() + 86400000,
    };
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(defaultSession));
    return { user: demoUser, session: defaultSession };
  },

  // Task Database Operations with RLS simulation
  async getTasks(userId: string): Promise<{ data: Task[] | null; error: any }> {
    if (isLiveSupabase() && realSupabaseClient) {
      const { data, error } = await realSupabaseClient
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      return { data: data as Task[], error };
    }

    const all = getStoredTasks();
    // Simulate RLS: only return tasks belonging to this user
    const userTasks = all.filter(t => t.user_id === userId);
    return { data: userTasks, error: null };
  },

  async createTask(taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Task | null; error: any }> {
    if (isLiveSupabase() && realSupabaseClient) {
      const { data, error } = await realSupabaseClient
        .from('tasks')
        .insert([taskData])
        .select()
        .single();
      return { data: data as Task, error };
    }

    const newTask: Task = {
      ...taskData,
      id: 'task_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const current = getStoredTasks();
    const updated = [newTask, ...current];
    saveStoredTasks(updated);
    return { data: newTask, error: null };
  },

  async updateTask(id: string, updates: Partial<Task>, userId: string): Promise<{ data: Task | null; error: any }> {
    if (isLiveSupabase() && realSupabaseClient) {
      const { data, error } = await realSupabaseClient
        .from('tasks')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', userId) // RLS check
        .select()
        .single();
      return { data: data as Task, error };
    }

    const all = getStoredTasks();
    const index = all.findIndex(t => t.id === id && t.user_id === userId);
    if (index === -1) {
      return { data: null, error: new Error('Task not found or access denied (RLS).') };
    }

    const updatedTask: Task = {
      ...all[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    all[index] = updatedTask;
    saveStoredTasks(all);
    return { data: updatedTask, error: null };
  },

  async deleteTask(id: string, userId: string): Promise<{ error: any }> {
    if (isLiveSupabase() && realSupabaseClient) {
      const { error } = await realSupabaseClient
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', userId); // RLS check
      return { error };
    }

    const all = getStoredTasks();
    const filtered = all.filter(t => !(t.id === id && t.user_id === userId));
    saveStoredTasks(filtered);
    return { error: null };
  },

  // Reset to initial demo dataset
  resetDemoData(userId: string) {
    const fresh = generateInitialTasks().map(t => ({ ...t, user_id: userId }));
    saveStoredTasks(fresh);
    return fresh;
  }
};
