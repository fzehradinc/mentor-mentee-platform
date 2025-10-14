import React, { useState } from 'react';
import { Calendar, Clock, Video, Plus, X } from 'lucide-react';
import FormField from './FormField';

interface TimeSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
}

interface MentorAvailability {
  availability_pattern: string;
  time_slots: TimeSlot[];
  session_duration: number;
  meeting_pref: string;
}

interface StepAvailabilityProps {
  data: MentorAvailability;
  onChange: (field: keyof MentorAvailability, value: string | TimeSlot[] | number) => void;
  errors: Record<string, string>;
}

/**
 * Step 3: Availability and scheduling preferences
 */
const StepAvailability: React.FC<StepAvailabilityProps> = ({ data, onChange, errors }) => {
  const [newSlot, setNewSlot] = useState({
    day: '',
    startTime: '',
    endTime: ''
  });

  const availabilityPatterns = [
    { key: 'hafta-ici-aksam', label: 'Hafta içi akşam', icon: '🌆', desc: '18:00-22:00 arası' },
    { key: 'hafta-sonu', label: 'Hafta sonu', icon: '🌅', desc: 'Cumartesi-Pazar' },
    { key: 'esnek', label: 'Esnek', icon: '⏰', desc: 'Değişken saatler' }
  ];

  const sessionDurations = [
    { value: 30, label: '30 dakika', desc: 'Hızlı danışmanlık' },
    { value: 45, label: '45 dakika', desc: 'Standart seans' },
    { value: 60, label: '60 dakika', desc: 'Detaylı mentörlük' }
  ];

  const meetingPreferences = [
    { key: 'zoom-meet', label: 'Zoom/Google Meet', icon: '💻', desc: 'Video konferans' },
    { key: 'platform', label: 'Platform İçi', icon: '🏠', desc: 'MentorHub aracılığıyla' },
    { key: 'esnek', label: 'Esnek', icon: '🔄', desc: 'Mentee tercihi' }
  ];

  const days = [
    'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'
  ];

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  const handleAddTimeSlot = () => {
    if (newSlot.day && newSlot.startTime && newSlot.endTime) {
      const slot: TimeSlot = {
        id: Date.now().toString(),
        day: newSlot.day,
        startTime: newSlot.startTime,
        endTime: newSlot.endTime
      };
      
      onChange('time_slots', [...data.time_slots, slot]);
      setNewSlot({ day: '', startTime: '', endTime: '' });
    }
  };

  const handleRemoveTimeSlot = (slotId: string) => {
    onChange('time_slots', data.time_slots.filter(slot => slot.id !== slotId));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Müsaitlik
        </h2>
        <p className="text-gray-600">
          Ne zaman mentörlük verebileceğinizi belirtin
        </p>
      </div>

      {/* Availability Pattern */}
      <FormField
        label="Genel Müsaitlik Durumu"
        required
        error={errors.availability_pattern}
        helper="Genel çalışma saatleriniz"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {availabilityPatterns.map((pattern) => (
            <button
              key={pattern.key}
              type="button"
              onClick={() => onChange('availability_pattern', pattern.key)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 text-center hover:scale-105 ${
                data.availability_pattern === pattern.key
                  ? 'border-green-500 bg-green-50 text-green-700 shadow-md'
                  : 'border-gray-200 hover:border-green-300 bg-white'
              }`}
            >
              <div className="text-2xl mb-2">{pattern.icon}</div>
              <h3 className="font-semibold">{pattern.label}</h3>
              <p className="text-sm text-gray-600">{pattern.desc}</p>
            </button>
          ))}
        </div>
      </FormField>

      {/* Time Slots */}
      <FormField
        label="Detaylı Zaman Aralıkları"
        error={errors.time_slots}
        helper="Net müsaitlik → hızlı rezervasyon."
      >
        <div className="space-y-4">
          {/* Add New Slot */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Yeni zaman aralığı ekle:</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <select
                value={newSlot.day}
                onChange={(e) => setNewSlot({ ...newSlot, day: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Gün seçin</option>
                {days.map((day) => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
              
              <select
                value={newSlot.startTime}
                onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Başlangıç</option>
                {timeOptions.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
              
              <select
                value={newSlot.endTime}
                onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Bitiş</option>
                {timeOptions.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
              
              <button
                type="button"
                onClick={handleAddTimeSlot}
                disabled={!newSlot.day || !newSlot.startTime || !newSlot.endTime}
                className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Existing Slots */}
          {data.time_slots.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Mevcut zaman aralıkları:</h4>
              {data.time_slots.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      {slot.day} • {slot.startTime} - {slot.endTime}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveTimeSlot(slot.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {data.time_slots.length === 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-800">
                ⚠️ En az bir zaman aralığı eklemeniz önerilir.
              </p>
            </div>
          )}
        </div>
      </FormField>

      {/* Session Duration */}
      <FormField
        label="Seans Süresi"
        required
        error={errors.session_duration}
        helper="Standart seans süreniz"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sessionDurations.map((duration) => (
            <button
              key={duration.value}
              type="button"
              onClick={() => onChange('session_duration', duration.value)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 text-center hover:scale-105 ${
                data.session_duration === duration.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                  : 'border-gray-200 hover:border-blue-300 bg-white'
              }`}
            >
              <Clock className="w-6 h-6 mx-auto mb-2 text-gray-600" />
              <h3 className="font-semibold">{duration.label}</h3>
              <p className="text-sm text-gray-600">{duration.desc}</p>
            </button>
          ))}
        </div>
      </FormField>

      {/* Meeting Preference */}
      <FormField
        label="Görüşme Tercihi"
        required
        error={errors.meeting_pref}
        helper="Mentee'lerle nasıl görüşmeyi tercih edersiniz"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {meetingPreferences.map((pref) => (
            <button
              key={pref.key}
              type="button"
              onClick={() => onChange('meeting_pref', pref.key)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 text-center hover:scale-105 ${
                data.meeting_pref === pref.key
                  ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-md'
                  : 'border-gray-200 hover:border-purple-300 bg-white'
              }`}
            >
              <div className="text-2xl mb-2">{pref.icon}</div>
              <h3 className="font-semibold">{pref.label}</h3>
              <p className="text-sm text-gray-600">{pref.desc}</p>
            </button>
          ))}
        </div>
      </FormField>
    </div>
  );
};

export default StepAvailability;