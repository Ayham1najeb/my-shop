<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Notifications\VerifyCodeNotification;

class AuthController extends Controller
{
    // Register
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'nullable|string|max:20',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $verificationCode = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'role' => 'customer', // Default role
            'verification_code' => $verificationCode
        ]);

        // Send Verification Email
        try {
            $user->notify(new VerifyCodeNotification($verificationCode));
        } catch (\Exception $e) {
            // Log error but continue
            \Illuminate\Support\Facades\Log::error("Failed to send verification email: " . $e->getMessage());
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'User created successfully. Please verify your email.',
            'data' => [
                'user' => $user,
                'token' => $token,
                'is_verified' => false
            ]
        ], 201);
    }

    // Login
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid login details'
            ], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Logged in successfully',
            'data' => [
                'user' => $user,
                'token' => $token,
                'role' => $user->role,
                'is_verified' => $user->hasVerifiedEmail()
            ]
        ]);
    }

    public function verifyEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|size:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $user = auth()->user();

        if ($user->verification_code !== $request->code) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid verification code'
            ], 400);
        }

        $user->markEmailAsVerified();
        $user->update(['verification_code' => null]);

        return response()->json([
            'status' => 'success',
            'message' => 'Email verified successfully'
        ]);
    }

    public function resendCode(Request $request)
    {
        $user = auth()->user();
        
        $verificationCode = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $user->update(['verification_code' => $verificationCode]);

        try {
            $user->notify(new VerifyCodeNotification($verificationCode));
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to send verification email'
            ], 500);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Verification code resent successfully'
        ]);
    }

    // Logout
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Logged out successfully'
        ]);
    }

    // Get User Profile
    public function profile(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'data' => $request->user()
        ]);
    }

    // Update Profile (Name, Phone, Image)
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $data = [
            'name' => $request->name,
            'phone' => $request->phone,
        ];

        // Handle Image Upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($user->profile_image && \Illuminate\Support\Facades\Storage::exists('public/' . $user->profile_image)) {
                \Illuminate\Support\Facades\Storage::delete('public/' . $user->profile_image);
            }
            
            $path = $request->file('image')->store('profile_images', 'public');
            $data['profile_image'] = $path;
        }

        $user->update($data);

        // Return full URL for image
        $user->profile_image_url = $user->profile_image ? asset('storage/' . $user->profile_image) : null;

        return response()->json([
            'status' => 'success',
            'message' => 'Profile updated successfully',
            'data' => $user
        ]);
    }

    // Change Password
    public function updatePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'current_password' => 'required',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Current password does not match'
            ], 400);
        }

        $user->update([
            'password' => Hash::make($request->new_password)
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Password changed successfully'
        ]);
    }
}
