"use client";
import React from 'react';
import { ArrowRight, Users, UserPlus } from 'lucide-react';

interface CTASectionProps {
  onShowAuth?: () => void;
  onShowOnboarding?: () => void;
}

const CTASection: React.FC<CTASectionProps> = ({ onShowAuth, onShowOnboarding }) => {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-blue-600 to-indigo-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Sen de MentorHub topluluğuna katıl
          </h2>
          <p className="text-xl text-blue-100 mb-12 leading-relaxed">
            Bilgini paylaş, gelişimini hızlandır, birlikte büyüyelim.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={onShowAuth}
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Mentör Ol
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            
            <button
              onClick={onShowOnboarding}
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white border-2 border-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-200"
            >
              <Users className="w-5 h-5 mr-2" />
              Mentee Ol
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-8 border-t border-blue-500/30">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="text-white">
                <div className="text-2xl font-bold mb-2">Güvenli</div>
                <div className="text-blue-100 text-sm">KVKK uyumlu platform</div>
              </div>
              <div className="text-white">
                <div className="text-2xl font-bold mb-2">Profesyonel</div>
                <div className="text-blue-100 text-sm">Doğrulanmış uzmanlar</div>
              </div>
              <div className="text-white">
                <div className="text-2xl font-bold mb-2">Etkili</div>
                <div className="text-blue-100 text-sm">Kanıtlanmış sonuçlar</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;


