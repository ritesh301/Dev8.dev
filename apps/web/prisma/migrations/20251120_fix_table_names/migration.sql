-- Rename tables to match Prisma schema @@map directives
ALTER TABLE "Environment" RENAME TO "environments";
ALTER TABLE "EnvironmentActionLog" RENAME TO "environment_action_logs";
ALTER TABLE "EnvironmentSecret" RENAME TO "environment_secrets";
ALTER TABLE "EnvironmentSnapshot" RENAME TO "environment_snapshots";
ALTER TABLE "EnvironmentSSHKey" RENAME TO "environment_ssh_keys";
ALTER TABLE "ResourceUsage" RENAME TO "resource_usage";
