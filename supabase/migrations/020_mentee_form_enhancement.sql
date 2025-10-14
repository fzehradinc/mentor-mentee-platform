-- BiMentor | Mentee Form Enhancement
-- Eksik alanları ve enum değerlerini ekle

-- ============================================
-- ENUM DEĞERLERİNİ GENİŞLET
-- ============================================

-- Budget enum değerlerini genişlet
ALTER TABLE mentees DROP CONSTRAINT IF EXISTS mentees_budget_check;
ALTER TABLE mentees ADD CONSTRAINT mentees_budget_check 
  CHECK (budget in ('0_500','500_1000','1000_plus','undecided'));

-- Time preference enum değerlerini genişlet  
ALTER TABLE mentees DROP CONSTRAINT IF EXISTS mentees_time_preference_check;
ALTER TABLE mentees ADD CONSTRAINT mentees_time_preference_check 
  CHECK (time_preference in ('weekday_evening','weekend','flexible','weekdays_day'));

-- Goal type enum değerlerini genişlet
ALTER TABLE mentees DROP CONSTRAINT IF EXISTS mentees_goal_type_check;
ALTER TABLE mentees ADD CONSTRAINT mentees_goal_type_check 
  CHECK (goal_type in (
    'temel_bilgi','somut_hedef','ise_giris_terfi','sektor_degisim',
    'yurtdisi_basvuru','girisim','finans','akademik'
  ));

-- ============================================
-- MENTEES TABLOSUNA EKSİK ALANLARI EKLE
-- ============================================

-- Service focus alanı ekle (alan seçimi için)
ALTER TABLE mentees 
  ADD COLUMN IF NOT EXISTS service_focus text;

-- ============================================
-- SERVICE FOCUS REFERENCE TABLOSU
-- ============================================
CREATE TABLE IF NOT EXISTS service_focus_ref (
  id text PRIMARY KEY,
  label text NOT NULL,
  active boolean DEFAULT true,
  sort_order integer DEFAULT 0
);

-- Service focus verilerini ekle
INSERT INTO service_focus_ref (id, label, sort_order) VALUES
  ('borsa', 'Borsa & Yatırım', 1),
  ('kariyer', 'Kariyer/İş', 2),
  ('egitim', 'Üniversite & Eğitim', 3),
  ('kisisel', 'Kişisel Gelişim', 4),
  ('degisim', 'Hayat Değişimi', 5),
  ('yazilim', 'Yazılım', 6),
  ('veri_ai', 'Veri/AI', 7),
  ('tasarim', 'Tasarım', 8)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- MENTEE SERVICE FOCUS JUNCTION
-- ============================================
CREATE TABLE IF NOT EXISTS mentee_service_focus (
  user_id uuid REFERENCES app_users(id) ON DELETE CASCADE,
  service_focus_id text REFERENCES service_focus_ref(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, service_focus_id)
);

-- ============================================
-- LANGUAGE REFERENCE TABLOSU
-- ============================================
CREATE TABLE IF NOT EXISTS language_ref (
  id text PRIMARY KEY,
  label text NOT NULL,
  active boolean DEFAULT true,
  sort_order integer DEFAULT 0
);

-- Language verilerini ekle
INSERT INTO language_ref (id, label, sort_order) VALUES
  ('tr', 'Türkçe', 1),
  ('en', 'İngilizce', 2),
  ('de', 'Almanca', 3),
  ('fr', 'Fransızca', 4)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- MENTEE LANGUAGE JUNCTION (REFERENCE TABLO İLE)
-- ============================================
CREATE TABLE IF NOT EXISTS mentee_languages_ref (
  user_id uuid REFERENCES app_users(id) ON DELETE CASCADE,
  language_id text REFERENCES language_ref(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, language_id)
);

-- ============================================
-- DISCIPLINE REFERENCE TABLOSU
-- ============================================
CREATE TABLE IF NOT EXISTS discipline_ref (
  id text PRIMARY KEY,
  label text NOT NULL,
  active boolean DEFAULT true,
  sort_order integer DEFAULT 0
);

