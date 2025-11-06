"use client";

import type React from "react";

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
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, MessageCircle, Heart, Share2, Eye } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for charts
const performanceData = [
  { date: "Jan 1", engagement: 2400, reach: 2210, impressions: 3290 },
  { date: "Jan 5", engagement: 1398, reach: 2290, impressions: 2000 },
  { date: "Jan 10", engagement: 9800, reach: 2000, impressions: 2228 },
  { date: "Jan 15", engagement: 3908, reach: 2108, impressions: 2100 },
  { date: "Jan 20", engagement: 4800, reach: 2176, impressions: 2290 },
  { date: "Jan 25", engagement: 3800, reach: 2100, impressions: 1890 },
  { date: "Jan 30", engagement: 4300, reach: 2300, impressions: 2300 },
];

const platformData = [
  { name: "Twitter", value: 35, color: "#1DA1F2" },
  { name: "Facebook", value: 25, color: "#1877F2" },
  { name: "Instagram", value: 28, color: "#E4405F" },
  { name: "LinkedIn", value: 12, color: "#0A66C2" },
];

const topPosts = [
  {
    id: 1,
    platform: "Twitter",
    engagement: 2543,
    reach: 45000,
    content: "Check out our latest...",
  },
  {
    id: 2,
    platform: "Instagram",
    engagement: 1875,
    reach: 38000,
    content: "New product launch...",
  },
  {
    id: 3,
    platform: "LinkedIn",
    engagement: 1542,
    reach: 28000,
    content: "Industry insights...",
  },
];

export function DashboardPage() {
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

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            icon={<Eye className="w-5 h-5" />}
            label="Total Reach"
            value="156,489"
            change="+12.5%"
          />
          <MetricCard
            icon={<Heart className="w-5 h-5" />}
            label="Engagement Rate"
            value="8.2%"
            change="+2.3%"
          />
          <MetricCard
            icon={<MessageCircle className="w-5 h-5" />}
            label="Comments"
            value="1,243"
            change="+5.1%"
          />
          <MetricCard
            icon={<Share2 className="w-5 h-5" />}
            label="Shares"
            value="892"
            change="+8.7%"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Performance Trend */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Performance Trend</CardTitle>
              <CardDescription>
                Last 30 days engagement analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={performanceData}
                  margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="engagement"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="reach"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Platform Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Distribution</CardTitle>
              <CardDescription>Posts by platform</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={platformData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Posts Section */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle>Top Performing Posts</CardTitle>
              <CardDescription>Your best content this month</CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={() => <Link to={"/analytics"} />}
            >
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary">{post.platform}</Badge>
                      <p className="text-sm font-medium text-foreground truncate">
                        {post.content}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8 ml-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        {post.reach.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">reach</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        {post.engagement.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        engagement
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  change,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold text-foreground mt-2">{value}</p>
            <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> {change} vs last month
            </p>
          </div>
          <div className="text-muted-foreground">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}
