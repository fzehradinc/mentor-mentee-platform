"use client";
import React, { useState } from 'react';
import { User, UserPlus, ArrowRight, CheckCircle } from 'lucide-react';
import EntryFlowModal from '../components/EntryFlowModal';
import Header from '../components/Header';
import AppFooter from '../components/AppFooter';

interface JoinPageProps {
  onShowAuth: () => void;
  onShowOnboarding: () => void;
}

const JoinPage: React.FC<JoinPageProps> = ({ onShowAuth, onShowOnboarding }) => {
  const [isEntryFlowOpen, setIsEntryFlowOpen] = useState(false);
  const [entryFlowPreset, setEntryFlowPreset] = useState<{
    role?: 'mentee' | 'mentor';
    tab?: 'login' | 'register';
  }>({});

  const handleMenteeClick = () => {
    setEntryFlowPreset({ role: 'mentee' });
    setIsEntryFlowOpen(true);
  };

  const handleMentorClick = () => {
    setEntryFlowPreset({ role: 'mentor' });
    setIsEntryFlowOpen(true);
  };

  const menteeBenefits = [
    'Uzman mentorlarla birebir görüşme',
    'Kişiselleştirilmiş gelişim planı',
    'Güvenli ödeme sistemi',
    'İlk seans memnuniyet garantisi'
  ];

  const mentorBenefits = [
    'Bilgi ve deneyimini paylaş',
    'Esnek çalışma saatleri',
    'Güvenli ödeme garantisi',
    'Topluluk desteği'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header onShowAuth={onShowAuth} onShowOnboarding={onShowOnboarding} />

      {/* Main Content */}
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Bimentor'a Katıl
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Rolünü seç ve birkaç adımda hazır ol.
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Mentee Card */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border-2 border-transparent hover:border-blue-200">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <User className="w-10 h-10 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Mentee Olarak Katıl
                </h2>
                <p className="text-gray-600 text-lg">
                  Uzman mentorlardan öğren, kariyerini geliştir
                </p>
              </div>

              {/* Benefits */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Faydalar:
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Doğru mentor eşleşmesi</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Güvenli ödeme</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Hedef odaklı ilerleme</span>
                  </li>
                </ul>
              </div>

              {/* CTA Button */}
              <button
                onClick={handleMenteeClick}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center"
              >
                Mentee olarak devam et
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>

            {/* Mentor Card */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border-2 border-transparent hover:border-green-200">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <UserPlus className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Mentor Olarak Katıl
                </h2>
                <p className="text-gray-600 text-lg">
                  Deneyimini paylaş, başkalarının gelişimine katkıda bulun
                </p>
              </div>

              {/* Benefits */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Faydalar:
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Doğrulanmış profil</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Esnek takvim</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Güvenli ödeme</span>
                  </li>
                </ul>
              </div>

              {/* CTA Button */}
              <button
                onClick={handleMentorClick}
                className="w-full bg-green-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center"
              >
                Mentor olarak katıl
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-16 text-center">
            <div className="bg-white rounded-2xl shadow-sm p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Neden Bimentor?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Güvenli Platform</h4>
                  <p className="text-gray-600 text-sm">KVKK uyumlu, güvenli ödeme sistemi</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Kaliteli Mentorlar</h4>
                  <p className="text-gray-600 text-sm">Doğrulanmış uzman mentorlar</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Akıllı Eşleştirme</h4>
                  <p className="text-gray-600 text-sm">Hedeflerinize uygun mentor bulma</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <AppFooter />

      {/* Entry Flow Modal */}
      <EntryFlowModal
        open={isEntryFlowOpen}
        onClose={() => setIsEntryFlowOpen(false)}
        initialRole={entryFlowPreset.role}
        initialTab={entryFlowPreset.tab}
      />
    </div>
  );
};

export default JoinPage;
