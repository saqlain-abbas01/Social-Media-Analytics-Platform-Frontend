import { useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getOptimalTimesToPost } from "@/api/analyticsTrends";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ZAxis,
} from "recharts";

const dayMap: Record<number, string> = {
  1: "Sunday",
  2: "Monday",
  3: "Tuesday",
  4: "Wednesday",
  5: "Thursday",
  6: "Friday",
  7: "Saturday",
};

export default function OptimalTimeHeatmap() {
  const { data, isLoading } = useQuery({
    queryKey: ["optimal-times"],
    queryFn: getOptimalTimesToPost,
  });

  // Transform API data for ScatterChart
  const chartData = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((bucket) => ({
      x: bucket.hourOfDay, // Hour 0-23
      y: bucket.dayOfWeek, // Day 1-7
      z: bucket.performanceScore, // Use as bubble size / color intensity
      avgEngagement: bucket.avgEngagement,
      engagementRate: bucket.avgEngagementRate,
      ctr: bucket.avgCTR,
    }));
  }, [data]);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Optimal Posting Times</CardTitle>
        <CardDescription>
          Heatmap of best times to post based on performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading heatmap...</p>
        ) : chartData.length === 0 ? (
          <p className="text-muted-foreground">No data available</p>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis
                type="number"
                dataKey="x"
                name="Hour"
                tickFormatter={(v) => `${v}:00`}
                domain={[0, 23]}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Day"
                tickFormatter={(v) => dayMap[v]}
                domain={[1, 7]}
              />
              <ZAxis
                type="number"
                dataKey="z"
                range={[50, 400]} // bubble size range
                name="Performance Score"
              />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any, name: string) => {
                  if (name === "Performance Score") return value.toFixed(2);
                  return value;
                }}
                labelFormatter={() => ""}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-white p-2 border rounded shadow-md text-sm">
                        <div>
                          <strong>Day:</strong> {dayMap[d.y]}
                        </div>
                        <div>
                          <strong>Hour:</strong> {d.x}:00
                        </div>
                        <div>
                          <strong>Performance Score:</strong> {d.z.toFixed(2)}
                        </div>
                        <div>
                          <strong>Avg Engagement:</strong> {d.avgEngagement}
                        </div>
                        <div>
                          <strong>Engagement Rate:</strong> {d.engagementRate}%
                        </div>
                        <div>
                          <strong>CTR:</strong> {d.ctr}%
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter
                name="Optimal Time"
                data={chartData}
                fill="hsl(var(--accent))"
              />
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
