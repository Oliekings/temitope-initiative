/* 
  Developed by Surprise-MFs Tech 
  Admin Portal for Temitope Initiative
*/
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { LogOut, Plus, Trash2, Edit2, Image as ImageIcon, Users, Calendar, Mail, Settings, AlertTriangle, Upload, X, Loader2, Link as LinkIcon, Facebook, Instagram, Twitter, Linkedin, Phone, MapPin, Building2, Copy, Check, Lock } from 'lucide-react';
import { 
  fetchEvents, createEvent, updateEvent, deleteEvent,
  fetchTeam, createTeamMember, updateTeamMember, deleteTeamMember,
  fetchGallery, createGalleryImages, deleteGalleryImage,
  fetchSiteSettings, saveSiteSettings,
  fetchMaintenanceSettings, saveMaintenanceSettings,
  fetchAdminCreds, saveAdminCreds,
  fetchSubscribers
} from '../lib/dataService';

export default function Surprise() {
  const { user, isAdmin, adminPassword, loading, loginWithPassword, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'events' | 'team' | 'gallery' | 'subscribers' | 'settings'>('events');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    const success = await loginWithPassword(username, password);
    setLoginLoading(false);
    if (!success) {
      alert("Invalid username or password.");
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center pt-20">Loading...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-soft-smoke pt-20 px-4">
        <div className="bg-white p-10 md:p-12 rounded-3xl shadow-xl max-w-md w-full text-center border border-gray-100">
          <img 
            src="https://res.cloudinary.com/dfujzs9ml/image/upload/v1774493285/temitope_initiative/t653vvukb9rj1q1zdh0y.png" 
            alt="Logo" 
            className="w-16 h-16 mx-auto mb-6 object-contain"
          />
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Admin Command Center</h1>
          <p className="text-gray-500 text-sm mb-8">Sign in to manage events, team bios, gallery, and site settings.</p>

          <form onSubmit={handlePasswordLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Username</label>
              <input 
                type="text" 
                placeholder="Admin username" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-royal-blue outline-none transition-all font-medium text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Password</label>
              <input 
                type="password" 
                placeholder="Admin password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-royal-blue outline-none transition-all font-medium text-sm"
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loginLoading}
              className="w-full py-4 bg-royal-blue text-white rounded-2xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
            >
              {loginLoading ? <Loader2 className="animate-spin" size={18} /> : <Lock size={18} />}
              {loginLoading ? 'Signing In...' : 'Unlock Admin Portal'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soft-smoke pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">Command Center</h1>
            <p className="text-gray-600">Welcome back, {user?.displayName || user?.email || 'Admin'}</p>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-2 py-2 px-5 bg-white border border-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-colors shadow-sm"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-2">
              <TabButton 
                active={activeTab === 'events'} 
                onClick={() => setActiveTab('events')} 
                icon={<Calendar size={20} />} 
                label="Event Manager" 
              />
              <TabButton 
                active={activeTab === 'team'} 
                onClick={() => setActiveTab('team')} 
                icon={<Users size={20} />} 
                label="Bio Editor" 
              />
              <TabButton 
                active={activeTab === 'gallery'} 
                onClick={() => setActiveTab('gallery')} 
                icon={<ImageIcon size={20} />} 
                label="Gallery" 
              />
              <TabButton 
                active={activeTab === 'subscribers'} 
                onClick={() => setActiveTab('subscribers')} 
                icon={<Mail size={20} />} 
                label="Subscribers CRM" 
              />
              <TabButton 
                active={activeTab === 'settings'} 
                onClick={() => setActiveTab('settings')} 
                icon={<Settings size={20} />} 
                label="Site Settings" 
              />
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-grow bg-white rounded-3xl shadow-sm p-8 min-h-[600px]">
            {activeTab === 'events' && <EventsManager />}
            {activeTab === 'team' && <TeamManager />}
            {activeTab === 'gallery' && <GalleryManager />}
            {activeTab === 'subscribers' && <SubscriberCRM />}
            {activeTab === 'settings' && <SettingsManager />}
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsManager() {
  const { adminPassword } = useAuth();
  const [maintenance, setMaintenance] = useState({ isUnderMaintenance: false, estimatedEndTime: '' });
  const [siteSettings, setSiteSettings] = useState({ 
    name: '', 
    logoUrl: '',
    emails: [] as string[],
    phones: [] as string[],
    addresses: [] as string[],
    socials: [] as { platform: string, url: string, enabled: boolean }[]
  });
  const [adminCreds, setAdminCreds] = useState({ username: '', password: '' });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAllSettings() {
      try {
        const [maint, site, admin] = await Promise.all([
          fetchMaintenanceSettings(),
          fetchSiteSettings(),
          fetchAdminCreds()
        ]);
        if (maint) {
          setMaintenance({
            isUnderMaintenance: maint.isUnderMaintenance || false,
            estimatedEndTime: maint.estimatedEndTime || ''
          });
        }
        if (site) {
          setSiteSettings({
            name: site.name || 'Temitope Initiative',
            logoUrl: site.logoUrl || 'https://res.cloudinary.com/dfujzs9ml/image/upload/v1774493285/temitope_initiative/t653vvukb9rj1q1zdh0y.png',
            emails: site.emails || ['contact@temitopessdi.org'],
            phones: site.phones || [],
            addresses: site.addresses || [],
            socials: site.socials || [
              { platform: 'Facebook', url: '', enabled: false },
              { platform: 'Instagram', url: '', enabled: false },
              { platform: 'Twitter', url: '', enabled: false },
              { platform: 'LinkedIn', url: '', enabled: false },
            ]
          });
        }
        if (admin) setAdminCreds(admin);
      } catch (err) {
        console.error("Error loading settings", err);
      } finally {
        setLoading(false);
      }
    }
    loadAllSettings();
  }, []);

  const handleSaveMaintenance = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveMaintenanceSettings(maintenance);
      alert("Maintenance settings updated!");
    } catch (error: any) {
      alert("Error saving maintenance: " + (error.message || ""));
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSite = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveSiteSettings(siteSettings);
      alert("Site configuration updated!");
    } catch (error: any) {
      alert("Error saving site configuration: " + (error.message || ""));
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveAdminCreds(adminCreds);
      alert("Admin credentials updated!");
    } catch (error: any) {
      alert("Error saving admin credentials: " + (error.message || ""));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="py-20 text-center"><Loader2 className="mx-auto animate-spin text-royal-blue" size={32} /></div>;

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-gray-100">
        <h2 className="text-3xl font-serif font-bold text-gray-900">Site Configuration</h2>
        <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 text-royal-blue rounded-full text-sm font-bold">
          <Settings size={16} />
          Settings Manager v2.0
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        <div className="space-y-10">
          {/* Site Branding & Global Info */}
          <form onSubmit={handleSaveSite} className="space-y-8 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <LinkIcon size={22} className="text-royal-blue" />
              Branding & Identity
            </h3>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Organization Name</label>
                <input 
                  type="text" 
                  value={siteSettings.name}
                  onChange={e => setSiteSettings({ ...siteSettings, name: e.target.value })}
                  className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-royal-blue transition-all outline-none font-medium"
                />
              </div>
              <FileUploader 
                label="Primary Logo" 
                currentUrl={siteSettings.logoUrl} 
                onUpload={(url) => setSiteSettings({ ...siteSettings, logoUrl: url })} 
              />
            </div>

            <div className="pt-4 border-t border-gray-50">
              <h4 className="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Phone size={16} className="text-royal-blue" />
                Contact Channels
              </h4>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Contact Emails</label>
                  <DynamicList 
                    items={siteSettings.emails} 
                    onChange={items => setSiteSettings({...siteSettings, emails: items})} 
                    placeholder="contact@temitopessdi.org"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Phone Numbers</label>
                  <DynamicList 
                    items={siteSettings.phones} 
                    onChange={items => setSiteSettings({...siteSettings, phones: items})} 
                    placeholder="+234 ..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Office Addresses</label>
                  <DynamicList 
                    items={siteSettings.addresses} 
                    onChange={items => setSiteSettings({...siteSettings, addresses: items})} 
                    placeholder="Office location..."
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={saving}
              className="w-full py-4 bg-royal-blue text-white rounded-2xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Update Identity & Contacts'}
            </button>
          </form>

          {/* Official Bank / Donation Accounts */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <Building2 size={22} className="text-royal-blue" />
              Official Donation Bank Accounts
            </h3>
            <p className="text-xs text-gray-500">
              These verified accounts are displayed on the public site and in the donation modal.
            </p>

            <div className="space-y-4">
              {/* NGN Account */}
              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-royal-blue text-white rounded-full text-xs font-bold">NGN Account (Naira)</span>
                  <span className="text-xs font-bold text-gray-500">Zenith Bank</span>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase">Account Number</label>
                  <p className="font-mono font-bold text-lg text-royal-blue">1311816265</p>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase">Account Name</label>
                  <p className="text-xs font-semibold text-gray-800">TEMITOPE SOCIETAL SUSTAINABILITY AND DEVELOPMENT INITIATIVE (TSSDI)</p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 pt-2 border-t border-gray-200">
                  <div>
                    <span className="block text-[10px] text-gray-400 font-bold uppercase">SWIFT</span>
                    <span className="font-mono font-medium">ZEIBNGLA</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-400 font-bold uppercase">SORT CODE</span>
                    <span className="font-mono font-medium">057080277</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-400 font-bold uppercase">BRANCH</span>
                    <span className="font-medium text-[11px]">KEBBI HOUSE</span>
                  </div>
                </div>
              </div>

              {/* USD Account */}
              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-green-700 text-white rounded-full text-xs font-bold">USD Account (Dom)</span>
                  <span className="text-xs font-bold text-gray-500">Zenith Bank</span>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase">Account Number</label>
                  <p className="font-mono font-bold text-lg text-royal-blue">5075911468</p>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase">Account Name</label>
                  <p className="text-xs font-semibold text-gray-800">TEMITOPE SOCIETAL SUSTAINABILITY AND DEVELOPMENT INITIATIVE (TSSDI)</p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 pt-2 border-t border-gray-200">
                  <div>
                    <span className="block text-[10px] text-gray-400 font-bold uppercase">SWIFT</span>
                    <span className="font-mono font-medium">ZEIBNGLA</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-400 font-bold uppercase">SORT CODE</span>
                    <span className="font-mono font-medium">057080277</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-400 font-bold uppercase">BRANCH</span>
                    <span className="font-medium text-[11px]">KEBBI HOUSE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <LinkIcon size={22} className="text-royal-blue" />
              Social Presence
            </h3>
            <div className="grid grid-cols-1 gap-4 mb-8">
              {siteSettings.socials.map((social, idx) => (
                <div key={social.platform} className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4 group">
                  <div className="flex items-center gap-3 flex-grow">
                    <input 
                      type="checkbox" 
                      checked={social.enabled} 
                      onChange={e => {
                        const next = [...siteSettings.socials];
                        next[idx].enabled = e.target.checked;
                        setSiteSettings({...siteSettings, socials: next});
                      }}
                      className="w-5 h-5 rounded text-royal-blue border-gray-300 focus:ring-royal-blue"
                    />
                    <div className="flex-grow">
                      <span className="block text-xs font-bold text-gray-700">{social.platform}</span>
                      <input 
                        type="text" 
                        value={social.url} 
                        placeholder={`${social.platform} link`}
                        disabled={!social.enabled}
                        onChange={e => {
                          const next = [...siteSettings.socials];
                          next[idx].url = e.target.value;
                          setSiteSettings({...siteSettings, socials: next});
                        }}
                        className="w-full text-sm py-1 bg-transparent border-b border-gray-200 focus:border-royal-blue outline-none disabled:opacity-30"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={handleSaveSite}
              disabled={saving}
              className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-lg disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Social Links'}
            </button>
          </div>
        </div>

        <div className="space-y-10">
          {/* Admin Credentials */}
          <form onSubmit={handleSaveAdmin} className="space-y-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <Users size={22} className="text-royal-blue" />
              Access Security
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Admin Username</label>
                <input 
                  type="text" 
                  value={adminCreds.username}
                  onChange={e => setAdminCreds({ ...adminCreds, username: e.target.value })}
                  className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-royal-blue transition-all outline-none font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Current Password</label>
                <input 
                  type="text" 
                  value={adminCreds.password}
                  onChange={e => setAdminCreds({ ...adminCreds, password: e.target.value })}
                  className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-royal-blue transition-all outline-none font-medium"
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={saving}
              className="w-full py-4 bg-royal-blue text-white rounded-2xl font-bold hover:bg-blue-800 transition-all shadow-lg disabled:opacity-50"
            >
              Update Credentials
            </button>
          </form>

          {/* Maintenance Mode */}
          <form onSubmit={handleSaveMaintenance} className="space-y-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${maintenance.isUnderMaintenance ? 'bg-vibrant-red text-white shadow-lg shadow-red-100' : 'bg-gray-100 text-gray-400'}`}>
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Maintenance Mode</h3>
                  <p className="text-xs text-gray-500">Lock the site for all public visitors.</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={maintenance.isUnderMaintenance}
                  onChange={e => setMaintenance({ ...maintenance, isUnderMaintenance: e.target.checked })}
                />
                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-vibrant-red"></div>
              </label>
            </div>

            {maintenance.isUnderMaintenance && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4 pt-4 border-t border-gray-50"
              >
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Expected Completion Time</label>
                  <input 
                    type="datetime-local" 
                    value={maintenance.estimatedEndTime}
                    onChange={e => setMaintenance({ ...maintenance, estimatedEndTime: e.target.value })}
                    className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-vibrant-red transition-all outline-none font-medium"
                  />
                </div>
              </motion.div>
            )}
            <button 
              type="submit" 
              disabled={saving}
              className="w-full py-4 bg-vibrant-red text-white rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100 disabled:opacity-50"
            >
              Update Maintenance Status
            </button>
          </form>
        </div>

        {/* Database Backup & Restore Card */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3 text-royal-blue">
            <Copy size={24} />
            <h3 className="text-xl font-serif font-bold text-gray-900">Data Backup & Restore</h3>
          </div>
          <p className="text-sm text-gray-500">
            Download a 1-click full backup of all events, team members, gallery images, and settings, or restore from a previous JSON backup file.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a 
              href="/api/admin/export-database"
              download
              className="py-3 px-4 bg-royal-blue text-white rounded-2xl font-bold text-center hover:bg-blue-800 transition-all flex items-center justify-center gap-2 text-sm shadow-md"
            >
              <Copy size={16} /> Download Full Backup
            </a>
            <label className="py-3 px-4 bg-gray-50 border border-gray-200 text-gray-700 rounded-2xl font-bold text-center hover:bg-gray-100 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer">
              <Upload size={16} /> Restore from Backup
              <input 
                type="file" 
                accept=".json"
                className="sr-only" 
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    const text = await file.text();
                    const json = JSON.parse(text);
                    const res = await fetch('/api/admin/import-database', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(json)
                    });
                    if (res.ok) {
                      alert("Database successfully restored!");
                      window.location.reload();
                    } else {
                      alert("Failed to restore backup.");
                    }
                  } catch (err: any) {
                    alert("Error restoring backup: " + err.message);
                  }
                }}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full p-4 rounded-xl font-medium transition-all ${
        active 
          ? 'bg-royal-blue/10 text-royal-blue' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

/// --- Helper for File Upload ---
async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  const contentType = response.headers.get("content-type");
  if (!response.ok) {
    if (response.status === 413) {
      throw new Error(`File "${file.name}" is too large. Please select an image under 50MB.`);
    }
    if (contentType && contentType.includes("application/json")) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    } else {
      throw new Error(`Upload failed (${response.status}: ${response.statusText}).`);
    }
  }

  if (contentType && contentType.includes("application/json")) {
    const data = await response.json();
    return data.url;
  } else {
    throw new Error(`Server returned unexpected response format.`);
  }
}

// --- Helper for Multiple File Uploads with Batching to Prevent 413 Errors ---
async function uploadMultipleFiles(files: FileList | File[]): Promise<string[]> {
  const fileArray = Array.from(files);
  const results: string[] = [];

  // Upload in small concurrent batches (2 at a time) to prevent payload limits and timeouts
  const BATCH_SIZE = 2;
  for (let i = 0; i < fileArray.length; i += BATCH_SIZE) {
    const batch = fileArray.slice(i, i + BATCH_SIZE);
    const batchPromises = batch.map(file => uploadFile(file));
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }

  return results;
}

function FileUploader({ onUpload, currentUrl, label }: { onUpload: (url: string) => void, currentUrl?: string, label: string }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl || '');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadFile(file);
      setPreview(url);
      onUpload(url);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center gap-4">
        <div className="relative w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
          {preview ? (
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="text-gray-400" size={24} />
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <Loader2 className="text-white animate-spin" size={20} />
            </div>
          )}
        </div>
        <div className="flex-grow">
          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            <Upload size={16} />
            {uploading ? 'Uploading...' : 'Choose File'}
            <input type="file" className="hidden" onChange={handleFileChange} accept="image/*,video/*" disabled={uploading} />
          </label>
        </div>
      </div>
    </div>
  );
}

