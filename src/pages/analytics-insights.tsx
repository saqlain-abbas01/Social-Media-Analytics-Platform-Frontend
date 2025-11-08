import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { getPerformanceComparison } from "@/api/analyticsTrends";
import type { PerformanceComparisonResponse } from "@/types/analytics";

const PLATFORMS = ["all", "twitter", "facebook", "instagram", "linkedin"];

export function AnalyticsInsightsPage() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [platform, setPlatform] = useState<string>("all");

  const { data, isLoading } = useQuery<PerformanceComparisonResponse>({
    queryFn: () => getPerformanceComparison(startDate, endDate, platform),
    queryKey: ["performance-comparison", startDate, endDate, platform],
  });

  console.log("comparison data", data);

  const metricsData = useMemo(() => {
    if (!data?.data) return [];
    const d = data.data;
    return [
      {
        metric: "Posts",
        current: d.totalPosts.current,
        previous: d.totalPosts.previous,
        change: d.totalPosts.change,
      },
      {
        metric: "Impressions",
        current: d.totalImpressions.current,
        previous: d.totalImpressions.previous,
        change: d.totalImpressions.change,
      },
      {
        metric: "Likes",
        current: d.totalLikes.current,
        previous: d.totalLikes.previous,
        change: d.totalLikes.change,
      },
      {
        metric: "Comments",
        current: d.totalComments.current,
        previous: d.totalComments.previous,
        change: d.totalComments.change,
      },
      {
        metric: "Shares",
        current: d.totalShares.current,
        previous: d.totalShares.previous,
        change: d.totalShares.change,
      },
      {
        metric: "Engagements",
        current: d.totalEngagement.current,
        previous: d.totalEngagement.previous,
        change: d.totalEngagement.change,
      },
      {
        metric: "Engagement Rate",
        current: d.engagementRate.current,
        previous: d.engagementRate.previous,
        change: d.engagementRate.change,
      },
    ];
  }, [data]);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Analytics & Insights
          </h1>
          <p className="text-muted-foreground mt-1">
            Deep dive into your social media performance
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              className="border rounded px-3 py-1"
              value={startDate ? startDate.toISOString().split("T")[0] : ""}
              onChange={(e) =>
                setStartDate(e.target.value ? new Date(e.target.value) : null)
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              className="border rounded px-3 py-1"
              value={endDate ? endDate.toISOString().split("T")[0] : ""}
              onChange={(e) =>
                setEndDate(e.target.value ? new Date(e.target.value) : null)
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Platform</label>
            <select
              className="border rounded px-3 py-1"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Tabs defaultValue="bar" className="w-full">
          <TabsList>
            <TabsTrigger value="bar">Overview</TabsTrigger>
            <TabsTrigger value="line">Monthly Comparison</TabsTrigger>
          </TabsList>

          {isLoading ? (
            <div className="w-full min-h-62 flex justify-center items-center">
              Loading...
            </div>
          ) : (
            <>
              <TabsContent value="bar" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Overview</CardTitle>
                    <CardDescription>
                      Current period vs previous period metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={420}>
                      <BarChart data={metricsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="metric" />
                        <YAxis />
                        <Tooltip
                          formatter={(value: number) =>
                            Number(value).toLocaleString()
                          }
                        />
                        <Legend />
                        <Bar
                          dataKey="current"
                          name="Current Period"
                          fill="#8884d8"
                        />
                        <Bar
                          dataKey="previous"
                          name="Previous Period"
                          fill="#82ca9d"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="line" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Change (%)</CardTitle>
                    <CardDescription>
                      Percentage change from last period
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={metricsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="metric" />
                        <YAxis
                          tickFormatter={(val) => `${val.toFixed(0)}%`}
                          domain={["auto", "auto"]}
                        />
                        <Tooltip
                          formatter={(value: number) =>
                            `${value.toFixed(2)}% change`
                          }
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="change"
                          name="Change (%)"
                          stroke="#ff7300"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>
            </>
          )}
        </Tabs>
      </main>
    </div>
  );
}
