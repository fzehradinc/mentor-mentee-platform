import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { FilterOptions } from '../../types';
import { expertiseOptions, languageOptions, locationOptions } from '../../data/mockData';

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * Filter panel component for filtering mentors
 * Props:
 * - filters: Current filter values
 * - onFiltersChange: Function called when filters change
 * - searchQuery: Current search query string
 * - onSearchChange: Function called when search query changes
 * - isOpen: Boolean indicating if filter panel is expanded
 * - onToggle: Function to toggle filter panel visibility
 */
const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  searchQuery,
  onSearchChange,
  isOpen,
  onToggle
}) => {
  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleExpertiseToggle = (expertise: string) => {
    const newAreas = filters.expertiseAreas.includes(expertise)
      ? filters.expertiseAreas.filter(area => area !== expertise)
      : [...filters.expertiseAreas, expertise];
    
    handleFilterChange('expertiseAreas', newAreas);
  };

  const handleLanguageToggle = (language: string) => {
    const newLanguages = filters.languages.includes(language)
      ? filters.languages.filter(lang => lang !== language)
      : [...filters.languages, language];
    
    handleFilterChange('languages', newLanguages);
  };

  const clearFilters = () => {
    onFiltersChange({
      expertiseAreas: [],
      languages: [],
      minExperience: 0,
      maxExperience: 20,
      location: '',
      minRating: 0,
      priceRange: [0, 200]
    });
    onSearchChange('');
  };

  const hasActiveFilters = 
    filters.expertiseAreas.length > 0 ||
    filters.languages.length > 0 ||
    filters.location ||
    filters.minExperience > 0 ||
    filters.maxExperience < 20 ||
    filters.minRating > 0 ||
    searchQuery;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Search Bar */}
      <div className="p-6 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Mentör adı, unvan veya uzmanlık alanı ara..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Filter Toggle */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <button
            onClick={onToggle}
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
          >
            <Filter className="w-5 h-5" />
            <span className="font-medium">Filtreler</span>
            {hasActiveFilters && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Aktif
              </span>
            )}
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Tümünü temizle</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Content */}
      {isOpen && (
        <div className="p-6 space-y-6">
          {/* Expertise Areas */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Uzmanlık Alanları</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {expertiseOptions.map((expertise) => (
                <label key={expertise} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.expertiseAreas.includes(expertise)}
                    onChange={() => handleExpertiseToggle(expertise)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{expertise}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Experience Range */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Deneyim (Yıl)</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Min</label>
                <select
                  value={filters.minExperience}
                  onChange={(e) => handleFilterChange('minExperience', parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {[0, 1, 2, 3, 5, 8, 10].map(year => (
                    <option key={year} value={year}>{year}+ yıl</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Maks</label>
                <select
                  value={filters.maxExperience}
                  onChange={(e) => handleFilterChange('maxExperience', parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {[5, 8, 10, 15, 20].map(year => (
                    <option key={year} value={year}>{year}+ yıl</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Lokasyon</h3>
            <select
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tüm lokasyonlar</option>
              {locationOptions.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>

          {/* Languages */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Diller</h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {languageOptions.map((language) => (
                <label key={language} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.languages.includes(language)}
                    onChange={() => handleLanguageToggle(language)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{language}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Minimum Rating */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Minimum Puan</h3>
            <select
              value={filters.minRating}
              onChange={(e) => handleFilterChange('minRating', parseFloat(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={0}>Tüm puanlar</option>
              <option value={3}>3+ yıldız</option>
              <option value={4}>4+ yıldız</option>
              <option value={4.5}>4.5+ yıldız</option>
            </select>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Saatlik Ücret</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Min (₺)</label>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  value={filters.priceRange[0]}
                  onChange={(e) => handleFilterChange('priceRange', [parseInt(e.target.value), filters.priceRange[1]])}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Maks (₺)</label>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  value={filters.priceRange[1]}
                  onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;