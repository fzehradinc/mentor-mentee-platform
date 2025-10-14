# MentorHub - Publishing & Analytics API Dokümantasyonu

## 🚀 Genel Bakış

MentorHub yayınlama sistemi, mentor profillerinin SEO optimize edilmiş şekilde yayınlanmasını ve analitik entegrasyonlarını yönetir.

## 📊 Yayınlama Akışı

### 1. Profil Durumları
```
Draft → Review → Published
  ↓       ↓         ↓
Taslak  İnceleme  Yayında
```

### 2. Yayın Süreci
```bash
# 1. Profil durumunu güncelle
curl -X PATCH https://api.mentorhub.com/v1/mentors/c9b2e8f4-1234-5678-9abc-def012345678/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "published",
    "visibility": "public"
  }'

# Response
{
  "success": true,
  "message": "Profile published successfully",
  "public_url": "https://mentorhub.com/mentor/ayse-kilic-ux-designer",
  "seo_preview": {
    "google_snippet": {
      "title": "Ayşe Kılıç - Senior UX Designer | MentorHub",
      "description": "8 yıllık UX deneyimi ile kariyer gelişiminize destek...",
      "url": "mentorhub.com/mentor/ayse-kilic-ux-designer"
    }
  }
}
```

### 3. SEO Optimizasyonu
```bash
# SEO ayarlarını güncelle
curl -X PATCH https://api.mentorhub.com/v1/mentors/c9b2e8f4-1234-5678-9abc-def012345678/seo \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Ayşe Kılıç - Senior UX Designer | MentorHub",
    "description": "8 yıllık UX deneyimi ile kariyer gelişiminize destek. Figma, UX Research ve Portfolio Review konularında uzman mentörlük.",
    "og_image": "https://cdn.mentorhub.com/og-images/ayse-kilic.jpg",
    "slug": "ayse-kilic-ux-designer",
    "keywords": ["UX Design", "Figma", "Portfolio Review", "Kariyer Koçluğu"]
  }'

# Response
{
  "message": "SEO settings updated successfully",
  "seo_preview": {
    "google_snippet": {
      "title": "Ayşe Kılıç - Senior UX Designer | MentorHub",
      "description": "8 yıllık UX deneyimi ile kariyer gelişiminize destek...",
      "url": "mentorhub.com/mentor/ayse-kilic-ux-designer"
    },
    "social_card": {
      "title": "Ayşe Kılıç - Senior UX Designer",
      "description": "8 yıllık UX deneyimi ile kariyer gelişiminize destek...",
      "image": "https://cdn.mentorhub.com/og-images/ayse-kilic.jpg"
    }
  }
}
```

### 4. Analitik Entegrasyonu
```bash
# Analytics ayarlarını güncelle
curl -X PATCH https://api.mentorhub.com/v1/mentors/c9b2e8f4-1234-5678-9abc-def012345678/analytics \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "ga4_id": "G-XXXXXXXXXX",
    "fb_pixel_id": "123456789012345",
    "hotjar_id": "1234567",
    "custom_scripts": [
      {
        "name": "LinkedIn Insight",
        "script": "<!-- LinkedIn tracking code -->",
        "position": "head"
      }
    ]
  }'

# Response
{
  "message": "Analytics settings updated successfully",
  "active_integrations": ["ga4", "hotjar"]
}
```

## 🔍 SEO En İyi Pratikler

### Meta Tag Optimizasyonu
```html
<!-- Otomatik oluşturulan meta taglar -->
<title>Ayşe Kılıç - Senior UX Designer | MentorHub</title>
<meta name="description" content="8 yıllık UX deneyimi ile kariyer gelişiminize destek. Figma, UX Research ve Portfolio Review konularında uzman mentörlük.">
<meta name="keywords" content="UX Design, Figma, Portfolio Review, Kariyer Koçluğu">

<!-- Open Graph -->
<meta property="og:title" content="Ayşe Kılıç - Senior UX Designer | MentorHub">
<meta property="og:description" content="8 yıllık UX deneyimi ile kariyer gelişiminize destek...">
<meta property="og:image" content="https://cdn.mentorhub.com/og-images/ayse-kilic.jpg">
<meta property="og:url" content="https://mentorhub.com/mentor/ayse-kilic-ux-designer">
<meta property="og:type" content="profile">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Ayşe Kılıç - Senior UX Designer | MentorHub">
<meta name="twitter:description" content="8 yıllık UX deneyimi ile kariyer gelişiminize destek...">
<meta name="twitter:image" content="https://cdn.mentorhub.com/og-images/ayse-kilic.jpg">

<!-- Structured Data -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Ayşe Kılıç",
  "jobTitle": "Senior UX Designer",
  "worksFor": {
    "@type": "Organization",
    "name": "Getir"
  },
  "description": "8 yıllık UX deneyimi ile kariyer gelişiminize destek...",
  "image": "https://cdn.mentorhub.com/avatars/ayse-kilic.webp",
  "url": "https://mentorhub.com/mentor/ayse-kilic-ux-designer",
  "sameAs": [
    "https://linkedin.com/in/ayse-kilic"
  ]
}
</script>
```

