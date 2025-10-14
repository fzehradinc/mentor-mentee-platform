import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Sparkles } from 'lucide-react';
import { generateSearchSuggestions, SearchSuggestion, FILTER_PRESETS } from '../types/filters';

interface SmartSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSuggestionSelect: (suggestion: SearchSuggestion) => void;
  placeholder?: string;
}

export default function SmartSearchBar({
  value,
  onChange,
  onSuggestionSelect,
  placeholder = 'Mentor ara... (ör. "Deloitte case interview", "Kanada YL SoP")',
}: SmartSearchBarProps) {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.length >= 2) {
      const newSuggestions = generateSearchSuggestions(value);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
      setHighlightedIndex(0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % suggestions.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (suggestions[highlightedIndex]) {
          handleSuggestionClick(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    onSuggestionSelect(suggestion);
    setShowSuggestions(false);
    
    // Preset ise query'yi temizle, değilse suggestion text'i göster
    if (suggestion.type === 'preset') {
      onChange('');
    } else {
      onChange(suggestion.text);
    }
  };

  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'preset':
        return '🚀';
      case 'company':
        return '🏢';
      case 'university':
        return '🎓';
      case 'tag':
        return '🏷️';
      default:
        return '🔍';
    }
  };

  const getSuggestionTypeLabel = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'preset':
        return 'Hızlı Filtre';
      case 'company':
        return 'Şirket';
      case 'university':
        return 'Üniversite';
      case 'tag':
        return 'Etiket';
      default:
        return '';
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#F6F3EB]/40" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3.5 bg-[#F6F3EB]/5 border border-[#008C83]/20 rounded-xl text-[#F6F3EB] placeholder-[#F6F3EB]/40 focus:outline-none focus:border-[#008C83] focus:ring-2 focus:ring-[#008C83]/20 transition-all"
        />
        {value && (
          <button
            onClick={() => {
              onChange('');
              setSuggestions([]);
              setShowSuggestions(false);
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#F6F3EB]/40 hover:text-[#F6F3EB] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Öneriler Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full mt-2 w-full bg-[#0C2727] border border-[#008C83]/20 rounded-xl shadow-2xl overflow-hidden z-50"
        >
          <div className="px-3 py-2 border-b border-[#008C83]/20 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#008C83]" />
            <span className="text-xs text-[#F6F3EB]/60">Akıllı Öneriler</span>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {suggestions.map((suggestion, index) => {
              const isHighlighted = index === highlightedIndex;
              const isPreset = suggestion.type === 'preset';
              const preset = isPreset
                ? FILTER_PRESETS.find((p) => p.id === suggestion.presetId)
                : null;

              return (
                <button
                  key={`${suggestion.type}-${suggestion.text}-${index}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`
                    w-full text-left px-4 py-3 flex items-start gap-3 transition-colors
                    ${
                      isHighlighted
                        ? 'bg-[#008C83]/20'
                        : 'hover:bg-[#F6F3EB]/5'
                    }
                  `}
                >
                  <span className="text-xl mt-0.5">{getSuggestionIcon(suggestion.type)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#F6F3EB] font-medium">
                        {suggestion.text}
                      </span>
                      <span className="text-xs text-[#008C83] bg-[#008C83]/10 px-2 py-0.5 rounded-full">
                        {getSuggestionTypeLabel(suggestion.type)}
                      </span>
                    </div>
                    {preset && (
                      <div className="text-xs text-[#F6F3EB]/60 mt-1">
                        {preset.description}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="px-4 py-2 border-t border-[#008C83]/20 text-xs text-[#F6F3EB]/40">
            ↑↓ ile gezin • Enter ile seç • Esc ile kapat
          </div>
        </div>
      )}
    </div>
  );
}


