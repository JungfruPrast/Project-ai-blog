import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    // Generate a nonce for inline scripts and styles
    const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

    // Initialize the response to proceed with the request
    const response = NextResponse.next();

    // Security Headers
    // 1. Strict Transport Security (HSTS)
    response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");

    // 2. X-Frame-Options
    response.headers.set("X-Frame-Options", "DENY");

    // 3. Referrer-Policy
    response.headers.set("Referrer-Policy", "no-referrer-when-downgrade");

    // 4. Permissions-Policy
    response.headers.set("Permissions-Policy", "microphone=()");

    // 5. Content Security Policy (CSP)
    const cspHeader = `
        default-src 'self';
        script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
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
