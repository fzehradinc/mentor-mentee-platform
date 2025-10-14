// Mock API ile mentee kayıt fonksiyonu (geçici)
import { mockApi } from '../api/mockApi';

export interface MenteeRegistrationData {
  fullName: string;
  email: string;
  password: string;
  shortGoal: string;
  targetTrack: string;
  budget: '0_500' | '500_1000' | '1000_plus' | 'undecided';
  timePref: 'weekday_evening' | 'weekend' | 'flexible' | 'weekdays_day';
  city?: string;
  country?: string;
  languages: string[];
  kvkk: true;
  // New rich preferences
  interests: string[];
  goalType: string;
  priorities: string[];
}

export async function registerMentee(data: MenteeRegistrationData) {
  try {
    console.log('🚀 Mentee kaydı başlatılıyor...', data);

    // Mock API ile mentee kayıt (geçici)
    const result = await mockApi.mentees.POST({
      email: data.email,
      fullName: data.fullName,
      password: data.password,
      shortGoal: data.shortGoal,
      targetTrack: data.targetTrack,
      budget: data.budget,
      timePref: data.timePref,
      city: data.city,
      country: data.country || 'Turkey',
      goalType: data.goalType,
      languages: data.languages,
      interests: data.interests,
      priorities: data.priorities
    });

    if (!result.success) {
      throw new Error(result.error || 'Mentee registration failed');
    }

    console.log('✅ Mentee kaydı başarılı:', result.data);

    return { 
      success: true, 
      userId: result.data.userId,
      user: {
        id: result.data.userId,
        email: data.email,
        fullName: data.fullName,
        role: 'mentee'
      }
    };
  } catch (error: any) {
    console.error('❌ Mentee kayıt hatası:', error);
    throw new Error(error.message || 'Kayıt işlemi sırasında bir hata oluştu');
  }
}