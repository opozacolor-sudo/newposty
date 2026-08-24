export type StudioAccessKind = "lifetime" | "legacy";

export type StudioAccess = {
  allowed: boolean;
  kind: StudioAccessKind;
  lifetime: boolean;
};

export function resolveStudioAccess(profile: { lifetime_access?: boolean | null } | null): StudioAccess {
  if (profile?.lifetime_access) {
    return { allowed: true, kind: "lifetime", lifetime: true };
  }
  // Public signup is closed. Existing studio users keep access until subscriptions exist.
  return { allowed: true, kind: "legacy", lifetime: false };
}

export function hasFullStudioAccess(profile: { lifetime_access?: boolean | null } | null) {
  return resolveStudioAccess(profile).allowed;
}
