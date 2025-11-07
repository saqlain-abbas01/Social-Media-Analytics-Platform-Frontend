import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreatePostForm } from "@/components/forms/create-post-form";
import { Search, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getPosts } from "@/api/postService";
import PostCard from "@/components/posts-cards";
import type { Post, PostStatus } from "@/types/post";
import { usePostsStore } from "@/store/usePostStore";

export function PostsManagementPage() {
  // --- Filters & Pagination ---
  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [statusFilter, setStatusFilter] = useState<PostStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { setPosts, posts } = usePostsStore();

  const platforms = ["twitter", "facebook", "instagram", "linkedin"];

  // --- Fetch posts from backend ---
  const { data, isLoading } = useQuery({
    queryKey: [
      "get-posts",
      page,
      limit,
      searchQuery,
      platformFilter,
      statusFilter,
      startDate,
      endDate,
    ],
    queryFn: () =>
      getPosts({
        page,
        limit,
        search: searchQuery || undefined,
        platform: platformFilter || undefined,
        status: statusFilter,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      }),
  });

  // Extract posts and total from backend response
  useEffect(() => {
    setPosts(data?.data as Post[]);
  }, [data]);

  // const totalPosts = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  console.log("posts", posts);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Posts Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Create, edit, and manage all your social media posts
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="w-4 h-4 mr-2" />
                Create Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
                <DialogDescription>
                  Create and schedule a new post across platforms
                </DialogDescription>
              </DialogHeader>
              <CreatePostForm onSuccess={() => setIsCreateOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Search & Filters */}
        <div className="mb-6 flex gap-4 flex-wrap items-end">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Limit</label>
            <Input
              placeholder="enter post limi"
              className="pl-10"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
            />
          </div>

          {/* Platform Filter */}
          <div>
            <label className="block text-sm font-medium mb-1">Platform</label>
            <select
              className="border rounded px-3 py-1"
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
            >
              <option value="">All Platforms</option>
              {platforms.map((p) => (
                <option key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
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
        </div>

        {/* Status Tabs */}
        <Tabs defaultValue="all" className="mb-6">
          <TabsList>
            {["all", "published", "scheduled", "draft"].map((status) => (
              <TabsTrigger
                key={status}
                value={status}
                onClick={() => {
                  setStatusFilter(status as PostStatus);
                  setPage(1); // reset page on filter change
                }}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={statusFilter} className="mt-6 space-y-4">
            {isLoading ? (
              <div className="w-full min-h-62 flex  justify-center items-center">
                Loading posts...
              </div>
            ) : posts?.length > 0 ? (
              posts?.map((post) => <PostCard key={post._id} post={post} />)
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No posts found</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Pagination */}
        <div className="flex justify-between mt-4">
          <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span>
            Page {page} of {totalPages}
          </span>
          <Button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </main>
    </div>
  );
}
