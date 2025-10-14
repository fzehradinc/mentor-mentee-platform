/*
  # Create Mentor Profiles Table

  1. New Tables
    - `mentor_profiles`: Store all mentor profile information
      - Basic info: name, title, bio
      - Media: avatar, cover, video
      - Expertise and pricing
      - Availability
      - Status tracking (draft/review/published)

  2. Security
    - Enable RLS
    - Users can read their own profiles
    - Public can only read published profiles
    - Users can only update their own profiles
*/

CREATE TABLE IF NOT EXISTS mentor_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic Information
  full_name text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  short_bio text NOT NULL DEFAULT '',
  long_bio text NOT NULL DEFAULT '',
  
  -- Media
  avatar_upload text DEFAULT '',
  cover_upload text DEFAULT '',
  video_intro_url text DEFAULT '',
  
  -- Expertise
  expertise_areas jsonb DEFAULT '[]'::jsonb,
  
  -- Pricing
  price_per_session integer DEFAULT 0,
  price_tier text DEFAULT 'orta-seviye',
  first_session_discount boolean DEFAULT false,
  first_session_discount_value integer DEFAULT 0,
  packages jsonb DEFAULT '[]'::jsonb,
  
  -- Availability
  availability jsonb DEFAULT '[]'::jsonb,
  
  -- Status & Review
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published')),
  completion_percentage integer DEFAULT 0,
  submitted_at timestamptz,
  published_at timestamptz,
  rejection_reason jsonb,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Constraints
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE mentor_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read own profile"
ON mentor_profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Public can read published profiles"
ON mentor_profiles FOR SELECT
TO public
USING (status = 'published');

CREATE POLICY "Users can insert own profile"
ON mentor_profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
ON mentor_profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_mentor_profiles_user_id ON mentor_profiles(user_id);
CREATE INDEX idx_mentor_profiles_status ON mentor_profiles(status);
CREATE INDEX idx_mentor_profiles_published_at ON mentor_profiles(published_at) WHERE status = 'published';

-- Function to calculate profile completion
CREATE OR REPLACE FUNCTION calculate_profile_completion(profile_id uuid)
RETURNS integer AS $$
DECLARE
  completion_score integer := 0;
  profile_data record;
BEGIN
  SELECT * INTO profile_data FROM mentor_profiles WHERE id = profile_id;
  
  IF profile_data IS NULL THEN
    RETURN 0;
  END IF;

  -- Required fields (60 points)
  IF profile_data.full_name IS NOT NULL AND profile_data.full_name != '' THEN
    completion_score := completion_score + 10;
  END IF;
  
  IF profile_data.title IS NOT NULL AND profile_data.title != '' THEN
    completion_score := completion_score + 10;
  END IF;
  
  IF profile_data.short_bio IS NOT NULL AND profile_data.short_bio != '' THEN
    completion_score := completion_score + 10;
  END IF;
  
  IF profile_data.long_bio IS NOT NULL AND LENGTH(profile_data.long_bio) >= 400 THEN
    completion_score := completion_score + 10;
  END IF;
  
  IF profile_data.avatar_upload IS NOT NULL AND profile_data.avatar_upload != '' THEN
    completion_score := completion_score + 10;
  END IF;
  
  IF profile_data.price_per_session > 0 THEN
    completion_score := completion_score + 10;
  END IF;

  -- Optional fields (40 points)
  IF profile_data.cover_upload IS NOT NULL AND profile_data.cover_upload != '' THEN
    completion_score := completion_score + 10;
  END IF;
  
  IF profile_data.video_intro_url IS NOT NULL AND profile_data.video_intro_url != '' THEN
    completion_score := completion_score + 10;
  END IF;
  
  IF profile_data.expertise_areas IS NOT NULL AND jsonb_array_length(profile_data.expertise_areas) > 0 THEN
    completion_score := completion_score + 10;
  END IF;
  
  IF profile_data.availability IS NOT NULL AND jsonb_array_length(profile_data.availability) > 0 THEN
    completion_score := completion_score + 10;
  END IF;

  RETURN completion_score;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update completion percentage
CREATE OR REPLACE FUNCTION update_profile_completion()
RETURNS TRIGGER AS $$
BEGIN
  NEW.completion_percentage := calculate_profile_completion(NEW.id);
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_profile_completion
BEFORE UPDATE ON mentor_profiles
FOR EACH ROW
EXECUTE FUNCTION update_profile_completion();
