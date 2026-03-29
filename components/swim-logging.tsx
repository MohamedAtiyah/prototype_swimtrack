"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useApp } from "@/lib/app-context"
import { BottomNav } from "@/components/navigation/bottom-nav"
import {
  Waves,
  ArrowLeft,
  Plus,
  Trash2,
  Check,
  Timer,
  Ruler,
  Activity,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createSwimLogAction } from "@/lib/actions/app-data"

const strokes = [
  { id: "freestyle", name: "Freestyle", shortName: "Free", color: "bg-chart-1" },
  { id: "backstroke", name: "Backstroke", shortName: "Back", color: "bg-chart-2" },
  { id: "butterfly", name: "Butterfly", shortName: "Fly", color: "bg-chart-3" },
  { id: "breaststroke", name: "Breaststroke", shortName: "Breast", color: "bg-chart-4" },
  { id: "im", name: "IM", shortName: "IM", color: "bg-chart-5" },
]

const distances = [25, 50, 100, 200, 400, 800, 1500]

export function SwimLogging() {
  const {
    setCurrentView,
    user,
    setUser,
    selectedChild,
    selectedAthlete,
  } = useApp()
  const { isSignedIn } = useUser()
  const [selectedStroke, setSelectedStroke] = useState(strokes[0])
  const [selectedDistance, setSelectedDistance] = useState(100)
  const [minutes, setMinutes] = useState("")
  const [seconds, setSeconds] = useState("")
  const [milliseconds, setMilliseconds] = useState("")
  const [splits, setSplits] = useState<string[]>([])
  const [notes, setNotes] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const addSplit = () => {
    if (splits.length < 8) {
      setSplits([...splits, ""])
    }
  }

  const removeSplit = (index: number) => {
    setSplits(splits.filter((_, i) => i !== index))
  }

  const updateSplit = (index: number, value: string) => {
    const updated = [...splits]
    updated[index] = value
    setSplits(updated)
  }

  const targetSwimmerId =
    user?.role === "swimmer"
      ? user.swimmerProfile?.id
      : user?.role === "parent"
        ? selectedChild?.id
        : user?.role === "coach"
          ? selectedAthlete?.id ?? user.athletes?.[0]?.id
          : undefined

  const handleSave = async () => {
    if (!isSignedIn) {
      toast.error("Sign in to save swims to your account.")
      return
    }
    if (!targetSwimmerId) {
      toast.error(
        user?.role === "coach"
          ? "Add an athlete from your dashboard first."
          : user?.role === "parent"
            ? "Select a child from the family dashboard."
            : "No swimmer profile found."
      )
      return
    }

    setIsSaving(true)
    try {
      const timeDisplay = formatTimeDisplay()
      const result = await createSwimLogAction({
        swimmerId: targetSwimmerId,
        date: new Date().toISOString().slice(0, 10),
        stroke: selectedStroke.name,
        distance: selectedDistance,
        timeDisplay,
        splits: splits.filter((s) => s.trim().length > 0),
        notes: notes.trim() || undefined,
      })
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      if (result.user) {
        setUser(result.user)
      }
      setSaved(true)
      toast.success("Swim saved.")
      setTimeout(() => {
        setCurrentView("dashboard")
      }, 800)
    } finally {
      setIsSaving(false)
    }
  }

  const formatTimeDisplay = () => {
    if (!minutes && !seconds) return "00:00.00"
    const m = minutes || "0"
    const s = seconds.padStart(2, "0") || "00"
    const ms = milliseconds.padStart(2, "0") || "00"
    return minutes ? `${m}:${s}.${ms}` : `00:${s}.${ms}`
  }

  return (
    <div className="min-h-screen bg-background pb-28 scroll-bounce">
      {/* Header with safe area */}
      <div className="bg-gradient-to-br from-primary to-secondary pt-[calc(env(safe-area-inset-top)+0.5rem)] px-4 pb-8">
        <div className="flex items-center gap-4 mb-6">
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
              Log Swim
            </span>
          </div>
        </div>

        {/* Large Time Display - iOS style */}
        <div className="text-center py-4">
          <p className="text-primary-foreground/70 text-sm mb-2 font-medium">Total Time</p>
          <p className="text-5xl font-bold text-primary-foreground font-mono tracking-tight">
            {formatTimeDisplay()}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="px-4 -mt-2 space-y-4">
        {/* Stroke Selection - iOS Segmented Control style */}
        <Card className="border-0 shadow-sm overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              Stroke
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2">
              {strokes.map((stroke) => (
                <button
                  key={stroke.id}
                  onClick={() => setSelectedStroke(stroke)}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all touch-target press-scale",
                    selectedStroke.id === stroke.id
                      ? "border-primary bg-primary/10"
                      : "border-transparent bg-muted/50"
                  )}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl mb-1.5",
                      stroke.color
                    )}
                  />
                  <span className="text-[11px] font-semibold truncate w-full text-center">
                    {stroke.shortName}
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Distance Selection - Pill buttons */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Ruler className="w-4 h-4 text-primary" />
              Distance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {distances.map((distance) => (
                <button
                  key={distance}
                  onClick={() => setSelectedDistance(distance)}
                  className={cn(
                    "segment-pill border press-scale",
                    selectedDistance === distance
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-foreground border-border"
                  )}
                >
                  {distance}m
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Time Input - Large touch targets */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Timer className="w-4 h-4 text-primary" />
              Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground mb-1.5 block">Min</Label>
                <Input
                  type="number"
                  inputMode="numeric"
                  placeholder="0"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  className="h-14 text-center text-2xl font-mono border-0 bg-muted/50"
                  min={0}
                  max={59}
                />
              </div>
              <span className="text-3xl font-bold text-muted-foreground mt-5">:</span>
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground mb-1.5 block">Sec</Label>
                <Input
                  type="number"
                  inputMode="numeric"
                  placeholder="00"
                  value={seconds}
                  onChange={(e) => setSeconds(e.target.value)}
                  className="h-14 text-center text-2xl font-mono border-0 bg-muted/50"
                  min={0}
                  max={59}
                />
              </div>
              <span className="text-3xl font-bold text-muted-foreground mt-5">.</span>
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground mb-1.5 block">Ms</Label>
                <Input
                  type="number"
                  inputMode="numeric"
                  placeholder="00"
                  value={milliseconds}
                  onChange={(e) => setMilliseconds(e.target.value)}
                  className="h-14 text-center text-2xl font-mono border-0 bg-muted/50"
                  min={0}
                  max={99}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Splits (Optional) */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Splits (Optional)</CardTitle>
              {splits.length < 8 && (
                <Button variant="ghost" size="sm" onClick={addSplit} className="h-9 px-3 press-scale">
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              )}
            </div>
          </CardHeader>
          {splits.length > 0 && (
            <CardContent className="space-y-2">
              {splits.map((split, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="w-8 text-sm text-muted-foreground font-medium">
                    #{index + 1}
                  </span>
                  <Input
                    inputMode="decimal"
                    placeholder="00.00"
                    value={split}
                    onChange={(e) => updateSplit(index, e.target.value)}
                    className="h-12 font-mono border-0 bg-muted/50"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 w-12 h-12 press-scale"
                    onClick={() => removeSplit(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          )}
        </Card>

        {/* Notes */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Notes (Optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Add any notes about this swim..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="border-0 bg-muted/50 resize-none"
            />
          </CardContent>
        </Card>

        {/* Save Button - Large touch target */}
        <Button
          size="lg"
          className="w-full h-14 text-lg font-semibold rounded-2xl press-scale"
          onClick={handleSave}
          disabled={!seconds || isSaving || saved}
        >
          {saved ? (
            <>
              <Check className="w-5 h-5 mr-2" />
              Saved!
            </>
          ) : isSaving ? (
            "Saving..."
          ) : (
            "Save Swim"
          )}
        </Button>
      </div>

      <BottomNav />
    </div>
  )
}
