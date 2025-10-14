"use client";
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import LoginModal from './LoginModal';
import RoleSelectModal from './RoleSelectModal';

interface HeaderProps {
  onShowAuth?: () => void;
  onShowOnboarding?: () => void;
  onMenteeSelect?: () => void;
  onMentorSelect?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onShowAuth, onShowOnboarding, onMenteeSelect, onMentorSelect }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRoleSelectOpen, setIsRoleSelectOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const handleOpenRoleSelect = () => {
      setIsRoleSelectOpen(true);
    };

    const handleOpenLogin = () => {
      setIsLoginModalOpen(true);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('openRoleSelectModal', handleOpenRoleSelect);
    window.addEventListener('openLoginModal', handleOpenLogin);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('openRoleSelectModal', handleOpenRoleSelect);
      window.removeEventListener('openLoginModal', handleOpenLogin);
    };
  }, []);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const handleRegisterClick = () => {
    setIsRoleSelectOpen(true);
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a
              href="/"
              className="flex items-center space-x-2 text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
            >
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center relative">
                <span className="text-white font-bold text-sm">B</span>
                {/* Küçük arı çizimi */}
                <div className="absolute -top-1 -right-1 w-3 h-3">
                  <svg viewBox="0 0 12 12" className="w-full h-full">
                    <circle cx="6" cy="4" r="2" fill="#FFD700" />
                    <circle cx="4" cy="3" r="1" fill="#FFD700" />
                    <circle cx="8" cy="3" r="1" fill="#FFD700" />
                    <path d="M6 6 L4 8 L6 10 L8 8 Z" fill="#FFD700" />
                    <path d="M2 4 L4 6" stroke="#FFA500" strokeWidth="0.5" />
                    <path d="M10 4 L8 6" stroke="#FFA500" strokeWidth="0.5" />
                  </svg>
                </div>
              </div>
              <span>Bimentor</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('navigateTo', { detail: 'home' }))}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Ana Sayfa
            </button>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('navigateTo', { detail: 'mentors-bimentor' }))}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Mentörler
            </button>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('navigateTo', { detail: 'workshops' }))}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Workshoplar
            </button>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={handleLoginClick}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Giriş Yap
            </button>
            <button
              onClick={handleRegisterClick}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Kayıt Ol
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
            aria-expanded={isMobileMenuOpen}
            aria-label="Menüyü aç"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('navigateTo', { detail: 'home' }));
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
              >
                Ana Sayfa
              </button>
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('navigateTo', { detail: 'mentors-bimentor' }));
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
              >
                Mentörler
              </button>
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('navigateTo', { detail: 'workshops' }));
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
              >
                Workshoplar
              </button>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <button
                  onClick={handleLoginClick}
                  className="w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
                >
                  Giriş Yap
                </button>
                <button
                  onClick={handleRegisterClick}
                  className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 font-medium mt-2"
                >
                  Kayıt Ol
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Login Modal */}
      <LoginModal
        open={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* Role Select Modal */}
      <RoleSelectModal
        open={isRoleSelectOpen}
        onClose={() => setIsRoleSelectOpen(false)}
        onMenteeSelect={onMenteeSelect}
        onMentorSelect={onMentorSelect}
      />
    </header>
  );
};

export default Header;
