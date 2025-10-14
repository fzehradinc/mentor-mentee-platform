# MentorHub - KVKK/GDPR Uyumluluk ve Test Senaryoları Dokümantasyonu

## 📋 İçindekiler
1. [KVKK/GDPR Uyumluluk Gereklilikleri](#kvkk-gdpr-uyumluluk-gereklilikleri)
2. [Teknik Implementasyon](#teknik-implementasyon)
3. [Test Senaryoları](#test-senaryoları)
4. [API Güvenlik Gereklilikleri](#api-güvenlik-gereklilikleri)
5. [Veri Koruma Önlemleri](#veri-koruma-önlemleri)
6. [Kabul Kriterleri](#kabul-kriterleri)

---

## 🔒 KVKK/GDPR Uyumluluk Gereklilikleri

### 1. Açık Rıza (Explicit Consent)

#### 1.1 Zorunlu Rıza Checkbox'ı
```typescript
// Onboarding Step 5 - KVKK Consent
interface ConsentData {
  dataProcessingConsent: boolean;    // Zorunlu
  marketingConsent: boolean;         // İsteğe bağlı
  consentTimestamp: string;
  consentVersion: string;
}
```

**Gereklilikler:**
- ✅ Onboarding sürecinin 5. adımında zorunlu checkbox
- ✅ "Verilerimin KVKK'ya uygun şekilde işlenmesini onaylıyorum" metni
- ✅ Checkbox işaretlenmeden veri kaydı yapılamaz
- ✅ Pazarlama rızası ayrı, opsiyonel checkbox
- ✅ Rıza tarihi ve versiyonu kaydedilir

#### 1.2 Rıza Geri Çekme
```typescript
// Consent withdrawal endpoint
DELETE /user/consent/{userId}
{
  "consentType": "data_processing" | "marketing",
  "withdrawalReason": string,
  "timestamp": string
}
```

### 2. Veri Saklama ve Silme

#### 2.1 Saklama Süreleri
- **Onboarding Cevapları**: Maksimum 12 ay
- **Kullanıcı Profil Bilgileri**: Hesap aktif olduğu sürece
- **Seans Geçmişi**: 5 yıl (muhasebe gerekliliği)
- **Log Kayıtları**: 2 yıl

#### 2.2 Otomatik Silme Sistemi
```sql
-- Automated data cleanup job (runs daily)
DELETE FROM user_onboarding_data 
WHERE created_at < DATE_SUB(NOW(), INTERVAL 12 MONTH)
AND user_consent_active = false;

DELETE FROM user_profiles 
WHERE last_activity < DATE_SUB(NOW(), INTERVAL 24 MONTH)
AND deletion_requested = true;
```

#### 2.3 Kullanıcı Talep Üzerine Silme
```typescript
// Hard delete implementation
async function deleteUserData(userId: string): Promise<void> {
  // 1. Delete personal data
  await db.users.delete({ id: userId });
  await db.onboarding_data.delete({ userId });
  await db.user_preferences.delete({ userId });
  
  // 2. Anonymize session data
  await db.sessions.update(
    { menteeId: userId },
    { menteeId: 'DELETED_USER', menteeName: 'Deleted User' }
  );
  
  // 3. Clear cached data
  await redis.del(`user:${userId}:*`);
  
  // 4. Log deletion
  await auditLog.create({
    action: 'USER_DATA_DELETED',
    userId,
    timestamp: new Date(),
    compliance: 'KVKK_ERASURE_RIGHT'
  });
}
```

### 3. Hassas Veri Koruması

#### 3.1 Veri Şifreleme
```typescript
// Personal data encryption
import crypto from 'crypto';

class DataProtection {
  private static readonly SALT_ROUNDS = 12;
  private static readonly ENCRYPTION_KEY = process.env.DATA_ENCRYPTION_KEY;

  static hashPersonalData(data: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(data, salt, 10000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
  }

  static encryptSensitiveData(data: string): string {
    const cipher = crypto.createCipher('aes-256-cbc', this.ENCRYPTION_KEY);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }
}

// Usage example
const user = {
  id: generateId(),
  name: userData.name,
  email: DataProtection.hashPersonalData(userData.email),
  phone: DataProtection.encryptSensitiveData(userData.phone),
  createdAt: new Date()
};
```

#### 3.2 Contact Reveal Gating
```typescript
// Mentor contact information gating
interface MentorProfile {
  id: string;
  name: string;
  title: string;
  bio: string;
  // Contact info only revealed after booking
  contactGated: boolean;
  contactRevealCondition: 'first_session_booked' | 'payment_completed';
  
  // Gated fields
  email?: string;
  phone?: string;
  socialLinks?: {
    linkedin?: string;
    website?: string;
  };
}

// Contact reveal logic
function revealContactInfo(mentorId: string, userId: string): boolean {
  const hasBookedSession = checkUserBookings(userId, mentorId);
  const hasCompletedPayment = checkPaymentStatus(userId, mentorId);
  
  return hasBookedSession && hasCompletedPayment;
}
```

### 4. Kullanıcı Hakları

#### 4.1 Veri Erişim Hakkı (Data Portability)
```typescript
// GET /user/data-export/{userId}
async function exportUserData(userId: string): Promise<UserDataExport> {
  const userData = await db.users.findOne({ id: userId });
  const onboardingData = await db.onboarding_data.findOne({ userId });
  const sessions = await db.sessions.find({ menteeId: userId });
  const consents = await db.user_consents.find({ userId });

  return {
    exportDate: new Date().toISOString(),
    userId,
    personalData: {
      name: userData.name,
      email: '[HASHED]', // Don't expose hashed values
      role: userData.role,
      createdAt: userData.createdAt
    },
    onboardingData: {
      category: onboardingData.category,
      goalLevel: onboardingData.goalLevel,
      budget: onboardingData.budget,
      preferences: onboardingData.preferences
    },
    sessionHistory: sessions.map(s => ({
      date: s.date,
      mentorName: s.mentorName,
      topic: s.topic,
      status: s.status
    })),
    consentHistory: consents.map(c => ({
      type: c.type,
      granted: c.granted,
      timestamp: c.timestamp,
      version: c.version
    })),
    dataRetention: {
      retentionPeriod: '12 months',
      autoDeleteDate: calculateAutoDeleteDate(userData.lastActivity)
    }
  };
}
```

#### 4.2 Veri Düzeltme Hakkı
```typescript
// PUT /user/data-correction/{userId}
async function correctUserData(userId: string, corrections: DataCorrection[]): Promise<void> {
  for (const correction of corrections) {
    // Validate correction request
    if (!isValidCorrectionField(correction.field)) {
      throw new Error(`Field ${correction.field} cannot be corrected`);
    }

    // Apply correction
    await db.users.update(
      { id: userId },
      { [correction.field]: correction.newValue }
    );

    // Log correction
    await auditLog.create({
      action: 'DATA_CORRECTION',
      userId,
      field: correction.field,
      oldValue: '[REDACTED]',
      newValue: '[REDACTED]',
      timestamp: new Date(),
      compliance: 'KVKK_RECTIFICATION_RIGHT'
    });
  }
}
```

---

## 🧪 Test Senaryoları

### A) Onboarding Akışı Testleri

#### Test ONB-001: Tam Onboarding + KVKK Rızası
```typescript
describe('Complete Onboarding with KVKK Consent', () => {
  it('should save data when consent is provided', async () => {
    // Arrange
    const onboardingData = {
      category: 'Kariyer / İş',
      goalLevel: 'Somut Hedef',
      budget: '1000-2000',
      timeAvailability: 'Hafta sonu',
      mentorType: 'practitioner',
      goalDescription: 'UX alanında kariyer geçişi',
      consent: true,
      marketingConsent: false
    };

    // Act
    const response = await request(app)
      .post('/api/onboarding/answers')
      .send({ userId: 'test-user-1', ...onboardingData })
      .expect(200);

    // Assert
    expect(response.body.success).toBe(true);
    expect(response.body.message).toContain('saved successfully');
    
    // Verify data is actually saved
    const savedData = await db.onboarding_data.findOne({ userId: 'test-user-1' });
    expect(savedData.consent).toBe(true);
    expect(savedData.consentTimestamp).toBeDefined();
  });
});
```

#### Test ONB-002: KVKK Rızası Olmadan Onboarding
```typescript
describe('Onboarding without KVKK Consent', () => {
  it('should reject data when consent is not provided', async () => {
    // Arrange
    const onboardingData = {
      category: 'Kariyer / İş',
      goalLevel: 'Somut Hedef',
      consent: false // No consent provided
    };

    // Act & Assert
    const response = await request(app)
      .post('/api/onboarding/answers')
      .send({ userId: 'test-user-2', ...onboardingData })
      .expect(400);

    expect(response.body.error).toContain('consent required');
    
    // Verify no data is saved
    const savedData = await db.onboarding_data.findOne({ userId: 'test-user-2' });
    expect(savedData).toBeNull();
  });
});
```

### B) Matching Algoritması Testleri

#### Test MAT-001: Bütçe Bazlı Filtreleme
```typescript
describe('Budget-based Mentor Filtering', () => {
  it('should return mentors within ±25% budget range', async () => {
    // Arrange
    const userBudget = { min: 1000, max: 2000 };
    const expectedRange = { min: 750, max: 2500 }; // ±25%

    // Act
    const response = await request(app)
      .get('/api/matching/suggestions')
      .query({ userId: 'test-user-3', budget: '1000-2000' })
      .expect(200);

    // Assert
    const mentors = response.body.suggestions;
    expect(mentors.length).toBeGreaterThanOrEqual(5);
    
    mentors.forEach(mentor => {
      const price = mentor.mentor.price;
      const hasDiscount = mentor.mentor.has_discount;
      
      expect(
        (price >= expectedRange.min && price <= expectedRange.max) || hasDiscount
      ).toBe(true);
    });
  });
});
```

### C) API Güvenlik Testleri

#### Test SEC-001: HTTPS Zorunluluğu
```typescript
describe('HTTPS Only API Access', () => {
  it('should reject HTTP requests', async () => {
    // This test would be run against actual server
    const httpUrl = 'http://localhost:3000/api/onboarding/answers';
    
    try {
      await fetch(httpUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: 'data' })
      });
      
      fail('HTTP request should have been rejected');
    } catch (error) {
      expect(error.message).toContain('HTTPS required');
    }
  });
});
```

#### Test SEC-002: Rate Limiting
```typescript
describe('Rate Limiting Protection', () => {
  it('should limit requests to 20 per minute', async () => {
    const userId = 'rate-limit-test-user';
    const requests = [];

    // Send 25 requests rapidly
    for (let i = 0; i < 25; i++) {
      requests.push(
        request(app)
          .get('/api/matching/suggestions')
          .query({ userId })
      );
    }

    const responses = await Promise.all(requests);
    
    // First 20 should succeed
    responses.slice(0, 20).forEach(response => {
      expect(response.status).toBe(200);
    });
    
    // Remaining 5 should be rate limited
    responses.slice(20).forEach(response => {
      expect(response.status).toBe(429);
      expect(response.body.error).toContain('Too Many Requests');
    });
  });
});
```

### D) UI/UX Testleri

#### Test UI-001: Mentor Kartı Zorunlu Elemanları
```typescript
describe('Mentor Card Required Elements', () => {
  it('should display all required elements in mentor cards', () => {
    // This would be an E2E test using Playwright/Cypress
    cy.visit('/mentee-page');
    
    cy.get('[data-testid="mentor-card"]').each(($card) => {
      // Check required elements
      cy.wrap($card).find('[data-testid="mentor-photo"]').should('exist');
      cy.wrap($card).find('[data-testid="mentor-name"]').should('exist');
      cy.wrap($card).find('[data-testid="mentor-title"]').should('exist');
      cy.wrap($card).find('[data-testid="mentor-tags"]').should('have.length', 3);
      cy.wrap($card).find('[data-testid="mentor-reasons"]').should('have.length', 3);
      cy.wrap($card).find('[data-testid="mentor-rating"]').should('exist');
      cy.wrap($card).find('[data-testid="cta-button"]').should('contain', 'Seans Al');
    });
  });
});
```

### E) KVKK Uyumluluk Testleri

#### Test KVKK-001: Veri İndirme Fonksiyonu
```typescript
describe('Data Download Functionality', () => {
  it('should allow users to download their data', async () => {
    // Arrange
    const userId = 'data-download-test-user';
    await createTestUserData(userId);

    // Act
    const response = await request(app)
      .get(`/api/user/data-export/${userId}`)
      .set('Authorization', `Bearer ${getValidJWT(userId)}`)
      .expect(200);

    // Assert
    expect(response.headers['content-type']).toContain('application/json');
    expect(response.body.userId).toBe(userId);
    expect(response.body.personalData).toBeDefined();
    expect(response.body.onboardingData).toBeDefined();
    expect(response.body.consentHistory).toBeDefined();
    expect(response.body.dataRetention).toBeDefined();
  });
});
```

#### Test KVKK-002: Veri Silme İşlemi
```typescript
describe('User Data Deletion', () => {
  it('should permanently delete user data', async () => {
    // Arrange
    const userId = 'data-deletion-test-user';
    await createTestUserData(userId);

    // Verify data exists before deletion
    const userBefore = await db.users.findOne({ id: userId });
    expect(userBefore).toBeDefined();

    // Act
    const response = await request(app)
      .delete(`/api/user/${userId}`)
      .set('Authorization', `Bearer ${getValidJWT(userId)}`)
      .expect(200);

    // Assert
    expect(response.body.message).toContain('deleted successfully');

    // Verify data is actually deleted
    const userAfter = await db.users.findOne({ id: userId });
    expect(userAfter).toBeNull();

    // Verify related data is anonymized
    const sessions = await db.sessions.find({ menteeId: userId });
    expect(sessions).toHaveLength(0);

    const anonymizedSessions = await db.sessions.find({ menteeId: 'DELETED_USER' });
    expect(anonymizedSessions.length).toBeGreaterThan(0);
  });
});
```

---

## 🔐 API Güvenlik Gereklilikleri

### 1. HTTPS Zorunluluğu
```nginx
# Nginx configuration
server {
    listen 80;
    server_name mentorhub.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name mentorhub.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
}
```

### 2. JWT Authentication
```typescript
// JWT middleware
import jwt from 'jsonwebtoken';

interface JWTPayload {
  userId: string;
  role: 'mentor' | 'mentee';
  iat: number;
  exp: number;
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
```

### 3. Rate Limiting
```typescript
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// General API rate limit
export const apiLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 requests per minute per user
  message: {
    error: 'Too many requests, please try again later.',
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user?.userId || req.ip;
  }
});

// Stricter limit for sensitive operations
export const sensitiveOperationsLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 requests per minute
  message: {
    error: 'Too many sensitive operations, please try again later.',
    retryAfter: 60
  }
});
```

---

## 🛡️ Veri Koruma Önlemleri

### 1. Veri Şifreleme
```typescript
// Database encryption at rest
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    require: true,
    rejectUnauthorized: true
  },
  // Enable encryption at rest
  encrypt: true,
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};
```

### 2. Audit Logging
```typescript
// Comprehensive audit logging
interface AuditLogEntry {
  id: string;
  userId: string;
  action: string;
  resource: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  details?: Record<string, any>;
  complianceTag?: 'KVKK_ACCESS' | 'KVKK_RECTIFICATION' | 'KVKK_ERASURE' | 'KVKK_PORTABILITY';
}

class AuditLogger {
  static async log(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<void> {
    const auditEntry: AuditLogEntry = {
      id: generateId(),
      timestamp: new Date(),
      ...entry
    };

    // Store in secure audit database
    await auditDb.audit_logs.create(auditEntry);

    // For critical operations, also log to external service
    if (entry.complianceTag) {
      await externalAuditService.log(auditEntry);
    }
  }
}

// Usage examples
await AuditLogger.log({
  userId: 'user123',
  action: 'DATA_EXPORT_REQUESTED',
  resource: 'user_data',
  ipAddress: req.ip,
  userAgent: req.get('User-Agent'),
  success: true,
  complianceTag: 'KVKK_PORTABILITY'
});
```

### 3. Veri İhlali Bildirimi
```typescript
// Data breach notification system
interface DataBreachIncident {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedUsers: string[];
  dataTypes: string[];
  discoveredAt: Date;
  containedAt?: Date;
  description: string;
  mitigationSteps: string[];
}

class DataBreachNotifier {
  static async reportBreach(incident: DataBreachIncident): Promise<void> {
    // 1. Log the incident
    await AuditLogger.log({
      userId: 'SYSTEM',
      action: 'DATA_BREACH_DETECTED',
      resource: 'system',
      ipAddress: 'internal',
      userAgent: 'system',
      success: true,
      details: {
        incidentId: incident.id,
        severity: incident.severity,
        affectedUserCount: incident.affectedUsers.length
      }
    });

    // 2. Notify authorities (if required by severity)
    if (incident.severity === 'high' || incident.severity === 'critical') {
      await this.notifyAuthorities(incident);
    }

    // 3. Notify affected users within 72 hours
    await this.scheduleUserNotifications(incident);

    // 4. Prepare public disclosure (if required)
    if (incident.severity === 'critical') {
      await this.preparePublicDisclosure(incident);
    }
  }

  private static async notifyAuthorities(incident: DataBreachIncident): Promise<void> {
    // Notify KVKK (Turkish DPA) within 72 hours
    const notification = {
      incidentId: incident.id,
      organizationName: 'MentorHub',
      contactEmail: 'privacy@mentorhub.com',
      incidentDate: incident.discoveredAt,
      severity: incident.severity,
      affectedDataSubjects: incident.affectedUsers.length,
      dataCategories: incident.dataTypes,
      description: incident.description,
      mitigationMeasures: incident.mitigationSteps
    };

    // Send to KVKK reporting system
    await kvkkReportingService.submitBreach(notification);
  }

  private static async scheduleUserNotifications(incident: DataBreachIncident): Promise<void> {
    const notificationDeadline = new Date(incident.discoveredAt.getTime() + 72 * 60 * 60 * 1000); // 72 hours

    for (const userId of incident.affectedUsers) {
      await notificationQueue.add('breach-notification', {
        userId,
        incidentId: incident.id,
        severity: incident.severity,
        dataTypes: incident.dataTypes,
        mitigationSteps: incident.mitigationSteps
      }, {
        delay: Math.max(0, notificationDeadline.getTime() - Date.now())
      });
    }
  }
}
```

---

## ✅ Kabul Kriterleri

### 1. Onboarding & Consent
- [ ] KVKK rıza checkbox'ı olmadan veri kaydı yapılamaz
- [ ] Rıza geri çekme mekanizması çalışır
- [ ] Pazarlama rızası ayrı ve opsiyonel
- [ ] Rıza geçmişi kaydedilir ve erişilebilir

### 2. Veri Güvenliği
- [ ] Tüm API çağrıları HTTPS üzerinden
- [ ] JWT authentication zorunlu
- [ ] Rate limiting aktif (20 req/min)
- [ ] Hassas veriler şifrelenmiş

### 3. Kullanıcı Hakları
- [ ] Veri indirme fonksiyonu çalışır (JSON format)
- [ ] Veri silme işlemi hard delete yapar
- [ ] Veri düzeltme talebi işlenir
- [ ] Contact gating sistemi aktif

### 4. UI/UX Uyumluluğu
- [ ] Mentor kartlarında tüm zorunlu elemanlar var
- [ ] "Seans Al" CTA her kartta görünür
- [ ] Mobil responsive çalışır
- [ ] Desktop iki sütun layout doğru

### 5. Test Coverage
- [ ] Tüm test senaryoları geçer
- [ ] KVKK compliance testleri başarılı
- [ ] API güvenlik testleri geçer
- [ ] UI/UX testleri başarılı

### 6. Dokümantasyon
- [ ] KVKK politikası hazır
- [ ] Kullanım koşulları güncel
- [ ] Veri işleme bildirimi mevcut
- [ ] İletişim bilgileri erişilebilir

---

## 📞 İletişim ve Destek

**Veri Koruma Sorumlusu:**
- E-posta: privacy@mentorhub.com
- Telefon: +90 212 XXX XX XX
- Adres: MentorHub Veri Koruma Birimi, İstanbul

**Teknik Destek:**
- E-posta: support@mentorhub.com
- Canlı Destek: 7/24 platform üzerinden

**Yasal Uyumluluk:**
- KVKK Başvuru Formu: https://mentorhub.com/kvkk-basvuru
- Veri İhlali Bildirimi: security@mentorhub.com

---

*Bu dokümantasyon KVKK ve GDPR gerekliliklerine uygun olarak hazırlanmıştır. Son güncelleme: 2025*