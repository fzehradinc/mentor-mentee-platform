"use client";
import React, { useState, useEffect } from 'react';
import MenteeLayout from '../../components/mentee/MenteeLayout';
import DashboardCard from '../../components/mentee/DashboardCard';
import ProgressBar from '../../components/mentee/ProgressBar';
import BookingBadge from '../../components/mentee/BookingBadge';
import EmptyState from '../../components/mentee/EmptyState';
import { 
  Search, Calendar, MessageSquare, FileText, 
  Clock, TrendingUp, Users, ArrowRight, Target 
} from 'lucide-react';
import { 
  getUpcomingBookings, 
  getRecommendedMentors, 
  getDashboardStats,
  getGoals,
  getMenteeProfile,
  type Booking,
  type MenteeProfile
} from '../../lib/actions/menteeAreaActions';
import { getCurrentUser } from '../../lib/auth/requireMentee';

export default function MenteeDashboard() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<MenteeProfile | null>(null);
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [recommendedMentors, setRecommendedMentors] = useState<any[]>([]);
  const [stats, setStats] = useState({ upcomingBookingsCount: 0, totalGoals: 0, unreadMessages: 0 });
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);

    if (currentUser) {
      loadDashboardData();
    }
  }, []);

  const loadDashboardData = async () => {
    try {
      const [profileData, bookings, mentors, dashStats, userGoals] = await Promise.all([
        getMenteeProfile(),
        getUpcomingBookings(),
        getRecommendedMentors(),
        getDashboardStats(),
        getGoals()
      ]);

      setProfile(profileData);
      setUpcomingBookings(bookings.slice(0, 3));
      setRecommendedMentors(mentors);
      setStats(dashStats);
      setGoals(userGoals.slice(0, 2));
    } catch (error) {
      console.error('Dashboard load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { 
      icon: Search, 
      label: 'Mentör Ara', 
      targetView: 'mentors' as const
    },
    { 
      icon: Calendar, 
      label: 'Seans Planla', 
      targetView: 'mentee-calendar' as const
    },
    { 
      icon: FileText, 
      label: 'Notlarım', 
      targetView: 'mentee-notes' as const
    }
  ];

  const handleQuickAction = (targetView: string) => {
    // Prevent default behavior, use client-side navigation
    window.dispatchEvent(new CustomEvent('navigateTo', { detail: targetView }));
  };

  // Minimal link-style buttons (NOT colored boxes)
  const quickActionStyle = 'group flex items-center justify-between rounded-xl2 border border-light-border bg-white px-4 py-4 transition-colors hover:border-brand-ring shadow-card';

  if (loading) {
    return (
      <MenteeLayout currentPage="dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </MenteeLayout>
    );
  }

  return (
    <MenteeLayout currentPage="dashboard">
      <div className="space-y-6">
        {/* Greeting Block - Minimal */}
        <div className="rounded-xl2 border border-light-border bg-white p-6 shadow-card">
          <h1 className="text-2xl font-semibold text-text-primary">
            Merhaba, {profile?.first_name || user?.name?.split(' ')[0] || 'Kullanıcı'}! 👋
          </h1>
          <p className="mt-2 text-text-secondary">
            {stats.upcomingBookingsCount > 0 
              ? `Bu hafta planlanmış ${stats.upcomingBookingsCount} seansınız var. Odaklı ilerleyin.`
              : 'Odaklı ilerleyin. Hedeflerinize uygun mentörlerle planlı çalışın.'
            }
          </p>
        </div>

        {/* Quick Stats - Minimal */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl2 border border-light-border bg-white p-4 shadow-card">
            <div className="text-xs text-text-tertiary">Yaklaşan Seans</div>
            <div className="mt-2 text-2xl font-semibold text-text-primary">{stats.upcomingBookingsCount}</div>
          </div>
          <div className="rounded-xl2 border border-light-border bg-white p-4 shadow-card">
            <div className="text-xs text-text-tertiary">Aktif Hedef</div>
            <div className="mt-2 text-2xl font-semibold text-text-primary">{stats.totalGoals}</div>
          </div>
          <div className="rounded-xl2 border border-light-border bg-white p-4 shadow-card">
            <div className="text-xs text-text-tertiary">Yeni Mesaj</div>
            <div className="mt-2 text-2xl font-semibold text-text-primary">{stats.unreadMessages}</div>
          </div>
        </div>

        {/* Quick Actions - Link Style */}
        <div className="grid grid-cols-3 gap-4">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickAction(action.targetView)}
                className={quickActionStyle}
              >
                <div className="flex items-center gap-3">
                  <span className="rounded-md border border-light-border p-2 text-text-secondary group-hover:text-brand-primary transition-colors">
                    <Icon className="w-5 h-5" />
                  </span>
                  <span className="text-sm font-medium text-text-primary">{action.label}</span>
                </div>
                <span className="text-text-tertiary group-hover:text-brand-primary transition-colors">→</span>
              </button>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upcoming Sessions */}
          <DashboardCard 
            title="Yaklaşan Seanslar" 
            action={{ label: 'Tümünü gör', onClick: () => window.dispatchEvent(new CustomEvent('navigateTo', { detail: 'mentee-calendar' })) }}
          >
            {upcomingBookings.length > 0 ? (
              <div className="space-y-3">
                {upcomingBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <Clock className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {booking.mentor_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(booking.starts_at).toLocaleDateString('tr-TR', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <BookingBadge status={booking.status} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Calendar}
                title="Henüz planlı seans yok"
                description="İlk seansınızı şimdi oluşturun."
                action={{ label: 'Seans Planla', onClick: () => window.dispatchEvent(new CustomEvent('navigateTo', { detail: 'mentee-calendar' })) }}
              />
            )}
          </DashboardCard>

          {/* Goals Progress */}
          <DashboardCard 
            title="Hedef İlerleme" 
            action={{ label: 'Tümünü gör', onClick: () => window.dispatchEvent(new CustomEvent('navigateTo', { detail: 'mentee-goals' })) }}
          >
            {goals.length > 0 ? (
              <div className="space-y-4">
                {goals.map((goal) => {
                  const tasks = goal.tasks || [];
                  const doneTasks = tasks.filter((t: any) => t.done).length;
                  const progress = tasks.length > 0 ? Math.round((doneTasks / tasks.length) * 100) : 0;
                  
                  return (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">{goal.title}</span>
                        <span className="text-xs text-gray-500">{doneTasks}/{tasks.length}</span>
                      </div>
                      <ProgressBar progress={progress} color="green" showPercentage={false} />
                      {tasks.find((t: any) => !t.done) && (
                        <div className="text-xs text-gray-500">
                          Sonraki: {tasks.find((t: any) => !t.done).title}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                icon={Target}
                title="Henüz hedef yok"
                description="Hedef ekleyerek ilerlemenizi görünür kılın."
                action={{ label: 'Hedef Ekle', onClick: () => window.dispatchEvent(new CustomEvent('navigateTo', { detail: 'mentee-goals' })) }}
              />
            )}
          </DashboardCard>
        </div>

        {/* Recommended Mentors */}
        <DashboardCard title="Önerilen Mentörler" action={{ label: 'Daha fazla', onClick: () => window.dispatchEvent(new CustomEvent('navigateTo', { detail: 'mentors' })) }}>
          {recommendedMentors.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-4">
              {recommendedMentors.map((mentor) => (
                <div key={mentor.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {mentor.display_name?.charAt(0) || 'M'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 truncate">{mentor.display_name}</div>
                      <div className="text-xs text-gray-500 truncate">{mentor.title}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{(mentor.hourly_rate_cents / 100)}₺/seans</span>
                    <span className="text-yellow-500">⭐ {mentor.rating_avg?.toFixed(1) || '5.0'}</span>
                  </div>
                  <button className="mt-3 w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                    Profili Görüntüle
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              İlgi alanlarınıza göre mentor önerileri yüklenecek
            </p>
          )}
        </DashboardCard>

        {/* Latest Messages Preview */}
        <DashboardCard 
          title="Son Mesajlar" 
          action={{ label: 'Tümünü gör', onClick: () => window.dispatchEvent(new CustomEvent('navigateTo', { detail: 'mentee-messages' })) }}
        >
          <EmptyState
            icon={MessageSquare}
            title="Henüz mesaj yok"
            description="Bir sohbet başlatın; mentörünüzle iletişime geçin."
            action={{ label: 'Mesaj Yaz', onClick: () => window.dispatchEvent(new CustomEvent('navigateTo', { detail: 'mentee-messages' })) }}
          />
        </DashboardCard>
      </div>
    </MenteeLayout>
  );
}

