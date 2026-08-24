/* 
  Developed by Surprise-MFs Tech 
  App Component for Temitope Initiative
*/
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import Home from './pages/Home';
import Surprise from './pages/Surprise';
import Maintenance from './pages/Maintenance';
import GalleryPage from './pages/Gallery';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { fetchSiteSettings, fetchMaintenanceSettings } from './lib/dataService';

function AppContent() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [maintenance, setMaintenance] = useState<{ isUnderMaintenance: boolean, estimatedEndTime?: string } | null>(null);
  const [siteSettings, setSiteSettings] = useState<{ 
    name: string, 
    logoUrl: string,
    emails?: string[],
    phones?: string[],
    addresses?: string[],
    socials?: { platform: string, url: string, enabled: boolean }[]
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAppConfig() {
      try {
        const [maint, site] = await Promise.all([
          fetchMaintenanceSettings(),
          fetchSiteSettings()
        ]);
        setMaintenance(maint || { isUnderMaintenance: false });
        setSiteSettings(site || {
          name: 'Temitope Initiative',
          logoUrl: 'https://res.cloudinary.com/dfujzs9ml/image/upload/v1774493285/temitope_initiative/t653vvukb9rj1q1zdh0y.png'
        });
      } catch (err) {
        console.error("Config load error", err);
      } finally {
        setLoading(false);
      }
    }
    loadAppConfig();
  }, []);

  useEffect(() => {
    if (siteSettings?.name) {
      document.title = siteSettings.name;
    }
  }, [siteSettings?.name]);

  // Global protection for images and videos
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' || target.tagName === 'VIDEO') {
        e.preventDefault();
      }
    };

    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' || target.tagName === 'VIDEO') {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-soft-smoke">
        <div className="w-12 h-12 border-4 border-royal-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If under maintenance and user is NOT an admin, show maintenance page
  // EXCEPT if they are trying to access the /surprise (admin) route
  const isSurpriseRoute = window.location.pathname === '/surprise';
  
  if (maintenance?.isUnderMaintenance && !isAdmin && !isSurpriseRoute) {
    return <Maintenance estimatedEndTime={maintenance.estimatedEndTime} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-soft-smoke flex flex-col font-sans text-gray-900">
        <Navbar siteSettings={siteSettings} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/surprise" element={<Surprise />} />
            {/* Redirect old admin path to surprise */}
            <Route path="/admin" element={<Navigate to="/surprise" replace />} />
          </Routes>
        </main>
        <Footer siteSettings={siteSettings} />
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}
