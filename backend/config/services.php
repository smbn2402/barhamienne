<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'wave' => [
        'api_key' => env('WAVE_API_KEY'),
        'base_url' => env('WAVE_BASE_URL'),
    ],

    'om' => [
        'client_id' => env('OM_CLIENT_ID'),
        'client_secret' => env('OM_CLIENT_SECRET'),
        'merchant_key' => env('OM_MERCHANT_KEY'),
        'base_url' => env('OM_BASE_URL', 'https://api.sandbox.orange-sonatel.com'),
    ],

    'infobip' => [
        'api_key' => env('INFOBIP_API_KEY'),
        'base_url' => env('INFOBIP_BASE_URL'),
        'sender' => env('INFOBIP_SENDER'),
    ],

    'sendtext' => [
        'url' => env('SENDTEXT_API_URL'),
        'bulk_url' => env('SENDTEXT_API_BULK_URL'),
        'balance_url' => env('SENDTEXT_API_BALANCE_URL'),
        'statistics_url' => env('SENDTEXT_API_STATISTICS_URL'),
        'key' => env('SENDTEXT_API_KEY'),
        'secret' => env('SENDTEXT_API_SECRET'),
        'sender_name' => env('SENDTEXT_SENDER_NAME'),
    ],

    'orange_sms' => [
        'client_id' => env('ORANGE_SMS_CLIENT_ID'),
        'client_secret' => env('ORANGE_SMS_CLIENT_SECRET'),
        'url' => env('ORANGE_SMS_URL'),
        'token' => env('ORANGE_SMS_TOKEN'),
        'sender_name'=> env('ORANGE_SMS_SENDER_NAME', 'Barhamienne Transport'),
        'application_id' => env('ORANGE_SMS_APPLICATION_ID'),
    ],
];
