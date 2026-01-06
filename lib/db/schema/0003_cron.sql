DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'cleanup_expired_rooms') THEN
    PERFORM cron.unschedule('cleanup_expired_rooms');
  END IF;
END$$;

SELECT cron.schedule(
  'cleanup_expired_rooms',
  '* * * * *',
  $$DELETE FROM rooms WHERE expired_at < now();$$
);