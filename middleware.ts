import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Define paths that are considered public (accessible without authentication)
  const isPublicPath = path === "/admin/login"

  // Skip middleware for the login page
  if (isPublicPath) {
    return NextResponse.next()
  }

  // Get the token from the cookies
  const token = request.cookies.get("session")?.value || ""

  // Redirect logic for admin routes
  if (path.startsWith("/admin") && !token) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  return NextResponse.next()
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: ["/admin/:path*"],
}
