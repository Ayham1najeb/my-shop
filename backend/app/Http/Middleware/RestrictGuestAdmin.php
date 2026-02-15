<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RestrictGuestAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->email === 'guest@mystore.com') {
            if (in_array($request->method(), ['POST', 'PUT', 'PATCH', 'DELETE'])) {
                // Allow logout
                if ($request->is('api/logout')) {
                    return $next($request);
                }

                return response()->json([
                    'message' => 'Guest Admin is not allowed to perform this action.',
                    'status' => 403
                ], 403);
            }
        }

        return $next($request);
    }
}
