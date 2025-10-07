import { Router } from 'express';
import { CredentialController } from '../controllers/credential.controller';

const router = Router();
const credentialController = new CredentialController();

// Health check endpoint
router.get('/health', (req, res) => credentialController.healthCheck(req, res));

// Worker information endpoint
router.get('/worker', (req, res) => credentialController.getWorkerInfo(req, res));

// Credential endpoints
router.post('/credentials', (req, res) => credentialController.issueCredential(req, res));
router.get('/credentials', (req, res) => credentialController.getAllCredentials(req, res));
router.get('/credentials/:id', (req, res) => credentialController.getCredential(req, res));

export default router;