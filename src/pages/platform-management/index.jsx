import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import PlatformStats from './components/PlatformStats';
import PlatformFilters from './components/PlatformFilters';
import PlatformTable from './components/PlatformTable';
import PlatformConfigPanel from './components/PlatformConfigPanel';
import AddPlatformModal from './components/AddPlatformModal';

const PlatformManagement = () => {
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    country: '',
    status: '',
    type: ''
  });

  // Mock platform data
  const [platforms, setPlatforms] = useState([
    {
      id: 1,
      name: "TED Europa",
      url: "https://ted.europa.eu",
      country: "eu",
      flag: "🇪🇺",
      type: "eu",
      status: "active",
      lastScrape: new Date(Date.now() - 15 * 60 * 1000),
      nextScrape: new Date(Date.now() + 45 * 60 * 1000),
      successRate: 0.98,
      configured: true,
      enabled: true,
      authType: "none",
      scrapeInterval: 60,
      rateLimit: 10,
      maxRetries: 3,
      timeout: 30,
      categories: ["IT Services", "Construction", "Healthcare"],
      tendersScraped: 15420
    },
    {
      id: 2,
      name: "service.bund.de",
      url: "https://service.bund.de",
      country: "germany",
      flag: "🇩🇪",
      type: "national",
      status: "active",
      lastScrape: new Date(Date.now() - 8 * 60 * 1000),
      nextScrape: new Date(Date.now() + 52 * 60 * 1000),
      successRate: 0.95,
      configured: true,
      enabled: true,
      authType: "basic",
      username: "scraper_user",
      password: "secure_pass123",
      scrapeInterval: 60,
      rateLimit: 8,
      maxRetries: 3,
      timeout: 45,
      categories: ["IT Services", "Consulting", "Security"],
      tendersScraped: 8750
    },
    {
      id: 3,
      name: "evergabe-online.de",
      url: "https://evergabe-online.de",
      country: "germany",
      flag: "🇩🇪",
      type: "national",
      status: "error",
      lastScrape: new Date(Date.now() - 2 * 60 * 60 * 1000),
      nextScrape: new Date(Date.now() + 30 * 60 * 1000),
      successRate: 0.72,
      configured: true,
      enabled: true,
      authType: "form",
      username: "platform_bot",
      password: "bot_password456",
      scrapeInterval: 90,
      rateLimit: 5,
      maxRetries: 5,
      timeout: 60,
      categories: ["Construction", "Transportation", "Energy"],
      tendersScraped: 6230
    },
    {
      id: 4,
      name: "dtvp.de",
      url: "https://dtvp.de",
      country: "germany",
      flag: "🇩🇪",
      type: "regional",
      status: "maintenance",
      lastScrape: new Date(Date.now() - 4 * 60 * 60 * 1000),
      nextScrape: new Date(Date.now() + 2 * 60 * 60 * 1000),
      successRate: 0.88,
      configured: false,
      enabled: false,
      authType: "none",
      scrapeInterval: 120,
      rateLimit: 6,
      maxRetries: 3,
      timeout: 30,
      categories: ["Education", "Healthcare"],
      tendersScraped: 3450
    },
    {
      id: 5,
      name: "BOAMP France",
      url: "https://boamp.fr",
      country: "france",
      flag: "🇫🇷",
      type: "national",
      status: "active",
      lastScrape: new Date(Date.now() - 25 * 60 * 1000),
      nextScrape: new Date(Date.now() + 35 * 60 * 1000),
      successRate: 0.91,
      configured: true,
      enabled: true,
      authType: "api_key",
      apiKey: "fr_api_key_789",
      scrapeInterval: 60,
      rateLimit: 12,
      maxRetries: 3,
      timeout: 40,
      categories: ["IT Services", "Telecommunications", "Consulting"],
      tendersScraped: 7890
    },
    {
      id: 6,
      name: "Austria eVergabe",
      url: "https://evergabe.gv.at",
      country: "austria",
      flag: "🇦🇹",
      type: "national",
      status: "active",
      lastScrape: new Date(Date.now() - 12 * 60 * 1000),
      nextScrape: new Date(Date.now() + 48 * 60 * 1000),
      successRate: 0.94,
      configured: true,
      enabled: true,
      authType: "basic",
      username: "at_scraper",
      password: "austria_pass321",
      scrapeInterval: 60,
      rateLimit: 8,
      maxRetries: 3,
      timeout: 35,
      categories: ["Construction", "Energy", "Transportation"],
      tendersScraped: 4560
    },
    {
      id: 7,
      name: "Swiss Procurement",
      url: "https://simap.ch",
      country: "switzerland",
      flag: "🇨🇭",
      type: "national",
      status: "inactive",
      lastScrape: new Date(Date.now() - 6 * 60 * 60 * 1000),
      nextScrape: new Date(Date.now() + 4 * 60 * 60 * 1000),
      successRate: 0.85,
      configured: true,
      enabled: false,
      authType: "none",
      scrapeInterval: 180,
      rateLimit: 4,
      maxRetries: 2,
      timeout: 25,
      categories: ["Healthcare", "Education", "IT Services"],
      tendersScraped: 2340
    },
    {
      id: 8,
      name: "Netherlands TenderNed",
      url: "https://tenderned.nl",
      country: "netherlands",
      flag: "🇳🇱",
      type: "national",
      status: "active",
      lastScrape: new Date(Date.now() - 18 * 60 * 1000),
      nextScrape: new Date(Date.now() + 42 * 60 * 1000),
      successRate: 0.96,
      configured: true,
      enabled: true,
      authType: "oauth",
      scrapeInterval: 60,
      rateLimit: 15,
      maxRetries: 3,
      timeout: 30,
      categories: ["IT Services", "Maintenance", "Security"],
      tendersScraped: 5670
    }
  ]);

  // Filter platforms based on current filters
  const filteredPlatforms = platforms?.filter(platform => {
    const matchesSearch = !filters?.search || 
      platform?.name?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
      platform?.url?.toLowerCase()?.includes(filters?.search?.toLowerCase());
    
    const matchesCountry = !filters?.country || platform?.country === filters?.country;
    const matchesStatus = !filters?.status || platform?.status === filters?.status;
    const matchesType = !filters?.type || platform?.type === filters?.type;

    return matchesSearch && matchesCountry && matchesStatus && matchesType;
  });

  // Auto-select first platform on load
  useEffect(() => {
    if (filteredPlatforms?.length > 0 && !selectedPlatform) {
      setSelectedPlatform(filteredPlatforms?.[0]);
    }
  }, [filteredPlatforms, selectedPlatform]);

  const handleSelectPlatform = (platform) => {
    setSelectedPlatform(platform);
  };

  const handleEditPlatform = (platform) => {
    setSelectedPlatform(platform);
    // Could open edit modal or navigate to edit view
  };

  const handleTestConnection = (platform) => {
    console.log('Testing connection for:', platform?.name);
    // Test connection logic would go here
  };

  const handleViewLogs = (platform) => {
    console.log('Viewing logs for:', platform?.name);
    // Navigate to logs view
  };

  const handleAddPlatform = () => {
    setShowAddModal(true);
  };

  const handleSavePlatform = (platformData) => {
    const newPlatform = {
      ...platformData,
      id: platforms?.length + 1,
      status: 'inactive',
      lastScrape: new Date(),
      nextScrape: new Date(Date.now() + platformData.scrapeInterval * 60 * 1000),
      successRate: 0,
      tendersScraped: 0,
      flag: getCountryFlag(platformData?.country)
    };
    
    setPlatforms(prev => [...prev, newPlatform]);
    setShowAddModal(false);
  };

  const handleSaveConfig = (config) => {
    setPlatforms(prev => 
      prev?.map(p => 
        p?.id === selectedPlatform?.id 
          ? { ...p, ...config, configured: true }
          : p
      )
    );
    setSelectedPlatform(prev => ({ ...prev, ...config, configured: true }));
  };

  const handleBulkAction = (action, selectedIds) => {
    console.log('Bulk action:', action, 'for platforms:', selectedIds);
    // Bulk action logic would go here
  };

  const getCountryFlag = (country) => {
    const flags = {
      germany: '🇩🇪',
      france: '🇫🇷',
      austria: '🇦🇹',
      switzerland: '🇨🇭',
      netherlands: '🇳🇱',
      belgium: '🇧🇪',
      italy: '🇮🇹',
      spain: '🇪🇸',
      eu: '🇪🇺'
    };
    return flags?.[country] || '🌍';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
        isMenuOpen={isMenuOpen}
      />
      <main className="pt-16">
        <div className="max-w-[1920px] mx-auto p-6">
          {/* Stats */}
          <PlatformStats platforms={platforms} />

          {/* Filters */}
          <PlatformFilters
            filters={filters}
            onFiltersChange={setFilters}
            onAddPlatform={handleAddPlatform}
            onBulkAction={handleBulkAction}
            selectedPlatforms={selectedPlatforms}
            totalPlatforms={platforms?.length}
          />

          {/* Main Content */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Platform Table */}
            <div className="xl:col-span-2">
              <PlatformTable
                platforms={filteredPlatforms}
                onSelectPlatform={handleSelectPlatform}
                selectedPlatform={selectedPlatform}
                onEditPlatform={handleEditPlatform}
                onTestConnection={handleTestConnection}
                onViewLogs={handleViewLogs}
              />
            </div>

            {/* Configuration Panel */}
            <div className="xl:col-span-1">
              <div className="sticky top-24">
                <PlatformConfigPanel
                  platform={selectedPlatform}
                  onSave={handleSaveConfig}
                  onClose={() => setSelectedPlatform(null)}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Add Platform Modal */}
      <AddPlatformModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSavePlatform}
      />
    </div>
  );
};

export default PlatformManagement;