import { IconTrendingDown, IconTrendingUp, IconCoins, IconUsers, IconClock } from "@tabler/icons-react"
import { Area, AreaChart, ResponsiveContainer } from "recharts"

import {
  Badge,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ChartContainer,
} from "@/components/ui"
import { calculateWermValueAUD } from "@/shared/utils/format"
import { GiveWermsCard } from "@/features/give-werms"

// Mock data for mini charts
const bankReserveData = [
  { value: 2650 }, { value: 2720 }, { value: 2680 }, { value: 2750 }, 
  { value: 2790 }, { value: 2820 }, { value: 2847 }
]

const employeeData = [
  { value: 72 }, { value: 74 }, { value: 75 }, { value: 76 }, 
  { value: 77 }, { value: 77 }, { value: 78 }
]

const circulationData = [
  { value: 14200 }, { value: 14450 }, { value: 14680 }, { value: 14890 }, 
  { value: 15100 }, { value: 15220 }, { value: 15342 }
]

const halvingData = [
  { value: 53 }, { value: 52 }, { value: 51 }, { value: 50 }, 
  { value: 49 }, { value: 48 }, { value: 47 }
]

const chartConfig = {
  value: {
    color: "var(--primary)",
  },
}

const chartConfigDestructive = {
  value: {
    color: "var(--destructive)",
  },
}

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-5">
      {/* Give Werms Quick Action Card */}
      <GiveWermsCard />
      
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Bank Reserve</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex items-center gap-2">
          <IconCoins className="size-6" />
            2,847 Werms
          </CardTitle>
          <div className="text-sm text-muted-foreground mb-2">
            {calculateWermValueAUD(2847)}
          </div>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +156 today
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="pt-0">
          <ChartContainer config={chartConfig} className="h-[60px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={bankReserveData}>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-value)"
                  fill="var(--color-value)"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Employees</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex items-center gap-2">
            <IconUsers className="size-6" />
            78
          </CardTitle>
          <div className="text-sm text-muted-foreground mb-2 invisible">
            Spacer for alignment
          </div>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +3 this month
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="pt-0">
          <ChartContainer config={chartConfig} className="h-[60px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={employeeData}>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-value)"
                  fill="var(--color-value)"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total in Circulation</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex items-center gap-2">
            <IconCoins className="size-6" />
            15,342 Werms
          </CardTitle>
          <div className="text-sm text-muted-foreground mb-2">
            {calculateWermValueAUD(15342)}
          </div>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +8.2%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="pt-0">
          <ChartContainer config={chartConfig} className="h-[60px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={circulationData}>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-value)"
                  fill="var(--color-value)"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Days Until Halving</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex items-center gap-2">
            <IconClock className="size-6" />
            47 days
          </CardTitle>
          <div className="text-sm text-muted-foreground mb-2 invisible">
            Spacer for alignment
          </div>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />
              Next: Q1 2025
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="pt-0">
          <ChartContainer config={chartConfigDestructive} className="h-[60px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={halvingData}>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-value)"
                  fill="var(--color-value)"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
