import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set(name, value, options)
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set(name, '', { ...options, maxAge: 0 })
        },
      },
    }
  )

  try {
    const { data: { session }, error } = await supabase.auth.getSession()

    // Protected routes
    if (request.nextUrl.pathname.startsWith('/dashboard') || 
        request.nextUrl.pathname.startsWith('/inventory') ||
        request.nextUrl.pathname.startsWith('/orders') ||
        request.nextUrl.pathname.startsWith('/customers') ||
        request.nextUrl.pathname.startsWith('/suppliers') ||
        request.nextUrl.pathname.startsWith('/analytics') ||
        request.nextUrl.pathname.startsWith('/settings')) {
      
      // If there's no session or an error, redirect to landing page
      if (!session || error) {
        // Clear any invalid session cookies
        response.cookies.set('sb-access-token', '', { maxAge: 0 })
        response.cookies.set('sb-refresh-token', '', { maxAge: 0 })
        
        return NextResponse.redirect(new URL('/', request.url))
      }
    }

    // Auth routes - redirect to dashboard if already logged in
    if ((request.nextUrl.pathname === '/login' || 
         request.nextUrl.pathname === '/signup' ||
         request.nextUrl.pathname === '/forgot-password') && 
        session) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  } catch (error) {
    // If there's an error checking the session, treat as unauthenticated
    if (request.nextUrl.pathname.startsWith('/dashboard') || 
        request.nextUrl.pathname.startsWith('/inventory') ||
        request.nextUrl.pathname.startsWith('/orders') ||
        request.nextUrl.pathname.startsWith('/customers') ||
        request.nextUrl.pathname.startsWith('/suppliers') ||
        request.nextUrl.pathname.startsWith('/analytics') ||
        request.nextUrl.pathname.startsWith('/settings')) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}