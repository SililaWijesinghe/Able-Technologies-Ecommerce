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

// GET /api/categories
router.get('/', async (req, res): Promise<void> => {
    try {
        const { data, error } = await getSupabase().from('categories').select('*, products(count)').order('name');
        if (error) {
            res.status(400).json({ error: 'Failed to fetch categories' });
            return;
        }
        res.status(200).json(data);
    } catch (err) {
        console.error('[Categories GET Error]:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/categories (Admin Only)
router.post('/', requireAuth, requireRole('ADMIN'), async (req, res): Promise<void> => {
    try {
        // Enforcing TEXT string uploads for hosted images per specifications
        const { name, slug, image_url } = req.body;
        const { data, error } = await getSupabase()
            .from('categories')
            .insert([{ name, slug, image_url }])
            .select()
            .single();

        if (error) {
            res.status(400).json({ error: 'Failed to create category' });
            return;
        }
        res.status(201).json(data);
    } catch (err) {
        console.error('[Categories POST Error]:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PATCH /api/categories/:id (Admin Only)
router.patch('/:id', requireAuth, requireRole('ADMIN'), async (req, res): Promise<void> => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const { data, error } = await getSupabase()
            .from('categories')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            res.status(400).json({ error: 'Failed to update category' });
            return;
        }
        res.status(200).json(data);
    } catch (err) {
        console.error('[Categories PATCH Error]:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE /api/categories/:id (Admin Only)
router.delete('/:id', requireAuth, requireRole('ADMIN'), async (req, res): Promise<void> => {
    try {
        const { id } = req.params;
        const { error } = await getSupabase()
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) {
            res.status(400).json({ error: 'Failed to delete category' });
            return;
        }
        res.status(204).send();
    } catch (err) {
        console.error('[Categories DELETE Error]:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
