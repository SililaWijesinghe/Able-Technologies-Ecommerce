import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';

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

// Extend Express Request to include the authenticated user
export interface AuthRequest extends Request {
    user?: any;
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Missing or malformed authorization header.' });
            return;
        }

        const token = authHeader.split(' ')[1];
        
        // Verify the JWT token via Supabase Auth
        const { data: { user }, error } = await getSupabase().auth.getUser(token);

        if (error || !user) {
            res.status(401).json({ error: 'Unauthorized: Invalid or expired token.' });
            return;
        }

        // Attach the authenticated user object to the request
        req.user = user;
        next();
    } catch (err) {
        console.error('[Auth Middleware Error]:', err);
        res.status(500).json({ error: 'An unexpected internal error occurred during authentication.' });
    }
};
