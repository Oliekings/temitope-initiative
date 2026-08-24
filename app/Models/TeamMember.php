<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeamMember extends Model
{
    protected $fillable = [
        'name',
        'role',
        'bio',
        'image_url',
        'is_founder',
        'order',
    ];

    protected $casts = [
        'is_founder' => 'boolean',
        'order' => 'integer',
    ];
}
