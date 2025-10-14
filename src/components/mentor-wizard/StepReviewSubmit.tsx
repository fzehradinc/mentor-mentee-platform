import React, { useState, useMemo } from 'react';
import { Eye, Send, AlertCircle, CheckCircle, Camera, User, Briefcase, DollarSign, Calendar, FileText } from 'lucide-react';
import StatusBadge from './StatusBadge';
import SubmitForReviewModal from './SubmitForReviewModal';

type ProfileStatus = 'draft' | 'review' | 'published';

interface MentorReviewData {
  full_name: string;
  title: string;
  short_bio: string;
  long_bio: string;
  avatar_upload: string;
  cover_upload: string;
  video_intro_url: string;
  expertise_areas: Array<{ category: string; skill: string }>;
  price_per_session: number;
  price_tier: string;
  first_session_discount: boolean;
  first_session_discount_value: number;
  packages: Array<{ id: string; name: string; sessions: number; discount: number }>;
  availability: Array<{ day: string; slots: Array<{ start: string; end: string }> }>;
  status: ProfileStatus;
}

interface StepReviewSubmitProps {
  data: MentorReviewData;
  onSubmitForReview: () => Promise<void>;
  onWithdrawReview: () => Promise<void>;
  onGoToStep: (step: number) => void;
}

