"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Le token est sauvegardé dans le localStorage par Supabase
      router.push("/connections");
    }
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
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#FDFBF9] border border-[#EAE6DE] rounded-md text-[13.5px] text-[#3F3C36] focus:outline-none focus:border-[#2C7A55] transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-3 bg-[#FCEEEB] border border-[#F0DEBF] rounded-md text-[12.5px] text-[#A8412C]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full bg-[#3F3C36] hover:bg-[#2A2825] text-white text-[13.5px] font-medium py-2.5 rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
