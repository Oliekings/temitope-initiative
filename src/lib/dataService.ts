/**
 * Data Service for Temitope Initiative
 * 100% Native Server API (Zero third-party Firebase dependency)
 */

export interface EventItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  imageUrls?: string[];
  date: any;
  createdAt?: any;
  updatedAt?: any;
}

export interface TeamMemberItem {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  isFounder?: boolean;
  order?: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  imageUrls?: string[];
  createdAt?: any;
}

export interface SubscriberItem {
  id: string;
  email: string;
  subscribedAt: string;
}

// --- Events API ---
export async function fetchEvents(): Promise<EventItem[]> {
  try {
    const res = await fetch('/api/events');
    if (res.ok) return await res.json();
  } catch (err) {
    console.error("Events fetch error", err);
  }
  return [];
}

export async function createEvent(data: { title: string; description: string; imageUrls: string[]; date: string; adminPassword?: string }): Promise<any> {
  const res = await fetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrls[0] || '',
      imageUrls: data.imageUrls,
      date: data.date
    })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to create event' }));
    throw new Error(err.error || 'Failed to create event');
  }
  return await res.json();
}

export async function updateEvent(id: string, data: { title: string; description: string; imageUrls: string[]; date: string; adminPassword?: string }): Promise<any> {
  const res = await fetch(`/api/events/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrls[0] || '',
      imageUrls: data.imageUrls,
      date: data.date
    })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to update event' }));
    throw new Error(err.error || 'Failed to update event');
  }
  return await res.json();
}

export async function deleteEvent(id: string): Promise<boolean> {
  const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
  return res.ok;
}

// --- Team API ---
export async function fetchTeam(): Promise<TeamMemberItem[]> {
  try {
    const res = await fetch('/api/team');
    if (res.ok) return await res.json();
  } catch (err) {
    console.error("Team fetch error", err);
  }
  return [];
}

export async function createTeamMember(data: any): Promise<any> {
  const res = await fetch('/api/team', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to add team member' }));
    throw new Error(err.error || 'Failed to add team member');
  }
  return await res.json();
}

export async function updateTeamMember(id: string, data: any): Promise<any> {
  const res = await fetch(`/api/team/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to update team member' }));
    throw new Error(err.error || 'Failed to update team member');
  }
  return await res.json();
}

export async function deleteTeamMember(id: string): Promise<boolean> {
  const res = await fetch(`/api/team/${id}`, { method: 'DELETE' });
  return res.ok;
}

// --- Gallery API ---
export async function fetchGallery(): Promise<GalleryItem[]> {
  try {
    const res = await fetch('/api/gallery');
    if (res.ok) return await res.json();
  } catch (err) {
    console.error("Gallery fetch error", err);
  }
  return [];
}

export async function createGalleryImages(title: string, imageUrls: string[], description: string = ''): Promise<any> {
  const res = await fetch('/api/gallery', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, imageUrls, description })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to save gallery images' }));
    throw new Error(err.error || 'Failed to save gallery images');
  }
  return await res.json();
}

export async function deleteGalleryImage(id: string): Promise<boolean> {
  const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
  return res.ok;
}

// --- Settings API ---
export async function fetchSiteSettings(): Promise<any> {
  try {
    const res = await fetch('/api/settings/site');
    if (res.ok) return await res.json();
  } catch (err) {
    console.error("Settings fetch error", err);
  }
  return null;
}

export async function saveSiteSettings(data: any): Promise<any> {
  const res = await fetch('/api/settings/site', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to save site settings' }));
    throw new Error(err.error || 'Failed to save site settings');
  }
  return await res.json();
}

export async function fetchMaintenanceSettings(): Promise<any> {
  try {
    const res = await fetch('/api/settings/maintenance');
    if (res.ok) return await res.json();
  } catch {}
  return { isUnderMaintenance: false };
}

export async function saveMaintenanceSettings(data: any): Promise<any> {
  const res = await fetch('/api/settings/maintenance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
}

export async function fetchAdminCreds(): Promise<any> {
  try {
    const res = await fetch('/api/settings/admin');
    if (res.ok) return await res.json();
  } catch {}
  return { username: 'Surprise-MFs', password: 'Surprise' };
}

export async function saveAdminCreds(data: any): Promise<any> {
  const res = await fetch('/api/settings/admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
}

// --- Subscribers API ---
export async function fetchSubscribers(): Promise<SubscriberItem[]> {
  try {
    const res = await fetch('/api/subscribers');
    if (res.ok) return await res.json();
  } catch {}
  return [];
}

export async function subscribeEmail(email: string): Promise<any> {
  const res = await fetch('/api/subscribers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Subscription failed' }));
    throw new Error(err.error || 'Subscription failed');
  }
  return await res.json();
}

export async function deleteSubscriber(id: string): Promise<boolean> {
  const res = await fetch(`/api/subscribers/${id}`, { method: 'DELETE' });
  return res.ok;
}
