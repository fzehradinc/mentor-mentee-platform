import React from 'react';
import { mockMentors } from '../data/mockData';
import HomePageClient from './HomePageClient';

interface HomePageServerProps {
  onViewProfile: (mentorId: string) => void;
  onShowAuth: () => void;
  onShowAppointments: () => void;
  onShowMessages: () => void;
  onShowOnboarding: () => void;
}

/**
 * Server component that fetches mentor data
 * This runs on the server and passes data to client component
 */
const HomePageServer: React.FC<HomePageServerProps> = (props) => {
  // For now, use mock data. In production, this would fetch from API
  const mentors = mockMentors;
  
  // Error handling for data fetching
  if (!mentors || mentors.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Mentörler yükleniyor...
          </h2>
          <p className="text-gray-600">
            Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.
          </p>
        </div>
      </div>
    );
  }

  return <HomePageClient {...props} initialMentors={mentors} />;
};

export default HomePageServer;



