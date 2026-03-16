import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { roasts, submissions } from "@/db/schema";
import { baseProcedure, router } from "@/lib/trpc/init";

export const metricsRouter = router({
  getStats: baseProcedure.query(async () => {
    const totalResult = await db.select({ count: sql`count(*)` }).from(roasts);
    const totalRoasts = Number(totalResult[0]?.count ?? 0);

    const avgResult = await db
      .select({ avg: sql`avg(${roasts.score})` })
      .from(roasts);
    const avgScore = Number(avgResult[0]?.avg ?? 0);

    return {
      totalRoasts,
      avgScore: Math.round(avgScore * 10) / 10,
    };
  }),

  getShameLeaderboard: baseProcedure.query(async () => {
    const results = await db
      .select({
        id: roasts.id,
        score: roasts.score,
        code: submissions.code,
        language: submissions.language,
      })
      .from(roasts)
      .innerJoin(submissions, sql`${roasts.submissionId} = ${submissions.id}`)
      .orderBy(roasts.score)
      .limit(3);

    return results.map((row, index) => ({
      id: row.id,
      rank: `#${index + 1}`,
      score: (row.score / 10).toFixed(1),
      code: row.code,
      codePreview: row.code.slice(0, 50) + (row.code.length > 50 ? "..." : ""),
      language: row.language,
    }));
  }),

  getFullLeaderboard: baseProcedure.query(async () => {
    const results = await db
      .select({
        id: roasts.id,
        score: roasts.score,
        code: submissions.code,
        language: submissions.language,
      })
      .from(roasts)
      .innerJoin(submissions, sql`${roasts.submissionId} = ${submissions.id}`)
      .orderBy(roasts.score)
      .limit(20);

    return results.map((row, index) => ({
      id: row.id,
      rank: `#${index + 1}`,
      score: (row.score / 10).toFixed(1),
      code: row.code,
      codePreview: row.code.slice(0, 50) + (row.code.length > 50 ? "..." : ""),
      language: row.language,
      lineCount: row.code.split("\n").length,
    }));
  }),

  getRoastById: baseProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const result = await db
        .select({
          id: roasts.id,
          score: roasts.score,
          roastContent: roasts.roastContent,
          suggestedFix: roasts.suggestedFix,
          roastMode: roasts.roastMode,
          createdAt: roasts.createdAt,
          code: submissions.code,
          language: submissions.language,
        })
        .from(roasts)
        .innerJoin(submissions, sql`${roasts.submissionId} = ${submissions.id}`)
        .where(eq(roasts.id, input.id))
        .limit(1);

      if (result.length === 0) {
        throw new Error("Roast not found");
      }

      const row = result[0];
      return {
        id: row.id,
        score: row.score / 10,
        roastContent: row.roastContent,
        suggestedFix: row.suggestedFix,
        roastMode: row.roastMode,
        code: row.code,
        language: row.language,
        createdAt: row.createdAt,
      };
    }),
});
