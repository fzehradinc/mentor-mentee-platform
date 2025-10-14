import React, { useState } from 'react';
import { DollarSign, Gift, Package, Info, Check, X, Sparkles } from 'lucide-react';
import FormField from './FormField';

interface PricingPackage {
  id: string;
  name: string;
  sessions: number;
  discount: number;
}

interface MentorPricing {
  price_per_session: number;
  first_session_discount: boolean;
  first_session_discount_value: number;
  discount_note: string;
  packages: PricingPackage[];
}

interface StepPricingProps {
  data: MentorPricing;
  onChange: (field: keyof MentorPricing, value: number | boolean | string | PricingPackage[]) => void;
  errors: Record<string, string>;
}

/**
 * Step 4: Pricing with visual discount system
 */
const StepPricing: React.FC<StepPricingProps> = ({ data, onChange, errors }) => {
  const [showPackageWarning, setShowPackageWarning] = useState(false);

  const priceRanges = [
    { min: 100, max: 300, label: 'Başlangıç', desc: '100-300₺' },
    { min: 300, max: 600, label: 'Orta Seviye', desc: '300-600₺' },
    { min: 600, max: 1000, label: 'Deneyimli', desc: '600-1000₺' },
    { min: 1000, max: 5000, label: 'Premium', desc: '1000₺+' }
  ];

  const discountOptions = [
    { value: 10, label: '%10', impact: 35 },
    { value: 20, label: '%20', impact: 42 },
    { value: 25, label: '%25', impact: 48 },
    { value: 30, label: '%30', impact: 55 },
    { value: 35, label: '%35', impact: 60 },
    { value: 40, label: '%40', impact: 65 },
    { value: 50, label: '%50', impact: 75 }
  ];

  const packageTemplates = [
    {
      name: '3 Seans Paketi',
      sessions: 3,
      discount: 10,
      icon: '📦',
      desc: 'Kısa dönem hedefler için'
    },
    {
      name: '5 Seans Paketi',
      sessions: 5,
      discount: 15,
      icon: '📦📦',
      desc: 'En popüler seçenek'
    },
    {
      name: '10 Seans Paketi',
      sessions: 10,
      discount: 20,
      icon: '📦📦📦',
      desc: 'Uzun vadeli gelişim'
    }
  ];

  const calculateFirstSessionPrice = () => {
    if (!data.first_session_discount || !data.price_per_session || !data.first_session_discount_value) {
      return null;
    }

    const discount = (data.price_per_session * data.first_session_discount_value) / 100;
    return Math.round(data.price_per_session - discount);
  };

  const hasValidPrice = () => {
    return data.price_per_session > 0;
  };

  const hasValidDiscountPrice = () => {
    return data.first_session_discount && hasValidPrice() && data.first_session_discount_value > 0;
  };

  const calculatePackagePrice = (pkg: PricingPackage) => {
    const totalPrice = data.price_per_session * pkg.sessions;
    const discountAmount = (totalPrice * pkg.discount) / 100;
    return Math.round(totalPrice - discountAmount);
  };

  const isPackageSelected = (sessions: number) => {
    return data.packages.some(pkg => pkg.sessions === sessions);
  };

  const handlePackageToggle = (template: typeof packageTemplates[0]) => {
    const existingPackage = data.packages.find(pkg => pkg.sessions === template.sessions);

    if (existingPackage) {
      // Remove package
      onChange('packages', data.packages.filter(pkg => pkg.id !== existingPackage.id));
      setShowPackageWarning(false);
    } else {
      // Add package
      if (data.packages.length >= 2) {
        setShowPackageWarning(true);
        setTimeout(() => setShowPackageWarning(false), 3000);
        return;
      }

      const newPackage: PricingPackage = {
        id: Date.now().toString(),
        name: template.name,
        sessions: template.sessions,
        discount: template.discount
      };

      onChange('packages', [...data.packages, newPackage]);
    }
  };

  const handleDiscountToggle = (checked: boolean) => {
    onChange('first_session_discount', checked);
    if (checked && !data.first_session_discount_value) {
      onChange('first_session_discount_value', 20);
    }
  };

  const getDiscountImpact = () => {
    const option = discountOptions.find(opt => opt.value === data.first_session_discount_value);
    return option ? option.impact : 35;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <DollarSign className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Ücret & İndirim
        </h2>
        <p className="text-gray-600">
          Fiyatlandırmanızı sistemden seçerek kolayca belirleyin
        </p>
      </div>

      {/* Price Per Session */}
      <FormField
        label="Seans Başı Ücret"
        required
        error={errors.price_per_session}
        helper="Şeffaf fiyatlandırma güven verir. Minimum 100₺"
      >
        <div className="space-y-4">
          {/* Price Input */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium text-lg">
              ₺
            </span>
            <input
              type="number"
              value={data.price_per_session || ''}
              onChange={(e) => onChange('price_per_session', parseInt(e.target.value) || 0)}
              placeholder="500"
              min={100}
              max={5000}
              className={`w-full pl-10 pr-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-xl font-semibold ${
                errors.price_per_session ? 'border-red-300' : 'border-gray-300'
              }`}
            />
          </div>

          {/* Price Range Suggestions */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Hızlı seçim:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {priceRanges.map((range) => (
                <button
                  key={range.label}
                  type="button"
                  onClick={() => onChange('price_per_session', range.min)}
                  className={`p-3 border-2 rounded-lg transition-all text-center hover:scale-105 ${
                    data.price_per_session >= range.min && data.price_per_session < range.max
                      ? 'border-emerald-500 bg-emerald-50 shadow-md'
                      : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'
                  }`}
                >
                  <div className="font-semibold text-gray-900">{range.label}</div>
                  <div className="text-xs text-gray-600">{range.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </FormField>

      {/* First Session Discount */}
      <FormField
        label="İlk Seans İndirimi"
        helper={
          <div className="flex items-center space-x-1">
            <span>Yeni mentee'ler için özel fiyat</span>
            <Info className="w-3 h-3 text-gray-500" />
          </div>
        }
      >
        <div className="space-y-4">
          <label className="flex items-start space-x-3 cursor-pointer p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
            <input
              type="checkbox"
              checked={data.first_session_discount}
              onChange={(e) => handleDiscountToggle(e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-900">İlk seans indirimi sunmak istiyorum</span>
                {data.first_session_discount && (
                  <span className="inline-flex items-center px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    <Check className="w-3 h-3 mr-1" />
                    Aktif
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">Yeni mentee'ler için özel fiyat</p>
            </div>
          </label>

          {data.first_session_discount && (
            <div className="bg-gradient-to-br from-blue-50 to-green-50 border-2 border-blue-200 rounded-xl p-6 space-y-5 animate-fadeIn">
              {/* Discount Percentage Selection */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">İndirim yüzdesini seçin:</h4>
                <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                  {discountOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => onChange('first_session_discount_value', option.value)}
                      className={`relative p-3 border-2 rounded-lg font-bold transition-all hover:scale-105 ${
                        data.first_session_discount_value === option.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
                      }`}
                    >
                      {data.first_session_discount_value === option.value && (
                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Visual Price Display */}
              <div className="bg-white rounded-xl p-5 border-2 border-green-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">İlk Seans Fiyatı</span>
                  {data.first_session_discount_value > 0 && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                      %{data.first_session_discount_value} indirim
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-end space-x-3">
                  {hasValidDiscountPrice() ? (
                    <>
                      <span className="text-xl text-gray-400 line-through">
                        {data.price_per_session}₺
                      </span>
                      <span className="text-3xl font-bold text-green-600 animate-slideIn">
                        {calculateFirstSessionPrice()}₺
                      </span>
                    </>
                  ) : (
                    <span className="text-xl text-gray-500">
                      {hasValidPrice() ? '—' : 'Önce seans fiyatı belirleyin'}
                    </span>
                  )}
                </div>
              </div>

              {/* Dynamic Motivational Message */}
              {hasValidDiscountPrice() && (
                <div className="flex items-start space-x-2 text-sm text-blue-800 bg-blue-100 rounded-lg p-3">
                  <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">İlk seans indirimi ekleyerek yeni mentee kazanımını kolaylaştırdın!</p>
                    <p className="text-xs text-blue-700 mt-1">
                      Seçtiğin %{data.first_session_discount_value} indirim yeni mentee kazanımını ~%{getDiscountImpact()} artırır.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </FormField>

      {/* Session Packages */}
      <FormField
        label="Seans Paketleri"
        helper={
          <div className="flex items-center space-x-1">
            <span>Paketler mentor gelirini öngörülebilir hale getirir (maksimum 2 paket)</span>
            <Info className="w-3 h-3 text-gray-500" />
          </div>
        }
      >
        <div className="space-y-4">
          {/* Package Warning */}
          {showPackageWarning && (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-3 animate-shake">
              <p className="text-sm text-amber-800 font-medium">
                En fazla 2 paket seçebilirsiniz
              </p>
            </div>
          )}

          {/* Package Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {packageTemplates.map((template) => {
              const isSelected = isPackageSelected(template.sessions);
              const packagePrice = data.price_per_session > 0
                ? calculatePackagePrice(template)
                : 0;
              const originalPrice = data.price_per_session * template.sessions;

              return (
                <button
                  key={template.sessions}
                  type="button"
                  onClick={() => handlePackageToggle(template)}
                  className={`p-5 border-2 rounded-xl transition-all hover:scale-105 text-left relative ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  {/* Check Badge */}
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}

                  {/* Icon */}
                  <div className="text-3xl mb-2">{template.icon}</div>

                  {/* Title */}
                  <h3 className="font-bold text-gray-900 mb-1">
                    {template.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-gray-600 mb-3">{template.desc}</p>

                  {/* Discount Badge */}
                  <div className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full mb-3">
                    %{template.discount} indirim
                  </div>

                  {/* Price Display */}
                  {data.price_per_session > 0 ? (
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500 line-through">
                        {originalPrice}₺
                      </div>
                      <div className="text-xl font-bold text-green-600">
                        {packagePrice}₺
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 italic">
                      Fiyat belirlenince hesaplanacak
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Info Message */}
          {data.packages.length === 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-sm text-gray-600">
                <Info className="w-4 h-4 inline mr-1" />
                Paket seçimi opsiyoneldir. Daha fazla seçenek sunarak görünürlüğünü artırabilirsin.
              </p>
            </div>
          )}
        </div>
      </FormField>

      {/* Dynamic Pricing Summary */}
      {data.price_per_session >= 100 && (
        <div className="bg-gradient-to-br from-emerald-50 via-blue-50 to-green-50 rounded-xl p-6 border-2 border-emerald-200 shadow-sm animate-fadeIn">
          <div className="flex items-start space-x-3">
            <Gift className="w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                Fiyatlandırma Özeti
                <span className="ml-2 text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                  Otomatik Hesaplama
                </span>
              </h3>

              <div className="space-y-3">
                {/* Standard Session */}
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Standart Seans Fiyatı</span>
                  <span className="text-lg font-bold text-gray-900">{data.price_per_session}₺</span>
                </div>

                {/* First Session Discount */}
                {data.first_session_discount && hasValidDiscountPrice() && (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200 animate-fadeIn">
                    <div>
                      <span className="text-sm font-medium text-green-900">İlk Seans</span>
                      <span className="ml-2 text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">
                        %{data.first_session_discount_value} indirim
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 line-through">
                        {data.price_per_session}₺
                      </div>
                      <div className="text-lg font-bold text-green-600">
                        {calculateFirstSessionPrice()}₺
                      </div>
                    </div>
                  </div>
                )}

                {/* Selected Packages */}
                {data.packages.map((pkg) => {
                  const packagePrice = calculatePackagePrice(pkg);
                  const originalPrice = data.price_per_session * pkg.sessions;

                  return (
                    <div key={pkg.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div>
                        <span className="text-sm font-medium text-blue-900">{pkg.name}</span>
                        <span className="ml-2 text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">
                          %{pkg.discount} indirim
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500 line-through">
                          {originalPrice}₺
                        </div>
                        <div className="text-lg font-bold text-blue-600">
                          {packagePrice}₺
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepPricing;
