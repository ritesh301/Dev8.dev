-- Release all advisory locks
SELECT pg_advisory_unlock_all();

-- Check for any remaining locks
SELECT * FROM pg_locks WHERE locktype = 'advisory';
