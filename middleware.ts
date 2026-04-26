import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname === '/readings') {
    return NextResponse.redirect(new URL('/login', req.url))
  }
})

export const config = { matcher: ['/readings'] }
