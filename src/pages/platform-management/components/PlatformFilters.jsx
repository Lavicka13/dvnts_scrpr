import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const PlatformFilters = ({ 
  filters, 
  onFiltersChange, 
  onAddPlatform, 
  onBulkAction,
  selectedPlatforms,
  totalPlatforms 
}) => {
  const countryOptions = [
    { value: '', label: 'All Countries' },
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

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'error', label: 'Error' },
    { value: 'maintenance', label: 'Maintenance' }
  ];

  const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'national', label: 'National Platform' },
    { value: 'regional', label: 'Regional Platform' },
    { value: 'municipal', label: 'Municipal Platform' },
    { value: 'eu', label: 'EU-wide Platform' }
  ];

  const bulkActionOptions = [
    { value: '', label: 'Bulk Actions' },
    { value: 'activate', label: 'Activate Selected' },
    { value: 'deactivate', label: 'Deactivate Selected' },
    { value: 'test', label: 'Test Connections' },
    { value: 'export', label: 'Export Configuration' },
    { value: 'delete', label: 'Delete Selected' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleBulkActionChange = (action) => {
    if (action && selectedPlatforms?.length > 0) {
      onBulkAction(action, selectedPlatforms);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 elevation-1 mb-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Platform Management</h2>
          <p className="text-sm text-muted-foreground">
            Manage and monitor {totalPlatforms} European procurement platforms
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Button
            variant="outline"
            iconName="Download"
            iconPosition="left"
            onClick={() => onBulkAction('export-all')}
          >
            Export All
          </Button>
          <Button
            variant="default"
            iconName="Plus"
            iconPosition="left"
            onClick={onAddPlatform}
          >
            Add Platform
          </Button>
        </div>
      </div>
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-4">
        {/* Search */}
        <div className="md:col-span-2">
          <Input
            type="search"
            placeholder="Search platforms..."
            value={filters?.search}
            onChange={(e) => handleFilterChange('search', e?.target?.value)}
            className="w-full"
          />
        </div>

        {/* Country Filter */}
        <Select
          options={countryOptions}
          value={filters?.country}
          onChange={(value) => handleFilterChange('country', value)}
          placeholder="Filter by country"
        />

        {/* Status Filter */}
        <Select
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => handleFilterChange('status', value)}
          placeholder="Filter by status"
        />

        {/* Type Filter */}
        <Select
          options={typeOptions}
          value={filters?.type}
          onChange={(value) => handleFilterChange('type', value)}
          placeholder="Filter by type"
        />

        {/* Bulk Actions */}
        <Select
          options={bulkActionOptions}
          value=""
          onChange={handleBulkActionChange}
          placeholder="Bulk actions"
          disabled={selectedPlatforms?.length === 0}
        />
      </div>
      {/* Active Filters & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-0">
          {filters?.search && (
            <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
              <Icon name="Search" size={14} />
              <span>"{filters?.search}"</span>
              <button
                onClick={() => handleFilterChange('search', '')}
                className="hover:bg-primary/20 rounded-full p-0.5 transition-quick"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          )}
          {filters?.country && (
            <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
              <Icon name="MapPin" size={14} />
              <span>{countryOptions?.find(c => c?.value === filters?.country)?.label}</span>
              <button
                onClick={() => handleFilterChange('country', '')}
                className="hover:bg-primary/20 rounded-full p-0.5 transition-quick"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          )}
          {filters?.status && (
            <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
              <Icon name="Activity" size={14} />
              <span className="capitalize">{filters?.status}</span>
              <button
                onClick={() => handleFilterChange('status', '')}
                className="hover:bg-primary/20 rounded-full p-0.5 transition-quick"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          )}
          {filters?.type && (
            <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
              <Icon name="Tag" size={14} />
              <span className="capitalize">{filters?.type}</span>
              <button
                onClick={() => handleFilterChange('type', '')}
                className="hover:bg-primary/20 rounded-full p-0.5 transition-quick"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          )}
          {(filters?.search || filters?.country || filters?.status || filters?.type) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFiltersChange({ search: '', country: '', status: '', type: '' })}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear all
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          {selectedPlatforms?.length > 0 && (
            <span className="text-primary font-medium">
              {selectedPlatforms?.length} selected
            </span>
          )}
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span>18 Active</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-error rounded-full"></div>
            <span>2 Issues</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-warning rounded-full"></div>
            <span>2 Maintenance</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformFilters;