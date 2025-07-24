"use client"

import { LoginForm } from "@/components/LoginForm"
import { SimpleThemeToggle } from "@/components/ui/theme-toggle"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">WC</span>
          </div>
          <span className="text-xl font-bold text-foreground">Werms Central Bank</span>
        </div>
        
        <div className="flex items-center gap-4">
          <SimpleThemeToggle />
        </div>
      </nav>

      {/* Login Form - Centered */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </main>
    </div>
  )
}
