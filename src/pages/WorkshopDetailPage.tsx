"use client";
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Calendar, Clock, Users, MapPin, Star, 
  Award, CheckCircle, Video, MapPinned 
} from 'lucide-react';
import WorkshopRequestForm from '../components/workshop/WorkshopRequestForm';
import { 
  getWorkshopBySlug, 
  getWorkshopSessions,
  getWorkshopReviews,
  getWorkshops 
} from '../lib/actions/workshopActions';
import type { Workshop, WorkshopSession } from '../types/workshop';
import { CATEGORY_LABELS, LEVEL_LABELS, MODE_LABELS } from '../types/workshop';

interface WorkshopDetailPageProps {
  slug: string;
  onBack?: () => void;
}

export default function WorkshopDetailPage({ slug, onBack }: WorkshopDetailPageProps) {
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [sessions, setSessions] = useState<WorkshopSession[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [similarWorkshops, setSimilarWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);

  useEffect(() => {
    loadWorkshopData();
  }, [slug]);

  const loadWorkshopData = async () => {
    setLoading(true);
    try {
      const [workshopData, sessionsData, reviewsData] = await Promise.all([
        getWorkshopBySlug(slug),
        getWorkshopSessions(slug).catch(() => []),
        getWorkshopReviews(slug).catch(() => [])
      ]);

      if (workshopData) {
        setWorkshop(workshopData);
        setSessions(sessionsData);
        setReviews(reviewsData);

        // Load similar workshops (same category)
        const similar = await getWorkshops({ category: workshopData.category });
        setSimilarWorkshops(similar.filter(w => w.id !== workshopData.id).slice(0, 3));
      }
    } catch (error) {
      console.error('Load workshop error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!workshop) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Workshop Bulunamadı</h2>
          <button onClick={handleBack} className="text-blue-600 hover:text-blue-700">
            Geri dön
          </button>
        </div>
      </div>
    );
  }

  const availableSessionTimes = sessions.map(s => s.starts_at);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="relative h-80 bg-gradient-to-br from-green-500 via-purple-600 to-blue-600 overflow-hidden">
        {workshop.cover_image && (
          <img
            src={workshop.cover_image}
            alt={workshop.title}
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
        )}
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-12">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="absolute top-6 left-4 sm:left-6 lg:left-8 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Geri</span>
          </button>

          {/* Title & Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-sm font-medium text-gray-900 rounded-full">
              {CATEGORY_LABELS[workshop.category]}
            </span>
            <span className="px-3 py-1 bg-black/60 backdrop-blur-sm text-sm font-medium text-white rounded-full">
              {LEVEL_LABELS[workshop.level]}
            </span>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
              workshop.mode === 'online' 
                ? 'bg-green-100 text-green-800'
                : workshop.mode === 'offline'
                ? 'bg-orange-100 text-orange-800'
                : 'bg-purple-100 text-purple-800'
            }`}>
              {MODE_LABELS[workshop.mode]}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{workshop.title}</h1>
          
          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-white/90">
            {workshop.next_session_at && (
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{new Date(workshop.next_session_at).toLocaleDateString('tr-TR', {
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
            )}
            {workshop.total_sessions && workshop.total_sessions > 1 && (
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{workshop.total_sessions} oturum</span>
              </div>
            )}
            {workshop.avg_rating && (
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{workshop.avg_rating.toFixed(1)}</span>
                <span className="text-white/70">({workshop.total_reviews})</span>
              </div>
            )}
            {workshop.total_registrations && (
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>{workshop.total_registrations}+ katılımcı</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Workshop Hakkında</h2>
              <div className="prose prose-sm max-w-none text-gray-700">
                <p className="text-lg leading-relaxed">{workshop.full_desc || workshop.short_desc}</p>
              </div>
            </div>

            {/* Instructors */}
            {workshop.instructors && workshop.instructors.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Eğitmenler</h2>
                <div className="space-y-4">
                  {workshop.instructors.map((instructor: any) => (
                    <div key={instructor.id} className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-xl flex-shrink-0">
                        {instructor.name?.charAt(0) || 'E'}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{instructor.name}</h3>
                        {instructor.bio && (
                          <p className="text-sm text-gray-600 mt-1">{instructor.bio}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sessions */}
            {sessions.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Oturum Takvimi</h2>
                <div className="space-y-3">
                  {sessions.map((session) => (
                    <div key={session.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {new Date(session.starts_at).toLocaleDateString('tr-TR', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="text-sm text-gray-600">
                          {new Date(session.starts_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                          {' - '}
                          {new Date(session.ends_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      {session.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          {workshop.mode === 'online' ? (
                            <><Video className="w-4 h-4" /> Online</>
                          ) : (
                            <><MapPinned className="w-4 h-4" /> {session.location}</>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {reviews.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Katılımcı Yorumları</h2>
                <div className="space-y-4">
                  {reviews.map((review: any) => (
                    <div key={review.id} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating 
                                  ? 'fill-yellow-400 text-yellow-400' 
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-medium text-gray-900">{review.user?.full_name}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(review.created_at).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-gray-700">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price & CTA */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
              <div className="text-center mb-6">
                {workshop.price_cents ? (
                  <>
                    <div className="text-4xl font-bold text-gray-900 mb-1">
                      {(workshop.price_cents / 100).toFixed(0)}₺
                    </div>
                    <div className="text-sm text-gray-500">Workshop ücreti</div>
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold text-blue-600 mb-1">Talep Et</div>
                    <div className="text-sm text-gray-500">Size özel fiyat teklifi</div>
                  </>
                )}
              </div>

              <button
                onClick={() => setShowRequestForm(!showRequestForm)}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors mb-4"
              >
                {showRequestForm ? 'Formu Gizle' : 'Talep Gönder'}
              </button>

              {/* Quick Info */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-gray-700">
                  <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Kategori</div>
                    <div className="text-gray-600">{CATEGORY_LABELS[workshop.category]}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Award className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Seviye</div>
                    <div className="text-gray-600">{LEVEL_LABELS[workshop.level]}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Mod</div>
                    <div className="text-gray-600">{MODE_LABELS[workshop.mode]}</div>
                  </div>
                </div>
                {workshop.capacity && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Users className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Kapasite</div>
                      <div className="text-gray-600">{workshop.capacity} kişi</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-blue-900">
                    Talebinizi gönderdikten sonra, en geç 24 saat içinde size uygun saat önerileri paylaşacağız.
                  </div>
                </div>
              </div>
            </div>

            {/* Request Form (Collapsible) */}
            {showRequestForm && (
              <WorkshopRequestForm
                workshopId={workshop.id}
                workshopTitle={workshop.title}
                availableTimes={availableSessionTimes}
              />
            )}
          </div>
        </div>

        {/* Similar Workshops */}
        {similarWorkshops.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Benzer Workshop'lar</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {similarWorkshops.map((similar) => (
                <div 
                  key={similar.id} 
                  onClick={() => window.dispatchEvent(new CustomEvent('navigateTo', { detail: 'workshop-detail', slug: similar.slug }))}
                  className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">{similar.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{similar.short_desc}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-blue-600">Detayları Gör</span>
                    <ArrowRight className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

