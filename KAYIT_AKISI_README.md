# BiMentor | Birleştirilmiş Kayıt Akışı - Kurulum ve Kullanım

## 📋 Genel Bakış

Bu güncelleme ile BiMentor'un kayıt akışı tamamen yenilendi:

- ✅ **Tek kayıt akışı**: Header "Kayıt Ol" → Rol seçimi → Kayıt formu
- ✅ **Doğrudan CTA'lar**: Hero'daki "Mentee olarak devam et" ve "Mentor olarak katıl" butonları direkt kayıt sayfalarına yönlendirir
- ✅ **Ayrık login**: "Giriş Yap" sadece email/password ile LoginModal üzerinden
- ✅ **RHF + Zod validasyon**: Tüm formlar React Hook Form ve Zod ile validate edilir
- ✅ **Supabase entegrasyonu**: PostgreSQL veritabanı ile tam entegrasyon
- ✅ **SQL şeması**: `mentees`, `mentors`, `companies` tabloları ve RPC'ler

## 🚀 Hızlı Başlangıç

### 1. Paketleri Yükle

```bash
npm install
```

### 2. Supabase Projesi Oluştur

1. [Supabase Dashboard](https://app.supabase.com) üzerinden yeni proje oluştur
2. Project Settings → API'den:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Anon/Public Key**: `eyJhb...`

### 3. Environment Variables

Proje kökünde `.env` dosyası oluştur:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Veritabanı Migrasyonlarını Uygula

#### Supabase SQL Editor Kullanarak:

1. Supabase Dashboard → SQL Editor
2. `supabase/migrations/001_init.sql` içeriğini kopyala ve çalıştır
3. `supabase/migrations/002_views_and_rpcs.sql` içeriğini kopyala ve çalıştır

#### veya Supabase CLI ile:

```bash
npx supabase db push
```

### 5. Development Server'ı Başlat

```bash
npm run dev
```

Uygulama **http://localhost:5173** adresinde çalışacak.

## 📂 Yeni Dosyalar

### SQL Migrations
- `supabase/migrations/001_init.sql` - Temel şema (users, mentees, mentors, companies)
- `supabase/migrations/002_views_and_rpcs.sql` - Views ve helper functions

### Components
- `src/components/LoginModal.tsx` - Sadece email/password login
- `src/components/forms/MenteeRegisterForm.tsx` - RHF + Zod mentee kayıt formu
- `src/components/forms/MentorRegisterForm.tsx` - RHF + Zod mentor kayıt formu (individual/corporate)

### Pages
- `src/pages/MenteeRegisterPage.tsx` - Mentee kayıt sayfası
- `src/pages/IndividualMentorRegisterPage.tsx` - Bireysel mentor kayıt
- `src/pages/CorporateMentorRegisterPage.tsx` - Kurumsal mentor kayıt
- `src/pages/MentorTypeGate.tsx` - Mentor tipi seçim sayfası

### Actions (Supabase)
- `src/lib/actions/menteeActions.ts` - Mentee kayıt logic
- `src/lib/actions/mentorActions.ts` - Mentor kayıt logic

## 🔄 Kayıt Akışı

### Mentee Kaydı
```
Header "Kayıt Ol" 
  → RoleSelectModal 
  → "Mentee" seç 
  → MenteeRegisterPage
  → Form doldur
  → Supabase'e kayıt
  → /welcome/mentee
```

### Bireysel Mentor Kaydı
```
Header "Kayıt Ol" 
  → RoleSelectModal 
  → "Mentor" seç 
  → MentorTypeGate
  → "Bireysel Mentor" seç
  → IndividualMentorRegisterPage
  → Form doldur
  → Supabase'e kayıt
  → /welcome/mentor
```

### Kurumsal Mentor Kaydı
```
Header "Kayıt Ol" 
  → RoleSelectModal 
  → "Mentor" seç 
  → MentorTypeGate
  → "Kurumsal Mentor" seç
  → CorporateMentorRegisterPage
  → Form + Şirket bilgileri
  → Supabase'e kayıt
  → /welcome/mentor
```

### Doğrudan CTA'lar (Hero)
```
"Mentee olarak devam et" → Direkt MenteeRegisterPage
"Mentor olarak katıl" → Direkt MentorTypeGate
```

## 🗄️ Veritabanı Şeması

### app_users
- `id` (UUID, PK)
- `email` (TEXT, UNIQUE)
- `full_name` (TEXT)
- `role` (TEXT: mentee/mentor/admin)
- `password_hash` (TEXT)

### mentees
- `user_id` (UUID, FK → app_users)
- `short_goal` (TEXT)
- `target_track` (TEXT)
- `budget` (ENUM)
- `time_preference` (ENUM)
- `city`, `country`

### mentors
- `user_id` (UUID, FK → app_users)
- `mentor_type` (TEXT: individual/corporate)
- `display_name`, `title`
- `years_experience` (INT)
- `hourly_rate_cents` (INT)
- `meeting_preference` (ENUM)
- `bio_short`, `bio_long`
- `rating_avg`, `total_reviews`
- `status` (TEXT: pending_verification/verified/suspended)

### companies (kurumsal mentorlar için)
- `id` (UUID, PK)
- `name`, `website`, `tax_id`

### mentor_company_membership
- `mentor_id` (UUID, FK)
- `company_id` (UUID, FK)
- `role_title`, `work_email`

## 🔐 Güvenlik

- Şifreler `pgcrypto` ile `bcrypt` hash'lenir
- RPC'ler `SECURITY DEFINER` ile tanımlı
- `mentors_public_v` view sadece verified mentorları gösterir
- KVKK onayları `user_consents` tablosunda saklanır

## ✅ Form Validasyonu

### Mentee
- **fullName**: Min 2 karakter
- **email**: Geçerli email format
- **password**: Min 8 karakter
- **shortGoal**: 80-160 karakter
- **targetTrack**: Required (dropdown)
- **budget**: Required (0-500₺, 500-1000₺, 1000+₺)
- **timePref**: Required (weekday_evening, weekend, flexible)
- **languages**: Min 1 dil
- **kvkk**: Zorunlu onay

### Mentor (Individual)
- Tüm mentee alanları +
- **title**: Min 2 karakter
- **yearsExperience**: Min 0
- **hourlyRate**: Min 100₺
- **bioShort**: 80-160 karakter
- **bioLong**: 400-1200 karakter
- **categories**: Min 1 kategori
- **skills**: Virgülle ayrılmış

### Mentor (Corporate)
- Tüm individual alanları +
- **companyName**: Min 2 karakter
- **companyWebsite**: Geçerli URL (opsiyonel)
- **companyTaxId**: Opsiyonel
- **workEmail**: Geçerli email (opsiyonel)
- **roleTitle**: Opsiyonel

## 🎨 UI/UX Özellikleri

- ✅ Profesyonel gradient arka planlar (mentee: mavi, mentor: mavi, corporate: mor)
- ✅ Badge'ler (Bireysel Mentor, Kurumsal Mentor)
- ✅ Loading states (Loader2 animasyon)
- ✅ Success screens (CheckCircle + redirect)
- ✅ Error handling (AlertCircle + mesaj)
- ✅ Responsive design (mobile-first)
- ✅ Accessibility (ARIA labels, keyboard navigation)
- ✅ Character counters (bioShort, bioLong, shortGoal)
- ✅ Multi-select (languages, categories)

## 🧪 Test Senaryoları

### 1. Mentee Kaydı
1. Header → "Kayıt Ol" tıkla
2. "Mentee" seç
3. Form doldur (tüm zorunlu alanlar)
4. KVKK onayla
5. "Kaydı Tamamla" tıkla
6. Success ekranı görülmeli
7. `/welcome/mentee` redirect olmalı

### 2. Bireysel Mentor Kaydı
1. Header → "Kayıt Ol" tıkla
2. "Mentor" seç
3. "Bireysel Mentor" seç
4. Form doldur (bio 400+ karakter)
5. Kategoriler seç (çoklu)
6. KVKK onayla
7. "Kaydı Tamamla" tıkla
8. Success ekranı görülmeli

### 3. Kurumsal Mentor Kaydı
1. Header → "Kayıt Ol" tıkla
2. "Mentor" seç
3. "Kurumsal Mentor" seç
4. Form + Şirket bilgilerini doldur
5. "Kaydı Tamamla" tıkla
6. Success ekranı görülmeli

### 4. Doğrudan CTA
1. Hero'da "Mentee olarak devam et" tıkla
2. Direkt MenteeRegisterPage açılmalı

### 5. Login
1. Header → "Giriş Yap" tıkla
2. Email/password gir
3. "Giriş Yap" tıkla
4. Role göre redirect olmalı

## 🐛 Sorun Giderme

### Supabase bağlantı hatası
- `.env` dosyasında `VITE_SUPABASE_URL` ve `VITE_SUPABASE_ANON_KEY` doğru mu?
- Dev server'ı yeniden başlat: `npm run dev`

### RPC "create_app_user" bulunamadı
- `002_views_and_rpcs.sql` migration'ını çalıştırdığınızdan emin olun
- SQL Editor'de `SELECT * FROM pg_proc WHERE proname = 'create_app_user';` ile kontrol edin

### Form validasyon çalışmıyor
- Browser console'da hata var mı?
- Zod schema'ları doğru tanımlı mı?

### Kayıt sonrası redirect olmayan
- `localStorage` user objesi set ediliyor mu? (Console → Application → Local Storage)
- `/welcome/mentee` veya `/welcome/mentor` sayfaları mevcut mu?

## 📝 Notlar

- **Production'da**: Supabase RLS (Row Level Security) kurallarını aktif edin
- **Email verification**: Şu an devre dışı, production'da aktif edin
- **Password reset**: `/forgot-password` sayfası henüz implement edilmedi
- **Dashboard pages**: `/mentee/dashboard` ve `/mentor/dashboard` oluşturulmalı
- **Welcome pages**: `/welcome/mentee` ve `/welcome/mentor` oluşturulmalı

## 🎯 Sonraki Adımlar

1. [ ] Welcome sayfalarını oluştur
2. [ ] Dashboard'ları implement et
3. [ ] Email verification ekle
4. [ ] Password reset flow'u ekle
5. [ ] Mentor onboarding wizard'ı ekle
6. [ ] Mentee-Mentor matching algoritması
7. [ ] Payment integration (Stripe/İyzico)
8. [ ] Calendar & booking system

## 📞 Destek

Herhangi bir sorun için GitHub Issues açın veya ekip ile iletişime geçin.

---

✨ **BiMentor** - Deneyimle Geliş, Mentorlukla İlerle

