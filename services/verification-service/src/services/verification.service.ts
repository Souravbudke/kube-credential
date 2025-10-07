import axios from 'axios';
import { Credential, IssuedCredential, VerificationResult, WorkerInfo } from '../types';
import { DatabaseService } from './database.service';
import os from 'os';

export class VerificationService {
  private dbService: DatabaseService;
  private workerInfo: WorkerInfo;
  private issuanceServiceUrl: string;

  constructor() {
    this.dbService = new DatabaseService();
    this.workerInfo = {
      workerId: this.generateWorkerId(),
      hostname: os.hostname(),
      timestamp: new Date().toISOString()
    };
    this.issuanceServiceUrl = process.env.ISSUANCE_SERVICE_URL || 'http://localhost:3001';
  }

  private generateWorkerId(): string {
    const hostname = os.hostname();
    const pid = process.pid;
    const random = Math.random().toString(36).substring(2, 8);
    return `verifier-${hostname}-${pid}-${random}`;
  }

  async verifyCredential(credential: Credential): Promise<VerificationResult> {
    try {
      // Check if credential exists in issuance service
      const issuedCredential = await this.fetchCredentialFromIssuanceService(credential.id);
      
      const verificationTimestamp = new Date().toISOString();
      let result: VerificationResult;

      if (issuedCredential) {
        // Verify credential data matches
        const isValid = this.compareCredentials(credential, issuedCredential);
        
        result = {
          isValid,
          credential: issuedCredential,
          verifiedBy: this.workerInfo.workerId,
          verificationTimestamp,
          message: isValid 
            ? `Credential verified successfully by ${this.workerInfo.workerId}. Originally issued by ${issuedCredential.issuedBy} at ${issuedCredential.timestamp}`
            : `Credential data mismatch. Verification failed by ${this.workerInfo.workerId}`
        };
      } else {
        result = {
          isValid: false,
          verifiedBy: this.workerInfo.workerId,
          verificationTimestamp,
          message: `Credential not found in issuance service. Verification failed by ${this.workerInfo.workerId}`
        };
      }

      // Save verification result to database
      await this.dbService.saveVerificationResult(credential.id, result);

      return result;
    } catch (error) {
      const errorResult: VerificationResult = {
        isValid: false,
        verifiedBy: this.workerInfo.workerId,
        verificationTimestamp: new Date().toISOString(),
        message: `Verification error by ${this.workerInfo.workerId}: ${error instanceof Error ? error.message : 'Unknown error'}`
      };

      // Still save the error result
      try {
        await this.dbService.saveVerificationResult(credential.id, errorResult);
      } catch (dbError) {
        console.error('Failed to save error result to database:', dbError);
      }

      return errorResult;
    }
  }

  private async fetchCredentialFromIssuanceService(credentialId: string): Promise<IssuedCredential | null> {
    try {
      const response = await axios.get(`${this.issuanceServiceUrl}/api/v1/credentials/${credentialId}`, {
        timeout: 5000, // 5 second timeout
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.success && response.data.data) {
        return response.data.data as IssuedCredential;
      }

      return null;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          return null; // Credential not found
        }
        throw new Error(`Issuance service error: ${error.response?.status} - ${error.response?.statusText}`);
      }
      throw new Error(`Failed to connect to issuance service: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private compareCredentials(submitted: Credential, issued: IssuedCredential): boolean {
    // Compare all relevant fields
    return (
      submitted.id === issued.id &&
      submitted.holderName === issued.holderName &&
      submitted.credentialType === issued.credentialType &&
      submitted.issueDate === issued.issueDate &&
      submitted.issuerName === issued.issuerName &&
      this.deepEqual(submitted.data, issued.data) &&
      (submitted.expiryDate || null) === (issued.expiryDate || null)
    );
  }

  private deepEqual(obj1: any, obj2: any): boolean {
    if (obj1 === obj2) {
      return true;
    }

    if (obj1 == null || obj2 == null) {
      return obj1 === obj2;
    }

    if (typeof obj1 !== typeof obj2) {
      return false;
    }

    if (typeof obj1 !== 'object') {
      return obj1 === obj2;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (const key of keys1) {
      if (!keys2.includes(key)) {
        return false;
      }

      if (!this.deepEqual(obj1[key], obj2[key])) {
        return false;
      }
    }

    return true;
  }

  async getVerificationHistory(credentialId?: string): Promise<VerificationResult[]> {
    try {
      return await this.dbService.getVerificationHistory(credentialId);
    } catch (error) {
      throw new Error(`Failed to retrieve verification history: ${error instanceof Error ? error.message : 'Unknown error'}`);
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