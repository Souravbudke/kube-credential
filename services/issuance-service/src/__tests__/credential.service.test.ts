import { CredentialService } from '../services/credential.service';
import { DatabaseService } from '../services/database.service';
import { Credential } from '../types';

// Mock the DatabaseService
jest.mock('../services/database.service');

describe('CredentialService', () => {
  let credentialService: CredentialService;
  let mockDatabaseService: jest.Mocked<DatabaseService>;

  const mockCredential: Credential = {
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

  beforeEach(() => {
    mockDatabaseService = {
      findCredentialById: jest.fn(),
      saveCredential: jest.fn(),
      getAllCredentials: jest.fn(),
      close: jest.fn()
    } as any;

    (DatabaseService as jest.Mock).mockImplementation(() => mockDatabaseService);
    credentialService = new CredentialService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('issueCredential', () => {
    it('should issue a new credential successfully', async () => {
      mockDatabaseService.findCredentialById.mockResolvedValue(null);

      const result = await credentialService.issueCredential(mockCredential);

      expect(result.message).toContain('credential issued by');
      expect(result.credential.id).toBe(mockCredential.id);
      expect(result.credential.holderName).toBe(mockCredential.holderName);
      expect(result.credential.issuedBy).toBeDefined();
      expect(result.credential.timestamp).toBeDefined();
      expect(mockDatabaseService.saveCredential).toHaveBeenCalled();
    });

    it('should return existing credential if already issued', async () => {
      const existingCredential = {
        ...mockCredential,
        issuedBy: 'worker-test-123',
        timestamp: '2024-01-01T00:00:00.000Z'
      };

      mockDatabaseService.findCredentialById.mockResolvedValue(existingCredential);

      const result = await credentialService.issueCredential(mockCredential);

      expect(result.message).toBe('Credential already issued');
      expect(result.credential.id).toBe(existingCredential.id);
      expect(mockDatabaseService.saveCredential).not.toHaveBeenCalled();
    });

    it('should throw error on database failure', async () => {
      mockDatabaseService.findCredentialById.mockRejectedValue(new Error('Database error'));

      await expect(credentialService.issueCredential(mockCredential)).rejects.toThrow('Failed to issue credential');
    });
  });

  describe('getCredentialById', () => {
    it('should retrieve credential successfully', async () => {
      const existingCredential = {
        ...mockCredential,
        issuedBy: 'worker-test-123',
        timestamp: '2024-01-01T00:00:00.000Z'
      };

      mockDatabaseService.findCredentialById.mockResolvedValue(existingCredential);

      const result = await credentialService.getCredentialById('test-123');

      expect(result).toEqual(existingCredential);
    });

    it('should return null for non-existent credential', async () => {
      mockDatabaseService.findCredentialById.mockResolvedValue(null);

      const result = await credentialService.getCredentialById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('validateCredentialData', () => {
    it('should validate correct credential data', async () => {
      const result = await credentialService.validateCredentialData(mockCredential);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing required fields', async () => {
      const invalidCredential = {
        id: 'test-123',
        holderName: 'John Doe'
        // Missing required fields
      };

      const result = await credentialService.validateCredentialData(invalidCredential);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors).toContain('Credential type is required and must be a string');
    });

    it('should detect invalid date format', async () => {
      const invalidDateCredential = {
        ...mockCredential,
        issueDate: 'invalid-date'
      };

      const result = await credentialService.validateCredentialData(invalidDateCredential);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Issue date must be in ISO format (YYYY-MM-DDTHH:mm:ss.sssZ)');
    });
  });

  describe('getWorkerInfo', () => {
    it('should return worker information', () => {
      const workerInfo = credentialService.getWorkerInfo();

      expect(workerInfo.workerId).toBeDefined();
      expect(workerInfo.hostname).toBeDefined();
      expect(workerInfo.timestamp).toBeDefined();
      expect(workerInfo.workerId).toContain('worker-');
    });
  });
});
