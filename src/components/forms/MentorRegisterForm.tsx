"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerMentor } from '../../lib/actions/mentorActions';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const baseSchema = {
  displayName: z.string().min(2, 'Görünen isim en az 2 karakter olmalı'),
  email: z.string().email('Geçerli bir e-posta adresi girin'),
  password: z.string().min(8, 'Şifre en az 8 karakter olmalı'),
  title: z.string().min(2, 'Unvan zorunludur'),
  yearsExperience: z.coerce.number().min(0, 'Deneyim yılı 0 veya daha fazla olmalı'),
  hourlyRate: z.coerce.number().min(100, 'Seans ücreti en az 100₺ olmalı'),
  meetingPreference: z.enum(['platform_internal', 'zoom', 'google_meet', 'flexible']),
  bioShort: z.string().min(80, 'En az 80 karakter').max(160, 'En fazla 160 karakter'),
  bioLong: z.string().min(400, 'En az 400 karakter').max(1200, 'En fazla 1200 karakter'),
  city: z.string().optional(),
  country: z.string().default('Turkey'),
  languages: z.array(z.string()).min(1, 'En az bir dil seçin'),
  categories: z.array(z.string()).min(1, 'En az bir kategori seçin'),
  skills: z.string().min(2, 'Becerilerinizi girin'),
  kvkk: z.literal(true, { errorMap: () => ({ message: 'KVKK onayı zorunludur' }) })
};

const corporateSchema = {
  companyName: z.string().min(2, 'Şirket adı zorunludur'),
  companyWebsite: z.string().url('Geçerli bir URL girin').optional().or(z.literal('')),
  companyTaxId: z.string().optional(),
  workEmail: z.string().email('Geçerli bir e-posta adresi girin').optional().or(z.literal('')),
  roleTitle: z.string().optional()
};

const schemaIndividual = z.object({ mode: z.literal('individual'), ...baseSchema });
const schemaCorporate = z.object({ mode: z.literal('corporate'), ...baseSchema, ...corporateSchema });

type Props = { mode: 'individual' | 'corporate' };
type FormDataIndividual = z.infer<typeof schemaIndividual>;
type FormDataCorporate = z.infer<typeof schemaCorporate>;
type FormData = FormDataIndividual | FormDataCorporate;

