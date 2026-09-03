import express from 'express';
import { requireAuth } from '../middleware/auth';
import { requireRole } from '../middleware/role';
import { getSupabase } from '../src/lib/supabaseServer';
import { INITIAL_BRANDS } from '../src/lib/mockData';

const router = express.Router();

// GET /api/brands
router.get('/', async (req, res): Promise<void> => {
    try {
        const { data, error } = await getSupabase().from('brands').select('*').order('name');
        if (error || !data || data.length === 0) {
            // Graceful fallback to initial brands
            res.status(200).json(INITIAL_BRANDS);
            return;
        }
        res.status(200).json(data);
    } catch (err) {
        console.error('[Brands GET Error]:', err);
        res.status(200).json(INITIAL_BRANDS);
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
