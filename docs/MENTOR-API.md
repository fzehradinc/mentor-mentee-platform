# MentorHub - Mentor Profile API Dokümantasyonu

## 🔐 Authentication

### JWT Token Alma
```bash
# Login endpoint (örnek)
curl -X POST https://api.mentorhub.com/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "mentor@example.com",
    "password": "securepassword"
  }'

# Response
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "user": {
    "id": "user123",
    "role": "mentor"
  }
}
```

### Authorization Header
Tüm korumalı endpoint'lerde:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📋 Endpoint Listesi

### Mentor CRUD
- `POST /mentors` - Yeni mentor profili oluştur
- `GET /mentors/{id}` - Mentor profili getir
- `PATCH /mentors/{id}` - Profil güncelle
- `DELETE /mentors/{id}` - Profil sil (admin only)

### Draft & Publish
- `PATCH /mentors/{id}/draft` - Autosave (taslak güncelle)
- `POST /mentors/{id}/submit` - Review'a gönder
- `POST /mentors/{id}/publish` - Yayınla (admin only)
- `POST /mentors/{id}/unpublish` - Yayından kaldır (admin only)

### Media Upload
- `POST /mentors/{id}/media/avatar-upload-url` - Avatar upload URL
- `POST /mentors/{id}/media/cover-upload-url` - Cover upload URL
- `POST /mentors/{id}/media/video-upload-url` - Video upload URL
- `PATCH /mentors/{id}/media/commit` - Media URL'lerini kaydet

### Specialized Updates
- `PUT /mentors/{id}/availability` - Müsaitlik güncelle
- `PUT /mentors/{id}/pricing` - Fiyatlandırma güncelle

### Public Access
- `GET /public/mentors/{slug}` - Public profil (slug ile)

## 🚀 Kullanım Örnekleri

### 1. Yeni Mentor Profili Oluşturma
```bash
curl -X POST https://api.mentorhub.com/v1/mentors \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "display_name": "Ayşe Kılıç",
    "title": "Senior UX Designer",
    "short_bio": "Kullanıcı odaklı tasarımla kariyerini hızlandırmana yardım ederim. 8 yıllık deneyimle UX süreçlerini öğretiyorum.",
    "primary_category": "design",
    "languages": ["Türkçe", "İngilizce"],
    "timezone": "Europe/Istanbul"
  }'
```

### 2. Autosave (Draft Update)
```bash
curl -X PATCH https://api.mentorhub.com/v1/mentors/c9b2e8f4-1234-5678-9abc-def012345678/draft \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "skills": ["UX Research", "Portfolio Review", "Figma"],
    "experience_years": 7,
    "price_per_session": 180.00
  }'
```

### 3. Müsaitlik Güncelleme
```bash
curl -X PUT https://api.mentorhub.com/v1/mentors/c9b2e8f4-1234-5678-9abc-def012345678/availability \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "availability_pattern": "weekday_evening",
    "time_slots": [
      {
        "day_of_week": 2,
        "start": "19:00",
        "end": "22:00"
      },
      {
        "day_of_week": 4,
        "start": "19:00",
        "end": "21:00"
      }
    ],
    "session_duration_minutes": 60,
    "meeting_pref": "video_meet"
  }'
```

### 4. Fiyatlandırma Güncelleme
```bash
curl -X PUT https://api.mentorhub.com/v1/mentors/c9b2e8f4-1234-5678-9abc-def012345678/pricing \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "price_per_session": 180.00,
    "first_session_discount": true,
    "packages": [
      {
        "name": "3 seans paketi",
        "sessions": 3,
        "discount_pct": 10
      },
      {
        "name": "5 seans paketi", 
        "sessions": 5,
        "discount_pct": 15
      }
    ]
  }'
```

### 5. Avatar Upload
```bash
# 1. Upload URL al
curl -X POST https://api.mentorhub.com/v1/mentors/c9b2e8f4-1234-5678-9abc-def012345678/media/avatar-upload-url \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content_type": "image/jpeg",
    "file_size": 2048576
  }'

# Response:
{
  "upload_url": "https://s3.amazonaws.com/bucket/avatars/c9b2e8f4.jpg?X-Amz-Signature=...",
  "expires_at": "2025-10-02T11:00:00Z"
}

# 2. Dosyayı upload et
curl -X PUT "https://s3.amazonaws.com/bucket/avatars/c9b2e8f4.jpg?X-Amz-Signature=..." \
  -H "Content-Type: image/jpeg" \
  --data-binary @avatar.jpg

# 3. URL'yi profile kaydet
curl -X PATCH https://api.mentorhub.com/v1/mentors/c9b2e8f4-1234-5678-9abc-def012345678/media/commit \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "avatar_url": "https://cdn.mentorhub.com/avatars/c9b2e8f4.webp"
  }'
```

