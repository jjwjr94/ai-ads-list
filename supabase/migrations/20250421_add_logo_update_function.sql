
-- Function to update only the logo_url of a company
create or replace function public.update_company_logo(company_id uuid, logo_url_value text)
returns setof companies
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_company companies;
begin
  update public.companies
  set 
    logo_url = logo_url_value,
    last_updated = now()
  where id = company_id
  returning * into updated_company;
  
  return next updated_company;
end;
$$;
