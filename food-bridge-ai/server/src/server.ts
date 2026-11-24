import express from 'express';
import cors from 'cors';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';
import { scanAndExpireDonations } from './services/urgency.service';

import authRoutes from './routes/auth.routes';
import donationRoutes from './routes/donation.routes';
import requestRoutes from './routes/request.routes';
import aiRoutes from './routes/ai.routes';
import volunteerRoutes from './routes/volunteer.routes';
import analyticsRoutes from './routes/analytics.routes';
import notificationRoutes from './routes/notification.routes';
import adminRoutes from './routes/admin.routes';
import organizationRoutes from './routes/organization.routes';

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Food Bridge AI - Smart Food Waste Rescue Platform',
    version: '1.0.0',
    mode: config.aiMockMode ? 'Demo / Rule-Based AI Engine' : 'Production LLM Engine',
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/deliveries', volunteerRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/organizations', organizationRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Background automated urgency and expiry scanner (every 45 seconds)
setInterval(() => {
  scanAndExpireDonations().catch((err) => {
    console.error('Urgency background check error:', err);
  });
}, 45000);

const server = app.listen(config.port, () => {
  console.log(`====================================================`);
  console.log(`🌿 FOOD BRIDGE AI SERVER RUNNING ON PORT ${config.port}`);
  console.log(`   Health Check: http://localhost:${config.port}/api/health`);
  console.log(`   Mode: ${config.nodeEnv.toUpperCase()} | AI Mock: ${config.aiMockMode}`);
  console.log(`====================================================`);
});

export default app;
