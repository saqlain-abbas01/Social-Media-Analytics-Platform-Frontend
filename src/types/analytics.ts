export interface AnalyticsDataPoint {
  date: string | null;
  value: number;
  movingAvg: number;
}

export interface AnalyticsSummary {
  total: number;
  average: number | null;
  growth: number;
  peak: {
    date: string | null;
    value: number;
    movingAvg: number;
  };
}

export interface PlatformPerformance {
  platform: string; // e.g., "twitter", "facebook", "linkedin", "instagram"
  totalEngagement: number;
  engagementRate: number;
  clickThroughRate: number;
  performanceScore: number;
  percentageShare: number;
}

// src/types/analytics.d.ts
export interface TopPost {
  postId: string;
  platform: "twitter" | "facebook" | "instagram" | "linkedin" | string;
  title: string;
  createdAt: string;
  likes: number;
  comments: number;
  shares: number;
  clicks: number;
  totalImpressions: number;
  totalEngagement: number;
  engagementRate: number;
  percentageShare: number;
}

export interface OptimalTimeBucket {
  dayOfWeek: number; // 1 = Sunday, 7 = Saturday
  hourOfDay: number; // 0-23
  avgEngagement: number; // Average engagement count for that hour/day
  avgEngagementRate: number; // Average engagement rate in %
  avgCTR: number; // Average click-through rate in %
  performanceScore: number; // Combined performance score
  sampleSize: number; // Number of posts in this bucket
}

// API response
export interface GetOptimalPostingTimesResponse {
  cached: boolean; // Whether data was served from cache
  data: OptimalTimeBucket[]; // Array of top 5 time buckets
}

export interface MetricChange {
  current: number;
  previous: number;
  change: number; // percentage
}

export interface RecentOverviewResponse {
  cached: boolean;
  totalPosts: MetricChange;
  totalEngagement: MetricChange;
  totalLikes: MetricChange;
  totalComments: MetricChange;
  totalShares: MetricChange;
  totalClicks: MetricChange;
  totalImpressions: MetricChange;
}

export interface PerformanceMetric {
  current: number;
  previous: number;
  change: number; // percentage change vs last month
}

export interface PerformanceComparisonResponse {
  success: boolean;
  userId: string;
  cached: boolean;
  data: {
    totalPosts: PerformanceMetric;
    totalImpressions: PerformanceMetric;
    totalLikes: PerformanceMetric;
    totalComments: PerformanceMetric;
    totalShares: PerformanceMetric;
    totalEngagement: PerformanceMetric;
    engagementRate: PerformanceMetric;
  };
}
