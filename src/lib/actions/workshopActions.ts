import { supabase } from '../supabase';
import { getCurrentUser } from '../auth/requireMentee';
import type { Workshop, WorkshopFilters, WorkshopRequest, WorkshopSession } from '../../types/workshop';

// ============================================
// GET WORKSHOPS (with filters)
// ============================================
export async function getWorkshops(filters?: WorkshopFilters): Promise<Workshop[]> {
  let query = supabase
    .from('workshops_public_v')
    .select('*')
    .eq('status', 'published');

  if (filters?.category) {
    query = query.eq('category', filters.category);
  }

  if (filters?.level) {
    query = query.eq('level', filters.level);
  }

  if (filters?.mode) {
    query = query.eq('mode', filters.mode);
  }

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,short_desc.ilike.%${filters.search}%`);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Get workshops error:', error);
    return [];
  }

  return data || [];
}

// ============================================
// GET WORKSHOP BY SLUG
// ============================================
export async function getWorkshopBySlug(slug: string): Promise<Workshop | null> {
  const { data, error } = await supabase
    .from('workshops_public_v')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Get workshop error:', error);
    return null;
  }

  return data;
}

// ============================================
// GET WORKSHOP SESSIONS
// ============================================
export async function getWorkshopSessions(workshopId: string): Promise<WorkshopSession[]> {
  const { data, error } = await supabase
    .from('workshop_sessions')
    .select('*')
    .eq('workshop_id', workshopId)
    .order('starts_at', { ascending: true });

  if (error) {
    console.error('Get sessions error:', error);
    return [];
  }

  return data || [];
}

// ============================================
// SUBMIT WORKSHOP REQUEST
// ============================================
export async function submitWorkshopRequest(request: WorkshopRequest): Promise<void> {
  const user = getCurrentUser();

  const { error } = await supabase
    .from('workshop_requests')
    .insert({
      workshop_id: request.workshop_id,
      requester_id: user?.id || null,
      requester_email: request.requester_email,
      requester_name: request.requester_name,
      preferred_times: request.preferred_times,
      message: request.message || null,
      participant_type: request.participant_type || 'professional',
      status: 'pending'
    });

  if (error) {
    console.error('Submit request error:', error);
    throw new Error('Talep gönderilemedi. Lütfen tekrar deneyin.');
  }
}

// ============================================
// GET POPULAR WORKSHOPS
// ============================================
export async function getPopularWorkshops(limit: number = 6): Promise<Workshop[]> {
  const { data, error } = await supabase
    .from('workshops_public_v')
    .select('*')
    .eq('status', 'published')
    .order('total_registrations', { ascending: false })
    .order('avg_rating', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Get popular workshops error:', error);
    return [];
  }

  return data || [];
}

// ============================================
// GET UPCOMING WORKSHOPS
// ============================================
export async function getUpcomingWorkshops(limit: number = 6): Promise<Workshop[]> {
  const { data, error } = await supabase
    .from('workshops_public_v')
    .select('*')
    .eq('status', 'published')
    .not('next_session_at', 'is', null)
    .order('next_session_at', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Get upcoming workshops error:', error);
    return [];
  }

  return data || [];
}

// ============================================
// GET RECOMMENDED WORKSHOPS (User-based)
// ============================================
export async function getRecommendedWorkshops(limit: number = 3): Promise<Workshop[]> {
  const user = getCurrentUser();
  if (!user) return [];

  const { data, error } = await supabase
    .rpc('get_recommended_workshops', {
      p_user_id: user.id,
      p_limit: limit
    });

  if (error) {
    console.error('Get recommended workshops error:', error);
    return [];
  }

  // Fetch full workshop details
  if (!data || data.length === 0) return [];

  const workshopIds = data.map((w: any) => w.workshop_id);
  const { data: workshops } = await supabase
    .from('workshops_public_v')
    .select('*')
    .in('id', workshopIds);

  return workshops || [];
}

// ============================================
// GET WORKSHOP REVIEWS
// ============================================
export async function getWorkshopReviews(workshopId: string) {
  const { data, error } = await supabase
    .from('workshop_reviews')
    .select(`
      id,
      rating,
      comment,
      created_at,
      user:app_users(full_name)
    `)
    .eq('workshop_id', workshopId)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Get reviews error:', error);
    return [];
  }

  return data || [];
}


