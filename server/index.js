import express from 'express';
import cors from 'cors';
import { PORT } from './config.js';
import healthRoutes from './routes/health.js';
import catalogRoutes from './routes/catalog.js';
import orderRoutes from './routes/orders.js';

// Initialisiere Express-App
const app = express();

// CORS: Erlaube Anfragen vom Frontend (Vite Dev-Server)
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
}));

// Middleware: JSON-Parser mit 2MB Limit für Request-Body
app.use(express.json({ limit: '2mb' }));

// HTTP-Routen registrieren
app.use(healthRoutes);           // GET /health
app.use('/api', catalogRoutes);   // GET /api/catalog
app.use('/api', orderRoutes);     // POST /api/orders/create-and-complete

// Server starten
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
