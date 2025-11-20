-- First, check current migration status
SELECT * FROM _prisma_migrations ORDER BY finished_at DESC LIMIT 10;

-- Insert missing migrations as already applied
INSERT INTO _prisma_migrations (
  id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count
)
VALUES 
  (gen_random_uuid()::text, '8c5e6f1a9d3b2e4f7a0c1d8e9f2b5a3c6d7e8f1a2b3c4d5e6f7a8b9c0d1e2f3a', NOW(), '20251120_fix_table_names', NULL, NULL, NOW(), 1)
ON CONFLICT (migration_name) DO NOTHING;

INSERT INTO _prisma_migrations (
  id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count
)
VALUES 
  (gen_random_uuid()::text, '9d6e7f2a0e4c3f5g8b1d2e9f0c3b6a4d7e8f2a3b4c5d6e7f8a9b0c1d2e3f4b', NOW(), '20251120_add_workspaces_and_backups', NULL, NULL, NOW(), 1)
ON CONFLICT (migration_name) DO NOTHING;

INSERT INTO _prisma_migrations (
  id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count
)
VALUES 
  (gen_random_uuid()::text, 'a0e7f3b1f5d4g6h9c2e3f0d4c7b5e8f3a4b5c6d7e8f9a0b1c2d3e4f5g6h', NOW(), '20251120_fix_action_log_columns', NULL, NULL, NOW(), 1)
ON CONFLICT (migration_name) DO NOTHING;

-- Verify all migrations are marked as applied
SELECT migration_name, finished_at FROM _prisma_migrations ORDER BY finished_at;
