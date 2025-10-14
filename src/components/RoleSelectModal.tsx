"use client";
import React from 'react';
import { X, User, UserCheck } from 'lucide-react';

interface RoleSelectModalProps {
  open: boolean;
  onClose: () => void;
  onMenteeSelect?: () => void;
  onMentorSelect?: () => void;
}

const RoleSelectModal: React.FC<RoleSelectModalProps> = ({ 
  open, 
  onClose, 
  onMenteeSelect, 
  onMentorSelect 
}) => {
  const goMentee = () => {
    onClose();
    onMenteeSelect?.();
  };

  const goMentor = () => {
    onClose();
    onMentorSelect?.();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div 
          className="w-full max-w-3xl rounded-2xl bg-white shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Rolünü seç</h2>
              <p className="text-sm text-gray-600 mt-1">
                Bimentor topluluğuna nasıl katılmak istiyorsun?
              </p>
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
            <div className="grid gap-4 md:grid-cols-2">
              {/* MENTEE */}
              <button
                onClick={goMentee}
                className="rounded-xl border-2 border-gray-200 p-6 text-left hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
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
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
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
                <div className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium group-hover:bg-blue-700 transition-colors">
                  Mentee olarak devam et
                </div>
              </button>

              {/* MENTOR */}
              <button
                onClick={goMentor}
                className="rounded-xl border-2 border-gray-200 p-6 text-left hover:border-green-500 hover:bg-green-50 transition-all duration-200 group"
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
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
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
                <div className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg font-medium group-hover:bg-green-700 transition-colors">
                  Mentor olarak devam et
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectModal;