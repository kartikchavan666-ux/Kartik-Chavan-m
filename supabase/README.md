# TaskFlow - Supabase & Vercel Setup Guide

## 1. Supabase Project Setup
1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Navigate to the **SQL Editor** in your Supabase dashboard.
3. Open `supabase/migrations/20261106_init.sql` and run the entire script. This creates:
   - The `tasks` table with UUID keys, constraints, and indexes.
   - Row Level Security (RLS) policies ensuring users can only read, insert, update, and delete their own tasks.
   - Automatic `updated_at` trigger.
4. In **Project Settings** > **API**, copy:
   - **Project URL**
   - **anon / public key**
   *(Never share or commit the `service_role` secret key!)*

## 2. Environment Variables
Add the following to your local `.env` or Vercel Environment Variables:
```env
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"
```

## 3. Deploying to Vercel
1. Push your repository to GitHub.
2. In Vercel, click **Add New Project** and import the repository.
3. Framework Preset: **Vite**
4. Set Build Command: `npm run build`
5. Set Output Directory: `dist`
6. Add the two environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
7. Click **Deploy**!
