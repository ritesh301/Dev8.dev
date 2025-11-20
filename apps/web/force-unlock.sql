-- Terminate all connections that might be holding locks (except current one)
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE pid <> pg_backend_pid() 
  AND datname = current_database()
  AND application_name LIKE '%prisma%';

-- Force unlock all advisory locks
SELECT pg_advisory_unlock_all();

-- Check if there are still any advisory locks
SELECT locktype, database, classid, objid, objsubid, pid, mode, granted
FROM pg_locks 
WHERE locktype = 'advisory';
