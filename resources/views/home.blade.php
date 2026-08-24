@extends('layouts.app')

@section('content')
<!-- Hero Section with Full Parallax Background Image -->
<section class="relative min-h-[90vh] flex items-center justify-center pt-36 pb-24 overflow-hidden bg-soft-smoke">
    <!-- Background Image with Soft Smoke Gradient Overlay -->
    <div class="absolute inset-0 z-0 pointer-events-none">
        <img src="https://res.cloudinary.com/dfujzs9ml/image/upload/v1774492823/CI0A5441_mbne9q.jpg" 
             alt="Community Development" 
             class="w-full h-full object-cover opacity-25">
        <div class="absolute inset-0 bg-gradient-to-r from-soft-smoke via-soft-smoke/85 to-soft-smoke/40"></div>
    </div>
    
    <div class="max-w-7xl mx-auto px-6 relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
            <div class="inline-block px-4 py-1.5 rounded-full bg-royal-blue/10 text-royal-blue font-semibold text-xs tracking-widest uppercase mb-6">
                Visionary Leadership
            </div>
            
            <h1 class="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-gray-900 leading-[1.1] mb-6">
                Empowering <br/>
                <span class="text-royal-blue italic">Societal</span> <br/>
                Development.
            </h1>
            
            <p class="text-gray-600 text-lg sm:text-xl mb-10 leading-relaxed max-w-xl">
                Temitope Societal Sustainability and Development Initiative (Temitope Initiative) is dedicated to fostering global synergy, economic empowerment, and peace building.
            </p>
            
            <div class="flex flex-wrap gap-4">
                <a href="#about" class="py-4 px-8 bg-royal-blue text-white font-bold rounded-full shadow-lg shadow-royal-blue/30 hover:bg-blue-800 transition-all text-center">
                    Discover Our Impact
                </a>
                <a href="{{ route('donate') }}" class="py-4 px-8 bg-white text-gray-900 font-bold rounded-full shadow-sm border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all text-center">
                    Partner / Donate
                </a>
            </div>
        </div>

        <!-- Founder Image Showcase -->
        <div class="relative hidden lg:block h-[580px]">
            <div class="absolute inset-0 bg-gradient-to-tr from-royal-blue/20 to-transparent rounded-3xl transform rotate-3 scale-105"></div>
            <img src="/uploads/file-1774602405327-507864585.webp" 
                 alt="Founder - Dr. Mrs. Elizabeth Egbetokun" 
                 onerror="if(this.src!=='https://res.cloudinary.com/dfujzs9ml/image/upload/v1774602830/dr-mrs-elizabeth-egbetokun_hsrvuj.jpg') this.src='https://res.cloudinary.com/dfujzs9ml/image/upload/v1774602830/dr-mrs-elizabeth-egbetokun_hsrvuj.jpg';"
                 class="w-full h-full object-cover rounded-3xl shadow-2xl relative z-10 bg-gray-100">
            
            <!-- Floating 10+ Years Badge -->
            <div class="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-2xl z-20 max-w-[250px] border border-gray-100">
                <div class="text-4xl font-serif font-bold text-vibrant-red mb-1">10+</div>
                <div class="text-xs font-semibold text-gray-600 leading-snug">Years of driving sustainable global impact and community empowerment.</div>
            </div>
        </div>
    </div>
</section>

