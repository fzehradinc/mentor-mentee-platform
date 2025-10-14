import React, { useState, useEffect } from 'react';
import { ArrowLeft, SlidersHorizontal } from 'lucide-react';
import AdvancedFilterPanel from '../components/AdvancedFilterPanel';
import SmartSearchBar from '../components/SmartSearchBar';
import MentorBadge, { MentorBadges } from '../components/MentorBadge';
import { Mentor } from '../types';
import {
  FacetType,
  FilterPreset,
  SearchSuggestion,
  SortOption,
  SORT_OPTIONS,
  resolveTagFromQuery,
} from '../types/filters';
import { filterMentors, sortMentors, searchMentors } from '../utils/mentorFiltering';

export default function BimentorMentorsPage() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [selectedFacets, setSelectedFacets] = useState<Record<FacetType, string[]>>({
    goal: [],
    domain: [],
    sector: [] as string[],
    company: [],
    position: [],
    seniority: [] as string[],
    location: [],
    language: [],
    education: [] as string[],
    university: [],
    'country-target': [] as string[],
    interview: [],
    'tech-stack': [] as string[],
    'mentoring-style': [] as string[],
    availability: [],
    pricing: [],
    verification: [],
    special: [] as string[],
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [showFilters, setShowFilters] = useState(true);

  // Mock data yükleme
  useEffect(() => {
    // Bimentor enhanced mentors
    import('../data/bimentor-mentors.json')
      .then((data) => {
        setMentors(data.default as Mentor[]);
      })
      .catch((err) => console.error('Mentor data yüklenemedi:', err));
  }, []);

  const handleFacetChange = (facetId: FacetType, tagSlugs: string[]) => {
    setSelectedFacets((prev) => ({
      ...prev,
      [facetId]: tagSlugs,
    }));
  };

  const handlePresetApply = (preset: FilterPreset) => {
    setSelectedFacets(preset.facets);
    setSearchQuery('');
  };

  const handleClearAll = () => {
    setSelectedFacets({
      goal: [],
      domain: [],
      sector: [] as string[],
      company: [],
      position: [],
      seniority: [] as string[],
      location: [],
      language: [],
      education: [] as string[],
      university: [],
      'country-target': [] as string[],
      interview: [],
      'tech-stack': [] as string[],
      'mentoring-style': [] as string[],
      availability: [],
      pricing: [],
      verification: [],
      special: [] as string[],
    });
    setSearchQuery('');
  };

  const handleSearchSuggestion = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'preset') {
      const preset = suggestion.presetId;
      // Find and apply preset
      // (already handled in SmartSearchBar onClick)
    } else if (suggestion.type === 'tag' && suggestion.facetId && suggestion.tagSlug) {
      // Add tag to facet
      const current = selectedFacets[suggestion.facetId] || [];
      if (!current.includes(suggestion.tagSlug)) {
        handleFacetChange(suggestion.facetId, [...current, suggestion.tagSlug]);
      }
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    
    // Akıllı tag çözümleme
    const resolved = resolveTagFromQuery(value);
    if (resolved) {
      const current = selectedFacets[resolved.facetId] || [];
      if (!current.includes(resolved.tagSlug)) {
        handleFacetChange(resolved.facetId, [...current, resolved.tagSlug]);
      }
    }
  };

  // Filtreleme pipeline
  let displayedMentors = mentors;

  // 1. Arama filtresi
  if (searchQuery) {
    displayedMentors = searchMentors(displayedMentors, searchQuery);
  }

  // 2. Facet filtreleri
  displayedMentors = filterMentors(displayedMentors, selectedFacets);

  // 3. Sıralama
  displayedMentors = sortMentors(displayedMentors, sortBy);

  const handleGoBack = () => {
    window.dispatchEvent(
      new CustomEvent('navigate', { detail: { view: 'home' } })
    );
  };

  const handleMentorClick = (mentorId: string) => {
    sessionStorage.setItem('selectedMentorId', mentorId);
    window.dispatchEvent(
      new CustomEvent('navigate', { detail: { view: 'mentor-detail-bimentor' } })
    );
  };

  return (
    <div className="min-h-screen bg-[#0C2727] flex">
      {/* Filtre Paneli */}
      {showFilters && (
        <AdvancedFilterPanel
          selectedFacets={selectedFacets}
          onFacetChange={handleFacetChange}
          onPresetApply={handlePresetApply}
          onClearAll={handleClearAll}
        />
      )}

      {/* Ana İçerik */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#0C2727]/95 backdrop-blur-sm border-b border-[#008C83]/20 z-20">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={handleGoBack}
                className="p-2 hover:bg-[#F6F3EB]/5 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-[#F6F3EB]" />
              </button>
              <h1 className="text-2xl font-bold text-[#F6F3EB]">Mentorları Keşfet</h1>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="ml-auto p-2 hover:bg-[#F6F3EB]/5 rounded-lg transition-colors lg:hidden"
              >
                <SlidersHorizontal className="h-5 w-5 text-[#F6F3EB]" />
              </button>
            </div>

            {/* Arama */}
            <SmartSearchBar
              value={searchQuery}
              onChange={handleSearchChange}
              onSuggestionSelect={handleSearchSuggestion}
            />
          </div>
        </div>

        {/* Sonuç Bilgisi & Sıralama */}
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#F6F3EB]/60">
              <span className="font-semibold text-[#F6F3EB]">{displayedMentors.length}</span> mentor bulundu
            </p>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 bg-[#F6F3EB]/5 border border-[#008C83]/20 rounded-lg text-[#F6F3EB] text-sm focus:outline-none focus:border-[#008C83] transition-colors"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value} className="bg-[#0C2727]">
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mentor Grid */}
        <div className="max-w-7xl mx-auto px-6 pb-12">
          {displayedMentors.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#F6F3EB]/60 text-lg">Kriterlere uygun mentor bulunamadı.</p>
              <button
                onClick={handleClearAll}
                className="mt-4 px-6 py-2 bg-[#008C83] text-white rounded-lg hover:bg-[#00bfb3] transition-colors"
              >
                Filtreleri Temizle
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedMentors.map((mentor) => (
                <MentorCardBimentor
                  key={mentor.id}
                  mentor={mentor}
                  onClick={() => handleMentorClick(mentor.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Mentor Kartı Bileşeni
interface MentorCardBimentorProps {
  mentor: Mentor;
  onClick: () => void;
}

function MentorCardBimentor({ mentor, onClick }: MentorCardBimentorProps) {
  return (
    <div
      onClick={onClick}
      className="bg-[#F6F3EB] rounded-2xl overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start gap-4">
          <img
            src={mentor.imageUrl || '/default-avatar.png'}
            alt={mentor.name}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-[#008C83]/20"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-[#0C2727] group-hover:text-[#008C83] transition-colors">
              {mentor.name}
            </h3>
            <p className="text-sm text-[#0C2727]/70">{mentor.title}</p>
            {mentor.company && (
              <p className="text-xs text-[#0C2727]/50 mt-0.5">{mentor.company}</p>
            )}
          </div>
        </div>

        {/* Rozetler */}
        {mentor.badges && mentor.badges.length > 0 && (
          <div className="mt-3">
            <MentorBadges badges={mentor.badges} maxVisible={2} size="sm" />
          </div>
        )}
      </div>

      {/* Rating & Reviews */}
      <div className="px-6 pb-4 flex items-center gap-2">
        <div className="flex items-center gap-1">
          <span className="text-yellow-500">⭐</span>
          <span className="font-semibold text-[#0C2727]">{mentor.rating.toFixed(1)}</span>
        </div>
        <span className="text-sm text-[#0C2727]/60">({mentor.totalReviews} değerlendirme)</span>
      </div>

      {/* Beceriler */}
      {mentor.expertiseAreas && mentor.expertiseAreas.length > 0 && (
        <div className="px-6 pb-4">
          <div className="flex flex-wrap gap-1.5">
            {mentor.expertiseAreas.slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-[#008C83]/10 text-[#008C83] text-xs rounded-full"
              >
                {skill}
              </span>
            ))}
            {mentor.expertiseAreas.length > 3 && (
              <span className="px-2 py-1 text-[#0C2727]/60 text-xs">
                +{mentor.expertiseAreas.length - 3} daha
              </span>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-6 py-4 border-t border-[#0C2727]/10 flex items-center justify-between">
        <div>
          {mentor.isVolunteer ? (
            <span className="text-sm font-semibold text-[#10B981]">Pro-bono</span>
          ) : (
            <div>
              <span className="text-lg font-bold text-[#0C2727]">
                {mentor.pricing?.currency || '₺'}{mentor.hourlyRate}
              </span>
              <span className="text-sm text-[#0C2727]/60">/saat</span>
            </div>
          )}
        </div>

        <button className="px-4 py-2 bg-[#008C83] text-white rounded-lg text-sm font-medium hover:bg-[#00bfb3] transition-colors">
          Profil →
        </button>
      </div>
    </div>
  );
}

