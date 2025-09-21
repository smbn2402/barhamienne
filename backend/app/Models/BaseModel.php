<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class BaseModel extends Model
{

    public function toArray()
    {
        $array = parent::toArray();

        return collect($array)->mapWithKeys(function ($value, $key) {
            return [\Illuminate\Support\Str::camel($key) => $value];
        })->toArray();
    }

    /**
     * Convert attributes to camelCase when getting.
     */
    public function attributesToArray()
    {
        $attributes = parent::attributesToArray();

        // Convert keys from snake_case to camelCase
        return collect($attributes)->mapWithKeys(function ($value, $key) {
            return [Str::camel($key) => $value];
        })->toArray();
    }

    /**
     * Set attributes from camelCase to snake_case when setting.
     */
    public function setAttribute($key, $value)
    {
        // Convert camelCase to snake_case before saving
        return parent::setAttribute(Str::snake($key), $value);
    }

    /**
     * Access attribute using camelCase.
     */
    public function getAttribute($key)
    {
        return parent::getAttribute(Str::snake($key));
    }
}
