import { Router } from 'express';
import {
  getDashboardStats,
  getMonthlyTrends,
  getCategoryBreakdown,
  getUrgencyDistribution,
} from '../controllers/analytics.controller';

const router = Router();

router.get('/dashboard', getDashboardStats);
router.get('/monthly', getMonthlyTrends);
router.get('/impact', getDashboardStats);
router.get('/categories', getCategoryBreakdown);
router.get('/urgencies', getUrgencyDistribution);

export default router;
