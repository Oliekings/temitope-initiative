<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\TeamMember;
use App\Models\GalleryImage;
use App\Models\SiteSetting;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    private function getBankSettings()
    {
        return SiteSetting::get('bank', [
            'account_name' => 'TEMITOPE SOCIETAL SUSTAINABILITY AND DEVELOPMENT INITIATIVE (TSSDI)',
            'bank_name' => 'ZENITH BANK PLC',
            'account_number_ngn' => '1311816265',
            'account_number_usd' => '5075911468',
            'swift_code' => 'ZEIBNGLA',
            'sort_code' => '057080277',
            'branch' => 'KEBBI HOUSE BRANCH'
        ]);
    }

    public function index()
    {
        $maintenance = SiteSetting::get('maintenance', ['isUnderMaintenance' => false]);
        if (!empty($maintenance['isUnderMaintenance']) && !session('is_admin')) {
            return view('maintenance', [
                'estimatedEndTime' => $maintenance['estimatedEndTime'] ?? null,
            ]);
        }

        $events = Event::orderBy('event_date', 'desc')->get();
        $team = TeamMember::orderBy('order', 'asc')->get();
        $gallery = GalleryImage::orderBy('created_at', 'desc')->take(6)->get();
        $siteSettings = SiteSetting::get('site', []);
        $bankSettings = $this->getBankSettings();

        return view('home', compact('events', 'team', 'gallery', 'siteSettings', 'bankSettings'));
    }

    public function donate()
    {
        $siteSettings = SiteSetting::get('site', []);
        $bankSettings = $this->getBankSettings();
        return view('donate', compact('siteSettings', 'bankSettings'));
    }

    public function showEvent($slug)
    {
        $event = Event::where('slug', $slug)
            ->orWhere('id', $slug)
            ->first();

        if (!$event) {
            $event = Event::all()->first(fn($e) => \Illuminate\Support\Str::slug($e->title) === $slug || (string)$e->id === $slug);
        }

        if (!$event) {
            abort(404);
        }

        $otherEvents = Event::where('id', '!=', $event->id)->orderBy('event_date', 'desc')->take(3)->get();
        $siteSettings = SiteSetting::get('site', []);
        $bankSettings = $this->getBankSettings();

        return view('events.show', compact('event', 'otherEvents', 'siteSettings', 'bankSettings'));
    }
}
