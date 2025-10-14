import React from 'react';
import { CategoryFilter } from '../../types';

interface CategoryFilterBarProps {
  selectedCategory: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
  mentorCounts: Record<CategoryFilter, number>;
}

/**
 * Horizontal category filter bar component
 * Props:
 * - selectedCategory: Currently selected category filter
 * - onCategoryChange: Function called when category changes
 * - mentorCounts: Object containing count of mentors for each category
 */
const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  selectedCategory,
  onCategoryChange,
  mentorCounts
}) => {
  const categories = [
    { key: 'all' as CategoryFilter, label: 'Tümü', icon: '' },
    { key: 'new' as CategoryFilter, label: 'Yeni Gelenler', icon: '✨' },
    { key: 'available-now' as CategoryFilter, label: 'Hemen Uygun', icon: '🟢' },
    { key: 'academic' as CategoryFilter, label: 'Akademik Mentörler', icon: '🎓' },
    { key: 'data-science-software' as CategoryFilter, label: 'Veri Bilimi & Yazılım', icon: '👨‍💻' },
    { key: 'female' as CategoryFilter, label: 'Kadın Mentörler', icon: '🧕' },
    { key: 'entrepreneur' as CategoryFilter, label: 'Girişim Mentörleri', icon: '🚀' },
    { key: 'international' as CategoryFilter, label: 'Yurt Dışı Deneyimli', icon: '🌍' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.key;
          const count = mentorCounts[category.key] || 0;
          
          return (
            <button
              key={category.key}
              onClick={() => onCategoryChange(category.key)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:shadow-sm'
              }`}
            >
              {category.icon && (
                <span className="text-base">{category.icon}</span>
              )}
              <span>{category.label}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                isSelected
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilterBar;