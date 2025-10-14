import { Mentor, Mentee, Appointment, Review } from '../types';

export const mockMentors: Mentor[] = [
  {
    id: '1',
    name: 'Fatma Yıldız',
    email: 'fatma@example.com',
    role: 'mentor',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
    title: 'Elektronik Mühendisi',
    company: 'ASELSAN',
    education: 'Bilkent Üniversitesi',
    degree: 'YL Mezunu',
    expertiseAreas: ['Elektronik Mühendisliği', 'STEM', 'Kariyer Gelişimi', 'Kadın Liderlik'],
    available: true,
    profileUrl: '/mentors/fatma-yildiz',
    imageUrl: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'ASELSAN\'da elektronik mühendisi olarak çalışıyorum. Kadın mühendislerin sektörde daha fazla yer alması için mentörlük yapıyorum.',
    experience: 8,
    languages: ['Türkçe', 'İngilizce'],
    location: 'Ankara, Türkiye',
    rating: 4.9,
    totalReviews: 48,
    hourlyRate: 150,
    socialLinks: {
      linkedin: 'https://linkedin.com/in/fatmayildiz'
    },
    availableSlots: [
      {
        id: 'slot1',
        date: '2025-01-15',
        startTime: '10:00',
        endTime: '11:00',
        isAvailable: true
      }
    ],
    isVerified: true,
    createdAt: '2024-01-01T00:00:00Z',
    countryCode: 'tr',
    statusBadge: 'Available ASAP',
    sessions: 210,
    experienceYears: 8,
    attendance: 99,
    endTime: '18:00',
    isAvailable: true,
    yearsOfExperience: 8,
    interestTags: ['STEM', 'Kadın Mentör', 'Mühendislik'],
    isVolunteer: false,
    position: 'Elektronik Mühendisi',
    sector: 'Savunma Sanayi',
    university: 'Bilkent Üniversitesi',
    achievements: [
      'ASELSAN\'da 8 yıl deneyim',
      'Kadın mühendisler için mentörlük programı başlattı',
      '30+ öğrenciye kariyer rehberliği'
    ]
  },
  {
    id: '2',
    name: 'Ahmet Kaya',
    email: 'ahmet@example.com',
    role: 'mentor',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    title: 'Veri Bilimci',
    company: 'Trendyol',
    education: 'Boğaziçi Üniversitesi',
    degree: 'Doktora Mezunu',
    expertiseAreas: ['Veri Bilimi', 'Machine Learning', 'Python', 'Kariyer Geçişi'],
    available: true,
    profileUrl: '/mentors/ahmet-kaya',
    imageUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Trendyol\'da Senior Veri Bilimci olarak çalışıyorum. Akademik geçmişimle sektör deneyimimi birleştirerek mentörlük yapıyorum.',
    experience: 7,
    languages: ['Türkçe', 'İngilizce'],
    location: 'İstanbul, Türkiye',
    rating: 4.8,
    totalReviews: 67,
    hourlyRate: 200,
    socialLinks: {
      linkedin: 'https://linkedin.com/in/ahmetkaya'
    },
    availableSlots: [
      {
        id: 'slot3',
        date: '2025-01-16',
        startTime: '09:00',
        endTime: '10:00',
        isAvailable: true
      }
    ],
    isVerified: true,
    createdAt: '2024-02-01T00:00:00Z',
    countryCode: 'tr',
    statusBadge: 'Top rated',
    sessions: 156,
    experienceYears: 7,
    attendance: 95,
    endTime: '17:00',
    isAvailable: true,
    yearsOfExperience: 7,
    interestTags: ['Veri Bilimi', 'Machine Learning', 'E-ticaret'],
    isVolunteer: false,
    position: 'Senior Veri Bilimci',
    sector: 'E-ticaret',
    university: 'Boğaziçi Üniversitesi',
    achievements: [
      'Trendyol\'da ML modelleri geliştirdi',
      '30+ kişiye veri bilimi mentörlüğü',
      'Akademik ve sektör deneyimi birleştirdi'
    ]
  }
];

export const mockMentees: Mentee[] = [
  {
    id: '1',
    name: 'Alex Thompson',
    email: 'alex@example.com',
    role: 'mentee',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Junior developer looking to advance my career',
    interests: ['React', 'Career Development'],
    goals: ['Kariyer Geçişi', 'Teknik Liderlik', 'Yurt Dışı Kariyer'],
    createdAt: '2024-06-01T00:00:00Z'
  }
];

export const mockAppointments: Appointment[] = [];
export const mockReviews: Review[] = [];

export const expertiseOptions = [
  'Elektronik Mühendisliği', 'Veri Bilimi', 'UX Design', 'Girişimcilik',
  'Akademik Kariyer', 'Backend Development', 'STEM', 'Machine Learning',
  'Yazılım Geliştirme', 'Tasarım', 'Liderlik', 'Kariyer Gelişimi',
  'Yurt Dışı Eğitim', 'Startup', 'Teknoloji'
];

export const languageOptions = [
  'Türkçe', 'İngilizce', 'Almanca', 'Fransızca', 'İspanyolca',
  'İtalyanca', 'Rusça', 'Arapça'
];

export const locationOptions = [
  'İstanbul, Türkiye', 'Ankara, Türkiye', 'İzmir, Türkiye', 'Bursa, Türkiye',
  'Antalya, Türkiye', 'Adana, Türkiye', 'Konya, Türkiye', 'Gaziantep, Türkiye',
  'Uzaktan', 'Yurt Dışı'
];

// Eksik export'ları ekleyelim
export const mockMessages: any[] = [];
export const mockNotifications: any[] = [];