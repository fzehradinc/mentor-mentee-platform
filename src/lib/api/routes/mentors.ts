// Vite için API Route - Mentors
import { NextResponse } from 'next/server';
import { supabase } from '../../supabase';

export async function GET() {
  try {
    console.log('🔍 Fetching mentors from Supabase...');
    
    const { data: mentors, error } = await supabase
      .from('mentors')
      .select(`
        *,
        app_users!inner(email, full_name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Supabase error:', error);
      return {
        success: false,
        error: 'Failed to fetch mentors',
        details: error.message
      };
    }

    console.log('✅ Mentors fetched:', mentors?.length || 0);
    
    return {
      success: true,
      data: mentors || [],
      count: mentors?.length || 0
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
    console.log('🚀 Creating mentor...', data);

    // 1. Kullanıcı oluştur
    const { data: userData, error: userError } = await supabase
      .from('app_users')
      .insert({
        email: data.email,
        full_name: data.displayName,
        role: 'mentor',
        password_hash: data.password // TODO: Hash password
      })
      .select('id')
      .single();

    if (userError) {
      throw new Error(`User creation failed: ${userError.message}`);
    }

    // 2. Mentor profilini oluştur
    const { data: mentorData, error: mentorError } = await supabase
      .from('mentors')
      .insert({
        user_id: userData.id,
        mentor_type: data.mode || 'individual',
        display_name: data.displayName,
        title: data.title,
        years_experience: data.yearsExperience || 0,
        hourly_rate_cents: Math.round((data.hourlyRate || 0) * 100),
        meeting_preference: data.meetingPreference || 'platform_internal',
        bio_short: data.bioShort || '',
        bio_long: data.bioLong || '',
        city: data.city || null,
        country: data.country || 'Turkey',
        status: 'pending_verification'
      })
      .select('user_id')
      .single();

    if (mentorError) {
      throw new Error(`Mentor creation failed: ${mentorError.message}`);
    }

    // 3. Diller ekle
    if (data.languages && data.languages.length > 0) {
      const languagesData = data.languages.map((lang: string) => ({
        user_id: userData.id,
        lang_code: lang
      }));
      
      const { error: languagesError } = await supabase
        .from('mentor_languages')
        .insert(languagesData);

      if (languagesError) {
        console.warn('Languages insertion failed:', languagesError.message);
      }
    }

    // 4. Kategoriler ekle
    if (data.categories && data.categories.length > 0) {
      const categoriesData = data.categories.map((category: string) => ({
        user_id: userData.id,
        category: category
      }));
      
      const { error: categoriesError } = await supabase
        .from('mentor_categories')
        .insert(categoriesData);

      if (categoriesError) {
        console.warn('Categories insertion failed:', categoriesError.message);
      }
    }

    // 5. Beceriler ekle
    if (data.skills) {
      const skillsArray = data.skills.split(',').map((s: string) => s.trim()).filter(Boolean);
      if (skillsArray.length > 0) {
        const skillsData = skillsArray.map((skill: string) => ({
          user_id: userData.id,
          skill: skill
        }));
        
        const { error: skillsError } = await supabase
          .from('mentor_skills')
          .insert(skillsData);

        if (skillsError) {
          console.warn('Skills insertion failed:', skillsError.message);
        }
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

    console.log('✅ Mentor created successfully:', userData.id);

    return {
      success: true,
      data: {
        userId: userData.id,
        mentorId: mentorData.user_id
      },
      message: 'Mentor created successfully'
    };
  } catch (error: any) {
    console.error('❌ Error creating mentor:', error);
    return {
      success: false,
      error: 'Failed to create mentor',
      details: error.message
    };
  }
}

