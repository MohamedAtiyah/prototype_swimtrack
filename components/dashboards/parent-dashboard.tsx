"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useApp } from "@/lib/app-context"
import { BottomNav } from "@/components/navigation/bottom-nav"
import {
  Waves,
  Trophy,
  TrendingUp,
  Clock,
  ChevronRight,
  ChevronDown,
  Crown,
  Users,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import {
  buildFreestyle100ChartData,
  improvementPercentLabel,
} from "@/lib/swim-data"

export function ParentDashboard() {
  const { user, setCurrentView, selectedChild, setSelectedChild } = useApp()
  const children = user?.children || []

  useEffect(() => {
    if (children.length === 0) {
      if (selectedChild !== null) setSelectedChild(null)
      return
    }
    const matches =
      selectedChild && children.some((c) => c.id === selectedChild.id)
    if (!matches) {
      setSelectedChild(children[0])
    }
  }, [children, selectedChild, setSelectedChild])

  const activeChild =
    selectedChild && children.some((c) => c.id === selectedChild.id)
      ? selectedChild
      : children[0] ?? null

  const handleChildSelect = (child: (typeof children)[0]) => {
    setSelectedChild(child)
  }

  const performanceData = activeChild
    ? buildFreestyle100ChartData(activeChild.logs)
    : []
  const progressLabel = improvementPercentLabel(performanceData)

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatTime = (time: string) => {
    return time.includes(":") ? time : `${time}s`
  }

  return (
    <div className="min-h-screen bg-background pb-28 scroll-bounce">
      {/* Header with safe area */}
      <div className="bg-gradient-to-br from-secondary via-primary to-primary pt-[calc(env(safe-area-inset-top)+1rem)] px-4 pb-20 rounded-b-[2rem]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
              <Waves className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary-foreground">
              SwimTrack
            </span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30 border-0 h-10 px-4 press-scale"
            onClick={() => setCurrentView("pricing")}
          >
            <Crown className="w-4 h-4 mr-1.5" />
            Upgrade
          </Button>
        </div>

        <div className="flex items-center justify-between text-primary-foreground">
          <div>
            <p className="text-primary-foreground/80 text-sm mb-0.5">Family Dashboard</p>
            <h1 className="text-2xl font-bold">{user?.name || "Parent"}</h1>
          </div>
          <div className="flex items-center gap-2 bg-primary-foreground/15 rounded-full px-4 py-2">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">{children.length} kids</span>
          </div>
        </div>
      </div>

      {/* Child Selector */}
      <div className="px-4 -mt-12">
        <Card className="shadow-lg border-0">
          <CardContent className="p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between h-16 border-0 bg-muted/50 press-scale"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-11 h-11">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground font-semibold">
                        {activeChild ? getInitials(activeChild.name) : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="font-semibold">
                        {activeChild?.name || "Select Child"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activeChild?.logs.length || 0} recent activities
                      </p>
                    </div>
                  </div>
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[calc(100vw-2rem)]" align="start">
                {children.map((child) => (
                  <DropdownMenuItem
                    key={child.id}
                    onClick={() => handleChildSelect(child)}
                    className="p-3 focus:bg-muted"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-11 h-11">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground font-semibold">
                          {getInitials(child.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{child.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {child.personalBests.length} personal bests
                        </p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats for Selected Child */}
      <div className="px-4 mt-4">
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-0 shadow-sm press-scale">
            <CardContent className="p-4 text-center">
              <div className="w-11 h-11 mx-auto mb-2 rounded-2xl bg-chart-1/10 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-chart-1" />
              </div>
              <p className="text-2xl font-bold tabular-nums">
                {activeChild?.personalBests.length || 0}
              </p>
              <p className="text-[11px] text-muted-foreground font-medium">Personal Bests</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm press-scale">
            <CardContent className="p-4 text-center">
              <div className="w-11 h-11 mx-auto mb-2 rounded-2xl bg-chart-2/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-chart-2" />
              </div>
              <p className="text-2xl font-bold tabular-nums">
                {activeChild?.logs.length || 0}
              </p>
              <p className="text-[11px] text-muted-foreground font-medium">Sessions</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm press-scale">
            <CardContent className="p-4 text-center">
              <div className="w-11 h-11 mx-auto mb-2 rounded-2xl bg-chart-3/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-chart-3" />
              </div>
              <p className="text-2xl font-bold text-chart-3 tabular-nums">
                {progressLabel}
              </p>
              <p className="text-[11px] text-muted-foreground font-medium">Progress</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="px-4 mt-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">
                {activeChild?.name}&apos;s Progress
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary h-9 px-3 press-scale"
                onClick={() => setCurrentView("analytics")}
              >
                Details
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="h-44">
              {performanceData.length === 0 ? (
                <p className="text-sm text-muted-foreground h-full flex items-center justify-center text-center px-4">
                  {activeChild
                    ? "Log 100m freestyle swims for this swimmer to see progress."
                    : "Add a child profile to get started."}
                </p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis
                      domain={["dataMin - 1", "dataMax + 1"]}
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
                      formatter={(value: number) => [`${value}s`, "Time"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="time"
                      stroke="hsl(var(--chart-1))"
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 0, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Personal Bests */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Personal Bests</h2>
        </div>

        <div className="space-y-2">
          {activeChild?.personalBests.map((pb, index) => (
            <Card key={index} className="border-0 shadow-sm press-scale">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold">{pb.stroke}</p>
                    <p className="text-sm text-muted-foreground">
                      {pb.distance}m
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold tabular-nums">{formatTime(pb.time)}</p>
                  <Badge variant="secondary" className="text-xs mt-0.5">
                    Best
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity - iOS-style list */}
      <div className="px-4 mt-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
        </div>

        <Card className="border-0 shadow-sm overflow-hidden">
          <div className="divide-y divide-border">
            {activeChild?.logs.slice(0, 3).map((log) => (
              <div key={log.id} className="list-item-ios">
                <div className="flex-1">
                  <p className="font-medium">
                    {log.stroke} - {log.distance}m
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(log.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <p className="text-lg font-semibold tabular-nums">{formatTime(log.time)}</p>
                <ChevronRight className="w-5 h-5 text-muted-foreground/50 ml-1" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <BottomNav />
    </div>
  )
}
