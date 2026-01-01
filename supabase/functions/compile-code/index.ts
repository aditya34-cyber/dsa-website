import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// ============= SECURITY CONFIGURATION =============
const SECURITY_CONFIG = {
  // Maximum code size in characters (50KB)
  MAX_CODE_SIZE: 50000,
  // Maximum request body size in bytes (100KB)
  MAX_REQUEST_SIZE: 102400,
  // Allowed origins (set to specific domains in production)
  ALLOWED_ORIGINS: ['*'], // TODO: Replace with your actual domains
  // Rate limiting window in ms (1 minute)
  RATE_LIMIT_WINDOW: 60000,
  // Max requests per window per IP
  MAX_REQUESTS_PER_WINDOW: 30,
  // Execution timeout hint (Piston API has its own limits)
  EXECUTION_TIMEOUT_MS: 10000,
  // Maximum output size to return (prevent memory abuse)
  MAX_OUTPUT_SIZE: 100000,
};

// Simple in-memory rate limiter (resets on function cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(clientIP: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(clientIP);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(clientIP, { count: 1, resetTime: now + SECURITY_CONFIG.RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: SECURITY_CONFIG.MAX_REQUESTS_PER_WINDOW - 1 };
  }
  
  if (record.count >= SECURITY_CONFIG.MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, remaining: 0 };
  }
  
  record.count++;
  return { allowed: true, remaining: SECURITY_CONFIG.MAX_REQUESTS_PER_WINDOW - record.count };
}

// Sanitize output to prevent XSS and sensitive data exposure
function sanitizeOutput(output: string): string {
  if (!output) return '';
  
  // Truncate if too long
  let sanitized = output.length > SECURITY_CONFIG.MAX_OUTPUT_SIZE 
    ? output.substring(0, SECURITY_CONFIG.MAX_OUTPUT_SIZE) + '\n... (output truncated)'
    : output;
  
  // Remove potential sensitive patterns (file paths, env vars hints)
  sanitized = sanitized
    .replace(/\/home\/[^\s]+/g, '/[path-hidden]')
    .replace(/\/root\/[^\s]+/g, '/[path-hidden]')
    .replace(/password\s*[=:]\s*\S+/gi, 'password=[hidden]')
    .replace(/api[_-]?key\s*[=:]\s*\S+/gi, 'api_key=[hidden]')
    .replace(/secret\s*[=:]\s*\S+/gi, 'secret=[hidden]');
  
  return sanitized;
}

