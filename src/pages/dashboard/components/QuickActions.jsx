import React, { useState } from 'react';

import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const [isScrapingAll, setIsScrapingAll] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);

  const platforms = [
    { id: 'ted', name: 'TED Europa', status: 'active' },
    { id: 'bund', name: 'service.bund.de', status: 'active' },
    { id: 'evergabe', name: 'evergabe-online.de', status: 'warning' },
    { id: 'dtvp', name: 'dtvp.de', status: 'active' },
    { id: 'vergabe24', name: 'Vergabe24', status: 'active' },
    { id: 'simap', name: 'simap.ch', status: 'error' }
  ];

  const handleScrapeAll = async () => {
    setIsScrapingAll(true);
    // Simulate scraping process
    setTimeout(() => {
      setIsScrapingAll(false);
    }, 3000);
  };

  const handlePlatformToggle = (platformId) => {
    setSelectedPlatforms(prev => 
      prev?.includes(platformId)
        ? prev?.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleScrapeSelected = async () => {
    if (selectedPlatforms?.length === 0) return;
    
    // Simulate scraping selected platforms
    console.log('Scraping selected platforms:', selectedPlatforms);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 elevation-1">
      <h3 className="text-lg font-semibold text-foreground mb-6">Quick Actions</h3>
      <div className="space-y-6">
        {/* Bulk Actions */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">Bulk Operations</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              variant="default"
              onClick={handleScrapeAll}
              loading={isScrapingAll}
              iconName="Play"
              iconPosition="left"
              className="w-full"
            >
              {isScrapingAll ? 'Scraping All...' : 'Scrape All Platforms'}
            </Button>
            
            <Button
              variant="outline"
              iconName="Pause"
              iconPosition="left"
              className="w-full"
            >
              Pause All Operations
            </Button>
            
            <Button
              variant="secondary"
              iconName="RotateCcw"
              iconPosition="left"
              className="w-full"
            >
              Restart Failed Jobs
            </Button>
            
            <Button
              variant="outline"
              iconName="Download"
              iconPosition="left"
              className="w-full"
            >
              Export Today's Data
            </Button>
          </div>
        </div>

        {/* Platform Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground">Select Platforms</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedPlatforms([])}
              className="text-xs"
            >
              Clear All
            </Button>
          </div>
          
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {platforms?.map((platform) => (
              <div
                key={platform?.id}
                className="flex items-center justify-between p-3 border border-border rounded-md hover:bg-muted/50 transition-quick"
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id={platform?.id}
                    checked={selectedPlatforms?.includes(platform?.id)}
                    onChange={() => handlePlatformToggle(platform?.id)}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                  />
                  <label htmlFor={platform?.id} className="text-sm font-medium text-foreground cursor-pointer">
                    {platform?.name}
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    platform?.status === 'active' ? 'bg-success' :
                    platform?.status === 'warning'? 'bg-warning' : 'bg-error'
                  }`}></div>
                  <span className="text-xs text-muted-foreground capitalize">
                    {platform?.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <Button
            variant="outline"
            onClick={handleScrapeSelected}
            disabled={selectedPlatforms?.length === 0}
            iconName="Play"
            iconPosition="left"
            className="w-full"
          >
            Scrape Selected ({selectedPlatforms?.length})
          </Button>
        </div>

        {/* System Actions */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">System Management</h4>
          
          <div className="grid grid-cols-1 gap-3">
            <Button
              variant="ghost"
              iconName="RefreshCw"
              iconPosition="left"
              className="w-full justify-start"
            >
              Refresh Platform Status
            </Button>
            
            <Button
              variant="ghost"
              iconName="Database"
              iconPosition="left"
              className="w-full justify-start"
            >
              Clean Duplicate Data
            </Button>
            
            <Button
              variant="ghost"
              iconName="Shield"
              iconPosition="left"
              className="w-full justify-start"
            >
              Run Security Scan
            </Button>
            
            <Button
              variant="ghost"
              iconName="Settings"
              iconPosition="left"
              className="w-full justify-start"
            >
              Configure Schedules
            </Button>
          </div>
        </div>

        {/* Emergency Actions */}
        <div className="space-y-4 pt-4 border-t border-border">
          <h4 className="text-sm font-medium text-error">Emergency Controls</h4>
          
          <div className="space-y-2">
            <Button
              variant="destructive"
              iconName="Square"
              iconPosition="left"
              className="w-full"
            >
              Emergency Stop All
            </Button>
            
            <Button
              variant="outline"
              iconName="AlertTriangle"
              iconPosition="left"
              className="w-full text-warning border-warning hover:bg-warning/10"
            >
              Reset All Connections
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;