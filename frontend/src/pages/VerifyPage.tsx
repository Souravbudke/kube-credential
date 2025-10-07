import { useState } from 'react';
import { AlertCircle, Search, User, Calendar, Building, FileText, Sparkles, Scan, Code, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { apiService } from '@/services/api';
import type { Credential, VerificationResult } from '@/types';

export default function VerifyPage() {
  const [credentialData, setCredentialData] = useState({
    id: '',
    holderName: '',
    credentialType: 'certificate',
    issueDate: '',
    expiryDate: '',
    issuerName: '',
    customData: '{}',
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [inputMethod, setInputMethod] = useState<'form' | 'json'>('form');
  const [jsonInput, setJsonInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCredentialData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (inputMethod === 'json') {
      // Validate JSON input method only
      if (!jsonInput.trim()) {
        newErrors.jsonInput = 'JSON input is required';
      } else {
        try {
          JSON.parse(jsonInput);
        } catch (error) {
          newErrors.jsonInput = 'Invalid JSON format';
        }
      }
    } else {
      // Validate form input method only
      if (!credentialData.id.trim()) {
        newErrors.id = 'Credential ID is required';
      }
      if (!credentialData.holderName.trim()) {
        newErrors.holderName = 'Holder name is required';
      }
      if (!credentialData.issuerName.trim()) {
        newErrors.issuerName = 'Issuer name is required';
      }

      // Validate JSON in custom data
      if (credentialData.customData.trim()) {
        try {
          JSON.parse(credentialData.customData);
        } catch (error) {
          newErrors.customData = 'Invalid JSON format';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      let credential: Credential;

      if (inputMethod === 'json') {
        try {
          credential = JSON.parse(jsonInput);
        } catch (error) {
          throw new Error('Invalid JSON format');
        }
      } else {
        // Parse custom data
        let customData: Record<string, any> = {};
        try {
          if (credentialData.customData.trim()) {
            customData = JSON.parse(credentialData.customData);
          }
        } catch (error) {
          throw new Error('Invalid custom data JSON format');
        }

        credential = {
          id: credentialData.id.trim(),
          holderName: credentialData.holderName.trim(),
          credentialType: credentialData.credentialType,
          issueDate: credentialData.issueDate ? new Date(credentialData.issueDate).toISOString() : '',
          expiryDate: credentialData.expiryDate ? new Date(credentialData.expiryDate).toISOString() : undefined,
          issuerName: credentialData.issuerName.trim(),
          data: customData,
        };
      }

      const response = await apiService.verifyCredential(credential);
      setResult(response.data as VerificationResult);
    } catch (error) {
      setResult({
        isValid: false,
        verifiedBy: 'client-error',
        verificationTimestamp: new Date().toISOString(),
        message: error instanceof Error ? error.message : 'Verification failed',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSampleCredential = () => {
    const sample = {
      id: 'cred-1234567890-abc123',
      holderName: 'John Doe',
      credentialType: 'certificate',
      issueDate: '2024-01-01T10:00:00.000Z',
      expiryDate: '2025-01-01T10:00:00.000Z',
      issuerName: 'Tech University',
      data: {
        course: 'Full Stack Development',
        grade: 'A+',
        credits: 120
      }
    };

    if (inputMethod === 'json') {
      setJsonInput(JSON.stringify(sample, null, 2));
    } else {
      setCredentialData({
        id: sample.id,
        holderName: sample.holderName,
        credentialType: sample.credentialType,
        issueDate: sample.issueDate.slice(0, 16),
        expiryDate: sample.expiryDate.slice(0, 16),
        issuerName: sample.issuerName,
        customData: JSON.stringify(sample.data, null, 2),
      });
    }
    setErrors({});
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 rounded-full text-sm font-medium border border-emerald-200/50">
          <Sparkles className="w-4 h-4 mr-2" />
          Credential Verification Platform
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold gradient-text">Verify Credential</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Validate the authenticity and integrity of digital credentials through our secure verification system.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Verification Form */}
        <div className="lg:col-span-2">
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm hover-lift">
            <CardHeader className="bg-gradient-to-br from-emerald-50 via-white to-green-50 rounded-t-lg border-b">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-600 to-green-600 rounded-2xl shadow-lg">
                  <Scan className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl font-semibold text-gray-900">Credential Verification</CardTitle>
                  <CardDescription className="text-base">Enter credential details to verify authenticity</CardDescription>
                </div>
                <Button
                  type="button"
                  onClick={loadSampleCredential}
                  variant="outline"
                  size="sm"
                  className="bg-white/60 hover:bg-white/80 border-emerald-200 text-emerald-700"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Load Sample
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-8">
              {/* Input Method Toggle */}
              <div className="flex mb-8 bg-gray-100 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setInputMethod('form')}
                  className={`flex-1 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                    inputMethod === 'form'
                      ? 'bg-white text-emerald-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FileText className="w-4 h-4 inline mr-2" />
                  Form Input
                </button>
                <button
                  type="button"
                  onClick={() => setInputMethod('json')}
                  className={`flex-1 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                    inputMethod === 'json'
                      ? 'bg-white text-emerald-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Code className="w-4 h-4 inline mr-2" />
                  JSON Input
                </button>
              </div>

              <form onSubmit={handleVerify} className="space-y-6">
                {inputMethod === 'form' ? (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="id" className="text-sm font-medium">
                          Credential ID *
                        </Label>
                        <div className="relative">
                          <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            id="id"
                            name="id"
                            value={credentialData.id}
                            onChange={handleInputChange}
                            placeholder="Enter credential ID"
                            className={`h-12 pl-10 transition-all duration-200 ${errors.id ? 'border-red-500 focus:border-red-500' : 'focus:border-emerald-500'}`}
                          />
                        </div>
                        {errors.id && (
                          <p className="text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.id}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="holderName" className="text-sm font-medium">
                          Holder Name *
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            id="holderName"
                            name="holderName"
                            value={credentialData.holderName}
                            onChange={handleInputChange}
                            placeholder="Enter holder name"
                            className={`h-12 pl-10 transition-all duration-200 ${errors.holderName ? 'border-red-500 focus:border-red-500' : 'focus:border-emerald-500'}`}
                          />
                        </div>
                        {errors.holderName && (
                          <p className="text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.holderName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="credentialType" className="text-sm font-medium">
                          Credential Type *
                        </Label>
                        <Select value={credentialData.credentialType} onValueChange={(value) => handleInputChange({ target: { name: 'credentialType', value } } as any)}>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="certificate">🎓 Certificate</SelectItem>
                            <SelectItem value="diploma">📜 Diploma</SelectItem>
                            <SelectItem value="license">📋 License</SelectItem>
                            <SelectItem value="badge">🏆 Badge</SelectItem>
                            <SelectItem value="other">📄 Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="issueDate" className="text-sm font-medium flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-emerald-600" />
                          Issue Date *
                        </Label>
                        <div className="relative group">
                          <input
                            id="issueDate"
                            name="issueDate"
                            type="datetime-local"
                            value={credentialData.issueDate}
                            onChange={handleInputChange}
                            className={`w-full h-12 px-4 rounded-md border bg-white text-gray-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.issueDate ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'}`}
                          />
                        </div>
                        {errors.issueDate && (
                          <p className="text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.issueDate}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="expiryDate" className="text-sm font-medium flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-purple-600" />
                          Expiry Date
                        </Label>
                        <div className="relative group">
                          <input
                            id="expiryDate"
                            name="expiryDate"
                            type="datetime-local"
                            value={credentialData.expiryDate}
                            onChange={handleInputChange}
                            className={`w-full h-12 px-4 rounded-md border bg-white text-gray-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.expiryDate ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'}`}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="issuerName" className="text-sm font-medium">
                        Issuer Name *
                      </Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="issuerName"
                          name="issuerName"
                          value={credentialData.issuerName}
                          onChange={handleInputChange}
                          placeholder="Enter issuing organization"
                          className={`h-12 pl-10 transition-all duration-200 ${errors.issuerName ? 'border-red-500 focus:border-red-500' : 'focus:border-emerald-500'}`}
                        />
                      </div>
                      {errors.issuerName && (
                        <p className="text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.issuerName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customData" className="text-sm font-medium">
                        Custom Data (JSON format)
                      </Label>
                      <Textarea
                        id="customData"
                        name="customData"
                        value={credentialData.customData}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder='{"course": "Full Stack Development", "grade": "A+", "credits": 120}'
                        className={`resize-none transition-all duration-200 ${errors.customData ? 'border-red-500 focus:border-red-500' : 'focus:border-emerald-500'}`}
                      />
                      {errors.customData && (
                        <p className="text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.customData}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="jsonInput" className="text-sm font-medium">
                        Credential JSON *
                      </Label>
                      <Textarea
                        id="jsonInput"
                        value={jsonInput}
                        onChange={(e) => {
                          setJsonInput(e.target.value);
                          if (errors.jsonInput) {
                            setErrors(prev => ({ ...prev, jsonInput: '' }));
                          }
                        }}
                        rows={12}
                        placeholder="Paste complete credential JSON here..."
                        className={`font-mono text-sm resize-none transition-all duration-200 ${errors.jsonInput ? 'border-red-500 focus:border-red-500' : 'focus:border-emerald-500'}`}
                      />
                      {errors.jsonInput && (
                        <p className="text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.jsonInput}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <Separator className="my-8" />

                {/* Submit Button */}
                <div className="flex justify-end pt-6">
                  <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 px-8 py-3 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="spinner w-5 h-5 mr-2" />
                        Verifying Credential...
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5 mr-2" />
                        Verify Credential
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Verification Status */}
          <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center text-emerald-800">
                <Scan className="w-5 h-5 mr-2" />
                Verification Process
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status</span>
                <Badge variant={loading ? "default" : "secondary"} className={loading ? "bg-emerald-600" : "bg-white/60"}>
                  {loading ? "Verifying" : "Ready"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Input Method</span>
                <Badge variant="outline" className="bg-white/60 capitalize">{inputMethod}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Validation</span>
                <Badge variant="secondary" className="bg-white/60">
                  {Object.keys(errors).length === 0 ? "Valid" : "Errors"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center text-blue-800">
                <Sparkles className="w-5 h-5 mr-2" />
                Verification Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-blue-700">
              <p>• Ensure all required fields are filled correctly</p>
              <p>• Use exact credential ID from the issuer</p>
              <p>• Verify JSON format for custom data fields</p>
              <p>• Check expiry dates for time-sensitive credentials</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Result Display */}
      {result && (
        <Alert className={`shadow-md ${result.isValid ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
          <AlertDescription className="space-y-4">
            <div className={`text-lg font-semibold ${result.isValid ? 'text-green-700' : 'text-red-700'}`}>
              {result.isValid ? 'Credential Verified Successfully' : 'Credential Verification Failed'}
            </div>

            <p className="text-sm text-gray-700">{result.message}</p>

            {result.isValid && result.credential && (
              <Card className="bg-white border shadow-sm mt-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold text-gray-900">
                    Verified Credential Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded border">
                        <span className="font-medium text-gray-600">Credential ID:</span>
                        <Badge variant="outline" className="font-mono text-xs">
                          {result.credential.id}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded border">
                        <span className="font-medium text-gray-600">Holder Name:</span>
                        <span className="text-gray-900">{result.credential.holderName}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded border">
                        <span className="font-medium text-gray-600">Credential Type:</span>
                        <Badge variant="secondary">{result.credential.credentialType}</Badge>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded border">
                        <span className="font-medium text-gray-600">Issuer Name:</span>
                        <span className="text-gray-900">{result.credential.issuerName}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded border">
                        <span className="font-medium text-gray-600">Issue Date:</span>
                        <span className="text-gray-900 text-xs">
                          {new Date(result.credential.issueDate).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded border">
                        <span className="font-medium text-gray-600">Verified At:</span>
                        <span className="text-gray-900 text-xs">
                          {new Date(result.verificationTimestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {result.credential.expiryDate && (
                    <div className="p-3 bg-gray-50 rounded border">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-600">Expiry Date:</span>
                        <span className="text-gray-900 text-xs">
                          {new Date(result.credential.expiryDate).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}

                  {Object.keys(result.credential.data).length > 0 && (
                    <div className="pt-3 border-t">
                      <h4 className="font-medium text-gray-900 mb-3 text-sm">Additional Data:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {Object.entries(result.credential.data).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded border text-sm">
                            <span className="font-medium text-gray-600">{key}:</span>
                            <span className="text-gray-900">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-3 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      <div className="text-gray-600">
                        <span className="font-medium">Issued by: </span>
                        <Badge variant="outline" className="font-mono text-xs">
                          {result.credential.issuedBy.split('-').slice(-1)[0]}
                        </Badge>
                      </div>
                      <div className="text-gray-600">
                        <span className="font-medium">Verified by: </span>
                        <Badge variant="outline" className="font-mono text-xs">
                          {result.verifiedBy.split('-').slice(-1)[0]}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

