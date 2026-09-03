import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { getSupabase } from '../src/lib/supabaseServer';

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
