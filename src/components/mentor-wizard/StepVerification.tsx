import React, { useState } from 'react';
import { Award, Building, CreditCard, CheckCircle, Clock, AlertTriangle, Upload, Camera } from 'lucide-react';
import FormField from './FormField';

interface BadgeApplication {
  badge_type: string;
  justification: string;
}

interface CompanyVerification {
  company_name: string;
  tax_id: string;
  website: string;
  logo_url: string;
  position_proof: string;
}

interface KYCUpload {
  id_front_url: string;
  id_back_url: string;
  selfie_url: string;
  status: 'pending' | 'processing' | 'verified' | 'rejected';
}

interface MentorVerification {
  badges: string[];
  company_verification: CompanyVerification | null;
  kyc_upload: KYCUpload | null;
}

interface StepVerificationProps {
  data: MentorVerification;
  onChange: (field: keyof MentorVerification, value: any) => void;
  errors: Record<string, string>;
}

/**
 * Step 4: Verification and moderation
 */
const StepVerification: React.FC<StepVerificationProps> = ({ data, onChange, errors }) => {
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);
  const [badgeJustification, setBadgeJustification] = useState('');
  const [companyForm, setCompanyForm] = useState<CompanyVerification>({
    company_name: '',
    tax_id: '',
    website: '',
    logo_url: '',
    position_proof: ''
  });
  const [kycUploading, setKycUploading] = useState(false);

  const availableBadges = [
    {
      type: 'verified',
      label: 'Verified',
      icon: '✅',
      description: 'KYC tamamlandığında otomatik',
      requirement: 'Kimlik doğrulama gerekli',
      auto: true,
      color: 'blue'
    },
    {
      type: 'high_rated',
      label: 'High Rated',
      icon: '⭐',
      description: '4.8+ puan, 20+ seans',
      requirement: 'Otomatik verilir',
      auto: true,
      color: 'yellow'
    },
    {
      type: 'workshop_leader',
      label: 'Workshop Leader',
      icon: '🎓',
      description: '3+ workshop düzenleme',
      requirement: 'Başvuru gerekli',
      auto: false,
      color: 'purple'
    },
    {
      type: 'rising_star',
      label: 'Rising Star',
      icon: '🌟',
      description: 'Yeni mentor, 4.7+ puan',
      requirement: 'Otomatik kontrol',
      auto: true,
      color: 'green'
    },
    {
      type: 'top_mentor',
      label: 'Top Mentor',
      icon: '👑',
      description: 'Prestij rozeti, özel inceleme',
      requirement: 'Manuel başvuru',
      auto: false,
      color: 'red'
    },
    {
      type: 'expert',
      label: 'Expert',
      icon: '🔬',
      description: '10+ yıl deneyim',
      requirement: 'Manuel başvuru',
      auto: false,
      color: 'indigo'
    }
  ];

  const getBadgeStatus = (badgeType: string) => {
    if (data.badges.includes(badgeType)) {
      return 'earned';
    }
    
    // Mock eligibility check
    const mockEligibility = {
      'verified': data.kyc_upload?.status === 'verified',
      'high_rated': true, // Mock: mentor has good rating
      'workshop_leader': false, // Mock: not enough workshops
      'rising_star': true,
      'top_mentor': false,
      'expert': false
    };
    
    return mockEligibility[badgeType as keyof typeof mockEligibility] ? 'available' : 'locked';
  };

  const handleBadgeApplication = async (badgeType: string) => {
    if (!badgeJustification.trim()) {
      alert('Lütfen gerekçe yazın');
      return;
    }

    // Mock API call
    console.log('Badge application:', { badgeType, justification: badgeJustification });
    alert('Rozet başvurunuz gönderildi! 2-5 iş günü içinde değerlendirilecek.');
    
    setSelectedBadge(null);
    setBadgeJustification('');
  };

  const handleCompanyVerification = async () => {
    if (!companyForm.company_name || !companyForm.tax_id) {
      alert('Şirket adı ve vergi numarası zorunludur');
      return;
    }

    // Mock API call
    console.log('Company verification:', companyForm);
    alert('Şirket doğrulama başvurunuz gönderildi! 3-7 iş günü içinde incelenecek.');
    
    onChange('company_verification', { ...companyForm, status: 'pending' });
  };

  const handleKYCUpload = async () => {
    setKycUploading(true);
    
    try {
      // Mock KYC upload process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockKYC: KYCUpload = {
        id_front_url: 'https://secure.mentorhub.com/kyc/id-front.jpg',
        id_back_url: 'https://secure.mentorhub.com/kyc/id-back.jpg',
        selfie_url: 'https://secure.mentorhub.com/kyc/selfie.jpg',
        status: 'processing'
      };
      
      onChange('kyc_upload', mockKYC);
      alert('KYC belgeleri başarıyla yüklendi! 24-48 saat içinde sonuç bildirilecek.');
    } catch (error) {
      alert('KYC yükleme başarısız. Lütfen tekrar deneyin.');
    } finally {
      setKycUploading(false);
    }
  };

  const getBadgeColorClass = (color: string, status: string) => {
    const baseClasses = 'p-4 rounded-xl border-2 transition-all duration-200 text-center';
    
    if (status === 'earned') {
      return `${baseClasses} border-${color}-500 bg-${color}-50 text-${color}-700 shadow-lg scale-105`;
    } else if (status === 'available') {
      return `${baseClasses} border-${color}-300 bg-white hover:border-${color}-500 hover:bg-${color}-50 cursor-pointer`;
    } else {
      return `${baseClasses} border-gray-200 bg-gray-50 text-gray-400 opacity-60`;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Award className="w-8 h-8 text-amber-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Doğrulama
        </h2>
        <p className="text-gray-600">
          Güvenilir mentorlar daha çok mentee kazanır 🌟
        </p>
      </div>

      {/* Badge System */}
      <FormField
        label="Profil Rozetleri"
        helper="Otomatik kurallarla kazanılır"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {availableBadges.map((badge) => {
            const status = getBadgeStatus(badge.type);
            
            return (
              <button
                key={badge.type}
                type="button"
                onClick={() => {
                  if (status === 'available' && !badge.auto) {
                    setSelectedBadge(badge.type);
                  }
                }}
                className={getBadgeColorClass(badge.color, status)}
                disabled={status === 'locked'}
              >
                <div className="text-2xl mb-2">{badge.icon}</div>
                <h3 className="font-semibold text-sm mb-1">{badge.label}</h3>
                <p className="text-xs text-gray-600 mb-2">{badge.description}</p>
                
                {status === 'earned' && (
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-xs ml-1">Kazanıldı</span>
                  </div>
                )}
                
                {status === 'available' && (
                  <div className="text-xs">
                    {badge.auto ? (
                      <span className="text-blue-600">Otomatik</span>
                    ) : (
                      <span className="text-purple-600">Başvur</span>
                    )}
                  </div>
                )}
                
                {status === 'locked' && (
                  <div className="text-xs text-gray-500">
                    Koşullar sağlanmıyor
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </FormField>

      {/* Badge Application Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {availableBadges.find(b => b.type === selectedBadge)?.label} Rozeti
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gerekçe (opsiyonel):
              </label>
              <textarea
                value={badgeJustification}
                onChange={(e) => setBadgeJustification(e.target.value)}
                placeholder="Bu rozeti neden hak ettiğinizi açıklayın..."
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setSelectedBadge(null)}
                className="flex-1 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={() => handleBadgeApplication(selectedBadge)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Başvuru Gönder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Company Verification */}
      <FormField
        label="Şirket Doğrulama"
        helper="Kurumsal destek, prestij sağlar 🏢"
      >
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          {data.company_verification?.status ? (
            <div className="text-center">
              {data.company_verification.status === 'pending' && (
                <div className="text-amber-600">
                  <Clock className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-medium">İnceleme Aşamasında</p>
                  <p className="text-sm">3-7 iş günü içinde sonuçlanacak</p>
                </div>
              )}
              {data.company_verification.status === 'approved' && (
                <div className="text-green-600">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-medium">Şirket Doğrulandı</p>
                  <p className="text-sm">Company Verified rozeti eklendi</p>
                </div>
              )}
              {data.company_verification.status === 'rejected' && (
                <div className="text-red-600">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-medium">Başvuru Reddedildi</p>
                  <p className="text-sm">24 saat sonra tekrar başvurabilirsiniz</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Şirket Adı" required>
                  <input
                    type="text"
                    value={companyForm.company_name}
                    onChange={(e) => setCompanyForm({ ...companyForm, company_name: e.target.value })}
                    placeholder="Getir"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </FormField>

                <FormField label="Vergi Numarası" required>
                  <input
                    type="text"
                    value={companyForm.tax_id}
                    onChange={(e) => setCompanyForm({ ...companyForm, tax_id: e.target.value })}
                    placeholder="1234567890"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </FormField>
              </div>

              <FormField label="Website">
                <input
                  type="url"
                  value={companyForm.website}
                  onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })}
                  placeholder="https://getir.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </FormField>

              <FormField label="Pozisyon Kanıtı">
                <input
                  type="url"
                  value={companyForm.position_proof}
                  onChange={(e) => setCompanyForm({ ...companyForm, position_proof: e.target.value })}
                  placeholder="LinkedIn profil linki veya iş sözleşmesi"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </FormField>

              <button
                onClick={handleCompanyVerification}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Building className="w-4 h-4" />
                <span>Başvuru Gönder</span>
              </button>
            </div>
          )}
        </div>
      </FormField>

      {/* KYC Upload */}
      <FormField
        label="Kimlik Doğrulama (KYC)"
        helper="Kimliğin doğrulanırsa profilin öne çıkar 🪪"
      >
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          {data.kyc_upload?.status ? (
            <div className="text-center">
              {data.kyc_upload.status === 'pending' && (
                <div className="text-blue-600">
                  <Clock className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-medium">Belgeler Yüklendi</p>
                  <p className="text-sm">İnceleme başlatılacak</p>
                </div>
              )}
              {data.kyc_upload.status === 'processing' && (
                <div className="text-blue-600">
                  <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="font-medium">İşleniyor</p>
                  <p className="text-sm">24-48 saat içinde sonuç</p>
                </div>
              )}
              {data.kyc_upload.status === 'verified' && (
                <div className="text-green-600">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-medium">Kimlik Doğrulandı</p>
                  <p className="text-sm">Verified rozeti kazandınız!</p>
                </div>
              )}
              {data.kyc_upload.status === 'rejected' && (
                <div className="text-red-600">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-medium">Doğrulama Başarısız</p>
                  <p className="text-sm">Belge kalitesi yetersiz</p>
                  <button
                    onClick={() => onChange('kyc_upload', null)}
                    className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Tekrar Dene
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-full h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center mb-3">
                    <div>
                      <CreditCard className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Kimlik Ön</p>
                    </div>
                  </div>
                  <button className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                    📄 Belge Yükle
                  </button>
                </div>

                <div className="text-center">
                  <div className="w-full h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center mb-3">
                    <div>
                      <CreditCard className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Kimlik Arka</p>
                    </div>
                  </div>
                  <button className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                    📄 Belge Yükle
                  </button>
                </div>

                <div className="text-center">
                  <div className="w-full h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center mb-3">
                    <div>
                      <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Selfie</p>
                    </div>
                  </div>
                  <button className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                    📷 Fotoğraf Çek
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">🔒 Güvenlik Bilgisi</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Belgeler şifrelenmiş olarak saklanır</li>
                  <li>• 30 gün sonra otomatik silinir</li>
                  <li>• Sadece doğrulama için kullanılır</li>
                  <li>• 3rd party KYC provider (Onfido) ile işlenir</li>
                </ul>
              </div>

              <button
                onClick={handleKYCUpload}
                disabled={kycUploading}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {kycUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>KYC Başlatılıyor...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>KYC Başlat</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </FormField>

      {/* Verification Summary */}
      <div className="bg-gradient-to-r from-amber-50 to-blue-50 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <Award className="w-6 h-6 text-amber-600 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Doğrulama Özeti</h3>
            <div className="space-y-1 text-sm text-gray-700">
              <p><strong>Kazanılan Rozetler:</strong> {data.badges.length} adet</p>
              <p><strong>Şirket Doğrulama:</strong> {data.company_verification?.status || 'Başlatılmadı'}</p>
              <p><strong>KYC Durumu:</strong> {data.kyc_upload?.status || 'Başlatılmadı'}</p>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Doğrulanmış mentorlar %40 daha fazla mentee kazanır.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepVerification;