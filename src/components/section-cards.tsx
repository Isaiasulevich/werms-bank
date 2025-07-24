import { IconTrendingDown, IconTrendingUp, IconCoins, IconUsers, IconClock, IconStack } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Bank Reserve</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex items-center gap-2">
            <IconStack className="size-6" />
            2,847 Werms
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +156 today
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Daily minting active <IconCoins className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Ready for distribution to employees
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Employees</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex items-center gap-2">
            <IconUsers className="size-6" />
            78
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +3 this month
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Growing team <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Daily mint rate: 156 Werms (78 × 2)
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total in Circulation</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex items-center gap-2">
            <IconCoins className="size-6" />
            15,342 Werms
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +8.2%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Healthy circulation growth <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            $153,420 equivalent value
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Days Until Halving</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex items-center gap-2">
            <IconClock className="size-6" />
            47 days
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />
              Next: Q1 2025
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Scheduled monetary policy <IconClock className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Mint rate will reduce by 50%
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
