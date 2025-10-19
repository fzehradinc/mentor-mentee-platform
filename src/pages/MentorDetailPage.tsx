"use client";
import React, { useState, useEffect } from 'react';
import {
  MapPin, Briefcase, Calendar, DollarSign,
  Star, Award, Languages, Bookmark, MessageSquare,
  Clock, CheckCircle, Building, Globe
} from 'lucide-react';
import BackButton from '../components/BackButton';
import { mockMentors } from '../data/mockData';

interface MentorDetailPageProps {
  mentorId: string;
  onBack: () => void;
}

const MentorDetailPage: React.FC<MentorDetailPageProps> = ({ mentorId, onBack }) => {
  const [mentor, setMentor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data'dan mentor'u bul
    const foundMentor = mockMentors.find(m => m.id === mentorId);
    setMentor(foundMentor || null);
    setLoading(false);
  }, [mentorId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Mentor Bulunamadı</h2>
          <button onClick={onBack} className="text-blue-700 hover:text-blue-800">
            Geri dön
          </button>
        </div>
      </div>
    );
  }

  const isCorporate = !!mentor.company;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header - LinkedIn Style */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="py-4">
            <BackButton fallback="mentors" onBack={onBack} />
          </div>

          {/* Profile Header */}
          <div className="pb-6">
            <div className="flex items-start gap-6">
                {/* Avatar */}
                  <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-700 to-blue-900 rounded-lg flex items-center justify-center text-white font-bold text-4xl">
                  {mentor.name?.charAt(0) || 'M'}
                </div>
                    {mentor.isVerified && (
                  <div className="absolute -bottom-2 -right-2 bg-blue-700 rounded-full p-2">
                    <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1">
                <div className="flex items-start justify-between">
                        <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-slate-900">{mentor.name}</h1>
                      {isCorporate && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full flex items-center gap-1">
                          <Building className="w-3 h-3" />
                          Kurumsal
                        </span>
                      )}
                    </div>
                    <p className="text-xl text-slate-700 mb-3">{mentor.title}</p>
                    
                    {isCorporate && mentor.company && (
                      <div className="flex items-center gap-2 text-slate-600 mb-3">
                        <Building className="w-4 h-4" />
                        <span className="font-medium">{mentor.company}</span>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                      {mentor.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{mentor.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                        <span>{mentor.yearsOfExperience || 5}+ yıl deneyim</span>
                        </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{mentor.rating || 5.0}</span>
                        <span className="text-slate-500">({mentor.totalReviews || 0} değerlendirme)</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button className="p-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                      <Bookmark className="w-5 h-5 text-slate-600" />
                    </button>
                    <button className="p-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                      <MessageSquare className="w-5 h-5 text-slate-600" />
                    </button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-slate-900">{mentor.totalReviews || 0}</div>
                    <div className="text-sm text-slate-600">Değerlendirme</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-slate-900">{mentor.completedSessions || 0}</div>
                    <div className="text-sm text-slate-600">Tamamlanan Seans</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-slate-900">%95</div>
                    <div className="text-sm text-slate-600">Yanıt Oranı</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
                    </div>
                  </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Hakkında</h2>
              <p className="text-slate-700 leading-relaxed">
                {mentor.bio || 'Mentor hakkında bilgi mevcut değil.'}
              </p>
                  </div>

            {/* Expertise Areas */}
            {mentor.expertiseAreas && mentor.expertiseAreas.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Uzmanlık Alanları</h2>
                      <div className="flex flex-wrap gap-2">
                  {mentor.expertiseAreas.map((area: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-200"
                    >
                      {area}
                          </span>
                        ))}
                      </div>
                    </div>
            )}

            {/* Experience & Achievements */}
            {mentor.achievements && mentor.achievements.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Deneyim & Başarılar</h2>
                <div className="space-y-4">
                  {mentor.achievements.map((achievement: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Award className="w-5 h-5 text-blue-700" />
                      </div>
                      <div>
                        <p className="text-slate-700">{achievement}</p>
                      </div>
                    </div>
                  ))}
                </div>
                </div>
              )}

            {/* Reviews */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Değerlendirmeler</h2>
              <div className="space-y-4">
                {[1, 2].map((idx) => (
                  <div key={idx} className="border-b border-slate-200 last:border-0 pb-4 last:pb-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < 5 ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`}
                          />
                        ))}
                      </div>
                      <span className="font-medium text-slate-900">İsimsiz Kullanıcı</span>
                      <span className="text-xs text-slate-500">2 hafta önce</span>
                    </div>
                    <p className="text-sm text-slate-700">
                      Harika bir mentorluk deneyimiydi. Çok faydalı tavsiyelerde bulundu.
                    </p>
                  </div>
                ))}
                </div>
            </div>
            </div>

          {/* Right Sidebar - Booking & Info */}
            <div className="space-y-6">
            {/* Pricing & CTA */}
            <div className="bg-white rounded-xl border-2 border-blue-700 p-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-slate-900 mb-1">
                  {mentor.hourlyRate}₺
                </div>
                <div className="text-sm text-slate-600">seans başına</div>
              </div>

              <button className="w-full py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors mb-3">
                <Calendar className="w-5 h-5 inline mr-2" />
                Seans Al
              </button>

              <button className="w-full py-3 border-2 border-blue-700 text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors">
                <MessageSquare className="w-5 h-5 inline mr-2" />
                Mesaj Gönder
                  </button>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center gap-2 text-slate-700">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Ortalama yanıt süresi: 2 saat</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>İlk uygun seans: Yarın</span>
                </div>
                </div>
              </div>

            {/* Languages */}
            {mentor.languages && mentor.languages.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Languages className="w-5 h-5 text-slate-600" />
                  Diller
                </h3>
                <div className="space-y-2">
                  {mentor.languages.map((lang: string, idx: number) => (
                    <div key={idx} className="text-sm text-slate-700">
                      • {lang}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Availability */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-600" />
                Uygunluk
              </h3>
              <div className="space-y-2 text-sm text-slate-700">
                <div>Pazartesi - Cuma: 18:00 - 22:00</div>
                <div>Cumartesi: 10:00 - 16:00</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDetailPage;
