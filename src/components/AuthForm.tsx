"use client";
import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

interface AuthFormProps {
  mode: 'login' | 'register';
  role: 'mentee' | 'mentor';
  mentorType?: 'individual' | 'corporate';
  returnTo?: string;
  onSuccess?: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({
  mode,
  role,
  mentorType,
  returnTo,
  onSuccess
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [kvkkAccepted, setKvkkAccepted] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (pwd: string) => {
    const minLength = pwd.length >= 8;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    
    return {
      minLength,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial,
      isValid: minLength && hasUpper && hasLower && hasNumber && hasSpecial
    };
  };

  const passwordValidation = validatePassword(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    setIsLoading(true);

    try {
      // Validation
      if (mode === 'register') {
        if (!kvkkAccepted) {
          throw new Error('KVKK onayı gereklidir');
        }
        if (password !== passwordConfirm) {
          throw new Error('Şifreler eşleşmiyor');
        }
        if (!passwordValidation.isValid) {
          throw new Error('Şifre güvenlik gereksinimlerini karşılamıyor');
        }
      }

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Success
      console.log('Auth success:', { mode, role, mentorType, returnTo });
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultRoute = () => {
    if (role === 'mentee') return '/mentee/onboarding';
    if (role === 'mentor') {
      if (mentorType === 'corporate') return '/mentor/corporate/onboarding';
      return '/mentor/onboarding';
    }
    return '/dashboard';
  };

  return (
    <div className="space-y-6">
      {/* Role Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span className="font-medium">Rol:</span>
          <span className="capitalize">{role === 'mentee' ? 'Mentee' : 'Mentor'}</span>
          {role === 'mentor' && mentorType && (
            <>
              <span>•</span>
              <span className="capitalize">
                {mentorType === 'individual' ? 'Bireysel' : 'Kurumsal'}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-red-800 font-medium">Hata</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            E-posta
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="ornek@email.com"
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Şifre
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          
          {/* Password Strength Indicator */}
          {mode === 'register' && password && (
            <div className="mt-2 space-y-1">
              <div className="flex items-center space-x-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${passwordValidation.minLength ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className={passwordValidation.minLength ? 'text-green-600' : 'text-gray-500'}>
                  En az 8 karakter
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${passwordValidation.hasUpper ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className={passwordValidation.hasUpper ? 'text-green-600' : 'text-gray-500'}>
                  Büyük harf
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${passwordValidation.hasLower ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className={passwordValidation.hasLower ? 'text-green-600' : 'text-gray-500'}>
                  Küçük harf
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${passwordValidation.hasNumber ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className={passwordValidation.hasNumber ? 'text-green-600' : 'text-gray-500'}>
                  Rakam
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${passwordValidation.hasSpecial ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className={passwordValidation.hasSpecial ? 'text-green-600' : 'text-gray-500'}>
                  Özel karakter
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Password Confirm (Register only) */}
        {mode === 'register' && (
          <div>
            <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 mb-2">
              Şifre (Tekrar)
            </label>
            <div className="relative">
              <input
                type={showPasswordConfirm ? 'text' : 'password'}
                id="passwordConfirm"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswordConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {passwordConfirm && password !== passwordConfirm && (
              <p className="mt-1 text-sm text-red-600">Şifreler eşleşmiyor</p>
            )}
          </div>
        )}

        {/* Remember Me (Login only) */}
        {mode === 'login' && (
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
              Beni hatırla
            </label>
          </div>
        )}

        {/* KVKK Consent (Register only) */}
        {mode === 'register' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="kvkk"
                checked={kvkkAccepted}
                onChange={(e) => setKvkkAccepted(e.target.checked)}
                required
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
              />
              <div>
                <label htmlFor="kvkk" className="text-sm text-gray-700">
                  <span className="font-medium">KVKK uyarınca kişisel verilerimin işlenmesini kabul ediyorum.</span>
                  <br />
                  <span className="text-xs text-gray-500 mt-1 block">
                    Kişisel verileriniz güvenli şekilde saklanır ve üçüncü taraflarla paylaşılmaz.
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || (mode === 'register' && !passwordValidation.isValid)}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>İşleniyor...</span>
            </div>
          ) : (
            mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'
          )}
        </button>

        {/* Forgot Password (Login only) */}
        {mode === 'login' && (
          <div className="text-center">
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Şifremi unuttum?
            </button>
          </div>
        )}

        {/* Google SSO (Optional) */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">veya</span>
          </div>
        </div>

        <button
          type="button"
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span className="text-gray-700 font-medium">
            Google ile {mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
          </span>
        </button>
      </form>
    </div>
  );
};

export default AuthForm;


