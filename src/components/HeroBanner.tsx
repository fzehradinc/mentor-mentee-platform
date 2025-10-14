import React, { useState } from 'react';
import { Search, ArrowRight, Users, Star, Award } from 'lucide-react';
import AvatarStrip from './AvatarStrip';
import RoleSelectModal from './RoleSelectModal';
import { trustBadges, kpis, heroContent } from '../data/trustBadges';

interface HeroBannerProps {
  title?: string;
  subtitle?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  showSearch?: boolean;
  kpis?: Array<{ label: string; value: string }>;
  badges?: string[];
  language?: 'tr' | 'en';
  onShowOnboarding?: () => void;
}

const HeroBanner: React.FC<HeroBannerProps> = ({
  title,
  subtitle,
  primaryCtaLabel,
  primaryCtaHref = '#',
  secondaryCtaLabel,
  secondaryCtaHref = '/mentorler',
  showSearch = true,
  kpis: propKpis,
  badges = trustBadges,
  language = 'tr',
  onShowOnboarding
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const content = heroContent[language];
  const displayKpis = propKpis || kpis;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/mentorler?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const handlePrimaryCtaClick = () => {
    setIsRoleModalOpen(true);
  };

  const handleSecondaryCtaClick = () => {
    window.location.href = secondaryCtaHref;
  };

  const getKpiIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case 'topluluk':
      case 'community':
        return <Users className="w-4 h-4" />;
      case 'mentör':
      case 'mentor':
        return <Award className="w-4 h-4" />;
      case 'ortalama puan':
      case 'average rating':
        return <Star className="w-4 h-4" />;
      default:
        return <Star className="w-4 h-4" />;
    }
  };

  return (
    <section 
      className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20 lg:py-32 overflow-hidden"
      data-testid="hero-banner"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column - Content */}
          <div className="text-center xl:text-left animate-fade-in">
            {/* KPI Badges */}
            <div className="flex flex-wrap justify-center xl:justify-start gap-3 mb-8">
              {displayKpis.map((kpi, index) => (
                <div
                  key={index}
                  className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-gray-700 shadow-sm border border-gray-200/50"
                >
                  {getKpiIcon(kpi.label)}
                  <span className="text-gray-500">{kpi.label}:</span>
                  <span className="text-blue-600 font-semibold">{kpi.value}</span>
                </div>
              ))}
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight max-w-2xl mx-auto xl:mx-0 mb-6">
              {title || content.title}
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto xl:mx-0 mb-8">
              {subtitle || content.subtitle}
            </p>

            {/* Search Bar */}
            {showSearch && (
              <form onSubmit={handleSearch} className="mb-8">
                <div className="relative max-w-md mx-auto xl:mx-0">
                  <label htmlFor="hero-search" className="sr-only">
                    {content.searchPlaceholder}
                  </label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="hero-search"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={content.searchPlaceholder}
                      className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200 hover:shadow-md"
                      aria-label={content.searchPlaceholder}
                    />
                  </div>
                </div>
              </form>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center xl:justify-start mb-12">
              <button
                onClick={handlePrimaryCtaClick}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 min-h-[44px]"
                aria-label={primaryCtaLabel || content.primaryCtaLabel}
              >
                {primaryCtaLabel || content.primaryCtaLabel}
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              
              <button
                onClick={handleSecondaryCtaClick}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-blue-600 bg-white border-2 border-blue-600 rounded-xl hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md min-h-[44px]"
                aria-label={secondaryCtaLabel || content.secondaryCtaLabel}
              >
                <span>{secondaryCtaLabel || content.secondaryCtaLabel}</span>
                <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Column - Avatar Strip */}
          <div className="flex justify-center xl:justify-end animate-fade-in-delay">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200/50">
              <AvatarStrip communityText={content.communityText} />
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 pt-8 border-t border-gray-200/50">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500 mb-6">
              {content.trustText}
            </p>
            <div className="flex flex-wrap justify-center items-center gap-6 lg:gap-8">
              {badges.map((badge, index) => (
                <div
                  key={index}
                  className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg text-sm font-semibold text-gray-600 shadow-sm border border-gray-200/50 hover:shadow-md transition-shadow duration-200"
                >
                  {badge}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Role Selection Modal */}
      <RoleSelectModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
      />

      {/* Custom Styles */}
      <style>{`
        .bg-grid-pattern {
          background-image: radial-gradient(circle, #e5e7eb 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
          opacity: 0;
          transform: translateY(20px);
        }
        
        .animate-fade-in-delay {
          animation: fadeIn 0.8s ease-out 0.2s forwards;
          opacity: 0;
          transform: translateY(20px);
        }
        
        @keyframes fadeIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default HeroBanner;