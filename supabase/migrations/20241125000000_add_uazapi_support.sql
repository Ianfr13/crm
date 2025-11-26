-- Migration: Add uazapi support to integrations table
-- This migration adds support for uazapi WhatsApp provider

-- Update provider constraint to include uazapi
ALTER TABLE integrations 
  DROP CONSTRAINT IF EXISTS integrations_provider_check;

ALTER TABLE integrations
  ADD CONSTRAINT integrations_provider_check 
  CHECK (provider IN ('meta', 'evolution', 'uazapi'));

-- Add uazapi-specific columns
ALTER TABLE integrations
  ADD COLUMN IF NOT EXISTS base_url text,
  ADD COLUMN IF NOT EXISTS instance_token text,
  ADD COLUMN IF NOT EXISTS admin_token text;

-- Add comments for documentation
COMMENT ON COLUMN integrations.base_url IS 'Base URL for uazapi (e.g., https://free.uazapi.com)';
COMMENT ON COLUMN integrations.instance_token IS 'Instance token for uazapi API authentication';
COMMENT ON COLUMN integrations.admin_token IS 'Admin token for uazapi administrative endpoints';

-- Note: The existing 'config' JSONB column can still be used for provider-specific settings
-- The new columns provide explicit fields for uazapi credentials
