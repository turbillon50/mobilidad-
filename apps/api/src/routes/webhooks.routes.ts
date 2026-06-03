import { Router } from 'express';
import * as webhooks from '../controllers/webhooks.controller';

const router = Router();
router.post('/stripe', webhooks.stripeWebhook);
export default router;