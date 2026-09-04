"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

  const handleSignUp = () => {
    router.push("/signup");
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-[#EAE6DE] rounded-[12px] p-8 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-[24px] font-semibold text-[#3F3C36] mb-2">Kloyya</h1>
          <p className="text-[13px] text-[#8C867D]">Connecte-toi pour accéder à ton espace.</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block font-mono text-[10px] tracking-[0.1em] uppercase text-[#8C867D] mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#FDFBF9] border border-[#EAE6DE] rounded-md text-[13.5px] text-[#3F3C36] focus:outline-none focus:border-[#2C7A55] transition-colors"
              placeholder="ton@email.com"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] tracking-[0.1em] uppercase text-[#8C867D] mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#FDFBF9] border border-[#EAE6DE] rounded-md text-[13.5px] text-[#3F3C36] focus:outline-none focus:border-[#2C7A55] transition-colors pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C867D] hover:text-[#3F3C36] transition-colors"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-[11.5px] text-[#2C7A55] hover:text-[#1e5a3f] transition-colors"
            >
              Forgot password?
            </button>
          </div>

          {error && (
            <div className="p-3 bg-[#FCEEEB] border border-[#F0DEBF] rounded-md text-[12.5px] text-[#A8412C]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full bg-[#3F3C36] hover:bg-[#2A2825] text-white text-[13.5px] font-medium py-2.5 rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Connexion..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#EAE6DE]"></div>
          </div>
          <div className="relative flex justify-center text-[11px] text-[#8C867D]">
            <span className="px-4 bg-white">Or continue with</span>
          </div>
        </div>

        {/* OAuth Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-[#EAE6DE] rounded-md text-[13.5px] font-medium text-[#3F3C36] hover:bg-[#FDFBF9] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </button>

          <button
            onClick={handleSlackSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-[#EAE6DE] rounded-md text-[13.5px] font-medium text-[#3F3C36] hover:bg-[#FDFBF9] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#4A154B">
              <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.527 2.527 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
            </svg>
            Sign in with Slack
          </button>
        </div>

        {/* Create Account Button */}
        <button
          onClick={handleSignUp}
          className="w-full mt-4 py-2.5 border-2 border-[#2C7A55] text-[#2C7A55] text-[13.5px] font-medium rounded-md hover:bg-[#2C7A55] hover:text-white transition-all"
        >
          Create an account
        </button>
      </div>
    </div>
  );
}
