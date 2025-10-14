"use client";
import React from 'react';
import { User, Building, ArrowRight, ArrowLeft } from 'lucide-react';

interface MentorTypeGateProps {
  onBack?: () => void;
}

const MentorTypeGate: React.FC<MentorTypeGateProps> = ({ onBack }) => {
  const goIndividual = () => {
    // Trigger App.tsx view change
    window.dispatchEvent(new CustomEvent('navigateTo', { detail: 'individual-mentor-register' }));
  };

  const goCorporate = () => {
    // Trigger App.tsx view change
    window.dispatchEvent(new CustomEvent('navigateTo', { detail: 'corporate-mentor-register' }));
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Geri</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Mentor Tipi Seçimi</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Bilgini ve deneyimini paylaşmaya hazır mısın? Hangi türde mentorluk yapmak istediğini seç.
            </p>
          </div>

          {/* Options */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Individual Mentor */}
            <button
              onClick={goIndividual}
              className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-left group"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Bireysel Mentor</h3>
                  <p className="text-sm text-gray-600">Kendi adınıza mentorluk</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Kişisel deneyim ve uzmanlığınızla mentorluk yapın
              </p>
              <div className="flex items-center text-blue-600 font-medium">
                <span>Bireysel Mentor</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </button>

            {/* Corporate Mentor */}
            <button
              onClick={goCorporate}
              className="p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-200 text-left group"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <Building className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Kurumsal Mentor</h3>
                  <p className="text-sm text-gray-600">Şirket/kurum hesabı ile mentorluk</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Kurumsal kimliğinizle mentorluk yapın
              </p>
              <div className="flex items-center text-green-600 font-medium">
                <span>Kurumsal Mentor</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorTypeGate;
