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

// POST /api/orders
router.post('/', async (req, res): Promise<void> => {
    try {
        // Require auth token check. Since we are using Supabase directly in this route,
        // we can fetch the user by validating the Bearer token or just checking the body if auth is simple for now.
        // Wait, the requirement says "verify the user's auth token (require login)".
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Missing or invalid authentication token.' });
            return;
        }

        const token = authHeader.split(' ')[1];

        const { data: { user }, error: authError } = await getSupabase().auth.getUser(token);
        if (authError || !user) {
            res.status(401).json({ error: 'Invalid or expired authentication token.' });
            return;
        }
        
        const userId = user.id;

        const { cartItems, shippingAddress, shippingMethod, paymentMethod, grandTotal, subtotal, shippingCost, vat } = req.body;

        if (!cartItems || cartItems.length === 0) {
            res.status(400).json({ error: 'Cart is empty.' });
            return;
        }

        const supabase = getSupabase();

        // 1. Insert order
        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert({
                user_id: userId,
                shipping_address: shippingAddress,
                shipping_method: shippingMethod,
                payment_method: paymentMethod,
                subtotal: subtotal,
                shipping_cost: shippingCost,
                vat: vat,
                total_amount: grandTotal,
                status: 'pending'
            })
            .select()
            .single();

        if (orderError || !orderData) {
             console.error("Order insert failed:", orderError);
             res.status(500).json({ error: 'Failed to create order.' });
             return;
        }

        const actualOrderId = orderData.id;

        // 2. Insert order items
        const orderItemsData = cartItems.map((item: any) => ({
            order_id: actualOrderId,
            product_id: item.productId,
            product_name: item.name, // Snapshot name
            unit_price: item.price, // Snapshot price
            quantity: item.quantity,
            variant: item.variant || null
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItemsData);

        if (itemsError) {
             console.error("Order items insert failed:", itemsError);
             // Return failure even if the master order record inserted
             res.status(500).json({ error: 'Failed to create order items.' });
             return;
        }

        res.status(201).json({ 
            message: 'Order placed successfully.',
            orderId: actualOrderId
        });

    } catch (err) {
        console.error('[Order Placement Error]:', err);
        res.status(500).json({ error: 'An unexpected internal error occurred during order placement.' });
    }
});


// GET /api/orders/me
router.get('/me', async (req, res): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Missing or invalid authentication token.' });
            return;
        }

        const token = authHeader.split(' ')[1];

        const { data: { user }, error: authError } = await getSupabase().auth.getUser(token);
        if (authError || !user) {
            res.status(401).json({ error: 'Invalid or expired authentication token.' });
            return;
        }
        
        const userId = user.id;
        
        const supabase = getSupabase();
        
        const { data: orders, error } = await supabase
            .from('orders')
            .select(`
                *,
                order_items (*)
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            res.status(500).json({ error: 'Failed to fetch orders.' });
            return;
        }
        
        res.status(200).json({ orders });
    } catch (err) {
        console.error('[Fetch Orders Error]:', err);
        res.status(500).json({ error: 'An unexpected internal error occurred.' });
    }
});
export default router;
