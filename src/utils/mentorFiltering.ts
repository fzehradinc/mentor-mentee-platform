import { Mentor } from '../types';
import { FacetType, SortOption } from '../types/filters';

/**
 * Bimentör Filtreleme Mantığı
 * - Facetler arası: AND mantığı (tüm facet kriterleri karşılanmalı)
 * - Facet içi: OR mantığı (en az bir tag eşleşmeli)
 */

export function filterMentors(
  mentors: Mentor[],
  selectedFacets: Record<FacetType, string[]>
): Mentor[] {
  return mentors.filter((mentor) => {
    // Her facet için kontrol yap (AND mantığı)
    for (const [facetId, selectedTags] of Object.entries(selectedFacets)) {
      if (selectedTags.length === 0) continue; // Boş facet'i atla

      const mentorTags = getMentorTagsForFacet(mentor, facetId as FacetType);
      
      // Facet içinde en az bir eşleşme olmalı (OR mantığı)
      const hasMatch = selectedTags.some((tag) => mentorTags.includes(tag));
      
      if (!hasMatch) {
        return false; // Bu facet kriteri karşılanmadı, mentor elenir
      }
    }

    return true; // Tüm facet kriterleri karşılandı
  });
}

/**
 * Mentor'un belirli bir facet için hangi tag'lere sahip olduğunu döndürür
 */
function getMentorTagsForFacet(mentor: Mentor, facetId: FacetType): string[] {
  switch (facetId) {
    case 'goal':
      return mentor.facets?.goals || [];
    
    case 'domain':
      return mentor.facets?.domains || [];
    
    case 'company':
      return mentor.facets?.companies || [];
    
    case 'position':
      return mentor.facets?.positions || [];
    
    case 'interview':
      return mentor.facets?.interviews || [];
    
    case 'location':
      return mentor.facets?.locations || [];
    
    case 'language':
      return mentor.facets?.languages || mentor.languages || [];
    
    case 'university':
      return mentor.facets?.universities || (mentor.university ? [mentor.university.toLowerCase()] : []);
    
    case 'tech-stack':
      return mentor.facets?.techStack || [];
    
    case 'mentoring-style':
      return mentor.facets?.mentoringStyle || [];
    
    case 'verification':
      return mentor.badges || [];
    
    case 'pricing':
      return getPricingTags(mentor);
    
    case 'availability':
      return getAvailabilityTags(mentor);
    
    default:
      return [];
  }
}

/**
 * Fiyat aralığı tag'lerini belirler
 */
function getPricingTags(mentor: Mentor): string[] {
  const price = mentor.hourlyRate || 0;
  
  if (mentor.isVolunteer) return ['probono'];
  if (price < 150) return ['u150'];
  if (price >= 150 && price < 300) return ['150-300'];
  if (price >= 300 && price < 600) return ['300-600'];
  if (price >= 600) return ['600plus'];
  
  return [];
}

/**
 * Uygunluk tag'lerini belirler
 */
function getAvailabilityTags(mentor: Mentor): string[] {
  const tags: string[] = [];
  
  if (mentor.availability?.is48hAvailable) tags.push('48h-available');
  if (mentor.availability?.weeknights) tags.push('weeknights');
  if (mentor.availability?.weekendOnly) tags.push('weekend-only');
  if (mentor.availability?.flexCancellation) tags.push('flex-cancellation');
  
  return tags;
}

/**
 * Sıralama fonksiyonu
 */
export function sortMentors(mentors: Mentor[], sortBy: SortOption): Mentor[] {
  const sorted = [...mentors];

  switch (sortBy) {
    case 'rating':
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    
    case 'experience':
      return sorted.sort((a, b) => (b.yearsOfExperience || 0) - (a.yearsOfExperience || 0));
    
    case 'price-asc':
      return sorted.sort((a, b) => (a.hourlyRate || 0) - (b.hourlyRate || 0));
    
    case 'price-desc':
      return sorted.sort((a, b) => (b.hourlyRate || 0) - (a.hourlyRate || 0));
    
    case 'recent':
      // TODO: Implement when we have lastActive field
      return sorted;
    
    case 'relevance':
    default:
      return calculateRelevanceScore(sorted);
  }
}

/**
 * Alaka skoru hesaplama (match score)
 * Faktörler:
 * - Rozet sayısı (top-mentor, verified vb.)
 * - Rating
 * - Deneyim yılı
 * - Başarı metrikleri
 */
function calculateRelevanceScore(mentors: Mentor[]): Mentor[] {
  return mentors
    .map((mentor) => {
      let score = 0;

      // Rating (0-50 puan)
      score += (mentor.rating || 0) * 10;

      // Rozetler (her biri 5 puan)
      score += (mentor.badges?.length || 0) * 5;

      // Deneyim (yıl başına 2 puan, max 20)
      score += Math.min((mentor.yearsOfExperience || 0) * 2, 20);

      // Başarı metrikleri (yerleştirme başına 3 puan)
      score += (mentor.successMetrics?.placements?.length || 0) * 3;

      // Review sayısı (her 10 review için 2 puan, max 10)
      score += Math.min(Math.floor((mentor.totalReviews || 0) / 10) * 2, 10);

      return { mentor, score };
    })
    .sort((a, b) => b.score - a.score)
    .map(({ mentor }) => mentor);
}

/**
 * Arama sorgusu ile filtreleme
 */
export function searchMentors(mentors: Mentor[], query: string): Mentor[] {
  if (!query.trim()) return mentors;

  const normalized = query.toLowerCase().trim();

  return mentors.filter((mentor) => {
    // İsim
    if (mentor.name.toLowerCase().includes(normalized)) return true;

    // Ünvan
    if (mentor.title?.toLowerCase().includes(normalized)) return true;

    // Şirket
    if (mentor.company?.toLowerCase().includes(normalized)) return true;

    // Beceriler/Alan
    if (mentor.expertiseAreas?.some((area) => area.toLowerCase().includes(normalized))) return true;

    // Facet tag'leri
    const allFacetTags = [
      ...(mentor.facets?.goals || []),
      ...(mentor.facets?.domains || []),
      ...(mentor.facets?.companies || []),
      ...(mentor.facets?.positions || []),
      ...(mentor.facets?.interviews || []),
    ];
    
    if (allFacetTags.some((tag) => tag.toLowerCase().includes(normalized))) return true;

    return false;
  });
}




