// Vite için API Service Layer
// Next.js API routes yerine direct Supabase/Prisma calls

import { supabase } from '../supabase';
import { prisma } from '../prisma';

export class ApiService {
  // ========================
  // MENTORS API
  // ========================

  static async getMentors(search?: string) {
    try {
      console.log('🔍 Fetching mentors...', { search });

      // Prisma ile mentor listesi
      const mentors = await prisma.mentor.findMany({
        where: search
          ? {
              OR: [
                { display_name: { contains: search, mode: 'insensitive' } },
                { title: { contains: search, mode: 'insensitive' } },
                { bio_short: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {},
        include: {
          user: {
            select: {
              email: true,
              full_name: true,
            },
          },
          mentor_languages: true,
          mentor_categories: true,
          mentor_skills: true,
        },
        orderBy: { created_at: 'desc' },
      });

      console.log('✅ Mentors fetched:', mentors.length);

      return {
        success: true,
        data: mentors,
        count: mentors.length,
      };
    } catch (error: any) {
      console.error('❌ Error fetching mentors:', error);
      throw new Error(`Failed to fetch mentors: ${error.message}`);
    }
  }

  static async getMentorById(id: string) {
    try {
      console.log('🔍 Fetching mentor by ID:', id);

      const mentor = await prisma.mentor.findUnique({
        where: { user_id: id },
        include: {
          user: {
            select: {
              email: true,
              full_name: true,
            },
          },
          mentor_languages: true,
          mentor_categories: true,
          mentor_skills: true,
        },
      });

      if (!mentor) {
        throw new Error(`Mentor not found: ${id}`);
      }

      console.log('✅ Mentor fetched:', mentor.user_id);

      return {
        success: true,
        data: mentor,
      };
    } catch (error: any) {
      console.error('❌ Error fetching mentor:', error);
      throw new Error(`Failed to fetch mentor: ${error.message}`);
    }
  }

  static async createMentor(data: any) {
    try {
      console.log('🚀 Creating mentor...', data);

      // Validate required fields
      if (!data.userId || !data.displayName) {
        throw new Error('userId and displayName are required');
      }

      // Prisma transaction ile mentor oluştur
      const result = await prisma.$transaction(async (tx) => {
        // 1. Kullanıcı oluştur (eğer yoksa)
        let user = await tx.user.findUnique({
          where: { id: data.userId },
        });

        if (!user) {
          user = await tx.user.create({
            data: {
              id: data.userId,
              email: data.email || `mentor-${data.userId}@example.com`,
              full_name: data.displayName,
              role: 'mentor',
              password_hash: 'temp_password', // TODO: Hash password
            },
          });
        }

        // 2. Mentor profilini oluştur
        const mentor = await tx.mentor.create({
          data: {
            user_id: user.id,
            mentor_type: data.mentorType || 'individual',
            display_name: data.displayName,
            title: data.title || '',
            years_experience: data.experienceYears || 0,
            hourly_rate_cents: Math.round((data.sessionFeeTRY || 0) * 100),
            meeting_preference: data.meetingPreference || 'platform_internal',
            bio_short: data.bioShort || '',
            bio_long: data.bioLong || '',
            city: data.city || null,
            country: data.country || 'Turkey',
            status: 'pending_verification',
          },
        });

        // 3. Diller ekle
        if (data.languages && data.languages.length > 0) {
          await tx.mentorLanguage.createMany({
            data: data.languages.map((lang: string) => ({
              user_id: user.id,
              lang_code: lang,
            })),
            skipDuplicates: true,
          });
        }

        // 4. Kategoriler ekle
        if (data.categories && data.categories.length > 0) {
          await tx.mentorCategory.createMany({
            data: data.categories.map((category: string) => ({
              user_id: user.id,
              category: category,
            })),
            skipDuplicates: true,
          });
        }

        // 5. Beceriler ekle
        if (data.skills && data.skills.length > 0) {
          await tx.mentorSkill.createMany({
            data: data.skills.map((skill: string) => ({
              user_id: user.id,
              skill: skill,
            })),
            skipDuplicates: true,
          });
        }

        return { user, mentor };
      });

      console.log('✅ Mentor created:', result.mentor.user_id);

      return {
        success: true,
        data: result.mentor,
        message: 'Mentor profile created successfully',
      };
    } catch (error: any) {
      console.error('❌ Error creating mentor:', error);
      throw new Error(`Failed to create mentor: ${error.message}`);
    }
  }

  static async updateMentor(id: string, data: any) {
    try {
      console.log('🔄 Updating mentor:', id, data);

      const mentor = await prisma.mentor.findUnique({
        where: { user_id: id },
      });

      if (!mentor) {
        throw new Error(`Mentor not found: ${id}`);
      }

      const updated = await prisma.mentor.update({
        where: { user_id: id },
        data: {
          display_name: data.displayName || undefined,
          title: data.title || undefined,
          years_experience: data.experienceYears || undefined,
          hourly_rate_cents: data.sessionFeeTRY ? Math.round(data.sessionFeeTRY * 100) : undefined,
          meeting_preference: data.meetingPreference || undefined,
          bio_short: data.bioShort || undefined,
          bio_long: data.bioLong || undefined,
          city: data.city || undefined,
          country: data.country || undefined,
          status: data.status || undefined,
        },
        include: {
          user: {
            select: {
              email: true,
              full_name: true,
            },
          },
          mentor_languages: true,
          mentor_categories: true,
          mentor_skills: true,
        },
      });

      console.log('✅ Mentor updated:', updated.user_id);

      return {
        success: true,
        data: updated,
        message: 'Mentor updated successfully',
      };
    } catch (error: any) {
      console.error('❌ Error updating mentor:', error);
      throw new Error(`Failed to update mentor: ${error.message}`);
    }
  }

  static async deleteMentor(id: string) {
    try {
      console.log('🗑️ Deleting mentor:', id);

      const mentor = await prisma.mentor.findUnique({
        where: { user_id: id },
      });

      if (!mentor) {
        throw new Error(`Mentor not found: ${id}`);
      }

      await prisma.mentor.delete({
        where: { user_id: id },
      });

      console.log('✅ Mentor deleted:', id);

      return {
        success: true,
        message: 'Mentor deleted successfully',
      };
    } catch (error: any) {
      console.error('❌ Error deleting mentor:', error);
      throw new Error(`Failed to delete mentor: ${error.message}`);
    }
  }

  // ========================
  // MENTEES API
  // ========================

  static async getMentees() {
    try {
      console.log('🔍 Fetching mentees...');

      const mentees = await prisma.mentee.findMany({
        include: {
          user: {
            select: {
              email: true,
              full_name: true,
            },
          },
          mentee_languages: true,
          mentee_interests: true,
          mentee_priorities: true,
        },
        orderBy: { created_at: 'desc' },
      });

      console.log('✅ Mentees fetched:', mentees.length);

      return {
        success: true,
        data: mentees,
        count: mentees.length,
      };
    } catch (error: any) {
      console.error('❌ Error fetching mentees:', error);
      throw new Error(`Failed to fetch mentees: ${error.message}`);
    }
  }

  // ========================
  // USERS API
  // ========================

  static async getUsers() {
    try {
      console.log('🔍 Fetching users...');

      const users = await prisma.user.findMany({
        include: {
          mentor_profile: {
            include: {
              mentor_languages: true,
              mentor_categories: true,
              mentor_skills: true,
            },
          },
          mentee_profile: {
            include: {
              mentee_languages: true,
              mentee_interests: true,
              mentee_priorities: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
      });

      console.log('✅ Users fetched:', users.length);

      return {
        success: true,
        data: users,
        count: users.length,
      };
    } catch (error: any) {
      console.error('❌ Error fetching users:', error);
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  }

  // ========================
  // HEALTH CHECK
  // ========================

  static async healthCheck() {
    try {
      // Test database connection
      const result = await prisma.$queryRawUnsafe('SELECT NOW() as timestamp');
      
      return {
        success: true,
        message: 'API Service is healthy',
        timestamp: result,
        database: 'connected',
      };
    } catch (error: any) {
      console.error('❌ Health check failed:', error);
      return {
        success: false,
        message: 'API Service is unhealthy',
        error: error.message,
        database: 'disconnected',
      };
    }
  }
}

// Export default instance
export default ApiService;
