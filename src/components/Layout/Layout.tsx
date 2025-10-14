import React, { useState } from 'react';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  onShowAuth?: () => void;
  onShowAppointments?: () => void;
  onShowMessages?: () => void;
  onShowOnboarding?: () => void;
}

/**
 * Main layout component that wraps all pages
 * Props:
 * - children: React nodes to render in the main content area
 * - onShowAuth: Function to show authentication page
 * - onShowAppointments: Function to show appointments page
 * - onShowMessages: Function to show messages page
 * - onShowOnboarding: Function to show onboarding page
 */
const Layout: React.FC<LayoutProps> = ({ children, onShowAuth, onShowAppointments, onShowMessages, onShowOnboarding }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onMenuToggle={toggleMenu} 
        isMenuOpen={isMenuOpen} 
        onShowAuth={onShowAuth}
        onShowAppointments={onShowAppointments}
        onShowMessages={onShowMessages}
      />
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
};

export default Layout;