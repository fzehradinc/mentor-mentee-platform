import React, { useState } from 'react';
import { Calendar, Clock, X } from 'lucide-react';
import { TimeSlot } from '../../types';

interface CalendarSlotSelectionProps {
  availableSlots: TimeSlot[];
  selectedSlot: TimeSlot | null;
  onSlotSelect: (slot: TimeSlot) => void;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Calendar slot selection component for booking appointments
 * Props:
 * - availableSlots: Array of available time slots
 * - selectedSlot: Currently selected time slot (null if none)
 * - onSlotSelect: Function called when a slot is selected
 * - isOpen: Boolean indicating if the calendar is open
 * - onClose: Function to close the calendar
 */
const CalendarSlotSelection: React.FC<CalendarSlotSelectionProps> = ({
  availableSlots,
  selectedSlot,
  onSlotSelect,
  isOpen,
  onClose
}) => {
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Group slots by date
  const slotsByDate = availableSlots.reduce((acc, slot) => {
    if (!acc[slot.date]) {
      acc[slot.date] = [];
    }
    acc[slot.date].push(slot);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  const availableDates = Object.keys(slotsByDate).sort();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Select Time Slot</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {availableDates.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No Available Slots</h4>
              <p className="text-gray-600">This mentor has no available time slots at the moment.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Date Selection */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Select Date</h4>
                <div className="grid grid-cols-1 gap-2">
                  {availableDates.map((date) => (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(selectedDate === date ? '' : date)}
                      className={`text-left p-3 rounded-lg border transition-colors ${
                        selectedDate === date
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {formatDate(date)}
                      <span className="text-xs text-gray-500 ml-2">
                        ({slotsByDate[date].length} slots available)
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Select Time</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {slotsByDate[selectedDate].map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => onSlotSelect(slot)}
                        className={`flex items-center justify-center space-x-2 p-3 rounded-lg border transition-colors ${
                          selectedSlot?.id === slot.id
                            ? 'border-blue-500 bg-blue-600 text-white'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700'
                        }`}
                      >
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected Slot Summary */}
              {selectedSlot && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-green-800">
                    <Calendar className="w-5 h-5" />
                    <div>
                      <p className="font-medium">Selected Slot:</p>
                      <p className="text-sm">
                        {formatDate(selectedSlot.date)} at {formatTime(selectedSlot.startTime)} - {formatTime(selectedSlot.endTime)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            disabled={!selectedSlot}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Confirm Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarSlotSelection;