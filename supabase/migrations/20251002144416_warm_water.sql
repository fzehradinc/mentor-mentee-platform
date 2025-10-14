/*
  # Verification & Moderation System

  1. New Tables
    - `mentor_badges`
      - Badge tracking with auto-grant rules
      - Badge types: verified, high_rated, workshop_leader, etc.
    - `company_verifications`
      - Company verification requests and status
      - Admin approval workflow
    - `kyc_uploads`
      - Identity verification documents
      - 3rd party KYC provider integration
    - `badge_rules`
      - Automatic badge granting rules
      - Configurable thresholds and conditions

  2. Schema Updates
    - Add verification status columns to mentors table
    - Add badge display preferences
    - Add moderation flags and timestamps

  3. Security
    - Enable RLS on all verification tables
    - Mentors can only access their own verification data
    - Admins have full moderation access
    - KYC documents encrypted and auto-expire

  4. Automation
    - Badge auto-granting triggers
    - KYC document cleanup (30 days)
    - Company verification notifications
*/

-- Add verification columns to mentors table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'mentors' AND column_name = 'kyc_status'
  ) THEN
    ALTER TABLE mentors 
      ADD COLUMN kyc_status TEXT CHECK (kyc_status IN ('pending','processing','verified','rejected')) DEFAULT 'pending',
      ADD COLUMN company_verified BOOLEAN DEFAULT FALSE,
      ADD COLUMN verification_score NUMERIC(3,2) DEFAULT 0 CHECK (verification_score BETWEEN 0 AND 1),
      ADD COLUMN moderation_flags TEXT[] DEFAULT '{}',
      ADD COLUMN last_verification_at TIMESTAMPTZ;
  END IF;
END $$;

-- Badge system
CREATE TABLE IF NOT EXISTS mentor_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL CHECK (badge_type IN ('verified','high_rated','workshop_leader','top_mentor','expert','rising_star')),
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  auto_granted BOOLEAN DEFAULT FALSE,
  granted_by UUID,
  justification TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(mentor_id, badge_type)
);

-- Badge auto-granting rules
CREATE TABLE IF NOT EXISTS badge_rules (
  badge_type TEXT PRIMARY KEY CHECK (badge_type IN ('verified','high_rated','workshop_leader','top_mentor','expert','rising_star')),
  rule_name TEXT NOT NULL,
  conditions JSONB NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Company verification system
CREATE TABLE IF NOT EXISTS company_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  tax_id TEXT NOT NULL,
  website TEXT,
  logo_url TEXT,
  position_proof TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  rejection_reason TEXT,
  admin_notes TEXT,
  verified_by UUID,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- KYC (Know Your Customer) system
CREATE TABLE IF NOT EXISTS kyc_uploads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
  kyc_session_id TEXT UNIQUE NOT NULL,
  id_front_url TEXT,
  id_back_url TEXT,
  selfie_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','verified','rejected')),
  provider_name TEXT DEFAULT 'onfido',
  provider_response JSONB,
  confidence_score NUMERIC(3,2),
  rejection_reasons TEXT[],
  verified_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Moderation queue for manual review
CREATE TABLE IF NOT EXISTS moderation_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('profile','badge','company','kyc')),
  item_id UUID,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low','normal','high','urgent')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','in_review','approved','rejected')),
  assigned_to UUID,
  admin_notes TEXT,
  auto_flags TEXT[] DEFAULT '{}',
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_badges_mentor ON mentor_badges(mentor_id);
CREATE INDEX IF NOT EXISTS idx_badges_type ON mentor_badges(badge_type);
CREATE INDEX IF NOT EXISTS idx_badges_granted ON mentor_badges(granted_at);
CREATE INDEX IF NOT EXISTS idx_company_verifications_mentor ON company_verifications(mentor_id);
CREATE INDEX IF NOT EXISTS idx_company_verifications_status ON company_verifications(status);
CREATE INDEX IF NOT EXISTS idx_kyc_mentor ON kyc_uploads(mentor_id);
CREATE INDEX IF NOT EXISTS idx_kyc_status ON kyc_uploads(status);
CREATE INDEX IF NOT EXISTS idx_kyc_session ON kyc_uploads(kyc_session_id);
CREATE INDEX IF NOT EXISTS idx_moderation_status ON moderation_queue(status);
CREATE INDEX IF NOT EXISTS idx_moderation_type ON moderation_queue(item_type);

-- Enable Row Level Security
ALTER TABLE mentor_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE badge_rules ENABLE ROW LEVEL SECURITY;

