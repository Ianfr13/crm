// Configuração do Supabase
// Este arquivo fornece as credenciais diretamente para evitar problemas com env variables no Turbopack

export const supabaseConfig = {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vglhaxrdsvqbwvyywexd.supabase.co',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnbGhheHJkc3ZxYnd2eXl3ZXhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMDY1NDksImV4cCI6MjA3OTY4MjU0OX0.Ck0QsYl-LVRjA7c1U_ZslrO7MRgm_Rsm1QD_ldKoHvQ'
}
