// Vite için API Route - Mentees
import { supabase } from '../../supabase';

export async function GET() {
  try {
    console.log('🔍 Fetching mentees from Supabase...');
    
    const { data: mentees, error } = await supabase
      .from('mentees')
      .select(`
        *,
        app_users!inner(email, full_name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Supabase error:', error);
      return {
        success: false,
        error: 'Failed to fetch mentees',
        details: error.message
      };
    }

    console.log('✅ Mentees fetched:', mentees?.length || 0);
    
    return {
      success: true,
      data: mentees || [],
      count: mentees?.length || 0
    };
  } catch (error: any) {
    console.error('❌ API error:', error);
    return {
      success: false,
      error: 'Internal server error',
      details: error.message
    };
  }
}

export async function POST(data: any) {
  try {
    console.log('🚀 Creating mentee...', data);

    // 1. Kullanıcı oluştur
    const { data: userData, error: userError } = await supabase
      .from('app_users')
      .insert({
        email: data.email,
        full_name: data.fullName,
        role: 'mentee',
        password_hash: data.password // TODO: Hash password
      })
      .select('id')
      .single();

    if (userError) {
      throw new Error(`User creation failed: ${userError.message}`);
    }

    // 2. Mentee profilini oluştur
    const { data: menteeData, error: menteeError } = await supabase
      .from('mentees')
      .insert({
        user_id: userData.id,
        short_goal: data.shortGoal,
        target_track: data.targetTrack,
        budget: data.budget,
        time_preference: data.timePref,
        city: data.city || null,
        country: data.country || 'Turkey',
        goal_type: data.goalType || null,
        service_focus: data.targetTrack
      })
      .select('user_id')
      .single();

    if (menteeError) {
      throw new Error(`Mentee creation failed: ${menteeError.message}`);
    }

    // 3. İlgi alanları (interests)
    if (data.interests && data.interests.length > 0) {
      const interestsData = data.interests.map((interest: string) => ({
        user_id: userData.id,
        interest: interest
      }));
      
      const { error: interestsError } = await supabase
        .from('mentee_interests')
        .insert(interestsData);

      if (interestsError) {
        console.warn('Interests insertion failed:', interestsError.message);
      }
    }

    // 4. Öncelikler (priorities)
    if (data.priorities && data.priorities.length > 0) {
      const prioritiesData = data.priorities.map((priority: string) => ({
        user_id: userData.id,
        priority: priority
      }));
      
      const { error: prioritiesError } = await supabase
        .from('mentee_priorities')
        .insert(prioritiesData);

      if (prioritiesError) {
        console.warn('Priorities insertion failed:', prioritiesError.message);
      }
    }

    // 5. Diller
    if (data.languages && data.languages.length > 0) {
      const languagesData = data.languages.map((lang: string) => ({
        user_id: userData.id,
        lang_code: lang
      }));
      
      const { error: languagesError } = await supabase
        .from('mentee_languages')
        .insert(languagesData);

      if (languagesError) {
        console.warn('Languages insertion failed:', languagesError.message);
      }
    }

    // 6. KVKK onayı
    const { error: consentError } = await supabase
      .from('user_consents')
      .insert({
        user_id: userData.id,
        kvkk_accepted_at: new Date().toISOString(),
        kvkk_version: 'v1.0-tr-2025-10-10',
        ip_address: null,
        marketing_opt_in: false
      });

    if (consentError) {
      console.warn('Consent insertion failed:', consentError.message);
    }

    console.log('✅ Mentee created successfully:', userData.id);

    return {
      success: true,
      data: {
        userId: userData.id,
        menteeId: menteeData.user_id
      },
      message: 'Mentee created successfully'
    };
  } catch (error: any) {
    console.error('❌ Error creating mentee:', error);
    return {
      success: false,
      error: 'Failed to create mentee',
      details: error.message
    };
  }
}

