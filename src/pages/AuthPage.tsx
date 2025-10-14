import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, UserCheck } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../contexts/AuthContext';
import MenteeRegistrationSuccess from '../components/MenteeRegistrationSuccess';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';

interface AuthPageProps {
  onSuccess: () => void;
}

/**
 * Authentication page component for login and registration
 * Props:
 * - onSuccess: Function called after successful authentication
 */
const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const { login, register, isLoading, error } = useAuth();
  const { toasts, hideToast, success: showSuccess } = useToast();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'mentee' as 'mentor' | 'mentee',
    preferredArea: '',
    goal: '',
    budgetRange: '',
    availableTime: ''
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear validation error for this field
    if (validationErrors[e.target.name]) {
      setValidationErrors({
        ...validationErrors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (isSignUp) {
      if (!formData.name.trim()) {
        errors.name = 'İsim soyisim gereklidir';
      }
      
      if (formData.password.length < 6) {
        errors.password = 'Şifre en az 6 karakter olmalıdır';
      }
      
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Şifreler eşleşmiyor';
      }
    }

    if (!formData.email.trim()) {
      errors.email = 'E-posta gereklidir';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Geçerli bir e-posta adresi giriniz';
    }

    if (!formData.password.trim()) {
      errors.password = 'Şifre gereklidir';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      let success = false;

      if (isSignUp) {
        success = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        });

        if (success && formData.role === 'mentee') {
          // Show success modal for mentee registration
          setShowSuccessModal(true);
          showSuccess('Kayıt tamamlandı. Tercihlerin kaydedildi ✅');
          return;
        }
      } else {
        success = await login(formData.email, formData.password);
      }

      if (success) {
        onSuccess();
      }
    } catch (err) {
      console.error('Authentication error:', err);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const switchMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'mentee'
    });
    setValidationErrors({});
  };

  return (
    <Layout onShowAuth={() => {}} onShowAppointments={() => {}}>
      <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Side - Illustration/Info */}
            <div className="hidden lg:block">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 h-full flex flex-col justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <UserCheck className="w-16 h-16 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {isSignUp ? 'MentorHub\'a Hoş Geldiniz!' : 'Tekrar Hoş Geldiniz!'}
                  </h2>
                  <p className="text-lg text-gray-600 mb-6">
                    {isSignUp 
                      ? 'Türkiye\'nin en büyük mentörlük platformuna katılın ve kariyerinizi bir üst seviyeye taşıyın.'
                      : 'Mentörlük yolculuğunuza kaldığınız yerden devam edin.'
                    }
                  </p>
                  <div className="space-y-3 text-left">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-gray-700">Nitelikli mentörlerle buluşun</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-gray-700">Hedeflerinize uygun eşleşmeler</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-gray-700">Esnek randevu sistemi</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full max-w-md mx-auto">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {isSignUp ? 'Yeni Hesap Oluştur' : 'Giriş Yap'}
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">
                    {isSignUp 
                      ? 'MentorHub\'a katılın ve mentörlük yolculuğunuza başlayın'
                      : 'Hesabınıza giriş yapın'
                    }
                  </p>
                </div>
                
                {/* Form */}
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* Role Selection - Only for Sign Up */}
                  {isSignUp && (
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                        Hesap Türü
                      </label>
                      <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      >
                        <option value="mentee">Menti (Mentörlük almak istiyorum)</option>
                        <option value="mentor">Mentör (Mentörlük vermek istiyorum)</option>
                      </select>
                    </div>
                  )}

                  {/* Name - Only for Sign Up */}
                  {isSignUp && (
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        İsim Soyisim
                      </label>
                      <div className="relative">
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required={isSignUp}
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            validationErrors.name ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Adınızı ve soyadınızı giriniz"
                        />
                        <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                      </div>
                      {validationErrors.name && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                      )}
                    </div>
                  )}

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      E-posta Adresi
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          validationErrors.email ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="ornek@email.com"
                      />
                      <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    </div>
                    {validationErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Şifre
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete={isSignUp ? 'new-password' : 'current-password'}
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-3 pl-10 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          validationErrors.password ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder={isSignUp ? "En az 6 karakter" : "Şifrenizi giriniz"}
                      />
                      <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                    {validationErrors.password && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password - Only for Sign Up */}
                  {isSignUp && (
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Şifreyi Doğrula
                      </label>
                      <div className="relative">
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          required={isSignUp}
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-3 pl-10 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            validationErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Şifrenizi tekrar giriniz"
                        />
                        <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <button
                          type="button"
                          onClick={toggleConfirmPasswordVisibility}
                          className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                      {validationErrors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
                      )}
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        isSignUp ? 'Kayıt Ol' : 'Giriş Yap'
                      )}
                    </button>
                  </div>

                  {/* Forgot Password - Only for Sign In */}
                  {!isSignUp && (
                    <div className="text-center">
                      <button
                        type="button"
                        className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        Şifremi unuttum?
                      </button>
                    </div>
                  )}

                  {/* Switch Mode */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={switchMode}
                      className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      {isSignUp 
                        ? 'Zaten hesabınız var mı? Giriş yapın' 
                        : 'Hesabınız yok mu? Kayıt olun'
                      }
                    </button>
                  </div>
                </form>

                {/* Demo Credentials */}
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Demo Hesapları:</h4>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p><strong>Menti:</strong> alex@example.com (herhangi bir şifre)</p>
                    <p><strong>Mentör:</strong> sarah@example.com (herhangi bir şifre)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Success Modal */}
      <MenteeRegistrationSuccess
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        menteeData={{
          fullName: formData.name,
          email: formData.email,
          preferredArea: formData.preferredArea || 'Henüz belirtilmedi',
          goal: formData.goal || 'Kişisel gelişim',
          budgetRange: formData.budgetRange || 'Esnek',
          availableTime: formData.availableTime || 'Esnek'
        }}
        onViewMatches={() => {
          setShowSuccessModal(false);
          onSuccess();
        }}
        onCompleteProfile={() => {
          setShowSuccessModal(false);
          onSuccess();
        }}
      />

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => hideToast(toast.id)}
            duration={toast.duration}
          />
        ))}
      </div>
    </Layout>
  );
};

export default AuthPage;