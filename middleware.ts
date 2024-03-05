import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Generate a nonce for each request
    const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
    
    // Correctly define the CSP header using the nonce
    const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' https://www.googletagmanager.com https://www.google-analytics.com https://tagmanager.google.com https://www.google.com https://ssl.google-analytics.com https://www.gstatic.com 'unsafe-inline';
    img-src 'self' data: https://www.google-analytics.com https://ssl.gstatic.com https://www.gstatic.com;
    style-src 'self' 'unsafe-inline' https://tagmanager.google.com https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://www.google-analytics.com https://analytics.google.com;
    frame-src 'self' https://www.google.com;
    `.replace(/\s{2,}/g, " ").trim();
    
    // Create a response and set the CSP and nonce headers
    const response = NextResponse.next();
    response.headers.set('Content-Security-Policy', cspHeader);
    response.headers.set('x-nonce', nonce);
    
    return response;
}

// Configuration to specify which requests should apply the middleware
export const config = {
    matcher: [
        // Apply CSP to all paths except the specified exclusions
        { source: '/((?!api|_next/static|_next/image|favicon.ico).*)', },
    ],
};