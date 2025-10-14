import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import OnboardingFlow from '../components/OnboardingFlow/OnboardingFlow';
import { useAuth } from '../contexts/AuthContext';

interface OnboardingData {
  category: string;
  goalLevel: string;
  budget: string;
  timeAvailability: string;
  mentorType: string;
  goalDescription: string;
}

interface OnboardingPageProps {
  onBack: () => void;
}

/**
 * Onboarding page for new mentees
 * Handles the complete progressive onboarding flow
 */
const OnboardingPage: React.FC<OnboardingPageProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [showFlow, setShowFlow] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleOnboardingComplete = (data: OnboardingData) => {
    console.log('Onboarding completed with data:', data);

    localStorage.setItem('mentee_onboarding_data', JSON.stringify(data));

    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('onboardingSuccess'));
      onBack();
    }, 500);
  };

  const handleShowLogin = () => {
    setShowLoginModal(true);
  };

  React.useEffect(() => {
    if (user?.role === 'mentee') {
      setTimeout(() => {
        onBack();
      }, 1000);
    }
  }, [user, onBack]);

  const handleClose = () => {
    setShowFlow(false);
    onBack();
  };

  if (!showFlow) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Ana sayfaya dön</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Onboarding İptal Edildi
            </h1>
            <p className="text-gray-600 mb-6">
              İstediğiniz zaman geri dönüp onboarding sürecini tamamlayabilirsiniz.
            </p>
            <button
              onClick={() => setShowFlow(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Onboarding'i Yeniden Başlat
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <OnboardingFlow
      onComplete={handleOnboardingComplete}
      onClose={handleClose}
      onShowLogin={handleShowLogin}
    />
  );
};

export default OnboardingPage;