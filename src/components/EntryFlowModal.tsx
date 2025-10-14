"use client";
import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, User, UserPlus, Building, UserCheck } from 'lucide-react';
import AuthForm from './AuthForm';

type Role = 'mentee' | 'mentor';
type MentorType = 'individual' | 'corporate';
type Tab = 'login' | 'register';
type Step = 'role' | 'authChoice' | 'mentorType' | 'form';

interface EntryFlowModalProps {
  open: boolean;
  onClose: () => void;
  initialRole?: Role;
  initialTab?: Tab;
  returnTo?: string;
}

const EntryFlowModal: React.FC<EntryFlowModalProps> = ({
  open,
  onClose,
  initialRole,
  initialTab,
  returnTo
}) => {
  const [role, setRole] = useState<Role | undefined>(initialRole);
  const [tab, setTab] = useState<Tab | undefined>(initialTab);
  const [mentorType, setMentorType] = useState<MentorType | undefined>();
  const [step, setStep] = useState<Step>('role');

  // Reset state when modal opens/closes
  useEffect(() => {
    if (open) {
      setRole(initialRole);
      setTab(initialTab);
      setMentorType(undefined);
      setStep(initialRole ? (initialTab ? 'form' : 'authChoice') : 'role');
    }
  }, [open, initialRole, initialTab]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [open, onClose]);

  const handleBack = () => {
    if (step === 'form') {
      if (tab === 'register' && role === 'mentor' && role) {
        setStep('mentorType');
      } else {
        setStep('authChoice');
      }
    } else if (step === 'mentorType') {
      setStep('authChoice');
    } else if (step === 'authChoice') {
      if (role) {
        setStep('role');
      } else {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const handleRoleSelect = (selectedRole: Role) => {
    setRole(selectedRole);
    setStep('authChoice');
  };

  const handleAuthChoice = (selectedTab: Tab) => {
    setTab(selectedTab);
    if (selectedTab === 'register' && role === 'mentor') {
      setStep('mentorType');
    } else {
      setStep('form');
    }
  };

  const handleMentorTypeSelect = (selectedType: MentorType) => {
    setMentorType(selectedType);
    setStep('form');
  };

  const handleSuccess = () => {
    onClose();
  };

  const getStepTitle = () => {
    switch (step) {
      case 'role':
        return 'Rolünü seç';
      case 'authChoice':
        return 'Devam etmek için giriş yap veya yeni hesap oluştur';
      case 'mentorType':
        return 'Mentor tipi';
      case 'form':
        return tab === 'login' ? 'Giriş Yap' : 'Kayıt Ol';
      default:
        return '';
    }
  };

  const getStepSubtitle = () => {
    switch (step) {
      case 'role':
        return 'Bimentor topluluğuna nasıl katılmak istiyorsun?';
      case 'authChoice':
        return role === 'mentee' 
          ? 'Mentee olarak devam etmek için giriş yap veya hesap oluştur'
          : 'Mentor olarak katılmak için giriş yap veya hesap oluştur';
      case 'mentorType':
        return 'Hangi tür mentor olmak istiyorsun?';
      case 'form':
        return role === 'mentee' 
          ? 'Mentee hesabınla giriş yap'
          : `Mentor hesabınla giriş yap${mentorType ? ` (${mentorType === 'individual' ? 'Bireysel' : 'Kurumsal'})` : ''}`;
      default:
        return '';
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div 
          className="w-full max-w-2xl rounded-2xl bg-white shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              {step !== 'role' && (
                <button
                  onClick={handleBack}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Geri"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              )}
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {getStepTitle()}
                </h2>
                <p className="text-sm text-gray-600">
                  {getStepSubtitle()}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Kapat"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {step === 'role' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Mentee Card */}
                  <button
                    onClick={() => handleRoleSelect('mentee')}
                    className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-left group"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Mentee</h3>
                        <p className="text-sm text-gray-600">Öğrenmek ve gelişmek istiyorum</p>
                      </div>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
                        Doğru mentor eşleşmesi
                      </li>
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
                        Güvenli ödeme
                      </li>
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
                        Hedef odaklı ilerleme
                      </li>
                    </ul>
                  </button>

                  {/* Mentor Card */}
                  <button
                    onClick={() => handleRoleSelect('mentor')}
                    className="p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-200 text-left group"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                        <UserCheck className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Mentor</h3>
                        <p className="text-sm text-gray-600">Bilgimi paylaşmak istiyorum</p>
                      </div>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
                        Doğrulanmış profil
                      </li>
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
                        Esnek takvim
                      </li>
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
                        Güvenli ödeme
                      </li>
                    </ul>
                  </button>
                </div>
              </div>
            )}

            {step === 'authChoice' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Login Option */}
                  <button
                    onClick={() => handleAuthChoice('login')}
                    className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-left group"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Giriş Yap</h3>
                        <p className="text-sm text-gray-600">Mevcut hesabınla devam et</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      E-posta ve şifrenle giriş yap
                    </p>
                  </button>

                  {/* Register Option */}
                  <button
                    onClick={() => handleAuthChoice('register')}
                    className="p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-200 text-left group"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                        <UserPlus className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Kayıt Ol</h3>
                        <p className="text-sm text-gray-600">Yeni hesap oluştur</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      Birkaç adımda hesabını oluştur
                    </p>
                  </button>
                </div>
              </div>
            )}

            {step === 'mentorType' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Individual Mentor */}
                  <button
                    onClick={() => handleMentorTypeSelect('individual')}
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
                    <p className="text-sm text-gray-500">
                      Kişisel deneyim ve uzmanlığınızla mentorluk yapın
                    </p>
                  </button>

                  {/* Corporate Mentor */}
                  <button
                    onClick={() => handleMentorTypeSelect('corporate')}
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
                    <p className="text-sm text-gray-500">
                      Kurumsal kimliğinizle mentorluk yapın
                    </p>
                  </button>
                </div>
              </div>
            )}

            {step === 'form' && role && tab && (
              <AuthForm
                mode={tab}
                role={role}
                mentorType={role === 'mentor' ? mentorType : undefined}
                returnTo={returnTo}
                onSuccess={handleSuccess}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntryFlowModal;
