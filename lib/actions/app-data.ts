"use server"

import { auth } from "@clerk/nextjs/server"
import { and, eq, inArray } from "drizzle-orm"
import { getDb } from "@/lib/db"
import { profiles, swimmers, swimLogs } from "@/lib/db/schema"
import { buildUserFromRows } from "@/lib/server/map-user"
import type { User } from "@/lib/domain/types"
import { parseTimeToSeconds } from "@/lib/domain/time"

export type LoadAppStateResult =
  | { ok: true; user: User | null }
  | { ok: false; error: string }

async function requireUserId(): Promise<string | null> {
  const { userId } = await auth()
  return userId ?? null
}

export async function loadAppStateAction(): Promise<LoadAppStateResult> {
  try {
    const userId = await requireUserId()
    if (!userId) {
      return { ok: true, user: null }
    }

    const db = getDb()
    const profileRows = await db
      .select()
      .from(profiles)
      .where(eq(profiles.clerkUserId, userId))
      .limit(1)
    const profile = profileRows[0]
    if (!profile) {
      return { ok: true, user: null }
    }

    const swimmerRows = await db
      .select()
      .from(swimmers)
      .where(eq(swimmers.profileId, profile.id))

    const swimmerIds = swimmerRows.map((s) => s.id)
    const logRows =
      swimmerIds.length > 0
        ? await db
            .select()
            .from(swimLogs)
            .where(inArray(swimLogs.swimmerId, swimmerIds))
        : []

    const user = buildUserFromRows(profile, swimmerRows, logRows)
    return { ok: true, user }
  } catch (e) {
    console.error(e)
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Failed to load account",
    }
  }
}

export type CompleteOnboardingInput = {
  role: "swimmer" | "parent" | "coach"
  displayName: string
  email: string
  childrenNames?: string[]
  teamName?: string
}

export async function completeOnboardingAction(
  input: CompleteOnboardingInput
): Promise<LoadAppStateResult> {
  try {
    const userId = await requireUserId()
    if (!userId) {
      return { ok: false, error: "Sign in required to create your account." }
    }

    const db = getDb()
    const existingRows = await db
      .select()
      .from(profiles)
      .where(eq(profiles.clerkUserId, userId))
      .limit(1)
    if (existingRows[0]) {
      return loadAppStateAction()
    }

    const displayName = input.displayName.trim()
    const email = input.email.trim()
    if (!displayName || !email) {
      return { ok: false, error: "Name and email are required." }
    }

    await db.transaction(async (tx) => {
      const [profile] = await tx
        .insert(profiles)
        .values({
          clerkUserId: userId,
          email,
          displayName,
          role: input.role,
          subscription: "free",
          teamName: input.teamName?.trim() || null,
        })
        .returning()

      const toInsert: { profileId: string; name: string; kind: string }[] = []

      if (input.role === "swimmer") {
        toInsert.push({
          profileId: profile.id,
          name: displayName,
          kind: "self",
        })
      } else if (input.role === "parent") {
        const names = (input.childrenNames ?? [])
          .map((n) => n.trim())
          .filter(Boolean)
        if (names.length === 0) {
          throw new Error("Add at least one child name.")
        }
        for (const name of names) {
          toInsert.push({ profileId: profile.id, name, kind: "child" })
        }
      }
      // coach: no swimmers until they add athletes

      if (toInsert.length > 0) {
        await tx.insert(swimmers).values(toInsert)
      }
    })

    return loadAppStateAction()
  } catch (e) {
    console.error(e)
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Could not complete setup",
    }
  }
}

export async function addAthleteAction(
  name: string
): Promise<LoadAppStateResult> {
  try {
    const userId = await requireUserId()
    if (!userId) {
      return { ok: false, error: "Sign in required." }
    }

    const trimmed = name.trim()
    if (!trimmed) {
      return { ok: false, error: "Athlete name is required." }
    }

    const db = getDb()
    const profRows = await db
      .select()
      .from(profiles)
      .where(eq(profiles.clerkUserId, userId))
      .limit(1)
    const profile = profRows[0]
    if (!profile || profile.role !== "coach") {
      return { ok: false, error: "Only coach accounts can add athletes." }
    }

    await db.insert(swimmers).values({
      profileId: profile.id,
      name: trimmed,
      kind: "athlete",
    })

    return loadAppStateAction()
  } catch (e) {
    console.error(e)
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Could not add athlete",
    }
  }
}

export type CreateSwimLogInput = {
  swimmerId: string
  date: string
  stroke: string
  distance: number
  timeDisplay: string
  splits?: string[]
  notes?: string
}

export async function createSwimLogAction(
  input: CreateSwimLogInput
): Promise<LoadAppStateResult> {
  try {
    const userId = await requireUserId()
    if (!userId) {
      return { ok: false, error: "Sign in required." }
    }

    const db = getDb()
    const rows = await db
      .select({ swimmerId: swimmers.id, clerkId: profiles.clerkUserId })
      .from(swimmers)
      .innerJoin(profiles, eq(swimmers.profileId, profiles.id))
      .where(
        and(eq(swimmers.id, input.swimmerId), eq(profiles.clerkUserId, userId))
      )

    if (rows.length === 0) {
      return { ok: false, error: "Swimmer not found on your account." }
    }

    const timeSeconds = parseTimeToSeconds(input.timeDisplay)
    const splits =
      input.splits?.filter((s) => s.trim().length > 0).map((s) => s.trim()) ??
      undefined

    await db.insert(swimLogs).values({
      swimmerId: input.swimmerId,
      loggedAt: input.date,
      stroke: input.stroke,
      distance: input.distance,
      timeDisplay: input.timeDisplay,
      timeSeconds,
      splits: splits ?? null,
      notes: input.notes?.trim() || null,
    })

    return loadAppStateAction()
  } catch (e) {
    console.error(e)
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Could not save swim",
    }
  }
}

export async function updateProfileAction(input: {
  displayName: string
  email: string
}): Promise<LoadAppStateResult> {
  try {
    const userId = await requireUserId()
    if (!userId) {
      return { ok: false, error: "Sign in required." }
    }

    const displayName = input.displayName.trim()
    const email = input.email.trim()
    if (!displayName || !email) {
      return { ok: false, error: "Name and email are required." }
    }

    const db = getDb()
    const profRows = await db
      .select()
      .from(profiles)
      .where(eq(profiles.clerkUserId, userId))
      .limit(1)
    const profile = profRows[0]
    if (!profile) {
      return { ok: false, error: "No profile found." }
    }

    await db
      .update(profiles)
      .set({
        displayName,
        email,
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, profile.id))

    if (profile.role === "swimmer") {
      await db
        .update(swimmers)
        .set({ name: displayName })
        .where(
          and(eq(swimmers.profileId, profile.id), eq(swimmers.kind, "self"))
        )
    }

    return loadAppStateAction()
  } catch (e) {
    console.error(e)
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Could not update profile",
    }
  }
}
