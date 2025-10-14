-- BiMentor | Workshop Modülü
-- workshops, workshop_sessions, workshop_requests

-- ============================================
-- WORKSHOPS (Ana Workshop Tablosu)
-- ============================================
create table if not exists workshops (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  cover_image text,
  short_desc text not null,
  full_desc text,
  category text not null check (category in (
    'yazilim','veri_ai','urun','tasarim_ux','pazarlama',
    'satis_bd','finans_yatirim','girisim','kariyer_liderlik',
    'akademik','verimlilik','yurtdisi_dil'
  )),
  level text not null check (level in ('beginner','intermediate','advanced')),
  mode text not null check (mode in ('online','offline','hybrid')),
  price_cents int,  -- null = "talep et" modu
  currency text default 'TRY',
  capacity int,
  status text not null default 'draft' check (status in ('draft','published','completed','canceled')),
  created_by uuid references app_users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_workshops_slug on workshops(slug);
create index idx_workshops_category on workshops(category);
create index idx_workshops_level on workshops(level);
create index idx_workshops_status on workshops(status);
create index idx_workshops_published on workshops(status) where status = 'published';

-- ============================================
-- WORKSHOP SESSIONS (Oturum / Tarih Bilgileri)
-- ============================================
create table if not exists workshop_sessions (
  id uuid primary key default gen_random_uuid(),
  workshop_id uuid not null references workshops(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  location text,  -- online ise link, offline ise adres
  created_at timestamptz not null default now()
);

create index idx_workshop_sessions_workshop on workshop_sessions(workshop_id, starts_at);
create index idx_workshop_sessions_upcoming on workshop_sessions(starts_at) where starts_at >= now();

-- ============================================
-- WORKSHOP INSTRUCTORS (Eğitmenler)
-- ============================================
create table if not exists workshop_instructors (
  workshop_id uuid not null references workshops(id) on delete cascade,
  instructor_id uuid not null references app_users(id) on delete cascade,
  role text not null default 'instructor' check (role in ('instructor','moderator','speaker')),
  bio text,
  primary key (workshop_id, instructor_id)
);

-- ============================================
-- WORKSHOP REQUESTS (Katılım Talepleri)
-- ============================================
create table if not exists workshop_requests (
  id uuid primary key default gen_random_uuid(),
  workshop_id uuid not null references workshops(id) on delete cascade,
  requester_id uuid references app_users(id) on delete set null,  -- nullable (guest requests)
  requester_email text not null,  -- guest email için
  requester_name text not null,
  preferred_times text[],  -- JSON array: ["2024-01-15T10:00", "2024-01-16T14:00"]
  message text,
  participant_type text check (participant_type in ('student','professional','corporate')),
  status text not null default 'pending' check (status in ('pending','accepted','rejected','contacted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_workshop_requests_workshop on workshop_requests(workshop_id, created_at desc);
create index idx_workshop_requests_requester on workshop_requests(requester_id);
create index idx_workshop_requests_status on workshop_requests(status);

-- ============================================
-- WORKSHOP REGISTRATIONS (Kesin Kayıtlar)
-- ============================================
create table if not exists workshop_registrations (
  id uuid primary key default gen_random_uuid(),
  workshop_id uuid not null references workshops(id) on delete cascade,
  session_id uuid references workshop_sessions(id) on delete set null,
  user_id uuid not null references app_users(id) on delete cascade,
  payment_id uuid references payments(id) on delete set null,
  status text not null default 'registered' check (status in ('registered','attended','no_show','canceled')),
  created_at timestamptz not null default now()
);

create index idx_workshop_registrations_workshop on workshop_registrations(workshop_id);
create index idx_workshop_registrations_user on workshop_registrations(user_id, created_at desc);

-- ============================================
-- WORKSHOP REVIEWS (Katılımcı Yorumları)
-- ============================================
create table if not exists workshop_reviews (
  id uuid primary key default gen_random_uuid(),
  workshop_id uuid not null references workshops(id) on delete cascade,
  user_id uuid not null references app_users(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique(workshop_id, user_id)
);

create index idx_workshop_reviews_workshop on workshop_reviews(workshop_id, created_at desc);

-- ============================================
-- TRIGGERS
-- ============================================
create trigger update_workshops_updated_at before update on workshops
  for each row execute function update_updated_at_column();

create trigger update_workshop_requests_updated_at before update on workshop_requests
  for each row execute function update_updated_at_column();

-- ============================================
-- VIEWS
-- ============================================

-- Published workshops with aggregated data
create or replace view workshops_public_v as
select 
  w.id,
  w.title,
  w.slug,
  w.cover_image,
  w.short_desc,
  w.full_desc,
  w.category,
  w.level,
  w.mode,
  w.price_cents,
  w.currency,
  w.capacity,
  w.status,
  w.created_at,
  -- Next session
  (select min(starts_at) from workshop_sessions where workshop_id = w.id and starts_at >= now()) as next_session_at,
  -- Total sessions
  (select count(*) from workshop_sessions where workshop_id = w.id) as total_sessions,
  -- Average rating
  (select avg(rating)::numeric(3,2) from workshop_reviews where workshop_id = w.id) as avg_rating,
  -- Total reviews
  (select count(*) from workshop_reviews where workshop_id = w.id) as total_reviews,
  -- Total registrations
  (select count(*) from workshop_registrations where workshop_id = w.id) as total_registrations,
  -- Instructors
  (
    select json_agg(json_build_object(
      'id', u.id,
      'name', u.full_name,
      'bio', wi.bio
    ))
    from workshop_instructors wi
    join app_users u on u.id = wi.instructor_id
    where wi.workshop_id = w.id
  ) as instructors
from workshops w
where w.status = 'published';

-- ============================================
-- FUNCTIONS
-- ============================================

-- Get recommended workshops for user
create or replace function get_recommended_workshops(p_user_id uuid, p_limit int default 3)
returns table (
  workshop_id uuid,
  title text,
  category text,
  match_score int
) as $$
begin
  return query
  select 
    w.id as workshop_id,
    w.title,
    w.category,
    -- Simple matching: count how many user interests match workshop category
    (
      select count(*)::int
      from mentee_interests mi
      where mi.user_id = p_user_id
      and mi.interest = w.category
    ) as match_score
  from workshops w
  where w.status = 'published'
  order by match_score desc, w.created_at desc
  limit p_limit;
end;
$$ language plpgsql;

-- ============================================
-- COMMENTS
-- ============================================
comment on table workshops is 'Workshop ana bilgileri';
comment on table workshop_sessions is 'Workshop oturum tarihleri';
comment on table workshop_instructors is 'Workshop eğitmenleri';
comment on table workshop_requests is 'Workshop katılım talepleri';
comment on table workshop_registrations is 'Kesinleşmiş workshop kayıtları';
comment on table workshop_reviews is 'Workshop değerlendirmeleri';


