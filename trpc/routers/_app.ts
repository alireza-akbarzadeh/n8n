import {createTRPCRouter, protectedProcedure} from '../init';

export const appRouter = createTRPCRouter({
    getUsers: protectedProcedure.query(async ({ctx}) => {
        return ctx.db.user.findMany({
            where: {
                id: ctx.userId
            }
        });
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;