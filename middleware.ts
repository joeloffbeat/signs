import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const sessionToken =
    req.cookies.get('next-auth.session-token')?.value ??
    req.cookies.get('__Secure-next-auth.session-token')?.value
  if (!sessionToken && req.nextUrl.pathname === '/readings') {
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

export const config = { matcher: ['/readings'] }
