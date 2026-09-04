import type {
  OutcomeSummary,
  OutcomePlan,
  OutcomeRun,
  OutcomeDetail,
  ConnectionGroup,
  ToolRef,
} from "./types";

const icon = (domain: string): string =>
  `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

export const TOOLS: Record<string, ToolRef> = {
  slack: { id: "slack", name: "Slack", icon: icon("slack.com") },
  gmail: { id: "gmail", name: "Gmail", icon: "https://cdn.simpleicons.org/gmail" },
  cal: { id: "cal", name: "Calendar", icon: "https://cdn.simpleicons.org/googlecalendar" },
  notion: { id: "notion", name: "Notion", icon: "https://cdn.simpleicons.org/notion" },
  linear: { id: "linear", name: "Linear", icon: "https://cdn.simpleicons.org/linear" },
  jira: { id: "jira", name: "Jira", icon: "https://cdn.simpleicons.org/jira" },
  hubspot: { id: "hubspot", name: "HubSpot", icon: "https://cdn.simpleicons.org/hubspot" },
  zendesk: { id: "zendesk", name: "Zendesk", icon: icon("zendesk.com") },
  salesforce: { id: "salesforce", name: "Salesforce", icon: "https://cdn.simpleicons.org/salesforce" },
};

export const mockOutcomes: OutcomeSummary[] = [
  {
    id: "churn-q4",
    title: "Churn risk — Q4 renewals",
    note: "84 accounts renewing before December",
    status: "delivered",
    tools: [TOOLS.hubspot, TOOLS.gmail, TOOLS.slack],
    result: "$412k at risk",
    updatedAt: new Date(Date.now() - 1000 * 60 * 9).toISOString(),
  },
  {
    id: "onboarding-drop",
    title: "Why week-two onboarding stalls",
    note: "Cohort analysis across last 6 months",
    status: "running",
    tools: [TOOLS.notion, TOOLS.linear],
    result: "In progress",
    updatedAt: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
  },
  {
    id: "pipeline-review",
    title: "Weekly pipeline review",
    note: "Deals moving out of forecast",
    status: "planned",
    tools: [TOOLS.salesforce, TOOLS.slack],
    result: "Not run",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
];

export const mockPlan: OutcomePlan = {
  outcomeId: "churn-q4",
  title: "Find our Q4 churn risk among renewing accounts and tell me who to save first.",
  clarifyingQuestion: {
    question: "All 212 accounts, or just the 84 on annual contracts renewing before December?",
    options: ["The 84 renewing accounts", "All 212"],
    answeredAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
  },
  steps: [
    {
      id: "s1",
      index: 1,
      title: "Pull renewal cohort from HubSpot",
      detail: "Filter to annual contracts renewing before Dec 31, exclude paused seats.",
      tools: [TOOLS.hubspot],
      tag: "READ",
    },
    {
      id: "s2",
      index: 2,
      title: "Score against onboarding, support load, champion movement",
      detail: "Cross-reference product usage and support ticket volume per account.",
      tools: [TOOLS.hubspot, TOOLS.zendesk],
      tag: "READ",
    },
    {
      id: "s3",
      index: 3,
      title: "Draft save-play emails for at-risk accounts",
      detail: "One email per account, matched to how that account typically communicates.",
      tools: [TOOLS.gmail],
      tag: "DRAFT",
    },
    {
      id: "s4",
      index: 4,
      title: "Post summary to #cs-leadership",
      detail: "Only after you approve — nothing sends automatically.",
      tools: [TOOLS.slack],
      tag: "DRAFT",
    },
    {
      id: "s5",
      index: 5,
      title: "Compile the findings doc",
      detail: "Ranked account table, shared cause, and recommended save plays.",
      tools: [TOOLS.notion],
      tag: "WRITE",
    },
  ],
  scope: [
    { label: "Accounts", value: "84" },
    { label: "Time window", value: "Now → Dec 31" },
    { label: "Tools used", value: "3" },
    { label: "Write access", value: "Off" },
  ],
  sources: [
    { id: "hubspot", name: "HubSpot", icon: TOOLS.hubspot.icon, detail: "84 accounts" },
    { id: "zendesk", name: "Zendesk", icon: TOOLS.zendesk.icon, detail: "not connected" },
    { id: "gmail", name: "Gmail", icon: TOOLS.gmail.icon, detail: "last 90 days" },
    { id: "slack", name: "Slack", icon: TOOLS.slack.icon, detail: "#cs-leadership" },
  ],
  writeAccess: false,
};

export const mockRun: OutcomeRun = {
  outcomeId: "churn-q4",
  status: "running",
  currentStepIndex: 4,
  totalSteps: 5,
  percent: 58,
  elapsedSeconds: 252,
  etaSeconds: 360,
  headline: "Finding the cause they share",
  narration:
    "Scoring 84 accounts against onboarding milestones, support load and champion movement. Six of them keep landing in the same place.",
  readingNow: [TOOLS.hubspot, TOOLS.zendesk, TOOLS.gmail],
  steps: [
    { id: "s1", title: "Pull renewal cohort from HubSpot", detail: "84 accounts pulled.", state: "done", time: "00:41" },
    { id: "s2", title: "Score against onboarding, support load, champion movement", detail: "Cross-referencing usage and tickets.", state: "active", time: "04:12" },
    { id: "s3", title: "Draft save-play emails for at-risk accounts", detail: "Waiting on scoring.", state: "pending", time: "—" },
    { id: "s4", title: "Post summary to #cs-leadership", detail: "Waiting on approval.", state: "pending", time: "—" },
    { id: "s5", title: "Compile the findings doc", detail: "Waiting.", state: "pending", time: "—" },
  ],
  log: [
    { time: "00:12", tag: "read", message: "hubspot: fetched 84 accounts" },
    { time: "00:41", tag: "done", message: "cohort ready — 84 accounts" },
    { time: "01:05", tag: "read", message: "zendesk: no ticket history for Northwind" },
    { time: "02:20", tag: "score", message: "scoring onboarding milestones" },
    { time: "03:41", tag: "flag", message: "6 accounts share same drop-off point" },
  ],
};

export const mockDetail: OutcomeDetail = {
  id: "churn-q4",
  title: "Churn risk — Q4 renewals",
  status: "delivered",
  minutesTaken: 9,
  headline: "Nine accounts are at risk — $412k. Six of them broke in the same place.",
  narration:
    "You asked me who's leaving. The more useful answer is that six of the nine never finished week-two onboarding — same drop-off, three different CSMs. Save these six and you've bought a quarter. Fix week two and you stop rebuying it.",
  stats: [
    { label: "At risk", value: "$412k", sub: "9 accounts" },
    { label: "Shared cause", value: "6 of 9", sub: "week-two onboarding" },
    { label: "Save plays drafted", value: "5", sub: "ready to send" },
    { label: "Confidence", value: "High", sub: "except Northwind" },
  ],
  accounts: [
    { name: "Northwind", initial: "N", color: "#A8412C", arr: "$62k", riskPercent: 88, riskLabel: "88%", why: "Usage drop, no ticket history" },
    { name: "Bramblecare", initial: "B", color: "#8C5A13", arr: "$54k", riskPercent: 81, riskLabel: "81%", why: "Stalled at week-two onboarding" },
    { name: "Fintra", initial: "F", color: "#8C5A13", arr: "$49k", riskPercent: 77, riskLabel: "77%", why: "Champion left in September" },
    { name: "Ledgerly", initial: "L", color: "#2159C5", arr: "$41k", riskPercent: 64, riskLabel: "64%", why: "Support load 3x baseline" },
    { name: "Havenly", initial: "H", color: "#2159C5", arr: "$38k", riskPercent: 58, riskLabel: "58%", why: "Stalled at week-two onboarding" },
    { name: "Circuiton", initial: "C", color: "#2159C5", arr: "$33k", riskPercent: 52, riskLabel: "52%", why: "Stalled at week-two onboarding" },
  ],
  trail: [
    { source: "HubSpot", what: "pulled 84 renewing accounts", ref: "hubspot.com/contacts/renewals" },
    { source: "Zendesk", what: "no ticket history found for Northwind", ref: "no access" },
    { source: "Product usage", what: "scored onboarding milestone completion", ref: "internal — usage_events" },
    { source: "Gmail", what: "drafted 5 save-play emails", ref: "drafts folder" },
    { source: "March QBR notes", what: "recalled: paused seats don't count as churn risk", ref: "memory" },
  ],
  artifacts: [
    { kind: "DOC", name: "Q4 churn findings", dest: "Notion", size: "2 pages" },
    { kind: "SHEET", name: "Ranked account table", dest: "Notion", size: "9 rows" },
    { kind: "DRAFT", name: "5 save-play emails", dest: "Gmail drafts", size: "5 items" },
    { kind: "MSG", name: "#cs-leadership summary", dest: "Slack", size: "1 draft" },
  ],
};

export const mockConnections: ConnectionGroup[] = [
  {
    name: "Communication",
    note: "read-only unless noted",
    items: [
      { id: "slack", name: "Slack", icon: TOOLS.slack.icon, status: "connected", reads: "Public channels you've shared", actionLabel: "Manage" },
      { id: "gmail", name: "Gmail", icon: TOOLS.gmail.icon, status: "connected", reads: "Last 90 days, drafts only for writes", actionLabel: "Manage" },
      { id: "cal", name: "Calendar", icon: TOOLS.cal.icon, status: "connected", reads: "Meetings and attendees", actionLabel: "Manage" },
    ],
  },
  {
    name: "Product & work",
    note: "",
    items: [
      { id: "notion", name: "Notion", icon: TOOLS.notion.icon, status: "connected", reads: "Shared workspaces", actionLabel: "Manage" },
      { id: "linear", name: "Linear", icon: TOOLS.linear.icon, status: "connected", reads: "Issues and cycles", actionLabel: "Manage" },
      { id: "jira", name: "Jira", icon: TOOLS.jira.icon, status: "not_connected", reads: "Not connected yet", actionLabel: "Connect" },
    ],
  },
  {
    name: "Revenue",
    note: "",
    items: [
      { id: "hubspot", name: "HubSpot", icon: TOOLS.hubspot.icon, status: "connected", reads: "Contacts, deals, tickets", actionLabel: "Manage" },
      { id: "salesforce", name: "Salesforce", icon: TOOLS.salesforce.icon, status: "connected", reads: "Accounts and opportunities", actionLabel: "Manage" },
      { id: "zendesk", name: "Zendesk", icon: TOOLS.zendesk.icon, status: "attention", reads: "Requested — waiting on admin approval", actionLabel: "Connect" },
    ],
  },
];
