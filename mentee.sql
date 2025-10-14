-- Mentee Registration and Onboarding Schema
-- This table stores mentee registration and onboarding data for the mentorship platform

CREATE TABLE mentees (
    -- Primary key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Authentication fields
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    
    -- Onboarding preferences
    support_area ENUM(
        'borsa_yatirim',
        'kariyer_is', 
        'universite_egitim',
        'kisisel_gelisim',
        'hayat_degisimi'
    ) NOT NULL,
    
    goal_type ENUM(
        'temel_bilgi',
        'stratejik_yol',
        'somut_hedef',
        'uzun_sureli_kocluluk'
    ) NOT NULL,
    
    budget_range ENUM(
        '0_500',
        '500_1000',
        '1000_plus'
    ) NOT NULL,
    
    availability ENUM(
        'hafta_ici_aksam',
        'hafta_sonu',
        'esnek'
    ) NOT NULL,
    
    mentor_type ENUM(
        'akademik',
        'practitioner',
        'koc'
    ) NOT NULL,
    
    -- Optional goal description
    short_goal_description TEXT,
    
    -- Consent fields
    kvkk_consent BOOLEAN DEFAULT TRUE NOT NULL,
    marketing_consent BOOLEAN DEFAULT FALSE NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_mentees_email ON mentees(email);
CREATE INDEX idx_mentees_support_area ON mentees(support_area);
CREATE INDEX idx_mentees_goal_type ON mentees(goal_type);
CREATE INDEX idx_mentees_created_at ON mentees(created_at);

-- Add trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_mentees_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_mentees_updated_at
    BEFORE UPDATE ON mentees
    FOR EACH ROW
    EXECUTE FUNCTION update_mentees_updated_at();

-- Add comments for documentation
COMMENT ON TABLE mentees IS 'Stores mentee registration and onboarding data';
COMMENT ON COLUMN mentees.email IS 'Unique email address for authentication';
COMMENT ON COLUMN mentees.password_hash IS 'Hashed password for security';
COMMENT ON COLUMN mentees.support_area IS 'Primary area of support the mentee is seeking';
COMMENT ON COLUMN mentees.goal_type IS 'Type of goal the mentee wants to achieve';
COMMENT ON COLUMN mentees.budget_range IS 'Mentee budget range for mentorship sessions';
COMMENT ON COLUMN mentees.availability IS 'When the mentee is available for sessions';
COMMENT ON COLUMN mentees.mentor_type IS 'Type of mentor the mentee prefers';
COMMENT ON COLUMN mentees.short_goal_description IS 'Optional detailed description of mentee goals';
COMMENT ON COLUMN mentees.kvkk_consent IS 'KVKK (GDPR) consent for data processing';
COMMENT ON COLUMN mentees.marketing_consent IS 'Consent for marketing communications';


