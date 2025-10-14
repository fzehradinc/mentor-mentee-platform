import { supabase } from '../supabase';
import { getCurrentUser } from '../auth/requireMentee';

// Helper to check if Supabase is configured
const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  return url && !url.includes('your-project');
};

// ============================================
// BOOKINGS
// ============================================

export interface Booking {
  id: string;
  mentee_id: string;
  mentor_id: string;
  starts_at: string;
  ends_at: string;
  status: 'pending' | 'confirmed' | 'completed' | 'canceled';
  price_cents: number;
  currency: string;
  meeting_link?: string;
  mentor_name?: string;
  mentor_title?: string;
}

export async function getUpcomingBookings(): Promise<Booking[]> {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  if (!isSupabaseConfigured()) {
    return [];
  }

  const { data, error } = await supabase
    .from('mentee_upcoming_bookings_v')
    .select('*')
    .eq('mentee_id', user.id)
    .limit(10);

  if (error) {
    console.error('Get bookings error:', error);
    return [];
  }

  return data || [];
}

export async function createBooking(input: {
  mentorId: string;
  startsAt: string;
  endsAt: string;
  priceCents: number;
}) {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('bookings')
    .insert({
      mentee_id: user.id,
      mentor_id: input.mentorId,
      starts_at: input.startsAt,
      ends_at: input.endsAt,
      price_cents: input.priceCents,
      status: 'pending'
    });

  if (error) throw new Error('Booking oluşturulamadı');
}

export async function cancelBooking(bookingId: string) {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('bookings')
    .update({ status: 'canceled' })
    .eq('id', bookingId)
    .eq('mentee_id', user.id); // Security: only owner can cancel

  if (error) throw new Error('Booking iptal edilemedi');
}

// ============================================
// MESSAGES
// ============================================

export interface Message {
  id: string;
  thread_id: string;
  sender_id: string;
  receiver_id: string;
  body: string;
  read_at?: string;
  created_at: string;
}

export async function getThreadMessages(threadId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Get messages error:', error);
    return [];
  }

  return data || [];
}

export async function sendMessage(input: {
  threadId: string;
  receiverId: string;
  body: string;
}) {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('messages')
    .insert({
      thread_id: input.threadId,
      sender_id: user.id,
      receiver_id: input.receiverId,
      body: input.body
    });

  if (error) throw new Error('Mesaj gönderilemedi');
}

export async function createThread(mentorId: string): Promise<string> {
  const threadId = crypto.randomUUID();
  return threadId;
}

// ============================================
// MENTORS
// ============================================

export async function getSavedMentors() {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  if (!isSupabaseConfigured()) {
    return [];
  }

  const { data, error } = await supabase
    .from('mentee_saved_mentors')
    .select(`
      mentor_id,
      notes,
      created_at,
      mentors (
        user_id,
        display_name,
        title,
        hourly_rate_cents,
        rating_avg
      )
    `)
    .eq('mentee_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Get saved mentors error:', error);
    return [];
  }

  return data || [];
}

export async function saveMentor(mentorId: string, notes?: string) {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('mentee_saved_mentors')
    .insert({
      mentee_id: user.id,
      mentor_id: mentorId,
      notes: notes || null
    });

  if (error) throw new Error('Mentor kaydedilemedi');
}

export async function unsaveMentor(mentorId: string) {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('mentee_saved_mentors')
    .delete()
    .eq('mentee_id', user.id)
    .eq('mentor_id', mentorId);

  if (error) throw new Error('Mentor kaldırılamadı');
}

export async function getActiveMentors() {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  if (!isSupabaseConfigured()) {
    return [];
  }

  const { data, error } = await supabase
    .from('mentee_active_mentors_v')
    .select('*')
    .eq('mentee_id', user.id);

  if (error) {
    console.error('Get active mentors error:', error);
    return [];
  }

  return data || [];
}

// ============================================
// GOALS
// ============================================

