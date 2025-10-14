import React, { useState } from 'react';
import { X, CheckCircle, Mail } from 'lucide-react';

interface SubmitForReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => Promise<void>;
  missingFields: string[];
}

const SubmitForReviewModal: React.FC<SubmitForReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  missingFields
}) => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!acceptedTerms) return;

    setSubmitting(true);
    try {
      await onSubmit();
      onClose();
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && acceptedTerms && !submitting) {
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  const hasNoMissingFields = missingFields.length === 0;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-labelledby="submit-modal-title"
      aria-describedby="submit-modal-description"
      onKeyDown={handleKeyDown}
    >
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <h3 id="submit-modal-title" className="text-xl font-semibold text-gray-900">
              Profilini İncelemeye Gönder ✉️
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Kapat"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div id="submit-modal-description" className="text-gray-700">
            {hasNoMissingFields ? (
              <p className="leading-relaxed">
                Harika! Profilin gerekli bilgileri içeriyor. Gönderdiğinde ekip doğrulama
                kontrollerini yapacak; onay sonrası profilin yayına alınacak.
              </p>
            ) : (
              <p className="leading-relaxed text-amber-700 bg-amber-50 p-4 rounded-lg">
                Profilin eksik bilgiler içeriyor. Yine de gönderebilirsin ancak onay süresi uzayabilir.
              </p>
            )}
          </div>

          {/* Checklist */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Kontrol Listesi:</h4>
            <div className="space-y-2">
              <div className={`flex items-start space-x-3 p-3 rounded-lg ${
                missingFields.includes('avatar')
                  ? 'bg-amber-50'
                  : 'bg-green-50'
              }`}>
                <CheckCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                  missingFields.includes('avatar')
                    ? 'text-amber-500'
                    : 'text-green-600'
                }`} />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Zorunlu görsel: Profil fotoğrafı
                  </p>
                  {missingFields.includes('avatar') && (
                    <p className="text-xs text-amber-700 mt-1">Eksik</p>
                  )}
                </div>
              </div>

              <div className={`flex items-start space-x-3 p-3 rounded-lg ${
                missingFields.some(f => ['name', 'title', 'short_bio'].includes(f))
                  ? 'bg-amber-50'
                  : 'bg-green-50'
              }`}>
                <CheckCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                  missingFields.some(f => ['name', 'title', 'short_bio'].includes(f))
                    ? 'text-amber-500'
                    : 'text-green-600'
                }`} />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Temel bilgiler: İsim, unvan, kısa bio
                  </p>
                  {missingFields.some(f => ['name', 'title', 'short_bio'].includes(f)) && (
                    <p className="text-xs text-amber-700 mt-1">Eksik alanlar var</p>
                  )}
                </div>
              </div>

              <div className={`flex items-start space-x-3 p-3 rounded-lg ${
                missingFields.some(f => ['expertise', 'pricing'].includes(f))
                  ? 'bg-amber-50'
                  : 'bg-green-50'
              }`}>
                <CheckCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                  missingFields.some(f => ['expertise', 'pricing'].includes(f))
                    ? 'text-amber-500'
                    : 'text-green-600'
                }`} />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Uzmanlık ve fiyatlandırma ayarları
                  </p>
                  {missingFields.some(f => ['expertise', 'pricing'].includes(f)) && (
                    <p className="text-xs text-amber-700 mt-1">Eksik</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                required
              />
              <span className="text-sm text-gray-700">
                Topluluk kuralları ve gizlilik politikasını kabul ediyorum.
              </span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={submitting}
            className="px-6 py-3 text-gray-700 hover:text-gray-900 transition-colors min-h-[44px] disabled:opacity-50"
          >
            İptal
          </button>

          <button
            onClick={handleSubmit}
            disabled={!acceptedTerms || submitting}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px]"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Gönderiliyor...</span>
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                <span>İncelemeye Gönder</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitForReviewModal;
