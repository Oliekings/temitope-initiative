@extends('layouts.app')

@section('content')
<section class="min-h-screen bg-soft-smoke pt-28 pb-24" 
         x-data="{ 
             activeTab: 'events', 
             isAdding: false, 
             editingItem: null,
             isAddingMember: false,
             editingMember: null
         }">
    <div class="max-w-7xl mx-auto px-6">
        <!-- Top Header -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div>
                <h1 class="text-3xl font-serif font-bold text-gray-900">Admin Command Center</h1>
                <p class="text-gray-500 text-sm">Welcome back, {{ session('admin_username', 'Administrator') }}. Manage all live content.</p>
            </div>
            <form action="{{ route('admin.logout') }}" method="POST">
                @csrf
                <button type="submit" class="flex items-center gap-2 py-2.5 px-6 bg-red-50 text-vibrant-red border border-red-200 rounded-full font-bold text-sm hover:bg-vibrant-red hover:text-white transition-all shadow-sm">
                    <i data-lucide="log-out" class="w-4 h-4"></i> Sign Out
                </button>
            </form>
        </div>

        @if(session('success'))
            <div class="mb-6 p-4 rounded-2xl bg-green-50 text-green-800 border border-green-200 text-sm font-semibold flex items-center gap-2">
                <i data-lucide="check-circle" class="w-5 h-5"></i> {{ session('success') }}
            </div>
        @endif

        <div class="flex flex-col lg:flex-row gap-8">
            <!-- Sidebar Navigation -->
            <div class="w-full lg:w-64 flex-shrink-0">
                <div class="bg-white rounded-3xl shadow-sm p-4 flex flex-col gap-2 border border-gray-100">
                    <button @click="activeTab = 'events'" :class="activeTab === 'events' ? 'bg-royal-blue text-white' : 'text-gray-700 hover:bg-gray-50'" 
                            class="flex items-center gap-3 w-full p-4 rounded-2xl font-semibold text-sm transition-all">
                        <i data-lucide="calendar" class="w-5 h-5"></i> Events ({{ count($events) }})
                    </button>
                    <button @click="activeTab = 'team'" :class="activeTab === 'team' ? 'bg-royal-blue text-white' : 'text-gray-700 hover:bg-gray-50'" 
                            class="flex items-center gap-3 w-full p-4 rounded-2xl font-semibold text-sm transition-all">
                        <i data-lucide="users" class="w-5 h-5"></i> Leadership Team ({{ count($team) }})
                    </button>
                    <button @click="activeTab = 'gallery'" :class="activeTab === 'gallery' ? 'bg-royal-blue text-white' : 'text-gray-700 hover:bg-gray-50'" 
                            class="flex items-center gap-3 w-full p-4 rounded-2xl font-semibold text-sm transition-all">
                        <i data-lucide="image" class="w-5 h-5"></i> Gallery Photos ({{ count($gallery) }})
                    </button>
                    <button @click="activeTab = 'subscribers'" :class="activeTab === 'subscribers' ? 'bg-royal-blue text-white' : 'text-gray-700 hover:bg-gray-50'" 
                            class="flex items-center gap-3 w-full p-4 rounded-2xl font-semibold text-sm transition-all">
                        <i data-lucide="mail" class="w-5 h-5"></i> Subscribers ({{ count($subscribers) }})
                    </button>
                    <button @click="activeTab = 'settings'" :class="activeTab === 'settings' ? 'bg-royal-blue text-white' : 'text-gray-700 hover:bg-gray-50'" 
                            class="flex items-center gap-3 w-full p-4 rounded-2xl font-semibold text-sm transition-all">
                        <i data-lucide="settings" class="w-5 h-5"></i> Site & Bank Settings
                    </button>
                </div>
            </div>

            <!-- Content Area -->
            <div class="flex-grow bg-white rounded-3xl shadow-sm p-8 border border-gray-100 min-h-[600px]">
                
                <!-- 1. EVENTS TAB -->
                <div x-show="activeTab === 'events'" x-cloak>
                    <div class="flex justify-between items-center mb-8">
                        <div>
                            <h2 class="text-2xl font-serif font-bold text-gray-900">Manage Events</h2>
                            <p class="text-gray-500 text-sm">Post upcoming outreaches, field reports, and multiple photos.</p>
                        </div>
                        <button @click="isAdding = !isAdding; editingItem = null;" 
                                class="flex items-center gap-2 px-5 py-2.5 bg-royal-blue text-white rounded-full font-bold text-sm hover:bg-blue-800 transition-colors shadow-md">
                            <i data-lucide="plus" class="w-4 h-4"></i> Add New Event
                        </button>
                    </div>

                    <!-- Event Add / Edit Form -->
                    <div x-show="isAdding" x-cloak class="mb-10 p-6 bg-gray-50 rounded-2xl border border-gray-200"
                         x-data="{ isSubmitting: false, progressMsg: '' }">
                        <h3 class="font-serif font-bold text-lg text-gray-900 mb-4" x-text="editingItem ? 'Edit Event' : 'Create New Event'"></h3>
                        <form @submit.prevent="
                            isSubmitting = true;
                            progressMsg = 'Preparing and optimizing photos...';
                            const form = $el;
                            const fileInput = form.querySelector('input[type=file]');
                            const files = fileInput && fileInput.files ? Array.from(fileInput.files) : [];
                            
                            (async () => {
                                let uploadedUrls = [];
                                if (files.length > 0) {
                                    uploadedUrls = await uploadMultipleImagesInBatches(files, (msg) => progressMsg = msg);
                                }
                                
                                const title = form.querySelector('input[name=title]').value;
                                const date = form.querySelector('input[name=date]').value;
                                const manualUrl = form.querySelector('input[name=imageUrl]').value;
                                const description = form.querySelector('textarea[name=description]').value;
                                
                                const existingUrls = (editingItem && editingItem.image_urls) ? editingItem.image_urls : [];
                                const finalImageUrls = [...existingUrls, ...uploadedUrls];
                                const finalImageUrl = manualUrl || finalImageUrls[0] || (editingItem ? editingItem.image_url : '');
                                
                                progressMsg = 'Saving event details...';
                                const url = editingItem ? ('/api/events/' + editingItem.id) : '/api/events';
                                const method = editingItem ? 'PUT' : 'POST';
                                
                                const res = await fetch(url, {
                                    method: method,
                                    headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': '{{ csrf_token() }}' },
                                    body: JSON.stringify({
                                        title: title,
                                        date: date,
                                        imageUrl: finalImageUrl,
                                        imageUrls: finalImageUrls,
                                        description: description
                                    })
                                });
                                
                                if (res.ok) {
                                    alert('Event saved successfully!');
                                    window.location.reload();
                                } else {
                                    const err = await res.json().catch(() => ({}));
                                    alert('Error saving event: ' + (err.message || 'Please check your inputs.'));
                                    isSubmitting = false;
                                }
                            })().catch(err => {
                                alert('Error: ' + err.message);
                                isSubmitting = false;
                            });
                        " class="space-y-4">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Event Title</label>
                                    <input type="text" name="title" required :value="editingItem?.title || ''" placeholder="e.g. Abuja Youth Empowerment 2026" 
                                           class="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-royal-blue font-medium text-sm">
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Event Date</label>
                                    <input type="datetime-local" name="date" required :value="editingItem?.event_date ? new Date(editingItem.event_date).toISOString().slice(0, 16) : ''" 
                                           class="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-royal-blue font-medium text-sm">
                                </div>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Primary Image URL (optional)</label>
                                    <input type="text" name="imageUrl" :value="editingItem?.image_url || ''" placeholder="/uploads/example.webp" 
                                           class="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-royal-blue font-medium text-sm">
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Upload Event Photos (Auto-compressed)</label>
                                    <input type="file" name="photos[]" multiple accept="image/*"
                                           class="w-full p-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-royal-blue text-xs text-gray-600">
                                </div>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Description & Story</label>
                                <textarea name="description" rows="5" required placeholder="Full event report, background, impact, and location..." 
                                          class="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-royal-blue font-medium text-sm" x-text="editingItem?.description || ''"></textarea>
                            </div>

                            <div x-show="isSubmitting" class="p-3 bg-blue-50 text-royal-blue rounded-xl text-xs font-bold flex items-center gap-2">
                                <i data-lucide="loader" class="w-4 h-4 animate-spin"></i>
                                <span x-text="progressMsg"></span>
                            </div>

                            <div class="flex gap-4 pt-2">
                                <button type="submit" :disabled="isSubmitting" class="py-3 px-8 bg-lime-green text-white font-bold rounded-xl text-sm hover:bg-green-600 shadow-md disabled:opacity-50">
                                    <span x-text="isSubmitting ? 'Optimizing & Saving...' : 'Save Event'"></span>
                                </button>
                                <button type="button" :disabled="isSubmitting" @click="isAdding = false; editingItem = null;" class="py-3 px-6 bg-gray-200 text-gray-700 font-bold rounded-xl text-sm hover:bg-gray-300">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- Events List -->
                    <div class="space-y-4">
                        @forelse($events as $event)
                            <div class="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex items-center justify-between gap-4">
                                <div class="flex items-center gap-4">
                                    <img src="{{ $event->image_url ?: ($event->image_urls[0] ?? '/uploads/file-1774602405327-507864585.webp') }}" class="w-16 h-16 rounded-xl object-cover bg-gray-100">
                                    <div>
                                        <h4 class="font-serif font-bold text-gray-900">{{ $event->title }}</h4>
                                        <div class="flex items-center gap-2 text-xs text-gray-500">
                                            <span>{{ $event->event_date ? $event->event_date->format('M d, Y') : 'No Date' }}</span>
                                            <span>&bull;</span>
                                            <a href="{{ route('events.show', $event->slug) }}" target="_blank" class="text-royal-blue hover:underline font-semibold flex items-center gap-1">
                                                View Live Page <i data-lucide="external-link" class="w-3 h-3"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex items-center gap-2">
                                    <button @click="editingItem = {{ json_encode($event) }}; isAdding = true;" class="p-2.5 bg-blue-50 text-royal-blue rounded-xl hover:bg-blue-100" title="Edit Event">
                                        <i data-lucide="edit-2" class="w-4 h-4"></i>
                                    </button>
                                    <form action="/api/events/{{ $event->id }}" method="POST" onsubmit="return confirm('Delete this event?');">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="p-2.5 bg-red-50 text-vibrant-red rounded-xl hover:bg-red-100" title="Delete Event">
                                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                                        </button>
                                    </form>
                                </div>
                            </div>
                        @empty
                            <p class="text-center text-gray-500 py-12">No events created yet.</p>
                        @endforelse
                    </div>
                </div>

                <!-- 2. LEADERSHIP BIO EDITOR TAB -->
                <div x-show="activeTab === 'team'" x-cloak>
                    <div class="flex justify-between items-center mb-8">
                        <div>
                            <h2 class="text-2xl font-serif font-bold text-gray-900">Leadership Team Bios</h2>
                            <p class="text-gray-500 text-sm">View, add, or edit individual executive profiles and headshots privately.</p>
                        </div>
                        <button @click="editingMember = { name: '', role: '', bio: '', image_url: '', is_founder: false, order: 0 }; isAddingMember = true;" 
                                class="flex items-center gap-2 px-5 py-2.5 bg-royal-blue text-white rounded-full font-bold text-sm hover:bg-blue-800 transition-colors shadow-md">
                            <i data-lucide="user-plus" class="w-4 h-4"></i> Add Team Member
                        </button>
                    </div>

                    <!-- Individual Team Member Edit Modal -->
                    <div x-show="isAddingMember || editingMember" x-cloak 
                         class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                         @click.self="isAddingMember = false; editingMember = null;">
                        <div class="bg-white rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl p-8 max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200">
                            <div class="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                                <h3 class="font-serif font-bold text-2xl text-gray-900" x-text="editingMember?.id ? 'Edit Profile: ' + editingMember.name : 'Add New Team Member'"></h3>
                                <button @click="isAddingMember = false; editingMember = null;" class="p-2 bg-gray-100 hover:bg-gray-200 rounded-full">
                                    <i data-lucide="x" class="w-5 h-5 text-gray-700"></i>
                                </button>
                            </div>

                            <form @submit.prevent="
                                const form = $el;
                                const fileInput = form.querySelector('input[type=file]');
                                const file = fileInput && fileInput.files ? fileInput.files[0] : null;
                                
                                (async () => {
                                    let uploadedUrl = null;
                                    if (file) {
                                        const dataUrl = await compressImageToDataUrl(file, 1200, 0.88);
                                        if (dataUrl) {
                                            const uploadRes = await fetch('/api/upload', {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Accept': 'application/json',
                                                    'X-CSRF-TOKEN': '{{ csrf_token() }}'
                                                },
                                                body: JSON.stringify({ images: [dataUrl] })
                                            });
                                            const uploadData = await uploadRes.json();
                                            uploadedUrl = uploadData.url || (uploadData.urls ? uploadData.urls[0] : null);
                                        }
                                    }
                                    
                                    const name = form.querySelector('input[name=name]').value;
                                    const role = form.querySelector('input[name=role]').value;
                                    const bio = form.querySelector('textarea[name=bio]').value;
                                    const manualUrl = form.querySelector('input[name=imageUrl]').value;
                                    const isFounder = form.querySelector('input[name=is_founder]').checked;
                                    const order = form.querySelector('input[name=order]').value;
                                    
                                    const finalImageUrl = uploadedUrl || manualUrl || (editingMember ? editingMember.image_url : '');
                                    const url = editingMember?.id ? ('/api/team/' + editingMember.id) : '/api/team';
                                    const method = editingMember?.id ? 'PUT' : 'POST';
                                    
                                    const res = await fetch(url, {
                                        method: method,
                                        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': '{{ csrf_token() }}' },
                                        body: JSON.stringify({
                                            name: name,
                                            role: role,
                                            bio: bio,
                                            imageUrl: finalImageUrl,
                                            is_founder: isFounder,
                                            order: order
                                        })
                                    });
                                    
                                    if (res.ok) {
                                        alert('Profile saved successfully!');
                                        window.location.reload();
                                    } else {
                                        alert('Error saving profile.');
                                    }
                                })().catch(e => alert('Error: ' + e.message));
                            " class="space-y-5">

                                <!-- Current Photo Preview -->
                                <div class="flex items-center gap-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <img :src="editingMember?.image_url || '/uploads/file-1774602405327-507864585.webp'" 
                                         class="w-20 h-20 rounded-2xl object-cover bg-white shadow-sm border border-gray-200">
                                    <div class="flex-grow space-y-2">
                                        <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Change Profile Picture (Upload File)</label>
                                        <input type="file" name="photo" accept="image/*" class="text-xs text-gray-600 w-full">
                                        <input type="text" name="imageUrl" :value="editingMember?.image_url || ''" placeholder="Or enter Image URL..." 
                                               class="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-royal-blue">
                                    </div>
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Full Name & Title</label>
                                        <input type="text" name="name" required :value="editingMember?.name || ''" placeholder="e.g. Dr. Mrs. Elizabeth Egbetokun" 
                                               class="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-royal-blue font-medium text-sm">
                                    </div>
                                    <div>
                                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Designation / Role</label>
                                        <input type="text" name="role" required :value="editingMember?.role || ''" placeholder="e.g. Founder & President" 
                                               class="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-royal-blue font-medium text-sm">
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Biography</label>
                                    <textarea name="bio" rows="5" required placeholder="Full biographical background, leadership vision, and contributions..." 
                                              class="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-royal-blue font-medium text-sm" x-text="editingMember?.bio || ''"></textarea>
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                    <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                        <input type="checkbox" name="is_founder" value="1" :checked="editingMember?.is_founder" id="is_founder_check" class="w-4 h-4 text-royal-blue rounded">
                                        <label for="is_founder_check" class="text-xs font-bold text-gray-700 cursor-pointer">Mark as Founder Badge</label>
                                    </div>
                                    <div>
                                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Display Order Priority</label>
                                        <input type="number" name="order" :value="editingMember?.order || 0" 
                                               class="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm font-medium">
                                    </div>
                                </div>

                                <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                    <button type="button" @click="isAddingMember = false; editingMember = null;" class="py-3 px-6 bg-gray-200 text-gray-700 font-bold rounded-xl text-sm hover:bg-gray-300">
                                        Cancel
                                    </button>
                                    <button type="submit" class="py-3 px-8 bg-lime-green text-white font-bold rounded-xl text-sm hover:bg-green-600 shadow-md">
                                        Save Profile
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <!-- Clean Team Members Grid/List -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        @foreach($team as $member)
                            <div class="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex gap-5 items-start hover:shadow-md transition-shadow">
                                <img src="{{ $member->image_url ?: '/uploads/file-1774602405327-507864585.webp' }}" 
                                     alt="{{ $member->name }}" 
                                     class="w-24 h-24 rounded-2xl object-cover bg-white shadow-sm flex-shrink-0 border border-gray-200">
                                <div class="flex-grow flex flex-col justify-between h-full">
                                    <div>
                                        <div class="flex items-center justify-between mb-1">
                                            <h3 class="text-lg font-serif font-bold text-gray-900 leading-tight">{{ $member->name }}</h3>
                                            @if($member->is_founder)
                                                <span class="px-2.5 py-0.5 bg-royal-blue text-white rounded-full text-[10px] font-bold">Founder</span>
                                            @endif
                                        </div>
                                        <p class="text-xs font-bold text-vibrant-red uppercase tracking-wider mb-2">{{ $member->role }}</p>
                                        <p class="text-gray-600 text-xs line-clamp-2 leading-relaxed mb-4">{{ $member->bio }}</p>
                                    </div>
                                    <div class="flex items-center justify-end gap-2 pt-2 border-t border-gray-200/60">
                                        <button @click="editingMember = {{ json_encode($member) }}; isAddingMember = true;" 
                                                class="px-4 py-2 bg-blue-50 text-royal-blue rounded-xl font-bold text-xs hover:bg-royal-blue hover:text-white transition-colors flex items-center gap-1.5">
                                            <i data-lucide="edit" class="w-3.5 h-3.5"></i> Edit Profile
                                        </button>
                                        <form action="/api/team/{{ $member->id }}" method="POST" onsubmit="return confirm('Delete this team member profile?');">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="p-2 bg-red-50 text-vibrant-red rounded-xl hover:bg-vibrant-red hover:text-white transition-colors" title="Delete Profile">
                                                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>

                <!-- 3. GALLERY MANAGER TAB -->
                <div x-show="activeTab === 'gallery'" x-cloak>
                    <div class="flex justify-between items-center mb-8">
                        <div>
                            <h2 class="text-2xl font-serif font-bold text-gray-900">Impact Gallery ({{ count($gallery) }})</h2>
                            <p class="text-gray-500 text-sm">Upload new high-resolution outreach photos.</p>
                        </div>
                    </div>

                    <!-- Direct File Upload Form with Smart Compression -->
                    <div class="mb-10 p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-center"
                         x-data="{ isUploadingGallery: false, galleryProgress: '' }">
                        <form @submit.prevent="
                            isUploadingGallery = true;
                            galleryProgress = 'Optimizing and preparing photos...';
                            const fileInput = $el.querySelector('input[type=file]');
                            const files = fileInput && fileInput.files ? Array.from(fileInput.files) : [];
                            
                            if (files.length === 0) {
                                alert('Please select at least one photo.');
                                isUploadingGallery = false;
                                return;
                            }
                            
                            uploadMultipleImagesInBatches(files, (msg) => galleryProgress = msg)
                            .then(urls => {
                                galleryProgress = 'Saving to gallery...';
                                return fetch('/api/gallery', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': '{{ csrf_token() }}' },
                                    body: JSON.stringify({ title: 'Community Outreach', imageUrls: urls })
                                });
                            })
                            .then(() => {
                                alert('Photos uploaded successfully!');
                                window.location.reload();
                            })
                            .catch(e => {
                                alert('Upload error: ' + e.message);
                                isUploadingGallery = false;
                            });
                        ">
                            <i data-lucide="upload-cloud" class="w-10 h-10 mx-auto text-royal-blue mb-3"></i>
                            <h4 class="font-bold text-gray-800 mb-1">Select and Upload Photos</h4>
                            <p class="text-xs text-gray-500 mb-4">Auto-compressed for ultra-fast, high-resolution loading (supports batch uploads of any size)</p>
                            <input type="file" name="files[]" multiple required accept="image/*" class="mb-4 text-sm text-gray-600">
                            
                            <div x-show="isUploadingGallery" class="mb-4 p-3 bg-blue-50 text-royal-blue rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                                <i data-lucide="loader" class="w-4 h-4 animate-spin"></i>
                                <span x-text="galleryProgress"></span>
                            </div>

                            <div>
                                <button type="submit" :disabled="isUploadingGallery" class="py-2.5 px-6 bg-lime-green text-white font-bold rounded-xl text-sm hover:bg-green-600 shadow-md disabled:opacity-50">
                                    <span x-text="isUploadingGallery ? 'Optimizing & Uploading...' : 'Upload Selected Photos to Gallery'"></span>
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- Gallery Grid -->
                    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        @foreach($gallery as $img)
                            <div class="group relative rounded-2xl overflow-hidden aspect-square bg-gray-100 border border-gray-100">
                                <img src="{{ $img->image_url }}" class="w-full h-full object-cover">
                                <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                                    <form action="/api/gallery/{{ $img->id }}" method="POST" onsubmit="return confirm('Delete this image?');" class="self-end">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="p-1.5 bg-vibrant-red text-white rounded-full hover:bg-red-700">
                                            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                                        </button>
                                    </form>
                                    <span class="text-white text-xs font-semibold truncate">{{ $img->title }}</span>
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>

                <!-- 4. SUBSCRIBERS CRM TAB -->
                <div x-show="activeTab === 'subscribers'" x-cloak>
                    <div class="flex justify-between items-center mb-8">
                        <div>
                            <h2 class="text-2xl font-serif font-bold text-gray-900">Subscribers CRM</h2>
                            <p class="text-gray-500 text-sm">Users subscribed to email notifications (Total: {{ count($subscribers) }}).</p>
                        </div>
                    </div>

                    <div class="overflow-x-auto bg-gray-50 rounded-2xl border border-gray-200">
                        <table class="w-full text-left text-sm">
                            <thead class="bg-gray-100 text-gray-600 font-bold uppercase text-xs">
                                <tr>
                                    <th class="p-4">Email Address</th>
                                    <th class="p-4">Subscribed At</th>
                                    <th class="p-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200">
                                @forelse($subscribers as $sub)
                                    <tr class="hover:bg-white transition-colors">
                                        <td class="p-4 font-semibold text-gray-900">{{ $sub->email }}</td>
                                        <td class="p-4 text-gray-500">{{ $sub->created_at ? $sub->created_at->format('M d, Y') : 'Unknown' }}</td>
                                        <td class="p-4 text-right">
                                            <form action="/api/subscribers/{{ $sub->id }}" method="POST" onsubmit="return confirm('Remove subscriber?');">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" class="text-vibrant-red hover:underline text-xs font-bold">Remove</button>
                                            </form>
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="3" class="p-8 text-center text-gray-500">No subscribers yet.</td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- 5. SITE & BANK SETTINGS TAB -->
                <div x-show="activeTab === 'settings'" x-cloak>
                    <div class="mb-8">
                        <h2 class="text-2xl font-serif font-bold text-gray-900">Site & Bank Account Settings</h2>
                        <p class="text-gray-500 text-sm">Update official Zenith Bank donation accounts and credentials anytime.</p>
                    </div>

                    <!-- Editable Zenith Bank Details Form -->
                    <div class="p-8 bg-blue-50/70 rounded-3xl border border-blue-100 mb-8">
                        <div class="flex items-center gap-3 text-royal-blue font-serif font-bold text-xl mb-6">
                            <i data-lucide="building-2" class="w-6 h-6"></i> Edit Official Zenith Bank Donation Accounts
                        </div>

                        <form action="/api/settings/bank" method="POST" class="space-y-4">
                            @csrf
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
                                <div class="md:col-span-2">
                                    <label class="block font-bold text-gray-600 uppercase tracking-wider mb-1">Official Account Name</label>
                                    <input type="text" name="account_name" value="{{ $bankSettings['account_name'] ?? 'TEMITOPE SOCIETAL SUSTAINABILITY AND DEVELOPMENT INITIATIVE (TSSDI)' }}" 
                                           class="w-full p-3.5 bg-white border border-blue-200 rounded-xl text-sm font-semibold text-gray-900">
                                </div>
                                <div>
                                    <label class="block font-bold text-gray-600 uppercase tracking-wider mb-1">Bank Name</label>
                                    <input type="text" name="bank_name" value="{{ $bankSettings['bank_name'] ?? 'ZENITH BANK PLC' }}" 
                                           class="w-full p-3.5 bg-white border border-blue-200 rounded-xl text-sm font-semibold text-gray-900">
                                </div>
                                <div>
                                    <label class="block font-bold text-gray-600 uppercase tracking-wider mb-1">Bank Branch</label>
                                    <input type="text" name="branch" value="{{ $bankSettings['branch'] ?? 'KEBBI HOUSE BRANCH' }}" 
                                           class="w-full p-3.5 bg-white border border-blue-200 rounded-xl text-sm font-semibold text-gray-900">
                                </div>
                                <div>
                                    <label class="block font-bold text-royal-blue uppercase tracking-wider mb-1">NGN Account Number (Naira)</label>
                                    <input type="text" name="account_number_ngn" value="{{ $bankSettings['account_number_ngn'] ?? '1311816265' }}" 
                                           class="w-full p-3.5 bg-white border border-blue-200 rounded-xl font-mono text-base font-bold text-gray-900">
                                </div>
                                <div>
                                    <label class="block font-bold text-green-800 uppercase tracking-wider mb-1">USD Account Number (Dollars)</label>
                                    <input type="text" name="account_number_usd" value="{{ $bankSettings['account_number_usd'] ?? '5075911468' }}" 
                                           class="w-full p-3.5 bg-white border border-blue-200 rounded-xl font-mono text-base font-bold text-gray-900">
                                </div>
                                <div>
                                    <label class="block font-bold text-gray-600 uppercase tracking-wider mb-1">SWIFT Code</label>
                                    <input type="text" name="swift_code" value="{{ $bankSettings['swift_code'] ?? 'ZEIBNGLA' }}" 
                                           class="w-full p-3.5 bg-white border border-blue-200 rounded-xl font-mono text-sm font-bold text-gray-900">
                                </div>
                                <div>
                                    <label class="block font-bold text-gray-600 uppercase tracking-wider mb-1">Sort Code</label>
                                    <input type="text" name="sort_code" value="{{ $bankSettings['sort_code'] ?? '057080277' }}" 
                                           class="w-full p-3.5 bg-white border border-blue-200 rounded-xl font-mono text-sm font-bold text-gray-900">
                                </div>
                            </div>
                            <div class="flex justify-end pt-4">
                                <button type="submit" class="py-3 px-8 bg-royal-blue text-white font-bold rounded-xl text-sm hover:bg-blue-800 transition-colors shadow-md">
                                    Save Bank Account Changes
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- Admin Credentials Form -->
                    <div class="p-8 bg-gray-50 rounded-3xl border border-gray-200 mb-8">
                        <h3 class="font-serif font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                            <i data-lucide="lock" class="w-5 h-5 text-royal-blue"></i> Admin Login Credentials
                        </h3>
                        <form action="/api/settings/admin" method="POST" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            @csrf
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Username</label>
                                <input type="text" name="username" value="{{ $adminCreds['username'] ?? 'Surprise-MFs' }}" class="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm font-medium">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Password</label>
                                <input type="text" name="password" value="{{ $adminCreds['password'] ?? 'Surprise' }}" class="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm font-medium">
                            </div>
                            <div class="md:col-span-2 flex justify-end">
                                <button type="submit" class="py-2.5 px-6 bg-royal-blue text-white rounded-xl font-bold text-sm hover:bg-blue-800">
                                    Update Credentials
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- 1-Click Database Backup & Restore -->
                    <div class="p-8 bg-white rounded-3xl border border-gray-200">
                        <h3 class="font-serif font-bold text-lg text-gray-900 mb-2 flex items-center gap-2">
                            <i data-lucide="database" class="w-5 h-5 text-lime-green"></i> 1-Click Database Backup & Export
                        </h3>
                        <p class="text-xs text-gray-500 mb-4">Export all database records as a standalone JSON file anytime.</p>
                        <div class="flex gap-4">
                            <a href="/api/events" target="_blank" class="py-2.5 px-6 bg-royal-blue text-white font-bold rounded-xl text-sm hover:bg-blue-800 flex items-center gap-2 shadow-md">
                                <i data-lucide="download" class="w-4 h-4"></i> View JSON Data Feed
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</section>

