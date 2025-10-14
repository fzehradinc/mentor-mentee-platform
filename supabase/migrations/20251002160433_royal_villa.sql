/*
  # Publishing & Analytics System

  1. Schema Updates
    - Add publishing status and SEO fields to mentors table
    - Add analytics integration fields
    - Add slug generation and validation
    - Add publishing workflow tracking

  2. New Tables
    - `publishing_queue`
      - Admin review queue for mentor profiles
      - Priority and status tracking
    - `seo_settings`
      - SEO meta data for each mentor
      - Keywords and social media optimization
    - `analytics_integrations`
      - Third-party analytics tracking
      - Custom script management

  3. Security
    - Enable RLS on all publishing tables
    - Mentors can only manage their own publishing settings
    - Admins have full publishing control
    - Public read access for published profiles

  4. Automation
    - Slug auto-generation from display_name
    - SEO meta auto-population
    - Publishing notification triggers
*/

-- Add publishing and SEO columns to mentors table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'mentors' AND column_name = 'profile_status'
  ) THEN
    ALTER TABLE mentors 
      ADD COLUMN profile_status TEXT CHECK (profile_status IN ('draft','published','hidden')) DEFAULT 'draft',
      ADD COLUMN published_at TIMESTAMPTZ,
      ADD COLUMN visibility TEXT CHECK (visibility IN ('public','private','unlisted')) DEFAULT 'public',
      ADD COLUMN seo_title TEXT CHECK (char_length(seo_title) <= 60),
      ADD COLUMN seo_description TEXT CHECK (char_length(seo_description) <= 160),
      ADD COLUMN seo_image_url TEXT,
      ADD COLUMN seo_keywords TEXT[] DEFAULT '{}',
      ADD COLUMN ga4_id TEXT CHECK (ga4_id ~ '^G-[A-Z0-9]{10}$'),
      ADD COLUMN fb_pixel_id TEXT CHECK (fb_pixel_id ~ '^[0-9]{15,16}$'),
      ADD COLUMN hotjar_id TEXT CHECK (hotjar_id ~ '^[0-9]{6,7}$'),
      ADD COLUMN profile_views INT DEFAULT 0,
      ADD COLUMN last_seo_update TIMESTAMPTZ;
  END IF;
END $$;

-- Publishing queue for admin review
CREATE TABLE IF NOT EXISTS publishing_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
  submission_type TEXT NOT NULL CHECK (submission_type IN ('initial','update','resubmission')),
  status TEXT NOT NULL DEFAULT 'pending_review' CHECK (status IN ('pending_review','approved','rejected','changes_requested')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low','normal','high','urgent')),
  profile_completion NUMERIC(3,2) DEFAULT 0 CHECK (profile_completion BETWEEN 0 AND 1),
  admin_notes TEXT,
  rejection_reason TEXT,
  required_changes TEXT[],
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SEO optimization tracking
CREATE TABLE IF NOT EXISTS seo_performance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  organic_views INT DEFAULT 0,
  search_impressions INT DEFAULT 0,
  search_clicks INT DEFAULT 0,
  avg_position NUMERIC(5,2),
  top_keywords TEXT[],
  referrer_domains TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(mentor_id, date)
);

-- Analytics integrations
CREATE TABLE IF NOT EXISTS analytics_integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
  integration_type TEXT NOT NULL CHECK (integration_type IN ('ga4','fb_pixel','hotjar','custom')),
  integration_id TEXT NOT NULL,
  script_content TEXT,
  script_position TEXT CHECK (script_position IN ('head','body_start','body_end')) DEFAULT 'head',
  is_active BOOLEAN DEFAULT TRUE,
  last_triggered TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(mentor_id, integration_type)
);

-- Custom analytics scripts
CREATE TABLE IF NOT EXISTS custom_analytics_scripts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
  script_name TEXT NOT NULL,
  script_content TEXT NOT NULL,
  script_position TEXT CHECK (script_position IN ('head','body_start','body_end')) DEFAULT 'head',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_mentors_profile_status ON mentors(profile_status);
CREATE INDEX IF NOT EXISTS idx_mentors_published_at ON mentors(published_at);
CREATE INDEX IF NOT EXISTS idx_mentors_seo_slug ON mentors(slug);
CREATE INDEX IF NOT EXISTS idx_publishing_queue_status ON publishing_queue(status);
CREATE INDEX IF NOT EXISTS idx_publishing_queue_priority ON publishing_queue(priority);
CREATE INDEX IF NOT EXISTS idx_seo_performance_mentor ON seo_performance(mentor_id);
CREATE INDEX IF NOT EXISTS idx_seo_performance_date ON seo_performance(date);
CREATE INDEX IF NOT EXISTS idx_analytics_integrations_mentor ON analytics_integrations(mentor_id);
CREATE INDEX IF NOT EXISTS idx_analytics_integrations_type ON analytics_integrations(integration_type);

-- Full text search index for SEO
CREATE INDEX IF NOT EXISTS idx_mentors_seo_search ON mentors USING gin(
  to_tsvector('turkish', 
    coalesce(seo_title, '') || ' ' || 
    coalesce(seo_description, '') || ' ' || 
    array_to_string(seo_keywords, ' ')
  )
);

