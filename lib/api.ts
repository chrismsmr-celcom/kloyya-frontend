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

console.log("[API] BASE_URL:", BASE_URL);

class ApiError extends Error {}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const fullUrl = `${BASE_URL}${path}`;
  console.log(`[API] ${init?.method || 'GET'} ${fullUrl}`);
  
  const res = await fetch(fullUrl, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  
  if (!res.ok) {
    const errorBody = await res.text();
    console.error(`[API] Error ${res.status}:`, errorBody);
    throw new ApiError(`${init?.method ?? "GET"} ${path} -> ${res.status}: ${errorBody}`);
  }
  
  return res.json() as Promise<T>;
}

/** Wrapper : tente l'appel réel, retombe sur `fallback` si le backend
 *  n'est pas encore prêt (réseau, 404, CORS...). */
async function withFallback<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.warn("[API] Fallback activated (backend unavailable):", (err as Error).message);
    return fallback;
  }
}

export const api = {
  outcomes: {
    list: (): Promise<OutcomeSummary[]> =>
      withFallback(() => request<OutcomeSummary[]>("/api/outcomes"), mockOutcomes),

    create: (title: string): Promise<OutcomePlan> =>
      withFallback(
        () =>
          request<OutcomePlan>("/api/outcomes", {
            method: "POST",
            body: JSON.stringify({ title }),  // ✅ Matches backend: { title: string }
          }),
        { ...mockPlan, title: title || mockPlan.title }
      ),

    plan: (id: string): Promise<OutcomePlan> =>
      withFallback(() => request<OutcomePlan>(`/api/outcomes/${id}/plan`), mockPlan),

    // ✅ FIXED: Matches backend route /api/outcomes/{outcome_id}/clarify
    clarifyOutcome: (id: string, answer: string): Promise<OutcomePlan> =>
      withFallback(
        () =>
          request<OutcomePlan>(`/api/outcomes/${id}/clarify`, {
            method: "POST",
            body: JSON.stringify({ answer }),  // ✅ Matches backend: { answer: string }
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

    // ✅ FIXED: Matches backend route /api/connections/{tool_id}/authorize
    connect: (toolId: string): Promise<{ redirect_url: string }> =>
      withFallback(
        () =>
          request<{ redirect_url: string }>(`/api/connections/${toolId}/authorize`, {
            method: "POST",
          }),
        {}
      ),

    // ✅ FIXED: Matches backend route /api/connections/{tool_id}
    disconnect: (toolId: string): Promise<void> =>
      withFallback(
        () =>
          request<void>(`/api/connections/${toolId}`, {
            method: "DELETE",
          }),
        undefined
      ),
  },
};
