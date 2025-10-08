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
    <div className="bg-[#1a1a1a] rounded-lg shadow-md p-4 sm:p-6 border border-[#404040]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2 sm:gap-0">
        <div className="flex items-center">
          {loading ? (
            <Loader2 className={`w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-${color}-600 animate-spin`} />
          ) : (
            <Server className={`w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-${color}-600`} />
          )}
          <h3 className="text-base sm:text-lg font-semibold text-white">{title}</h3>
        </div>
        <div className="flex items-center">
          {loading ? (
            <div className="flex items-center">
              <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-[#a3a3a3] animate-spin" />
              <span className="text-xs text-[#a3a3a3]">Checking...</span>
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
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
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
              <span className="font-medium text-[#a3a3a3]">Status:</span> <span className="text-white">{health.status}</span>
            </div>
            <div>
              <span className="font-medium text-[#a3a3a3]">Service:</span> <span className="text-white">{health.service}</span>
            </div>
            <div>
              <span className="font-medium text-[#a3a3a3]">Worker ID:</span> <span className="text-white">{health.worker.workerId}</span>
            </div>
            <div>
              <span className="font-medium text-[#a3a3a3]">Hostname:</span> <span className="text-white">{health.worker.hostname}</span>
            </div>
          </div>
          <div className="text-xs sm:text-sm">
            <span className="font-medium text-[#a3a3a3]">Last Check:</span> <span className="text-white">{new Date(health.timestamp).toLocaleString()}</span>
          </div>
          <div className="text-xs sm:text-sm">
            <span className="font-medium text-[#a3a3a3]">Worker Started:</span> <span className="text-white">{new Date(health.worker.timestamp).toLocaleString()}</span>
          </div>
        </div>
      ) : (
        <div className="text-red-400 text-sm">
          <p className="font-medium">Connection Failed</p>
          <p className="text-xs sm:text-sm">{error}</p>
        </div>
      )}
      </div>
  );

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex items-center">
            <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-white mr-3" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Service Health Status</h1>
              <p className="text-sm sm:text-base text-[#a3a3a3]">Monitor the health and status of microservices</p>
            </div>
          </div>
          <button
            onClick={checkHealth}
            disabled={issuanceLoading || verificationLoading}
            className="flex items-center px-3 sm:px-4 py-2 bg-[#404040] hover:bg-[#a3a3a3] text-white rounded-md disabled:opacity-50 text-sm sm:text-base w-full sm:w-auto justify-center border border-[#404040]"
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
        <div className="bg-[#1a1a1a] rounded-lg shadow-md p-4 sm:p-6 border border-[#404040]">
          <div className="flex items-center mb-4">
            <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-white mr-3" />
            <h3 className="text-lg font-semibold text-white">Overall System Status</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center">
              <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full mx-auto mb-2 sm:mb-3 flex items-center justify-center ${
                issuanceHealth && verificationHealth ? 'bg-green-900/20 border border-green-500/30' : issuanceLoading || verificationLoading ? 'bg-yellow-900/20 border border-yellow-500/30' : 'bg-red-900/20 border border-red-500/30'
              }`}>
                {issuanceLoading || verificationLoading ? (
                  <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 animate-spin" />
                ) : issuanceHealth && verificationHealth ? (
                  <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
                ) : (
                  <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" />
                )}
              </div>
              <h4 className="font-semibold text-white mb-1 text-sm sm:text-base">System Health</h4>
              <p className={`text-xs sm:text-sm ${
                issuanceLoading || verificationLoading ? 'text-yellow-400' : issuanceHealth && verificationHealth ? 'text-green-400' : 'text-red-400'
              }`}>
                {issuanceLoading || verificationLoading ? 'Checking Services...' : issuanceHealth && verificationHealth ? 'All Services Healthy' : 'Service Issues Detected'}
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#404040] mx-auto mb-2 sm:mb-3 flex items-center justify-center border border-[#404040]">
                <Server className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h4 className="font-semibold text-white mb-1 text-sm sm:text-base">Active Services</h4>
              <p className="text-xs sm:text-sm text-[#a3a3a3]">
                {issuanceLoading || verificationLoading
                  ? 'Checking...'
                  : [issuanceHealth, verificationHealth].filter(Boolean).length} of 2 services running
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#404040] mx-auto mb-2 sm:mb-3 flex items-center justify-center border border-[#404040]">
                <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h4 className="font-semibold text-white mb-1 text-sm sm:text-base">Last Updated</h4>
              <p className="text-xs sm:text-sm text-[#a3a3a3]">
                {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>

          {(!issuanceHealth || !verificationHealth) && !(issuanceLoading || verificationLoading) && (
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-md">
              <div className="flex items-center">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mr-2" />
                <p className="text-yellow-200 font-medium text-sm sm:text-base">Service Connectivity Issues</p>
              </div>
              <p className="text-yellow-300 text-xs sm:text-sm mt-1">
                Some services are not reachable. Please ensure all microservices are running and accessible.
              </p>
            </div>
          )}

          {(issuanceLoading || verificationLoading) && (
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-900/20 border border-blue-500/30 rounded-md">
              <div className="flex items-center">
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mr-2 animate-spin" />
                <p className="text-blue-200 font-medium text-sm sm:text-base">Checking Service Status...</p>
              </div>
              <p className="text-blue-300 text-xs sm:text-sm mt-1">
                Performing health checks on all microservices. Please wait...
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-[#a3a3a3] text-xs sm:text-sm">
            Health checks are performed in real-time. Refresh to get the latest status.
          </p>
        </div>
      </div>
    </div>
  );
}