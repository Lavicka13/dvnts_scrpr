import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import SystemMonitoring from './pages/system-monitoring';
import TenderDatabase from './pages/tender-database';
import PlatformManagement from './pages/platform-management';
import Dashboard from './pages/dashboard';
import ScraperManagement from './pages/scraper-management';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/system-monitoring" element={<SystemMonitoring />} />
        <Route path="/tender-database" element={<TenderDatabase />} />
        <Route path="/platform-management" element={<PlatformManagement />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/scraper-management" element={<ScraperManagement />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;