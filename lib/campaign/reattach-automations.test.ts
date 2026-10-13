import assert from "node:assert/strict";
import test from "node:test";
import { planAutomationReattach } from "./reattach-automations";

test("reattach skips automations already on a live account", () => {
  const moves = planAutomationReattach(
    [{ id: "a1", accountId: "live", platform: "instagram", keywords: ["vreau"], isActive: true }],
    [
      { id: "live", platform: "instagram", username: "posty.now", isActive: true },
      { id: "dead", platform: "instagram", username: "posty.now", isActive: false },
    ],
  );
  assert.deepEqual(moves, []);
});

test("reattach moves a live campaign from a dead Instagram to the new username match", () => {
  const moves = planAutomationReattach(
    [
      {
        id: "old",
        name: "Campanie vreau",
        accountId: "dead",
        platform: "instagram",
        keywords: ["vreau"],
        isActive: true,
      },
    ],
    [
      { id: "dead", platform: "instagram", username: "posty.now", isActive: false },
      { id: "live", platform: "instagram", username: "posty.now", isActive: true },
    ],
  );
  assert.deepEqual(moves, [
    { automationId: "old", fromAccountId: "dead", toAccountId: "live", alreadyOnTarget: false },
  ]);
});

test("reattach only deactivates the old row when the new account already has the same keywords", () => {
  const moves = planAutomationReattach(
    [
      { id: "old", accountId: "dead", platform: "instagram", keywords: ["vreau"], isActive: true },
      { id: "fresh", accountId: "live", platform: "instagram", keywords: ["vreau"], isActive: true },
    ],
    [
      { id: "dead", platform: "instagram", username: "posty.now", isActive: false },
      { id: "live", platform: "instagram", username: "posty.now", isActive: true },
    ],
  );
  assert.equal(moves[0]?.alreadyOnTarget, true);
  assert.equal(moves[0]?.toAccountId, "live");
});
