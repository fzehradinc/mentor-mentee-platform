import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Save, Eye, Globe, X } from 'lucide-react';
import ProgressBar from './ProgressBar';

interface WizardLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onStepChange: (step: number) => void;
  isStepValid: boolean;
  onSave: () => void;
  onPreview: () => void;
  onPublish: () => void;
  isPublishing: boolean;
  autosaveStatus: 'idle' | 'saving' | 'saved' | 'error';
  onClose: () => void;
  profileCompletion?: number;
}

const motivationalQuotes = [
  "Bilgilerini netleştir, görünürlüğün artsın.",
  "Uzmanlığın, doğru mentee'yi çeker.",
  "Uygunluk netliği, planı hızlandırır.",
  "Şeffaf fiyat, güvenin temeli.",
  "Görseller ve hikâyen ikna eder.",
  "Bir bakışta hazır: Profilin yayına uygun."
];

const stepTitles = [
  "Temel Bilgiler",
  "Uzmanlık & Etiketler",
  "Müsaitlik",
  "Ücret & İndirim",
  "Medya & Bio",
  "Önizleme & Gönder"
];

/**
 * Wizard layout component providing structure and navigation
 */
const WizardLayout: React.FC<WizardLayoutProps> = ({
  children,
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onStepChange,
  isStepValid,
  onSave,
  onPreview,
  onPublish,
  isPublishing,
  autosaveStatus,
  onClose,
  profileCompletion = 0
}) => {
  const [showStepMenu, setShowStepMenu] = useState(false);

  const getProgressPercentage = () => {
    return ((currentStep + 1) / totalSteps) * 100;
  };

  const handleStepClick = (step: number) => {
    if (step !== currentStep) {
      const confirmChange = window.confirm(
        'Bu adıma geçmek istediğinizden emin misiniz? Kaydedilmemiş değişiklikler kaybolabilir.'
      );
      if (confirmChange) {
        onStepChange(step);
        setShowStepMenu(false);
      }
    }
  };

  const getAutosaveStatusText = () => {
    switch (autosaveStatus) {
      case 'saving':
        return 'Kaydediliyor...';
      case 'saved':
        return 'Taslak kaydedildi';
      case 'error':
        return 'Kaydetme hatası';
      default:
        return '';
    }
  };

  const getAutosaveStatusColor = () => {
    switch (autosaveStatus) {
      case 'saving':
        return 'text-blue-600';
      case 'saved':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Close */}
            <div className="flex items-center space-x-4">
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
                aria-label="Sihirbazı kapat"
              >
                <X className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold text-blue-600">MentorHub</h1>
              <span className="text-sm text-gray-500">Mentor Profil Sihirbazı</span>
            </div>

            {/* Autosave Status */}
            <div className="flex items-center space-x-4">
              {autosaveStatus !== 'idle' && (
                <div className={`text-sm ${getAutosaveStatusColor()} flex items-center space-x-1`}>
                  {autosaveStatus === 'saving' && (
                    <div className="w-3 h-3 border border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  )}
                  <span>{getAutosaveStatusText()}</span>
                </div>
              )}
              
              {/* Step Navigation (Desktop) */}
              <div className="hidden md:block relative">
                <button
                  onClick={() => setShowStepMenu(!showStepMenu)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <span>Adım {currentStep + 1}: {stepTitles[currentStep]}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                
                {showStepMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {stepTitles.map((title, index) => (
                      <button
                        key={index}
                        onClick={() => handleStepClick(index)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                          index === currentStep ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                        }`}
                      >
                        <span className="mr-2">{index + 1}.</span>
                        {title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <ProgressBar 
            currentStep={currentStep + 1} 
            totalSteps={totalSteps} 
            percentage={getProgressPercentage()} 
          />
          
          {/* Motivational Quote & Completion */}
          <div className="text-center mt-6 space-y-3">
            <p className="text-lg text-blue-700 font-medium italic">
              "{motivationalQuotes[currentStep]}"
            </p>
            {profileCompletion > 0 && profileCompletion < 100 && (
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-full">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-sm text-blue-800">
                  Profilin <strong>%{profileCompletion}</strong> tamamlandı. Daha sonra doldurabilirsin.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          {children}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={currentStep === 0 ? onClose : onPrevious}
            className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors rounded-xl hover:bg-white min-h-[44px]"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{currentStep === 0 ? 'Çıkış' : 'Geri'}</span>
          </button>

          <div className="flex items-center space-x-4">
            {/* Save Draft Button - Always available */}
            <button
              onClick={onSave}
              className="flex items-center space-x-2 px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors min-h-[44px]"
            >
              <Save className="w-4 h-4" />
              <span>Taslak Kaydet</span>
            </button>

            {/* Preview Button (Final Step) */}
            {currentStep === totalSteps - 1 && (
              <button
                onClick={onPreview}
                className="flex items-center space-x-2 px-6 py-3 text-blue-700 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors min-h-[44px]"
              >
                <Eye className="w-4 h-4" />
                <span>Önizleme</span>
              </button>
            )}

            {/* Next/Continue Button - Always enabled */}
            <button
              onClick={currentStep === totalSteps - 1 ? onPublish : onNext}
              disabled={isPublishing}
              className="flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px]"
            >
              {isPublishing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Yayınlanıyor...</span>
                </>
              ) : currentStep === totalSteps - 1 ? (
                <>
                  <Globe className="w-4 h-4" />
                  <span>Yayınla</span>
                </>
              ) : (
                <>
                  <span>Devam Et</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      {/* Click outside to close step menu */}
      {showStepMenu && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setShowStepMenu(false)}
        />
      )}
    </div>
  );
};

export default WizardLayout;