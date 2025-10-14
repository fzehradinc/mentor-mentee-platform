import React, { useState, useEffect } from 'react';
import { X, User, Mail, Target, DollarSign, Clock, ArrowRight, CircleUser as UserCircle } from 'lucide-react';
import DataPrivacyConsent from './DataPrivacyConsent';

interface MenteeData {
  fullName: string;
  email: string;
  preferredArea: string;
  goal: string;
  budgetRange: string;
  availableTime: string;
}

interface MenteeRegistrationSuccessProps {
  isOpen: boolean;
  onClose: () => void;
  menteeData: MenteeData;
  onViewMatches: () => void;
  onCompleteProfile: () => void;
}

const MenteeRegistrationSuccess: React.FC<MenteeRegistrationSuccessProps> = ({
  isOpen,
  onClose,
  menteeData,
  onViewMatches,
  onCompleteProfile
}) => {
  const [requiredConsent, setRequiredConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Store temporary data in session storage
      const tempData = {
        ...menteeData,
        timestamp: new Date().toISOString(),
        requiredConsent: false,
        marketingConsent: false
      };
      sessionStorage.setItem('mentee_prefs', JSON.stringify(tempData));
    }
  }, [isOpen, menteeData]);

  const handleConsentChange = (required: boolean, marketing: boolean) => {
    setRequiredConsent(required);
    setMarketingConsent(marketing);

    // Update session storage
    const stored = sessionStorage.getItem('mentee_prefs');
    if (stored) {
      const data = JSON.parse(stored);
      data.requiredConsent = required;
      data.marketingConsent = marketing;
      sessionStorage.setItem('mentee_prefs', JSON.stringify(data));
    }
  };

  const handleViewMatches = () => {
    if (!requiredConsent) return;

    // Build URL with filters
    const params = new URLSearchParams();
    if (menteeData.preferredArea) params.set('category', menteeData.preferredArea);
    if (menteeData.budgetRange) params.set('budget', menteeData.budgetRange);
    if (menteeData.availableTime) params.set('time', menteeData.availableTime);

    onViewMatches();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
      role="dialog"
      aria-labelledby="success-title"
      aria-describedby="success-description"
      onKeyDown={handleKeyDown}
    >
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full my-8">
        {/* Header */}
        <div className="relative p-6 border-b border-gray-200">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Kapat"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🎉</span>
            </div>
            <h2 id="success-title" className="text-2xl font-bold text-gray-900 mb-2">
              Kayıt Oluşturuldu
            </h2>
            <p id="success-description" className="text-gray-600">
              Aramıza hoş geldin! Tercihlerin kaydedildi. Şimdi eşleştirmeyi kişiselleştirelim.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4">
            <p className="text-center text-blue-900 font-medium">
              Doğru eşleşme, en hızlı ilerlemenin anahtarı. 🔑
            </p>
          </div>

          {/* Summary Card */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-5 space-y-4">
            <h3 className="font-semibold text-gray-900 mb-3">Kayıt Özeti</h3>

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <User className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Ad Soyad</p>
                  <p className="text-sm font-medium text-gray-900">{menteeData.fullName}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">E-posta</p>
                  <p className="text-sm font-medium text-gray-900">{menteeData.email}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Target className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Tercih Edilen Alan & Hedef</p>
                  <p className="text-sm font-medium text-gray-900">{menteeData.preferredArea}</p>
                  {menteeData.goal && (
                    <p className="text-sm text-gray-600 mt-1">{menteeData.goal}</p>
                  )}
                </div>
              </div>

              {menteeData.budgetRange && (
                <div className="flex items-start space-x-3">
                  <DollarSign className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Bütçe Aralığı</p>
                    <p className="text-sm font-medium text-gray-900">{menteeData.budgetRange}</p>
                  </div>
                </div>
              )}

              {menteeData.availableTime && (
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Müsait Zaman</p>
                    <p className="text-sm font-medium text-gray-900">{menteeData.availableTime}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Data Privacy Consent */}
          <DataPrivacyConsent
            onConsentChange={handleConsentChange}
            requiredConsent={requiredConsent}
            marketingConsent={marketingConsent}
          />

          {/* Temporary Storage Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-900">
              Bilgilerin şu an <strong>geçici olarak</strong> cihazında saklanıyor.
              Hesap oluşturarak kalıcı hale getirebilirsin.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onCompleteProfile}
            className="flex items-center justify-center space-x-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-colors min-h-[44px]"
          >
            <UserCircle className="w-5 h-5" />
            <span>Profilini Tamamla</span>
          </button>

          <button
            onClick={handleViewMatches}
            disabled={!requiredConsent}
            className="flex items-center justify-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px]"
            title={!requiredConsent ? 'Devam etmek için rızayı onaylamalısın' : ''}
          >
            <span>Eşleşmeleri Göster</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenteeRegistrationSuccess;