// Validate and sanitize code input
function validateCode(code: string, language: string): { valid: boolean; error?: string } {
  if (!code || typeof code !== 'string') {
    return { valid: false, error: 'Code must be a non-empty string' };
  }
  
  if (code.length > SECURITY_CONFIG.MAX_CODE_SIZE) {
    return { valid: false, error: `Code exceeds maximum size of ${SECURITY_CONFIG.MAX_CODE_SIZE} characters` };
  }
  
  // Check for obviously malicious patterns (basic protection - Piston has its own sandboxing)
  const dangerousPatterns = [
    /\beval\s*\(\s*require/i,
    /child_process/i,
    /\bexec\s*\(/i,
    /\bspawn\s*\(/i,
    /process\.env/i,
    /require\s*\(\s*['"]fs['"]\s*\)/i,
  ];
  
  // Only check for JS/TS as these patterns are JS-specific
  if (['javascript', 'typescript'].includes(language)) {
    for (const pattern of dangerousPatterns) {
      if (pattern.test(code)) {
        console.warn(`[SECURITY] Suspicious pattern detected in ${language} code`);
        // We log but don't block - Piston API is sandboxed
      }
    }
  }
  
  return { valid: true };
}

// Get client IP from request headers
function getClientIP(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
         req.headers.get('x-real-ip') || 
         'unknown';
}

// CORS headers with origin validation
function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowedOrigin = SECURITY_CONFIG.ALLOWED_ORIGINS.includes('*') 
    ? '*' 
    : (origin && SECURITY_CONFIG.ALLOWED_ORIGINS.includes(origin) ? origin : SECURITY_CONFIG.ALLOWED_ORIGINS[0]);
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Content-Security-Policy': "default-src 'none'",
  };
}

interface CompileRequest {
  language: string;
  code: string;
}

const languageVersionMap: Record<string, { language: string; version: string }> = {
  'cpp': { language: 'cpp', version: '10.2.0' },
  'c': { language: 'c', version: '10.2.0' },
  'python': { language: 'python', version: '3.10.0' },
  'javascript': { language: 'javascript', version: '18.15.0' },
  'typescript': { language: 'typescript', version: '5.0.3' },
  'java': { language: 'java', version: '15.0.2' },
};

serve(async (req) => {
  const clientIP = getClientIP(req);
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  const requestId = crypto.randomUUID().substring(0, 8);
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Only allow POST
  if (req.method !== 'POST') {
    console.warn(`[SECURITY][${requestId}] Invalid method: ${req.method} from ${clientIP}`);
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  
  // Check rate limit
  const rateCheck = checkRateLimit(clientIP);
  if (!rateCheck.allowed) {
    console.warn(`[SECURITY][${requestId}] Rate limit exceeded for ${clientIP}`);
    return new Response(
      JSON.stringify({ error: 'Too many requests. Please wait before trying again.' }),
      { 
        status: 429, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Retry-After': '60',
          'X-RateLimit-Remaining': '0',
        } 
      }
    );
  }

  try {
    // Check content length
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > SECURITY_CONFIG.MAX_REQUEST_SIZE) {
      console.warn(`[SECURITY][${requestId}] Request too large from ${clientIP}: ${contentLength} bytes`);
      return new Response(
        JSON.stringify({ error: 'Request body too large' }),
        { status: 413, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const body = await req.text();
    if (body.length > SECURITY_CONFIG.MAX_REQUEST_SIZE) {
      console.warn(`[SECURITY][${requestId}] Request body too large from ${clientIP}`);
      return new Response(
        JSON.stringify({ error: 'Request body too large' }),
        { status: 413, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    let parsedBody: CompileRequest;
    try {
      parsedBody = JSON.parse(body);
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { language, code } = parsedBody;

    // Validate language
    if (!language || typeof language !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Language is required and must be a string' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const languageConfig = languageVersionMap[language.toLowerCase()];
    if (!languageConfig) {
      return new Response(
        JSON.stringify({ error: `Unsupported language: ${language}. Allowed: ${Object.keys(languageVersionMap).join(', ')}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Validate code
    const codeValidation = validateCode(code, language.toLowerCase());
    if (!codeValidation.valid) {
      return new Response(
        JSON.stringify({ error: codeValidation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[${requestId}] Compiling ${language} code (${code.length} chars) from ${clientIP}`);

    // Call Piston API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), SECURITY_CONFIG.EXECUTION_TIMEOUT_MS);
    
    let response: Response;
    try {
      response = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: languageConfig.language,
          version: languageConfig.version,
          files: [{
            name: language === 'python' ? 'main.py' : 
                  language === 'java' ? 'Main.java' :
                  language === 'cpp' ? 'main.cpp' :
                  language === 'c' ? 'main.c' :
                  language === 'typescript' ? 'main.ts' : 'main.js',
            content: code,
          }],
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    const result = await response.json();

    if (!response.ok) {
      console.error(`[${requestId}] Piston API error:`, result);
      return new Response(
        JSON.stringify({ error: 'Compilation service temporarily unavailable' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Format and sanitize the output
    let output = '';
    if (result.run) {
      if (result.run.stdout) {
        output += result.run.stdout;
      }
      if (result.run.stderr) {
        output += (output ? '\n' : '') + 'Errors:\n' + result.run.stderr;
      }
      if (result.compile && result.compile.stderr) {
        output += (output ? '\n' : '') + 'Compilation warnings:\n' + result.compile.stderr;
      }
    }

    if (!output) {
      output = result.run?.code === 0 
        ? 'Code executed successfully (no output)' 
        : 'Execution completed with no output';
    }

    // Sanitize output before returning
    output = sanitizeOutput(output);
    
    console.log(`[${requestId}] Compilation successful, exit code: ${result.run?.code || 0}`);

    return new Response(
      JSON.stringify({ 
        output,
        exitCode: result.run?.code || 0 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'X-RateLimit-Remaining': rateCheck.remaining.toString(),
        } 
      }
    );

  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error(`[${requestId}] Execution timeout from ${clientIP}`);
      return new Response(
        JSON.stringify({ error: 'Execution timed out' }),
        { status: 504, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.error(`[SECURITY][${requestId}] Unexpected error from ${clientIP}:`, error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
