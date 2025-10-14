-- BiMentor | Views & RPCs
-- Public views ve helper functions

-- ============================================
-- PUBLIC MENTOR VIEW (Ana sayfa listesi için)
-- ============================================
create or replace view mentors_public_v as
select 
  m.user_id as id,
  m.display_name,
  m.title,
  m.years_experience,
  m.rating_avg,
  m.total_reviews,
  m.hourly_rate_cents,
  m.mentor_type,
  m.bio_short,
  m.city,
  m.country,
  m.status,
  coalesce(c.name, null) as company_name,
  -- Aggregate languages
  (select array_agg(lang_code) from mentor_languages where user_id = m.user_id) as languages,
  -- Aggregate categories
  (select array_agg(category) from mentor_categories where user_id = m.user_id) as categories,
  -- Aggregate skills
  (select array_agg(skill) from mentor_skills where user_id = m.user_id) as skills
from mentors m
left join mentor_company_membership mm on mm.mentor_id = m.user_id
left join companies c on c.id = mm.company_id
where m.status = 'verified';

-- ============================================
-- CREATE APP USER RPC (Şifre hashleme ile)
-- ============================================
create or replace function create_app_user(
  p_email text,
  p_full_name text,
  p_role text,
  p_password text
)
returns json
language plpgsql
security definer
as $$
declare
  v_user_id uuid;
  v_result json;
begin
  -- Email kontrolü
  if exists (select 1 from app_users where email = p_email) then
    raise exception 'Email already exists';
  end if;

  -- Kullanıcı oluştur
  insert into app_users(email, full_name, role, password_hash)
  values (p_email, p_full_name, p_role, crypt(p_password, gen_salt('bf')))
  returning id into v_user_id;

  -- JSON olarak dön
  select json_build_object(
    'id', v_user_id,
    'email', p_email,
    'full_name', p_full_name,
    'role', p_role
  ) into v_result;

  return v_result;
end$$;

-- ============================================
-- VERIFY USER PASSWORD RPC (Login için)
-- ============================================
create or replace function verify_user_password(
  p_email text,
  p_password text
)
returns json
language plpgsql
security definer
as $$
declare
  v_user app_users;
  v_result json;
begin
  -- Kullanıcıyı bul
  select * into v_user
  from app_users
  where email = p_email;

  if not found then
    raise exception 'Invalid credentials';
  end if;

  -- Şifre kontrolü
  if v_user.password_hash != crypt(p_password, v_user.password_hash) then
    raise exception 'Invalid credentials';
  end if;

  -- JSON olarak dön (şifre hash'i olmadan)
  select json_build_object(
    'id', v_user.id,
    'email', v_user.email,
    'full_name', v_user.full_name,
    'role', v_user.role
  ) into v_result;

  return v_result;
end$$;

-- ============================================
-- GET MENTOR PROFILE (Detay sayfası için)
-- ============================================
create or replace function get_mentor_profile(p_mentor_id uuid)
returns json
language plpgsql
as $$
declare
  v_result json;
begin
  select json_build_object(
    'id', m.user_id,
    'display_name', m.display_name,
    'title', m.title,
    'years_experience', m.years_experience,
    'hourly_rate_cents', m.hourly_rate_cents,
    'rating_avg', m.rating_avg,
    'total_reviews', m.total_reviews,
    'mentor_type', m.mentor_type,
    'bio_short', m.bio_short,
    'bio_long', m.bio_long,
    'city', m.city,
    'country', m.country,
    'meeting_preference', m.meeting_preference,
    'languages', (select array_agg(lang_code) from mentor_languages where user_id = m.user_id),
    'categories', (select array_agg(category) from mentor_categories where user_id = m.user_id),
    'skills', (select array_agg(skill) from mentor_skills where user_id = m.user_id),
    'company', (
      select json_build_object(
        'name', c.name,
        'website', c.website
      )
      from mentor_company_membership mm
      join companies c on c.id = mm.company_id
      where mm.mentor_id = m.user_id
      limit 1
    )
  ) into v_result
  from mentors m
  where m.user_id = p_mentor_id and m.status = 'verified';

  return v_result;
end$$;

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
create index if not exists idx_mentors_verified on mentors(status) where status = 'verified';
create index if not exists idx_mentors_rating_verified on mentors(rating_avg desc) where status = 'verified';


