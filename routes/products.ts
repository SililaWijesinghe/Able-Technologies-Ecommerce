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

// GET /api/products
router.get('/', async (req, res): Promise<void> => {
    try {
        const { category, brand, search, availability } = req.query;
        // Fetch products along with associated images
        let query = getSupabase().from('products').select(`
            *,
            images:product_images(id, image_url, display_order)
        `);

        if (category) query = query.eq('category_id', category);
        if (brand) query = query.eq('brand_id', brand);
        if (availability) query = query.eq('availability_status', availability);
        if (search) query = query.ilike('name', `%${search}%`);

        const { data, error } = await query;
        if (error) {
            res.status(400).json({ error: 'Failed to fetch products' });
            return;
        }
        res.status(200).json(data);
    } catch (err) {
        console.error('[Products GET Error]:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/products/:id
router.get('/:id', async (req, res): Promise<void> => {
    try {
        const { id } = req.params;
        const { data, error } = await getSupabase()
            .from('products')
            .select(`
                *,
                images:product_images(id, image_url, display_order)
            `)
            .eq('id', id)
            .single();

        if (error) {
            res.status(400).json({ error: 'Failed to fetch product' });
            return;
        }
        res.status(200).json(data);
    } catch (err) {
        console.error('[Product GET Error]:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/products (Admin Only)
router.post('/', requireAuth, requireRole('ADMIN'), async (req, res): Promise<void> => {
    try {
        const { name, description, sku, base_price, stock_quantity, availability_status, category_id, brand_id } = req.body;
        const { data, error } = await getSupabase()
            .from('products')
            .insert([{ name, description, sku, base_price, stock_quantity, availability_status, category_id, brand_id }])
            .select()
            .single();

        if (error) {
            res.status(400).json({ error: 'Failed to create product' });
            return;
        }
        res.status(201).json(data);
    } catch (err) {
        console.error('[Products POST Error]:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PATCH /api/products/:id (Admin Only)
router.patch('/:id', requireAuth, requireRole('ADMIN'), async (req, res): Promise<void> => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const { data, error } = await getSupabase()
            .from('products')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            res.status(400).json({ error: 'Failed to update product' });
            return;
        }
        res.status(200).json(data);
    } catch (err) {
        console.error('[Products PATCH Error]:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE /api/products/:id (Admin Only)
router.delete('/:id', requireAuth, requireRole('ADMIN'), async (req, res): Promise<void> => {
    try {
        const { id } = req.params;
        const { error } = await getSupabase()
            .from('products')
            .delete()
            .eq('id', id);

        if (error) {
            res.status(400).json({ error: 'Failed to delete product' });
            return;
        }
        res.status(204).send();
    } catch (err) {
        console.error('[Products DELETE Error]:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
