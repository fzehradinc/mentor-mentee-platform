"use client";
import React, { useState, useEffect } from 'react';
import MenteeLayout from '../../components/mentee/MenteeLayout';
import EmptyState from '../../components/mentee/EmptyState';
import { Users, Star, Calendar, MessageSquare, Bookmark } from 'lucide-react';
import { getSavedMentors, getActiveMentors } from '../../lib/actions/menteeAreaActions';

export default function MenteeMentors() {
  const [activeTab, setActiveTab] = useState<'saved' | 'active'>('saved');
  const [savedMentors, setSavedMentors] = useState<any[]>([]);
  const [activeMentors, setActiveMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMentors();
  }, []);

  const loadMentors = async () => {
    try {
      const [saved, active] = await Promise.all([
        getSavedMentors(),
        getActiveMentors()
      ]);
      
      setSavedMentors(saved);
      setActiveMentors(active);
    } catch (error) {
      console.error('Load mentors error:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentMentors = activeTab === 'saved' ? savedMentors : activeMentors;

  if (loading) {
    return (
      <MenteeLayout currentPage="mentors">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </MenteeLayout>
    );
  }

  return (
    <MenteeLayout currentPage="mentors">
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex space-x-1 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'saved'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Kaydedilen ({savedMentors.length})
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'active'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Aktif Çalıştıklarım ({activeMentors.length})
          </button>
        </div>

        {/* Mentors Grid */}
        {currentMentors.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentMentors.map((mentor: any) => {
              const mentorData = activeTab === 'saved' ? mentor.mentors : mentor;
              
              return (
                <div key={mentor.mentor_id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                      {mentorData?.display_name?.charAt(0) || 'M'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{mentorData?.display_name}</h3>
                      <p className="text-sm text-gray-500 truncate">{mentorData?.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-medium text-gray-900">
                          {(mentorData?.hourly_rate_cents / 100)}₺/saat
                        </span>
                        <span className="text-yellow-500 text-sm">
                          ⭐ {mentorData?.rating_avg?.toFixed(1) || '5.0'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {activeTab === 'active' && mentor.confirmed_sessions && (
                    <div className="mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{mentor.confirmed_sessions} tamamlanmış seans</span>
                      </div>
                    </div>
                  )}

                  {activeTab === 'saved' && mentor.notes && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{mentor.notes}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <button className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Seans Al
                    </button>
                    <button className="px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Mesaj Yaz
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12">
            <EmptyState
              icon={Users}
              title={activeTab === 'saved' ? 'Henüz kaydedilmiş mentor yok' : 'Henüz aktif mentörünüz yok'}
              description={activeTab === 'saved' 
                ? 'İlgilendiğiniz mentörleri kaydedin, daha sonra kolayca ulaşın.'
                : 'Bir mentör ile seans aldığınızda burada görünecek.'
              }
              action={{ 
                label: 'Mentör Ara', 
                onClick: () => window.dispatchEvent(new CustomEvent('navigateTo', { detail: 'mentors' })) 
              }}
            />
          </div>
        )}
      </div>
    </MenteeLayout>
  );
}


