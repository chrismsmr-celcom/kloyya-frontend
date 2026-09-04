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
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "https://kloyya-ia-vert.vercel.app";

console.log("[API] BASE_URL:", BASE_URL);

class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function getAccessToken(): Promise<string | null> {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const keys = Object.keys(localStorage);

    const supabaseKey = keys.find(
      (key) =>
        key.startsWith("sb-") &&
        key.includes("-auth-token")
    );

    if (!supabaseKey) {
      return null;
    }

    const raw = localStorage.getItem(supabaseKey);

    if (!raw) {
      return null;
    }

    const session = JSON.parse(raw);

    return session?.access_token ?? null;
  } catch (error) {
    console.warn("[API] Unable to read auth token:", error);
    return null;
  }
}

async function request<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const fullUrl = `${BASE_URL}${path}`;

  const token = await getAccessToken();

  const headers = new Headers(init?.headers);

  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set(
      "Authorization",
      `Bearer ${token}`
    );
  }

  console.log(
    `[API] ${init?.method || "GET"} ${fullUrl}`
  );

  const res = await fetch(fullUrl, {
    ...init,
    headers,
    credentials: "include",
  });

  const text = await res.text();

  if (!res.ok) {
    console.error(
      `[API] Error ${res.status}:`,
      text
    );

    throw new ApiError(
      `${init?.method ?? "GET"} ${path} -> ${res.status}: ${text}`
    );
  }

  if (!text) {
    return undefined as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return text as T;
  }
}

async function withFallback<T>(
  fn: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.warn(
      "[API] Fallback activated:",
      error instanceof Error
        ? error.message
        : error
    );

    return fallback;
  }
}

function mapOutcome(row: any): OutcomeSummary {
  return {
    id: String(row.id),
    title: row.title ?? "Untitled outcome",
    note: row.note ?? "",
    status: normalizeStatus(row.state),
    tools: row.tools ?? [],
    result: row.result ?? "",
    updatedAt:
      row.updated_at ??
      row.created_at ??
      new Date().toISOString(),
  };
}

function normalizeStatus(
  state: string | undefined
): OutcomeSummary["status"] {
  switch (state) {
    case "draft":
      return "draft";

    case "planned":
      return "planned";

    case "running":
    case "queued":
      return "running";

    case "delivered":
    case "completed":
    case "done":
      return "delivered";

    case "failed":
    case "cancelled":
      return "failed";

    default:
      return "draft";
  }
}

function mapPlan(
  outcomeId: string,
  data: any
): OutcomePlan {
  const rows = Array.isArray(data)
    ? data
    : data?.steps ?? [];

  return {
    outcomeId,

    title:
      data?.title ??
      data?.outcome?.title ??
      "Outcome",

    clarifyingQuestion:
      data?.clarifyingQuestion ??
      data?.clarifying_question ??
      undefined,

    steps: rows.map(
      (step: any, index: number) => ({
        id: String(step.id ?? index),
        index:
          step.index ??
          step.step_index ??
          index,

        title:
          step.title ??
          step.name ??
          `Step ${index + 1}`,

        detail:
          step.detail ??
          step.description ??
          "",

        tools:
          step.tools ??
          [],

        tag:
          step.tag ??
          step.state ??
          "STEP",
      })
    ),

    scope:
      data?.scope ??
      [],

    sources:
      data?.sources ??
      data?.citations ??
      [],

    writeAccess:
      Boolean(
        data?.writeAccess ??
        data?.write_access ??
        false
      ),
  };
}

