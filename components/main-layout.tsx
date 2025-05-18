import type React from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import SearchBar from "@/components/search-bar"

interface MainLayoutProps {
  children: React.ReactNode
  showSearch?: boolean
  title?: string
  description?: string
}

export default function MainLayout({ children, showSearch = true, title, description }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8">
          {title && (
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">{title}</h1>
              {description && <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>}
            </div>
          )}

          {showSearch && <SearchBar className="mb-8" />}

          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}
