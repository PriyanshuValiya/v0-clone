import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://qicfrynpqduokxqehvjm.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpY2ZyeW5wcWR1b2t4cWVodmptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0ODE5MDgsImV4cCI6MjA1NDA1NzkwOH0.GncWndTcTFYEE6VpqA5_HSWXlFyLmwWpg1hh0xNFzuI";

export const supabase = createClient(supabaseUrl, supabaseKey);