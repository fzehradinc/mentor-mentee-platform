-- BiMentor | Temel Şema
-- users, mentees, mentors, companies

-- pgcrypto extension (şifre hashleme için)
create extension if not exists pgcrypto;

-- ============================================
-- APP USERS (Tüm kullanıcılar)
-- ============================================
create table if not exists app_users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text not null,
  role text not null check (role in ('mentee','mentor','admin')),
  password_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_app_users_email on app_users(email);
create index idx_app_users_role on app_users(role);

-- ============================================
-- USER CONSENTS (KVKK onayları)
-- ============================================
create table if not exists user_consents (
  user_id uuid primary key references app_users(id) on delete cascade,
  kvkk_accepted_at timestamptz not null,
  marketing_opt_in boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================
-- MENTEES
-- ============================================
create table if not exists mentees (
  user_id uuid primary key references app_users(id) on delete cascade,
  short_goal text not null,
  target_track text not null,
  budget text not null check (budget in ('0_500','500_1000','1000_plus')),
  time_preference text not null check (time_preference in ('weekday_evening','weekend','flexible')),
  city text,
  country text default 'Turkey',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_mentees_target_track on mentees(target_track);
create index idx_mentees_budget on mentees(budget);

-- ============================================
-- MENTEE LANGUAGES
-- ============================================
create table if not exists mentee_languages (
  user_id uuid references app_users(id) on delete cascade,
  lang_code text not null,
  primary key (user_id, lang_code)
);

-- ============================================
-- MENTORS
-- ============================================
create table if not exists mentors (
  user_id uuid primary key references app_users(id) on delete cascade,
  mentor_type text not null check (mentor_type in ('individual','corporate')),
  display_name text not null,
  title text not null,
  years_experience int not null default 0,
  hourly_rate_cents int not null check (hourly_rate_cents >= 10000),
  meeting_preference text not null check (meeting_preference in ('platform_internal','zoom','google_meet','flexible')),
  bio_short text not null check (char_length(bio_short) between 80 and 160),
  bio_long text not null check (char_length(bio_long) between 400 and 1200),
  city text,
  country text default 'Turkey',
  rating_avg numeric(3,2) default 0.00,
  total_reviews int default 0,
  status text not null default 'pending_verification' check (status in ('pending_verification','verified','suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_mentors_type on mentors(mentor_type);
create index idx_mentors_status on mentors(status);
create index idx_mentors_rating on mentors(rating_avg desc);

-- ============================================
-- MENTOR LANGUAGES
-- ============================================
create table if not exists mentor_languages (
  user_id uuid references app_users(id) on delete cascade,
  lang_code text not null,
  primary key (user_id, lang_code)
);

-- ============================================
-- MENTOR CATEGORIES
-- ============================================
create table if not exists mentor_categories (
  user_id uuid references app_users(id) on delete cascade,
  category text not null,
  primary key (user_id, category)
);

create index idx_mentor_categories_category on mentor_categories(category);

-- ============================================
-- MENTOR SKILLS
-- ============================================
create table if not exists mentor_skills (
  user_id uuid references app_users(id) on delete cascade,
  skill text not null,
  primary key (user_id, skill)
);

-- ============================================
-- COMPANIES (Kurumsal mentorlar için)
-- ============================================
create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  website text,
  tax_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_companies_name on companies(name);

-- ============================================
-- MENTOR-COMPANY MEMBERSHIP
-- ============================================
create table if not exists mentor_company_membership (
  mentor_id uuid references app_users(id) on delete cascade,
  company_id uuid references companies(id) on delete cascade,
  role_title text,
  work_email text,
  created_at timestamptz not null default now(),
  primary key (mentor_id, company_id)
);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_app_users_updated_at before update on app_users
  for each row execute function update_updated_at_column();

create trigger update_mentees_updated_at before update on mentees
  for each row execute function update_updated_at_column();

create trigger update_mentors_updated_at before update on mentors
  for each row execute function update_updated_at_column();

create trigger update_companies_updated_at before update on companies
  for each row execute function update_updated_at_column();