<!-- About Section -->
<section id="about" class="py-24 bg-white">
    <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
            <span class="text-vibrant-red font-bold text-xs uppercase tracking-widest block mb-2">Our Foundation</span>
            <h2 class="text-4xl font-serif font-bold text-gray-900 mb-6 leading-tight">
                Compassionate Leadership for Long-Term Societal Progress
            </h2>
            <p class="text-gray-600 leading-relaxed mb-6">
                Founded under the visionary leadership of <strong>Dr. Mrs. Elizabeth Egbetokun</strong>, the Temitope Societal Sustainability and Development Initiative (TSSDI) is dedicated to addressing systemic socioeconomic disparities across Nigeria.
            </p>
            <p class="text-gray-600 leading-relaxed mb-8">
                Through grassroots interventions, medical outreaches, leadership development, and vocational training, TSSDI creates self-sustaining pathways that lift vulnerable families into dignity and long-term independence.
            </p>
            
            <div class="grid grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                <div>
                    <div class="text-3xl font-serif font-bold text-royal-blue mb-1">100%</div>
                    <div class="text-xs text-gray-500 uppercase font-semibold">Community-Driven Action</div>
                </div>
                <div>
                    <div class="text-3xl font-serif font-bold text-lime-green mb-1">36+</div>
                    <div class="text-xs text-gray-500 uppercase font-semibold">Empowerment Outreaches</div>
                </div>
            </div>
        </div>

        <div class="relative">
            <img src="/uploads/file-1774531871831-405746903.webp" 
                 alt="TSSDI Mission in Action" 
                 class="rounded-3xl shadow-2xl w-full h-[480px] object-cover">
            <div class="absolute inset-0 rounded-3xl bg-gradient-to-t from-royal-blue/60 via-transparent to-transparent"></div>
            <div class="absolute bottom-8 left-8 right-8 text-white">
                <blockquote class="font-serif italic text-lg leading-snug mb-2">
                    "Service to humanity is the greatest legacy anyone can build."
                </blockquote>
                <div class="text-xs font-bold text-lime-green uppercase tracking-wider">— Dr. Mrs. Elizabeth Egbetokun</div>
            </div>
        </div>
    </div>
</section>

<!-- Pillars Section -->
<section id="pillars" class="py-24 bg-soft-smoke">
    <div class="max-w-7xl mx-auto px-6 text-center max-w-2xl mx-auto mb-16">
        <span class="text-royal-blue font-bold text-xs uppercase tracking-widest block mb-2">Our Key Pillars</span>
        <h2 class="text-4xl font-serif font-bold text-gray-900 mb-4">Strategic Focus Areas</h2>
        <p class="text-gray-600">Addressing the critical pillars necessary for comprehensive community sustainability.</p>
    </div>

    <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div class="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
            <div class="w-14 h-14 bg-blue-50 text-royal-blue rounded-2xl flex items-center justify-center mb-6 group-hover:bg-royal-blue group-hover:text-white transition-colors">
                <i data-lucide="briefcase" class="w-6 h-6"></i>
            </div>
            <h3 class="font-serif font-bold text-xl mb-3 text-gray-900">Economic Empowerment</h3>
            <p class="text-gray-600 text-sm leading-relaxed">Vocational skills, micro-grants, and entrepreneurship toolkits for women and youth.</p>
        </div>

        <div class="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
            <div class="w-14 h-14 bg-green-50 text-lime-green rounded-2xl flex items-center justify-center mb-6 group-hover:bg-lime-green group-hover:text-white transition-colors">
                <i data-lucide="book-open" class="w-6 h-6"></i>
            </div>
            <h3 class="font-serif font-bold text-xl mb-3 text-gray-900">Education & Advocacy</h3>
            <p class="text-gray-600 text-sm leading-relaxed">Scholarships, school infrastructure support, and civic rights mentorship in rural hubs.</p>
        </div>

        <div class="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
            <div class="w-14 h-14 bg-red-50 text-vibrant-red rounded-2xl flex items-center justify-center mb-6 group-hover:bg-vibrant-red group-hover:text-white transition-colors">
                <i data-lucide="activity" class="w-6 h-6"></i>
            </div>
            <h3 class="font-serif font-bold text-xl mb-3 text-gray-900">Health & Wellness</h3>
            <p class="text-gray-600 text-sm leading-relaxed">Maternal healthcare, free medical diagnostics, vital drug distribution, and health education.</p>
        </div>

        <div class="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
            <div class="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <i data-lucide="leaf" class="w-6 h-6"></i>
            </div>
            <h3 class="font-serif font-bold text-xl mb-3 text-gray-900">Environmental Stewardship</h3>
            <p class="text-gray-600 text-sm leading-relaxed">Promoting clean community environments, tree planting, waste recycling, and climate resilience.</p>
        </div>
    </div>
