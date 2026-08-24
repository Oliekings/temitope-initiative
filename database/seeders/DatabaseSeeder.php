<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\TeamMember;
use App\Models\GalleryImage;
use App\Models\SiteSetting;
use App\Models\Event;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\File;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Admin User
        User::updateOrCreate(
            ['email' => 'admin@temitopessdi.org'],
            [
                'name' => 'Surprise-MFs',
                'password' => Hash::make('Surprise'),
            ]
        );

        // 2. Seed Team Members (from database/data/team_seed.json)
        $teamFile = database_path('data/team_seed.json');
        if (File::exists($teamFile)) {
            $teamData = json_decode(File::get($teamFile), true) ?: [];
            foreach ($teamData as $member) {
                TeamMember::updateOrCreate(
                    ['name' => $member['name']],
                    [
                        'role' => $member['role'],
                        'bio' => $member['bio'],
                        'image_url' => $member['image_url'],
                        'is_founder' => $member['is_founder'] ?? false,
                        'order' => $member['order'] ?? 1,
                    ]
                );
            }
        }

        // 3. Seed Gallery Images from database/data/gallery_seed.json
        $galleryFile = database_path('data/gallery_seed.json');
        if (File::exists($galleryFile)) {
            $galleryList = json_decode(File::get($galleryFile), true) ?: [];
            foreach ($galleryList as $img) {
                $imgUrl = $img['image_url'] ?? ($img['imageUrl'] ?? null);
                if ($imgUrl) {
                    GalleryImage::updateOrCreate(
                        ['image_url' => $imgUrl],
                        [
                            'title' => $img['title'] ?? 'Community Outreach',
                            'description' => $img['description'] ?? 'TSSDI Community Milestone',
                        ]
                    );
                }
            }
        }

        // 4. Seed Events from database/data/events_seed.json
        $eventsFile = database_path('data/events_seed.json');
        if (File::exists($eventsFile)) {
            $eventsList = json_decode(File::get($eventsFile), true) ?: [];
            foreach ($eventsList as $evt) {
                Event::updateOrCreate(
                    ['slug' => $evt['slug'] ?? \Illuminate\Support\Str::slug($evt['title'])],
                    [
                        'title' => $evt['title'],
                        'description' => $evt['description'],
                        'event_date' => $evt['event_date'] ?? now(),
                        'image_url' => $evt['image_url'] ?? null,
                        'image_urls' => $evt['image_urls'] ?? [],
                    ]
                );
            }
        }

        // 5. Seed Site Settings (including Zenith Bank Details)
        SiteSetting::set('site', [
            'name' => 'Temitope Initiative',
            'logoUrl' => 'https://res.cloudinary.com/dfujzs9ml/image/upload/v1774493285/temitope_initiative/t653vvukb9rj1q1zdh0y.png',
            'emails' => ['contact@temitopessdi.org'],
            'phones' => ['+2348033294044', '+2348032439434'],
            'addresses' => [
                'No 9, 32 crescent 3rd Ave, Gwarinpa Estate, Gwarinpa 900108, Federal Capital Territory'
            ],
            'socials' => [
                ['platform' => 'Facebook', 'url' => '#', 'enabled' => true],
                ['platform' => 'Instagram', 'url' => '#', 'enabled' => true],
                ['platform' => 'Twitter', 'url' => '', 'enabled' => false],
                ['platform' => 'LinkedIn', 'url' => '', 'enabled' => false],
            ],
            'bank_accounts' => [
                'account_name' => 'TEMITOPE SOCIETAL SUSTAINABILITY AND DEVELOPMENT INITIATIVE (TSSDI)',
                'bank_name' => 'ZENITH BANK',
                'account_ngn' => '1311816265',
                'account_usd' => '5075911468',
                'swift' => 'ZEIBNGLA',
                'sort_code' => '057080277',
                'branch' => 'KEBBI HOUSE BRANCH'
            ]
        ]);

        SiteSetting::set('bank', [
            'bank_name' => 'Zenith Bank PLC',
            'account_name' => 'TEMITOPE SOCIETAL SUSTAINABILITY AND DEVELOPMENT INITIATIVE (TSSDI)',
            'account_ngn' => '1311816265',
            'account_usd' => '5075911468',
            'swift' => 'ZEIBNGLA',
            'sort_code' => '057080277',
            'branch' => 'KEBBI HOUSE BRANCH'
        ]);

        SiteSetting::set('admin', [
            'username' => 'Surprise-MFs',
            'password' => 'Surprise',
        ]);

        SiteSetting::set('maintenance', [
            'isUnderMaintenance' => false,
            'estimatedEndTime' => '',
        ]);
    }
}
