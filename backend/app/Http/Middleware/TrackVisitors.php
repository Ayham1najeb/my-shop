<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Visit;
use Carbon\Carbon;

class TrackVisitors
{
    public function handle(Request $request, Closure $next): Response
    {
        try {
            // Do not track admins or staff
            if (auth()->check() && in_array(auth()->user()->role, ['admin', 'staff'])) {
                return $next($request);
            }

            $ip = $request->ip();
            $userAgent = substr($request->userAgent(), 0, 255);
            $today = Carbon::today()->toDateString();
            
            // Improved Logic: Track Users and Guests separately to capture 'Login' events as visits
            if (auth()->check()) {
                // If user is logged in, track by User ID + Date + Device (UA)
                Visit::firstOrCreate(
                    [
                        'user_id' => auth()->id(),
                        'user_agent' => $userAgent,
                        'visit_date' => $today
                    ],
                    [
                        'ip_address' => $ip
                    ]
                );
            } else {
                // If guest, track by IP + Date + UA + Null User
                Visit::firstOrCreate(
                    [
                        'ip_address' => $ip,
                        'user_agent' => $userAgent,
                        'visit_date' => $today, 
                        'user_id' => null
                    ]
                );
            }
            
        } catch (\Exception $e) {
            // Fail silently so we don't block the user request
        }

        return $next($request);
    }
}