### URL Slug Kuralları
```javascript
// Slug generation rules
const generateSlug = (displayName, title) => {
  let slug = displayName.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, '-')        // Replace spaces with hyphens
    .trim('-');                  // Remove leading/trailing hyphens
  
  // Add title if slug is too short
  if (slug.length < 3) {
    const titleSlug = title.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
    slug = `${slug}-${titleSlug}`.substring(0, 60);
  }
  
  // Ensure uniqueness
  let finalSlug = slug;
  let counter = 1;
  while (await slugExists(finalSlug)) {
    finalSlug = `${slug}-${counter}`;
    counter++;
  }
  
  return finalSlug;
};
```

## 📈 Analytics Entegrasyonu

### Google Analytics 4
```html
<!-- GA4 Integration -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', {
    page_title: 'Mentor Profile - Ayşe Kılıç',
    page_location: window.location.href,
    custom_map: {
      'custom_parameter_1': 'mentor_id',
      'custom_parameter_2': 'mentor_category'
    }
  });
  
  // Custom events
  gtag('event', 'mentor_profile_view', {
    'mentor_id': 'c9b2e8f4-1234-5678-9abc-def012345678',
    'mentor_category': 'design',
    'mentor_experience': '7_years'
  });
</script>
```

### Facebook Pixel
```html
<!-- Facebook Pixel -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');

fbq('init', '123456789012345');
fbq('track', 'PageView');

// Custom events
fbq('track', 'ViewContent', {
  content_type: 'mentor_profile',
  content_ids: ['c9b2e8f4-1234-5678-9abc-def012345678'],
  content_category: 'design'
});
</script>
```

### Hotjar Integration
```html
<!-- Hotjar Tracking Code -->
<script>
    (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:1234567,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
</script>
```

## 🛡️ Admin Moderasyon Paneli

### Yayın Kuyruğu Yönetimi
```bash
# Bekleyen profilleri listele
curl -X GET https://api.mentorhub.com/v1/admin/publishing/queue?status=pending_review \
  -H "Authorization: Bearer ADMIN_TOKEN"

# Response
{
  "mentors": [
    {
      "id": "c9b2e8f4-1234-5678-9abc-def012345678",
      "display_name": "Ayşe Kılıç",
      "title": "Senior UX Designer",
      "submitted_at": "2025-01-15T10:00:00Z",
      "profile_completion": 0.95,
      "review_priority": "normal"
    }
  ],
  "total": 12,
  "has_more": true
}
```

### Profil Onaylama
```bash
# Profili onayla ve yayınla
curl -X POST https://api.mentorhub.com/v1/admin/publishing/c9b2e8f4-1234-5678-9abc-def012345678/approve \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "custom_slug": "ayse-kilic-ux-expert",
    "admin_notes": "Profil kaliteli, hızlı onay"
  }'

# Response
{
  "success": true,
  "message": "Profile published successfully",
  "public_url": "https://mentorhub.com/mentor/ayse-kilic-ux-expert"
}
```

### Profil Reddetme
```bash
# Profili reddet
curl -X POST https://api.mentorhub.com/v1/admin/publishing/c9b2e8f4-1234-5678-9abc-def012345678/reject \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rejection_reason": "Profil fotoğrafı kalitesi yetersiz",
    "required_changes": ["avatar_url", "long_bio"]
  }'

# Response
{
  "message": "Profile publication rejected",
  "rejection_reason": "Profil fotoğrafı kalitesi yetersiz"
}
```

## 📊 SEO Performance Tracking

### Organik Trafik Analizi
```sql
-- Günlük SEO performansı
SELECT 
  m.display_name,
  m.slug,
  sp.organic_views,
  sp.search_impressions,
  sp.search_clicks,
  sp.avg_position,
  sp.top_keywords
FROM mentors m
JOIN seo_performance sp ON m.id = sp.mentor_id
WHERE sp.date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
ORDER BY sp.organic_views DESC;
```

