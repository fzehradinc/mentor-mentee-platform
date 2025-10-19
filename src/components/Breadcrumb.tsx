import React from 'react';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-2 text-sm ${className}`}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-400" aria-hidden="true" />
            )}

            {isLast ? (
              <span className="text-gray-900 font-medium" aria-current="page">
                {item.label}
              </span>
            ) : item.onClick ? (
              <button
                onClick={item.onClick}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {item.label}
              </button>
            ) : (
              <span className="text-gray-600">{item.label}</span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
