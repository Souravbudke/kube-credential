import { Request, Response } from 'express';
import { VerificationService } from '../services/verification.service';
import { ApiResponse, Credential } from '../types';

export class VerificationController {
  private verificationService: VerificationService;

  constructor() {
    this.verificationService = new VerificationService();
  }

  async verifyCredential(req: Request, res: Response): Promise<void> {
    try {
      const credentialData = req.body.credential || req.body;

      // Validate credential data
      const validation = await this.verificationService.validateCredentialData(credentialData);
      if (!validation.isValid) {
        const response: ApiResponse = {
          success: false,
          message: 'Invalid credential data',
          error: validation.errors.join(', ')
        };
        res.status(400).json(response);
        return;
      }

      // Verify credential
      const result = await this.verificationService.verifyCredential(credentialData as Credential);

      const response: ApiResponse = {
        success: result.isValid,
        message: result.message,
        data: result
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to verify credential',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  }

  async getVerificationHistory(req: Request, res: Response): Promise<void> {
    try {
      const { credentialId } = req.query;
      
      const history = await this.verificationService.getVerificationHistory(
        credentialId ? String(credentialId) : undefined
      );

      const response: ApiResponse = {
        success: true,
        message: 'Verification history retrieved successfully',
        data: history
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve verification history',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  }

  async getWorkerInfo(req: Request, res: Response): Promise<void> {
    try {
      const workerInfo = this.verificationService.getWorkerInfo();

      const response: ApiResponse = {
        success: true,
        message: 'Worker information retrieved successfully',
        data: workerInfo
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve worker information',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  }

  async healthCheck(req: Request, res: Response): Promise<void> {
    try {
      const workerInfo = this.verificationService.getWorkerInfo();
      
      const response: ApiResponse = {
        success: true,
        message: 'Service is healthy',
        data: {
          service: 'credential-verification',
          status: 'healthy',
          timestamp: new Date().toISOString(),
          worker: workerInfo
        }
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Service health check failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(503).json(response);
    }
  }
}