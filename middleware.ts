// File: /middleware.ts (or /middleware.js)

import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    // Generate a nonce for inline scripts and styles
    const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

    // Initialize the response to proceed with the request
    const response = NextResponse.next();

    // Security Headers
    response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("Referrer-Policy", "no-referrer-when-downgrade");
    response.headers.set("Permissions-Policy", "microphone=()");

    // Content Security Policy (CSP) with nonce
    const cspHeader = `
        default-src 'self';
        script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://project-ai-blog.vercel.app/_next/static/chunks/;
        style-src 'self' 'nonce-${nonce}';
        img-src 'self' blob: data:;
        font-src 'self';
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'none';
        block-all-mixed-content;
        upgrade-insecure-requests;
    `.replace(/\s{2,}/g, " ").trim();

    response.headers.set("Content-Security-Policy", cspHeader);

    return response;
}

export const config = {
  matcher: [
    '/:slug*', // Assuming dynamic [slug].tsx under the app folder or specific handling
    '/posts/:path*', // Assuming /app/posts folder with index.tsx or [...path].tsx for nested routes
    '/tag/:path*', // Assuming /app/tag folder with index.tsx or [...path].tsx for nested routes
    '/seodocuments/:path*', // Assuming /app/seodocuments folder with index.tsx or [...path].tsx for nested routes
  ],
};
