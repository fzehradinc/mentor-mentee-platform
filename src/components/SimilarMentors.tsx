"use client";
import React, { useState, useEffect } from 'react';
import { Star, ArrowRight } from 'lucide-react';

interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  rating: number;
  reviews: number;
  country: string;
  countryCode: string;
  skills: string[];
  about: string;
  price: number;
  currency: string;
  availability: string;
  img: string;
  avatar: string;
  plan: {
    calls: string;
    qa: string;
    response: string;
    support: string;
  };
  category: string;
  subfield: string[];
  badges: string[];
  responseTime: string;
  lastActive: string;
  experience: number;
  sessions: number;
  attendance: number;
}

interface SimilarMentorsProps {
  currentMentorId: string;
}

const SimilarMentors: React.FC<SimilarMentorsProps> = ({ currentMentorId }) => {
  const [similarMentors, setSimilarMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSimilarMentors();
  }, [currentMentorId]);

  const loadSimilarMentors = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const response = await fetch('/src/data/mentors.json');
      const allMentors = await response.json();
      
      // Filter out current mentor and get similar ones
      const filteredMentors = allMentors.filter((mentor: Mentor) => mentor.id !== currentMentorId);
      
      // Simple similarity algorithm - get mentors with similar skills or category
      const currentMentor = allMentors.find((m: Mentor) => m.id === currentMentorId);
      if (currentMentor) {
        const similar = filteredMentors
          .filter((mentor: Mentor) => 
            mentor.category === currentMentor.category ||
            mentor.skills.some(skill => currentMentor.skills.includes(skill))
          )
          .slice(0, 3); // Show max 3 similar mentors
        
        setSimilarMentors(similar);
      }
    } catch (error) {
      console.error('Error loading similar mentors:', error);
      setSimilarMentors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMentorClick = (mentorId: string) => {
    window.location.href = `/mentors/${mentorId}`;
  };

  if (loading) {
    return (
      <div className="bg-[#F6F3EB] rounded-2xl border border-[#E8E3D8] p-6">
        <h3 className="text-lg font-semibold text-[#0C2727] mb-4">Similar Mentors</h3>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#008C83]"></div>
        </div>
      </div>
    );
  }

  if (similarMentors.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#F6F3EB] rounded-2xl border border-[#E8E3D8] p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[#0C2727]">Similar Mentors</h3>
        <button className="flex items-center gap-1 text-sm text-[#008C83] hover:text-[#00A896] transition-colors">
          View all
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {similarMentors.map((mentor) => (
          <div
            key={mentor.id}
            onClick={() => handleMentorClick(mentor.id)}
            className="group cursor-pointer bg-white/50 rounded-xl border border-[#E8E3D8] p-4 hover:bg-white/70 transition-all hover:shadow-md"
          >
            {/* Avatar and Basic Info */}
            <div className="flex items-center gap-3 mb-3">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden ring-1 ring-white/20">
                <img 
                  src={mentor.avatar} 
                  alt={mentor.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48"%3E%3Crect fill="%230C2727" width="48" height="48"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23F6F3EB" font-size="18" font-weight="bold"%3E' + mentor.name.charAt(0) + '%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-[#0C2727] truncate group-hover:text-[#008C83] transition-colors">
                  {mentor.name}
                </h4>
                <p className="text-sm text-[#0C2727]/60 truncate">
                  {mentor.role} @ {mentor.company}
                </p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-2">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium text-[#0C2727]">
                {mentor.rating} ({mentor.reviews})
              </span>
            </div>

            {/* Skills (first 2) */}
            <div className="flex flex-wrap gap-1 mb-3">
              {mentor.skills.slice(0, 2).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 rounded-full text-xs font-medium bg-[#0C2727]/5 text-[#0C2727]/70 border border-[#0C2727]/10"
                >
                  {skill}
                </span>
              ))}
              {mentor.skills.length > 2 && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#0C2727]/5 text-[#0C2727]/50 border border-[#0C2727]/10">
                  +{mentor.skills.length - 2}
                </span>
              )}
            </div>

            {/* Price */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-[#0C2727]/60">Starting from</div>
              <div className="text-lg font-bold text-[#0C2727]">
                ${mentor.price}/month
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarMentors;
