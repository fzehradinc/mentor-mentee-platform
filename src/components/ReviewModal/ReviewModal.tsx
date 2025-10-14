import React, { useState } from 'react';
import { Star, X, MessageSquare, Calendar, User } from 'lucide-react';
import { Appointment, Mentor, Mentee } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface ReviewModalProps {
  appointment: Appointment;
  mentor?: Mentor;
  mentee?: Mentee;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reviewData: {
    appointmentId: string;
    rating: number;
    comment: string;
    criteria: Record<string, number>;
  }) => void;
}

/**
 * Review modal component for rating appointments
 * Props:
 * - appointment: Appointment object to review
 * - mentor: Mentor object (if current user is mentee)
 * - mentee: Mentee object (if current user is mentor)
 * - isOpen: Boolean indicating if modal is open
 * - onClose: Function to close the modal
 * - onSubmit: Function called when review is submitted
 */
const ReviewModal: React.FC<ReviewModalProps> = ({
  appointment,
  mentor,
  mentee,
  isOpen,
  onClose,
  onSubmit
}) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [criteria, setCriteria] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isMenteeReviewing = user?.role === 'mentee';
  const reviewTarget = isMenteeReviewing ? mentor : mentee;

  // Criteria based on user role
  const reviewCriteria = isMenteeReviewing ? [
    { key: 'guidance', label: 'Yönlendirme Kalitesi', description: 'Hedeflerinize uygun rehberlik verdi mi?' },
    { key: 'patience', label: 'İlgili ve Sabırlı Olması', description: 'Sorularınızı sabırla dinledi mi?' },
    { key: 'knowledge', label: 'Bilgi Düzeyi', description: 'Konuya hakimiyeti yeterli miydi?' },
    { key: 'communication', label: 'Açıklayıcı Anlatımı', description: 'Anlaşılır şekilde açıklama yaptı mı?' },
    { key: 'efficiency', label: 'Görüşmenin Verimliliği', description: 'Zaman verimli kullanıldı mı?' }
  ] : [
    { key: 'preparation', label: 'Hazırlıklı Olma Durumu', description: 'Görüşmeye hazırlıklı geldi mi?' },
    { key: 'clarity', label: 'Hedeflerinin Netliği', description: 'Hedefleri net şekilde ifade etti mi?' },
    { key: 'communication', label: 'İletişim Dili', description: 'Etkili iletişim kurdu mu?' },
    { key: 'participation', label: 'Görüşmeye Katılımı', description: 'Aktif olarak katıldı mı?' }
  ];

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRatingLabel = (rating: number) => {
    const labels = {
      1: 'Çok Kötü',
      2: 'Kötü', 
      3: 'Orta',
      4: 'İyi',
      5: 'Mükemmel'
    };
    return labels[rating as keyof typeof labels] || '';
  };

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
  };

  const handleCriteriaRating = (criteriaKey: string, criteriaRating: number) => {
    setCriteria(prev => ({
      ...prev,
      [criteriaKey]: criteriaRating
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Lütfen en az 1 puan verin');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit({
        appointmentId: appointment.id,
        rating,
        comment: comment.trim(),
        criteria
      });
      
      // Reset form
      setRating(0);
      setComment('');
      setCriteria({});
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !reviewTarget) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Star className="w-6 h-6 text-amber-500" />
            <h3 className="text-xl font-semibold text-gray-900">Görüşme Değerlendirmesi</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Appointment Info Card */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-4">
              <img
                src={reviewTarget.avatar || `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=60`}
                alt={reviewTarget.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{reviewTarget.name}</h4>
                <p className="text-sm text-blue-600">
                  {isMenteeReviewing ? (mentor?.title || 'Mentör') : 'Menti'}
                </p>
                <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDateTime(appointment.dateTime)}</span>
                  </div>
                  {appointment.topic && (
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="w-3 h-3" />
                      <span>{appointment.topic}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Overall Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Genel Değerlendirme *
            </label>
            <div className="flex items-center space-x-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-colors"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || rating)
                        ? 'text-amber-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-600">
                {rating} / 5 - {getRatingLabel(rating)}
              </p>
            )}
          </div>

          {/* Criteria-based Evaluation */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">
              Detaylı Değerlendirme
            </h4>
            <div className="space-y-4">
              {reviewCriteria.map((criterion) => (
                <div key={criterion.key} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h5 className="font-medium text-gray-900">{criterion.label}</h5>
                      <p className="text-xs text-gray-500">{criterion.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleCriteriaRating(criterion.key, star)}
                        className="transition-colors"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= (criteria[criterion.key] || 0)
                              ? 'text-amber-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                    {criteria[criterion.key] && (
                      <span className="text-sm text-gray-600 ml-2">
                        {criteria[criterion.key]}/5
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comment Section */}
          <div>
            <label htmlFor="comment" className="block text-sm font-semibold text-gray-900 mb-2">
              Yorumunuz
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Bu görüşmede neler faydalıydı? Gelişmesi gereken bir şey var mı?"
              rows={4}
              maxLength={500}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-500">
                İsteğe bağlı - Deneyiminizi paylaşın
              </p>
              <p className="text-xs text-gray-500">
                {comment.length}/500
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={rating === 0 || isSubmitting}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Gönderiliyor...</span>
                </>
              ) : (
                <>
                  <Star className="w-4 h-4" />
                  <span>Değerlendirmeyi Gönder</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;