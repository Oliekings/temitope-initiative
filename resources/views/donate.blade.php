@extends('layouts.app')

@section('content')
<!-- Donation Hero -->
<section class="relative pt-36 pb-20 bg-gradient-to-br from-royal-blue via-[#003380] to-charcoal text-white overflow-hidden">
    <div class="max-w-7xl mx-auto px-6 text-center relative z-10">
        <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest text-lime-green mb-6">
            <i data-lucide="heart" class="w-4 h-4 text-lime-green"></i> Support Our Humanitarian Mission
        </span>
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold mb-6 leading-tight">
            Partner With Us to <span class="text-lime-green">Transform Lives</span>
        </h1>
        <p class="text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed">
            Your generous contributions directly fund community empowerment outreaches, healthcare supplies, scholarships, and sustainable development initiatives across Nigeria.
        </p>
    </div>
</section>

<!-- Official Donation Details -->
<section class="py-20 bg-soft-smoke">
    <div class="max-w-4xl mx-auto px-6">
        <div class="bg-white text-gray-900 rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100 mb-16">
            <div class="flex items-center justify-between border-b border-gray-100 pb-6 mb-8">
                <div class="flex items-center gap-4">
                    <div class="p-3.5 bg-red-50 text-vibrant-red rounded-2xl">
                        <i data-lucide="building-2" class="w-8 h-8"></i>
                    </div>
                    <div>
                        <div class="text-xs font-bold text-gray-400 uppercase tracking-widest">Bank Partner</div>
                        <h2 class="text-2xl sm:text-3xl font-serif font-bold text-gray-900">{{ $bankSettings['bank_name'] ?? 'ZENITH BANK PLC' }}</h2>
                    </div>
                </div>
                <span class="px-4 py-2 bg-green-100 text-green-800 text-xs font-bold rounded-full uppercase tracking-wider">
                    Verified NGO Account
                </span>
            </div>

            <!-- Official Account Name -->
            <div class="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-8">
                <div class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Official Account Name</div>
                <div class="text-lg md:text-2xl font-serif font-bold text-royal-blue">
                    {{ $bankSettings['account_name'] ?? 'TEMITOPE SOCIETAL SUSTAINABILITY AND DEVELOPMENT INITIATIVE (TSSDI)' }}
                </div>
            </div>

            <!-- Accounts Grid (NGN & USD) -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <!-- NGN Account -->
                <div class="p-8 rounded-3xl bg-blue-50/70 border border-blue-100 flex flex-col justify-between"
                     x-data="{ copied: false }">
                    <div>
                        <div class="flex items-center justify-between mb-3">
                            <span class="text-xs font-bold text-royal-blue uppercase tracking-widest">NGN Account (Naira)</span>
                            <span class="text-xs font-semibold px-2.5 py-0.5 bg-royal-blue text-white rounded-full">Local Transfers</span>
                        </div>
                        <div class="text-3xl sm:text-4xl font-mono font-extrabold text-gray-900 tracking-wider mb-2">{{ $bankSettings['account_number_ngn'] ?? '1311816265' }}</div>
                        <p class="text-xs text-gray-500">For transfers within Nigeria via Mobile Banking, USSD, or Bank Branch.</p>
                    </div>
                    <button @click="navigator.clipboard.writeText('{{ $bankSettings['account_number_ngn'] ?? '1311816265' }}'); copied = true; setTimeout(() => copied = false, 2500);" 
                            class="mt-6 w-full py-3.5 bg-royal-blue text-white rounded-xl font-bold text-sm hover:bg-blue-800 transition-all flex items-center justify-center gap-2 shadow-md">
                        <i data-lucide="copy" class="w-4 h-4"></i>
                        <span x-text="copied ? 'Copied NGN Account Number!' : 'Copy NGN Account Number'"></span>
                    </button>
                </div>

                <!-- USD Account -->
                <div class="p-8 rounded-3xl bg-green-50/70 border border-green-100 flex flex-col justify-between"
                     x-data="{ copied: false }">
                    <div>
                        <div class="flex items-center justify-between mb-3">
                            <span class="text-xs font-bold text-green-800 uppercase tracking-widest">USD Account (Dollars)</span>
                            <span class="text-xs font-semibold px-2.5 py-0.5 bg-lime-green text-white rounded-full">International Wire</span>
                        </div>
                        <div class="text-3xl sm:text-4xl font-mono font-extrabold text-gray-900 tracking-wider mb-2">{{ $bankSettings['account_number_usd'] ?? '5075911468' }}</div>
                        <p class="text-xs text-gray-500">For international diaspora wire transfers and foreign donations.</p>
                    </div>
                    <button @click="navigator.clipboard.writeText('{{ $bankSettings['account_number_usd'] ?? '5075911468' }}'); copied = true; setTimeout(() => copied = false, 2500);" 
                            class="mt-6 w-full py-3.5 bg-lime-green text-white rounded-xl font-bold text-sm hover:bg-green-600 transition-all flex items-center justify-center gap-2 shadow-md">
                        <i data-lucide="copy" class="w-4 h-4"></i>
                        <span x-text="copied ? 'Copied USD Account Number!' : 'Copy USD Account Number'"></span>
                    </button>
                </div>
            </div>

            <!-- International Wire Details -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-gray-100 text-sm bg-gray-50/50 p-6 rounded-2xl">
                <div>
                    <div class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">SWIFT Code</div>
                    <div class="font-mono font-bold text-gray-900 text-base">{{ $bankSettings['swift_code'] ?? 'ZEIBNGLA' }}</div>
                </div>
                <div>
                    <div class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Sort Code</div>
                    <div class="font-mono font-bold text-gray-900 text-base">{{ $bankSettings['sort_code'] ?? '057080277' }}</div>
                </div>
                <div>
                    <div class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Bank Branch</div>
                    <div class="font-semibold text-gray-900 text-base">{{ $bankSettings['branch'] ?? 'KEBBI HOUSE BRANCH' }}</div>
                </div>
            </div>
        </div>

        <!-- How Your Donation Helps -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
                <div class="w-14 h-14 bg-blue-50 text-royal-blue rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <i data-lucide="book-open" class="w-6 h-6"></i>
                </div>
                <h3 class="font-serif font-bold text-lg text-gray-900 mb-2">Education & Scholarships</h3>
                <p class="text-gray-600 text-xs leading-relaxed">Providing school kits, tuition support, and learning materials to underprivileged children.</p>
            </div>

            <div class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
                <div class="w-14 h-14 bg-green-50 text-lime-green rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <i data-lucide="activity" class="w-6 h-6"></i>
                </div>
                <h3 class="font-serif font-bold text-lg text-gray-900 mb-2">Maternal & Community Health</h3>
                <p class="text-gray-600 text-xs leading-relaxed">Free medical checkups, maternal healthcare kits, and essential drugs in remote areas.</p>
            </div>

            <div class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
                <div class="w-14 h-14 bg-red-50 text-vibrant-red rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <i data-lucide="award" class="w-6 h-6"></i>
                </div>
                <h3 class="font-serif font-bold text-lg text-gray-900 mb-2">Women & Youth Empowerment</h3>
                <p class="text-gray-600 text-xs leading-relaxed">Vocational equipment, micro-grants, and entrepreneurship mentorship for sustainable income.</p>
            </div>
        </div>
    </div>
</section>
@endsection
