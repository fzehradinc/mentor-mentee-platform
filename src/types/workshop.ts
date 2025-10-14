export type WorkshopCategory = 
  | 'yazilim' | 'veri_ai' | 'urun' | 'tasarim_ux' | 'pazarlama'
  | 'satis_bd' | 'finans_yatirim' | 'girisim' | 'kariyer_liderlik'
  | 'akademik' | 'verimlilik' | 'yurtdisi_dil';

export type WorkshopLevel = 'beginner' | 'intermediate' | 'advanced';
export type WorkshopMode = 'online' | 'offline' | 'hybrid';
export type WorkshopStatus = 'draft' | 'published' | 'completed' | 'canceled';

export interface Workshop {
  id: string;
  title: string;
  slug: string;
  cover_image?: string;
  short_desc: string;
  full_desc?: string;
  category: WorkshopCategory;
  level: WorkshopLevel;
  mode: WorkshopMode;
  price_cents?: number;
  currency: string;
  capacity?: number;
  status: WorkshopStatus;
  next_session_at?: string;
  total_sessions?: number;
  avg_rating?: number;
  total_reviews?: number;
  total_registrations?: number;
  instructors?: WorkshopInstructor[];
  created_at: string;
}

export interface WorkshopSession {
  id: string;
  workshop_id: string;
  starts_at: string;
  ends_at: string;
  location?: string;
  created_at: string;
}

export interface WorkshopInstructor {
  id: string;
  name: string;
  bio?: string;
}

export interface WorkshopRequest {
  id?: string;
  workshop_id: string;
  requester_id?: string;
  requester_email: string;
  requester_name: string;
  preferred_times: string[];
  message?: string;
  participant_type?: 'student' | 'professional' | 'corporate';
  status?: 'pending' | 'accepted' | 'rejected' | 'contacted';
}

export interface WorkshopFilters {
  category?: WorkshopCategory;
  level?: WorkshopLevel;
  mode?: WorkshopMode;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

// Label mappings
export const CATEGORY_LABELS: Record<WorkshopCategory, string> = {
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

export const LEVEL_LABELS: Record<WorkshopLevel, string> = {
  beginner: 'Başlangıç',
  intermediate: 'Orta',
  advanced: 'İleri'
};

export const MODE_LABELS: Record<WorkshopMode, string> = {
  online: 'Çevrimiçi',
  offline: 'Yüz yüze',
  hybrid: 'Hibrit'
};


