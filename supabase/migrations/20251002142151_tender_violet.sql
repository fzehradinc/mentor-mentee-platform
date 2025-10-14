/*
  # Mentor Profile Schema

  1. New Tables
    - `mentors`
      - Complete mentor profile data with all fields
      - UUID primary key, user_id foreign key
      - Validation constraints for all fields
      - Publish status tracking (draft/review/published)
    - `mentor_drafts`
      - JSONB storage for autosave functionality
      - One-to-one relationship with mentors
    - `mentor_time_slots`
      - Normalized time slot storage
      - Day of week (0-6) and time ranges
    - `mentor_packages`
      - Pricing packages (max 2 per mentor)
      - Session count and discount percentages
    - `mentor_badges`
      - Achievement badges (verified, high_rated, etc.)
      - Many-to-many relationship

  2. Security
    - Enable RLS on all tables
    - Mentors can only access their own data
    - Admins have full access
    - Public read access for published profiles

  3. Indexes
    - Performance indexes for slug, category, location
    - Composite indexes for filtering and search
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Main mentors table
CREATE TABLE IF NOT EXISTS mentors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  display_name TEXT NOT NULL CHECK (char_length(display_name) BETWEEN 2 AND 50),
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 2 AND 60),
  company_name TEXT,
  short_bio TEXT NOT NULL CHECK (char_length(short_bio) BETWEEN 80 AND 160),
  long_bio TEXT CHECK (char_length(long_bio) BETWEEN 400 AND 1200),
  primary_category TEXT CHECK (primary_category IN ('product','design','software','data_ai','marketing','leadership','entrepreneurship')),
  skills TEXT[] DEFAULT '{}',
  experience_years INT DEFAULT 0 CHECK (experience_years BETWEEN 0 AND 50),
  languages TEXT[] DEFAULT '{}',
  country TEXT,
  city TEXT,
  timezone TEXT DEFAULT 'Europe/Istanbul',
  availability_pattern TEXT CHECK (availability_pattern IN ('weekday_evening','weekend','flex')),
  session_duration_minutes INT CHECK (session_duration_minutes IN (30,45,60)),
  meeting_pref TEXT CHECK (meeting_pref IN ('video_meet','in_platform','flex')),
  price_per_session NUMERIC(12,2) NOT NULL CHECK (price_per_session >= 100),
  first_session_discount BOOLEAN DEFAULT FALSE,
  avatar_url TEXT,
  cover_url TEXT,
  video_intro_url TEXT,
  rating_avg NUMERIC(3,2) DEFAULT 0 CHECK (rating_avg BETWEEN 0 AND 5),
  verified_identity BOOLEAN DEFAULT FALSE,
  verified_company BOOLEAN DEFAULT FALSE,
  total_hours INT DEFAULT 0,
  workshops_count INT DEFAULT 0,
  completed_mentees_count INT DEFAULT 0,
  publish_status TEXT NOT NULL DEFAULT 'draft' CHECK (publish_status IN ('draft','review','published')),
  slug TEXT UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' AND char_length(slug) BETWEEN 3 AND 60),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mentor drafts for autosave
CREATE TABLE IF NOT EXISTS mentor_drafts (
  mentor_id UUID PRIMARY KEY REFERENCES mentors(id) ON DELETE CASCADE,
  draft_data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Time slots table
CREATE TABLE IF NOT EXISTS mentor_time_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
  day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (start_time < end_time)
);

-- Packages table
CREATE TABLE IF NOT EXISTS mentor_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sessions INT NOT NULL CHECK (sessions BETWEEN 2 AND 10),
  discount_pct NUMERIC(5,2) NOT NULL CHECK (discount_pct BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Badges table
CREATE TABLE IF NOT EXISTS mentor_badges (
  mentor_id UUID NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
  badge TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (mentor_id, badge)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_mentors_user_id ON mentors(user_id);
CREATE INDEX IF NOT EXISTS idx_mentors_slug ON mentors(slug);
CREATE INDEX IF NOT EXISTS idx_mentors_category ON mentors(primary_category);
CREATE INDEX IF NOT EXISTS idx_mentors_location ON mentors(country, city);
CREATE INDEX IF NOT EXISTS idx_mentors_status ON mentors(publish_status);
CREATE INDEX IF NOT EXISTS idx_mentors_rating ON mentors(rating_avg);
CREATE INDEX IF NOT EXISTS idx_mentors_price ON mentors(price_per_session);
CREATE INDEX IF NOT EXISTS idx_mentors_created ON mentors(created_at);
CREATE INDEX IF NOT EXISTS idx_time_slots_mentor ON mentor_time_slots(mentor_id);
CREATE INDEX IF NOT EXISTS idx_time_slots_day ON mentor_time_slots(day_of_week);
CREATE INDEX IF NOT EXISTS idx_packages_mentor ON mentor_packages(mentor_id);
CREATE INDEX IF NOT EXISTS idx_badges_mentor ON mentor_badges(mentor_id);

-- Full text search index
CREATE INDEX IF NOT EXISTS idx_mentors_search ON mentors USING gin(
  to_tsvector('turkish', 
    coalesce(display_name, '') || ' ' || 
    coalesce(title, '') || ' ' || 
    coalesce(company_name, '') || ' ' || 
    coalesce(short_bio, '') || ' ' ||
    coalesce(long_bio, '') || ' ' ||
    array_to_string(skills, ' ')
  )
);

-- Enable Row Level Security
ALTER TABLE mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_badges ENABLE ROW LEVEL SECURITY;

-- RLS Policies for mentors table
CREATE POLICY "Mentors can read own data"
  ON mentors
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Mentors can update own data"
  ON mentors
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Mentors can insert own data"
  ON mentors
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Admins have full access to mentors"
  ON mentors
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'platform_admin');

CREATE POLICY "Public can read published mentors"
  ON mentors
  FOR SELECT
  TO anon, authenticated
  USING (publish_status = 'published');

-- RLS Policies for mentor_drafts table
CREATE POLICY "Mentors can manage own drafts"
  ON mentor_drafts
  FOR ALL
  TO authenticated
  USING (
    mentor_id IN (
      SELECT id FROM mentors WHERE user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Admins have full access to drafts"
  ON mentor_drafts
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'platform_admin');

-- RLS Policies for mentor_time_slots table
CREATE POLICY "Mentors can manage own time slots"
  ON mentor_time_slots
  FOR ALL
  TO authenticated
  USING (
    mentor_id IN (
      SELECT id FROM mentors WHERE user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Public can read published mentor time slots"
  ON mentor_time_slots
  FOR SELECT
  TO anon, authenticated
  USING (
    mentor_id IN (
      SELECT id FROM mentors WHERE publish_status = 'published'
    )
  );

-- RLS Policies for mentor_packages table
CREATE POLICY "Mentors can manage own packages"
  ON mentor_packages
  FOR ALL
  TO authenticated
  USING (
    mentor_id IN (
      SELECT id FROM mentors WHERE user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Public can read published mentor packages"
  ON mentor_packages
  FOR SELECT
  TO anon, authenticated
  USING (
    mentor_id IN (
      SELECT id FROM mentors WHERE publish_status = 'published'
    )
  );

-- RLS Policies for mentor_badges table
CREATE POLICY "Mentors can read own badges"
  ON mentor_badges
  FOR SELECT
  TO authenticated
  USING (
    mentor_id IN (
      SELECT id FROM mentors WHERE user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Admins can manage badges"
  ON mentor_badges
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'platform_admin');

CREATE POLICY "Public can read published mentor badges"
  ON mentor_badges
  FOR SELECT
  TO anon, authenticated
  USING (
    mentor_id IN (
      SELECT id FROM mentors WHERE publish_status = 'published'
    )
  );

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_mentors_updated_at
  BEFORE UPDATE ON mentors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mentor_drafts_updated_at
  BEFORE UPDATE ON mentor_drafts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Sample data for testing
INSERT INTO mentors (
  id,
  user_id,
  display_name,
  title,
  company_name,
  short_bio,
  long_bio,
  primary_category,
  skills,
  experience_years,
  languages,
  country,
  city,
  timezone,
  availability_pattern,
  session_duration_minutes,
  meeting_pref,
  price_per_session,
  first_session_discount,
  avatar_url,
  rating_avg,
  verified_identity,
  verified_company,
  total_hours,
  workshops_count,
  completed_mentees_count,
  publish_status,
  slug
) VALUES (
  'c9b2e8f4-1234-5678-9abc-def012345678',
  'user123',
  'Ayşe Kılıç',
  'Senior UX Designer',
  'Getir',
  'Kullanıcı odaklı tasarımla kariyerini hızlandırmana yardım ederim. 8 yıllık deneyimle UX süreçlerini öğretiyorum.',
  '8 yıldır UX alanında çalışıyorum. Getir''da milyonlarca kullanıcının deneyimini tasarlıyorum. Mentörlük yaklaşımım: önce dinlemek, sonra yönlendirmek. Portföy incelemesi, kariyer planlama ve UX süreçleri konularında uzmanım. Hedefin net olsun, yolunu birlikte çizelim.',
  'design',
  ARRAY['UX Research', 'Figma', 'Portfolio Review', 'User Testing', 'Design Systems'],
  7,
  ARRAY['Türkçe', 'İngilizce'],
  'TR',
  'İstanbul',
  'Europe/Istanbul',
  'weekday_evening',
  60,
  'video_meet',
  180.00,
  true,
  'https://cdn.mentorhub.com/avatars/c9b2e8f4.webp',
  4.9,
  true,
  true,
  320,
  12,
  180,
  'published',
  'ayse-kilic-ux'
) ON CONFLICT (id) DO NOTHING;

-- Sample time slots
INSERT INTO mentor_time_slots (mentor_id, day_of_week, start_time, end_time) VALUES
('c9b2e8f4-1234-5678-9abc-def012345678', 2, '19:00', '22:00'),
('c9b2e8f4-1234-5678-9abc-def012345678', 4, '19:00', '21:00'),
('c9b2e8f4-1234-5678-9abc-def012345678', 6, '10:00', '16:00')
ON CONFLICT DO NOTHING;

-- Sample packages
INSERT INTO mentor_packages (mentor_id, name, sessions, discount_pct) VALUES
('c9b2e8f4-1234-5678-9abc-def012345678', '3 seans paketi', 3, 10),
('c9b2e8f4-1234-5678-9abc-def012345678', '5 seans paketi', 5, 15)
ON CONFLICT DO NOTHING;

-- Sample badges
INSERT INTO mentor_badges (mentor_id, badge) VALUES
('c9b2e8f4-1234-5678-9abc-def012345678', 'verified'),
('c9b2e8f4-1234-5678-9abc-def012345678', 'high_rated'),
('c9b2e8f4-1234-5678-9abc-def012345678', 'top_mentor')
ON CONFLICT DO NOTHING;