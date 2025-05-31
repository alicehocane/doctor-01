// app/layout.tsx

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"

// 1. Import Header and SearchBar
import SearchBar from "@/components/search-bar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Busca Doctor México | Encuentra médicos de confianza en México",
  description:
    "Encuentra médicos de confianza por ciudad, especialidad o padecimientos atendidos en México.",
  keywords: "médicos, doctores, especialistas, México, directorio médico",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {/* ─────────── Sticky Header ─────────── */}
            <Header />

            {/* ─────────── Sticky Search Bar ───────────
                - Assumes Header’s height is ~4rem (Tailwind’s top-16 = 4rem)
                - Adjust “top-16” if your header’s actual height differs
                - z-40 keeps it just below the header (which uses z-50)
            */}
            <div className="sticky top-16 z-40 bg-background border-b shadow-sm">
              <div className="container mx-auto px-4 py-2">
                <SearchBar />
              </div>
            </div>

            {/* ─────────── Main Content ─────────── */}
            <main className="container mx-auto px-4 py-6">
              {children}
            </main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
