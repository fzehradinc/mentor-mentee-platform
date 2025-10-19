"use client";
import React, { useState, useEffect } from 'react';
import FiltersPanel from '../components/mentors/FiltersPanel';
import MentorsToolbar from '../components/mentors/MentorsToolbar';
import MentorCardDark from '../components/mentors/MentorCardDark';
import Breadcrumb from '../components/Breadcrumb';
import { getAllMentors } from '../lib/actions/mentorListActions';

interface MentorsPageProps {
  onBack?: () => void;
}

const MentorsPage: React.FC<MentorsPageProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<any>({});
  const [sortBy, setSortBy] = useState('recommended');
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMentors();
  }, []);

  const loadMentors = async () => {
    try {
      const data = await getAllMentors();
      setMentors(data);
    } catch (error) {
      console.error('Load mentors error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mentor.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const handleHomeClick = () => {
    window.dispatchEvent(new CustomEvent('navigateTo', { detail: 'home' }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Breadcrumb
            items={[
              { label: 'Ana Sayfa', onClick: handleHomeClick },
              { label: 'Mentorlar' }
            ]}
            className="mb-4"
          />
          <h1 className="text-3xl md:text-4xl font-semibold leading-tight text-[#1E1B4B]">
            Doğru Mentorla İlerle
          </h1>
          <p className="mt-3 text-lg text-gray-600 max-w-3xl">
            YKS/LGS ve üniversite derslerinde uzman, güvenilir mentorlar. Filtreleyin, inceleyin, hemen seans alın.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-[280px_1fr] gap-6">
          {/* Left Sidebar - Filters */}
          <aside className="md:sticky md:top-4 h-fit">
            <FiltersPanel 
              onFilterChange={setSelectedFilters}
              onSearchChange={setSearchQuery}
            />
          </aside>

          {/* Right - Results */}
          <section className="space-y-4">
            <MentorsToolbar 
              total={filteredMentors.length}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />

            {/* Mentor Cards */}
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FACC15]"></div>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                {filteredMentors.map((mentor) => (
                  <MentorCardDark key={mentor.id} mentor={mentor} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {filteredMentors.length > 0 && (
              <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
                <span>1–{filteredMentors.length} / {mentors.length} mentor</span>
                <nav className="flex gap-2">
                  <button className="rounded-md border border-gray-300 px-4 py-2 bg-white hover:bg-gray-50 transition-colors">
                    Önceki
                  </button>
                  <button className="rounded-md border border-gray-300 px-4 py-2 bg-white hover:bg-gray-50 transition-colors">
                    Sonraki
                  </button>
                </nav>
              </div>
            )}

            {filteredMentors.length === 0 && !loading && (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-md">
                <p className="text-gray-600 text-lg mb-4">Aradığınız kriterlere uygun mentor bulunamadı.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedFilters({});
                  }}
                  className="px-6 py-3 bg-[#FACC15] text-[#1E1B4B] font-semibold rounded-lg hover:bg-[#F59E0B] transition-colors"
                >
                  Filtreleri Temizle
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default MentorsPage;
