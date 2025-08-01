// middleware.js
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    const token = req.cookies.get('authtoken');

    const protectedRoutes = ['/'];
    
    
    if (protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
        // console.log("running");

        if (!token) {
            return NextResponse.redirect(new URL('/register', req.url));
        }
    }

    return NextResponse.next();
}


export const config = {
    matcher: ["/"],
};