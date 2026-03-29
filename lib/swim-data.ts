import type { SwimLog, Swimmer, User } from "./domain/types"
import { parseTimeToSeconds } from "./domain/time"

export { parseTimeToSeconds } from "./domain/time"

export function buildFreestyle100ChartData(
  logs: SwimLog[]
): { date: string; time: number }[] {
  const filtered = [...logs]
    .filter(
      (l) =>
        l.stroke.toLowerCase().includes("free") &&
        Number(l.distance) === 100
    )
    .sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )
  return filtered.map((l) => ({
    date: new Date(l.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    time: parseTimeToSeconds(l.time),
  }))
}

export function improvementPercentLabel(series: { time: number }[]): string {
  if (series.length < 2) return "—"
  const first = series[0].time
  const last = series[series.length - 1].time
  if (first <= 0) return "—"
  const pct = ((first - last) / first) * 100
  const rounded = pct.toFixed(1)
  return pct > 0 ? `+${rounded}%` : `${rounded}%`
}

export function getLogsForCharts(
  user: User | null,
  selectedChild: Swimmer | null
): SwimLog[] {
  if (!user?.role) return []
  if (user.role === "swimmer" && user.swimmerProfile) {
    return [...user.swimmerProfile.logs].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )
  }
  if (user.role === "parent") {
    const children = user.children ?? []
    const child =
      selectedChild && children.some((c) => c.id === selectedChild.id)
        ? selectedChild
        : children[0]
    if (!child) return []
    return [...child.logs].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )
  }
  if (user.role === "coach") {
    const all = user.athletes?.flatMap((a) => a.logs) ?? []
    return [...all].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )
  }
  return []
}

export function athleteImprovementPercent(athlete: Swimmer): number | null {
  const groups = new Map<string, SwimLog[]>()
  for (const l of athlete.logs) {
    const k = `${l.stroke}\0${l.distance}`
    if (!groups.has(k)) groups.set(k, [])
    groups.get(k)!.push(l)
  }
  for (const arr of groups.values()) {
    if (arr.length < 2) continue
    const sorted = [...arr].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )
    const first = parseTimeToSeconds(sorted[0].time)
    const last = parseTimeToSeconds(sorted[sorted.length - 1].time)
    if (first <= 0) continue
    return ((first - last) / first) * 100
  }
  return null
}

export function buildTeamImprovementChart(
  athletes: Swimmer[]
): { name: string; improvement: number }[] {
  return athletes
    .map((a) => {
      const pct = athleteImprovementPercent(a)
      if (pct === null) return null
      const short = a.name.trim().split(/\s+/)[0] || a.name
      return { name: short, improvement: Number(pct.toFixed(1)) }
    })
    .filter(Boolean) as { name: string; improvement: number }[]
}

function startOfWeek(d: Date): Date {
  const x = new Date(d)
  const day = x.getDay()
  const diff = x.getDate() - day + (day === 0 ? -6 : 1)
  x.setDate(diff)
  x.setHours(0, 0, 0, 0)
  return x
}

export function buildProgressByWeek(
  logs: SwimLog[]
): { date: string; freestyle?: number; backstroke?: number; butterfly?: number }[] {
  const byWeek = new Map<
    string,
    { freestyle: number[]; backstroke: number[]; butterfly: number[] }
  >()

  for (const l of logs) {
    const wk = startOfWeek(new Date(l.date))
    const key = wk.toISOString()
    if (!byWeek.has(key)) {
      byWeek.set(key, { freestyle: [], backstroke: [], butterfly: [] })
    }
    const bucket = byWeek.get(key)!
    const t = parseTimeToSeconds(l.time)
    const s = l.stroke.toLowerCase()
    if (s.includes("free")) bucket.freestyle.push(t)
    else if (s.includes("back")) bucket.backstroke.push(t)
    else if (s.includes("butter") || s.includes("fly"))
      bucket.butterfly.push(t)
  }

  const sortedKeys = [...byWeek.keys()].sort()
  const avg = (arr: number[]) =>
    arr.length ? arr.reduce((x, y) => x + y, 0) / arr.length : undefined

  return sortedKeys.map((key, i) => {
    const b = byWeek.get(key)!
    return {
      date: `Week ${i + 1}`,
      freestyle: avg(b.freestyle),
      backstroke: avg(b.backstroke),
      butterfly: avg(b.butterfly),
    }
  })
}

