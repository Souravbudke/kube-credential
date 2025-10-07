import { useState, useEffect } from 'react';
import { Server, Activity, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { apiService } from '../services/api';
import type { WorkerInfo } from '../types';

interface ServiceHealth {
  service: string;
  status: string;
  worker: WorkerInfo;
  timestamp: string;
}

export default function HealthPage() {
  const [issuanceHealth, setIssuanceHealth] = useState<ServiceHealth | null>(null);
  const [verificationHealth, setVerificationHealth] = useState<ServiceHealth | null>(null);
  const [issuanceError, setIssuanceError] = useState<string | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const checkHealth = async () => {
    setLoading(true);
    setIssuanceError(null);
    setVerificationError(null);

    // Check Issuance Service
    try {
      const response = await apiService.checkIssuanceHealth();
      setIssuanceHealth(response.data);
    } catch (error) {
      setIssuanceError(error instanceof Error ? error.message : 'Failed to connect to issuance service');
      setIssuanceHealth(null);
    }

    // Check Verification Service
    try {
      const response = await apiService.checkVerificationHealth();
      setVerificationHealth(response.data);
    } catch (error) {
      setVerificationError(error instanceof Error ? error.message : 'Failed to connect to verification service');
      setVerificationHealth(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const ServiceCard = ({ 
    title, 
    health, 
    error, 
    color 
  }: { 
    title: string; 
    health: ServiceHealth | null; 
    error: string | null; 
    color: string;
  }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Server className={`w-6 h-6 mr-3 text-${color}-600`} />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="flex items-center">
          {health ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600" />
          )}
          <span className={`ml-2 px-2 py-1 text-xs font-medium rounded ${
            health ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {health ? 'Healthy' : 'Unhealthy'}
          </span>
        </div>
      </div>

      {health ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Status:</span> {health.status}
            </div>
            <div>
              <span className="font-medium text-gray-700">Service:</span> {health.service}
            </div>
            <div>
              <span className="font-medium text-gray-700">Worker ID:</span> {health.worker.workerId}
            </div>
            <div>
              <span className="font-medium text-gray-700">Hostname:</span> {health.worker.hostname}
            </div>
          </div>
          <div className="text-sm">
            <span className="font-medium text-gray-700">Last Check:</span> {new Date(health.timestamp).toLocaleString()}
          </div>
          <div className="text-sm">
            <span className="font-medium text-gray-700">Worker Started:</span> {new Date(health.worker.timestamp).toLocaleString()}
          </div>
        </div>
      ) : (
        <div className="text-red-600 text-sm">
          <p className="font-medium">Connection Failed</p>
          <p>{error}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Activity className="w-8 h-8 text-purple-600 mr-3" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Service Health Status</h1>
            <p className="text-gray-600">Monitor the health and status of microservices</p>
          </div>
        </div>
        <button
          onClick={checkHealth}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <ServiceCard
          title="Credential Issuance Service"
          health={issuanceHealth}
          error={issuanceError}
          color="blue"
        />
        <ServiceCard
          title="Credential Verification Service"
          health={verificationHealth}
          error={verificationError}
          color="green"
        />
      </div>

      {/* Overall System Status */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <Activity className="w-6 h-6 text-purple-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Overall System Status</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center ${
              issuanceHealth && verificationHealth ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {issuanceHealth && verificationHealth ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : (
                <AlertCircle className="w-8 h-8 text-red-600" />
              )}
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">System Health</h4>
            <p className={`text-sm ${
              issuanceHealth && verificationHealth ? 'text-green-600' : 'text-red-600'
            }`}>
              {issuanceHealth && verificationHealth ? 'All Services Healthy' : 'Service Issues Detected'}
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 mx-auto mb-3 flex items-center justify-center">
              <Server className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Active Services</h4>
            <p className="text-sm text-gray-600">
              {[issuanceHealth, verificationHealth].filter(Boolean).length} of 2 services running
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-purple-100 mx-auto mb-3 flex items-center justify-center">
              <Activity className="w-8 h-8 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Last Updated</h4>
            <p className="text-sm text-gray-600">
              {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>

        {(!issuanceHealth || !verificationHealth) && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
              <p className="text-yellow-800 font-medium">Service Connectivity Issues</p>
            </div>
            <p className="text-yellow-700 text-sm mt-1">
              Some services are not reachable. Please ensure all microservices are running and accessible.
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm">
          Health checks are performed in real-time. Refresh to get the latest status.
        </p>
      </div>
    </div>
  );
}