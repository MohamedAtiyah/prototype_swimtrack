import {
  pgTable,
  text,
  uuid,
  integer,
  real,
  date,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core"

export const profiles = pgTable("profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  email: text("email").notNull(),
  displayName: text("display_name").notNull(),
  role: text("role").notNull(),
  subscription: text("subscription").notNull().default("free"),
  teamName: text("team_name"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
})

export const swimmers = pgTable("swimmers", {
  id: uuid("id").defaultRandom().primaryKey(),
  profileId: uuid("profile_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  kind: text("kind").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
})

export const swimLogs = pgTable("swim_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  swimmerId: uuid("swimmer_id")
    .notNull()
    .references(() => swimmers.id, { onDelete: "cascade" }),
  loggedAt: date("logged_at").notNull(),
  stroke: text("stroke").notNull(),
  distance: integer("distance").notNull(),
  timeDisplay: text("time_display").notNull(),
  timeSeconds: real("time_seconds").notNull(),
  splits: jsonb("splits").$type<string[] | null>(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
})
