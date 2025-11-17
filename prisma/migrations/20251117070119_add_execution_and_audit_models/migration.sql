-- CreateEnum
CREATE TYPE "ExecutionStatus" AS ENUM ('PENDING', 'RUNNING', 'SUCCESS', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ExecutionMode" AS ENUM ('MANUAL', 'WEBHOOK', 'SCHEDULE', 'TEST');

-- CreateEnum
CREATE TYPE "CredentialType" AS ENUM ('API_KEY', 'OAUTH2', 'BASIC_AUTH', 'BEARER_TOKEN', 'SSH_KEY', 'AWS_CREDENTIALS');

-- CreateEnum
CREATE TYPE "WebhookMethod" AS ENUM ('GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'EXECUTE', 'VIEW', 'EXPORT', 'IMPORT');

-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('WORKFLOW', 'EXECUTION', 'CREDENTIAL', 'WEBHOOK', 'USER', 'NODE');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NodeType" ADD VALUE 'WEBHOOK_TRIGGER';
ALTER TYPE "NodeType" ADD VALUE 'SCHEDULE_TRIGGER';
ALTER TYPE "NodeType" ADD VALUE 'EMAIL_TRIGGER';
ALTER TYPE "NodeType" ADD VALUE 'SEND_EMAIL';
ALTER TYPE "NodeType" ADD VALUE 'DATABASE_QUERY';
ALTER TYPE "NodeType" ADD VALUE 'DATA_TRANSFORMER';
ALTER TYPE "NodeType" ADD VALUE 'CODE_EXECUTOR';
ALTER TYPE "NodeType" ADD VALUE 'FILTER';
ALTER TYPE "NodeType" ADD VALUE 'ROUTER';
ALTER TYPE "NodeType" ADD VALUE 'MERGE';
ALTER TYPE "NodeType" ADD VALUE 'SPLIT';
ALTER TYPE "NodeType" ADD VALUE 'GOOGLE_SHEETS';
ALTER TYPE "NodeType" ADD VALUE 'SLACK';
ALTER TYPE "NodeType" ADD VALUE 'GITHUB';

-- CreateTable
CREATE TABLE "execution" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "status" "ExecutionStatus" NOT NULL,
    "mode" "ExecutionMode" NOT NULL DEFAULT 'MANUAL',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "duration" INTEGER,
    "error" TEXT,
    "errorStack" TEXT,
    "nodeResults" JSONB,
    "triggerData" JSONB,
    "userId" TEXT NOT NULL,

    CONSTRAINT "execution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credential" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "CredentialType" NOT NULL,
    "data" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastUsedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "credential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhook" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "method" "WebhookMethod" NOT NULL DEFAULT 'POST',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastTrigger" TIMESTAMP(3),
    "triggerCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "webhook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" TEXT NOT NULL,
    "action" "AuditAction" NOT NULL,
    "entityType" "EntityType" NOT NULL,
    "entityId" TEXT NOT NULL,
    "userId" TEXT,
    "metadata" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "executionId" TEXT,
    "credentialId" TEXT,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "execution_workflowId_idx" ON "execution"("workflowId");

-- CreateIndex
CREATE INDEX "execution_userId_idx" ON "execution"("userId");

-- CreateIndex
CREATE INDEX "execution_status_idx" ON "execution"("status");

-- CreateIndex
CREATE INDEX "execution_startedAt_idx" ON "execution"("startedAt");

-- CreateIndex
CREATE INDEX "credential_userId_idx" ON "credential"("userId");

-- CreateIndex
CREATE INDEX "credential_type_idx" ON "credential"("type");

-- CreateIndex
CREATE UNIQUE INDEX "webhook_path_key" ON "webhook"("path");

-- CreateIndex
CREATE INDEX "webhook_workflowId_idx" ON "webhook"("workflowId");

-- CreateIndex
CREATE INDEX "webhook_isActive_idx" ON "webhook"("isActive");

-- CreateIndex
CREATE INDEX "audit_log_userId_idx" ON "audit_log"("userId");

-- CreateIndex
CREATE INDEX "audit_log_action_idx" ON "audit_log"("action");

-- CreateIndex
CREATE INDEX "audit_log_entityType_idx" ON "audit_log"("entityType");

-- CreateIndex
CREATE INDEX "audit_log_timestamp_idx" ON "audit_log"("timestamp");

-- AddForeignKey
ALTER TABLE "execution" ADD CONSTRAINT "execution_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "execution" ADD CONSTRAINT "execution_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credential" ADD CONSTRAINT "credential_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_executionId_fkey" FOREIGN KEY ("executionId") REFERENCES "execution"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_credentialId_fkey" FOREIGN KEY ("credentialId") REFERENCES "credential"("id") ON DELETE SET NULL ON UPDATE CASCADE;
