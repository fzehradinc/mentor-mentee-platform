"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { submitWorkshopRequest } from '../../lib/actions/workshopActions';
import { Loader2, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { getCurrentUser } from '../../lib/auth/requireMentee';

const schema = z.object({
  requesterName: z.string().min(2, 'Ad soyad en az 2 karakter olmalı'),
  requesterEmail: z.string().email('Geçerli bir e-posta adresi girin'),
  participantType: z.enum(['student', 'professional', 'corporate'], { 
    errorMap: () => ({ message: 'Lütfen katılımcı tipini seçin' }) 
  }),
  preferredTimes: z.array(z.string()).min(1, 'En az 1 zaman tercihi seçin'),
  message: z.string().optional()
});

type FormData = z.infer<typeof schema>;

interface WorkshopRequestFormProps {
  workshopId: string;
  workshopTitle: string;
  availableTimes?: string[]; // Workshop'un mevcut session tarihler
}

export default function WorkshopRequestForm({ workshopId, workshopTitle, availableTimes = [] }: WorkshopRequestFormProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = getCurrentUser();

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      requesterName: user?.fullName || '',
      requesterEmail: user?.email || '',
      preferredTimes: [],
      participantType: 'professional'
    }
  });

  const selectedTimes = watch('preferredTimes') || [];

  const toggleTime = (time: string) => {
    const current = selectedTimes;
    if (current.includes(time)) {
      setValue('preferredTimes', current.filter(t => t !== time), { shouldValidate: true });
    } else {
      setValue('preferredTimes', [...current, time], { shouldValidate: true });
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setError(null);
      await submitWorkshopRequest({
        workshop_id: workshopId,
        requester_email: data.requesterEmail,
        requester_name: data.requesterName,
        preferred_times: data.preferredTimes,
        message: data.message,
        participant_type: data.participantType
      });
      
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Talep gönderilemedi');
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white rounded-2xl border-2 border-green-200 p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">Talebiniz Alındı! 🎉</h3>
        <p className="text-gray-600 mb-1">
          <strong>{workshopTitle}</strong> workshop'u için talebinizi aldık.
        </p>
        <p className="text-sm text-gray-500">
          Talebiniz için en geç 24 saat içinde size uygun saatleri paylaşacağız.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:p-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Talep Formu</h3>
      <p className="text-sm text-gray-600 mb-6">
        Bu workshop'u beğendiyseniz, talebinizi gönderin; uygun zaman dilimlerini size iletelim.
      </p>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-800">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Info */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad *</label>
            <input
              type="text"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors.requesterName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Adınız Soyadınız"
              {...register('requesterName')}
            />
            {errors.requesterName && (
              <p className="mt-1 text-sm text-red-600">{errors.requesterName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-posta *</label>
            <input
              type="email"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors.requesterEmail ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="ornek@email.com"
              {...register('requesterEmail')}
            />
            {errors.requesterEmail && (
              <p className="mt-1 text-sm text-red-600">{errors.requesterEmail.message}</p>
            )}
          </div>
        </div>

        {/* Participant Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Katılımcı Tipi *</label>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              { value: 'student', label: 'Öğrenci', desc: 'Üniversite veya lise öğrencisi' },
              { value: 'professional', label: 'Profesyonel', desc: 'Çalışan / kariyer geliştirme' },
              { value: 'corporate', label: 'Kurumsal', desc: 'Şirket / kurum adına' }
            ].map((type) => (
              <label
                key={type.value}
                className={`flex flex-col gap-2 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  watch('participantType') === type.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  value={type.value}
                  {...register('participantType')}
                  className="sr-only"
                />
                <span className="font-medium text-gray-900">{type.label}</span>
                <span className="text-xs text-gray-500">{type.desc}</span>
              </label>
            ))}
          </div>
          {errors.participantType && (
            <p className="mt-1 text-sm text-red-600">{errors.participantType.message}</p>
          )}
        </div>

        {/* Preferred Times */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tercih Ettiğiniz Zaman Dilimleri * (En az 1 seçin)
          </label>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {availableTimes.length > 0 ? (
              availableTimes.map((time, idx) => {
                const isSelected = selectedTimes.includes(time);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleTime(time)}
                    className={`flex items-center gap-3 p-3 border-2 rounded-lg text-left transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Clock className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(time).toLocaleDateString('tr-TR', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="md:col-span-2 lg:col-span-3 text-sm text-gray-500 p-4 bg-gray-50 rounded-lg">
                Bu workshop için henüz belirlenmiş tarih yok. Tercih ettiğiniz zamanları mesaj kısmında belirtebilirsiniz.
              </div>
            )}
          </div>
          {errors.preferredTimes && (
            <p className="mt-1 text-sm text-red-600">{errors.preferredTimes.message}</p>
          )}
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ek Mesaj / Beklentileriniz
          </label>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-32 resize-none"
            placeholder="Bu workshop'tan beklentileriniz nedir? Tercih ettiğiniz zaman dilimleri varsa buraya yazabilirsiniz."
            {...register('message')}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Gönderiliyor...
            </>
          ) : (
            'Talep Gönder'
          )}
        </button>

        <p className="text-xs text-center text-gray-500">
          Talebinizi gönderdikten sonra, en geç 24 saat içinde size uygun saat önerileri paylaşacağız.
        </p>
      </form>
    </div>
  );
}


