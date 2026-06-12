create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.on_demand_courses (
  id uuid primary key default gen_random_uuid(),
  language_code text not null check (language_code in ('english', 'french', 'german', 'spanish')),
  language_name text not null,
  level text not null check (level in ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  title text not null,
  description text,
  price_cents integer not null default 15000 check (price_cents >= 0),
  currency text not null default 'EUR',
  access_days integer not null default 365 check (access_days > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (language_code, level)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.on_demand_courses(id),
  status text not null default 'pending' check (status in ('pending', 'paid', 'cancelled', 'failed', 'refunded')),
  amount_cents integer not null check (amount_cents >= 0),
  currency text not null default 'EUR',
  provider text,
  provider_session_id text,
  provider_payment_id text,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create table if not exists public.course_access (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.on_demand_courses(id),
  order_id uuid references public.orders(id) on delete set null,
  starts_at timestamptz not null default now(),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  unique (user_id, course_id)
);

create table if not exists public.course_units (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.on_demand_courses(id) on delete cascade,
  title text not null,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.course_lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.on_demand_courses(id) on delete cascade,
  unit_id uuid not null references public.course_units(id) on delete cascade,
  title text not null,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.lesson_videos (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.course_lessons(id) on delete cascade,
  title text not null,
  description text,
  storage_path text,
  external_url text,
  thumbnail_path text,
  duration_seconds integer check (duration_seconds is null or duration_seconds >= 0),
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  check (storage_path is not null or external_url is not null)
);

create table if not exists public.lesson_vocabulary (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.course_lessons(id) on delete cascade,
  word text not null,
  translation text not null,
  audio_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.lesson_listening_questions (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.course_lessons(id) on delete cascade,
  prompt text,
  audio_url text,
  spoken_text text,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  correct_option text not null check (correct_option in ('A', 'B', 'C', 'D')),
  explanation text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  check (audio_url is not null or spoken_text is not null)
);

create table if not exists public.lesson_multiple_choice_questions (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.course_lessons(id) on delete cascade,
  sentence text not null,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  correct_option text not null check (correct_option in ('A', 'B', 'C', 'D')),
  explanation text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.lesson_gap_fill_questions (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.course_lessons(id) on delete cascade,
  text_template text not null,
  answers jsonb not null,
  hint text,
  explanation text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  check (jsonb_typeof(answers) = 'object')
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.on_demand_courses(id),
  lesson_key text not null,
  completed_at timestamptz,
  score integer check (score is null or (score >= 0 and score <= 100)),
  updated_at timestamptz not null default now(),
  unique (user_id, course_id, lesson_key)
);

create table if not exists public.user_lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.on_demand_courses(id) on delete cascade,
  lesson_id uuid not null references public.course_lessons(id) on delete cascade,
  completed_at timestamptz,
  score integer check (score is null or (score >= 0 and score <= 100)),
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create table if not exists public.user_exercise_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.course_lessons(id) on delete cascade,
  exercise_type text not null check (exercise_type in ('listening', 'multiple_choice', 'gap_fill')),
  question_id uuid not null,
  selected_answer text,
  is_correct boolean not null,
  created_at timestamptz not null default now()
);

create table if not exists public.user_exercise_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.course_lessons(id) on delete cascade,
  exercise_type text not null check (exercise_type in ('listening', 'multiple_choice', 'gap_fill')),
  score_percent integer not null check (score_percent >= 0 and score_percent <= 100),
  correct_count integer not null default 0 check (correct_count >= 0),
  question_count integer not null default 0 check (question_count >= 0),
  passed boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id, exercise_type)
);

create table if not exists public.user_course_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.on_demand_courses(id) on delete cascade,
  completed_lessons integer not null default 0 check (completed_lessons >= 0),
  total_lessons integer not null default 0 check (total_lessons >= 0),
  progress_percent integer not null default 0 check (progress_percent >= 0 and progress_percent <= 100),
  average_score integer check (average_score is null or (average_score >= 0 and average_score <= 100)),
  updated_at timestamptz not null default now(),
  unique (user_id, course_id)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists lesson_progress_set_updated_at on public.lesson_progress;
create trigger lesson_progress_set_updated_at
before update on public.lesson_progress
for each row execute function public.set_updated_at();

drop trigger if exists user_lesson_progress_set_updated_at on public.user_lesson_progress;
create trigger user_lesson_progress_set_updated_at
before update on public.user_lesson_progress
for each row execute function public.set_updated_at();

drop trigger if exists user_course_progress_set_updated_at on public.user_course_progress;
create trigger user_course_progress_set_updated_at
before update on public.user_course_progress
for each row execute function public.set_updated_at();

drop trigger if exists user_exercise_results_set_updated_at on public.user_exercise_results;
create trigger user_exercise_results_set_updated_at
before update on public.user_exercise_results
for each row execute function public.set_updated_at();

create index if not exists course_units_course_id_sort_order_idx
on public.course_units (course_id, sort_order);

create index if not exists course_lessons_course_id_sort_order_idx
on public.course_lessons (course_id, sort_order);

create index if not exists course_lessons_unit_id_sort_order_idx
on public.course_lessons (unit_id, sort_order);

create index if not exists lesson_videos_lesson_id_sort_order_idx
on public.lesson_videos (lesson_id, sort_order);

create index if not exists lesson_vocabulary_lesson_id_sort_order_idx
on public.lesson_vocabulary (lesson_id, sort_order);

create index if not exists lesson_listening_questions_lesson_id_sort_order_idx
on public.lesson_listening_questions (lesson_id, sort_order);

create index if not exists lesson_multiple_choice_questions_lesson_id_sort_order_idx
on public.lesson_multiple_choice_questions (lesson_id, sort_order);

create index if not exists lesson_gap_fill_questions_lesson_id_sort_order_idx
on public.lesson_gap_fill_questions (lesson_id, sort_order);

create index if not exists user_lesson_progress_user_id_course_id_idx
on public.user_lesson_progress (user_id, course_id);

create index if not exists user_exercise_attempts_user_id_lesson_id_idx
on public.user_exercise_attempts (user_id, lesson_id);

create index if not exists user_exercise_attempts_question_idx
on public.user_exercise_attempts (user_id, exercise_type, question_id, is_correct);

create index if not exists user_exercise_results_user_lesson_idx
on public.user_exercise_results (user_id, lesson_id, passed);

create index if not exists user_course_progress_user_id_idx
on public.user_course_progress (user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.email, '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.on_demand_courses enable row level security;
alter table public.orders enable row level security;
alter table public.course_access enable row level security;
alter table public.course_units enable row level security;
alter table public.course_lessons enable row level security;
alter table public.lesson_videos enable row level security;
alter table public.lesson_vocabulary enable row level security;
alter table public.lesson_listening_questions enable row level security;
alter table public.lesson_multiple_choice_questions enable row level security;
alter table public.lesson_gap_fill_questions enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.user_lesson_progress enable row level security;
alter table public.user_exercise_attempts enable row level security;
alter table public.user_exercise_results enable row level security;
alter table public.user_course_progress enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
to authenticated
using (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "courses_select_active" on public.on_demand_courses;
create policy "courses_select_active"
on public.on_demand_courses for select
to anon, authenticated
using (is_active = true);

drop policy if exists "orders_select_own" on public.orders;
create policy "orders_select_own"
on public.orders for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "orders_insert_own_pending" on public.orders;
create policy "orders_insert_own_pending"
on public.orders for insert
to authenticated
with check (user_id = auth.uid() and status = 'pending');

drop policy if exists "course_access_select_own" on public.course_access;
create policy "course_access_select_own"
on public.course_access for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "course_units_select_with_access" on public.course_units;
create policy "course_units_select_with_access"
on public.course_units for select
to authenticated
using (
  is_active = true
  and exists (
    select 1
    from public.course_access access
    where access.course_id = course_units.course_id
      and access.user_id = auth.uid()
      and access.expires_at > now()
  )
);

drop policy if exists "course_lessons_select_with_access" on public.course_lessons;
create policy "course_lessons_select_with_access"
on public.course_lessons for select
to authenticated
using (
  is_active = true
  and exists (
    select 1
    from public.course_access access
    where access.course_id = course_lessons.course_id
      and access.user_id = auth.uid()
      and access.expires_at > now()
  )
);

drop policy if exists "lesson_videos_select_with_access" on public.lesson_videos;
create policy "lesson_videos_select_with_access"
on public.lesson_videos for select
to authenticated
using (
  is_active = true
  and exists (
    select 1
    from public.course_lessons lesson
    join public.course_access access on access.course_id = lesson.course_id
    where lesson.id = lesson_videos.lesson_id
      and lesson.is_active = true
      and access.user_id = auth.uid()
      and access.expires_at > now()
  )
);

drop policy if exists "lesson_vocabulary_select_with_access" on public.lesson_vocabulary;
create policy "lesson_vocabulary_select_with_access"
on public.lesson_vocabulary for select
to authenticated
using (
  exists (
    select 1
    from public.course_lessons lesson
    join public.course_access access on access.course_id = lesson.course_id
    where lesson.id = lesson_vocabulary.lesson_id
      and lesson.is_active = true
      and access.user_id = auth.uid()
      and access.expires_at > now()
  )
);

drop policy if exists "lesson_listening_select_with_access" on public.lesson_listening_questions;
create policy "lesson_listening_select_with_access"
on public.lesson_listening_questions for select
to authenticated
using (
  is_active = true
  and exists (
    select 1
    from public.course_lessons lesson
    join public.course_access access on access.course_id = lesson.course_id
    where lesson.id = lesson_listening_questions.lesson_id
      and lesson.is_active = true
      and access.user_id = auth.uid()
      and access.expires_at > now()
  )
);

drop policy if exists "lesson_multiple_choice_select_with_access" on public.lesson_multiple_choice_questions;
create policy "lesson_multiple_choice_select_with_access"
on public.lesson_multiple_choice_questions for select
to authenticated
using (
  is_active = true
  and exists (
    select 1
    from public.course_lessons lesson
    join public.course_access access on access.course_id = lesson.course_id
    where lesson.id = lesson_multiple_choice_questions.lesson_id
      and lesson.is_active = true
      and access.user_id = auth.uid()
      and access.expires_at > now()
  )
);

drop policy if exists "lesson_gap_fill_select_with_access" on public.lesson_gap_fill_questions;
create policy "lesson_gap_fill_select_with_access"
on public.lesson_gap_fill_questions for select
to authenticated
using (
  is_active = true
  and exists (
    select 1
    from public.course_lessons lesson
    join public.course_access access on access.course_id = lesson.course_id
    where lesson.id = lesson_gap_fill_questions.lesson_id
      and lesson.is_active = true
      and access.user_id = auth.uid()
      and access.expires_at > now()
  )
);

drop policy if exists "lesson_progress_select_own" on public.lesson_progress;
create policy "lesson_progress_select_own"
on public.lesson_progress for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "lesson_progress_insert_own" on public.lesson_progress;
create policy "lesson_progress_insert_own"
on public.lesson_progress for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "lesson_progress_update_own" on public.lesson_progress;
create policy "lesson_progress_update_own"
on public.lesson_progress for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "user_lesson_progress_select_own" on public.user_lesson_progress;
create policy "user_lesson_progress_select_own"
on public.user_lesson_progress for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "user_lesson_progress_insert_own_with_access" on public.user_lesson_progress;
create policy "user_lesson_progress_insert_own_with_access"
on public.user_lesson_progress for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.course_access access
    where access.course_id = user_lesson_progress.course_id
      and access.user_id = auth.uid()
      and access.expires_at > now()
  )
);

drop policy if exists "user_lesson_progress_update_own_with_access" on public.user_lesson_progress;
create policy "user_lesson_progress_update_own_with_access"
on public.user_lesson_progress for update
to authenticated
using (user_id = auth.uid())
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.course_access access
    where access.course_id = user_lesson_progress.course_id
      and access.user_id = auth.uid()
      and access.expires_at > now()
  )
);

drop policy if exists "user_exercise_attempts_select_own" on public.user_exercise_attempts;
create policy "user_exercise_attempts_select_own"
on public.user_exercise_attempts for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "user_exercise_attempts_insert_own_with_access" on public.user_exercise_attempts;
create policy "user_exercise_attempts_insert_own_with_access"
on public.user_exercise_attempts for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.course_lessons lesson
    join public.course_access access on access.course_id = lesson.course_id
    where lesson.id = user_exercise_attempts.lesson_id
      and lesson.is_active = true
      and access.user_id = auth.uid()
      and access.expires_at > now()
  )
);