export interface Goal {
  id: string;
  mentee_id: string;
  title: string;
  description?: string;
  target_date?: string;
  progress: number;
  suggested_resources?: string;
  tasks?: GoalTask[];
}

export interface GoalTask {
  id: string;
  goal_id: string;
  title: string;
  done: boolean;
  order_index: number;
}

export async function getGoals(): Promise<Goal[]> {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  if (!isSupabaseConfigured()) {
    // Mock mode - localStorage'dan al
    const goalsKey = `bimentor_goals_${user.id}`;
    const stored = localStorage.getItem(goalsKey);
    return stored ? JSON.parse(stored) : [];
  }

  const { data, error } = await supabase
    .from('mentee_goals')
    .select(`
      *,
      mentee_goal_tasks (*)
    `)
    .eq('mentee_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Get goals error:', error);
    return [];
  }

  return (data || []).map((goal: any) => ({
    ...goal,
    tasks: goal.mentee_goal_tasks || []
  }));
}

export async function createGoal(input: {
  title: string;
  description?: string;
  targetDate?: string;
}) {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  if (!isSupabaseConfigured()) {
    // Mock mode - localStorage'a kaydet
    const goalsKey = `bimentor_goals_${user.id}`;
    const goals = await getGoals();
    const newGoal: Goal = {
      id: crypto.randomUUID(),
      mentee_id: user.id,
      title: input.title,
      description: input.description,
      target_date: input.targetDate,
      progress: 0,
      tasks: []
    };
    goals.unshift(newGoal);
    localStorage.setItem(goalsKey, JSON.stringify(goals));
    return;
  }

  const { error } = await supabase
    .from('mentee_goals')
    .insert({
      mentee_id: user.id,
      title: input.title,
      description: input.description || null,
      target_date: input.targetDate || null
    });

  if (error) throw new Error('Hedef oluşturulamadı');
}

export async function deleteGoal(goalId: string) {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  if (!isSupabaseConfigured()) {
    const goalsKey = `bimentor_goals_${user.id}`;
    const goals = await getGoals();
    const filtered = goals.filter(g => g.id !== goalId);
    localStorage.setItem(goalsKey, JSON.stringify(filtered));
    return;
  }

  const { error } = await supabase
    .from('mentee_goals')
    .delete()
    .eq('id', goalId)
    .eq('mentee_id', user.id);

  if (error) throw new Error('Hedef silinemedi');
}

export async function createTask(goalId: string, title: string) {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  if (!isSupabaseConfigured()) {
    const goalsKey = `bimentor_goals_${user.id}`;
    const goals = await getGoals();
    const goalIndex = goals.findIndex(g => g.id === goalId);
    if (goalIndex !== -1) {
      const newTask: GoalTask = {
        id: crypto.randomUUID(),
        goal_id: goalId,
        title: title,
        done: false,
        order_index: goals[goalIndex].tasks?.length || 0
      };
      goals[goalIndex].tasks = [...(goals[goalIndex].tasks || []), newTask];
      localStorage.setItem(goalsKey, JSON.stringify(goals));
    }
    return;
  }

  const { error } = await supabase
    .from('mentee_goal_tasks')
    .insert({
      goal_id: goalId,
      title: title
    });

  if (error) throw new Error('Görev oluşturulamadı');
}

export async function toggleTask(taskId: string, done: boolean) {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  if (!isSupabaseConfigured()) {
    const goalsKey = `bimentor_goals_${user.id}`;
    const goals = await getGoals();
    
    for (let goal of goals) {
      const taskIndex = goal.tasks?.findIndex(t => t.id === taskId);
      if (taskIndex !== undefined && taskIndex !== -1 && goal.tasks) {
        goal.tasks[taskIndex].done = done;
        break;
      }
    }
    
    localStorage.setItem(goalsKey, JSON.stringify(goals));
    return;
  }

  const { error } = await supabase
    .from('mentee_goal_tasks')
    .update({ done })
    .eq('id', taskId);

  if (error) throw new Error('Görev güncellenemedi');
}

