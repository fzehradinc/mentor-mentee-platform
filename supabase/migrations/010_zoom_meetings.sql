-- BiMentor | Zoom Entegre Randevu Sistemi
-- meetings tablosu + mentor_stats

-- Meetings (Zoom entegre)
CREATE TABLE IF NOT EXISTS public.meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  mentee_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  duration_min INTEGER,                -- gerçek süre (webhook sonrası)
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled','started','ended','cancelled')),
  zoom_meeting_id TEXT,
  zoom_join_url TEXT,
  zoom_host_url TEXT,
  topic TEXT,
  agenda TEXT,
  created_by UUID NOT NULL REFERENCES app_users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT meetings_chk_time CHECK (ends_at > starts_at)
);

CREATE INDEX IF NOT EXISTS idx_meetings_mentor ON meetings(mentor_id, starts_at DESC);
CREATE INDEX IF NOT EXISTS idx_meetings_mentee ON meetings(mentee_id, starts_at DESC);
CREATE INDEX IF NOT EXISTS idx_meetings_status ON meetings(status, starts_at);
CREATE INDEX IF NOT EXISTS idx_meetings_zoom ON meetings(zoom_meeting_id) WHERE zoom_meeting_id IS NOT NULL;

-- Mentor Stats (kazançlar, toplam seans)
CREATE TABLE IF NOT EXISTS public.mentor_stats (
  mentor_id UUID PRIMARY KEY REFERENCES app_users(id) ON DELETE CASCADE,
  total_minutes INTEGER NOT NULL DEFAULT 0,
  session_count INTEGER NOT NULL DEFAULT 0,
  last_session_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mentor_stats_mentor ON mentor_stats(mentor_id);

-- View: Mentor session summary
CREATE OR REPLACE VIEW public.mentor_session_summary AS
  SELECT 
    m.mentor_id,
    COUNT(*) FILTER (WHERE m.status = 'ended') AS completed_sessions,
    COALESCE(SUM(m.duration_min) FILTER (WHERE m.status = 'ended'), 0) AS completed_minutes,
    COUNT(*) FILTER (WHERE m.status = 'scheduled') AS upcoming_sessions
  FROM meetings m
  GROUP BY m.mentor_id;

-- Trigger for updated_at
CREATE TRIGGER update_meetings_updated_at BEFORE UPDATE ON meetings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mentor_stats_updated_at BEFORE UPDATE ON mentor_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE meetings IS 'Zoom entegre mentor-mentee toplantıları';
COMMENT ON TABLE mentor_stats IS 'Mentor istatistikleri (toplam dakika, seans sayısı)';
COMMENT ON COLUMN meetings.zoom_meeting_id IS 'Zoom API meeting ID';
COMMENT ON COLUMN meetings.duration_min IS 'Webhook sonrası gerçek toplantı süresi';

