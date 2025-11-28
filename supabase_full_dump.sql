


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "public";






CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."channel_type" AS ENUM (
    'whatsapp',
    'facebook',
    'instagram',
    'email',
    'chat'
);


ALTER TYPE "public"."channel_type" OWNER TO "postgres";


CREATE TYPE "public"."conversation_status" AS ENUM (
    'open',
    'closed',
    'snoozed'
);


ALTER TYPE "public"."conversation_status" OWNER TO "postgres";


CREATE TYPE "public"."sender_type" AS ENUM (
    'user',
    'contact',
    'agent',
    'system'
);


ALTER TYPE "public"."sender_type" OWNER TO "postgres";


CREATE TYPE "public"."user_role" AS ENUM (
    'admin',
    'manager',
    'sales',
    'read_only'
);


ALTER TYPE "public"."user_role" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."dispatch_message_event"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
declare
  project_url text := 'https://vglhaxrdsvqbwvyywexd.supabase.co';
  service_key text := current_setting('app.settings.service_role_key', true);
begin
  -- Use pg_net to call the dispatch-event Edge Function
  -- Note: This requires proper configuration in production
  perform
    net.http_post(
      url := project_url || '/functions/v1/dispatch-event',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || service_key
      ),
      body := jsonb_build_object(
        'type', 'INSERT',
        'table', 'messages',
        'record', row_to_json(NEW),
        'schema', 'public'
      )
    );
  
  return new;
end;
$$;


ALTER FUNCTION "public"."dispatch_message_event"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."agent_registrations" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "name" "text" NOT NULL,
    "webhook_url" "text" NOT NULL,
    "events" "text"[] DEFAULT '{}'::"text"[],
    "secret_key" "text" NOT NULL,
    "is_active" boolean DEFAULT true
);


