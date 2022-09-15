import { createClient } from 'https://deno.land/x/supabase@1.3.1/mod.ts';

export const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? 'http://localhost:54321',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ??
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSJ9.vI9obAHOGyVVKa3pD--kJlyxp-Z2zV9UUMAhKpNLAcU'
);
