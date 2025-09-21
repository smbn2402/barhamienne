<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('roles')->get();

        return response()->json($users);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|min:2',
            'email' => 'required|email|unique:users',
            'phone' => 'required|string',
            'roles' => 'required|array',
            'roles.*' => 'string|exists:roles,name',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => bcrypt(Str::random(10)), // mot de passe temporaire
        ]);

        $user->syncRoles($request->roles);

        // Envoyer le lien de réinitialisation
        Password::sendResetLink(['email' => $user->email]);

        return response()->json($user->load('roles'), 201);
    }

    public function update(Request $request, User $user)
    {
        $user->update($request->only(['name', 'email', 'phone']));
        if ($request->has('roles')) {
            $user->syncRoles($request->roles);
        }
        return response()->json($user->load('roles'));
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->noContent();
    }

    public function roles()
    {
        return Role::all();
    }

    public function sendResetPasswordLink(Request $request)
    {
        $request->validate(['email' => 'required|email|exists:users,email']);

        Password::sendResetLink(['email' => $request->email]);

        return response()->json(['message' => 'Lien de réinitialisation envoyé']);
    }

    public function ResetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:6|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->save();
            }
        );

        return $status === Password::PASSWORD_RESET
            ? response()->json(['message' => 'Mot de passe réinitialisé avec succès'])
            : response()->json(['message' => __($status)], 400);
    }
}
