import { Request, Response, NextFunction } from 'express';
import { getSupabase } from '../src/lib/supabaseServer';

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
