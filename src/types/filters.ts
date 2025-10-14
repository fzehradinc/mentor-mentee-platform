/**
 * Bimentör Filtre & Taksonomisi Tip Tanımları
 * v1.0 - Facet-based filtreleme sistemi
 */

// ==================== Facet Tipleri ====================

export type FacetType =
  | 'goal'           // Kullanıcı hedefi
  | 'domain'         // Alan/Disiplin
  | 'sector'         // Sektör
  | 'company'        // Hedef şirket
  | 'position'       // Pozisyon/Fonksiyon
  | 'seniority'      // Kıdem seviyesi
  | 'location'       // Lokasyon
  | 'language'       // Dil
  | 'education'      // Eğitim düzeyi
  | 'university'     // Üniversite
  | 'country-target' // Hedef ülke (akademik)
  | 'interview'      // Mülakat tipi
  | 'tech-stack'     // Teknik yetenekler
  | 'mentoring-style'// Mentorluk stili
  | 'availability'   // Uygunluk
  | 'pricing'        // Ücretlendirme
  | 'verification'   // Doğrulama/Rozetler
  | 'special';       // Özel durumlar

export interface FacetTag {
  slug: string;
  label: string;
  synonyms?: string[];
  icon?: string;
  description?: string;
}

export interface Facet {
  id: FacetType;
  name: string;
  tags: FacetTag[];
  multiSelect: boolean;
  priority: number; // Görüntüleme sırası
}

// ==================== Hedef (Goal) ====================

export const GOAL_TAGS: FacetTag[] = [
  { slug: 'kariyer-gecis', label: 'Kariyer Geçişi', synonyms: ['alan değiştirme', 'sektör değişimi'] },
  { slug: 'hedef-sirket', label: 'Belirli Şirkete Giriş', synonyms: ['target company'] },
  { slug: 'mulakat-case', label: 'Case Mülakat Hazırlığı' },
  { slug: 'mulakat-teknik', label: 'Teknik Mülakat Hazırlığı' },
  { slug: 'ms-phd-basvuru', label: 'YL/Doktora Başvurusu', synonyms: ['masters', 'phd', 'graduate school'] },
  { slug: 'akademik-danismanlik', label: 'Akademik Danışmanlık' },
  { slug: 'sop-draft', label: 'SoP Hazırlığı', synonyms: ['statement of purpose'] },
  { slug: 'lor-taktikleri', label: 'LoR Stratejisi', synonyms: ['recommendation letter'] },
  { slug: 'burs-basvurusu', label: 'Burs Başvurusu', synonyms: ['scholarship'] },
  { slug: 'linkedin-stratejisi', label: 'LinkedIn/Networking' },
];

// ==================== Alan/Disiplin ====================

export const DOMAIN_TAGS: FacetTag[] = [
  { slug: 'yazilim', label: 'Yazılım Mühendisliği', synonyms: ['software', 'development'] },
  { slug: 'data-science', label: 'Veri Bilimi', synonyms: ['data science', 'analytics'] },
  { slug: 'ml-ai', label: 'Makine Öğrenmesi/AI', synonyms: ['machine learning', 'artificial intelligence'] },
  { slug: 'elektronik', label: 'Elektrik/Elektronik' },
  { slug: 'endustri', label: 'Endüstri Mühendisliği' },
  { slug: 'danismanlik', label: 'Danışmanlık', synonyms: ['consulting'] },
  { slug: 'urun-yonetimi', label: 'Ürün Yönetimi', synonyms: ['product management', 'pm'] },
  { slug: 'is-analizi', label: 'İş Analizi', synonyms: ['business analysis'] },
  { slug: 'pazarlama', label: 'Pazarlama', synonyms: ['marketing'] },
  { slug: 'finans', label: 'Finans', synonyms: ['finance'] },
  { slug: 'ux-ui', label: 'UX/UI Tasarım', synonyms: ['design', 'user experience'] },
  { slug: 'stem-akademi', label: 'STEM Akademi' },
  { slug: 'sosyal-bilimler', label: 'Sosyal Bilimler' },
  { slug: 'ielts', label: 'IELTS' },
  { slug: 'toefl', label: 'TOEFL' },
  { slug: 'gre', label: 'GRE' },
  { slug: 'gmat', label: 'GMAT' },
];

// ==================== Şirket Etiketleri ====================

