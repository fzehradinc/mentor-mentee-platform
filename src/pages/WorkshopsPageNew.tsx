"use client";
import React, { useState, useEffect } from 'react';
import { Search, Sparkles, TrendingUp, Calendar as CalendarIcon } from 'lucide-react';
import BackButton from '../components/BackButton';
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

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - KOYU */}
      <section className="bg-gradient-to-b from-base-bg via-base-panel to-base-soft text-text-high relative">
        {/* Grain/Noise Pattern (sadece hero'da) */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
            backgroundRepeat: 'repeat'
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <BackButton fallback="home" className="mb-6 text-text-dim hover:text-text-high" />

          <h1 className="text-3xl md:text-4xl font-semibold mb-4">
            Platformdaki Workshopları Keşfet
          </h1>
          <p className="text-lg text-text-dim mb-8 max-w-3xl">
            İlgi alanına uygun workshoplarla gelişimini hızlandır. Uzman eğitmenlerden öğren, kariyerine yön ver.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-dim" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Workshop ara..."
                className="w-full pl-12 pr-4 py-4 text-text-high bg-base-panel/60 rounded-xl border-0 focus:ring-2 focus:ring-accent-primary placeholder:text-text-dim"
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-warm"></div>
          </div>
        )}

        {/* CTA Section - KOYU */}
        <section className="mt-16 bg-gradient-to-r from-base-bg via-base-panel to-base-soft rounded-2xl p-8 lg:p-12 text-center relative overflow-hidden">
          {/* Grain */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.02]"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
              backgroundRepeat: 'repeat'
            }}
          />
          <div className="relative">
            <h2 className="text-3xl font-semibold mb-4 text-text-high">
              Workshop Açmak İster Misiniz?
            </h2>
            <p className="text-lg text-text-dim mb-6 max-w-2xl mx-auto">
              Uzmanlık alanınızda workshop düzenlemek için bizimle iletişime geçin. 
              Size özel workshop planlaması yapalım.
            </p>
            <button className="bg-accent-warm text-black px-8 py-3 rounded-full font-semibold text-lg hover:bg-amber-400 transition-colors shadow-lg">
              İletişime Geç
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default WorkshopsPageNew;