-- Discipline verilerini ekle (interests ile aynı)
INSERT INTO discipline_ref (id, label, sort_order) VALUES
  ('yazilim', 'Yazılım', 1),
  ('veri_ai', 'Veri/AI', 2),
  ('urun', 'Ürün', 3),
  ('tasarim_ux', 'Tasarım/UX', 4),
  ('pazarlama', 'Pazarlama', 5),
  ('satis_bd', 'Satış/BD', 6),
  ('finans_yatirim', 'Finans/Yatırım', 7),
  ('girisim', 'Girişimcilik', 8),
  ('kariyer_liderlik', 'Kariyer/Liderlik', 9),
  ('akademik', 'Akademik', 10),
  ('verimlilik', 'Verimlilik', 11),
  ('yurtdisi_dil', 'Yurt dışı & Dil', 12)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- MENTEE DISCIPLINE JUNCTION (REFERENCE TABLO İLE)
-- ============================================
CREATE TABLE IF NOT EXISTS mentee_disciplines_ref (
  user_id uuid REFERENCES app_users(id) ON DELETE CASCADE,
  discipline_id text REFERENCES discipline_ref(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, discipline_id)
);

-- ============================================
-- PREFERENCE REFERENCE TABLOSU
-- ============================================
CREATE TABLE IF NOT EXISTS preference_ref (
  id text PRIMARY KEY,
  label text NOT NULL,
  active boolean DEFAULT true,
  sort_order integer DEFAULT 0
);

-- Preference verilerini ekle
INSERT INTO preference_ref (id, label, sort_order) VALUES
  ('cv_portfoy', 'CV/Portföy', 1),
  ('mock_interview', 'Mock Interview', 2),
  ('yol_haritasi', 'Yol Haritası', 3),
  ('teknik_kocluk', 'Teknik Koçluk', 4),
  ('proje_danismanligi', 'Proje Danışmanlığı', 5),
  ('network_tanitimi', 'Network Tanıtımı', 6),
  ('ucret_pazarligi', 'Ücret Pazarlığı', 7),
  ('borsa_portfoy', 'Borsa/Portföy', 8),
  ('akademik_danismanlik', 'Akademik Danışmanlık', 9),
  ('yurtdisi_dokuman', 'Yurt dışı Doküman', 10)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- MENTEE PREFERENCE JUNCTION
-- ============================================
CREATE TABLE IF NOT EXISTS mentee_preferences_ref (
  user_id uuid REFERENCES app_users(id) ON DELETE CASCADE,
  preference_id text REFERENCES preference_ref(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, preference_id)
);

-- ============================================
-- KVKK CONSENT ENHANCEMENT
-- ============================================
ALTER TABLE user_consents 
  ADD COLUMN IF NOT EXISTS kvkk_version text DEFAULT 'v1.0-tr-2025-10-10',
  ADD COLUMN IF NOT EXISTS ip_address text;

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_mentee_service_focus ON mentee_service_focus(user_id);
CREATE INDEX IF NOT EXISTS idx_mentee_languages_ref ON mentee_languages_ref(user_id);
CREATE INDEX IF NOT EXISTS idx_mentee_disciplines_ref ON mentee_disciplines_ref(user_id);
CREATE INDEX IF NOT EXISTS idx_mentee_preferences_ref ON mentee_preferences_ref(user_id);

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE service_focus_ref IS 'Hizmet odak alanları referans tablosu';
COMMENT ON TABLE mentee_service_focus IS 'Mentee-hizmet odak alanı ilişkisi';
COMMENT ON TABLE language_ref IS 'Dil referans tablosu';
COMMENT ON TABLE mentee_languages_ref IS 'Mentee-dil ilişkisi (referans tablo ile)';
COMMENT ON TABLE discipline_ref IS 'Disiplin referans tablosu';
COMMENT ON TABLE mentee_disciplines_ref IS 'Mentee-disiplin ilişkisi (referans tablo ile)';
COMMENT ON TABLE preference_ref IS 'Öncelik referans tablosu';
COMMENT ON TABLE mentee_preferences_ref IS 'Mentee-öncelik ilişkisi';
COMMENT ON COLUMN mentees.service_focus IS 'Mentee ana hizmet odak alanı';
COMMENT ON COLUMN user_consents.kvkk_version IS 'KVKK onay versiyonu';
COMMENT ON COLUMN user_consents.ip_address IS 'KVKK onay IP adresi';
