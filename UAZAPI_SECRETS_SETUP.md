# uazapi Secrets Configuration

This document explains how to configure the required Supabase Secrets for the uazapi integration.

## Required Secrets

The uazapi integration requires two environment variables to be set as Supabase Secrets:

1. **`UAZAPI_BASE_URL`** - The base URL of your uazapi server (shared by all users)
2. **`UAZAPI_ADMIN_TOKEN`** - The admin token for creating new instances (shared by all users)

## Setting Secrets via CLI

Run these commands to set the secrets:

```bash
# Set the base URL
npx supabase secrets set UAZAPI_BASE_URL=https://douravita.uazapi.com --project-ref vglhaxrdsvqbwvyywexd

# Set the admin token
npx supabase secrets set UAZAPI_ADMIN_TOKEN=KynGrON6iZJqgTHzJOHw1vp0pOoBVHMnkg9Zoj5nypZUBKUXy4 --project-ref vglhaxrdsvqbwvyywexd
```

## Verify Secrets

After setting the secrets, verify they are configured correctly:

```bash
npx supabase secrets list --project-ref vglhaxrdsvqbwvyywexd
```

You should see both `UAZAPI_BASE_URL` and `UAZAPI_ADMIN_TOKEN` in the list.

## Redeploy Edge Functions

After setting the secrets, you **must redeploy** the Edge Function for it to pick up the new environment variables:

```bash
npx supabase functions deploy uazapi-integration --project-ref vglhaxrdsvqbwvyywexd --no-verify-jwt
```

## Architecture

### Shared (Secrets)
- `UAZAPI_BASE_URL` → Accessible via `Deno.env.get('UAZAPI_BASE_URL')`
- `UAZAPI_ADMIN_TOKEN` → Accessible via `Deno.env.get('UAZAPI_ADMIN_TOKEN')`

### Per-User (Database)
- `instance_token` → Stored in `integrations` table, unique per user

This architecture ensures:
- Sensitive shared credentials are never exposed to the frontend
- Each user has their own WhatsApp instance
- Credentials can be rotated without code changes
