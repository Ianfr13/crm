# Dockerfile for Self-Hosted Supabase Edge Functions (Chatwoot Gateway)
# Usage in Coolify: Set this as the Dockerfile for your Functions service

FROM supabase/edge-runtime:v1.53.3

USER root

# Copy the specific function we want to serve
# NOTE: The Edge Runtime expects to serve a SINGLE service by default unless routed.
# We will serve 'chatwoot-gateway' as the main service.
COPY ./supabase/functions/chatwoot-gateway /home/deno/functions/chatwoot-gateway

# Set the entrypoint to run this specific function
# This mimics the behavior of a single function deployment
CMD ["start", "--main-service", "/home/deno/functions/chatwoot-gateway"]
