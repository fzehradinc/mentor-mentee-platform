import React from 'react';
import { Star, User } from 'lucide-react';
import { Review } from '../../types';

interface ReviewsListProps {
  reviews: Review[];
  showMentorName?: boolean;
  showMenteeName?: boolean;
  limit?: number;
}

/**
 * Reviews list component displaying user reviews
 * Props:
 * - reviews: Array of review objects
 * - showMentorName: Whether to show mentor name (default: false)
 * - showMenteeName: Whether to show mentee name (default: true)
 * - limit: Maximum number of reviews to show (default: show all)
 */
const ReviewsList: React.FC<ReviewsListProps> = ({
  reviews,
  showMentorName = false,
  showMenteeName = true,
  limit
}) => {
  const displayedReviews = limit ? reviews.slice(0, limit) : reviews;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? 'text-amber-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (displayedReviews.length === 0) {
    return (
      <div className="text-center py-8">
        <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h4 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h4>
        <p className="text-gray-600">Be the first to leave a review!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {displayedReviews.map((review) => (
        <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {showMentorName && review.mentorName}
                  {showMenteeName && review.menteeName}
                  {!showMentorName && !showMenteeName && 'Anonymous'}
                </div>
                <div className="text-sm text-gray-500">
                  {formatDate(review.createdAt)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              {renderStars(review.rating)}
            </div>
          </div>

          {/* Comment */}
          <p className="text-gray-700 leading-relaxed">
            {review.comment}
          </p>
        </div>
      ))}

      {limit && reviews.length > limit && (
        <div className="text-center">
          <button className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
            View all {reviews.length} reviews
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewsList;