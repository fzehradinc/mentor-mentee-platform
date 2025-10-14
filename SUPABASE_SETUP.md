# 🚀 BiMentor Supabase Kurulum Rehberi

## 📋 Adım 1: Supabase Projesi Oluştur

1. **https://app.supabase.com** adresine git
2. "New Project" butonuna tıkla
3. Proje bilgilerini gir:
   - **Name**: BiMentor (veya istediğin isim)
   - **Database Password**: Güçlü bir şifre belirle (kaydet!)
   - **Region**: Europe (Frankfurt) veya en yakın bölge
4. "Create new project" butonuna tıkla (2-3 dakika sürer)

## 🔑 Adım 2: API Anahtarlarını Al

1. Sol menüden **Settings** → **API** git
2. Aşağıdaki bilgileri kopyala:

### Project URL
```
https://xxxxxxxxxxxxx.supabase.co
```

### anon/public key
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📝 Adım 3: .env Dosyası Oluştur

Proje kök dizininde `.env` dosyası oluştur:

```bash
# Windows (PowerShell)
New-Item -Path .env -ItemType File

# veya manuel olarak oluştur
```

`.env` dosyasına şunu ekle:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> ⚠️ **ÖNEMLİ**: `xxxxxxxxxxxxx` kısımlarını kendi değerlerinle değiştir!

## 🗄️ Adım 4: SQL Migration'ları Çalıştır

### Yöntem 1: SQL Editor (Tavsiye Edilen)

1. Supabase Dashboard → **SQL Editor**
2. "New query" buton
3. Her migration dosyasını sırayla kopyala ve çalıştır:

#### 4.1) `supabase/migrations/001_init.sql`
```sql
-- Dosya içeriğini kopyala ve çalıştır
```

#### 4.2) `supabase/migrations/002_views_and_rpcs.sql`
```sql
-- Dosya içeriğini kopyala ve çalıştır
```

#### 4.3) `supabase/migrations/003_mentee_preferences.sql`
```sql
-- Dosya içeriğini kopyala ve çalıştır
```

### Yöntem 2: Supabase CLI (Opsiyonel)

```bash
# Supabase CLI yükle (eğer yoksa)
npm install -g supabase

# Login
npx supabase login

# Migration'ları push et
npx supabase db push
```

## ✅ Adım 5: Veritabanını Kontrol Et

SQL Editor'de test sorgusu çalıştır:

```sql
-- Tabloları kontrol et
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Beklenen tablolar:
-- app_users
-- user_consents
-- mentees
-- mentee_languages
-- mentee_interests
-- mentee_priorities
-- mentors
-- mentor_languages
-- mentor_categories
-- mentor_skills
-- companies
-- mentor_company_membership
```

## 🔄 Adım 6: Dev Server'ı Yeniden Başlat

```bash
# Mevcut server'ı durdur (Ctrl+C)
# Yeniden başlat
npm run dev
```

## 🧪 Adım 7: Test Et

### Test 1: Mentee Kaydı
```
1. http://localhost:5173
2. Header → "Kayıt Ol" → "Mentee"
3. Form doldur → "Kaydı Tamamla"
4. ✅ Supabase Dashboard → Table Editor → app_users (yeni kayıt görünmeli)
```

### Test 2: SQL Kontrolü
```sql
-- Yeni oluşturulan kullanıcıyı kontrol et
SELECT * FROM app_users ORDER BY created_at DESC LIMIT 1;

-- Mentee bilgilerini kontrol et
SELECT 
  u.email,
  u.full_name,
  m.short_goal,
  m.goal_type,
  array_agg(DISTINCT mi.interest) as interests,
  array_agg(DISTINCT mp.priority) as priorities
FROM app_users u
JOIN mentees m ON m.user_id = u.id
LEFT JOIN mentee_interests mi ON mi.user_id = u.id
LEFT JOIN mentee_priorities mp ON mp.user_id = u.id
WHERE u.role = 'mentee'
GROUP BY u.id, u.email, u.full_name, m.short_goal, m.goal_type
ORDER BY u.created_at DESC
LIMIT 1;
```

### Test 3: Login
```
1. Ana sayfa → Header → "Giriş Yap"
2. Kayıt olurken kullandığın email/password gir
3. ✅ Giriş başarılı olmalı
```

## 🔒 Adım 8: RLS (Row Level Security) Yapılandırması (Opsiyonel)

> ⚠️ Production'da mutlaka yapılmalı!

```sql
-- app_users tablosu için RLS
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar sadece kendi bilgilerini görebilir
CREATE POLICY "Users can view own data" ON app_users
  FOR SELECT USING (auth.uid() = id);

-- Benzer policy'leri diğer tablolar için de ekle
```

## 🐛 Sorun Giderme

### Problem: "supabaseUrl is required"
**Çözüm**: `.env` dosyası doğru oluşturulmuş mu? `VITE_` prefix'i var mı?

### Problem: "create_app_user function does not exist"
**Çözüm**: `002_views_and_rpcs.sql` migration'ını çalıştır

### Problem: "relation does not exist"
**Çözüm**: `001_init.sql` migration'ını çalıştır

### Problem: Dev server'da değişiklikler yansımıyor
**Çözüm**: 
```bash
# Server'ı durdur ve yeniden başlat
npm run dev
```

## 📞 Destek

Herhangi bir sorun yaşarsan:
1. Supabase Dashboard → Logs kontrol et
2. Browser Console → Hataları kontrol et
3. `npm run dev` terminalinde hataları kontrol et

---

✨ **BiMentor** - Artık gerçek veritabanı ile çalışıyor!


