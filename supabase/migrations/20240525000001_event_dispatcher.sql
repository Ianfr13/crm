-- Enable pg_net extension for making HTTP requests from Postgres
create extension if not exists "pg_net";

-- Create a function to trigger the Edge Function
create or replace function public.dispatch_message_event()
returns trigger as $$
declare
  project_url text := 'https://PROJECT_REF.supabase.co'; -- REPLACE WITH YOUR PROJECT URL
  anon_key text := 'YOUR_ANON_KEY'; -- REPLACE WITH YOUR ANON KEY
begin
  -- In a real scenario, you would use pg_net to call the Edge Function
  -- OR use Supabase Database Webhooks UI to configure this.
  -- For this migration file, we will define the trigger but the actual HTTP call 
  -- setup is often done via the Dashboard or requires specific pg_net config.
  
  -- Alternative: Use Supabase's built-in webhook feature (hooks).
  -- Since we cannot easily configure the URL dynamically here without user input,
  -- we will create the trigger function that *would* call the edge function.
  
  -- For MVP, we will assume the user sets up the Database Webhook in the Dashboard
  -- pointing to the 'dispatch-event' function.
  
  return new;
end;
$$ language plpgsql;

-- Trigger
create trigger on_message_created
after insert on messages
for each row execute function public.dispatch_message_event();

-- NOTE: The actual HTTP call configuration is best done via Supabase Dashboard > Database > Webhooks
-- because it handles the secure signing and URL configuration better than raw SQL with pg_net 
-- unless we have the exact Edge Function URL.
