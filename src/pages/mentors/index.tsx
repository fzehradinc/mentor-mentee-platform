"use client";
import React, { useState, useEffect } from 'react';
import { Search, Filter, Heart, ArrowRight } from 'lucide-react';
import MentorCard from '../../components/MentorCard';
import MentorFilter from '../../components/MentorFilter';
import SearchBar from '../../components/SearchBar';

interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  rating: number;
  reviews: number;
  country: string;
  countryCode: string;
  skills: string[];
  about: string;
  price: number;
  currency: string;
  availability: string;
  img: string;
  avatar: string;
  plan: {
    calls: string;
    qa: string;
    response: string;
    support: string;
  };
  category: string;
  subfield: string[];
  badges: string[];
  responseTime: string;
  lastActive: string;
  experience: number;
  sessions: number;
  attendance: number;
}

const MentorsPage: React.FC = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [filteredMentors, setFilteredMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    skills: [] as string[],
    categories: [] as string[],
    priceRange: [0, 500] as [number, number],
    countries: [] as string[]
  });
  const [sortBy, setSortBy] = useState('recommended');

  useEffect(() => {
    loadMentors();
  }, []);

  useEffect(() => {
    filterMentors();
  }, [mentors, searchQuery, selectedFilters, sortBy]);

  const loadMentors = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = await fetch('/src/data/mentors.json');
      const data = await response.json();
      setMentors(data);
    } catch (error) {
      console.error('Error loading mentors:', error);
      // Fallback to mock data
      setMentors([]);
    } finally {
      setLoading(false);
    }
  };

  const filterMentors = () => {
    let filtered = [...mentors];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(mentor =>
        mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Skills filter
    if (selectedFilters.skills.length > 0) {
      filtered = filtered.filter(mentor =>
        selectedFilters.skills.some(skill =>
          mentor.skills.some(mentorSkill => mentorSkill.toLowerCase().includes(skill.toLowerCase()))
        )
      );
    }

    // Categories filter
    if (selectedFilters.categories.length > 0) {
      filtered = filtered.filter(mentor =>
        selectedFilters.categories.includes(mentor.category)
      );
    }

    // Price range filter
    filtered = filtered.filter(mentor =>
      mentor.price >= selectedFilters.priceRange[0] && mentor.price <= selectedFilters.priceRange[1]
    );

    // Countries filter
    if (selectedFilters.countries.length > 0) {
      filtered = filtered.filter(mentor =>
        selectedFilters.countries.includes(mentor.country)
      );
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'experience':
        filtered.sort((a, b) => b.experience - a.experience);
        break;
      default:
        // recommended - keep original order
        break;
    }

    setFilteredMentors(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filters: any) => {
    setSelectedFilters(filters);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedFilters({
      skills: [],
      categories: [],
      priceRange: [0, 500],
      countries: []
    });
  };

  return (
    <div className="min-h-screen bg-[#0C2727] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-gradient-to-b from-[#0C2727]/80 to-[#0C2727]">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#008C83] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xl font-semibold">MentorCruise</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-white/80 hover:text-white transition-colors">Engineering Mentors</a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">Design Mentors</a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">Startup Mentor</a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">AI Mentors</a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">Product Managers</a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">Marketing Coaches</a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">Leadership Mentors</a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">Care</a>
              <ArrowRight className="w-4 h-4 text-white/60" />
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button className="text-white/80 hover:text-white transition-colors">For Businesses</button>
              <button className="px-4 py-2 border border-white/20 rounded-lg hover:bg-white/5 transition-colors">
                Login
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-[#008C83] to-[#00A896] text-white rounded-lg hover:from-[#007A73] hover:to-[#009688] transition-all">
                Browse all mentors
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-sm text-white/60">
          <span>🏠</span>
          <span>Find a Mentor</span>
          <span>→</span>
          <span className="text-white">All Mentors</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-[300px_1fr] gap-8">
          {/* Left Sidebar - Filters */}
          <aside className="lg:sticky lg:top-4 h-fit">
            <MentorFilter
              onFilterChange={handleFilterChange}
              selectedFilters={selectedFilters}
            />
          </aside>

          {/* Right - Results */}
          <main className="space-y-6">
            {/* Search and Results Header */}
            <div className="flex items-center justify-between">
              <div className="flex-1 max-w-md">
                <SearchBar onSearch={handleSearch} placeholder="Search by company, skills or role" />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-white/60">
                  {filteredMentors.length} mentors found
                </span>
                <button className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors">
                  <Filter className="w-4 h-4" />
                  More filters
                </button>
                <button className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors">
                  <Heart className="w-4 h-4" />
                  Save search
                </button>
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-white/60">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="bg-[#1A3A3A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#008C83]"
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
                <option value="experience">Experience</option>
              </select>
            </div>

            {/* Mentor Cards */}
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#008C83]"></div>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                {filteredMentors.map((mentor) => (
                  <MentorCard key={mentor.id} mentor={mentor} />
                ))}
              </div>
            )}

            {/* No Results */}
            {!loading && filteredMentors.length === 0 && (
              <div className="text-center py-16 bg-[#1A3A3A] rounded-2xl border border-white/10">
                <p className="text-white/60 text-lg mb-4">No mentors found matching your criteria.</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-[#008C83] text-white font-medium rounded-lg hover:bg-[#007A73] transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {filteredMentors.length > 0 && (
              <div className="mt-8 flex items-center justify-between text-sm text-white/60">
                <span>1–{filteredMentors.length} / {mentors.length} mentors</span>
                <nav className="flex gap-2">
                  <button className="rounded-lg border border-white/10 px-4 py-2 hover:bg-white/5 transition-colors">
                    Previous
                  </button>
                  <button className="rounded-lg border border-white/10 px-4 py-2 hover:bg-white/5 transition-colors">
                    Next
                  </button>
                </nav>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default MentorsPage;
