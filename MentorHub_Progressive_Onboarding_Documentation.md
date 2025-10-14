# MentorHub - Progressive Onboarding & Smart Matching + Minimal Mentee Page
## Kapsamlı Teknik Dokümantasyon

---

## Bölüm 1 — Rakip İncelemesi (Öncelik)

### 1.1 MentorCruise Analizi
**En İyi 3 UX Elementi:**
- **Kategori-bazlı filtreleme**: Ana sayfada büyük kategori kartları ile hızlı yönlendirme
- **Mentor profil kartları**: Fotoğraf, başlık, 3 etiket, fiyat ve "Book a call" CTA'sı net hiyerarşi ile
- **Progressive disclosure**: Mentor detayında temel bilgi → deneyim → reviews → booking akışı

**En İyi 3 İçerik Elemanı:**
- **"Why this mentor" açıklaması**: Her öneride neden eşleştiği 2-3 madde ile açıklanıyor
- **Social proof**: "1000+ mentees helped" gibi sayısal kanıtlar
- **Pricing transparency**: Saat başı ücret net şekilde görünüyor

**Mobil/Masaüstü Farkları:**
- Mobilde mentor kartları tek sütun, masaüstünde 3 sütun grid
- Mobilde filtreleme drawer, masaüstünde sidebar

**Kopyalanmaması Gereken:**
- Çok fazla bilgi yoğunluğu (mentor kartında 8+ etiket)

### 1.2 ADPList Analizi
**En İyi 3 UX Elementi:**
- **Quick booking**: "Available now" mentorlar için tek tık rezervasyon
- **Skill-based matching**: Kullanıcının seçtiği skill'e göre otomatik öneri
- **Community aspect**: Grup mentorluğu ve etkinlik entegrasyonu

**En İyi 3 İçerik Elemanı:**
- **Mentor spotlight**: Başarı hikayesi ile mentor tanıtımı
- **Free/Paid ayrımı**: Ücretsiz mentorlar net şekilde işaretli
- **Company badges**: Google, Meta gibi şirket logoları güven artırıyor

**Mobil/Masaüstü Farkları:**
- Mobilde bottom navigation, masaüstünde top navigation
- Mobilde swipe gesture'lar aktif

**Kopyalanmaması Gereken:**
- Karmaşık onboarding (7+ soru)

### 1.3 Mentorloop Analizi
**En İyi 3 UX Elementi:**
- **Goal-oriented matching**: Hedef bazlı eşleştirme algoritması
- **Progress tracking**: Mentee'nin gelişim takibi dashboard'u
- **Automated scheduling**: Takvim entegrasyonu ile otomatik randevu

**En İyi 3 İçerik Elemanı:**
- **Outcome-focused copy**: "Achieve your goals" odaklı mesajlaşma
- **Success metrics**: Mentee başarı oranları ve testimonial'lar
- **Industry-specific content**: Sektör bazlı özelleştirilmiş içerik

**Mobil/Masaüstü Farkları:**
- Mobilde card-based layout, masaüstünde table view
- Mobilde voice message özelliği

**Kopyalanmaması Gereken:**
- Aşırı gamification (rozet, puan sistemi)

### 1.4 TogetherPlatform Analizi
**En İyi 3 UX Elementi:**
- **Cohort-based approach**: Grup mentorluğu odaklı tasarım
- **Multi-step onboarding**: Kademeli bilgi toplama
- **Integrated communication**: Platform içi mesajlaşma sistemi

**En İyi 3 İçerik Elemanı:**
- **Program-based structure**: Belirli programlar altında mentor gruplandırması
- **Peer learning emphasis**: Akran öğrenme vurgusu
- **Structured curriculum**: Öğrenme yol haritası

**Mobil/Masaüstü Farkları:**
- Mobilde vertical timeline, masaüstünde horizontal
- Mobilde gesture-based navigation

**Kopyalanmaması Gereken:**
- Çok karmaşık program yapısı (yeni kullanıcı için kafa karıştırıcı)

### 1.5 Yerel Rakip (Örnek: Akademetre) Analizi
**En İyi 3 UX Elementi:**
- **Türkçe UX patterns**: Yerel kullanıcı alışkanlıklarına uygun tasarım
- **University-focused**: Üniversite öğrencilerine özel kategoriler
- **Local payment methods**: Türk ödeme sistemleri entegrasyonu

**En İyi 3 İçerik Elemanı:**
- **Turkish success stories**: Yerel başarı hikayeleri
- **Academic focus**: Akademik kariyer odaklı içerik
- **Affordable pricing**: Türkiye ekonomisine uygun fiyatlandırma

