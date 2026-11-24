import { Router } from 'express';
import {
  getRequests,
  createRequest,
  approveRequest,
  rejectRequest,
} from '../controllers/request.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getRequests);
router.post('/', authenticate, authorize(['NGO', 'ADMIN']), createRequest);
router.put('/:id/approve', authenticate, authorize(['DONOR', 'ADMIN']), approveRequest);
router.put('/:id/reject', authenticate, authorize(['DONOR', 'ADMIN']), rejectRequest);

export default router;
