-- BiMentor | Sessions (Bookings)
-- Mentee-initiated sessions with mentors

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  mentee_id uuid not null references app_users(id) on delete cascade,
  mentor_id uuid references app_users(id) on delete set null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'scheduled' check (status in ('scheduled','canceled','completed','pending')),
  notes text,
  meeting_link text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sessions_chk_time check (ends_at > starts_at)
);

create index if not exists idx_sessions_mentee on sessions(mentee_id, starts_at desc);
create index if not exists idx_sessions_mentor on sessions(mentor_id, starts_at desc);
create index if not exists idx_sessions_status on sessions(status, starts_at);

-- Trigger for updated_at
create trigger update_sessions_updated_at before update on sessions
  for each row execute function update_updated_at_column();

comment on table sessions is 'Mentee-Mentor seansları (bookings)';
comment on column sessions.status is 'scheduled: planlandı, pending: onay bekliyor, completed: tamamlandı, canceled: iptal';

