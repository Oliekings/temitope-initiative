<?php

namespace App\Http\Controllers;

use App\Models\Subscriber;
use Illuminate\Http\Request;

class SubscriberController extends Controller
{
    public function subscribe(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|max:255',
        ]);

        $subscriber = Subscriber::firstOrCreate(['email' => $validated['email']]);

        return response()->json([
            'success' => true,
            'message' => 'Thank you for subscribing to TSSDI updates!',
            'subscriber' => $subscriber
        ]);
    }
}
