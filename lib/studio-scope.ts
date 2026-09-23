export function platformAccountId(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (value && typeof value === "object" && "_id" in value) {
    const id = (value as { _id?: unknown })._id;
    if (typeof id === "string" && id.trim()) return id.trim();
  }
  return null;
}

export function scopePosts<T extends { platforms?: Array<{ accountId?: unknown }> }>(
  posts: T[],
  owned: Set<string>,
): T[] {
  const kept: T[] = [];
  for (const post of posts) {
    const platforms = (post.platforms ?? []).filter((target) => {
      const id = platformAccountId(target.accountId);
      return id !== null && owned.has(id);
    });
    if (platforms.length === 0) continue;
    kept.push({ ...post, platforms });
  }
  return kept;
}

export function scopeByAccountId<T>(
  rows: T[],
  owned: Set<string>,
  readId: (row: T) => unknown,
): T[] {
  return rows.filter((row) => {
    const id = platformAccountId(readId(row));
    return id !== null && owned.has(id);
  });
}

export function ownsAccount(owned: Set<string>, accountId: string | null | undefined) {
  return typeof accountId === "string" && owned.has(accountId);
}
