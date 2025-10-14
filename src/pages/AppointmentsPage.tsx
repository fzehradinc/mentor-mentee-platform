import React, { useState, useMemo } from 'react';
import { Calendar, Search, Filter, Clock, Users, Star, CheckCircle, XCircle, MessageSquare, FileText, Award } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import AppointmentCard from '../components/AppointmentCard/AppointmentCard';
import ReviewModal from '../components/ReviewModal/ReviewModal';
import { useAuth } from '../contexts/AuthContext';
import { mockAppointments, mockMentors, mockMentees } from '../data/mockData';
import { Appointment } from '../types';

type MentorTabType = 'today' | 'pending' | 'past';
type MenteeTabType = 'upcoming' | 'waiting' | 'completed';

import { ArrowLeft } from 'lucide-react';

interface AppointmentsPageProps {
  onBack: () => void;
}

/**
 * Role-based appointments page with different views for mentors and mentees
 * Props:
 * - onBack: Function to navigate back to home page
 */
const AppointmentsPage: React.FC<AppointmentsPageProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [mentorActiveTab, setMentorActiveTab] = useState<MentorTabType>('today');
  const [menteeActiveTab, setMenteeActiveTab] = useState<MenteeTabType>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Get user's appointments based on role
  const userAppointments = useMemo(() => {
    if (!user) return [];
    
    return mockAppointments.filter(appointment => {
      if (user.role === 'mentor') {
        return appointment.mentorId === user.id;
      } else {
        return appointment.menteeId === user.id;
      }
    });
  }, [user]);

  // Filter appointments for mentors
  const mentorFilteredAppointments = useMemo(() => {
    if (!user || user.role !== 'mentor') return [];
    
    let filtered = userAppointments;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (mentorActiveTab === 'today') {
      filtered = filtered.filter(apt => {
        const aptDate = new Date(apt.dateTime);
        return aptDate >= today && aptDate < tomorrow && apt.status === 'confirmed';
      });
    } else if (mentorActiveTab === 'pending') {
      filtered = filtered.filter(apt => apt.status === 'pending');
    } else if (mentorActiveTab === 'past') {
      filtered = filtered.filter(apt => new Date(apt.dateTime) < now && apt.status === 'completed');
    }
    
    // Apply search and status filters
    if (searchQuery) {
      filtered = filtered.filter(apt => {
        const mentee = mockMentees.find(m => m.id === apt.menteeId);
        return mentee?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               apt.topic?.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }
    
    return filtered.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  }, [userAppointments, mentorActiveTab, searchQuery, user]);

  // Filter appointments for mentees
  const menteeFilteredAppointments = useMemo(() => {
    if (!user || user.role !== 'mentee') return [];
    
    let filtered = userAppointments;
    const now = new Date();
    
    if (menteeActiveTab === 'upcoming') {
      filtered = filtered.filter(apt => new Date(apt.dateTime) > now && apt.status === 'confirmed');
    } else if (menteeActiveTab === 'waiting') {
      filtered = filtered.filter(apt => apt.status === 'pending');
    } else if (menteeActiveTab === 'completed') {
      filtered = filtered.filter(apt => apt.status === 'completed');
    }
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(apt => {
        const mentor = mockMentors.find(m => m.id === apt.mentorId);
        return mentor?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               apt.topic?.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }
    
    return filtered.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  }, [userAppointments, menteeActiveTab, searchQuery, user]);

  // Get statistics based on role
  const stats = useMemo(() => {
    if (!user) return { stat1: 0, stat2: 0, stat3: 0 };
    
    const now = new Date();
    
    if (user.role === 'mentor') {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const todayAppointments = userAppointments.filter(apt => {
        const aptDate = new Date(apt.dateTime);
        return aptDate >= today && aptDate < tomorrow && apt.status === 'confirmed';
      });
      
      const pendingRequests = userAppointments.filter(apt => apt.status === 'pending');
      const completedSessions = userAppointments.filter(apt => apt.status === 'completed');
      
      return {
        stat1: todayAppointments.length,
        stat2: pendingRequests.length,
        stat3: completedSessions.length
      };
    } else {
      const upcoming = userAppointments.filter(apt => new Date(apt.dateTime) > now && apt.status === 'confirmed');
      const waiting = userAppointments.filter(apt => apt.status === 'pending');
      const completed = userAppointments.filter(apt => apt.status === 'completed');
      
      return {
        stat1: upcoming.length,
        stat2: waiting.length,
        stat3: completed.length
      };
    }
  }, [userAppointments, user]);

  const handleJoinMeeting = (appointment: Appointment) => {
    if (appointment.meetingLink) {
      window.open(appointment.meetingLink, '_blank');
    }
  };

  const handleApproveAppointment = (appointmentId: string) => {
    console.log('Approving appointment:', appointmentId);
    alert('Randevu onaylandı! (Demo)');
  };

  const handleRejectAppointment = (appointmentId: string) => {
    console.log('Rejecting appointment:', appointmentId);
    alert('Randevu reddedildi! (Demo)');
  };

  const handleCancelAppointment = (appointmentId: string) => {
    console.log('Cancelling appointment:', appointmentId);
    alert('Randevu iptal edildi! (Demo)');
  };

  const handleRescheduleAppointment = (appointmentId: string) => {
    console.log('Rescheduling appointment:', appointmentId);
    alert('Yeniden planlama özelliği yakında eklenecek! (Demo)');
  };

  const handleAddReview = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setReviewModalOpen(true);
  };

  const handleReviewSubmit = async (reviewData: {
    appointmentId: string;
    rating: number;
    comment: string;
    criteria: Record<string, number>;
  }) => {
    console.log('Review submitted:', reviewData);
    alert('Değerlendirmeniz başarıyla gönderildi! Teşekkürler.');
    setReviewModalOpen(false);
    setSelectedAppointment(null);
  };

  if (!user) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Randevularınızı görüntülemek için giriş yapın
            </h1>
          </div>
        </div>
      </Layout>
    );
  }

  const isMentor = user.role === 'mentor';
  const currentAppointments = isMentor ? mentorFilteredAppointments : menteeFilteredAppointments;

  // Mentor tabs
  const mentorTabs = [
    { key: 'today' as MentorTabType, label: 'Bugünkü Randevular', count: stats.stat1, icon: Calendar },
    { key: 'pending' as MentorTabType, label: 'Bekleyen Talepler', count: stats.stat2, icon: Clock },
    { key: 'past' as MentorTabType, label: 'Geçmiş Görüşmeler', count: stats.stat3, icon: CheckCircle }
  ];

  // Mentee tabs
  const menteeTabs = [
    { key: 'upcoming' as MenteeTabType, label: 'Yaklaşan Görüşmeler', count: stats.stat1, icon: Calendar },
    { key: 'waiting' as MenteeTabType, label: 'Onay Bekleyen', count: stats.stat2, icon: Clock },
    { key: 'completed' as MenteeTabType, label: 'Tamamlananlar', count: stats.stat3, icon: Star }
  ];

  const currentTabs = isMentor ? mentorTabs : menteeTabs;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Ana sayfaya dön</span>
        </button>

        {/* Header with Role-based styling */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isMentor ? 'bg-blue-100' : 'bg-purple-100'
            }`}>
              {isMentor ? (
                <Award className={`w-6 h-6 ${isMentor ? 'text-blue-600' : 'text-purple-600'}`} />
              ) : (
                <Users className={`w-6 h-6 ${isMentor ? 'text-blue-600' : 'text-purple-600'}`} />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {user.name} – {isMentor ? 'Mentör' : 'Menti'}
              </h1>
              <p className="text-gray-600">
                {isMentor ? 'Randevu taleplerini yönetin ve görüşmelerinizi takip edin' : 'Mentörlük seanslarınızı takip edin ve değerlendirin'}
              </p>
            </div>
          </div>
          
          {/* Role-based Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {isMentor ? (
              <>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Bugünkü Randevular</span>
                  </div>
                  <p className="text-2xl font-bold text-green-900 mt-1">{stats.stat1}</p>
                </div>
                
                <div className="bg-amber-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-amber-600" />
                    <span className="text-sm font-medium text-amber-800">Bekleyen Talepler</span>
                  </div>
                  <p className="text-2xl font-bold text-amber-900 mt-1">{stats.stat2}</p>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Tamamlanan Görüşmeler</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900 mt-1">{stats.stat3}</p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-purple-800">Yaklaşan Görüşmeler</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-900 mt-1">{stats.stat1}</p>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800">Onay Bekleyen</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-900 mt-1">{stats.stat2}</p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Tamamlananlar</span>
                  </div>
                  <p className="text-2xl font-bold text-green-900 mt-1">{stats.stat3}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className={`rounded-xl shadow-sm border p-6 mb-8 ${
          isMentor ? 'bg-blue-50 border-blue-200' : 'bg-purple-50 border-purple-200'
        }`}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={isMentor ? "Menti adı veya konu ara..." : "Mentör adı veya konu ara..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              />
            </div>
            
            {/* Quick Actions for Mentors */}
            {isMentor && (
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <FileText className="w-4 h-4" />
                  <span>Notlarım</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Calendar className="w-4 h-4" />
                  <span>Takvimi Görüntüle</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Role-based Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {currentTabs.map((tab) => {
                const isActive = isMentor 
                  ? mentorActiveTab === tab.key 
                  : menteeActiveTab === tab.key;
                
                return (
                  <button
                    key={tab.key}
                    onClick={() => {
                      if (isMentor) {
                        setMentorActiveTab(tab.key as MentorTabType);
                      } else {
                        setMenteeActiveTab(tab.key as MenteeTabType);
                      }
                    }}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      isActive
                        ? `border-${isMentor ? 'blue' : 'purple'}-500 text-${isMentor ? 'blue' : 'purple'}-600`
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    <span className={`py-0.5 px-2 rounded-full text-xs ${
                      isActive
                        ? `bg-${isMentor ? 'blue' : 'purple'}-100 text-${isMentor ? 'blue' : 'purple'}-600`
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-6">
          {currentAppointments.length === 0 ? (
            <div className="text-center py-12">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                isMentor ? 'bg-blue-100' : 'bg-purple-100'
              }`}>
                <Calendar className={`w-8 h-8 ${isMentor ? 'text-blue-600' : 'text-purple-600'}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {isMentor ? (
                  mentorActiveTab === 'today' ? 'Bugün randevunuz yok' :
                  mentorActiveTab === 'pending' ? 'Bekleyen talep yok' :
                  'Geçmiş görüşme yok'
                ) : (
                  menteeActiveTab === 'upcoming' ? 'Yaklaşan randevunuz yok' :
                  menteeActiveTab === 'waiting' ? 'Onay bekleyen randevunuz yok' :
                  'Tamamlanan görüşme yok'
                )}
              </h3>
              <p className="text-gray-600 mb-6">
                {isMentor 
                  ? 'Mentiler sizinle randevu oluşturduğunda burada görünecek.'
                  : 'Mentör arayarak yeni randevular oluşturabilirsiniz.'
                }
              </p>
            </div>
          ) : (
            currentAppointments.map((appointment) => {
              const mentor = mockMentors.find(m => m.id === appointment.mentorId);
              const mentee = mockMentees.find(m => m.id === appointment.menteeId);
              
              return (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  mentor={mentor}
                  mentee={mentee}
                  onJoinMeeting={handleJoinMeeting}
                  onApproveAppointment={isMentor ? handleApproveAppointment : undefined}
                  onRejectAppointment={isMentor ? handleRejectAppointment : undefined}
                  onCancelAppointment={handleCancelAppointment}
                  onRescheduleAppointment={handleRescheduleAppointment}
                  onAddReview={handleAddReview}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Review Modal */}
      {selectedAppointment && (
        <ReviewModal
          appointment={selectedAppointment}
          mentor={mockMentors.find(m => m.id === selectedAppointment.mentorId)}
          mentee={mockMentees.find(m => m.id === selectedAppointment.menteeId)}
          isOpen={reviewModalOpen}
          onClose={() => {
            setReviewModalOpen(false);
            setSelectedAppointment(null);
          }}
          onSubmit={handleReviewSubmit}
        />
      )}
    </Layout>
  );
};

export default AppointmentsPage;