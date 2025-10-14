import React, { useState, useEffect } from 'react';
import { Star, Clock, CheckCircle, MapPin, Heart, ArrowLeft, Building } from 'lucide-react';
import MentorPlan from '../../components/MentorPlan';
import SimilarMentors from '../../components/SimilarMentors';

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

const MentorDetailPage: React.FC = () => {
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const mentorId = sessionStorage.getItem('selectedMentorId');
    if (mentorId) {
      loadMentor(mentorId);
    }
  }, []);

  const loadMentor = async (mentorId: string) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = await fetch('/src/data/mentors.json');
      const mentors = await response.json();
      const foundMentor = mentors.find((m: Mentor) => m.id === mentorId);
      
      if (foundMentor) {
        setMentor(foundMentor);
      } else {
        handleGoBack();
      }
    } catch (error) {
      console.error('Error loading mentor:', error);
      handleGoBack();
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    window.dispatchEvent(
      new CustomEvent('navigate', { detail: { view: 'mentors-bimentor' } })
    );
  };

  const handleSave = () => {
    setSaved(!saved);
    // TODO: Implement save functionality
  };

  const handleApply = () => {
    alert('Apply functionality coming soon!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0C2727] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#008C83]"></div>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="min-h-screen bg-[#0C2727] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-white mb-4">Mentor not found</h1>
          <button
            onClick={handleGoBack}
            className="px-6 py-3 bg-[#008C83] text-white rounded-lg hover:bg-[#007A73] transition-colors"
          >
            Back to Mentors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0C2727] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-gradient-to-b from-[#0C2727]/80 to-[#0C2727]">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#008C83] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xl font-semibold">MentorCruise</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-white/80 hover:text-white transition-colors">Engineering Mentors</a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">Design Mentors</a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">Startup Mentor</a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">AI Mentors</a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">Product Managers</a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">Marketing Coaches</a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">Leadership Mentors</a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">Care</a>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button className="text-white/80 hover:text-white transition-colors">For Businesses</button>
              <button className="px-4 py-2 border border-white/20 rounded-lg hover:bg-white/5 transition-colors">
                Login
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-[#008C83] to-[#00A896] text-white rounded-lg hover:from-[#007A73] hover:to-[#009688] transition-all">
                Browse all mentors
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-sm text-white/60">
          <span>🏠</span>
          <button 
            onClick={handleGoBack}
            className="hover:text-white transition-colors"
          >
            Find a Mentor
          </button>
          <span>→</span>
          <span className="text-white">{mentor.name}</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          {/* Left Column - Mentor Profile */}
          <div className="space-y-6">
            {/* Mentor Card */}
            <div className="bg-[#F6F3EB] rounded-2xl border border-[#E8E3D8] p-8">
              {/* Header */}
              <div className="flex items-start gap-6 mb-6">
                {/* Avatar */}
                <div className="relative w-24 h-24 rounded-xl overflow-hidden ring-2 ring-white/20">
                  <img 
                    src={mentor.avatar} 
                    alt={mentor.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Crect fill="%230C2727" width="96" height="96"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23F6F3EB" font-size="36" font-weight="bold"%3E' + mentor.name.charAt(0) + '%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1">
                  {/* Badges */}
                  {mentor.badges && mentor.badges.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
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

                  {/* Name and Role */}
                  <h1 className="text-2xl font-bold text-[#0C2727] mb-1">
                    {mentor.name}
                  </h1>
                  <p className="text-lg text-[#0C2727]/80 font-medium mb-2">
                    {mentor.role} @ {mentor.company}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSave}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                        saved 
                          ? 'bg-[#008C83] text-white border-[#008C83]' 
                          : 'bg-white/5 text-white/80 border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                      {saved ? 'Saved' : 'Save'}
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 bg-white/5 text-white/80 border border-white/20 rounded-lg hover:bg-white/10 transition-colors">
                      <Building className="w-4 h-4" />
                      LinkedIn
                    </button>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-lg font-semibold text-[#0C2727]">
                  {mentor.rating} ({mentor.reviews} reviews)
                </span>
              </div>

              {/* Specialization */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-[#0C2727]/60 mb-2">Specialization</h3>
                <p className="text-[#008C83] font-medium">
                  Preparation for Landing a {mentor.category} Job
                </p>
              </div>

              {/* Location and Activity */}
              <div className="flex items-center gap-6 mb-6 text-sm text-[#0C2727]/80">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {mentor.country}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {mentor.lastActive}
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  {mentor.responseTime}
                </div>
              </div>

              {/* Skills */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-[#0C2727]/60 mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {mentor.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full text-sm font-medium bg-[#0C2727]/5 text-[#0C2727]/80 border border-[#0C2727]/10"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* About */}
              <div>
                <h3 className="text-sm font-medium text-[#0C2727]/60 mb-3">About</h3>
                <p className="text-[#0C2727]/80 leading-relaxed">
                  {mentor.about}
                </p>
              </div>
            </div>

            {/* Similar Mentors */}
            <SimilarMentors currentMentorId={mentor.id} />
          </div>

          {/* Right Column - Mentorship Plan */}
          <div>
            <MentorPlan
              price={mentor.price}
              currency={mentor.currency}
              plan={mentor.plan}
              availability={mentor.availability}
              onApply={handleApply}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDetailPage;
