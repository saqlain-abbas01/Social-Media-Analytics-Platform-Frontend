import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Post } from "@/types/post";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { CreatePostForm } from "@/components/forms/create-post-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { ApiError } from "@/types";
import { deletePost } from "@/api/postService";
import { formatDate } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const statusColors: Record<string, string> = {
  published: "bg-green-100 text-green-800",
  scheduled: "bg-blue-100 text-blue-800",
  draft: "bg-gray-100 text-gray-800",
  failed: "bg-red-100 text-red-800",
};

export default function PostCard({ post }: { post: Post }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    mutationKey: ["delete-mutation"],
    onSuccess: () => {
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["get-posts"] });
      setIsDeleteOpen(false);
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data.message || "Error deleting post");
    },
  });

  const handleConfirmDelete = () => {
    deleteMutation.mutate(post._id);
  };

  const handleCardClick = () => {
    if (post.status === "published") {
      navigate(`/posts/${post._id}`);
    }
  };

  return (
    <>
      {/* ✅ Edit Post Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
            <DialogDescription>
              Update your post content or schedule time.
            </DialogDescription>
          </DialogHeader>
          <CreatePostForm
            onSuccess={() => setIsEditOpen(false)}
            editingPost={post}
          />
        </DialogContent>
      </Dialog>

      {/* ✅ Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this post? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ✅ Post Card */}
      <Card
        onClick={handleCardClick}
        className={`hover:shadow-md transition-shadow cursor-pointer ${
          post.status !== "published" ? "cursor-not-allowed opacity-80" : ""
        }`}
      >
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-4">
            {/* Left side: Post info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="capitalize">
                  {post.platform}
                </Badge>
                <Badge className={statusColors[post.status]}>
                  {post.status}
                </Badge>
              </div>

              <p className="text-foreground font-medium mb-2">{post.content}</p>

              {post.status === "published" && (
                <p className="text-sm text-muted-foreground">
                  Published: {formatDate(post.publishedAt)}
                </p>
              )}
              {post.status === "scheduled" && (
                <p className="text-sm text-muted-foreground">
                  Scheduled for: {formatDate(post.scheduledAt)}
                </p>
              )}
            </div>

            {/* ✅ Inline Action Buttons */}
            <div
              className="flex items-center gap-2 shrink-0"
              onClick={(e) => e.stopPropagation()} // Prevent click from triggering navigation
            >
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsEditOpen(true)}
                title="Edit Post"
              >
                <Edit className="w-4 h-4" />
              </Button>

              <Button
                variant="destructive"
                size="icon"
                onClick={() => setIsDeleteOpen(true)}
                title="Delete Post"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
