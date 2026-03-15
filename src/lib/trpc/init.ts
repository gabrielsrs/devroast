import { initTRPC } from "@trpc/server";
import { cache } from "react";

export const createTRPCContext = cache(async () => {
  return {
    // Add context here (headers, auth, etc.)
  };
});

const t = initTRPC.create();

export const router = t.router;
export const baseProcedure = t.procedure;
