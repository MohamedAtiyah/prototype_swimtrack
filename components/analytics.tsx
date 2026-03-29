"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useApp } from "@/lib/app-context"
import { BottomNav } from "@/components/navigation/bottom-nav"
import {
  Waves,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Lock,
  Crown,
  ChevronDown,
  Calendar,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from "recharts"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

// Mock analytics data
const progressData = [
  { date: "Week 1", freestyle: 54.2, backstroke: 62.1, butterfly: 58.3 },
  { date: "Week 2", freestyle: 53.8, backstroke: 61.5, butterfly: 57.8 },
  { date: "Week 3", freestyle: 53.1, backstroke: 60.8, butterfly: 57.2 },
  { date: "Week 4", freestyle: 52.9, backstroke: 60.2, butterfly: 56.5 },
  { date: "Week 5", freestyle: 52.5, backstroke: 59.6, butterfly: 55.9 },
  { date: "Week 6", freestyle: 52.3, backstroke: 59.1, butterfly: 55.3 },
  { date: "Week 7", freestyle: 52.1, backstroke: 58.7, butterfly: 54.8 },
]

const volumeData = [
  { day: "Mon", distance: 2500 },
  { day: "Tue", distance: 3200 },
  { day: "Wed", distance: 1800 },
  { day: "Thu", distance: 4000 },
  { day: "Fri", distance: 2800 },
  { day: "Sat", distance: 5200 },
  { day: "Sun", distance: 0 },
]

const strokeDistribution = [
  { name: "Freestyle", value: 45, color: "hsl(var(--chart-1))" },
  { name: "Backstroke", value: 25, color: "hsl(var(--chart-2))" },
  { name: "Butterfly", value: 15, color: "hsl(var(--chart-3))" },
  { name: "Breaststroke", value: 10, color: "hsl(var(--chart-4))" },
  { name: "IM", value: 5, color: "hsl(var(--chart-5))" },
]

const metrics = [
  { label: "Avg Time", value: "52.8s", change: -2.4, trend: "down" },
  { label: "Total Distance", value: "19.5km", change: 15.2, trend: "up" },
  { label: "Sessions", value: "24", change: 8.3, trend: "up" },
  { label: "Improvement", value: "3.2%", change: 1.1, trend: "up" },
]

const timeFilters = ["Last 7 Days", "Last 30 Days", "Last 3 Months", "All Time"]
const strokeFilters = ["All Strokes", "Freestyle", "Backstroke", "Butterfly", "Breaststroke", "IM"]

export function Analytics() {
  const { setCurrentView, setShowPaywall, user } = useApp()
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("Last 30 Days")
  const [selectedStrokeFilter, setSelectedStrokeFilter] = useState("All Strokes")
  const isFree = user?.subscription === "free"

  const handlePremiumClick = () => {
    setShowPaywall(true)
  }

  return (
    <div className="min-h-screen bg-background pb-28 scroll-bounce">
      {/* Header with safe area */}
      <div className="bg-gradient-to-br from-primary to-secondary pt-[calc(env(safe-area-inset-top)+0.5rem)] px-4 pb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/20 w-11 h-11 rounded-2xl press-scale"
              onClick={() => setCurrentView("dashboard")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                <Waves className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-primary-foreground text-lg">
                Analytics
              </span>
            </div>
          </div>
          {isFree && (
            <Button
              variant="secondary"
              size="sm"
              className="bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30 border-0 h-10 px-4 press-scale"
              onClick={() => setCurrentView("pricing")}
            >
              <Crown className="w-4 h-4 mr-1.5" />
              Upgrade
            </Button>
          )}
        </div>

        {/* Filters - iOS style pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                className="bg-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/25 border-0 h-10 px-4 shrink-0 press-scale"
              >
                <Calendar className="w-4 h-4 mr-2" />
                {selectedTimeFilter}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {timeFilters.map((filter) => (
                <DropdownMenuItem
                  key={filter}
                  onClick={() => setSelectedTimeFilter(filter)}
                >
                  {filter}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                className="bg-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/25 border-0 h-10 px-4 shrink-0 press-scale"
              >
                {selectedStrokeFilter}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {strokeFilters.map((filter) => (
                <DropdownMenuItem
                  key={filter}
                  onClick={() => setSelectedStrokeFilter(filter)}
                >
                  {filter}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="px-4 -mt-4">
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((metric, index) => (
            <Card key={index} className="shadow-lg border-0 press-scale">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-1 font-medium">
                  {metric.label}
                </p>
                <div className="flex items-end justify-between">
                  <p className="text-2xl font-bold tabular-nums">{metric.value}</p>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-xs font-medium",
                      metric.trend === "down"
                        ? "bg-chart-1/10 text-chart-1"
                        : "bg-green-500/10 text-green-600"
                    )}
                  >
                    {metric.trend === "up" ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {Math.abs(metric.change)}%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Progress Chart */}
      <div className="px-4 mt-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={progressData}>
                  <defs>
                    <linearGradient id="colorFreestyle" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    domain={["dataMin - 2", "dataMax + 2"]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(value) => `${value}s`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                      fontSize: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="freestyle"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    fill="url(#colorFreestyle)"
                    name="Freestyle"
                  />
                  <Line
                    type="monotone"
                    dataKey="backstroke"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    dot={false}
                    name="Backstroke"
                  />
                  <Line
                    type="monotone"
                    dataKey="butterfly"
                    stroke="hsl(var(--chart-3))"
                    strokeWidth={2}
                    dot={false}
                    name="Butterfly"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-chart-1" />
                <span className="text-xs text-muted-foreground">Freestyle</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-chart-2" />
                <span className="text-xs text-muted-foreground">Backstroke</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-chart-3" />
                <span className="text-xs text-muted-foreground">Butterfly</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Volume */}
      <div className="px-4 mt-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Weekly Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={volumeData}>
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(value) => `${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                      fontSize: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                    formatter={(value: number) => [`${value}m`, "Distance"]}
                  />
                  <Bar dataKey="distance" radius={[6, 6, 0, 0]}>
                    {volumeData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          index === 5
                            ? "hsl(var(--chart-1))"
                            : "hsl(var(--chart-1) / 0.4)"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stroke Distribution */}
      <div className="px-4 mt-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Stroke Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="w-32 h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={strokeDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={38}
                      outerRadius={54}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {strokeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2.5">
                {strokeDistribution.map((stroke, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: stroke.color }}
                      />
                      <span className="text-sm">{stroke.name}</span>
                    </div>
                    <span className="text-sm font-semibold tabular-nums">{stroke.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Premium Analytics Teaser */}
      {isFree && (
        <div className="px-4 mt-6 mb-6">
          <Card
            className="relative overflow-hidden border-0 shadow-sm cursor-pointer press-scale"
            onClick={handlePremiumClick}
          >
            {/* Blurred content preview */}
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-primary/20" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-center flex-col text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
                  <Lock className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-1">
                  Unlock Advanced Analytics
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get AI-powered insights, detailed breakdowns, and personalized recommendations
                </p>
                <Button className="w-full h-12 font-medium press-scale">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Pro
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
