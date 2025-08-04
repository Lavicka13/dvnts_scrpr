import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';


const ScraperControlPanel = ({ 
  isScrapingActive, 
  selectedPlatforms, 
  onStartScraping, 
  onStopScraping,
  scraperHealth 
}) => {
  const [scrapingOptions, setScrapingOptions] = useState({
    mode: 'full', // full, incremental, validation
    concurrency: 3,
    rateLimit: 2000,
    maxRetries: 3,
    timeout: 30,
    aiProcessing: true,
    exportFormat: 'json',
    scheduleImmediate: true
  });

  const [advancedMode, setAdvancedMode] = useState(false);

  const handleOptionChange = (key, value) => {
    setScrapingOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleStartScraping = () => {
    onStartScraping(scrapingOptions);
  };

  const getModeDescription = (mode) => {
    switch (mode) {
      case 'full':
        return 'Complete scraping of all available tenders';
      case 'incremental':
        return 'Only new tenders since last scrape';
      case 'validation':
        return 'Validate existing data integrity';
      default:
        return '';
    }
  };

  const getHealthStatusBadge = (status) => {
    const colors = {
      healthy: 'bg-success/10 text-success border-success/20',
      degraded: 'bg-warning/10 text-warning border-warning/20',
      error: 'bg-error/10 text-error border-error/20'
    };

    return colors?.[status] || 'bg-muted text-muted-foreground border-border';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Control Panel */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Scraping Control</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Configure and execute scraping operations
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-foreground">Advanced Mode:</label>
              <button
                onClick={() => setAdvancedMode(!advancedMode)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  advancedMode ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  advancedMode ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
              </button>
            </div>
          </div>

          {/* Basic Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Scraping Mode
              </label>
              <Select
                value={scrapingOptions?.mode}
                onChange={(value) => handleOptionChange('mode', value)}
                options={[
                  { value: 'full', label: 'Full Scrape' },
                  { value: 'incremental', label: 'Incremental' },
                  { value: 'validation', label: 'Validation' }
                ]}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {getModeDescription(scrapingOptions?.mode)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Export Format
              </label>
              <Select
                value={scrapingOptions?.exportFormat}
                onChange={(value) => handleOptionChange('exportFormat', value)}
                options={[
                  { value: 'json', label: 'JSON' },
                  { value: 'csv', label: 'CSV' },
                  { value: 'xml', label: 'XML' },
                  { value: 'xlsx', label: 'Excel' }
                ]}
              />
            </div>
          </div>

          {/* Advanced Options */}
          {advancedMode && (
            <div className="border-t border-border pt-6">
              <h4 className="text-md font-medium text-foreground mb-4">Advanced Configuration</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Concurrency
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={scrapingOptions?.concurrency}
                    onChange={(e) => handleOptionChange('concurrency', parseInt(e?.target?.value))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Parallel scraping jobs
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Rate Limit (ms)
                  </label>
                  <Input
                    type="number"
                    min="1000"
                    max="10000"
                    step="500"
                    value={scrapingOptions?.rateLimit}
                    onChange={(e) => handleOptionChange('rateLimit', parseInt(e?.target?.value))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Delay between requests
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Max Retries
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={scrapingOptions?.maxRetries}
                    onChange={(e) => handleOptionChange('maxRetries', parseInt(e?.target?.value))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Retry failed requests
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Timeout (seconds)
                  </label>
                  <Input
                    type="number"
                    min="10"
                    max="120"
                    value={scrapingOptions?.timeout}
                    onChange={(e) => handleOptionChange('timeout', parseInt(e?.target?.value))}
                  />
                </div>

                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="aiProcessing"
                    checked={scrapingOptions?.aiProcessing}
                    onChange={(e) => handleOptionChange('aiProcessing', e?.target?.checked)}
                    className="rounded border-border focus:ring-ring"
                  />
                  <label htmlFor="aiProcessing" className="text-sm font-medium text-foreground">
                    Enable AI Processing
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-border">
            <div className="text-sm text-muted-foreground">
              {selectedPlatforms?.length > 0 ? (
                `${selectedPlatforms?.length} platform${selectedPlatforms?.length > 1 ? 's' : ''} selected`
              ) : (
                'No platforms selected'
              )}
            </div>

            <div className="flex items-center space-x-3">
              {isScrapingActive && (
                <Button 
                  variant="outline" 
                  onClick={onStopScraping}
                  iconName="Square"
                >
                  Stop All Jobs
                </Button>
              )}
              
              <Button
                onClick={handleStartScraping}
                disabled={selectedPlatforms?.length === 0 || isScrapingActive}
                iconName={isScrapingActive ? "Loader2" : "Play"}
                className={isScrapingActive ? "animate-spin" : ""}
              >
                {isScrapingActive ? 'Scraping...' : 'Start Scraping'}
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              iconName="Zap"
              onClick={() => {
                handleOptionChange('mode', 'incremental');
                handleOptionChange('concurrency', 5);
                handleStartScraping();
              }}
            >
              Quick Incremental
            </Button>
            
            <Button 
              variant="outline" 
              iconName="Database"
              onClick={() => {
                handleOptionChange('mode', 'full');
                handleOptionChange('concurrency', 2);
                handleStartScraping();
              }}
            >
              Full Platform Sync
            </Button>
            
            <Button 
              variant="outline" 
              iconName="CheckCircle"
              onClick={() => {
                handleOptionChange('mode', 'validation');
                handleOptionChange('concurrency', 1);
                handleStartScraping();
              }}
            >
              Validate Data
            </Button>
          </div>
        </div>
      </div>
      {/* Status Panel */}
      <div className="space-y-6">
        {/* System Health */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">System Health</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Overall Status</span>
              <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
                getHealthStatusBadge(scraperHealth?.status)
              }`}>
                {scraperHealth?.status || 'Unknown'}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">OpenAI Service</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    scraperHealth?.services?.openai === 'healthy' ? 'bg-success' :
                    scraperHealth?.services?.openai === 'error' ? 'bg-error' : 'bg-warning'
                  }`}></div>
                  <span className="text-foreground">{scraperHealth?.services?.openai || 'Unknown'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Crawl4AI Service</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    scraperHealth?.services?.crawl4ai === 'healthy' ? 'bg-success' :
                    scraperHealth?.services?.crawl4ai === 'error' ? 'bg-error' : 'bg-warning'
                  }`}></div>
                  <span className="text-foreground">{scraperHealth?.services?.crawl4ai || 'Unknown'}</span>
                </div>
              </div>
            </div>

            {scraperHealth?.timestamp && (
              <div className="text-xs text-muted-foreground pt-2 border-t border-border">
                Last checked: {new Date(scraperHealth.timestamp)?.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>

        {/* Resource Usage */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Resource Usage</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">CPU Usage</span>
                <span className="text-foreground">45%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Memory Usage</span>
                <span className="text-foreground">67%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-warning h-2 rounded-full" style={{ width: '67%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Network I/O</span>
                <span className="text-foreground">23%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-success h-2 rounded-full" style={{ width: '23%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
          
          <div className="space-y-3">
            {[
              { time: '2 min ago', action: 'TED Europa scraping completed', status: 'success' },
              { time: '5 min ago', action: 'service.bund.de job started', status: 'info' },
              { time: '12 min ago', action: 'evergabe-online.de failed', status: 'error' },
              { time: '18 min ago', action: 'Batch job initialized', status: 'info' }
            ]?.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity?.status === 'success' ? 'bg-success' :
                  activity?.status === 'error' ? 'bg-error' : 'bg-primary'
                }`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{activity?.action}</p>
                  <p className="text-xs text-muted-foreground">{activity?.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScraperControlPanel;