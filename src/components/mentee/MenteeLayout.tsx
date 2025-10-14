"use client";
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Calendar, MessageSquare, Users, Target, 
  CreditCard, FolderOpen, Settings, Menu, X, LogOut, User,
  Bell, ChevronDown, FileText
} from 'lucide-react';
import { getCurrentUser, logout } from '../../lib/auth/requireMentee';
import BackButton from '../BackButton';

interface MenteeLayoutProps {
  children: React.ReactNode;
  currentPage: 'dashboard' | 'calendar' | 'messages' | 'mentors' | 'goals' | 'payments' | 'files' | 'notes' | 'settings';
}

const menuItems = [
  { id: 'dashboard', label: 'Özet', icon: LayoutDashboard },
  { id: 'mentors', label: 'Mentörlerim', icon: Users },
  { id: 'messages', label: 'Mesajlar', icon: MessageSquare },
  { id: 'calendar', label: 'Takvim', icon: Calendar },
  { id: 'goals', label: 'Hedefler & İlerleme', icon: Target },
  { id: 'notes', label: 'Notlarım', icon: FileText },
  { id: 'files', label: 'Dosyalar', icon: FolderOpen },
  { id: 'payments', label: 'Faturalar & Ödemeler', icon: CreditCard },
  { id: 'settings', label: 'Ayarlar', icon: Settings }
] as const;

export default function MenteeLayout({ children, currentPage }: MenteeLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);

    if (!currentUser || currentUser.role !== 'mentee') {
      window.location.href = '/';
    }
  }, []);

  const handleLogout = () => {
    logout();
  };

  const handleNavigate = (page: string) => {
    window.dispatchEvent(new CustomEvent('navigateTo', { detail: `mentee-${page}` }));
    setIsMobileMenuOpen(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-bg">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40">
        <div className="flex items-center justify-between px-4 h-16">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <span className="font-semibold text-gray-900">BiMentor</span>
          <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {user.fullName?.charAt(0) || 'M'}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/40 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 z-30
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <a href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="font-bold text-xl text-gray-900">BiMentor</span>
          </a>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-700 text-white'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile (Bottom) */}
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white font-semibold">
              {user.fullName?.charAt(0) || 'M'}
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-medium text-slate-900">{user.fullName}</div>
              <div className="text-xs text-slate-500">{user.email}</div>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {isProfileMenuOpen && (
            <div className="mt-2 space-y-1">
              <button
                onClick={() => handleNavigate('settings')}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <User className="w-4 h-4" />
                <span>Profil</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
                <span>Çıkış Yap</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-72">
        {/* Top Bar */}
        <header className="sticky top-0 bg-white border-b border-gray-200 z-20 h-16 lg:h-20">
          <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* Back Button + Page Title (Desktop) */}
            <div className="flex items-center gap-4">
              {currentPage !== 'dashboard' && (
                <BackButton fallback="mentee-dashboard" />
              )}
              <div className="hidden lg:block">
                <h1 className="text-2xl font-bold text-slate-900 capitalize">
                  {menuItems.find(m => m.id === currentPage)?.label || 'Dashboard'}
                </h1>
              </div>
            </div>

            {/* Right Actions */}
            <div className="ml-auto flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Desktop User Menu */}
              <div className="hidden lg:flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                  <div className="text-xs text-gray-500">Mentee</div>
                </div>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="relative"
                >
                <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.fullName?.charAt(0) || 'M'}
                </div>
                </button>

                {/* Desktop Dropdown */}
                {isProfileMenuOpen && (
                  <div className="absolute top-16 right-4 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px]">
                    <button
                      onClick={() => handleNavigate('settings')}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <User className="w-4 h-4" />
                      <span>Profil Ayarları</span>
                    </button>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Çıkış Yap</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 mt-16 lg:mt-0">
          {children}
        </main>
      </div>
    </div>
  );
}

