"use client";
import React, { useState, useEffect } from 'react';
import MentorLayout from '../../components/mentor/MentorLayout';
import StatCard from '../../components/mentor/StatCard';
import { 
  CalendarPlus, Send, MessageSquare, Upload,
  TrendingUp, Users, Clock, DollarSign
} from 'lucide-react';
import { 
  getMentorAppointments,
  getEarningsSummary,
  getProfileCompletion
} from '../../lib/actions/mentorAreaActions';
import { getCurrentUser } from '../../lib/auth/requireMentee';

export default function MentorDashboard() {
  const [user, setUser] = useState<any>(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [earnings, setEarnings] = useState<any>({ total_earned_cents: 0, pending_cents: 0, completed_sessions: 0 });
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // LocalStorage'dan direkt kullanıcı bilgisini al
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        loadDashboardData();
      } catch (e) {
        console.error('User data parse error:', e);
      }
    }
  }, []);

  const loadDashboardData = async () => {
    try {
      // Mock data kullan (API henüz hazır değil)
      setUpcomingAppointments([]);
      setEarnings({ total_earned_cents: 0, pending_cents: 0, completed_sessions: 0 });
      setProfileCompletion(0);
    } catch (error) {
      console.error('Dashboard load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { 
      icon: CalendarPlus, 
      label: 'Uygunluk Ekle', 
      onClick: () => window.dispatchEvent(new CustomEvent('navigateTo', { detail: 'mentor-calendar' })),
      color: 'green'
    },
    { 
      icon: Send, 
      label: 'Seans Teklifi Gönder', 
      onClick: () => alert('Seans teklifi özelliği yakında eklenecek'),
      color: 'blue'
    },
    { 
      icon: MessageSquare, 
      label: 'Mesajlar', 
      onClick: () => window.dispatchEvent(new CustomEvent('navigateTo', { detail: 'mentor-messages' })),
      color: 'purple'
    },
    { 
      icon: Upload, 
      label: 'Workshop Yayınla', 
      onClick: () => alert('Workshop yayınlama özelliği yakında eklenecek'),
      color: 'orange'
    }
  ];

  // Minimal link-style (NOT colored boxes)
  const quickActionStyle = 'group flex items-center justify-between rounded-xl2 border border-light-border bg-white px-4 py-3 transition-colors hover:border-brand-ring shadow-card';

  if (loading) {
    return (
      <MentorLayout currentPage="dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </MentorLayout>
    );
  }

  return (
    <MentorLayout currentPage="dashboard">
      <div className="space-y-6">
        {/* Greeting - Minimal */}
        <div className="rounded-xl2 border border-light-border bg-white p-6 shadow-card">
          <h1 className="text-2xl font-semibold text-text-primary">
            Merhaba, {user?.name || 'Mentor'}! 👋
          </h1>
          <p className="mt-2 text-text-secondary">
            Planlı ilerleyin. Uygunluklarınızdan randevular otomatik akışa düşer.
          </p>
        </div>

        {/* Quick Actions - Link Style */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={action.onClick}
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

        {/* Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={DollarSign}
            label="Toplam Kazanç"
            value={`${(earnings.total_earned_cents / 100).toFixed(0)}₺`}
            color="green"
          />
          <StatCard
            icon={Clock}
            label="Bekleyen Kazanç"
            value={`${(earnings.pending_cents / 100).toFixed(0)}₺`}
            color="orange"
          />
          <StatCard
            icon={Users}
            label="Tamamlanan Seans"
            value={earnings.completed_sessions || 0}
            color="blue"
          />
          <StatCard
            icon={TrendingUp}
            label="Profil Tamamlama"
            value={`%${profileCompletion}`}
            color="purple"
          />
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Yaklaşan Randevular (7 gün)</h3>
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-3">
              {upcomingAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{apt.mentee_name}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(apt.starts_at).toLocaleDateString('tr-TR', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  <button className="text-xs text-blue-600 hover:underline">
                    .ics indir
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              Yaklaşan randevu bulunmamaktadır.
            </p>
          )}
        </div>

        {/* Profile Completion */}
        {profileCompletion < 100 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-2">Profilini Tamamla</h3>
                <p className="text-sm text-blue-800 mb-3">
                  Güvenilir profil. Tamamlanmış profiller daha çok talep alır.
                </p>
                <div className="w-full bg-blue-200 rounded-full h-2.5 mb-2">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all"
                    style={{ width: `${profileCompletion}%` }}
                  />
                </div>
                <div className="text-xs text-blue-700">%{profileCompletion} tamamlandı</div>
              </div>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('navigateTo', { detail: 'mentor-profile' }))}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
              >
                Profili Düzenle
              </button>
            </div>
          </div>
        )}
      </div>
    </MentorLayout>
  );
}


