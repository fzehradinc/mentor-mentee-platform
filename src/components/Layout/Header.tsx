import React from 'react';
import { User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
  onShowAuth?: () => void;
  onShowAppointments?: () => void;
  onShowMessages?: () => void;
}

/**
 * Header component with navigation and user controls
 * Props:
 * - onMenuToggle: Function to toggle mobile menu
 * - isMenuOpen: Boolean indicating if mobile menu is open
 * - onShowAuth: Function to show authentication page
 * - onShowAppointments: Function to show appointments page
 * - onShowMessages: Function to show messages page
 */
const Header: React.FC<HeaderProps> = ({ 
  onMenuToggle, 
  isMenuOpen, 
  onShowAuth, 
  onShowAppointments, 
  onShowMessages 
}) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-600">MentorHub</h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
              Mentör Bul
            </a>
            {user?.role === 'mentor' && (
              <a href="#" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                Takvimim
              </a>
            )}
            <button 
              onClick={onShowAppointments}
              className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Randevularım
            </button>
            <button 
              onClick={onShowMessages}
              className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Mesajlar
            </button>
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <img
                    src={user.avatar || `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=40`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium text-gray-900">{user.name}</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => onShowAuth?.()}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Giriş Yap
                </button>
                <button 
                  onClick={() => onShowAuth?.()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Kayıt Ol
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={onMenuToggle}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-2">
              <a href="#" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Mentör Bul
              </a>
              {user?.role === 'mentor' && (
                <a href="#" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                  Takvimim
                </a>
              )}
              <button 
                onClick={onShowAppointments}
                className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium text-left w-full"
              >
                Randevularım
              </button>
              <button 
                onClick={onShowMessages}
                className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium text-left w-full"
              >
                Mesajlar
              </button>
              
              {user ? (
                <div className="px-3 py-2 border-t border-gray-200 mt-2 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img
                        src={user.avatar || `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=40`}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.role}</div>
                      </div>
                    </div>
                    <button
                      onClick={logout}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="px-3 py-2 border-t border-gray-200 mt-2 pt-4 space-y-2">
                  <button 
                    onClick={() => onShowAuth?.()}
                    className="w-full text-left text-gray-700 hover:text-blue-600 font-medium"
                  >
                    Giriş Yap
                  </button>
                  <button 
                    onClick={() => onShowAuth?.()}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Kayıt Ol
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;