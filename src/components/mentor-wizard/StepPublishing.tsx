import React, { useState } from 'react';
import { Globe, Eye, BarChart3, CheckCircle, AlertTriangle, ExternalLink, Copy } from 'lucide-react';
import FormField from './FormField';

interface PublishingSettings {
  profile_status: 'draft' | 'published' | 'hidden';
  visibility: 'public' | 'private' | 'unlisted';
  seo_title: string;
  seo_description: string;
  seo_image_url: string;
  seo_keywords: string[];
  ga4_id: string;
  fb_pixel_id: string;
  hotjar_id: string;
}

interface StepPublishingProps {
  data: PublishingSettings;
  onChange: (field: keyof PublishingSettings, value: string | string[]) => void;
  errors: Record<string, string>;
  onPreview: () => void;
  onPublish: () => void;
  isPublishing: boolean;
  profileData: any;
}

/**
 * Step 7: Publishing, SEO and Analytics
 */
const StepPublishing: React.FC<StepPublishingProps> = ({
  data,
  onChange,
  errors,
  onPreview,
  onPublish,
  isPublishing,
  profileData
}) => {
  const [showSEOPreview, setShowSEOPreview] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleKeywordAdd = () => {
    if (newKeyword.trim() && data.seo_keywords.length < 10 && !data.seo_keywords.includes(newKeyword.trim())) {
      onChange('seo_keywords', [...data.seo_keywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const handleKeywordRemove = (keyword: string) => {
    onChange('seo_keywords', data.seo_keywords.filter(k => k !== keyword));
  };

  const generateSlug = (name: string, title: string) => {
    const combined = `${name} ${title}`.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .trim('-')
      .substring(0, 60);
    return combined;
  };

  const autoGenerateSEO = () => {
    if (!data.seo_title && profileData.display_name && profileData.title) {
      const title = `${profileData.display_name} - ${profileData.title} | MentorHub`;
      onChange('seo_title', title.substring(0, 60));
    }
    
    if (!data.seo_description && profileData.short_bio) {
      onChange('seo_description', profileData.short_bio.substring(0, 160));
    }
    
    if (profileData.display_name && profileData.title) {
      const slug = generateSlug(profileData.display_name, profileData.title);
      onChange('seo_keywords', [profileData.primary_category, ...profileData.skills.slice(0, 3)]);
    }
  };

  const getSEOScore = () => {
    let score = 0;
    if (data.seo_title && data.seo_title.length >= 30) score += 20;
    if (data.seo_description && data.seo_description.length >= 120) score += 20;
    if (data.seo_image_url) score += 20;
    if (data.seo_keywords.length >= 5) score += 20;
    if (profileData.avatar_upload) score += 10;
    if (profileData.long_bio && profileData.long_bio.length >= 400) score += 10;
    return score;
  };

  const copyPublicUrl = () => {
    const url = `https://mentorhub.com/mentor/${generateSlug(profileData.display_name, profileData.title)}`;
    navigator.clipboard.writeText(url);
    alert('Public URL kopyalandı!');
  };

  const seoScore = getSEOScore();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Globe className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Profil Yayınlama & Analitik
        </h2>
        <p className="text-gray-600">
          Dünya seni keşfetmeye hazır, profilini yayına al! 🚀
        </p>
      </div>

      {/* Profile Status */}
      <FormField
        label="Profil Durumu"
        helper="Profilinizin görünürlük durumunu kontrol edin"
      >
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              { key: 'draft', label: 'Taslak', icon: '📝', desc: 'Henüz yayında değil' },
              { key: 'published', label: 'Yayında', icon: '🌍', desc: 'Herkes görebilir' },
              { key: 'hidden', label: 'Gizli', icon: '🔒', desc: 'Geçici olarak gizli' }
            ].map((status) => (
              <button
                key={status.key}
                type="button"
                onClick={() => onChange('profile_status', status.key)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 text-center hover:scale-105 ${
                  data.profile_status === status.key
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                    : 'border-gray-200 hover:border-blue-300 bg-white'
                }`}
              >
                <div className="text-2xl mb-2">{status.icon}</div>
                <h3 className="font-semibold">{status.label}</h3>
                <p className="text-sm text-gray-600">{status.desc}</p>
              </button>
            ))}
          </div>

          {data.profile_status === 'published' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-green-900">Profil Yayında! 🎉</h4>
                  <p className="text-sm text-green-700">
                    Public URL: mentorhub.com/mentor/{generateSlug(profileData.display_name || '', profileData.title || '')}
                  </p>
                </div>
                <button
                  onClick={copyPublicUrl}
                  className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  <span>Kopyala</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </FormField>

      {/* SEO Settings */}
      <FormField
        label="SEO Optimizasyonu"
        helper="Doğru SEO ile daha çok mentee seni bulur 🔍"
      >
        <div className="space-y-6">
          {/* Auto-generate button */}
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium text-gray-900">SEO Skoru: {seoScore}/100</h4>
              <div className="w-64 bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    seoScore >= 80 ? 'bg-green-500' : seoScore >= 60 ? 'bg-blue-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${seoScore}%` }}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={autoGenerateSEO}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              Otomatik Doldur
            </button>
          </div>

          {/* SEO Title */}
          <FormField
            label="SEO Başlık"
            error={errors.seo_title}
            helper="Google'da görünecek başlık (30-60 karakter önerilir)"
          >
            <input
              type="text"
              value={data.seo_title}
              onChange={(e) => onChange('seo_title', e.target.value)}
              placeholder="Ayşe Kılıç - Senior UX Designer | MentorHub"
              maxLength={60}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.seo_title ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            <div className="flex justify-between items-center mt-1">
              <span className={`text-xs ${data.seo_title.length >= 30 ? 'text-green-600' : 'text-amber-600'}`}>
                {data.seo_title.length >= 30 ? 'Uygun uzunluk' : 'En az 30 karakter önerilir'}
              </span>
              <span className="text-xs text-gray-500">
                {data.seo_title.length}/60
              </span>
            </div>
          </FormField>

          {/* SEO Description */}
          <FormField
            label="Meta Açıklama"
            error={errors.seo_description}
            helper="Arama sonuçlarında görünecek açıklama (120-160 karakter)"
          >
            <textarea
              value={data.seo_description}
              onChange={(e) => onChange('seo_description', e.target.value)}
              placeholder="8 yıllık UX deneyimi ile kariyer gelişiminize destek. Figma, UX Research ve Portfolio Review konularında uzman mentörlük."
              maxLength={160}
              rows={3}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                errors.seo_description ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            <div className="flex justify-between items-center mt-1">
              <span className={`text-xs ${data.seo_description.length >= 120 ? 'text-green-600' : 'text-amber-600'}`}>
                {data.seo_description.length >= 120 ? 'Uygun uzunluk' : 'En az 120 karakter önerilir'}
              </span>
              <span className="text-xs text-gray-500">
                {data.seo_description.length}/160
              </span>
            </div>
          </FormField>

          {/* Keywords */}
          <FormField
            label="Anahtar Kelimeler"
            helper="SEO için önemli kelimeler (maksimum 10 adet)"
          >
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="Anahtar kelime ekle..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleKeywordAdd();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleKeywordAdd}
                  disabled={data.seo_keywords.length >= 10}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Ekle
                </button>
              </div>

              {data.seo_keywords.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {data.seo_keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {keyword}
                      <button
                        type="button"
                        onClick={() => handleKeywordRemove(keyword)}
                        className="ml-2 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </FormField>

          {/* SEO Preview Button */}
          <button
            type="button"
            onClick={() => setShowSEOPreview(!showSEOPreview)}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>{showSEOPreview ? 'Önizlemeyi Gizle' : 'SEO Önizleme'}</span>
          </button>

          {/* SEO Preview */}
          {showSEOPreview && (
            <div className="bg-gray-50 rounded-lg p-6 space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">🔍 Google Arama Sonucu:</h4>
                <div className="bg-white border border-gray-200 rounded-lg p-4 font-sans">
                  <h5 className="text-blue-600 text-lg hover:underline cursor-pointer">
                    {data.seo_title || 'SEO başlık buraya gelecek'}
                  </h5>
                  <p className="text-green-700 text-sm">
                    mentorhub.com/mentor/{generateSlug(profileData.display_name || '', profileData.title || '')}
                  </p>
                  <p className="text-gray-700 text-sm mt-1">
                    {data.seo_description || 'Meta açıklama buraya gelecek...'}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">📱 Sosyal Medya Kartı:</h4>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex space-x-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                      {data.seo_image_url ? (
                        <img src={data.seo_image_url} alt="OG" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <span className="text-gray-400">📷</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900">
                        {data.seo_title || 'Başlık'}
                      </h5>
                      <p className="text-sm text-gray-600 mt-1">
                        {data.seo_description || 'Açıklama'}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">mentorhub.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </FormField>

      {/* Analytics Integration */}
      <FormField
        label="Analitik & İzleme"
        helper="Analitikler yolunu aydınlatır 📊"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Google Analytics 4 */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900">Google Analytics 4</h4>
              </div>
              <input
                type="text"
                value={data.ga4_id}
                onChange={(e) => onChange('ga4_id', e.target.value)}
                placeholder="G-XXXXXXXXXX"
                pattern="^G-[A-Z0-9]{10}$"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="mt-2 flex items-center space-x-1">
                {data.ga4_id ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-green-700">Aktif</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span className="text-xs text-amber-700">Kurulum gerekli</span>
                  </>
                )}
              </div>
            </div>

            {/* Facebook Pixel */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">f</span>
                </div>
                <h4 className="font-medium text-gray-900">Facebook Pixel</h4>
              </div>
              <input
                type="text"
                value={data.fb_pixel_id}
                onChange={(e) => onChange('fb_pixel_id', e.target.value)}
                placeholder="123456789012345"
                pattern="^[0-9]{15,16}$"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="mt-2 flex items-center space-x-1">
                {data.fb_pixel_id ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-green-700">Aktif</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span className="text-xs text-amber-700">Opsiyonel</span>
                  </>
                )}
              </div>
            </div>

            {/* Hotjar */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-orange-600">H</span>
                </div>
                <h4 className="font-medium text-gray-900">Hotjar</h4>
              </div>
              <input
                type="text"
                value={data.hotjar_id}
                onChange={(e) => onChange('hotjar_id', e.target.value)}
                placeholder="1234567"
                pattern="^[0-9]{6,7}$"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="mt-2 flex items-center space-x-1">
                {data.hotjar_id ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-green-700">Aktif</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span className="text-xs text-amber-700">Opsiyonel</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Analytics Benefits */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">📊 Analitik Faydaları:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Profil görüntüleme sayılarını takip edin</li>
              <li>• Hangi anahtar kelimelerle bulunduğunuzu görün</li>
              <li>• Mentee davranışlarını analiz edin</li>
              <li>• Dönüşüm oranlarınızı optimize edin</li>
            </ul>
          </div>
        </div>
      </FormField>

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
                <ExternalLink className="w-3 h-3" />
                <span>Gizlilik Politikası</span>
              </a>
            </div>
          </div>
        </label>
      </div>

      {/* Publishing Actions */}
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
              onClick={onPreview}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors min-h-[44px]"
            >
              <Eye className="w-4 h-4" />
              <span>Son Önizleme</span>
            </button>
            
            <button
              onClick={onPublish}
              disabled={!termsAccepted || isPublishing}
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

      {/* Publishing Guidelines */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-900 mb-2">📋 Yayınlama Kuralları:</h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Profil fotoğrafı ve temel bilgiler zorunludur</li>
          <li>• Yayınlanan profiller 24 saat içinde incelenir</li>
          <li>• Topluluk kurallarına aykırı içerik reddedilir</li>
          <li>• SEO optimizasyonu görünürlüğü artırır</li>
        </ul>
      </div>
    </div>
  );
};

export default StepPublishing;