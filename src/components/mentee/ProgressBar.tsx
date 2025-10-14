"use client";
import React from 'react';

interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange';
  showPercentage?: boolean;
}

export default function ProgressBar({ 
  progress, 
  label, 
  color = 'blue', 
  showPercentage = true 
}: ProgressBarProps) {
  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    purple: 'bg-purple-600',
    orange: 'bg-orange-600'
  };

  const lightColorClasses = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    purple: 'bg-purple-100',
    orange: 'bg-orange-100'
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showPercentage && (
            <span className="text-sm font-semibold text-gray-900">{progress}%</span>
          )}
        </div>
      )}
      <div className={`w-full h-2.5 ${lightColorClasses[color]} rounded-full overflow-hidden`}>
        <div
          className={`h-full ${colorClasses[color]} transition-all duration-300 ease-out`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
}


