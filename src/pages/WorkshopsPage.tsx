"use client";
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Sparkles, TrendingUp, Calendar as CalendarIcon } from 'lucide-react';
import WorkshopCard from '../components/workshop/WorkshopCard';
import WorkshopFiltersComponent from '../components/workshop/WorkshopFilters';
import { 
  getWorkshops, 
  getPopularWorkshops, 
  getUpcomingWorkshops,
  getRecommendedWorkshops 
} from '../lib/actions/workshopActions';
import type { Workshop, WorkshopFilters } from '../types/workshop';
import { getCurrentUser } from '../lib/auth/requireMentee';

interface WorkshopsPageProps {
  onBack?: () => void;
  onViewDetail?: (slug: string) => void;
}

const WorkshopsPage: React.FC<WorkshopsPageProps> = ({ onBack, onViewDetail }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<WorkshopFilters>({});
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [popularWorkshops, setPopularWorkshops] = useState<Workshop[]>([]);
  const [upcomingWorkshops, setUpcomingWorkshops] = useState<Workshop[]>([]);
  const [recommendedWorkshops, setRecommendedWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  const user = getCurrentUser();

  useEffect(() => {
    loadWorkshops();
    loadPopularWorkshops();
    loadUpcomingWorkshops();
    
    if (user) {
      loadRecommendedWorkshops();
    }
  }, []);

  useEffect(() => {
    loadWorkshops();
  }, [filters, searchQuery]);

  const loadWorkshops = async () => {
    setLoading(true);
    try {
      const data = await getWorkshops({ ...filters, search: searchQuery || undefined });
      setWorkshops(data);
    } catch (error) {
      console.error('Load workshops error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPopularWorkshops = async () => {
    try {
      const data = await getPopularWorkshops(6);
      setPopularWorkshops(data);
    } catch (error) {
      console.error('Load popular workshops error:', error);
    }
  };

  const loadUpcomingWorkshops = async () => {
    try {
      const data = await getUpcomingWorkshops(6);
      setUpcomingWorkshops(data);
    } catch (error) {
      console.error('Load upcoming workshops error:', error);
    }
  };

  const loadRecommendedWorkshops = async () => {
    try {
      const data = await getRecommendedWorkshops(3);
      setRecommendedWorkshops(data);
    } catch (error) {
      console.error('Load recommended workshops error:', error);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  const handleViewWorkshop = (slug: string) => {
    if (onViewDetail) {
      onViewDetail(slug);
    } else {
      window.dispatchEvent(new CustomEvent('navigateTo', { detail: 'workshop-detail', slug }));
    }
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-base-bg text-text-high">
      {/* Grain/Noise Pattern */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat'
        }}
      />

      {/* Hero Section */}
      <div className="border-b border-white/5 bg-gradient-to-b from-base-panel/80 to-base-bg relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="mb-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Geri</span>
          </button>

          <h1 className="text-3xl md:text-4xl font-semibold mb-4 text-text-high">Platformdaki Workshopları Keşfet</h1>
          <p className="text-lg text-text-dim mb-8 max-w-3xl">
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
                className="w-full pl-12 pr-4 py-4 text-text-high bg-base-panel/60 rounded-xl border-0 focus:ring-2 focus:ring-accent-primary placeholder:text-text-dim"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm text-text-high rounded-lg hover:bg-white/10 ring-1 ring-white/10 transition-colors"
          >
            {showFilters ? 'Filtreleri Gizle' : 'Filtreleri Göster'}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        {showFilters && (
          <div className="mb-8">
            <WorkshopFiltersComponent
              filters={filters}
              onChange={setFilters}
              onClear={handleClearFilters}
            />
          </div>
        )}

        {/* Recommended Workshops (if user logged in) */}
        {user && recommendedWorkshops.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Senin İçin Önerilenler</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedWorkshops.map((workshop) => (
                <WorkshopCard 
                  key={workshop.id} 
                  workshop={workshop} 
                  onView={handleViewWorkshop} 
                />
              ))}
            </div>
          </section>
        )}

        {/* Popular Workshops */}
        {popularWorkshops.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-900">Popüler Workshoplar</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularWorkshops.slice(0, 6).map((workshop) => (
                <WorkshopCard 
                  key={workshop.id} 
                  workshop={workshop} 
                  onView={handleViewWorkshop} 
                />
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Workshops */}
        {upcomingWorkshops.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <CalendarIcon className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Yaklaşan Workshoplar</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingWorkshops.slice(0, 6).map((workshop) => (
                <WorkshopCard 
                  key={workshop.id} 
                  workshop={workshop} 
                  onView={handleViewWorkshop} 
                />
              ))}
            </div>
          </section>
        )}

        {/* All Workshops */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {searchQuery || filters.category || filters.level || filters.mode 
                ? 'Arama Sonuçları' 
                : 'Tüm Workshoplar'
              }
            </h2>
            <span className="text-sm text-gray-500">{workshops.length} workshop</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : workshops.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workshops.map((workshop) => (
                <WorkshopCard 
                  key={workshop.id} 
                  workshop={workshop} 
                  onView={handleViewWorkshop} 
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Workshop bulunamadı</h3>
              <p className="text-gray-500 mb-4">Arama kriterlerinize uygun workshop yok.</p>
              <button
                onClick={handleClearFilters}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Filtreleri temizle
              </button>
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="mt-16 bg-gradient-to-r from-green-500 via-purple-600 to-blue-600 rounded-2xl p-8 lg:p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Workshop Açmak İster Misiniz?</h2>
          <p className="text-lg text-blue-100 mb-6 max-w-2xl mx-auto">
            Uzmanlık alanınızda workshop düzenlemek için bizimle iletişime geçin. 
            Size özel workshop planlaması yapalım.
          </p>
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors">
            Bizimle İletişime Geçin
          </button>
        </section>
      </div>
    </div>
  );
};

export default WorkshopsPage;
