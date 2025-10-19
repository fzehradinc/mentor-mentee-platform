"use client";
import React, { useState, useEffect } from 'react';
import { Search, Sparkles, TrendingUp, Calendar as CalendarIcon } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import WorkshopCardDark from '../components/workshop/WorkshopCardDark';
import { 
  getWorkshops, 
  getPopularWorkshops, 
  getUpcomingWorkshops,
  getRecommendedWorkshops 
} from '../lib/actions/workshopActions';
import type { Workshop } from '../types/workshop';
import { getCurrentUser } from '../lib/auth/requireMentee';

interface WorkshopsPageNewProps {
  onBack?: () => void;
  onViewDetail?: (slug: string) => void;
}

const WorkshopsPageNew: React.FC<WorkshopsPageNewProps> = ({ onBack, onViewDetail }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [popularWorkshops, setPopularWorkshops] = useState<Workshop[]>([]);
  const [upcomingWorkshops, setUpcomingWorkshops] = useState<Workshop[]>([]);
  const [recommendedWorkshops, setRecommendedWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  
  const user = getCurrentUser();

  useEffect(() => {
    loadAllWorkshops();
  }, [searchQuery]);

  const loadAllWorkshops = async () => {
    setLoading(true);
    try {
      const [all, popular, upcoming, recommended] = await Promise.all([
        getWorkshops({ search: searchQuery || undefined }),
        getPopularWorkshops(6),
        getUpcomingWorkshops(6),
        user ? getRecommendedWorkshops(3) : Promise.resolve([])
      ]);

      setWorkshops(all);
      setPopularWorkshops(popular);
      setUpcomingWorkshops(upcoming);
      setRecommendedWorkshops(recommended);
    } catch (error) {
      console.error('Load workshops error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHomeClick = () => {
    window.dispatchEvent(new CustomEvent('navigateTo', { detail: 'home' }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - LIGHT */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb
            items={[
              { label: 'Ana Sayfa', onClick: handleHomeClick },
              { label: 'Workshoplar' }
            ]}
            className="mb-4"
          />

          <h1 className="text-3xl md:text-4xl font-semibold mb-4 text-[#1E1B4B]">
            Platformdaki Workshopları Keşfet
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl">
            İlgi alanına uygun workshoplarla gelişimini hızlandır. Uzman eğitmenlerden öğren, kariyerine yön ver.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Workshop ara..."
                className="w-full pl-12 pr-4 py-4 text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E1B4B] focus:border-transparent placeholder:text-gray-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content Area - BEYAZ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Recommended Workshops */}
        {recommendedWorkshops.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-amber-500" />
              <h2 className="text-2xl font-semibold text-gray-900">Senin İçin Önerilen Workshoplar</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedWorkshops.map((workshop) => (
                <WorkshopCardDark 
                  key={workshop.id} 
                  workshop={workshop} 
                  onViewDetail={onViewDetail} 
                  isRecommended={true}
                />
              ))}
            </div>
          </section>
        )}

        {/* Popular Workshops */}
        {popularWorkshops.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-orange-500" />
              <h2 className="text-2xl font-semibold text-gray-900">Popüler Workshoplar</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularWorkshops.map((workshop) => (
                <WorkshopCardDark 
                  key={workshop.id} 
                  workshop={workshop} 
                  onViewDetail={onViewDetail} 
                />
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Workshops */}
        {upcomingWorkshops.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <CalendarIcon className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">Yaklaşan Workshoplar</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingWorkshops.map((workshop) => (
                <WorkshopCardDark 
                  key={workshop.id} 
                  workshop={workshop} 
                  onViewDetail={onViewDetail} 
                />
              ))}
            </div>
          </section>
        )}

        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FACC15]"></div>
          </div>
        )}

        {/* CTA Section - LIGHT */}
        <section className="mt-16 bg-white rounded-2xl border border-gray-200 shadow-md p-8 lg:p-12 text-center">
          <h2 className="text-3xl font-semibold mb-4 text-[#1E1B4B]">
            Workshop Açmak İster Misiniz?
          </h2>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Uzmanlık alanınızda workshop düzenlemek için bizimle iletişime geçin.
            Size özel workshop planlaması yapalım.
          </p>
          <button className="bg-[#FACC15] text-[#1E1B4B] px-8 py-3 rounded-lg font-semibold text-lg hover:bg-[#F59E0B] transition-colors shadow-md">
            İletişime Geç
          </button>
        </section>
      </div>
    </div>
  );
};

export default WorkshopsPageNew;

