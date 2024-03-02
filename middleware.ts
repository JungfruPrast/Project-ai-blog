import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const response = NextResponse.next();

    // 1. Strict Transport Security (HSTS)
    response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");

    // 3. X-Frame-Options
    response.headers.set("X-Frame-Options", "DENY");

    // 4. Referrer-Policy
    response.headers.set("Referrer-Policy", "no-referrer-when-downgrade");

    // 5. Permissions-Policy
    response.headers.set("Permissions-Policy", "microphone=()");

    return response;
}
