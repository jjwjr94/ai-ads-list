
-- Function to update only the logo_url of a company
create or replace function public.update_company_logo(company_id uuid, logo_url_value text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_company json;
begin
  update public.companies
  set 
    logo_url = logo_url_value,
    last_updated = now()
  where id = company_id
  returning to_json(companies.*) into updated_company;
  
  return updated_company;
end;
$$;
