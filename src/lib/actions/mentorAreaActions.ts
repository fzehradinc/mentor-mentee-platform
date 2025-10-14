import { supabase } from '../supabase';
import { getCurrentUser } from '../auth/requireMentee';

// Helper
const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  return url && !url.includes('your-project');
};

// ============================================
// APPOINTMENTS
// ============================================

export async function getMentorAppointments(status?: string) {
  const user = getCurrentUser();
  if (!user || user.role !== 'mentor') throw new Error('Not a mentor');

  if (!isSupabaseConfigured()) {
    return [];
  }

  let query = supabase
    .from('mentor_appointments_v')
    .select('*')
    .eq('mentor_id', user.id);

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query.order('starts_at', { ascending: false });

  if (error) {
    console.error('Get appointments error:', error);
    return [];
  }

  return data || [];
}

export async function confirmBooking(bookingId: string) {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  if (!isSupabaseConfigured()) {
    console.warn('MOCK: confirmBooking');
    return;
  }

  const { error } = await supabase
    .from('bookings')
    .update({ status: 'confirmed' })
    .eq('id', bookingId)
    .eq('mentor_id', user.id);

  if (error) throw new Error('Randevu onaylanamadı');
}

export async function cancelBooking(bookingId: string) {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  if (!isSupabaseConfigured()) {
    console.warn('MOCK: cancelBooking');
    return;
  }

  const { error } = await supabase
    .from('bookings')
    .update({ status: 'canceled' })
    .eq('id', bookingId)
    .eq('mentor_id', user.id);

  if (error) throw new Error('Randevu iptal edilemedi');
}

// ============================================
// AVAILABILITY
// ============================================

export async function getAvailability() {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  if (!isSupabaseConfigured()) {
    return [];
  }

  const { data, error } = await supabase
    .from('mentor_availability')
    .select('*')
    .eq('mentor_id', user.id)
    .order('weekday', { ascending: true });

  if (error) {
    console.error('Get availability error:', error);
    return [];
  }

  return data || [];
}

export async function addAvailability(input: {
  weekday?: number;
  specificDate?: string;
  startsAt: string;
  endsAt: string;
  isRecurring: boolean;
}) {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  if (!isSupabaseConfigured()) {
    console.warn('MOCK: addAvailability');
    return;
  }

  const { error } = await supabase
    .from('mentor_availability')
    .insert({
      mentor_id: user.id,
      weekday: input.weekday || null,
      specific_date: input.specificDate || null,
      starts_at: input.startsAt,
      ends_at: input.endsAt,
      is_recurring: input.isRecurring
    });

  if (error) throw new Error('Uygunluk eklenemedi');
}

// ============================================
// SERVICES
// ============================================

export async function getServices() {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  if (!isSupabaseConfigured()) {
    return [];
  }

  const { data, error } = await supabase
    .from('mentor_services')
    .select('*')
    .eq('mentor_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Get services error:', error);
    return [];
  }

  return data || [];
}

export async function createService(input: {
  title: string;
  description?: string;
  durationMinutes: number;
  priceCents: number;
  firstSessionDiscountPercent?: number;
}) {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  if (!isSupabaseConfigured()) {
    console.warn('MOCK: createService');
    return;
  }

  const { error } = await supabase
    .from('mentor_services')
    .insert({
      mentor_id: user.id,
      title: input.title,
      description: input.description || null,
      duration_minutes: input.durationMinutes,
      price_cents: input.priceCents,
      first_session_discount_percent: input.firstSessionDiscountPercent || 0
    });

  if (error) throw new Error('Hizmet oluşturulamadı');
}

export async function deleteService(serviceId: string) {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  if (!isSupabaseConfigured()) {
    console.warn('MOCK: deleteService');
    return;
  }

  const { error } = await supabase
    .from('mentor_services')
    .delete()
    .eq('id', serviceId)
    .eq('mentor_id', user.id);

  if (error) throw new Error('Hizmet silinemedi');
}

export async function toggleService(serviceId: string, isActive: boolean) {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  if (!isSupabaseConfigured()) {
    console.warn('MOCK: toggleService');
    return;
  }

  const { error } = await supabase
    .from('mentor_services')
    .update({ is_active: isActive })
    .eq('id', serviceId)
    .eq('mentor_id', user.id);

  if (error) throw new Error('Hizmet güncellenemedi');
}

// ============================================
// EARNINGS
// ============================================

export async function getEarningsSummary() {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  if (!isSupabaseConfigured()) {
    return {
      total_earned_cents: 0,
      pending_cents: 0,
      completed_sessions: 0,
      upcoming_sessions: 0
    };
  }

  const { data, error } = await supabase
    .from('mentor_earnings_summary_v')
    .select('*')
    .eq('mentor_id', user.id)
    .single();

  if (error) {
    console.error('Get earnings error:', error);
    return {
      total_earned_cents: 0,
      pending_cents: 0,
      completed_sessions: 0,
      upcoming_sessions: 0
    };
  }

  return data || {};
}

export async function getPayouts() {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  if (!isSupabaseConfigured()) {
    return [];
  }

  const { data, error } = await supabase
    .from('mentor_payouts')
    .select('*')
    .eq('mentor_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Get payouts error:', error);
    return [];
  }

  return data || [];
}

// ============================================
// PROFILE
// ============================================

export async function getProfileCompletion() {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  if (!isSupabaseConfigured()) {
    return 0;
  }

  const { data, error } = await supabase
    .rpc('calculate_mentor_profile_completion', {
      p_mentor_id: user.id
    });

  if (error) {
    console.error('Get profile completion error:', error);
    return 0;
  }

  return data || 0;
}

export async function getMentorProfileDetailed() {
  const user = getCurrentUser();
  if (!user || user.role !== 'mentor') throw new Error('Not a mentor');

  if (!isSupabaseConfigured()) {
    // Mock mode - localStorage'dan al
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    const userData = JSON.parse(userStr);
    const mentorData = userData.mentorData || {};
    
    return {
      mentor: {
        id: user.id,
        user_id: user.id,
        headline: mentorData.title || '',
        company: mentorData.companyName || '',
        location: mentorData.city || '',
        languages: mentorData.languages || ['tr'],
        years_of_exp: mentorData.yearsExperience || 0,
        hourly_price: mentorData.hourlyRate || 500,
        rating: 5.0,
        review_count: 0,
        avatar_url: mentorData.avatarUrl || '',
        cover_url: mentorData.coverUrl || ''
      },
      profile: {
        mentor_id: user.id,
        short_bio: mentorData.bioShort || '',
        long_bio: mentorData.bioLong || '',
        specialties: mentorData.categories || [],
        skills: mentorData.skills?.split(',').map((s: string) => s.trim()) || [],
        services: [],
        availability_pref: [],
        meeting_pref: mentorData.meetingPreference ? [mentorData.meetingPreference] : []
      }
    };
  }

  // Real Supabase mode
  const { data: mentor } = await supabase
    .from('mentors')
    .select('*')
    .eq('user_id', user.id)
    .single();

  const { data: profile } = await supabase
    .from('mentor_profiles')
    .select('*')
    .eq('mentor_id', mentor?.id || '00000000-0000-0000-0000-000000000000')
    .single();

  return { mentor, profile };
}

export async function updateMentorProfile(formData: any) {
  const user = getCurrentUser();
  if (!user || user.role !== 'mentor') throw new Error('Not a mentor');

  if (!isSupabaseConfigured()) {
    // Mock mode - localStorage'ı güncelle
    const userStr = localStorage.getItem('user');
    if (!userStr) throw new Error('User not found');
    
    const userData = JSON.parse(userStr);
    
    const updatedData = {
      ...userData,
      fullName: formData.display_name || userData.fullName,
      mentorData: {
        ...userData.mentorData,
        title: formData.headline,
        companyName: formData.company,
        city: formData.location,
        languages: formData.languages,
        yearsExperience: formData.years_of_exp,
        hourlyRate: formData.hourly_price,
        bioShort: formData.short_bio,
        bioLong: formData.long_bio,
        categories: formData.specialties,
        skills: formData.skills?.join(', '),
        meetingPreference: formData.meeting_pref?.[0],
        avatarUrl: formData.avatar_url,
        coverUrl: formData.cover_url
      },
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem('user', JSON.stringify(updatedData));
    
    // Mock DB'yi de güncelle
    const usersKey = 'bimentor_mock_users';
    const allUsers = JSON.parse(localStorage.getItem(usersKey) || '[]');
    const userIndex = allUsers.findIndex((u: any) => u.id === user.id);
    
    if (userIndex !== -1) {
      allUsers[userIndex] = updatedData;
      localStorage.setItem(usersKey, JSON.stringify(allUsers));
    }
    
    return { ok: true };
  }

  // Real Supabase mode
  // Update mentors table
  const { data: mentor } = await supabase
    .from('mentors')
    .select('id')
    .eq('user_id', user.id)
    .single();

  const mentorPatch = {
    headline: formData.headline,
    company: formData.company,
    location: formData.location,
    languages: formData.languages,
    years_of_exp: formData.years_of_exp,
    hourly_price: formData.hourly_price,
    avatar_url: formData.avatar_url,
    cover_url: formData.cover_url,
    updated_at: new Date().toISOString()
  };

  await supabase
    .from('mentors')
    .update(mentorPatch)
    .eq('user_id', user.id);

  // Upsert mentor_profiles
  const profilePatch = {
    mentor_id: mentor?.id || user.id,
    short_bio: formData.short_bio,
    long_bio: formData.long_bio,
    specialties: formData.specialties,
    skills: formData.skills,
    services: formData.services || [],
    availability_pref: formData.availability_pref || [],
    meeting_pref: formData.meeting_pref || []
  };

  await supabase
    .from('mentor_profiles')
    .upsert(profilePatch, { onConflict: 'mentor_id' });

  return { ok: true };
}


