"use client"

import { useState } from "react"
import { IconCoins, IconGift } from "@tabler/icons-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
} from "@/components/ui"
import { GiveWermsDialog } from "./GiveWermsDialog"

export function GiveWermsCard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <Card className="@container/card relative overflow-hidden border-2 border-transparent bg-gradient-to-r from-brand-500/20 via-brand-400/10 to-brand-600/20 p-[2px]">
        <div className="relative rounded-[calc(var(--radius)-2px)] bg-card p-6 h-full">
          {/* Coin decoration */}
          <div className="absolute -top-2 -right-2 opacity-20">
            <IconCoins className="size-16 text-brand-500 rotate-12" />
          </div>
          
          <CardHeader className="p-0 pb-4">
            <CardDescription className="text-brand-600 font-medium">
              Quick Actions
            </CardDescription>
            <CardTitle className="text-2xl font-semibold flex items-center gap-2 text-brand-700">
              <IconGift className="size-6" />
              Give Werms
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Distribute werms to employees using company policies
            </p>
          </CardHeader>
          
          <CardContent className="p-0">
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="w-full bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              size="lg"
            >
              <IconCoins className="mr-2 size-4" />
              Start Distribution
            </Button>
          </CardContent>
        </div>
      </Card>

      <GiveWermsDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  )
} 