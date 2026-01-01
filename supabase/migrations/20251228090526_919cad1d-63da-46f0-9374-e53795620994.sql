-- Add constraint to ensure username is not empty and has reasonable length
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_username_length 
CHECK (char_length(username) >= 1 AND char_length(username) <= 50);

-- Add index for faster user_id lookups
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);

-- Create a secure user_files table for future code storage
CREATE TABLE public.user_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  language TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Constraints
  CONSTRAINT user_files_name_length CHECK (char_length(name) >= 1 AND char_length(name) <= 255),
  CONSTRAINT user_files_code_length CHECK (char_length(code) <= 100000),
  CONSTRAINT user_files_language_valid CHECK (language IN ('c', 'cpp', 'python', 'javascript', 'typescript', 'java')),
  CONSTRAINT user_files_unique_name_per_user UNIQUE (user_id, name)
);

-- Enable RLS on user_files
ALTER TABLE public.user_files ENABLE ROW LEVEL SECURITY;

-- Strict user-scoped RLS policies
CREATE POLICY "Users can view their own files"
ON public.user_files FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own files"
ON public.user_files FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own files"
ON public.user_files FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own files"
ON public.user_files FOR DELETE
USING (auth.uid() = user_id);

-- Add index for performance
CREATE INDEX idx_user_files_user_id ON public.user_files(user_id);

-- Trigger for automatic updated_at
CREATE TRIGGER update_user_files_updated_at
BEFORE UPDATE ON public.user_files
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();