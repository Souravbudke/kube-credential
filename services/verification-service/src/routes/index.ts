import { Router } from 'express';
import { VerificationController } from '../controllers/verification.controller';

const router = Router();
const verificationController = new VerificationController();

// Health check endpoint
router.get('/health', (req, res) => verificationController.healthCheck(req, res));

// Worker information endpoint
router.get('/worker', (req, res) => verificationController.getWorkerInfo(req, res));

// Verification endpoints
router.post('/verify', (req, res) => verificationController.verifyCredential(req, res));
router.get('/history', (req, res) => verificationController.getVerificationHistory(req, res));

export default router;