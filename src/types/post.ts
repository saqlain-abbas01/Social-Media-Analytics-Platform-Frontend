export type Platform = "twitter" | "facebook" | "instagram" | "linkedin";
export type PostStatus = "draft" | "scheduled" | "published" | "failed";

export interface Post {
  _id: string; // ObjectId as string
  userId: string;

  content: string;
  platform: Platform;

  scheduledAt: string | null; // ISO date string
  publishedAt?: string | null; // ISO date string

  status: PostStatus;

  metadata: {
    hashtags: string[];
    wordCount: number;
  };

  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export interface EngagementMetrics {
  likes: number;
  comments: number;
  shares: number;
  clicks: number;
  impressions: number;
}

export interface PostEngagement {
  _id: string;
  postId: string;
  userId: string;
  timestamp: string;
  platform: Platform;
  metrics: EngagementMetrics;

  // denormalized fields
  hourOfDay: number;
  dayOfWeek: number;

  createdAt: string;
}
