"use client";
import React from 'react';

const TrustedBy: React.FC = () => {
  const companies = [
    { name: 'Trendyol', logo: '/logos/trendyol.svg' },
    { name: 'ASELSAN', logo: '/logos/aselsan.svg' },
    { name: 'Arçelik', logo: '/logos/arcelik.svg' },
    { name: 'TÜBİTAK', logo: '/logos/tubitak.svg' },
    { name: 'Havelsan', logo: '/logos/havelsan.svg' },
    { name: 'Getir', logo: '/logos/getir.svg' },
    { name: 'Hepsiburada', logo: '/logos/hepsiburada.svg' }
  ];

  return (
    <section className="py-12 lg:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Bize güvenen kurumlar
          </h2>
          <p className="text-gray-600">
            Türkiye'nin önde gelen şirketleri Bimentor'u tercih ediyor
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 items-center">
          {companies.map((company, index) => (
            <div
              key={company.name}
              className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-2 mx-auto">
                  <span className="text-gray-600 font-semibold text-sm">
                    {company.name.charAt(0)}
                  </span>
                </div>
                <span className="text-xs text-gray-500 font-medium">
                  {company.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
