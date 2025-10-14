import React from 'react';
import { ReactNode } from 'react';

interface RoleCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
  roleValue: 'mentor' | 'mentee';
  onClick: (role: 'mentor' | 'mentee', href: string) => void;
  onShowOnboarding?: () => void;
}

/**
 * Role selection card component for onboarding modal
 * Props:
 * - icon: Icon component to display
 * - title: Role title (e.g., "Mentee olarak başla")
 * - description: Role description text
 * - ctaLabel: Call-to-action button text
 * - href: URL to navigate to when selected
 * - roleValue: Role identifier for tracking
 * - onClick: Function called when card is selected
 * - onShowOnboarding: Function to show onboarding flow
 */
const RoleCard: React.FC<RoleCardProps> = ({
  icon,
  title,
  description,
  ctaLabel,
  href,
  roleValue,
  onClick,
  onShowOnboarding
}) => {
  const handleClick = () => {
    onClick(roleValue, href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 p-6 cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 group transform hover:-translate-y-1"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${title} seçeneğini seç`}
    >
      {/* Icon */}
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
          {icon}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 text-center mb-3">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 text-center mb-6 leading-relaxed">
        {description}
      </p>

      {/* Example Steps */}
      <div className="mb-6">
        <div className="space-y-2">
          {roleValue === 'mentee' ? (
            <>
              <div className="flex items-center text-sm text-gray-500">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3"></div>
                <span>İlgi alanınızı belirleyin</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3"></div>
                <span>Size uygun mentoru seçin</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3"></div>
                <span>Görüşme planlayın</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center text-sm text-gray-500">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3"></div>
                <span>Profilinizi oluşturun</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3"></div>
                <span>Uzmanlık alanlarınızı ekleyin</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3"></div>
                <span>Mentorluk vermeye başlayın</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* CTA Button */}
      <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
        {ctaLabel}
      </button>
    </div>
  );
};

export default RoleCard;