ALTER TABLE "public"."agent_registrations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."attendants" (
    "id" "text" DEFAULT ('r'::"text" || "substr"("md5"(("random"())::"text"), 1, 7)) NOT NULL,
    "name" "text" NOT NULL,
    "phone" "text",
    "email" "text",
    "department" "text",
    "custom_field_01" "text",
    "custom_field_02" "text",
    "owner" "text",
    "user_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."attendants" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."chatbot_ai_agents" (
    "id" "text" DEFAULT ('r'::"text" || "substr"("md5"(("random"())::"text"), 1, 7)) NOT NULL,
    "name" "text" NOT NULL,
    "provider" "text" NOT NULL,
    "model" "text" NOT NULL,
    "apikey" "text" NOT NULL,
    "base_prompt" "text",
    "max_tokens" integer,
    "temperature" integer,
    "diversity_level" integer,
    "frequency_penalty" integer,
    "presence_penalty" integer,
    "sign_messages" boolean DEFAULT false,
    "read_messages" boolean DEFAULT false,
    "max_message_length" integer,
    "typing_delay_seconds" integer,
    "context_time_window_hours" integer,
    "context_max_messages" integer,
    "context_min_messages" integer,
    "owner" "text",
    "user_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."chatbot_ai_agents" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."chatbot_ai_functions" (
    "id" "text" DEFAULT ('r'::"text" || "substr"("md5"(("random"())::"text"), 1, 7)) NOT NULL,
    "name" "text" NOT NULL,
    "description" "text" NOT NULL,
    "active" boolean DEFAULT true,
    "method" "text" NOT NULL,
    "endpoint" "text" NOT NULL,
    "headers" "text",
    "body" "text",
    "parameters" "text",
    "undocumented_parameters" "text",
    "header_error" boolean DEFAULT false,
    "body_error" boolean DEFAULT false,
    "owner" "text",
    "user_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."chatbot_ai_functions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."chatbot_ai_knowledge" (
    "id" "text" DEFAULT ('r'::"text" || "substr"("md5"(("random"())::"text"), 1, 7)) NOT NULL,
    "active" boolean DEFAULT true NOT NULL,
    "tittle" "text" NOT NULL,
    "content" "text" NOT NULL,
    "vector_status" "text",
    "is_vectorized" boolean DEFAULT false,
    "last_vectorized_at" bigint,
    "owner" "text",
    "priority" integer,
    "user_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."chatbot_ai_knowledge" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."chatbot_triggers" (
    "id" "text" DEFAULT ('r'::"text" || "substr"("md5"(("random"())::"text"), 1, 7)) NOT NULL,
    "active" boolean DEFAULT true,
    "type" "text" NOT NULL,
    "agent_id" "text",
    "quick_reply_id" "text",
    "ignore_groups" boolean DEFAULT false,
    "lead_field" "text",
    "lead_operator" "text",
    "lead_value" "text",
    "priority" integer,
    "words_to_start" "text",
    "response_delay_seconds" integer,
    "owner" "text",
    "user_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."chatbot_triggers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."chats" (
    "id" "text" DEFAULT ('r'::"text" || "substr"("md5"(("random"())::"text"), 1, 7)) NOT NULL,
    "wa_fastid" "text",
    "wa_chatid" "text",
    "wa_archived" boolean DEFAULT false,
    "wa_contact_name" "text",
    "wa_name" "text",
    "name" "text",
    "image" "text",
    "image_preview" "text",
    "wa_ephemeral_expiration" integer,
    "wa_is_blocked" boolean DEFAULT false,
    "wa_is_group" boolean DEFAULT false,
    "wa_is_group_admin" boolean DEFAULT false,
    "wa_is_group_announce" boolean DEFAULT false,
    "wa_is_group_community" boolean DEFAULT false,
    "wa_is_group_member" boolean DEFAULT false,
    "wa_is_pinned" boolean DEFAULT false,
    "wa_label" "text",
    "wa_last_message_text_vote" "text",
    "wa_last_message_type" "text",
    "wa_last_msg_timestamp" bigint,
    "wa_last_message_sender" "text",
    "wa_mute_end_time" bigint,
    "owner" "text",
    "wa_unread_count" integer DEFAULT 0,
    "phone" "text",
    "wa_common_groups" "text",
    "lead_name" "text",
    "lead_full_name" "text",
    "lead_email" "text",
    "lead_personalid" "text",
    "lead_status" "text",
    "lead_tags" "text",
    "lead_notes" "text",
    "lead_is_ticket_open" boolean DEFAULT false,
    "lead_assigned_attendant_id" "text",
    "lead_kanban_order" integer,
    "lead_field_01" "text",
    "lead_field_02" "text",
    "lead_field_03" "text",
    "lead_field_04" "text",
    "lead_field_05" "text",
    "lead_field_06" "text",
    "lead_field_07" "text",
    "lead_field_08" "text",
    "lead_field_09" "text",
    "lead_field_10" "text",
    "lead_field_11" "text",
    "lead_field_12" "text",
    "lead_field_13" "text",
    "lead_field_14" "text",
    "lead_field_15" "text",
    "lead_field_16" "text",
    "lead_field_17" "text",
    "lead_field_18" "text",
    "lead_field_19" "text",
    "lead_field_20" "text",
    "chatbot_agent_reset_memory_at" bigint,
    "chatbot_last_trigger_id" "text",
    "chatbot_last_trigger_at" bigint,
    "chatbot_disable_until" bigint,
    "user_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."chats" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."contacts" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "name" "text" NOT NULL,
    "email" "text",
    "phone" "text",
    "tags" "text"[] DEFAULT '{}'::"text"[],
    "pipeline_stage" "text" DEFAULT 'lead'::"text",
    "owner_id" "uuid",
    "metadata" "jsonb" DEFAULT '{}'::"jsonb"
);


ALTER TABLE "public"."contacts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."conversations" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "contact_id" "uuid" NOT NULL,
    "channel" "public"."channel_type" NOT NULL,
    "status" "public"."conversation_status" DEFAULT 'open'::"public"."conversation_status",
    "assigned_to" "uuid",
    "last_message_at" timestamp with time zone DEFAULT "now"(),
    "unread_count" integer DEFAULT 0,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "user_id" "uuid"
);


