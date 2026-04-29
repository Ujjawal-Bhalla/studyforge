ALTER TABLE pomodoro_sessions
  ADD COLUMN IF NOT EXISTS mode_type TEXT NOT NULL DEFAULT 'pomodoro';

ALTER TABLE pomodoro_sessions
  ADD COLUMN IF NOT EXISTS phase_type TEXT NOT NULL DEFAULT 'focus',
  ADD COLUMN IF NOT EXISTS preset_key TEXT DEFAULT 'classic',
  ADD COLUMN IF NOT EXISTS target_duration INTEGER,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS remaining_seconds INTEGER,
  ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP NULL;

ALTER TABLE pomodoro_sessions
  ALTER COLUMN preset_key DROP NOT NULL,
  ALTER COLUMN target_duration DROP NOT NULL;

UPDATE pomodoro_sessions
SET mode_type = COALESCE(mode_type, 'pomodoro'),
    phase_type = COALESCE(phase_type, 'focus'),
    preset_key = COALESCE(preset_key, 'classic'),
    target_duration = COALESCE(target_duration, CASE WHEN duration IS NOT NULL AND duration > 0 THEN duration ELSE 1500 END),
    status = COALESCE(status, CASE WHEN end_time IS NULL THEN 'active' ELSE 'completed' END),
    completed_at = COALESCE(completed_at, end_time)
WHERE mode_type IS NULL
   OR phase_type IS NULL
   OR preset_key IS NULL
   OR target_duration IS NULL
   OR status IS NULL;
