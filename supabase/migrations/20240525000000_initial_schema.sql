-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles (extends auth.users)
create type user_role as enum ('admin', 'manager', 'sales', 'read_only');

create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  role user_role default 'sales',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Contacts
create table contacts (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  name text not null,
  email text,
  phone text,
  tags text[] default '{}',
  pipeline_stage text default 'lead',
  owner_id uuid references profiles(id),
  metadata jsonb default '{}'
);

-- Conversations
create type channel_type as enum ('whatsapp', 'facebook', 'instagram', 'email', 'chat');
create type conversation_status as enum ('open', 'closed', 'snoozed');

create table conversations (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  contact_id uuid references contacts(id) on delete cascade not null,
  channel channel_type not null,
  status conversation_status default 'open',
  assigned_to uuid references profiles(id),
  last_message_at timestamptz default now(),
  unread_count int default 0,
  metadata jsonb default '{}'
);

-- Messages
create type sender_type as enum ('user', 'contact', 'agent', 'system');

create table messages (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamptz default now(),
  conversation_id uuid references conversations(id) on delete cascade not null,
  sender_type sender_type not null,
  sender_id uuid, -- could be profile_id or null if contact/system
  content text,
  attachments jsonb[] default '{}', -- [{url, type, name}]
  read_at timestamptz,
  metadata jsonb default '{}'
);

-- Integrations
create table integrations (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamptz default now(),
  provider text not null, -- 'meta', 'evolution', etc.
  config jsonb not null default '{}',
  status text default 'active',
  encrypted_credentials text
);

-- Agent Registrations
create table agent_registrations (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamptz default now(),
  name text not null,
  webhook_url text not null,
  events text[] default '{}',
  secret_key text not null,
  is_active boolean default true
);

-- RLS Policies (Basic)
alter table profiles enable row level security;
alter table contacts enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;
alter table integrations enable row level security;
alter table agent_registrations enable row level security;

-- Policies (Allow all for authenticated users for MVP, refine later)
create policy "Allow all for authenticated" on profiles for all using (auth.role() = 'authenticated');
create policy "Allow all for authenticated" on contacts for all using (auth.role() = 'authenticated');
create policy "Allow all for authenticated" on conversations for all using (auth.role() = 'authenticated');
create policy "Allow all for authenticated" on messages for all using (auth.role() = 'authenticated');
create policy "Allow all for authenticated" on integrations for all using (auth.role() = 'authenticated');
create policy "Allow all for authenticated" on agent_registrations for all using (auth.role() = 'authenticated');

-- Realtime
alter publication supabase_realtime add table conversations;
alter publication supabase_realtime add table messages;

-- Storage
insert into storage.buckets (id, name, public)
values ('attachments', 'attachments', true)
on conflict (id) do nothing;

create policy "Authenticated can upload attachments"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'attachments' );

create policy "Public can view attachments"
on storage.objects for select
to public
using ( bucket_id = 'attachments' );
