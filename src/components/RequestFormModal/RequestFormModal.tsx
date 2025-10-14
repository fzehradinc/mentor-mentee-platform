import React, { useState } from 'react';
import { X, Calendar, Clock, MessageSquare } from 'lucide-react';
import { TimeSlot, Mentor } from '../../types';
import CalendarSlotSelection from '../CalendarSlotSelection/CalendarSlotSelection';

interface RequestFormModalProps {
  mentor: Mentor;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    mentorId: string;
    selectedSlot: TimeSlot;
    message: string;
    goals: string;
  }) => void;
}

/**
 * Request form modal for booking mentor sessions
 * Props:
 * - mentor: Mentor object for the session request
 * - isOpen: Boolean indicating if modal is open
 * - onClose: Function to close the modal
 * - onSubmit: Function called when form is submitted with request data
 */
const RequestFormModal: React.FC<RequestFormModalProps> = ({
  mentor,
  isOpen,
  onClose,
  onSubmit
}) => {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [message, setMessage] = useState('');
  const [goals, setGoals] = useState('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSlot || !message.trim() || !goals.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit({
        mentorId: mentor.id,
        selectedSlot,
        message: message.trim(),
        goals: goals.trim()
      });
      
      // Reset form
      setSelectedSlot(null);
      setMessage('');
      setGoals('');
      onClose();
    } catch (error) {
      console.error('Error submitting request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDateTime = (slot: TimeSlot) => {
    const date = new Date(slot.date);
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const [startHour, startMinute] = slot.startTime.split(':');
    const [endHour, endMinute] = slot.endTime.split(':');
    
    const startDate = new Date();
    startDate.setHours(parseInt(startHour), parseInt(startMinute));
    const endDate = new Date();
    endDate.setHours(parseInt(endHour), parseInt(endMinute));
    
    const timeRange = `${startDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })} - ${endDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })}`;
    
    return `${formattedDate} at ${timeRange}`;
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Request Session</h3>
              <p className="text-sm text-gray-600 mt-1">
                Book a session with {mentor.name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Mentor Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-4">
                <img
                  src={mentor.avatar || `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=60`}
                  alt={mentor.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{mentor.name}</h4>
                  <p className="text-sm text-blue-600">{mentor.title}</p>
                  <p className="text-sm text-gray-600">
                    {mentor.hourlyRate && `$${mentor.hourlyRate}/hour`}
                  </p>
                </div>
              </div>
            </div>

            {/* Time Slot Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Select Time Slot *
              </label>
              
              {selectedSlot ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-green-800">
                      <Calendar className="w-5 h-5" />
                      <div>
                        <p className="font-medium">Selected:</p>
                        <p className="text-sm">{formatDateTime(selectedSlot)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsCalendarOpen(true)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Change
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsCalendarOpen(true)}
                  className="w-full flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors group"
                >
                  <Calendar className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                  <span className="text-gray-600 group-hover:text-blue-600">
                    Choose a time slot
                  </span>
                </button>
              )}
            </div>

            {/* Goals */}
            <div>
              <label htmlFor="goals" className="block text-sm font-semibold text-gray-900 mb-2">
                What do you hope to achieve? *
              </label>
              <textarea
                id="goals"
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder="Describe your goals and what you'd like to focus on during the session..."
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                required
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
                Additional Message *
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell the mentor about your background, specific questions, or anything else they should know..."
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedSlot || !message.trim() || !goals.trim() || isSubmitting}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending Request...</span>
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-4 h-4" />
                    <span>Send Request</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Calendar Modal */}
      <CalendarSlotSelection
        availableSlots={mentor.availableSlots}
        selectedSlot={selectedSlot}
        onSlotSelect={(slot) => {
          setSelectedSlot(slot);
          setIsCalendarOpen(false);
        }}
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
      />
    </>
  );
};

export default RequestFormModal;