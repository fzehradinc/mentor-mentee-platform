# MentorHub - Verification & Moderation API Dokümantasyonu

## 🔐 Genel Bakış

MentorHub doğrulama sistemi, mentor güvenilirliğini artırmak için 3 katmanlı doğrulama sunar:
1. **Badge Sistemi** - Otomatik ve manuel rozetler
2. **Şirket Doğrulama** - Kurumsal kimlik onayı
3. **KYC (Know Your Customer)** - Kimlik doğrulama

## 🏆 Badge Sistemi

### Otomatik Rozetler
```javascript
const autoBadgeRules = {
  verified: {
    condition: "KYC tamamlandı",
    icon: "✅",
    color: "blue"
  },
  high_rated: {
    condition: "4.8+ rating ve 20+ seans",
    icon: "⭐",
    color: "yellow"
  },
  workshop_leader: {
    condition: "3+ workshop düzenledi",
    icon: "🎓",
    color: "purple"
  },
  rising_star: {
    condition: "Yeni mentor, 4.7+ rating",
    icon: "🌟",
    color: "green"
  }
};
```

### Manuel Rozetler (Admin Onaylı)
```javascript
const manualBadges = {
  top_mentor: {
    criteria: "4.9+ rating, 100+ seans, özel başarılar",
    review_time: "5-10 iş günü"
  },
  expert: {
    criteria: "10+ yıl deneyim, alanında tanınmış",
    review_time: "3-7 iş günü"
  }
};
```

### Badge Başvuru API
```bash
# Rozet başvurusu
curl -X POST https://api.mentorhub.com/v1/mentors/c9b2e8f4-1234-5678-9abc-def012345678/badges \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "badge_type": "workshop_leader",
    "justification": "3 workshop düzenledim ve 50+ katılımcı eğittim"
  }'

# Response
{
  "message": "Badge application submitted for review",
  "auto_granted": false,
  "review_time": "2-5 business days"
}
```

## 🏢 Şirket Doğrulama

### Doğrulama Süreci
1. **Mentor Başvuru**: Şirket bilgileri + belgeler
2. **Admin İnceleme**: Manuel kontrol (3-7 iş günü)
3. **Onay/Red**: E-posta + platform bildirimi
4. **Badge**: Onaylanan mentorlar "Company Verified" rozeti alır

### Gerekli Belgeler
- **Vergi Numarası**: Şirket tax_id
- **Website**: Kurumsal web sitesi
- **Logo**: Şirket logosu (PNG/JPG, max 2MB)
- **Pozisyon Kanıtı**: LinkedIn profili veya iş sözleşmesi

### API Kullanımı
```bash
# Şirket doğrulama başvurusu
curl -X POST https://api.mentorhub.com/v1/mentors/c9b2e8f4-1234-5678-9abc-def012345678/company/verify \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "Getir",
    "tax_id": "1234567890",
    "website": "https://getir.com",
    "logo_url": "https://cdn.mentorhub.com/company-logos/getir.png",
    "position_proof": "https://linkedin.com/in/ayse-kilic"
  }'

# Response
{
  "verification_id": "comp_123e4567-e89b-12d3-a456-426614174000",
  "message": "Company verification request submitted",
  "review_time": "3-7 business days",
  "status": "pending"
}
```

## 🪪 KYC (Kimlik Doğrulama)

### 3-Step KYC Süreci
1. **Belge Yükleme**: Kimlik ön/arka + selfie
2. **3rd Party İşleme**: Onfido/Mitek entegrasyonu
3. **Sonuç**: 24-48 saat içinde otomatik sonuç

### Gerekli Belgeler
- **Kimlik Ön Yüzü**: TC kimlik kartı ön (JPG/PNG, max 5MB)
- **Kimlik Arka Yüzü**: TC kimlik kartı arka (JPG/PNG, max 5MB)
- **Selfie**: Canlı fotoğraf (JPG/PNG, max 5MB)

### KYC Upload Flow
```bash
# 1. Upload URL'leri al
curl -X POST https://api.mentorhub.com/v1/mentors/c9b2e8f4-1234-5678-9abc-def012345678/kyc/upload-urls \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "documents": [
      {
        "type": "id_front",
        "content_type": "image/jpeg",
        "file_size": 2048576
      },
      {
        "type": "id_back", 
        "content_type": "image/jpeg",
        "file_size": 1948576
      },
      {
        "type": "selfie",
        "content_type": "image/jpeg",
        "file_size": 1548576
      }
    ]
  }'

# Response
{
  "upload_urls": [
    {
      "document_type": "id_front",
      "upload_url": "https://s3.amazonaws.com/bucket/kyc/mentor123/id-front.jpg?X-Amz-Signature=...",
      "expires_at": "2025-01-15T11:00:00Z"
    }
  ],
  "kyc_session_id": "kyc_session_123456"
}

# 2. Dosyaları yükle
curl -X PUT "https://s3.amazonaws.com/bucket/kyc/mentor123/id-front.jpg?X-Amz-Signature=..." \
  -H "Content-Type: image/jpeg" \
  --data-binary @id-front.jpg

# 3. KYC işleme başlat
curl -X POST https://api.mentorhub.com/v1/mentors/c9b2e8f4-1234-5678-9abc-def012345678/kyc/submit \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "kyc_session_id": "kyc_session_123456",
    "uploaded_documents": [
      {
        "type": "id_front",
        "storage_url": "https://s3.amazonaws.com/bucket/kyc/mentor123/id-front.jpg"
      }
    ]
  }'

# Response
{
  "message": "KYC verification started",
  "kyc_id": "kyc_123e4567-e89b-12d3-a456-426614174000",
  "estimated_completion": "24-48 hours",
  "status": "processing"
}
```

## 🔄 Doğrulama Akışı

### 1. Badge Otomasyonu
```sql
-- Otomatik badge kontrolü (trigger ile)
CREATE OR REPLACE FUNCTION auto_grant_badges()
RETURNS TRIGGER AS $$
BEGIN
  -- High Rated badge
  IF NEW.rating_avg >= 4.8 AND NEW.completed_mentees_count >= 20 THEN
    INSERT INTO mentor_badges (mentor_id, badge_type, auto_granted)
    VALUES (NEW.id, 'high_rated', TRUE)
    ON CONFLICT (mentor_id, badge_type) DO NOTHING;
  END IF;
  
  -- Workshop Leader badge
  IF NEW.workshops_count >= 3 THEN
    INSERT INTO mentor_badges (mentor_id, badge_type, auto_granted)
    VALUES (NEW.id, 'workshop_leader', TRUE)
    ON CONFLICT (mentor_id, badge_type) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER mentor_badge_auto_grant
  AFTER UPDATE ON mentors
  FOR EACH ROW
  EXECUTE FUNCTION auto_grant_badges();
```

### 2. KYC Webhook Handler
```javascript
// KYC sonuç webhook'u
app.post('/webhooks/kyc-result', async (req, res) => {
  const { kyc_session_id, status, confidence_score, rejection_reasons } = req.body;
  
  // KYC kaydını güncelle
  await db.kyc_uploads.update(
    { kyc_session_id },
    { 
      status,
      confidence_score,
      rejection_reasons,
      verified_at: status === 'verified' ? new Date() : null
    }
  );
  
  // Mentor KYC durumunu güncelle
  if (status === 'verified') {
    await db.mentors.update(
      { id: mentor_id },
      { kyc_status: 'verified' }
    );
    
    // Verified badge otomatik ver
    await grantBadge(mentor_id, 'verified');
  }
  
  // Mentor'a bildirim gönder
  await sendNotification(mentor_id, {
    type: 'kyc_result',
    status,
    message: status === 'verified' 
      ? 'Kimlik doğrulamanız başarıyla tamamlandı!'
      : 'Kimlik doğrulama başarısız. Lütfen tekrar deneyin.'
  });
  
  res.json({ message: 'KYC result processed' });
});
```

## 🛡️ Güvenlik & Gizlilik

### KYC Belge Güvenliği
- **Şifreleme**: AES-256 ile rest encryption
- **Erişim Kontrolü**: Sadece KYC provider ve admin
- **Otomatik Silme**: 30 gün sonra kalıcı silme
- **Audit Trail**: Tüm erişimler loglanır

