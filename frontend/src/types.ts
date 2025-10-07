// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Credential types
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
  issuedBy: string;
  timestamp: string;
}

export interface VerificationResult {
  isValid: boolean;
  credential?: IssuedCredential;
  verifiedBy: string;
  verificationTimestamp: string;
  message: string;
}

// Form types
export interface CredentialFormData {
  holderName: string;
  credentialType: string;
  issueDate: string;
  expiryDate: string;
  issuerName: string;
  customData: Record<string, any>;
}

// Worker info
export interface WorkerInfo {
  workerId: string;
  hostname: string;
  timestamp: string;
}