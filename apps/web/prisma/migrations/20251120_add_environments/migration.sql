-- CreateEnum
CREATE TYPE "EnvironmentStatus" AS ENUM ('CREATING', 'RUNNING', 'STOPPED', 'PAUSED', 'DELETING', 'FAILED');

-- CreateEnum
CREATE TYPE "IDEType" AS ENUM ('VSCODE', 'JUPYTERLAB', 'CODESPACES');

-- CreateEnum
CREATE TYPE "AgentType" AS ENUM ('NONE', 'COPILOT', 'CLAUDE', 'GEMINI');

-- CreateEnum
CREATE TYPE "CloudProvider" AS ENUM ('AZURE', 'AWS', 'GCP');

-- CreateTable
CREATE TABLE "Environment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "EnvironmentStatus" NOT NULL DEFAULT 'CREATING',
    "ideType" "IDEType" NOT NULL DEFAULT 'VSCODE',
    "agentType" "AgentType" NOT NULL DEFAULT 'NONE',
    "dockerImage" TEXT,
    "autoStopMinutes" INTEGER NOT NULL DEFAULT 30,
    "autoStopEnabled" BOOLEAN NOT NULL DEFAULT true,
    "cloudProvider" "CloudProvider" NOT NULL DEFAULT 'AZURE',
    "cloudRegion" TEXT NOT NULL DEFAULT 'centralindia',
    "aciContainerGroupId" TEXT,
    "aciPublicIp" TEXT,
    "azureFileShareName" TEXT,
    "vsCodeUrl" TEXT,
    "sshConnectionString" TEXT,
    "cpuCores" INTEGER NOT NULL DEFAULT 2,
    "memoryGB" INTEGER NOT NULL DEFAULT 4,
    "storageGB" INTEGER NOT NULL DEFAULT 20,
    "instanceType" TEXT NOT NULL DEFAULT 'balanced',
    "baseImage" TEXT NOT NULL DEFAULT 'node',
    "templateName" TEXT,
    "environmentVariables" JSONB,
    "ports" JSONB,
    "estimatedCostPerHour" DOUBLE PRECISION DEFAULT 0.0,
    "totalCost" DOUBLE PRECISION DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastAccessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stoppedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Environment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnvironmentActionLog" (
    "id" TEXT NOT NULL,
    "environmentId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "message" TEXT,
    "performedBy" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EnvironmentActionLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResourceUsage" (
    "id" TEXT NOT NULL,
    "environmentId" TEXT NOT NULL,
    "cpuUsagePercent" DOUBLE PRECISION NOT NULL,
    "memoryUsageMB" DOUBLE PRECISION NOT NULL,
    "diskUsageMB" DOUBLE PRECISION NOT NULL,
    "networkInMB" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "networkOutMB" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResourceUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnvironmentSnapshot" (
    "id" TEXT NOT NULL,
    "environmentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "storageUrl" TEXT NOT NULL,
    "sizeBytes" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EnvironmentSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnvironmentSSHKey" (
    "id" TEXT NOT NULL,
    "environmentId" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EnvironmentSSHKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnvironmentSecret" (
    "id" TEXT NOT NULL,
    "environmentId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "encryptedValue" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EnvironmentSecret_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Environment_userId_idx" ON "Environment"("userId");

-- CreateIndex
CREATE INDEX "Environment_status_idx" ON "Environment"("status");

-- CreateIndex
CREATE INDEX "Environment_deletedAt_idx" ON "Environment"("deletedAt");

-- CreateIndex
CREATE INDEX "EnvironmentActionLog_environmentId_idx" ON "EnvironmentActionLog"("environmentId");

-- CreateIndex
CREATE INDEX "ResourceUsage_environmentId_idx" ON "ResourceUsage"("environmentId");

-- CreateIndex
CREATE INDEX "ResourceUsage_timestamp_idx" ON "ResourceUsage"("timestamp");

-- CreateIndex
CREATE INDEX "EnvironmentSnapshot_environmentId_idx" ON "EnvironmentSnapshot"("environmentId");

-- CreateIndex
CREATE INDEX "EnvironmentSSHKey_environmentId_idx" ON "EnvironmentSSHKey"("environmentId");

-- CreateIndex
CREATE UNIQUE INDEX "EnvironmentSSHKey_fingerprint_key" ON "EnvironmentSSHKey"("fingerprint");

-- CreateIndex
CREATE INDEX "EnvironmentSecret_environmentId_idx" ON "EnvironmentSecret"("environmentId");

-- CreateIndex
CREATE UNIQUE INDEX "EnvironmentSecret_environmentId_key_key" ON "EnvironmentSecret"("environmentId", "key");

-- AddForeignKey
ALTER TABLE "Environment" ADD CONSTRAINT "Environment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnvironmentActionLog" ADD CONSTRAINT "EnvironmentActionLog_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "Environment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceUsage" ADD CONSTRAINT "ResourceUsage_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "Environment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnvironmentSnapshot" ADD CONSTRAINT "EnvironmentSnapshot_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "Environment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnvironmentSSHKey" ADD CONSTRAINT "EnvironmentSSHKey_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "Environment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnvironmentSecret" ADD CONSTRAINT "EnvironmentSecret_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "Environment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