### Veri Koruma
```javascript
// KYC belge şifreleme
const encryptKYCDocument = (fileBuffer, mentorId) => {
  const key = crypto.scryptSync(process.env.KYC_SECRET + mentorId, 'salt', 32);
  const cipher = crypto.createCipher('aes-256-cbc', key);
  
  let encrypted = cipher.update(fileBuffer);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  
  return encrypted;
};

// Otomatik silme job
const cleanupExpiredKYC = async () => {
  const expiredRecords = await db.kyc_uploads.find({
    expires_at: { $lt: new Date() }
  });
  
  for (const record of expiredRecords) {
    // Storage'dan dosyaları sil
    await deleteFromStorage(record.id_front_url);
    await deleteFromStorage(record.id_back_url);
    await deleteFromStorage(record.selfie_url);
    
    // DB kaydını sil
    await db.kyc_uploads.delete({ id: record.id });
  }
};
```

## 📊 Admin Moderasyon Paneli

### Bekleyen İncelemeler
- **Company Verifications**: Şirket doğrulama başvuruları
- **Badge Applications**: Manuel rozet başvuruları
- **KYC Appeals**: Reddedilen KYC itirazları
- **Profile Reports**: Kullanıcı şikayetleri

### Moderasyon Aksiyonları
```bash
# Şirket doğrulamayı onayla
curl -X POST https://api.mentorhub.com/v1/admin/company-verifications/comp_123/approve \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{"admin_notes": "Şirket bilgileri doğrulandı"}'

# Şirket doğrulamayı reddet
curl -X POST https://api.mentorhub.com/v1/admin/company-verifications/comp_123/reject \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{"rejection_reason": "Vergi numarası doğrulanamadı"}'
```

## 📈 Doğrulama Metrikleri

### Badge Dağılımı
- **Verified**: %45 mentor
- **High Rated**: %23 mentor
- **Workshop Leader**: %12 mentor
- **Top Mentor**: %5 mentor (seçkin)

### KYC İstatistikleri
- **Başvuru Oranı**: %67 mentor KYC başlatır
- **Başarı Oranı**: %89 KYC onaylanır
- **Ortalama Süre**: 36 saat
- **Red Sebepleri**: %8 belge kalitesi, %3 kimlik uyumsuzluğu

### Şirket Doğrulama
- **Başvuru Oranı**: %34 mentor şirket doğrulama yapar
- **Onay Oranı**: %78 başvuru onaylanır
- **İnceleme Süresi**: 4.2 gün ortalama

## 🔔 Bildirim Sistemi

### Mentor Bildirimleri
```javascript
const notificationTemplates = {
  badge_granted: {
    title: "🎉 Yeni Rozet Kazandınız!",
    message: "{badge_name} rozetiniz profilinize eklendi.",
    action: "Profili Görüntüle"
  },
  company_approved: {
    title: "✅ Şirket Doğrulaması Onaylandı",
    message: "{company_name} doğrulamanız başarıyla tamamlandı.",
    action: "Profili Görüntüle"
  },
  kyc_verified: {
    title: "🪪 Kimlik Doğrulaması Tamamlandı",
    message: "Kimlik doğrulamanız başarıyla tamamlandı. Verified rozeti kazandınız!",
    action: "Profili Görüntüle"
  },
  kyc_rejected: {
    title: "❌ Kimlik Doğrulaması Başarısız",
    message: "Kimlik doğrulama başarısız: {rejection_reason}",
    action: "Tekrar Dene"
  }
};
```

## 🔍 Fraud Detection

### Otomatik Kontroller
- **Duplicate Detection**: Aynı kimlik birden fazla hesap
- **Image Analysis**: Fake/manipulated document detection
- **Behavioral Analysis**: Şüpheli aktivite patterns
- **Cross-Reference**: Şirket bilgileri doğrulama

### Risk Skorlama
```javascript
const calculateRiskScore = (mentor) => {
  let riskScore = 0;
  
  // KYC durumu
  if (!mentor.kyc_verified) riskScore += 0.3;
  
  // Şirket doğrulama
  if (!mentor.company_verified) riskScore += 0.2;
  
  // Profil tamamlanma
  if (mentor.profile_completion < 0.8) riskScore += 0.2;
  
  // Rating anomalisi
  if (mentor.rating_avg > 4.9 && mentor.total_sessions < 10) riskScore += 0.3;
  
  return Math.min(riskScore, 1.0);
};
```