export function buildWeeklyVolume(
  logs: SwimLog[]
): { day: string; distance: number }[] {
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const sums = [0, 0, 0, 0, 0, 0, 0]
  for (const l of logs) {
    const d = new Date(l.date).getDay()
    const idx = d === 0 ? 6 : d - 1
    sums[idx] += Number(l.distance) || 0
  }
  return labels.map((day, i) => ({ day, distance: sums[i] }))
}

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

export function buildStrokeDistribution(logs: SwimLog[]): {
  name: string
  value: number
  color: string
}[] {
  const counts = new Map<string, number>()
  for (const l of logs) {
    counts.set(l.stroke, (counts.get(l.stroke) ?? 0) + 1)
  }
  const total = logs.length || 1
  let i = 0
  return [...counts.entries()].map(([name, n]) => ({
    name,
    value: Math.round((n / total) * 100),
    color: CHART_COLORS[i++ % CHART_COLORS.length],
  }))
}

export function averageTeamImprovement(athletes: Swimmer[]): string {
  const pcts = athletes
    .map(athleteImprovementPercent)
    .filter((x): x is number => x !== null)
  if (!pcts.length) return "—"
  const avg = pcts.reduce((a, b) => a + b, 0) / pcts.length
  return `${avg >= 0 ? "+" : ""}${avg.toFixed(1)}%`
}

export function buildAnalyticsMetrics(logs: SwimLog[]): {
  label: string
  value: string
  change: number
  trend: "up" | "down"
}[] {
  if (!logs.length) {
    return [
      { label: "Avg Time", value: "—", change: 0, trend: "down" },
      { label: "Total Distance", value: "—", change: 0, trend: "up" },
      { label: "Sessions", value: "0", change: 0, trend: "up" },
      { label: "Improvement", value: "—", change: 0, trend: "up" },
    ]
  }

  const totalM = logs.reduce((s, l) => s + (Number(l.distance) || 0), 0)
  const km =
    totalM >= 1000
      ? `${(totalM / 1000).toFixed(1)}km`
      : `${Math.round(totalM)}m`

  const times = logs.map((l) => parseTimeToSeconds(l.time)).filter((t) => t > 0)
  const avgTime = times.length
    ? times.reduce((a, b) => a + b, 0) / times.length
    : 0
  const valueTime =
    avgTime >= 60
      ? `${Math.floor(avgTime / 60)}:${(avgTime % 60).toFixed(2).padStart(5, "0")}`
      : `${avgTime.toFixed(2)}s`

  const fs100 = buildFreestyle100ChartData(logs)
  let impNum = 0
  if (fs100.length >= 2 && fs100[0].time > 0) {
    impNum =
      ((fs100[0].time - fs100[fs100.length - 1].time) / fs100[0].time) * 100
  }
  const impLabel = improvementPercentLabel(fs100)

  return [
    {
      label: "Avg Time",
      value: valueTime,
      change: fs100.length >= 2 ? Math.abs(impNum) : 0,
      trend: impNum >= 0 ? "down" : "up",
    },
    { label: "Total Distance", value: km, change: 0, trend: "up" },
    { label: "Sessions", value: String(logs.length), change: 0, trend: "up" },
    {
      label: "Improvement",
      value: impLabel,
      change: fs100.length >= 2 ? Math.abs(impNum) : 0,
      trend: impNum >= 0 ? "up" : "down",
    },
  ]
}
