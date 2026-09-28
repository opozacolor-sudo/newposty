import assert from "node:assert/strict";
import test from "node:test";
import {
  analyticsPosts,
  engagementRate,
  flattenAnalyticsPost,
  heatmapFromBestTime,
  jsDayFromApiMonday,
  sumDailyMetrics,
} from "./analytics-parse";

test("flattenAnalyticsPost reads platforms[] and falls back to top-level analytics", () => {
  const rows = flattenAnalyticsPost(
    {
      postId: "p1",
      content: "hello",
      publishedAt: "2026-09-11T10:00:00.000Z",
      thumbnailUrl: "https://img",
      mediaType: "video",
      analytics: { likes: 1, reach: 10 },
      platforms: [
        {
          platform: "tiktok",
          accountId: "acc-a",
          platformPostUrl: "https://tt/1",
          analytics: { likes: 15, reach: 262, views: 290, shares: 2 },
        },
        {
          platform: "instagram",
          accountId: "acc-other",
          analytics: { likes: 99, reach: 1 },
        },
      ],
    },
    new Set(["acc-a"]),
  );
  assert.equal(rows.length, 1);
  assert.equal(rows[0]?.platform, "tiktok");
  assert.equal(rows[0]?.likes, 15);
  assert.equal(rows[0]?.reach, 262);
  assert.equal(rows[0]?.url, "https://tt/1");
});

test("flattenAnalyticsPost still accepts legacy platformAnalytics", () => {
  const rows = flattenAnalyticsPost({
    _id: "p2",
    platformAnalytics: [
      { platform: "instagram", accountId: { _id: "acc-b" }, analytics: { likes: 5, reach: 93 } },
    ],
  });
  assert.equal(rows[0]?.accountId, "acc-b");
  assert.equal(rows[0]?.likes, 5);
});

test("engagementRate uses reach first so it matches the dashboard (~1.2%)", () => {
  const rate = engagementRate({
    likes: 45,
    comments: 0,
    shares: 4,
    saves: 4,
    reach: 4324,
    impressions: 222,
    views: 5081,
  });
  assert.equal(rate, 1.23);
});

test("analyticsPosts unwraps { posts, pagination }", () => {
  const posts = analyticsPosts({ posts: [{ postId: "a" }, { postId: "b" }], pagination: { total: 2 } });
  assert.equal(posts.length, 2);
});

test("best-time Monday=0 maps onto JS Sunday=0 heatmap days", () => {
  assert.equal(jsDayFromApiMonday(0), 1);
  assert.equal(jsDayFromApiMonday(4), 5);
  assert.equal(jsDayFromApiMonday(6), 0);
  const { heatmap, best } = heatmapFromBestTime([
    { day_of_week: 4, hour: 8, avg_engagement: 6.333333333333333, post_count: 3 },
    { day_of_week: 1, hour: 16, avg_engagement: 5, post_count: 2 },
    { day_of_week: 0, hour: 10, avg_engagement: 3.5, post_count: 2 },
  ]);
  assert.equal(heatmap[5]?.[8], 6.333333333333333);
  assert.deepEqual(
    best.map((slot) => `${slot.day}-${slot.hour}-${slot.score}`),
    ["5-8-6.3", "2-16-5", "1-10-3.5"],
  );
});

test("sumDailyMetrics prefers platformBreakdown", () => {
  const totals = sumDailyMetrics({
    dailyData: [{ date: "2026-09-11", postCount: 2, metrics: { likes: 99, reach: 1 } }],
    platformBreakdown: [
      { platform: "tiktok", postCount: 18, likes: 38, reach: 4231, views: 4859, shares: 3, saves: 3 },
      { platform: "instagram", postCount: 17, likes: 5, reach: 93, impressions: 222, views: 222, shares: 1, saves: 1 },
    ],
  });
  assert.equal(totals.posts, 35);
  assert.equal(totals.likes, 43);
  assert.equal(totals.reach, 4324);
});