export const COMPANY_TAGS: FacetTag[] = [
  // Danışmanlık
  { slug: 'deloitte', label: 'Deloitte', synonyms: ['deloitte consulting'] },
  { slug: 'pwc', label: 'PwC', synonyms: ['pricewaterhousecoopers'] },
  { slug: 'kpmg', label: 'KPMG' },
  { slug: 'ey', label: 'EY', synonyms: ['ernst & young'] },
  { slug: 'mckinsey', label: 'McKinsey', synonyms: ['mc', 'mck'] },
  { slug: 'bcg', label: 'BCG', synonyms: ['boston consulting'] },
  { slug: 'accenture', label: 'Accenture' },
  
  // Teknoloji
  { slug: 'google', label: 'Google', synonyms: ['alphabet'] },
  { slug: 'microsoft', label: 'Microsoft' },
  { slug: 'amazon', label: 'Amazon', synonyms: ['aws'] },
  { slug: 'meta', label: 'Meta', synonyms: ['facebook'] },
  { slug: 'apple', label: 'Apple' },
  
  // Savunma/Türkiye
  { slug: 'aselsan', label: 'ASELSAN' },
  { slug: 'roketsan', label: 'ROKETSAN' },
  { slug: 'tusas', label: 'TUSAŞ', synonyms: ['tai'] },
  
  // Finans
  { slug: 'bloomberg', label: 'Bloomberg' },
  { slug: 'goldman', label: 'Goldman Sachs' },
];

// ==================== Pozisyon ====================

export const POSITION_TAGS: FacetTag[] = [
  { slug: 'consultant', label: 'Consultant', synonyms: ['danışman'] },
  { slug: 'business-analyst', label: 'Business Analyst', synonyms: ['iş analisti'] },
  { slug: 'product-manager', label: 'Product Manager', synonyms: ['ürün yöneticisi', 'pm'] },
  { slug: 'data-engineer', label: 'Data Engineer', synonyms: ['veri mühendisi'] },
  { slug: 'ml-engineer', label: 'ML Engineer', synonyms: ['machine learning engineer'] },
  { slug: 'software-engineer', label: 'Software Engineer', synonyms: ['yazılım mühendisi'] },
  { slug: 'ux-designer', label: 'UX Designer', synonyms: ['tasarımcı'] },
  { slug: 'project-manager', label: 'Project Manager' },
  { slug: 'researcher', label: 'Researcher', synonyms: ['araştırmacı', 'akademisyen'] },
];

// ==================== Mülakat Tipleri ====================

export const INTERVIEW_TAGS: FacetTag[] = [
  { slug: 'case-interview', label: 'Case Interview', synonyms: ['vaka mülakatı'] },
  { slug: 'guesstimate', label: 'Guesstimate/Market Sizing' },
  { slug: 'behavioral-star', label: 'Behavioral/STAR' },
  { slug: 'system-design', label: 'System Design' },
  { slug: 'coding-interview', label: 'Coding Interview', synonyms: ['algoritma'] },
  { slug: 'resume-review', label: 'CV/Resume İncelemesi' },
  { slug: 'linkedin-review', label: 'LinkedIn İncelemesi' },
];

// ==================== Lokasyon ====================

export const LOCATION_TAGS: FacetTag[] = [
  { slug: 'turkiye', label: 'Türkiye', synonyms: ['turkey', 'tr'] },
  { slug: 'avrupa', label: 'Avrupa', synonyms: ['europe', 'eu'] },
  { slug: 'mena', label: 'MENA' },
  { slug: 'kanada', label: 'Kanada', synonyms: ['canada'] },
  { slug: 'almanya', label: 'Almanya', synonyms: ['germany', 'de'] },
  { slug: 'istanbul', label: 'İstanbul' },
  { slug: 'ankara', label: 'Ankara' },
  { slug: 'gmt+3', label: 'GMT+3 (TR Saati)' },
  { slug: 'remote-only', label: 'Sadece Online' },
];

// ==================== Dil ====================

export const LANGUAGE_TAGS: FacetTag[] = [
  { slug: 'tr', label: 'Türkçe', synonyms: ['turkish'] },
  { slug: 'en', label: 'İngilizce', synonyms: ['english'] },
  { slug: 'de', label: 'Almanca', synonyms: ['german'] },
  { slug: 'fr', label: 'Fransızca', synonyms: ['french'] },
  { slug: 'ar', label: 'Arapça', synonyms: ['arabic'] },
];

// ==================== Üniversite ====================

