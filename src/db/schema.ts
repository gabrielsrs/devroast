import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const roastModeEnum = pgEnum("roastMode", ["helpful", "sarcastic"]);

export const languageEnum = pgEnum("language", [
  "javascript",
  "typescript",
  "python",
  "java",
  "csharp",
  "cpp",
  "go",
  "rust",
  "ruby",
  "php",
  "swift",
  "kotlin",
  "sql",
  "html",
  "css",
  "json",
  "yaml",
  "markdown",
  "bash",
  "other",
]);

export const submissions = pgTable("submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: text("code").notNull(),
  language: languageEnum("language").default("other"),
  roastMode: roastModeEnum("roastMode").default("sarcastic"),
  createdAt: timestamp("createdAt", { withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull(),
});

export const roasts = pgTable("roasts", {
  id: uuid("id").defaultRandom().primaryKey(),
  submissionId: uuid("submissionId").notNull(),
  roastContent: text("roastContent").notNull(),
  score: integer("score").notNull(),
  roastMode: roastModeEnum("roastMode").default("sarcastic"),
  createdAt: timestamp("createdAt", { withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull(),
});

export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;
export type Roast = typeof roasts.$inferSelect;
export type NewRoast = typeof roasts.$inferInsert;
