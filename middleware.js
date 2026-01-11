import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname.startsWith('/login');
  const isPublic = isLogin || pathname.startsWith('/_next') || pathname.startsWith('/favicon');

  if (isPublic) return NextResponse.next();

  const hasSession = request.cookies.get('pl_session');
  if (!hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api).*)']
};
