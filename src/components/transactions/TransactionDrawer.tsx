"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { IconTrendingUp } from "@tabler/icons-react"
import { z } from "zod"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Button,
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
} from "@/components/ui"

// Schema for transaction data
const transactionSchema = z.object({
  id: z.number(),
  header: z.string(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
  reviewer: z.union([
    z.object({
      name: z.string(),
      type: z.literal("system"),
    }),
    z.object({
      name: z.string(),
      email: z.string(),
      slack_username: z.string(),
      role: z.string(),
    }),
  ]),
  employee: z.object({
    name: z.string(),
    email: z.string(),
    slack_username: z.string(),
    department: z.string(),
    employee_id: z.string(),
  }).nullable(),
  timestamp: z.string(),
})

// Chart data - this could be passed as props or fetched based on the transaction
const chartData = [
  { month: "January", minted: 4680, distributed: 3240 },
  { month: "February", minted: 4836, distributed: 3480 },
  { month: "March", minted: 4524, distributed: 2980 },
  { month: "April", minted: 4212, distributed: 3920 },
  { month: "May", minted: 4758, distributed: 3650 },
  { month: "June", minted: 4968, distributed: 3840 },
]

const chartConfig = {
  minted: {
    label: "Minted",
    color: "var(--primary)",
  },
  distributed: {
    label: "Distributed",
    color: "var(--primary)",
  },
} satisfies ChartConfig

interface TransactionDrawerProps {
  item: z.infer<typeof transactionSchema>
  children: React.ReactNode
}

export function TransactionDrawer({ item, children }: TransactionDrawerProps) {
  const isMobile = useIsMobile()

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.header}</DrawerTitle>
          <DrawerDescription>
            Showing Werm transaction details and distribution history
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {!isMobile && (
            <>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 0,
                    right: 10,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                    hide
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Area
                    dataKey="distributed"
                    type="natural"
                    fill="var(--color-distributed)"
                    fillOpacity={0.6}
                    stroke="var(--color-distributed)"
                    stackId="a"
                  />
                  <Area
                    dataKey="minted"
                    type="natural"
                    fill="var(--color-minted)"
                    fillOpacity={0.4}
                    stroke="var(--color-minted)"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
              <Separator />
              <div className="grid gap-2">
                <div className="flex gap-2 leading-none font-medium">
                  Trending up by 8.2% this month{" "}
                  <IconTrendingUp className="size-4" />
                </div>
                <div className="text-muted-foreground">
                  Showing Werm minting and distribution activity for the last 6 months. 
                  Reserve levels have remained stable with consistent employee distributions.
                </div>
              </div>
              <Separator />
            </>
          )}
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="header">Header</Label>
              <Input id="header" defaultValue={item.header} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="type">Type</Label>
                <Select defaultValue={item.type}>
                  <SelectTrigger id="type" className="w-full">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mint">Mint</SelectItem>
                    <SelectItem value="Distribution">Distribution</SelectItem>
                    <SelectItem value="Reconciliation">Reconciliation</SelectItem>
                    <SelectItem value="Adjustment">Adjustment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue={item.status}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Done">Done</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="target">Amount</Label>
                <Input id="target" defaultValue={item.target} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="limit">Category</Label>
                <Input id="limit" defaultValue={item.limit} />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="reviewer">Authorized By</Label>
              <Select defaultValue={typeof item.reviewer === 'object' ? item.reviewer.name : item.reviewer}>
                <SelectTrigger id="reviewer" className="w-full">
                  <SelectValue placeholder="Select authorizer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Operations Lead">Operations Lead</SelectItem>
                  <SelectItem value="Bank System">Bank System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        </div>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose asChild>
            <Button variant="outline">Done</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
} 