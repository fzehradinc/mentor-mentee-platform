-- BiMentor | Detaylı Mentor Profil Sistemi
-- Mentör profilini tek tabloya sıkıştırmıyoruz; esnek olması için 3-4 tablo

-- Mentör çekirdeği (mentors tablosu zaten var, eksik alanları ekle)
ALTER TABLE mentors
  ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS headline TEXT,
  ADD COLUMN IF NOT EXISTS company TEXT,
  ADD COLUMN IF NOT EXISTS location TEXT,
  ADD COLUMN IF NOT EXISTS languages TEXT[] DEFAULT ARRAY['tr'],
  ADD COLUMN IF NOT EXISTS years_of_exp INT DEFAULT 0 CHECK (years_of_exp >= 0),
  ADD COLUMN IF NOT EXISTS rating NUMERIC(2,1) DEFAULT 5.0,
  ADD COLUMN IF NOT EXISTS review_count INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS cover_url TEXT,
  ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT TRUE;

-- Slug index
CREATE INDEX IF NOT EXISTS idx_mentors_slug ON mentors(slug);
CREATE INDEX IF NOT EXISTS idx_mentors_active ON mentors(active);

-- Ayrıntılı içerik (bio, anlatı)
CREATE TABLE IF NOT EXISTS mentor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES mentors(user_id) ON DELETE CASCADE,
  short_bio TEXT,              -- 80–160 karakter
  long_bio TEXT,               -- 400–1200 karakter (markdown serbest)
  specialties TEXT[],          -- ['YKS','Üniversite Dersleri','Yazılım','Tasarım',...]
  skills TEXT[],               -- ['React','Data Science','IELTS',...]
  services TEXT[],             -- ['CV/Portföy Yorumu','Mock Interview','Teknik Koçluk',...]
  availability_pref TEXT[],    -- ['Hafta içi akşam','Hafta sonu','Esnek']
  meeting_pref TEXT[],         -- ['Zoom','Google Meet','Platform içi']
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(mentor_id)
);

CREATE INDEX IF NOT EXISTS idx_mentor_profiles_mentor ON mentor_profiles(mentor_id);

-- Sosyaller (çoklanabilir)
CREATE TABLE IF NOT EXISTS mentor_socials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES mentors(user_id) ON DELETE CASCADE,
  platform TEXT NOT NULL,      -- 'linkedin','x','web','github'
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mentor_socials_mentor ON mentor_socials(mentor_id);

-- Fiyat katmanları (opsiyonel paketler)
CREATE TABLE IF NOT EXISTS mentor_pricing_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES mentors(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,         -- 'Lite','Standart','Pro'
  description TEXT,
  monthly_price INT NOT NULL CHECK (monthly_price >= 0),
  calls_per_month INT,
  call_minutes INT,            -- 60
  chat_support BOOLEAN DEFAULT TRUE,
  sla_hours INT,               -- 24
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mentor_pricing_tiers_mentor ON mentor_pricing_tiers(mentor_id);

-- Trigger for updated_at
CREATE TRIGGER update_mentor_profiles_updated_at BEFORE UPDATE ON mentor_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE mentor_profiles IS 'Detaylı mentor profil bilgileri (bio, alanlar, beceriler)';
COMMENT ON TABLE mentor_socials IS 'Mentor sosyal medya bağlantıları';
COMMENT ON TABLE mentor_pricing_tiers IS 'Mentor paket fiyatlandırmaları';

