import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const DataExportPanel = ({ onExport, stats }) => {
  const [exportConfig, setExportConfig] = useState({
    format: 'json',
    dateRange: '7d',
    includePlatforms: [],
    includeFields: ['title', 'description', 'deadline', 'value', 'category'],
    compression: false,
    encryption: false,
    customDateFrom: '',
    customDateTo: ''
  });

  const [recentExports, setRecentExports] = useState([
    {
      id: 1,
      name: 'Weekly_IT_Tenders_2024-08-04.json',
      format: 'json',
      size: '2.3 MB',
      records: 1247,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),  // 2 hours ago
      status: 'completed',
      downloadUrl: '#'
    },
    {
      id: 2,
      name: 'Full_Platform_Export_2024-08-03.xlsx',
      format: 'xlsx',
      size: '15.7 MB',
      records: 8934,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      status: 'completed',
      downloadUrl: '#'
    },
    {
      id: 3,
      name: 'EU_Tenders_Export_2024-08-02.csv',
      format: 'csv',
      size: '5.1 MB',
      records: 3456,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      status: 'completed',
      downloadUrl: '#'
    },
    {
      id: 4,
      name: 'German_Platforms_2024-08-01.json',
      format: 'json',
      size: '890 KB',
      records: 456,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      status: 'failed',
      downloadUrl: null
    }
  ]);

  const availableFields = [
    { id: 'title', label: 'Title', essential: true },
    { id: 'description', label: 'Description', essential: true },
    { id: 'deadline', label: 'Deadline', essential: true },
    { id: 'value', label: 'Contract Value', essential: false },
    { id: 'currency', label: 'Currency', essential: false },
    { id: 'category', label: 'Category', essential: false },
    { id: 'cpvCodes', label: 'CPV Codes', essential: false },
    { id: 'authority', label: 'Contracting Authority', essential: false },
    { id: 'requirements', label: 'Requirements', essential: false },
    { id: 'contactInfo', label: 'Contact Information', essential: false },
    { id: 'url', label: 'Source URL', essential: false },
    { id: 'platformId', label: 'Platform ID', essential: true },
    { id: 'extractedAt', label: 'Extraction Date', essential: true }
  ];

  const platformOptions = [
    { id: 'ted-europa', name: 'TED Europa' },
    { id: 'service-bund-de', name: 'service.bund.de' },
    { id: 'evergabe-online', name: 'e-Vergabe Online' },
    { id: 'it-ausschreibung-de', name: 'IT-Ausschreibung.de' },
    { id: 'vergabepilot-ai', name: 'Vergabepilot AI' }
  ];

  const handleConfigChange = (key, value) => {
    setExportConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleFieldToggle = (fieldId) => {
    const field = availableFields?.find(f => f?.id === fieldId);
    if (field?.essential) return; // Can't deselect essential fields

    setExportConfig(prev => ({
      ...prev,
      includeFields: prev?.includeFields?.includes(fieldId)
        ? prev?.includeFields?.filter(id => id !== fieldId)
        : [...prev?.includeFields, fieldId]
    }));
  };

  const handlePlatformToggle = (platformId) => {
    setExportConfig(prev => ({
      ...prev,
      includePlatforms: prev?.includePlatforms?.includes(platformId)
        ? prev?.includePlatforms?.filter(id => id !== platformId)
        : [...prev?.includePlatforms, platformId]
    }));
  };

  const handleExport = () => {
    if (exportConfig?.includePlatforms?.length === 0) {
      alert('Please select at least one platform to export data from');
      return;
    }

    const exportData = {
      ...exportConfig,
      timestamp: new Date()?.toISOString(),
      filename: generateFilename()
    };

    onExport(exportData);

    // Add to recent exports (mock)
    const newExport = {
      id: Date.now(),
      name: exportData?.filename,
      format: exportConfig?.format,
      size: 'Generating...',
      records: 0,
      createdAt: new Date(),
      status: 'processing',
      downloadUrl: null
    };

    setRecentExports(prev => [newExport, ...prev?.slice(0, 9)]);
  };

  const generateFilename = () => {
    const date = new Date()?.toISOString()?.split('T')?.[0];
    const platforms = exportConfig?.includePlatforms?.length > 1 ? 'Multi_Platform' : 
                     platformOptions?.find(p => p?.id === exportConfig?.includePlatforms?.[0])?.name?.replace(/[^a-zA-Z0-9]/g, '_');
    return `${platforms}_Export_${date}.${exportConfig?.format}`;
  };

  const getDateRangeLabel = (range) => {
    switch (range) {
      case '1d': return 'Last 24 hours';
      case '7d': return 'Last 7 days';
      case '30d': return 'Last 30 days';
      case '90d': return 'Last 90 days';
      case 'custom': return 'Custom range';
      default: return range;
    }
  };

  const getEstimatedSize = () => {
    const baseSize = exportConfig?.includeFields?.length * 50; // KB per field
    const platformMultiplier = exportConfig?.includePlatforms?.length;
    const rangeMultiplier = exportConfig?.dateRange === '1d' ? 0.1 : 
                           exportConfig?.dateRange === '7d' ? 1 : 
                           exportConfig?.dateRange === '30d' ? 4 : 10;
    
    const estimatedKB = baseSize * platformMultiplier * rangeMultiplier;
    
    if (estimatedKB > 1024) {
      return `~${(estimatedKB / 1024)?.toFixed(1)} MB`;
    }
    return `~${estimatedKB?.toFixed(0)} KB`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success';
      case 'processing': return 'text-primary';
      case 'failed': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'CheckCircle';
      case 'processing': return 'Loader2';
      case 'failed': return 'XCircle';
      default: return 'Clock';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Export Configuration */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">Export Configuration</h3>
          
          {/* Format and Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Export Format
              </label>
              <Select
                value={exportConfig?.format}
                onChange={(value) => handleConfigChange('format', value)}
                options={[
                  { value: 'json', label: 'JSON (Structured)' },
                  { value: 'csv', label: 'CSV (Spreadsheet)' },
                  { value: 'xlsx', label: 'Excel (XLSX)' },
                  { value: 'xml', label: 'XML (Structured)' }
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Date Range
              </label>
              <Select
                value={exportConfig?.dateRange}
                onChange={(value) => handleConfigChange('dateRange', value)}
                options={[
                  { value: '1d', label: 'Last 24 hours' },
                  { value: '7d', label: 'Last 7 days' },
                  { value: '30d', label: 'Last 30 days' },
                  { value: '90d', label: 'Last 90 days' },
                  { value: 'custom', label: 'Custom range' }
                ]}
              />
            </div>
          </div>

          {/* Custom Date Range */}
          {exportConfig?.dateRange === 'custom' && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  From Date
                </label>
                <Input
                  type="date"
                  value={exportConfig?.customDateFrom}
                  onChange={(e) => handleConfigChange('customDateFrom', e?.target?.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  To Date
                </label>
                <Input
                  type="date"
                  value={exportConfig?.customDateTo}
                  onChange={(e) => handleConfigChange('customDateTo', e?.target?.value)}
                />
              </div>
            </div>
          )}

          {/* Platform Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-3">
              Select Platforms ({exportConfig?.includePlatforms?.length} selected)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {platformOptions?.map((platform) => (
                <div key={platform?.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={platform?.id}
                    checked={exportConfig?.includePlatforms?.includes(platform?.id)}
                    onChange={() => handlePlatformToggle(platform?.id)}
                  />
                  <label htmlFor={platform?.id} className="text-sm text-foreground">
                    {platform?.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Field Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-3">
              Include Fields ({exportConfig?.includeFields?.length} selected)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {availableFields?.map((field) => (
                <div key={field?.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={field?.id}
                    checked={exportConfig?.includeFields?.includes(field?.id)}
                    onChange={() => handleFieldToggle(field?.id)}
                    disabled={field?.essential}
                  />
                  <label 
                    htmlFor={field?.id} 
                    className={`text-sm ${field?.essential ? 'text-foreground font-medium' : 'text-foreground'}`}
                  >
                    {field?.label}
                    {field?.essential && <span className="text-primary ml-1">*</span>}
                  </label>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              * Essential fields cannot be deselected
            </p>
          </div>

          {/* Advanced Options */}
          <div className="border-t border-border pt-6">
            <h4 className="text-md font-medium text-foreground mb-4">Advanced Options</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="compression"
                  checked={exportConfig?.compression}
                  onChange={(checked) => handleConfigChange('compression', checked)}
                />
                <label htmlFor="compression" className="text-sm text-foreground">
                  Enable compression (ZIP)
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="encryption"
                  checked={exportConfig?.encryption}
                  onChange={(checked) => handleConfigChange('encryption', checked)}
                />
                <label htmlFor="encryption" className="text-sm text-foreground">
                  Password protection
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Export Summary */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
          <h4 className="text-md font-medium text-foreground mb-4">Export Summary</h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Format:</span>
              <span className="ml-2 font-medium text-foreground uppercase">
                {exportConfig?.format}
              </span>
            </div>
            
            <div>
              <span className="text-muted-foreground">Range:</span>
              <span className="ml-2 font-medium text-foreground">
                {getDateRangeLabel(exportConfig?.dateRange)}
              </span>
            </div>
            
            <div>
              <span className="text-muted-foreground">Platforms:</span>
              <span className="ml-2 font-medium text-foreground">
                {exportConfig?.includePlatforms?.length}
              </span>
            </div>
            
            <div>
              <span className="text-muted-foreground">Est. Size:</span>
              <span className="ml-2 font-medium text-foreground">
                {getEstimatedSize()}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              Ready to export data from selected platforms and date range
            </div>
            
            <Button 
              onClick={handleExport}
              disabled={exportConfig?.includePlatforms?.length === 0}
              iconName="Download"
            >
              Start Export
            </Button>
          </div>
        </div>
      </div>
      {/* Recent Exports & Stats */}
      <div className="space-y-6">
        {/* Export Stats */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Export Statistics</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Records Available</span>
              <span className="text-lg font-semibold text-foreground">
                {stats?.totalTendersToday?.toLocaleString()}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">This Week</span>
              <span className="font-medium text-foreground">
                {(stats?.totalTendersToday * 7)?.toLocaleString()}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active Platforms</span>
              <span className="font-medium text-foreground">
                {stats?.activePlatforms}/24
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Data Quality</span>
              <span className="font-medium text-success">
                {stats?.successRate}%
              </span>
            </div>
          </div>
        </div>

        {/* Recent Exports */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Exports</h3>
          
          <div className="space-y-3">
            {recentExports?.map((exportItem) => (
              <div key={exportItem?.id} className="border border-border rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground text-sm truncate">
                      {exportItem?.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {exportItem?.createdAt?.toLocaleDateString()} • {exportItem?.size}
                    </div>
                  </div>
                  
                  <div className={`flex items-center space-x-1 ${getStatusColor(exportItem?.status)}`}>
                    <Icon 
                      name={getStatusIcon(exportItem?.status)} 
                      size={12} 
                      className={exportItem?.status === 'processing' ? 'animate-spin' : ''}
                    />
                    <span className="text-xs capitalize">{exportItem?.status}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {exportItem?.records?.toLocaleString()} records
                  </span>
                  
                  {exportItem?.status === 'completed' && exportItem?.downloadUrl && (
                    <Button size="sm" variant="outline" iconName="Download">
                      Download
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {recentExports?.length === 0 && (
            <div className="text-center py-8">
              <Icon name="Download" size={32} className="text-muted-foreground mx-auto mb-2" />
              <div className="text-sm text-muted-foreground">No recent exports</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataExportPanel;