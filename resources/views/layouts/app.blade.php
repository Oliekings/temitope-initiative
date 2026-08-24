<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $siteSettings['name'] ?? 'Temitope Societal Sustainability and Development Initiative (TSSDI)' }}</title>
    
    <!-- SEO & Metadata -->
    <meta name="description" content="Temitope Societal Sustainability and Development Initiative (TSSDI) is a premier non-profit driving economic empowerment, leadership development, healthcare access, and environmental sustainability in Nigeria and globally.">
    <meta name="keywords" content="Temitope Initiative, TSSDI, NGO Nigeria, Elizabeth Egbetokun, Charity, Sustainable Development, Community Empowerment, Abuja NGO">
    <meta property="og:title" content="{{ $siteSettings['name'] ?? 'Temitope Initiative (TSSDI)' }}">
    <meta property="og:description" content="Empowering communities, driving sustainable societal growth and humanitarian progress.">
    <meta property="og:image" content="{{ $siteSettings['logoUrl'] ?? 'https://res.cloudinary.com/dfujzs9ml/image/upload/v1774493285/temitope_initiative/t653vvukb9rj1q1zdh0y.png' }}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://www.temitopessdi.org/">
    <link rel="icon" href="{{ $siteSettings['logoUrl'] ?? 'https://res.cloudinary.com/dfujzs9ml/image/upload/v1774493285/temitope_initiative/t653vvukb9rj1q1zdh0y.png' }}" type="image/png">

    <!-- Fonts & Tailwind CSS CDN for instant rendering -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>

    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'royal-blue': '#0047AB',
                        'lime-green': '#32CD32',
                        'vibrant-red': '#E62020',
                        'charcoal': '#1A1A1A',
                        'pure-white': '#FFFFFF',
                        'soft-smoke': '#F4F7FB',
                    },
                    fontFamily: {
                        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
                        serif: ['"Cinzel"', 'serif'],
                    }
                }
            }
        }
    </script>
    
    <style>
        [x-cloak] { display: none !important; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    </style>
</head>
<body class="bg-soft-smoke text-charcoal font-sans flex flex-col min-h-screen selection:bg-royal-blue selection:text-white"
      oncontextmenu="if(event.target.tagName==='IMG'||event.target.tagName==='VIDEO') event.preventDefault();"
      ondragstart="if(event.target.tagName==='IMG'||event.target.tagName==='VIDEO') event.preventDefault();">

    <!-- Navbar -->
    <header x-data="{ open: false, scrolled: false }" 
            @scroll.window="scrolled = (window.pageYOffset > 20)" 
            :class="scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-white/80 backdrop-blur-sm py-5'"
            class="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div class="max-w-7xl mx-auto px-6 flex justify-between items-center">
            <a href="{{ route('home') }}" class="flex items-center gap-3 group">
                <img src="{{ $siteSettings['logoUrl'] ?? 'https://res.cloudinary.com/dfujzs9ml/image/upload/v1774493285/temitope_initiative/t653vvukb9rj1q1zdh0y.png' }}" 
                     alt="TSSDI Logo" 
                     class="w-12 h-12 object-contain transform group-hover:scale-105 transition-transform">
                <div class="flex flex-col">
                    <span class="font-serif font-bold text-lg leading-tight tracking-wide text-royal-blue">TEMITOPE</span>
                    <span class="text-[10px] tracking-widest text-gray-500 font-bold uppercase">Initiative (TSSDI)</span>
                </div>
            </a>

            <!-- Desktop Nav -->
            <nav class="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-700">
                <a href="{{ route('home') }}#about" class="hover:text-royal-blue transition-colors">About Us</a>
                <a href="{{ route('home') }}#pillars" class="hover:text-royal-blue transition-colors">Our Pillars</a>
                <a href="{{ route('home') }}#team" class="hover:text-royal-blue transition-colors">Leadership</a>
                <a href="{{ route('home') }}#news" class="hover:text-royal-blue transition-colors">News & Events</a>
                <a href="{{ route('gallery') }}" class="hover:text-royal-blue transition-colors">Impact Gallery</a>
                <a href="{{ route('donate') }}" class="py-2.5 px-6 bg-lime-green text-white rounded-full font-bold hover:bg-green-600 transition-all shadow-md hover:shadow-lg">
                    Donate Now
                </a>
            </nav>

            <!-- Mobile Hamburger -->
            <button @click="open = !open" class="md:hidden p-2 text-gray-700 hover:text-royal-blue">
                <i data-lucide="menu" class="w-6 h-6"></i>
            </button>
        </div>

        <!-- Mobile Menu Dropdown -->
        <div x-show="open" x-cloak @click.away="open = false" 
             x-transition:enter="transition ease-out duration-200"
             x-transition:enter-start="opacity-0 -translate-y-4"
             x-transition:enter-end="opacity-100 translate-y-0"
             x-transition:leave="transition ease-in duration-150"
             x-transition:leave-start="opacity-100 translate-y-0"
             x-transition:leave-end="opacity-0 -translate-y-4"
             class="md:hidden bg-white border-t border-gray-100 px-6 py-6 space-y-4 shadow-xl">
            <a href="{{ route('home') }}#about" @click="open = false" class="block text-gray-800 font-medium py-2">About Us</a>
            <a href="{{ route('home') }}#pillars" @click="open = false" class="block text-gray-800 font-medium py-2">Our Pillars</a>
            <a href="{{ route('home') }}#team" @click="open = false" class="block text-gray-800 font-medium py-2">Leadership</a>
            <a href="{{ route('home') }}#news" @click="open = false" class="block text-gray-800 font-medium py-2">News & Events</a>
            <a href="{{ route('gallery') }}" @click="open = false" class="block text-gray-800 font-medium py-2">Impact Gallery</a>
            <a href="{{ route('donate') }}" @click="open = false" class="block text-center py-3 bg-lime-green text-white font-bold rounded-xl shadow-md">
                Donate Now
            </a>
        </div>
    </header>

    <main class="flex-grow">
        @yield('content')
    </main>

    <!-- Footer -->
    <footer class="bg-royal-blue text-white py-16">
        <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
            <div class="col-span-1 md:col-span-2">
                <div class="flex items-center gap-3 mb-6">
                    <img src="{{ $siteSettings['logoUrl'] ?? 'https://res.cloudinary.com/dfujzs9ml/image/upload/v1774493285/temitope_initiative/t653vvukb9rj1q1zdh0y.png' }}" 
                         alt="TSSDI Logo" 
                         class="w-12 h-12 object-contain bg-white rounded-full p-1">
                    <div>
                        <span class="font-serif font-bold text-xl block leading-tight">TEMITOPE INITIATIVE</span>
                        <span class="text-xs text-blue-200 uppercase tracking-wider">Societal Sustainability and Development</span>
                    </div>
                </div>
                <p class="text-blue-100 max-w-md text-sm leading-relaxed mb-6">
                    Empowering individuals and vulnerable communities through sustainable development, education, economic empowerment, and compassionate humanitarian support.
                </p>
                <div class="flex items-center gap-4 text-blue-200">
                    <a href="https://facebook.com" target="_blank" rel="noopener" class="p-2.5 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-white" aria-label="Facebook">
                        <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener" class="p-2.5 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-white" aria-label="Instagram">
                        <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener" class="p-2.5 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-white" aria-label="X Twitter">
                        <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener" class="p-2.5 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-white" aria-label="LinkedIn">
                        <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    </a>
                </div>
            </div>

            <!-- Quick Links (Zero admin links visible to guests) -->
            <div>
                <h4 class="font-serif font-bold text-lg mb-4 text-white">Quick Links</h4>
                <ul class="space-y-2 text-sm text-blue-100">
                    <li><a href="{{ route('home') }}#about" class="hover:text-white transition-colors">About Us</a></li>
                    <li><a href="{{ route('home') }}#pillars" class="hover:text-white transition-colors">Our Focus Areas</a></li>
                    <li><a href="{{ route('home') }}#team" class="hover:text-white transition-colors">Our Leadership</a></li>
                    <li><a href="{{ route('gallery') }}" class="hover:text-white transition-colors">Impact Gallery</a></li>
                    <li><a href="{{ route('donate') }}" class="hover:text-white transition-colors">Donate & Partner</a></li>
                </ul>
            </div>

            <!-- Newsletter -->
            <div x-data="{ email: '', status: '', message: '' }">
                <h4 class="font-serif font-bold text-lg mb-4 text-white">Newsletter</h4>
                <p class="text-sm text-blue-100 mb-4 leading-relaxed">
                    Subscribe for quarterly progress reports and community updates.
                </p>
                <form @submit.prevent="
                    fetch('/api/subscribers', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                        body: JSON.stringify({ email: email })
                    })
                    .then(res => res.json())
                    .then(data => {
                        status = 'success';
                        message = 'Thank you for subscribing!';
                        email = '';
                        setTimeout(() => status = '', 4000);
                    })
                    .catch(() => {
                        status = 'error';
                        message = 'Subscription failed. Please try again.';
                    });
                " class="space-y-3">
                    <input type="email" x-model="email" required placeholder="Your email address" 
                           class="w-full p-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-200 text-sm focus:outline-none focus:bg-white/20 focus:border-white">
                    <button type="submit" class="w-full py-3 bg-lime-green text-white font-bold rounded-xl text-sm hover:bg-green-600 transition-colors shadow-md">
                        Subscribe Now
                    </button>
                    <p x-show="status === 'success'" x-text="message" class="text-xs text-lime-green font-semibold mt-2"></p>
                    <p x-show="status === 'error'" x-text="message" class="text-xs text-vibrant-red font-semibold mt-2"></p>
                </form>
            </div>
        </div>

        <div class="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-blue-200">
            <div>
                &copy; {{ date('Y') }} Temitope Societal Sustainability and Development Initiative (TSSDI). All Rights Reserved.
            </div>
            <div class="text-blue-200 font-medium text-center sm:text-right">
                Designed, Developed & Media Managed with <span class="text-vibrant-red">&#9829;</span> for perfection by 
                <a href="https://surprisemfstech.com" target="_blank" rel="noopener noreferrer" class="text-white font-bold hover:text-lime-green underline transition-colors">
                    Surprise-MFs Tech
                </a>
            </div>
        </div>
    </footer>

    <script>
        lucide.createIcons();
    </script>
</body>
</html>
