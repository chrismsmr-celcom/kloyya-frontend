"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/connections");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setError("Un email de confirmation a été envoyé. Vérifie ta boîte mail.");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/connections`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleSlackSignIn = async () => {
    setLoading(true);
    setError(null);
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "slack",
      options: {
        redirectTo: `${window.location.origin}/connections`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Côté gauche - Formulaire */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8">
            <svg
              className="w-12 h-12 text-blue-600"
              viewBox="0 0 100 100"
              fill="currentColor"
            >
              <path d="M50 50 L50 10 Q60 30 50 50 Q40 30 50 10 Z" />
              <path d="M50 50 L85 25 Q70 40 50 50 Q70 35 85 25 Z" />
              <path d="M50 50 L90 50 Q70 55 50 50 Q70 45 90 50 Z" />
              <path d="M50 50 L85 75 Q70 60 50 50 Q70 65 85 75 Z" />
              <path d="M50 50 L50 90 Q60 70 50 50 Q40 70 50 90 Z" />
              <path d="M50 50 L15 75 Q30 60 50 50 Q30 65 15 75 Z" />
              <path d="M50 50 L10 50 Q30 45 50 50 Q30 55 10 50 Z" />
              <path d="M50 50 L15 25 Q30 40 50 50 Q30 35 15 25 Z" />
            </svg>
          </div>

          {/* Titre */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? "Welcome back" : "Sign Up to Kloyya"}
          </h1>
          <p className="text-gray-600 mb-8">
            {isLogin 
              ? "Your AI chief staff made for your sector" 
              : "Start your journey with Kloyya"}
          </p>

          {/* Formulaire */}
          <form onSubmit={isLogin ? handleLogin : handleSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
            </button>
          </form>

          {/* Séparateur */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">or sign in with</span>
            </div>
          </div>

          {/* Boutons sociaux */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </button>

            <button
              onClick={handleSlackSignIn}
              disabled={loading}
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#4A154B">
                <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.527 2.527 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
              </svg>
            </button>

            <button
              disabled={loading}
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
            </button>
          </div>

          {/* Switch Login/Signup */}
          <p className="text-center text-sm text-gray-600 mt-8">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>

      {/* Côté droit - Texte et image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 items-center justify-center p-16 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white rounded-full"></div>
        </div>

        <div className="relative z-10 text-white max-w-lg">
          {/* Grand logo */}
          <svg
            className="w-32 h-32 mb-8 opacity-90"
            viewBox="0 0 100 100"
            fill="currentColor"
          >
            <path d="M50 50 L50 10 Q60 30 50 50 Q40 30 50 10 Z" />
            <path d="M50 50 L85 25 Q70 40 50 50 Q70 35 85 25 Z" />
            <path d="M50 50 L90 50 Q70 55 50 50 Q70 45 90 50 Z" />
            <path d="M50 50 L85 75 Q70 60 50 50 Q70 65 85 75 Z" />
            <path d="M50 50 L50 90 Q60 70 50 50 Q40 70 50 90 Z" />
            <path d="M50 50 L15 75 Q30 60 50 50 Q30 65 15 75 Z" />
            <path d="M50 50 L10 50 Q30 45 50 50 Q30 55 10 50 Z" />
            <path d="M50 50 L15 25 Q30 40 50 50 Q30 35 15 25 Z" />
          </svg>

          <h2 className="text-5xl font-bold mb-6 leading-tight">
            Your outcome is here
          </h2>
          
          <p className="text-xl mb-4 opacity-90">
            Your work becomes easy again
          </p>
          
          <p className="text-lg mb-8 opacity-80">
            Your AI chief staff made for your sector. Let Kloyya handle the complexity while you focus on what matters.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-sm opacity-90">Smart outcome planning</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-sm opacity-90">AI-powered insights</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-sm opacity-90">Seamless integrations</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
