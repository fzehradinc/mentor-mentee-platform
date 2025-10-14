import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, Eye, Globe, Shield, ExternalLink } from 'lucide-react';

interface MentorProfile {
  display_name: string;
  title: string;
  company_name: string;
  short_bio: string;
  languages: string[];
  location: string;
  primary_category: string;
  skills: string[];
  experience_years: number;
  highlight_offers: string[];
  price_per_session: number;
  first_session_discount: boolean;
  discount_note: string;
  avatar_upload: string;
  cover_upload: string;
  video_intro_url: string;
  long_bio: string;
}

interface StepReviewPublishProps {
  data: MentorProfile;
  onChange: (field: string, value: any) => void;
  errors: Record<string, string>;
  onPreview: () => void;
  onPublish: () => void;
  isPublishing: boolean;
}

/**
 * Step 6: Review profile and publish
 */
const StepReviewPublish: React.FC<StepReviewPublishProps> = ({
  data,
  onChange,
  errors,
  onPreview,
  onPublish,
  isPublishing
}) => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const categories = {
    'urun': 'Ürün',
    'tasarim': 'Tasarım',
    'yazilim': 'Yazılım',
    'veri': 'Veri/AI',
    'pazarlama': 'Pazarlama',
    'liderlik': 'Liderlik',
    'girisimcilik': 'Girişimcilik'
  };

  // Validation checks
  const validationChecks = [
    {
      field: 'display_name',
      label: 'Görünecek İsim',
      isValid: data.display_name.length >= 2 && data.display_name.length <= 50,
      value: data.display_name
    },
    {
      field: 'title',
      label: 'Unvan/Pozisyon',
      isValid: data.title.length >= 2 && data.title.length <= 60,
      value: data.title
    },
    {
      field: 'short_bio',
      label: 'Kısa Tanıtım',
      isValid: data.short_bio.length >= 80 && data.short_bio.length <= 160,
      value: data.short_bio
    },
    {
      field: 'languages',
      label: 'Diller',
      isValid: data.languages.length > 0,
      value: data.languages.join(', ')
    },
    {
      field: 'location',
      label: 'Konum',
      isValid: data.location.length > 0,
      value: data.location
    },
    {
      field: 'primary_category',
      label: 'Ana Kategori',
      isValid: data.primary_category.length > 0,
      value: categories[data.primary_category as keyof typeof categories] || data.primary_category
    },
    {
      field: 'skills',
      label: 'Beceriler',
      isValid: data.skills.length >= 3,
      value: `${data.skills.length} beceri seçildi`
    },
    {
      field: 'experience_years',
      label: 'Deneyim',
      isValid: data.experience_years > 0,
      value: `${data.experience_years}+ yıl`
    },
    {
      field: 'price_per_session',
      label: 'Seans Ücreti',
      isValid: data.price_per_session >= 100,
      value: `${data.price_per_session}₺`
    },
    {
      field: 'avatar_upload',
      label: 'Profil Fotoğrafı',
      isValid: data.avatar_upload.length > 0,
      value: data.avatar_upload ? 'Yüklendi' : 'Eksik'
    },
    {
      field: 'long_bio',
      label: 'Detaylı Tanıtım',
      isValid: data.long_bio.length >= 400,
      value: `${data.long_bio.length} karakter`
    }
  ];

  const completedFields = validationChecks.filter(check => check.isValid).length;
  const totalFields = validationChecks.length;
  const completionPercentage = Math.round((completedFields / totalFields) * 100);
  const isProfileComplete = completedFields === totalFields && termsAccepted;

  const handlePublishClick = () => {
    if (!isProfileComplete) {
      alert('Lütfen tüm zorunlu alanları doldurun ve kullanım koşullarını kabul edin.');
      return;
    }
    onPublish();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Önizleme & Yayınla
        </h2>
        <p className="text-gray-600">
          Profilinizi gözden geçirin ve yayınlamaya hazır hale getirin
        </p>
      </div>

      {/* Completion Status */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Profil Tamamlanma Durumu</h3>
          <span className={`text-2xl font-bold ${completionPercentage === 100 ? 'text-green-600' : 'text-blue-600'}`}>
            %{completionPercentage}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              completionPercentage === 100 ? 'bg-green-600' : 'bg-blue-600'
            }`}
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        
        <p className="text-sm text-gray-600">
          {completedFields}/{totalFields} alan tamamlandı
        </p>
      </div>

      {/* Validation Summary */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profil Kontrolü</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {validationChecks.map((check) => (
            <div
              key={check.field}
              className={`flex items-center space-x-3 p-3 rounded-lg ${
                check.isValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}
            >
              {check.isValid ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-600" />
              )}
              <div className="flex-1">
                <p className={`text-sm font-medium ${check.isValid ? 'text-green-900' : 'text-red-900'}`}>
                  {check.label}
                </p>
                <p className={`text-xs ${check.isValid ? 'text-green-700' : 'text-red-700'}`}>
                  {check.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Preview */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Profil Önizlemesi</h3>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>{showPreview ? 'Gizle' : 'Önizleme'}</span>
          </button>
        </div>

        {showPreview && (
          <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
            {/* Mock Mentor Card Preview */}
            <div className="bg-white rounded-xl shadow-md p-6 max-w-md mx-auto">
              <div className="flex items-start space-x-4 mb-4">
                {data.avatar_upload ? (
                  <img
                    src={data.avatar_upload}
                    alt={data.display_name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-400">📷</span>
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">{data.display_name || 'İsim'}</h4>
                  <p className="text-blue-600 font-medium">{data.title || 'Unvan'}</p>
                  {data.company_name && (
                    <p className="text-sm text-gray-500">{data.company_name}</p>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-gray-700 mb-4">
                {data.short_bio || 'Kısa tanıtım buraya gelecek...'}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {categories[data.primary_category as keyof typeof categories] || 'Kategori'}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  {data.experience_years}+ yıl
                </span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                  {data.price_per_session}₺/saat
                </span>
              </div>
              
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold">
                Seans Al
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Terms and Conditions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
          />
          <div>
            <span className="font-medium text-gray-900">
              Topluluk kuralları ve gizlilik politikasını kabul ediyorum
            </span>
            <p className="text-sm text-gray-600 mt-1">
              Mentor olarak platform kurallarına uyacağımı ve mentee'lere kaliteli hizmet vereceğimi taahhüt ediyorum.
            </p>
            <div className="flex items-center space-x-4 mt-2">
              <a
                href="#"
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Topluluk Kuralları</span>
              </a>
              <a
                href="#"
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
              >
                <Shield className="w-3 h-3" />
                <span>Gizlilik Politikası</span>
              </a>
            </div>
          </div>
        </label>
      </div>

      {/* Publish Actions */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Profiliniz Yayınlamaya Hazır! 🎉
          </h3>
          <p className="text-gray-600 mb-6">
            Mentor profiliniz onaylandıktan sonra mentee'ler tarafından görülebilir olacak.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors min-h-[44px]"
            >
              <Eye className="w-4 h-4" />
              <span>Son Önizleme</span>
            </button>
            
            <button
              onClick={handlePublishClick}
              disabled={!isProfileComplete || isPublishing}
              className="flex items-center justify-center space-x-2 px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px]"
            >
              {isPublishing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Yayınlanıyor...</span>
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4" />
                  <span>Profilimi Yayınla</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Profile Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-3 h-3 bg-blue-600 rounded-full mr-2"></span>
            Temel Bilgiler
          </h4>
          <div className="space-y-2 text-sm">
            <p><strong>İsim:</strong> {data.display_name || 'Belirtilmedi'}</p>
            <p><strong>Unvan:</strong> {data.title || 'Belirtilmedi'}</p>
            <p><strong>Şirket:</strong> {data.company_name || 'Belirtilmedi'}</p>
            <p><strong>Konum:</strong> {data.location || 'Belirtilmedi'}</p>
            <p><strong>Diller:</strong> {data.languages.join(', ') || 'Belirtilmedi'}</p>
          </div>
        </div>

        {/* Expertise Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-3 h-3 bg-purple-600 rounded-full mr-2"></span>
            Uzmanlık
          </h4>
          <div className="space-y-2 text-sm">
            <p><strong>Kategori:</strong> {categories[data.primary_category as keyof typeof categories] || 'Belirtilmedi'}</p>
            <p><strong>Deneyim:</strong> {data.experience_years}+ yıl</p>
            <p><strong>Beceriler:</strong> {data.skills.length} adet</p>
            <p><strong>Özel Hizmetler:</strong> {data.highlight_offers.length} adet</p>
          </div>
        </div>

        {/* Pricing Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-3 h-3 bg-emerald-600 rounded-full mr-2"></span>
            Fiyatlandırma
          </h4>
          <div className="space-y-2 text-sm">
            <p><strong>Seans Ücreti:</strong> {data.price_per_session}₺</p>
            <p><strong>İlk Seans İndirimi:</strong> {data.first_session_discount ? 'Evet' : 'Hayır'}</p>
            {data.first_session_discount && data.discount_note && (
              <p><strong>İndirim Detayı:</strong> {data.discount_note}</p>
            )}
          </div>
        </div>

        {/* Media Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-3 h-3 bg-indigo-600 rounded-full mr-2"></span>
            Medya & İçerik
          </h4>
          <div className="space-y-2 text-sm">
            <p><strong>Profil Fotoğrafı:</strong> {data.avatar_upload ? '✅ Yüklendi' : '❌ Eksik'}</p>
            <p><strong>Kapak Fotoğrafı:</strong> {data.cover_upload ? '✅ Yüklendi' : '➖ Opsiyonel'}</p>
            <p><strong>Tanıtım Videosu:</strong> {data.video_intro_url ? '✅ Eklendi' : '➖ Opsiyonel'}</p>
            <p><strong>Detaylı Bio:</strong> {data.long_bio.length >= 400 ? '✅ Tamamlandı' : '❌ Eksik'}</p>
          </div>
        </div>
      </div>

      {/* Missing Fields Warning */}
      {completionPercentage < 100 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-900">Eksik Alanlar</h4>
              <ul className="text-sm text-amber-800 mt-2 space-y-1">
                {validationChecks
                  .filter(check => !check.isValid)
                  .map(check => (
                    <li key={check.field}>• {check.label}</li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {completionPercentage === 100 && termsAccepted && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <h4 className="font-medium text-green-900">Profiliniz Hazır!</h4>
              <p className="text-sm text-green-700">
                Tüm gerekli alanlar tamamlandı. Artık profilinizi yayınlayabilirsiniz.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepReviewPublish;