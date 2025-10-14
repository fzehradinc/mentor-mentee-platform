"use client";
import React from 'react';
import { Building, Star, Clock, CheckCircle } from 'lucide-react';

interface MentorCardDarkProps {
  mentor: {
    id: string;
    name: string;
    country: string;
    title: string;
    bio: string;
    tags: string[];
    rating: number;
    sessions: number;
    attendance: number;
    price: number;
    badges?: string[];
    spots?: number;
    avatar: string;
    company?: string;
    email?: string;
    isRegistered?: boolean;
  };
}

export default function MentorCardDark({ mentor }: MentorCardDarkProps) {
  const handleViewProfile = () => {
    window.dispatchEvent(new CustomEvent('navigateTo', { detail: 'mentor-detail' }));
  };

  const handleBookSession = () => {
    alert('Seans alma özelliği yakında eklenecek');
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-base-soft ring-1 ring-white/10 transition-all hover:ring-accent-warm/50 hover:shadow-xl">
      {/* Spot Badge (üst sağ) */}
      {mentor.spots && (
        <div className="absolute top-3 right-3 z-10 rounded-full bg-accent-warm/90 px-3 py-1 text-xs font-medium text-black shadow-lg">
          Sadece {mentor.spots} kontenjan
        </div>
      )}

      <div className="flex flex-col gap-4 p-5 md:flex-row">
        {/* Avatar */}
        <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/10">
          <img 
            src={mentor.avatar} 
            alt={mentor.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="160" height="160"%3E%3Crect fill="%231B2A41" width="160" height="160"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23E6EDF3" font-size="48" font-weight="bold"%3E' + mentor.name.charAt(0) + '%3C/text%3E%3C/svg%3E';
            }}
          />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Name + Country + Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h3 className="truncate text-lg font-semibold text-text-high">
              {mentor.name}
            </h3>
            <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-text-dim ring-1 ring-white/10">
              {mentor.country}
            </span>
            {mentor.company && (
              <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-xs text-purple-300 ring-1 ring-purple-500/30 flex items-center gap-1">
                <Building className="w-3 h-3" />
                Kurumsal
              </span>
            )}
            {mentor.isRegistered && (
              <span className="rounded-full bg-accent-warm/20 px-2 py-0.5 text-xs text-accent-warm ring-1 ring-accent-warm/50 font-semibold animate-pulse">
                ⭐ Yeni
              </span>
            )}
            {mentor.badges?.filter(b => b !== 'Yeni').map((badge) => (
              <span
                key={badge}
                className="rounded-full bg-accent-primary/10 px-2 py-0.5 text-xs text-accent-primary ring-1 ring-accent-primary/30"
              >
                {badge}
              </span>
            ))}
          </div>

          {/* Title */}
          <p className="text-sm text-text-dim mb-2">{mentor.title}</p>

          {/* Bio */}
          <p className="line-clamp-2 text-sm text-text-high/90 leading-relaxed mb-3">
            {mentor.bio}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {mentor.tags?.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-text-high ring-1 ring-white/10"
              >
                {tag}
              </span>
            ))}
            {mentor.tags?.length > 4 && (
              <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-text-dim ring-1 ring-white/10">
                +{mentor.tags.length - 4}
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs text-text-dim">
            <div className="rounded-lg bg-white/5 p-2 ring-1 ring-white/10">
              <Star className="w-3 h-3 inline text-yellow-400 fill-yellow-400 mr-1" />
              {mentor.rating}
            </div>
            <div className="rounded-lg bg-white/5 p-2 ring-1 ring-white/10">
              <Clock className="w-3 h-3 inline text-text-dim mr-1" />
              {mentor.sessions} seans
            </div>
            <div className="rounded-lg bg-white/5 p-2 ring-1 ring-white/10">
              <CheckCircle className="w-3 h-3 inline text-green-400 mr-1" />
              {mentor.attendance}%
            </div>
          </div>
        </div>

        {/* Actions (Sağ) */}
        <div className="flex w-full flex-col items-end gap-2 md:w-40">
          <div className="text-right">
            <div className="text-xs text-text-dim">Saatlik</div>
            <div className="text-2xl font-bold text-text-high">{mentor.price}₺</div>
          </div>
          <button
            onClick={handleViewProfile}
            className="w-full rounded-lg bg-white/5 px-4 py-2.5 text-sm font-medium text-text-high ring-1 ring-white/10 hover:bg-white/10 transition-colors"
          >
            Profili Gör
          </button>
          <button
            onClick={handleBookSession}
            className="w-full rounded-lg bg-accent-warm px-4 py-2.5 text-sm font-semibold text-black hover:bg-amber-400 transition-colors shadow-lg"
          >
            Seans Al
          </button>
        </div>
      </div>
    </div>
  );
}

