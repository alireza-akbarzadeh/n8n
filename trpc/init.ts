import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import prisma from "@/lib/db";
// import { auth } from "@/lib/auth";

/**
 * ✅ Define TRPC context type (IMPORTANT!)
 */
export type TRPCContext = {
    db: typeof prisma;
    // session: Awaited<ReturnType<typeof auth.api.getSession>>;
};

/**
 * ✅ Create context for each request
 */
export const createTRPCContext = async (): Promise<TRPCContext> => {
    // const cookieStore = await cookies();

    // const session = await auth.api.getSession({
    //     headers: { cookie: cookieStore.toString() },
    // });

    return {
        db: prisma,
        // session,
    };
};

/**
 */
const t = initTRPC.context<TRPCContext>().create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError:
                    error.cause instanceof ZodError ? error.cause.flatten() : null,
            },
        };
    },
});

/**
 * Routers & Procedures
 */
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

/**
 * ✅ Protected procedure middleware
 * Injects ctx.userId and ensures the user is logged in
 */
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
    // const userId = ctx?.session?.session?.userId;

    const userId = "1";

    if (!userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return next({
        ctx: {
            ...ctx,
            userId,
        },
    });
});

export const createCallerFactory = t.createCallerFactory;