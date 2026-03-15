import { sql } from "drizzle-orm";
import { db } from "@/db";
import { roasts } from "@/db/schema";
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
});
