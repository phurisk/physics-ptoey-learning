import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isAdminPage = pathname.startsWith('/admin')
  const isAdminApi = pathname.startsWith('/api/admin')
  const needsAuth =
    pathname.startsWith('/checkout') ||
    pathname === '/orders' || pathname.startsWith('/orders/') ||
    pathname === '/enrollments' || pathname.startsWith('/enrollments/') ||
    pathname === '/my-courses' || pathname.startsWith('/my-courses/')

  // Fast-path: no protection needed
  if (!isAdminPage && !isAdminApi && !needsAuth) {
    return NextResponse.next()
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  // If the route requires auth (general user), ensure signed-in
  if (needsAuth && !token) {
    // Redirect to login page with callback and a message flag
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.search = ''
    url.searchParams.set('callbackUrl', req.nextUrl.href)
    url.searchParams.set('msg', 'login_required')
    return NextResponse.redirect(url)
  }

  // Admin page/api: require admin role
  if (isAdminPage || isAdminApi) {
    if (!token) {
      if (isAdminApi) {
        return new NextResponse(
          JSON.stringify({ success: false, error: 'Unauthorized' }),
          { status: 401, headers: { 'content-type': 'application/json' } }
        )
      }
      const url = req.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('callbackUrl', req.nextUrl.href)
      return NextResponse.redirect(url)
    }
    if (token.role !== 'ADMIN') {
      if (isAdminApi) {
        return new NextResponse(
          JSON.stringify({ success: false, error: 'Forbidden' }),
          { status: 403, headers: { 'content-type': 'application/json' } }
        )
      }
      const url = req.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/checkout/:path*',
    '/orders',
    '/orders/:path*',
    '/enrollments',
    '/enrollments/:path*',
    '/my-courses',
    '/my-courses/:path*',
  ],
}