<!-- Client-side Smart Compression and Chunked Uploader Script -->
<script>
    async function compressImageToDataUrl(file, maxDimension = 1600, quality = 0.82) {
        if (!file || !file.type.startsWith('image/')) return null;
        return new Promise((resolve) => {
            const img = new Image();
            const reader = new FileReader();
            reader.onerror = () => resolve(null);
            reader.onload = (e) => {
                img.onerror = () => resolve(null);
                img.onload = () => {
                    let { width, height } = img;
                    if (width > maxDimension || height > maxDimension) {
                        if (width > height) {
                            height = Math.round((height * maxDimension) / width);
                            width = maxDimension;
                        } else {
                            width = Math.round((width * maxDimension) / height);
                            height = maxDimension;
                        }
                    }
                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', quality));
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    async function uploadMultipleImagesInBatches(files, onProgress) {
        const batchSize = 3;
        const allUploadedUrls = [];
        const total = files.length;
        
        for (let i = 0; i < total; i += batchSize) {
            const chunk = files.slice(i, i + batchSize);
            if (onProgress) onProgress(`Optimizing & uploading ${Math.min(i + batchSize, total)} of ${total} photos...`);
            
            const base64List = (await Promise.all(chunk.map(f => compressImageToDataUrl(f)))).filter(Boolean);

            if (base64List.length === 0) continue;

            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': '{{ csrf_token() }}'
                },
                body: JSON.stringify({ images: base64List })
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || ('Upload error (Status: ' + res.status + ')'));
            }

            const data = await res.json();
            const urls = data.urls || (data.url ? [data.url] : []);
            allUploadedUrls.push(...urls);
        }
        return allUploadedUrls;
    }
</script>
@endsection
