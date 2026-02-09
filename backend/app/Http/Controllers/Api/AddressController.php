<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Address;

class AddressController extends Controller
{
    public function index()
    {
        return response()->json(auth()->user()->addresses()->latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'phone' => 'required|string',
            'street_address' => 'required|string',
            'city' => 'required|string',
            'country' => 'required|string',
            'zip_code' => 'nullable|string',
            'state' => 'nullable|string',
            'is_default' => 'boolean'
        ]);

        $user = auth()->user();

        // If setting as default, unset others
        if ($request->is_default) {
            $user->addresses()->update(['is_default' => false]);
        }

        // Create
        $address = $user->addresses()->create($validated);

        return response()->json($address, 201);
    }

    public function update(Request $request, $id)
    {
        $address = auth()->user()->addresses()->findOrFail($id);

        $validated = $request->validate([
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'phone' => 'required|string',
            'street_address' => 'required|string',
            'city' => 'required|string',
            'country' => 'required|string',
            'zip_code' => 'nullable|string',
            'state' => 'nullable|string',
            'is_default' => 'boolean'
        ]);

        if ($request->is_default) {
            auth()->user()->addresses()->where('id', '!=', $id)->update(['is_default' => false]);
        }

        $address->update($validated);

        return response()->json($address);
    }

    public function destroy($id)
    {
        $address = auth()->user()->addresses()->findOrFail($id);
        $address->delete();

        return response()->json(['message' => 'Address deleted']);
    }
}
