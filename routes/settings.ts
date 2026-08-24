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

// GET /api/settings/public
router.get('/public', async (req, res): Promise<void> => {
    try {
        const { data, error } = await getSupabase()
            .from('store_settings')
            .select('*')
            .eq('id', 1)
            .single();

        if (error) {
            res.status(404).json({ error: 'Settings not found.' });
            return;
        }

        res.status(200).json(data);
    } catch (err) {
        console.error('[Settings API Error]:', err);
        res.status(500).json({ error: 'An unexpected error occurred retrieving store settings.' });
    }
});

export default router;
