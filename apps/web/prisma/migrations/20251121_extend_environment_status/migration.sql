-- Extend EnvironmentStatus enum to match Prisma schema
DO $$ BEGIN
  ALTER TYPE "EnvironmentStatus" ADD VALUE 'STARTING';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TYPE "EnvironmentStatus" ADD VALUE 'STOPPING';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Rename FAILED -> ERROR for consistency with schema
DO $$ BEGIN
  ALTER TYPE "EnvironmentStatus" RENAME VALUE 'FAILED' TO 'ERROR';
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;
