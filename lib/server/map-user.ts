import type { InferSelectModel } from "drizzle-orm"
import { parseTimeToSeconds } from "@/lib/domain/time"
import type { SwimLog, Swimmer, User } from "@/lib/domain/types"
import { profiles, swimmers, swimLogs } from "@/lib/db/schema"

type ProfileRow = InferSelectModel<typeof profiles>
type SwimmerRow = InferSelectModel<typeof swimmers>
type SwimLogRow = InferSelectModel<typeof swimLogs>

function rowToSwimLog(row: SwimLogRow): SwimLog {
  const d = row.loggedAt
  const dateStr = typeof d === "string" ? d : (d as Date).toISOString().slice(0, 10)
  return {
    id: row.id,
    date: dateStr,
    stroke: row.stroke,
    distance: row.distance,
    time: row.timeDisplay,
    splits: row.splits ?? undefined,
    notes: row.notes ?? undefined,
  }
}

function computePersonalBests(logs: SwimLog[]): Swimmer["personalBests"] {
  const best = new Map<string, SwimLog>()
  for (const log of logs) {
    const key = `${log.stroke}\0${log.distance}`
    const t = parseTimeToSeconds(log.time)
    const cur = best.get(key)
    if (!cur || parseTimeToSeconds(cur.time) > t) {
      best.set(key, log)
    }
  }
  return [...best.values()].map((l) => ({
    stroke: l.stroke,
    distance: l.distance,
    time: l.time,
  }))
}

function buildSwimmer(row: SwimmerRow, logs: SwimLog[]): Swimmer {
  return {
    id: row.id,
    name: row.name,
    personalBests: computePersonalBests(logs),
    logs: [...logs].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    ),
  }
}

export function buildUserFromRows(
  profile: ProfileRow,
  swimmerRows: SwimmerRow[],
  logRows: SwimLogRow[]
): User {
  const logsBySwimmer = new Map<string, SwimLogRow[]>()
  for (const l of logRows) {
    if (!logsBySwimmer.has(l.swimmerId)) logsBySwimmer.set(l.swimmerId, [])
    logsBySwimmer.get(l.swimmerId)!.push(l)
  }

  const base: User = {
    id: profile.id,
    name: profile.displayName,
    email: profile.email,
    role: profile.role as User["role"],
    subscription: profile.subscription as User["subscription"],
  }

  if (profile.role === "swimmer") {
    const self = swimmerRows.find((s) => s.kind === "self")
    if (self) {
      const swimLogsFor = (logsBySwimmer.get(self.id) ?? []).map(rowToSwimLog)
      base.swimmerProfile = buildSwimmer(self, swimLogsFor)
    }
  } else if (profile.role === "parent") {
    const kids = swimmerRows.filter((s) => s.kind === "child")
    base.children = kids.map((k) =>
      buildSwimmer(k, (logsBySwimmer.get(k.id) ?? []).map(rowToSwimLog))
    )
  } else if (profile.role === "coach") {
    const athletes = swimmerRows.filter((s) => s.kind === "athlete")
    base.athletes = athletes.map((a) =>
      buildSwimmer(a, (logsBySwimmer.get(a.id) ?? []).map(rowToSwimLog))
    )
  }

  return base
}
