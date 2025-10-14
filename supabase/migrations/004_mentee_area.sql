-- BiMentor | Mentee Account Area
-- bookings, messages, goals, files, payments

-- ============================================
-- BOOKINGS (Seanslar)
-- ============================================
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  mentee_id uuid not null references app_users(id) on delete cascade,
  mentor_id uuid not null references app_users(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'pending' check (status in ('pending','confirmed','completed','canceled')),
  price_cents int not null default 0,
  currency text not null default 'TRY',
  meeting_link text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_bookings_mentee on bookings(mentee_id, starts_at desc);
create index idx_bookings_mentor on bookings(mentor_id, starts_at desc);
create index idx_bookings_status on bookings(status);
create index idx_bookings_upcoming on bookings(starts_at) where status in ('pending', 'confirmed');

-- ============================================
-- MESSAGES (Mesajlaşma)
-- ============================================
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null,
  sender_id uuid not null references app_users(id) on delete cascade,
  receiver_id uuid not null references app_users(id) on delete cascade,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_messages_thread on messages(thread_id, created_at desc);
create index idx_messages_sender on messages(sender_id);
create index idx_messages_receiver on messages(receiver_id);
create index idx_messages_unread on messages(receiver_id, read_at) where read_at is null;

-- ============================================
-- SAVED MENTORS
-- ============================================
create table if not exists mentee_saved_mentors (
  mentee_id uuid not null references app_users(id) on delete cascade,
  mentor_id uuid not null references app_users(id) on delete cascade,
  notes text,
  created_at timestamptz not null default now(),
  primary key (mentee_id, mentor_id)
);

create index idx_saved_mentors_mentee on mentee_saved_mentors(mentee_id, created_at desc);

-- ============================================
-- GOALS & TASKS
-- ============================================
create table if not exists mentee_goals (
  id uuid primary key default gen_random_uuid(),
  mentee_id uuid not null references app_users(id) on delete cascade,
  title text not null,
  description text,
  target_date date,
  progress int not null default 0 check (progress between 0 and 100),
  suggested_resources text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_goals_mentee on mentee_goals(mentee_id, created_at desc);

create table if not exists mentee_goal_tasks (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references mentee_goals(id) on delete cascade,
  title text not null,
  done boolean not null default false,
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

create index idx_goal_tasks_goal on mentee_goal_tasks(goal_id, order_index);

-- ============================================
-- FILES
-- ============================================
create table if not exists mentee_files (
  id uuid primary key default gen_random_uuid(),
  mentee_id uuid not null references app_users(id) on delete cascade,
  name text not null,
  path text not null,
  size_bytes int not null default 0,
  mime_type text,
  folder text not null default 'general' check (folder in ('general','cv','projects','notes')),
  shared_with_mentors boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_files_mentee on mentee_files(mentee_id, created_at desc);
create index idx_files_folder on mentee_files(mentee_id, folder);

-- ============================================
-- PAYMENTS
-- ============================================
create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  mentee_id uuid not null references app_users(id) on delete cascade,
  booking_id uuid references bookings(id) on delete set null,
  amount_cents int not null,
  currency text not null default 'TRY',
  status text not null check (status in ('succeeded','refunded','failed','requires_action')),
  payment_method text,
  description text,
  invoice_url text,
  created_at timestamptz not null default now()
);

create index idx_payments_mentee on payments(mentee_id, created_at desc);
create index idx_payments_booking on payments(booking_id);

-- ============================================
-- NOTIFICATIONS
-- ============================================
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references app_users(id) on delete cascade,
  type text not null check (type in ('booking','message','payment','system')),
  title text not null,
  body text not null,
  read_at timestamptz,
  action_url text,
  created_at timestamptz not null default now()
);

create index idx_notifications_user on notifications(user_id, created_at desc);
create index idx_notifications_unread on notifications(user_id, read_at) where read_at is null;

-- ============================================
-- TRIGGERS (updated_at)
-- ============================================
create trigger update_bookings_updated_at before update on bookings
  for each row execute function update_updated_at_column();

create trigger update_goals_updated_at before update on mentee_goals
  for each row execute function update_updated_at_column();

-- ============================================
-- VIEWS FOR MENTEE DASHBOARD
-- ============================================

-- Upcoming bookings
create or replace view mentee_upcoming_bookings_v as
select 
  b.id,
  b.mentee_id,
  b.mentor_id,
  b.starts_at,
  b.ends_at,
  b.status,
  b.price_cents,
  b.meeting_link,
  m.display_name as mentor_name,
  m.title as mentor_title
from bookings b
join mentors m on m.user_id = b.mentor_id
where b.status in ('pending', 'confirmed')
  and b.starts_at >= now()
order by b.starts_at asc;

-- Active mentors (has at least 1 confirmed booking)
create or replace view mentee_active_mentors_v as
select distinct
  b.mentee_id,
  b.mentor_id,
  m.display_name,
  m.title,
  m.hourly_rate_cents,
  count(*) filter (where b.status = 'confirmed') as confirmed_sessions,
  max(b.starts_at) as last_session_at
from bookings b
join mentors m on m.user_id = b.mentor_id
where b.status in ('confirmed', 'completed')
group by b.mentee_id, b.mentor_id, m.display_name, m.title, m.hourly_rate_cents
order by last_session_at desc;

-- Message threads
create or replace view mentee_message_threads_v as
select
  m.thread_id,
  m.sender_id,
  m.receiver_id,
  case 
    when m.sender_id != coalesce(current_setting('app.current_user_id', true)::uuid, '00000000-0000-0000-0000-000000000000'::uuid)
    then m.sender_id 
    else m.receiver_id 
  end as other_user_id,
  max(m.created_at) as last_message_at,
  count(*) filter (where m.read_at is null and m.receiver_id = coalesce(current_setting('app.current_user_id', true)::uuid, '00000000-0000-0000-0000-000000000000'::uuid)) as unread_count
from messages m
group by m.thread_id, m.sender_id, m.receiver_id
order by last_message_at desc;

-- ============================================
-- COMMENTS
-- ============================================
comment on table bookings is 'Mentee-Mentor seansları';
comment on table messages is 'Mesajlaşma sistemi';
comment on table mentee_saved_mentors is 'Mentee''nin kaydettiği mentorlar';
comment on table mentee_goals is 'Mentee hedefleri';
comment on table mentee_goal_tasks is 'Hedef altındaki görevler';
comment on table mentee_files is 'Mentee dosyaları (CV, portföy, vb.)';
comment on table payments is 'Ödeme kayıtları';
comment on table notifications is 'Kullanıcı bildirimleri';


