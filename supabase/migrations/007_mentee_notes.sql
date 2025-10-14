-- BiMentor | Mentee Notes
-- Personal notes for mentees

create table if not exists mentee_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references app_users(id) on delete cascade,
  title text not null,
  content text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_mentee_notes_user_id on mentee_notes(user_id, updated_at desc);

-- Trigger for updated_at
create trigger update_mentee_notes_updated_at before update on mentee_notes
  for each row execute function update_updated_at_column();

comment on table mentee_notes is 'Mentee kişisel notları';