drop policy if exists "user_exercise_results_select_own" on public.user_exercise_results;
create policy "user_exercise_results_select_own"
on public.user_exercise_results for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "user_exercise_results_insert_own_with_access" on public.user_exercise_results;
create policy "user_exercise_results_insert_own_with_access"
on public.user_exercise_results for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.course_lessons lesson
    join public.course_access access on access.course_id = lesson.course_id
    where lesson.id = user_exercise_results.lesson_id
      and lesson.is_active = true
      and access.user_id = auth.uid()
      and access.expires_at > now()
  )
);

drop policy if exists "user_exercise_results_update_own_with_access" on public.user_exercise_results;
create policy "user_exercise_results_update_own_with_access"
on public.user_exercise_results for update
to authenticated
using (user_id = auth.uid())
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.course_lessons lesson
    join public.course_access access on access.course_id = lesson.course_id
    where lesson.id = user_exercise_results.lesson_id
      and lesson.is_active = true
      and access.user_id = auth.uid()
      and access.expires_at > now()
  )
);

drop policy if exists "user_course_progress_select_own" on public.user_course_progress;
create policy "user_course_progress_select_own"
on public.user_course_progress for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "user_course_progress_upsert_own_with_access" on public.user_course_progress;
create policy "user_course_progress_upsert_own_with_access"
on public.user_course_progress for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.course_access access
    where access.course_id = user_course_progress.course_id
      and access.user_id = auth.uid()
      and access.expires_at > now()
  )
);