</section>

<!-- Leadership Team Section -->
<section id="team" class="py-24 bg-white" x-data="{ selectedMember: null }">
    <div class="max-w-7xl mx-auto px-6">
        <div class="text-center max-w-2xl mx-auto mb-16">
            <span class="text-royal-blue font-bold text-xs uppercase tracking-widest block mb-2">Executive Leadership</span>
            <h2 class="text-4xl font-serif font-bold text-gray-900 mb-4">Our Leadership</h2>
            <p class="text-gray-600 text-lg">Meet the visionaries driving sustainable development and global synergy.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            @foreach($team as $member)
                <div @click="selectedMember = {{ json_encode($member) }}" 
                     class="group cursor-pointer bg-soft-smoke rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col">
                    <div class="aspect-[4/5] relative overflow-hidden bg-gray-200">
                        <img src="{{ $member->image_url ?: '/uploads/file-1774602405327-507864585.webp' }}" 
                             alt="{{ $member->name }}" 
                             class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700">
                        @if($member->is_founder)
                            <div class="absolute top-4 right-4 bg-royal-blue text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                Founder
                            </div>
                        @endif
                    </div>
                    <div class="p-6 text-center flex-grow flex flex-col justify-center">
                        <h3 class="text-lg font-serif font-bold text-gray-900 mb-1 group-hover:text-royal-blue transition-colors">{{ $member->name }}</h3>
                        <p class="text-vibrant-red font-semibold text-xs uppercase tracking-wider">{{ $member->role }}</p>
                    </div>
                </div>
            @endforeach
        </div>

        <!-- Leadership Modal -->
        <div x-show="selectedMember" x-cloak 
             class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
             @click.self="selectedMember = null">
            <div class="bg-white rounded-3xl overflow-hidden max-w-3xl w-full shadow-2xl flex flex-col md:flex-row max-h-[90vh] relative animate-in fade-in zoom-in-95 duration-200">
                <button @click="selectedMember = null" class="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors z-20">
                    <i data-lucide="x" class="w-5 h-5 text-gray-700"></i>
                </button>
                <div class="w-full md:w-2/5 h-64 md:h-auto bg-gray-100">
                    <img :src="selectedMember?.image_url || '/uploads/file-1774602405327-507864585.webp'" 
                         :alt="selectedMember?.name" 
                         class="w-full h-full object-cover">
                </div>
                <div class="w-full md:w-3/5 p-8 md:p-10 overflow-y-auto">
                    <span x-show="selectedMember?.is_founder" class="text-royal-blue font-bold text-xs uppercase tracking-widest mb-1 block">Founder & Visionary</span>
                    <h3 class="text-2xl font-serif font-bold text-gray-900 mb-1" x-text="selectedMember?.name"></h3>
                    <p class="text-vibrant-red font-medium text-sm mb-6" x-text="selectedMember?.role"></p>
                    <div class="text-gray-600 text-sm leading-relaxed whitespace-pre-line" x-text="selectedMember?.bio"></div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- News & Events Section -->
