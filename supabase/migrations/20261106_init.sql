-- TaskFlow Supabase PostgreSQL Schema & Security Policies
-- Migration: 20261106_init.sql

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create priority and category enums (or check constraints)
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    priority TEXT NOT NULL CHECK (priority IN ('HIGH', 'MEDIUM', 'LOW')),
    category TEXT NOT NULL CHECK (category IN ('Work', 'Personal', 'Study', 'Projects')),
    due_date TIMESTAMPTZ,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for lightning fast queries and filtering
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON public.tasks(completed);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON public.tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_category ON public.tasks(category);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_user_completed_due ON public.tasks(user_id, completed, due_date);

-- Trigger for auto-updating updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_tasks_updated_at ON public.tasks;
CREATE TRIGGER trigger_tasks_updated_at
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- 1. SELECT Policy: Authenticated users can only read their own tasks
CREATE POLICY "Users can view their own tasks"
    ON public.tasks
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- 2. INSERT Policy: Authenticated users can only insert tasks where user_id matches their auth ID
CREATE POLICY "Users can create their own tasks"
    ON public.tasks
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- 3. UPDATE Policy: Authenticated users can only update their own tasks
CREATE POLICY "Users can update their own tasks"
    ON public.tasks
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 4. DELETE Policy: Authenticated users can only delete their own tasks
CREATE POLICY "Users can delete their own tasks"
    ON public.tasks
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
