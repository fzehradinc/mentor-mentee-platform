"use client";
import React, { useEffect, useState } from 'react';
import MentorLayout from '../../components/mentor/MentorLayout';
import { CheckCircle, AlertCircle, Loader2, Save, Upload, Camera } from 'lucide-react';
import { getMentorProfileDetailed, updateMentorProfile } from '../../lib/actions/mentorAreaActions';

const SPECIALTIES = [
  "YKS (TYT/AYT)", "LGS", "Üniversite Dersleri", "Hazırlık/IELTS", 
  "Yazılım", "Tasarım", "Veri/AI", "Girişimcilik", "Liderlik", 
  "Kariyer/İş", "Finans/Borsa", "Pazarlama"
];

const SKILLS = [
  "React", "Python", "Machine Learning", "Data Analysis", "UI/UX", 
  "Akademik Yazım", "Sunum Teknikleri", "Problem Çözme", 
  "IELTS", "YKS Matematik", "Fizik", "Kimya"
];

const LANGS = ["tr", "en", "de", "fr", "es", "it"];

export default function MentorProfileEdit() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<any>({
    headline: '',
    company: '',
    location: '',
    short_bio: '',
    long_bio: '',
    specialties: [],
    skills: [],
    languages: ['tr'],
    hourly_price: 500,
    avatar_url: '',
    cover_url: '',
    years_of_exp: 0,
    meeting_pref: []
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getMentorProfileDetailed();
      
      if (data?.mentor && data?.profile) {
        setFormData({
          headline: data.mentor.headline || '',
          company: data.mentor.company || '',
          location: data.mentor.location || '',
          languages: data.mentor.languages || ['tr'],
          years_of_exp: data.mentor.years_of_exp || 0,
          hourly_price: data.mentor.hourly_price || 500,
          avatar_url: data.mentor.avatar_url || '',
          cover_url: data.mentor.cover_url || '',
          short_bio: data.profile.short_bio || '',
          long_bio: data.profile.long_bio || '',
          specialties: data.profile.specialties || [],
          skills: data.profile.skills || [],
          meeting_pref: data.profile.meeting_pref || []
        });
      }
    } catch (err) {
      console.error('Load profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleArrayItem = (key: string, value: string) => {
    const current = formData[key] || [];
    const updated = current.includes(value)
      ? current.filter((v: string) => v !== value)
      : [...current, value];
    
    setFormData({ ...formData, [key]: updated });
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      setError('Lütfen bir resim dosyası seçin');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('Dosya boyutu 5MB\'dan küçük olmalı');
      return;
    }

    // Convert to base64 for mock storage
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setFormData({ ...formData, avatar_url: base64 });
    };
    reader.readAsDataURL(file);
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Lütfen bir resim dosyası seçin');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Dosya boyutu 5MB\'dan küçük olmalı');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setFormData({ ...formData, cover_url: base64 });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setError(null);
    setSuccess(false);

    // Validation (sadece dolu ise kontrol et)
    if (formData.short_bio && formData.short_bio.trim()) {
      if (formData.short_bio.length < 80) {
        setError('Kısa tanıtım en az 80 karakter olmalı');
        return;
      }
      if (formData.short_bio.length > 160) {
        setError('Kısa tanıtım en fazla 160 karakter olmalı');
        return;
      }
    }

    if (formData.long_bio && formData.long_bio.trim()) {
      if (formData.long_bio.length < 400) {
        setError('Detaylı tanıtım en az 400 karakter olmalı');
        return;
      }
      if (formData.long_bio.length > 1200) {
        setError('Detaylı tanıtım en fazla 1200 karakter olmalı');
        return;
      }
    }

    setSaving(true);

    try {
      console.log('💾 Saving mentor profile:', formData);
      await updateMentorProfile(formData);
      
      setSuccess(true);
      console.log('✅ Profile saved successfully!');
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('❌ Save error:', err);
      setError(err?.message || 'Profil güncellenemedi');
    } finally {
      setSaving(false);
    }
  };

  const ChipSet = ({ items, valueKey }: { items: string[]; valueKey: string }) => (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const active = formData[valueKey]?.includes(item);
        return (
          <button
            key={item}
            type="button"
            onClick={() => toggleArrayItem(valueKey, item)}
            className={`rounded-full border px-3 py-1.5 text-xs transition-all ${
              active 
                ? 'border-brand-primary bg-brand-primary/10 text-brand-primary font-medium' 
                : 'border-gray-300 text-gray-600 hover:border-gray-400'
            }`}
          >
            {item}
          </button>
        );
      })}
    </div>
  );

  if (loading) {
    return (
      <MentorLayout currentPage="profile">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </MentorLayout>
    );
  }

  return (
    <MentorLayout currentPage="profile">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Success/Error Messages */}
        {success && (
          <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-800 font-medium">Profiliniz başarıyla güncellendi.</p>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <h1 className="text-2xl font-semibold text-gray-900">Profil Düzenle</h1>

        {/* Temel Bilgiler */}
        <div className="rounded-xl2 border border-gray-200 bg-white p-6 shadow-card space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Temel Bilgiler</h2>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Başlık / Unvan</label>
              <input
                className="w-full rounded-md border border-gray-300 bg-white p-3 text-gray-900 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                placeholder="ör: Kıdemli Yazılım Mühendisi"
                value={formData.headline}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Şirket (Opsiyonel)</label>
              <input
                className="w-full rounded-md border border-gray-300 bg-white p-3 text-gray-900 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                placeholder="ör: Google"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Konum</label>
              <input
                className="w-full rounded-md border border-gray-300 bg-white p-3 text-gray-900 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                placeholder="ör: İstanbul"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Deneyim (Yıl)</label>
              <input
                type="number"
                className="w-full rounded-md border border-gray-300 bg-white p-3 text-gray-900 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                value={formData.years_of_exp}
                onChange={(e) => setFormData({ ...formData, years_of_exp: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
        </div>

        {/* Tanıtım */}
        <div className="rounded-xl2 border border-gray-200 bg-white p-6 shadow-card space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tanıtım</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kısa Tanıtım <span className="text-xs text-gray-500">(80–160 karakter)</span>
            </label>
            <textarea
              rows={3}
              className="w-full rounded-md border border-gray-300 bg-white p-3 text-gray-900 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary resize-none"
              value={formData.short_bio}
              onChange={(e) => setFormData({ ...formData, short_bio: e.target.value })}
              placeholder="Kısa ve öz tanıtım..."
            />
            <div className="text-xs text-gray-500 mt-1">{formData.short_bio?.length || 0}/160</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detaylı Tanıtım <span className="text-xs text-gray-500">(400–1200 karakter)</span>
            </label>
            <textarea
              rows={10}
              className="w-full rounded-md border border-gray-300 bg-white p-3 text-gray-900 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary resize-none"
              value={formData.long_bio}
              onChange={(e) => setFormData({ ...formData, long_bio: e.target.value })}
              placeholder="Detaylı deneyim, uzmanlık alanları, başarılar..."
            />
            <div className="text-xs text-gray-500 mt-1">{formData.long_bio?.length || 0}/1200</div>
          </div>
        </div>

        {/* Alanlar & Beceriler */}
        <div className="rounded-xl2 border border-gray-200 bg-white p-6 shadow-card space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Uzmanlık & Beceriler</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Alanlar (Çoklu Seçim)</label>
            <ChipSet items={SPECIALTIES} valueKey="specialties" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Beceriler (Çoklu Seçim)</label>
            <ChipSet items={SKILLS} valueKey="skills" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Diller</label>
            <ChipSet items={LANGS} valueKey="languages" />
          </div>
        </div>

        {/* Fiyat & Görseller */}
        <div className="rounded-xl2 border border-gray-200 bg-white p-6 shadow-card space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Fiyatlandırma & Görseller</h2>
          
          {/* Saatlik Ücret */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Saatlik Ücret (₺)</label>
            <input
              type="number"
              className="w-full rounded-md border border-gray-300 bg-white p-3 text-gray-900 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
              value={formData.hourly_price}
              onChange={(e) => setFormData({ ...formData, hourly_price: parseInt(e.target.value) || 0 })}
            />
          </div>

          {/* Avatar Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Profil Fotoğrafı
            </label>
            <div className="flex items-center gap-6">
              {/* Preview */}
              <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-300">
                {formData.avatar_url ? (
                  <img 
                    src={formData.avatar_url} 
                    alt="Avatar preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Camera className="w-12 h-12" />
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <div className="flex-1">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                  <Upload className="w-4 h-4" />
                  <span className="text-sm font-medium">Fotoğraf Yükle</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  JPG, PNG veya GIF. Maksimum 5MB.
                </p>
                {formData.avatar_url && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, avatar_url: '' })}
                    className="text-xs text-red-600 hover:text-red-700 mt-2"
                  >
                    Fotoğrafı Kaldır
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Cover Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Kapak Fotoğrafı
            </label>
            <div className="space-y-3">
              {/* Preview */}
              <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 border-2 border-gray-300">
                {formData.cover_url ? (
                  <img 
                    src={formData.cover_url} 
                    alt="Cover preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/50">
                    <Camera className="w-16 h-16" />
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <div className="flex items-center gap-3">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                  <Upload className="w-4 h-4" />
                  <span className="text-sm font-medium">Kapak Yükle</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                  />
                </label>
                {formData.cover_url && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, cover_url: '' })}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Kapağı Kaldır
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500">
                JPG, PNG veya GIF. Maksimum 5MB. Önerilen boyut: 1200x400px
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => loadProfile()}
            disabled={saving}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            İptal
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-hover disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Kaydet
              </>
            )}
          </button>
        </div>
      </div>
    </MentorLayout>
  );
}

