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
    <div className="min-h-screen bg-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 sm:space-y-6">
          <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-[#1a1a1a] text-white rounded-full text-xs sm:text-sm font-medium border border-[#404040] backdrop-blur-sm">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            Credential Issuance Platform
          </div>
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Issue New Credential</h1>
            <p className="text-base sm:text-lg text-[#a3a3a3] max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
              Create and issue a new digital credential with custom data fields, automatic validation,
              and comprehensive audit trails.
            </p>
          </div>
        </div>

      <div className="max-w-4xl mx-auto">
        {/* Main Form */}
        <Card className="shadow-2xl border-[#404040] bg-[#1a1a1a] backdrop-blur-sm">
            <CardHeader className="bg-[#1a1a1a] rounded-t-lg border-b border-[#404040] p-4 sm:p-6 lg:p-8">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-[#404040] rounded-xl sm:rounded-2xl shadow-lg">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg sm:text-xl lg:text-2xl font-semibold text-white">Credential Information</CardTitle>
                  <CardDescription className="text-sm sm:text-base text-[#a3a3a3]">Fill in the details for the new credential</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 lg:p-8">
              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                {/* Basic Information */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-[#404040] rounded-lg">
                      <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-white">Basic Information</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="holderName" className="text-sm font-medium text-white">
                        Holder Name *
                      </Label>
                      <Input
                        id="holderName"
                        placeholder="Enter credential holder's full name"
                        value={formData.holderName}
                        onChange={(e) => handleInputChange('holderName', e.target.value)}
                        className={`h-10 sm:h-12 transition-all duration-200 bg-[#1a1a1a] border-[#404040] text-white ${errors.holderName ? 'border-red-500 focus:border-red-500' : 'focus:border-[#a3a3a3]'}`}
                      />
                      {errors.holderName && (
                        <p className="text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.holderName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="issuerName" className="text-sm font-medium text-white">
                        Issuer Name *
                      </Label>
                      <Input
                        id="issuerName"
                        placeholder="Enter issuing organization"
                        value={formData.issuerName}
                        onChange={(e) => handleInputChange('issuerName', e.target.value)}
                        className={`h-10 sm:h-12 transition-all duration-200 bg-[#1a1a1a] border-[#404040] text-white ${errors.issuerName ? 'border-red-500 focus:border-red-500' : 'focus:border-[#a3a3a3]'}`}
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
                      <Label htmlFor="credentialType" className="text-sm font-medium text-white">
                        Credential Type *
                      </Label>
                      <Select value={formData.credentialType} onValueChange={(value) => handleInputChange('credentialType', value)}>
                        <SelectTrigger className="h-10 sm:h-12 bg-[#1a1a1a] border-[#404040] text-white hover:border-[#a3a3a3]">
                          <SelectValue>
                            {formData.credentialType === 'certificate' && 'Certificate'}
                            {formData.credentialType === 'diploma' && 'Diploma'}
                            {formData.credentialType === 'license' && 'License'}
                            {formData.credentialType === 'badge' && 'Badge'}
                            {formData.credentialType === 'other' && 'Other'}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="bg-[#1a1a1a] border-[#404040] text-white">
                          <SelectItem value="certificate" className="hover:bg-[#404040] focus:bg-[#404040]">Certificate</SelectItem>
                          <SelectItem value="diploma" className="hover:bg-[#404040] focus:bg-[#404040]">Diploma</SelectItem>
                          <SelectItem value="license" className="hover:bg-[#404040] focus:bg-[#404040]">License</SelectItem>
                          <SelectItem value="badge" className="hover:bg-[#404040] focus:bg-[#404040]">Badge</SelectItem>
                          <SelectItem value="other" className="hover:bg-[#404040] focus:bg-[#404040]">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="issueDate" className="text-sm font-medium text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-white" />
                      Issue Date *
                    </Label>
                    <div className="relative group">
                      <input
                        id="issueDate"
                        type="datetime-local"
                        value={formData.issueDate}
                        onChange={(e) => handleInputChange('issueDate', e.target.value)}
                        className={`w-full h-10 sm:h-12 px-3 sm:px-4 rounded-md border bg-[#1a1a1a] text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm sm:text-base ${errors.issueDate ? 'border-red-500' : 'border-[#404040] hover:border-[#a3a3a3]'} [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:filter-[invert(100%)]`}
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
                    <Label htmlFor="expiryDate" className="text-sm font-medium text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-white" />
                      Expiry Date
                    </Label>
                    <div className="relative group">
                      <input
                        id="expiryDate"
                        type="datetime-local"
                        value={formData.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                        className={`w-full h-10 sm:h-12 px-3 sm:px-4 rounded-md border bg-[#1a1a1a] text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm sm:text-base ${errors.expiryDate ? 'border-red-500' : 'border-[#404040] hover:border-[#a3a3a3]'} [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:filter-[invert(100%)]`}
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
                      <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-[#404040] rounded-lg">
                        <Building className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-white">Custom Data Fields</h3>
                    </div>
                    <Button
                      type="button"
                      onClick={addCustomField}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2 bg-white hover:bg-gray-200 text-black border-white hover:border-gray-300 w-full sm:w-auto"
                    >
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Add Field</span>
                    </Button>
                  </div>

                  {customFields.length > 0 ? (
                    <div className="space-y-3 sm:space-y-4">
                      {customFields.map((field, index) => (
                        <div key={index} className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start p-3 sm:p-4 bg-[#1a1a1a] rounded-lg border border-[#404040]">
                          <div className="flex-1 w-full">
                            <Label className="text-sm font-medium text-white">Field Name</Label>
                            <Input
                              placeholder="e.g., course, grade, department"
                              value={field.key}
                              onChange={(e) => updateCustomField(index, 'key', e.target.value)}
                              className="h-9 sm:h-10 mt-1 bg-[#000000] border-[#404040] text-white"
                            />
                          </div>
                          <div className="flex-1 w-full">
                            <Label className="text-sm font-medium text-white">Field Value</Label>
                            <Input
                              placeholder="Enter field value"
                              value={field.value}
                              onChange={(e) => updateCustomField(index, 'value', e.target.value)}
                              className="h-9 sm:h-10 mt-1 bg-[#000000] border-[#404040] text-white"
                            />
                          </div>
                          <Button
                            type="button"
                            onClick={() => removeCustomField(index)}
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 sm:h-10 sm:w-10 text-red-400 hover:text-red-300 hover:bg-red-900/20 mt-6 sm:mt-6"
                          >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 sm:py-12 text-[#a3a3a3] bg-[#1a1a1a] rounded-lg border-2 border-dashed border-[#404040]">
                      <Building className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-[#404040]" />
                      <p className="text-base sm:text-lg font-medium mb-2 text-white">No custom fields added yet</p>
                      <p className="text-sm text-[#a3a3a3]">Click "Add Field" to include additional data in your credential.</p>
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
                    className="bg-[#404040] hover:bg-[#a3a3a3] px-6 sm:px-8 py-3 text-sm sm:text-base font-medium text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 w-full sm:w-auto border border-[#404040]"
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

        {/* Result Display */}
        {result && (
          <div className="mt-8">
            <Alert className={`shadow-md ${result.success ? 'border-green-500 bg-green-900/20' : 'border-red-500 bg-red-900/20'}`}>
              <AlertDescription className="space-y-4">
                <div className={`text-base sm:text-lg font-semibold ${result.success ? 'text-green-300' : 'text-red-300'}`}>
                  {result.message}
                </div>

                {result.success && result.data && (
                  <Card className="mt-4 bg-[#1a1a1a] border-[#404040] shadow-sm">
                    <CardHeader className="pb-3 p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                        <CardTitle className="text-base sm:text-lg font-semibold text-white">
                          Credential Issued Successfully
                        </CardTitle>
                        <div className="flex gap-2 w-full sm:w-auto">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={copyCredentialId}
                            className="flex items-center gap-2 flex-1 sm:flex-none border-[#404040] text-white hover:bg-[#404040]"
                          >
                            {copiedId ? (
                              <>
                                <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
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
                            className="flex items-center gap-2 flex-1 sm:flex-none border-[#404040] text-white hover:bg-[#404040]"
                          >
                            {copiedJson ? (
                              <>
                                <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
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
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-[#1a1a1a] rounded border border-[#404040] gap-1 sm:gap-0">
                            <span className="font-medium text-[#a3a3a3]">Credential ID:</span>
                            <Badge variant="outline" className="font-mono text-xs w-full sm:w-auto text-center bg-[#000000] text-white border-[#404040]">
                              {result.data.id}
                            </Badge>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-[#1a1a1a] rounded border border-[#404040] gap-1 sm:gap-0">
                            <span className="font-medium text-[#a3a3a3]">Holder Name:</span>
                            <span className="text-white text-xs sm:text-sm">{result.data.holderName}</span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-[#1a1a1a] rounded border border-[#404040] gap-1 sm:gap-0">
                            <span className="font-medium text-[#a3a3a3]">Credential Type:</span>
                            <Badge variant="secondary" className="text-xs sm:text-sm w-full sm:w-auto text-center bg-[#404040] text-white">{result.data.credentialType}</Badge>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-[#1a1a1a] rounded border border-[#404040] gap-1 sm:gap-0">
                            <span className="font-medium text-[#a3a3a3]">Issue Date:</span>
                            <span className="text-white text-xs">
                              {new Date(result.data.issueDate).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-[#1a1a1a] rounded border border-[#404040] gap-1 sm:gap-0">
                            <span className="font-medium text-[#a3a3a3]">Issuer Name:</span>
                            <span className="text-white text-xs sm:text-sm">{result.data.issuerName}</span>
                          </div>
                          {result.data.expiryDate && (
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-[#1a1a1a] rounded border border-[#404040] gap-1 sm:gap-0">
                              <span className="font-medium text-[#a3a3a3]">Expiry Date:</span>
                              <span className="text-white text-xs">
                                {new Date(result.data.expiryDate).toLocaleString()}
                              </span>
                            </div>
                          )}
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-[#1a1a1a] rounded border border-[#404040] gap-1 sm:gap-0">
                            <span className="font-medium text-[#a3a3a3]">Issued By Worker:</span>
                            <Badge variant="outline" className="font-mono text-xs w-full sm:w-auto text-center bg-[#000000] text-white border-[#404040]">
                              {result.data.issuedBy.split('-').slice(-1)[0]}
                            </Badge>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-[#1a1a1a] rounded border border-[#404040] gap-1 sm:gap-0">
                            <span className="font-medium text-[#a3a3a3]">Timestamp:</span>
                            <span className="text-white text-xs">
                              {new Date(result.data.timestamp).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {Object.keys(result.data.data).length > 0 && (
                        <div className="pt-3 border-t border-[#404040]">
                          <h4 className="font-medium text-white mb-3 text-sm">
                            Custom Data:
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {Object.entries(result.data.data).map(([key, value]) => (
                              <div key={key} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-2 bg-[#1a1a1a] rounded border border-[#404040] text-xs sm:text-sm gap-1 sm:gap-0">
                                <span className="font-medium text-[#a3a3a3]">{key}:</span>
                                <span className="text-white break-all">{String(value)}</span>
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
          </div>
        )}
      </div>
    </div>
  );
}