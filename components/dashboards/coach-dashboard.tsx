"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useApp } from "@/lib/app-context"
import { addAthleteAction } from "@/lib/actions/app-data"
import { BottomNav } from "@/components/navigation/bottom-nav"
import {
  Waves,
  Trophy,
  TrendingUp,
  Users,
  ChevronRight,
  Crown,
  Search,
  BarChart3,
  Clock,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts"
import { cn } from "@/lib/utils"
import {
  buildTeamImprovementChart,
  averageTeamImprovement,
} from "@/lib/swim-data"

const strokeFilters = ["All", "Freestyle", "Backstroke", "Butterfly", "Breaststroke", "IM"]

export function CoachDashboard() {
  const {
    user,
    setUser,
    setCurrentView,
    setShowPaywall,
    selectedAthlete,
    setSelectedAthlete,
  } = useApp()
  const athletes = user?.athletes || []
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("All")
  const [addOpen, setAddOpen] = useState(false)
  const [newAthleteName, setNewAthleteName] = useState("")
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    const list = user?.athletes ?? []
    if (list.length === 0) {
      if (selectedAthlete !== null) setSelectedAthlete(null)
      return
    }
    const matches =
      selectedAthlete && list.some((a) => a.id === selectedAthlete.id)
    if (!matches) {
      setSelectedAthlete(list[0])
    }
  }, [user?.athletes, selectedAthlete, setSelectedAthlete])

  const handleAddAthlete = async () => {
    setAdding(true)
    try {
      const result = await addAthleteAction(newAthleteName)
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      if (result.user) {
        setUser(result.user)
      }
      setAddOpen(false)
      setNewAthleteName("")
      toast.success("Athlete added.")
    } finally {
      setAdding(false)
    }
  }

  const filteredAthletes = athletes.filter((athlete) =>
    athlete.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

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

  const handlePremiumClick = () => {
    setShowPaywall(true)
  }

  const totalLogs = athletes.reduce((sum, a) => sum + a.logs.length, 0)
  const totalPBs = athletes.reduce((sum, a) => sum + a.personalBests.length, 0)
  const teamPerformanceData = buildTeamImprovementChart(athletes)
  const avgImprovementDisplay = averageTeamImprovement(athletes)

  return (
    <div className="min-h-screen bg-background pb-28 scroll-bounce">
      {/* Header with safe area */}
      <div className="bg-gradient-to-br from-primary via-secondary to-accent pt-[calc(env(safe-area-inset-top)+1rem)] px-4 pb-20 rounded-b-[2rem]">
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
            <p className="text-primary-foreground/80 text-sm mb-0.5">Coach Dashboard</p>
            <h1 className="text-2xl font-bold">{user?.name || "Coach"}</h1>
          </div>
          <Badge className="bg-primary-foreground/15 text-primary-foreground border-0 text-sm px-3 py-1.5">
            <Users className="w-4 h-4 mr-1.5" />
            {athletes.length} Athletes
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 -mt-12">
        <div className="grid grid-cols-4 gap-2">
          <Card className="shadow-lg border-0 press-scale">
            <CardContent className="p-3 text-center">
              <Users className="w-5 h-5 mx-auto mb-1 text-chart-1" />
              <p className="text-xl font-bold tabular-nums">{athletes.length}</p>
              <p className="text-[10px] text-muted-foreground font-medium">Athletes</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 press-scale">
            <CardContent className="p-3 text-center">
              <Trophy className="w-5 h-5 mx-auto mb-1 text-chart-2" />
              <p className="text-xl font-bold tabular-nums">{totalPBs}</p>
              <p className="text-[10px] text-muted-foreground font-medium">PBs</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 press-scale">
            <CardContent className="p-3 text-center">
              <Clock className="w-5 h-5 mx-auto mb-1 text-chart-3" />
              <p className="text-xl font-bold tabular-nums">{totalLogs}</p>
              <p className="text-[10px] text-muted-foreground font-medium">Logs</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 press-scale">
            <CardContent className="p-3 text-center">
              <TrendingUp className="w-5 h-5 mx-auto mb-1 text-chart-4" />
              <p className="text-xl font-bold text-chart-4 tabular-nums">
                {avgImprovementDisplay}
              </p>
              <p className="text-[10px] text-muted-foreground font-medium">Avg</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Team Performance Chart */}
      <div className="px-4 mt-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Team Improvement</CardTitle>
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
            <div className="h-40">
              {teamPerformanceData.length === 0 ? (
                <p className="text-sm text-muted-foreground h-full flex items-center justify-center text-center px-4">
                  Add athletes and repeated logs for the same stroke and distance
                  to see improvement trends.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={teamPerformanceData} layout="vertical">
                    <XAxis
                      type="number"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11 }}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11 }}
                      width={50}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "12px",
                        fontSize: "12px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                      formatter={(value: number) => [`${value}%`, "Improvement"]}
                    />
                    <Bar dataKey="improvement" radius={[0, 6, 6, 0]}>
                      {teamPerformanceData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`hsl(var(--chart-${(index % 5) + 1}))`}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="px-4 mt-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search athletes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 border-0 bg-muted/50"
            />
          </div>
        </div>

        {/* Horizontal scroll filters - iOS style */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {strokeFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "segment-pill shrink-0 border",
                activeFilter === filter
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border"
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Athletes List - iOS style */}
      <div className="px-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Athletes</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary h-9 px-3 press-scale"
            onClick={() => setAddOpen(true)}
          >
            Add New
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <Card className="border-0 shadow-sm overflow-hidden">
          <div className="divide-y divide-border">
            {filteredAthletes.map((athlete) => (
              <div
                key={athlete.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedAthlete(athlete)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    setSelectedAthlete(athlete)
                }}
                className={cn(
                  "list-item-ios cursor-pointer",
                  selectedAthlete?.id === athlete.id &&
                    "bg-primary/5 ring-1 ring-primary/20"
                )}
              >
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground text-sm font-semibold">
                    {getInitials(athlete.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold truncate">{athlete.name}</p>
                    <Badge variant="secondary" className="text-[10px] shrink-0 px-2">
                      {athlete.personalBests[0]?.stroke ||
                        athlete.logs[0]?.stroke ||
                        "—"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-1">
                      <Trophy className="w-3 h-3" />
                      {athlete.personalBests.length} PBs
                    </span>
                    <span className="flex items-center gap-1">
                      <BarChart3 className="w-3 h-3" />
                      {athlete.logs.length} logs
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold tabular-nums">
                    {athlete.personalBests[0]
                      ? formatTime(athlete.personalBests[0].time)
                      : athlete.logs[0]
                        ? formatTime(athlete.logs[0].time)
                        : "—"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {athlete.personalBests[0]?.distance ??
                      athlete.logs[0]?.distance ??
                      "—"}
                    {athlete.personalBests[0] || athlete.logs[0] ? "m" : ""}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground/50 ml-1" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Premium Feature Card */}
      <div className="px-4 mt-6 mb-6">
        <Card
          className="relative overflow-hidden bg-gradient-to-br from-secondary/20 to-primary/20 border-0 shadow-sm cursor-pointer press-scale"
          onClick={handlePremiumClick}
        >
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold">Team Analytics Pro</p>
                <p className="text-sm text-muted-foreground">
                  Advanced insights and training tools
                </p>
              </div>
            </div>
            <Crown className="w-6 h-6 text-primary" />
          </CardContent>
        </Card>
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add athlete</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Athlete name"
            value={newAthleteName}
            onChange={(e) => setNewAthleteName(e.target.value)}
            className="h-11"
          />
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAthlete} disabled={adding}>
              {adding ? "Adding…" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  )
}
