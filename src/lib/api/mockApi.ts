// Mock API for testing when Supabase is not configured
export const mockApi = {
  mentors: {
    async GET() {
      console.log('🔍 Mock: Fetching mentors...');
      
      // Mock mentor data
      const mockMentors = [
        {
          user_id: 'mock-mentor-1',
          display_name: 'Mock Mentor 1',
          title: 'Senior Developer',
          bio_short: 'Mock mentor bio',
          years_experience: 5,
          hourly_rate_cents: 50000,
          status: 'verified',
          app_users: {
            email: 'mentor1@example.com',
            full_name: 'Mock Mentor 1'
          }
        },
        {
          user_id: 'mock-mentor-2',
          display_name: 'Mock Mentor 2',
          title: 'Product Manager',
          bio_short: 'Mock mentor bio 2',
          years_experience: 8,
          hourly_rate_cents: 75000,
          status: 'verified',
          app_users: {
            email: 'mentor2@example.com',
            full_name: 'Mock Mentor 2'
          }
        }
      ];

      return {
        success: true,
        data: mockMentors,
        count: mockMentors.length
      };
    },

    async POST(data: any) {
      console.log('🚀 Mock: Creating mentor...', data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful response
      const mockUserId = `mock-mentor-${Date.now()}`;
      
      return {
        success: true,
        data: {
          userId: mockUserId,
          mentorId: mockUserId
        },
        message: 'Mock mentor created successfully'
      };
    }
  },

  mentees: {
    async GET() {
      console.log('🔍 Mock: Fetching mentees...');
      
      const mockMentees = [
        {
          user_id: 'mock-mentee-1',
          short_goal: 'Mock mentee goal',
          target_track: 'yazilim',
          budget: '500_1000',
          app_users: {
            email: 'mentee1@example.com',
            full_name: 'Mock Mentee 1'
          }
        }
      ];

      return {
        success: true,
        data: mockMentees,
        count: mockMentees.length
      };
    },

    async POST(data: any) {
      console.log('🚀 Mock: Creating mentee...', data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful response
      const mockUserId = `mock-mentee-${Date.now()}`;
      
      return {
        success: true,
        data: {
          userId: mockUserId,
          menteeId: mockUserId
        },
        message: 'Mock mentee created successfully'
      };
    }
  }
};

