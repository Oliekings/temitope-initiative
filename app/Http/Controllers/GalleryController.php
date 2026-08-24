<?php

namespace App\Http\Controllers;

use App\Models\GalleryImage;
use App\Models\SiteSetting;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    public function index()
    {
        $images = GalleryImage::orderBy('created_at', 'desc')->paginate(30);
        $siteSettings = SiteSetting::get('site', []);

        return view('gallery', compact('images', 'siteSettings'));
    }
}