// ============================================
// FILES
// ============================================

export interface MenteeFile {
  id: string;
  mentee_id: string;
  name: string;
  path: string;
  size_bytes: number;
  mime_type?: string;
  folder: string;
  shared_with_mentors: boolean;
  created_at: string;
}

export async function getFiles(folder?: string): Promise<MenteeFile[]> {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  if (!isSupabaseConfigured()) {
    // Mock mode - localStorage'dan al
    const filesKey = `bimentor_files_${user.id}`;
    const stored = localStorage.getItem(filesKey);
    let files: MenteeFile[] = stored ? JSON.parse(stored) : [];
    
    // Folder filter
    if (folder && folder !== 'all') {
      files = files.filter(f => f.folder === folder);
    }
    
    return files;
  }

  let query = supabase
    .from('mentee_files')
    .select('*')
    .eq('mentee_id', user.id);

  if (folder) {
    query = query.eq('folder', folder);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Get files error:', error);
    return [];
  }

  return data || [];
}

export async function uploadFile(input: {
  file: File;
  folder: string;
  sharedWithMentors: boolean;
}) {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  if (!isSupabaseConfigured()) {
    // Mock mode - localStorage'a metadata kaydet (dosya binary'si kaydedilmez)
    const filesKey = `bimentor_files_${user.id}`;
    const files = await getFiles();
    const newFile: MenteeFile = {
      id: crypto.randomUUID(),
      mentee_id: user.id,
      name: input.file.name,
      path: `mock/${input.folder}/${input.file.name}`,
      size_bytes: input.file.size,
      mime_type: input.file.type,
      folder: input.folder,
      shared_with_mentors: input.sharedWithMentors,
      created_at: new Date().toISOString()
    };
    files.unshift(newFile);
    localStorage.setItem(filesKey, JSON.stringify(files));
    return;
  }

  // 1. Upload to Supabase Storage
  const fileName = `${Date.now()}_${input.file.name}`;
  const filePath = `${user.id}/${input.folder}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('mentee-files')
    .upload(filePath, input.file);

  if (uploadError) {
    console.error('Upload error:', uploadError);
    throw new Error('Dosya yüklenemedi');
  }

  // 2. Save metadata to database
  const { error: dbError } = await supabase
    .from('mentee_files')
    .insert({
      mentee_id: user.id,
      name: input.file.name,
      path: filePath,
      size_bytes: input.file.size,
      mime_type: input.file.type,
      folder: input.folder,
      shared_with_mentors: input.sharedWithMentors
    });

  if (dbError) {
    console.error('File metadata error:', dbError);
    throw new Error('Dosya kaydedilemedi');
  }
}

export async function toggleFileSharing(fileId: string, shared: boolean) {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  if (!isSupabaseConfigured()) {
    const filesKey = `bimentor_files_${user.id}`;
    const files = await getFiles();
    const fileIndex = files.findIndex(f => f.id === fileId);
    if (fileIndex !== -1) {
      files[fileIndex].shared_with_mentors = shared;
      localStorage.setItem(filesKey, JSON.stringify(files));
    }
    return;
  }

  const { error } = await supabase
    .from('mentee_files')
    .update({ shared_with_mentors: shared })
    .eq('id', fileId)
    .eq('mentee_id', user.id);

  if (error) throw new Error('Paylaşım ayarı güncellenemedi');
}

// ============================================
// PAYMENTS
// ============================================

export interface Payment {
  id: string;
  mentee_id: string;
  booking_id?: string;
  amount_cents: number;
  currency: string;
  status: string;
  description?: string;
  invoice_url?: string;
  created_at: string;
}

export async function getPayments(): Promise<Payment[]> {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  if (!isSupabaseConfigured()) {
    return [];
  }

  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('mentee_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Get payments error:', error);
    return [];
  }

  return data || [];
}

// ============================================
// RECOMMENDED MENTORS (Eşleştirme)
// ============================================

export async function getRecommendedMentors() {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  if (!isSupabaseConfigured()) {
    return [];
  }

  // Get mentee interests and priorities
  const { data: interests } = await supabase
    .from('mentee_interests')
    .select('interest')
    .eq('user_id', user.id);

  const { data: priorities } = await supabase
    .from('mentee_priorities')
    .select('priority')
    .eq('user_id', user.id);

  const interestList = interests?.map(i => i.interest) || [];
  const priorityList = priorities?.map(p => p.priority) || [];

  // Find mentors with overlapping categories
  // Simple approach: get all verified mentors and filter client-side
  // For production, use a custom RPC for efficient matching
  
  const { data: mentors, error } = await supabase
    .from('mentors_public_v')
    .select('*')
    .limit(10);

  if (error) {
    console.error('Get recommended mentors error:', error);
    return [];
  }

  // Simple scoring (ileride iyileştirilebilir)
  const scored = (mentors || []).map((mentor: any) => {
    let score = 0;
    const mentorCategories = mentor.categories || [];
    
    // Interest overlap
    interestList.forEach(interest => {
      if (mentorCategories.includes(interest)) score += 2;
    });

    // Priority overlap (simplified - map to categories)
    priorityList.forEach(priority => {
      if (mentorCategories.includes('yazilim') || mentorCategories.includes('veri_ai')) score += 1;
    });

    return { ...mentor, matchScore: score };
  });

  // Sort by score and return top 3
  return scored
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);
}

// ============================================
// NOTES
// ============================================

export interface MenteeNote {
  id: string;
  user_id: string;
  title: string;
  content?: string;
  created_at: string;
  updated_at: string;
}

export async function getNotes(): Promise<MenteeNote[]> {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  if (!isSupabaseConfigured()) {
    // Mock mode - localStorage'dan al
    const notesKey = `bimentor_notes_${user.id}`;
    const stored = localStorage.getItem(notesKey);
    return stored ? JSON.parse(stored) : [];
  }

  const { data, error } = await supabase
    .from('mentee_notes')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Get notes error:', error);
    return [];
  }

  return data || [];
}

export async function createNote(input: { title: string; content?: string }) {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  if (!isSupabaseConfigured()) {
    // Mock mode - localStorage'a kaydet
    const notesKey = `bimentor_notes_${user.id}`;
    const notes = await getNotes();
    const newNote: MenteeNote = {
      id: crypto.randomUUID(),
      user_id: user.id,
      title: input.title,
      content: input.content || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    notes.unshift(newNote);
    localStorage.setItem(notesKey, JSON.stringify(notes));
    return;
  }

  const { error } = await supabase
    .from('mentee_notes')
    .insert({
      user_id: user.id,
      title: input.title,
      content: input.content || null
    });

  if (error) throw new Error('Not oluşturulamadı');
}

export async function updateNote(noteId: string, input: { title: string; content?: string }) {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  if (!isSupabaseConfigured()) {
    const notesKey = `bimentor_notes_${user.id}`;
    const notes = await getNotes();
    const index = notes.findIndex(n => n.id === noteId);
    if (index !== -1) {
      notes[index] = {
        ...notes[index],
        title: input.title,
        content: input.content || '',
        updated_at: new Date().toISOString()
      };
      localStorage.setItem(notesKey, JSON.stringify(notes));
    }
    return;
  }

  const { error } = await supabase
    .from('mentee_notes')
    .update({
      title: input.title,
      content: input.content || null
    })
    .eq('id', noteId)
    .eq('user_id', user.id);

  if (error) throw new Error('Not güncellenemedi');
}

export async function deleteNote(noteId: string) {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  if (!isSupabaseConfigured()) {
    const notesKey = `bimentor_notes_${user.id}`;
    const notes = await getNotes();
    const filtered = notes.filter(n => n.id !== noteId);
    localStorage.setItem(notesKey, JSON.stringify(filtered));
    return;
  }

  const { error } = await supabase
    .from('mentee_notes')
    .delete()
    .eq('id', noteId)
    .eq('user_id', user.id);

  if (error) throw new Error('Not silinemedi');
}

// ============================================
// SESSIONS (BOOKINGS)
// ============================================

export interface Session {
  id: string;
  mentee_id: string;
  mentor_id?: string;
  starts_at: string; // ISO UTC
  ends_at: string;   // ISO UTC
  status: 'scheduled' | 'pending' | 'completed' | 'canceled';
  notes?: string;
  meeting_link?: string;
  created_at: string;
}

export async function createSession(input: {
  startISO: string;  // UTC ISO, e.g., "2025-10-08T15:00:00.000Z"
  endISO: string;    // UTC ISO
  mentorId?: string | null;
  notes?: string;
}) {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const starts_at = new Date(input.startISO).toISOString();
  const ends_at = new Date(input.endISO).toISOString();

  if (!isSupabaseConfigured()) {
    // Mock mode - localStorage'a kaydet
    const sessionsKey = `bimentor_sessions_${user.id}`;
    const sessions = await getSessions();
    
    // Conflict check
    const hasConflict = sessions.some(s => {
      const sStart = new Date(s.starts_at).getTime();
      const sEnd = new Date(s.ends_at).getTime();
      const newStart = new Date(starts_at).getTime();
      const newEnd = new Date(ends_at).getTime();
      
      return (
        (newStart >= sStart && newStart < sEnd) ||
        (newEnd > sStart && newEnd <= sEnd) ||
        (newStart <= sStart && newEnd >= sEnd)
      );
    });
    
    if (hasConflict) {
      throw new Error('Bu saat aralığında planlanmış bir seansınız var.');
    }
    
    const newSession: Session = {
      id: crypto.randomUUID(),
      mentee_id: user.id,
      mentor_id: input.mentorId || undefined,
      starts_at,
      ends_at,
      status: 'scheduled',
      notes: input.notes,
      created_at: new Date().toISOString()
    };
    
    sessions.unshift(newSession);
    localStorage.setItem(sessionsKey, JSON.stringify(sessions));
    return { ok: true, sessionId: newSession.id };
  }

  // Real Supabase mode
  // Conflict check
  const { data: conflicts, error: confErr } = await supabase
    .from('sessions')
    .select('id, starts_at, ends_at')
    .eq('mentee_id', user.id)
    .or(`and(starts_at.lte.${ends_at},ends_at.gte.${starts_at})`);

  if (confErr) throw confErr;
  if (conflicts && conflicts.length > 0) {
    throw new Error('Bu saat aralığında planlanmış bir seansınız var.');
  }

  const { data, error } = await supabase
    .from('sessions')
    .insert({
      mentee_id: user.id,
      mentor_id: input.mentorId || null,
      starts_at,
      ends_at,
      status: 'scheduled',
      notes: input.notes || null
    })
    .select()
    .single();

  if (error) throw new Error('Seans oluşturulamadı');

  return { ok: true, sessionId: data.id };
}

export async function getSessions(): Promise<Session[]> {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  if (!isSupabaseConfigured()) {
    // Mock mode - localStorage'dan al
    const sessionsKey = `bimentor_sessions_${user.id}`;
    const stored = localStorage.getItem(sessionsKey);
    return stored ? JSON.parse(stored) : [];
  }

  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('mentee_id', user.id)
    .order('starts_at', { ascending: false });

  if (error) {
    console.error('Get sessions error:', error);
    return [];
  }

  return data || [];
}

export async function cancelSession(sessionId: string) {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  if (!isSupabaseConfigured()) {
    const sessionsKey = `bimentor_sessions_${user.id}`;
    const sessions = await getSessions();
    const sessionIndex = sessions.findIndex(s => s.id === sessionId);
    
    if (sessionIndex !== -1) {
      sessions[sessionIndex].status = 'canceled';
      localStorage.setItem(sessionsKey, JSON.stringify(sessions));
    }
    return;
  }

  const { error } = await supabase
    .from('sessions')
    .update({ status: 'canceled' })
    .eq('id', sessionId)
    .eq('mentee_id', user.id);

  if (error) throw new Error('Seans iptal edilemedi');
}

// ============================================
// PROFILE MANAGEMENT
// ============================================

export interface MenteeProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  city?: string;
  country?: string;
  created_at?: string;
  updated_at?: string;
}

export async function getMenteeProfile(): Promise<MenteeProfile | null> {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  if (!isSupabaseConfigured()) {
    // Mock mode - localStorage'dan al
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    const userData = JSON.parse(userStr);
    
    // menteeData'dan bilgileri çek
    const menteeData = userData.menteeData || {};
    
    return {
      id: user.id,
      email: user.email,
      first_name: menteeData.firstName || user.fullName?.split(' ')[0] || '',
      last_name: menteeData.lastName || user.fullName?.split(' ').slice(1).join(' ') || '',
      phone: menteeData.phone || '',
      city: menteeData.city || '',
      country: menteeData.country || 'Turkey',
      created_at: userData.createdAt,
      updated_at: userData.updatedAt || userData.createdAt
    };
  }

  // Real Supabase mode
  const { data, error } = await supabase
    .from('mentee')
    .select('*')
    .eq('email', user.email)
    .single();

  if (error) {
    console.error('Get profile error:', error);
    return null;
  }

  return data;
}

// Helper function - Title Case (başharfi büyük, diğerleri küçük)
function toTitleCase(str?: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .trim();
}

export async function updateMenteeProfile(input: {
  first_name?: string;
  last_name?: string;
  phone?: string;
  city?: string;
  country?: string;
}) {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  // Format names to Title Case
  const formattedFirstName = toTitleCase(input.first_name);
  const formattedLastName = toTitleCase(input.last_name);
  const formattedCity = toTitleCase(input.city);

  if (!isSupabaseConfigured()) {
    // Mock mode - localStorage'ı güncelle
    const userStr = localStorage.getItem('user');
    if (!userStr) throw new Error('User not found');
    
    const userData = JSON.parse(userStr);
    
    // menteeData'yı güncelle
    const updatedData = {
      ...userData,
      fullName: `${formattedFirstName} ${formattedLastName}`.trim(),
      menteeData: {
        ...userData.menteeData,
        firstName: formattedFirstName,
        lastName: formattedLastName,
        phone: input.phone,
        city: formattedCity,
        country: input.country
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
  const { error } = await supabase
    .from('mentee')
    .update({
      first_name: formattedFirstName,
      last_name: formattedLastName,
      phone: input.phone,
      city: formattedCity,
      country: input.country,
      updated_at: new Date().toISOString()
    })
    .eq('email', user.email);

  if (error) throw new Error('Profil güncellenemedi');

  return { ok: true };
}

// ============================================
// PASSWORD MANAGEMENT
// ============================================

export async function changePassword(input: {
  currentPassword: string;
  newPassword: string;
}) {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  if (!isSupabaseConfigured()) {
    // Mock mode - localStorage'dan şifreyi kontrol et ve değiştir
    const usersKey = 'bimentor_mock_users';
    const allUsers = JSON.parse(localStorage.getItem(usersKey) || '[]');
    const userIndex = allUsers.findIndex((u: any) => u.id === user.id);
    
    if (userIndex === -1) {
      throw new Error('Kullanıcı bulunamadı');
    }
    
    // Mevcut şifreyi kontrol et
    if (allUsers[userIndex].password !== input.currentPassword) {
      throw new Error('Mevcut şifre hatalı');
    }
    
    // Yeni şifreyi kaydet
    allUsers[userIndex].password = input.newPassword;
    allUsers[userIndex].updatedAt = new Date().toISOString();
    localStorage.setItem(usersKey, JSON.stringify(allUsers));
    
    console.log('✅ Password changed for', user.email);
    return { ok: true };
  }

  // Real Supabase mode - use Supabase Auth
  const { error } = await supabase.auth.updateUser({
    password: input.newPassword
  });

  if (error) throw new Error('Şifre değiştirilemedi');

  return { ok: true };
}

export async function resetPasswordByEmail(email: string) {
  if (!isSupabaseConfigured()) {
    // Mock mode - geçici şifre oluştur ve konsola yaz
    const usersKey = 'bimentor_mock_users';
    const allUsers = JSON.parse(localStorage.getItem(usersKey) || '[]');
    const userIndex = allUsers.findIndex((u: any) => u.email === email);
    
    if (userIndex === -1) {
      throw new Error('Bu e-posta adresi kayıtlı değil');
    }
    
    // Geçici şifre oluştur
    const tempPassword = 'temp' + Math.random().toString(36).slice(2, 10);
    
    allUsers[userIndex].password = tempPassword;
    allUsers[userIndex].updatedAt = new Date().toISOString();
    localStorage.setItem(usersKey, JSON.stringify(allUsers));
    
    // MOCK: Konsola yazdır (gerçekte email gönderilir)
    console.log('🔑 MOCK: Geçici şifre:', tempPassword, 'Email:', email);
    alert(`MOCK MODE: Geçici şifreniz: ${tempPassword}\n\nBu şifreyi kullanarak giriş yapabilirsiniz.`);
    
    return { ok: true, tempPassword }; // MOCK ONLY - gerçekte döndürülmez!
  }

  // Real Supabase mode
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });

  if (error) throw new Error('Şifre sıfırlama e-postası gönderilemedi');

  return { ok: true };
}

// ============================================
// ZOOM MEETINGS
// ============================================

export interface Meeting {
  id: string;
  mentor_id: string;
  mentee_id: string;
  starts_at: string;
  ends_at: string;
  duration_min?: number;
  status: 'scheduled' | 'started' | 'ended' | 'cancelled';
  zoom_meeting_id?: string;
  zoom_join_url?: string;
  zoom_host_url?: string;
  topic?: string;
  agenda?: string;
  created_at: string;
}

export async function createZoomMeeting(input: {
  mentorId: string;
  menteeId: string;
  startsAt: string;  // ISO UTC
  durationMin: number;
  topic?: string;
  agenda?: string;
  mentorEmail: string;
}) {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const endsAt = new Date(new Date(input.startsAt).getTime() + input.durationMin * 60000).toISOString();

  if (!isSupabaseConfigured()) {
    // Mock mode
    console.warn('🔶 MOCK: Creating Zoom meeting (localStorage)');
    
    const { createMeeting } = await import('../zoom');
    const zoomData = await createMeeting({
      hostEmail: input.mentorEmail,
      topic: input.topic || 'Mentorluk Seansı',
      start_time: input.startsAt,
      duration: input.durationMin,
      agenda: input.agenda
    });

    const meetingsKey = `bimentor_meetings_${user.id}`;
    const meetings = JSON.parse(localStorage.getItem(meetingsKey) || '[]');

    const newMeeting: Meeting = {
      id: crypto.randomUUID(),
      mentor_id: input.mentorId,
      mentee_id: input.menteeId,
      starts_at: input.startsAt,
      ends_at: endsAt,
      duration_min: input.durationMin,
      status: 'scheduled',
      zoom_meeting_id: zoomData.meetingId,
      zoom_join_url: zoomData.join_url,
      zoom_host_url: zoomData.start_url,
      topic: input.topic || 'Mentorluk Seansı',
      agenda: input.agenda,
      created_at: new Date().toISOString()
    };

    meetings.unshift(newMeeting);
    localStorage.setItem(meetingsKey, JSON.stringify(meetings));

    return {
      ok: true,
      meeting: newMeeting
    };
  }

  // Real Supabase + Zoom mode
  const { createMeeting } = await import('../zoom');
  
  const zoomData = await createMeeting({
    hostEmail: input.mentorEmail,
    topic: input.topic || 'Mentorluk Seansı',
    start_time: input.startsAt,
    duration: input.durationMin,
    agenda: input.agenda
  });

  const { data, error } = await supabase
    .from('meetings')
    .insert({
      mentor_id: input.mentorId,
      mentee_id: input.menteeId,
      starts_at: input.startsAt,
      ends_at: endsAt,
      duration_min: input.durationMin,
      status: 'scheduled',
      zoom_meeting_id: zoomData.meetingId,
      zoom_join_url: zoomData.join_url,
      zoom_host_url: zoomData.start_url,
      topic: input.topic || 'Mentorluk Seansı',
      agenda: input.agenda,
      created_by: user.id
    })
    .select()
    .single();

  if (error) throw new Error('Meeting oluşturulamadı');

  return {
    ok: true,
    meeting: data
  };
}

export async function getMeetings(scope: 'mine' | 'all' = 'mine'): Promise<Meeting[]> {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  if (!isSupabaseConfigured()) {
    // Mock mode
    const meetingsKey = `bimentor_meetings_${user.id}`;
    const stored = localStorage.getItem(meetingsKey);
    const meetings: Meeting[] = stored ? JSON.parse(stored) : [];

    // Filter by role
    if (user.role === 'mentor') {
      return meetings.filter(m => m.mentor_id === user.id);
    } else {
      return meetings.filter(m => m.mentee_id === user.id);
    }
  }

  // Real Supabase mode
  let query = supabase
    .from('meetings')
    .select('*');

  if (user.role === 'mentor') {
    query = query.eq('mentor_id', user.id);
  } else {
    query = query.eq('mentee_id', user.id);
  }

  const { data, error } = await query.order('starts_at', { ascending: false });

  if (error) {
    console.error('Get meetings error:', error);
    return [];
  }

  return data || [];
}

export async function cancelMeeting(meetingId: string) {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  if (!isSupabaseConfigured()) {
    const meetingsKey = `bimentor_meetings_${user.id}`;
    const meetings = await getMeetings();
    const meetingIndex = meetings.findIndex(m => m.id === meetingId);

    if (meetingIndex !== -1) {
      meetings[meetingIndex].status = 'cancelled';
      localStorage.setItem(meetingsKey, JSON.stringify(meetings));
    }
    return;
  }

  const { error } = await supabase
    .from('meetings')
    .update({ status: 'cancelled' })
    .eq('id', meetingId);

  if (error) throw new Error('Meeting iptal edilemedi');
}

// ============================================
// DASHBOARD STATS
// ============================================

export async function getDashboardStats() {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  if (!isSupabaseConfigured()) {
    return {
      upcomingBookingsCount: 0,
      totalGoals: 0,
      unreadMessages: 0
    };
  }

  // Upcoming bookings count (next 7 days)
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

  const { data: upcomingBookings } = await supabase
    .from('bookings')
    .select('id', { count: 'exact' })
    .eq('mentee_id', user.id)
    .eq('status', 'confirmed')
    .gte('starts_at', new Date().toISOString())
    .lte('starts_at', sevenDaysFromNow.toISOString());

  // Total goals
  const { data: goals } = await supabase
    .from('mentee_goals')
    .select('id', { count: 'exact' })
    .eq('mentee_id', user.id);

  // Unread messages
  const { data: unreadMessages } = await supabase
    .from('messages')
    .select('id', { count: 'exact' })
    .eq('receiver_id', user.id)
    .is('read_at', null);

  return {
    upcomingBookingsCount: upcomingBookings?.length || 0,
    totalGoals: goals?.length || 0,
    unreadMessages: unreadMessages?.length || 0
  };
}

