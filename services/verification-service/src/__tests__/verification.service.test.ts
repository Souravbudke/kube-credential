import { VerificationService } from '../services/verification.service';
import { Credential } from '../types';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('VerificationService', () => {
  let verificationService: VerificationService;

  const mockCredential = {
    id: 'test-123',
    holderName: 'John Doe',
    credentialType: 'certificate',
    issueDate: '2024-01-01T00:00:00.000Z',
    issuerName: 'Test University',
    data: {
      course: 'Computer Science',
      grade: 'A+'
    },
    issuedBy: 'worker-issuance-service-123',
    timestamp: '2024-01-01T00:00:00.000Z'
  };

  beforeEach(() => {
    mockedAxios.get.mockClear();
    verificationService = new VerificationService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('verifyCredential', () => {
    it('should verify a valid credential successfully', async () => {
      mockedAxios.get.mockResolvedValue({
        data: {
          success: true,
          data: mockCredential
        }
      });

      const credentialToVerify = {
        id: 'test-123',
        holderName: 'John Doe',
        credentialType: 'certificate',
        issueDate: '2024-01-01T00:00:00.000Z',
        issuerName: 'Test University',
        data: {
          course: 'Computer Science',
          grade: 'A+'
        }
      };

      const result = await verificationService.verifyCredential(credentialToVerify);

      expect(result.isValid).toBe(true);
      expect(result.verifiedBy).toContain('verifier-');
      expect(result.verificationTimestamp).toBeDefined();
      expect(result.message).toContain('Credential verified successfully');
      expect(result.message).toContain('Originally issued by worker-issuance-service-123');
    });

    it('should reject credential with mismatched data', async () => {
      mockedAxios.get.mockResolvedValue({
        data: {
          success: true,
          data: mockCredential
        }
      });

      const credentialToVerify = {
        id: 'test-123',
        holderName: 'Jane Doe', // Different holder name
        credentialType: 'certificate',
        issueDate: '2024-01-01T00:00:00.000Z',
        issuerName: 'Test University',
        data: {
          course: 'Computer Science',
          grade: 'A+'
        }
      };

      const result = await verificationService.verifyCredential(credentialToVerify);

      expect(result.isValid).toBe(false);
      expect(result.message).toContain('Credential data mismatch');
    });

    it('should reject non-existent credential', async () => {
      mockedAxios.get.mockResolvedValue({
        data: null
      });

      const credentialToVerify = {
        id: 'non-existent',
        holderName: 'John Doe',
        credentialType: 'certificate',
        issueDate: '2024-01-01T00:00:00.000Z',
        issuerName: 'Test University',
        data: {}
      };

      const result = await verificationService.verifyCredential(credentialToVerify);

      expect(result.isValid).toBe(false);
      expect(result.message).toContain('Credential not found');
    });

    it('should handle issuance service errors', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Issuance service error'));

      const credentialToVerify = {
        id: 'test-123',
        holderName: 'John Doe',
        credentialType: 'certificate',
        issueDate: '2024-01-01T00:00:00.000Z',
        issuerName: 'Test University',
        data: {}
      };

      const result = await verificationService.verifyCredential(credentialToVerify);

      expect(result.isValid).toBe(false);
      expect(result.message).toContain('Verification error');
    });
  });

  describe('getWorkerInfo', () => {
    it('should return worker information', () => {
      const workerInfo = verificationService.getWorkerInfo();

      expect(workerInfo.workerId).toBeDefined();
      expect(workerInfo.hostname).toBeDefined();
      expect(workerInfo.timestamp).toBeDefined();
      expect(workerInfo.workerId).toContain('verifier-');
    });
  });

  describe('validateCredentialData', () => {
    it('should validate correct credential data', async () => {
      const credential = {
        id: 'test-123',
        holderName: 'John Doe',
        credentialType: 'certificate',
        issueDate: '2024-01-01T00:00:00.000Z',
        issuerName: 'Test University',
        data: {}
      };

      const result = await verificationService.validateCredentialData(credential);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing required fields', async () => {
      const invalidCredential = {
        id: 'test-123'
        // Missing required fields
      };

      const result = await verificationService.validateCredentialData(invalidCredential);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors).toContain('Holder name is required and must be a string');
    });

    it('should detect invalid date format', async () => {
      const invalidDateCredential = {
        id: 'test-123',
        holderName: 'John Doe',
        credentialType: 'certificate',
        issueDate: 'invalid-date',
        issuerName: 'Test University',
        data: {}
      };

      const result = await verificationService.validateCredentialData(invalidDateCredential);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Issue date must be in ISO format (YYYY-MM-DDTHH:mm:ss.sssZ)');
    });
  });
});