export const api = {
  outcomes: {
    list: (): Promise<OutcomeSummary[]> =>
      withFallback(
        async () => {
          const data = await request<any>(
            "/api/outcomes"
          );

          if (!Array.isArray(data)) {
            return [];
          }

          return data.map(mapOutcome);
        },
        mockOutcomes
      ),

    create: async (
      title: string
    ): Promise<OutcomePlan> =>
      withFallback(
        async () => {
          const created = await request<any>(
            "/api/outcomes",
            {
              method: "POST",
              body: JSON.stringify({
                title,
              }),
            }
          );

          const outcomeId = String(
            created.id ??
              created.outcomeId
          );

          if (!outcomeId) {
            throw new ApiError(
              "Backend did not return an outcome ID."
            );
          }

          try {
            const plan = await request<any>(
              `/api/outcomes/${outcomeId}/plan`
            );

            return mapPlan(
              outcomeId,
              {
                ...plan,
                title:
                  plan?.title ??
                  created.title ??
                  title,
              }
            );
          } catch {
            return {
              ...mockPlan,
              outcomeId,
              title:
                created.title ??
                title,
            };
          }
        },
        {
          ...mockPlan,
          title: title || mockPlan.title,
        }
      ),

    plan: (
      id: string
    ): Promise<OutcomePlan> =>
      withFallback(
        async () => {
          const data = await request<any>(
            `/api/outcomes/${id}/plan`
          );

          return mapPlan(id, data);
        },
        {
          ...mockPlan,
          outcomeId: id,
        }
      ),

    answerClarifyingQuestion: async (
      id: string,
      optionIndex: number
    ): Promise<OutcomePlan> =>
      withFallback(
        async () => {
          const plan = await request<any>(
            `/api/outcomes/${id}/clarify`,
            {
              method: "POST",
              body: JSON.stringify({
                answer: String(optionIndex),
              }),
            }
          );

          return mapPlan(id, plan);
        },
        {
          ...mockPlan,
          outcomeId: id,
        }
      ),

    startRun: async (
      id: string
    ): Promise<OutcomeRun> =>
      withFallback(
        async () => {
          const created = await request<any>(
            `/api/outcomes/${id}/run`,
            {
              method: "POST",
            }
          );

          return {
            ...mockRun,
            outcomeId: id,
            status: "running",
            headline:
              created?.message ??
              mockRun.headline,
          };
        },
        {
          ...mockRun,
          outcomeId: id,
        }
      ),

    run: async (
      id: string
    ): Promise<OutcomeRun> =>
      withFallback(
        async () => {
          const data = await request<any>(
            `/api/outcomes/${id}/run`
          );

          return {
            ...mockRun,
            ...data,
            outcomeId: id,
          };
        },
        {
          ...mockRun,
          outcomeId: id,
        }
      ),

    detail: async (
      id: string
    ): Promise<OutcomeDetail> =>
      withFallback(
        async () => {
          const data = await request<any>(
            `/api/outcomes/${id}`
          );

          const outcome =
            data?.outcome ?? {};

          return {
            ...mockDetail,

            id,

            title:
              outcome.title ??
              mockDetail.title,

            status:
              normalizeStatus(
                outcome.state
              ),

            headline:
              data?.answer?.headline ??
              mockDetail.headline,

            narration:
              data?.answer?.narration ??
              mockDetail.narration,

            trail:
              data?.citations ??
              mockDetail.trail,

            artifacts:
              data?.artifacts ??
              mockDetail.artifacts,
          };
        },
        {
          ...mockDetail,
          id,
        }
      ),
  },

  connections: {
    list: (): Promise<ConnectionGroup[]> =>
      withFallback(
        async () => {
          const data = await request<any>(
            "/api/connections"
          );

          if (!Array.isArray(data)) {
            return [];
          }

          return data.map(
            (connection: any) => ({
              name:
                connection.tool_id ??
                "Unknown",

              note:
                connection.state ??
                "not_connected",

              items: [
                {
                  id:
                    connection.tool_id,

                  name:
                    connection.tool_id,

                  icon:
                    connection.tool_id,

                  status:
                    connection.state ===
                    "connected"
                      ? "connected"
                      : connection.state ===
                        "error"
                      ? "attention"
                      : "not_connected",

                  reads: "",

                  actionLabel:
                    connection.state ===
                    "connected"
                      ? "Disconnect"
                      : "Connect",
                },
              ],
            })
          );
        },
        mockConnections
      ),

    connect: async (
      toolId: string
    ): Promise<{
      redirect_url: string;
    }> =>
      withFallback(
        async () => {
          const result =
            await request<{
              redirect_url: string;
            }>(
              `/api/connections/${toolId}/authorize`,
              {
                method: "POST",
              }
            );

          if (
            result?.redirect_url &&
            typeof window !== "undefined"
          ) {
            window.location.assign(
              result.redirect_url
            );
          }

          return result;
        },
        {
          redirect_url: "",
        }
      ),

    disconnect: (
      toolId: string
    ): Promise<void> =>
      withFallback(
        async () => {
          await request(
            `/api/connections/${toolId}`,
            {
              method: "DELETE",
            }
          );
        },
        undefined
      ),
  },
};
