"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import AdminSidebar from "@/components/admin/admin-sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [redirecting, setRedirecting] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!loading) {
      setAuthChecked(true)
    }
  }, [loading])

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null

    if (authChecked) {
      if (pathname !== "/admin/login") {
        // Set a timeout to prevent infinite loading
        timeoutId = setTimeout(() => {
          if (loading) {
            console.log("Auth loading timed out, redirecting to login")
            router.push("/admin/login")
          }
        }, 3000)

        if (!loading && !user) {
          setRedirecting(true)
          router.push("/admin/login")
        }
      }
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [user, loading, router, pathname, authChecked])

  // Close sidebar when changing routes on mobile
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  // Skip auth check for login page
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  if (loading || !authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (redirecting || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen relative">
      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-background shadow-md"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - hidden on mobile unless toggled */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 bg-background shadow-xl
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <AdminSidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 md:p-6 lg:p-8 md:ml-0 pt-16 md:pt-6">{children}</div>
    </div>
  )
}
