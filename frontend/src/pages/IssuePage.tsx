import { useState } from 'react';
import { FileText, Plus, Trash2, User, Building, Sparkles, CheckCircle2, AlertCircle, Calendar, Award, Clock } from 'lucide-react';
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
    issueDate: new Date().toISOString().slice(0, 16),
    expiryDate: '',
    issuerName: '',
  });

  const [customFields, setCustomFields] = useState<Array<{ key: string; value: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; data?: IssuedCredential } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-100 to-purple-100 text-cyan-800 rounded-full text-sm font-medium border border-cyan-200/50">
          <Sparkles className="w-4 h-4 mr-2" />
          Credential Issuance Platform
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold gradient-text">Issue New Credential</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Create and issue a new digital credential with custom data fields, automatic validation,
            and comprehensive audit trails.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm hover-lift">
            <CardHeader className="bg-gradient-to-br from-cyan-50 via-white to-purple-50 rounded-t-lg border-b">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-cyan-600 to-purple-600 rounded-2xl shadow-lg">
                  <Award className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl font-semibold text-gray-900">Credential Information</CardTitle>
                  <CardDescription className="text-base">Fill in the details for the new credential</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-cyan-100 rounded-lg">
                      <User className="w-4 h-4 text-cyan-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="holderName" className="text-sm font-medium">
                        Holder Name *
                      </Label>
                      <Input
                        id="holderName"
                        placeholder="Enter credential holder's full name"
                        value={formData.holderName}
                        onChange={(e) => handleInputChange('holderName', e.target.value)}
                        className={`h-12 transition-all duration-200 ${errors.holderName ? 'border-red-500 focus:border-red-500' : 'focus:border-cyan-500'}`}
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
                        className={`h-12 transition-all duration-200 ${errors.issuerName ? 'border-red-500 focus:border-red-500' : 'focus:border-cyan-500'}`}
                      />
                      {errors.issuerName && (
                        <p className="text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.issuerName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="credentialType" className="text-sm font-medium">
                        Credential Type *
                      </Label>
                      <Select value={formData.credentialType} onValueChange={(value) => handleInputChange('credentialType', value)}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select credential type" />
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
                      <Label htmlFor="issueDate" className="text-sm font-medium">
                        Issue Date *
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="issueDate"
                          type="datetime-local"
                          value={formData.issueDate}
                          onChange={(e) => handleInputChange('issueDate', e.target.value)}
                          className={`h-12 pl-10 transition-all duration-200 ${errors.issueDate ? 'border-red-500' : 'focus:border-cyan-500'}`}
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
                      <Label htmlFor="expiryDate" className="text-sm font-medium">
                        Expiry Date
                      </Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="expiryDate"
                          type="datetime-local"
                          value={formData.expiryDate}
                          onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                          className={`h-12 pl-10 transition-all duration-200 ${errors.expiryDate ? 'border-red-500' : 'focus:border-cyan-500'}`}
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
                </div>

                <Separator className="my-8" />

                {/* Custom Fields */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg">
                        <Building className="w-4 h-4 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Custom Data Fields</h3>
                    </div>
                    <Button
                      type="button"
                      onClick={addCustomField}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2 hover:bg-purple-50 hover:border-purple-200"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Field</span>
                    </Button>
                  </div>

                  {customFields.length > 0 ? (
                    <div className="space-y-4">
                      {customFields.map((field, index) => (
                        <div key={index} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex-1">
                            <Label className="text-sm font-medium">Field Name</Label>
                            <Input
                              placeholder="e.g., course, grade, department"
                              value={field.key}
                              onChange={(e) => updateCustomField(index, 'key', e.target.value)}
                              className="h-10 mt-1"
                            />
                          </div>
                          <div className="flex-1">
                            <Label className="text-sm font-medium">Field Value</Label>
                            <Input
                              placeholder="Enter field value"
                              value={field.value}
                              onChange={(e) => updateCustomField(index, 'value', e.target.value)}
                              className="h-10 mt-1"
                            />
                          </div>
                          <Button
                            type="button"
                            onClick={() => removeCustomField(index)}
                            variant="outline"
                            size="icon"
                            className="h-10 w-10 text-red-500 hover:text-red-700 hover:bg-red-50 mt-6"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                      <Building className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium mb-2">No custom fields added yet</p>
                      <p className="text-sm">Click "Add Field" to include additional data in your credential.</p>
                    </div>
                  )}
                </div>

                <Separator className="my-8" />

                {/* Submit Button */}
                <div className="flex justify-end pt-6">
                  <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 px-8 py-3 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="spinner w-5 h-5 mr-2" />
                        Issuing Credential...
                      </>
                    ) : (
                      <>
                        <FileText className="w-5 h-5 mr-2" />
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
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card className="bg-gradient-to-br from-cyan-50 to-purple-50 border-cyan-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center text-cyan-800">
                <Award className="w-5 h-5 mr-2" />
                Credential Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Custom Fields</span>
                <Badge variant="secondary" className="bg-white/60">{customFields.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Data Points</span>
                <Badge variant="secondary" className="bg-white/60">
                  {Object.values(formData).filter(Boolean).length + customFields.reduce((acc, field) => acc + (field.key && field.value ? 1 : 0), 0)}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status</span>
                <Badge variant={loading ? "default" : "secondary"} className={loading ? "bg-cyan-600" : "bg-white/60"}>
                  {loading ? "Processing" : "Ready"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="bg-amber-50 border-amber-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center text-amber-800">
                <Sparkles className="w-5 h-5 mr-2" />
                Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-amber-700">
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
        <Alert className={`${result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'} shadow-lg`}>
          {result.success ? (
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          ) : (
            <AlertCircle className="h-6 w-6 text-red-600" />
          )}
          <AlertDescription className="text-base">
            <div className={`font-medium ${result.success ? 'text-green-800' : 'text-red-800'} mb-3`}>
              {result.message}
            </div>

            {result.success && result.data && (
              <Card className="mt-4 bg-white border-green-200 shadow-lg">
                <CardHeader className="pb-4 bg-green-50 rounded-t-lg">
                  <CardTitle className="text-lg text-green-800 flex items-center">
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Credential Issued Successfully
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-700">Credential ID:</span>
                        <Badge variant="outline" className="font-mono text-xs bg-white">
                          {result.data.id}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-700">Holder:</span>
                        <span className="text-gray-900 font-medium">{result.data.holderName}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-700">Type:</span>
                        <Badge variant="secondary" className="bg-cyan-100 text-cyan-800">{result.data.credentialType}</Badge>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-700">Issued By:</span>
                        <Badge variant="outline" className="font-mono text-xs bg-white">
                          {result.data.issuedBy.split('-').slice(-1)[0]}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-700">Issuer:</span>
                        <span className="text-gray-900 font-medium">{result.data.issuerName}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-700">Timestamp:</span>
                        <span className="text-gray-900 text-xs">
                          {new Date(result.data.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {Object.keys(result.data.data).length > 0 && (
                    <div className="pt-4 border-t border-green-200">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <Building className="w-4 h-4 mr-2" />
                        Custom Data:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Object.entries(result.data.data).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center p-3 bg-cyan-50 rounded-lg border border-cyan-200">
                            <span className="font-medium text-gray-700">{key}:</span>
                            <span className="text-gray-900 font-medium">{String(value)}</span>
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