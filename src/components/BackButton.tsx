"use client";
import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  fallback?: string;
  className?: string;
}

export default function BackButton({ fallback = 'mentee-dashboard', className = '' }: BackButtonProps) {
  const goBack = () => {
    if (typeof window !== 'undefined') {
      // Always try to go back in history
      // Browser will handle whether there's a previous page or not
      window.history.back();
    }
  };

  return (
    <button
      type="button"
      onClick={goBack}
      className={`inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors ${className}`}
      aria-label="Geri"
    >
      <ArrowLeft className="h-4 w-4" />
      <span>Geri</span>
    </button>
  );
}

