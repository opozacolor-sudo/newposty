import {
  createCommentAutomation,
  listCommentAutomations,
  updateCommentAutomation,
  type ZernioCommentAutomation,
} from "@/lib/zernio";

export type ReattachAccount = {
  id: string;
  platform: string;
  username?: string | null;
  isActive: boolean;
};

export type ReattachMove = {
  automationId: string;
  fromAccountId: string;
  toAccountId: string;
  alreadyOnTarget: boolean;
};

function keywordsKey(keywords?: string[]) {
  return [...(keywords ?? [])]
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
    .sort()
    .join("|");
}

function sameAutomation(left: ZernioCommentAutomation, right: ZernioCommentAutomation) {
  const leftKey = keywordsKey(left.keywords);
  const rightKey = keywordsKey(right.keywords);
  if (leftKey && rightKey) return leftKey === rightKey;
  const leftName = (left.name ?? "").trim().toLowerCase();
  const rightName = (right.name ?? "").trim().toLowerCase();
  return Boolean(leftName) && leftName === rightName;
}

export function planAutomationReattach(
  automations: ZernioCommentAutomation[],
  accounts: ReattachAccount[],
): ReattachMove[] {
  const byId = new Map(accounts.map((account) => [account.id, account]));
  const live = accounts.filter((account) => account.isActive && account.id);
  const moves: ReattachMove[] = [];

  for (const automation of automations) {
    if (automation.isActive === false) continue;
    const accountId = automation.accountId ?? "";
    if (!accountId) continue;
    const current = byId.get(accountId);
    if (current?.isActive) continue;

    const platform = (current?.platform || automation.platform || "").toLowerCase();
    if (!platform) continue;
    const username = (current?.username || "").trim().toLowerCase();
    const target =
      live.find(
        (account) =>
          account.platform.toLowerCase() === platform &&
          (!username || !account.username || account.username.trim().toLowerCase() === username),
      ) ?? null;
    if (!target || target.id === accountId) continue;

    const alreadyOnTarget = automations.some(
      (row) =>
        row.id !== automation.id &&
        row.accountId === target.id &&
        row.isActive !== false &&
        sameAutomation(row, automation),
    );
    moves.push({
      automationId: automation.id,
      fromAccountId: accountId,
      toAccountId: target.id,
      alreadyOnTarget,
    });
  }

  return moves;
}

function clonePayload(automation: ZernioCommentAutomation, profileId: string, accountId: string) {
  return {
    profileId,
    accountId,
    name: automation.name || "Comment campaign",
    trigger: automation.trigger,
    keywords: automation.keywords,
    matchMode: automation.matchMode,
    typoTolerance: automation.typoTolerance,
    excludeKeywords: automation.excludeKeywords,
    commentReply: automation.commentReply,
    commentReplyVariations: automation.commentReplyVariations,
    dmMessage: automation.dmMessage,
    dmMessageVariations: automation.dmMessageVariations,
    buttons: automation.buttons,
    publicReplyPolicy: automation.publicReplyPolicy,
    audience: automation.audience,
    followGate: automation.followGate,
    alsoMatchInDms: automation.alsoMatchInDms,
    repeatPolicy: automation.repeatPolicy,
    isActive: true,
  };
}

export async function reattachCommentAutomations(profileId: string, accounts: ReattachAccount[]) {
  if (!profileId || accounts.length === 0) return [];
  const automations = await listCommentAutomations();
  const moves = planAutomationReattach(automations, accounts);
  const byId = new Map(automations.map((row) => [row.id, row]));

  for (const move of moves) {
    const source = byId.get(move.automationId);
    if (!source) continue;
    if (!move.alreadyOnTarget) {
      await createCommentAutomation(clonePayload(source, profileId, move.toAccountId));
    }
    await updateCommentAutomation(move.automationId, { isActive: false });
  }

  return moves;
}
