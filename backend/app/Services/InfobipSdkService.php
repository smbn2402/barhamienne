<?php

namespace App\Services;

use Infobip\Api\SmsApi;
use Infobip\Configuration;
use Infobip\Model\SmsDestination;
use Infobip\Model\SmsMessage;
use Infobip\Model\SmsRequest;
use Infobip\Model\SmsTextContent;
use Infobip\ApiException;

class InfobipSdkService
{
    protected SmsApi $smsApi;

    public function __construct()
    {
        $config = new Configuration(
            host: config('services.infobip.base_url'),
            apiKey: config('services.infobip.api_key')
        );

        $this->smsApi = new SmsApi($config);
    }

    public function sendSms(string $to, string $text): bool
    {
        $message = new SmsMessage(
            destinations: [
                new SmsDestination(to: $to)
            ],
            content: new SmsTextContent(text: $text),
            sender: config('services.infobip.sender')
        );

        $request = new SmsRequest(messages: [$message]);

        try {
            $this->smsApi->sendSmsMessages($request);
            return true;
        } catch (ApiException $e) {
            logger()->error("Erreur SMS Infobip : " . $e->getMessage());
            return false;
        }
    }
}
