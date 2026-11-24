import { Router } from 'express';
import {
  getDonations,
  getDonationById,
  createDonation,
  updateDonation,
  deleteDonation,
  getOrganizations,
} from '../controllers/donation.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/organizations', getOrganizations);
router.get('/', getDonations);
router.get('/:id', getDonationById);
router.post('/', authenticate, authorize(['DONOR', 'ADMIN']), createDonation);
router.put('/:id', authenticate, authorize(['DONOR', 'ADMIN']), updateDonation);
router.delete('/:id', authenticate, authorize(['DONOR', 'ADMIN']), deleteDonation);

export default router;
