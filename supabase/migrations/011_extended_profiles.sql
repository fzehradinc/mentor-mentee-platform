-- BiMentor | Genişletilmiş Profil Alanları
-- Mentee ve Mentor için ek detay alanları

-- ============================================
-- MENTEE PROFIL EKLERİ
-- ============================================

ALTER TABLE mentees
  ADD COLUMN IF NOT EXISTS first_name TEXT,
  ADD COLUMN IF NOT EXISTS last_name TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS birth_date DATE,
  ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male','female','other','prefer_not_to_say')),
  ADD COLUMN IF NOT EXISTS education_level TEXT,  -- 'lise','lisans','yuksek_lisans','doktora'
  ADD COLUMN IF NOT EXISTS university TEXT,
  ADD COLUMN IF NOT EXISTS major TEXT,  -- bölüm
  ADD COLUMN IF NOT EXISTS graduation_year INT,
  ADD COLUMN IF NOT EXISTS current_job_title TEXT,
  ADD COLUMN IF NOT EXISTS company TEXT,
  ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
  ADD COLUMN IF NOT EXISTS github_url TEXT,
  ADD COLUMN IF NOT EXISTS portfolio_url TEXT,
  ADD COLUMN IF NOT EXISTS bio TEXT,  -- kısa self-intro
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'Europe/Istanbul';

-- ============================================
-- MENTOR PROFIL EKLERİ
-- ============================================

ALTER TABLE mentors
  ADD COLUMN IF NOT EXISTS first_name TEXT,
  ADD COLUMN IF NOT EXISTS last_name TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS birth_date DATE,
  ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male','female','other','prefer_not_to_say')),
  ADD COLUMN IF NOT EXISTS education_level TEXT,
  ADD COLUMN IF NOT EXISTS university TEXT,
  ADD COLUMN IF NOT EXISTS major TEXT,
  ADD COLUMN IF NOT EXISTS graduation_year INT,
  ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
  ADD COLUMN IF NOT EXISTS github_url TEXT,
  ADD COLUMN IF NOT EXISTS personal_website TEXT,
  ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'Europe/Istanbul',
  ADD COLUMN IF NOT EXISTS mentor_type TEXT DEFAULT 'individual' CHECK (mentor_type IN ('individual','corporate'));

-- ============================================
-- MENTEE EĞİTİM HEDEFLERİ (detay)
-- ============================================

CREATE TABLE IF NOT EXISTS mentee_education_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentee_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  goal_type TEXT NOT NULL,  -- 'yks','lgs','uni_ders','dil_sinavi','burs','kariyer'
  target_exam TEXT,  -- 'TYT','AYT','LGS','IELTS','TOEFL'
  target_score INT,
  target_date DATE,
  current_level TEXT,  -- 'baslangic','orta','ileri'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mentee_education_goals_mentee ON mentee_education_goals(mentee_id);

-- ============================================
-- MENTOR SECİALIZATIONS (detay uzmanlık)
-- ============================================

CREATE TABLE IF NOT EXISTS mentor_specializations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  area TEXT NOT NULL,  -- 'yks_matematik','lgs_fen','uni_calculus','yazilim_react'
  level TEXT NOT NULL,  -- 'basic','intermediate','advanced','expert'
  years_experience INT DEFAULT 0,
  certification TEXT,  -- sertifika ismi (opsiyonel)
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mentor_specializations_mentor ON mentor_specializations(mentor_id);

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON COLUMN mentees.education_level IS 'Eğitim seviyesi: lise, lisans, yuksek_lisans, doktora';
COMMENT ON COLUMN mentors.mentor_type IS 'individual: bireysel, corporate: kurumsal';
COMMENT ON TABLE mentee_education_goals IS 'Mentee eğitim hedefleri (YKS/LGS/Dil sınavı hedefleri)';
COMMENT ON TABLE mentor_specializations IS 'Mentor detaylı uzmanlık alanları ve seviyeleri';

