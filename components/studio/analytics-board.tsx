"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { platformLabel } from "@/lib/platforms";
import type { AnalyticsBoard } from "@/lib/studio-feed";

const PLATFORM_COLOR: Record<string, string> = {
  instagram: "#E1306C",
  tiktok: "#111827",
  facebook: "#1877F2",
  youtube: "#FF0000",
  linkedin: "#0A66C2",
  threads: "#000000",
  pinterest: "#E60023",
};

function color(platform: string) {
  return PLATFORM_COLOR[platform] ?? "#FF4713";
}

function Card({ title, aside, children }: { title: string; aside?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-neutral-200 p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h2 className="text-sm font-semibold">{title}</h2>
        {aside ? <span className="text-xs text-neutral-400">{aside}</span> : null}
      </div>
      {children}
    </section>
  );
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function AnalyticsBoardView({
  board,
  labels,
}: {
  board: AnalyticsBoard;
  labels: {
    engagement: string;
    reach: string;
    followers: string;
    posts: string;
    postsPlatform: string;
    postsTime: string;
    likesPlatform: string;
    likesTime: string;
    engagementTime: string;
    bestTime: string;
    followerEvolution: string;
    formats: string;
    breakdown: string;
    top: string;
    likes: string;
    comments: string;
    shares: string;
    views: string;
    impressions: string;
    clicks: string;
    saves: string;
  };
}) {
  const maxHeat = Math.max(1, ...board.heatmap.flat());
  return (
    <div className="mt-6 space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          [labels.engagement, `${board.engagementRate}%`],
          [labels.reach, board.reach.toLocaleString()],
          [labels.followers, board.followers.toLocaleString()],
          [labels.posts, String(board.posts)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-neutral-200 px-4 py-3">
            <p className="text-xs text-neutral-500">{label}</p>
            <p className="mt-1 text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title={labels.postsPlatform} aside={String(board.posts)}>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={board.byPlatform}>
                <CartesianGrid vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="platform" tickFormatter={platformLabel} tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={28} />
                <Tooltip />
                <Bar dataKey="posts" radius={4}>
                  {board.byPlatform.map((entry) => (
                    <Cell key={entry.platform} fill={color(entry.platform)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title={labels.postsTime}>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={board.weeks}>
                <CartesianGrid vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={28} />
                <Tooltip />
                <Bar dataKey="posts" fill="#E1306C" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title={labels.likesPlatform} aside={board.likes.toLocaleString()}>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={board.byPlatform}>
                <CartesianGrid vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="platform" tickFormatter={platformLabel} tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={28} />
                <Tooltip />
                <Bar dataKey="likes" fill="#111827" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title={labels.likesTime}>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={board.weeks}>
                <CartesianGrid vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={28} />
                <Tooltip />
                <Bar dataKey="likes" fill="#111827" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card title={labels.engagementTime}>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={board.weeks}>
              <CartesianGrid stroke="#F3F4F6" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} width={32} />
              <Tooltip />
              <Line type="monotone" dataKey="likes" stroke="#EF4444" dot={false} strokeWidth={2} name={labels.likes} />
              <Line type="monotone" dataKey="comments" stroke="#3B82F6" dot={false} strokeWidth={2} name={labels.comments} />
              <Line type="monotone" dataKey="views" stroke="#8B5CF6" dot={false} strokeWidth={2} name={labels.views} />
              <Line type="monotone" dataKey="impressions" stroke="#14B8A6" dot={false} strokeWidth={2} name={labels.impressions} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <dl className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
          {(
            [
              [labels.likes, board.likes],
              [labels.comments, board.comments],
              [labels.shares, board.shares],
              [labels.views, board.views],
              [labels.impressions, board.impressions],
              [labels.reach, board.reach],
              [labels.clicks, board.clicks],
              [labels.saves, board.saves],
            ] as const
          ).map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs text-neutral-500">{label}</dt>
              <dd className="font-semibold">{value.toLocaleString()}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title={labels.bestTime}>
          <div className="grid grid-cols-[2rem_1fr] gap-1 text-[10px] text-neutral-400">
            <div />
            <div className="grid grid-cols-12">
              {Array.from({ length: 12 }, (_, hour) => (
                <span key={hour}>{hour * 2}</span>
              ))}
            </div>
            {board.heatmap.map((hours, day) => (
              <div key={DAYS[day]} className="contents">
                <span className="self-center">{DAYS[day]}</span>
                <div className="grid gap-px" style={{ gridTemplateColumns: "repeat(24, minmax(0, 1fr))" }}>
                  {hours.map((score, hour) => (
                    <span
                      key={hour}
                      className="aspect-square rounded-[2px]"
                      style={{ background: `rgba(16, 185, 129, ${0.08 + (score / maxHeat) * 0.92})` }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-neutral-500">
            {board.best
              .map((slot) => `${DAYS[slot.day]} ${String(slot.hour).padStart(2, "0")}:00`)
              .join(" · ")}
          </p>
        </Card>
        <Card title={labels.followerEvolution} aside={board.followers.toLocaleString()}>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={board.followersSeries}>
                <CartesianGrid stroke="#F3F4F6" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} width={36} />
                <Tooltip />
                <Line type="monotone" dataKey="followers" stroke="#E1306C" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card title={labels.formats}>
        <ul className="space-y-3">
          {board.formats.map((format) => {
            const max = Math.max(1, ...board.formats.map((item) => item.posts));
            return (
              <li key={format.type}>
                <div className="flex justify-between text-sm">
                  <span className="capitalize">{format.type}</span>
                  <span className="text-neutral-500">{format.posts}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-neutral-100">
                  <div className="h-2 rounded-full bg-neutral-800" style={{ width: `${(format.posts / max) * 100}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      </Card>

      <Card title={labels.breakdown}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs text-neutral-500">
              <tr>
                <th className="py-2 pr-3 font-medium">{labels.postsPlatform}</th>
                <th className="py-2 pr-3 font-medium">{labels.posts}</th>
                <th className="py-2 pr-3 font-medium">{labels.likes}</th>
                <th className="py-2 pr-3 font-medium">{labels.comments}</th>
                <th className="py-2 pr-3 font-medium">{labels.shares}</th>
                <th className="py-2 pr-3 font-medium">{labels.views}</th>
                <th className="py-2 pr-3 font-medium">{labels.impressions}</th>
                <th className="py-2 font-medium">{labels.reach}</th>
              </tr>
            </thead>
            <tbody>
              {board.byPlatform.map((row) => (
                <tr key={row.platform} className="border-t border-neutral-100">
                  <td className="py-2 pr-3">{platformLabel(row.platform)}</td>
                  <td className="py-2 pr-3">{row.posts}</td>
                  <td className="py-2 pr-3">{row.likes.toLocaleString()}</td>
                  <td className="py-2 pr-3">{row.comments.toLocaleString()}</td>
                  <td className="py-2 pr-3">{row.shares.toLocaleString()}</td>
                  <td className="py-2 pr-3">{row.views.toLocaleString()}</td>
                  <td className="py-2 pr-3">{row.impressions.toLocaleString()}</td>
                  <td className="py-2">{row.reach.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title={labels.top}>
        <ul className="divide-y divide-neutral-100">
          {board.top.map((post, index) => (
            <li key={`${post.platform}-${index}`} className="flex items-start justify-between gap-4 py-3 text-sm">
              <div className="min-w-0">
                <p className="truncate font-medium">{post.content || "—"}</p>
                <p className="text-xs text-neutral-500">
                  {platformLabel(post.platform)}
                  {post.publishedAt ? ` · ${new Date(post.publishedAt).toLocaleDateString()}` : ""}
                </p>
              </div>
              <p className="shrink-0 text-xs text-neutral-500">
                {post.likes} {labels.likes.toLowerCase()} · {post.rate}%
              </p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
