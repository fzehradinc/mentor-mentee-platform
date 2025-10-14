"use client";
import React from 'react';
import { Star, Clock, CheckCircle, MapPin } from 'lucide-react';

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

interface MentorCardProps {
  mentor: Mentor;
}

const MentorCard: React.FC<MentorCardProps> = ({ mentor }) => {
  const handleViewProfile = () => {
    // Navigate to mentor detail page using custom event
    window.dispatchEvent(new CustomEvent('navigateTo', { detail: 'mentor-detail-new' }));
    // Store mentor ID for the detail page
    sessionStorage.setItem('selectedMentorId', mentor.id);
  };

  const handleApplyNow = () => {
    // Handle apply now action
    alert('Apply now functionality coming soon!');
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-[#F6F3EB] border border-[#E8E3D8] transition-all hover:shadow-xl hover:scale-[1.02]">
      {/* Availability Badge */}
      {mentor.availability && (
        <div className="absolute top-4 right-4 z-10 rounded-full bg-[#008C83] px-3 py-1 text-xs font-medium text-white shadow-lg">
          {mentor.availability}
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          {/* Avatar */}
          <div className="relative w-16 h-16 rounded-xl overflow-hidden ring-2 ring-white/20">
            <img 
              src={mentor.avatar} 
              alt={mentor.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect fill="%230C2727" width="64" height="64"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23F6F3EB" font-size="24" font-weight="bold"%3E' + mentor.name.charAt(0) + '%3C/text%3E%3C/svg%3E';
              }}
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {/* Name and Country */}
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-[#0C2727] truncate">
                {mentor.name}
              </h3>
              <span className="text-sm text-[#0C2727]/60 font-medium">
                {mentor.countryCode}
              </span>
            </div>

            {/* Role and Company */}
            <p className="text-sm text-[#0C2727]/80 font-medium">
              {mentor.role} @ {mentor.company}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-1 mt-2">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium text-[#0C2727]">
                {mentor.rating} ({mentor.reviews} Reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Badges */}
        {mentor.badges && mentor.badges.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {mentor.badges.map((badge, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-[#008C83]/10 text-[#008C83] border border-[#008C83]/20"
              >
                {badge === 'Quick Responder' && <CheckCircle className="w-3 h-3" />}
                {badge}
              </span>
            ))}
          </div>
        )}

        {/* About */}
        <p className="text-sm text-[#0C2727]/80 leading-relaxed mb-4 line-clamp-3">
          {mentor.about}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {mentor.skills.slice(0, 4).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 rounded-full text-xs font-medium bg-[#0C2727]/5 text-[#0C2727]/80 border border-[#0C2727]/10"
            >
              {skill}
            </span>
          ))}
          {mentor.skills.length > 4 && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#0C2727]/5 text-[#0C2727]/60 border border-[#0C2727]/10">
              +{mentor.skills.length - 4} more
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 rounded-lg bg-[#0C2727]/5 border border-[#0C2727]/10">
            <div className="flex items-center justify-center gap-1 text-xs text-[#0C2727]/60">
              <Star className="w-3 h-3" />
              {mentor.rating}
            </div>
          </div>
          <div className="text-center p-2 rounded-lg bg-[#0C2727]/5 border border-[#0C2727]/10">
            <div className="flex items-center justify-center gap-1 text-xs text-[#0C2727]/60">
              <Clock className="w-3 h-3" />
              {mentor.sessions} sessions
            </div>
          </div>
          <div className="text-center p-2 rounded-lg bg-[#0C2727]/5 border border-[#0C2727]/10">
            <div className="flex items-center justify-center gap-1 text-xs text-[#0C2727]/60">
              <CheckCircle className="w-3 h-3" />
              {mentor.attendance}%
            </div>
          </div>
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div className="text-left">
            <div className="text-xs text-[#0C2727]/60">Starting from</div>
            <div className="text-2xl font-bold text-[#0C2727]">
              ${mentor.price}/month
            </div>
          </div>
          <button
            onClick={handleViewProfile}
            className="px-4 py-2 bg-gradient-to-r from-[#008C83] to-[#00A896] text-white rounded-lg hover:from-[#007A73] hover:to-[#009688] transition-all font-medium text-sm"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentorCard;