### 6. Profil Yayınlama (Admin)
```bash
curl -X POST https://api.mentorhub.com/v1/mentors/c9b2e8f4-1234-5678-9abc-def012345678/publish \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "custom_slug": "ayse-kilic-ux-designer"
  }'

# Response:
{
  "message": "Profile published successfully",
  "slug": "ayse-kilic-ux-designer",
  "public_url": "https://mentorhub.com/mentors/ayse-kilic-ux-designer"
}
```

### 7. Public Profil Erişimi
```bash
curl https://api.mentorhub.com/v1/public/mentors/ayse-kilic-ux

# Response: Tam mentor profili (published olanlar için)
```

## 🔄 Yayın Akışı

### Mentor Profil Yaşam Döngüsü:
1. **Draft** → Mentor profil oluşturur, wizard ile doldurur
2. **Review** → Tamamlandığında admin incelemesine gönderir
3. **Published** → Admin onaylar, slug oluşturulur, public erişime açılır

### Autosave Akışı:
- Wizard'da her değişiklik → 800ms debounce → `PATCH /mentors/{id}/draft`
- Draft data JSONB olarak saklanır
- Publish sırasında draft data main table'a merge edilir

## ⚠️ Hata Kodları

### HTTP Status Codes:
- `200` - Başarılı
- `201` - Oluşturuldu
- `204` - Başarılı (içerik yok)
- `400` - Validation hatası
- `401` - Unauthorized (token eksik/geçersiz)
- `403` - Forbidden (yetki yok)
- `404` - Bulunamadı
- `409` - Conflict (slug çakışması)
- `429` - Rate limit aşıldı

### Hata Response Formatı:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "short_bio must be between 80-160 characters",
    "field": "short_bio"
  }
}
```

### Yaygın Hata Kodları:
- `VALIDATION_ERROR` - Alan validasyon hatası
- `SLUG_DUPLICATE` - Slug zaten kullanımda
- `NOT_FOUND` - Kayıt bulunamadı
- `UNAUTHORIZED` - Giriş gerekli
- `FORBIDDEN` - Yetki yetersiz
- `RATE_LIMIT_EXCEEDED` - İstek limiti aşıldı

## 🛡️ Güvenlik

### Rate Limiting:
- **Genel API**: 20 istek/dakika/kullanıcı
- **Media Upload**: 5 istek/dakika/kullanıcı
- **Publish Operations**: 2 istek/dakika/kullanıcı

### HTTPS Zorunluluğu:
- Tüm API çağrıları HTTPS üzerinden yapılmalıdır
- HTTP istekleri otomatik olarak HTTPS'e yönlendirilir

### JWT Token Gereklilikleri:
- Token'da `role` claim'i bulunmalıdır (`mentor` veya `platform_admin`)
- Token süresi: 1 saat (3600 saniye)
- Refresh token ile yenileme gereklidir

## 📊 Validation Kuralları

### Alan Kısıtlamaları:
- `display_name`: 2-50 karakter
- `title`: 2-60 karakter  
- `short_bio`: 80-160 karakter
- `long_bio`: 400-1200 karakter (opsiyonel)
- `price_per_session`: Minimum 100.00 TRY
- `skills`: Maksimum 50 adet
- `time_slots`: Maksimum 50 adet
- `packages`: Maksimum 2 adet
- `slug`: 3-60 karakter, kebab-case, unique

### Enum Değerleri:
- `primary_category`: product, design, software, data_ai, marketing, leadership, entrepreneurship
- `availability_pattern`: weekday_evening, weekend, flex
- `session_duration_minutes`: 30, 45, 60
- `meeting_pref`: video_meet, in_platform, flex
- `publish_status`: draft, review, published

## 🔍 Filtreleme & Arama

### Query Parameters (gelecek sürümler için):
```bash
# Kategori bazlı filtreleme
GET /public/mentors?category=design&min_rating=4.5

# Fiyat aralığı
GET /public/mentors?min_price=100&max_price=300

# Lokasyon
GET /public/mentors?country=TR&city=İstanbul

# Full-text search
GET /public/mentors?q=UX+Research+Figma
```

## 📈 Monitoring & Analytics

### Önemli Metrikler:
- Profil tamamlanma oranı
- Draft'tan publish'e geçiş süresi
- Autosave başarı oranı
- API response time'ları
- Hata oranları

### Log Formatı:
```json
{
  "timestamp": "2025-10-02T10:00:00Z",
  "method": "PATCH",
  "endpoint": "/mentors/{id}/draft",
  "user_id": "user123",
  "mentor_id": "c9b2e8f4-1234-5678-9abc-def012345678",
  "response_time_ms": 150,
  "status_code": 200
}
```

---

**API Version**: 1.0.0  
**Last Updated**: 2025-10-02  
**Contact**: api@mentorhub.com