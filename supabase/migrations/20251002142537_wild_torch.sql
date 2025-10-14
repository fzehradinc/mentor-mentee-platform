/*
  # Media Upload System

  1. New Tables
    - `mentor_media_uploads`
      - Upload tracking and status management
      - File metadata and processing status
      - Relationship to mentors table
    
  2. Schema Updates
    - Add media URL columns to mentors table
    - Add file size and content type tracking
    - Add processing status and timestamps

  3. Security
    - Enable RLS on media uploads table
    - Mentors can only access their own uploads
    - Admins have full access
    - Public read access for processed media

  4. Indexes
    - Performance indexes for mentor_id, type, status
    - Composite indexes for filtering and cleanup
*/

-- Add media URL columns to mentors table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'mentors' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE mentors 
      ADD COLUMN avatar_url TEXT,
      ADD COLUMN cover_url TEXT,
      ADD COLUMN video_intro_url TEXT;
  END IF;
END $$;

-- Media uploads tracking table
CREATE TABLE IF NOT EXISTS mentor_media_uploads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('avatar','cover','video')),
  storage_url TEXT NOT NULL,
  cdn_url TEXT,
  status TEXT NOT NULL DEFAULT 'initiated' CHECK (status IN ('initiated','uploaded','processed','failed')),
  file_size BIGINT,
  content_type TEXT,
  original_filename TEXT,
  processing_error TEXT,
  upload_id TEXT UNIQUE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Media processing queue table
CREATE TABLE IF NOT EXISTS media_processing_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  upload_id UUID NOT NULL REFERENCES mentor_media_uploads(id) ON DELETE CASCADE,
  processing_type TEXT NOT NULL CHECK (processing_type IN ('resize','crop','transcode','thumbnail')),
  input_url TEXT NOT NULL,
  output_url TEXT,
  parameters JSONB,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','completed','failed')),
  error_message TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- File validation constraints
CREATE TABLE IF NOT EXISTS media_validation_rules (
  media_type TEXT PRIMARY KEY CHECK (media_type IN ('avatar','cover','video')),
  max_file_size BIGINT NOT NULL,
  allowed_formats TEXT[] NOT NULL,
  min_width INTEGER,
  min_height INTEGER,
  aspect_ratio TEXT,
  max_duration_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert validation rules
INSERT INTO media_validation_rules (media_type, max_file_size, allowed_formats, min_width, min_height, aspect_ratio, max_duration_seconds) VALUES
('avatar', 2097152, ARRAY['image/jpeg','image/png','image/webp'], 400, 400, '1:1', NULL),
('cover', 5242880, ARRAY['image/jpeg','image/png','image/webp'], 1280, 720, '16:9', NULL),
('video', 209715200, ARRAY['video/mp4'], 1280, 720, NULL, 120)
ON CONFLICT (media_type) DO UPDATE SET
  max_file_size = EXCLUDED.max_file_size,
  allowed_formats = EXCLUDED.allowed_formats,
  min_width = EXCLUDED.min_width,
  min_height = EXCLUDED.min_height,
  aspect_ratio = EXCLUDED.aspect_ratio,
  max_duration_seconds = EXCLUDED.max_duration_seconds;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_media_uploads_mentor ON mentor_media_uploads(mentor_id);
CREATE INDEX IF NOT EXISTS idx_media_uploads_type ON mentor_media_uploads(type);
CREATE INDEX IF NOT EXISTS idx_media_uploads_status ON mentor_media_uploads(status);
CREATE INDEX IF NOT EXISTS idx_media_uploads_upload_id ON mentor_media_uploads(upload_id);
CREATE INDEX IF NOT EXISTS idx_media_uploads_created ON mentor_media_uploads(created_at);
CREATE INDEX IF NOT EXISTS idx_processing_queue_upload ON media_processing_queue(upload_id);
CREATE INDEX IF NOT EXISTS idx_processing_queue_status ON media_processing_queue(status);

-- Enable Row Level Security
ALTER TABLE mentor_media_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_processing_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_validation_rules ENABLE ROW LEVEL SECURITY;

-- RLS Policies for mentor_media_uploads
CREATE POLICY "Mentors can manage own media uploads"
  ON mentor_media_uploads
  FOR ALL
  TO authenticated
  USING (
    mentor_id IN (
      SELECT id FROM mentors WHERE user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Admins have full access to media uploads"
  ON mentor_media_uploads
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'platform_admin');

CREATE POLICY "Public can read processed media"
  ON mentor_media_uploads
  FOR SELECT
  TO anon, authenticated
  USING (
    status = 'processed' AND 
    mentor_id IN (
      SELECT id FROM mentors WHERE publish_status = 'published'
    )
  );

-- RLS Policies for media_processing_queue
CREATE POLICY "System can manage processing queue"
  ON media_processing_queue
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' IN ('platform_admin', 'system'));

-- RLS Policies for media_validation_rules
CREATE POLICY "Everyone can read validation rules"
  ON media_validation_rules
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage validation rules"
  ON media_validation_rules
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'platform_admin');

-- Trigger for updated_at
CREATE TRIGGER update_media_uploads_updated_at
  BEFORE UPDATE ON mentor_media_uploads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_processing_queue_updated_at
  BEFORE UPDATE ON media_processing_queue
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Cleanup function for expired uploads
CREATE OR REPLACE FUNCTION cleanup_expired_uploads()
RETURNS void AS $$
BEGIN
  -- Delete expired upload records
  DELETE FROM mentor_media_uploads 
  WHERE status = 'initiated' 
    AND expires_at < NOW() 
    AND created_at < NOW() - INTERVAL '1 hour';
    
  -- Delete failed uploads older than 24 hours
  DELETE FROM mentor_media_uploads 
  WHERE status = 'failed' 
    AND created_at < NOW() - INTERVAL '24 hours';
    
  -- Delete orphaned processing queue items
  DELETE FROM media_processing_queue 
  WHERE upload_id NOT IN (SELECT id FROM mentor_media_uploads);
END;
$$ LANGUAGE plpgsql;

-- Sample data for testing
INSERT INTO mentor_media_uploads (
  id,
  mentor_id,
  type,
  storage_url,
  cdn_url,
  status,
  file_size,
  content_type,
  original_filename,
  upload_id
) VALUES (
  'upload_c9b2e8f4_avatar_1696248900',
  'c9b2e8f4-1234-5678-9abc-def012345678',
  'avatar',
  'https://s3.amazonaws.com/bucket/mentors/c9b2e8f4/avatar.jpg',
  'https://cdn.mentorhub.com/avatars/c9b2e8f4.webp',
  'processed',
  2048576,
  'image/jpeg',
  'profile-photo.jpg',
  'upload_c9b2e8f4_avatar_1696248900'
) ON CONFLICT (id) DO NOTHING;