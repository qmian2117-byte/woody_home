import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import { cartSessionMiddleware } from './middleware/cartSession.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import checkoutRoutes from './routes/checkoutRoutes.js';
import mcpRoutes from './routes/mcpRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import stripeRoutes from './routes/stripeRoutes.js';

dotenv.config();

const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin: [FRONTEND_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-cart-session']
}));
app.use(morgan('dev'));

// Stripe Webhook needs the raw payload to verify signatures
app.use('/api/webhook/stripe', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api', apiLimiter);
app.use('/api', cartSessionMiddleware);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    name: 'Woody Home Custom Backend',
    version: '1.0.0',
    cartSession: req.cartSessionToken || null,
    timestamp: new Date().toISOString()
  });
});

app.use('/api', productRoutes);
app.use('/api', cartRoutes);
app.use('/api', searchRoutes);
app.use('/api', checkoutRoutes);
app.use('/api', mcpRoutes);
app.use('/api', contactRoutes);
app.use('/api', stripeRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