export default function MentorRegisterForm({ mode }: Props) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolver = zodResolver(mode === 'individual' ? schemaIndividual : schemaCorporate);
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm<any>({
    resolver,
    defaultValues: { mode, country: 'Turkey', languages: ['tr'], categories: ['yazilim'] }
  });

  const bioShort = watch('bioShort') || '';
  const bioLong = watch('bioLong') || '';

  const onSubmit = async (data: FormData) => {
    try {
      setError(null);
      const result = await registerMentor(data);
      
      if (result.success && result.user) {
        setIsSuccess(true);
        
        // Kayıt bilgilerini geçici olarak sakla (login için)
        sessionStorage.setItem('pendingLogin', JSON.stringify({
          email: data.email,
          password: data.password
        }));
        
        // 2 saniye sonra ana sayfaya dön ve login modalını aç
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('navigateTo', { detail: 'home' }));
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('openLoginModal'));
          }, 300);
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || 'Kayıt sırasında bir hata oluştu');
    }
  };

  if (isSuccess) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">Kayıt Başarılı! 🎉</h3>
        <p className="text-gray-600">Hoş geldin! Profilin oluşturuldu. Şimdi giriş yapabilirsin...</p>
        <div className="mt-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-800">{error}</div>
        </div>
      )}

      {/* Kişisel Bilgiler */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Kişisel Bilgiler</h3>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Görünen İsim *</label>
            <input
              type="text"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${errors.displayName ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Adınız Soyadınız"
              {...register('displayName')}
            />
            {errors.displayName && <p className="mt-1 text-sm text-red-600">{errors.displayName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-posta *</label>
            <input
              type="email"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="ornek@email.com"
              {...register('email')}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Şifre *</label>
          <input
            type="password"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="En az 8 karakter"
            {...register('password')}
          />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
        </div>
      </div>

      {/* Profesyonel Bilgiler */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Profesyonel Bilgiler</h3>
        
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Unvan *</label>
            <input
              type="text"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Senior Developer"
              {...register('title')}
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deneyim (Yıl) *</label>
            <input
              type="number"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${errors.yearsExperience ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="5"
              {...register('yearsExperience')}
            />
            {errors.yearsExperience && <p className="mt-1 text-sm text-red-600">{errors.yearsExperience.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Seans Ücreti (₺) *</label>
            <input
              type="number"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${errors.hourlyRate ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="500"
              {...register('hourlyRate')}
            />
            {errors.hourlyRate && <p className="mt-1 text-sm text-red-600">{errors.hourlyRate.message}</p>}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Görüşme Tercihi *</label>
            <select
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${errors.meetingPreference ? 'border-red-500' : 'border-gray-300'}`}
              {...register('meetingPreference')}
            >
              <option value="platform_internal">Platform içi</option>
              <option value="zoom">Zoom</option>
              <option value="google_meet">Google Meet</option>
              <option value="flexible">Esnek</option>
            </select>
            {errors.meetingPreference && <p className="mt-1 text-sm text-red-600">{errors.meetingPreference.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Şehir</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors"
              placeholder="İstanbul"
              {...register('city')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ülke</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors"
              placeholder="Turkey"
              {...register('country')}
            />
          </div>
        </div>
      </div>

      {/* Tanıtım */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Tanıtım</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kısa Tanıtım * ({bioShort.length}/160)
          </label>
          <textarea
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors h-24 resize-none ${errors.bioShort ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Kendini kısa ve öz bir şekilde tanıt (80-160 karakter)"
            {...register('bioShort')}
          />
          {errors.bioShort && <p className="mt-1 text-sm text-red-600">{errors.bioShort.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Detaylı Tanıtım * ({bioLong.length}/1200)
          </label>
          <textarea
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors h-48 resize-none ${errors.bioLong ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Deneyimlerini, uzmanlık alanlarını ve mentee'lere nasıl katkı sağlayacağını detaylı anlat (400-1200 karakter)"
            {...register('bioLong')}
          />
          {errors.bioLong && <p className="mt-1 text-sm text-red-600">{errors.bioLong.message}</p>}
        </div>
      </div>

      {/* Diller, Kategoriler, Beceriler */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Uzmanlık ve Beceriler</h3>
        
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Diller * (Çoklu)</label>
            <select
              multiple
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors h-24 ${errors.languages ? 'border-red-500' : 'border-gray-300'}`}
              {...register('languages')}
            >
              <option value="tr">Türkçe</option>
              <option value="en">İngilizce</option>
              <option value="de">Almanca</option>
              <option value="fr">Fransızca</option>
            </select>
            {errors.languages && <p className="mt-1 text-sm text-red-600">{errors.languages.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategoriler * (Çoklu)</label>
            <select
              multiple
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors h-24 ${errors.categories ? 'border-red-500' : 'border-gray-300'}`}
              {...register('categories')}
            >
              <option value="urun">Ürün</option>
              <option value="yazilim">Yazılım</option>
              <option value="veri_ai">Veri/AI</option>
              <option value="tasarim">Tasarım</option>
              <option value="pazarlama">Pazarlama</option>
              <option value="liderlik">Liderlik</option>
            </select>
            {errors.categories && <p className="mt-1 text-sm text-red-600">{errors.categories.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Beceriler * (virgülle ayır)</label>
            <textarea
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors h-24 resize-none ${errors.skills ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="React, TypeScript, Node.js"
              {...register('skills')}
            />
            {errors.skills && <p className="mt-1 text-sm text-red-600">{errors.skills.message}</p>}
          </div>
        </div>
      </div>

      {/* Kurumsal Bilgiler (Sadece Corporate Mode) */}
      {mode === 'corporate' && (
        <div className="rounded-xl border-2 border-purple-200 bg-purple-50 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs">KURUMSAL</span>
            Şirket Bilgileri
          </h3>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Şirket Adı *</label>
              <input
                type="text"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 transition-colors ${errors.companyName ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="ABC Teknoloji A.Ş."
                {...register('companyName')}
              />
              {errors.companyName && <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Web Sitesi</label>
              <input
                type="url"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 transition-colors ${errors.companyWebsite ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="https://sirket.com"
                {...register('companyWebsite')}
              />
              {errors.companyWebsite && <p className="mt-1 text-sm text-red-600">{errors.companyWebsite.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">VKN/MERSİS No</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 transition-colors"
                placeholder="1234567890"
                {...register('companyTaxId')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kurumsal E-posta</label>
              <input
                type="email"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 transition-colors ${errors.workEmail ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="isim@sirket.com"
                {...register('workEmail')}
              />
              {errors.workEmail && <p className="mt-1 text-sm text-red-600">{errors.workEmail.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Kurum İçi Rol/Ünvan</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 transition-colors"
                placeholder="Eğitim Koordinatörü"
                {...register('roleTitle')}
              />
            </div>
          </div>
        </div>
      )}

      {/* KVKK Onayı */}
      <div className="border-t pt-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            {...register('kvkk')}
          />
          <span className="text-sm text-gray-700">
            <a href="/kvkk" target="_blank" className="text-blue-600 hover:underline">KVKK Aydınlatma Metni</a>'ni okudum, 
            kişisel verilerimin işlenmesini kabul ediyorum. *
          </span>
        </label>
        {errors.kvkk && <p className="mt-1 text-sm text-red-600 ml-7">{errors.kvkk.message}</p>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
          mode === 'corporate' ? 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
        }`}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
            Kaydediliyor...
          </>
        ) : (
          'Kaydı Tamamla'
        )}
      </button>

      <p className="text-center text-sm text-gray-500">
        Zaten hesabın var mı?{' '}
        <button type="button" onClick={() => window.dispatchEvent(new Event('openLoginModal'))} className="text-blue-600 hover:underline">
          Giriş yap
        </button>
      </p>
    </form>
  );
}

