import { useMemo } from "react";
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
  ScatterChart,
  Scatter,
} from "recharts";

// ✅ Temporary Mock Data for Analytics
const mockPosts = [
  {
    _id: "1",
    userId: "u1",
    content: "Mock post 1",
    platform: "twitter",
    scheduledAt: null,
    publishedAt: new Date(),
    status: "published",
    metadata: { hashtags: ["#test"], wordCount: 3 },
    engagement: 120,
    reach: 500,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "2",
    userId: "u1",
    content: "Mock post 2",
    platform: "facebook",
    scheduledAt: null,
    publishedAt: new Date(),
    status: "published",
    metadata: { hashtags: ["#hello"], wordCount: 5 },
    engagement: 80,
    reach: 300,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "3",
    userId: "u1",
    content: "Mock post 3",
    platform: "instagram",
    scheduledAt: null,
    publishedAt: null,
    status: "draft",
    metadata: { hashtags: ["#draft"], wordCount: 2 },
    engagement: 0,
    reach: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "4",
    userId: "u1",
    content: "Mock post 4",
    platform: "linkedin",
    scheduledAt: null,
    publishedAt: new Date(),
    status: "published",
    metadata: { hashtags: ["#biz"], wordCount: 4 },
    engagement: 60,
    reach: 200,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export function AnalyticsInsightsPage() {
  const posts = mockPosts;

  const engagementByPlatform = useMemo(() => {
    const platforms = posts.reduce((acc, post) => {
      const existing = acc.find((p) => p.platform === post.platform);
      if (existing) {
        existing.engagement += post.engagement || 0;
        existing.reach += post.reach || 0;
        existing.posts += 1;
      } else {
        acc.push({
          platform: post.platform,
          engagement: post.engagement || 0,
          reach: post.reach || 0,
          posts: 1,
        });
      }
      return acc;
    }, [] as Array<{ platform: string; engagement: number; reach: number; posts: number }>);
    return platforms;
  }, [posts]);

  const performanceData = useMemo(() => {
    return posts
      .filter((p) => p.status === "published")
      .map((p) => ({
        id: p._id,
        engagement: p.engagement,
        reach: p.reach,
        platform: p.platform,
      }));
  }, [posts]);

  const contentTypeData = useMemo(() => {
    const types = posts.reduce((acc, post) => {
      const type = post.status;
      const existing = acc.find((t) => t.type === type);
      if (existing) {
        existing.count += 1;
        existing.engagement += post.engagement || 0;
      } else {
        acc.push({
          type,
          count: 1,
          engagement: post.engagement || 0,
        });
      }
      return acc;
    }, [] as Array<{ type: string; count: number; engagement: number }>);
    return types;
  }, [posts]);

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

        <Tabs defaultValue="platform" className="w-full">
          <TabsList>
            <TabsTrigger value="platform">Platform Performance</TabsTrigger>
            <TabsTrigger value="content">Content Performance</TabsTrigger>
            <TabsTrigger value="scatter">Reach vs Engagement</TabsTrigger>
          </TabsList>

          {/* Platform Chart */}
          <TabsContent value="platform" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance by Platform</CardTitle>
                <CardDescription>
                  Engagement and reach metrics across platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={engagementByPlatform}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="platform" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="engagement" fill="#8884d8" />
                    <Bar dataKey="reach" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Chart */}
          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance by Content Status</CardTitle>
                <CardDescription>
                  Engagement metrics by post status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={contentTypeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="engagement"
                      stroke="#8884d8"
                    />
                    <Line type="monotone" dataKey="count" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scatter */}
          <TabsContent value="scatter" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reach vs Engagement Analysis</CardTitle>
                <CardDescription>
                  Correlation of published posts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="reach" />
                    <YAxis dataKey="engagement" />
                    <Tooltip />
                    <Scatter
                      name="Posts"
                      data={performanceData}
                      fill="#8884d8"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
