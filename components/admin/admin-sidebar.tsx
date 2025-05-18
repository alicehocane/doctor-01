"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Users, UserPlus, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useAuth()

  // Updated isActive function to handle nested routes correctly
  const isActive = (path: string) => {
    if (path === "/admin") {
      // Dashboard is active only when exactly at /admin
      return pathname === "/admin"
    } else if (path === "/admin/doctors") {
      // Lista de Médicos is active only when exactly at /admin/doctors
      return pathname === "/admin/doctors"
    } else if (path === "/admin/doctors/add") {
      // Agregar Médico is active only when exactly at /admin/doctors/add
      return pathname === "/admin/doctors/add"
    } else if (path === "/admin/utilities") {
      // Utilities is active for itself and any sub-pages
      return pathname === "/admin/utilities" || pathname?.startsWith("/admin/utilities/")
    }
    return false
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/admin/login")
    } catch (error) {
      console.error("Error signing out:", error)
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
        <Button variant="ghost" className="w-full justify-start hover:bg-accent/50" onClick={handleSignOut}>
          <LogOut className="h-5 w-5 mr-2" />
          <span>Cerrar Sesión</span>
        </Button>
      </div>
    </div>
  )
}
