export type PostMode = "publish_now" | "schedule";
export type CaptionSource = "user_provided" | "ai_generated";
export type ChatActionKind = "create" | "manage";
export type ChatActionStatus = "pending" | "executing" | "executed" | "cancelled";
export type ManageAction = "reschedule" | "cancel" | "edit_caption";

export type ChatMedia = {
  id: string;
  url: string;
  type: "image" | "video";
  name?: string | null;
};

export type ToolPostAction = {
  mode: PostMode;
  scheduled_at_iso?: string;
  platforms: string[];
  excluded_platforms?: string[];
  caption?: string;
  caption_source?: CaptionSource;
  content_type?: string;
  media_refs?: string[];
};

export type ConnectedAccount = {
  id: string;
  platform: string;
  username: string | null;
  display_name: string | null;
  zernio_account_id: string;
};

export type ResolvedPlatform = {
  platform: string;
  accountId: string;
  zernioAccountId: string;
  handle: string;
  caption: string;
  captionTruncated: boolean;
  contentType?: string;
  requestId: string;
};

export type ExcludedPlatform = {
  platform: string;
  reason: string;
};

export type ResolvedCreateAction = {
  mode: PostMode;
  scheduled_at_iso: string | null;
  scheduled_at_utc: string | null;
  scheduled_label: string | null;
  platforms: ResolvedPlatform[];
  media: ChatMedia[];
  caption_source: CaptionSource;
};

export type ResolvedAction = {
  action_id: string;
  kind: ChatActionKind;
  timezone: string;
  locale: string;
  actions: ResolvedCreateAction[];
  excluded_by_validation: ExcludedPlatform[];
  excluded_platforms: string[];
  warnings: string[];
  manage?: {
    action: ManageAction;
    postActionId: string;
    zernioPostId: string;
    platform: string;
    handle: string;
    caption: string;
    scheduled_at_utc: string | null;
    scheduled_label: string | null;
    new_value?: string;
  };
};

export type PlatformExecResult = {
  platform: string;
  handle: string;
  status: "success" | "error";
  post_url?: string | null;
  zernio_post_id?: string | null;
  error_code?: string | null;
  error_message_human: string | null;
};

export type PendingIntent = {
  missing: Array<"platform" | "media" | "caption" | "time">;
  actions: ToolPostAction[];
  media_refs: string[];
  saved_at: string;
};

export type ConfirmationPayload = {
  type: "confirmation";
  action_id: string;
  resolved: ResolvedAction;
};

export type ResultsPayload = {
  type: "results";
  action_id: string;
  results: PlatformExecResult[];
  allFailed: boolean;
  skippedConfirmation?: boolean;
};

export type SummaryPayload = {
  type: "summary";
  action_id: string;
  results: PlatformExecResult[];
  allFailed: boolean;
};