<section id="news" class="py-24 bg-soft-smoke">
    <div class="max-w-7xl mx-auto px-6">
        <div class="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
                <span class="text-lime-green font-bold text-xs uppercase tracking-widest block mb-2">Our Activity</span>
                <h2 class="text-4xl font-serif font-bold text-gray-900 mb-3">Latest Initiatives & Updates</h2>
                <p class="text-gray-600">Stay updated on our recent community outreach programs and upcoming events.</p>
            </div>
        </div>

        @if($events->isEmpty())
            <div class="text-center py-16 bg-white rounded-3xl shadow-sm">
                <p class="text-gray-500">No new events posted right now. Please check back soon!</p>
            </div>
        @else
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                @foreach($events as $evt)
                    <a href="{{ route('events.show', $evt->slug) }}" 
                       class="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col hover:-translate-y-1.5 border border-gray-100">
                        <div class="h-56 overflow-hidden relative bg-gray-100">
                            <img src="{{ $evt->image_url ?: ($evt->image_urls[0] ?? '/uploads/file-1774602405327-507864585.webp') }}" 
                                 alt="{{ $evt->title }}" 
                                 class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                            <div class="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3.5 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold text-royal-blue shadow-sm">
                                <i data-lucide="calendar" class="w-3.5 h-3.5"></i>
                                {{ $evt->event_date ? $evt->event_date->format('M d, Y') : 'Upcoming' }}
                            </div>
                        </div>
                        <div class="p-8 flex-grow flex flex-col">
                            <h3 class="text-xl font-serif font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-royal-blue transition-colors">{{ $evt->title }}</h3>
                            <p class="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">{{ $evt->description }}</p>
                            <div class="flex items-center gap-2 text-royal-blue font-bold text-sm group-hover:text-blue-800 transition-colors mt-auto">
                                <span>Read Full Story</span>
                                <i data-lucide="arrow-right" class="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform"></i>
                            </div>
                        </div>
                    </a>
                @endforeach
            </div>
        @endif
    </div>
</section>

<!-- Impact Gallery Preview Section -->
<section id="gallery-preview" class="py-24 bg-white" x-data="{ lightbox: null }">
    <div class="max-w-7xl mx-auto px-6">
        <div class="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
                <span class="text-royal-blue font-bold text-xs uppercase tracking-widest block mb-2">Visual Journey</span>
                <h2 class="text-4xl font-serif font-bold text-gray-900 mb-3">Impact Gallery</h2>
                <p class="text-gray-600">Visual stories of empowerment, leadership, and community development.</p>
            </div>
            <a href="{{ route('gallery') }}" class="py-2.5 px-6 border-2 border-royal-blue text-royal-blue font-bold rounded-full text-sm hover:bg-royal-blue hover:text-white transition-colors">
                View All Gallery Photos &rarr;
            </a>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
            @foreach($gallery as $img)
                <div @click="lightbox = '{{ $img->image_url }}'" class="group relative rounded-3xl overflow-hidden cursor-pointer aspect-video bg-gray-100 shadow-sm hover:shadow-xl transition-all">
                    <img src="{{ $img->image_url }}" alt="{{ $img->title }}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                        <span class="text-white font-serif font-semibold text-sm">{{ $img->title }}</span>
                    </div>
                </div>
            @endforeach
        </div>

        <!-- Lightbox -->
        <div x-show="lightbox" x-cloak 
             class="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
             @click.self="lightbox = null">
            <button @click="lightbox = null" class="absolute top-6 right-6 text-white hover:text-gray-300">
                <i data-lucide="x" class="w-8 h-8"></i>
            </button>
            <img :src="lightbox" class="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain">
        </div>
    </div>
</section>

<!-- Donation CTA Banner -->
<section class="py-20 bg-gradient-to-br from-royal-blue to-[#002255] text-white text-center">
    <div class="max-w-4xl mx-auto px-6">
        <h2 class="text-4xl sm:text-5xl font-serif font-bold mb-4">Support Our Impact</h2>
        <p class="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Your contributions directly fund scholarships, healthcare supplies, and vocational training across underserved communities.
        </p>
        <a href="{{ route('donate') }}" class="py-4 px-10 bg-lime-green text-white font-bold text-lg rounded-2xl hover:bg-green-600 transition-all shadow-xl hover:shadow-lime-green/30 inline-flex items-center gap-2">
            <i data-lucide="heart" class="w-5 h-5"></i> View Official Donation Accounts
        </a>
    </div>
</section>
@endsection
