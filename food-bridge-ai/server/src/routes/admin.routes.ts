import { Router } from 'express';
import {
  getUsers,
  verifyOrganization,
  getAuditLogs,
} from '../controllers/admin.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate, authorize(['ADMIN']));

router.get('/users', getUsers);
router.put('/organizations/:id/verify', verifyOrganization);
router.get('/audit-logs', getAuditLogs);

export default router;
