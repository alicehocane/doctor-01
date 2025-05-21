"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Users, UserPlus, Settings, LogOut, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const isActive = (path: string) => {
    if (path === "/admin") return pathname === "/admin"
    if (path === "/admin/doctors") return pathname === "/admin/doctors"
    if (path === "/admin/doctors/add") return pathname === "/admin/doctors/add"
    if (path === "/admin/utilities") return pathname === "/admin/utilities" || pathname?.startsWith("/admin/utilities/")
    return false
  }

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await signOut()
      // Clear any session cookies
      document.cookie = "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      // Force a hard refresh to ensure all auth state is cleared
      window.location.href = "/admin/login"
    } catch (error) {
      console.error("Error signing out:", error)
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <div className="w-64 h-screen bg-background border-r border-border flex flex-col shadow-lg">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="font-semibold text-lg">Admin Panel</div>
      </div>

      <div className="flex-1 overflow-auto py-4">
        <nav className="space-y-1 px-2">
          <Link
            href="/admin"
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
              isActive("/admin")
                ? "bg-primary text-primary-foreground font-medium"
                : "text-foreground hover:bg-accent/50"
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/admin/doctors"
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
              isActive("/admin/doctors")
                ? "bg-primary text-primary-foreground font-medium"
                : "text-foreground hover:bg-accent/50"
            }`}
          >
            <Users className="h-5 w-5" />
            <span>Lista de Médicos</span>
          </Link>

          <Link
            href="/admin/doctors/add"
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
              isActive("/admin/doctors/add")
                ? "bg-primary text-primary-foreground font-medium"
                : "text-foreground hover:bg-accent/50"
            }`}
          >
            <UserPlus className="h-5 w-5" />
            <span>Agregar Médico</span>
          </Link>

          <Link
            href="/admin/utilities"
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
              isActive("/admin/utilities")
                ? "bg-primary text-primary-foreground font-medium"
                : "text-foreground hover:bg-accent/50"
            }`}
          >
            <Settings className="h-5 w-5" />
            <span>Utilidades</span>
          </Link>
        </nav>
      </div>

       <div className="p-4 border-t border-border">
        <Button 
          variant="ghost" 
          className="w-full justify-start hover:bg-accent/50" 
          onClick={handleSignOut}
          disabled={isSigningOut}
        >
          {isSigningOut ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              <span>Cerrando sesión...</span>
            </>
          ) : (
            <>
              <LogOut className="h-5 w-5 mr-2" />
              <span>Cerrar Sesión</span>
            </>
          )}
        </Button>
      </div>
    </div>
  )
}