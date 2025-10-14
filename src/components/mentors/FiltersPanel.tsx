"use client";
import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface FiltersPanelProps {
  onFilterChange: (filters: any) => void;
  onSearchChange: (query: string) => void;
}

export default function FiltersPanel({ onFilterChange, onSearchChange }: FiltersPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<any>({
    areas: [],
    levels: [],
    goals: [],
    budget: 'all',
    languages: [],
    mode: [],
    availability: [],
    badges: []
  });

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearchChange(value);
  };

  const toggleFilter = (category: string, value: string) => {
    const current = filters[category] || [];
    const updated = current.includes(value)
      ? current.filter((v: string) => v !== value)
      : [...current, value];
    
    const newFilters = { ...filters, [category]: updated };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAll = () => {
    setSearchQuery('');
    setFilters({
      areas: [],
      levels: [],
      goals: [],
      budget: 'all',
      languages: [],
      mode: [],
      availability: [],
      badges: []
    });
    onSearchChange('');
    onFilterChange({});
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="rounded-xl bg-base-panel/60 p-4 ring-1 ring-white/10">
      <h4 className="mb-3 text-sm font-semibold text-text-high">{title}</h4>
      {children}
    </div>
  );

  const Chip = ({ category, value, label }: { category: string; value: string; label: string }) => {
    const isSelected = filters[category]?.includes(value);
    
    return (
      <label className={`inline-flex cursor-pointer items-center gap-2 rounded-full px-3 py-1.5 text-xs ring-1 transition-all ${
        isSelected 
          ? 'bg-accent-warm/20 text-accent-warm ring-accent-warm/50' 
          : 'bg-white/5 text-text-high ring-white/10 hover:bg-white/10'
      }`}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => toggleFilter(category, value)}
          className="sr-only"
        />
        {label}
      </label>
    );
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="rounded-xl bg-base-soft p-3 ring-1 ring-white/10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Alan / ders / kurum ara"
            className="w-full pl-10 pr-3 py-2 rounded-md border-0 bg-base-panel/60 text-sm text-text-high placeholder:text-text-dim focus:outline-none focus:ring-2 focus:ring-accent-primary"
          />
        </div>
      </div>

      {/* Clear All */}
      <button
        onClick={clearAll}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-text-dim text-sm hover:bg-white/10 transition-colors"
      >
        <X className="w-4 h-4" />
        Tüm Filtreleri Temizle
      </button>

      {/* Alanlar */}
      <Section title="Alanlar (çoklu)">
        <div className="flex flex-wrap gap-2">
          <Chip category="areas" value="yks" label="YKS (TYT/AYT)" />
          <Chip category="areas" value="lgs" label="LGS" />
          <Chip category="areas" value="uni" label="Üniversite Dersleri" />
          <Chip category="areas" value="ielts" label="Hazırlık / IELTS" />
          <Chip category="areas" value="burs" label="Burs/Portföy" />
          <Chip category="areas" value="yazilim" label="Yazılım" />
          <Chip category="areas" value="tasarim" label="Tasarım" />
        </div>
      </Section>

      {/* Sınıf / Seviye */}
      <Section title="Sınıf / Seviye">
        <div className="flex flex-wrap gap-2">
          <Chip category="levels" value="8" label="8. Sınıf" />
          <Chip category="levels" value="9-12" label="9–12" />
          <Chip category="levels" value="hazirlik" label="Hazırlık" />
          <Chip category="levels" value="lisans" label="Lisans 1–4" />
          <Chip category="levels" value="mezun" label="Mezun" />
        </div>
      </Section>

      {/* Hedef */}
      <Section title="Hedef">
        <div className="flex flex-wrap gap-2">
          <Chip category="goals" value="temel" label="Temel konu eksiği" />
          <Chip category="goals" value="sinav" label="Sınav stratejisi" />
          <Chip category="goals" value="plan" label="Ders planı" />
          <Chip category="goals" value="mock" label="Mock sınav & çözüm" />
          <Chip category="goals" value="basvuru" label="Başvuru/Burs" />
        </div>
      </Section>

      {/* Bütçe */}
      <Section title="Bütçe (TL)">
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-text-dim">
            <span>0–500₺</span>
            <span>500–1000₺</span>
            <span>1000+₺</span>
          </div>
          <input
            type="range"
            min={0}
            max={2}
            step={1}
            value={filters.budget === 'all' ? 1 : filters.budget === 'low' ? 0 : filters.budget === 'mid' ? 1 : 2}
            onChange={(e) => {
              const val = e.target.value;
              const budget = val === '0' ? 'low' : val === '1' ? 'mid' : 'high';
              setFilters({ ...filters, budget });
              onFilterChange({ ...filters, budget });
            }}
            className="w-full accent-accent-warm"
          />
        </div>
      </Section>

      {/* Dil & Görüşme */}
      <Section title="Dil & Görüşme">
        <div className="flex flex-wrap gap-2">
          <Chip category="languages" value="tr" label="TR" />
          <Chip category="languages" value="en" label="EN" />
          <Chip category="languages" value="de" label="DE" />
          <Chip category="mode" value="online" label="Online" />
          <Chip category="mode" value="face" label="Yüz Yüze" />
        </div>
      </Section>

      {/* Uygunluk */}
      <Section title="Uygunluk">
        <div className="flex flex-wrap gap-2">
          <Chip category="availability" value="weekday" label="Hafta içi akşam" />
          <Chip category="availability" value="weekend" label="Hafta sonu" />
          <Chip category="availability" value="flex" label="Esnek" />
        </div>
      </Section>

      {/* Rozetler */}
      <Section title="Rozetler">
        <div className="flex flex-wrap gap-2">
          <Chip category="badges" value="top" label="Top Mentor" />
          <Chip category="badges" value="edu" label="Eğitim Uzmanı" />
          <Chip category="badges" value="new" label="Yeni" />
        </div>
      </Section>
    </div>
  );
}

