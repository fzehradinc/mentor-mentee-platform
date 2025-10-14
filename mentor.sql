-- Mentor Registration and Profile Schema
-- This table stores mentor registration and profile data for the mentorship platform

CREATE TABLE mentors (
    -- Primary key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Basic info
    display_name VARCHAR(50) NOT NULL,                      -- Görünecek İsim
    title VARCHAR(60) NOT NULL,                             -- Unvan/Pozisyon
    company VARCHAR(100),                                   -- Şirket/Organizasyon
    short_bio VARCHAR(160) NOT NULL,                        -- Kısa Tanıtım
    detailed_bio TEXT NOT NULL,                             -- Detaylı Tanıtım (400–1200 karakter)
    
    -- Languages & location
    languages TEXT[] NOT NULL,                              -- Konuştuğu diller (ör. ['Türkçe','İngilizce'])
    location VARCHAR(100) NOT NULL,                         -- Konum (ör. Istanbul)
    timezone VARCHAR(50) DEFAULT 'Europe/Istanbul',          -- Saat dilimi
    
    -- Expertise
    main_category VARCHAR(50) NOT NULL,                     -- Ana kategori (ör. Yazılım, Veri/AI)
    skills TEXT[] NOT NULL,                                 -- Uzmanlık ve beceriler (ör. ['React','Python','UX Research'])
    experience_years INT CHECK (experience_years BETWEEN 0 AND 50), -- Deneyim yılı
    
    -- Offered services
    services TEXT[],                                        -- Öne çıkan hizmetler (ör. ['Mock Interview','CV Yorumu'])
    
    -- Availability & preferences
    general_availability TEXT NOT NULL,                     -- Genel müsaitlik (ör. 'Hafta içi akşam' veya 'Hafta sonu')
    custom_time_slots JSONB,                                -- Detaylı zaman aralıkları (ör. [{"day":"Pazartesi","start":"18:00","end":"22:00"}])
    session_duration INT CHECK (session_duration IN (30,45,60)),  -- Seans süresi (dakika)
    meeting_preference VARCHAR(30) NOT NULL,                -- Görüşme tercihi (Zoom, Platform İçi, Esnek)
    
    -- Pricing
    price_per_session INT CHECK (price_per_session >= 100), -- Seans başı ücret (TL)
    first_session_discount BOOLEAN DEFAULT FALSE,           -- İlk seans indirimi var mı
    discount_rate INT CHECK (discount_rate BETWEEN 0 AND 100) DEFAULT 0, -- İndirim oranı (%)
    
    -- Packages
    packages JSONB,                                         -- Seans paketleri (ör. [{"sessions":3,"discount":10},{"sessions":5,"discount":15}])
    
    -- Media
    profile_photo_url TEXT NOT NULL,                        -- Profil fotoğrafı
    cover_photo_url TEXT,                                   -- Kapak fotoğrafı
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_mentors_display_name ON mentors(display_name);
CREATE INDEX idx_mentors_main_category ON mentors(main_category);
CREATE INDEX idx_mentors_skills ON mentors USING GIN(skills);
CREATE INDEX idx_mentors_languages ON mentors USING GIN(languages);
CREATE INDEX idx_mentors_location ON mentors(location);
CREATE INDEX idx_mentors_experience_years ON mentors(experience_years);
CREATE INDEX idx_mentors_price_per_session ON mentors(price_per_session);
CREATE INDEX idx_mentors_created_at ON mentors(created_at);

-- Add trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_mentors_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_mentors_updated_at
    BEFORE UPDATE ON mentors
    FOR EACH ROW
    EXECUTE FUNCTION update_mentors_updated_at();

-- Add comments for documentation
COMMENT ON TABLE mentors IS 'Stores mentor registration and profile data';
COMMENT ON COLUMN mentors.display_name IS 'Public display name for the mentor';
COMMENT ON COLUMN mentors.title IS 'Professional title or position';
COMMENT ON COLUMN mentors.company IS 'Current company or organization';
COMMENT ON COLUMN mentors.short_bio IS 'Brief introduction (max 160 characters)';
COMMENT ON COLUMN mentors.detailed_bio IS 'Detailed professional biography (400-1200 characters)';
COMMENT ON COLUMN mentors.languages IS 'Array of languages the mentor speaks';
COMMENT ON COLUMN mentors.location IS 'Physical location (city, country)';
COMMENT ON COLUMN mentors.timezone IS 'Mentor timezone for scheduling';
COMMENT ON COLUMN mentors.main_category IS 'Primary expertise category';
COMMENT ON COLUMN mentors.skills IS 'Array of technical and soft skills';
COMMENT ON COLUMN mentors.experience_years IS 'Years of professional experience (0-50)';
COMMENT ON COLUMN mentors.services IS 'Array of specific services offered';
COMMENT ON COLUMN mentors.general_availability IS 'General availability pattern';
COMMENT ON COLUMN mentors.custom_time_slots IS 'Detailed time slot availability as JSON';
COMMENT ON COLUMN mentors.session_duration IS 'Standard session duration in minutes (30, 45, or 60)';
COMMENT ON COLUMN mentors.meeting_preference IS 'Preferred meeting platform';
COMMENT ON COLUMN mentors.price_per_session IS 'Price per session in Turkish Lira (minimum 100 TL)';
COMMENT ON COLUMN mentors.first_session_discount IS 'Whether first session has discount';
COMMENT ON COLUMN mentors.discount_rate IS 'Discount percentage for first session (0-100)';
COMMENT ON COLUMN mentors.packages IS 'Session packages with discounts as JSON';
COMMENT ON COLUMN mentors.profile_photo_url IS 'URL to mentor profile photo';
COMMENT ON COLUMN mentors.cover_photo_url IS 'URL to mentor cover photo';


