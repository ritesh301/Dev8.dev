-- CreateEnum for action types and status
CREATE TYPE "EnvironmentActionType" AS ENUM ('START', 'PAUSE', 'STOP', 'DELETE');
CREATE TYPE "EnvironmentActionStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- Rename performedBy column to userId
ALTER TABLE "EnvironmentActionLog" RENAME COLUMN "performedBy" TO "userId";

-- Change action column type from TEXT to enum
ALTER TABLE "EnvironmentActionLog" 
  ALTER COLUMN "action" TYPE "EnvironmentActionType" USING "action"::"EnvironmentActionType";

-- Change status column type from TEXT to enum and add default
ALTER TABLE "EnvironmentActionLog" 
  ALTER COLUMN "status" TYPE "EnvironmentActionStatus" USING "status"::"EnvironmentActionStatus",
  ALTER COLUMN "status" SET DEFAULT 'PENDING'::"EnvironmentActionStatus";

-- Add updatedAt column
ALTER TABLE "EnvironmentActionLog" 
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Set default for metadata if NULL
ALTER TABLE "EnvironmentActionLog" 
  ALTER COLUMN "metadata" SET DEFAULT '{}';

-- Add foreign key constraint for userId
ALTER TABLE "EnvironmentActionLog" 
  ADD CONSTRAINT "EnvironmentActionLog_userId_fkey" 
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add missing indexes from schema
CREATE INDEX IF NOT EXISTS "environment_action_logs_environmentId_action_idx" 
  ON "EnvironmentActionLog"("environmentId", "action");

CREATE INDEX IF NOT EXISTS "environment_action_logs_userId_idx" 
  ON "EnvironmentActionLog"("userId");

CREATE INDEX IF NOT EXISTS "environment_action_logs_createdAt_idx" 
  ON "EnvironmentActionLog"("createdAt");
