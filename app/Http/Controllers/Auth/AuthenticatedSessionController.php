<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Laravel\Socialite\Facades\Socialite;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /*
     * Social Logins*/
    public function redirectToProvider($website)
    {
        return Socialite::driver($website)->redirect();
    }

    /**
     * Obtain the user information from GitHub/Google/Twitter/Facebook.
     *
     * @return \Illuminate\Http\Response
     */
    public function handleProviderCallback($website)
    {
        $user = Socialite::driver($website)->user();

        $name = $user->getName() ? $user->getName() : " ";

        $email = $user->getEmail() ? $user->getEmail() : redirect('/');

        $avatar = $user->getAvatar() ? $user->getAvatar() : "avatar/male-avatar.png";

        // Get Database User
        $dbUser = User::where('email', $user->getEmail());

        // Check if user exists
        if ($dbUser->exists()) {
            $token = $dbUser
                ->first()
                ->createToken("deviceName")
                ->plainTextToken;

            return redirect("/#/socialite/Logged in/" . $token);
        } else {
            // Remove forward slashes
            $avatar = str_replace("/", " ", $avatar);

            return redirect('/#/register/' . $name . '/' . $email . '/' . $avatar);
        }
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request)
    {
        $request->validate([
            'email' => 'required',
            'password' => 'required',
            'device_name' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user
            ->createToken($request->device_name)
            ->plainTextToken;

        return response([
            "message" => "Logged in",
            "data" => $token,
        ], 200);
    }

    /**
     * Destroy an authenticated session.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        // Delete Current Access Token
        $hasLoggedOut = auth("sanctum")
            ->user()
            ->currentAccessToken()
            ->delete();

        if ($hasLoggedOut) {
            $message = "Logged Out";
        } else {
            $message = "Failed to log out";
        }

        return response(["message" => $message], 200);
    }
}
