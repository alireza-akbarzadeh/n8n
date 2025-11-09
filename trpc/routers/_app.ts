import {createTRPCRouter, publicProcedure} from '../init';

export const appRouter = createTRPCRouter({
    getUsers: publicProcedure.query(async ({ctx}) => {
        const users = await ctx.db.user.findMany() || []

        return {
            users
        };
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;