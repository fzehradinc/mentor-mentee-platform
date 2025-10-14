"use client";
import React from 'react';
import { Filter, X } from 'lucide-react';
import type { WorkshopFilters } from '../../types/workshop';
import { CATEGORY_LABELS, LEVEL_LABELS, MODE_LABELS } from '../../types/workshop';

interface WorkshopFiltersProps {
  filters: WorkshopFilters;
  onChange: (filters: WorkshopFilters) => void;
  onClear: () => void;
}

export default function WorkshopFiltersComponent({ filters, onChange, onClear }: WorkshopFiltersProps) {
  const hasActiveFilters = filters.category || filters.level || filters.mode;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filtreler</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            <X className="w-4 h-4" />
            Temizle
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
          <select
            value={filters.category || ''}
            onChange={(e) => onChange({ ...filters, category: e.target.value as any || undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tümü</option>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        {/* Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Seviye</label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(LEVEL_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => onChange({ 
                  ...filters, 
                  level: filters.level === key ? undefined : key as any 
                })}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filters.level === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Mode */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mod</label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(MODE_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => onChange({ 
                  ...filters, 
                  mode: filters.mode === key ? undefined : key as any 
                })}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filters.mode === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


