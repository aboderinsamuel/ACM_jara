import { useEffect, useMemo, useState } from "react";
import { getVideoUrls, listVideos, revokeUrls } from "@shared/local-videos";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";
import {
  ArrowUpRight,
  ArrowDownRight,
  Users,
  DollarSign,
  Play,
  Activity,
  Sparkles,
} from "lucide-react";

type Metric = {
  label: string;
  value: number;
  delta: number; // percent change vs prev period
  icon: React.ReactNode;
  color: string; // tailwind color class
};

type SeriesPoint = { date: string; value: number };

const withComma = (n: number) => n.toLocaleString();
const pct = (n: number) => `${n > 0 ? "+" : ""}${n.toFixed(1)}%`;

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default function Dashboard() {
  const [profile] = useState(() =>
    readJson("creator_profile", { displayName: "Your Channel" }),
  );
  const [seed] = useState(() =>
    readJson("dashboard_seed", Math.floor(Math.random() * 100000)),
  );

  useEffect(() => {
    // Persist seed so charts look consistent across reloads for this browser
    localStorage.setItem("dashboard_seed", String(seed));
  }, [seed]);

  const prng = useMemo(() => mulberry32(seed), [seed]);

  const metrics: Metric[] = useMemo(() => {
    const subs = Math.floor(1500 + prng() * 5000);
    const revenue = Math.floor(1200 + prng() * 4200);
    const views = Math.floor(20000 + prng() * 120000);
    const engagement = Math.floor(2 + prng() * 8);
    return [
      {
        label: "Revenue (30d)",
        value: revenue,
        delta: prng() * 20 - 10,
        icon: <DollarSign className="h-5 w-5" />,
        color: "from-emerald-500/30 to-emerald-500/10",
      },
      {
        label: "Subscribers",
        value: subs,
        delta: prng() * 20 - 10,
        icon: <Users className="h-5 w-5" />,
        color: "from-sky-500/30 to-sky-500/10",
      },
      {
        label: "Views (30d)",
        value: views,
        delta: prng() * 20 - 10,
        icon: <Play className="h-5 w-5" />,
        color: "from-fuchsia-500/30 to-fuchsia-500/10",
      },
      {
        label: "Engagement Rate",
        value: engagement,
        delta: prng() * 10 - 5,
        icon: <Activity className="h-5 w-5" />,
        color: "from-amber-500/30 to-amber-500/10",
      },
    ];
  }, [prng]);

  const trafficSeries: SeriesPoint[] = useMemo(
    () => buildSeries(30, prng),
    [prng],
  );
  const revenueSeries: SeriesPoint[] = useMemo(
    () => buildSeries(30, prng, 30, 300),
    [prng],
  );

  // Latest uploaded video (local-only preview)
  const [latestVideoId, setLatestVideoId] = useState<string | null>(null);
  const [latestUrls, setLatestUrls] = useState<{
    videoUrl: string;
    imageUrl: string | null;
  } | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const videos = await listVideos();
        if (!mounted) return;
        if (videos.length > 0) {
          setLatestVideoId(videos[0].id);
          const urls = await getVideoUrls(videos[0].id);
          if (!mounted) return;
          setLatestUrls(urls);
        } else {
          setLatestVideoId(null);
          setLatestUrls(null);
        }
      } catch {
        // ignore
      }
    })();
    return () => {
      mounted = false;
      if (latestUrls) revokeUrls(latestUrls);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      {/* Cinematic gradient bg */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
        <div className="absolute -top-1/3 right-0 h-[60vh] w-[60vw] rounded-full blur-3xl opacity-20 bg-fuchsia-600/30" />
        <div className="absolute -bottom-1/3 left-0 h-[60vh] w-[60vw] rounded-full blur-3xl opacity-20 bg-emerald-600/30" />
      </div>

      <div className="px-4 sm:px-8 lg:px-12 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded bg-primary/80 ring-1 ring-white/20">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <div className="text-xs uppercase tracking-wider text-white/60">
              Creator Analytics
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">
              {profile.displayName || "Your Channel"}
            </h1>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-lg bg-white/5 p-5 ring-1 ring-white/10"
            >
              <div
                className={`absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br ${m.color}`}
              />
              <div className="relative flex items-start justify-between">
                <div>
                  <div className="text-white/70 text-sm">{m.label}</div>
                  <div className="text-3xl font-extrabold mt-2">
                    {m.label.includes("Revenue")
                      ? `$${withComma(m.value)}`
                      : withComma(m.value)}
                  </div>
                </div>
                <div className="text-white/70">{m.icon}</div>
              </div>
              <div className="relative mt-3 inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-xs">
                {m.delta >= 0 ? (
                  <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5 text-rose-400" />
                )}
                <span
                  className={
                    m.delta >= 0 ? "text-emerald-400" : "text-rose-400"
                  }
                >
                  {pct(m.delta)}
                </span>
                <span className="text-white/60">vs last 30 days</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-lg bg-white/5 p-5 ring-1 ring-white/10">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-white/70">
                  Traffic (last 30 days)
                </div>
                <div className="text-xl font-semibold">Daily Views</div>
              </div>
            </div>
            <div className="mt-4 h-64">
              <ChartContainer
                config={{
                  views: { label: "Views", color: "hsl(210 100% 60%)" },
                }}
              >
                <LineChart
                  data={trafficSeries}
                  margin={{ left: 12, right: 12, top: 10 }}
                >
                  <CartesianGrid
                    stroke="rgba(255,255,255,0.08)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#9ca3af" }}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={24}
                  />
                  <YAxis
                    tick={{ fill: "#9ca3af" }}
                    tickLine={false}
                    axisLine={false}
                    width={40}
                  />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(210 100% 60%)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </div>
          <div className="rounded-lg bg-white/5 p-5 ring-1 ring-white/10">
            <div className="text-sm text-white/70">Revenue (last 30 days)</div>
            <div className="mt-4 h-64">
              <ChartContainer
                config={{
                  revenue: { label: "Revenue", color: "hsl(140 80% 55%)" },
                }}
              >
                <BarChart
                  data={revenueSeries}
                  margin={{ left: 12, right: 12, top: 10 }}
                >
                  <CartesianGrid
                    stroke="rgba(255,255,255,0.08)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#9ca3af" }}
                    tickLine={false}
                    axisLine={false}
                    hide
                  />
                  <YAxis
                    tick={{ fill: "#9ca3af" }}
                    tickLine={false}
                    axisLine={false}
                    width={40}
                  />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Bar
                    dataKey="value"
                    fill="hsl(140 80% 55%)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </div>
        </div>

        {/* Recent Posts / Activity and Latest Upload */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-lg bg-white/5 p-5 ring-1 ring-white/10">
            <div className="flex items-center justify-between">
              <div className="text-sm text-white/70">Recent Activity</div>
              <button className="text-xs rounded bg-white/10 px-3 py-1">
                View all
              </button>
            </div>
            <div className="mt-4 divide-y divide-white/10">
              {buildActivity(prng).map((item, i) => (
                <div key={i} className="flex items-center justify-between py-3">
                  <div className="min-w-0">
                    <div className="truncate font-medium">{item.title}</div>
                    <div className="text-xs text-white/60 truncate">
                      {item.subtitle}
                    </div>
                  </div>
                  <div className="text-sm text-white/70">{item.time}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg bg-white/5 p-5 ring-1 ring-white/10">
            <div className="text-sm text-white/70">Quick Actions</div>
            <div className="mt-3 grid gap-2">
              {[
                "Create Payment Link",
                "Upload New Video",
                "Customize Page",
                "Invite Collaborator",
              ].map((a) => (
                <button
                  key={a}
                  className="text-left rounded bg-white/10 px-4 py-2 hover:bg-white/15"
                >
                  {a}
                </button>
              ))}
            </div>
            <div className="mt-5">
              <div className="text-sm text-white/70">Latest Upload (local)</div>
              {latestVideoId && latestUrls ? (
                <div className="mt-2 rounded bg-black/40 p-2 ring-1 ring-white/10">
                  <video
                    src={latestUrls.videoUrl}
                    className="w-full rounded"
                    controls
                    preload="metadata"
                  />
                  <div className="mt-2 text-xs text-white/60">
                    Only visible on this device (demo)
                  </div>
                </div>
              ) : (
                <div className="mt-2 text-xs text-white/60">
                  No local uploads yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helpers
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildSeries(
  days: number,
  rng: () => number,
  min = 100,
  max = 1000,
): SeriesPoint[] {
  const arr: SeriesPoint[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const value = Math.floor(min + rng() * (max - min));
    arr.push({ date: `${d.getMonth() + 1}/${d.getDate()}`, value });
  }
  return arr;
}

function buildActivity(rng: () => number) {
  const items = [
    {
      title: "New supporter tipped $10",
      subtitle: "Crimson Tide • Payment link",
      time: "2m ago",
    },
    {
      title: "Membership renewal",
      subtitle: "Gold Tier • Monthly",
      time: "1h ago",
    },
    {
      title: "New comment on your post",
      subtitle: "Neon Nights trailer",
      time: "3h ago",
    },
    {
      title: "Video published successfully",
      subtitle: "Behind the scenes • Upload",
      time: "Yesterday",
    },
  ];
  // Shuffle lightly to vary
  return items.sort(() => rng() - 0.5);
}
