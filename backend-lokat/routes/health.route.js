import { Router } from 'express';
import { healthcheck } from '../controllers/health.controller.js';

const router = Router();

router.get('/', healthcheck);
router.get('/status', healthcheck);

export default router