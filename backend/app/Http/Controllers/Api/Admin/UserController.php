<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Carbon\Carbon;

class UserController extends Controller
{
    public function index()
    {
        // Get all users
        $users = User::latest()->get();
        return response()->json($users);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        if ($user->role === 'admin') {
            return response()->json(['message' => 'Cannot delete admin'], 403);
        }
        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }

    public function toggleBan(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        if ($user->role === 'admin') {
            return response()->json(['message' => 'Cannot ban admin'], 403);
        }

        // If banned, unban
        if ($user->banned_until && Carbon::parse($user->banned_until)->isFuture()) {
            $user->update(['banned_until' => null]);
            return response()->json(['message' => 'User unbanned successfully', 'status' => 'active']);
        }

        // Ban logic
        $date = null;
        if ($request->permanent) {
            $date = Carbon::now()->addYears(100);
        } else {
            $days = $request->days ?? 7;
            $date = Carbon::now()->addDays($days);
        }

        $user->update(['banned_until' => $date]);
        return response()->json(['message' => 'User banned successfully', 'status' => 'banned', 'until' => $date]);
    }
}
