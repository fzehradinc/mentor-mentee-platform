export interface User {
  id: string;
  name: string;
  email: string;
  role: 'mentor' | 'mentee';
  avatar?: string;
  bio?: string;
  createdAt: string;
}

export interface Mentee extends User {
  role: 'mentee';
  interests: string[];
  goals: string[];
}

export interface Mentor extends User {
  role: 'mentor';
  title: string;
  company: string;
  education: string;
  degree: string;
  university: string;
  position: string;
  sector: string;
  yearsOfExperience: number;
  interestTags: string[];
  isVolunteer: boolean;
  hourlyRate?: number;
  available: boolean;
  expertiseAreas: string[];
  experience: number;
  languages: string[];
  location: string;
  rating: number;
  totalReviews: number;
  profileUrl: string;
  imageUrl: string;
  achievements: string[];
  countryCode: string;
  statusBadge: 'Available ASAP' | 'Advance' | 'Top rated';
  sessions: number;
  experienceYears: number;
  attendance: number;
  socialLinks: {
    linkedin?: string;
    github?: string;
    website?: string;
  };
  availableSlots: TimeSlot[];
  isVerified: boolean;
  endTime: string;
  isAvailable: boolean;
  
  // Bimentör Facet Sistemi
  facets?: {
    goals?: string[];           // Hedefler (kariyer-gecis, ms-phd-basvuru vb.)
    domains?: string[];         // Alan/Disiplin
    companies?: string[];       // Deneyimli olduğu şirketler
    positions?: string[];       // Pozisyon/fonksiyon
    interviews?: string[];      // Mülakat tipleri
    locations?: string[];       // Lokasyon/saat dilimi
    languages?: string[];       // Konuşulan diller
    universities?: string[];    // Üniversite
    techStack?: string[];       // Teknik yetenekler
    mentoringStyle?: string[];  // Mentorluk stili
  };
  
  // Rozet sistemi
  badges?: string[];            // top-mentor, verified, kurumsal-deneyim vb.
  
  // Başarı metrikleri
  successMetrics?: {
    placements?: string[];      // Yerleştirdiği şirketler (deloitte, google vb.)
    acceptances?: number;       // Kabul sayıları
    awards?: string[];          // Ödüller/patentler
  };
  
  // Uygunluk
  availability?: {
    is48hAvailable?: boolean;   // 48 saat içinde uygun mu
    weeknights?: boolean;       // Hafta içi akşam
    weekendOnly?: boolean;      // Sadece hafta sonu
    flexCancellation?: boolean; // Esnek iptal
  };
  
  // Fiyatlandırma detayları
  pricing?: {
    currency?: string;
    packageOptions?: {
      calls?: string;           // "2 calls/month (35min each)"
      qa?: string;              // "Unlimited Q&A via chat"
      response?: string;        // "Responds within 24h"
      support?: string;         // "Hands-on support"
    };
  };
}

export interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface Appointment {
  id: string;
  mentorId: string;
  menteeId: string;
  dateTime: string;
  topic?: string;
  platform?: string;
  meetingLink?: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  mentorId: string;
  menteeId: string;
  appointmentId: string;
  rating: number;
  comment: string;
  criteria?: Record<string, number>;
  createdAt: string;
  mentorName: string;
  menteeName: string;
}

export interface FilterOptions {
  expertiseAreas: string[];
  languages: string[];
  minExperience: number;
  maxExperience: number;
  location: string;
  minRating: number;
  priceRange: [number, number];
}

export type CategoryFilter = 
  | 'all'
  | 'new'
  | 'available-now'
  | 'academic'
  | 'data-science-software'
  | 'female'
  | 'entrepreneur'
  | 'international';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  type: 'text' | 'system';
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage: Message;
  unreadCount: number;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'appointment' | 'review' | 'message' | 'system';
  title: string;
  description: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  icon: string;
}