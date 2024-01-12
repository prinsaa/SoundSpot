import { createClient } from "@supabase/supabase-js";

const supabaseUrl  = import.meta.env.VITE_APP_SUPABASE_URL
const supabaseKey  = import.meta.env.VITE_APP_SUPABASE_KEY

//connecting to server
export const supabase = createClient(supabaseUrl, supabaseKey)