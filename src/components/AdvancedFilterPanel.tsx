import React, { useState } from 'react';
import { ChevronDown, ChevronUp, X, Check } from 'lucide-react';
import {
  ALL_FACETS,
  FacetType,
  FacetTag,
  FILTER_PRESETS,
  FilterPreset,
} from '../types/filters';

interface AdvancedFilterPanelProps {
  selectedFacets: Record<FacetType, string[]>;
  onFacetChange: (facetId: FacetType, tagSlugs: string[]) => void;
  onPresetApply: (preset: FilterPreset) => void;
  onClearAll: () => void;
}

export default function AdvancedFilterPanel({
  selectedFacets,
  onFacetChange,
  onPresetApply,
  onClearAll,
}: AdvancedFilterPanelProps) {
  const [expandedFacets, setExpandedFacets] = useState<FacetType[]>(['goal', 'domain', 'company']);
  const [showPresets, setShowPresets] = useState(true);

  const toggleFacet = (facetId: FacetType) => {
    setExpandedFacets((prev) =>
      prev.includes(facetId) ? prev.filter((id) => id !== facetId) : [...prev, facetId]
    );
  };

  const handleTagToggle = (facetId: FacetType, tagSlug: string) => {
    const current = selectedFacets[facetId] || [];
    const newSelection = current.includes(tagSlug)
      ? current.filter((s) => s !== tagSlug)
      : [...current, tagSlug];
    onFacetChange(facetId, newSelection);
  };

  const getTotalSelectedCount = () => {
    return Object.values(selectedFacets).reduce((sum, tags) => sum + tags.length, 0);
  };

  const sortedFacets = [...ALL_FACETS].sort((a, b) => a.priority - b.priority);

  return (
    <div className="w-80 h-full bg-[#0C2727] border-r border-[#008C83]/20 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-[#0C2727] border-b border-[#008C83]/20 px-4 py-4 z-10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-[#F6F3EB]">Filtreler</h3>
          {getTotalSelectedCount() > 0 && (
            <button
              onClick={onClearAll}
              className="text-sm text-[#008C83] hover:text-[#00bfb3] flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              Temizle
            </button>
          )}
        </div>

        {/* Seçili filtre sayısı */}
        {getTotalSelectedCount() > 0 && (
          <div className="text-xs text-[#F6F3EB]/60">
            {getTotalSelectedCount()} filtre seçili
          </div>
        )}
      </div>

      {/* Hızlı Preset Filtreleri */}
      <div className="border-b border-[#008C83]/20 px-4 py-3">
        <button
          onClick={() => setShowPresets(!showPresets)}
          className="w-full flex items-center justify-between text-sm font-medium text-[#F6F3EB] mb-2"
        >
          <span>🚀 Hızlı Filtreler</span>
          {showPresets ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {showPresets && (
          <div className="space-y-2 mt-3">
            {FILTER_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => onPresetApply(preset)}
                className="w-full text-left px-3 py-2.5 rounded-lg bg-[#F6F3EB]/5 hover:bg-[#F6F3EB]/10 transition-colors group"
              >
                <div className="flex items-start gap-2">
                  <span className="text-xl">{preset.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[#F6F3EB] group-hover:text-[#008C83]">
                      {preset.name}
                    </div>
                    <div className="text-xs text-[#F6F3EB]/60 mt-0.5">
                      {preset.description}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Facet Listesi */}
      <div className="px-4 py-2">
        {sortedFacets.map((facet) => {
          const isExpanded = expandedFacets.includes(facet.id);
          const selectedTags = selectedFacets[facet.id] || [];
          const hasSelection = selectedTags.length > 0;

          return (
            <div key={facet.id} className="border-b border-[#008C83]/10 py-3 last:border-b-0">
              <button
                onClick={() => toggleFacet(facet.id)}
                className="w-full flex items-center justify-between text-sm font-medium text-[#F6F3EB] mb-2 hover:text-[#008C83] transition-colors"
              >
                <span className="flex items-center gap-2">
                  {facet.name}
                  {hasSelection && (
                    <span className="px-1.5 py-0.5 rounded-full bg-[#008C83] text-white text-xs">
                      {selectedTags.length}
                    </span>
                  )}
                </span>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              {isExpanded && (
                <div className="space-y-1.5 mt-2 max-h-64 overflow-y-auto">
                  {facet.tags.map((tag: FacetTag) => {
                    const isSelected = selectedTags.includes(tag.slug);

                    return (
                      <label
                        key={tag.slug}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-[#F6F3EB]/5 cursor-pointer transition-colors group"
                      >
                        <div
                          className={`
                            w-4 h-4 rounded border flex items-center justify-center transition-all
                            ${
                              isSelected
                                ? 'bg-[#008C83] border-[#008C83]'
                                : 'border-[#F6F3EB]/30 group-hover:border-[#008C83]/50'
                            }
                          `}
                        >
                          {isSelected && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleTagToggle(facet.id, tag.slug)}
                          className="sr-only"
                        />
                        <span className="text-sm text-[#F6F3EB]/80 group-hover:text-[#F6F3EB] flex items-center gap-1.5">
                          {tag.icon && <span>{tag.icon}</span>}
                          {tag.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}


