"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // Supabase lit automatiquement le #access_token dans l'URL et crée le cookie
    // On attend juste un instant que ce soit fait, puis on redirige
    const timer = setTimeout(() => {
      router.push("/connections");
    }, 500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FDFBF9] flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-[#EAE6DE] border-t-[#2C7A55] rounded-full animate-spin mx-auto mb-4"></div>
        <p className="font-mono text-[12px] text-[#8C867D] tracking-wide">Finalisation de la connexion...</p>
      </div>
    </div>
  );
}
