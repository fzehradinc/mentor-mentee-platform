"use client";
import React, { useState } from 'react';
import { Search, ArrowRight, Users, Award, Star } from 'lucide-react';

interface HeroSectionProps {
  onShowAuth?: () => void;
  onShowOnboarding?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onShowAuth, onShowOnboarding }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Handle search functionality
      console.log('Searching for:', searchQuery);
    }
  };

  const handleMenteeClick = () => {
    // Direct navigation to mentee registration
    window.dispatchEvent(new CustomEvent('navigateTo', { detail: 'mentee-register' }));
  };

  const handleMentorClick = () => {
    // Direct navigation to mentor type gate
    window.dispatchEvent(new CustomEvent('navigateTo', { detail: 'mentor-type-gate' }));
  };

  const stats = [
    { label: 'Mentörler', value: '1.200+ uzman', icon: Award },
    { label: 'Mentee\'ler', value: '20.000+ gelişim yolcusu', icon: Users },
    { label: 'Ortalama Puan', value: '⭐ 4.9/5', icon: Star }
  ];

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20 lg:py-32 overflow-hidden">
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
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-gray-700 shadow-sm border border-gray-200/50"
                >
                  <stat.icon className="w-4 h-4" />
                  <span className="text-gray-500">{stat.label}:</span>
                  <span className="text-blue-600 font-semibold">{stat.value}</span>
                </div>
              ))}
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight max-w-2xl mx-auto xl:mx-0 mb-6">
              Deneyimle Geliş, Mentorlukla İlerle
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto xl:mx-0 mb-8">
              Kariyerini yönlendirecek profesyonellerle güvenilir bağlantılar kur. Bimentor, 
              bilgi paylaşımını ve gelişimi aynı çatı altında toplar.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-8">
              <div className="relative max-w-md mx-auto xl:mx-0">
                <label htmlFor="hero-search" className="sr-only">
                  Hangi alanda mentorluk arıyorsunuz?
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="hero-search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Hangi alanda mentorluk arıyorsunuz?"
                    className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200 hover:shadow-md"
                    aria-label="Hangi alanda mentorluk arıyorsunuz?"
                  />
                </div>
              </div>
            </form>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center xl:justify-start mb-12">
              <button
                onClick={handleMenteeClick}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 min-h-[44px]"
              >
                Mentee olarak devam et
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              
              <button
                onClick={handleMentorClick}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-blue-600 bg-white border-2 border-blue-600 rounded-xl hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md min-h-[44px]"
              >
                Mentor olarak katıl
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Column - Illustration */}
          <div className="flex justify-center xl:justify-end animate-fade-in-delay">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200/50">
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Mentorluk Topluluğu
                </h3>
                <p className="text-gray-600">
                  Uzman mentorlarla güvenilir bağlantılar kur
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

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

export default HeroSection;
