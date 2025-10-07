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
    service: 'Credential Issuance Service',
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

describe('API Endpoints', () => {
  describe('GET /', () => {
    it('should return service information', async () => {
      const response = await request(app)
        .get('/')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('service', 'Credential Issuance Service');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('status', 'running');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('POST /api/v1/credentials', () => {
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

    it('should create a new credential successfully', async () => {
      const uniqueId = `test-new-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      const newCredential = {
        id: uniqueId,
        holderName: 'New User',
        credentialType: 'certificate',
        issueDate: '2024-01-01T00:00:00.000Z',
        issuerName: 'Test University',
        data: { course: 'Computer Science' }
      };

      const response = await request(app)
        .post('/api/v1/credentials')
        .send(newCredential)
        .expect('Content-Type', /json/)
        .expect(201); // 201 Created for new credentials

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('credential issued by');
    });

    it('should return existing credential if already issued', async () => {
      const response = await request(app)
        .post('/api/v1/credentials')
        .send(validCredential)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Credential already issued');
    });

    it('should return 400 for invalid credential data', async () => {
      const invalidCredential = {
        id: 'test-invalid-456',
        holderName: 'Jane Doe'
        // Missing required fields
      };

      const response = await request(app)
        .post('/api/v1/credentials')
        .send(invalidCredential)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credential data');
      expect(response.body.error).toContain('required');
    });

    it('should return 400 for missing required fields', async () => {
      const incompleteCredential = {
        id: 'test-incomplete-789'
        // Missing most required fields
      };

      const response = await request(app)
        .post('/api/v1/credentials')
        .send(incompleteCredential)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credential data');
    });
  });

  describe('GET /api/v1/credentials', () => {
    it('should return list of all credentials', async () => {
      const response = await request(app)
        .get('/api/v1/credentials')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/v1/credentials/:id', () => {
    it('should return specific credential', async () => {
      const response = await request(app)
        .get('/api/v1/credentials/test-123')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id', 'test-123');
      expect(response.body.data).toHaveProperty('holderName');
    });

    it('should return 404 for non-existent credential', async () => {
      const response = await request(app)
        .get('/api/v1/credentials/definitely-not-existent-id-12345')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Credential not found');
      expect(response.body.error).toContain('No credential found');
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
      expect(response.body.data.workerId).toContain('worker-');
    });
  });
});
