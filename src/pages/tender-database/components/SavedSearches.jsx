import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SavedSearches = ({ onLoadSearch, onDeleteSearch }) => {
  const [savedSearches] = useState([
    {
      id: 1,
      name: 'IT Software Tenders Germany',
      filters: {
        keyword: 'software development',
        countries: ['DE'],
        categories: ['IT', 'SOFTWARE'],
        minValue: 50000
      },
      resultCount: 234,
      lastRun: '2025-01-04T10:30:00Z',
      isActive: true
    },
    {
      id: 2,
      name: 'Cloud Services DACH Region',
      filters: {
        keyword: 'cloud infrastructure',
        countries: ['DE', 'AT', 'CH'],
        categories: ['CLOUD', 'IT'],
        status: 'open'
      },
      resultCount: 89,
      lastRun: '2025-01-04T08:15:00Z',
      isActive: true
    },
    {
      id: 3,
      name: 'High Value IT Consulting',
      filters: {
        categories: ['CONSULTING', 'IT'],
        minValue: 100000,
        status: 'open'
      },
      resultCount: 45,
      lastRun: '2025-01-03T16:45:00Z',
      isActive: false
    },
    {
      id: 4,
      name: 'Cybersecurity Tenders',
      filters: {
        keyword: 'cybersecurity security',
        categories: ['SECURITY', 'IT'],
        status: 'closing_soon'
      },
      resultCount: 67,
      lastRun: '2025-01-04T07:20:00Z',
      isActive: true
    }
  ]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date?.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getFilterSummary = (filters) => {
    const parts = [];
    
    if (filters?.keyword) {
      parts?.push(`"${filters?.keyword}"`);
    }
    
    if (filters?.countries && filters?.countries?.length > 0) {
      parts?.push(`${filters?.countries?.join(', ')}`);
    }
    
    if (filters?.categories && filters?.categories?.length > 0) {
      parts?.push(`${filters?.categories?.join(', ')}`);
    }
    
    if (filters?.minValue) {
      parts?.push(`≥€${filters?.minValue?.toLocaleString('de-DE')}`);
    }
    
    if (filters?.status && filters?.status !== 'all') {
      parts?.push(filters?.status?.replace('_', ' '));
    }
    
    return parts?.join(' • ');
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden elevation-1">
      <div className="p-4 border-b border-border bg-muted/20">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-foreground">Saved Searches</h3>
          <Button
            variant="outline"
            size="sm"
            iconName="Plus"
            iconPosition="left"
          >
            New Search
          </Button>
        </div>
      </div>
      <div className="divide-y divide-border">
        {savedSearches?.map((search) => (
          <div key={search?.id} className="p-4 hover:bg-muted/30 transition-quick">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-sm font-medium text-foreground truncate">
                    {search?.name}
                  </h4>
                  <div className={`w-2 h-2 rounded-full ${
                    search?.isActive ? 'bg-success' : 'bg-muted-foreground'
                  }`}></div>
                  {search?.isActive && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-success/10 text-success">
                      Active
                    </span>
                  )}
                </div>
                
                <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                  {getFilterSummary(search?.filters)}
                </p>
                
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Icon name="Search" size={12} />
                    <span>{search?.resultCount} results</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Clock" size={12} />
                    <span>Updated {formatDate(search?.lastRun)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onLoadSearch(search)}
                  className="h-8 w-8"
                >
                  <Icon name="Play" size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <Icon name="Edit" size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteSearch(search?.id)}
                  className="h-8 w-8 text-error hover:text-error"
                >
                  <Icon name="Trash2" size={14} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-border bg-muted/10">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{savedSearches?.length} saved searches</span>
          <Button
            variant="ghost"
            size="sm"
            iconName="Settings"
            iconPosition="left"
            className="text-xs"
          >
            Manage
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SavedSearches;