import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://uzxldqyhiodorrkgohul.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6eGxkcXloaW9kb3Jya2dvaHVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxMDQ4MjksImV4cCI6MjA4MTY4MDgyOX0.bgm7t-eWmF4Kvn7NXTSP_gwpmNWdRVjQKIUijERPmi8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
