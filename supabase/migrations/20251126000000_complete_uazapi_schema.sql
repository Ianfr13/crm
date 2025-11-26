-- Migration: Complete Uazapi Schema
-- Created: 2025-11-26
-- Description: Complete schema based on SCHEMA.yaml for Uazapi integration

-- Instance table (Whats App instances)
CREATE TABLE IF NOT EXISTS instances (
  id TEXT PRIMARY KEY DEFAULT ('i' || substr(md5(random()::text), 1, 10)),
  token TEXT,
  status TEXT,
  paircode TEXT,
  qrcode TEXT,
  name TEXT,
  profile_name TEXT,
  profile_pic_url TEXT,
  is_business BOOLEAN DEFAULT false,
  plataform TEXT,
  system_name TEXT DEFAULT 'uazapi',
  owner TEXT,
  last_disconnect TEXT,
  last_disconnect_reason TEXT,
  admin_field_01 TEXT,
  admin_field_02 TEXT,
  openai_apikey TEXT,
  chatbot_enabled BOOLEAN DEFAULT false,
  chatbot_ignore_groups BOOLEAN DEFAULT false,
  chatbot_stop_conversation TEXT,
  chatbot_stop_minutes INTEGER,
  chatbot_stop_when_you_send_msg INTEGER,
  msg_delay_min INTEGER DEFAULT 2,
  msg_delay_max INTEGER DEFAULT 4,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Webhooks table
CREATE TABLE IF NOT EXISTS webhooks (
  id TEXT PRIMARY KEY DEFAULT ('wh_' || substr(md5(random()::text), 1, 10)),
  instance_id TEXT REFERENCES instances(id) ON DELETE CASCADE,
  enabled BOOLEAN DEFAULT true,
  url TEXT NOT NULL,
  events TEXT[] NOT NULL,
  add_url_types_messages BOOLEAN DEFAULT false,
  add_url_events BOOLEAN DEFAULT false,
  exclude_messages TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chats table (WhatsApp conversations)
CREATE TABLE IF NOT EXISTS chats (
  id TEXT PRIMARY KEY DEFAULT ('r' || substr(md5(random()::text), 1, 7)),
  wa_fastid TEXT,
  wa_chatid TEXT UNIQUE,
  wa_archived BOOLEAN DEFAULT false,
  wa_contact_name TEXT,
  wa_name TEXT,
  name TEXT,
  image TEXT,
  image_preview TEXT,
  wa_ephemeral_expiration INTEGER,
  wa_is_blocked BOOLEAN DEFAULT false,
  wa_is_group BOOLEAN DEFAULT false,
  wa_is_group_admin BOOLEAN DEFAULT false,
  wa_is_group_announce BOOLEAN DEFAULT false,
  wa_is_group_community BOOLEAN DEFAULT false,
  wa_is_group_member BOOLEAN DEFAULT false,
  wa_is_pinned BOOLEAN DEFAULT false,
  wa_label TEXT,
  wa_last_message_text_vote TEXT,
  wa_last_message_type TEXT,
  wa_last_msg_timestamp BIGINT,
  wa_last_message_sender TEXT,
  wa_mute_end_time BIGINT,
  owner TEXT,
  wa_unread_count INTEGER DEFAULT 0,
  phone TEXT,
  wa_common_groups TEXT,
  
  -- Lead fields
  lead_name TEXT,
  lead_full_name TEXT,
  lead_email TEXT,
  lead_personalid TEXT,
  lead_status TEXT,
  lead_tags TEXT,
  lead_notes TEXT,
  lead_is_ticket_open BOOLEAN DEFAULT false,
  lead_assigned_attendant_id TEXT,
  lead_kanban_order INTEGER,
  lead_field_01 TEXT,
  lead_field_02 TEXT,
  lead_field_03 TEXT,
  lead_field_04 TEXT,
  lead_field_05 TEXT,
  lead_field_06 TEXT,
  lead_field_07 TEXT,
  lead_field_08 TEXT,
  lead_field_09 TEXT,
  lead_field_10 TEXT,
  lead_field_11 TEXT,
  lead_field_12 TEXT,
  lead_field_13 TEXT,
  lead_field_14 TEXT,
  lead_field_15 TEXT,
  lead_field_16 TEXT,
  lead_field_17 TEXT,
  lead_field_18 TEXT,
  lead_field_19 TEXT,
  lead_field_20 TEXT,
  
  -- Chatbot fields
  chatbot_agent_reset_memory_at BIGINT,
  chatbot_last_trigger_id TEXT,
  chatbot_last_trigger_at BIGINT,
  chatbot_disable_until BIGINT,
  
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages table (extending existing or creating new)
CREATE TABLE IF NOT EXISTS wa_messages (
  id TEXT PRIMARY KEY DEFAULT ('r' || substr(md5(random()::text), 1, 7)),
  messageid TEXT,
  chatid TEXT REFERENCES chats(id) ON DELETE CASCADE,
  from_me BOOLEAN DEFAULT false,
  is_group BOOLEAN DEFAULT false,
  message_type TEXT,
  message_timestamp BIGINT,
  edited TEXT,
  quoted TEXT,
  reaction TEXT,
  sender TEXT,
  sender_name TEXT,
  source TEXT,
  status TEXT,
  text TEXT,
  vote TEXT,
  button_or_listid TEXT,
  convert_options TEXT,
  file_url TEXT,
  content JSONB,
  owner TEXT,
  track_source TEXT,
  track_id TEXT,
  ai_metadata JSONB,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Labels table
CREATE TABLE IF NOT EXISTS labels (
  id TEXT PRIMARY KEY DEFAULT ('l' || substr(md5(random()::text), 1, 9)),
  name TEXT NOT NULL,
  color INTEGER,
  color_hex TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Attendants table
CREATE TABLE IF NOT EXISTS attendants (
  id TEXT PRIMARY KEY DEFAULT ('r' || substr(md5(random()::text), 1, 7)),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  department TEXT,
  custom_field_01 TEXT,
  custom_field_02 TEXT,
  owner TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chatbot Triggers table
CREATE TABLE IF NOT EXISTS chatbot_triggers (
  id TEXT PRIMARY KEY DEFAULT ('r' || substr(md5(random()::text), 1, 7)),
  active BOOLEAN DEFAULT true,
  type TEXT NOT NULL, -- 'agent' or 'quickreply'
  agent_id TEXT,
  quick_reply_id TEXT,
  ignore_groups BOOLEAN DEFAULT false,
  lead_field TEXT,
  lead_operator TEXT,
  lead_value TEXT,
  priority INTEGER,
  words_to_start TEXT,
  response_delay_seconds INTEGER,
  owner TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chatbot AI Agents table
CREATE TABLE IF NOT EXISTS chatbot_ai_agents (
  id TEXT PRIMARY KEY DEFAULT ('r' || substr(md5(random()::text), 1, 7)),
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  apikey TEXT NOT NULL,
  base_prompt TEXT,
  max_tokens INTEGER,
  temperature INTEGER,
  diversity_level INTEGER,
  frequency_penalty INTEGER,
  presence_penalty INTEGER,
  sign_messages BOOLEAN DEFAULT false,
  read_messages BOOLEAN DEFAULT false,
  max_message_length INTEGER,
  typing_delay_seconds INTEGER,
  context_time_window_hours INTEGER,
  context_max_messages INTEGER,
  context_min_messages INTEGER,
  owner TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chatbot AI Functions table
CREATE TABLE IF NOT EXISTS chatbot_ai_functions (
  id TEXT PRIMARY KEY DEFAULT ('r' || substr(md5(random()::text), 1, 7)),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  method TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  headers TEXT,
  body TEXT,
  parameters TEXT,
  undocumented_parameters TEXT,
  header_error BOOLEAN DEFAULT false,
  body_error BOOLEAN DEFAULT false,
  owner TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chatbot AI Knowledge table
CREATE TABLE IF NOT EXISTS chatbot_ai_knowledge (
  id TEXT PRIMARY KEY DEFAULT ('r' || substr(md5(random()::text), 1, 7)),
  active BOOLEAN DEFAULT true NOT NULL,
  tittle TEXT NOT NULL,
  content TEXT NOT NULL,
  vector_status TEXT,
  is_vectorized BOOLEAN DEFAULT false,
  last_vectorized_at BIGINT,
  owner TEXT,
  priority INTEGER,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Message Queue Folders table
CREATE TABLE IF NOT EXISTS message_queue_folders (
  id TEXT PRIMARY KEY DEFAULT ('r' || substr(md5(random()::text), 1, 7)),
  info TEXT,
  status TEXT DEFAULT 'ativo',
  scheduled_for BIGINT,
  delay_max INTEGER,
  delay_min INTEGER,
  log_delivered INTEGER DEFAULT 0,
  log_failed INTEGER DEFAULT 0,
  log_played INTEGER DEFAULT 0,
  log_read INTEGER DEFAULT 0,
  log_sucess INTEGER DEFAULT 0,
  log_total INTEGER DEFAULT 0,
  owner TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quick Replies table
CREATE TABLE IF NOT EXISTS quick_replies (
  id TEXT PRIMARY KEY DEFAULT ('r' || substr(md5(random()::text), 1, 7)),
  shortcut TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Groups table
CREATE TABLE IF NOT EXISTS groups (
  jid TEXT PRIMARY KEY,
  owner_jid TEXT,
  name TEXT,
  name_set_at TEXT,
  name_set_by TEXT,
  topic TEXT,
  is_locked BOOLEAN DEFAULT true,
  is_announce BOOLEAN DEFAULT false,
  announce_version_id TEXT,
  is_ephemeral BOOLEAN DEFAULT false,
  disappearing_timer INTEGER,
  is_incognito BOOLEAN DEFAULT false,
  is_parent BOOLEAN DEFAULT false,
  is_join_approval_required BOOLEAN DEFAULT false,
  linked_parent_jid TEXT,
  is_default_sub_group BOOLEAN DEFAULT false,
  group_created TEXT,
  participant_version_id TEXT,
  participants JSONB,
  member_add_mode TEXT,
  owner_can_send_message BOOLEAN DEFAULT true,
  owner_is_admin BOOLEAN DEFAULT false,
  default_sub_group_id TEXT,
  invite_link TEXT,
  request_participants TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Group Participants table
CREATE TABLE IF NOT EXISTS group_participants (
  id TEXT PRIMARY KEY DEFAULT ('r' || substr(md5(random()::text), 1, 7)),
  group_jid TEXT REFERENCES groups(jid) ON DELETE CASCADE,
  jid TEXT,
  lid TEXT,
  is_admin BOOLEAN DEFAULT false,
  is_super_admin BOOLEAN DEFAULT false,
  display_name TEXT,
  error INTEGER,
  add_request JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Webhook Events table
CREATE TABLE IF NOT EXISTS webhook_events (
  id TEXT PRIMARY KEY DEFAULT ('r' || substr(md5(random()::text), 1, 7)),
  event TEXT NOT NULL,
  instance TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security on all new tables
ALTER TABLE instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE wa_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendants ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_triggers ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_ai_functions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_ai_knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_queue_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE quick_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (Allow authenticated users to access their own data)
CREATE POLICY "Users can manage their instances" ON instances
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their webhooks" ON webhooks
  FOR ALL USING (instance_id IN (SELECT id FROM instances WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their chats" ON chats
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their messages" ON wa_messages
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their labels" ON labels
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their attendants" ON attendants
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their triggers" ON chatbot_triggers
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their AI agents" ON chatbot_ai_agents
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their AI functions" ON chatbot_ai_functions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their AI knowledge" ON chatbot_ai_knowledge
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their message queues" ON message_queue_folders
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their quick replies" ON quick_replies
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their groups" ON groups
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view group participants" ON group_participants
  FOR ALL USING (group_jid IN (SELECT jid FROM groups WHERE user_id = auth.uid()));

CREATE POLICY "Allow authenticated webhook events" ON webhook_events
  FOR ALL USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_instances_user_id ON instances(user_id);
CREATE INDEX IF NOT EXISTS idx_webhooks_instance_id ON webhooks(instance_id);
CREATE INDEX IF NOT EXISTS idx_chats_user_id ON chats(user_id);
CREATE INDEX IF NOT EXISTS idx_chats_wa_chatid ON chats(wa_chatid);
CREATE INDEX IF NOT EXISTS idx_wa_messages_chatid ON wa_messages(chatid);
CREATE INDEX IF NOT EXISTS idx_wa_messages_user_id ON wa_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_wa_messages_timestamp ON wa_messages(message_timestamp);
CREATE INDEX IF NOT EXISTS idx_groups_user_id ON groups(user_id);
CREATE INDEX IF NOT EXISTS idx_group_participants_group_jid ON group_participants(group_jid);

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE chats;
ALTER PUBLICATION supabase_realtime ADD TABLE wa_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE webhook_events;
