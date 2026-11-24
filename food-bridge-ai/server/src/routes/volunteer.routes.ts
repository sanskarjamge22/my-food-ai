import { Router } from 'express';
import {
  getVolunteers,
  getDeliveries,
  assignDelivery,
  updateDeliveryStatus,
} from '../controllers/volunteer.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getVolunteers);
router.get('/deliveries', authenticate, getDeliveries);
router.post('/deliveries/assign', authenticate, assignDelivery);
router.put('/deliveries/:id/status', authenticate, updateDeliveryStatus);

export default router;
