import { useState, useEffect } from 'react';
import { Server, Activity, CheckCircle, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
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
  const [issuanceLoading, setIssuanceLoading] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);

  const checkHealth = async () => {
    setIssuanceLoading(true);
    setVerificationLoading(true);
    setIssuanceError(null);
    setVerificationError(null);

    // Check Issuance Service
    try {
      const response = await apiService.checkIssuanceHealth();
      setIssuanceHealth(response.data);
    } catch (error) {
      setIssuanceError(error instanceof Error ? error.message : 'Failed to connect to issuance service');
      setIssuanceHealth(null);
    } finally {
      setIssuanceLoading(false);
    }

    // Check Verification Service
    try {
      const response = await apiService.checkVerificationHealth();
      setVerificationHealth(response.data);
    } catch (error) {
      setVerificationError(error instanceof Error ? error.message : 'Failed to connect to verification service');
      setVerificationHealth(null);
    } finally {
      setVerificationLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const ServiceCard = ({ 
    title, 
    health, 
    error, 
    color,
    loading 
  }: { 
    title: string; 
    health: ServiceHealth | null; 
    error: string | null; 
    color: string;
    loading: boolean;
  }) => (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2 sm:gap-0">
        <div className="flex items-center">
          {loading ? (
            <Loader2 className={`w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-${color}-600 animate-spin`} />
          ) : (
            <Server className={`w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-${color}-600`} />
          )}
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="flex items-center">
          {loading ? (
            <div className="flex items-center">
              <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-gray-500 animate-spin" />
              <span className="text-xs text-gray-500">Checking...</span>
            </div>
          ) : health ? (
            <>
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              <span className="ml-2 px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800">
                Healthy
              </span>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              <span className="ml-2 px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-800">
                Unhealthy
              </span>
            </>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-6 sm:py-8">
          <Loader2 className={`w-6 h-6 sm:w-8 sm:h-8 text-${color}-600 animate-spin`} />
          <span className="ml-2 sm:ml-3 text-sm sm:text-base text-gray-600">Checking service health...</span>
        </div>
      ) : health ? (
        <div className="space-y-2 sm:space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
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
          <div className="text-xs sm:text-sm">
            <span className="font-medium text-gray-700">Last Check:</span> {new Date(health.timestamp).toLocaleString()}
          </div>
          <div className="text-xs sm:text-sm">
            <span className="font-medium text-gray-700">Worker Started:</span> {new Date(health.worker.timestamp).toLocaleString()}
          </div>
        </div>
      ) : (
        <div className="text-red-600 text-sm">
          <p className="font-medium">Connection Failed</p>
          <p className="text-xs sm:text-sm">{error}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <div className="flex items-center">
          <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 mr-3" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Service Health Status</h1>
            <p className="text-sm sm:text-base text-gray-600">Monitor the health and status of microservices</p>
          </div>
        </div>
        <button
          onClick={checkHealth}
          disabled={issuanceLoading || verificationLoading}
          className="flex items-center px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 text-sm sm:text-base w-full sm:w-auto justify-center"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${(issuanceLoading || verificationLoading) ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
        <ServiceCard
          title="Credential Issuance Service"
          health={issuanceHealth}
          error={issuanceError}
          color="blue"
          loading={issuanceLoading}
        />
        <ServiceCard
          title="Credential Verification Service"
          health={verificationHealth}
          error={verificationError}
          color="green"
          loading={verificationLoading}
        />
      </div>

      {/* Overall System Status */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex items-center mb-4">
          <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Overall System Status</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="text-center">
            <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full mx-auto mb-2 sm:mb-3 flex items-center justify-center ${
              issuanceHealth && verificationHealth ? 'bg-green-100' : issuanceLoading || verificationLoading ? 'bg-yellow-100' : 'bg-red-100'
            }`}>
              {issuanceLoading || verificationLoading ? (
                <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600 animate-spin" />
              ) : issuanceHealth && verificationHealth ? (
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              ) : (
                <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
              )}
            </div>
            <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">System Health</h4>
            <p className={`text-xs sm:text-sm ${
              issuanceLoading || verificationLoading ? 'text-yellow-600' : issuanceHealth && verificationHealth ? 'text-green-600' : 'text-red-600'
            }`}>
              {issuanceLoading || verificationLoading ? 'Checking Services...' : issuanceHealth && verificationHealth ? 'All Services Healthy' : 'Service Issues Detected'}
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-blue-100 mx-auto mb-2 sm:mb-3 flex items-center justify-center">
              <Server className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Active Services</h4>
            <p className="text-xs sm:text-sm text-gray-600">
              {issuanceLoading || verificationLoading
                ? 'Checking...'
                : [issuanceHealth, verificationHealth].filter(Boolean).length} of 2 services running
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-purple-100 mx-auto mb-2 sm:mb-3 flex items-center justify-center">
              <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Last Updated</h4>
            <p className="text-xs sm:text-sm text-gray-600">
              {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>

        {(!issuanceHealth || !verificationHealth) && !(issuanceLoading || verificationLoading) && (
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-center">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 mr-2" />
              <p className="text-yellow-800 font-medium text-sm sm:text-base">Service Connectivity Issues</p>
            </div>
            <p className="text-yellow-700 text-xs sm:text-sm mt-1">
              Some services are not reachable. Please ensure all microservices are running and accessible.
            </p>
          </div>
        )}

        {(issuanceLoading || verificationLoading) && (
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center">
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2 animate-spin" />
              <p className="text-blue-800 font-medium text-sm sm:text-base">Checking Service Status...</p>
            </div>
            <p className="text-blue-700 text-xs sm:text-sm mt-1">
              Performing health checks on all microservices. Please wait...
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 sm:mt-8 text-center">
        <p className="text-gray-500 text-xs sm:text-sm">
          Health checks are performed in real-time. Refresh to get the latest status.
        </p>
      </div>
    </div>
  );
}