ALTER TABLE "public"."conversations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."group_participants" (
    "id" "text" DEFAULT ('r'::"text" || "substr"("md5"(("random"())::"text"), 1, 7)) NOT NULL,
    "group_jid" "text",
    "jid" "text",
    "lid" "text",
    "is_admin" boolean DEFAULT false,
    "is_super_admin" boolean DEFAULT false,
    "display_name" "text",
    "error" integer,
    "add_request" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."group_participants" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."groups" (
    "jid" "text" NOT NULL,
    "owner_jid" "text",
    "name" "text",
    "name_set_at" "text",
    "name_set_by" "text",
    "topic" "text",
    "is_locked" boolean DEFAULT true,
    "is_announce" boolean DEFAULT false,
    "announce_version_id" "text",
    "is_ephemeral" boolean DEFAULT false,
    "disappearing_timer" integer,
    "is_incognito" boolean DEFAULT false,
    "is_parent" boolean DEFAULT false,
    "is_join_approval_required" boolean DEFAULT false,
    "linked_parent_jid" "text",
    "is_default_sub_group" boolean DEFAULT false,
    "group_created" "text",
    "participant_version_id" "text",
    "participants" "jsonb",
    "member_add_mode" "text",
    "owner_can_send_message" boolean DEFAULT true,
    "owner_is_admin" boolean DEFAULT false,
    "default_sub_group_id" "text",
    "invite_link" "text",
    "request_participants" "text",
    "user_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."groups" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."instances" (
    "id" "text" DEFAULT ('i'::"text" || "substr"("md5"(("random"())::"text"), 1, 10)) NOT NULL,
    "token" "text",
    "status" "text",
    "paircode" "text",
    "qrcode" "text",
    "name" "text",
    "profile_name" "text",
    "profile_pic_url" "text",
    "is_business" boolean DEFAULT false,
    "plataform" "text",
    "system_name" "text" DEFAULT 'uazapi'::"text",
    "owner" "text",
    "last_disconnect" "text",
    "last_disconnect_reason" "text",
    "admin_field_01" "text",
    "admin_field_02" "text",
    "openai_apikey" "text",
    "chatbot_enabled" boolean DEFAULT false,
    "chatbot_ignore_groups" boolean DEFAULT false,
    "chatbot_stop_conversation" "text",
    "chatbot_stop_minutes" integer,
    "chatbot_stop_when_you_send_msg" integer,
    "msg_delay_min" integer DEFAULT 2,
    "msg_delay_max" integer DEFAULT 4,
    "user_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."instances" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."integrations" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "provider" "text" NOT NULL,
    "config" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "status" "text" DEFAULT 'active'::"text",
    "encrypted_credentials" "text",
    "base_url" "text",
    "instance_token" "text",
    "admin_token" "text",
    "user_id" "uuid",
    "active" boolean DEFAULT true,
    CONSTRAINT "integrations_provider_check" CHECK (("provider" = ANY (ARRAY['meta'::"text", 'evolution'::"text", 'uazapi'::"text"])))
);


ALTER TABLE "public"."integrations" OWNER TO "postgres";


COMMENT ON COLUMN "public"."integrations"."base_url" IS 'Base URL for uazapi (e.g., https://free.uazapi.com)';



COMMENT ON COLUMN "public"."integrations"."instance_token" IS 'Instance token for uazapi API authentication';



COMMENT ON COLUMN "public"."integrations"."admin_token" IS 'Admin token for uazapi administrative endpoints';



COMMENT ON COLUMN "public"."integrations"."user_id" IS 'User who owns this integration';



COMMENT ON COLUMN "public"."integrations"."active" IS 'Whether this integration is currently active';



CREATE TABLE IF NOT EXISTS "public"."labels" (
    "id" "text" DEFAULT ('l'::"text" || "substr"("md5"(("random"())::"text"), 1, 9)) NOT NULL,
    "name" "text" NOT NULL,
    "color" integer,
    "color_hex" "text",
    "user_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."labels" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."message_queue_folders" (
    "id" "text" DEFAULT ('r'::"text" || "substr"("md5"(("random"())::"text"), 1, 7)) NOT NULL,
    "info" "text",
    "status" "text" DEFAULT 'ativo'::"text",
    "scheduled_for" bigint,
    "delay_max" integer,
    "delay_min" integer,
    "log_delivered" integer DEFAULT 0,
    "log_failed" integer DEFAULT 0,
    "log_played" integer DEFAULT 0,
    "log_read" integer DEFAULT 0,
    "log_sucess" integer DEFAULT 0,
    "log_total" integer DEFAULT 0,
    "owner" "text",
    "user_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."message_queue_folders" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."messages" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "conversation_id" "uuid" NOT NULL,
    "sender_type" "public"."sender_type" NOT NULL,
    "sender_id" "uuid",
    "content" "text",
    "attachments" "jsonb"[] DEFAULT '{}'::"jsonb"[],
    "read_at" timestamp with time zone,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb"
);


