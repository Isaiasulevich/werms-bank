"use client"

import Link from "next/link"
import { useState } from "react"
import { IconPlus } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { SimpleThemeToggle } from "@/components/ui/theme-toggle"
import { AddPolicyDialog } from "@/features/policies"

export function SiteHeader() {
  const [showAddPolicyDialog, setShowAddPolicyDialog] = useState(false)

  return (
    <>
      <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          
          <div className="ml-auto flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowAddPolicyDialog(true)}
              className="bg-card hover:bg-card/80 border-border text-muted-foreground hover:text-foreground hidden sm:flex items-center gap-1.5"
            >
              <IconPlus className="h-3.5 w-3.5" />
              <span className="text-xs">Policy</span>
            </Button>
            <SimpleThemeToggle />
            <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
              <Link href="/" className="dark:text-foreground">
                Exit Bank Console
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <AddPolicyDialog 
        open={showAddPolicyDialog}
        onOpenChange={setShowAddPolicyDialog}
      />
    </>
  )
}
