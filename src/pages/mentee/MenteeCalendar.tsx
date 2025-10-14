"use client";
import React, { useState, useEffect } from 'react';
import MenteeLayout from '../../components/mentee/MenteeLayout';
import BookingBadge from '../../components/mentee/BookingBadge';
import EmptyState from '../../components/mentee/EmptyState';
import CreateSessionDrawer from '../../components/scheduling/CreateSessionDrawer';
import { Calendar, Download, Plus, Clock } from 'lucide-react';
import { getSessions, type Session } from '../../lib/actions/menteeAreaActions';

export default function MenteeCalendar() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const data = await getSessions();
      setSessions(data);
    } catch (error) {
      console.error('Load sessions error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSessionCreated = () => {
    loadSessions(); // Refresh list
  };

  const getWeekDays = () => {
    const start = new Date(currentWeek);
    start.setDate(start.getDate() - start.getDay() + 1); // Monday
    
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      return day;
    });
  };

  const getSessionsForDay = (date: Date) => {
    return sessions.filter(s => {
      const sessionDate = new Date(s.starts_at);
      return sessionDate.toDateString() === date.toDateString();
    });
  };

  const exportICS = () => {
    // Simple ICS export
    alert('.ics export özelliği yakında eklenecek');
  };

  const weekDays = getWeekDays();

  if (loading) {
    return (
      <MenteeLayout currentPage="calendar">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </MenteeLayout>
    );
  }

  return (
    <MenteeLayout currentPage="calendar">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Takvim</h2>
            <p className="text-gray-600">Planlı seanslarınızı görüntüleyin ve yönetin</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={exportICS}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
            >
              <Download className="w-4 h-4" />
              .ics Dışa Aktar
            </button>
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-white bg-blue-700 hover:bg-blue-800 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Seans Oluştur
            </button>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-4">
          <button
            onClick={() => {
              const prev = new Date(currentWeek);
              prev.setDate(prev.getDate() - 7);
              setCurrentWeek(prev);
            }}
            className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded"
          >
            ← Önceki Hafta
          </button>
          <span className="font-semibold text-gray-900">
            {weekDays[0].toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
          </span>
          <button
            onClick={() => {
              const next = new Date(currentWeek);
              next.setDate(next.getDate() + 7);
              setCurrentWeek(next);
            }}
            className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded"
          >
            Sonraki Hafta →
          </button>
        </div>

        {/* Week Grid */}
        {sessions.length > 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-7 border-b border-gray-200">
              {weekDays.map((day, idx) => (
                <div key={idx} className="p-3 text-center border-r border-gray-200 last:border-r-0">
                  <div className="text-xs text-gray-500 uppercase">
                    {day.toLocaleDateString('tr-TR', { weekday: 'short' })}
                  </div>
                  <div className={`text-lg font-semibold ${day.toDateString() === new Date().toDateString() ? 'text-blue-700' : 'text-gray-900'}`}>
                    {day.getDate()}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 divide-x divide-gray-200">
              {weekDays.map((day, idx) => {
                const daySessions = getSessionsForDay(day);
                
                return (
                  <div key={idx} className="min-h-[200px] p-2 space-y-2">
                    {daySessions.map((session) => (
                      <div
                        key={session.id}
                        className={`p-2 rounded text-xs cursor-pointer transition-colors ${
                          session.status === 'completed' 
                            ? 'bg-green-50 border border-green-200 text-green-900 hover:bg-green-100'
                            : session.status === 'scheduled'
                            ? 'bg-blue-50 border border-blue-200 text-blue-900 hover:bg-blue-100'
                            : session.status === 'canceled'
                            ? 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'
                            : 'bg-yellow-50 border border-yellow-200 text-yellow-900 hover:bg-yellow-100'
                        }`}
                      >
                        <div className="font-medium truncate">
                          {session.mentor_id ? 'Mentor Seansı' : 'Kişisel Seans'}
                        </div>
                        <div className="text-xs opacity-75">
                          {new Date(session.starts_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        {session.notes && (
                          <div className="text-xs opacity-60 truncate mt-1">
                            {session.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12">
            <EmptyState
              icon={Calendar}
              title="Henüz planlı seans yok"
              description="İlk seansınızı oluşturmak için bir mentor seçin ve takvimden uygun saati belirleyin."
              action={{ label: 'Seans Oluştur', onClick: () => setIsDrawerOpen(true) }}
            />
          </div>
        )}

        {/* Create Session Drawer */}
        {isDrawerOpen && (
          <CreateSessionDrawer
            onClose={() => setIsDrawerOpen(false)}
            onSuccess={handleSessionCreated}
          />
        )}
      </div>
    </MenteeLayout>
  );
}


