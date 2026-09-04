"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

// Utilisation des variables d'environnement du frontend
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
      // Succès ! Le token est automatiquement sauvegardé dans le localStorage par Supabase.
      // On redirige l'utilisateur vers la page des connexions.
      router.push("/connections");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-[#EAE6DE] rounded-[12px] p-8 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-[24px] font-semibold text-[#3F3C36] mb-2">Kloyya</h1>
          <p className="text-[13px] text-[#8C867D]">Connecte-toi pour accéder à ton espace de travail.</p>
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
              className="w-full px-3 py-2.5 bg-[#FDFBF9] border border-[#EAE6DE] rounded-md text-[13.5px] text-[#3F3C36] focus:outline-none focus:border-[#2C7
