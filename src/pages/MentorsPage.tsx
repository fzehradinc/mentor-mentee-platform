"use client";
import React, { useState, useEffect } from 'react';
import FiltersPanel from '../components/mentors/FiltersPanel';
import MentorsToolbar from '../components/mentors/MentorsToolbar';
import MentorCardDark from '../components/mentors/MentorCardDark';
import BackButton from '../components/BackButton';
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
      <section className="border-b border-white/5 bg-gradient-to-b from-base-panel/80 to-base-bg relative">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <BackButton fallback="home" className="mb-4" />
          <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
            Doğru Mentorla İlerle
          </h1>
          <p className="mt-3 text-lg text-text-dim max-w-3xl">
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-warm"></div>
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
              <div className="mt-6 flex items-center justify-between text-sm text-text-dim">
                <span>1–{filteredMentors.length} / {mentors.length} mentor</span>
                <nav className="flex gap-2">
                  <button className="rounded-md border border-white/10 px-4 py-2 hover:bg-white/5 transition-colors">
                    Önceki
                  </button>
                  <button className="rounded-md border border-white/10 px-4 py-2 hover:bg-white/5 transition-colors">
                    Sonraki
                  </button>
                </nav>
              </div>
            )}

            {filteredMentors.length === 0 && (
              <div className="text-center py-16 bg-base-soft rounded-2xl ring-1 ring-white/10">
                <p className="text-text-dim text-lg mb-4">Aradığınız kriterlere uygun mentor bulunamadı.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedFilters({});
                  }}
                  className="px-6 py-3 bg-accent-warm text-black font-medium rounded-lg hover:bg-amber-400 transition-colors"
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
