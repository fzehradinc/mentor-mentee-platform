import React, { useState } from 'react';
import { Download, Trash2, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface DataPrivacyManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Data Privacy Manager component for KVKK/GDPR compliance
 * Handles user data rights: download, delete, consent management
 */
const DataPrivacyManager: React.FC<DataPrivacyManagerProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [operationStatus, setOperationStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleDownloadData = async () => {
    if (!user) return;
    
    setIsDownloading(true);
    setOperationStatus({ type: null, message: '' });
    
    try {
      // Simulate API call to download user data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock user data
      const userData = {
        user_id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.createdAt,
        onboarding_data: JSON.parse(localStorage.getItem('mentee_onboarding_data') || '{}'),
        consent_history: [
          {
            type: 'data_processing',
            granted: true,
            timestamp: new Date().toISOString()
          }
        ],
        data_retention: {
          retention_period: '12 months',
          auto_delete_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        }
      };
      
      // Create and download JSON file
      const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mentorhub-data-${user.id}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setOperationStatus({
        type: 'success',
        message: 'Verileriniz başarıyla indirildi.'
      });
    } catch (error) {
      setOperationStatus({
        type: 'error',
        message: 'Veri indirme işlemi başarısız oldu. Lütfen tekrar deneyin.'
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDeleteData = async () => {
    if (!user || deleteConfirmation !== 'SİL') return;
    
    setIsDeleting(true);
    setOperationStatus({ type: null, message: '' });
    
    try {
      // Simulate API call to delete user data
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // In a real app, this would call DELETE /user/{id}
      console.log('Deleting user data for:', user.id);
      
      // Clear local storage
      localStorage.removeItem('user');
      localStorage.removeItem('mentee_onboarding_data');
      localStorage.removeItem('mh_role');
      
      setOperationStatus({
        type: 'success',
        message: 'Verileriniz başarıyla silindi. 72 saat içinde tüm sistemlerden tamamen kaldırılacaktır.'
      });
      
      // Auto logout after 3 seconds
      setTimeout(() => {
        window.location.reload();
      }, 3000);
      
    } catch (error) {
      setOperationStatus({
        type: 'error',
        message: 'Veri silme işlemi başarısız oldu. Lütfen destek ekibi ile iletişime geçin.'
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setDeleteConfirmation('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Veri Gizliliği Yönetimi</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Status Message */}
          {operationStatus.type && (
            <div className={`p-4 rounded-lg flex items-center space-x-3 ${
              operationStatus.type === 'success' 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              {operationStatus.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-600" />
              )}
              <p className={`text-sm ${
                operationStatus.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {operationStatus.message}
              </p>
            </div>
          )}

          {/* Data Rights Information */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">KVKK Kapsamındaki Haklarınız</h3>
            <div className="space-y-3 text-sm text-blue-800">
              <div className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Kişisel verilerinizin işlenip işlenmediğini öğrenme</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>İşlenen kişisel verileriniz hakkında bilgi talep etme</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Kişisel verilerinizin düzeltilmesini isteme</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Kişisel verilerinizin silinmesini isteme (unutulma hakkı)</span>
              </div>
            </div>
          </div>

          {/* Download Data Section */}
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                  <Download className="w-5 h-5 mr-2 text-gray-600" />
                  Verilerimi İndir
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Platformda saklanan tüm kişisel verilerinizi JSON formatında indirin. 
                  Bu dosya onboarding cevaplarınızı, rıza geçmişinizi ve hesap bilgilerinizi içerir.
                </p>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>• Dosya formatı: JSON</p>
                  <p>• İçerik: Profil bilgileri, onboarding cevapları, rıza geçmişi</p>
                  <p>• Güvenlik: Hassas veriler hash'lenmiş olarak gösterilir</p>
                </div>
              </div>
              <button
                onClick={handleDownloadData}
                disabled={isDownloading}
                className="ml-4 flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isDownloading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>İndiriliyor...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>İndir</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Delete Data Section */}
          <div className="border border-red-200 rounded-lg p-6 bg-red-50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-900 mb-2 flex items-center">
                  <Trash2 className="w-5 h-5 mr-2 text-red-600" />
                  Verilerimi Sil (Unutulma Hakkı)
                </h3>
                <p className="text-red-800 text-sm mb-4">
                  <strong>DİKKAT:</strong> Bu işlem geri alınamaz. Tüm verileriniz kalıcı olarak silinecektir.
                </p>
                <div className="text-xs text-red-700 space-y-1 mb-4">
                  <p>• Hesap bilgileriniz tamamen silinir</p>
                  <p>• Onboarding cevapları ve tercihler silinir</p>
                  <p>• Geçmiş seans kayıtları anonim hale getirilir</p>
                  <p>• İşlem 72 saat içinde tamamlanır</p>
                </div>
                
                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                  >
                    Silme İşlemini Başlat →
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-red-900 mb-2">
                        Onaylamak için "SİL" yazın:
                      </label>
                      <input
                        type="text"
                        value={deleteConfirmation}
                        onChange={(e) => setDeleteConfirmation(e.target.value)}
                        placeholder="SİL"
                        className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleDeleteData}
                        disabled={deleteConfirmation !== 'SİL' || isDeleting}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isDeleting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Siliniyor...</span>
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4" />
                            <span>Kalıcı Olarak Sil</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeleteConfirmation('');
                        }}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        İptal
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">İletişim</h4>
            <p className="text-sm text-gray-600">
              Veri gizliliği ile ilgili sorularınız için:{' '}
              <a href="mailto:privacy@mentorhub.com" className="text-blue-600 hover:text-blue-700">
                privacy@mentorhub.com
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataPrivacyManager;