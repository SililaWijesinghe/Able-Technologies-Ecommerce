import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { createServer as createViteServer } from 'vite';
import authRoutes from './routes/auth';
import settingsRoutes from './routes/settings';
import categoriesRoutes from './routes/categories';
import brandsRoutes from './routes/brands';
import productsRoutes from './routes/products';
import ordersRoutes from './routes/orders';

dotenv.config();

async function startServer() {
  const app = express();
  
  // Note: The environment explicitly dictates binding to port 3000 and 0.0.0.0.
  // Overriding process.env.PORT to strictly adhere to container ingress requirements.
  const PORT = 3000;

  // Middleware to parse JSON requests
  app.use(express.json());

  // Initialize Supabase Client (Service Role for Admin backend ops)
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
  
  let supabase: ReturnType<typeof createClient> | null = null;
  if (supabaseUrl && supabaseKey && !supabaseUrl.includes('placeholder.supabase.co')) {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log("Supabase client initialized successfully.");
  } else {
    console.info("Using in-memory mock database for Able Technologies store preview.");
  }

  // Health Endpoint
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'Backend is active',
      supabase: !!supabase,
      mockMode: !supabase
    });
  });

  // Auth Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/settings', settingsRoutes);
  app.use('/api/categories', categoriesRoutes);
  app.use('/api/brands', brandsRoutes);
  app.use('/api/products', productsRoutes);
  app.use('/api/orders', ordersRoutes);

  // Vite Middleware (for development SPA serving) vs Static (for production)
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Catch-all route to serve the React SPA
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Start the server
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
