/*
  Warnings:

  - The values [HTTP_REQUSET] on the enum `NodeType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `nodeId` on the `Connection` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "NodeType_new" AS ENUM ('INITIAL', 'MANUAL_TRIGGER', 'HTTP_REQUEST');
ALTER TABLE "Node" ALTER COLUMN "type" TYPE "NodeType_new" USING ("type"::text::"NodeType_new");
ALTER TYPE "NodeType" RENAME TO "NodeType_old";
ALTER TYPE "NodeType_new" RENAME TO "NodeType";
DROP TYPE "public"."NodeType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Connection" DROP CONSTRAINT "Connection_nodeId_fkey";

-- AlterTable
ALTER TABLE "Connection" DROP COLUMN "nodeId";
