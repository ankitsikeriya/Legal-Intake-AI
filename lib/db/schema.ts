
import { pgTable, text, integer, timestamp, boolean, serial, jsonb } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull(),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull()
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId").notNull().references(() => user.id)
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId").notNull().references(() => user.id),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull()
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt"),
  updatedAt: timestamp("updatedAt")
});

export const cases = pgTable('cases', {
  id: serial('id').primaryKey(),
  clientName: text('client_name').notNull(),
  email: text('email'),
  status: text('status').notNull().default('pending'), // 'pending', 'completed'
  createdAt: timestamp('created_at').defaultNow(),
  summary: text('summary'), // AI generated summary
  chatHistory: jsonb('chat_history'), // Store full conversation
  analysis: jsonb('analysis'), // Structured analysis: { score, redFlags, evidence, timeline }
  userId: text('user_id'), // Link cases to lawyers

  // Lawyer Review Fields
  isReviewed: boolean('is_reviewed').default(false),
  reviewedBy: text('reviewed_by'), // Name or ID of reviewer
  reviewedAt: timestamp('reviewed_at'),
  internalNotes: text('internal_notes'), // Lawyer's private notes
});

export const caseLogs = pgTable('case_logs', {
  id: serial('id').primaryKey(),
  caseId: integer('case_id').references(() => cases.id),
  action: text('action').notNull(), // e.g. 'AI_ANALYSIS', 'EDIT_SUMMARY', 'REVIEWED'
  details: text('details'), // Optional metadata
  actor: text('actor').notNull(), // 'AI' or Lawyer Name
  createdAt: timestamp('created_at').defaultNow(),
});

export type Case = typeof cases.$inferSelect;
export type NewCase = typeof cases.$inferInsert;
