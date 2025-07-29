"use client"

import { useState } from "react"
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
    <div className="flex flex-col items-center justify-center w-full">
      <BackgroundGradient 
        className="rounded-[24px] max-w-sm w-full" 
        containerClassName="@container/card w-full flex justify-center"
      >
        <Card className="flex flex-col items-center justify-center border-0 shadow-none bg-transparent">
          <CardHeader className="flex flex-col items-center pb-4">
            <Image src="/images/werm-coin.png" alt="Werms" width={100} height={100} />
            <CardTitle className="text-2xl font-semibold text-center text-primary-background">
              Give Werms
            </CardTitle>
            <CardDescription className="text-sm text-center text-background-foreground/70">
              Distribute werms to employees using company policies
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex flex-col items-center w-full">
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
    </div>
  )
} 