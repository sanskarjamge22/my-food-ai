import { Router, Request, Response, NextFunction } from 'express';
import { AiMatchingService } from '../services/aiMatching.service';
import { AiAssistantService } from '../services/aiAssistant.service';
import { authenticate } from '../middleware/auth';

const router = Router();

// GET /api/ai/matches/:donationId
router.get('/matches/:donationId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { donationId } = req.params;
    const matches = await AiMatchingService.findMatchesForDonation(donationId);
    return res.json({ success: true, count: matches.length, matches });
  } catch (error) {
    next(error);
  }
});

// POST /api/ai/assistant (Chat with Food Waste Assistant)
router.post('/assistant', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { messages, userContext } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ success: false, message: 'Messages array is required' });
    }

    const response = await AiAssistantService.handleChat(messages, userContext);
    return res.json({ success: true, ...response });
  } catch (error) {
    next(error);
  }
});

// POST /api/ai/recommendations
router.post('/recommendations', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { donationDetails } = req.body;
    return res.json({
      success: true,
      recommendation: {
        suggestedUrgency: 'HIGH',
        packagingTips: 'Seal tightly in insulated containers. Keep hot items above 60°C or refrigerate immediately.',
        recommendedRadiusKm: 12,
        notes: 'AI recommendation based on standard perishable cooked food guidelines.',
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