### Anahtar Kelime Analizi
```javascript
// Top performing keywords
const topKeywords = await db.query(`
  SELECT 
    unnest(top_keywords) as keyword,
    SUM(search_clicks) as total_clicks,
    AVG(avg_position) as avg_position
  FROM seo_performance 
  WHERE date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
  GROUP BY keyword
  ORDER BY total_clicks DESC
  LIMIT 20
`);
```

## 🎯 Frontend Integration

### React SEO Component
```typescript
interface SEOProps {
  mentor: Mentor;
  seoSettings: SEOSettings;
}

const SEOHead: React.FC<SEOProps> = ({ mentor, seoSettings }) => {
  return (
    <Head>
      <title>{seoSettings.title}</title>
      <meta name="description" content={seoSettings.description} />
      <meta name="keywords" content={seoSettings.keywords.join(', ')} />
      
      {/* Open Graph */}
      <meta property="og:title" content={seoSettings.title} />
      <meta property="og:description" content={seoSettings.description} />
      <meta property="og:image" content={seoSettings.og_image} />
      <meta property="og:url" content={`https://mentorhub.com/mentor/${seoSettings.slug}`} />
      <meta property="og:type" content="profile" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoSettings.title} />
      <meta name="twitter:description" content={seoSettings.description} />
      <meta name="twitter:image" content={seoSettings.og_image} />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": mentor.display_name,
            "jobTitle": mentor.title,
            "worksFor": {
              "@type": "Organization",
              "name": mentor.company_name
            },
            "description": mentor.short_bio,
            "image": mentor.avatar_url,
            "url": `https://mentorhub.com/mentor/${seoSettings.slug}`,
            "sameAs": Object.values(mentor.socialLinks || {})
          })
        }}
      />
    </Head>
  );
};
```

### Analytics Hook
```typescript
const useAnalytics = (mentorId: string, analyticsSettings: AnalyticsSettings) => {
  useEffect(() => {
    // GA4 Integration
    if (analyticsSettings.ga4_id) {
      gtag('config', analyticsSettings.ga4_id, {
        page_title: document.title,
        page_location: window.location.href,
        custom_map: {
          'mentor_id': mentorId,
          'mentor_category': mentor.primary_category
        }
      });
      
      gtag('event', 'mentor_profile_view', {
        'mentor_id': mentorId,
        'mentor_category': mentor.primary_category
      });
    }
    
    // Facebook Pixel
    if (analyticsSettings.fb_pixel_id) {
      fbq('track', 'ViewContent', {
        content_type: 'mentor_profile',
        content_ids: [mentorId],
        content_category: mentor.primary_category
      });
    }
    
    // Hotjar
    if (analyticsSettings.hotjar_id) {
      hj('identify', mentorId, {
        mentor_category: mentor.primary_category,
        mentor_experience: mentor.experience_years
      });
    }
  }, [mentorId, analyticsSettings]);
};
```

## 🔔 Bildirim Sistemi

### Yayın Bildirimleri
```javascript
const publishingNotifications = {
  profile_published: {
    title: "🎉 Profiliniz Yayında!",
    message: "Mentor profiliniz başarıyla yayınlandı ve mentee'ler tarafından görülebilir.",
    action_url: "/mentor/dashboard",
    email_template: "profile_published"
  },
  profile_rejected: {
    title: "📝 Profil İnceleme Sonucu",
    message: "Profilinizde bazı düzeltmeler gerekiyor. Detayları görüntüleyin.",
    action_url: "/mentor/profile-wizard",
    email_template: "profile_rejected"
  },
  seo_optimization: {
    title: "🔍 SEO Önerisi",
    message: "Profilinizin görünürlüğünü artırmak için SEO ayarlarını optimize edin.",
    action_url: "/mentor/seo-settings",
    email_template: "seo_tips"
  }
};
```

### E-posta Şablonları
```html
<!-- Profile Published Email -->
<div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
  <h1 style="color: #2563eb;">🎉 Profiliniz Yayında!</h1>
  
  <p>Merhaba {{mentor_name}},</p>
  
  <p>Mentor profiliniz başarıyla yayınlandı! Artık mentee'ler sizi bulabilir ve seanslarınızı rezerve edebilir.</p>
  
  <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3>📊 Profil İstatistikleri</h3>
    <ul>
      <li><strong>Public URL:</strong> <a href="{{public_url}}">{{public_url}}</a></li>
      <li><strong>SEO Skoru:</strong> {{seo_score}}/100</li>
      <li><strong>Profil Tamamlanma:</strong> {{completion_percentage}}%</li>
    </ul>
  </div>
  
  <p>💡 <strong>İpucu:</strong> Profilinizin görünürlüğünü artırmak için:</p>
  <ul>
    <li>SEO ayarlarınızı optimize edin</li>
    <li>Sosyal medyada paylaşın</li>
    <li>Analytics entegrasyonlarını aktifleştirin</li>
  </ul>
  
  <a href="{{dashboard_url}}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
    Dashboard'a Git
  </a>
