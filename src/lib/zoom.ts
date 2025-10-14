/**
 * Zoom API Helper
 * Server-to-Server OAuth + Meeting Creation
 */

const ZOOM_ACCOUNT_ID = import.meta.env.VITE_ZOOM_ACCOUNT_ID;
const ZOOM_CLIENT_ID = import.meta.env.VITE_ZOOM_CLIENT_ID;
const ZOOM_CLIENT_SECRET = import.meta.env.VITE_ZOOM_CLIENT_SECRET;

const isZoomConfigured = () => {
  return ZOOM_ACCOUNT_ID && ZOOM_CLIENT_ID && ZOOM_CLIENT_SECRET &&
    !ZOOM_ACCOUNT_ID.includes('xxx') && 
    !ZOOM_CLIENT_ID.includes('xxx');
};

/**
 * Get Zoom S2S OAuth Access Token
 */
export async function getAccessToken(): Promise<string> {
  if (!isZoomConfigured()) {
    console.warn('🔶 MOCK: Zoom not configured');
    return 'mock_zoom_token';
  }

  try {
    const params = new URLSearchParams({
      grant_type: 'account_credentials',
      account_id: ZOOM_ACCOUNT_ID!,
      client_id: ZOOM_CLIENT_ID!,
      client_secret: ZOOM_CLIENT_SECRET!
    });

    const response = await fetch('https://zoom.us/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    if (!response.ok) {
      throw new Error(`Zoom token failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Zoom getAccessToken error:', error);
    throw error;
  }
}

/**
 * Create Zoom Meeting
 */
export async function createMeeting(input: {
  hostEmail: string;
  topic: string;
  start_time: string;  // ISO 8601 UTC (e.g., "2025-10-10T15:00:00Z")
  duration: number;    // minutes
  agenda?: string;
}): Promise<{
  meetingId: string;
  join_url: string;
  start_url: string;
}> {
  if (!isZoomConfigured()) {
    // Mock mode - fake Zoom URLs
    console.warn('🔶 MOCK: Zoom meeting not created (not configured)');
    const mockId = `mock_${Date.now()}`;
    
    return {
      meetingId: mockId,
      join_url: `https://zoom.us/j/${mockId}?pwd=mock`,
      start_url: `https://zoom.us/s/${mockId}?zak=mock`
    };
  }

  try {
    const token = await getAccessToken();

    const response = await fetch(
      `https://api.zoom.us/v2/users/${encodeURIComponent(input.hostEmail)}/meetings`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          topic: input.topic,
          type: 2, // Scheduled meeting
          start_time: input.start_time,
          duration: input.duration,
          agenda: input.agenda || '',
          settings: {
            join_before_host: false,
            waiting_room: true,
            mute_upon_entry: true,
            approval_type: 0, // Automatically approve
            audio: 'both',
            auto_recording: 'none'
          }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Zoom create failed: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();

    return {
      meetingId: String(data.id),
      join_url: data.join_url,
      start_url: data.start_url
    };
  } catch (error) {
    console.error('Zoom createMeeting error:', error);
    throw error;
  }
}

/**
 * Verify Zoom Webhook Signature
 * (Bu browser'da çalışmaz - server-side için placeholder)
 */
export function verifyZoomSignature(timestamp: string, signature: string, body: string): boolean {
  // Server-side'da crypto.createHmac kullanılır
  // Browser'da webhook handling olmaz
  console.warn('verifyZoomSignature called in browser - this should be server-side only');
  return true;
}