function MultiFileUploader({ onUpload, currentUrls, label }: { onUpload: (urls: string[]) => void, currentUrls?: string[], label: string }) {
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<string[]>(currentUrls || []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const newUrls = await uploadMultipleFiles(files);
      const combined = [...previews, ...newUrls];
      setPreviews(combined);
      onUpload(combined);
    } catch (error) {
      console.error("Bulk upload error:", error);
      alert("Failed to upload files. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removePreview = (indexToRemove: number) => {
    const next = previews.filter((_, idx) => idx !== indexToRemove);
    setPreviews(next);
    onUpload(next);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex flex-wrap gap-4 items-start">
        {previews.map((url, idx) => (
          <div key={idx} className="relative w-24 h-24 rounded-xl border border-gray-200 overflow-hidden bg-gray-50 group shadow-sm hover:shadow transition-shadow">
            <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
            <button 
              type="button" 
              onClick={(e) => { e.preventDefault(); removePreview(idx); }} 
              className="absolute top-1 right-1 bg-vibrant-red/90 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
        
        <label className={`relative w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer ${uploading ? 'opacity-70 pointer-events-none' : ''}`}>
          {uploading ? (
            <Loader2 className="text-royal-blue animate-spin" size={24} />
          ) : (
            <div className="text-center group inline-flex flex-col items-center">
              <Plus className="text-gray-400 group-hover:text-royal-blue transition-colors mb-1" size={24} />
              <span className="text-[10px] text-gray-400 group-hover:text-royal-blue font-medium uppercase tracking-wider">Select</span>
            </div>
          )}
          <input 
            type="file" 
            multiple 
            className="hidden" 
            onChange={handleFileChange} 
            accept="image/*,video/*" 
            disabled={uploading} 
          />
        </label>
      </div>
    </div>
  );
}

// --- Subcomponents for Admin ---

function EventsManager() {
  const { adminPassword } = useAuth();
  const effectivePassword = adminPassword || localStorage.getItem('admin_password') || 'Surprise';
  const [events, setEvents] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '', imageUrls: [] as string[], date: '' });

  const loadEvents = async () => {
    const list = await fetchEvents();
    setEvents(list);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrls || formData.imageUrls.length === 0) {
      alert("Please upload at least one image.");
      return;
    }
    try {
      if (editingId) {
        await updateEvent(editingId, {
          title: formData.title,
          description: formData.description,
          imageUrls: formData.imageUrls,
          date: formData.date,
          adminPassword: effectivePassword
        });
        alert("Event updated successfully!");
      } else {
        await createEvent({
          title: formData.title,
          description: formData.description,
          imageUrls: formData.imageUrls,
          date: formData.date,
          adminPassword: effectivePassword
        });
        alert("Event added successfully!");
      }
      setFormData({ title: '', description: '', imageUrls: [], date: '' });
      setIsAdding(false);
      setEditingId(null);
      await loadEvents();
    } catch (error: any) {
      console.error("Error saving event:", error);
      alert("Failed to save event: " + (error.message || "Unknown error"));
    }
  };

  const handleEdit = (evt: any) => {
    let dateStr = '';
    if (evt.date) {
      const d = evt.date.toDate ? evt.date.toDate() : new Date(evt.date);
      dateStr = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    }
    setFormData({
      title: evt.title,
      description: evt.description,
      imageUrls: evt.imageUrls || (evt.imageUrl ? [evt.imageUrl] : []),
      date: dateStr
    });
    setEditingId(evt.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(id);
        await loadEvents();
      } catch (error: any) {
        alert("Failed to delete event: " + (error.message || ""));
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-serif font-bold text-gray-900">Manage Events</h2>
        <button 
          onClick={() => {
            setIsAdding(!isAdding);
            if (isAdding) {
              setEditingId(null);
              setFormData({ title: '', description: '', imageUrls: [], date: '' });
            }
          }}
          className="flex items-center gap-2 px-4 py-2 bg-royal-blue text-white rounded-full text-sm font-semibold hover:bg-blue-800 transition-colors"
        >
          {isAdding ? 'Cancel' : <><Plus size={16} /> Add Event</>}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-12 bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
              <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none" placeholder="Annual Summit 2026" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Date</label>
              <input required type="datetime-local" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none" />
            </div>
            <div className="md:col-span-2">
              <MultiFileUploader 
                label="Event Images / Videos" 
                currentUrls={formData.imageUrls} 
                onUpload={(urls) => setFormData({...formData, imageUrls: urls})} 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none" placeholder="Event details..."></textarea>
            </div>
          </div>
          <button type="submit" className="px-6 py-3 bg-lime-green text-white rounded-full font-semibold hover:bg-green-600 transition-colors">
            {editingId ? 'Update Event' : 'Save Event & Notify Subscribers'}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {events.map(evt => (
          <div key={evt.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <img src={evt.imageUrls?.[0] || evt.imageUrl} alt={evt.title} className="w-16 h-16 rounded-lg object-cover" />
              <div>
                <h4 className="font-semibold text-gray-900">{evt.title}</h4>
                <p className="text-sm text-gray-500">{evt.date ? (evt.date.toDate ? new Date(evt.date.toDate()).toLocaleDateString() : new Date(evt.date).toLocaleDateString()) : 'No date'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => handleEdit(evt)} className="p-2 text-royal-blue hover:bg-blue-50 rounded-full transition-colors">
                <Edit2 size={18} />
              </button>
              <button onClick={() => handleDelete(evt.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        {events.length === 0 && <p className="text-gray-500 text-center py-8">No events found.</p>}
      </div>
    </div>
  );
}

function TeamManager() {
  const { adminPassword } = useAuth();
  const effectivePassword = adminPassword || localStorage.getItem('admin_password') || 'Surprise';
  const [team, setTeam] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', role: '', bio: '', imageUrl: '', isFounder: false, order: 0 });

  const loadTeam = async () => {
    const list = await fetchTeam();
    setTeam(list);
  };

  useEffect(() => {
    loadTeam();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateTeamMember(editingId, {
          name: formData.name,
          role: formData.role,
          bio: formData.bio,
          imageUrl: formData.imageUrl,
          isFounder: formData.isFounder,
          order: Number(formData.order),
          adminPassword: effectivePassword
        });
        alert("Profile updated successfully!");
      } else {
        await createTeamMember({
          name: formData.name,
          role: formData.role,
          bio: formData.bio,
          imageUrl: formData.imageUrl,
          isFounder: formData.isFounder,
          order: Number(formData.order),
          adminPassword: effectivePassword
        });
        alert("Profile added successfully!");
      }
      setFormData({ name: '', role: '', bio: '', imageUrl: '', isFounder: false, order: 0 });
      setIsAdding(false);
      setEditingId(null);
      await loadTeam();
    } catch (error: any) {
      console.error("Team save error:", error);
      alert("Failed to save team member: " + (error.message || ""));
    }
  };

  const handleEdit = (member: any) => {
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio,
      imageUrl: member.imageUrl,
      isFounder: member.isFounder,
      order: member.order
    });
    setEditingId(member.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this team member?')) {
      try {
        await deleteTeamMember(id);
        await loadTeam();
      } catch (error: any) {
        alert("Failed to delete member: " + (error.message || ""));
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-serif font-bold text-gray-900">Bio Editor</h2>
        <button 
          onClick={() => {
            setIsAdding(!isAdding);
            if (isAdding) {
              setEditingId(null);
              setFormData({ name: '', role: '', bio: '', imageUrl: '', isFounder: false, order: 0 });
            }
          }}
          className="flex items-center gap-2 px-4 py-2 bg-royal-blue text-white rounded-full text-sm font-semibold hover:bg-blue-800 transition-colors"
        >
          {isAdding ? 'Cancel' : <><Plus size={16} /> Add Member</>}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-12 bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-royal-blue outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role / Title</label>
              <input required type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-royal-blue outline-none" />
            </div>
            <div className="md:col-span-2">
              <FileUploader 
                label="Profile Image" 
                currentUrl={formData.imageUrl} 
                onUpload={(url) => setFormData({...formData, imageUrl: url})} 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Biography</label>
              <textarea required rows={5} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-royal-blue outline-none"></textarea>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                <input type="checkbox" checked={formData.isFounder} onChange={e => setFormData({...formData, isFounder: e.target.checked})} className="w-5 h-5 rounded text-royal-blue focus:ring-royal-blue" />
                Is Founder?
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Display Order (Lower = First)</label>
              <input required type="number" value={formData.order} onChange={e => setFormData({...formData, order: Number(e.target.value)})} className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-royal-blue outline-none" />
            </div>
          </div>
          <button type="submit" className="px-6 py-3 bg-lime-green text-white rounded-full font-semibold hover:bg-green-600 transition-colors">
            {editingId ? 'Update Profile' : 'Save Profile'}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {team.map(member => (
          <div key={member.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
            <div className="flex items-center gap-4">
              <img src={member.imageUrl} alt={member.name} className="w-12 h-12 rounded-full object-cover" />
              <div>
                <h4 className="font-semibold text-gray-900">{member.name}</h4>
                <p className="text-xs text-vibrant-red font-medium">{member.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => handleEdit(member)} className="p-2 text-royal-blue hover:bg-blue-50 rounded-full transition-colors">
                <Edit2 size={18} />
              </button>
              <button onClick={() => handleDelete(member.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GalleryManager() {
  const [images, setImages] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: '', imageUrls: [] as string[], description: '' });

  const loadGallery = async () => {
    const list = await fetchGallery();
    setImages(list);
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrls || formData.imageUrls.length === 0) {
      alert("Please upload at least one image.");
      return;
    }
    try {
      await createGalleryImages(formData.title, formData.imageUrls, formData.description);
      alert(`Successfully saved ${formData.imageUrls.length} image(s) to the gallery!`);
      setFormData({ title: '', imageUrls: [], description: '' });
      setIsAdding(false);
      setEditingId(null);
      await loadGallery();
    } catch (error: any) {
      console.error("Gallery save error:", error);
      alert("Failed to save gallery: " + (error.message || ""));
    }
  };

  const handleEdit = (img: any) => {
    setFormData({ title: img.title, imageUrls: img.imageUrl ? [img.imageUrl] : [], description: img.description || '' });
    setEditingId(img.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this image?')) {
      try {
        await deleteGalleryImage(id);
        await loadGallery();
      } catch (error: any) {
        alert("Failed to delete gallery image: " + (error.message || ""));
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-serif font-bold text-gray-900">Gallery Management</h2>
        <button 
          onClick={() => {
            setIsAdding(!isAdding);
            if (isAdding) {
              setEditingId(null);
              setFormData({ title: '', imageUrl: '', description: '' });
            }
          }}
          className="flex items-center gap-2 px-4 py-2 bg-royal-blue text-white rounded-full text-sm font-semibold hover:bg-blue-800 transition-colors"
        >
          {isAdding ? 'Cancel' : <><Plus size={16} /> Add Image</>}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-12 bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <div className="grid grid-cols-1 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image Title / Caption</label>
              <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-royal-blue outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
              <textarea 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-royal-blue outline-none"
                rows={3}
                placeholder="Brief description of the impact or story..."
              />
            </div>
            <div>
              <MultiFileUploader 
                label="Gallery Images / Videos" 
                currentUrls={formData.imageUrls} 
                onUpload={(urls) => setFormData({...formData, imageUrls: urls})} 
              />
            </div>
          </div>
          <button type="submit" className="px-6 py-3 bg-lime-green text-white rounded-full font-semibold hover:bg-green-600 transition-colors">
            {editingId ? 'Update Gallery Item' : 'Upload to Gallery'}
          </button>
        </form>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map(img => (
          <div key={img.id} className="relative group rounded-xl overflow-hidden border border-gray-200">
            <img src={img.imageUrl} alt={img.title} className="w-full h-40 object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
              <div className="flex justify-end gap-2">
                <button onClick={() => handleEdit(img)} className="p-2 bg-royal-blue text-white rounded-full hover:bg-blue-600 transition-colors">
                  <Edit2 size={14} />
                </button>
                <button onClick={() => handleDelete(img.id)} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
              <p className="text-white text-xs font-medium truncate">{img.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SubscriberCRM() {
  const [subscribers, setSubscribers] = useState<any[]>([]);

  useEffect(() => {
    fetchSubscribers().then(list => setSubscribers(list));
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-serif font-bold text-gray-900">Subscriber CRM</h2>
        <div className="px-4 py-2 bg-blue-50 text-royal-blue rounded-full text-sm font-semibold">
          Total: {subscribers.length}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 text-sm font-semibold text-gray-600">Email Address</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Subscribed Date</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map(sub => (
              <tr key={sub.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4 text-sm text-gray-900 font-medium">{sub.email}</td>
                <td className="p-4 text-sm text-gray-500">
                  {sub.subscribedAt ? new Date(sub.subscribedAt).toLocaleDateString() : 'Unknown'}
                </td>
              </tr>
            ))}
            {subscribers.length === 0 && (
              <tr>
                <td colSpan={2} className="p-8 text-center text-gray-500">No subscribers yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DynamicList({ items, onChange, placeholder }: { items: string[], onChange: (items: string[]) => void, placeholder: string }) {
  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div key={idx} className="flex gap-2 group">
          <input 
            type="text" 
            value={item} 
            onChange={e => {
              const next = [...items];
              next[idx] = e.target.value;
              onChange(next);
            }}
            placeholder={placeholder}
            className="flex-grow p-3 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-royal-blue transition-all outline-none text-sm font-medium"
          />
          <button 
            type="button"
            onClick={() => onChange(items.filter((_, i) => i !== idx))}
            className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
      <button 
        type="button"
        onClick={() => onChange([...items, ''])}
        className="flex items-center gap-2 text-royal-blue font-bold text-xs uppercase tracking-widest hover:text-blue-800 transition-colors pl-1"
      >
        <Plus size={14} /> Add New Field
      </button>
    </div>
  );
}
