import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { PORT } from './config.js';
import healthRoutes from './routes/health.js';
import catalogRoutes from './routes/catalog.js';
import orderRoutes from './routes/orders.js';
import demoRoutes from './routes/demo.js';
import bankAccountRoutes from './routes/bankAccount.js';
import authRoutes from './routes/auth.js';
import { apiRateLimiter } from './middleware/security.js';

// Initialisiere Express-App
const app = express();

// Deployment hinter genau einem Reverse Proxy (Apache)
app.set('trust proxy', 1);

// CORS: Erlaube Anfragen vom Frontend (Vite Dev-Server)
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
}));

// Middleware: JSON-Parser mit 2MB Limit für Request-Body
app.use(express.json({ limit: '2mb' }));

// Middleware: Cookie-Parser für JWT-Cookies
app.use(cookieParser());

// Middleware: Rate Limiting für alle API-Routen (außer health)
app.use('/api', apiRateLimiter);

// HTTP-Routen registrieren
app.use(healthRoutes);           // GET /health
app.use('/api', authRoutes);      // POST /api/auth/login, /api/auth/logout, GET /api/auth/me
app.use('/api', catalogRoutes);   // GET /api/catalog
app.use('/api', orderRoutes);     // POST /api/orders/create-and-complete
app.use('/api', demoRoutes);      // POST /api/demo/orders/create-and-complete
app.use('/api', bankAccountRoutes); // GET /api/bank-account

// Server starten
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`Security features enabled: Rate Limiting, Audit Logging, Authorization`);
});
