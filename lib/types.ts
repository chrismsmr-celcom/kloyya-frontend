export type OutcomeStatus = "draft" | "planned" | "running" | "delivered" | "failed";

export interface ToolRef {
  id: string;
  name: string;
  icon: string; // favicon / simple-icons URL
}

export interface OutcomeSummary {
  id: string;
  title: string;
  note: string;
  status: OutcomeStatus;
  tools: ToolRef[];
  result: string;
  updatedAt: string; // ISO
}

export interface PlanStep {
  id: string;
  index: number;
  title: string;
  detail: string;
  tools: ToolRef[];
  tag: string;
}

export interface OutcomePlan {
  outcomeId: string;
  title: string;
  clarifyingQuestion?: {
    question: string;
    options: string[];
    answeredAt?: string;
  };
  steps: PlanStep[];
  scope: { label: string; value: string }[];
  sources: { id: string; name: string; icon: string; detail: string }[];
  writeAccess: boolean;
}

export interface RunStepStatus {
  id: string;
  title: string;
  detail: string;
  state: "done" | "active" | "pending";
  time: string;
}

export interface RunLogLine {
  time: string;
  tag: string;
  message: string;
}

export interface OutcomeRun {
  outcomeId: string;
  status: "running" | "paused" | "done";
  currentStepIndex: number;
  totalSteps: number;
  percent: number;
  elapsedSeconds: number;
  etaSeconds: number;
  headline: string;
  narration: string;
  readingNow: ToolRef[];
  steps: RunStepStatus[];
  log: RunLogLine[];
}

export interface OutcomeDetail {
  id: string;
  title: string;
  status: OutcomeStatus;
  minutesTaken: number;
  headline: string;
  narration: string;
  stats: { label: string; value: string; sub: string }[];
  accounts: {
    name: string;
    initial: string;
    color: string;
    arr: string;
    riskPercent: number;
    riskLabel: string;
    why: string;
  }[];
  trail: { source: string; what: string; ref: string }[];
  artifacts: { kind: string; name: string; dest: string; size: string }[];
}

export interface ConnectionTool {
  id: string;
  name: string;
  icon: string;
  status: "connected" | "not_connected" | "attention";
  reads: string;
  actionLabel: string;
}

export interface ConnectionGroup {
  name: string;
  note: string;
  items: ConnectionTool[];
}
