import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const posts = [
  {
    id: "1",
    content: "This is a scheduled Twitter post",
    platform: "twitter",
    status: "scheduled",
    publishedAt: "2025-11-12T14:30:00Z",
  },
  {
    id: "2",
    content: "Another one for Facebook",
    platform: "facebook",
    status: "scheduled",
    publishedAt: "2025-11-14T10:00:00Z",
  },
];

export function PostSchedulingPage() {
  // Temporary mock posts until backend + store integration

  const scheduledPosts = useMemo(() => {
    return posts
      .filter((p) => p.status === "scheduled")
      .sort(
        (a, b) =>
          new Date(a.publishedAt || "").getTime() -
          new Date(b.publishedAt || "").getTime()
      );
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Post Scheduling
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your scheduled posts
          </p>
        </div>

        <div className="grid gap-4">
          {scheduledPosts.length > 0 ? (
            scheduledPosts.map((post) => (
              <Card key={post.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex gap-2 mb-2">
                        <Badge variant="secondary" className="capitalize">
                          {post.platform}
                        </Badge>
                        <Badge className="bg-blue-100 text-blue-800">
                          Scheduled
                        </Badge>
                      </div>

                      <p className="text-foreground font-medium mb-2">
                        {post.content}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        Scheduled for:{" "}
                        {new Date(post.publishedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No scheduled posts</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
