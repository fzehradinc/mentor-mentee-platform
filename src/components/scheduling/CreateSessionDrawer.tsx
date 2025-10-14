"use client";
import React, { useMemo, useState } from 'react';
import { X, Calendar as CalendarIcon, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { createSession } from '../../lib/actions/menteeAreaActions';

const DEFAULT_SLOTS = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "18:00", "19:00", "20:00"];
const DAYS_AHEAD = 14;
const DEFAULT_DURATION = 60; // minutes

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60000);
}

interface CreateSessionDrawerProps {
  onClose: () => void;
  onSuccess?: () => void;
  durationMin?: number;
  mentorId?: string | null;
}

export default function CreateSessionDrawer({
  onClose,
  onSuccess,
  durationMin = DEFAULT_DURATION,
  mentorId = null
}: CreateSessionDrawerProps) {
  const today = new Date();
  
  const dates = useMemo(() => {
    const arr: Date[] = [];
    for (let i = 0; i < DAYS_AHEAD; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      d.setHours(0, 0, 0, 0);
      arr.push(d);
    }
    return arr;
  }, []);

  const [selectedDate, setSelectedDate] = useState<Date>(dates[0]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    
    if (!selectedDate || !selectedTime) {
      setError('Lütfen tarih ve saat seçin.');
      return;
    }

    // Build local start/end
    const [hh, mm] = selectedTime.split(':').map(Number);
    const localStart = new Date(selectedDate);
    localStart.setHours(hh, mm, 0, 0);
    const localEnd = addMinutes(localStart, durationMin);

    // Convert to UTC ISO
    const startISO = localStart.toISOString();
    const endISO = localEnd.toISOString();

    setLoading(true);
    
    try {
      await createSession({ 
        startISO, 
        endISO, 
        mentorId, 
        notes: notes || undefined 
      });
      
      setSuccess(true);
      
      // Close after short delay
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1000);
    } catch (e: any) {
      setError(e?.message || 'Seans oluşturulamadı. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d: Date) => {
    const dayName = d.toLocaleDateString('tr-TR', { weekday: 'short' });
    return `${dayName} ${pad(d.getDate())}.${pad(d.getMonth() + 1)}`;
  };

  const isToday = (d: Date) => {
    const now = new Date();
    return d.toDateString() === now.toDateString();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end md:items-center md:justify-center">
      <div 
        className="w-full md:max-w-2xl bg-white rounded-t-2xl md:rounded-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <CalendarIcon className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Yeni Seans Planla</h2>
              <p className="text-sm text-slate-600">Tarih ve saat seçin</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Kapat"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Date Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-3">
              Tarih Seçin
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {dates.map((d) => {
                const isSel = selectedDate && d.getTime() === selectedDate.getTime();
                const today = isToday(d);
                
                return (
                  <button
                    key={d.toISOString()}
                    onClick={() => setSelectedDate(d)}
                    className={`
                      border-2 rounded-lg px-3 py-3 text-sm font-medium transition-all
                      ${isSel 
                        ? 'border-blue-700 bg-blue-50 text-blue-700 shadow-sm' 
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }
                      ${today ? 'ring-2 ring-blue-200' : ''}
                    `}
                  >
                    <div className="text-xs text-slate-500 mb-1">
                      {d.toLocaleDateString('tr-TR', { weekday: 'short' })}
                    </div>
                    <div className={isSel ? 'text-blue-900' : 'text-slate-900'}>
                      {pad(d.getDate())}.{pad(d.getMonth() + 1)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Saat Seçin ({durationMin} dakika)
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {DEFAULT_SLOTS.map((t) => {
                const sel = selectedTime === t;
                
                return (
                  <button
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    className={`
                      px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all
                      ${sel 
                        ? 'border-blue-700 bg-blue-50 text-blue-700 shadow-sm' 
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }
                    `}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes (Optional) */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Notlar (Opsiyonel)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Seans için özel notlarınızı buraya yazabilirsiniz..."
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-blue-700 resize-none"
              rows={3}
            />
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-800">Seans başarıyla oluşturuldu!</p>
            </div>
          )}

          {/* Selected Summary */}
          {selectedDate && selectedTime && !success && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm font-medium text-blue-900 mb-1">Seçilen Zaman:</div>
              <div className="text-lg font-bold text-blue-900">
                {formatDate(selectedDate)} • {selectedTime} ({durationMin} dakika)
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-white transition-colors"
            disabled={loading}
          >
            Vazgeç
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !selectedDate || !selectedTime || success}
            className="px-6 py-2.5 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Kaydediliyor...
              </>
            ) : success ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Oluşturuldu
              </>
            ) : (
              'Seansı Oluştur'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

