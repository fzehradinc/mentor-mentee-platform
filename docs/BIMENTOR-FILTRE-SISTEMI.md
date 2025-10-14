# Bimentör — Gelişmiş Filtre & Taksonomisi Sistemi

## 📋 Genel Bakış

Bimentör platformu için MBB (McKinsey/BCG/Bain) tarzı kapsamlı, facet-based filtreleme sistemi. Hem akademik hedefli kullanıcılar (örn. Kanada YL başvurusu), hem de kurumsal kariyer hedefli kullanıcılar (örn. Deloitte case interview hazırlığı) için optimize edilmiştir.

---

## 🏗️ Mimari

### **Facet Sistemi**

**Facet mantığı:**
- **Facetler arası:** AND mantığı (tüm facet kriterleri karşılanmalı)
- **Facet içi:** OR mantığı (en az bir tag eşleşmeli)

**Örnek:**
```
Hedef: [hedef-sirket, mulakat-case]  (OR)
Şirket: [deloitte, pwc]  (OR)
→ Sonuç: (hedef-sirket VEYA mulakat-case) VE (deloitte VEYA pwc)
```

### **18 Facet Kategorisi**

1. **goal** — Kullanıcı Hedefi
2. **domain** — Alan/Disiplin  
3. **company** — Hedef Şirket  
4. **position** — Pozisyon/Fonksiyon  
5. **interview** — Mülakat Tipi  
6. **location** — Lokasyon/Saat Dilimi  
7. **language** — Dil  
8. **university** — Üniversite  
9. **pricing** — Ücret Aralığı  
10. **availability** — Uygunluk  
11. **verification** — Rozetler/Doğrulama  
12. *(+7 daha)*

---

## 🎯 Hızlı Filtre Presetleri

### **1. Ayşe Paketi (Danışmanlık)**
```typescript
{
  company: ['deloitte', 'pwc', 'kpmg', 'ey'],
  position: ['consultant', 'business-analyst'],
  interview: ['case-interview', 'behavioral-star'],
  location: ['turkiye', 'avrupa'],
  language: ['tr', 'en']
}
```

### **2. Mert Paketi (Akademik/Kanada YL)**
```typescript
{
  goal: ['ms-phd-basvuru', 'sop-draft', 'lor-taktikleri'],
  country-target: ['kanada'],
  domain: ['ielts', 'stem-akademi'],
  position: ['researcher'],
  language: ['en']
}
```

### **3. FAANG/Tech**
```typescript
{
  company: ['google', 'microsoft', 'amazon', 'meta'],
  position: ['software-engineer', 'ml-engineer'],
  interview: ['system-design', 'coding-interview'],
  domain: ['yazilim', 'ml-ai']
}
```

---

## 🔍 Akıllı Arama Sistemi

### **Özellikler:**
- ✅ **Sinonim çözümleme** (`mc`, `mck` → `mckinsey`)
- ✅ **Otomatik tamamlama** (2+ karakter)
- ✅ **Klavye navigasyonu** (↑↓ + Enter)
- ✅ **Preset önerileri** (hızlı filtre paketleri)

### **Örnek Arama Cümleleri:**
```
"Deloitte case interview"
→ Şirket: deloitte + Mülakat: case-interview

"Kanada YL SoP"
→ Ülke: kanada + Hedef: ms-phd-basvuru + sop-draft

"Google sistem tasarımı"
→ Şirket: google + Mülakat: system-design
```

---

## 🏅 Rozet Sistemi

### **Badge Tipleri:**
- `top-mentor` ⭐ — En yüksek puanlı mentorlar
- `verified` ✓ — Kimlik/çalışma doğrulanmış
- `kurumsal-deneyim` 🏢 — Fortune 500 deneyimi
- `akademik-yayin` 📚 — Q1/Q2 dergilerde yayın
- `yuksek-kabul` 🎓 — %80+ hedef başarısı

---

## 📊 Sıralama Seçenekleri

1. **Önerilen (Relevance)** — Match score algoritması:
   - Rating × 10
   - Rozetler × 5
   - Deneyim yılı × 2 (max 20)
   - Yerleştirme × 3
   - Review sayısı (her 10 review → 2 puan, max 10)

2. **En Yüksek Puan** — Rating (5.0 → 0.0)
3. **Deneyim Yılı** — yearsOfExperience (descending)
4. **Son Aktif** — lastActive (en yeni)
5. **Fiyat (Düşük → Yüksek)** — hourlyRate (ascending)
6. **Fiyat (Yüksek → Düşük)** — hourlyRate (descending)

---

## 🗂️ Dosya Yapısı

