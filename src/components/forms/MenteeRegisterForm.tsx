"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerMentee } from '../../lib/actions/menteeActions';
import { useToast } from '../../hooks/useToast';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

// Sabitler
const INTERESTS = [
  'yazilim','veri_ai','urun','tasarim_ux','pazarlama','satis_bd',
  'finans_yatirim','girisim','kariyer_liderlik','akademik','verimlilik','yurtdisi_dil'
] as const;

const GOALS = [
  'temel_bilgi','somut_hedef','ise_giris_terfi','sektor_degisim',
  'yurtdisi_basvuru','girisim','finans','akademik'
] as const;

const PRIORITIES = [
  'cv_portfoy','mock_interview','yol_haritasi','teknik_kocluk',
  'proje_danismanligi','network_tanitimi','ucret_pazarligi',
  'borsa_portfoy','akademik_danismanlik','yurtdisi_dokuman'
] as const;

// Label mapping
const INTEREST_LABELS: Record<typeof INTERESTS[number], string> = {
  yazilim: 'Yazılım',
  veri_ai: 'Veri/AI',
  urun: 'Ürün',
  tasarim_ux: 'Tasarım/UX',
  pazarlama: 'Pazarlama',
  satis_bd: 'Satış/BD',
  finans_yatirim: 'Finans/Yatırım',
  girisim: 'Girişimcilik',
  kariyer_liderlik: 'Kariyer/Liderlik',
  akademik: 'Akademik',
  verimlilik: 'Verimlilik',
  yurtdisi_dil: 'Yurt dışı & Dil'
};

const GOAL_LABELS: Record<typeof GOALS[number], string> = {
  temel_bilgi: 'Temel bilgi edinmek',
  somut_hedef: 'Somut hedef (sertifika/proje)',
  ise_giris_terfi: 'İşe giriş / Terfi',
  sektor_degisim: 'Sektör değişimi',
  yurtdisi_basvuru: 'Yurt dışı başvuru',
  girisim: 'Girişim başlatma',
  finans: 'Finansal planlama',
  akademik: 'Akademik başarı'
};

const PRIORITY_LABELS: Record<typeof PRIORITIES[number], string> = {
  cv_portfoy: 'CV/Portföy',
  mock_interview: 'Mock Interview',
  yol_haritasi: 'Yol Haritası',
  teknik_kocluk: 'Teknik Koçluk',
  proje_danismanligi: 'Proje Danışmanlığı',
  network_tanitimi: 'Network Tanıtımı',
  ucret_pazarligi: 'Ücret Pazarlığı',
  borsa_portfoy: 'Borsa/Portföy',
  akademik_danismanlik: 'Akademik Danışmanlık',
  yurtdisi_dokuman: 'Yurt dışı Doküman'
};

// Zod Schema
const schema = z.object({
  fullName: z.string().min(2, 'Ad soyad en az 2 karakter olmalı'),
  email: z.string().email('Geçerli bir e-posta adresi girin'),
  password: z.string().min(8, 'Şifre en az 8 karakter olmalı'),
  shortGoal: z.string().min(80, 'En az 80 karakter').max(160, 'En fazla 160 karakter'),
  targetTrack: z.string().min(1, 'Lütfen bir alan seçin'),
  
  // YENİ: Rich Preferences
  interests: z.array(z.enum(INTERESTS)).min(1, 'En az 1 alan seçin').max(5, 'En fazla 5 alan seçebilirsiniz'),
  goalType: z.enum(GOALS, { required_error: 'Bir hedef tipi seçin' }),
  priorities: z.array(z.enum(PRIORITIES))
    .refine(arr => arr.length === 3, { message: 'Lütfen tam 3 öncelik seçin' }),
  
  budget: z.enum(['0_500', '500_1000', '1000_plus', 'undecided'], { errorMap: () => ({ message: 'Lütfen bütçe seçin' }) }),
  timePref: z.enum(['weekday_evening', 'weekend', 'flexible', 'weekdays_day'], { errorMap: () => ({ message: 'Lütfen zaman tercihi seçin' }) }),
  city: z.string().optional(),
  country: z.string().default('Turkey'),
  languages: z.array(z.string()).min(1, 'En az bir dil seçin'),
  kvkk: z.literal(true, { errorMap: () => ({ message: 'KVKK onayı zorunludur' }) })
});

type FormData = z.infer<typeof schema>;

