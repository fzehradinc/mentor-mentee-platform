-- BiMentor | Mentee Rich Preferences
-- interests, goalType, priorities

-- ============================================
-- MENTEE INTERESTS (çoklu seçim: 1-5)
-- ============================================
create table if not exists mentee_interests (
  user_id uuid references app_users(id) on delete cascade,
  interest text not null check (interest in (
    'yazilim','veri_ai','urun','tasarim_ux','pazarlama','satis_bd',
    'finans_yatirim','girisim','kariyer_liderlik','akademik','verimlilik','yurtdisi_dil'
  )),
  primary key (user_id, interest),
  created_at timestamptz not null default now()
);

create index idx_mentee_interests_interest on mentee_interests(interest);

-- ============================================
-- GOAL TYPE (tek seçim) - mentees tablosuna ekle
-- ============================================
alter table mentees
  add column if not exists goal_type text
  check (goal_type in (
    'temel_bilgi','somut_hedef','ise_giris_terfi','sektor_degisim',
    'yurtdisi_basvuru','girisim','finans','akademik'
  ));

create index idx_mentees_goal_type on mentees(goal_type);

-- ============================================
-- MENTEE PRIORITIES (tam 3 seçim)
-- ============================================
create table if not exists mentee_priorities (
  user_id uuid references app_users(id) on delete cascade,
  priority text not null check (priority in (
    'cv_portfoy','mock_interview','yol_haritasi','teknik_kocluk',
    'proje_danismanligi','network_tanitimi','ucret_pazarligi',
    'borsa_portfoy','akademik_danismanlik','yurtdisi_dokuman'
  )),
  primary key (user_id, priority),
  created_at timestamptz not null default now()
);

create index idx_mentee_priorities_priority on mentee_priorities(priority);

-- ============================================
-- CONSTRAINT: Exactly 3 priorities per user
-- ============================================
-- Note: Bu constraint trigger ile de uygulanabilir, 
-- ancak şimdilik application-level'da kontrol ediyoruz
-- İleride trigger eklenebilir:
/*
create or replace function check_mentee_priorities_count()
returns trigger as $$
begin
  if (select count(*) from mentee_priorities where user_id = NEW.user_id) >= 3 then
    raise exception 'Her mentee en fazla 3 öncelik seçebilir';
  end if;
  return NEW;
end;
$$ language plpgsql;

create trigger enforce_priorities_limit
  before insert on mentee_priorities
  for each row execute function check_mentee_priorities_count();
*/

-- ============================================
-- COMMENTS for documentation
-- ============================================
comment on table mentee_interests is 'Mentee ilgi alanları (1-5 adet)';
comment on table mentee_priorities is 'Mentee öncelikleri (tam 3 adet)';
comment on column mentees.goal_type is 'Mentee hedef tipi (tek seçim)';


