import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const PlatformMap = () => {
  const [platforms] = useState([
    { id: 1, name: 'TED Europa', country: 'EU', status: 'active', x: 50, y: 30, tenders: 1247 },
    { id: 2, name: 'service.bund.de', country: 'DE', status: 'active', x: 52, y: 35, tenders: 89 },
    { id: 3, name: 'evergabe-online.de', country: 'DE', status: 'warning', x: 54, y: 37, tenders: 156 },
    { id: 4, name: 'dtvp.de', country: 'DE', status: 'active', x: 48, y: 39, tenders: 67 },
    { id: 5, name: 'Vergabe24', country: 'AT', status: 'active', x: 58, y: 42, tenders: 34 },
    { id: 6, name: 'simap.ch', country: 'CH', status: 'error', x: 45, y: 45, tenders: 23 },
    { id: 7, name: 'mercell.com', country: 'NO', status: 'active', x: 55, y: 15, tenders: 78 },
    { id: 8, name: 'hankinnat.fi', country: 'FI', status: 'active', x: 65, y: 12, tenders: 45 },
    { id: 9, name: 'upphandling.se', country: 'SE', status: 'warning', x: 60, y: 18, tenders: 92 },
    { id: 10, name: 'udbud.dk', country: 'DK', status: 'active', x: 52, y: 22, tenders: 56 }
  ]);

  const [selectedPlatform, setSelectedPlatform] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-success';
      case 'warning':
        return 'bg-warning';
      case 'error':
        return 'bg-error';
      default:
        return 'bg-muted-foreground';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'warning':
        return 'Warning';
      case 'error':
        return 'Error';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 elevation-1">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">European Platform Status</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span className="text-sm text-muted-foreground">Active</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning rounded-full"></div>
            <span className="text-sm text-muted-foreground">Warning</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-error rounded-full"></div>
            <span className="text-sm text-muted-foreground">Error</span>
          </div>
        </div>
      </div>
      <div className="relative">
        {/* Simplified Europe Map Background */}
        <div className="w-full h-80 bg-muted/20 rounded-lg relative overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            {/* Simplified Europe outline */}
            <path
              d="M20,80 L25,75 L30,70 L35,65 L40,60 L45,55 L50,50 L55,45 L60,40 L65,35 L70,30 L75,25 L80,20 L85,25 L90,30 L85,35 L80,40 L75,45 L70,50 L65,55 L60,60 L55,65 L50,70 L45,75 L40,80 L35,85 L30,80 L25,85 L20,80 Z"
              fill="var(--color-muted)"
              stroke="var(--color-border)"
              strokeWidth="0.5"
              opacity="0.3"
            />
          </svg>

          {/* Platform Markers */}
          {platforms?.map((platform) => (
            <div
              key={platform?.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{ left: `${platform?.x}%`, top: `${platform?.y}%` }}
              onClick={() => setSelectedPlatform(platform)}
            >
              <div className={`w-4 h-4 rounded-full ${getStatusColor(platform?.status)} animate-pulse-gentle shadow-lg`}></div>
              <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-popover border border-border rounded px-2 py-1 text-xs whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity z-10">
                {platform?.name}
              </div>
            </div>
          ))}
        </div>

        {/* Platform Details Panel */}
        {selectedPlatform && (
          <div className="absolute top-4 right-4 bg-popover border border-border rounded-lg p-4 shadow-lg min-w-64 z-20">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-foreground">{selectedPlatform?.name}</h4>
              <button
                onClick={() => setSelectedPlatform(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Icon name="X" size={16} />
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status:</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedPlatform?.status)}`}></div>
                  <span className="text-sm font-medium">{getStatusText(selectedPlatform?.status)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Country:</span>
                <span className="text-sm font-medium">{selectedPlatform?.country}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Tenders:</span>
                <span className="text-sm font-medium">{selectedPlatform?.tenders?.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-border">
                <button className="w-full text-sm text-primary hover:text-primary/80 font-medium">
                  View Details
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Platform Summary */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-semibold text-success">{platforms?.filter(p => p?.status === 'active')?.length}</div>
          <div className="text-sm text-muted-foreground">Active</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-semibold text-warning">{platforms?.filter(p => p?.status === 'warning')?.length}</div>
          <div className="text-sm text-muted-foreground">Warning</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-semibold text-error">{platforms?.filter(p => p?.status === 'error')?.length}</div>
          <div className="text-sm text-muted-foreground">Error</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-semibold text-foreground">{platforms?.reduce((sum, p) => sum + p?.tenders, 0)?.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Total Tenders</div>
        </div>
      </div>
    </div>
  );
};

export default PlatformMap;