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

        // 2. Seed Team Members
        $teamData = [
            [
                'name' => 'Dr. Mrs. Elizabeth Egbetokun',
                'role' => 'Executive Director Temitope (SSDI)',
                'bio' => "Dr. Mrs. Elizabeth Egbetokun is a distinguished humanitarian, a visionary leader, and the driving force behind the Temitope Societal Sustainability and Development Initiative (TSSDI). With a heart dedicated to service and a mind focused on sustainable progress, she has become a beacon of hope for the underserved across the nation.\n\nHer mission through TSSDI is simple yet profound: to build a more equitable society where every individual is empowered to reach their full potential.\n\nA Legacy of Purposeful Action\nDr. Egbetokun’s work is characterized by compassion, integrity, and a relentless pursuit of excellence. Under her guidance, TSSDI has pioneered life-changing programs in:\n\nEconomic Empowerment: Equipping women and youth with the skills and resources to achieve financial independence.\n\nEducation & Advocacy: Ensuring that quality learning and mentorship are accessible to those in remote and marginalized communities.\n\nHealth & Wellness: Leading community-focused medical interventions and maternal health initiatives that save lives.\n\nEnvironmental Stewardship: Promoting sustainable practices to protect our shared future.\n\nLeading with Heart\nBeyond her philanthropic endeavors, Dr. Egbetokun is celebrated for her transformative leadership as the President of the Police Officers’ Wives Association (POWA), where she has redefined welfare and unity for thousands of families.\n\nOften described as a \"mother to the motherless,\" her life’s work serves as a powerful testament to the impact of selfless leadership. Through TSSDI, Dr. Elizabeth Egbetokun continues to bridge the gap between vulnerability and opportunity, leaving an indelible mark of kindness and progress on society.",
                'image_url' => '/uploads/file-1774602405327-507864585.webp',
                'is_founder' => true,
                'order' => 1,
            ],
            [
                'name' => 'Mrs Becky Oghale Akika',
                'role' => 'Coordinator',
                'bio' => "Mrs. Becky Oghale Akika serves as the Coordinator for the Temitope Societal Sustainability and Development Initiative (TSSDI). In this role, she oversees the planning, execution, and day-to-day management of the organization's community programs and sustainability initiatives. Dedicated to driving positive social change, Mrs. Akika works closely with volunteers, partners, and stakeholders to ensure TSSDI’s grassroots projects successfully empower and uplift vulnerable communities.",
                'image_url' => '/uploads/file-1780857631510-728149180.webp',
                'is_founder' => false,
                'order' => 2,
            ],
            [
                'name' => 'Mrs. Charity Hassan',
                'role' => 'Secretary / Accountant',
                'bio' => "Mrs. Charity Hassan holds the dual responsibility of Secretary and Accountant for the Temitope Societal Sustainability and Development Initiative (TSSDI). She manages the organization’s financial records, budgeting, and compliance, while simultaneously coordinating administrative operations and board correspondence. With her strong focus on accountability, transparency, and organizational efficiency, Mrs. Hassan ensures that TSSDI’s resources are diligently managed to maximize the impact of its community sustainability programs.",
                'image_url' => '/uploads/file-1780858120435-327161954.webp',
                'is_founder' => false,
                'order' => 3,
            ],
            [
                'name' => 'Mr Salisu Nuhu',
                'role' => 'Public Relations Officer (PRO)',
                'bio' => "Salisu Nuhu is the Public Relations Officer for the Temitope Societal Sustainability and Development Initiative (TSSDI). He manages the organization’s communication strategies, media relations, and community outreach efforts. Dedicated to amplifying TSSDI’s mission, Salisu ensures that the initiative's advocacy programs, community milestones, and sustainability projects are effectively communicated to partners, stakeholders, and the public to foster deep, lasting engagement.",
                'image_url' => '/uploads/file-1780857906522-532151003.webp',
                'is_founder' => false,
                'order' => 4,
            ],
        ];

        foreach ($teamData as $member) {
            TeamMember::updateOrCreate(['name' => $member['name']], $member);
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
