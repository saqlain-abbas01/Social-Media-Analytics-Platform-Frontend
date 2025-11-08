// src/components/top-posts-table.tsx

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getTopPosts } from "@/api/analyticsTrends";
import type { TopPost } from "@/types/analytics";

export default function TopPostsTable() {
  const { data } = useQuery({
    queryKey: ["top-posts"],
    queryFn: getTopPosts,
  });
  console.log("top posts", data);
  // Take top 5 posts sorted by totalEngagement descending
  const topPosts: TopPost[] = (data?.data ?? [])
    .sort((a, b) => b.totalEngagement - a.totalEngagement)
    .slice(0, 5);

  const platformColors: Record<string, string> = {
    twitter: "bg-blue-100 text-blue-800",
    facebook: "bg-indigo-100 text-indigo-800",
    instagram: "bg-pink-100 text-pink-800",
    linkedin: "bg-sky-100 text-sky-800",
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Platform</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Engagement</TableHead>
          <TableHead>Reach</TableHead>
          <TableHead>Percentage Share</TableHead>
          <TableHead>Created At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {topPosts.length === 0 ? (
          <div className="w-screen border min-h-64 flex justify-center items-center">
            No post are uploaded yet
          </div>
        ) : (
          <>
            {" "}
            {topPosts?.map((post) => (
              <TableRow key={post.postId}>
                <TableCell>
                  <Badge
                    className={`capitalize ${
                      platformColors[post.platform.toLowerCase()] ??
                      "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {post.platform}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {post.title}
                </TableCell>
                <TableCell>{post.totalEngagement.toLocaleString()}</TableCell>
                <TableCell>
                  {post.totalImpressions?.toLocaleString() ?? 0}
                </TableCell>
                <TableCell>{post.percentageShare.toFixed(2)}%</TableCell>
                <TableCell>{formatDate(post.createdAt)}</TableCell>
              </TableRow>
            ))}
          </>
        )}
      </TableBody>
    </Table>
  );
}
