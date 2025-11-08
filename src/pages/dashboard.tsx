import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { MessageCircle, Heart, Share2, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  getAnalyticsTrends,
  getOverview,
  getPlatformPerformance,
} from "@/api/analyticsTrends";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import MetricCard from "@/components/mareices-cards";
import { formatDate } from "@/lib/utils";
import TopPostsTable from "@/components/Ttop-post-table";
import OptimalTimeHeatmap from "@/components/optimal-time-heatMap";

export function DashboardPage() {
  const [period, setPeriod] = useState(7); // number of days between 7–30
  const [granularity, setGranularity] = useState("daily");

  const { data: overview } = useQuery({
    queryFn: getOverview,
    queryKey: ["overview"],
  });

  console.log("overview data", overview);

  // Engagement trend query (filters applied)
  const {
    data: trendResponse,
    isLoading: isTrendLoading,
    isError: isTrendError,
  } = useQuery({
    queryKey: ["analytics-trends", period, granularity],
    queryFn: () =>
      getAnalyticsTrends({
        period: `${period}d`,
        granularity: granularity as "daily" | "weekly" | "hourly",
        metric: "engagement",
      }),
  });
  console.log("trendResponse", trendResponse);
  const trendData = trendResponse?.data?.filter((d) => d.date) ?? [];

  // Platform performance query (no filters)
  const { data: platformPerformance } = useQuery({
    queryFn: getPlatformPerformance,
    queryKey: ["platform-performance"],
  });

  // Platform Distribution chart data (for Pie chart)
  const platformChartData = useMemo(() => {
    const apiData = platformPerformance?.data;
    if (!apiData || !Array.isArray(apiData) || apiData.length === 0) return [];
    return apiData.map((p) => ({
      name: p.platform.charAt(0).toUpperCase() + p.platform.slice(1),
      value: p.percentageShare || 0,
      color:
        p.platform === "twitter"
          ? "#1DA1F2"
          : p.platform === "facebook"
          ? "#1877F2"
          : p.platform === "instagram"
          ? "#E4405F"
          : "#0A66C2",
    }));
  }, [platformPerformance]);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Track your social media performance and engagement metrics
            </p>
          </div>
        </div>

        {/* Filters for Engagement Trend only */}

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <MetricCard
            icon={<Eye className="w-5 h-5" />}
            label="Total Reach"
            value={overview?.totalImpressions.current.toString() as string}
            change={overview?.totalImpressions.change.toString() as string}
          />
          <MetricCard
            icon={<Heart className="w-5 h-5" />}
            label="Total Engagement"
            value={overview?.totalEngagement.current.toString() as string}
            change={overview?.totalEngagement.change.toString() as string}
          />
          <MetricCard
            icon={<Heart className="w-5 h-5" />}
            label="Total likes"
            value={overview?.totalLikes.current.toString() as string}
            change={overview?.totalLikes.change.toString() as string}
          />
          <MetricCard
            icon={<MessageCircle className="w-5 h-5" />}
            label="Comments"
            value={overview?.totalComments.current.toString() as string}
            change={overview?.totalComments.change.toString() as string}
          />
          <MetricCard
            icon={<Share2 className="w-5 h-5" />}
            label="Shares"
            value={overview?.totalShares.current.toString() as string}
            change={overview?.totalShares.change.toString() as string}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Filters</CardTitle>
                <CardDescription>
                  Customize your engagement trend view
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="w-full md:w-1/2">
                    <p className="text-sm font-medium mb-2">
                      Select Period (Days)
                    </p>
                    <Slider
                      min={7}
                      max={30}
                      step={1}
                      value={[period]}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      onValueChange={(v: any) => setPeriod(v[0])}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Showing data for last <strong>{period}</strong> days
                    </p>
                  </div>
                  <div className="w-full md:w-1/2">
                    <p className="text-sm font-medium mb-2">Granularity</p>
                    <Select value={granularity} onValueChange={setGranularity}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select granularity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="hourly">Hourly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Engagement Trend</CardTitle>
                <CardDescription>
                  Engagement over the last {period} days
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isTrendLoading ? (
                  <p>Loading chart...</p>
                ) : isTrendError ? (
                  <p className="text-red-500">Failed to load analytics</p>
                ) : trendData.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No engagement data available for this period.
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={trendData.map((d, i) => ({
                        date: d.date ? formatDate(d.date) : `Day ${i + 1}`,
                        value: d.value,
                        movingAvg: d.movingAvg,
                      }))}
                      margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis
                        tickFormatter={(val) =>
                          val ? Number(val).toLocaleString() : ""
                        }
                      />
                      <Tooltip
                        formatter={(value: number, name: string) => [
                          Number(value).toLocaleString(),
                          name === "value" ? "Engagement" : "Moving Avg",
                        ]}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="hsl(var(--chart-1))"
                        strokeWidth={2}
                        dot
                        name="Engagement"
                      />
                      {trendData.length >= 7 && ( // show moving average only if enough points
                        <Line
                          type="monotone"
                          dataKey="movingAvg"
                          stroke="hsl(var(--chart-2))"
                          strokeWidth={2}
                          name="Moving Average"
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
          {/* Engagement Trend */}

          {/* Platform Distribution (Pie chart, not filtered) */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Distribution</CardTitle>
              <CardDescription>Posts by platform</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={platformChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {platformChartData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Platform Performance (Bar chart, not filtered) */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Platform Performance</CardTitle>
            <CardDescription>
              Compare engagement and total engagement across platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={
                  platformPerformance?.data?.map((p) => ({
                    platform:
                      p.platform.charAt(0).toUpperCase() + p.platform.slice(1),
                    totalEngagement: p.totalEngagement,
                    engagementRate: p.engagementRate,
                  })) || []
                }
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="platform" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="totalEngagement"
                  fill="#1877F2"
                  name="Total Engagement"
                />
                <Bar
                  yAxisId="right"
                  dataKey="engagementRate"
                  fill="#E4405F"
                  name="Engagement Rate (%)"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Optimal Time Heatmap */}
        <div className="py-4">
          <OptimalTimeHeatmap />
        </div>

        {/* Top Posts Table */}
        <div className="py-4">
          <h1 className="py-4 font-medium text-2xl">Top ten posts</h1>
          <TopPostsTable />
        </div>
      </main>
    </div>
  );
}
