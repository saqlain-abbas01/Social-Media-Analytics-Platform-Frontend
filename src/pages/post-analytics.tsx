import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import { useParams } from "react-router-dom";
import { getPostAnalytics } from "@/api/postService";

export default function PostAnalyticsPage() {
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["post-analytics", id],
    queryFn: () => getPostAnalytics(id as string),
    enabled: !!id,
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Loader2 className="w-6 h-6 mr-2 animate-spin" />
        Loading analytics...
      </div>
    );

  if (isError || !data)
    return (
      <div className="text-center mt-12 text-destructive">
        Failed to load post analytics.
      </div>
    );

  const metrics = data.data;

  // Dummy hourly data for line chart visualization
  const hourlyData = Array.from({ length: 12 }).map((_, i) => ({
    hour: `${i + 1}h`,
    engagement: Math.round(
      metrics.averageEngagementPerHour + Math.random() * 200 - 100
    ),
  }));

  const performanceData = [
    { name: "Engagement Rate", value: metrics.engagementRate },
    { name: "CTR", value: metrics.clickThroughRate },
    { name: "Performance Score", value: metrics.performanceScore },
  ];

  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
      <h1 className="text-3xl font-bold text-foreground mb-6">
        Post Analytics Overview
      </h1>

      {/* --- Summary Cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{metrics.totalEngagement}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engagement Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {metrics.engagementRate.toFixed(2)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Click-Through Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {metrics.clickThroughRate.toFixed(2)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {metrics.performanceScore.toFixed(1)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* --- Line Chart: Engagement Over Time --- */}
      <Card>
        <CardHeader>
          <CardTitle>Engagement Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="engagement"
                  stroke="#2563eb"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* --- Bar Chart: Performance Breakdown --- */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#16a34a" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
