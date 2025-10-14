import React, { useState, useEffect } from 'react';
import { Trash2, Shield, Download, RefreshCw, CheckCircle } from 'lucide-react';

interface ConsentSettings {
  requiredConsent: boolean;
  marketingConsent: boolean;
  lastUpdated: string;
}

const SettingsDataManagement: React.FC = () => {
  const [consents, setConsents] = useState<ConsentSettings>({
    requiredConsent: false,
    marketingConsent: false,
    lastUpdated: new Date().toISOString()
  });
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  useEffect(() => {
    // Load consent settings from session storage
    const stored = sessionStorage.getItem('mentee_prefs');
    if (stored) {
      const data = JSON.parse(stored);
      setConsents({
        requiredConsent: data.requiredConsent || false,
        marketingConsent: data.marketingConsent || false,
        lastUpdated: data.timestamp || new Date().toISOString()
      });
    }
  }, []);

  const handleConsentUpdate = (type: 'required' | 'marketing', value: boolean) => {
    const newConsents = {
      ...consents,
      [type === 'required' ? 'requiredConsent' : 'marketingConsent']: value,
      lastUpdated: new Date().toISOString()
    };

    setConsents(newConsents);

    // Update session storage
    const stored = sessionStorage.getItem('mentee_prefs');
    if (stored) {
      const data = JSON.parse(stored);
      data.requiredConsent = newConsents.requiredConsent;
      data.marketingConsent = newConsents.marketingConsent;
      data.timestamp = newConsents.lastUpdated;
      sessionStorage.setItem('mentee_prefs', JSON.stringify(data));
    }

    setActionMessage({ text: 'İzin ayarların güncellendi', type: 'success' });
    setTimeout(() => setActionMessage(null), 3000);
  };

  const handleClearData = () => {
    sessionStorage.removeItem('mentee_prefs');
    setConsents({
      requiredConsent: false,
      marketingConsent: false,
      lastUpdated: new Date().toISOString()
    });
    setShowConfirmClear(false);
    setActionMessage({ text: 'Geçici veriler temizlendi', type: 'info' });
    setTimeout(() => setActionMessage(null), 3000);
  };

  const handleExportData = () => {
    const stored = sessionStorage.getItem('mentee_prefs');
    if (stored) {
      const data = JSON.parse(stored);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mentorhub-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      setActionMessage({ text: 'Verileriniz indirildi', type: 'success' });
      setTimeout(() => setActionMessage(null), 3000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Shield className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Veri ve Gizlilik Ayarları
        </h2>
        <p className="text-gray-600">
          Verilerinizi yönetin ve izin tercihlerinizi güncelleyin
        </p>
      </div>

      {/* Action Message */}
      {actionMessage && (
        <div className={`${
          actionMessage.type === 'success' ? 'bg-green-50 border-green-500 text-green-900' : 'bg-blue-50 border-blue-500 text-blue-900'
        } border-2 rounded-lg p-4 flex items-center space-x-3`}>
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">{actionMessage.text}</span>
        </div>
      )}

      {/* Consent Management */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-gray-900 mb-4">İzin Ayarları</h3>

        {/* Required Consent */}
        <div className="flex items-start justify-between p-4 bg-blue-50 rounded-lg">
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">Veri İşleme Rızası</h4>
            <p className="text-sm text-gray-600 mt-1">
              Hizmet sunumu için gerekli
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={consents.requiredConsent}
              onChange={(e) => handleConsentUpdate('required', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Marketing Consent */}
        <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">Pazarlama İletişimi</h4>
            <p className="text-sm text-gray-600 mt-1">
              Kampanya ve güncellemeler (opsiyonel)
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={consents.marketingConsent}
              onChange={(e) => handleConsentUpdate('marketing', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          Son güncelleme: {new Date(consents.lastUpdated).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>

      {/* Data Management */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-gray-900 mb-4">Veri Yönetimi</h3>

        <div className="space-y-3">
          {/* Export Data */}
          <button
            onClick={handleExportData}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <Download className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Verilerini İndir</p>
                <p className="text-sm text-gray-600">JSON formatında</p>
              </div>
            </div>
          </button>

          {/* Clear Data */}
          <button
            onClick={() => setShowConfirmClear(true)}
            className="w-full flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <Trash2 className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-medium text-red-900">Verileri Temizle</p>
                <p className="text-sm text-red-700">Geçici depolamadan sil</p>
              </div>
            </div>
          </button>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
          <p className="text-xs text-amber-900">
            Bu aşamada veriler yalnızca cihazında (geçici) saklanır. Hesap oluşturarak kalıcı hale getirebilirsin.
          </p>
        </div>
      </div>

      {/* Confirm Clear Modal */}
      {showConfirmClear && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              Verileri Temizle?
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Tüm geçici veriler silinecek. Bu işlem geri alınamaz.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmClear(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleClearData}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                Temizle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Link */}
      <div className="text-center">
        <a
          href="mailto:privacy@mentorhub.com"
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Sorularınız için: privacy@mentorhub.com
        </a>
      </div>
    </div>
  );
};

export default SettingsDataManagement;