export const UNIVERSITY_TAGS: FacetTag[] = [
  { slug: 'itu', label: 'İTÜ', synonyms: ['istanbul teknik'] },
  { slug: 'odtu', label: 'ODTÜ', synonyms: ['metu', 'middle east technical'] },
  { slug: 'bogazici', label: 'Boğaziçi', synonyms: ['boun'] },
  { slug: 'oxford', label: 'Oxford' },
  { slug: 'imperial', label: 'Imperial College' },
  { slug: 'tum', label: 'TU Munich', synonyms: ['technical university munich'] },
  { slug: 'eth', label: 'ETH Zurich' },
  { slug: 'mit', label: 'MIT' },
  { slug: 'toronto', label: 'University of Toronto', synonyms: ['uoft'] },
];

// ==================== Ücretlendirme ====================

export const PRICING_TAGS: FacetTag[] = [
  { slug: 'u150', label: '< 150₺' },
  { slug: '150-300', label: '150-300₺' },
  { slug: '300-600', label: '300-600₺' },
  { slug: '600plus', label: '600₺+' },
  { slug: 'probono', label: 'Gönüllü/Pro-bono' },
];

// ==================== Uygunluk ====================

export const AVAILABILITY_TAGS: FacetTag[] = [
  { slug: '48h-available', label: 'Anında Uygun (48s)', synonyms: ['hemen', 'immediately'] },
  { slug: 'weeknights', label: 'Hafta İçi Akşam' },
  { slug: 'weekend-only', label: 'Sadece Hafta Sonu' },
  { slug: 'flex-cancellation', label: 'Esnek İptal' },
];

// ==================== Rozetler/Doğrulama ====================

export const BADGE_TAGS: FacetTag[] = [
  { slug: 'top-mentor', label: 'Top Mentor', icon: '⭐' },
  { slug: 'kurumsal-deneyim', label: 'Kurumsal Deneyim', icon: '🏢' },
  { slug: 'akademik-yayin', label: 'Akademik Yayın', icon: '📚' },
  { slug: 'yuksek-kabul', label: 'Yüksek Kabul Oranı', icon: '🎓' },
  { slug: 'verified', label: 'Doğrulanmış', icon: '✓' },
];

// ==================== Hızlı Filtre Presetleri ====================

export interface FilterPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  facets: Record<FacetType, string[]>;
}

export const FILTER_PRESETS: FilterPreset[] = [
  {
    id: 'ayse-deloitte',
    name: 'Danışmanlık Hedefi (Ayşe)',
    description: 'Deloitte/Big4 danışmanlık + case interview hazırlığı',
    icon: '💼',
    facets: {
      'company': ['deloitte', 'pwc', 'kpmg', 'ey'],
      'position': ['consultant', 'business-analyst'],
      'interview': ['case-interview', 'behavioral-star'],
      'location': ['turkiye', 'avrupa'],
      'language': ['tr', 'en'],
      'goal': [] as string[],
      'domain': [] as string[],
      'sector': [] as string[],
      'seniority': [] as string[],
      'education': [] as string[],
      'university': [] as string[],
      'country-target': [] as string[],
      'tech-stack': [] as string[],
      'mentoring-style': [] as string[],
      'availability': [] as string[],
      'pricing': [] as string[],
      'verification': [] as string[],
      'special': [] as string[],
    },
  },
  {
    id: 'mert-canada-ms',
    name: 'Akademisyenlik (Mert)',
    description: 'Kanada YL başvurusu + SoP/LoR danışmanlığı',
    icon: '🎓',
    facets: {
      'goal': ['ms-phd-basvuru', 'sop-draft', 'lor-taktikleri'],
      'country-target': ['kanada'],
      'domain': ['ielts', 'stem-akademi'],
      'position': ['researcher'],
      'language': ['en'],
      'company': [] as string[],
      'sector': [] as string[],
      'seniority': [] as string[],
      'location': [] as string[],
      'education': [] as string[],
      'university': [] as string[],
      'interview': [] as string[],
      'tech-stack': [] as string[],
      'mentoring-style': [] as string[],
      'availability': [] as string[],
      'pricing': [] as string[],
      'verification': [] as string[],
      'special': [] as string[],
    },
  },
  {
    id: 'tech-faang',
    name: 'FAANG/Tech',
    description: 'Google, Meta, Amazon + sistem tasarımı',
    icon: '💻',
    facets: {
      'company': ['google', 'microsoft', 'amazon', 'meta'],
      'position': ['software-engineer', 'ml-engineer'],
      'interview': ['system-design', 'coding-interview'],
      'domain': ['yazilim', 'ml-ai'],
      'goal': [] as string[],
      'sector': [] as string[],
      'seniority': [] as string[],
      'location': [] as string[],
      'language': [] as string[],
      'education': [] as string[],
      'university': [] as string[],
      'country-target': [] as string[],
      'tech-stack': [] as string[],
      'mentoring-style': [] as string[],
      'availability': [] as string[],
      'pricing': [] as string[],
      'verification': [] as string[],
      'special': [] as string[],
    },
  },
];

