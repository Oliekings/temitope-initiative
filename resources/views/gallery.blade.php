@extends('layouts.app')

@section('content')
<section class="min-h-screen bg-soft-smoke pt-36 pb-24" 
         x-data="{ 
             currentIdx: null, 
             galleryList: {{ json_encode($images->map(fn($img) => ['url' => $img->image_url, 'title' => $img->title, 'desc' => $img->description])->values()) }},
             openLightbox(idx) {
                 this.currentIdx = idx;
             },
             nextPhoto() {
                 if (this.currentIdx !== null) {
                     this.currentIdx = (this.currentIdx < this.galleryList.length - 1) ? this.currentIdx + 1 : 0;
                 }
             },
             prevPhoto() {
                 if (this.currentIdx !== null) {
                     this.currentIdx = (this.currentIdx > 0) ? this.currentIdx - 1 : this.galleryList.length - 1;
                 }
             },
             closeLightbox() {
                 this.currentIdx = null;
             }
         }"
         @keydown.window.arrow-right="nextPhoto()"
         @keydown.window.arrow-left="prevPhoto()"
         @keydown.window.escape="closeLightbox()">
    <div class="max-w-7xl mx-auto px-6">
        <div class="text-center max-w-3xl mx-auto mb-16">
            <span class="text-royal-blue font-bold text-xs uppercase tracking-widest block mb-2">Our Impact In Photos</span>
            <h1 class="text-4xl sm:text-5xl font-serif font-bold text-gray-900 mb-4">Visual Journey of Impact</h1>
            <p class="text-gray-600 text-lg leading-relaxed mb-3">
                Explore our grassroots community initiatives, maternal medical outreaches, leadership milestones, and empowerment programs.
            </p>
            <p class="text-xs font-semibold text-gray-400">
                Official Media & IT Documentation managed by <a href="https://surprisemfstech.com" target="_blank" rel="noopener noreferrer" class="text-royal-blue hover:underline font-bold">Surprise-MFs Tech</a>
            </p>
        </div>

        @if($images->isEmpty())
            <div class="text-center py-20 bg-white rounded-3xl shadow-sm">
                <p class="text-gray-500">No images uploaded to the gallery yet.</p>
            </div>
        @else
            <!-- Gallery Grid (30 images per page) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
                @foreach($images as $idx => $img)
                    <div @click="openLightbox({{ $idx }})" 
                         class="group relative rounded-3xl overflow-hidden cursor-pointer aspect-square bg-gray-200 shadow-sm hover:shadow-2xl transition-all duration-300">
                        <img src="{{ $img->image_url }}" alt="{{ $img->title }}" 
                             class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 select-none pointer-events-none"
                             loading="lazy">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-6">
                            <div class="self-end">
                                <span class="p-2 bg-white/20 backdrop-blur-md rounded-full text-white inline-block">
                                    <i data-lucide="maximize-2" class="w-4 h-4"></i>
                                </span>
                            </div>
                            <div>
                                <span class="text-white font-serif font-bold text-base mb-1 block">{{ $img->title }}</span>
                                @if($img->description)
                                    <p class="text-white/80 text-xs line-clamp-2">{{ $img->description }}</p>
                                @endif
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>

            <!-- Custom Styled Pagination Bar -->
            @if($images->hasPages())
                <div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white rounded-3xl shadow-sm border border-gray-100 mb-12">
                    <div class="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Showing {{ $images->firstItem() }} &ndash; {{ $images->lastItem() }} of {{ $images->total() }} Outreach Photos
                    </div>
                    
                    <div class="flex items-center gap-2">
                        {{-- Previous Page Link --}}
                        @if ($images->onFirstPage())
                            <span class="px-4 py-2 bg-gray-100 text-gray-400 font-bold rounded-xl text-xs cursor-not-allowed">
                                &larr; Previous
                            </span>
                        @else
                            <a href="{{ $images->previousPageUrl() }}" class="px-4 py-2 bg-royal-blue text-white font-bold rounded-xl text-xs hover:bg-blue-800 transition-colors shadow-sm">
                                &larr; Previous
                            </a>
                        @endif

                        {{-- Page Number Badges --}}
                        <div class="flex items-center gap-1.5 px-2">
                            @foreach ($images->getUrlRange(1, $images->lastPage()) as $page => $url)
                                @if ($page == $images->currentPage())
                                    <span class="w-8 h-8 flex items-center justify-center bg-royal-blue text-white font-bold rounded-xl text-xs shadow-md">
                                        {{ $page }}
                                    </span>
                                @else
                                    <a href="{{ $url }}" class="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors">
                                        {{ $page }}
                                    </a>
                                @endif
                            @endforeach
                        </div>

                        {{-- Next Page Link --}}
                        @if ($images->hasMorePages())
                            <a href="{{ $images->nextPageUrl() }}" class="px-4 py-2 bg-royal-blue text-white font-bold rounded-xl text-xs hover:bg-blue-800 transition-colors shadow-sm">
                                Next &rarr;
                            </a>
                        @else
                            <span class="px-4 py-2 bg-gray-100 text-gray-400 font-bold rounded-xl text-xs cursor-not-allowed">
                                Next &rarr;
                            </span>
                        @endif
                    </div>
                </div>
            @endif
        @endif

        <!-- Continuous Fullscreen Lightbox Modal with Next / Previous & Keyboard Navigation -->
        <div x-show="currentIdx !== null" x-cloak 
             class="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-8 select-none"
             @click.self="closeLightbox()">
            
            <!-- Top Controls (Counter & Close) -->
            <div class="absolute top-6 left-6 z-50 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-bold border border-white/10">
                <span>Photo <span x-text="currentIdx + 1"></span> of <span x-text="galleryList.length"></span></span>
            </div>

            <button @click="closeLightbox()" class="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-50 p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/10">
                <i data-lucide="x" class="w-6 h-6"></i>
            </button>

            <!-- Previous Photo Button -->
            <button @click.stop="prevPhoto()" 
                    class="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 p-3.5 sm:p-4 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all hover:scale-110 border border-white/15"
                    title="Previous Photo (Left Arrow)">
                <i data-lucide="chevron-left" class="w-6 h-6 sm:w-8 sm:h-8"></i>
            </button>

            <!-- Next Photo Button -->
            <button @click.stop="nextPhoto()" 
                    class="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 p-3.5 sm:p-4 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all hover:scale-110 border border-white/15"
                    title="Next Photo (Right Arrow)">
                <i data-lucide="chevron-right" class="w-6 h-6 sm:w-8 sm:h-8"></i>
            </button>

            <!-- Active Enlarged Photo Stage -->
            <div class="max-w-5xl w-full flex flex-col items-center relative z-20">
                <template x-if="currentIdx !== null && galleryList[currentIdx]">
                    <div class="flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
                        <img :src="galleryList[currentIdx].url" 
                             class="max-h-[75vh] w-auto max-w-full rounded-2xl shadow-2xl object-contain border border-white/10">
                        
                        <div class="mt-6 text-center text-white max-w-2xl px-4">
                            <h3 class="font-serif font-bold text-2xl mb-1.5" x-text="galleryList[currentIdx].title"></h3>
                            <p class="text-blue-100 text-sm leading-relaxed" x-text="galleryList[currentIdx].desc || ''"></p>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</section>
@endsection
