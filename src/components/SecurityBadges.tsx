"use client";
import React from 'react';
import { Shield, Lock, RefreshCw } from 'lucide-react';

const SecurityBadges: React.FC = () => {
  const badges = [
    {
      icon: Shield,
      title: 'KVKK uyumlu veri işleme',
      description: 'Kişisel verileriniz güvenli şekilde işlenir'
    },
    {
      icon: Lock,
      title: 'Güvenli ödeme (escrow)',
      description: 'Ödemeleriniz güvenli escrow sistemiyle korunur'
    },
    {
      icon: RefreshCw,
      title: 'İlk seans memnuniyet garantisi',
      description: 'İlk seansınızdan memnun kalmazsanız iade'
    }
  ];

  return (
    <section className="py-12 lg:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Güvenli ve Güvenilir Platform
          </h2>
          <p className="text-gray-600">
            Bimentor'da güvenlik ve memnuniyet önceliğimizdir
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 text-center"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <badge.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {badge.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {badge.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SecurityBadges;
