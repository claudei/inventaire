import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tvadlycxavdbnaklbxrl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2YWRseWN4YXZkYm5ha2xieHJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4Mjc3OTIsImV4cCI6MjA3NDQwMzc5Mn0.RRTbSenOV4sAeoibw8XaBT9Cikds0k89nYpVWwEYKcI';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;