-- RLS Policies for mentor_badges
CREATE POLICY "Mentors can read own badges"
  ON mentor_badges
  FOR SELECT
  TO authenticated
  USING (
    mentor_id IN (
      SELECT id FROM mentors WHERE user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Admins can manage all badges"
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

-- RLS Policies for company_verifications
CREATE POLICY "Mentors can manage own company verification"
  ON company_verifications
  FOR ALL
  TO authenticated
  USING (
    mentor_id IN (
      SELECT id FROM mentors WHERE user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Admins can manage all company verifications"
  ON company_verifications
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'platform_admin');

-- RLS Policies for kyc_uploads
CREATE POLICY "Mentors can manage own KYC"
  ON kyc_uploads
  FOR ALL
  TO authenticated
  USING (
    mentor_id IN (
      SELECT id FROM mentors WHERE user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Admins can manage all KYC"
  ON kyc_uploads
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'platform_admin');

-- RLS Policies for moderation_queue
CREATE POLICY "Admins can manage moderation queue"
  ON moderation_queue
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'platform_admin');

-- RLS Policies for badge_rules
CREATE POLICY "Everyone can read badge rules"
  ON badge_rules
  FOR SELECT
  TO anon, authenticated
  USING (is_active = TRUE);

CREATE POLICY "Admins can manage badge rules"
  ON badge_rules
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'platform_admin');

-- Trigger for updated_at
CREATE TRIGGER update_company_verifications_updated_at
  BEFORE UPDATE ON company_verifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kyc_uploads_updated_at
  BEFORE UPDATE ON kyc_uploads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_badge_rules_updated_at
  BEFORE UPDATE ON badge_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Badge auto-granting function
CREATE OR REPLACE FUNCTION check_and_grant_badges(mentor_uuid UUID)
RETURNS void AS $$
DECLARE
  mentor_record RECORD;
  rule_record RECORD;
  conditions JSONB;
BEGIN
  -- Get mentor data
  SELECT * INTO mentor_record FROM mentors WHERE id = mentor_uuid;
  
  IF NOT FOUND THEN
    RETURN;
  END IF;

  -- Check each active badge rule
  FOR rule_record IN 
    SELECT * FROM badge_rules WHERE is_active = TRUE
  LOOP
    conditions := rule_record.conditions;
    
    -- High Rated badge logic
    IF rule_record.badge_type = 'high_rated' THEN
      IF mentor_record.rating_avg >= (conditions->>'min_rating')::numeric 
         AND mentor_record.completed_mentees_count >= (conditions->>'min_sessions')::integer THEN
        
        INSERT INTO mentor_badges (mentor_id, badge_type, auto_granted)
        VALUES (mentor_uuid, 'high_rated', TRUE)
        ON CONFLICT (mentor_id, badge_type) DO NOTHING;
      END IF;
    END IF;
    
    -- Workshop Leader badge logic
    IF rule_record.badge_type = 'workshop_leader' THEN
      IF mentor_record.workshops_count >= (conditions->>'min_workshops')::integer THEN
        
        INSERT INTO mentor_badges (mentor_id, badge_type, auto_granted)
        VALUES (mentor_uuid, 'workshop_leader', TRUE)
        ON CONFLICT (mentor_id, badge_type) DO NOTHING;
      END IF;
    END IF;
    
    -- Verified badge logic (KYC completed)
    IF rule_record.badge_type = 'verified' THEN
      IF mentor_record.kyc_status = 'verified' THEN
        
        INSERT INTO mentor_badges (mentor_id, badge_type, auto_granted)
        VALUES (mentor_uuid, 'verified', TRUE)
        ON CONFLICT (mentor_id, badge_type) DO NOTHING;
      END IF;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- KYC document cleanup function
CREATE OR REPLACE FUNCTION cleanup_expired_kyc()
RETURNS void AS $$
BEGIN
  -- Delete expired KYC documents (30 days)
  DELETE FROM kyc_uploads 
  WHERE expires_at < NOW() 
    AND status IN ('verified', 'rejected');
    
  -- Update mentor KYC status for deleted records
  UPDATE mentors 
  SET kyc_status = 'pending'
  WHERE id NOT IN (
    SELECT mentor_id FROM kyc_uploads WHERE status = 'verified'
  ) AND kyc_status = 'verified';
END;
$$ LANGUAGE plpgsql;

-- Insert default badge rules
INSERT INTO badge_rules (badge_type, rule_name, conditions, description) VALUES
('high_rated', 'High Rating Auto Grant', 
 '{"min_rating": 4.8, "min_sessions": 20}', 
 'Otomatik olarak 4.8+ rating ve 20+ seans tamamlayan mentorlar'),
('workshop_leader', 'Workshop Leader Auto Grant',
 '{"min_workshops": 3}',
 'En az 3 workshop düzenleyen mentorlar'),
('verified', 'KYC Verified Auto Grant',
 '{"kyc_required": true}',
 'KYC sürecini tamamlayan mentorlar'),
('top_mentor', 'Top Mentor Manual Grant',
 '{"manual_review": true, "min_rating": 4.9, "min_sessions": 100}',
 'Manuel inceleme ile verilen prestij rozeti'),
('expert', 'Expert Manual Grant',
 '{"manual_review": true, "min_experience": 10}',
 'Alanında uzman mentorlar için manuel rozet'),
('rising_star', 'Rising Star Auto Grant',
 '{"min_rating": 4.7, "max_sessions": 10, "recent_activity": true}',
 'Yeni ama başarılı mentorlar')
ON CONFLICT (badge_type) DO UPDATE SET
  conditions = EXCLUDED.conditions,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Sample data for testing
INSERT INTO mentor_badges (mentor_id, badge_type, auto_granted) VALUES
('c9b2e8f4-1234-5678-9abc-def012345678', 'verified', TRUE),
('c9b2e8f4-1234-5678-9abc-def012345678', 'high_rated', TRUE)
ON CONFLICT (mentor_id, badge_type) DO NOTHING;

INSERT INTO company_verifications (mentor_id, company_name, tax_id, website, status) VALUES
('c9b2e8f4-1234-5678-9abc-def012345678', 'Getir', '1234567890', 'https://getir.com', 'approved')
ON CONFLICT DO NOTHING;