# Security Hardening Guide

This document outlines the security measures implemented in AlgoLearn and provides guidance for further hardening.

---

## 1. Database Security (Row Level Security)

### Current RLS Policies on `profiles` Table

| Policy                             | Command | Check                  |
| ---------------------------------- | ------- | ---------------------- |
| Profiles are viewable by everyone  | SELECT  | `true` (public read)   |
| Users can insert their own profile | INSERT  | `auth.uid() = user_id` |
| Users can update their own profile | UPDATE  | `auth.uid() = user_id` |

### Recommendations

1. **Enable RLS on ALL tables** - Every new table must have RLS enabled:

   ```sql
   ALTER TABLE public.your_table ENABLE ROW LEVEL SECURITY;
   ```

2. **User-scoped policies** - Always use `auth.uid()` for user-specific data:

   ```sql
   CREATE POLICY "Users can only see their own data"
   ON public.user_files FOR SELECT
   USING (auth.uid() = user_id);
   ```

3. **Avoid permissive SELECT policies** - The current `profiles` SELECT policy allows anyone to view all profiles. Consider restricting if profiles contain sensitive data.

---

## 2. Database Constraints

### Required Constraints for Data Integrity

```sql
-- Example for future user_files table
CREATE TABLE public.user_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (char_length(name) <= 255),
  code TEXT NOT NULL CHECK (char_length(code) <= 100000),
  language TEXT NOT NULL CHECK (language IN ('c', 'cpp', 'python', 'javascript', 'typescript', 'java')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Prevent duplicate file names per user
  UNIQUE (user_id, name)
);

-- Add index for common queries
CREATE INDEX idx_user_files_user_id ON public.user_files(user_id);
```

---

## 3. Authentication Security

### Supabase Dashboard Settings (Manual Configuration Required)

Navigate to **Authentication > Settings** in your Supabase dashboard:

| Setting                    | Recommended Value                       | Location          |
| -------------------------- | --------------------------------------- | ----------------- |
| Enable email confirmations | ✅ ON                                   | Email Settings    |
| Minimum password length    | 8+ characters                           | Password Settings |
| Password requirements      | Require uppercase, number, special char | Password Settings |
| Session lifetime           | 3600 seconds (1 hour)                   | JWT Settings      |
| Rate limiting              | Enable                                  | Rate Limiting     |

### Email Confirmation

Enable in Supabase Dashboard: **Authentication > Providers > Email > Confirm email**

### Strong Password Policy

Configure in **Authentication > Settings**:

- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 number
- At least 1 special character

---

## 4. Edge Function Security

### Implemented in `compile-code` Function

| Security Measure    | Implementation                                          |
| ------------------- | ------------------------------------------------------- |
| Rate Limiting       | 30 requests per minute per IP                           |
| Request Size Limit  | 100KB max request body                                  |
| Code Size Limit     | 50KB max code size                                      |
| Output Sanitization | Removes sensitive patterns (paths, passwords, API keys) |
| Output Truncation   | 100KB max output size                                   |
| Timeout             | 10 second execution timeout                             |
| Input Validation    | Language whitelist, code type checking                  |
| Security Headers    | X-Content-Type-Options, X-Frame-Options, CSP            |
| Logging             | Request IDs, IP tracking, suspicious activity alerts    |

### JWT Verification

The `compile-code` function has `verify_jwt = false` because:

- It's a public code execution service
- Rate limiting provides abuse protection
- The Piston API itself is sandboxed

For authenticated endpoints, always use:

```toml
[functions.your-function]
verify_jwt = true
```

---

## 5. CORS Configuration

### Current Setting

```typescript
ALLOWED_ORIGINS: ["*"]; // Currently allows all origins
```

```

---

## 6. Secrets Management

### Never Expose in Client Code
- `SUPABASE_SERVICE_ROLE_KEY` - Never use in frontend
- API keys for external services
- Database connection strings

### Current Secrets (Edge Functions Only)
| Secret | Usage |
|--------|-------|
| SUPABASE_URL | Edge function Supabase access |
| SUPABASE_ANON_KEY | Edge function client access |
| SUPABASE_SERVICE_ROLE_KEY | Admin operations (edge functions only) |

---

## 7. Code Execution Pipeline Security

### Piston API Sandboxing
The Piston API provides:
- Isolated Docker containers per execution
- No network access from executed code
- Limited CPU and memory
- Automatic cleanup

### Additional Protections in Edge Function
1. **Pattern detection** - Logs suspicious code patterns
2. **Output sanitization** - Removes sensitive data from output
3. **Size limits** - Prevents resource exhaustion
4. **Rate limiting** - Prevents abuse

---

## 8. Monitoring & Logging

### Current Logging
- Request IDs for tracing
- Client IP tracking
- Security warnings for suspicious activity
- Execution results and timing

### View Logs
Supabase Dashboard: **Edge Functions > compile-code > Logs**

---

## 9. Security Checklist

### Immediate Actions (Supabase Dashboard)
- [ ] Enable email confirmation
- [ ] Set minimum password length to 8+
- [ ] Configure password complexity requirements
- [ ] Set session lifetime to 1 hour
- [ ] Enable rate limiting

### Code-Level (Already Implemented)
- [x] Input validation in edge functions
- [x] Rate limiting in edge functions
- [x] Request size limits
- [x] Output sanitization
- [x] Security headers
- [x] Comprehensive logging

### Future Considerations
- [ ] Restrict CORS to specific origins
- [ ] Add CAPTCHA for public endpoints
- [ ] Implement user file storage with RLS
- [ ] Add admin role system if needed
- [ ] Set up alerting for suspicious patterns

---

## 10. Incident Response

If you detect suspicious activity:

1. Check edge function logs for patterns
2. Identify affected IP addresses
3. Consider temporarily restricting access
4. Review and strengthen rate limits
5. Update CORS if needed

---

*Last updated: December 2024*
```
