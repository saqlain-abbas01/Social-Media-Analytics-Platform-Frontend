import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreatePostForm } from "@/components/forms/create-post-form";
import { Search, Plus, MoreVertical, Trash2, Edit } from "lucide-react";

const mockPosts = [
  {
    id: 1,
    content: "Excited to announce our new feature!",
    platform: "twitter",
    status: "published",
    publishedAt: "2025-01-15",
    engagement: 1243,
    reach: 8900,
  },
  {
    id: 2,
    content: "Check out our latest blog post...",
    platform: "linkedin",
    status: "scheduled",
    publishedAt: "2025-01-20",
    engagement: 0,
    reach: 0,
  },
  {
    id: 3,
    content: "Behind the scenes photo from our team event",
    platform: "instagram",
    status: "draft",
    publishedAt: null,
    engagement: 0,
    reach: 0,
  },
  {
    id: 4,
    content: "Join us for webinar on digital marketing",
    platform: "facebook",
    status: "published",
    publishedAt: "2025-01-10",
    engagement: 523,
    reach: 4200,
  },
];

const statusColors: Record<string, string> = {
  published: "bg-green-100 text-green-800",
  scheduled: "bg-blue-100 text-blue-800",
  draft: "bg-gray-100 text-gray-800",
  failed: "bg-red-100 text-red-800",
};

export function PostsManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [posts, setPosts] = useState(mockPosts);

  const filteredPosts = posts.filter(
    (post) =>
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.platform.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeletePost = (id: number) => {
    setPosts(posts.filter((p) => p.id !== id));
  };

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

        {/* Search and Filters */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs for Status Filter */}
        <Tabs defaultValue="all" className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Posts ({posts.length})</TabsTrigger>
            <TabsTrigger value="published">
              Published ({posts.filter((p) => p.status === "published").length})
            </TabsTrigger>
            <TabsTrigger value="scheduled">
              Scheduled ({posts.filter((p) => p.status === "scheduled").length})
            </TabsTrigger>
            <TabsTrigger value="draft">
              Drafts ({posts.filter((p) => p.status === "draft").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6 space-y-4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onDelete={handleDeletePost}
                />
              ))
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No posts found</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function PostCard({
  post,
  onDelete,
}: {
  post: (typeof mockPosts)[0];
  onDelete: (id: number) => void;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="capitalize">
                {post.platform}
              </Badge>
              <Badge className={statusColors[post.status]}>{post.status}</Badge>
            </div>
            <p className="text-foreground font-medium mb-2">{post.content}</p>
            {post.status === "published" && (
              <div className="flex gap-6 text-sm text-muted-foreground">
                <span>Published: {post.publishedAt}</span>
                <span>{post.engagement.toLocaleString()} engagement</span>
                <span>{post.reach.toLocaleString()} reach</span>
              </div>
            )}
            {post.status === "scheduled" && (
              <p className="text-sm text-muted-foreground">
                Scheduled for: {post.publishedAt}
              </p>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(post.id)}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
