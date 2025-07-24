"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "Daily Werm Reserve and Distribution Activity"

const chartData = [
  { date: "2024-04-01", reserve: 2200, distributed: 45 },
  { date: "2024-04-02", reserve: 2310, distributed: 52 },
  { date: "2024-04-03", reserve: 2280, distributed: 38 },
  { date: "2024-04-04", reserve: 2420, distributed: 62 },
  { date: "2024-04-05", reserve: 2535, distributed: 68 },
  { date: "2024-04-06", reserve: 2610, distributed: 55 },
  { date: "2024-04-07", reserve: 2580, distributed: 42 },
  { date: "2024-04-08", reserve: 2720, distributed: 75 },
  { date: "2024-04-09", reserve: 2680, distributed: 35 },
  { date: "2024-04-10", reserve: 2750, distributed: 48 },
  { date: "2024-04-11", reserve: 2820, distributed: 85 },
  { date: "2024-04-12", reserve: 2790, distributed: 58 },
  { date: "2024-04-13", reserve: 2880, distributed: 92 },
  { date: "2024-04-14", reserve: 2850, distributed: 65 },
  { date: "2024-04-15", reserve: 2920, distributed: 72 },
  { date: "2024-04-16", reserve: 2890, distributed: 68 },
  { date: "2024-04-17", reserve: 2980, distributed: 95 },
  { date: "2024-04-18", reserve: 2950, distributed: 88 },
  { date: "2024-04-19", reserve: 3020, distributed: 78 },
  { date: "2024-04-20", reserve: 2990, distributed: 55 },
  { date: "2024-04-21", reserve: 3050, distributed: 82 },
  { date: "2024-04-22", reserve: 3020, distributed: 68 },
  { date: "2024-04-23", reserve: 3080, distributed: 90 },
  { date: "2024-04-24", reserve: 3150, distributed: 105 },
  { date: "2024-04-25", reserve: 3120, distributed: 95 },
  { date: "2024-04-26", reserve: 3180, distributed: 72 },
  { date: "2024-04-27", reserve: 3250, distributed: 118 },
  { date: "2024-04-28", reserve: 3220, distributed: 85 },
  { date: "2024-04-29", reserve: 3280, distributed: 98 },
  { date: "2024-04-30", reserve: 3350, distributed: 125 },
  { date: "2024-05-01", reserve: 3320, distributed: 88 },
  { date: "2024-05-02", reserve: 3380, distributed: 102 },
  { date: "2024-05-03", reserve: 3350, distributed: 92 },
  { date: "2024-05-04", reserve: 3420, distributed: 115 },
  { date: "2024-05-05", reserve: 3490, distributed: 132 },
  { date: "2024-05-06", reserve: 3560, distributed: 145 },
  { date: "2024-05-07", reserve: 3530, distributed: 118 },
  { date: "2024-05-08", reserve: 3580, distributed: 95 },
  { date: "2024-05-09", reserve: 3550, distributed: 88 },
  { date: "2024-05-10", reserve: 3620, distributed: 108 },
  { date: "2024-05-11", reserve: 3690, distributed: 125 },
  { date: "2024-05-12", reserve: 3660, distributed: 102 },
  { date: "2024-05-13", reserve: 3720, distributed: 95 },
  { date: "2024-05-14", reserve: 3790, distributed: 138 },
  { date: "2024-05-15", reserve: 3860, distributed: 152 },
  { date: "2024-05-16", reserve: 3830, distributed: 128 },
  { date: "2024-05-17", reserve: 3900, distributed: 145 },
  { date: "2024-05-18", reserve: 3870, distributed: 122 },
  { date: "2024-05-19", reserve: 3920, distributed: 105 },
  { date: "2024-05-20", reserve: 3890, distributed: 98 },
  { date: "2024-05-21", reserve: 3940, distributed: 85 },
  { date: "2024-05-22", reserve: 3910, distributed: 78 },
  { date: "2024-05-23", reserve: 3980, distributed: 118 },
  { date: "2024-05-24", reserve: 3950, distributed: 102 },
  { date: "2024-05-25", reserve: 4010, distributed: 125 },
  { date: "2024-05-26", reserve: 3980, distributed: 95 },
  { date: "2024-05-27", reserve: 4050, distributed: 142 },
  { date: "2024-05-28", reserve: 4020, distributed: 115 },
  { date: "2024-05-29", reserve: 4080, distributed: 88 },
  { date: "2024-05-30", reserve: 4150, distributed: 135 },
  { date: "2024-05-31", reserve: 4120, distributed: 108 },
  { date: "2024-06-01", reserve: 4180, distributed: 118 },
  { date: "2024-06-02", reserve: 4250, distributed: 148 },
  { date: "2024-06-03", reserve: 4220, distributed: 95 },
  { date: "2024-06-04", reserve: 4290, distributed: 138 },
  { date: "2024-06-05", reserve: 4260, distributed: 85 },
  { date: "2024-06-06", reserve: 4320, distributed: 125 },
  { date: "2024-06-07", reserve: 4390, distributed: 155 },
  { date: "2024-06-08", reserve: 4360, distributed: 132 },
  { date: "2024-06-09", reserve: 4430, distributed: 165 },
  { date: "2024-06-10", reserve: 4400, distributed: 118 },
  { date: "2024-06-11", reserve: 4460, distributed: 102 },
  { date: "2024-06-12", reserve: 4530, distributed: 158 },
  { date: "2024-06-13", reserve: 4500, distributed: 95 },
  { date: "2024-06-14", reserve: 4570, distributed: 142 },
  { date: "2024-06-15", reserve: 4640, distributed: 168 },
  { date: "2024-06-16", reserve: 4610, distributed: 145 },
  { date: "2024-06-17", reserve: 4680, distributed: 175 },
  { date: "2024-06-18", reserve: 4650, distributed: 125 },
  { date: "2024-06-19", reserve: 4720, distributed: 152 },
  { date: "2024-06-20", reserve: 4790, distributed: 168 },
  { date: "2024-06-21", reserve: 4760, distributed: 138 },
  { date: "2024-06-22", reserve: 4830, distributed: 155 },
  { date: "2024-06-23", reserve: 4900, distributed: 185 },
  { date: "2024-06-24", reserve: 4870, distributed: 148 },
  { date: "2024-06-25", reserve: 4940, distributed: 162 },
  { date: "2024-06-26", reserve: 5010, distributed: 178 },
  { date: "2024-06-27", reserve: 4980, distributed: 195 },
  { date: "2024-06-28", reserve: 5050, distributed: 168 },
  { date: "2024-06-29", reserve: 5020, distributed: 145 },
  { date: "2024-06-30", reserve: 5090, distributed: 185 },
]

const chartConfig = {
  activity: {
    label: "Werm Activity",
  },
  reserve: {
    label: "Reserve Level",
    color: "var(--primary)",
  },
  distributed: {
    label: "Distributed",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Reserve & Distribution Trends</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Werm reserve levels and distribution activity over time
          </span>
          <span className="@[540px]/card:hidden">Reserve & Distribution</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillReserve" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-reserve)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-reserve)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillDistributed" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-distributed)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-distributed)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                  formatter={(value, name) => [
                    `${value} ${name === "reserve" ? "Werms" : "Werms"}`,
                    name === "reserve" ? "Reserve Level" : "Distributed"
                  ]}
                />
              }
            />
            <Area
              dataKey="distributed"
              type="natural"
              fill="url(#fillDistributed)"
              stroke="var(--color-distributed)"
              stackId="a"
            />
            <Area
              dataKey="reserve"
              type="natural"
              fill="url(#fillReserve)"
              stroke="var(--color-reserve)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
