-- BiMentor | Mentor Registration Enhancement
-- Mentor kayıt formu için eksik alanları ve modelleri ekle

-- ============================================
-- MENTORS TABLOSUNA EKSİK ALANLARI EKLE
-- ============================================

-- Currency alanı ekle
ALTER TABLE mentors 
  ADD COLUMN IF NOT EXISTS currency text DEFAULT 'TRY' 
  CHECK (currency in ('TRY', 'USD', 'EUR'));

-- Meeting preference enum değerlerini genişlet
ALTER TABLE mentors DROP CONSTRAINT IF EXISTS mentors_meeting_preference_check;
ALTER TABLE mentors ADD CONSTRAINT mentors_meeting_preference_check 
  CHECK (meeting_preference in (
    'platform_internal', 'zoom', 'google_meet', 'flexible',
    'video', 'in_person'
  ));

-- ============================================
-- SKILL REFERENCE TABLOSU
-- ============================================
CREATE TABLE IF NOT EXISTS skill_ref (
  id text PRIMARY KEY,
  label text NOT NULL,
  active boolean DEFAULT true,
  sort_order integer DEFAULT 0
);

-- Skill verilerini ekle
INSERT INTO skill_ref (id, label, sort_order) VALUES
  ('react', 'React', 1),
  ('typescript', 'TypeScript', 2),
  ('nodejs', 'Node.js', 3),
  ('product-mgmt', 'Product Management', 4),
  ('ux', 'UX', 5),
  ('python', 'Python', 6),
  ('java', 'Java', 7),
  ('javascript', 'JavaScript', 8),
  ('css', 'CSS', 9),
  ('html', 'HTML', 10),
  ('sql', 'SQL', 11),
  ('aws', 'AWS', 12),
  ('docker', 'Docker', 13),
  ('kubernetes', 'Kubernetes', 14),
  ('git', 'Git', 15),
  ('agile', 'Agile', 16),
  ('scrum', 'Scrum', 17),
  ('leadership', 'Leadership', 18),
  ('communication', 'Communication', 19),
  ('project-management', 'Project Management', 20),
  ('data-analysis', 'Data Analysis', 21),
  ('machine-learning', 'Machine Learning', 22),
  ('artificial-intelligence', 'Artificial Intelligence', 23),
  ('blockchain', 'Blockchain', 24),
  ('mobile-development', 'Mobile Development', 25),
  ('devops', 'DevOps', 26),
  ('security', 'Security', 27),
  ('testing', 'Testing', 28),
  ('api-design', 'API Design', 29),
  ('microservices', 'Microservices', 30)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- MENTOR SKILL JUNCTION
-- ============================================
CREATE TABLE IF NOT EXISTS mentor_skills (
  user_id uuid REFERENCES app_users(id) ON DELETE CASCADE,
  skill_id text REFERENCES skill_ref(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, skill_id)
);

-- ============================================
-- MENTOR SERVICE FOCUS JUNCTION (MENTOR KATEGORİLERİ)
-- ============================================
CREATE TABLE IF NOT EXISTS mentor_service_focuses (
  user_id uuid REFERENCES app_users(id) ON DELETE CASCADE,
  service_focus_id text REFERENCES service_focus_ref(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, service_focus_id)
);

-- ============================================
-- MENTOR LANGUAGES JUNCTION (REFERENCE TABLO İLE)
-- ============================================
CREATE TABLE IF NOT EXISTS mentor_languages_ref (
  user_id uuid REFERENCES app_users(id) ON DELETE CASCADE,
  language_id text REFERENCES language_ref(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, language_id)
);

-- ============================================
-- MENTOR CATEGORIES JUNCTION (MEVCUT TABLOYU KORU)
-- ============================================
-- mentor_categories tablosu zaten mevcut, sadece index ekle
CREATE INDEX IF NOT EXISTS idx_mentor_categories_mentor ON mentor_categories(user_id);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_mentor_skills_mentor ON mentor_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_mentor_skills_skill ON mentor_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_mentor_service_focuses_mentor ON mentor_service_focuses(user_id);
CREATE INDEX IF NOT EXISTS idx_mentor_service_focuses_focus ON mentor_service_focuses(service_focus_id);
CREATE INDEX IF NOT EXISTS idx_mentor_languages_ref_mentor ON mentor_languages_ref(user_id);
CREATE INDEX IF NOT EXISTS idx_mentor_languages_ref_language ON mentor_languages_ref(language_id);
CREATE INDEX IF NOT EXISTS idx_mentors_currency ON mentors(currency);

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE skill_ref IS 'Mentor becerileri referans tablosu';
COMMENT ON TABLE mentor_skills IS 'Mentor-beceri ilişkisi';
COMMENT ON TABLE mentor_service_focuses IS 'Mentor-hizmet odak alanı ilişkisi';
COMMENT ON TABLE mentor_languages_ref IS 'Mentor-dil ilişkisi (referans tablo ile)';
COMMENT ON COLUMN mentors.currency IS 'Mentor seans ücreti para birimi';
