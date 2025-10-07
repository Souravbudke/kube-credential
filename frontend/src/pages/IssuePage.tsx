import { useState } from 'react';
import { FileText, Plus, Trash2, User, Building, Sparkles, AlertCircle, Calendar, Award, Clock, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { apiService } from '@/services/api';
import type { Credential, IssuedCredential } from '@/types';

export default function IssuePage() {
  const [formData, setFormData] = useState({
    holderName: '',
    credentialType: 'certificate',
    issueDate: '',
    expiryDate: '',
    issuerName: '',
  });

  const [customFields, setCustomFields] = useState<Array<{ key: string; value: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; data?: IssuedCredential } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.holderName.trim()) {
      newErrors.holderName = 'Holder name is required';
    }
    if (!formData.issuerName.trim()) {
      newErrors.issuerName = 'Issuer name is required';
    }
    if (!formData.issueDate) {
      newErrors.issueDate = 'Issue date is required';
    }
    if (formData.expiryDate && new Date(formData.expiryDate) <= new Date(formData.issueDate)) {
      newErrors.expiryDate = 'Expiry date must be after issue date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addCustomField = () => {
    setCustomFields(prev => [...prev, { key: '', value: '' }]);
  };

  const removeCustomField = (index: number) => {
    setCustomFields(prev => prev.filter((_, i) => i !== index));
  };

  const updateCustomField = (index: number, field: 'key' | 'value', value: string) => {
    setCustomFields(prev => prev.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const generateCredentialId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `cred-${timestamp}-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Build custom data object
      const customData: Record<string, any> = {};
      customFields.forEach(({ key, value }) => {
        if (key.trim() && value.trim()) {
          customData[key.trim()] = value.trim();
        }
      });

      // Create credential object
      const credential: Credential = {
        id: generateCredentialId(),
        holderName: formData.holderName.trim(),
        credentialType: formData.credentialType,
        issueDate: new Date(formData.issueDate).toISOString(),
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : undefined,
        issuerName: formData.issuerName.trim(),
        data: customData,
      };

      const response = await apiService.issueCredential(credential);
      setResult({
        success: response.success,
        message: response.message,
        data: response.data,
      });

      // Reset form on success
      if (response.success) {
        setFormData({
          holderName: '',
          credentialType: 'certificate',
          issueDate: new Date().toISOString().slice(0, 16),
          expiryDate: '',
          issuerName: '',
        });
        setCustomFields([]);
        setErrors({});
      }
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to issue credential',
      });
    } finally {
      setLoading(false);
    }
  };

  const copyCredentialId = () => {
    if (result?.data?.id) {
      navigator.clipboard.writeText(result.data.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const copyCredentialJson = () => {
    if (result?.data) {
      navigator.clipboard.writeText(JSON.stringify(result.data, null, 2));
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 sm:space-y-6">
        <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-cyan-100 to-purple-100 text-cyan-800 rounded-full text-xs sm:text-sm font-medium border border-cyan-200/50">
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
          Credential Issuance Platform
        </div>
        <div className="space-y-3 sm:space-y-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text">Issue New Credential</h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
            Create and issue a new digital credential with custom data fields, automatic validation,
            and comprehensive audit trails.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm hover-lift">
            <CardHeader className="bg-gradient-to-br from-cyan-50 via-white to-purple-50 rounded-t-lg border-b p-4 sm:p-6 lg:p-8">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-cyan-600 to-purple-600 rounded-xl sm:rounded-2xl shadow-lg">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">Credential Information</CardTitle>
                  <CardDescription className="text-sm sm:text-base">Fill in the details for the new credential</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 lg:p-8">
              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                {/* Basic Information */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-cyan-100 rounded-lg">
                      <User className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-600" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Basic Information</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="holderName" className="text-sm font-medium">
                        Holder Name *
                      </Label>
                      <Input
                        id="holderName"
                        placeholder="Enter credential holder's full name"
                        value={formData.holderName}
                        onChange={(e) => handleInputChange('holderName', e.target.value)}
                        className={`h-10 sm:h-12 transition-all duration-200 ${errors.holderName ? 'border-red-500 focus:border-red-500' : 'focus:border-cyan-500'}`}
                      />
                      {errors.holderName && (
                        <p className="text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.holderName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="issuerName" className="text-sm font-medium">
                        Issuer Name *
                      </Label>
                      <Input
                        id="issuerName"
                        placeholder="Enter issuing organization"
                        value={formData.issuerName}
                        onChange={(e) => handleInputChange('issuerName', e.target.value)}
                        className={`h-10 sm:h-12 transition-all duration-200 ${errors.issuerName ? 'border-red-500 focus:border-red-500' : 'focus:border-cyan-500'}`}
                      />
                      {errors.issuerName && (
                        <p className="text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.issuerName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="credentialType" className="text-sm font-medium">
                        Credential Type *
                      </Label>
                      <Select value={formData.credentialType} onValueChange={(value) => handleInputChange('credentialType', value)}>
                        <SelectTrigger className="h-10 sm:h-12">
                          <SelectValue>
                            {formData.credentialType === 'certificate' && 'Certificate'}
                            {formData.credentialType === 'diploma' && 'Diploma'}
                            {formData.credentialType === 'license' && 'License'}
                            {formData.credentialType === 'badge' && 'Badge'}
                            {formData.credentialType === 'other' && 'Other'}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="certificate">Certificate</SelectItem>
                          <SelectItem value="diploma">Diploma</SelectItem>
                          <SelectItem value="license">License</SelectItem>
                          <SelectItem value="badge">Badge</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="issueDate" className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-cyan-600" />
                      Issue Date *
                    </Label>
                    <div className="relative group">
                      <input
                        id="issueDate"
                        type="datetime-local"
                        value={formData.issueDate}
                        onChange={(e) => handleInputChange('issueDate', e.target.value)}
                        className={`w-full h-10 sm:h-12 px-3 sm:px-4 rounded-md border bg-white text-gray-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base ${errors.issueDate ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'}`}
                        required
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
                      <Clock className="w-4 h-4 text-purple-600" />
                      Expiry Date
                    </Label>
                    <div className="relative group">
                      <input
                        id="expiryDate"
                        type="datetime-local"
                        value={formData.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                        className={`w-full h-10 sm:h-12 px-3 sm:px-4 rounded-md border bg-white text-gray-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base ${errors.expiryDate ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'}`}
                      />
                    </div>
                    {errors.expiryDate && (
                      <p className="text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.expiryDate}
                      </p>
                    )}
                  </div>
                </div>

                <Separator className="my-6 sm:my-8" />

                {/* Custom Fields */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 rounded-lg">
                        <Building className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">Custom Data Fields</h3>
                    </div>
                    <Button
                      type="button"
                      onClick={addCustomField}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2 hover:bg-purple-50 hover:border-purple-200 w-full sm:w-auto"
                    >
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Add Field</span>
                    </Button>
                  </div>

                  {customFields.length > 0 ? (
                    <div className="space-y-3 sm:space-y-4">
                      {customFields.map((field, index) => (
                        <div key={index} className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex-1 w-full">
                            <Label className="text-sm font-medium">Field Name</Label>
                            <Input
                              placeholder="e.g., course, grade, department"
                              value={field.key}
                              onChange={(e) => updateCustomField(index, 'key', e.target.value)}
                              className="h-9 sm:h-10 mt-1"
                            />
                          </div>
                          <div className="flex-1 w-full">
                            <Label className="text-sm font-medium">Field Value</Label>
                            <Input
                              placeholder="Enter field value"
                              value={field.value}
                              onChange={(e) => updateCustomField(index, 'value', e.target.value)}
                              className="h-9 sm:h-10 mt-1"
                            />
                          </div>
                          <Button
                            type="button"
                            onClick={() => removeCustomField(index)}
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 sm:h-10 sm:w-10 text-red-500 hover:text-red-700 hover:bg-red-50 mt-6 sm:mt-6"
                          >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 sm:py-12 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                      <Building className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-300" />
                      <p className="text-base sm:text-lg font-medium mb-2">No custom fields added yet</p>
                      <p className="text-sm">Click "Add Field" to include additional data in your credential.</p>
                    </div>
                  )}
                </div>

                <Separator className="my-6 sm:my-8" />

                {/* Submit Button */}
                <div className="flex justify-end pt-4 sm:pt-6">
                  <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 px-6 sm:px-8 py-3 text-sm sm:text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 w-full sm:w-auto"
                  >
                    {loading ? (
                      <>
                        <div className="spinner w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Issuing Credential...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Issue Credential
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* Quick Stats */}
          <Card className="bg-gradient-to-br from-cyan-50 to-purple-50 border-cyan-200">
            <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg flex items-center text-cyan-800">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Credential Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-600">Custom Fields</span>
                <Badge variant="secondary" className="bg-white/60 text-xs sm:text-sm">{customFields.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-600">Data Points</span>
                <Badge variant="secondary" className="bg-white/60 text-xs sm:text-sm">
                  {Object.values(formData).filter(Boolean).length + customFields.reduce((acc, field) => acc + (field.key && field.value ? 1 : 0), 0)}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-600">Status</span>
                <Badge variant={loading ? "default" : "secondary"} className={loading ? "bg-cyan-600 text-xs sm:text-sm" : "bg-white/60 text-xs sm:text-sm"}>
                  {loading ? "Processing" : "Ready"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="bg-amber-50 border-amber-200">
            <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg flex items-center text-amber-800">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3 text-sm text-amber-700 p-4 sm:p-6">
              <p>• Use descriptive field names for better organization</p>
              <p>• Include relevant metadata like course names or grades</p>
              <p>• Set appropriate expiry dates for time-sensitive credentials</p>
              <p>• Verify all information before issuing</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Result Display */}
      {result && (
        <Alert className={`shadow-md ${result.success ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
          <AlertDescription className="space-y-4">
            <div className={`text-base sm:text-lg font-semibold ${result.success ? 'text-green-700' : 'text-red-700'}`}>
              {result.message}
            </div>

            {result.success && result.data && (
              <Card className="mt-4 bg-white border shadow-sm">
                <CardHeader className="pb-3 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                    <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">
                      Credential Issued Successfully
                    </CardTitle>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={copyCredentialId}
                        className="flex items-center gap-2 flex-1 sm:flex-none"
                      >
                        {copiedId ? (
                          <>
                            <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                            <span className="text-xs sm:text-sm">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="text-xs sm:text-sm">Copy ID</span>
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={copyCredentialJson}
                        className="flex items-center gap-2 flex-1 sm:flex-none"
                      >
                        {copiedJson ? (
                          <>
                            <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                            <span className="text-xs sm:text-sm">Copied!</span>
                          </>
                        ) : (
                          <>
                            <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="text-xs sm:text-sm">Copy JSON</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 p-4 sm:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-gray-50 rounded border gap-1 sm:gap-0">
                        <span className="font-medium text-gray-600">Credential ID:</span>
                        <Badge variant="outline" className="font-mono text-xs w-full sm:w-auto text-center">
                          {result.data.id}
                        </Badge>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-gray-50 rounded border gap-1 sm:gap-0">
                        <span className="font-medium text-gray-600">Holder Name:</span>
                        <span className="text-gray-900 text-xs sm:text-sm">{result.data.holderName}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-gray-50 rounded border gap-1 sm:gap-0">
                        <span className="font-medium text-gray-600">Credential Type:</span>
                        <Badge variant="secondary" className="text-xs sm:text-sm w-full sm:w-auto text-center">{result.data.credentialType}</Badge>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-gray-50 rounded border gap-1 sm:gap-0">
                        <span className="font-medium text-gray-600">Issue Date:</span>
                        <span className="text-gray-900 text-xs">
                          {new Date(result.data.issueDate).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-gray-50 rounded border gap-1 sm:gap-0">
                        <span className="font-medium text-gray-600">Issuer Name:</span>
                        <span className="text-gray-900 text-xs sm:text-sm">{result.data.issuerName}</span>
                      </div>
                      {result.data.expiryDate && (
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-gray-50 rounded border gap-1 sm:gap-0">
                          <span className="font-medium text-gray-600">Expiry Date:</span>
                          <span className="text-gray-900 text-xs">
                            {new Date(result.data.expiryDate).toLocaleString()}
                          </span>
                        </div>
                      )}
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-gray-50 rounded border gap-1 sm:gap-0">
                        <span className="font-medium text-gray-600">Issued By Worker:</span>
                        <Badge variant="outline" className="font-mono text-xs w-full sm:w-auto text-center">
                          {result.data.issuedBy.split('-').slice(-1)[0]}
                        </Badge>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-gray-50 rounded border gap-1 sm:gap-0">
                        <span className="font-medium text-gray-600">Timestamp:</span>
                        <span className="text-gray-900 text-xs">
                          {new Date(result.data.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {Object.keys(result.data.data).length > 0 && (
                    <div className="pt-3 border-t">
                      <h4 className="font-medium text-gray-900 mb-3 text-sm">
                        Custom Data:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {Object.entries(result.data.data).map(([key, value]) => (
                          <div key={key} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-2 bg-gray-50 rounded border text-xs sm:text-sm gap-1 sm:gap-0">
                            <span className="font-medium text-gray-600">{key}:</span>
                            <span className="text-gray-900 break-all">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}