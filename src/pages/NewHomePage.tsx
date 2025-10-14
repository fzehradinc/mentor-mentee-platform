"use client";
import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import TrustedBy from '../components/TrustedBy';
import FeaturedMentors from '../components/FeaturedMentors';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';
import SecurityBadges from '../components/SecurityBadges';
import AppFooter from '../components/AppFooter';

interface NewHomePageProps {
  onViewProfile: (mentorId: string) => void;
  onShowAuth: () => void;
  onShowAppointments: () => void;
  onShowMessages: () => void;
  onShowOnboarding: () => void;
  onMenteeSelect?: () => void;
  onMentorSelect?: () => void;
}

const NewHomePage: React.FC<NewHomePageProps> = ({
  onViewProfile,
  onShowAuth,
  onShowAppointments,
  onShowMessages,
  onShowOnboarding,
  onMenteeSelect,
  onMentorSelect
}) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header 
        onShowAuth={onShowAuth} 
        onShowOnboarding={onShowOnboarding}
        onMenteeSelect={onMenteeSelect}
        onMentorSelect={onMentorSelect}
      />

      {/* Hero Section */}
      <HeroSection 
        onShowAuth={onShowAuth} 
        onShowOnboarding={onShowOnboarding} 
      />

      {/* Trusted By Section */}
      <TrustedBy />

      {/* Featured Mentors Section */}
      <FeaturedMentors onViewProfile={onViewProfile} />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Testimonials Section */}
      <Testimonials />

      {/* Security Badges Section */}
      <SecurityBadges />

      {/* Footer */}
      <AppFooter />
    </div>
  );
};

export default NewHomePage;
