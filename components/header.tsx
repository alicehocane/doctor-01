"use client"
import SearchBar from "@/components/search-bar"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Header() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isActive = (path: string) => pathname === path

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/about", label: "Acerca de" },
    { href: "/contact", label: "Contacto" },
    // { href: "/admin", label: "Admin" },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row items-center gap-4">
        {/* ─────────── Logo & Brand ─────────── */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link href="/" className="text-xl md:text-2xl font-bold text-primary">
            Busca Doctor México
          </Link>

          {/* Mobile “hamburger” + ModeToggle */}
          <div className="flex items-center md:hidden">
            <ModeToggle />
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                {/* ─────────── Mobile Nav Links ─────────── */}
                <nav className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`text-base py-2 hover:text-primary transition-colors ${
                        isActive(link.href)
                          ? "font-medium text-primary"
                          : "text-muted-foreground"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                {/* ─────────── Mobile Search Bar ───────────
                    We can also show the SearchBar inside the sheet for mobile users.
                    If you don't want search here, simply remove the following:
                */}
                <div className="mt-6 px-2">
                  <SearchBar className="w-full" />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* ─────────── Desktop Search + Nav ─────────── */}
        <div className="hidden md:flex md:items-center md:justify-between md:w-full gap-6">
          {/* ──── Desktop: Search Bar ──── */}
          <div className="w-full max-w-md">
            <SearchBar className="w-full" />
          </div>

          {/* ──── Desktop: Navigation Links + ModeToggle ──── */}
          <nav className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm hover:text-primary transition-colors ${
                  isActive(link.href)
                    ? "font-medium text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}