// ==================== Tüm Facet Tanımları ====================

export const ALL_FACETS: Facet[] = [
  { id: 'goal', name: 'Hedef', tags: GOAL_TAGS, multiSelect: true, priority: 1 },
  { id: 'domain', name: 'Alan/Disiplin', tags: DOMAIN_TAGS, multiSelect: true, priority: 2 },
  { id: 'company', name: 'Hedef Şirket', tags: COMPANY_TAGS, multiSelect: true, priority: 3 },
  { id: 'position', name: 'Pozisyon', tags: POSITION_TAGS, multiSelect: true, priority: 4 },
  { id: 'interview', name: 'Mülakat Tipi', tags: INTERVIEW_TAGS, multiSelect: true, priority: 5 },
  { id: 'location', name: 'Lokasyon', tags: LOCATION_TAGS, multiSelect: true, priority: 6 },
  { id: 'language', name: 'Dil', tags: LANGUAGE_TAGS, multiSelect: true, priority: 7 },
  { id: 'university', name: 'Üniversite', tags: UNIVERSITY_TAGS, multiSelect: true, priority: 8 },
  { id: 'pricing', name: 'Ücret Aralığı', tags: PRICING_TAGS, multiSelect: true, priority: 9 },
  { id: 'availability', name: 'Uygunluk', tags: AVAILABILITY_TAGS, multiSelect: true, priority: 10 },
  { id: 'verification', name: 'Rozetler', tags: BADGE_TAGS, multiSelect: true, priority: 11 },
];

// ==================== Arama & Sinonim Sistemi ====================

export interface SearchSuggestion {
  text: string;
  type: 'facet' | 'tag' | 'preset' | 'company' | 'university';
  facetId?: FacetType;
  tagSlug?: string;
  presetId?: string;
}

/**
 * Sinonim/eş anlamlı kelime çözümleyici
 */
export function resolveTagFromQuery(query: string): { facetId: FacetType; tagSlug: string } | null {
  const normalized = query.toLowerCase().trim();
  
  for (const facet of ALL_FACETS) {
    for (const tag of facet.tags) {
      // Direkt eşleşme
      if (tag.slug === normalized || tag.label.toLowerCase() === normalized) {
        return { facetId: facet.id, tagSlug: tag.slug };
      }
      
      // Sinonim eşleşme
      if (tag.synonyms?.some(syn => syn.toLowerCase() === normalized)) {
        return { facetId: facet.id, tagSlug: tag.slug };
      }
    }
  }
  
  return null;
}

/**
 * Arama önerisi üretici
 */
export function generateSearchSuggestions(query: string): SearchSuggestion[] {
  const suggestions: SearchSuggestion[] = [];
  const normalized = query.toLowerCase().trim();
  
  if (normalized.length < 2) return [];
  
  // Preset önerileri
  FILTER_PRESETS.forEach(preset => {
    if (preset.name.toLowerCase().includes(normalized) || preset.description.toLowerCase().includes(normalized)) {
      suggestions.push({ text: preset.name, type: 'preset', presetId: preset.id });
    }
  });
  
  // Tag önerileri
  ALL_FACETS.forEach(facet => {
    facet.tags.forEach(tag => {
      if (tag.label.toLowerCase().includes(normalized) || tag.slug.includes(normalized)) {
        suggestions.push({ 
          text: tag.label, 
          type: 'tag', 
          facetId: facet.id, 
          tagSlug: tag.slug 
        });
      }
      
      // Sinonim kontrolü
      tag.synonyms?.forEach(syn => {
        if (syn.toLowerCase().includes(normalized)) {
          suggestions.push({ 
            text: `${tag.label} (${syn})`, 
            type: 'tag', 
            facetId: facet.id, 
            tagSlug: tag.slug 
          });
        }
      });
    });
  });
  
  return suggestions.slice(0, 8); // İlk 8 öneri
}

// ==================== Sıralama Seçenekleri ====================

export type SortOption = 'relevance' | 'rating' | 'experience' | 'price-asc' | 'price-desc' | 'recent';

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Önerilen (Alaka)' },
  { value: 'rating', label: 'En Yüksek Puan' },
  { value: 'experience', label: 'Deneyim Yılı' },
  { value: 'recent', label: 'Son Aktif' },
  { value: 'price-asc', label: 'Fiyat (Düşük → Yüksek)' },
  { value: 'price-desc', label: 'Fiyat (Yüksek → Düşük)' },
];


