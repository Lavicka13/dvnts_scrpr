import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TenderDetailPanel = ({ tender, isOpen, onClose, onBookmark, onExport }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !tender) return null;

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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
    if (days === null) return { color: 'text-muted-foreground', text: 'No deadline', bgColor: 'bg-muted' };
    if (days < 0) return { color: 'text-error', text: 'Expired', bgColor: 'bg-error/10' };
    if (days === 0) return { color: 'text-error', text: 'Expires Today', bgColor: 'bg-error/10' };
    if (days <= 3) return { color: 'text-warning', text: `${days} days left`, bgColor: 'bg-warning/10' };
    if (days <= 7) return { color: 'text-accent', text: `${days} days left`, bgColor: 'bg-accent/10' };
    return { color: 'text-success', text: `${days} days left`, bgColor: 'bg-success/10' };
  };

  const deadlineStatus = getDeadlineStatus(tender?.deadline);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'FileText' },
    { id: 'documents', label: 'Documents', icon: 'Paperclip' },
    { id: 'timeline', label: 'Timeline', icon: 'Clock' },
    { id: 'analysis', label: 'AI Analysis', icon: 'Brain' }
  ];

  const mockDocuments = [
    { id: 1, name: 'Tender Specification.pdf', size: '2.4 MB', type: 'PDF', uploadDate: '2025-01-03' },
    { id: 2, name: 'Technical Requirements.docx', size: '856 KB', type: 'DOCX', uploadDate: '2025-01-03' },
    { id: 3, name: 'Contract Terms.pdf', size: '1.2 MB', type: 'PDF', uploadDate: '2025-01-02' },
    { id: 4, name: 'Bidding Guidelines.pdf', size: '945 KB', type: 'PDF', uploadDate: '2025-01-02' }
  ];

  const mockTimeline = [
    { date: '2025-01-15', event: 'Tender Published', status: 'completed', description: 'Initial tender announcement published on platform' },
    { date: '2025-01-20', event: 'Information Session', status: 'upcoming', description: 'Virtual information session for potential bidders' },
    { date: '2025-02-01', event: 'Questions Deadline', status: 'upcoming', description: 'Last date for submitting clarification questions' },
    { date: '2025-02-15', event: 'Bid Submission Deadline', status: 'upcoming', description: 'Final deadline for bid submissions' },
    { date: '2025-03-01', event: 'Award Decision', status: 'upcoming', description: 'Expected date for contract award announcement' }
  ];

  return (
    <div className="fixed inset-y-0 right-0 w-full lg:w-2/3 xl:w-1/2 bg-surface border-l border-border elevation-3 z-50 overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-card">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-foreground">Tender Details</h2>
            {tender?.isNew && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-accent text-accent-foreground">
                <Icon name="Sparkles" size={12} className="mr-1" />
                New
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBookmark(tender?.id)}
              iconName={tender?.isBookmarked ? "Bookmark" : "BookmarkPlus"}
              iconPosition="left"
              className={tender?.isBookmarked ? "text-warning border-warning" : ""}
            >
              {tender?.isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExport(tender?.id)}
              iconName="Download"
              iconPosition="left"
            >
              Export
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        {/* Tender Header Info */}
        <div className="p-6 border-b border-border bg-muted/20">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-foreground mb-2">{tender?.title}</h3>
            <p className="text-sm text-muted-foreground">{tender?.organization} • {tender?.country}</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Estimated Value</p>
              <p className="text-sm font-medium text-foreground">{formatCurrency(tender?.estimatedValue)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Published</p>
              <p className="text-sm font-medium text-foreground">{formatDate(tender?.publishedDate)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Deadline</p>
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${deadlineStatus?.bgColor} ${deadlineStatus?.color}`}>
                <Icon name="Clock" size={12} className="mr-1" />
                {deadlineStatus?.text}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Platform</p>
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium text-foreground">{tender?.platform}</p>
                <div className={`w-2 h-2 rounded-full ${
                  tender?.platformStatus === 'active' ? 'bg-success' : 'bg-error'
                }`}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border bg-card">
          <nav className="flex space-x-8 px-6">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 py-4 text-sm font-medium border-b-2 transition-quick ${
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

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">Description</h4>
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  <p>{tender?.description}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">Key Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Category</p>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        tender?.category === 'IT' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                      }`}>
                        {tender?.category}
                      </span>
                      {tender?.aiConfidence && (
                        <div className="flex items-center space-x-1">
                          <Icon name="Brain" size={12} className="text-primary" />
                          <span className="text-xs text-primary">{Math.round(tender?.aiConfidence * 100)}% confidence</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Tender ID</p>
                    <p className="text-sm font-mono text-foreground">{tender?.tenderId || 'TED-2025-001234'}</p>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">CPV Code</p>
                    <p className="text-sm font-mono text-foreground">{tender?.cpvCode || '72000000-5'}</p>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Contract Duration</p>
                    <p className="text-sm text-foreground">{tender?.duration || '24 months'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">Contact Information</h4>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="space-y-2">
                    <p className="text-sm text-foreground font-medium">{tender?.contactPerson || 'Dr. Maria Schmidt'}</p>
                    <p className="text-sm text-muted-foreground">{tender?.contactEmail || 'procurement@organization.de'}</p>
                    <p className="text-sm text-muted-foreground">{tender?.contactPhone || '+49 30 12345678'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-foreground">Tender Documents</h4>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Download"
                  iconPosition="left"
                >
                  Download All
                </Button>
              </div>
              <div className="space-y-3">
                {mockDocuments?.map((doc) => (
                  <div key={doc?.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-quick">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon name="FileText" size={20} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{doc?.name}</p>
                        <p className="text-xs text-muted-foreground">{doc?.size} • {doc?.type} • {formatDate(doc?.uploadDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon">
                        <Icon name="Eye" size={16} />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Icon name="Download" size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-foreground">Tender Timeline</h4>
              <div className="space-y-4">
                {mockTimeline?.map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className={`w-3 h-3 rounded-full mt-2 ${
                      item?.status === 'completed' ? 'bg-success' : 
                      item?.status === 'upcoming' ? 'bg-primary' : 'bg-muted-foreground'
                    }`}></div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-foreground">{item?.event}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(item?.date)}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{item?.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">AI-Powered Analysis</h4>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Icon name="Brain" size={20} className="text-primary" />
                    <span className="text-sm font-medium text-primary">IT Relevance Score: {Math.round((tender?.aiConfidence || 0.85) * 100)}%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This tender has been automatically categorized as highly relevant for IT services based on keywords, 
                    requirements analysis, and historical bidding patterns. The AI system identified strong matches for 
                    software development, cloud infrastructure, and digital transformation requirements.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">Key Insights</h4>
                <div className="space-y-3">
                  <div className="bg-success/5 border border-success/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name="TrendingUp" size={16} className="text-success" />
                      <span className="text-sm font-medium text-success">High Match Probability</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Based on your company profile and past successful bids, this tender shows 78% compatibility.
                    </p>
                  </div>
                  
                  <div className="bg-warning/5 border border-warning/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name="AlertTriangle" size={16} className="text-warning" />
                      <span className="text-sm font-medium text-warning">Competitive Landscape</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Medium competition expected. Similar tenders typically receive 8-12 bids from qualified vendors.
                    </p>
                  </div>

                  <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name="Target" size={16} className="text-accent" />
                      <span className="text-sm font-medium text-accent">Recommended Action</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Consider submitting a bid. The requirements align well with your capabilities and the timeline is feasible.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">Similar Tenders</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm font-medium text-foreground">Digital Infrastructure Modernization</p>
                    <p className="text-xs text-muted-foreground">Won • €2.4M • 2024</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm font-medium text-foreground">Cloud Migration Services</p>
                    <p className="text-xs text-muted-foreground">Bid Submitted • €1.8M • 2024</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TenderDetailPanel;