import { router } from "@/lib/trpc/init";
import { metricsRouter } from "./routers/metrics";

export const appRouter = router({
  metrics: metricsRouter,
});

export type AppRouter = typeof appRouter;
