<?php

namespace App\Providers;

use App\Mail\LoginAlert;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Auth\Events\Login;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->configureLoginNotifications();
    }

    /**
     * Email the user whenever a new sign-in occurs on their account.
     */
    protected function configureLoginNotifications(): void
    {
        Event::listen(function (Login $event): void {
            $user = $event->user;

            if (! $user instanceof User || empty($user->email)) {
                return;
            }

            // Skip the alert for brand-new accounts — they already get the welcome email.
            if ($user->created_at && $user->created_at->gt(now()->subMinutes(2))) {
                return;
            }

            // Throttle: at most one sign-in alert per user per hour (avoids
            // "remember me" re-authentication firing repeated alerts).
            if (! Cache::add('login-alert:'.$user->getKey(), true, now()->addHour())) {
                return;
            }

            try {
                $request = request();

                Mail::to($user->email)->send(new LoginAlert(
                    $user,
                    $request?->ip(),
                    $request?->userAgent(),
                    now()->format('M j, Y g:i A T'),
                ));
            } catch (\Throwable $e) {
                Log::warning('Login alert email failed: '.$e->getMessage());
            }
        });
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
