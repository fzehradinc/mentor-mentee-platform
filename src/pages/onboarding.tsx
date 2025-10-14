import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { User, GraduationCap, CheckCircle, ArrowRight } from 'lucide-react';
import Layout from '../components/Layout/Layout';

/**
 * Onboarding page for new users
 * Handles both mentor and mentee onboarding flows
 */
const OnboardingPage: React.FC = () => {
  const router = useRouter();
  const [role, setRole] = useState<'mentor' | 'mentee' | null>(null);
  const [step, setStep] = useState(1);

  useEffect(() => {
    // Get role from URL params
    const { role: roleParam } = router.query;
    if (roleParam === 'mentor' || roleParam === 'mentee') {
      setRole(roleParam);
    }
  }, [router.query]);

  const getRoleInfo = () => {
    if (role === 'mentor') {
      return {
        title: 'Mentor Olarak Başlayalım!',
        subtitle: 'Uzmanlığınızı paylaşarak başkalarının kariyerine katkıda bulunun',
        icon: <GraduationCap className="w-12 h-12 text-blue-600" />,
        steps: [
          'Profil bilgilerinizi tamamlayın',
          'Uzmanlık alanlarınızı belirleyin',
          'Müsaitlik durumunuzu ayarlayın',
          'İlk randevunuzu almaya başlayın'
        ],
        nextAction: 'Mentor Profilimi Oluştur'
      };
    } else {
      return {
        title: 'Mentee Olarak Başlayalım!',
        subtitle: 'Doğru mentörü bulun ve kariyerinizde bir sonraki seviyeye çıkın',
        icon: <User className="w-12 h-12 text-purple-600" />,
        steps: [
          'Hedeflerinizi ve ilgi alanlarınızı belirleyin',
          'Size uygun mentörleri keşfedin',
          'İlk randevunuzu planlayın',
          'Öğrenme yolculuğunuza başlayın'
        ],
        nextAction: 'Mentör Aramaya Başla'
      };
    }
  };

  const handleContinue = () => {
    if (role === 'mentor') {
      // TODO: Navigate to mentor profile creation
      router.push('/mentor/profile-setup');
    } else {
      // Navigate to mentor discovery
      router.push('/mentorler');
    }
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  if (!role) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Yükleniyor...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const roleInfo = getRoleInfo();

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              {roleInfo.icon}
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {roleInfo.title}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {roleInfo.subtitle}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Başlangıç Adımları
            </h2>
            
            <div className="space-y-4">
              {roleInfo.steps.map((stepText, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    index === 0 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index === 0 ? (
                      <span className="text-sm font-semibold">{index + 1}</span>
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                  </div>
                  <p className={`text-lg ${
                    index === 0 ? 'text-gray-900 font-medium' : 'text-gray-600'
                  }`}>
                    {stepText}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Welcome Message */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                MentorHub'a Hoş Geldiniz! 🎉
              </h3>
              <p className="text-gray-600 mb-6">
                {role === 'mentor' 
                  ? 'Deneyimlerinizi paylaşarak binlerce kişinin kariyerine dokunmaya hazır mısınız?'
                  : 'Kariyerinizde yeni bir sayfa açmaya ve doğru rehberlikle hedeflerinize ulaşmaya hazır mısınız?'
                }
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleContinue}
                  className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {roleInfo.nextAction}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
                
                <button
                  onClick={handleBackToHome}
                  className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                >
                  Ana Sayfaya Dön
                </button>
              </div>
            </div>
          </div>

          {/* Role Badge */}
          <div className="text-center">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
              role === 'mentor' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-purple-100 text-purple-800'
            }`}>
              {role === 'mentor' ? (
                <>
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Mentor olarak devam ediyorsunuz
                </>
              ) : (
                <>
                  <User className="w-4 h-4 mr-2" />
                  Mentee olarak devam ediyorsunuz
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OnboardingPage;