ALTER TABLE "public"."messages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "full_name" "text",
    "avatar_url" "text",
    "role" "public"."user_role" DEFAULT 'sales'::"public"."user_role",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."quick_replies" (
    "id" "text" DEFAULT ('r'::"text" || "substr"("md5"(("random"())::"text"), 1, 7)) NOT NULL,
    "shortcut" "text" NOT NULL,
    "content" "text" NOT NULL,
    "category" "text",
    "user_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."quick_replies" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."wa_messages" (
    "id" "text" DEFAULT ('r'::"text" || "substr"("md5"(("random"())::"text"), 1, 7)) NOT NULL,
    "messageid" "text",
    "chatid" "text",
    "from_me" boolean DEFAULT false,
    "is_group" boolean DEFAULT false,
    "message_type" "text",
    "message_timestamp" bigint,
    "edited" "text",
    "quoted" "text",
    "reaction" "text",
    "sender" "text",
    "sender_name" "text",
    "source" "text",
    "status" "text",
    "text" "text",
    "vote" "text",
    "button_or_listid" "text",
    "convert_options" "text",
    "file_url" "text",
    "content" "jsonb",
    "owner" "text",
    "track_source" "text",
    "track_id" "text",
    "ai_metadata" "jsonb",
    "user_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."wa_messages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."webhook_events" (
    "id" "text" DEFAULT ('r'::"text" || "substr"("md5"(("random"())::"text"), 1, 7)) NOT NULL,
    "event" "text" NOT NULL,
    "instance" "text" NOT NULL,
    "data" "jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."webhook_events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."webhooks" (
    "id" "text" DEFAULT ('wh_'::"text" || "substr"("md5"(("random"())::"text"), 1, 10)) NOT NULL,
    "instance_id" "text",
    "enabled" boolean DEFAULT true,
    "url" "text" NOT NULL,
    "events" "text"[] NOT NULL,
    "add_url_types_messages" boolean DEFAULT false,
    "add_url_events" boolean DEFAULT false,
    "exclude_messages" "text"[],
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."webhooks" OWNER TO "postgres";


ALTER TABLE ONLY "public"."agent_registrations"
    ADD CONSTRAINT "agent_registrations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."attendants"
    ADD CONSTRAINT "attendants_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."chatbot_ai_agents"
    ADD CONSTRAINT "chatbot_ai_agents_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."chatbot_ai_functions"
    ADD CONSTRAINT "chatbot_ai_functions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."chatbot_ai_knowledge"
    ADD CONSTRAINT "chatbot_ai_knowledge_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."chatbot_triggers"
    ADD CONSTRAINT "chatbot_triggers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."chats"
    ADD CONSTRAINT "chats_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."chats"
    ADD CONSTRAINT "chats_wa_chatid_key" UNIQUE ("wa_chatid");



ALTER TABLE ONLY "public"."contacts"
    ADD CONSTRAINT "contacts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."conversations"
    ADD CONSTRAINT "conversations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."group_participants"
    ADD CONSTRAINT "group_participants_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."groups"
    ADD CONSTRAINT "groups_pkey" PRIMARY KEY ("jid");



ALTER TABLE ONLY "public"."instances"
    ADD CONSTRAINT "instances_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."integrations"
    ADD CONSTRAINT "integrations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."labels"
    ADD CONSTRAINT "labels_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."message_queue_folders"
    ADD CONSTRAINT "message_queue_folders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."quick_replies"
    ADD CONSTRAINT "quick_replies_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."wa_messages"
    ADD CONSTRAINT "wa_messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."webhook_events"
    ADD CONSTRAINT "webhook_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."webhooks"
    ADD CONSTRAINT "webhooks_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_chats_user_id" ON "public"."chats" USING "btree" ("user_id");



CREATE INDEX "idx_chats_wa_chatid" ON "public"."chats" USING "btree" ("wa_chatid");



CREATE INDEX "idx_conversations_user_id" ON "public"."conversations" USING "btree" ("user_id");



CREATE INDEX "idx_group_participants_group_jid" ON "public"."group_participants" USING "btree" ("group_jid");



CREATE INDEX "idx_groups_user_id" ON "public"."groups" USING "btree" ("user_id");



CREATE INDEX "idx_instances_user_id" ON "public"."instances" USING "btree" ("user_id");



CREATE INDEX "idx_integrations_user_provider" ON "public"."integrations" USING "btree" ("user_id", "provider");



CREATE INDEX "idx_wa_messages_chatid" ON "public"."wa_messages" USING "btree" ("chatid");



CREATE INDEX "idx_wa_messages_timestamp" ON "public"."wa_messages" USING "btree" ("message_timestamp");



CREATE INDEX "idx_wa_messages_user_id" ON "public"."wa_messages" USING "btree" ("user_id");



CREATE INDEX "idx_webhooks_instance_id" ON "public"."webhooks" USING "btree" ("instance_id");



CREATE OR REPLACE TRIGGER "on_message_created" AFTER INSERT ON "public"."messages" FOR EACH ROW EXECUTE FUNCTION "public"."dispatch_message_event"();



ALTER TABLE ONLY "public"."attendants"
    ADD CONSTRAINT "attendants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chatbot_ai_agents"
    ADD CONSTRAINT "chatbot_ai_agents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chatbot_ai_functions"
    ADD CONSTRAINT "chatbot_ai_functions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chatbot_ai_knowledge"
    ADD CONSTRAINT "chatbot_ai_knowledge_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chatbot_triggers"
    ADD CONSTRAINT "chatbot_triggers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chats"
    ADD CONSTRAINT "chats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."contacts"
    ADD CONSTRAINT "contacts_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."conversations"
    ADD CONSTRAINT "conversations_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."conversations"
    ADD CONSTRAINT "conversations_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."conversations"
    ADD CONSTRAINT "conversations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."group_participants"
    ADD CONSTRAINT "group_participants_group_jid_fkey" FOREIGN KEY ("group_jid") REFERENCES "public"."groups"("jid") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."groups"
    ADD CONSTRAINT "groups_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."instances"
    ADD CONSTRAINT "instances_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."integrations"
    ADD CONSTRAINT "integrations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."labels"
    ADD CONSTRAINT "labels_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."message_queue_folders"
    ADD CONSTRAINT "message_queue_folders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."quick_replies"
    ADD CONSTRAINT "quick_replies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."wa_messages"
    ADD CONSTRAINT "wa_messages_chatid_fkey" FOREIGN KEY ("chatid") REFERENCES "public"."chats"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."wa_messages"
    ADD CONSTRAINT "wa_messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."webhooks"
    ADD CONSTRAINT "webhooks_instance_id_fkey" FOREIGN KEY ("instance_id") REFERENCES "public"."instances"("id") ON DELETE CASCADE;



CREATE POLICY "Allow all for authenticated" ON "public"."agent_registrations" USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow all for authenticated" ON "public"."contacts" USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow all for authenticated" ON "public"."conversations" USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow all for authenticated" ON "public"."integrations" USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow all for authenticated" ON "public"."messages" USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow all for authenticated" ON "public"."profiles" USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow authenticated webhook events" ON "public"."webhook_events" USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Users can manage their AI agents" ON "public"."chatbot_ai_agents" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their AI functions" ON "public"."chatbot_ai_functions" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their AI knowledge" ON "public"."chatbot_ai_knowledge" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their attendants" ON "public"."attendants" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their chats" ON "public"."chats" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their groups" ON "public"."groups" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their instances" ON "public"."instances" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their labels" ON "public"."labels" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their message queues" ON "public"."message_queue_folders" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their messages" ON "public"."wa_messages" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their quick replies" ON "public"."quick_replies" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their triggers" ON "public"."chatbot_triggers" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their webhooks" ON "public"."webhooks" USING (("instance_id" IN ( SELECT "instances"."id"
   FROM "public"."instances"
  WHERE ("instances"."user_id" = "auth"."uid"()))));



CREATE POLICY "Users can view group participants" ON "public"."group_participants" USING (("group_jid" IN ( SELECT "groups"."jid"
   FROM "public"."groups"
  WHERE ("groups"."user_id" = "auth"."uid"()))));



ALTER TABLE "public"."agent_registrations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."attendants" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."chatbot_ai_agents" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."chatbot_ai_functions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."chatbot_ai_knowledge" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."chatbot_triggers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."chats" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."contacts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."conversations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."group_participants" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."groups" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."instances" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."integrations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."labels" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."message_queue_folders" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."messages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."quick_replies" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."wa_messages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."webhook_events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."webhooks" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."chats";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."conversations";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."messages";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."wa_messages";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."webhook_events";



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";




























































































































































GRANT ALL ON FUNCTION "public"."dispatch_message_event"() TO "anon";
GRANT ALL ON FUNCTION "public"."dispatch_message_event"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."dispatch_message_event"() TO "service_role";


















GRANT ALL ON TABLE "public"."agent_registrations" TO "anon";
GRANT ALL ON TABLE "public"."agent_registrations" TO "authenticated";
GRANT ALL ON TABLE "public"."agent_registrations" TO "service_role";



GRANT ALL ON TABLE "public"."attendants" TO "anon";
GRANT ALL ON TABLE "public"."attendants" TO "authenticated";
GRANT ALL ON TABLE "public"."attendants" TO "service_role";



