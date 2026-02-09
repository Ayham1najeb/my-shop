<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class VerifyCodeNotification extends Notification
{
    use Queueable;

    protected $code;

    /**
     * Create a new notification instance.
     */
    public function __construct($code)
    {
        $this->code = $code;
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

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('رمز التحقق الخاص بك - ' . config('app.name'))
            ->greeting('مرحباً ' . $notifiable->name . '!')
            ->line('شكراً لانضمامك إلينا في ' . config('app.name') . '.')
            ->line('استخدم الرمز التالي لتفعيل حسابك والبدء في التسوق:')
            ->line(' ') // Space
            ->line('** ' . $this->code . ' **') // Bold code
            ->line(' ') // Space
            ->line('إذا لم تكن أنت من أنشأ هذا الحساب، يرجى تجاهل هذه الرسالة.')
            ->salutation('مع تحيات فريق ' . config('app.name'));
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
