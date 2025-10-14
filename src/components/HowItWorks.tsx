"use client";
import React from 'react';
import { User, Search, CreditCard, ArrowRight } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: 1,
      title: 'Profilini oluştur',
      description: 'Hedeflerini ve ilgi alanlarını belirt, sana uygun mentorları keşfet.',
      icon: User,
      color: 'bg-blue-500'
    },
    {
      number: 2,
      title: 'Doğru mentoru seç',
      description: 'Akıllı eşleştirme sistemiyle sana en uygun mentoru bul.',
      icon: Search,
      color: 'bg-green-500'
    },
    {
      number: 3,
      title: 'Güvenli ödeme ile seans planla',
      description: 'Escrow sistemiyle güvenli ödeme yap, seansını planla.',
      icon: CreditCard,
      color: 'bg-purple-500'
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Nasıl Çalışır?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Bimentor ile mentorluk sürecinizi kolayca başlatın
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Step Card */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                {/* Icon */}
                <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>

                {/* Step Number */}
                <div className="text-4xl font-bold text-gray-200 mb-4">
                  {step.number}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Arrow (except for last step) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 lg:-right-6 transform -translate-y-1/2 z-10">
                  <div className="bg-white rounded-full p-2 shadow-lg">
                    <ArrowRight className="w-6 h-6 text-gray-400" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6">
            Hemen başlamaya hazır mısın?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
              Mentee olarak başla
            </button>
            <button className="inline-flex items-center px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors">
              Mentor olarak katıl
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
