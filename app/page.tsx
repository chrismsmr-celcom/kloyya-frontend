"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      // On vérifie si une session (token) existe déjà dans le localStorage
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Si connecté, on va sur la page principale de l'app
        router.push("/connections");
      } else {
        // Si pas connecté, on redirige vers la page de login
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  // Écran de chargement pendant la vérification
  return (
    <div className="min-h-screen bg-[#FDFBF9] flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-[#EAE6DE] border-t-[#2C7A55] rounded-full animate-spin mx-auto mb-4"></div>
        <p className="font-mono text-[12px] text-[#8C867D] tracking-wide">Vérification de la session...</p>
      </div>
    </div>
  );
}
