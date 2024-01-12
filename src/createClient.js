import { createClient } from "@supabase/supabase-js";


//connecting to server
export const supabase=createClient(
    'https://asmfkhzkfgodylnckimn.supabase.co',
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzbWZraHprZmdvZHlsbmNraW1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk5MTA1MTIsImV4cCI6MjAxNTQ4NjUxMn0.Xk1NmGm0uPpf69_Fb5W13fpGhiOmYaJckG5FuQ8Yq1M")