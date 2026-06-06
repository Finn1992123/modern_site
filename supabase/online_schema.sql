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
alter table public.lesson_progress enable row level security;

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
