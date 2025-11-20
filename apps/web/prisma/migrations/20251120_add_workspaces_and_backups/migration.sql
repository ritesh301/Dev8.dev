-- CreateEnum
CREATE TYPE "BackupTrigger" AS ENUM ('MANUAL', 'PRE_SHUTDOWN', 'SCHEDULED');

-- CreateEnum
CREATE TYPE "BackupStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "workspaces" (
    "id" TEXT NOT NULL,
    "environmentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "storageType" TEXT NOT NULL DEFAULT 'azure-blob',
    "azureStorageAccount" TEXT,
    "azureContainerName" TEXT,
    "azureBlobPrefix" TEXT,
    "backupEnabled" BOOLEAN NOT NULL DEFAULT true,
    "backupRetentionDays" INTEGER NOT NULL DEFAULT 30,
    "lastBackupAt" TIMESTAMP(3),
    "totalSizeMB" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workspaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "backups" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "environmentId" TEXT NOT NULL,
    "trigger" "BackupTrigger" NOT NULL,
    "status" "BackupStatus" NOT NULL DEFAULT 'PENDING',
    "backupPath" TEXT,
    "backupSizeMB" INTEGER,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "metadata" JSONB DEFAULT '{}',

    CONSTRAINT "backups_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "workspaces_environmentId_key" ON "workspaces"("environmentId");

-- CreateIndex
CREATE INDEX "workspaces_userId_idx" ON "workspaces"("userId");

-- CreateIndex
CREATE INDEX "workspaces_environmentId_idx" ON "workspaces"("environmentId");

-- CreateIndex
CREATE INDEX "backups_workspaceId_idx" ON "backups"("workspaceId");

-- CreateIndex
CREATE INDEX "backups_environmentId_idx" ON "backups"("environmentId");

-- CreateIndex
CREATE INDEX "backups_status_idx" ON "backups"("status");

-- CreateIndex
CREATE INDEX "backups_startedAt_idx" ON "backups"("startedAt");

-- AddForeignKey
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "Environment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "backups" ADD CONSTRAINT "backups_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "backups" ADD CONSTRAINT "backups_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "Environment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
