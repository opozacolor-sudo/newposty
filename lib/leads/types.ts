export type LeadSource = "message" | "comment" | "ad";
export type LeadStatus = "new" | "contacted" | "dismissed";
export type LeadStage =
  | "invited"
  | "await_consent"
  | "helping"
  | "ask_method"
  | "ask_income"
  | "ask_contact"
  | "qualified"
  | "dismissed";

export type LeadAnswers = {
  method?: "credit" | "cash" | null;
  salary?: number | null;
  tenureMonths?: number | null;
  fullName?: string | null;
  phone?: string | null;
  email?: string | null;
  eligible?: boolean | null;
  maxPrice?: number | null;
  offeredUrl?: string | null;
  clickedUrl?: string | null;
  clickedAt?: string | null;
};

export type LeadTranscriptItem = {
  role: "user" | "agent";
  text: string;
  at: string;
};

export type LeadThread = {
  id: string;
  user_id: string;
  client_id: string | null;
  source: LeadSource;
  platform: string | null;
  account_id: string;
  external_id: string;
  conversation_id: string | null;
  post_id: string | null;
  comment_id: string | null;
  author_name: string | null;
  author_handle: string | null;
  trigger_text: string | null;
  post_context: string | null;
  stage: LeadStage;
  answers: LeadAnswers;
  transcript: LeadTranscriptItem[];
  last_external_id: string | null;
};

export type LeadRow = {
  id: string;
  source: LeadSource;
  status: LeadStatus;
  platform: string | null;
  account_id: string | null;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  trigger_text: string | null;
  qualification: LeadAnswers;
  created_at: string;
};
