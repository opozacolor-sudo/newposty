"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Bookmark,
  Eye,
  FileText,
  Heart,
  Image as ImageIcon,
  Layers,
  MessageCircle,
  MousePointerClick,
  Share2,
  Users,
  Video,
} from "lucide-react";
import { getPlatform, platformLabel } from "@/lib/platforms";
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

function compact(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    notation: Math.abs(value) >= 1000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}

function dash(value: number, locale: string) {
  return value ? compact(value, locale) : "—";
}

function PlatformMark({ id }: { id: string }) {
  const platform = getPlatform(id);
  if (!platform) return <span className="text-xs">{platformLabel(id)}</span>;
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="inline-flex h-5 w-5 items-center justify-center rounded-[5px]"
        style={{ background: platform.iconBg }}
      >
        <svg viewBox="0 0 24 24" className="h-3 w-3 fill-white">
          <path d={platform.icon.path} />
        </svg>
      </span>
      <span>{platform.label}</span>
    </span>
  );
}

function Card({
  title,
  subtitle,
  aside,
  children,
}: {
  title: string;
  subtitle?: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold tracking-tight">{title}</h2>
          {subtitle ? <p className="mt-0.5 text-xs text-neutral-400">{subtitle}</p> : null}
        </div>
        {aside ? <div className="text-right">{aside}</div> : null}
      </div>
      {children}
    </section>
  );
}

function Delta({
  percent,
  absolute,
  days,
  vsPrior,
  inLast,
}: {
  percent: number | null;
  absolute?: number;
  days?: number;
  vsPrior: string;
  inLast: string;
}) {
  if (absolute !== undefined) {
    const down = absolute < 0;
    const up = absolute > 0;
    return (
      <p className={`mt-1 text-xs font-medium ${up ? "text-emerald-600" : down ? "text-red-600" : "text-neutral-400"}`}>
        {up ? "↗ " : down ? "↘ " : ""}
        {absolute > 0 ? "+" : ""}
        {absolute} {inLast.replace("{days}", String(days ?? 30))}
      </p>
    );
  }
  if (percent === null) return <p className="mt-1 text-xs text-neutral-400">—</p>;
  const up = percent > 0;
  const down = percent < 0;
  return (
    <p className={`mt-1 text-xs font-medium ${up ? "text-emerald-600" : down ? "text-red-600" : "text-neutral-400"}`}>
      {up ? "↗ " : down ? "↘ " : ""}
      {Math.abs(percent)}% {vsPrior}
    </p>
  );
}

const MON_FIRST = [1, 2, 3, 4, 5, 6, 0];

type Labels = {
  engagementRate: string;
  totalReach: string;
  totalFollowers: string;
  postsPeriod: string;
  postsPlatform: string;
  postsTime: string;
  bestPost: string;
  viewPost: string;
  vsPrior: string;
  inLastDays: string;
  postsTotal: string;
  topByPosts: string;
  postsPerWeek: string;
  likesPlatform: string;
  likesTime: string;
  engagementTime: string;
  bestTime: string;
  less: string;
  more: string;
  bestTimes: string;
  followerEvolution: string;
  followersPerPlatform: string;
  followersTotal: string;
  formats: string;
  formatAvg: string;
  bestFormat: string;
  vsAvg: string;
  breakdown: string;
  topPosts: string;
  cadenceTitle: string;
  cadenceHint: string;
  optimalCadence: string;
  perWeek: string;
  likes: string;
  comments: string;
  shares: string;
  saves: string;
  views: string;
  impressions: string;
  reach: string;
  clicks: string;
  posts: string;
  noContent: string;
  days: string[];
};

