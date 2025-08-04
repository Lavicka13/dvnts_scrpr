import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const SearchFilters = ({ onFiltersChange, onSearch, isLoading }) => {
  const [filters, setFilters] = useState({
    keyword: '',
    dateFrom: '',
    dateTo: '',
    minValue: '',
    maxValue: '',
    countries: [],
    categories: [],
    platforms: [],
    status: 'all'
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const countryOptions = [
    { value: 'DE', label: 'Germany' },
    { value: 'AT', label: 'Austria' },
    { value: 'CH', label: 'Switzerland' },
    { value: 'FR', label: 'France' },
    { value: 'NL', label: 'Netherlands' },
    { value: 'BE', label: 'Belgium' },
    { value: 'IT', label: 'Italy' },
    { value: 'ES', label: 'Spain' }
  ];

  const categoryOptions = [
    { value: 'IT', label: 'Information Technology' },
    { value: 'SOFTWARE', label: 'Software Development' },
    { value: 'HARDWARE', label: 'Hardware & Equipment' },
    { value: 'CONSULTING', label: 'IT Consulting' },
    { value: 'SECURITY', label: 'Cybersecurity' },
    { value: 'CLOUD', label: 'Cloud Services' },
    { value: 'TELECOM', label: 'Telecommunications' },
    { value: 'OTHER', label: 'Other Services' }
  ];

  const platformOptions = [
    { value: 'TED', label: 'TED Europa' },
    { value: 'BUND', label: 'service.bund.de' },
    { value: 'EVERGABE', label: 'evergabe-online.de' },
    { value: 'DTVP', label: 'dtvp.de' },
    { value: 'AUSSCHREIBUNG', label: 'ausschreibung.de' },
    { value: 'VERGABE24', label: 'vergabe24.de' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Tenders' },
    { value: 'open', label: 'Open for Bidding' },
    { value: 'closing_soon', label: 'Closing Soon (7 days)' },
    { value: 'new', label: 'New (24 hours)' },
    { value: 'bookmarked', label: 'Bookmarked' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      keyword: '',
      dateFrom: '',
      dateTo: '',
      minValue: '',
      maxValue: '',
      countries: [],
      categories: [],
      platforms: [],
      status: 'all'
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters)?.some(value => 
    Array.isArray(value) ? value?.length > 0 : value !== '' && value !== 'all'
  );

  return (
    <div className="bg-card border border-border rounded-lg p-6 elevation-1">
      {/* Main Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search tenders by title, description, or organization..."
            value={filters?.keyword}
            onChange={(e) => handleFilterChange('keyword', e?.target?.value)}
            className="text-base"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="default"
            onClick={handleSearch}
            loading={isLoading}
            iconName="Search"
            iconPosition="left"
            className="px-6"
          >
            Search
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            iconName={showAdvanced ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
          >
            Advanced
          </Button>
        </div>
      </div>
      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="border-t border-border pt-6 space-y-6">
          {/* Date Range and Value Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              type="date"
              label="Published From"
              value={filters?.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e?.target?.value)}
            />
            <Input
              type="date"
              label="Published To"
              value={filters?.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e?.target?.value)}
            />
            <Input
              type="number"
              label="Min Value (EUR)"
              placeholder="0"
              value={filters?.minValue}
              onChange={(e) => handleFilterChange('minValue', e?.target?.value)}
            />
            <Input
              type="number"
              label="Max Value (EUR)"
              placeholder="1000000"
              value={filters?.maxValue}
              onChange={(e) => handleFilterChange('maxValue', e?.target?.value)}
            />
          </div>

          {/* Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select
              label="Countries"
              options={countryOptions}
              value={filters?.countries}
              onChange={(value) => handleFilterChange('countries', value)}
              multiple
              searchable
              placeholder="Select countries..."
            />
            <Select
              label="Categories"
              options={categoryOptions}
              value={filters?.categories}
              onChange={(value) => handleFilterChange('categories', value)}
              multiple
              searchable
              placeholder="Select categories..."
            />
            <Select
              label="Platforms"
              options={platformOptions}
              value={filters?.platforms}
              onChange={(value) => handleFilterChange('platforms', value)}
              multiple
              searchable
              placeholder="Select platforms..."
            />
            <Select
              label="Status"
              options={statusOptions}
              value={filters?.status}
              onChange={(value) => handleFilterChange('status', value)}
              placeholder="Select status..."
            />
          </div>

          {/* Filter Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center space-x-4">
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  iconName="X"
                  iconPosition="left"
                  className="text-muted-foreground"
                >
                  Clear Filters
                </Button>
              )}
              <span className="text-sm text-muted-foreground">
                {hasActiveFilters ? 'Filters applied' : 'No filters applied'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                iconName="Save"
                iconPosition="left"
                disabled={!hasActiveFilters}
              >
                Save Search
              </Button>
              <Button
                variant="outline"
                iconName="Download"
                iconPosition="left"
              >
                Export Results
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;