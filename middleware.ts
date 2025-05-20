import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Get the token from the cookies
  const token = request.cookies.get("session")?.value || ""

  // Define paths that are considered public (accessible without authentication)
  const isPublicPath = path === "/admin/login"

  // If user is already authenticated and tries to access login page, redirect to admin page
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  // If user is not authenticated and tries to access protected admin routes, redirect to login
  if (path.startsWith("/admin") && !isPublicPath && !token) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  return NextResponse.next()
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: ["/admin/:path*"],
}