```
src/
├── types/
│   └── filters.ts              # Facet tanımları, preset'ler, sinonim sistemi
├── components/
│   ├── AdvancedFilterPanel.tsx # Yan panel (filtre UI)
│   ├── SmartSearchBar.tsx      # Akıllı arama + öneri
│   └── MentorBadge.tsx         # Rozet gösterimi
├── utils/
│   └── mentorFiltering.ts      # Filtreleme + sıralama mantığı
├── pages/
│   └── BimentorMentorsPage.tsx # Ana mentor listesi
└── data/
    └── bimentor-mentors.json   # Enhanced mock data
```

---

## 🎨 UI/UX Özellikleri

### **Renk Paleti (Dark Theme)**
- **Arka plan:** `#0C2727` (koyu yeşil)
- **Kartlar:** `#F6F3EB` (bej)
- **Aksan:** `#008C83` (teal)
- **Hover efektleri:** Subtle shadow + scale(1.02)

### **Responsive Grid**
- **Desktop:** 3 sütun
- **Tablet:** 2 sütun  
- **Mobil:** 1 sütun

### **Filtre Paneli**
- **Genişlik:** 320px (sticky)
- **Hızlı Preset'ler:** Üstte, çökebilir
- **Facet'ler:** Öncelik sırasına göre (priority)
- **Seçili sayacı:** Her facet için mini badge

---

## 📝 Mentor Veri Modeli

```typescript
interface Mentor {
  // Temel bilgiler
  id: string;
  name: string;
  title: string;
  company: string;
  rating: number;
  totalReviews: number;
  yearsOfExperience: number;
  imageUrl: string;
  expertiseAreas: string[];
  
  // Facet sistemi
  facets?: {
    goals?: string[];
    domains?: string[];
    companies?: string[];
    positions?: string[];
    interviews?: string[];
    locations?: string[];
    languages?: string[];
    universities?: string[];
    techStack?: string[];
    mentoringStyle?: string[];
  };
  
  // Rozetler
  badges?: string[];
  
  // Başarı metrikleri
  successMetrics?: {
    placements?: string[];
    acceptances?: number;
    awards?: string[];
  };
  
  // Uygunluk
  availability?: {
    is48hAvailable?: boolean;
    weeknights?: boolean;
    weekendOnly?: boolean;
    flexCancellation?: boolean;
  };
  
  // Fiyatlandırma
  pricing?: {
    currency?: string;
    packageOptions?: {
      calls?: string;
      qa?: string;
      response?: string;
      support?: string;
    };
  };
}
```

---

## 🚀 Kullanım

### **1. Mentorları Listele**
```tsx
import BimentorMentorsPage from './pages/BimentorMentorsPage';

// App.tsx routing
case 'mentors-bimentor':
  return <BimentorMentorsPage />;
```

### **2. Filtre Uygula (Programatik)**
```tsx
const [selectedFacets, setSelectedFacets] = useState<Record<FacetType, string[]>>({
  company: ['deloitte', 'mckinsey'],
  interview: ['case-interview'],
  location: ['turkiye']
});

const filtered = filterMentors(allMentors, selectedFacets);
const sorted = sortMentors(filtered, 'relevance');
```

### **3. Preset Uygula**
```tsx
import { FILTER_PRESETS } from './types/filters';

const aysePreset = FILTER_PRESETS.find(p => p.id === 'ayse-deloitte');
setSelectedFacets(aysePreset.facets);
```

---

## 📈 Sonraki Adımlar (Backlog)

- [ ] **Sunucu tarafı filtreleme** (Supabase RPC + GIN indexleri)
- [ ] **URL state sync** (filtre query params olarak)
- [ ] **Saved searches** (kullanıcı filtreleri kaydedebilsin)
- [ ] **A/B testing** (hangi filtre kombinasyonları dönüşüm yaratıyor)
- [ ] **Analytics** (filtre kullanım heatmap'i)
- [ ] **Tag bakım sistemi** (ölü/az kullanılan tag'leri arşivle)
- [ ] **Elasticsearch** entegrasyonu (tam metin arama)

---

## 📞 İletişim

**Versiyon:** 1.0  
**Hazırlayan:** Bimentör Ürün Takımı  
**Tarih:** Ekim 2025

---

## 🧪 Test Senaryoları

### **Senaryo 1: Deloitte Case Interview**
```
1. Hızlı Filtre → Ayşe Paketi seç
2. Beklenen sonuç: Zeynep Demir + Burak Yılmaz
3. Sıralama: Relevance (rozetler + yerleştirme)
```

### **Senaryo 2: Kanada YL SoP**
```
1. Arama çubuğu → "Kanada SoP" yaz
2. Öneri: "Akademisyenlik (Mert)" preset
3. Beklenen: Mert Özkan (top match)
```

### **Senaryo 3: Pro-bono Mentorlar**
```
1. Filtre → Ücret Aralığı → "Gönüllü/Pro-bono"
2. Beklenen: Can Demir
3. Rozet: verified (kurumsal deneyim yok)
```

---

**🎉 Bimentör ile mentorluk keşfi artık daha akıllı ve kişiselleştirilmiş!**




