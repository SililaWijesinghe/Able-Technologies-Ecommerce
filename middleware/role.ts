import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
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

export const requireRole = (requiredRole: 'CUSTOMER' | 'ADMIN') => {
    return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const user = req.user;
            
            if (!user) {
                res.status(401).json({ error: 'Unauthorized: No user attached to request context.' });
                return;
            }

            // Query the custom users table to verify the assigned role
            const { data: profile, error } = await getSupabase()
                .from('users')
                .select('role')
                .eq('id', user.id)
                .single();

            if (error || !profile) {
                res.status(403).json({ error: 'Forbidden: Unable to verify user role permissions.' });
                return;
            }

            if (profile.role !== requiredRole) {
                res.status(403).json({ error: 'Forbidden: Insufficient privileges for this action.' });
                return;
            }

            next();
        } catch (err) {
            console.error('[Role Middleware Error]:', err);
            res.status(500).json({ error: 'An unexpected internal error occurred during role verification.' });
        }
    };
};
