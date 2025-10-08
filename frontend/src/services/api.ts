import axios from 'axios';
import { ApiResponse, Credential, IssuedCredential, VerificationResult, WorkerInfo } from '../types';

const ISSUANCE_API_URL = import.meta.env.VITE_ISSUANCE_API_URL || 'http://localhost:3001/api/v1';
const VERIFICATION_API_URL = import.meta.env.VITE_VERIFICATION_API_URL || 'http://localhost:3002/api/v1';

console.log('🚀 API Configuration:');
console.log('Issuance API URL:', ISSUANCE_API_URL);
console.log('Verification API URL:', VERIFICATION_API_URL);

class ApiService {
  private issuanceApi = axios.create({
    baseURL: ISSUANCE_API_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  private verificationApi = axios.create({
    baseURL: VERIFICATION_API_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Issuance Service Methods
  async issueCredential(credential: Credential): Promise<ApiResponse<IssuedCredential>> {
    try {
      const response = await this.issuanceApi.post('/credentials', credential);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || error.message);
      }
      throw error;
    }
  }

  async getCredential(id: string): Promise<ApiResponse<IssuedCredential>> {
    try {
      const response = await this.issuanceApi.get(`/credentials/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || error.message);
      }
      throw error;
    }
  }

  async getAllCredentials(): Promise<ApiResponse<IssuedCredential[]>> {
    try {
      const response = await this.issuanceApi.get('/credentials');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || error.message);
      }
      throw error;
    }
  }

  async getIssuanceWorkerInfo(): Promise<ApiResponse<WorkerInfo>> {
    try {
      const response = await this.issuanceApi.get('/worker');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || error.message);
      }
      throw error;
    }
  }

  async checkIssuanceHealth(): Promise<ApiResponse> {
    try {
      console.log('🔍 Checking issuance service health at:', this.issuanceApi.defaults.baseURL + '/health');
      const response = await this.issuanceApi.get('/health');
      console.log('✅ Issuance health check successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Issuance health check failed:', error);
      if (axios.isAxiosError(error)) {
        console.error('❌ Axios error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url,
          baseURL: error.config?.baseURL
        });
        throw new Error(error.response?.data?.error || error.message);
      }
      throw error;
    }
  }

  // Verification Service Methods
  async verifyCredential(credential: Credential): Promise<ApiResponse<VerificationResult>> {
    try {
      const response = await this.verificationApi.post('/verify', { credential });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || error.message);
      }
      throw error;
    }
  }

  async getVerificationHistory(credentialId?: string): Promise<ApiResponse<VerificationResult[]>> {
    try {
      const params = credentialId ? { credentialId } : {};
      const response = await this.verificationApi.get('/history', { params });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || error.message);
      }
      throw error;
    }
  }

  async getVerificationWorkerInfo(): Promise<ApiResponse<WorkerInfo>> {
    try {
      const response = await this.verificationApi.get('/worker');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || error.message);
      }
      throw error;
    }
  }

  async checkVerificationHealth(): Promise<ApiResponse> {
    try {
      console.log('🔍 Checking verification service health at:', this.verificationApi.defaults.baseURL + '/health');
      const response = await this.verificationApi.get('/health');
      console.log('✅ Verification health check successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Verification health check failed:', error);
      if (axios.isAxiosError(error)) {
        console.error('❌ Axios error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url,
          baseURL: error.config?.baseURL
        });
        throw new Error(error.response?.data?.error || error.message);
      }
      throw error;
    }
  }
}

export const apiService = new ApiService();