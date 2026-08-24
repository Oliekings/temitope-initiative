<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Event extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'description',
        'image_url',
        'image_urls',
        'event_date',
    ];

    protected $casts = [
        'image_urls' => 'array',
        'event_date' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function ($event) {
            if (empty($event->slug)) {
                $baseSlug = Str::slug($event->title) ?: 'event';
                $slug = $baseSlug;
                $count = 1;
                while (static::where('slug', $slug)->exists()) {
                    $slug = $baseSlug . '-' . $count++;
                }
                $event->slug = $slug;
            }
        });

        static::updating(function ($event) {
            if (empty($event->slug) || $event->isDirty('title')) {
                $baseSlug = Str::slug($event->title) ?: 'event';
                $slug = $baseSlug;
                $count = 1;
                while (static::where('slug', $slug)->where('id', '!=', $event->id)->exists()) {
                    $slug = $baseSlug . '-' . $count++;
                }
                $event->slug = $slug;
            }
        });
    }

    public function getRouteKeyName()
    {
        return 'slug';
    }

    public function getSlugAttribute($value)
    {
        return $value ?: Str::slug($this->title);
    }
}