-- Enable Row Level Security
ALTER TABLE publishing_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_analytics_scripts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for publishing_queue
CREATE POLICY "Mentors can read own publishing queue"
  ON publishing_queue
  FOR SELECT
  TO authenticated
  USING (
    mentor_id IN (
      SELECT id FROM mentors WHERE user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Admins can manage publishing queue"
  ON publishing_queue
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'platform_admin');

-- RLS Policies for seo_performance
CREATE POLICY "Mentors can read own SEO performance"
  ON seo_performance
  FOR SELECT
  TO authenticated
  USING (
    mentor_id IN (
      SELECT id FROM mentors WHERE user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Admins can read all SEO performance"
  ON seo_performance
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'platform_admin');

-- RLS Policies for analytics_integrations
CREATE POLICY "Mentors can manage own analytics"
  ON analytics_integrations
  FOR ALL
  TO authenticated
  USING (
    mentor_id IN (
      SELECT id FROM mentors WHERE user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Admins can manage all analytics"
  ON analytics_integrations
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'platform_admin');

-- RLS Policies for custom_analytics_scripts
CREATE POLICY "Mentors can manage own custom scripts"
  ON custom_analytics_scripts
  FOR ALL
  TO authenticated
  USING (
    mentor_id IN (
      SELECT id FROM mentors WHERE user_id::text = auth.uid()::text
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_analytics_integrations_updated_at
  BEFORE UPDATE ON analytics_integrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Slug generation function
CREATE OR REPLACE FUNCTION generate_mentor_slug(mentor_name TEXT, mentor_id UUID)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INT := 0;
BEGIN
  -- Create base slug from name
  base_slug := lower(trim(mentor_name));
  base_slug := regexp_replace(base_slug, '[^a-z0-9\s]', '', 'g');
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := trim(base_slug, '-');
  
  -- Ensure minimum length
  IF char_length(base_slug) < 3 THEN
    base_slug := base_slug || '-mentor';
  END IF;
  
  -- Ensure maximum length
  IF char_length(base_slug) > 60 THEN
    base_slug := left(base_slug, 60);
  END IF;
  
  final_slug := base_slug;
  
  -- Check for uniqueness and add counter if needed
  WHILE EXISTS (SELECT 1 FROM mentors WHERE slug = final_slug AND id != mentor_id) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Auto-generate slug trigger
CREATE OR REPLACE FUNCTION auto_generate_slug()
RETURNS TRIGGER AS $$
BEGIN
  -- Generate slug if not provided or if display_name changed
  IF NEW.slug IS NULL OR (OLD.display_name IS DISTINCT FROM NEW.display_name) THEN
    NEW.slug := generate_mentor_slug(NEW.display_name, NEW.id);
  END IF;
  
  -- Auto-populate SEO fields if empty
  IF NEW.seo_title IS NULL AND NEW.display_name IS NOT NULL AND NEW.title IS NOT NULL THEN
    NEW.seo_title := NEW.display_name || ' - ' || NEW.title || ' | MentorHub';
    NEW.seo_title := left(NEW.seo_title, 60);
  END IF;
  
  IF NEW.seo_description IS NULL AND NEW.short_bio IS NOT NULL THEN
    NEW.seo_description := NEW.short_bio;
    NEW.seo_description := left(NEW.seo_description, 160);
  END IF;
  
  -- Update published_at when status changes to published
  IF OLD.profile_status != 'published' AND NEW.profile_status = 'published' THEN
    NEW.published_at := NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER mentor_auto_seo
  BEFORE INSERT OR UPDATE ON mentors
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_slug();

-- Publishing notification function
CREATE OR REPLACE FUNCTION notify_publishing_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify mentor when profile is published
  IF OLD.profile_status != 'published' AND NEW.profile_status = 'published' THEN
    -- Insert notification (would integrate with notification system)
    INSERT INTO notifications (user_id, type, title, message, data)
    VALUES (
      NEW.user_id,
      'profile_published',
      'Profiliniz Yayında! 🎉',
      'Mentor profiliniz başarıyla yayınlandı ve mentee''ler tarafından görülebilir.',
      jsonb_build_object(
        'mentor_id', NEW.id,
        'public_url', 'https://mentorhub.com/mentor/' || NEW.slug,
        'published_at', NEW.published_at
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER mentor_publishing_notification
  AFTER UPDATE ON mentors
  FOR EACH ROW
  EXECUTE FUNCTION notify_publishing_status();

-- Sample data for testing
INSERT INTO publishing_queue (mentor_id, submission_type, profile_completion, priority) VALUES
('c9b2e8f4-1234-5678-9abc-def012345678', 'initial', 0.95, 'normal')
ON CONFLICT DO NOTHING;

INSERT INTO analytics_integrations (mentor_id, integration_type, integration_id) VALUES
('c9b2e8f4-1234-5678-9abc-def012345678', 'ga4', 'G-XXXXXXXXXX')
ON CONFLICT (mentor_id, integration_type) DO NOTHING;