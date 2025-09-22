import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  const isAuthenticated = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });
  const dashboard = request.nextUrl.pathname.startsWith("/dashboard");
  if (dashboard && !isAuthenticated) {
    return NextResponse.redirect(new URL("/auth", request.nextUrl.origin));
  }
  return NextResponse.next();
}

//Run middleware on the dashboard route
export const config = {
  matcher: ["/dashboard/:path*"],
};
//this middleware checks if the user is authenticated before allowing access to the dashboard route. If not authenticated, it redirects to the login page.
