import React from 'react';
import { Globe, MapPin, User } from 'lucide-react';
import FormField from './FormField';

interface MentorBasics {
  display_name: string;
  title: string;
  company_name: string;
  short_bio: string;
  languages: string[];
  location: string;
  timezone: string;
}

interface StepBasicsProps {
  data: MentorBasics;
  onChange: (field: keyof MentorBasics, value: string | string[]) => void;
  errors: Record<string, string>;
}

/**
 * Step 1: Basic mentor information
 */
const StepBasics: React.FC<StepBasicsProps> = ({ data, onChange, errors }) => {
  const languageOptions = ['Türkçe', 'İngilizce', 'Almanca', 'Fransızca', 'İspanyolca', 'İtalyanca'];
  const locationOptions = [
    'İstanbul, Türkiye',
    'Ankara, Türkiye', 
    'İzmir, Türkiye',
    'Bursa, Türkiye',
    'Antalya, Türkiye',
    'Online/Uzaktan',
    'Yurt Dışı'
  ];

  const handleLanguageToggle = (language: string) => {
    const newLanguages = data.languages.includes(language)
      ? data.languages.filter(lang => lang !== language)
      : [...data.languages, language];
    onChange('languages', newLanguages);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Temel Bilgiler
        </h2>
        <p className="text-gray-600">
          Mentee'lerin sizi tanıması için temel bilgilerinizi paylaşın
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Display Name */}
        <FormField
          label="Görünecek İsim"
          required
          error={errors.display_name}
          helper="Mentee'lerin göreceği isim (2-50 karakter)"
        >
          <input
            type="text"
            value={data.display_name}
            onChange={(e) => onChange('display_name', e.target.value)}
            placeholder="Ad Soyad veya Görünecek İsim"
            maxLength={50}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.display_name ? 'border-red-300' : 'border-gray-300'
            }`}
          />
        </FormField>

        {/* Title */}
        <FormField
          label="Unvan/Pozisyon"
          required
          error={errors.title}
          helper="Mesleki unvanınız veya pozisyonunuz (2-60 karakter)"
        >
          <input
            type="text"
            value={data.title}
            onChange={(e) => onChange('title', e.target.value)}
            placeholder="Senior Product Manager"
            maxLength={60}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.title ? 'border-red-300' : 'border-gray-300'
            }`}
          />
        </FormField>

        {/* Company Name */}
        <FormField
          label="Şirket/Organizasyon"
          error={errors.company_name}
          helper="Çalıştığınız kurum (opsiyonel)"
        >
          <input
            type="text"
            value={data.company_name}
            onChange={(e) => onChange('company_name', e.target.value)}
            placeholder="Şirket/Organizasyon"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </FormField>

        {/* Short Bio */}
        <FormField
          label="Kısa Tanıtım"
          required
          error={errors.short_bio}
          helper="Kısa, net ve fayda odaklı yaz. (80-160 karakter)"
        >
          <textarea
            value={data.short_bio}
            onChange={(e) => onChange('short_bio', e.target.value)}
            placeholder="Tek cümlede uzmanlığın ve faydan…"
            minLength={80}
            maxLength={160}
            rows={3}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
              errors.short_bio ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-500">
              {data.short_bio.length < 80 ? `En az ${80 - data.short_bio.length} karakter daha` : 'Uygun uzunluk'}
            </span>
            <span className="text-xs text-gray-500">
              {data.short_bio.length}/160
            </span>
          </div>
        </FormField>

        {/* Languages */}
        <FormField
          label="Konuştuğunuz Diller"
          required
          error={errors.languages}
          helper="En az bir dil seçmelisiniz"
        >
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {languageOptions.map((language) => (
                <button
                  key={language}
                  type="button"
                  onClick={() => handleLanguageToggle(language)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    data.languages.includes(language)
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {language}
                </button>
              ))}
            </div>
            
            {/* Selected Languages Display */}
            {data.languages.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Seçili diller:</strong> {data.languages.join(', ')}
                </p>
              </div>
            )}
          </div>
        </FormField>

        {/* Location */}
        <FormField
          label="Konum"
          required
          error={errors.location}
          helper="Mentörlük verdiğiniz konum"
        >
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={data.location}
              onChange={(e) => onChange('location', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none bg-white ${
                errors.location ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Konum seçin</option>
              {locationOptions.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
        </FormField>

        {/* Timezone (Auto-detected) */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Globe className="w-4 h-4" />
            <span>
              <strong>Saat Dilimi:</strong> {data.timezone || 'Otomatik tespit edilecek'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepBasics;