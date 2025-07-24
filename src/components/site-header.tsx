import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { SimpleThemeToggle } from "@/components/ui/theme-toggle"

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        
        {/* Banking Brand */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-brand-500 to-brand-600 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-xs">W</span>
          </div>
          <h1 className="text-base font-medium">Worms Bank</h1>
        </div>
        
        <div className="ml-auto flex items-center gap-2">
          <SimpleThemeToggle />
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <Link href="/" className="dark:text-foreground">
              Back to Login
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
