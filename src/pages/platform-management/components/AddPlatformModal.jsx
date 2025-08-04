import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const AddPlatformModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    country: '',
    type: 'national',
    authType: 'none',
    username: '',
    password: '',
    apiKey: '',
    scrapeInterval: 60,
    rateLimit: 10,
    categories: [],
    enabled: true
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});

  const countryOptions = [
    { value: 'germany', label: '🇩🇪 Germany' },
    { value: 'france', label: '🇫🇷 France' },
    { value: 'austria', label: '🇦🇹 Austria' },
    { value: 'switzerland', label: '🇨🇭 Switzerland' },
    { value: 'netherlands', label: '🇳🇱 Netherlands' },
    { value: 'belgium', label: '🇧🇪 Belgium' },
    { value: 'italy', label: '🇮🇹 Italy' },
    { value: 'spain', label: '🇪🇸 Spain' },
    { value: 'eu', label: '🇪🇺 European Union' }
  ];

  const typeOptions = [
    { value: 'national', label: 'National Platform' },
    { value: 'regional', label: 'Regional Platform' },
    { value: 'municipal', label: 'Municipal Platform' },
    { value: 'eu', label: 'EU-wide Platform' }
  ];

  const authTypeOptions = [
    { value: 'none', label: 'No Authentication' },
    { value: 'basic', label: 'Basic Auth' },
    { value: 'form', label: 'Form Login' },
    { value: 'api_key', label: 'API Key' }
  ];

  const categoryOptions = [
    'IT Services', 'Construction', 'Healthcare', 'Education', 'Transportation',
    'Energy', 'Consulting', 'Maintenance', 'Security', 'Telecommunications'
  ];

  const steps = [
    { id: 1, title: 'Basic Information', icon: 'Info' },
    { id: 2, title: 'Authentication', icon: 'Lock' },
    { id: 3, title: 'Configuration', icon: 'Settings' },
    { id: 4, title: 'Review', icon: 'CheckCircle' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData?.name?.trim()) newErrors.name = 'Platform name is required';
      if (!formData?.url?.trim()) newErrors.url = 'URL is required';
      if (!formData?.country) newErrors.country = 'Country is required';
    }

    if (step === 2 && formData?.authType !== 'none') {
      if (formData?.authType === 'basic' || formData?.authType === 'form') {
        if (!formData?.username?.trim()) newErrors.username = 'Username is required';
        if (!formData?.password?.trim()) newErrors.password = 'Password is required';
      }
      if (formData?.authType === 'api_key' && !formData?.apiKey?.trim()) {
        newErrors.apiKey = 'API key is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      onSave(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      url: '',
      country: '',
      type: 'national',
      authType: 'none',
      username: '',
      password: '',
      apiKey: '',
      scrapeInterval: 60,
      rateLimit: 10,
      categories: [],
      enabled: true
    });
    setCurrentStep(1);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/50">
      <div className="bg-card rounded-lg border border-border elevation-3 w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Add New Platform</h2>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center space-x-4">
            {steps?.map((step, index) => (
              <React.Fragment key={step?.id}>
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step?.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {currentStep > step?.id ? (
                      <Icon name="Check" size={16} />
                    ) : (
                      step?.id
                    )}
                  </div>
                  <span className={`text-sm font-medium ${
                    currentStep >= step?.id ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step?.title}
                  </span>
                </div>
                {index < steps?.length - 1 && (
                  <div className={`flex-1 h-px ${
                    currentStep > step?.id ? 'bg-primary' : 'bg-border'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {currentStep === 1 && (
            <div className="space-y-6">
              <Input
                label="Platform Name"
                value={formData?.name}
                onChange={(e) => handleInputChange('name', e?.target?.value)}
                error={errors?.name}
                required
                placeholder="e.g., TED Europa"
              />

              <Input
                label="Base URL"
                type="url"
                value={formData?.url}
                onChange={(e) => handleInputChange('url', e?.target?.value)}
                error={errors?.url}
                required
                placeholder="https://ted.europa.eu"
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Country"
                  options={countryOptions}
                  value={formData?.country}
                  onChange={(value) => handleInputChange('country', value)}
                  error={errors?.country}
                  required
                />

                <Select
                  label="Platform Type"
                  options={typeOptions}
                  value={formData?.type}
                  onChange={(value) => handleInputChange('type', value)}
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <Select
                label="Authentication Type"
                options={authTypeOptions}
                value={formData?.authType}
                onChange={(value) => handleInputChange('authType', value)}
                description="Select the authentication method required by this platform"
              />

              {formData?.authType === 'basic' && (
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Username"
                    value={formData?.username}
                    onChange={(e) => handleInputChange('username', e?.target?.value)}
                    error={errors?.username}
                    required
                  />
                  <Input
                    label="Password"
                    type="password"
                    value={formData?.password}
                    onChange={(e) => handleInputChange('password', e?.target?.value)}
                    error={errors?.password}
                    required
                  />
                </div>
              )}

              {formData?.authType === 'api_key' && (
                <Input
                  label="API Key"
                  type="password"
                  value={formData?.apiKey}
                  onChange={(e) => handleInputChange('apiKey', e?.target?.value)}
                  error={errors?.apiKey}
                  required
                  description="API key provided by the platform"
                />
              )}

              {formData?.authType === 'none' && (
                <div className="text-center py-8">
                  <Icon name="Unlock" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No authentication required for this platform
                  </p>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Scrape Interval (minutes)"
                  type="number"
                  value={formData?.scrapeInterval}
                  onChange={(e) => handleInputChange('scrapeInterval', parseInt(e?.target?.value))}
                  min="1"
                  max="1440"
                />
                <Input
                  label="Rate Limit (requests/minute)"
                  type="number"
                  value={formData?.rateLimit}
                  onChange={(e) => handleInputChange('rateLimit', parseInt(e?.target?.value))}
                  min="1"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Tender Categories
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {categoryOptions?.map((category) => (
                    <Checkbox
                      key={category}
                      label={category}
                      checked={formData?.categories?.includes(category)}
                      onChange={(e) => {
                        const newCategories = e?.target?.checked
                          ? [...formData?.categories, category]
                          : formData?.categories?.filter(c => c !== category);
                        handleInputChange('categories', newCategories);
                      }}
                    />
                  ))}
                </div>
              </div>

              <Checkbox
                label="Enable Platform"
                description="Platform will be included in scraping operations"
                checked={formData?.enabled}
                onChange={(e) => handleInputChange('enabled', e?.target?.checked)}
              />
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-medium text-foreground mb-4">Review Configuration</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span>
                    <span className="ml-2 text-foreground font-medium">{formData?.name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">URL:</span>
                    <span className="ml-2 text-foreground font-medium">{formData?.url}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Country:</span>
                    <span className="ml-2 text-foreground font-medium">
                      {countryOptions?.find(c => c?.value === formData?.country)?.label}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <span className="ml-2 text-foreground font-medium">
                      {typeOptions?.find(t => t?.value === formData?.type)?.label}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Authentication:</span>
                    <span className="ml-2 text-foreground font-medium">
                      {authTypeOptions?.find(a => a?.value === formData?.authType)?.label}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Interval:</span>
                    <span className="ml-2 text-foreground font-medium">{formData?.scrapeInterval} min</span>
                  </div>
                </div>
                {formData?.categories?.length > 0 && (
                  <div className="mt-4">
                    <span className="text-muted-foreground text-sm">Categories:</span>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {formData?.categories?.map((category) => (
                        <span
                          key={category}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={handleClose}>
                Cancel
              </Button>
              {currentStep < 4 ? (
                <Button variant="default" onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button
                  variant="default"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={handleSubmit}
                >
                  Add Platform
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPlatformModal;