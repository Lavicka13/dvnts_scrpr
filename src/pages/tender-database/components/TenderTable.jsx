import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const TenderTable = ({ tenders, onTenderSelect, selectedTenders, onBulkAction, isLoading }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'publishedDate', direction: 'desc' });
  const [selectAll, setSelectAll] = useState(false);

  const sortedTenders = useMemo(() => {
    if (!tenders || tenders?.length === 0) return [];
    
    return [...tenders]?.sort((a, b) => {
      const aValue = a?.[sortConfig?.key];
      const bValue = b?.[sortConfig?.key];
      
      if (sortConfig?.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });
  }, [tenders, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked) {
      onBulkAction('selectAll', tenders?.map(t => t?.id));
    } else {
      onBulkAction('deselectAll', []);
    }
  };

  const handleTenderCheck = (tenderId, checked) => {
    if (checked) {
      onBulkAction('select', [...selectedTenders, tenderId]);
    } else {
      onBulkAction('deselect', selectedTenders?.filter(id => id !== tenderId));
      setSelectAll(false);
    }
  };

  const formatCurrency = (value) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString)?.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getDaysUntilDeadline = (deadline) => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDeadlineStatus = (deadline) => {
    const days = getDaysUntilDeadline(deadline);
    if (days === null) return { color: 'text-muted-foreground', text: 'No deadline' };
    if (days < 0) return { color: 'text-error', text: 'Expired' };
    if (days === 0) return { color: 'text-error', text: 'Today' };
    if (days <= 3) return { color: 'text-warning', text: `${days} days` };
    if (days <= 7) return { color: 'text-accent', text: `${days} days` };
    return { color: 'text-success', text: `${days} days` };
  };

  const getCategoryBadge = (category, aiConfidence) => {
    const isIT = category === 'IT' || category === 'SOFTWARE' || category === 'HARDWARE';
    return (
      <div className="flex items-center space-x-2">
        <span className={`px-2 py-1 text-xs rounded-full ${
          isIT ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
        }`}>
          {category}
        </span>
        {isIT && aiConfidence && (
          <div className="flex items-center space-x-1">
            <Icon name="Brain" size={12} className="text-primary" />
            <span className="text-xs text-primary">{Math.round(aiConfidence * 100)}%</span>
          </div>
        )}
      </div>
    );
  };

  const SortableHeader = ({ label, sortKey, className = "" }) => (
    <th className={`px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-quick ${className}`}
        onClick={() => handleSort(sortKey)}>
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        <div className="flex flex-col">
          <Icon 
            name="ChevronUp" 
            size={12} 
            className={`${sortConfig?.key === sortKey && sortConfig?.direction === 'asc' ? 'text-primary' : 'text-muted-foreground/50'}`}
          />
          <Icon 
            name="ChevronDown" 
            size={12} 
            className={`-mt-1 ${sortConfig?.key === sortKey && sortConfig?.direction === 'desc' ? 'text-primary' : 'text-muted-foreground/50'}`}
          />
        </div>
      </div>
    </th>
  );

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading tender data...</p>
        </div>
      </div>
    );
  }

  if (!tenders || tenders?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-8 text-center">
          <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No tenders found</h3>
          <p className="text-muted-foreground">Try adjusting your search criteria or filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden elevation-1">
      {/* Bulk Actions Bar */}
      {selectedTenders?.length > 0 && (
        <div className="bg-primary/5 border-b border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">
              {selectedTenders?.length} tender{selectedTenders?.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                iconName="Bookmark"
                iconPosition="left"
                onClick={() => onBulkAction('bookmark', selectedTenders)}
              >
                Bookmark
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="Download"
                iconPosition="left"
                onClick={() => onBulkAction('export', selectedTenders)}
              >
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="Tag"
                iconPosition="left"
                onClick={() => onBulkAction('categorize', selectedTenders)}
              >
                Categorize
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/30">
            <tr>
              <th className="px-4 py-3 w-12">
                <Checkbox
                  checked={selectAll}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                />
              </th>
              <SortableHeader label="Title" sortKey="title" className="min-w-[300px]" />
              <SortableHeader label="Organization" sortKey="organization" />
              <SortableHeader label="Published" sortKey="publishedDate" />
              <SortableHeader label="Deadline" sortKey="deadline" />
              <SortableHeader label="Value" sortKey="estimatedValue" />
              <SortableHeader label="Category" sortKey="category" />
              <SortableHeader label="Platform" sortKey="platform" />
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {sortedTenders?.map((tender) => {
              const deadlineStatus = getDeadlineStatus(tender?.deadline);
              const isSelected = selectedTenders?.includes(tender?.id);
              
              return (
                <tr 
                  key={tender?.id}
                  className={`hover:bg-muted/30 transition-quick cursor-pointer ${
                    isSelected ? 'bg-primary/5' : ''
                  } ${tender?.isNew ? 'bg-accent/5' : ''}`}
                  onClick={() => onTenderSelect(tender)}
                >
                  <td className="px-4 py-4">
                    <Checkbox
                      checked={isSelected}
                      onChange={(e) => {
                        e?.stopPropagation();
                        handleTenderCheck(tender?.id, e?.target?.checked);
                      }}
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-foreground truncate">
                            {tender?.title}
                          </p>
                          {tender?.isNew && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-accent text-accent-foreground">
                              New
                            </span>
                          )}
                          {tender?.isBookmarked && (
                            <Icon name="Bookmark" size={14} className="text-warning" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {tender?.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-foreground">{tender?.organization}</div>
                    <div className="text-xs text-muted-foreground">{tender?.country}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-foreground">{formatDate(tender?.publishedDate)}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className={`text-sm font-medium ${deadlineStatus?.color}`}>
                      {formatDate(tender?.deadline)}
                    </div>
                    <div className={`text-xs ${deadlineStatus?.color}`}>
                      {deadlineStatus?.text}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-foreground">
                      {formatCurrency(tender?.estimatedValue)}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {getCategoryBadge(tender?.category, tender?.aiConfidence)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-foreground">{tender?.platform}</span>
                      <div className={`w-2 h-2 rounded-full ${
                        tender?.platformStatus === 'active' ? 'bg-success' : 'bg-error'
                      }`}></div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e?.stopPropagation();
                          onTenderSelect(tender);
                        }}
                      >
                        <Icon name="Eye" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e?.stopPropagation();
                          onBulkAction('bookmark', [tender?.id]);
                        }}
                      >
                        <Icon 
                          name={tender?.isBookmarked ? "Bookmark" : "BookmarkPlus"} 
                          size={16}
                          className={tender?.isBookmarked ? "text-warning" : ""}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e?.stopPropagation();
                          onBulkAction('export', [tender?.id]);
                        }}
                      >
                        <Icon name="Download" size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TenderTable;