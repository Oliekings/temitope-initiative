@extends('layouts.app')

@section('content')
@php
    $allEventImages = array_values(array_filter(array_unique(array_merge(
        $event->image_url ? [$event->image_url] : [],
        (array) ($event->image_urls ?? [])
    ))));
@endphp
<div class="bg-soft-smoke min-h-screen pt-28 pb-24" 
     x-data="{ 
         lightboxIdx: null, 
         allImages: {{ json_encode($allEventImages) }},
         copied: false,
         openLightbox(idx) {
             this.lightboxIdx = idx;
         },
         nextLightbox() {
             if (this.lightboxIdx !== null && this.allImages.length > 0) {
                 this.lightboxIdx = (this.lightboxIdx < this.allImages.length - 1) ? this.lightboxIdx + 1 : 0;
             }
         },
         prevLightbox() {
             if (this.lightboxIdx !== null && this.allImages.length > 0) {
                 this.lightboxIdx = (this.lightboxIdx > 0) ? this.lightboxIdx - 1 : this.allImages.length - 1;
             }
         },
         closeLightbox() {
             this.lightboxIdx = null;
         }
     }"
     @keydown.window.arrow-right="nextLightbox()"
     @keydown.window.arrow-left="prevLightbox()"
     @keydown.window.escape="closeLightbox()">

    <!-- Top Hero Banner with Editorial Aesthetic -->
    <section class="relative bg-gradient-to-b from-royal-blue via-[#002B66] to-charcoal text-white pt-12 pb-24 overflow-hidden">
        <!-- Subtle Pattern Overlay -->
        <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>
        <div class="absolute -top-24 -right-24 w-96 h-96 bg-lime-green/20 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-royal-blue/30 rounded-full blur-3xl pointer-events-none"></div>

        <div class="max-w-7xl mx-auto px-6 relative z-10">
            <!-- Breadcrumbs -->
            <nav class="flex items-center gap-2 text-xs font-semibold text-blue-200 mb-8">
                <a href="{{ route('home') }}" class="hover:text-white transition-colors">Home</a>
                <i data-lucide="chevron-right" class="w-3.5 h-3.5 text-blue-300"></i>
                <a href="{{ route('home') }}#news" class="hover:text-white transition-colors">News & Initiatives</a>
                <i data-lucide="chevron-right" class="w-3.5 h-3.5 text-blue-300"></i>
                <span class="text-lime-green font-bold truncate max-w-sm">{{ $event->title }}</span>
            </nav>

            <div class="max-w-4xl">
                <!-- Badges -->
                <div class="flex flex-wrap items-center gap-3 mb-6">
                    <span class="px-4 py-1.5 rounded-full bg-lime-green/20 border border-lime-green/40 text-lime-green text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-lime-green animate-pulse"></span>
                        Field Outreach Report
                    </span>
                    <span class="px-3.5 py-1.5 rounded-full bg-white/10 text-blue-100 text-xs font-semibold backdrop-blur-sm">
                        <i data-lucide="clock" class="w-3.5 h-3.5 inline mr-1 text-blue-300"></i> 3 Min Read
                    </span>
                    <span class="px-3.5 py-1.5 rounded-full bg-white/10 text-blue-100 text-xs font-semibold backdrop-blur-sm">
                        <i data-lucide="map-pin" class="w-3.5 h-3.5 inline mr-1 text-red-400"></i> Nigeria
                    </span>
                </div>

                <!-- Event Title -->
                <h1 class="text-3xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-white leading-[1.15] mb-6 tracking-tight">
                    {{ $event->title }}
                </h1>

                <!-- Meta bar: Author & Date -->
                <div class="flex flex-wrap items-center gap-6 pt-4 border-t border-white/15 text-sm text-blue-100">
                    <div class="flex items-center gap-3">
                        <img src="{{ $siteSettings['logoUrl'] ?? 'https://res.cloudinary.com/dfujzs9ml/image/upload/v1774493285/temitope_initiative/t653vvukb9rj1q1zdh0y.png' }}" 
                             alt="TSSDI" 
                             class="w-10 h-10 rounded-full bg-white p-1 object-contain shadow-md">
                        <div>
                            <span class="font-bold text-white block leading-tight">Temitope Initiative (TSSDI)</span>
                            <span class="text-xs text-blue-200">Community Development Directorate</span>
                        </div>
                    </div>
                    <div class="h-8 w-px bg-white/20 hidden sm:block"></div>
                    <div class="flex items-center gap-2">
                        <i data-lucide="calendar" class="w-4 h-4 text-lime-green"></i>
                        <span class="font-semibold text-white">
                            {{ $event->event_date ? $event->event_date->format('F d, Y') : 'Upcoming' }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Main Content Container with Floating Card Overlap -->
    <main class="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">

            <!-- LEFT COLUMN: Primary Article & Photos (8 Columns) -->
            <article class="lg:col-span-8 space-y-10">
                
                <!-- Main Featured Photo Card (Uncropped Full Image with Ambient Glassmorphism) -->
                <div class="bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
                    <div class="relative w-full bg-slate-950 overflow-hidden group cursor-pointer min-h-[380px] sm:min-h-[500px] flex items-center justify-center p-3 sm:p-6"
                         @click="openLightbox(0)">
                        
                        <!-- Ambient Blurred Backdrop -->
                        <img src="{{ $event->image_url ?: ($event->image_urls[0] ?? '/uploads/file-1774602405327-507864585.webp') }}" 
                             class="absolute inset-0 w-full h-full object-cover blur-2xl opacity-35 scale-110 pointer-events-none select-none">
                        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30 pointer-events-none"></div>

                        <!-- Crystal-Clear Full Image (100% of the image shown without harsh cropping) -->
                        <img src="{{ $event->image_url ?: ($event->image_urls[0] ?? '/uploads/file-1774602405327-507864585.webp') }}" 
                             alt="{{ $event->title }}" 
                             class="relative z-10 max-h-[560px] w-auto max-w-full object-contain rounded-2xl shadow-2xl group-hover:scale-[1.02] transition-transform duration-500">
                        
                        <!-- Top-Right Fullscreen Action -->
                        <div class="absolute top-4 right-4 z-20">
                            <span class="py-2 px-4 rounded-full bg-black/60 backdrop-blur-md text-white font-bold text-xs shadow-lg flex items-center gap-1.5 hover:bg-black/80 transition-colors border border-white/10">
                                <i data-lucide="maximize-2" class="w-3.5 h-3.5 text-lime-green"></i> View Full Photo
                            </span>
                        </div>

                        <!-- Bottom-Left Badge -->
                        <div class="absolute bottom-4 left-4 z-20 bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold px-3.5 py-1.5 rounded-xl flex items-center gap-2 border border-white/10">
                            <span class="w-2 h-2 rounded-full bg-lime-green animate-pulse"></span> Official TSSDI Field Photo
                        </div>
                    </div>

                    <!-- Story Article Body -->
                    <div class="p-8 sm:p-12">
                        <!-- Key Takeaway Banner -->
                        <div class="p-6 rounded-2xl bg-blue-50/80 border-l-4 border-royal-blue mb-10">
                            <h3 class="text-xs font-bold text-royal-blue uppercase tracking-wider mb-1 flex items-center gap-2">
                                <i data-lucide="sparkles" class="w-4 h-4"></i> Executive Summary
                            </h3>
                            <p class="text-sm sm:text-base text-gray-800 font-serif italic leading-relaxed">
                                "{{ Str::limit($event->description, 180) }}"
                            </p>
                        </div>

                        <!-- Full Narrative Body with Stylized First Paragraph -->
                        <div class="prose prose-lg max-w-none text-gray-700 leading-relaxed font-sans text-base sm:text-lg space-y-6">
                            @php
                                $paragraphs = explode("\n", trim($event->description));
                            @endphp

                            @foreach($paragraphs as $idx => $para)
                                @if(!empty(trim($para)))
                                    @if($idx === 0)
                                        <p class="first-letter:float-left first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:mr-3 first-letter:text-royal-blue first-letter:leading-none text-gray-800 font-medium">
                                            {{ trim($para) }}
                                        </p>
                                    @else
                                        <p class="text-gray-700">
                                            {{ trim($para) }}
                                        </p>
                                    @endif
                                @endif
                            @endforeach
                        </div>

                        <!-- Outreach Photo & Media Archive (Interactive Cinematic Gallery) -->
                        @php
                            $allEventImages = array_values(array_filter(array_unique(array_merge(
                                $event->image_url ? [$event->image_url] : [],
                                (array) ($event->image_urls ?? [])
                            ))));
                        @endphp

                        @if(!empty($allEventImages) && count($allEventImages) > 1)
                            <div class="mt-12 pt-10 border-t border-gray-100" 
                                 x-data="{ 
                                     activePhotoIdx: 0, 
                                     eventPhotos: {{ json_encode($allEventImages) }} 
                                 }">
                                <div class="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 class="text-2xl font-serif font-bold text-gray-900">Media & Outreach Gallery</h3>
                                        <p class="text-xs text-gray-500">Interactive photo documentation from this event.</p>
                                    </div>
                                    <div class="flex items-center gap-2 bg-gray-100 p-1 rounded-xl text-xs font-bold text-gray-700">
                                        <button @click="activePhotoIdx = (activePhotoIdx > 0) ? activePhotoIdx - 1 : eventPhotos.length - 1"
                                                class="p-1.5 hover:bg-white rounded-lg transition-colors shadow-sm" title="Previous Photo">
                                            <i data-lucide="chevron-left" class="w-4 h-4 text-royal-blue"></i>
                                        </button>
                                        <span class="px-2">
                                            <span x-text="activePhotoIdx + 1"></span> / <span x-text="eventPhotos.length"></span>
                                        </span>
                                        <button @click="activePhotoIdx = (activePhotoIdx < eventPhotos.length - 1) ? activePhotoIdx + 1 : 0"
                                                class="p-1.5 hover:bg-white rounded-lg transition-colors shadow-sm" title="Next Photo">
                                            <i data-lucide="chevron-right" class="w-4 h-4 text-royal-blue"></i>
                                        </button>
                                    </div>
                                </div>

                                <!-- Main Active Cinema Frame -->
                                <div class="relative rounded-3xl overflow-hidden bg-slate-950 shadow-xl border border-gray-100 mb-4 group aspect-[16/10] sm:aspect-[16/9] flex items-center justify-center cursor-pointer"
                                     @click="openLightbox(activePhotoIdx)">
                                    
                                    <!-- Ambient Glow -->
                                    <img :src="eventPhotos[activePhotoIdx]" 
                                         class="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110 pointer-events-none transition-all duration-500">
                                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none"></div>

                                    <!-- Foreground Clear Image -->
                                    <img :src="eventPhotos[activePhotoIdx]" 
                                         class="relative z-10 max-h-full max-w-full object-contain rounded-2xl transition-all duration-300">

                                    <!-- Prev / Next Floating Arrows -->
                                    <button @click.stop="activePhotoIdx = (activePhotoIdx > 0) ? activePhotoIdx - 1 : eventPhotos.length - 1" 
                                            class="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/60 hover:bg-black/90 text-white rounded-full backdrop-blur-md transition-transform hover:scale-110 border border-white/10 opacity-80 group-hover:opacity-100">
                                        <i data-lucide="chevron-left" class="w-5 h-5"></i>
                                    </button>
                                    <button @click.stop="activePhotoIdx = (activePhotoIdx < eventPhotos.length - 1) ? activePhotoIdx + 1 : 0" 
                                            class="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/60 hover:bg-black/90 text-white rounded-full backdrop-blur-md transition-transform hover:scale-110 border border-white/10 opacity-80 group-hover:opacity-100">
                                        <i data-lucide="chevron-right" class="w-5 h-5"></i>
                                    </button>

                                    <!-- Fullscreen Zoom Badge -->
                                    <div class="absolute top-4 right-4 z-20">
                                        <span class="py-1.5 px-3 rounded-full bg-black/70 backdrop-blur-md text-white text-[11px] font-bold shadow-md flex items-center gap-1.5 border border-white/10">
                                            <i data-lucide="maximize-2" class="w-3.5 h-3.5 text-lime-green"></i> Click to Enlarge
                                        </span>
                                    </div>
                                </div>

                                <!-- Horizontal Filmstrip Thumbnail Carousel -->
                                <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
                                    <template x-for="(photo, idx) in eventPhotos" :key="idx">
                                        <button @click="activePhotoIdx = idx" 
                                                :class="activePhotoIdx === idx ? 'ring-4 ring-royal-blue scale-105 opacity-100 shadow-md' : 'opacity-60 hover:opacity-100'"
                                                class="relative rounded-2xl overflow-hidden flex-shrink-0 w-24 h-16 sm:w-32 sm:h-20 bg-gray-900 transition-all duration-200">
                                            <img :src="photo" class="w-full h-full object-cover">
                                        </button>
                                    </template>
                                </div>
                            </div>
                        @endif

                        <!-- Social Share Bar & Tags -->
                        <div class="mt-12 pt-8 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                            <div class="flex items-center gap-2">
                                <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Share Story:</span>
                                <a href="https://api.whatsapp.com/send?text={{ urlencode($event->title . ' - ' . url()->current()) }}" 
                                   target="_blank" rel="noopener noreferrer" 
                                   class="flex items-center gap-1.5 px-3 py-2 bg-green-50 text-green-700 hover:bg-green-600 hover:text-white rounded-xl text-xs font-bold transition-colors">
                                    <i data-lucide="message-circle" class="w-4 h-4"></i> WhatsApp
                                </a>
                                <a href="https://twitter.com/intent/tweet?url={{ urlencode(url()->current()) }}&text={{ urlencode($event->title) }}" 
                                   target="_blank" rel="noopener noreferrer" 
                                   class="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white rounded-xl text-xs font-bold transition-colors">
                                    <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                                    <span>X (Twitter)</span>
                                </a>
                                <a href="https://www.facebook.com/sharer/sharer.php?u={{ urlencode(url()->current()) }}" 
                                   target="_blank" rel="noopener noreferrer" 
                                   class="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-royal-blue hover:bg-royal-blue hover:text-white rounded-xl text-xs font-bold transition-colors">
                                    <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                    <span>Facebook</span>
                                </a>
                                <button @click="navigator.clipboard.writeText(window.location.href); copied = true; setTimeout(() => copied = false, 2500);" 
                                        class="flex items-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl text-xs font-bold transition-colors relative">
                                    <i data-lucide="link" class="w-4 h-4"></i>
                                    <span x-text="copied ? 'Link Copied!' : 'Copy Link'"></span>
                                </button>
                            </div>

                            <a href="{{ route('home') }}#news" class="text-xs font-bold text-royal-blue hover:underline flex items-center gap-1">
                                &larr; Back to All News & Events
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Founder Quote Card -->
                <div class="bg-gradient-to-r from-royal-blue to-[#002B66] text-white p-8 sm:p-10 rounded-3xl shadow-xl relative overflow-hidden">
                    <i data-lucide="quote" class="w-24 h-24 text-white/10 absolute -bottom-4 -right-4 pointer-events-none"></i>
                    <div class="flex items-center gap-4 mb-4">
                        <img src="/uploads/file-1774602405327-507864585.webp" 
                             alt="Founder" 
                             class="w-14 h-14 rounded-full object-cover border-2 border-lime-green shadow-md">
                        <div>
                            <h4 class="font-serif font-bold text-lg leading-tight">Dr. Mrs. Elizabeth Egbetokun</h4>
                            <span class="text-xs text-lime-green font-semibold uppercase tracking-wider">Founder & President, TSSDI</span>
                        </div>
                    </div>
                    <blockquote class="text-blue-100 text-sm sm:text-base italic leading-relaxed">
                        "Every outreach represents a real family whose future is made brighter. We remain steadfast in our dedication to sustainable human capital development across Nigeria."
                    </blockquote>
                </div>

            </article>

            <!-- RIGHT COLUMN: Sidebar Widgets (4 Columns) -->
            <aside class="lg:col-span-4 space-y-8">

                <!-- 1. Support & Donate Widget -->
                <div class="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-28 h-28 bg-lime-green/10 rounded-full blur-2xl pointer-events-none"></div>
                    <div class="w-12 h-12 bg-green-50 text-lime-green rounded-2xl flex items-center justify-center mb-4">
                        <i data-lucide="heart-handshake" class="w-6 h-6"></i>
                    </div>
                    <h3 class="text-xl font-serif font-bold text-gray-900 mb-2">Partner with TSSDI</h3>
                    <p class="text-gray-600 text-xs leading-relaxed mb-6">
                        Your direct donations help fund educational scholarships, maternal healthcare kits, and vocational equipment for vulnerable families.
                    </p>

                    <div class="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-6 text-xs space-y-2">
                        <div class="flex justify-between">
                            <span class="text-gray-400 font-bold uppercase">Zenith Bank PLC</span>
                            <span class="font-bold text-royal-blue">NGN Account</span>
                        </div>
                        <div class="text-lg font-mono font-extrabold text-gray-900">1311816265</div>
                        <div class="text-[11px] text-gray-500 truncate">TEMITOPE SOCIETAL SUSTAINABILITY AND DEV INITIATIVE</div>
                    </div>

                    <a href="{{ route('donate') }}" class="w-full py-3.5 bg-lime-green text-white font-bold rounded-2xl hover:bg-green-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-100 text-sm">
                        <i data-lucide="heart" class="w-4 h-4"></i> View All Bank Accounts &rarr;
                    </a>
                </div>

                <!-- 2. Other Recent Initiatives Widget -->
                <div class="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                    <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                        <h3 class="text-lg font-serif font-bold text-gray-900">Other Initiatives</h3>
                        <a href="{{ route('home') }}#news" class="text-xs font-bold text-royal-blue hover:underline">View All</a>
                    </div>

                    <div class="space-y-5">
                        @forelse($otherEvents as $other)
                            <a href="{{ route('events.show', $other->slug) }}" class="flex gap-4 group items-center">
                                <img src="{{ $other->image_url ?: ($other->image_urls[0] ?? '/uploads/file-1774602405327-507864585.webp') }}" 
                                     alt="{{ $other->title }}" 
                                     class="w-16 h-16 rounded-2xl object-cover bg-gray-100 group-hover:scale-105 transition-transform flex-shrink-0">
                                <div>
                                    <span class="text-[11px] font-bold text-royal-blue block mb-0.5">
                                        {{ $other->event_date ? $other->event_date->format('M d, Y') : 'Outreach' }}
                                    </span>
                                    <h4 class="font-serif font-bold text-sm text-gray-900 group-hover:text-royal-blue transition-colors line-clamp-2 leading-snug">
                                        {{ $other->title }}
                                    </h4>
                                </div>
                            </a>
                        @empty
                            <p class="text-xs text-gray-400">No other events published currently.</p>
                        @endforelse
                    </div>
                </div>

                <!-- 3. Visual Gallery Preview Widget -->
                <div class="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-serif font-bold text-gray-900">Impact Gallery</h3>
                        <a href="{{ route('gallery') }}" class="text-xs font-bold text-royal-blue hover:underline">See All &rarr;</a>
                    </div>
                    <p class="text-xs text-gray-500 mb-4">Explore high-resolution captures from our nationwide community projects.</p>
                    <div class="grid grid-cols-3 gap-2">
                        <img src="/uploads/file-1774531871832-781227041.webp" class="rounded-xl aspect-square object-cover">
                        <img src="/uploads/file-1774531871832-749737790.webp" class="rounded-xl aspect-square object-cover">
                        <img src="/uploads/file-1774531871833-719121156.webp" class="rounded-xl aspect-square object-cover">
                    </div>
                </div>

                <!-- 4. Need Assistance / Contact Widget -->
                <div class="bg-gray-50 rounded-3xl p-8 border border-gray-200 text-center">
                    <div class="w-12 h-12 bg-blue-100 text-royal-blue rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <i data-lucide="help-circle" class="w-6 h-6"></i>
                    </div>
                    <h4 class="font-serif font-bold text-gray-900 text-base mb-1">Have Questions?</h4>
                    <p class="text-xs text-gray-500 mb-4 leading-relaxed">Reach out to our communications team for outreach partnership opportunities.</p>
                    <a href="mailto:support@temitopessdi.org" class="text-xs font-bold text-royal-blue hover:underline block">
                        support@temitopessdi.org
                    </a>
                </div>

            </aside>

        </div>
    </main>

    <!-- Continuous Fullscreen Lightbox Modal with Next / Previous & Keyboard Controls -->
    <div x-show="lightboxIdx !== null" x-cloak 
         class="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-8 select-none"
         @click.self="closeLightbox()">
        
        <!-- Counter Badge -->
        <div class="absolute top-6 left-6 z-50 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-bold border border-white/10">
            <span>Photo <span x-text="lightboxIdx + 1"></span> of <span x-text="allImages.length"></span></span>
        </div>

        <!-- Close Button -->
        <button @click="closeLightbox()" class="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-50 p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/10">
            <i data-lucide="x" class="w-6 h-6"></i>
        </button>

        <!-- Previous Button -->
        <button @click.stop="prevLightbox()" 
                class="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 p-3.5 sm:p-4 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all hover:scale-110 border border-white/15"
                title="Previous Photo (Left Arrow)">
            <i data-lucide="chevron-left" class="w-6 h-6 sm:w-8 sm:h-8"></i>
        </button>

        <!-- Next Button -->
        <button @click.stop="nextLightbox()" 
                class="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 p-3.5 sm:p-4 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all hover:scale-110 border border-white/15"
                title="Next Photo (Right Arrow)">
            <i data-lucide="chevron-right" class="w-6 h-6 sm:w-8 sm:h-8"></i>
        </button>

        <!-- Active Enlarged Photo -->
        <div class="max-w-5xl w-full flex flex-col items-center relative z-20">
            <template x-if="lightboxIdx !== null && allImages[lightboxIdx]">
                <img :src="allImages[lightboxIdx]" 
                     class="max-h-[85vh] w-auto max-w-full rounded-2xl shadow-2xl object-contain border border-white/10 animate-in fade-in zoom-in-95 duration-200">
            </template>
        </div>
    </div>

</div>
@endsection
