"use client";
import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  fallback?: string;
  onBack?: () => void;
  className?: string;
}

export default function BackButton({ fallback, onBack, className = '' }: BackButtonProps) {
  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    if (typeof window !== 'undefined') {
      if (window.history.length > 1) {
        window.history.back();
      } else if (fallback) {
        window.dispatchEvent(new CustomEvent('navigateTo', { detail: fallback }));
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`inline-flex items-center gap-2 text-[#1E1B4B] hover:text-[#1E1B4B]/80 transition-colors ${className}`}
      aria-label="Önceki sayfaya dön"
    >
      <ArrowLeft className="h-4 w-4" />
      <span>Geri</span>
    </button>
  );
}

