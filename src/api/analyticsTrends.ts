import type {
  AnalyticsDataPoint,
  AnalyticsSummary,
  GetOptimalPostingTimesResponse,
  PerformanceComparisonResponse,
  PlatformPerformance,
  RecentOverviewResponse,
  TopPost,
} from "@/types/analytics";
import api from "./api";

interface GetAnalyticsTrendsParams {
  period: string; // e.g. "7d" or "15d"
  granularity: "daily" | "weekly" | "hourly";
  metric: string; // e.g. "engagement", "reach", etc.
}

export interface AnalyticsTrendsResponse {
  data: AnalyticsDataPoint[];
  summary: AnalyticsSummary;
}

export interface PlatformPerformanceResponse {
  cached: boolean;
  period: string; // e.g., "7d", "14d", "30d"
  data: PlatformPerformance[];
}

export interface TopPostsResponse {
  cached: boolean;
  data: TopPost[];
  totalEngagement: number;
  totalPosts: number;
}

export const getAnalyticsTrends = async ({
  period,
  granularity,
  metric,
}: GetAnalyticsTrendsParams): Promise<AnalyticsTrendsResponse> => {
  try {
    const response = await api.get("/analytics/trends", {
      params: { period, granularity, metric },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching analytics trends:", error);
    throw error;
  }
};

export const getPlatformPerformance =
  async (): Promise<PlatformPerformanceResponse> => {
    try {
      const response = await api.get("/analytics/performance/platform");

      return response.data;
    } catch (error) {
      console.error("Error fetching analytics trends:", error);
      throw error;
    }
  };

export const getTopPosts = async (): Promise<TopPostsResponse> => {
  try {
    const response = await api.get("/analytics/performance/top-posts");

    return response.data;
  } catch (error) {
    console.error("Error fetching analytics trends:", error);
    throw error;
  }
};

export const getOptimalTimesToPost =
  async (): Promise<GetOptimalPostingTimesResponse> => {
    try {
      const response = await api.get("/analytics/optimal-times");

      return response.data;
    } catch (error) {
      console.error("Error fetching analytics trends:", error);
      throw error;
    }
  };

export const getOverview = async (): Promise<RecentOverviewResponse> => {
  try {
    const response = await api.get("/analytics/overview");

    return response.data;
  } catch (error) {
    console.error("Error fetching analytics trends:", error);
    throw error;
  }
};

export const getPerformanceComparison = async (
  startDate: Date | null,
  endDate: Date | null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  platform: any
): Promise<PerformanceComparisonResponse> => {
  try {
    const response = await api.get(
      `/analytics/performance/comparison?startDate=${startDate}&endDate=${endDate}&platform=${platform}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching analytics trends:", error);
    throw error;
  }
};
