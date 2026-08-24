import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { requireAuth } from '../middleware/auth';
import { requireRole } from '../middleware/role';

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

// GET /api/brands
router.get('/', async (req, res): Promise<void> => {
    try {
        const { data, error } = await getSupabase().from('brands').select('*').order('name');
        if (error) {
            res.status(400).json({ error: 'Failed to fetch brands' });
            return;
        }
        res.status(200).json(data);
    } catch (err) {
        console.error('[Brands GET Error]:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/brands (Admin Only)
router.post('/', requireAuth, requireRole('ADMIN'), async (req, res): Promise<void> => {
    try {
        // Enforcing TEXT string uploads for hosted images per specifications
        const { name, slug, logo_url } = req.body;
        const { data, error } = await getSupabase()
            .from('brands')
            .insert([{ name, slug, logo_url }])
            .select()
            .single();

        if (error) {
            res.status(400).json({ error: 'Failed to create brand' });
            return;
        }
        res.status(201).json(data);
    } catch (err) {
        console.error('[Brands POST Error]:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PATCH /api/brands/:id (Admin Only)
router.patch('/:id', requireAuth, requireRole('ADMIN'), async (req, res): Promise<void> => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const { data, error } = await getSupabase()
            .from('brands')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            res.status(400).json({ error: 'Failed to update brand' });
            return;
        }
        res.status(200).json(data);
    } catch (err) {
        console.error('[Brands PATCH Error]:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE /api/brands/:id (Admin Only)
router.delete('/:id', requireAuth, requireRole('ADMIN'), async (req, res): Promise<void> => {
    try {
        const { id } = req.params;
        const { error } = await getSupabase()
            .from('brands')
            .delete()
            .eq('id', id);

        if (error) {
            res.status(400).json({ error: 'Failed to delete brand' });
            return;
        }
        res.status(204).send();
    } catch (err) {
        console.error('[Brands DELETE Error]:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
