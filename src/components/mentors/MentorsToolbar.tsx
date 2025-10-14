"use client";
import React from 'react';
import { Bookmark, Bell } from 'lucide-react';

interface MentorsToolbarProps {
  total: number;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export default function MentorsToolbar({ total, sortBy, onSortChange }: MentorsToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-base-soft p-4 ring-1 ring-white/10">
      <div className="text-sm text-text-dim">
        {total.toLocaleString()}+ mentor bulundu
      </div>

      <div className="flex items-center gap-2">
        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="rounded-md bg-base-panel/60 px-3 py-2 text-sm text-text-high ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-accent-primary"
        >
          <option value="recommended">Önerilen</option>
          <option value="rating">En yüksek puan</option>
          <option value="sessions">En çok seans</option>
          <option value="availability">Uygunluk</option>
          <option value="price-asc">Fiyat (artan)</option>
          <option value="price-desc">Fiyat (azalan)</option>
        </select>

        {/* Save Search */}
        <button
          className="rounded-md bg-white/5 px-3 py-2 text-sm ring-1 ring-white/10 hover:bg-white/10 transition-colors flex items-center gap-2"
          title="Aramayı kaydet"
        >
          <Bookmark className="w-4 h-4" />
          <span className="hidden sm:inline">Kaydet</span>
        </button>

        {/* Alert */}
        <button
          className="rounded-md bg-white/5 px-3 py-2 text-sm ring-1 ring-white/10 hover:bg-white/10 transition-colors flex items-center gap-2"
          title="Bildirim al"
        >
          <Bell className="w-4 h-4" />
          <span className="hidden sm:inline">Bildirim al</span>
        </button>
      </div>
    </div>
  );
}

