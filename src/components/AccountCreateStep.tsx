import React, { useState } from 'react';
import { Eye, EyeOff, Check, X, Loader2, Mail } from 'lucide-react';

interface AccountCreateStepProps {
  onComplete: (data: { email: string; password: string }) => Promise<void>;
  onShowLogin: () => void;
  loading?: boolean;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

const AccountCreateStep: React.FC<AccountCreateStepProps> = ({
  onComplete,
  onShowLogin,
  loading = false
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const getPasswordStrength = (password: string): PasswordStrength => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 2) return { score, label: 'Zayıf', color: 'bg-red-500' };
    if (score <= 3) return { score, label: 'Orta', color: 'bg-yellow-500' };
    if (score <= 4) return { score, label: 'İyi', color: 'bg-blue-500' };
    return { score, label: 'Güçlü', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(password);

  const passwordRequirements = [
    { met: password.length >= 8, label: 'En az 8 karakter' },
    { met: /[a-z]/.test(password) && /[A-Z]/.test(password), label: 'Büyük ve küçük harf' },
    { met: /\d/.test(password), label: 'En az bir rakam' },
  ];

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = 'E-posta adresi gerekli';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Geçerli bir e-posta adresi girin';
    }

    if (!password) {
      newErrors.password = 'Şifre gerekli';
    } else if (password.length < 8) {
      newErrors.password = 'Şifre en az 8 karakter olmalı';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Şifre doğrulaması gerekli';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Şifreler eşleşmiyor';
    }

    if (!agreedToTerms) {
      newErrors.terms = 'Kullanım koşullarını kabul etmelisiniz';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    validate();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      email: true,
      password: true,
      confirmPassword: true,
      terms: true,
    });

    if (!validate()) {
      return;
    }

    try {
      await onComplete({ email, password });
    } catch (error) {
      console.error('Account creation error:', error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Hesabını Oluştur
        </h2>
        <p className="text-gray-600">
          Bir dakikadan kısa sürecek. İlerlemelerini kaydedelim ve sana özel mentorları saklayalım.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            E-posta Adresi
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => handleBlur('email')}
              className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors ${
                touched.email && errors.email
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 bg-white'
              }`}
              placeholder="ornek@email.com"
              disabled={loading}
            />
          </div>
          {touched.email && errors.email && (
            <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
              <X className="w-4 h-4" />
              <span>{errors.email}</span>
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Şifre
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => handleBlur('password')}
              className={`block w-full pr-10 px-3 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors ${
                touched.password && errors.password
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 bg-white'
              }`}
              placeholder="••••••••"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {password && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">Şifre Gücü:</span>
                <span className={`text-xs font-medium ${
                  passwordStrength.score <= 2 ? 'text-red-600' :
                  passwordStrength.score <= 3 ? 'text-yellow-600' :
                  passwordStrength.score <= 4 ? 'text-blue-600' :
                  'text-green-600'
                }`}>
                  {passwordStrength.label}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${passwordStrength.color} transition-all duration-300`}
                  style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Password Requirements */}
          <div className="mt-3 space-y-1">
            {passwordRequirements.map((req, index) => (
              <div key={index} className="flex items-center space-x-2 text-xs">
                {req.met ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <X className="w-4 h-4 text-gray-400" />
                )}
                <span className={req.met ? 'text-green-600' : 'text-gray-600'}>
                  {req.label}
                </span>
              </div>
            ))}
          </div>

          {touched.password && errors.password && (
            <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
              <X className="w-4 h-4" />
              <span>{errors.password}</span>
            </p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Şifre Doğrulama
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => handleBlur('confirmPassword')}
              className={`block w-full pr-10 px-3 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors ${
                touched.confirmPassword && errors.confirmPassword
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 bg-white'
              }`}
              placeholder="••••••••"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              tabIndex={-1}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {touched.confirmPassword && errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
              <X className="w-4 h-4" />
              <span>{errors.confirmPassword}</span>
            </p>
          )}
          {confirmPassword && password === confirmPassword && (
            <p className="mt-1 text-sm text-green-600 flex items-center space-x-1">
              <Check className="w-4 h-4" />
              <span>Şifreler eşleşiyor</span>
            </p>
          )}
        </div>

        {/* Terms Checkbox */}
        <div>
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              disabled={loading}
            />
            <span className="text-sm text-gray-700">
              <a href="#" className="text-teal-600 hover:text-teal-700 font-medium">
                Kullanım Koşulları
              </a>
              'nı ve{' '}
              <a href="#" className="text-teal-600 hover:text-teal-700 font-medium">
                Gizlilik Politikası
              </a>
              'nı okudum ve kabul ediyorum
            </span>
          </label>
          {touched.terms && errors.terms && (
            <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
              <X className="w-4 h-4" />
              <span>{errors.terms}</span>
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Hesap oluşturuluyor...</span>
            </>
          ) : (
            <span>Hesabımı oluştur ve devam et</span>
          )}
        </button>

        {/* Login Link */}
        <div className="text-center">
          <button
            type="button"
            onClick={onShowLogin}
            className="text-sm text-gray-600 hover:text-gray-900"
            disabled={loading}
          >
            Zaten hesabın var mı?{' '}
            <span className="text-teal-600 hover:text-teal-700 font-medium">
              Giriş yap
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountCreateStep;
