import { v4 as uuidv4 } from 'uuid';
import { Credential, IssuedCredential, WorkerInfo } from '../types';
import { DatabaseService } from './database.service';
import os from 'os';

export class CredentialService {
  private dbService: DatabaseService;
  private workerInfo: WorkerInfo;

  constructor() {
    this.dbService = new DatabaseService();
    this.workerInfo = {
      workerId: this.generateWorkerId(),
      hostname: os.hostname(),
      timestamp: new Date().toISOString()
    };
  }

  private generateWorkerId(): string {
    const hostname = os.hostname();
    const pid = process.pid;
    const random = Math.random().toString(36).substring(2, 8);
    return `worker-${hostname}-${pid}-${random}`;
  }

  async issueCredential(credentialData: Credential): Promise<{ credential: IssuedCredential; message: string }> {
    try {
      // Check if credential already exists
      const existingCredential = await this.dbService.findCredentialById(credentialData.id);
      
      if (existingCredential) {
        return {
          credential: existingCredential,
          message: 'Credential already issued'
        };
      }

      // Create new issued credential
      const issuedCredential: IssuedCredential = {
        ...credentialData,
        issuedBy: this.workerInfo.workerId,
        timestamp: new Date().toISOString()
      };

      // Save to database
      await this.dbService.saveCredential(issuedCredential);

      return {
        credential: issuedCredential,
        message: `credential issued by ${this.workerInfo.workerId}`
      };
    } catch (error) {
      throw new Error(`Failed to issue credential: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getCredentialById(id: string): Promise<IssuedCredential | null> {
    try {
      return await this.dbService.findCredentialById(id);
    } catch (error) {
      throw new Error(`Failed to retrieve credential: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getAllCredentials(): Promise<IssuedCredential[]> {
    try {
      return await this.dbService.getAllCredentials();
    } catch (error) {
      throw new Error(`Failed to retrieve credentials: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  getWorkerInfo(): WorkerInfo {
    return this.workerInfo;
  }

  async validateCredentialData(credential: any): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    if (!credential.id || typeof credential.id !== 'string') {
      errors.push('Credential ID is required and must be a string');
    }

    if (!credential.holderName || typeof credential.holderName !== 'string') {
      errors.push('Holder name is required and must be a string');
    }

    if (!credential.credentialType || typeof credential.credentialType !== 'string') {
      errors.push('Credential type is required and must be a string');
    }

    if (!credential.issueDate || typeof credential.issueDate !== 'string') {
      errors.push('Issue date is required and must be a string');
    }

    if (!credential.issuerName || typeof credential.issuerName !== 'string') {
      errors.push('Issuer name is required and must be a string');
    }

    if (!credential.data || typeof credential.data !== 'object') {
      errors.push('Credential data is required and must be an object');
    }

    // Validate date format
    if (credential.issueDate && !this.isValidISODate(credential.issueDate)) {
      errors.push('Issue date must be in ISO format (YYYY-MM-DDTHH:mm:ss.sssZ)');
    }

    if (credential.expiryDate && !this.isValidISODate(credential.expiryDate)) {
      errors.push('Expiry date must be in ISO format (YYYY-MM-DDTHH:mm:ss.sssZ)');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private isValidISODate(dateString: string): boolean {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime()) && date.toISOString() === dateString;
  }
}