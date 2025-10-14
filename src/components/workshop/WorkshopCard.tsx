"use client";
import React from 'react';
import { Calendar, Clock, Users, MapPin, Star, ArrowRight } from 'lucide-react';
import type { Workshop } from '../../types/workshop';
import { CATEGORY_LABELS, LEVEL_LABELS, MODE_LABELS } from '../../types/workshop';

interface WorkshopCardProps {
  workshop: Workshop;
  onView: (slug: string) => void;
}

export default function WorkshopCard({ workshop, onView }: WorkshopCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (priceCents?: number) => {
    if (!priceCents) return 'Talep Et';
    return `${(priceCents / 100).toFixed(0)}₺`;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 group cursor-pointer">
      {/* Cover Image */}
      <div className="relative h-48 bg-gradient-to-br from-green-500 via-purple-600 to-blue-600 overflow-hidden">
        {workshop.cover_image ? (
          <img
            src={workshop.cover_image}
            alt={workshop.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Calendar className="w-16 h-16 text-white/40" />
          </div>
        )}
        
        {/* Category & Level Badge */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-900 rounded-full">
            {CATEGORY_LABELS[workshop.category]}
          </span>
          <span className="px-3 py-1 bg-black/60 backdrop-blur-sm text-xs font-medium text-white rounded-full">
            {LEVEL_LABELS[workshop.level]}
          </span>
        </div>

        {/* Mode Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
            workshop.mode === 'online' 
              ? 'bg-green-100 text-green-800'
              : workshop.mode === 'offline'
              ? 'bg-orange-100 text-orange-800'
              : 'bg-purple-100 text-purple-800'
          }`}>
            {MODE_LABELS[workshop.mode]}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {workshop.title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {workshop.short_desc}
        </p>

        {/* Meta Info */}
        <div className="space-y-2 mb-4">
          {workshop.next_session_at && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>{formatDate(workshop.next_session_at)}</span>
            </div>
          )}

          {workshop.instructors && workshop.instructors.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4 text-gray-400" />
              <span>{workshop.instructors.map(i => i.name).join(', ')}</span>
            </div>
          )}

          {workshop.avg_rating && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="font-medium">{workshop.avg_rating.toFixed(1)}</span>
              <span className="text-gray-400">({workshop.total_reviews} değerlendirme)</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-lg font-bold text-gray-900">
            {formatPrice(workshop.price_cents)}
          </div>
          <button
            onClick={() => onView(workshop.slug)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Detaylar
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

