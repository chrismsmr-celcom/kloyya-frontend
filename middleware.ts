import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 1. Vérifier si le cookie d'authentification Supabase est présent
  // Supabase nomme ce cookie "sb-<ref-projet>-auth-token"
  const hasAuth = request.cookies.getAll().some(cookie => 
    cookie.name.includes('auth-token')
  );

  const pathname = request.nextUrl.pathname;
  const isLoginPage = pathname === '/login';
  const isAuthCallback = pathname === '/auth/callback';

  // 2. Si l'utilisateur N'EST PAS connecté et essaie d'accéder à une page protégée
   if (!hasAuth && !isLoginPage && !isAuthCallback) { 
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // 3. Si l'utilisateur EST DÉJÀ connecté et essaie d'aller sur la page de login
  // (Pour éviter qu'un utilisateur connecté ne reste bloqué sur la page de login)
  if (hasAuth && isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/outcomes'; // Redirige vers la page principale de l'app
    return NextResponse.redirect(url);
  }

  // 4. Si tout est bon, on laisse la requête passer
  return NextResponse.next();
}

export const config = {
  // Appliquer ce middleware à toutes les routes, SAUF :
  // - les appels API (/api)
  // - les fichiers statiques de Next.js (_next)
  // - les images et favicons
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}
