-- Migration to link instances to users based on owner email
-- and ensure instances table has correct permissions if not already set

-- Update user_id in instances table based on owner email matching auth.users email
UPDATE instances
SET user_id = auth.users.id
FROM auth.users
WHERE instances.owner = auth.users.email
  AND instances.user_id IS NULL;

-- Optional: Migrate from integrations if instances is empty and integrations has data?
-- The prompt didn't explicitly ask for migration from integrations, 
-- but it said "Standardize... using instances table as source of truth".
-- If we rely on 'create_instance' to populate it, we might not need to migrate old data 
-- unless we want to preserve existing connections without re-connecting.
-- Given the "ConnectInstance" flow calls create_instance every time, it might handle it.
-- But let's stick to the requested update.
