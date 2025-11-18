import prisma from '@/shared/infrastructure/database/db';

export type TRPCContext = {
  db: typeof prisma;
  requestId: string;
  userId?: string;
  isAuthenticated: boolean;
};
