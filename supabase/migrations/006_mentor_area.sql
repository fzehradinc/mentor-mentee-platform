-- BiMentor | Mentor Account Area
-- mentor_availability, mentor_services, mentor_payouts, corporate_orgs, corporate_members

-- ============================================
-- MENTOR AVAILABILITY (Uygunluk)
-- ============================================
create table if not exists mentor_availability (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid not null references app_users(id) on delete cascade,
  weekday int check (weekday between 0 and 6),  -- 0=Sunday, 6=Saturday; null=specific date
  specific_date date,  -- if not recurring
  starts_at time not null,
  ends_at time not null,
  is_recurring boolean not null default false,
  is_available boolean not null default true,  -- can be marked unavailable
  created_at timestamptz not null default now()
);

create index idx_mentor_availability_mentor on mentor_availability(mentor_id);
create index idx_mentor_availability_weekday on mentor_availability(weekday) where is_recurring = true;
create index idx_mentor_availability_date on mentor_availability(specific_date) where specific_date is not null;

-- ============================================
-- MENTOR SERVICES (Hizmetler / Paketler)
-- ============================================
create table if not exists mentor_services (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid not null references app_users(id) on delete cascade,
  title text not null,
  description text,
  duration_minutes int not null,
  price_cents int not null,
  currency text not null default 'TRY',
  is_active boolean not null default true,
  first_session_discount_percent int default 0 check (first_session_discount_percent between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_mentor_services_mentor on mentor_services(mentor_id, is_active);

-- ============================================
-- MENTOR PAYOUTS (Kazançlar)
-- ============================================
create table if not exists mentor_payouts (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid not null references app_users(id) on delete cascade,
  amount_cents int not null,
  currency text not null default 'TRY',
  period_start date not null,
  period_end date not null,
  status text not null default 'pending' check (status in ('pending','processing','paid','failed')),
  paid_at timestamptz,
  invoice_url text,
  created_at timestamptz not null default now()
);

create index idx_mentor_payouts_mentor on mentor_payouts(mentor_id, created_at desc);
create index idx_mentor_payouts_status on mentor_payouts(status);

-- ============================================
-- CORPORATE ORGANIZATIONS
-- ============================================
create table if not exists corporate_orgs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  legal_name text,
  tax_id text,
  website text,
  logo_url text,
  billing_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- CORPORATE MEMBERS (Kurumsal mentor ekip üyeleri)
-- ============================================
create table if not exists corporate_members (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references corporate_orgs(id) on delete cascade,
  user_id uuid not null references app_users(id) on delete cascade,
  role text not null check (role in ('admin','mentor','viewer')),
  created_at timestamptz not null default now(),
  unique(org_id, user_id)
);

create index idx_corporate_members_org on corporate_members(org_id);
create index idx_corporate_members_user on corporate_members(user_id);

-- ============================================
-- PROFILE COMPLETION (helper column)
-- ============================================
alter table mentors
  add column if not exists profile_completion int default 0 check (profile_completion between 0 and 100);

-- ============================================
-- TRIGGERS
-- ============================================
create trigger update_mentor_services_updated_at before update on mentor_services
  for each row execute function update_updated_at_column();

create trigger update_corporate_orgs_updated_at before update on corporate_orgs
  for each row execute function update_updated_at_column();

-- ============================================
-- VIEWS
-- ============================================

-- Mentor appointments view (with mentee info)
create or replace view mentor_appointments_v as
select 
  b.id,
  b.mentee_id,
  b.mentor_id,
  b.starts_at,
  b.ends_at,
  b.status,
  b.price_cents,
  b.currency,
  b.meeting_link,
  b.created_at,
  u.full_name as mentee_name,
  u.email as mentee_email
from bookings b
join app_users u on u.id = b.mentee_id
order by b.starts_at desc;

-- Mentor earnings summary
create or replace view mentor_earnings_summary_v as
select 
  mentor_id,
  sum(price_cents) filter (where status = 'completed') as total_earned_cents,
  sum(price_cents) filter (where status = 'confirmed') as pending_cents,
  count(*) filter (where status = 'completed') as completed_sessions,
  count(*) filter (where status = 'confirmed') as upcoming_sessions
from bookings
group by mentor_id;

-- ============================================
-- FUNCTIONS
-- ============================================

-- Calculate mentor profile completion
create or replace function calculate_mentor_profile_completion(p_mentor_id uuid)
returns int as $$
declare
  v_score int := 0;
  v_mentor record;
begin
  select * into v_mentor from mentors where user_id = p_mentor_id;
  
  if not found then return 0; end if;
  
  -- Basic fields (40 points)
  if v_mentor.display_name is not null and length(v_mentor.display_name) > 0 then v_score := v_score + 5; end if;
  if v_mentor.title is not null and length(v_mentor.title) > 0 then v_score := v_score + 5; end if;
  if v_mentor.bio_short is not null and length(v_mentor.bio_short) >= 80 then v_score := v_score + 10; end if;
  if v_mentor.bio_long is not null and length(v_mentor.bio_long) >= 400 then v_score := v_score + 10; end if;
  if v_mentor.hourly_rate_cents > 0 then v_score := v_score + 5; end if;
  if v_mentor.city is not null then v_score := v_score + 5; end if;
  
  -- Languages (10 points)
  if exists(select 1 from mentor_languages where user_id = p_mentor_id) then v_score := v_score + 10; end if;
  
  -- Categories (15 points)
  if exists(select 1 from mentor_categories where user_id = p_mentor_id) then v_score := v_score + 15; end if;
  
  -- Skills (10 points)
  if exists(select 1 from mentor_skills where user_id = p_mentor_id) then v_score := v_score + 10; end if;
  
  -- Availability (15 points)
  if exists(select 1 from mentor_availability where mentor_id = p_mentor_id) then v_score := v_score + 15; end if;
  
  -- Services (10 points)
  if exists(select 1 from mentor_services where mentor_id = p_mentor_id and is_active = true) then v_score := v_score + 10; end if;
  
  return v_score;
end;
$$ language plpgsql;

-- ============================================
-- COMMENTS
-- ============================================
comment on table mentor_availability is 'Mentor uygunluk takvimi';
comment on table mentor_services is 'Mentor hizmet paketleri';
comment on table mentor_payouts is 'Mentor kazanç ödemeleri';
comment on table corporate_orgs is 'Kurumsal organizasyonlar';
comment on table corporate_members is 'Kurumsal mentor ekip üyeleri';


