// Security utilities for Finantalyst — masking, sanitization, password policy

/** Mask a PAN number: ABCDE1234F → XXXXX1234F */
export function maskPan(pan: string): string {
  if (!pan || pan.length !== 10) return pan;
  return "XXXXX" + pan.slice(5);
}

/** Mask an account number: show last 4 digits only */
export function maskAccount(acct: string): string {
  if (!acct || acct.length < 4) return "****";
  return "****" + acct.slice(-4);
}

/** Mask an email: user@example.com → us**@example.com */
export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const visible = local.slice(0, 2);
  return visible + "**@" + domain;
}

/** Validate password strength. Returns array of violation messages (empty = ok). */
export function checkPasswordStrength(password: string): string[] {
  const issues: string[] = [];
  if (password.length < 8)  issues.push("At least 8 characters");
  if (!/[A-Z]/.test(password)) issues.push("At least one uppercase letter");
  if (!/[0-9]/.test(password)) issues.push("At least one number");
  if (!/[^A-Za-z0-9]/.test(password)) issues.push("At least one special character (!@#$%^&* etc.)");
  return issues;
}

/** Returns true if the password meets minimum requirements */
export function isStrongPassword(password: string): boolean {
  return checkPasswordStrength(password).length === 0;
}
