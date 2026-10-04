import assert from "node:assert/strict";
import test from "node:test";
import {
  canEnableLeadAgent,
  extractSameOriginLinks,
  htmlToExcerpt,
  matchKnowledgePage,
  pickCrawlTargets,
} from "./knowledge";

test("enable stays locked until the agent is trained", () => {
  assert.equal(canEnableLeadAgent(null), false);
  assert.equal(canEnableLeadAgent({ trained_at: null }), false);
  assert.equal(canEnableLeadAgent({ trained_at: "2026-10-04T00:00:00.000Z" }), true);
});

test("crawler stays on the same site and prefers product pages", () => {
  const html = `
    <a href="/produs/crema">crema</a>
    <a href="https://evil.example/x">out</a>
    <a href="/despre">despre</a>
  `;
  const links = extractSameOriginLinks(html, "https://salon.example/");
  assert.ok(links.some((url) => url.includes("/produs/crema")));
  assert.equal(links.some((url) => url.includes("evil.example")), false);
  const picked = pickCrawlTargets("https://salon.example/", links, 3);
  assert.equal(picked[0], "https://salon.example/");
  assert.ok(picked.some((url) => url.includes("/produs/crema")));
});

test("excerpt strips tags and matching prefers the product page", () => {
  assert.equal(htmlToExcerpt("<p>Cum se <b>aplică</b> crema</p>"), "Cum se aplică crema");
  const page = matchKnowledgePage(
    {
      products: [{ name: "Cremă de noapte", url: "https://shop.example/crema", howTo: "aplică seara" }],
      pages: [{ url: "https://shop.example/", title: "Home", excerpt: "shop", price: null }],
    },
    "cum se aplica crema?",
  );
  assert.equal(page?.url, "https://shop.example/crema");
});