const StepReviewSubmit: React.FC<StepReviewSubmitProps> = ({
  data,
  onSubmitForReview,
  onWithdrawReview,
  onGoToStep
}) => {
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const { completionPercentage, missingFields, missingFieldDetails } = useMemo(() => {
    const missing: string[] = [];
    const details: Array<{ label: string; field: string; step: number; icon: React.ReactNode }> = [];
    let score = 0;

    // Required fields (60 points)
    if (data.full_name && data.full_name.trim()) {
      score += 10;
    } else {
      missing.push('name');
      details.push({ label: 'İsim Soyisim', field: 'name', step: 0, icon: <User className="w-4 h-4" /> });
    }

    if (data.title && data.title.trim()) {
      score += 10;
    } else {
      missing.push('title');
      details.push({ label: 'Unvan', field: 'title', step: 0, icon: <Briefcase className="w-4 h-4" /> });
    }

    if (data.short_bio && data.short_bio.trim().length >= 50) {
      score += 10;
    } else {
      missing.push('short_bio');
      details.push({ label: 'Kısa Tanıtım (min 50 karakter)', field: 'short_bio', step: 0, icon: <FileText className="w-4 h-4" /> });
    }

    if (data.long_bio && data.long_bio.length >= 400) {
      score += 10;
    } else {
      missing.push('long_bio');
      details.push({ label: 'Detaylı Tanıtım (min 400 karakter)', field: 'long_bio', step: 4, icon: <FileText className="w-4 h-4" /> });
    }

    if (data.avatar_upload && data.avatar_upload.trim()) {
      score += 10;
    } else {
      missing.push('avatar');
      details.push({ label: 'Profil Fotoğrafı', field: 'avatar', step: 4, icon: <Camera className="w-4 h-4" /> });
    }

    if (data.price_per_session > 0) {
      score += 10;
    } else {
      missing.push('pricing');
      details.push({ label: 'Seans Fiyatı', field: 'pricing', step: 3, icon: <DollarSign className="w-4 h-4" /> });
    }

    // Optional fields (40 points)
    if (data.cover_upload && data.cover_upload.trim()) score += 10;
    if (data.video_intro_url && data.video_intro_url.trim()) score += 10;
    if (data.expertise_areas && data.expertise_areas.length > 0) {
      score += 10;
    } else {
      details.push({ label: 'Uzmanlık Alanları', field: 'expertise', step: 1, icon: <Briefcase className="w-4 h-4" /> });
    }
    if (data.availability && data.availability.length > 0) {
      score += 10;
    } else {
      details.push({ label: 'Müsaitlik Takvimi', field: 'availability', step: 2, icon: <Calendar className="w-4 h-4" /> });
    }

    return {
      completionPercentage: score,
      missingFields: missing,
      missingFieldDetails: details
    };
  }, [data]);

  const canSubmit = completionPercentage >= 60;

  const handleSubmitClick = () => {
    setShowSubmitModal(true);
  };

  const handleConfirmSubmit = async () => {
    await onSubmitForReview();
    setShowSubmitModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Eye className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Önizleme & Yayına Hazırlık
        </h2>
        <p className="text-gray-600">
          Bir bakışta kontrol et; profilini incelemeye gönder
        </p>
      </div>

      {/* Status Badge */}
      <div className="flex justify-center">
        <StatusBadge status={data.status} size="lg" />
      </div>

      {/* Motivational Message */}
      {data.status === 'draft' && canSubmit && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-blue-900 text-center">
            Profilin yayına uygun görünüyor. Son bir kontrol ve hazırsın!
          </p>
        </div>
      )}

      {data.status === 'review' && (
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <Eye className="w-5 h-5 text-sky-600 mt-0.5" />
            <div>
              <p className="text-sky-900 font-medium">Profilin İnceleme Sırasında</p>
              <p className="text-sky-700 text-sm mt-1">
                Ekibimiz profilini kontrol ediyor. Onaylandığında sana haber vereceğiz.
              </p>
              <button
                onClick={onWithdrawReview}
                className="text-sky-700 hover:text-sky-900 text-sm font-medium mt-2 underline"
              >
                İncelemeyi iptal et
              </button>
            </div>
          </div>
        </div>
      )}

      {data.status === 'published' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <div className="flex items-center justify-center space-x-2 text-emerald-900">
            <CheckCircle className="w-5 h-5" />
            <p className="font-medium">Tebrikler! Profilin yayında ve görünür.</p>
          </div>
        </div>
      )}

      {/* Completion Summary */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Profil Tamamlanma</h3>
          <span className="text-2xl font-bold text-blue-600">{completionPercentage}%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              completionPercentage >= 80 ? 'bg-green-500' :
              completionPercentage >= 60 ? 'bg-blue-500' :
              'bg-amber-500'
            }`}
            style={{ width: `${completionPercentage}%` }}
          />
        </div>

        {/* Missing Fields */}
        {missingFieldDetails.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Bu birkaç adımı tamamlarsan profiline güç katarsın:
            </h4>
            <div className="space-y-2">
              {missingFieldDetails.map((field, index) => (
                <button
                  key={index}
                  onClick={() => onGoToStep(field.step)}
                  className="w-full flex items-center justify-between p-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-amber-600">
                      {field.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{field.label}</span>
                  </div>
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Profile Preview Card */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Public Önizleme</h3>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 space-y-4">
          {/* Avatar & Cover */}
          <div className="flex items-center space-x-4">
            {data.avatar_upload ? (
              <img
                src={data.avatar_upload}
                alt={data.full_name}
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-gray-400" />
              </div>
            )}

            <div className="flex-1">
              <h4 className="text-xl font-bold text-gray-900">
                {data.full_name || 'İsim Soyisim'}
              </h4>
              <p className="text-gray-600">{data.title || 'Unvan'}</p>
            </div>
          </div>

          {/* Short Bio */}
          <p className="text-gray-700 leading-relaxed">
            {data.short_bio || 'Kısa tanıtım yazısı buraya gelecek...'}
          </p>

          {/* Price */}
          {data.price_per_session > 0 && (
            <div className="flex items-center space-x-2 text-blue-600">
              <DollarSign className="w-5 h-5" />
              <span className="font-semibold">{data.price_per_session}₺</span>
              <span className="text-gray-600">/ seans</span>
            </div>
          )}

          {/* Note */}
          <div className="bg-blue-100 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              İletişim bilgileri, inceleme tamamlanana kadar gizlenir.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6">
        <button
          onClick={() => setShowPreview(true)}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:text-gray-900 transition-colors min-h-[44px]"
        >
          Son Önizleme
        </button>

        {data.status === 'draft' && (
          <button
            onClick={handleSubmitClick}
            disabled={!canSubmit}
            className="flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px]"
          >
            <Send className="w-5 h-5" />
            <span>İncelemeye Gönder</span>
          </button>
        )}

        {data.status === 'review' && (
          <div className="text-right">
            <p className="text-sm text-gray-600">
              Gerek görürsen düzenleyip tekrar gönderebilirsin.
            </p>
          </div>
        )}

        {data.status === 'published' && (
          <button
            className="px-8 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors min-h-[44px]"
          >
            <CheckCircle className="w-5 h-5 inline mr-2" />
            Profilini Gör
          </button>
        )}
      </div>

      {/* Submit Modal */}
      <SubmitForReviewModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onSubmit={handleConfirmSubmit}
        missingFields={missingFields}
      />
    </div>
  );
};

export default StepReviewSubmit;
