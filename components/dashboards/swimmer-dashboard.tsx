"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useApp } from "@/lib/app-context"
import { BottomNav } from "@/components/navigation/bottom-nav"
import {
  Waves,
  Trophy,
  TrendingUp,
  Clock,
  ChevronRight,
  Lock,
  Crown,
} from "lucide-react"
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

export function SwimmerDashboard() {
  const { user, setCurrentView, setShowPaywall } = useApp()
  const profile = user?.swimmerProfile
  const performanceData = profile
    ? buildFreestyle100ChartData(profile.logs)
    : []
  const improvementDisplay = improvementPercentLabel(performanceData)

  const handlePremiumClick = () => {
    setShowPaywall(true)
  }

  const formatTime = (time: string) => {
    return time.includes(":") ? time : `${time}s`
  }

  return (
    <div className="min-h-screen bg-background pb-28 scroll-bounce">
      {/* Header with safe area */}
      <div className="bg-gradient-to-br from-primary via-primary to-secondary pt-[calc(env(safe-area-inset-top)+1rem)] px-4 pb-20 rounded-b-[2rem]">
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

        <div className="text-primary-foreground">
          <p className="text-primary-foreground/80 text-sm mb-0.5">Welcome back,</p>
          <h1 className="text-2xl font-bold">{user?.name || "Swimmer"}</h1>
        </div>
      </div>

      {/* Quick Stats - Overlapping cards */}
      <div className="px-4 -mt-12">
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-card shadow-lg border-0 press-scale">
            <CardContent className="p-4 text-center">
              <div className="w-11 h-11 mx-auto mb-2 rounded-2xl bg-chart-1/10 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-chart-1" />
              </div>
              <p className="text-2xl font-bold tabular-nums">
                {profile?.personalBests.length || 0}
              </p>
              <p className="text-[11px] text-muted-foreground font-medium">Personal Bests</p>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-lg border-0 press-scale">
            <CardContent className="p-4 text-center">
              <div className="w-11 h-11 mx-auto mb-2 rounded-2xl bg-chart-2/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-chart-2" />
              </div>
              <p className="text-2xl font-bold tabular-nums">{profile?.logs.length || 0}</p>
              <p className="text-[11px] text-muted-foreground font-medium">Total Logs</p>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-lg border-0 press-scale">
            <CardContent className="p-4 text-center">
              <div className="w-11 h-11 mx-auto mb-2 rounded-2xl bg-chart-3/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-chart-3" />
              </div>
              <p className="text-2xl font-bold text-chart-3 tabular-nums">
                {improvementDisplay}
              </p>
              <p className="text-[11px] text-muted-foreground font-medium">Improvement</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="px-4 mt-6">
        <Card className="overflow-hidden border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">100m Freestyle Progress</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary h-9 px-3 press-scale"
                onClick={() => setCurrentView("analytics")}
              >
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="h-44">
              {performanceData.length === 0 ? (
                <p className="text-sm text-muted-foreground h-full flex items-center justify-center text-center px-4">
                  Log 100m freestyle swims to see your progress here.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11 }}
                      className="text-muted-foreground"
                    />
                    <YAxis
                      domain={["dataMin - 1", "dataMax + 1"]}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11 }}
                      className="text-muted-foreground"
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
                      activeDot={{
                        r: 6,
                        stroke: "hsl(var(--chart-1))",
                        strokeWidth: 2,
                      }}
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
          <Button variant="ghost" size="sm" className="text-primary h-9 px-3 press-scale">
            View All
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="space-y-2">
          {profile?.personalBests.slice(0, 3).map((pb, index) => (
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

      {/* Recent Logs - iOS-style list */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Recent Workouts</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary h-9 px-3 press-scale"
            onClick={() => setCurrentView("log-swim")}
          >
            Log New
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <Card className="border-0 shadow-sm overflow-hidden">
          <div className="divide-y divide-border">
            {profile?.logs.slice(0, 4).map((log, index) => (
              <div 
                key={log.id} 
                className="list-item-ios"
              >
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
                <div className="text-right">
                  <p className="text-lg font-semibold tabular-nums">{formatTime(log.time)}</p>
                  {log.splits && (
                    <p className="text-xs text-muted-foreground">
                      {log.splits.length} splits
                    </p>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground/50 ml-1" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Premium Feature Teaser */}
      <div className="px-4 mt-6 mb-6">
        <Card
          className="relative overflow-hidden bg-gradient-to-br from-secondary/20 to-primary/20 border-0 shadow-sm cursor-pointer press-scale"
          onClick={handlePremiumClick}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent" />
          <CardContent className="p-4 flex items-center justify-between relative">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Lock className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold">Unlock Advanced Analytics</p>
                <p className="text-sm text-muted-foreground">
                  Get detailed insights and AI coaching
                </p>
              </div>
            </div>
            <Crown className="w-6 h-6 text-primary" />
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  )
}
