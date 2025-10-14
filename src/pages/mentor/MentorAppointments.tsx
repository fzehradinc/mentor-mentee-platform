"use client";
import React, { useState, useEffect } from 'react';
import MentorLayout from '../../components/mentor/MentorLayout';
import BookingBadge from '../../components/mentee/BookingBadge';
import EmptyState from '../../components/mentee/EmptyState';
import { ClipboardList, Check, X } from 'lucide-react';
import { getMentorAppointments, confirmBooking, cancelBooking } from '../../lib/actions/mentorAreaActions';

export default function MentorAppointments() {
  const [activeTab, setActiveTab] = useState<'pending' | 'confirmed' | 'completed' | 'canceled'>('pending');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, [activeTab]);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const data = await getMentorAppointments(activeTab);
      setAppointments(data);
    } catch (error) {
      console.error('Load appointments error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (id: string) => {
    try {
      await confirmBooking(id);
      loadAppointments();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Bu randevuyu iptal etmek istediğinizden emin misiniz?')) return;
    
    try {
      await cancelBooking(id);
      loadAppointments();
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <MentorLayout currentPage="appointments">
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex space-x-1 border-b border-gray-200">
          {[
            { key: 'pending', label: 'Bekleyen' },
            { key: 'confirmed', label: 'Onaylanan' },
            { key: 'completed', label: 'Tamamlanan' },
            { key: 'canceled', label: 'İptal' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Appointments List */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : appointments.length > 0 ? (
          <div className="space-y-3">
            {appointments.map((apt) => (
              <div key={apt.id} className="bg-white rounded-lg border border-gray-200 p-5 flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{apt.mentee_name}</div>
                  <div className="text-sm text-gray-600">{apt.mentee_email}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {new Date(apt.starts_at).toLocaleDateString('tr-TR', {
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <BookingBadge status={apt.status} />
                  {apt.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleConfirm(apt.id)}
                        className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        title="Onayla"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleCancel(apt.id)}
                        className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        title="İptal"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12">
            <EmptyState
              icon={ClipboardList}
              title={`${activeTab === 'pending' ? 'Bekleyen' : activeTab === 'confirmed' ? 'Onaylanmış' : activeTab === 'completed' ? 'Tamamlanmış' : 'İptal edilmiş'} randevu yok`}
              description="Mentee'lerinizden gelen talepleri burada göreceksiniz."
            />
          </div>
        )}
      </div>
    </MentorLayout>
  );
}


