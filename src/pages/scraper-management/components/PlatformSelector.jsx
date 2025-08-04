import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const PlatformSelector = ({ platforms, selectedPlatforms, onSelectionChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [authFilter, setAuthFilter] = useState('');
  const [showConfigured, setShowConfigured] = useState(false);

  // Get unique regions and types for filters
  const regions = [...new Set(platforms?.map(p => p.region))];
  const types = [...new Set(platforms?.map(p => p.requiresAuth ? 'auth' : 'no-auth'))];

  // Filter platforms based on current filters
  const filteredPlatforms = platforms?.filter(platform => {
    const matchesSearch = !searchTerm || 
      platform?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      platform?.url?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    
    const matchesRegion = !regionFilter || platform?.region === regionFilter;
    const matchesType = !typeFilter || 
      (typeFilter === 'auth' && platform?.requiresAuth) ||
      (typeFilter === 'no-auth' && !platform?.requiresAuth);
    const matchesAuth = !authFilter || 
      (authFilter === 'configured' && platform?.scraperConfig?.authRequired) ||
      (authFilter === 'no-config' && !platform?.scraperConfig?.authRequired);
    const matchesConfigured = !showConfigured || platform?.scraperConfig;

    return matchesSearch && matchesRegion && matchesType && matchesAuth && matchesConfigured;
  });

  const handlePlatformToggle = (platformId) => {
    const isSelected = selectedPlatforms?.includes(platformId);
    const newSelection = isSelected
      ? selectedPlatforms?.filter(id => id !== platformId)
      : [...selectedPlatforms, platformId];
    
    onSelectionChange(newSelection);
  };

  const handleSelectAll = () => {
    const allIds = filteredPlatforms?.map(p => p?.id);
    onSelectionChange(allIds);
  };

  const handleDeselectAll = () => {
    onSelectionChange([]);
  };

  const handleSelectByRegion = (region) => {
    const regionPlatforms = filteredPlatforms
      ?.filter(p => p?.region === region)
      ?.map(p => p?.id);
    
    const newSelection = [...new Set([...selectedPlatforms, ...regionPlatforms])];
    onSelectionChange(newSelection);
  };

  const getCountryFlag = (region) => {
    const flags = {
      'EU-weit (inkl. DACH)': '🇪🇺',
      'Deutschland (Bund, Länder, Kommunen)': '🇩🇪',
      'Deutschland (Bundesbehörden)': '🇩🇪',
      'Deutschland': '🇩🇪',
      'Deutschland (DACH)': '🇩🇪',
      'Deutschland & EU': '🇪🇺',
      'Österreich (bundesweit)': '🇦🇹',
      'Österreich, EU, intl.': '🇦🇹',
      'Schweiz (Bund, Kantone, Gemeinden)': '🇨🇭',
      'Schweiz': '🇨🇭'
    };
    return flags?.[region] || '🌍';
  };

  const getPlatformStatusColor = (platform) => {
    if (!platform?.scraperConfig) return 'text-muted-foreground';
    if (platform?.requiresAuth && !platform?.scraperConfig?.authRequired) return 'text-warning';
    return 'text-success';
  };

  const getPlatformStatusText = (platform) => {
    if (!platform?.scraperConfig) return 'Not configured';
    if (platform?.requiresAuth && !platform?.scraperConfig?.authRequired) return 'Auth needed';
    return 'Ready';
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Platform Selection</h3>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>{selectedPlatforms?.length} selected</span>
            <span>•</span>
            <span>{filteredPlatforms?.length} visible</span>
            <span>•</span>
            <span>{platforms?.length} total</span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <Input
              placeholder="Search platforms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              icon="Search"
            />
          </div>

          <div>
            <Select
              value={regionFilter}
              onChange={setRegionFilter}
              options={[
                { value: '', label: 'All Regions' },
                ...regions?.map(region => ({ value: region, label: region }))
              ]}
            />
          </div>

          <div>
            <Select
              value={authFilter}
              onChange={setAuthFilter}
              options={[
                { value: '', label: 'All Types' },
                { value: 'auth', label: 'Requires Auth' },
                { value: 'no-auth', label: 'No Auth Required' }
              ]}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="showConfigured"
              checked={showConfigured}
              onChange={setShowConfigured}
            />
            <label htmlFor="showConfigured" className="text-sm font-medium text-foreground">
              Configured only
            </label>
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleSelectAll}>
              Select All Visible
            </Button>
            <Button variant="outline" size="sm" onClick={handleDeselectAll}>
              Deselect All
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Quick select by region:</span>
            {[...new Set(filteredPlatforms?.map(p => p.region))]?.slice(0, 3)?.map(region => (
              <Button
                key={region}
                variant="outline"
                size="sm"
                onClick={() => handleSelectByRegion(region)}
              >
                {getCountryFlag(region)} {region?.split(' ')?.[0]}
              </Button>
            ))}
          </div>
        </div>
      </div>
      {/* Platform Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlatforms?.map((platform) => {
          const isSelected = selectedPlatforms?.includes(platform?.id);
          
          return (
            <div
              key={platform?.id}
              className={`bg-card border rounded-lg p-4 transition-all cursor-pointer hover:elevation-2 ${
                isSelected 
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20' :'border-border hover:border-primary/50'
              }`}
              onClick={() => handlePlatformToggle(platform?.id)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="text-xl">
                    {getCountryFlag(platform?.region)}
                  </div>
                  <Checkbox
                    checked={isSelected}
                    onChange={() => handlePlatformToggle(platform?.id)}
                    onClick={(e) => e?.stopPropagation()}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  {platform?.itSpecific === true && (
                    <div className="w-2 h-2 bg-primary rounded-full" title="IT-specific platform"></div>
                  )}
                  {platform?.requiresAuth && (
                    <Icon name="Lock" size={12} className="text-warning" title="Authentication required" />
                  )}
                </div>
              </div>
              {/* Content */}
              <div className="space-y-2">
                <h4 className="font-medium text-foreground text-sm leading-tight">
                  {platform?.name}
                </h4>
                
                <div className="text-xs text-muted-foreground">
                  {platform?.url}
                </div>

                <div className="text-xs text-muted-foreground">
                  {platform?.region}
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-1">
                  {platform?.categories?.slice(0, 2)?.map((category, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-1 text-xs bg-muted text-muted-foreground rounded"
                    >
                      {category}
                    </span>
                  ))}
                  {platform?.categories?.length > 2 && (
                    <span className="inline-block px-2 py-1 text-xs bg-muted text-muted-foreground rounded">
                      +{platform?.categories?.length - 2}
                    </span>
                  )}
                </div>

                {/* Status */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${
                      getPlatformStatusColor(platform) === 'text-success' ? 'bg-success' :
                      getPlatformStatusColor(platform) === 'text-warning'? 'bg-warning' : 'bg-muted-foreground'
                    }`}></div>
                    <span className={`text-xs ${getPlatformStatusColor(platform)}`}>
                      {getPlatformStatusText(platform)}
                    </span>
                  </div>

                  {platform?.scraperConfig?.rateLimit && (
                    <span className="text-xs text-muted-foreground">
                      {platform?.scraperConfig?.rateLimit}ms
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Selection Summary */}
      {selectedPlatforms?.length > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground mb-1">
                {selectedPlatforms?.length} Platform{selectedPlatforms?.length > 1 ? 's' : ''} Selected
              </h4>
              <div className="text-sm text-muted-foreground">
                Ready to start scraping from selected platforms
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="text-right text-sm">
                <div className="text-muted-foreground">Estimated time:</div>
                <div className="font-medium text-foreground">
                  {Math.ceil(selectedPlatforms?.length * 2.5)} minutes
                </div>
              </div>
              <Icon name="Clock" size={16} className="text-primary" />
            </div>
          </div>
        </div>
      )}
      {/* Empty State */}
      {filteredPlatforms?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No platforms found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search criteria or filters
          </p>
          <Button variant="outline" onClick={() => {
            setSearchTerm('');
            setRegionFilter('');
            setAuthFilter('');
            setShowConfigured(false);
          }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default PlatformSelector;