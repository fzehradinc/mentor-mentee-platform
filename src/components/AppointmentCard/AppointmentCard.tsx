import React from 'react';
import { Calendar, Clock, Video, User, MessageSquare, X, RotateCcw, Star, CheckCircle, XCircle } from 'lucide-react';
import { Appointment, Mentor, Mentee } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface AppointmentCardProps {
  appointment: Appointment;
  mentor?: Mentor;
  mentee?: Mentee;
  onJoinMeeting?: (appointment: Appointment) => void;
  onApproveAppointment?: (appointmentId: string) => void;
  onRejectAppointment?: (appointmentId: string) => void;
  onCancelAppointment?: (appointmentId: string) => void;
  onRescheduleAppointment?: (appointmentId: string) => void;
  onAddReview?: (appointment: Appointment) => void;
}

/**
 * Appointment card component displaying appointment details
 * Props:
 * - appointment: Appointment object with all appointment details
 * - mentor: Mentor object (if current user is mentee)
 * - mentee: Mentee object (if current user is mentor)
 * - onJoinMeeting: Function called when "Join Meeting" is clicked
 * - onCancelAppointment: Function called when appointment is cancelled
 * - onRescheduleAppointment: Function called when appointment is rescheduled
 * - onAddReview: Function called when adding a review
 */
const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  mentor,
  mentee,
  onJoinMeeting,
  onApproveAppointment,
  onRejectAppointment,
  onCancelAppointment,
  onRescheduleAppointment,
  onAddReview
}) => {
  const { user } = useAuth();
  
  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    let dateStr = '';
    if (date.toDateString() === today.toDateString()) {
      dateStr = 'Bugün';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      dateStr = 'Yarın';
    } else {
      dateStr = date.toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
    
    const timeStr = date.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return `${dateStr}, ${timeStr}`;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Beklemede', color: 'bg-yellow-100 text-yellow-800', icon: '⌛' },
      confirmed: { label: 'Onaylandı', color: 'bg-green-100 text-green-800', icon: '✔' },
      completed: { label: 'Tamamlandı', color: 'bg-blue-100 text-blue-800', icon: '✓' },
      cancelled: { label: 'İptal Edildi', color: 'bg-red-100 text-red-800', icon: '❌' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <span className="mr-1">{config.icon}</span>
        {config.label}
      </span>
    );
  };

  const isUpcoming = new Date(appointment.dateTime) > new Date();
  const canJoin = appointment.status === 'confirmed' && appointment.meetingLink && isUpcoming;
  const canCancel = appointment.status !== 'cancelled' && appointment.status !== 'completed';
  const canReschedule = appointment.status !== 'cancelled' && appointment.status !== 'completed';
  const canReview = appointment.status === 'completed' && user?.role === 'mentee';
  const canApprove = appointment.status === 'pending' && user?.role === 'mentor';
  const canReject = appointment.status === 'pending' && user?.role === 'mentor';

  const otherUser = user?.role === 'mentor' ? mentee : mentor;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <img
            src={otherUser?.avatar || `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=60`}
            alt={otherUser?.name || 'User'}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900">
              {otherUser?.name || 'Kullanıcı'}
            </h3>
            <p className="text-sm text-blue-600">
              {user?.role === 'mentor' ? 'Menti' : (mentor?.title || 'Mentör')}
            </p>
            {mentor?.company && (
              <p className="text-xs text-gray-500">{mentor.company}</p>
            )}
          </div>
        </div>
        
        {getStatusBadge(appointment.status)}
      </div>

      {/* Topic */}
      {appointment.topic && (
        <div className="mb-4">
          <div className="flex items-center space-x-2 text-gray-700">
            <MessageSquare className="w-4 h-4" />
            <span className="font-medium">{appointment.topic}</span>
          </div>
        </div>
      )}

      {/* Date and Time */}
      <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4" />
          <span>{formatDateTime(appointment.dateTime)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4" />
          <span>{appointment.duration} dakika</span>
        </div>
        {appointment.platform && (
          <div className="flex items-center space-x-2">
            <Video className="w-4 h-4" />
            <span>{appointment.platform}</span>
          </div>
        )}
      </div>

      {/* Notes */}
      {appointment.notes && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">{appointment.notes}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        {canApprove && (
          <button
            onClick={() => onApproveAppointment?.(appointment.id)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Onayla</span>
          </button>
        )}
        
        {canReject && (
          <button
            onClick={() => onRejectAppointment?.(appointment.id)}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <XCircle className="w-4 h-4" />
            <span>Reddet</span>
          </button>
        )}
        
        {canJoin && (
          <button
            onClick={() => onJoinMeeting?.(appointment)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Video className="w-4 h-4" />
            <span>Görüşmeye Katıl</span>
          </button>
        )}
        
        {canReschedule && (
          <button
            onClick={() => onRescheduleAppointment?.(appointment.id)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Yeniden Planla</span>
          </button>
        )}
        
        {canCancel && (
          <button
            onClick={() => onCancelAppointment?.(appointment.id)}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>İptal Et</span>
          </button>
        )}
        
        {canReview && (
          <button
            onClick={() => onAddReview?.(appointment)}
            className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            <Star className="w-4 h-4" />
            <span>Değerlendirme Yap</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;