-- CreateEnum for action types and status
CREATE TYPE "EnvironmentActionType" AS ENUM ('START', 'PAUSE', 'STOP', 'DELETE');
CREATE TYPE "EnvironmentActionStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- Rename performedBy column to userId
ALTER TABLE "environment_action_logs" RENAME COLUMN "performedBy" TO "userId";

-- Change action column type from TEXT to enum
ALTER TABLE "environment_action_logs" 
  ALTER COLUMN "action" TYPE "EnvironmentActionType" USING "action"::"EnvironmentActionType";

-- Change status column type from TEXT to enum and add default
ALTER TABLE "environment_action_logs" 
  ALTER COLUMN "status" TYPE "EnvironmentActionStatus" USING "status"::"EnvironmentActionStatus",
  ALTER COLUMN "status" SET DEFAULT 'PENDING'::"EnvironmentActionStatus";

-- Add updatedAt column
ALTER TABLE "environment_action_logs" 
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Set default for metadata if NULL
ALTER TABLE "environment_action_logs" 
  ALTER COLUMN "metadata" SET DEFAULT '{}';

-- Add foreign key constraint for userId
ALTER TABLE "environment_action_logs" 
  ADD CONSTRAINT "environment_action_logs_userId_fkey" 
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add missing indexes from schema
CREATE INDEX IF NOT EXISTS "environment_action_logs_environmentId_action_idx" 
  ON "environment_action_logs"("environmentId", "action");

CREATE INDEX IF NOT EXISTS "environment_action_logs_userId_idx" 
  ON "environment_action_logs"("userId");

CREATE INDEX IF NOT EXISTS "environment_action_logs_createdAt_idx" 
  ON "environment_action_logs"("createdAt");
