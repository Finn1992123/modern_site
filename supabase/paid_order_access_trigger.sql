create or replace function public.activate_course_access_from_paid_order()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  course_access_days integer;
begin
  if new.status = 'paid' and old.status is distinct from 'paid' then
    select access_days
    into course_access_days
    from public.on_demand_courses
    where id = new.course_id;

    insert into public.course_access (
      user_id,
      course_id,
      order_id,
      starts_at,
      expires_at
    )
    values (
      new.user_id,
      new.course_id,
      new.id,
      coalesce(new.paid_at, now()),
      coalesce(new.paid_at, now()) + make_interval(days => coalesce(course_access_days, 365))
    )
    on conflict (user_id, course_id) do update
    set
      order_id = excluded.order_id,
      expires_at = greatest(public.course_access.expires_at, excluded.expires_at);
  end if;

  return new;
end;
$$;

drop trigger if exists orders_activate_course_access on public.orders;
create trigger orders_activate_course_access
after update of status on public.orders
for each row execute function public.activate_course_access_from_paid_order();