**Mobil/Masaüstü Farkları:**
- Mobil-first yaklaşım (Türkiye'de mobil kullanım yüksek)
- WhatsApp entegrasyonu

**Kopyalanmaması Gereken:**
- Eski tasarım patterns (2010'lu yıllar UI)

---

## Bölüm 2 — Progressive Onboarding (3–4 Soru)

### 2.1 Genel Kurallar
- Her soru maksimum 1 ekran
- Animasyonlu geçişler (fade-in/slide-up)
- "Atla" seçeneği her soruda mevcut
- Progress indicator (1/3, 2/3, 3/3)
- Tooltip açıklamaları

### 2.2 Soru Akışı

#### Soru 1 — Kategori (Zorunlu, Çoktan Seçmeli)
```
Soru metni: "Ne için destek istiyorsun?"

Seçenekler:
🏦 Borsa & Yatırım
💼 Kariyer / İş  
🎓 Üniversite & Eğitim
🌟 Kişisel Gelişim / Koçluk
🔄 Hayat Değişimi

UI: Büyük butonlar (120px yükseklik), ikon + metin
Tooltip: "Bu sayede sana uygun mentorları filtreleyebiliriz"
```

#### Soru 2 — Hedef Seviyesi (Zorunlu, Tek Seçim)
```
Açılma koşulu: Soru 1 yanıtlandı
Soru metni: "Hedefin hangisine daha yakın?"

Seçenekler:
📚 Temel Bilgi Öğrenme
🗺️ Stratejik Yol Haritası  
🎯 Somut Hedef (iş, sınav, yatırım)
🤝 Uzun Süreli Koçluk

UI: Radio button + açıklayıcı alt metin
Tooltip: "Hedef seviyene göre mentor deneyimi eşleştiriliyor"
```

#### Soru 3 — Bütçe & Zaman (Zorunlu)
```
Açılma koşulu: Soru 2 yanıtlandı
Soru metni: "Seans başı bütçe aralığı ve müsait zamanın nedir?"

Bütçe Seçenekleri:
💰 500–1000 TL
💰💰 1000–2000 TL  
💰💰💰 2000+ TL

Zaman Seçenekleri:
🌆 Hafta içi akşam
🌅 Hafta sonu
⏰ Esnek

UI: İki bölümlü (bütçe butonları + zaman checkbox'ları)
Tooltip: "Bütçe ve zaman uyumlu mentorlar öncelikli gösterilir"
```

#### Soru 4 — Tercih & Ek (Opsiyonel)
```
Açılma koşulu: Soru 1/2/3 tamamlandı VEYA "Daha fazla belirt" seçildi
Soru metni: "Tercih ettiğin mentor tipi ve kısa hedef açıklaması"

Alan 1: Mentor Tipi
🎓 Akademik
💼 Practitioner  
🧭 Koç

Alan 2: Hedef Açıklaması (150 karakter, opsiyonel)
Placeholder: "Örn: 6 ayda veri analisti olmak istiyorum"

UI: Dropdown + textarea
Tooltip: "Bu bilgiler daha kişisel öneriler için kullanılır"
```

### 2.3 A/B Test Varyantları

**Varyant A (Mevcut)**: Yukarıdaki akış
**Varyant B (Alternatif)**: 
- Soru 1: "Hangi alanda gelişmek istiyorsun?" (daha pozitif)
- Soru 2: "Ne kadar sürede sonuç almak istiyorsun?" (zaman odaklı)

---

## Bölüm 3 — Eşleştirme Algoritması (Basit, Explainable)

### 3.1 Girdi Özellikleri (Mentee)
```javascript
mentee_profile = {
  category: "Borsa & Yatırım",
  goal_level: "Somut Hedef", 
  budget_range: [1000, 2000],
  availability: ["Hafta içi akşam", "Esnek"],
  mentor_type_pref: "Practitioner", // opsiyonel
  short_text_goal: "6 ayda portföy yönetimi öğrenmek" // opsiyonel
}
```

### 3.2 Mentor Veri Modeli
```javascript
mentor_profile = {
  id: "m123",
  tags: ["Borsa & Yatırım", "Portföy Yönetimi", "Risk Analizi"],
  price: 1500,
  years_experience: 8,
  mentor_type: "Practitioner",
  languages: ["Türkçe", "İngilizce"],
  availability_slots: ["Hafta içi akşam", "Hafta sonu"],
  rating: 4.8,
  verified_flag: true,
  institution: "Garanti BBVA",
  total_sessions: 156,
  success_rate: 0.94
}
```

### 3.3 Eşleştirme Algoritması (Pseudocode)
```python
def match_mentors(mentee_profile, mentor_database):
    # Filtre 1: Kategori eşleşmesi
    filtered_mentors = []
    for mentor in mentor_database:
        if mentee_profile.category in mentor.tags:
            filtered_mentors.append(mentor)
    
    # Filtre 2: Bütçe uyumu (±25% tolerans)
    budget_filtered = []
    min_budget, max_budget = mentee_profile.budget_range
    for mentor in filtered_mentors:
        if (min_budget * 0.75 <= mentor.price <= max_budget * 1.25) or mentor.has_discount:
            budget_filtered.append(mentor)
    
    # Skorlama
    scored_mentors = []
    for mentor in budget_filtered:
        score = calculate_score(mentee_profile, mentor)
        reason = generate_reason(mentee_profile, mentor)
        scored_mentors.append({
            "mentor": mentor,
            "score": score,
            "reason": reason
        })
    
    # Sıralama ve top 10 döndürme
    scored_mentors.sort(key=lambda x: x["score"], reverse=True)
    return scored_mentors[:10]

def calculate_score(mentee, mentor):
    # Ağırlıklar
    w1 = 0.30  # kategori_match
    w2 = 0.20  # price_match  
    w3 = 0.15  # experience_norm
    w4 = 0.15  # rating_norm
    w5 = 0.10  # availability_score
    w6 = 0.05  # mentor_type_match
    w7 = 0.05  # local_proximity_score
    
    # Skorlar (0-1 arası normalize)
    category_match = len(set(mentee.category) & set(mentor.tags)) / len(mentor.tags)
    price_match = 1 - abs(mentor.price - avg(mentee.budget_range)) / avg(mentee.budget_range)
    experience_norm = min(mentor.years_experience / 10, 1.0)
    rating_norm = mentor.rating / 5.0
    availability_score = len(set(mentee.availability) & set(mentor.availability_slots)) / len(mentee.availability)
    mentor_type_match = 1.0 if mentee.mentor_type_pref == mentor.mentor_type else 0.5
    local_proximity_score = 1.0 if mentor.languages.includes("Türkçe") else 0.7
    
    # Keyword matching bonus (opsiyonel)
    keyword_bonus = 0.0
    if mentee.short_text_goal:
        keywords = extract_keywords(mentee.short_text_goal)
        mentor_keywords = extract_keywords(mentor.bio + " " + " ".join(mentor.tags))
        keyword_match = len(set(keywords) & set(mentor_keywords)) / len(keywords)
        keyword_bonus = keyword_match * 0.05
    
    total_score = (w1 * category_match + w2 * price_match + w3 * experience_norm + 
                   w4 * rating_norm + w5 * availability_score + w6 * mentor_type_match + 
                   w7 * local_proximity_score + keyword_bonus)
    
    return min(total_score, 1.0)

def generate_reason(mentee, mentor):
    reasons = []
    
    # Kategori eşleşmesi
    if mentee.category in mentor.tags:
        reasons.append("Kategori eşleşti")
    
    # Fiyat uyumu
    min_budget, max_budget = mentee.budget_range
    if min_budget <= mentor.price <= max_budget:
        reasons.append("Fiyat uygun")
    elif mentor.has_discount:
        reasons.append("İlk seans indirimi var")
    
    # Rating
    if mentor.rating >= 4.5:
        reasons.append(f"{mentor.rating}/5 puan")
    
    # Deneyim
    if mentor.years_experience >= 5:
        reasons.append(f"{mentor.years_experience} yıl deneyim")
    
    # Müsaitlik
    availability_match = set(mentee.availability) & set(mentor.availability_slots)
    if availability_match:
        reasons.append("Müsaitlik uyuyor")
    
    return reasons[:3]  # En fazla 3 sebep döndür
```

### 3.4 Explainable AI Bileşeni
Her mentor önerisi için "Neden önerildi?" açıklaması:
```
Örnek çıktı:
✅ Kategori eşleşti (Borsa & Yatırım)
✅ Fiyat uygun (1500 TL, bütçeniz: 1000-2000 TL)  
✅ 4.8/5 puan (156 başarılı seans)
```

---

## Bölüm 4 — API & Dataflow (Örnek)

### 4.1 API Endpoints

#### POST /onboarding/answers
```http
POST /api/v1/onboarding/answers
Content-Type: application/json
Authorization: Bearer {jwt_token}

Request Body:
{
  "user_id": "u456",
  "answers": [
    {
      "question_id": "q1_category",
      "answer": "Borsa & Yatırım",
      "timestamp": "2024-01-15T10:30:00Z"
    },
    {
      "question_id": "q2_goal_level", 
      "answer": "Somut Hedef",
      "timestamp": "2024-01-15T10:30:15Z"
    },
    {
      "question_id": "q3_budget_time",
      "answer": {
        "budget_range": [1000, 2000],
        "availability": ["Hafta içi akşam", "Esnek"]
      },
      "timestamp": "2024-01-15T10:30:30Z"
    }
  ],
  "consent": {
    "data_processing": true,
    "marketing": false,
    "timestamp": "2024-01-15T10:30:00Z"
  }
}

Response:
{
  "status": "success",
  "message": "Onboarding answers saved successfully",
  "profile_completion": 75,
  "next_step": "view_suggestions"
}
```

#### GET /matching/suggestions
```http
GET /api/v1/matching/suggestions?user_id=u456&limit=10
Authorization: Bearer {jwt_token}

Response:
{
  "status": "success",
  "suggestions": [
    {
      "mentor_id": "m123",
      "score": 0.86,
      "reason": ["Kategori eşleşti", "Fiyat uygun", "4.9/5 puan"],
      "mentor": {
        "id": "m123",
        "name": "Ahmet Kaya",
        "title": "Senior Portfolio Manager",
        "company": "Garanti BBVA",
        "avatar": "https://cdn.mentorhub.com/avatars/m123.jpg",
        "rating": 4.9,
        "total_reviews": 87,
        "price": 1500,
        "tags": ["Borsa & Yatırım", "Portföy Yönetimi", "Risk Analizi"],
        "availability": "Bu hafta 3 slot müsait",
        "verified": true,
        "response_time": "2 saat içinde",
        "success_rate": 94
      }
    },
    {
      "mentor_id": "m124", 
      "score": 0.82,
      "reason": ["Kategori eşleşti", "İlk seans indirimi", "8 yıl deneyim"],
      "mentor": {
        "id": "m124",
        "name": "Zeynep Demir",
        "title": "Investment Advisor",
        "company": "İş Bankası",
        "avatar": "https://cdn.mentorhub.com/avatars/m124.jpg",
        "rating": 4.7,
        "total_reviews": 124,
        "price": 1800,
        "discount_price": 999,
        "tags": ["Borsa & Yatırım", "Bireysel Emeklilik", "Finansal Planlama"],
        "availability": "Yarın müsait",
        "verified": true,
        "response_time": "1 saat içinde",
        "success_rate": 91
      }
    }
  ],
  "total_matches": 23,
  "filters_applied": {
    "category": "Borsa & Yatırım",
    "budget_range": [1000, 2000],
    "availability": ["Hafta içi akşam", "Esnek"]
  },
  "personalization_level": "high"
}
```

#### GET /mentor/{id}
```http
GET /api/v1/mentor/m123
Authorization: Bearer {jwt_token}

Response:
{
  "status": "success",
  "mentor": {
    "id": "m123",
    "name": "Ahmet Kaya",
    "title": "Senior Portfolio Manager",
    "company": "Garanti BBVA",
    "bio": "8 yıldır bireysel yatırımcılara portföy yönetimi konusunda danışmanlık veriyorum. Özellikle risk yönetimi ve uzun vadeli yatırım stratejileri konularında uzmanım.",
    "avatar": "https://cdn.mentorhub.com/avatars/m123.jpg",
    "cover_image": "https://cdn.mentorhub.com/covers/m123.jpg",
    "rating": 4.9,
    "total_reviews": 87,
    "total_sessions": 156,
    "years_experience": 8,
    "price": 1500,
    "languages": ["Türkçe", "İngilizce"],
    "tags": ["Borsa & Yatırım", "Portföy Yönetimi", "Risk Analizi", "Teknik Analiz"],
    "education": [
      {
        "degree": "MBA",
        "school": "Boğaziçi Üniversitesi",
        "year": "2018"
      }
    ],
    "experience": [
      {
        "title": "Senior Portfolio Manager",
        "company": "Garanti BBVA",
        "duration": "2020 - Günümüz"
      }
    ],
    "certifications": ["CFA Level 2", "SPK Lisansı"],
    "availability_slots": [
      {
        "date": "2024-01-16",
        "time": "19:00",
        "duration": 60,
        "available": true
      }
    ],
    "reviews": [
      {
        "id": "r789",
        "mentee_name": "Ali K.",
        "rating": 5,
        "comment": "Portföy stratejim konusunda çok değerli öneriler aldım.",
        "date": "2024-01-10"
      }
    ],
    "success_stories": [
      "156 başarılı mentee",
      "Ortalama %23 portföy getiri artışı",
      "94% mentee memnuniyet oranı"
    ],
    "contact_gated": true,
    "contact_reveal_condition": "first_session_booked"
  }
}
```

### 4.2 Data Retention & KVKV Uyumu

#### Gerekli Onaylar:
1. **Veri İşleme Rızası** (Zorunlu):
   - "Kişisel verilerimin eşleştirme algoritması için işlenmesini kabul ediyorum"
   - Checkbox: zorunlu, işaretli olmadan devam edilemez

2. **Pazarlama Rızası** (Opsiyonel):
   - "Kampanya ve özel teklifler hakkında bilgilendirilmek istiyorum"
   - Checkbox: opsiyonel, varsayılan işaretsiz

3. **Veri Saklama Süresi**:
   - Onboarding yanıtları: 2 yıl (aktif kullanım süresince)
   - İletişim bilgileri: Hesap silinene kadar
   - Seans geçmişi: 5 yıl (yasal zorunluluk)

#### Veri Güvenliği:
```javascript
// Telefon numarası hashing örneği
const crypto = require('crypto');

function hashPhoneNumber(phoneNumber, salt) {
  return crypto.pbkdf2Sync(phoneNumber, salt, 10000, 64, 'sha512').toString('hex');
}

// Veri silme endpoint'i
DELETE /api/v1/user/data-erasure
{
  "user_id": "u456",
  "reason": "GDPR_request",
  "confirmation": true
}
```

#### KVKK Compliance Checklist:
- ✅ Açık rıza alınıyor (checkbox ile)
- ✅ Veri işleme amacı belirtiliyor
- ✅ Saklama süresi bildiriliyor  
- ✅ Veri silme hakkı sağlanıyor
- ✅ Veri güvenliği önlemleri alınıyor
- ✅ 3. taraf paylaşımı için ayrı onay

---

## Bölüm 5 — Mentee Page (Tek Sayfa, Minimal, İçerik)

### 5.1 Layout Önerisi (Single-Column, Üstten Alta)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. HEADER - Kişiselleştirilmiş Karşılama                   │
│    "Merhaba, Zeynep — Hedefin: Portföy yönetimi öğrenmek"  │
│    [Profili Güncelle] [Bildirimler: 2]                     │
├─────────────────────────────────────────────────────────────┤
│ 2. ONBOARDING WIDGET (Küçük, Genişletilebilir)             │
│    "Profil tamamlanma: ████████░░ 80%"                     │
│    [Eksik bilgileri tamamla]                               │
├─────────────────────────────────────────────────────────────┤
│ 3. ÖNE ÇIKAN ÖNERİLEN MENTORLAR                            │
│    "Sana Özel Eşleşmeler ✨"                               │
│    [← Mentor Card 1] [Mentor Card 2] [Mentor Card 3] [→]   │
├─────────────────────────────────────────────────────────────┤
│ 4. GELİŞMİŞ FİLTRE & ARAMA                                 │
│    [🔍 Arama] [💰 Fiyat] [📍 Şehir] [🗣️ Dil] [📊 Tür]    │
├─────────────────────────────────────────────────────────────┤
│ 5. GELECEK SEANS & HIZLI İŞLEMLER                          │
│    "Bir sonraki seansın: 16 Ocak, 19:00 - Ahmet Kaya"     │
│    [İptal Et] [Yeniden Planla] [Mentor'a Mesaj]            │
├─────────────────────────────────────────────────────────────┤
│ 6. ASKIDA MENTORLUK / KAMPANYALAR                          │
│    "🎁 İlk Seans 99 TL - Sınırlı Süre!"                   │
│    [Kampanyayı Gör] [Askıda Mentörlük Nedir?]              │
├─────────────────────────────────────────────────────────────┤
│ 7. FOOTER                                                  │
│    [Destek] [KVKK] [Kullanım Şartları] [Hakkımızda]        │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Mentor Card Tasarımı (ASCII Wireframe)

```
┌─────────────────────────────────────────────────────────────┐
│ ┌─────┐  Ahmet Kaya                    [⭐ 4.9] [✓ Doğrulandı] │
│ │ 📷  │  Senior Portfolio Manager                           │
│ │ AVT │  Garanti BBVA                                       │
│ └─────┘                                                     │
│                                                             │
│ 🏷️ Borsa & Yatırım  💰 1500 TL/saat  ⏰ 8 yıl deneyim      │
│                                                             │
│ 💡 Neden önerildi:                                         │
│    ✅ Kategori eşleşti                                      │
│    ✅ Fiyat uygun                                           │
│    ✅ 4.9/5 puan (87 değerlendirme)                        │
│                                                             │
│ 📅 Bu hafta 3 slot müsait  ⚡ 2 saat içinde yanıt          │
│                                                             │
│                           [🎯 Seans Al]                     │
└─────────────────────────────────────────────────────────────┘
```

### 5.3 Tasarım İlkeleri

#### Renk Paleti:
```css
:root {
  --primary-blue: #2563eb;
  --primary-blue-light: #3b82f6;
  --primary-blue-dark: #1d4ed8;
  
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-600: #4b5563;
  --gray-900: #111827;
  
  --success-green: #10b981;
  --warning-amber: #f59e0b;
  --error-red: #ef4444;
}
```

#### Tipografi:
```css
/* Başlıklar */
.heading-xl { font-size: 2.25rem; font-weight: 700; line-height: 1.2; }
.heading-lg { font-size: 1.875rem; font-weight: 600; line-height: 1.3; }
.heading-md { font-size: 1.5rem; font-weight: 600; line-height: 1.4; }

/* Gövde metni */
.body-lg { font-size: 1.125rem; line-height: 1.6; }
.body-md { font-size: 1rem; line-height: 1.5; }
.body-sm { font-size: 0.875rem; line-height: 1.4; }

/* Etiketler */
.label-md { font-size: 0.875rem; font-weight: 500; }
.label-sm { font-size: 0.75rem; font-weight: 500; }
```

#### Spacing Sistemi (8px grid):
```css
.space-1 { margin: 0.5rem; }   /* 8px */
.space-2 { margin: 1rem; }     /* 16px */
.space-3 { margin: 1.5rem; }   /* 24px */
.space-4 { margin: 2rem; }     /* 32px */
.space-6 { margin: 3rem; }     /* 48px */
.space-8 { margin: 4rem; }     /* 64px */
```

#### Responsive Breakpoints:
```css
/* Mobile First */
.container { max-width: 100%; padding: 1rem; }

/* Tablet */
@media (min-width: 768px) {
  .container { max-width: 768px; padding: 1.5rem; }
  .mentor-grid { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop */
@media (min-width: 1024px) {
  .container { max-width: 1024px; padding: 2rem; }
  .mentor-grid { grid-template-columns: repeat(3, 1fr); }
}
```

### 5.4 Bileşen Detayları

#### Header Bileşeni:
```html
<header class="bg-white border-b border-gray-200 sticky top-0 z-50">
  <div class="container mx-auto flex justify-between items-center py-4">
    <div class="flex items-center space-x-4">
      <img src="avatar.jpg" class="w-10 h-10 rounded-full" alt="Profil">
      <div>
        <h1 class="heading-md text-gray-900">Merhaba, Zeynep</h1>
        <p class="body-sm text-gray-600">Hedefin: Portföy yönetimi öğrenmek</p>
      </div>
    </div>
    <div class="flex items-center space-x-3">
      <button class="btn-secondary">Profili Güncelle</button>
      <button class="relative">
        <bell-icon class="w-6 h-6 text-gray-600" />
        <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">2</span>
      </button>
    </div>
  </div>
</header>
```

#### Mentor Card Bileşeni:
```html
<div class="mentor-card bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6">
  <!-- Avatar ve Temel Bilgiler -->
  <div class="flex items-start space-x-4 mb-4">
    <img src="mentor-avatar.jpg" class="w-16 h-16 rounded-full object-cover" alt="Mentor">
    <div class="flex-1">
      <div class="flex items-center space-x-2 mb-1">
        <h3 class="heading-md text-gray-900">Ahmet Kaya</h3>
        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
          ⭐ 4.9
        </span>
        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
          ✓ Doğrulandı
        </span>
      </div>
      <p class="body-md text-gray-700 font-medium">Senior Portfolio Manager</p>
      <p class="body-sm text-gray-500">Garanti BBVA</p>
    </div>
  </div>
  
  <!-- Etiketler -->
  <div class="flex flex-wrap gap-2 mb-4">
    <span class="tag">🏷️ Borsa & Yatırım</span>
    <span class="tag">💰 1500 TL/saat</span>
    <span class="tag">⏰ 8 yıl deneyim</span>
  </div>
  
  <!-- Neden Önerildi -->
  <div class="bg-blue-50 rounded-lg p-3 mb-4">
    <p class="label-sm text-blue-900 mb-2">💡 Neden önerildi:</p>
    <ul class="space-y-1">
      <li class="body-sm text-blue-800">✅ Kategori eşleşti</li>
      <li class="body-sm text-blue-800">✅ Fiyat uygun</li>
      <li class="body-sm text-blue-800">✅ 4.9/5 puan (87 değerlendirme)</li>
    </ul>
  </div>
  
  <!-- Müsaitlik -->
  <div class="flex justify-between items-center text-sm text-gray-600 mb-4">
    <span>📅 Bu hafta 3 slot müsait</span>
    <span>⚡ 2 saat içinde yanıt</span>
  </div>
  
  <!-- CTA Button -->
  <button class="btn-primary w-full">🎯 Seans Al</button>
</div>
```

#### CSS Sınıfları:
```css
.btn-primary {
  @apply bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold 
         hover:bg-blue-700 hover:scale-105 transform transition-all duration-200
         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
}

.btn-secondary {
  @apply bg-white text-blue-600 border-2 border-blue-600 px-6 py-3 rounded-xl font-semibold
         hover:bg-blue-50 transition-all duration-200
         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
}

.tag {
  @apply inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
         bg-gray-100 text-gray-700;
}

.mentor-card {
  @apply bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300;
}
```

---

## Bölüm 6 — Microcopy & UX Hints (Kısa)

### 6.1 Progress Indicator
```html
<div class="progress-indicator">
  <div class="flex items-center justify-between mb-2">
    <span class="text-sm font-medium text-gray-600">Adım 2/4</span>
    <span class="text-sm text-gray-500">50% tamamlandı</span>
  </div>
  <div class="w-full bg-gray-200 rounded-full h-2">
    <div class="bg-blue-600 h-2 rounded-full transition-all duration-500" style="width: 50%"></div>
  </div>
</div>
```

### 6.2 Tooltip Açıklamaları
```javascript
const tooltips = {
  "q1_category": "Bu sayede sana uygun mentorları filtreleyebiliriz",
  "q2_goal_level": "Hedef seviyene göre mentor deneyimi eşleştiriliyor", 
  "q3_budget_time": "Bütçe ve zaman uyumlu mentorlar öncelikli gösterilir",
  "q4_preferences": "Bu bilgiler daha kişisel öneriler için kullanılır"
}
```

### 6.3 "Atla" Seçeneği UX
```html
<div class="skip-option text-center mt-6">
  <button class="text-gray-500 hover:text-gray-700 text-sm underline">
    Bu soruyu atla
  </button>
  <p class="text-xs text-gray-400 mt-1">
    ⚠️ Atlarsan özelleştirilmiş eşleştirme azalır
  </p>
</div>
```

### 6.4 "Neden Önerildi" Bileşeni
```html
<div class="recommendation-reason bg-blue-50 rounded-lg p-3">
  <h4 class="text-sm font-medium text-blue-900 mb-2">💡 Neden önerildi:</h4>
  <ul class="space-y-1">
    <li class="text-sm text-blue-800 flex items-center">
      <span class="w-4 h-4 text-green-500 mr-2">✅</span>
      Kategori eşleşti (Borsa & Yatırım)
    </li>
    <li class="text-sm text-blue-800 flex items-center">
      <span class="w-4 h-4 text-green-500 mr-2">✅</span>
      Fiyat uygun (1500 TL, bütçeniz: 1000-2000 TL)
    </li>
    <li class="text-sm text-blue-800 flex items-center">
      <span class="w-4 h-4 text-green-500 mr-2">✅</span>
      4.9/5 puan (87 değerlendirme)
    </li>
  </ul>
</div>
```

### 6.5 Loading States
```html
<!-- Onboarding Loading -->
<div class="loading-state text-center py-8">
  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
  <p class="text-gray-600">Sana uygun mentorlar aranıyor...</p>
</div>

<!-- Mentor Card Skeleton -->
<div class="mentor-card-skeleton animate-pulse">
  <div class="flex items-start space-x-4 mb-4">
    <div class="w-16 h-16 bg-gray-200 rounded-full"></div>
    <div class="flex-1">
      <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div class="h-3 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
  <div class="space-y-2">
    <div class="h-3 bg-gray-200 rounded"></div>
    <div class="h-3 bg-gray-200 rounded w-5/6"></div>
  </div>
</div>
```

### 6.6 Error States
```html
<!-- No Results -->
<div class="no-results text-center py-12">
  <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
    <span class="text-2xl">🔍</span>
  </div>
  <h3 class="text-lg font-semibold text-gray-900 mb-2">Uygun mentor bulunamadı</h3>
  <p class="text-gray-600 mb-4">Arama kriterlerinizi genişletmeyi deneyin</p>
  <button class="btn-secondary">Filtreleri Temizle</button>
</div>

<!-- Network Error -->
<div class="error-state bg-red-50 border border-red-200 rounded-lg p-4">
  <div class="flex items-center">
    <span class="text-red-500 mr-2">⚠️</span>
    <p class="text-red-800">Bağlantı hatası. Lütfen tekrar deneyin.</p>
  </div>
</div>
```

---

## Bölüm 7 — Acceptance Kriterleri (Must-Have)

### 7.1 Onboarding Kriterleri
- ✅ **Progressive Disclosure**: 3-4 soru kademeli olarak açılıyor
- ✅ **Atla Seçeneği**: Her soruda "atla" butonu mevcut
- ✅ **Progress Indicator**: Adım göstergesi ve yüzde tamamlanma
- ✅ **Animasyonlar**: Soru geçişlerinde fade-in/slide-up efektleri
- ✅ **Tooltip Açıklamaları**: Her soruda "neden soruyoruz" bilgisi
- ✅ **Responsive**: Mobil/tablet/desktop uyumlu
- ✅ **Validation**: Zorunlu alanlar için form validasyonu

### 7.2 API Kriterleri
- ✅ **POST /onboarding/answers**: Cevapları kaydediyor
- ✅ **GET /matching/suggestions**: En az 5 mentor döndürüyor
- ✅ **Reason Field**: Her mentorda "neden önerildi" açıklaması
- ✅ **Score Calculation**: 0-1 arası normalize edilmiş skor
- ✅ **Error Handling**: API hataları için uygun response kodları
- ✅ **Rate Limiting**: Dakikada maksimum 60 request

### 7.3 Mentee Page Kriterleri
- ✅ **Single Page Layout**: Tek sayfada tüm önemli bilgiler
- ✅ **Mentor Carousel**: Önerilen mentorlar carousel formatında
- ✅ **Filter System**: Fiyat, şehir, dil, tür filtreleri
- ✅ **Profile Update**: Kısa profil düzenleme widget'ı
- ✅ **Quick Actions**: Gelecek seans için hızlı işlemler
- ✅ **Campaign Banner**: Askıda mentörlük/kampanya alanı

### 7.4 Contact Gating Kriterleri
- ✅ **Contact Hidden**: Mentor iletişim bilgileri gizli
- ✅ **Reveal Condition**: İlk seans rezervasyonu sonrası açılıyor
- ✅ **Gating Message**: "Seans rezervasyonu sonrası görünür" uyarısı
- ✅ **Progressive Reveal**: Önce temel bilgi, sonra iletişim
- ✅ **Security**: Telefon/email hash'lenerek saklanıyor

### 7.5 KVKK Kriterleri
- ✅ **Consent Checkbox**: Veri işleme rızası zorunlu
- ✅ **Marketing Opt-in**: Pazarlama rızası opsiyonel
- ✅ **Data Erasure**: Kullanıcı verisini silme endpoint'i
- ✅ **Retention Policy**: Veri saklama süreleri belirtilmiş
- ✅ **Privacy Policy**: KVKV metni erişilebilir
- ✅ **Audit Trail**: Rıza değişiklikleri loglanıyor

### 7.6 Performance Kriterleri
- ✅ **Page Load**: İlk yükleme < 3 saniye
- ✅ **API Response**: Matching API < 2 saniye
- ✅ **Image Optimization**: Avatar'lar WebP formatında
- ✅ **Lazy Loading**: Mentor kartları lazy load
- ✅ **Caching**: API response'ları 5 dakika cache
- ✅ **Bundle Size**: JavaScript bundle < 500KB

---

## Bölüm 8 — Test Senaryoları (Örnek)

### 8.1 Onboarding Test Senaryoları

#### Test Case 1: Tam Onboarding Akışı
```
Senaryo: Kullanıcı tüm soruları yanıtlıyor
Adımlar:
1. Soru 1: "Borsa & Yatırım" seçiliyor
2. Soru 2: "Somut Hedef" seçiliyor  
3. Soru 3: Bütçe "1000-2000 TL", Zaman "Hafta içi akşam" seçiliyor
4. Soru 4: Mentor tipi "Practitioner", Hedef "Portföy yönetimi öğrenmek" yazılıyor

Beklenen Sonuç:
- Progress bar %100 oluyor
- POST /onboarding/answers başarılı
- Matching sayfasına yönlendiriliyor
- Personalization level: "high"
```

#### Test Case 2: Soru Atlama
```
Senaryo: Kullanıcı 2. soruyu atlıyor
Adımlar:
1. Soru 1: "Kariyer / İş" seçiliyor
2. Soru 2: "Atla" butonuna tıklanıyor
3. Soru 3: Bütçe ve zaman seçiliyor

Beklenen Sonuç:
- Soru 2 boş olarak kaydediliyor
- Uyarı mesajı: "Özelleştirilmiş eşleştirme azalır"
- Matching yine çalışıyor ama generic sonuçlar
- Personalization level: "medium"
```

#### Test Case 3: Validation Hatası
```
Senaryo: Zorunlu alan boş bırakılıyor
Adımlar:
1. Soru 1: Hiçbir seçenek işaretlenmeden "Devam Et" tıklanıyor

Beklenen Sonuç:
- Hata mesajı: "Lütfen bir seçenek belirtin"
- Soru 2'ye geçiş yapılmıyor
- Buton disabled kalıyor
```

### 8.2 Matching Algorithm Test Senaryoları

#### Test Case 4: Kategori Eşleşmesi
```
Senaryo: Kullanıcı "Borsa & Yatırım" kategorisi seçiyor
Girdi:
- category: "Borsa & Yatırım"
- budget_range: [500, 1000]

Beklenen Sonuç:
- Dönen mentorların tags'inde "Borsa & Yatırım" bulunmalı
- Score hesaplamasında category_match > 0
- Reason'da "Kategori eşleşti" bulunmalı
```

#### Test Case 5: Bütçe Filtresi
```
Senaryo: Kullanıcı 500-1000 TL bütçe belirtiyor
Girdi:
- budget_range: [500, 1000]

Beklenen Sonuç:
- Dönen mentorların price'ı 375-1250 TL arasında (±25% tolerans)
- VEYA mentor.has_discount = true
- Reason'da "Fiyat uygun" veya "İlk seans indirimi" bulunmalı
```

#### Test Case 6: Boş Sonuç
```
Senaryo: Çok spesifik kriterler girildiğinde sonuç bulunamıyor
Girdi:
- category: "Çok Nadir Kategori"
- budget_range: [1, 10]

Beklenen Sonuç:
- suggestions: [] (boş array)
- total_matches: 0
- UI'da "Uygun mentor bulunamadı" mesajı
```

### 8.3 Contact Gating Test Senaryoları

#### Test Case 7: İletişim Bilgisi Gizleme
```
Senaryo: Kullanıcı mentor profilini görüntülüyor (seans rezervasyonu yapmadan)
Adımlar:
1. GET /mentor/m123 çağrılıyor
2. Mentor profili açılıyor

Beklenen Sonuç:
- mentor.contact_gated: true
- Telefon/email alanları gösterilmiyor
- "Seans rezervasyonu sonrası görünür" mesajı var
- WhatsApp/LinkedIn linkleri gizli
```

#### Test Case 8: İletişim Bilgisi Açılması
```
Senaryo: Kullanıcı seans rezervasyonu yapıyor
Adımlar:
1. POST /booking/create başarılı
2. GET /mentor/m123 tekrar çağrılıyor

Beklenen Sonuç:
- mentor.contact_gated: false
- Telefon/email alanları görünür
- WhatsApp butonu aktif
- "İletişim bilgileri açıldı" bildirimi
```

### 8.4 KVKK Compliance Test Senaryoları

#### Test Case 9: Rıza Onayı
```
Senaryo: Kullanıcı veri işleme rızasını vermiyor
Adımlar:
1. Onboarding formunda consent checkbox işaretlenmiyor
2. "Devam Et" butonuna tıklanıyor

Beklenen Sonuç:
- Form submit edilmiyor
- Hata mesajı: "Veri işleme rızası gereklidir"
- Checkbox kırmızı border alıyor
```

#### Test Case 10: Veri Silme
```
Senaryo: Kullanıcı verilerini silmek istiyor
Adımlar:
1. DELETE /user/data-erasure çağrılıyor
2. Confirmation: true gönderiliyor

Beklenen Sonuç:
- Kullanıcı verileri silinir
- Anonymized data kalır (analytics için)
- Email confirmation gönderilir
- 30 gün içinde tam silme tamamlanır
```

### 8.5 Performance Test Senaryoları

#### Test Case 11: Yükleme Performansı
```
Senaryo: Mentee page ilk kez yükleniyor
Ölçümler:
- First Contentful Paint (FCP) < 1.5s
- Largest Contentful Paint (LCP) < 2.5s  
- Cumulative Layout Shift (CLS) < 0.1
- First Input Delay (FID) < 100ms

Test Ortamı:
- 3G bağlantı simülasyonu
- Mobile device (iPhone 12)
```

#### Test Case 12: API Response Time
```
Senaryo: Matching API çağrılıyor
Ölçümler:
- GET /matching/suggestions response time < 2s
- 95th percentile < 3s
- Error rate < 1%

Load Test:
- 100 concurrent users
- 10 dakika süre
- Ramp-up: 30 saniye
```

---

## Bölüm 9 — Ek İstekler / Opsiyonel

### 9.1 Analytics Implementation

#### Onboarding Conversion Funnel
```javascript
// Google Analytics 4 Events
gtag('event', 'onboarding_started', {
  'event_category': 'onboarding',
  'event_label': 'question_1_viewed'
});

gtag('event', 'onboarding_step_completed', {
  'event_category': 'onboarding',
  'step_number': 1,
  'question_id': 'q1_category',
  'answer': 'Borsa & Yatırım'
});

gtag('event', 'onboarding_completed', {
  'event_category': 'onboarding',
  'total_questions': 4,
  'questions_answered': 3,
  'completion_rate': 0.75
});

// Custom Metrics
const funnelMetrics = {
  question1_completion_rate: 0.85,
  question2_completion_rate: 0.72,
  question3_completion_rate: 0.68,
  question4_completion_rate: 0.45,
  suggestion_click_through_rate: 0.34,
  booking_conversion_rate: 0.12
};
```

#### Dashboard Metrikleri
```sql
-- Onboarding Funnel Query
SELECT 
  step_name,
  COUNT(*) as users_reached,
  COUNT(*) / LAG(COUNT(*)) OVER (ORDER BY step_order) as conversion_rate
FROM onboarding_events 
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY step_name, step_order
ORDER BY step_order;

-- Matching Performance
SELECT 
  AVG(suggestion_count) as avg_suggestions,
  AVG(click_through_rate) as avg_ctr,
  AVG(booking_rate) as avg_booking_rate
FROM matching_sessions
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY);
```

### 9.2 A/B Testing Framework

#### Test Configuration
```javascript
const abTests = {
  onboarding_flow_v2: {
    name: "Onboarding Flow Optimization",
    variants: {
      control: {
        weight: 50,
        questions: ["q1_category", "q2_goal_level", "q3_budget_time", "q4_preferences"]
      },
      variant_a: {
        weight: 25, 
        questions: ["q1_category_v2", "q2_timeline", "q3_budget_time"]
      },
      variant_b: {
        weight: 25,
        questions: ["q1_category", "q2_goal_level", "q3_budget_time_v2", "q4_communication"]
      }
    },
    success_metric: "onboarding_completion_rate",
    secondary_metrics: ["suggestion_ctr", "booking_rate"]
  }
};

// Variant Assignment
function assignVariant(userId, testName) {
  const hash = hashUserId(userId + testName);
  const tests = abTests[testName];
  
  let cumulativeWeight = 0;
  for (const [variant, config] of Object.entries(tests.variants)) {
    cumulativeWeight += config.weight;
    if (hash <= cumulativeWeight) {
      return variant;
    }
  }
  return 'control';
}
```

#### Test Results Analysis
```javascript
// Statistical Significance Calculator
function calculateSignificance(controlRate, variantRate, controlSize, variantSize) {
  const pooledRate = (controlRate * controlSize + variantRate * variantSize) / (controlSize + variantSize);
  const standardError = Math.sqrt(pooledRate * (1 - pooledRate) * (1/controlSize + 1/variantSize));
  const zScore = (variantRate - controlRate) / standardError;
  const pValue = 2 * (1 - normalCDF(Math.abs(zScore)));
  
  return {
    zScore,
    pValue,
    isSignificant: pValue < 0.05,
    confidenceLevel: (1 - pValue) * 100
  };
}
```

### 9.3 Accessibility (WCAG AA) Implementation

#### Keyboard Navigation
```javascript
// Focus Management
class OnboardingFlow {
  constructor() {
    this.currentStep = 1;
    this.focusableElements = [];
  }
  
  nextStep() {
    this.currentStep++;
    this.updateFocusableElements();
    this.focusFirstElement();
  }
  
  updateFocusableElements() {
    const selector = 'button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
    this.focusableElements = Array.from(document.querySelectorAll(selector));
  }
  
  focusFirstElement() {
    if (this.focusableElements.length > 0) {
      this.focusableElements[0].focus();
    }
  }
  
  handleKeyDown(event) {
    if (event.key === 'Tab') {
      this.handleTabNavigation(event);
    } else if (event.key === 'Escape') {
      this.handleEscape();
    }
  }
}
```

#### Screen Reader Support
```html
<!-- ARIA Labels ve Descriptions -->
<div role="progressbar" 
     aria-valuenow="2" 
     aria-valuemin="1" 
     aria-valuemax="4" 
     aria-label="Onboarding progress: step 2 of 4">
  <div class="progress-bar" style="width: 50%"></div>
</div>

<fieldset>
  <legend>Ne için destek istiyorsun?</legend>
  <div role="radiogroup" aria-labelledby="category-question">
    <input type="radio" id="category-investment" name="category" value="investment">
    <label for="category-investment">Borsa & Yatırım</label>
  </div>
</fieldset>

<!-- Live Regions -->
<div aria-live="polite" aria-atomic="true" class="sr-only">
  <span id="status-message"></span>
</div>
```

#### Color Contrast & Visual Design
```css
/* WCAG AA Compliant Colors */
:root {
  --text-primary: #1f2937;     /* Contrast ratio: 16.94:1 */
  --text-secondary: #4b5563;   /* Contrast ratio: 7.07:1 */
  --link-color: #1d4ed8;       /* Contrast ratio: 8.59:1 */
  --error-color: #dc2626;      /* Contrast ratio: 5.74:1 */
  --success-color: #059669;    /* Contrast ratio: 4.56:1 */
}

/* Focus Indicators */
.focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
  border-radius: 4px;
}

/* High Contrast Mode Support */
@media (prefers-contrast: high) {
  :root {
    --text-primary: #000000;
    --background: #ffffff;
    --border-color: #000000;
  }
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 9.4 Advanced Features (Future Roadmap)

#### AI-Powered Matching
```python
# Machine Learning Model için Feature Engineering
def extract_features(mentee_profile, mentor_profile):
    features = {
        # Categorical Features
        'category_match': jaccard_similarity(mentee.category, mentor.tags),
        'goal_level_match': goal_level_compatibility(mentee.goal_level, mentor.experience_level),
        
        # Numerical Features  
        'price_ratio': mentor.price / mentee.budget_max,
        'experience_ratio': mentor.years_experience / mentee.desired_experience,
        'rating_score': mentor.rating / 5.0,
        
        # Text Features (TF-IDF)
        'bio_similarity': cosine_similarity(
            tfidf_vectorizer.transform([mentee.goals_text]),
            tfidf_vectorizer.transform([mentor.bio])
        ),
        
        # Behavioral Features
        'response_time_score': 1 / (mentor.avg_response_hours + 1),
        'success_rate': mentor.successful_sessions / mentor.total_sessions,
        
        # Temporal Features
        'availability_overlap': calculate_time_overlap(mentee.availability, mentor.slots),
        'timezone_compatibility': timezone_distance(mentee.timezone, mentor.timezone)
    }
    return features

# XGBoost Model Training
import xgboost as xgb

def train_matching_model(training_data):
    X = np.array([extract_features(row['mentee'], row['mentor']) for row in training_data])
    y = np.array([row['success_score'] for row in training_data])  # 0-1 success metric
    
    model = xgb.XGBRegressor(
        n_estimators=100,
        max_depth=6,
        learning_rate=0.1,
        random_state=42
    )
    
    model.fit(X, y)
    return model
```

#### Real-time Notifications
```javascript
// WebSocket Implementation
class NotificationService {
  constructor() {
    this.ws = new WebSocket('wss://api.mentorhub.com/notifications');
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    this.ws.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      this.handleNotification(notification);
    };
  }
  
  handleNotification(notification) {
    switch (notification.type) {
      case 'mentor_response':
        this.showToast(`${notification.mentor_name} mesajınızı yanıtladı`, 'info');
        this.updateUnreadCount();
        break;
        
      case 'session_reminder':
        this.showToast(`15 dakika sonra ${notification.mentor_name} ile seansınız`, 'warning');
        this.scheduleReminderActions(notification);
        break;
        
      case 'new_match':
        this.showToast('Size uygun yeni bir mentor bulundu!', 'success');
        this.updateMatchesList();
        break;
    }
  }
  
  showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 5000);
  }
}
```

#### Advanced Analytics Dashboard
```javascript
// Mentor Performance Analytics
const mentorAnalytics = {
  // Conversion Funnel
  profileViews: 1250,
  sessionRequests: 340,
  sessionBookings: 156,
  completedSessions: 142,
  
  // Performance Metrics
  averageRating: 4.8,
  responseTime: '2.3 hours',
  cancellationRate: 0.08,
  rebookingRate: 0.67,
  
  // Revenue Analytics
  totalEarnings: 234000, // TL
  averageSessionPrice: 1650,
  monthlyGrowth: 0.23,
  
  // Engagement Metrics
  messageResponseRate: 0.94,
  profileCompleteness: 0.89,
  availabilityUtilization: 0.76
};