export default function MenteeRegisterForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { success: showSuccess, error: showError } = useToast();

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { 
      country: 'Turkey', 
      languages: ['tr'],
      interests: [],
      priorities: []
    }
  });

  const shortGoal = watch('shortGoal') || '';
  const interests = watch('interests') || [];
  const priorities = watch('priorities') || [];

  // Toggle array helper
  const toggleArrayField = (field: 'interests' | 'priorities', value: string, maxLimit?: number) => {
    const current = watch(field) || [];
    const exists = current.includes(value as any);
    
    if (exists) {
      setValue(field, current.filter(x => x !== value) as any, { shouldValidate: true });
    } else {
      if (!maxLimit || current.length < maxLimit) {
        setValue(field, [...current, value] as any, { shouldValidate: true });
      }
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setError(null);
      const result = await registerMentee(data);
      
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
        <p className="text-gray-600">Hoş geldin! Şimdi giriş yapabilirsin...</p>
        <div className="mt-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-800">{error}</div>
        </div>
      )}

      {/* ====== KİŞİSEL BİLGİLER ====== */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 pb-2 border-b">Kişisel Bilgiler</h3>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad *</label>
            <input
              type="text"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Adınız Soyadınız"
              {...register('fullName')}
            />
            {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-posta *</label>
            <input
              type="email"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
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
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="En az 8 karakter"
            {...register('password')}
          />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kısa Hedef Açıklaması * ({shortGoal.length}/160)
          </label>
          <textarea
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors h-24 resize-none ${errors.shortGoal ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Mentordan ne öğrenmek istiyorsun? Hedefin nedir? (80-160 karakter)"
            {...register('shortGoal')}
          />
          {errors.shortGoal && <p className="mt-1 text-sm text-red-600">{errors.shortGoal.message}</p>}
        </div>
      </div>

      {/* ====== GELİŞİM ALANLARI (Interests) ====== */}
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Gelişim Alanları</h3>
          <p className="text-sm text-gray-500">Hangi alanlarda gelişmek istiyorsun? (1-5 seçim)</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map(key => (
            <button
              type="button"
              key={key}
              onClick={() => toggleArrayField('interests', key, 5)}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 ${
                interests.includes(key) 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-blue-400'
              }`}
            >
              {INTEREST_LABELS[key]}
            </button>
          ))}
        </div>
        {errors.interests && <p className="text-sm text-red-600 mt-1">{errors.interests.message as string}</p>}
      </div>

      {/* ====== HEDEF TİPİ (Goal Type) ====== */}
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Hedef Tipi</h3>
          <p className="text-sm text-gray-500">Mentorluktan beklentin nedir?</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {GOALS.map(g => (
            <label 
              key={g} 
              className={`flex items-start gap-3 rounded-lg border-2 p-4 cursor-pointer transition-all duration-200 ${
                watch('goalType') === g 
                  ? 'border-emerald-500 bg-emerald-50' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input 
                type="radio" 
                value={g} 
                {...register('goalType')} 
                className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm font-medium text-gray-900">{GOAL_LABELS[g]}</span>
            </label>
          ))}
        </div>
        {errors.goalType && <p className="text-sm text-red-600 mt-1">{errors.goalType.message as string}</p>}
      </div>

      {/* ====== ÖNCELİKLERİM (Priorities - exactly 3) ====== */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Önceliklerim</h3>
            <p className="text-sm text-gray-500">Mentordan hangi konularda destek almak istiyorsun? (Tam 3 tane seç)</p>
          </div>
          <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
            priorities.length === 3 ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
          }`}>
            {priorities.length}/3
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRIORITIES.map(key => {
            const selected = priorities.includes(key);
            const disabled = !selected && priorities.length >= 3;
            
            return (
              <button
                type="button"
                key={key}
                disabled={disabled}
                onClick={() => toggleArrayField('priorities', key, 3)}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 ${
                  selected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' 
                    : disabled
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-emerald-400'
                }`}
              >
                {PRIORITY_LABELS[key]}
              </button>
            );
          })}
        </div>
        {errors.priorities && <p className="text-sm text-red-600 mt-1">{errors.priorities.message as string}</p>}
      </div>

      {/* ====== DİĞER TERCİHLER ====== */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 pb-2 border-b">Diğer Tercihler</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Alan *</label>
          <select
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.targetTrack ? 'border-red-500' : 'border-gray-300'}`}
            {...register('targetTrack')}
          >
            <option value="">Seçiniz</option>
            <option value="borsa">Borsa & Yatırım</option>
            <option value="kariyer">Kariyer/İş</option>
            <option value="egitim">Üniversite & Eğitim</option>
            <option value="kisisel">Kişisel Gelişim</option>
            <option value="degisim">Hayat Değişimi</option>
            <option value="yazilim">Yazılım</option>
            <option value="veri_ai">Veri/AI</option>
            <option value="tasarim">Tasarım</option>
          </select>
          {errors.targetTrack && <p className="mt-1 text-sm text-red-600">{errors.targetTrack.message}</p>}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bütçe *</label>
            <select
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.budget ? 'border-red-500' : 'border-gray-300'}`}
              {...register('budget')}
            >
              <option value="">Seçiniz</option>
              <option value="0_500">0-500₺</option>
              <option value="500_1000">500-1000₺</option>
              <option value="1000_plus">1000+₺</option>
              <option value="undecided">Henüz karar vermedim</option>
            </select>
            {errors.budget && <p className="mt-1 text-sm text-red-600">{errors.budget.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Zaman Tercihi *</label>
            <select
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.timePref ? 'border-red-500' : 'border-gray-300'}`}
              {...register('timePref')}
            >
              <option value="">Seçiniz</option>
              <option value="weekdays_day">Hafta içi gündüz</option>
              <option value="weekday_evening">Hafta içi akşam</option>
              <option value="weekend">Hafta sonu</option>
              <option value="flexible">Esnek</option>
            </select>
            {errors.timePref && <p className="mt-1 text-sm text-red-600">{errors.timePref.message}</p>}
          </div>
        </div>
      </div>

      {/* ====== KONUM VE DİLLER ====== */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 pb-2 border-b">Konum ve Diller</h3>
        
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Şehir</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="İstanbul"
              {...register('city')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ülke</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Turkey"
              {...register('country')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Diller * (Çoklu seçim)</label>
            <select
              multiple
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors h-24 ${errors.languages ? 'border-red-500' : 'border-gray-300'}`}
              {...register('languages')}
            >
              <option value="tr">Türkçe</option>
              <option value="en">İngilizce</option>
              <option value="de">Almanca</option>
              <option value="fr">Fransızca</option>
            </select>
            {errors.languages && <p className="mt-1 text-sm text-red-600">{errors.languages.message}</p>}
            <p className="mt-1 text-xs text-gray-500">Ctrl/Cmd tuşu ile birden fazla seçebilirsiniz</p>
          </div>
        </div>
      </div>

      {/* ====== KVKK ONAYI ====== */}
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

      {/* ====== SUBMIT ====== */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
