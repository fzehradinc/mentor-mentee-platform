"use client";
import React from 'react';
import { Calendar, Users, Clock, Star, ArrowRight } from 'lucide-react';
import type { Workshop } from '../../types/workshop';

interface WorkshopCardDarkProps {
  workshop: Workshop;
  onViewDetail?: (slug: string) => void;
  isRecommended?: boolean;
}

export default function WorkshopCardDark({ workshop, onViewDetail, isRecommended }: WorkshopCardDarkProps) {
  const handleClick = () => {
    if (onViewDetail) {
      onViewDetail(workshop.slug);
    }
  };

  return (
    <div className="group rounded-xl2 bg-white border border-gray-200 transition-all hover:border-brand-primary hover:shadow-lg overflow-hidden">
      {/* Recommended Badge */}
      {isRecommended && (
        <div className="absolute top-3 right-3 z-10 rounded-full bg-accent-warm/90 px-3 py-1 text-xs font-medium text-black shadow-lg">
          ⭐ Önerilen
        </div>
      )}

      {/* Image/Thumbnail */}
      <div className="relative h-48 bg-gradient-to-br from-blue-500 to-indigo-600 overflow-hidden">
        {workshop.thumbnail_url ? (
          <img 
            src={workshop.thumbnail_url} 
            alt={workshop.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-white/30">
            {workshop.title.charAt(0)}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 leading-tight">
          {workshop.title}
        </h3>

        {/* Instructor */}
        {workshop.instructor_name && (
          <div className="text-sm text-gray-600">
            {workshop.instructor_name}
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {workshop.description}
        </p>

        {/* Tags */}
        {workshop.tags && workshop.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {workshop.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700 border border-gray-200"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-200">
          <div className="flex items-center gap-4">
            {workshop.date && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{new Date(workshop.date).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' })}</span>
              </div>
            )}
            {workshop.duration_hours && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{workshop.duration_hours}h</span>
              </div>
            )}
            {workshop.participants_count !== undefined && (
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{workshop.participants_count}</span>
              </div>
            )}
          </div>
          
          {workshop.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span>{workshop.rating}</span>
            </div>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={handleClick}
          className="w-full mt-4 flex items-center justify-between px-4 py-3 rounded-lg bg-gray-50 text-gray-900 border border-gray-200 hover:bg-blue-50 hover:border-blue-600 hover:text-blue-600 transition-all"
        >
          <span className="text-sm font-medium">Detayları Gör</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

