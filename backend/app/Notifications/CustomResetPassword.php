<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CustomResetPassword extends Notification
{
    use Queueable;

    public string $url;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $token, string $email)
    {
        $this->url = env('FRONTEND_URL') . '/reset-password/' . $token . '?email=' . urlencode($email);
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Définissez votre mot de passe')
            ->greeting('Bonjour ' . $notifiable->name)
            ->line("Un compte a été créé pour vous sur notre plateforme.")
            ->action('Définir mon mot de passe', $this->url)
            ->line("Ce lien expirera dans 60 minutes.")
            ->salutation('— L’équipe support');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
