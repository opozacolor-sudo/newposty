"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useLocale, useTranslations } from "next-intl";

export function AnalyticsChart({
  data,
  label,
}: {
  data: Array<{ date: string; value: number }>;
  label: string;
}) {
  const locale = useLocale();
  const t = useTranslations("Dashboard");

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-[#E5E5E5] text-sm text-[#6B7280]">
        {t("noPostsInRange")}
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="analyticsFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF4713" stopOpacity={0.28} />
              <stop offset="100%" stopColor="#FF4713" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#E5E5E5" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={(value: string) =>
              new Date(`${value}T00:00:00Z`).toLocaleDateString(locale, {
                month: "short",
                day: "numeric",
              })
            }
            tick={{ fill: "#6B7280", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#6B7280", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={40}
            tickFormatter={(value: number) =>
              new Intl.NumberFormat(locale, { notation: "compact" }).format(value)
            }
          />
          <Tooltip
            labelFormatter={(value) =>
              new Date(`${String(value)}T00:00:00Z`).toLocaleDateString(locale, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            }
            formatter={(value) => [
              new Intl.NumberFormat(locale).format(Number(value ?? 0)),
              label,
            ]}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #E5E5E5",
              fontSize: 12,
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#FF4713"
            strokeWidth={2}
            fill="url(#analyticsFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
