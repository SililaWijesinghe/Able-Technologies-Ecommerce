import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabaseUrl = process.env.VITE_SUPABASE_URL;
// we use VITE_SUPABASE_SERVICE_ROLE_KEY to see policies if we have it? No, we don't have it.
// I can execute sql to list policies