export function AnalyticsBoardView({
  board,
  locale,
  rangeDays,
  labels,
}: {
  board: AnalyticsBoard;
  locale: string;
  rangeDays: number;
  labels: Labels;
}) {
  const [metrics, setMetrics] = useState({
    likes: true,
    comments: true,
    shares: false,
    saves: false,
    views: true,
    impressions: true,
    reach: false,
    clicks: false,
  });

  const maxHeat = Math.max(1, ...board.heatmap.flat());
  const bestFormat = board.formats[0]?.type;
  const followerChart = useMemo(() => {
    const dates = new Set<string>();
    for (const series of board.followersByPlatform) {
      for (const point of series.series) dates.add(point.date);
    }
    return [...dates].sort().map((date) => {
      const row: Record<string, string | number> = { date: date.slice(5) };
      for (const series of board.followersByPlatform) {
        const point = series.series.find((item) => item.date === date);
        row[series.platform] = point?.followers ?? 0;
      }
      return row;
    });
  }, [board.followersByPlatform]);

  const cadenceChart = useMemo(() => {
    const buckets = ["1-2", "3-5", "6-10"] as const;
    return buckets.map((bucket) => {
      const row: Record<string, string | number> = { bucket: `${bucket}${labels.perWeek}` };
      for (const line of board.cadence) {
        const point = line.points.find((item) => item.bucket === bucket);
        if (point) row[line.platform] = point.rate;
      }
      return row;
    });
  }, [board.cadence, labels.perWeek]);

  function toggle(key: keyof typeof metrics) {
    setMetrics((current) => ({ ...current, [key]: !current[key] }));
  }

  const metricDefs = [
    { key: "likes" as const, label: labels.likes, value: board.likes, color: "#EF4444", icon: Heart },
    { key: "comments" as const, label: labels.comments, value: board.comments, color: "#3B82F6", icon: MessageCircle },
    { key: "shares" as const, label: labels.shares, value: board.shares, color: "#22C55E", icon: Share2 },
    { key: "saves" as const, label: labels.saves, value: board.saves, color: "#EC4899", icon: Bookmark },
    { key: "views" as const, label: labels.views, value: board.views, color: "#A855F7", icon: Eye },
    { key: "impressions" as const, label: labels.impressions, value: board.impressions, color: "#14B8A6", icon: Eye },
    { key: "reach" as const, label: labels.reach, value: board.reach, color: "#F59E0B", icon: Users },
    { key: "clicks" as const, label: labels.clicks, value: board.clicks, color: "#6366F1", icon: MousePointerClick },
  ];

  const formatIcon = (type: string) => {
    if (type.includes("video")) return Video;
    if (type.includes("carousel") || type.includes("album")) return Layers;
    if (type.includes("image") || type.includes("photo")) return ImageIcon;
    return FileText;
  };

  return (
    <div className="mt-6 space-y-4">
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <div className="grid sm:grid-cols-2">
          <Kpi
            label={labels.engagementRate}
            value={`${board.engagementRate}%`}
            delta={
              <Delta percent={board.deltas.engagementRate.percent} vsPrior={labels.vsPrior} inLast={labels.inLastDays} />
            }
          />
          <Kpi
            label={labels.totalReach}
            value={compact(board.reach, locale)}
            icon={<Eye size={16} />}
            delta={<Delta percent={board.deltas.reach.percent} vsPrior={labels.vsPrior} inLast={labels.inLastDays} />}
          />
          <Kpi
            label={labels.totalFollowers}
            value={compact(board.followers, locale)}
            icon={<Users size={16} />}
            delta={
              <Delta
                percent={null}
                absolute={board.followerGrowth}
                days={rangeDays}
                vsPrior={labels.vsPrior}
                inLast={labels.inLastDays}
              />
            }
          />
          <Kpi
            label={labels.postsPeriod}
            value={String(board.posts)}
            icon={<FileText size={16} />}
            delta={<Delta percent={board.deltas.posts.percent} vsPrior={labels.vsPrior} inLast={labels.inLastDays} />}
          />
        </div>
        {board.bestPost ? (
          <div className="flex items-center gap-3 border-t border-neutral-100 px-4 py-3">
            <div>
              <p className="text-xs text-neutral-500">{labels.bestPost}</p>
              <div className="mt-1 flex items-center gap-2">
                {board.bestPost.thumbnailUrl ? (
                  <img
                    src={board.bestPost.thumbnailUrl}
                    alt=""
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-400">
                    <FileText size={16} />
                  </span>
                )}
                <p className="text-lg font-semibold">{compact(board.bestPost.likes, locale)}</p>
                {board.bestPost.url ? (
                  <a
                    href={board.bestPost.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-[#FF4713]"
                  >
                    {labels.viewPost} ↗
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card
          title={labels.postsPlatform}
          subtitle={labels.topByPosts.replace("{n}", String(board.byPlatform.length))}
          aside={
            <div>
              <p className="text-lg font-semibold leading-none">{board.posts}</p>
              <p className="mt-1 text-[11px] text-neutral-400">{labels.postsTotal}</p>
            </div>
          }
        >
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={board.byPlatform} margin={{ top: 18, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="platform" tickFormatter={platformLabel} tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={28} />
                <Tooltip />
                <Bar dataKey="posts" radius={[6, 6, 0, 0]}>
                  {board.byPlatform.map((entry) => (
                    <Cell key={entry.platform} fill={color(entry.platform)} />
                  ))}
                  <LabelList dataKey="posts" position="top" className="fill-neutral-700 text-xs" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title={labels.postsTime} subtitle={labels.postsPerWeek}>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={board.weeks} margin={{ top: 18, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={28} />
                <Tooltip />
                <Bar dataKey="posts" fill="#111827" radius={[6, 6, 0, 0]}>
                  <LabelList dataKey="posts" position="top" className="fill-neutral-700 text-xs" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title={labels.likesPlatform}>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={board.byPlatform} margin={{ top: 18, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="platform" tickFormatter={platformLabel} tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={28} />
                <Tooltip />
                <Bar dataKey="likes" radius={[6, 6, 0, 0]}>
                  {board.byPlatform.map((entry) => (
                    <Cell key={entry.platform} fill={color(entry.platform)} />
                  ))}
                  <LabelList dataKey="likes" position="top" className="fill-neutral-700 text-xs" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title={labels.likesTime}>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={board.weeks} margin={{ top: 18, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={28} />
                <Tooltip />
                <Bar dataKey="likes" fill="#111827" radius={[6, 6, 0, 0]}>
                  <LabelList dataKey="likes" position="top" className="fill-neutral-700 text-xs" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card title={labels.engagementTime} subtitle={labels.postsPerWeek}>
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {metricDefs.map((metric) => {
            const Icon = metric.icon;
            return (
              <label key={metric.key} className="flex cursor-pointer items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={metrics[metric.key]}
                  onChange={() => toggle(metric.key)}
                  className="mt-1"
                />
                <span>
                  <span className="flex items-center gap-1 text-xs text-neutral-500">
                    <Icon size={12} style={{ color: metric.color }} />
                    {metric.label}
                  </span>
                  <span className="block font-semibold">{compact(metric.value, locale)}</span>
                </span>
              </label>
            );
          })}
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={board.weeks} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#F3F4F6" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} width={28} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} width={36} />
              <Tooltip />
              {metrics.likes ? <Line yAxisId="left" type="monotone" dataKey="likes" stroke="#EF4444" dot={false} strokeWidth={2} /> : null}
              {metrics.comments ? <Line yAxisId="left" type="monotone" dataKey="comments" stroke="#3B82F6" dot={false} strokeWidth={2} /> : null}
              {metrics.views ? <Line yAxisId="right" type="monotone" dataKey="views" stroke="#A855F7" dot={false} strokeWidth={2} /> : null}
              {metrics.impressions ? (
                <Line yAxisId="right" type="monotone" dataKey="impressions" stroke="#14B8A6" dot={false} strokeWidth={2} />
              ) : null}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title={labels.bestTime}>
          <div className="mb-2 flex justify-end gap-1 text-[10px] text-neutral-400">
            <span>{labels.less}</span>
            {["#F3F4F6", "#D1FAE5", "#6EE7B7", "#34D399", "#059669"].map((fill) => (
              <span key={fill} className="h-3 w-3 rounded-sm" style={{ background: fill }} />
            ))}
            <span>{labels.more}</span>
          </div>
          <div className="grid grid-cols-[2.5rem_1fr] gap-1 text-[10px] text-neutral-400">
            <div />
            <div className="grid text-center" style={{ gridTemplateColumns: "repeat(24, minmax(0, 1fr))" }}>
              {Array.from({ length: 24 }, (_, hour) => (
                <span key={hour}>{hour % 3 === 0 ? (hour === 0 ? "12am" : hour < 12 ? `${hour}am` : hour === 12 ? "12pm" : `${hour - 12}pm`) : ""}</span>
              ))}
            </div>
            {MON_FIRST.map((day) => (
              <div key={day} className="contents">
                <span className="self-center">{labels.days[day]}</span>
                <div className="grid grid-cols-24 gap-px" style={{ gridTemplateColumns: "repeat(24, minmax(0, 1fr))" }}>
                  {(board.heatmap[day] ?? []).map((score, hour) => (
                    <span
                      key={hour}
                      className="aspect-square rounded-[2px]"
                      style={{
                        background: score === 0 ? "#F3F4F6" : `rgba(5, 150, 105, ${0.18 + (score / maxHeat) * 0.82})`,
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          {board.best.length ? (
            <p className="mt-3 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
              {labels.bestTimes}
              {board.best.slice(0, 3).map((slot) => (
                <span key={`${slot.day}-${slot.hour}`} className="rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700">
                  {labels.days[slot.day]} {slot.hour % 12 || 12}
                  {slot.hour < 12 ? "am" : "pm"} · {slot.score}
                </span>
              ))}
            </p>
          ) : null}
        </Card>
        <Card
          title={labels.followerEvolution}
          subtitle={labels.followersPerPlatform.replace("{n}", String(board.followersByPlatform.length))}
          aside={
            <div>
              <p className="text-lg font-semibold leading-none">{compact(board.followers, locale)}</p>
              <p className="mt-1 text-[11px] text-neutral-400">{labels.followersTotal}</p>
            </div>
          }
        >
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={followerChart.length ? followerChart : board.followersSeries} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#F3F4F6" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} width={36} />
                <Tooltip />
                {board.followersByPlatform.length
                  ? board.followersByPlatform.map((series) => (
                      <Line
                        key={series.platform}
                        type="monotone"
                        dataKey={series.platform}
                        stroke={color(series.platform)}
                        dot={false}
                        strokeWidth={2}
                      />
                    ))
                  : <Line type="monotone" dataKey="followers" stroke="#E1306C" dot={false} strokeWidth={2} />}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card
        title={labels.formats}
        aside={<span className="text-xs text-neutral-400">{labels.formatAvg} {board.engagementRate}%</span>}
      >
        <ul className="space-y-2">
          {board.formats.map((format) => {
            const Icon = formatIcon(format.type);
            const best = format.type === bestFormat;
            return (
              <li
                key={format.type}
                className={`flex items-center justify-between rounded-xl border px-3 py-3 ${
                  best ? "border-red-200 bg-red-50/70" : "border-neutral-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                    <Icon size={16} />
                  </span>
                  <div>
                    <p className="flex items-center gap-2 text-sm font-medium capitalize">
                      {format.type}
                      {best ? (
                        <span className="rounded bg-red-500 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                          {labels.bestFormat}
                        </span>
                      ) : null}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {format.posts} {labels.postsTotal}
                      {format.vsAvg !== null ? (
                        <span className={format.vsAvg >= 0 ? "text-emerald-600" : "text-red-600"}>
                          {" "}
                          ({format.vsAvg > 0 ? "+" : ""}
                          {format.vsAvg}% {labels.vsAvg})
                        </span>
                      ) : null}
                    </p>
                  </div>
                </div>
                <p className="text-lg font-semibold">{format.rate}%</p>
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
                <th className="py-2 pr-3 font-medium">{labels.saves}</th>
                <th className="py-2 pr-3 font-medium">{labels.views}</th>
                <th className="py-2 pr-3 font-medium">{labels.impressions}</th>
                <th className="py-2 font-medium">{labels.reach}</th>
              </tr>
            </thead>
            <tbody>
              {board.byPlatform.map((row) => (
                <tr key={row.platform} className="border-t border-neutral-100">
                  <td className="py-2.5 pr-3">
                    <PlatformMark id={row.platform} />
                  </td>
                  <td className="py-2.5 pr-3">{row.posts}</td>
                  <td className="py-2.5 pr-3">{dash(row.likes, locale)}</td>
                  <td className="py-2.5 pr-3">{dash(row.comments, locale)}</td>
                  <td className="py-2.5 pr-3">{dash(row.shares, locale)}</td>
                  <td className="py-2.5 pr-3">{dash(row.saves, locale)}</td>
                  <td className="py-2.5 pr-3">{dash(row.views, locale)}</td>
                  <td className="py-2.5 pr-3">{dash(row.impressions, locale)}</td>
                  <td className="py-2.5">{dash(row.reach, locale)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title={labels.topPosts}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs text-neutral-500">
              <tr>
                <th className="py-2 pr-3 font-medium">{labels.posts}</th>
                <th className="py-2 pr-3 font-medium">{labels.likes}</th>
                <th className="py-2 pr-3 font-medium">{labels.comments}</th>
                <th className="py-2 pr-3 font-medium">{labels.shares}</th>
                <th className="py-2 font-medium">ER</th>
              </tr>
            </thead>
            <tbody>
              {board.top.map((post, index) => (
                <tr key={`${post.platform}-${index}`} className="border-t border-neutral-100">
                  <td className="py-2.5 pr-3">
                    <div className="flex items-center gap-2">
                      <PlatformMark id={post.platform} />
                    </div>
                    <p className="mt-0.5 max-w-xs truncate font-medium">{post.content || labels.noContent}</p>
                    <p className="text-[11px] text-neutral-400">
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(locale, { month: "short", day: "numeric", year: "numeric" }) : ""}
                    </p>
                  </td>
                  <td className="py-2.5 pr-3">{dash(post.likes, locale)}</td>
                  <td className="py-2.5 pr-3">{dash(post.comments, locale)}</td>
                  <td className="py-2.5 pr-3">{dash(post.shares, locale)}</td>
                  <td className="py-2.5">{post.rate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {board.cadence.length ? (
        <Card title={labels.cadenceTitle}>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cadenceChart} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#F3F4F6" />
                <XAxis dataKey="bucket" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} width={36} tickFormatter={(value) => `${value}%`} />
                <Tooltip />
                <Legend />
                {board.cadence.map((line) => (
                  <Line
                    key={line.platform}
                    type="monotone"
                    dataKey={line.platform}
                    name={platformLabel(line.platform)}
                    stroke={color(line.platform)}
                    strokeWidth={2}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-xs text-neutral-500">{labels.optimalCadence}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {board.cadence.map((line) =>
              line.optimal ? (
                <span key={line.platform} className="rounded-full bg-neutral-100 px-3 py-1 text-xs">
                  <PlatformMark id={line.platform} /> {line.optimal.bucket}
                  {labels.perWeek} · {line.optimal.rate}%
                </span>
              ) : null,
            )}
          </div>
        </Card>
      ) : null}
    </div>
  );
}

function Kpi({
  label,
  value,
  icon,
  delta,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
  delta: ReactNode;
}) {
  return (
    <div className="border-b border-neutral-100 px-4 py-4 sm:even:border-l">
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="mt-1 flex items-center gap-2 text-2xl font-semibold tracking-tight">
        {icon ? <span className="text-neutral-400">{icon}</span> : null}
        {value}
      </p>
      {delta}
    </div>
  );
}
