import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import SearchFilters from './components/SearchFilters';
import TenderTable from './components/TenderTable';
import TenderDetailPanel from './components/TenderDetailPanel';
import SavedSearches from './components/SavedSearches';
import QuickStats from './components/QuickStats';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const TenderDatabase = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedTenders, setSelectedTenders] = useState([]);
  const [selectedTender, setSelectedTender] = useState(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [showSavedSearches, setShowSavedSearches] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [tenders, setTenders] = useState([]);

  // Mock tender data
  const mockTenders = [
    {
      id: 1,
      title: "Cloud Infrastructure Modernization for Federal Ministry",
      description: `The Federal Ministry of Digital Affairs requires comprehensive cloud infrastructure modernization including migration of legacy systems, implementation of hybrid cloud architecture, and establishment of DevOps practices.\n\nKey requirements include:\n- Migration of 50+ applications to cloud-native architecture\n- Implementation of Kubernetes orchestration\n- Security compliance with BSI standards\n- 24/7 monitoring and support services`,
      organization: "Bundesministerium für Digitales",
      country: "Germany",
      publishedDate: "2025-01-04T08:30:00Z",
      deadline: "2025-02-15T23:59:00Z",
      estimatedValue: 2400000,
      category: "IT",
      platform: "service.bund.de",
      platformStatus: "active",
      aiConfidence: 0.94,
      isNew: true,
      isBookmarked: false,
      tenderId: "BUND-2025-IT-001",
      cpvCode: "72000000-5",
      duration: "36 months",
      contactPerson: "Dr. Andreas Mueller",
      contactEmail: "procurement@bmi.bund.de",
      contactPhone: "+49 30 18681-0"
    },
    {
      id: 2,
      title: "Enterprise Software Development Platform",
      description: `Development and implementation of a comprehensive enterprise software platform for public administration digitalization.\n\nScope includes:\n- Custom web application development\n- API integration and microservices architecture\n- User management and authentication systems\n- Mobile application development\n- Training and documentation`,
      organization: "Stadt München",
      country: "Germany",
      publishedDate: "2025-01-03T14:15:00Z",
      deadline: "2025-02-28T17:00:00Z",
      estimatedValue: 1850000,
      category: "SOFTWARE",
      platform: "evergabe-online.de",
      platformStatus: "active",
      aiConfidence: 0.89,
      isNew: false,
      isBookmarked: true,
      tenderId: "MUC-2025-SW-047",
      cpvCode: "72212000-7",
      duration: "24 months"
    },
    {
      id: 3,
      title: "Cybersecurity Assessment and Implementation Services",
      description: `Comprehensive cybersecurity assessment and implementation of security measures for critical infrastructure.\n\nServices required:\n- Security audit and vulnerability assessment\n- Implementation of SIEM solutions\n- Incident response planning\n- Staff training and awareness programs\n- Ongoing security monitoring`,
      organization: "Landesregierung Baden-Württemberg",
      country: "Germany",
      publishedDate: "2025-01-02T10:45:00Z",
      deadline: "2025-01-25T12:00:00Z",
      estimatedValue: 950000,
      category: "SECURITY",
      platform: "dtvp.de",
      platformStatus: "active",
      aiConfidence: 0.91,
      isNew: false,
      isBookmarked: false,
      tenderId: "BW-2025-SEC-023",
      cpvCode: "72611000-6",
      duration: "18 months"
    },
    {
      id: 4,
      title: "Digital Transformation Consulting Services",
      description: `Strategic consulting services for digital transformation initiative across multiple government departments.\n\nConsulting areas:\n- Digital strategy development\n- Process optimization and automation\n- Change management support\n- Technology roadmap planning\n- Performance measurement frameworks`,
      organization: "Österreichische Bundesregierung",
      country: "Austria",
      publishedDate: "2025-01-01T16:20:00Z",
      deadline: "2025-03-15T15:30:00Z",
      estimatedValue: 1200000,
      category: "CONSULTING",
      platform: "TED",
      platformStatus: "active",
      aiConfidence: 0.76,
      isNew: false,
      isBookmarked: true,
      tenderId: "AT-2025-CONS-089",
      cpvCode: "72224000-1",
      duration: "30 months"
    },
    {
      id: 5,
      title: "Network Infrastructure Upgrade and Maintenance",
      description: `Comprehensive network infrastructure upgrade including hardware replacement, security enhancements, and ongoing maintenance services.\n\nProject scope:\n- Replacement of legacy network equipment\n- Implementation of SD-WAN solutions\n- Network security hardening\n- 24/7 monitoring and support\n- Disaster recovery planning`,
      organization: "Schweizerische Eidgenossenschaft",
      country: "Switzerland",
      publishedDate: "2024-12-30T11:10:00Z",
      deadline: "2025-02-10T16:45:00Z",
      estimatedValue: 3200000,
      category: "HARDWARE",
      platform: "TED",
      platformStatus: "active",
      aiConfidence: 0.82,
      isNew: false,
      isBookmarked: false,
      tenderId: "CH-2025-NET-156",
      cpvCode: "32412000-9",
      duration: "48 months"
    },
    {
      id: 6,
      title: "AI-Powered Document Management System",
      description: `Development and implementation of an AI-powered document management system with automated classification and workflow capabilities.\n\nKey features:\n- Intelligent document classification\n- Automated workflow routing\n- OCR and text extraction\n- Integration with existing systems\n- User training and support`,
      organization: "Ministère de la Transformation Numérique",
      country: "France",
      publishedDate: "2024-12-28T09:30:00Z",
      deadline: "2025-01-20T14:00:00Z",
      estimatedValue: 1650000,
      category: "IT",
      platform: "TED",
      platformStatus: "active",
      aiConfidence: 0.96,
      isNew: false,
      isBookmarked: false,
      tenderId: "FR-2025-AI-034",
      cpvCode: "72000000-5",
      duration: "24 months"
    }
  ];

  useEffect(() => {
    setTenders(mockTenders);
  }, []);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = (searchFilters) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Filter tenders based on search criteria
      let filteredTenders = [...mockTenders];
      
      if (searchFilters?.keyword) {
        filteredTenders = filteredTenders?.filter(tender =>
          tender?.title?.toLowerCase()?.includes(searchFilters?.keyword?.toLowerCase()) ||
          tender?.description?.toLowerCase()?.includes(searchFilters?.keyword?.toLowerCase()) ||
          tender?.organization?.toLowerCase()?.includes(searchFilters?.keyword?.toLowerCase())
        );
      }
      
      if (searchFilters?.countries && searchFilters?.countries?.length > 0) {
        filteredTenders = filteredTenders?.filter(tender =>
          searchFilters?.countries?.some(country => 
            tender?.country?.toLowerCase()?.includes(country?.toLowerCase())
          )
        );
      }
      
      if (searchFilters?.categories && searchFilters?.categories?.length > 0) {
        filteredTenders = filteredTenders?.filter(tender =>
          searchFilters?.categories?.includes(tender?.category)
        );
      }
      
      if (searchFilters?.status && searchFilters?.status !== 'all') {
        if (searchFilters?.status === 'new') {
          filteredTenders = filteredTenders?.filter(tender => tender?.isNew);
        } else if (searchFilters?.status === 'bookmarked') {
          filteredTenders = filteredTenders?.filter(tender => tender?.isBookmarked);
        } else if (searchFilters?.status === 'closing_soon') {
          filteredTenders = filteredTenders?.filter(tender => {
            const deadline = new Date(tender.deadline);
            const now = new Date();
            const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
            return diffDays <= 7 && diffDays >= 0;
          });
        }
      }
      
      setTenders(filteredTenders);
      setIsLoading(false);
    }, 1000);
  };

  const handleTenderSelect = (tender) => {
    setSelectedTender(tender);
    setShowDetailPanel(true);
  };

  const handleBulkAction = (action, tenderIds) => {
    switch (action) {
      case 'selectAll':
        setSelectedTenders(tenderIds);
        break;
      case 'deselectAll':
        setSelectedTenders([]);
        break;
      case 'select':
        setSelectedTenders(tenderIds);
        break;
      case 'deselect':
        setSelectedTenders(tenderIds);
        break;
      case 'bookmark':
        setTenders(prev => prev?.map(tender => 
          tenderIds?.includes(tender?.id) 
            ? { ...tender, isBookmarked: !tender?.isBookmarked }
            : tender
        ));
        break;
      case 'export':
        console.log('Exporting tenders:', tenderIds);
        break;
      case 'categorize': console.log('Categorizing tenders:', tenderIds);
        break;
      default:
        break;
    }
  };

  const handleLoadSearch = (search) => {
    setFilters(search?.filters);
    handleSearch(search?.filters);
    setShowSavedSearches(false);
  };

  const handleDeleteSearch = (searchId) => {
    console.log('Deleting search:', searchId);
  };

  const handleBookmark = (tenderId) => {
    setTenders(prev => prev?.map(tender => 
      tender?.id === tenderId 
        ? { ...tender, isBookmarked: !tender?.isBookmarked }
        : tender
    ));
    
    if (selectedTender && selectedTender?.id === tenderId) {
      setSelectedTender(prev => ({ ...prev, isBookmarked: !prev?.isBookmarked }));
    }
  };

  const handleExport = (tenderId) => {
    console.log('Exporting tender:', tenderId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuToggle={handleMenuToggle} isMenuOpen={isMenuOpen} />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-semibold text-foreground">Tender Database</h1>
                <p className="text-muted-foreground mt-1">
                  Search and manage tender opportunities across European procurement platforms
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowSavedSearches(!showSavedSearches)}
                  iconName="Save"
                  iconPosition="left"
                >
                  Saved Searches
                </Button>
                <Button
                  variant="default"
                  iconName="RefreshCw"
                  iconPosition="left"
                  onClick={() => handleSearch(filters)}
                  loading={isLoading}
                >
                  Refresh Data
                </Button>
              </div>
            </div>
            
            {/* Quick Stats */}
            <QuickStats isLoading={false} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className={`lg:col-span-1 space-y-6 ${showSavedSearches ? 'block' : 'hidden lg:block'}`}>
              <SavedSearches 
                onLoadSearch={handleLoadSearch}
                onDeleteSearch={handleDeleteSearch}
              />
            </div>

            {/* Main Content */}
            <div className={`${showSavedSearches ? 'lg:col-span-3' : 'lg:col-span-4'} space-y-6`}>
              {/* Search Filters */}
              <SearchFilters
                onFiltersChange={handleFiltersChange}
                onSearch={handleSearch}
                isLoading={isLoading}
              />

              {/* Results Summary */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <p className="text-sm text-muted-foreground">
                    {isLoading ? 'Searching...' : `${tenders?.length} tenders found`}
                  </p>
                  {selectedTenders?.length > 0 && (
                    <p className="text-sm text-primary">
                      {selectedTenders?.length} selected
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Filter"
                    iconPosition="left"
                  >
                    Advanced Filters
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="ArrowUpDown"
                    iconPosition="left"
                  >
                    Sort
                  </Button>
                </div>
              </div>

              {/* Tender Table */}
              <TenderTable
                tenders={tenders}
                onTenderSelect={handleTenderSelect}
                selectedTenders={selectedTenders}
                onBulkAction={handleBulkAction}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </main>
      {/* Tender Detail Panel */}
      <TenderDetailPanel
        tender={selectedTender}
        isOpen={showDetailPanel}
        onClose={() => setShowDetailPanel(false)}
        onBookmark={handleBookmark}
        onExport={handleExport}
      />
      {/* Real-time Update Notification */}
      <div className="fixed bottom-4 right-4 z-40">
        <div className="bg-success text-success-foreground px-4 py-2 rounded-lg elevation-2 flex items-center space-x-2 opacity-0 animate-fade-in">
          <Icon name="CheckCircle" size={16} />
          <span className="text-sm">3 new tenders found</span>
          <Button variant="ghost" size="sm" className="text-success-foreground hover:bg-success/20">
            View
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TenderDatabase;