import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Content Security Policy for the Next.js HTML pages.
// connect-src must include the backend API URL so axios requests are allowed.
// Note: script-src includes 'unsafe-inline' because Next.js App Router injects
// inline hydration scripts. For full script-src tightening, add a nonce-based
// middleware (see Next.js docs on CSP with nonces).
const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self' ${apiUrl}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ');

const nextConfig: NextConfig = {
  devIndicators: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevent the page from being framed (clickjacking protection)
          { key: 'X-Frame-Options', value: 'DENY' },
          // Prevent MIME-type sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Disable legacy XSS Auditor (replaced by CSP)
          { key: 'X-XSS-Protection', value: '0' },
          // Control referrer header
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Restrict browser feature access
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          // Content Security Policy
          { key: 'Content-Security-Policy', value: cspDirectives },
        ],
      },
    ];
  },
};

export default nextConfig;
