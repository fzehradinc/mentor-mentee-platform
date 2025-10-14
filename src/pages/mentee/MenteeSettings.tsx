"use client";
import React, { useState, useEffect } from 'react';
import MenteeLayout from '../../components/mentee/MenteeLayout';
import { Save, Download, Shield, User, CheckCircle, AlertCircle, Loader2, Lock } from 'lucide-react';
import { getCurrentUser } from '../../lib/auth/requireMentee';
import { getMenteeProfile, updateMenteeProfile, changePassword, type MenteeProfile } from '../../lib/actions/menteeAreaActions';

export default function MenteeSettings() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<MenteeProfile>({
    id: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    city: '',
    country: 'Turkey'
  });
  const [emailPrefs, setEmailPrefs] = useState({
    bookingReminders: true,
    messages: true,
    marketing: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    
    if (currentUser) {
      loadProfile();
    }
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getMenteeProfile();
      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Load profile error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    setSuccess(false);
    setError(null);
  };

  const handleSave = async () => {
    setError(null);
    setSuccess(false);
    setSaving(true);

    try {
      await updateMenteeProfile({
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone: profile.phone,
        city: profile.city,
        country: profile.country
      });

      // Refresh profile to confirm save
      await loadProfile();
      
      setSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (e: any) {
      setError(e?.message || 'Profil güncellenemedi.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError(null);
    setPasswordSuccess(false);

    // Validations
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError('Tüm alanları doldurun');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError('Yeni şifre en az 8 karakter olmalı');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Yeni şifreler eşleşmiyor');
      return;
    }

    setChangingPassword(true);

    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });

      setPasswordSuccess(true);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (e: any) {
      setPasswordError(e?.message || 'Şifre değiştirilemedi');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDownloadData = () => {
    alert('KVKK/GDPR veri indirme özelliği yakında eklenecek');
  };

  if (loading) {
    return (
      <MenteeLayout currentPage="settings">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      </MenteeLayout>
    );
  }

  return (
    <MenteeLayout currentPage="settings">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Success/Error Messages */}
        {success && (
          <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-800 font-medium">Bilgileriniz başarıyla güncellendi.</p>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Personal Information */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="border-b border-slate-200 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-blue-700" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Kişisel Bilgiler</h2>
                <p className="text-sm text-slate-600">Profil bilgilerinizi güncelleyin</p>
              </div>
            </div>
          </div>

          <div className="px-8 py-6 space-y-6">
            {/* Email (readonly) */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                E-posta <span className="text-xs text-slate-500">(değiştirilemez)</span>
              </label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
              />
            </div>

            {/* First Name & Last Name */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-slate-700 mb-2">
                  Adınız
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={profile.first_name || ''}
                  onChange={handleChange}
                  placeholder="Adınız"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-blue-700"
                />
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-slate-700 mb-2">
                  Soyadınız
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={profile.last_name || ''}
                  onChange={handleChange}
                  placeholder="Soyadınız"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-blue-700"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                Telefon <span className="text-xs text-slate-500">(opsiyonel)</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={profile.phone || ''}
                onChange={handleChange}
                placeholder="+90 5XX XXX XX XX"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-blue-700"
              />
            </div>

            {/* City & Country */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-slate-700 mb-2">
                  Şehir <span className="text-xs text-slate-500">(opsiyonel)</span>
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={profile.city || ''}
                  onChange={handleChange}
                  placeholder="İstanbul"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-blue-700"
                />
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-slate-700 mb-2">
                  Ülke
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={profile.country || 'Turkey'}
                  onChange={handleChange}
                  placeholder="Turkey"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-blue-700"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-slate-200 px-8 py-6 flex justify-end gap-3">
            <button
              onClick={() => loadProfile()}
              disabled={saving}
              className="px-5 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              İptal
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Kaydet
                </>
              )}
            </button>
          </div>
        </div>

        {/* Password Change */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="border-b border-slate-200 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Lock className="w-6 h-6 text-red-700" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Şifre Değiştir</h2>
                <p className="text-sm text-slate-600">Hesap güvenliğiniz için güçlü bir şifre kullanın</p>
              </div>
            </div>
          </div>

          <div className="px-8 py-6 space-y-6">
            {/* Password Success/Error Messages */}
            {passwordSuccess && (
              <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-800 font-medium">Şifreniz başarıyla değiştirildi.</p>
              </div>
            )}

            {passwordError && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{passwordError}</p>
              </div>
            )}

            {/* Current Password */}
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-700 mb-2">
                Mevcut Şifre
              </label>
              <input
                type="password"
                id="currentPassword"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                placeholder="Mevcut şifrenizi girin"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* New Password */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 mb-2">
                Yeni Şifre <span className="text-xs text-slate-500">(en az 8 karakter)</span>
              </label>
              <input
                type="password"
                id="newPassword"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                placeholder="Yeni şifrenizi girin"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                Yeni Şifre (Tekrar)
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                placeholder="Yeni şifrenizi tekrar girin"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-slate-200 px-8 py-6 flex justify-end">
            <button
              onClick={handleChangePassword}
              disabled={changingPassword}
              className="px-6 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {changingPassword ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Değiştiriliyor...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Şifremi Değiştir
                </>
              )}
            </button>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bildirim Tercihleri</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={emailPrefs.bookingReminders}
                onChange={(e) => setEmailPrefs({ ...emailPrefs, bookingReminders: e.target.checked })}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <div>
                <div className="text-sm font-medium text-gray-900">Seans Hatırlatmaları</div>
                <div className="text-xs text-gray-500">Yaklaşan seanslarınız için e-posta bildirimleri</div>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={emailPrefs.messages}
                onChange={(e) => setEmailPrefs({ ...emailPrefs, messages: e.target.checked })}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <div>
                <div className="text-sm font-medium text-gray-900">Mesaj Bildirimleri</div>
                <div className="text-xs text-gray-500">Yeni mesajlar için e-posta bildirimleri</div>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={emailPrefs.marketing}
                onChange={(e) => setEmailPrefs({ ...emailPrefs, marketing: e.target.checked })}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <div>
                <div className="text-sm font-medium text-gray-900">Pazarlama E-postaları</div>
                <div className="text-xs text-gray-500">Özel teklifler ve güncellemeler</div>
              </div>
            </label>
          </div>
          <button
            onClick={handleSave}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
          >
            <Save className="w-4 h-4" />
            Tercihleri Kaydet
          </button>
        </div>

        {/* Privacy & Data */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gizlilik & Veri</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900 mb-1">KVKK / GDPR Uyumluluğu</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Kişisel verileriniz KVKK ve GDPR uyarınca işlenmektedir. Verilerinizi dilediğiniz zaman indirebilir veya silebilirsiniz.
                </p>
                <button
                  onClick={handleDownloadData}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Download className="w-4 h-4" />
                  Verilerimi İndir (JSON)
                </button>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                Hesabımı Sil
              </button>
            </div>
          </div>
        </div>
      </div>
    </MenteeLayout>
  );
}