drop policy if exists "user_course_progress_update_own_with_access" on public.user_course_progress;
create policy "user_course_progress_update_own_with_access"
on public.user_course_progress for update
to authenticated
using (user_id = auth.uid())
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.course_access access
    where access.course_id = user_course_progress.course_id
      and access.user_id = auth.uid()
      and access.expires_at > now()
  )
);

insert into public.on_demand_courses (language_code, language_name, level, title, description)
select language_code, language_name, level, title, description
from (
  values
    ('english', 'Αγγλικά', 'A1', 'Αγγλικά A1', 'Beginner επίπεδο για τα πρώτα βήματα.'),
    ('english', 'Αγγλικά', 'A2', 'Αγγλικά A2', 'Elementary επίπεδο για καθημερινή επικοινωνία.'),
    ('english', 'Αγγλικά', 'B1', 'Αγγλικά B1', 'Intermediate επίπεδο για πιο άνετη χρήση.'),
    ('english', 'Αγγλικά', 'B2', 'Αγγλικά B2', 'Upper Intermediate επίπεδο για μεγαλύτερη αυτονομία.'),
    ('english', 'Αγγλικά', 'C1', 'Αγγλικά C1', 'Advanced επίπεδο για ακρίβεια και ευχέρεια.'),
    ('english', 'Αγγλικά', 'C2', 'Αγγλικά C2', 'Proficiency επίπεδο για απαιτητική χρήση.'),
    ('french', 'Γαλλικά', 'A1', 'Γαλλικά A1', 'Beginner επίπεδο για τα πρώτα βήματα.'),
    ('french', 'Γαλλικά', 'A2', 'Γαλλικά A2', 'Elementary επίπεδο για καθημερινή επικοινωνία.'),
    ('french', 'Γαλλικά', 'B1', 'Γαλλικά B1', 'Intermediate επίπεδο για πιο άνετη χρήση.'),
    ('french', 'Γαλλικά', 'B2', 'Γαλλικά B2', 'Upper Intermediate επίπεδο για μεγαλύτερη αυτονομία.'),
    ('french', 'Γαλλικά', 'C1', 'Γαλλικά C1', 'Advanced επίπεδο για ακρίβεια και ευχέρεια.'),
    ('french', 'Γαλλικά', 'C2', 'Γαλλικά C2', 'Proficiency επίπεδο για απαιτητική χρήση.'),
    ('german', 'Γερμανικά', 'A1', 'Γερμανικά A1', 'Beginner επίπεδο για τα πρώτα βήματα.'),
    ('german', 'Γερμανικά', 'A2', 'Γερμανικά A2', 'Elementary επίπεδο για καθημερινή επικοινωνία.'),
    ('german', 'Γερμανικά', 'B1', 'Γερμανικά B1', 'Intermediate επίπεδο για πιο άνετη χρήση.'),
    ('german', 'Γερμανικά', 'B2', 'Γερμανικά B2', 'Upper Intermediate επίπεδο για μεγαλύτερη αυτονομία.'),
    ('german', 'Γερμανικά', 'C1', 'Γερμανικά C1', 'Advanced επίπεδο για ακρίβεια και ευχέρεια.'),
    ('german', 'Γερμανικά', 'C2', 'Γερμανικά C2', 'Proficiency επίπεδο για απαιτητική χρήση.'),
    ('spanish', 'Ισπανικά', 'A1', 'Ισπανικά A1', 'Beginner επίπεδο για τα πρώτα βήματα.'),
    ('spanish', 'Ισπανικά', 'A2', 'Ισπανικά A2', 'Elementary επίπεδο για καθημερινή επικοινωνία.'),
    ('spanish', 'Ισπανικά', 'B1', 'Ισπανικά B1', 'Intermediate επίπεδο για πιο άνετη χρήση.'),
    ('spanish', 'Ισπανικά', 'B2', 'Ισπανικά B2', 'Upper Intermediate επίπεδο για μεγαλύτερη αυτονομία.'),
    ('spanish', 'Ισπανικά', 'C1', 'Ισπανικά C1', 'Advanced επίπεδο για ακρίβεια και ευχέρεια.'),
    ('spanish', 'Ισπανικά', 'C2', 'Ισπανικά C2', 'Proficiency επίπεδο για απαιτητική χρήση.')
) as seed(language_code, language_name, level, title, description)
on conflict (language_code, level) do update
set
  language_name = excluded.language_name,
  title = excluded.title,
  description = excluded.description,
  price_cents = 15000,
  currency = 'EUR',
  access_days = 365,
  is_active = true;