</div>
```

## 🔧 Teknik Implementasyon

### SSR Meta Tag Injection
```typescript
// Next.js getServerSideProps
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { slug } = params!;
  
  try {
    const response = await fetch(`${API_BASE_URL}/mentors/by-slug/${slug}`);
    const { mentor, seo } = await response.json();
    
    return {
      props: {
        mentor,
        seo,
        meta: {
          title: seo.title,
          description: seo.description,
          ogImage: seo.og_image,
          canonicalUrl: `https://mentorhub.com/mentor/${slug}`
        }
      }
    };
  } catch (error) {
    return {
      notFound: true
    };
  }
};
```

### Analytics Script Injection
```typescript
const AnalyticsProvider: React.FC<{ settings: AnalyticsSettings }> = ({ settings, children }) => {
  useEffect(() => {
    // Inject GA4
    if (settings.ga4_id) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${settings.ga4_id}`;
      document.head.appendChild(script);
      
      const configScript = document.createElement('script');
      configScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${settings.ga4_id}');
      `;
      document.head.appendChild(configScript);
    }
    
    // Inject Facebook Pixel
    if (settings.fb_pixel_id) {
      const pixelScript = document.createElement('script');
      pixelScript.innerHTML = `
        !function(f,b,e,v,n,t,s){...}
        fbq('init', '${settings.fb_pixel_id}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(pixelScript);
    }
    
    // Inject custom scripts
    settings.custom_scripts?.forEach(script => {
      const element = document.createElement('script');
      element.innerHTML = script.script;
      
      if (script.position === 'head') {
        document.head.appendChild(element);
      } else if (script.position === 'body_start') {
        document.body.insertBefore(element, document.body.firstChild);
      } else {
        document.body.appendChild(element);
      }
    });
  }, [settings]);
  
  return <>{children}</>;
};
```

## 📊 Performance Monitoring

### SEO Metrikleri
- **Organic Traffic**: Günlük organik ziyaretçi sayısı
- **Search Rankings**: Anahtar kelime pozisyonları
- **Click-through Rate**: SERP'te tıklanma oranı
- **Page Speed**: Sayfa yükleme hızı
- **Core Web Vitals**: LCP, FID, CLS metrikleri

### Analytics Dashboard
```javascript
const seoMetrics = {
  organic_views: 1250,
  search_impressions: 8900,
  search_clicks: 340,
  avg_position: 12.5,
  top_keywords: [
    { keyword: "UX mentor", position: 8, clicks: 45 },
    { keyword: "Figma koçluğu", position: 12, clicks: 32 },
    { keyword: "Portfolio review", position: 15, clicks: 28 }
  ],
  conversion_rate: 0.27,
  bounce_rate: 0.35
};
```

## ⚠️ Hata Yönetimi

### Validation Hataları
```json
// Slug çakışması
{
  "error": {
    "code": "SLUG_DUPLICATE",
    "message": "Slug already exists",
    "field": "slug"
  }
}

// SEO başlık çok uzun
{
  "error": {
    "code": "SEO_TITLE_TOO_LONG",
    "message": "SEO title must be 60 characters or less",
    "field": "title"
  }
}

// Geçersiz Analytics ID
{
  "error": {
    "code": "INVALID_GA4_ID",
    "message": "GA4 ID must match pattern G-XXXXXXXXXX",
    "field": "ga4_id"
  }
}
```

## 🚀 Deployment & CDN

### Static Asset Optimization
- **Image Optimization**: WebP format, multiple sizes
- **CDN Integration**: CloudFlare/AWS CloudFront
- **Caching Strategy**: 1 year cache for images, 1 hour for HTML
- **Compression**: Gzip/Brotli compression

### Performance Targets
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.5s

---

**API Version**: 1.0.0  
**Last Updated**: 2025-01-15  
**Contact**: publishing@mentorhub.com