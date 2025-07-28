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
  BackgroundGradient,
} from "@/components/ui"
import { GiveWermsDialog } from "./GiveWermsDialog"
import Image from "next/image"

export function GiveWermsCard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <BackgroundGradient className="rounded-[22px] max-w-sm p-4 bg-card" containerClassName="@container/card">
        <Card className="border-0 shadow-none bg-transparent">
        
          
          <CardHeader className="p-0 pb-4">
        <Image src="/images/werm-coin.png" alt="Werms" width={100} height={100} />
            <CardTitle className="text-2xl font-semibold flex items-center gap-2 text-brand-700">
              Give Werms
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Distribute werms to employees using company policies
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-0">
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="w-full bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              size="lg"
            >
          
              Start Distribution
            </Button>
          </CardContent>
        </Card>
      </BackgroundGradient>

      <GiveWermsDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  )
} 