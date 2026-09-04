/**
 * Couche API — point d'entrée UNIQUE vers le backend Kloyya.
 *
 * Hypothèses (à corriger pour matcher les vraies routes de ton backend
 * Next.js / Prisma / Supabase) :
 *   GET    /api/outcomes                -> OutcomeSummary[]
 *   POST   /api/outcomes                -> { query: string } -> OutcomePlan
 *   GET    /api/outcomes/:id/plan        -> OutcomePlan
 *   POST   /api/outcomes/:id/plan/answer -> { optionIndex: number } -> OutcomePlan
 *   POST   /api/outcomes/:id/run         -> démarre l'exécution -> OutcomeRun
 *   GET    /api/outcomes/:id/run         -> OutcomeRun (poll toutes les 2-3s pendant "running")
 *   GET    /api/outcomes/:id             -> OutcomeDetail
 *   GET    /api/connections              -> ConnectionGroup[]
 *   POST   /api/connections/:id/connect  -> lance le flow OAuth du tool
 *   POST   /api/connections/:id/disconnect
 *
 * Tant que ces routes ne répondent pas (backend pas encore prêt, CORS,
 * 404...), chaque fonction retombe silencieusement sur les données de
 * démo (lib/mock-data.ts) pour que l'UI reste utilisable. Une fois le
 * contrat réel connu, ajuste juste les chemins ci-dessous.
 */

import type {
  OutcomeSummary,
  OutcomePlan,
  OutcomeRun,
  OutcomeDetail,
  ConnectionGroup,
} from "./types";
import {
  mockOutcomes,
  mockPlan,
  mockRun,
  mockDetail,
  mockConnections,
} from "./mock-data";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "https://kloyya-ia-vert.vercel.app";

class ApiError extends Error {}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    // Les pages qui appellent ceci sont des Client Components — on
    // laisse le fetch natif du navigateur gérer le cache.
  });
  if (!res.ok) {
    throw new ApiError(`${init?.method ?? "GET"} ${path} -> ${res.status}`);
  }
  return res.json() as Promise<T>;
}

/** Wrapper : tente l'appel réel, retombe sur `fallback` si le backend
 *  n'est pas encore prêt (réseau, 404, CORS...). Log un warning discret
 *  en dev pour qu'on sache qu'on est sur des données de démo. */
async function withFallback<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[api] fallback -> mock data:", (err as Error).message);
    }
    return fallback;
  }
}

export const api = {
  outcomes: {
    list: (): Promise<OutcomeSummary[]> =>
      withFallback(() => request<OutcomeSummary[]>("/api/outcomes"), mockOutcomes),

    create: (query: string): Promise<OutcomePlan> =>
      withFallback(
        () =>
          request<OutcomePlan>("/api/outcomes", {
            method: "POST",
            body: JSON.stringify({ query }),
          }),
        { ...mockPlan, title: query || mockPlan.title }
      ),

    plan: (id: string): Promise<OutcomePlan> =>
      withFallback(() => request<OutcomePlan>(`/api/outcomes/${id}/plan`), mockPlan),

    answerClarifyingQuestion: (id: string, optionIndex: number): Promise<OutcomePlan> =>
      withFallback(
        () =>
          request<OutcomePlan>(`/api/outcomes/${id}/plan/answer`, {
            method: "POST",
            body: JSON.stringify({ optionIndex }),
          }),
        mockPlan
      ),

    startRun: (id: string): Promise<OutcomeRun> =>
      withFallback(
        () => request<OutcomeRun>(`/api/outcomes/${id}/run`, { method: "POST" }),
        mockRun
      ),

    run: (id: string): Promise<OutcomeRun> =>
      withFallback(() => request<OutcomeRun>(`/api/outcomes/${id}/run`), mockRun),

    detail: (id: string): Promise<OutcomeDetail> =>
      withFallback(() => request<OutcomeDetail>(`/api/outcomes/${id}`), mockDetail),
  },

  connections: {
    list: (): Promise<ConnectionGroup[]> =>
      withFallback(() => request<ConnectionGroup[]>("/api/connections"), mockConnections),

    connect: (toolId: string): Promise<{ url?: string }> =>
      withFallback(
        () =>
          request<{ url?: string }>(`/api/connections/${toolId}/connect`, {
            method: "POST",
          }),
        {}
      ),

    disconnect: (toolId: string): Promise<void> =>
      withFallback(
        () =>
          request<void>(`/api/connections/${toolId}/disconnect`, {
            method: "POST",
          }),
        undefined
      ),
  },
};
