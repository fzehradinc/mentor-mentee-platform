import React, { useState, useMemo } from 'react';
import { Search, Filter, Settings, User, LogOut, Star, MapPin, Clock, Calendar, X, ChevronDown, ChevronUp, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import DataPrivacyManager from '../components/DataPrivacy/DataPrivacyManager';
import { mockMentors } from '../data/mockData';
import { Mentor, FilterOptions } from '../types';

interface MenteePageProps {
  onBack: () => void;
}

/**
 * Single-page mentee interface showing personalized mentor recommendations
 * Props:
 * - onBack: Function to navigate back to home page
 */
const MenteePage: React.FC<MenteePageProps> = ({ onBack }) => {
  const { user, logout } = useAuth();
  const [showFilters, setShowFilters] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMoreMentors, setShowMoreMentors] = useState(false);
  const [showDataPrivacy, setShowDataPrivacy] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    expertiseAreas: [],
    languages: [],
    minExperience: 0,
    maxExperience: 20,
    location: '',
    minRating: 0,
    priceRange: [0, 500]
  });

  // Mock onboarding data - in real app this would come from API
  const onboardingData = {
    category: 'UX Design',
    goalLevel: 'Stratejik Yol Haritası',
    budget: '1000-2000 TL',
    timePreference: 'Hafta sonu',
    shortGoal: 'UX alanında kariyer geçişi yapmak istiyorum'
  };

  // Mock upcoming sessions
  const upcomingSessions = [
    {
      id: '1',
      date: '2025-01-20',
      time: '14:00',
      mentorName: 'Ayşe Kılıç',
      status: 'confirmed'
    },
    {
      id: '2',
      date: '2025-01-25',
      time: '16:00',
      mentorName: 'Zeynep Demir',
      status: 'pending'
    }
  ];

  // Get personalized mentor recommendations
  const recommendedMentors = useMemo(() => {
    // Filter mentors based on onboarding data
    const filtered = mockMentors.filter(mentor => {
      // Category match
      const categoryMatch = mentor.expertiseAreas.some(area => 
        area.toLowerCase().includes('ux') || 
        area.toLowerCase().includes('design') ||
        area.toLowerCase().includes('tasarım')
      );
      
      // Budget match
      const budgetMatch = mentor.hourlyRate && mentor.hourlyRate >= 150 && mentor.hourlyRate <= 300;
      
      return categoryMatch || budgetMatch;
    });

    // Add recommendation reasons
    return filtered.slice(0, showMoreMentors ? 10 : 5).map(mentor => ({
      ...mentor,
      reasons: [
        'Kategori eşleşti',
        'Fiyat uygun',
        `${mentor.rating}/5 puan`
      ]
    }));
  }, [showMoreMentors]);

  const formatPrice = (price: number) => {
    return `${price}₺/saat`;
  };

  const formatExperience = (years: number) => {
    return `${years}+ yıl`;
  };

  const handleSessionAction = (sessionId: string, action: 'cancel' | 'reschedule') => {
    console.log(`${action} session ${sessionId}`);
    alert(`Seans ${action === 'cancel' ? 'iptal edildi' : 'yeniden planlandı'}! (Demo)`);
  };

  const handleBookSession = (mentorId: string) => {
    console.log(`Book session with mentor ${mentorId}`);
    alert('Seans rezervasyonu sayfasına yönlendiriliyorsunuz... (Demo)');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Giriş yapmanız gerekiyor
          </h1>
          <button
            onClick={onBack}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <button onClick={onBack} className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
                MentorHub
              </button>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <img
                  src={user.avatar || `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=40`}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm font-medium text-gray-900 hidden sm:block">{user.name}</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Profil</span>
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                    <Settings className="w-4 h-4" />
                    <span>Ayarlar</span>
                  </button>
                  <button 
                    onClick={() => setShowDataPrivacy(true)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Veri Gizliliği</span>
                  </button>
                  <hr className="my-2" />
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Çıkış</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Personalized Greeting */}
          <div className="pb-4">
            <h1 className="text-xl font-semibold text-gray-900">
              Merhaba, {user.name} — Hedefin: {onboardingData.shortGoal}
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Onboarding Summary Widget */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Profil Özeti</h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                  Profili Güncelle
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Kategori</p>
                  <p className="text-sm font-medium text-gray-900">{onboardingData.category}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Hedef Seviyesi</p>
                  <p className="text-sm font-medium text-gray-900">{onboardingData.goalLevel}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Bütçe</p>
                  <p className="text-sm font-medium text-gray-900">{onboardingData.budget}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Zaman</p>
                  <p className="text-sm font-medium text-gray-900">{onboardingData.timePreference}</p>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 mt-4">
                Seçimlerini değiştirdiğinde mentor önerilerin güncellenir.
              </p>
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Mentor adı veya etiket ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors lg:hidden"
                >
                  <Filter className="w-5 h-5" />
                  <span>Filtreler</span>
                </button>
              </div>
            </div>

            {/* Recommended Mentors */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Sana Özel Mentorlar</h2>
                <span className="text-sm text-gray-500">{recommendedMentors.length} mentor bulundu</span>
              </div>

              <div className="space-y-6">
                {recommendedMentors.map((mentor) => (
                  <div key={mentor.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
                      {/* Mentor Photo & Basic Info */}
                      <div className="flex items-start space-x-4 md:space-x-0 md:flex-col md:items-center">
                        <div className="relative">
                          <img
                            src={mentor.avatar || `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100`}
                            alt={mentor.name}
                            className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover"
                          />
                          {mentor.isVerified && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                              <div className="w-3 h-3 bg-white rounded-full"></div>
                            </div>
                          )}
                        </div>
                        
                        <div className="md:text-center md:mt-3">
                          <h3 className="font-bold text-lg text-gray-900">{mentor.name}</h3>
                          <p className="text-blue-600 font-medium">{mentor.title}</p>
                          <p className="text-sm text-gray-500">{mentor.company}</p>
                        </div>
                      </div>

                      {/* Mentor Details */}
                      <div className="flex-1 space-y-4">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                            {mentor.expertiseAreas[0]}
                          </span>
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                            {formatExperience(mentor.experience)}
                          </span>
                          <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                            {mentor.hourlyRate ? formatPrice(mentor.hourlyRate) : 'Fiyat belirtilmemiş'}
                          </span>
                        </div>

                        {/* Recommendation Reasons */}
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-blue-900 mb-2">Neden önerildi:</h4>
                          <ul className="space-y-1">
                            {mentor.reasons?.map((reason, index) => (
                              <li key={index} className="text-sm text-blue-800 flex items-center">
                                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Rating & Availability */}
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-amber-400 fill-current" />
                              <span className="font-medium">{mentor.rating}</span>
                              <span>({mentor.totalReviews} değerlendirme)</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>Hafta sonu uygun</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <div className="md:flex-shrink-0">
                        <button
                          onClick={() => handleBookSession(mentor.id)}
                          className="w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors min-h-[44px]"
                        >
                          Seans Al
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Show More Button */}
              {!showMoreMentors && (
                <div className="text-center">
                  <button
                    onClick={() => setShowMoreMentors(true)}
                    className="bg-white text-gray-700 border border-gray-300 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Daha Fazla Mentor Göster
                  </button>
                </div>
              )}
            </div>

            {/* Campaign Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">İlk Seans 99 TL 🎉</h3>
                  <p className="text-blue-100">Sınırlı süre! İlk mentörlük seansın sadece 99 TL</p>
                </div>
                <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Kampanyayı İncele
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Upcoming Sessions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Gelecek Seanslar</h3>
              
              {upcomingSessions.length === 0 ? (
                <p className="text-gray-500 text-sm">Henüz planlanmış seansınız yok.</p>
              ) : (
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900">
                          {new Date(session.date).toLocaleDateString('tr-TR')} - {session.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{session.mentorName}</p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSessionAction(session.id, 'reschedule')}
                          className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
                        >
                          Yeniden Planla
                        </button>
                        <button
                          onClick={() => handleSessionAction(session.id, 'cancel')}
                          className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full hover:bg-red-200 transition-colors"
                        >
                          İptal Et
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Filters (Desktop) */}
            <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtreler</h3>
              
              <div className="space-y-6">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fiyat Aralığı
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dil
                  </label>
                  <div className="space-y-2">
                    {['Türkçe', 'İngilizce', 'Almanca'].map((lang) => (
                      <label key={lang} className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="ml-2 text-sm text-gray-700">{lang}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Mentor Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mentor Tipi
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Tümü</option>
                    <option value="academic">Akademik</option>
                    <option value="practitioner">Practitioner</option>
                    <option value="coach">Koç</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Konum
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Tümü</option>
                    <option value="online">Online</option>
                    <option value="istanbul">İstanbul</option>
                    <option value="ankara">Ankara</option>
                    <option value="izmir">İzmir</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Askıda Mentorluk */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-2">Askıda Mentorluk</h3>
              <p className="text-sm text-green-700 mb-4">
                Başka bir mentee'nin seansını sponsor olarak destekle.
              </p>
              <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                Destek Ol
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex space-x-6 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900 transition-colors">KVKK & Gizlilik Politikası</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Kullanım Koşulları</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Yardım & Destek</a>
            </div>
            <div className="text-sm text-gray-500">
              © 2025 MentorHub. Tüm hakları saklıdır.
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Filter Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Filtreler</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Same filter content as desktop sidebar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fiyat Aralığı
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setShowFilters(false)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Filtreleri Uygula
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Data Privacy Manager Modal */}
      <DataPrivacyManager
        isOpen={showDataPrivacy}
        onClose={() => setShowDataPrivacy(false)}
      />
    </div>
  );
};

export default MenteePage;