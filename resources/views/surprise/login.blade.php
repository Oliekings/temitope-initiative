@extends('layouts.app')

@section('content')
<section class="min-h-screen bg-soft-smoke flex items-center justify-center pt-32 pb-24 px-4">
    <div class="bg-white p-10 md:p-12 rounded-3xl shadow-xl max-w-md w-full border border-gray-100">
        <div class="text-center mb-8">
            <img src="{{ $siteSettings['logoUrl'] ?? 'https://res.cloudinary.com/dfujzs9ml/image/upload/v1774493285/temitope_initiative/t653vvukb9rj1q1zdh0y.png' }}" 
                 alt="Logo" 
                 class="w-16 h-16 mx-auto mb-4 object-contain">
            <h1 class="text-3xl font-serif font-bold text-gray-900 mb-2">Admin Command Center</h1>
            <p class="text-gray-500 text-sm">Sign in to manage TSSDI events, leadership team bios, gallery, and site settings.</p>
        </div>

        @if(session('error'))
            <div class="mb-6 p-4 rounded-2xl bg-red-50 text-vibrant-red border border-red-200 text-sm font-semibold text-center">
                {{ session('error') }}
            </div>
        @endif

        <form action="{{ route('admin.login') }}" method="POST" class="space-y-4 text-left">
            @csrf
            <div>
                <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Username</label>
                <input type="text" name="username" required placeholder="Admin username" 
                       class="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-royal-blue outline-none transition-all font-medium text-sm">
            </div>
            <div>
                <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Password</label>
                <input type="password" name="password" required placeholder="Admin password" 
                       class="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-royal-blue outline-none transition-all font-medium text-sm">
            </div>
            <button type="submit" 
                    class="w-full py-4 bg-royal-blue text-white rounded-2xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 mt-6">
                <i data-lucide="lock" class="w-4 h-4"></i>
                Unlock Admin Portal
            </button>
        </form>
    </div>
</section>
@endsection
