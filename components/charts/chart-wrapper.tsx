"use client";

import { cn } from "@/lib/utils";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ─── Custom Tooltip ──────────────────────────────────────────

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card--raised px-3 py-2 text-small border border-[var(--color-border-strong)]">
      <p className="text-[var(--color-text-tertiary)] mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-number-sm" style={{ color: p.color }}>
          {p.name}: {p.value.toLocaleString("en-IN")}
        </p>
      ))}
    </div>
  );
}

// ─── Axis defaults ───────────────────────────────────────────

const axisStyle = {
  tick: { fill: "var(--color-text-tertiary)", fontSize: 11, fontFamily: "var(--font-mono)" },
  axisLine: { stroke: "var(--color-border)" },
  tickLine: false as const,
};

// ─── Area Chart ──────────────────────────────────────────────

interface AreaChartData {
  data: Record<string, string | number>[];
  xKey: string;
  series: { key: string; label: string; color: string }[];
  height?: number;
  className?: string;
  caption?: string;
}

export function FinantalystAreaChart({
  data,
  xKey,
  series,
  height = 220,
  className,
  caption,
}: AreaChartData) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
          <defs>
            {series.map((s) => (
              <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={s.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={s.color} stopOpacity={0.02} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-border)"
            vertical={false}
          />
          <XAxis dataKey={xKey} {...axisStyle} />
          <YAxis {...axisStyle} />
          <Tooltip content={<CustomTooltip />} />
          {series.map((s) => (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={s.color}
              strokeWidth={2}
              fill={`url(#grad-${s.key})`}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0, fill: s.color }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
      {caption && (
        <p className="text-micro text-[var(--color-text-tertiary)] italic px-1">{caption}</p>
      )}
    </div>
  );
}

// ─── Bar Chart ───────────────────────────────────────────────

interface BarChartData {
  data: Record<string, string | number>[];
  xKey: string;
  series: { key: string; label: string; color: string }[];
  height?: number;
  className?: string;
  caption?: string;
}

export function FinantalystBarChart({
  data,
  xKey,
  series,
  height = 220,
  className,
  caption,
}: BarChartData) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-border)"
            vertical={false}
          />
          <XAxis dataKey={xKey} {...axisStyle} />
          <YAxis {...axisStyle} />
          <Tooltip content={<CustomTooltip />} />
          {series.map((s) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              name={s.label}
              fill={s.color}
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
      {caption && (
        <p className="text-micro text-[var(--color-text-tertiary)] italic px-1">{caption}</p>
      )}
    </div>
  );
}

// ─── Line Chart ──────────────────────────────────────────────

interface LineChartData {
  data: Record<string, string | number>[];
  xKey: string;
  series: { key: string; label: string; color: string }[];
  height?: number;
  className?: string;
  caption?: string;
}

export function FinantalystLineChart({
  data,
  xKey,
  series,
  height = 220,
  className,
  caption,
}: LineChartData) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-border)"
            vertical={false}
          />
          <XAxis dataKey={xKey} {...axisStyle} />
          <YAxis {...axisStyle} />
          <Tooltip content={<CustomTooltip />} />
          {series.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={s.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0, fill: s.color }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      {caption && (
        <p className="text-micro text-[var(--color-text-tertiary)] italic px-1">{caption}</p>
      )}
    </div>
  );
}
