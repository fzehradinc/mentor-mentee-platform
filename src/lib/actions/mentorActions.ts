// Mock API ile mentor kayıt fonksiyonu (geçici)
import { mockApi } from '../api/mockApi';

export interface MentorRegistrationData {
  mode: 'individual' | 'corporate';
  displayName: string;
  email: string;
  password: string;
  title: string;
  yearsExperience: number;
  hourlyRate: number;
  meetingPreference: 'platform_internal' | 'zoom' | 'google_meet' | 'flexible';
  bioShort: string;
  bioLong: string;
  city?: string;
  country?: string;
  languages: string[];
  categories: string[];
  skills: string;
  kvkk: true;
  // Corporate only
  companyName?: string;
  companyWebsite?: string;
  companyTaxId?: string;
  workEmail?: string;
  roleTitle?: string;
}

export async function registerMentor(data: MentorRegistrationData) {
  try {
    console.log('🚀 Mentor kaydı başlatılıyor...', data);

    // Mock API ile mentor kayıt (geçici)
    const result = await mockApi.mentors.POST({
      email: data.email,
      displayName: data.displayName,
      mode: data.mode,
      title: data.title,
      yearsExperience: data.yearsExperience,
      hourlyRate: data.hourlyRate,
      meetingPreference: data.meetingPreference,
      bioShort: data.bioShort,
      bioLong: data.bioLong,
      city: data.city,
      country: data.country || 'Turkey',
      languages: data.languages,
      categories: data.categories,
      skills: data.skills,
      password: data.password
    });

    if (!result.success) {
      throw new Error(result.error || 'Mentor registration failed');
    }

    console.log('✅ Mentor kaydı başarılı:', result.data);

    return { 
      success: true, 
      userId: result.data.userId,
      user: {
        id: result.data.userId,
        email: data.email,
        fullName: data.displayName,
        role: 'mentor'
      }
    };
  } catch (error: any) {
    console.error('❌ Mentor kayıt hatası:', error);
    throw new Error(error.message || 'Kayıt işlemi sırasında bir hata oluştu');
  }
}