## 🔧 3rd Party Entegrasyonlar

### KYC Provider (Onfido)
```javascript
const onfidoConfig = {
  apiKey: process.env.ONFIDO_API_KEY,
  webhookToken: process.env.ONFIDO_WEBHOOK_TOKEN,
  baseUrl: 'https://api.onfido.com/v3',
  
  // Document types
  supportedDocuments: ['passport', 'driving_licence', 'national_identity_card'],
  
  // Check types
  checks: ['document', 'facial_similarity'],
  
  // Webhook events
  webhookEvents: ['check.completed', 'check.withdrawn']
};

// KYC check başlatma
const startKYCCheck = async (mentorId, documents) => {
  const applicant = await onfido.applicant.create({
    first_name: mentor.first_name,
    last_name: mentor.last_name,
    email: mentor.email
  });
  
  const check = await onfido.check.create({
    applicant_id: applicant.id,
    report_names: ['document', 'facial_similarity'],
    document_ids: documents.map(doc => doc.id)
  });
  
  return check.id;
};
```

### Company Verification (External APIs)
```javascript
// Vergi numarası doğrulama
const verifyTaxId = async (taxId, companyName) => {
  const response = await fetch(`https://api.vergino.com/verify`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.VERGINO_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      tax_id: taxId,
      company_name: companyName
    })
  });
  
  const result = await response.json();
  return result.is_valid;
};
```

## 📱 UI/UX Akışı

### Verification Step (Wizard 4. Adım)
```
┌─────────────────────────────────────────────────────────────┐
│                    Doğrulama - Adım 4/6                    │
│              "Güvenilir mentorlar daha çok mentee kazanır"  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🏆 Profil Rozetleri                                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ✅ Verified      ⭐ High Rated    🎓 Workshop Leader │   │
│  │ 🌟 Rising Star   👑 Top Mentor    🔬 Expert         │   │
│  └─────────────────────────────────────────────────────┘   │
│  💡 Otomatik kurallarla kazanılır                          │
│                                                             │
│  🏢 Şirket Doğrulama (Opsiyonel)                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Şirket: [Getir                    ] [Logo Yükle]    │   │
│  │ Vergi No: [1234567890            ]                  │   │
│  │ Website: [https://getir.com      ]                  │   │
│  │ Pozisyon Kanıtı: [LinkedIn linki ]                  │   │
│  │                                   [Başvuru Gönder]  │   │
│  └─────────────────────────────────────────────────────┘   │
│  💡 Kurumsal destek, prestij sağlar 🏢                     │
│                                                             │
│  🪪 Kimlik Doğrulama (Opsiyonel)                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Kimlik Ön: [📄 Yükle] Kimlik Arka: [📄 Yükle]      │   │
│  │ Selfie: [📷 Çek]                                    │   │
│  │                                   [KYC Başlat]      │   │
│  └─────────────────────────────────────────────────────┘   │
│  💡 Kimliğin doğrulanırsa profilin öne çıkar 🪪           │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                    [⬅ Geri] [Devam Et ➡]                  │
└─────────────────────────────────────────────────────────────┘
```

## ⚠️ Hata Yönetimi

### Validation Hataları
```json
// Badge uygunluk hatası
{
  "error": {
    "code": "BADGE_NOT_ELIGIBLE",
    "message": "Bu rozet için gerekli koşulları sağlamıyorsunuz",
    "field": "badge_type"
  }
}

// KYC belge hatası
{
  "error": {
    "code": "INVALID_DOCUMENT",
    "message": "Kimlik belgesi net değil veya hasarlı",
    "field": "id_front"
  }
}

// Şirket doğrulama hatası
{
  "error": {
    "code": "COMPANY_NOT_FOUND",
    "message": "Vergi numarası ile şirket bulunamadı",
    "field": "tax_id"
  }
}
```

## 📊 Monitoring & Analytics

### Doğrulama Metrikleri
- Badge başvuru/onay oranları
- KYC tamamlanma süreleri
- Şirket doğrulama başarı oranları
- Fraud detection accuracy

### Performance Tracking
- API response times
- Document processing times
- Admin review times
- User satisfaction scores

---

**API Version**: 1.0.0  
**Last Updated**: 2025-01-15  
**Contact**: verification@mentorhub.com