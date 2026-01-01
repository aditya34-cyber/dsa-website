import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const getSignupEmailHtml = (confirmUrl: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your email - AlgoLearn</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0f172a;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #1e293b; border-radius: 16px; overflow: hidden;">
          <tr>
            <td style="padding: 40px 40px 20px;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #f8fafc; text-align: center;">
                🚀 Welcome to AlgoLearn!
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 40px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #94a3b8; text-align: center;">
                Thank you for signing up! Please verify your email address to get started with your algorithm learning journey.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 40px;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center">
                    <a href="${confirmUrl}" 
                       style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px;">
                      Verify Email Address
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 40px 20px;">
              <p style="margin: 0; font-size: 14px; color: #64748b; text-align: center;">
                Or copy and paste this link in your browser:
              </p>
              <p style="margin: 10px 0 0; font-size: 12px; color: #3b82f6; text-align: center; word-break: break-all;">
                ${confirmUrl}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 40px 40px;">
              <p style="margin: 0; font-size: 12px; color: #475569; text-align: center;">
                If you didn't create an account, you can safely ignore this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const getPasswordResetEmailHtml = (confirmUrl: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset your password - AlgoLearn</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0f172a;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #1e293b; border-radius: 16px; overflow: hidden;">
          <tr>
            <td style="padding: 40px 40px 20px;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #f8fafc; text-align: center;">
                🔐 Password Reset Request
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 40px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #94a3b8; text-align: center;">
                We received a request to reset your password. Click the button below to create a new password.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 40px;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center">
                    <a href="${confirmUrl}" 
                       style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #f97316, #ef4444); color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 40px 20px;">
              <p style="margin: 0; font-size: 14px; color: #64748b; text-align: center;">
                Or copy and paste this link in your browser:
              </p>
              <p style="margin: 10px 0 0; font-size: 12px; color: #f97316; text-align: center; word-break: break-all;">
                ${confirmUrl}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 40px 40px;">
              <p style="margin: 0; font-size: 12px; color: #475569; text-align: center;">
                If you didn't request a password reset, you can safely ignore this email. This link will expire in 1 hour.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const getMagicLinkEmailHtml = (confirmUrl: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login to AlgoLearn</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0f172a;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #1e293b; border-radius: 16px; overflow: hidden;">
          <tr>
            <td style="padding: 40px 40px 20px;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #f8fafc; text-align: center;">
                🔑 Magic Link Login
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 40px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #94a3b8; text-align: center;">
                Click the button below to log in to your AlgoLearn account.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 40px;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center">
                    <a href="${confirmUrl}" 
                       style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #10b981, #059669); color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px;">
                      Log In
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 40px 20px;">
              <p style="margin: 0; font-size: 14px; color: #64748b; text-align: center;">
                Or copy and paste this link in your browser:
              </p>
              <p style="margin: 10px 0 0; font-size: 12px; color: #10b981; text-align: center; word-break: break-all;">
                ${confirmUrl}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 40px 40px;">
              <p style="margin: 0; font-size: 12px; color: #475569; text-align: center;">
                If you didn't request this login link, you can safely ignore this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const getEmailChangeHtml = (confirmUrl: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm your email change - AlgoLearn</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0f172a;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #1e293b; border-radius: 16px; overflow: hidden;">
          <tr>
            <td style="padding: 40px 40px 20px;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #f8fafc; text-align: center;">
                ✉️ Confirm Email Change
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 40px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #94a3b8; text-align: center;">
                Please confirm your new email address by clicking the button below.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 40px;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center">
                    <a href="${confirmUrl}" 
                       style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px;">
                      Confirm Email Change
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 40px 20px;">
              <p style="margin: 0; font-size: 14px; color: #64748b; text-align: center;">
                Or copy and paste this link in your browser:
              </p>
              <p style="margin: 10px 0 0; font-size: 12px; color: #3b82f6; text-align: center; word-break: break-all;">
                ${confirmUrl}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 40px 40px;">
              <p style="margin: 0; font-size: 12px; color: #475569; text-align: center;">
                If you didn't request this email change, please secure your account immediately.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// Known email action types that we handle
const KNOWN_EMAIL_ACTIONS = ["signup", "recovery", "magiclink", "email_change"] as const;
type EmailActionType = typeof KNOWN_EMAIL_ACTIONS[number];

function isKnownEmailAction(action: string | undefined): action is EmailActionType {
  return typeof action === "string" && KNOWN_EMAIL_ACTIONS.includes(action as EmailActionType);
}

type AuthEmailHookPayload = {
  user?: { email?: string };
  email_data?: {
    token?: string;
    token_hash?: string;
    redirect_to?: string;
    email_action_type?: string;
    site_url?: string;
  };
};

const jsonHeaders = {
  "Content-Type": "application/json",
  ...corsHeaders,
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests quickly
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  // Supabase Auth Hooks call this with POST; return 200 quickly for anything else
  if (req.method !== "POST") {
    return new Response(JSON.stringify({}), { status: 200, headers: jsonHeaders });
  }

  try {
    // Treat Supabase Auth Email Hooks as trusted internal calls
    // (no webhook signature verification; parse JSON directly)
    const webhookData = (await req.json()) as AuthEmailHookPayload;

    const emailActionType = webhookData?.email_data?.email_action_type;

    // Strict branching: if missing/unknown, return 200 without sending
    if (!isKnownEmailAction(emailActionType)) {
      console.log(
        `send-auth-email: missing/unknown email_action_type: "${emailActionType}" (skipping send)`
      );
      return new Response(JSON.stringify({}), { status: 200, headers: jsonHeaders });
    }

    const toEmail = webhookData?.user?.email;
    const emailData = webhookData?.email_data;

    if (!toEmail || !emailData?.token_hash) {
      console.log("send-auth-email: missing user.email or email_data.token_hash (skipping send)");
      return new Response(JSON.stringify({}), { status: 200, headers: jsonHeaders });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? emailData.site_url;
    let redirectTo = emailData.redirect_to ?? emailData.site_url;

    // For recovery emails, redirect to the reset-password page
    if (emailActionType === "recovery" && redirectTo) {
      const baseUrl = new URL(redirectTo).origin;
      redirectTo = `${baseUrl}/reset-password`;
    }

    if (!supabaseUrl || !redirectTo) {
      console.log("send-auth-email: missing supabaseUrl or redirectTo (skipping send)");
      return new Response(JSON.stringify({}), { status: 200, headers: jsonHeaders });
    }

    const confirmUrl = `${supabaseUrl}/auth/v1/verify?token=${encodeURIComponent(
      emailData.token_hash
    )}&type=${encodeURIComponent(emailActionType)}&redirect_to=${encodeURIComponent(redirectTo)}`;

    let subject = "";
    let html = "";

    // Branch strictly on email_data.email_action_type (no default / no recovery fallback)
    switch (emailActionType) {
      case "signup":
        subject = "Verify your email - AlgoLearn";
        html = getSignupEmailHtml(confirmUrl);
        break;
      case "recovery":
        subject = "Reset your password - AlgoLearn";
        html = getPasswordResetEmailHtml(confirmUrl);
        break;
      case "magiclink":
        subject = "Your login link - AlgoLearn";
        html = getMagicLinkEmailHtml(confirmUrl);
        break;
      case "email_change":
        subject = "Confirm your email change - AlgoLearn";
        html = getEmailChangeHtml(confirmUrl);
        break;
      default:
        // Should be unreachable due to isKnownEmailAction(), but keep strict behavior
        return new Response(JSON.stringify({}), { status: 200, headers: jsonHeaders });
    }

    if (!Deno.env.get("RESEND_API_KEY")) {
      console.log("send-auth-email: RESEND_API_KEY not set (skipping send)");
      return new Response(JSON.stringify({}), { status: 200, headers: jsonHeaders });
    }

    try {
      await resend.emails.send({
        from: "AlgoLearn <no-reply@algvis.co.in>",
        to: [toEmail],
        subject,
        html,
      });

      console.log(`send-auth-email: sent ${emailActionType} email to ${toEmail}`);
    } catch (sendError) {
      console.error("send-auth-email: Resend send failed", sendError);
      // Always return 200 even if sending fails
    }

    return new Response(JSON.stringify({}), { status: 200, headers: jsonHeaders });
  } catch (error) {
    console.error("send-auth-email: failed to parse JSON body", error);
    // Always return 200 quickly
    return new Response(JSON.stringify({}), { status: 200, headers: jsonHeaders });
  }
};

serve(handler);