// Mentee Journey Analytics
const menteeAnalytics = {
  // Onboarding Funnel
  signups: 2340,
  onboardingStarted: 1980,
  onboardingCompleted: 1456,
  firstSessionBooked: 567,
  
  // Engagement Metrics
  averageSessionsPerUser: 3.2,
  retentionRate30Days: 0.45,
  npsScore: 8.2,
  
  // Goal Achievement
  goalCompletionRate: 0.73,
  averageTimeToGoal: 45, // days
  satisfactionScore: 4.6
};
```

---

## Sonuç ve Teslim Özeti

Bu dokümantasyon, MentorHub platformu için kapsamlı bir **Progressive Onboarding & Smart Matching** sistemi tasarımını içermektedir. 

### ✅ Tamamlanan Bölümler:
1. **Rakip İncelemesi** - 5 platform analizi ve best practice'ler
2. **Progressive Onboarding** - 3-4 soruluk kademeli anket sistemi
3. **Eşleştirme Algoritması** - Skorlu, açıklanabilir matching sistemi
4. **API & Dataflow** - Endpoint'ler ve veri akışı
5. **Mentee Page** - Minimal, tek sayfa tasarım
6. **Microcopy & UX** - Kullanıcı deneyimi detayları
7. **Acceptance Kriterleri** - Must-have özellikler listesi
8. **Test Senaryoları** - Kapsamlı test case'leri
9. **Ek Özellikler** - Analytics, A/B testing, accessibility

### 🎯 Temel Özellikler:
- **3-4 soruluk progressive onboarding** (atla seçeneği ile)
- **Explainable AI matching** (neden önerildi açıklaması)
- **Contact gating** (seans sonrası iletişim bilgisi açılması)
- **KVKK compliant** veri işleme
- **Responsive design** (mobil-first)
- **Performance optimized** (< 3s yükleme)

### 📊 Teknik Spesifikasyonlar:
- **API Response Time**: < 2 saniye
- **Matching Accuracy**: 7 faktörlü skorlama sistemi
- **WCAG AA Compliance**: Erişilebilirlik standartları
- **A/B Testing Ready**: Varyant test altyapısı

Bu dokümantasyon, development team'in implementation için ihtiyaç duyacağı tüm teknik detayları, UX akışlarını ve kabul kriterlerini içermektedir.