GRANT ALL ON TABLE "public"."chatbot_ai_agents" TO "anon";
GRANT ALL ON TABLE "public"."chatbot_ai_agents" TO "authenticated";
GRANT ALL ON TABLE "public"."chatbot_ai_agents" TO "service_role";



GRANT ALL ON TABLE "public"."chatbot_ai_functions" TO "anon";
GRANT ALL ON TABLE "public"."chatbot_ai_functions" TO "authenticated";
GRANT ALL ON TABLE "public"."chatbot_ai_functions" TO "service_role";



GRANT ALL ON TABLE "public"."chatbot_ai_knowledge" TO "anon";
GRANT ALL ON TABLE "public"."chatbot_ai_knowledge" TO "authenticated";
GRANT ALL ON TABLE "public"."chatbot_ai_knowledge" TO "service_role";



GRANT ALL ON TABLE "public"."chatbot_triggers" TO "anon";
GRANT ALL ON TABLE "public"."chatbot_triggers" TO "authenticated";
GRANT ALL ON TABLE "public"."chatbot_triggers" TO "service_role";



GRANT ALL ON TABLE "public"."chats" TO "anon";
GRANT ALL ON TABLE "public"."chats" TO "authenticated";
GRANT ALL ON TABLE "public"."chats" TO "service_role";



GRANT ALL ON TABLE "public"."contacts" TO "anon";
GRANT ALL ON TABLE "public"."contacts" TO "authenticated";
GRANT ALL ON TABLE "public"."contacts" TO "service_role";



GRANT ALL ON TABLE "public"."conversations" TO "anon";
GRANT ALL ON TABLE "public"."conversations" TO "authenticated";
GRANT ALL ON TABLE "public"."conversations" TO "service_role";



GRANT ALL ON TABLE "public"."group_participants" TO "anon";
GRANT ALL ON TABLE "public"."group_participants" TO "authenticated";
GRANT ALL ON TABLE "public"."group_participants" TO "service_role";



GRANT ALL ON TABLE "public"."groups" TO "anon";
GRANT ALL ON TABLE "public"."groups" TO "authenticated";
GRANT ALL ON TABLE "public"."groups" TO "service_role";



GRANT ALL ON TABLE "public"."instances" TO "anon";
GRANT ALL ON TABLE "public"."instances" TO "authenticated";
GRANT ALL ON TABLE "public"."instances" TO "service_role";



GRANT ALL ON TABLE "public"."integrations" TO "anon";
GRANT ALL ON TABLE "public"."integrations" TO "authenticated";
GRANT ALL ON TABLE "public"."integrations" TO "service_role";



GRANT ALL ON TABLE "public"."labels" TO "anon";
GRANT ALL ON TABLE "public"."labels" TO "authenticated";
GRANT ALL ON TABLE "public"."labels" TO "service_role";



GRANT ALL ON TABLE "public"."message_queue_folders" TO "anon";
GRANT ALL ON TABLE "public"."message_queue_folders" TO "authenticated";
GRANT ALL ON TABLE "public"."message_queue_folders" TO "service_role";



GRANT ALL ON TABLE "public"."messages" TO "anon";
GRANT ALL ON TABLE "public"."messages" TO "authenticated";
GRANT ALL ON TABLE "public"."messages" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."quick_replies" TO "anon";
GRANT ALL ON TABLE "public"."quick_replies" TO "authenticated";
GRANT ALL ON TABLE "public"."quick_replies" TO "service_role";



GRANT ALL ON TABLE "public"."wa_messages" TO "anon";
GRANT ALL ON TABLE "public"."wa_messages" TO "authenticated";
GRANT ALL ON TABLE "public"."wa_messages" TO "service_role";



GRANT ALL ON TABLE "public"."webhook_events" TO "anon";
GRANT ALL ON TABLE "public"."webhook_events" TO "authenticated";
GRANT ALL ON TABLE "public"."webhook_events" TO "service_role";



GRANT ALL ON TABLE "public"."webhooks" TO "anon";
GRANT ALL ON TABLE "public"."webhooks" TO "authenticated";
GRANT ALL ON TABLE "public"."webhooks" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































