"use client";
import React from 'react';
import MentorRegisterForm from '../components/forms/MentorRegisterForm';
import { ArrowLeft } from 'lucide-react';

interface CorporateMentorRegisterPageProps {
  onBack?: () => void;
}

const CorporateMentorRegisterPage: React.FC<CorporateMentorRegisterPageProps> = ({ onBack }) => {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Geri</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <span>🏢</span>
            <span>Kurumsal Mentor</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Kurumsal Mentor Kaydı</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Şirket ve kurumunuz adına mentorluk hizmeti verin. Kurumsal profilinizi oluşturun ve 
            organizasyonunuzun bilgi birikimini paylaşın! 🏆
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10">
          <MentorRegisterForm mode="corporate" />
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Kayıt olarak{' '}
            <a href="/terms" className="text-blue-600 hover:underline">Kullanım Koşulları</a>
            {' '}ve{' '}
            <a href="/privacy" className="text-blue-600 hover:underline">Gizlilik Politikası</a>
            'nı kabul etmiş olursunuz.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CorporateMentorRegisterPage;
