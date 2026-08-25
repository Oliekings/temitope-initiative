<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\TeamMember;
use App\Models\GalleryImage;
use App\Models\SiteSetting;
use App\Models\Subscriber;
use App\Services\ImageOptimizer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    public function index()
    {
        if (!session('is_admin')) {
            return view('surprise.login');
        }

        $events = Event::orderBy('event_date', 'desc')->get();
        $team = TeamMember::orderBy('order', 'asc')->get();
        $gallery = GalleryImage::orderBy('created_at', 'desc')->get();
        $subscribers = Subscriber::orderBy('created_at', 'desc')->get();
        $siteSettings = SiteSetting::get('site', []);
        $bankSettings = SiteSetting::get('bank', [
            'account_name' => 'TEMITOPE SOCIETAL SUSTAINABILITY AND DEVELOPMENT INITIATIVE (TSSDI)',
            'bank_name' => 'ZENITH BANK PLC',
            'account_number_ngn' => '1311816265',
            'account_number_usd' => '5075911468',
            'swift_code' => 'ZEIBNGLA',
            'sort_code' => '057080277',
            'branch' => 'KEBBI HOUSE BRANCH'
        ]);
        $maintenance = SiteSetting::get('maintenance', ['isUnderMaintenance' => false]);
        $adminCreds = SiteSetting::get('admin', ['username' => 'Surprise-MFs', 'password' => 'Surprise']);

        return view('surprise.dashboard', compact(
            'events',
            'team',
            'gallery',
            'subscribers',
            'siteSettings',
            'bankSettings',
            'maintenance',
            'adminCreds'
        ));
    }

    public function login(Request $request)
    {
        $username = $request->input('username');
        $password = $request->input('password');

        $adminCreds = SiteSetting::get('admin', ['username' => 'Surprise-MFs', 'password' => 'Surprise']);

        if ($username === ($adminCreds['username'] ?? 'Surprise-MFs') && $password === ($adminCreds['password'] ?? 'Surprise')) {
            session(['is_admin' => true, 'admin_username' => $username]);
            if ($request->wantsJson()) {
                return response()->json(['success' => true, 'username' => $username]);
            }
            return redirect()->route('admin.dashboard');
        }

        if ($request->wantsJson()) {
            return response()->json(['error' => 'Invalid username or password'], 401);
        }
        return back()->with('error', 'Invalid username or password');
    }

    public function logout(Request $request)
    {
        session()->forget(['is_admin', 'admin_username']);
        if ($request->wantsJson()) {
            return response()->json(['success' => true]);
        }
        return redirect()->route('admin.dashboard');
    }

    // --- Events Management ---
    public function storeEvent(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'date' => 'nullable',
            'imageUrl' => 'nullable|string',
            'imageUrls' => 'nullable|array',
            'photos' => 'nullable|array',
            'photos.*' => 'file|max:51200',
        ]);

        $imageUrls = (array) $request->input('imageUrls', []);
        $imageUrl = $request->input('imageUrl', $imageUrls[0] ?? '');

        // Handle direct file uploads if provided in the event form
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $file) {
                $optimizedUrl = ImageOptimizer::optimizeAndSave($file);
                $imageUrls[] = $optimizedUrl;
            }
            if (empty($imageUrl) && !empty($imageUrls)) {
                $imageUrl = $imageUrls[0];
            }
        }

        $event = Event::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'image_url' => $imageUrl,
            'image_urls' => array_values(array_unique($imageUrls)),
            'event_date' => $request->input('date') ? date('Y-m-d H:i:s', strtotime($request->input('date'))) : now(),
        ]);

        // Automatically sync event images to the gallery in 1 fast bulk query
        $allEventImages = array_filter(array_unique(array_merge([$imageUrl], (array) $imageUrls)));
        if (!empty($allEventImages)) {
            $existingUrls = GalleryImage::whereIn('image_url', $allEventImages)->pluck('image_url')->toArray();
            $newUrls = array_diff($allEventImages, $existingUrls);
            if (!empty($newUrls)) {
                $inserts = [];
                $now = now();
                $title = $event->title;
                $desc = Str::limit($event->description, 160);
                foreach ($newUrls as $newUrl) {
                    $inserts[] = [
                        'image_url' => $newUrl,
                        'title' => $title,
                        'description' => $desc,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }
                GalleryImage::insert($inserts);
            }
        }

        if ($request->wantsJson()) {
            return response()->json($event);
        }
        return back()->with('success', 'Event added successfully and photos added to gallery!');
    }

    public function updateEvent(Request $request, $id)
    {
        $event = Event::findOrFail($id);
        $imageUrls = (array) $request->input('imageUrls', $event->image_urls ?: []);
        $imageUrl = $request->input('imageUrl', $imageUrls[0] ?? $event->image_url);

        // Handle new direct file uploads
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $file) {
                $optimizedUrl = ImageOptimizer::optimizeAndSave($file);
                $imageUrls[] = $optimizedUrl;
            }
            if (empty($imageUrl) && !empty($imageUrls)) {
                $imageUrl = $imageUrls[0];
            }
        }

        $event->update([
            'title' => $request->input('title', $event->title),
            'description' => $request->input('description', $event->description),
            'image_url' => $imageUrl,
            'image_urls' => array_values(array_unique($imageUrls)),
            'event_date' => $request->input('date') ? date('Y-m-d H:i:s', strtotime($request->input('date'))) : $event->event_date,
        ]);

        // Automatically sync event images to the gallery in 1 fast bulk query
        $allEventImages = array_filter(array_unique(array_merge([$imageUrl], (array) $imageUrls)));
        if (!empty($allEventImages)) {
            $existingUrls = GalleryImage::whereIn('image_url', $allEventImages)->pluck('image_url')->toArray();
            $newUrls = array_diff($allEventImages, $existingUrls);
            if (!empty($newUrls)) {
                $inserts = [];
                $now = now();
                $title = $event->title;
                $desc = Str::limit($event->description, 160);
                foreach ($newUrls as $newUrl) {
                    $inserts[] = [
                        'image_url' => $newUrl,
                        'title' => $title,
                        'description' => $desc,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }
                GalleryImage::insert($inserts);
            }
        }

        if ($request->wantsJson()) {
            return response()->json($event);
        }
        return back()->with('success', 'Event updated successfully and photos synchronized!');
    }

    public function deleteEvent($id)
    {
        Event::destroy($id);
        if (request()->wantsJson()) {
            return response()->json(['success' => true]);
        }
        return back()->with('success', 'Event deleted.');
    }

    // --- Team Management ---
    public function storeTeam(Request $request)
    {
        $imageUrl = $request->input('imageUrl');
        if ($request->hasFile('photo')) {
            $imageUrl = ImageOptimizer::optimizeAndSave($request->file('photo'));
        }

        $member = TeamMember::create([
            'name' => $request->input('name'),
            'role' => $request->input('role'),
            'bio' => $request->input('bio'),
            'image_url' => $imageUrl,
            'is_founder' => $request->boolean('is_founder'),
            'order' => (int) $request->input('order', 0),
        ]);

        if ($request->wantsJson()) {
            return response()->json($member);
        }
        return back()->with('success', 'Team member added successfully!');
    }

    public function updateTeam(Request $request, $id)
    {
        $member = TeamMember::findOrFail($id);
        $imageUrl = $request->input('imageUrl', $member->image_url);

        if ($request->hasFile('photo')) {
            $imageUrl = ImageOptimizer::optimizeAndSave($request->file('photo'));
        }

        $member->update([
            'name' => $request->input('name', $member->name),
            'role' => $request->input('role', $member->role),
            'bio' => $request->input('bio', $member->bio),
            'image_url' => $imageUrl,
            'is_founder' => $request->has('is_founder') ? $request->boolean('is_founder') : $member->is_founder,
            'order' => $request->has('order') ? (int) $request->input('order') : $member->order,
        ]);

        if ($request->wantsJson()) {
            return response()->json($member);
        }
        return back()->with('success', 'Team member updated successfully!');
    }

    public function deleteTeam($id)
    {
        TeamMember::destroy($id);
        if (request()->wantsJson()) {
            return response()->json(['success' => true]);
        }
        return back()->with('success', 'Team member deleted.');
    }

    // --- Gallery Management ---
    public function storeGallery(Request $request)
    {
        $title = $request->input('title', 'Community Outreach');
        $description = $request->input('description', '');
        $imageUrls = $request->input('imageUrls', []);

        if (empty($imageUrls) && $request->input('imageUrl')) {
            $imageUrls = [$request->input('imageUrl')];
        }

        $created = [];
        foreach ($imageUrls as $url) {
            $created[] = GalleryImage::create([
                'title' => $title,
                'description' => $description,
                'image_url' => $url,
            ]);
        }

        if ($request->wantsJson()) {
            return response()->json($created);
        }
        return back()->with('success', 'Images added to gallery!');
    }

    public function deleteGallery($id)
    {
        GalleryImage::destroy($id);
        if (request()->wantsJson()) {
            return response()->json(['success' => true]);
        }
        return back()->with('success', 'Gallery item deleted.');
    }

    // --- Settings Management ---
    public function saveSettings(Request $request, $key)
    {
        $data = $request->all();
        SiteSetting::set($key, $data);

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'data' => $data]);
        }
        return back()->with('success', ucfirst($key) . ' settings saved!');
    }

    // --- File Upload API with ImageOptimizer ---
    public function upload(Request $request)
    {
        $urls = [];

        // 1. Process base64 encoded images from JSON payload
        $body = $request->json()->all();
        if (empty($body)) {
            $body = json_decode($request->getContent(), true) ?: $request->all();
        }

        $base64List = array_merge(
            (array) ($body['images'] ?? []),
            (array) ($body['base64_images'] ?? []),
            (array) ($body['files'] ?? [])
        );

        if (!empty($base64List)) {
            $uploadDir = public_path('uploads');
            $thumbsDir = public_path('uploads/thumbs');
            if (!File::exists($uploadDir)) File::makeDirectory($uploadDir, 0777, true);
            if (!File::exists($thumbsDir)) File::makeDirectory($thumbsDir, 0777, true);

            foreach ($base64List as $imgData) {
                if (is_string($imgData) && str_starts_with($imgData, 'data:image')) {
                    $parts = explode(',', $imgData);
                    if (isset($parts[1])) {
                        $raw = base64_decode($parts[1]);
                        if ($raw) {
                            $filename = 'img-' . time() . '-' . Str::random(8) . '.webp';
                            file_put_contents($uploadDir . '/' . $filename, $raw);
                            file_put_contents($thumbsDir . '/' . $filename, $raw);
                            $urls[] = '/uploads/' . $filename;
                        }
                    }
                }
            }
        }

        // 2. Process multipart files if any
        $allFiles = $request->allFiles();
        if (!empty($allFiles)) {
            $processFile = function ($item) use (&$processFile, &$urls) {
                if (is_array($item)) {
                    foreach ($item as $sub) {
                        $processFile($sub);
                    }
                } elseif ($item instanceof \Illuminate\Http\UploadedFile && $item->isValid()) {
                    $urls[] = ImageOptimizer::optimizeAndSave($item);
                }
            };
            foreach ($allFiles as $fileEntry) {
                $processFile($fileEntry);
            }
        }

        if (empty($urls)) {
            return response()->json([
                'error' => 'No files detected in upload payload.',
                'debug' => [
                    'body_keys' => array_keys((array)$body),
                    'files_keys' => array_keys((array)$allFiles),
                    'raw_len' => strlen($request->getContent()),
                ]
            ], 400);
        }

        return response()->json([
            'url' => $urls[0] ?? null,
            'urls' => $urls,
        ]);
    }
}
