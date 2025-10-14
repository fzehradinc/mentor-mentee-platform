"use client";
import React from 'react';
import { Star, MapPin, Award, CheckCircle } from 'lucide-react';
import { mockMentors } from '../data/mockData';

interface FeaturedMentorsProps {
  onViewProfile: (mentorId: string) => void;
}

const FeaturedMentors: React.FC<FeaturedMentorsProps> = ({ onViewProfile }) => {
  const featuredMentors = mockMentors.slice(0, 6);
  const categories = ['Yazılım', 'Veri/AI', 'Tasarım', 'Girişimcilik', 'Liderlik', 'Pazarlama'];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Uzmanlık Alanına Göre Mentorları Keşfet
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Yazılım, veri/AI, tasarım, liderlik ve daha fazlası. 
            Alanında uzman mentorlarla hedeflerine ulaş.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors font-medium text-sm"
            >
              {category}
            </button>
          ))}
        </div>

        {/* Mentors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredMentors.map((mentor) => (
            <div
              key={mentor.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* Mentor Image */}
              <div className="relative">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={mentor.imageUrl}
                    alt={mentor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                {/* Verified Badge */}
                {mentor.isVerified && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-blue-500 text-white p-2 rounded-full shadow-lg">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                  </div>
                )}
              </div>

              {/* Mentor Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {mentor.name}
                    </h3>
                    <p className="text-blue-600 font-semibold mb-1">
                      {mentor.title}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {mentor.company}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-semibold text-gray-900">
                      {mentor.rating}
                    </span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{mentor.location}</span>
                </div>

                {/* Expertise Areas */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {mentor.expertiseAreas.slice(0, 3).map((area, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium"
                    >
                      {area}
                    </span>
                  ))}
                  {mentor.expertiseAreas.length > 3 && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                      +{mentor.expertiseAreas.length - 3}
                    </span>
                  )}
                </div>

                {/* Experience & Sessions */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center text-gray-600">
                    <Award className="w-4 h-4 mr-1" />
                    <span className="text-sm">{mentor.experienceYears} yıl deneyim</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {mentor.sessions} seans
                  </div>
                </div>

                {/* Price */}
                {mentor.hourlyRate && (
                  <div className="text-center mb-6">
                    <span className="text-2xl font-bold text-gray-900">
                      ₺{mentor.hourlyRate}
                    </span>
                    <span className="text-gray-600 text-sm">/saat</span>
                  </div>
                )}

                {/* CTA Button */}
                <button
                  onClick={() => onViewProfile(mentor.id)}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  Profil Görüntüle
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <button className="inline-flex items-center px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors">
            Tüm Mentorları Gör
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedMentors;


