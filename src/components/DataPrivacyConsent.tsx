import React, { useState } from 'react';
import { Lock, Mail, ChevronDown, ChevronUp, Shield, Trash2 } from 'lucide-react';

interface DataPrivacyConsentProps {
  onConsentChange: (required: boolean, marketing: boolean) => void;
  requiredConsent: boolean;
  marketingConsent: boolean;
}

const DataPrivacyConsent: React.FC<DataPrivacyConsentProps> = ({
  onConsentChange,
  requiredConsent,
  marketingConsent
}) => {
  const [showRequiredDetails, setShowRequiredDetails] = useState(false);

  const handleRequiredChange = (checked: boolean) => {
    onConsentChange(checked, marketingConsent);
  };

  const handleMarketingChange = (checked: boolean) => {
    onConsentChange(requiredConsent, checked);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Shield className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Veri Güvenliği ve İzinler
        </h3>
      </div>

      {/* Required Consent */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 space-y-3">
        <div className="flex items-start space-x-3">
          <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-2">
              Veri İşleme Rızası (Zorunlu)
            </h4>

            <label className="flex items-start space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={requiredConsent}
                onChange={(e) => handleRequiredChange(e.target.checked)}
                className="mt-1 w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                required
                aria-required="true"
              />
              <span className="text-sm text-gray-700 leading-relaxed">
                Mentor eşleştirme ve hizmet sunumu amacıyla kişisel verilerimin işlenmesini kabul ediyorum.
              </span>
            </label>

            {/* Expandable Details */}
            <button
              onClick={() => setShowRequiredDetails(!showRequiredDetails)}
              className="flex items-center space-x-2 text-sm text-blue-700 hover:text-blue-900 mt-3 transition-colors"
              aria-expanded={showRequiredDetails}
            >
              <span>Detaylı bilgi</span>
              {showRequiredDetails ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {showRequiredDetails && (
              <div className="mt-3 pt-3 border-t border-blue-200 space-y-2 text-sm text-gray-700">
                <div className="flex items-start space-x-2">
                  <span className="font-medium min-w-[80px]">Saklama:</span>
                  <span>Geçici (cihazında) — hesap açarsan kalıcı saklama politikası geçerli olur.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-medium min-w-[80px]">Silme Hakkı:</span>
                  <span>İstediğin an verilerini silebilirsin.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-medium min-w-[80px]">Güvenlik:</span>
                  <span>Verilerin güvenli şekilde işlenir.</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Required Notice */}
        {!requiredConsent && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs text-amber-800">
              Devam etmek için bu rızayı onaylamalısın.
            </p>
          </div>
        )}
      </div>

      {/* Marketing Consent (Optional) */}
      <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <Mail className="w-5 h-5 text-gray-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-2">
              Pazarlama İletişimi (İsteğe Bağlı)
            </h4>

            <label className="flex items-start space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={marketingConsent}
                onChange={(e) => handleMarketingChange(e.target.checked)}
                className="mt-1 w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div>
                <span className="text-sm text-gray-700 leading-relaxed block">
                  Kampanyalar ve güncellemeler hakkında bilgilendirilmek istiyorum.
                </span>
                <span className="text-xs text-gray-500 mt-1 block">
                  Esnek tercih — dilediğin an kapatabilirsin.
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="space-y-2">
          <p className="text-xs text-gray-600 leading-relaxed">
            Sade, anlaşılır ve kontrol sende.
          </p>
          <a
            href="mailto:privacy@mentorhub.com"
            className="text-xs text-blue-600 hover:text-blue-800 underline"
          >
            Soruların için: privacy@mentorhub.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default DataPrivacyConsent;
