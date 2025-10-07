import { Request, Response } from 'express';
import { CredentialService } from '../services/credential.service';
import { ApiResponse, Credential } from '../types';

export class CredentialController {
  private credentialService: CredentialService;

  constructor() {
    this.credentialService = new CredentialService();
  }

  async issueCredential(req: Request, res: Response): Promise<void> {
    try {
      const credentialData = req.body;

      // Validate credential data
      const validation = await this.credentialService.validateCredentialData(credentialData);
      if (!validation.isValid) {
        const response: ApiResponse = {
          success: false,
          message: 'Invalid credential data',
          error: validation.errors.join(', ')
        };
        res.status(400).json(response);
        return;
      }

      // Issue credential
      const result = await this.credentialService.issueCredential(credentialData as Credential);

      const response: ApiResponse = {
        success: true,
        message: result.message,
        data: result.credential
      };

      const statusCode = result.message.includes('already issued') ? 200 : 201;
      res.status(statusCode).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to issue credential',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  }

  async getCredential(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        const response: ApiResponse = {
          success: false,
          message: 'Credential ID is required',
          error: 'Missing credential ID in request parameters'
        };
        res.status(400).json(response);
        return;
      }

      const credential = await this.credentialService.getCredentialById(id);

      if (!credential) {
        const response: ApiResponse = {
          success: false,
          message: 'Credential not found',
          error: `No credential found with ID: ${id}`
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: 'Credential retrieved successfully',
        data: credential
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve credential',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  }

  async getAllCredentials(req: Request, res: Response): Promise<void> {
    try {
      const credentials = await this.credentialService.getAllCredentials();

      const response: ApiResponse = {
        success: true,
        message: 'Credentials retrieved successfully',
        data: credentials
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve credentials',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  }

  async getWorkerInfo(req: Request, res: Response): Promise<void> {
    try {
      const workerInfo = this.credentialService.getWorkerInfo();

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
      const workerInfo = this.credentialService.getWorkerInfo();
      
      const response: ApiResponse = {
        success: true,
        message: 'Service is healthy',
        data: {
          service: 'credential-issuance',
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