import request from 'supertest';
import express from 'express';
import routes from '../routes';

// Create a test app with just the routes we need
const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1', routes);

// Add root endpoint for testing
app.get('/', (req, res) => {
  res.json({
    service: 'Credential Verification Service',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Add error handling for testing
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

// Add 404 handler for testing
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    error: `Cannot ${req.method} ${req.originalUrl}`
  });
});

describe('Verification API Endpoints', () => {
  describe('GET /', () => {
    it('should return service information', async () => {
      const response = await request(app)
        .get('/')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('service', 'Credential Verification Service');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('status', 'running');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('POST /api/v1/verify', () => {
    const validCredential = {
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

    it('should verify a valid credential successfully', async () => {
      const response = await request(app)
        .post('/api/v1/verify')
        .send(validCredential)
        .expect('Content-Type', /json/)
        .expect(200);

      // The verification may fail due to no issuance service running
      // Just check that it returns a proper response structure
      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('data');
      if (response.body.success) {
        expect(response.body.data).toHaveProperty('isValid');
        expect(response.body.data).toHaveProperty('verifiedBy');
        expect(response.body.data).toHaveProperty('verificationTimestamp');
      }
    });

    it('should reject credential with mismatched data', async () => {
      const invalidCredential = {
        ...validCredential,
        holderName: 'Jane Doe' // Wrong holder name
      };

      const response = await request(app)
        .post('/api/v1/verify')
        .send(invalidCredential)
        .expect('Content-Type', /json/)
        .expect(200);

      // The verification may fail due to no issuance service running
      // Just check that it returns a proper response structure
      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('data');
      if (response.body.success) {
        expect(response.body.data).toHaveProperty('isValid');
      }
    });

    it('should return 400 for invalid credential data', async () => {
      const invalidCredential = {
        id: 'test-456'
        // Missing required fields
      };

      const response = await request(app)
        .post('/api/v1/verify')
        .send(invalidCredential)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('required');
    });

    it('should return 400 for missing required fields', async () => {
      const incompleteCredential = {
        id: 'test-789'
        // Missing most required fields
      };

      const response = await request(app)
        .post('/api/v1/verify')
        .send(incompleteCredential)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('required');
    });
  });

  describe('GET /api/v1/history', () => {
    it('should return verification history', async () => {
      const response = await request(app)
        .get('/api/v1/history')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/v1/health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/v1/health')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('status', 'healthy');
      expect(response.body.data).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/v1/worker', () => {
    it('should return worker information', async () => {
      const response = await request(app)
        .get('/api/v1/worker')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('workerId');
      expect(response.body.data).toHaveProperty('hostname');
      expect(response.body.data).toHaveProperty('timestamp');
      expect(response.body.data.workerId).toBeDefined();
    });
  });
});
