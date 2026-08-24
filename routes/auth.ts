import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

let supabaseClient: ReturnType<typeof createClient> | null = null;
function getSupabase() {
    if (!supabaseClient) {
        const url = process.env.SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_KEY;
        if (!url || !key) {
            throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables.');
        }
        supabaseClient = createClient(url, key);
    }
    return supabaseClient;
}

// POST /api/auth/register
router.post('/register', async (req, res): Promise<void> => {
    try {
        const { email, password, fullName, phone } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required fields.' });
            return;
        }

        const supabase = getSupabase();
        
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName || '',
                    phone: phone || ''
                }
            }
        });

        if (error) {
            // Supabase auth errors are safe to expose (e.g., "User already registered")
            res.status(400).json({ error: error.message || 'Registration failed.' });
            return;
        }

        if (data.user) {
            // Insert directly into public.users. 
            const { error: dbError } = await supabase
                .from('users')
                .insert([{ 
                    id: data.user.id, 
                    email: email, 
                    full_name: fullName || null, 
                    phone: phone || null 
                }]);
                
            if (dbError) {
                console.warn("Could not insert into public.users:", dbError.message);
            }
        }

        res.status(201).json({ 
            message: 'Registration successful.', 
            user: data.user 
        });
    } catch (err) {
        console.error('[Register Auth Error]:', err);
        res.status(500).json({ error: 'An unexpected internal error occurred during registration.' });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required fields.' });
            return;
        }

        const { data, error } = await getSupabase().auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            res.status(401).json({ error: 'Invalid login credentials provided.' });
            return;
        }

        res.status(200).json({ 
            message: 'Login successful.', 
            session: data.session,
            user: data.user
        });
    } catch (err) {
        console.error('[Login Auth Error]:', err);
        res.status(500).json({ error: 'An unexpected internal error occurred during login.' });
    }
});

export default router;
