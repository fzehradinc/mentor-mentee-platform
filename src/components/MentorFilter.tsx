"use client";
import React, { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface FilterState {
  skills: string[];
  categories: string[];
  priceRange: [number, number];
  countries: string[];
}

interface MentorFilterProps {
  onFilterChange: (filters: FilterState) => void;
  selectedFilters: FilterState;
}

const MentorFilter: React.FC<MentorFilterProps> = ({ onFilterChange, selectedFilters }) => {
  const [expandedSections, setExpandedSections] = useState({
    skills: true,
    jobTitles: true,
    price: false,
    location: false
  });

  const skills = [
    { name: 'Data Science', count: 79 },
    { name: 'Machine Learning', count: 58 },
    { name: 'Leadership', count: 45 },
    { name: 'Data Analytics', count: 41 },
    { name: 'Product Management', count: 40 },
    { name: 'Career', count: 35 },
    { name: 'React', count: 32 },
    { name: 'Python', count: 28 },
    { name: 'UX Design', count: 25 },
    { name: 'Startup', count: 22 }
  ];

  const jobTitles = [
    { name: 'CTO', count: 6 },
    { name: 'Data Science Manager', count: 6 },
    { name: 'AI', count: 5 },
    { name: 'Data', count: 5 },
    { name: 'Engineering Manager', count: 5 },
    { name: 'Data Science', count: 3 },
    { name: 'Product Manager', count: 3 },
    { name: 'Tech Lead', count: 2 }
  ];

  const categories = [
    'Data Science',
    'AI',
    'Engineering',
    'Product Management',
    'Design',
    'Startup',
    'Marketing',
    'Leadership'
  ];

  const countries = [
    'United States',
    'Turkey',
    'United Kingdom',
    'Germany',
    'Canada',
    'Australia',
    'Netherlands',
    'Spain'
  ];

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSkillToggle = (skill: string) => {
    const newSkills = selectedFilters.skills.includes(skill)
      ? selectedFilters.skills.filter(s => s !== skill)
      : [...selectedFilters.skills, skill];
    
    onFilterChange({
      ...selectedFilters,
      skills: newSkills
    });
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = selectedFilters.categories.includes(category)
      ? selectedFilters.categories.filter(c => c !== category)
      : [...selectedFilters.categories, category];
    
    onFilterChange({
      ...selectedFilters,
      categories: newCategories
    });
  };

  const handleCountryToggle = (country: string) => {
    const newCountries = selectedFilters.countries.includes(country)
      ? selectedFilters.countries.filter(c => c !== country)
      : [...selectedFilters.countries, country];
    
    onFilterChange({
      ...selectedFilters,
      countries: newCountries
    });
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    onFilterChange({
      ...selectedFilters,
      priceRange: [min, max]
    });
  };

  const clearAllFilters = () => {
    onFilterChange({
      skills: [],
      categories: [],
      priceRange: [0, 500],
      countries: []
    });
  };

  const hasActiveFilters = selectedFilters.skills.length > 0 || 
                          selectedFilters.categories.length > 0 || 
                          selectedFilters.countries.length > 0 ||
                          selectedFilters.priceRange[0] > 0 || 
                          selectedFilters.priceRange[1] < 500;

  return (
    <div className="bg-[#1A3A3A] rounded-2xl border border-white/10 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-[#008C83] hover:text-[#00A896] transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Skills Section */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('skills')}
          className="flex items-center justify-between w-full text-left"
        >
          <h4 className="font-medium text-white">Skills</h4>
          <ChevronDown 
            className={`w-4 h-4 text-white/60 transition-transform ${
              expandedSections.skills ? 'rotate-180' : ''
            }`} 
          />
        </button>
        
        {expandedSections.skills && (
          <div className="space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for skills"
                className="w-full px-3 py-2 bg-[#0C2727] border border-white/10 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#008C83]"
              />
            </div>
            
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {skills.map((skill) => (
                <label key={skill.name} className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedFilters.skills.includes(skill.name)}
                      onChange={() => handleSkillToggle(skill.name)}
                      className="w-4 h-4 text-[#008C83] bg-[#0C2727] border-white/20 rounded focus:ring-[#008C83] focus:ring-2"
                    />
                    <span className="text-sm text-white/80">{skill.name}</span>
                  </div>
                  <span className="text-xs text-white/40">{skill.count}</span>
                </label>
              ))}
            </div>
            
            <button className="text-sm text-[#008C83] hover:text-[#00A896] transition-colors">
              Show more
            </button>
          </div>
        )}
      </div>

      {/* Job Titles Section */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('jobTitles')}
          className="flex items-center justify-between w-full text-left"
        >
          <h4 className="font-medium text-white">Job titles</h4>
          <ChevronDown 
            className={`w-4 h-4 text-white/60 transition-transform ${
              expandedSections.jobTitles ? 'rotate-180' : ''
            }`} 
          />
        </button>
        
        {expandedSections.jobTitles && (
          <div className="space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for job titles"
                className="w-full px-3 py-2 bg-[#0C2727] border border-white/10 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#008C83]"
              />
            </div>
            
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {jobTitles.map((title) => (
                <label key={title.name} className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedFilters.categories.includes(title.name)}
                      onChange={() => handleCategoryToggle(title.name)}
                      className="w-4 h-4 text-[#008C83] bg-[#0C2727] border-white/20 rounded focus:ring-[#008C83] focus:ring-2"
                    />
                    <span className="text-sm text-white/80">{title.name}</span>
                  </div>
                  <span className="text-xs text-white/40">{title.count}</span>
                </label>
              ))}
            </div>
            
            <button className="text-sm text-[#008C83] hover:text-[#00A896] transition-colors">
              Show more
            </button>
          </div>
        )}
      </div>

      {/* Price Range Section */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-left"
        >
          <h4 className="font-medium text-white">Price range</h4>
          <ChevronDown 
            className={`w-4 h-4 text-white/60 transition-transform ${
              expandedSections.price ? 'rotate-180' : ''
            }`} 
          />
        </button>
        
        {expandedSections.price && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={selectedFilters.priceRange[0]}
                onChange={(e) => handlePriceRangeChange(Number(e.target.value), selectedFilters.priceRange[1])}
                className="w-full px-3 py-2 bg-[#0C2727] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#008C83]"
              />
              <span className="text-white/60">-</span>
              <input
                type="number"
                placeholder="Max"
                value={selectedFilters.priceRange[1]}
                onChange={(e) => handlePriceRangeChange(selectedFilters.priceRange[0], Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#0C2727] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#008C83]"
              />
            </div>
            
            <div className="text-xs text-white/60">
              Range: ${selectedFilters.priceRange[0]} - ${selectedFilters.priceRange[1]}
            </div>
          </div>
        )}
      </div>

      {/* Location Section */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('location')}
          className="flex items-center justify-between w-full text-left"
        >
          <h4 className="font-medium text-white">Location</h4>
          <ChevronDown 
            className={`w-4 h-4 text-white/60 transition-transform ${
              expandedSections.location ? 'rotate-180' : ''
            }`} 
          />
        </button>
        
        {expandedSections.location && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {countries.map((country) => (
              <label key={country} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedFilters.countries.includes(country)}
                  onChange={() => handleCountryToggle(country)}
                  className="w-4 h-4 text-[#008C83] bg-[#0C2727] border-white/20 rounded focus:ring-[#008C83] focus:ring-2"
                />
                <span className="text-sm text-white/80">{country}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-white/10">
          <h5 className="text-sm font-medium text-white mb-3">Active filters</h5>
          <div className="flex flex-wrap gap-2">
            {selectedFilters.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-2 py-1 bg-[#008C83]/20 text-[#008C83] rounded-full text-xs"
              >
                {skill}
                <button
                  onClick={() => handleSkillToggle(skill)}
                  className="hover:text-[#00A896]"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {selectedFilters.categories.map((category) => (
              <span
                key={category}
                className="inline-flex items-center gap-1 px-2 py-1 bg-[#008C83]/20 text-[#008C83] rounded-full text-xs"
              >
                {category}
                <button
                  onClick={() => handleCategoryToggle(category)}
                  className="hover:text-[#00A896]"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {selectedFilters.countries.map((country) => (
              <span
                key={country}
                className="inline-flex items-center gap-1 px-2 py-1 bg-[#008C83]/20 text-[#008C83] rounded-full text-xs"
              >
                {country}
                <button
                  onClick={() => handleCountryToggle(country)}
                  className="hover:text-[#00A896]"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorFilter;
