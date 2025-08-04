import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const PlatformConfigPanel = ({ platform, onSave, onClose }) => {
  const [config, setConfig] = useState({
    name: platform?.name || '',
    url: platform?.url || '',
    country: platform?.country || '',
    type: platform?.type || 'national',
    authType: platform?.authType || 'none',
    username: platform?.username || '',
    password: platform?.password || '',
    apiKey: platform?.apiKey || '',
    scrapeInterval: platform?.scrapeInterval || 60,
    rateLimit: platform?.rateLimit || 10,
    maxRetries: platform?.maxRetries || 3,
    timeout: platform?.timeout || 30,
    enabled: platform?.enabled || true,
    categories: platform?.categories || [],
    customRules: platform?.customRules || '',
    headers: platform?.headers || {},
    cookies: platform?.cookies || {},
    proxy: platform?.proxy || false,
    proxyUrl: platform?.proxyUrl || '',
    validateSSL: platform?.validateSSL !== false,
    followRedirects: platform?.followRedirects !== false
  });

  const [activeTab, setActiveTab] = useState('general');

  const authTypeOptions = [
    { value: 'none', label: 'No Authentication' },
    { value: 'basic', label: 'Basic Auth' },
    { value: 'form', label: 'Form Login' },
    { value: 'oauth', label: 'OAuth 2.0' },
    { value: 'api_key', label: 'API Key' },
    { value: 'certificate', label: 'Client Certificate' }
  ];

  const typeOptions = [
    { value: 'national', label: 'National Platform' },
    { value: 'regional', label: 'Regional Platform' },
    { value: 'municipal', label: 'Municipal Platform' },
    { value: 'eu', label: 'EU-wide Platform' }
  ];

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

  const categoryOptions = [
    'IT Services', 'Construction', 'Healthcare', 'Education', 'Transportation',
    'Energy', 'Consulting', 'Maintenance', 'Security', 'Telecommunications'
  ];

  const tabs = [
    { id: 'general', label: 'General', icon: 'Settings' },
    { id: 'authentication', label: 'Authentication', icon: 'Lock' },
    { id: 'scraping', label: 'Scraping', icon: 'Activity' },
    { id: 'advanced', label: 'Advanced', icon: 'Code' }
  ];

  const handleConfigChange = (key, value) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    onSave(config);
  };

  const handleTest = () => {
    // Test connection logic would go here
    console.log('Testing connection with config:', config);
  };

  if (!platform) {
    return (
      <div className="bg-card rounded-lg border border-border p-8 text-center">
        <Icon name="MousePointer" size={48} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">Select a Platform</h3>
        <p className="text-muted-foreground">
          Choose a platform from the table to view and edit its configuration
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border elevation-1 h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Globe" size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{platform?.name}</h3>
              <p className="text-sm text-muted-foreground">{platform?.url}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Status */}
        <div className="flex items-center space-x-4">
          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
            platform?.status === 'active' ? 'text-success bg-success/10' :
            platform?.status === 'error' ? 'text-error bg-error/10' :
            platform?.status === 'maintenance'? 'text-warning bg-warning/10' : 'text-muted-foreground bg-muted'
          }`}>
            <Icon name={
              platform?.status === 'active' ? 'CheckCircle' :
              platform?.status === 'error' ? 'AlertCircle' :
              platform?.status === 'maintenance' ? 'Settings' : 'Pause'
            } size={14} />
            <span className="capitalize">{platform?.status}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Success Rate: <span className="font-medium text-foreground">{(platform?.successRate * 100)?.toFixed(1)}%</span>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-8 px-6">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 py-4 border-b-2 text-sm font-medium transition-quick ${
                activeTab === tab?.id
                  ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </nav>
      </div>
      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'general' && (
          <div className="space-y-6">
            <Input
              label="Platform Name"
              value={config?.name}
              onChange={(e) => handleConfigChange('name', e?.target?.value)}
              required
            />
            
            <Input
              label="Base URL"
              type="url"
              value={config?.url}
              onChange={(e) => handleConfigChange('url', e?.target?.value)}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Country"
                options={countryOptions}
                value={config?.country}
                onChange={(value) => handleConfigChange('country', value)}
              />
              
              <Select
                label="Platform Type"
                options={typeOptions}
                value={config?.type}
                onChange={(value) => handleConfigChange('type', value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Tender Categories
              </label>
              <div className="grid grid-cols-2 gap-2">
                {categoryOptions?.map((category) => (
                  <Checkbox
                    key={category}
                    label={category}
                    checked={config?.categories?.includes(category)}
                    onChange={(e) => {
                      const newCategories = e?.target?.checked
                        ? [...config?.categories, category]
                        : config?.categories?.filter(c => c !== category);
                      handleConfigChange('categories', newCategories);
                    }}
                  />
                ))}
              </div>
            </div>

            <Checkbox
              label="Enable Platform"
              description="Platform will be included in scraping operations"
              checked={config?.enabled}
              onChange={(e) => handleConfigChange('enabled', e?.target?.checked)}
            />
          </div>
        )}

        {activeTab === 'authentication' && (
          <div className="space-y-6">
            <Select
              label="Authentication Type"
              options={authTypeOptions}
              value={config?.authType}
              onChange={(value) => handleConfigChange('authType', value)}
            />

            {config?.authType === 'basic' && (
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Username"
                  value={config?.username}
                  onChange={(e) => handleConfigChange('username', e?.target?.value)}
                />
                <Input
                  label="Password"
                  type="password"
                  value={config?.password}
                  onChange={(e) => handleConfigChange('password', e?.target?.value)}
                />
              </div>
            )}

            {config?.authType === 'api_key' && (
              <Input
                label="API Key"
                type="password"
                value={config?.apiKey}
                onChange={(e) => handleConfigChange('apiKey', e?.target?.value)}
                description="API key for platform authentication"
              />
            )}

            {config?.authType === 'form' && (
              <div className="space-y-4">
                <Input
                  label="Login URL"
                  type="url"
                  value={config?.loginUrl}
                  onChange={(e) => handleConfigChange('loginUrl', e?.target?.value)}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Username Field"
                    value={config?.usernameField}
                    onChange={(e) => handleConfigChange('usernameField', e?.target?.value)}
                    placeholder="username"
                  />
                  <Input
                    label="Password Field"
                    value={config?.passwordField}
                    onChange={(e) => handleConfigChange('passwordField', e?.target?.value)}
                    placeholder="password"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'scraping' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Scrape Interval (minutes)"
                type="number"
                value={config?.scrapeInterval}
                onChange={(e) => handleConfigChange('scrapeInterval', parseInt(e?.target?.value))}
                min="1"
                max="1440"
              />
              <Input
                label="Rate Limit (requests/minute)"
                type="number"
                value={config?.rateLimit}
                onChange={(e) => handleConfigChange('rateLimit', parseInt(e?.target?.value))}
                min="1"
                max="100"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Max Retries"
                type="number"
                value={config?.maxRetries}
                onChange={(e) => handleConfigChange('maxRetries', parseInt(e?.target?.value))}
                min="0"
                max="10"
              />
              <Input
                label="Timeout (seconds)"
                type="number"
                value={config?.timeout}
                onChange={(e) => handleConfigChange('timeout', parseInt(e?.target?.value))}
                min="5"
                max="300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Custom Scraping Rules
              </label>
              <textarea
                className="w-full h-32 px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                value={config?.customRules}
                onChange={(e) => handleConfigChange('customRules', e?.target?.value)}
                placeholder="Enter custom CSS selectors or XPath expressions..."
              />
              <p className="text-xs text-muted-foreground mt-1">
                Define custom rules for data extraction specific to this platform
              </p>
            </div>
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <Checkbox
                label="Use Proxy"
                checked={config?.proxy}
                onChange={(e) => handleConfigChange('proxy', e?.target?.checked)}
              />
              
              {config?.proxy && (
                <Input
                  label="Proxy URL"
                  value={config?.proxyUrl}
                  onChange={(e) => handleConfigChange('proxyUrl', e?.target?.value)}
                  placeholder="http://proxy.example.com:8080"
                />
              )}
            </div>

            <div className="space-y-4">
              <Checkbox
                label="Validate SSL Certificates"
                checked={config?.validateSSL}
                onChange={(e) => handleConfigChange('validateSSL', e?.target?.checked)}
              />
              
              <Checkbox
                label="Follow Redirects"
                checked={config?.followRedirects}
                onChange={(e) => handleConfigChange('followRedirects', e?.target?.checked)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Custom Headers (JSON)
              </label>
              <textarea
                className="w-full h-24 px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent font-mono text-sm"
                value={JSON.stringify(config?.headers, null, 2)}
                onChange={(e) => {
                  try {
                    const headers = JSON.parse(e?.target?.value);
                    handleConfigChange('headers', headers);
                  } catch (err) {
                    // Invalid JSON, don't update
                  }
                }}
                placeholder='{"User-Agent": "Custom Bot", "Accept": "application/json"}'
              />
            </div>
          </div>
        )}
      </div>
      {/* Footer */}
      <div className="p-6 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              iconName="Zap"
              iconPosition="left"
              onClick={handleTest}
            >
              Test Connection
            </Button>
            <Button
              variant="ghost"
              iconName="RotateCcw"
              iconPosition="left"
            >
              Reset
            </Button>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="lg:hidden"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              iconName="Save"
              iconPosition="left"
              onClick={handleSave}
            >
              Save Configuration
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformConfigPanel;