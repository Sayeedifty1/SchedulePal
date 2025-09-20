import { NextRequest, NextResponse } from "next/server";
//next-env.d.ts
declare module "next/server" {
  interface NextRequest {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    auth: any;
  }
}
export default function middleware(request: NextRequest) {
  const isAuthenticated = !!request.auth;
  const dashboard = request.nextUrl.pathname.startsWith("/dashboard");
  if (dashboard && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.nextUrl.origin));
  }
  return NextResponse.next();
}

//Run middleware on the dashboard route
export const config = {
  matcher: ["/dashboard/:path*"],
};
//this middleware checks if the user is authenticated before allowing access to the dashboard route. If not authenticated, it redirects to the login page.
