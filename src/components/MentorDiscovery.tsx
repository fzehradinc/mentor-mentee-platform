"use client";
import React from 'react';
import { Search, Filter, Users, Award, Star } from 'lucide-react';
import MentorCard from './MentorCard/MentorCard';
import { mockMentors } from '../data/mockData';

interface MentorDiscoveryProps {
  onViewProfile: (mentorId: string) => void;
}

const MentorDiscovery: React.FC<MentorDiscoveryProps> = ({ onViewProfile }) => {
  // Get featured mentors (first 3 for display)
  const featuredMentors = mockMentors.slice(0, 3);

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Uzmanlık Alanına Göre Mentörları Keşfet
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Veri bilimi, yazılım, tasarım, liderlik ve daha fazlası. 
            Alanında uzman mentörlerle hedeflerine ulaş.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Alan</span>
          </div>
          <div className="flex items-center space-x-2 bg-gray-50 text-gray-700 px-4 py-2 rounded-full">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">Şirket</span>
          </div>
          <div className="flex items-center space-x-2 bg-gray-50 text-gray-700 px-4 py-2 rounded-full">
            <Award className="w-4 h-4" />
            <span className="text-sm font-medium">Deneyim</span>
          </div>
        </div>

        {/* Featured Mentors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {featuredMentors.map((mentor) => (
            <div key={mentor.id} className="group">
              <MentorCard
                mentor={mentor}
                onViewProfile={onViewProfile}
              />
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">1.200+</div>
              <div className="text-gray-600">Uzman Mentör</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">20.000+</div>
              <div className="text-gray-600">Başarılı Eşleşme</div>
            </div>
            <div>
              <div className="flex items-center justify-center text-3xl font-bold text-blue-600 mb-2">
                <Star className="w-8 h-8 text-yellow-400 fill-current mr-1" />
                4.9
              </div>
              <div className="text-gray-600">Ortalama Puan</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Tüm Mentörleri Gör
          </h3>
          <p className="text-gray-600 mb-8">
            Daha fazla uzman mentör keşfet ve hedeflerine ulaş.
          </p>
          <button className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
            <Search className="w-5 h-5 mr-2" />
            Tüm Mentörleri Keşfet
          </button>
        </div>
      </div>
    </section>
  );
};

export default MentorDiscovery;


