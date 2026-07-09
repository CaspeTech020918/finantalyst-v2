import type { NextConfig } from "next";

const SECURITY_HEADERS = [
  // Prevent clickjacking
  { key: "X-Frame-Options",        value: "DENY" },
  // Prevent MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Minimal referrer info on cross-origin requests
  { key: "Referrer-Policy",        value: "strict-origin-when-cross-origin" },
  // Disable camera, mic, geolocation by default
  { key: "Permissions-Policy",     value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  // Enforce HTTPS for 1 year (Vercel already does HTTPS, belt-and-suspenders)
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  // Legacy XSS filter (still respected by some browsers)
  { key: "X-XSS-Protection",       value: "1; mode=block" },
  // Cross-origin opener policy — prevents tabnapping
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: SECURITY_HEADERS,
      },
    ];
  },
};

export default nextConfig;
