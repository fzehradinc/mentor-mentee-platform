"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "Search by company, skills or role",
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(query);
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [query, onSearch]);

  const handleClear = () => {
    setQuery('');
    onSearch('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 bg-[#1A3A3A] border border-white/10 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#008C83] focus:border-[#008C83] transition-all"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search suggestions (optional) */}
      {isFocused && query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1A3A3A] border border-white/10 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
          <div className="p-3">
            <div className="text-xs text-white/60 mb-2">Popular searches</div>
            <div className="space-y-1">
              <button
                onClick={() => {
                  setQuery('Data Science');
                  onSearch('Data Science');
                }}
                className="w-full text-left px-3 py-2 text-sm text-white/80 hover:bg-white/5 rounded-lg transition-colors"
              >
                Data Science
              </button>
              <button
                onClick={() => {
                  setQuery('Machine Learning');
                  onSearch('Machine Learning');
                }}
                className="w-full text-left px-3 py-2 text-sm text-white/80 hover:bg-white/5 rounded-lg transition-colors"
              >
                Machine Learning
              </button>
              <button
                onClick={() => {
                  setQuery('Product Manager');
                  onSearch('Product Manager');
                }}
                className="w-full text-left px-3 py-2 text-sm text-white/80 hover:bg-white/5 rounded-lg transition-colors"
              >
                Product Manager
              </button>
              <button
                onClick={() => {
                  setQuery('React');
                  onSearch('React');
                }}
                className="w-full text-left px-3 py-2 text-sm text-white/80 hover:bg-white/5 rounded-lg transition-colors"
              >
                React
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
