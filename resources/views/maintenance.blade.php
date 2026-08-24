<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Under Scheduled Maintenance - Temitope Initiative</title>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body class="bg-gradient-to-br from-slate-900 via-royal-blue to-slate-950 min-h-screen flex items-center justify-center p-6 text-white font-sans">
    <div class="max-w-lg w-full text-center bg-white/10 backdrop-blur-xl p-10 md:p-12 rounded-3xl border border-white/20 shadow-2xl">
        <div class="w-16 h-16 bg-lime-green/20 text-lime-green rounded-full flex items-center justify-center mx-auto mb-6">
            <i data-lucide="wrench" class="w-8 h-8"></i>
        </div>
        <h1 class="text-3xl font-serif font-bold mb-3">Scheduled Maintenance</h1>
        <p class="text-blue-100 text-sm leading-relaxed mb-8">
            We are currently upgrading the Temitope Initiative platform with improved performance and features. We will be back online shortly.
        </p>

        @if(!empty($estimatedEndTime))
            <div class="bg-white/10 p-4 rounded-2xl border border-white/10 mb-8 inline-block">
                <span class="text-xs text-blue-200 uppercase tracking-widest block font-bold mb-1">Expected Completion</span>
                <span class="font-mono font-bold text-lime-green">{{ $estimatedEndTime }}</span>
            </div>
        @endif

        <div class="pt-6 border-t border-white/10 flex justify-center">
            <a href="{{ route('admin.dashboard') }}" class="text-xs text-blue-300 hover:text-white underline font-medium">
                Admin Sign In &rarr;
            </a>
        </div>
    </div>
    <script>lucide.createIcons();</script>
</body>
</html>
