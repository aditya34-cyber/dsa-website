# Backend Architecture Documentation

## Overview

This project uses **Supabase** as the backend, providing authentication, database, and edge functions for code compilation.

---

## 1. Authentication System (Login/Signup)

### How It Works

The authentication flow uses **Supabase Auth** with email/password credentials.

### Files Involved

- `src/pages/Auth.tsx` - Login/Signup UI
- `src/integrations/supabase/client.ts` - Supabase client configuration
- Database: `profiles` table

### Authentication Flow

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   User      │────▶│  Auth.tsx Page   │────▶│  Supabase Auth  │
│ (Browser)   │     │  (React Form)    │     │   (Backend)     │
└─────────────┘     └──────────────────┘     └─────────────────┘
                                                      │
                                                      ▼
                                             ┌─────────────────┐
                                             │ auth.users table│
                                             │ (Supabase mgd)  │
                                             └─────────────────┘
                                                      │
                                                      ▼ (trigger)
                                             ┌─────────────────┐
                                             │ profiles table  │
                                             │ (public schema) │
                                             └─────────────────┘
```

### Signup Process

1. User enters email, password, and username in `Auth.tsx`
2. `supabase.auth.signUp()` is called with credentials
3. Supabase creates a new user in `auth.users` table
4. A database trigger (`handle_new_user`) automatically creates a profile:

```sql
CREATE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, user_id, username)
  VALUES (
    gen_random_uuid(),
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$;
```

### Login Process

1. User enters email and password
2. `supabase.auth.signInWithPassword()` validates credentials
3. Supabase returns a session with JWT tokens
4. Session is stored in `localStorage` automatically
5. User is redirected to home page

### Session Management

```typescript
// Listening for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  setSession(session);
  setUser(session?.user ?? null);
});

// Getting current session
const { data: { session } } = await supabase.auth.getSession();
```

### Profiles Table Schema

| Column     | Type        | Description                    |
|------------|-------------|--------------------------------|
| id         | uuid        | Primary key                    |
| user_id    | uuid        | Reference to auth.users        |
| username   | text        | User's display name            |
| created_at | timestamptz | Account creation time          |
| updated_at | timestamptz | Last update time               |

### Row Level Security (RLS)

```sql
-- Anyone can view profiles
CREATE POLICY "Profiles are viewable by everyone"
ON profiles FOR SELECT USING (true);

-- Users can only insert their own profile
CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own profile
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE USING (auth.uid() = user_id);
```

---

## 2. Code Compilation System

### How It Works

Code compilation uses a **Supabase Edge Function** that proxies requests to the **Piston API** (a free code execution engine).

### Files Involved

- `src/components/CodeEditor.tsx` - Monaco editor UI
- `supabase/functions/compile-code/index.ts` - Edge function for compilation
- `supabase/config.toml` - Edge function configuration

### Compilation Flow

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐     ┌─────────────┐
│   User      │────▶│  CodeEditor.tsx  │────▶│  Edge Function  │────▶│ Piston API  │
│ (Browser)   │     │  (Run Button)    │     │  compile-code   │     │ (External)  │
└─────────────┘     └──────────────────┘     └─────────────────┘     └─────────────┘
                                                                            │
                                                                            ▼
                                                                     ┌─────────────┐
                                                                     │   Output    │
                                                                     │  (stdout)   │
                                                                     └─────────────┘
```

### Supported Languages

| Language   | Version  | Runtime |
|------------|----------|---------|
| C          | 10.2.0   | gcc     |
| C++        | 10.2.0   | g++     |
| Python     | 3.10.0   | python3 |
| JavaScript | 18.15.0  | node    |
| TypeScript | 5.0.3    | ts-node |
| Java       | 15.0.2   | javac   |

### Edge Function Code

```typescript
// supabase/functions/compile-code/index.ts

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const { code, language } = await req.json();

  // Map language to Piston API format
  const languageMap = {
    'c': { language: 'c', version: '10.2.0' },
    'cpp': { language: 'cpp', version: '10.2.0' },
    // ... other languages
  };

  // Call Piston API
  const response = await fetch('https://emkc.org/api/v2/piston/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      language: langConfig.language,
      version: langConfig.version,
      files: [{ content: code }]
    })
  });

  // Return result
  return new Response(JSON.stringify(result), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
});
```

### Client-Side Usage

```typescript
// In CodeEditor.tsx
const response = await supabase.functions.invoke('compile-code', {
  body: { code, language }
});

if (response.data?.output) {
  setOutput(response.data.output);
}
```

---

## 3. File Storage (Current State)

### ⚠️ Important Note

**Currently, user code files are NOT being persisted/saved to the database.**

The CodeEditor component:
- Stores code in React state (temporary, in-memory)
- Compiles and runs code on-demand
- Code is lost when the page is refreshed

### Future Implementation (If Needed)

To save user files, you would need:

1. **Create a `user_files` table:**

```sql
CREATE TABLE public.user_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  filename text NOT NULL,
  language text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.user_files ENABLE ROW LEVEL SECURITY;

-- Users can only access their own files
CREATE POLICY "Users can CRUD their own files"
ON user_files FOR ALL USING (auth.uid() = user_id);
```

2. **Save file from CodeEditor:**

```typescript
const saveFile = async () => {
  const { error } = await supabase
    .from('user_files')
    .upsert({
      user_id: user.id,
      filename: 'main.cpp',
      language: 'cpp',
      content: code
    });
};
```

3. **Load user's files:**

```typescript
const loadFiles = async () => {
  const { data } = await supabase
    .from('user_files')
    .select('*')
    .eq('user_id', user.id);
};
```

---

## Summary

| Feature        | Backend Service      | Storage Location       |
|----------------|---------------------|------------------------|
| Authentication | Supabase Auth       | auth.users table       |
| User Profiles  | Supabase Database   | public.profiles table  |
| Code Execution | Supabase Edge Fn    | Piston API (external)  |
| User Files     | ❌ Not implemented  | N/A                    |

---

## Environment Variables

The Supabase client uses these values (already configured):

- `SUPABASE_URL`: https://ydmqeelcrhyzyuhshvfa.supabase.co
- `SUPABASE_ANON_KEY`: (public key for client-side access)

Edge functions have access to:
- `SUPABASE_SERVICE_ROLE_KEY`: (for admin operations)
- `SUPABASE_DB_URL`: (direct database connection)
