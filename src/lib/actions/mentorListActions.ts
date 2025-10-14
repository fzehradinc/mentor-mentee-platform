import { MockDatabase } from '../mockDatabase';
import { mockMentors } from '../../data/mockData';
import { supabase } from '../supabase';

const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  return url && !url.includes('your-project');
};

/**
 * Get all mentors - combines registered users (MockDB) + mock data
 */
export async function getAllMentors() {
  if (!isSupabaseConfigured()) {
    // Mock mode - MockDB'den kayıtlı mentorları + mockMentors'ı birleştir
    const allUsers = MockDatabase.getAllUsers();
    const registeredMentors = allUsers.filter(u => u.role === 'mentor');

    // Kayıtlı mentorları transform et
    const transformedRegistered = registeredMentors.map((user, idx) => {
      const mentorData = user.mentorData || {};
      
      return {
        id: user.id,
        name: user.fullName,
        country: 'TR',
        title: mentorData.title || 'Mentor',
        bio: mentorData.bioShort || mentorData.bioLong || 'Deneyimli mentor ile gelişim yolculuğunuza başlayın.',
        tags: mentorData.categories || mentorData.skills?.split(',').map((s: string) => s.trim()) || [],
        rating: 5.0,
        sessions: 0, // Yeni kayıtlı mentorlar için
        attendance: 100,
        price: mentorData.hourlyRate || 500,
        badges: ['Yeni', 'Eğitim Uzmanı'],
        spots: undefined,
        avatar: `https://i.pravatar.cc/160?img=${idx + 20}`,
        company: mentorData.companyName || undefined,
        email: user.email,
        isRegistered: true, // Gerçek kayıt
        yearsOfExperience: mentorData.yearsExperience || 0,
        languages: mentorData.languages || ['tr']
      };
    });

    // mockMentors'ı da transform et
    const transformedMock = mockMentors.map((m, i) => ({
      id: m.id,
      name: m.name,
      country: 'TR',
      title: m.title || 'Mentor',
      bio: m.bio || 'Deneyimli mentor ile gelişim yolculuğunuza başlayın.',
      tags: m.expertiseAreas || [],
      rating: m.rating || 4.8,
      sessions: m.completedSessions || 120,
      attendance: 95,
      price: m.hourlyRate || 500,
      badges: m.isVerified ? ['Top Mentor', 'Eğitim Uzmanı'] : ['Eğitim Uzmanı'],
      spots: i % 4 === 0 ? 2 : undefined,
      avatar: `https://i.pravatar.cc/160?img=${i + 5}`,
      company: m.company,
      email: undefined,
      isRegistered: false, // Mock data
      yearsOfExperience: m.yearsOfExperience || 5,
      languages: m.languages || ['tr']
    }));

    // Kayıtlı mentorları en başa koy
    return [...transformedRegistered, ...transformedMock];
  }

  // Real Supabase mode
  const { data, error } = await supabase
    .from('mentors')
    .select(`
      *,
      app_users!inner(email, full_name)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Get mentors error:', error);
    return [];
  }

  return data || [];
}

