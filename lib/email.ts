import { Resend } from "resend";

// Lazy — only instantiate when a key is actually present so the build
// doesn't throw when RESEND_API_KEY is absent from the environment.
let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY!);
  return _resend;
}
const FROM = process.env.EMAIL_FROM ?? "Finantalyst <noreply@finantalyst.in>";

// ── Templates ─────────────────────────────────────────────────

function baseLayout(body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Finantalyst</title></head>
<body style="margin:0;padding:0;background:#0d0f14;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0f14;padding:40px 20px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">
        <tr><td style="padding:0 0 24px">
          <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#6b7280">AI FINANCIAL OS</p>
          <h1 style="margin:4px 0 0;font-size:20px;font-weight:700;color:#f9fafb">Finantalyst</h1>
        </td></tr>
        <tr><td style="background:#161a23;border:1px solid #2a2d3a;border-radius:16px;padding:36px 40px">
          ${body}
        </td></tr>
        <tr><td style="padding:24px 0 0">
          <p style="margin:0;font-size:11px;color:#4b5563;line-height:1.6">
            Finantalyst is a financial planning tool. It does not provide tax advice, investment advice,
            or banking services. All estimates are for informational purposes only.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

// ── Email functions ───────────────────────────────────────────

export async function sendPasswordResetEmail(opts: { to: string; resetUrl: string; name?: string }) {
  const { to, resetUrl, name } = opts;

  const html = baseLayout(`
    <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#f9fafb">Reset your password</h2>
    <p style="margin:0 0 24px;font-size:15px;color:#9ca3af;line-height:1.6">
      Hi${name ? " " + name : ""},<br>
      Someone requested a password reset for your Finantalyst account.
      Click the button below to set a new password. This link expires in <strong style="color:#f9fafb">1 hour</strong>.
    </p>
    <a href="${resetUrl}" style="display:inline-block;background:#6366f1;color:#fff;text-decoration:none;font-size:14px;font-weight:600;padding:14px 28px;border-radius:10px">
      Reset password
    </a>
    <p style="margin:24px 0 0;font-size:13px;color:#6b7280;line-height:1.6">
      If you did not request this, you can safely ignore this email — your password will remain unchanged.<br>
      Or copy this link: <span style="color:#818cf8;word-break:break-all">${resetUrl}</span>
    </p>
  `);

  return getResend().emails.send({ from: FROM, to, subject: "Reset your Finantalyst password", html });
}

export async function sendWelcomeEmail(opts: { to: string; name?: string }) {
  const { to, name } = opts;

  const html = baseLayout(`
    <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#f9fafb">Welcome to Finantalyst</h2>
    <p style="margin:0 0 24px;font-size:15px;color:#9ca3af;line-height:1.6">
      Hi${name ? " " + name : ""},<br>
      Your account is ready. Here's what you can do right away:
    </p>
    <table cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 28px">
      ${[
        ["Tax Planning", "Add income sources and compare New vs Old regime for FY 2025-26"],
        ["Compliance Calendar", "Generate all your ITR, GST, and TDS due dates in 30 seconds"],
        ["AI CFO", "Ask anything about your finances — your personal CFO is always on"],
        ["Deal Room", "List your startup or find investment opportunities"],
      ].map(([title, desc]) => `
        <tr><td style="padding:10px 0;border-bottom:1px solid #2a2d3a">
          <p style="margin:0;font-size:14px;font-weight:600;color:#f9fafb">${title}</p>
          <p style="margin:2px 0 0;font-size:13px;color:#6b7280">${desc}</p>
        </td></tr>
      `).join("")}
    </table>
    <a href="https://finantalyst-v2.vercel.app/dashboard" style="display:inline-block;background:#6366f1;color:#fff;text-decoration:none;font-size:14px;font-weight:600;padding:14px 28px;border-radius:10px">
      Open your dashboard
    </a>
  `);

  return getResend().emails.send({ from: FROM, to, subject: "Welcome to Finantalyst — your AI CFO is ready", html });
}

export async function sendEmail(opts: { to: string; subject: string; html: string }) {
  return getResend().emails.send({ from: FROM, ...opts });
}

/** Returns true if Resend is configured (key present and not the placeholder) */
export function isEmailConfigured(): boolean {
  const key = process.env.RESEND_API_KEY;
  return Boolean(key && key.startsWith("re_") && key.length > 10);
}
