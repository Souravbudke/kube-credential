export interface Credential {
  id: string;
  holderName: string;
  credentialType: string;
  issueDate: string;
  expiryDate?: string;
  issuerName: string;
  data: Record<string, any>;
}

export interface IssuedCredential extends Credential {
  issuedBy: string; // worker ID
  timestamp: string;
}

export interface VerificationResult {
  isValid: boolean;
  credential?: IssuedCredential;
  verifiedBy: string;
  verificationTimestamp: string;
  message: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface WorkerInfo {
  workerId: string;
  hostname: string;
  timestamp: string;
}

export interface VerificationRequest {
  credential: Credential;
}