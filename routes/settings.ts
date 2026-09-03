import express from 'express';
import { getSupabase } from '../src/lib/supabaseServer';
import { requireAuth } from '../middleware/auth';
import { requireRole } from '../middleware/role';

const router = express.Router();


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

// PUT /api/settings
router.put('/', requireAuth, requireRole('ADMIN'), async (req, res): Promise<void> => {
    try {
        const { support_email, whatsapp_number, show_prices, enable_checkout } = req.body;
        
        const payload = {
            support_email,
            whatsapp_number,
            show_prices,
            enable_checkout,
            updated_at: new Date().toISOString()
        };

        const { data, error } = await getSupabase()
            .from('store_settings')
            .upsert({ id: 1, ...payload })
            .select()
            .single();

        if (error) throw error;

        res.status(200).json(data);
    } catch (err) {
        console.error('[Settings API Update Error]:', err);
        res.status(500).json({ error: 'An unexpected error occurred updating store settings.' });
    }
});

export default router;
