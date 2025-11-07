import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiError } from "@/types";
import { createPost, updatePost } from "@/api/postService";
import type { Post } from "@/types/post";
import { useEffect } from "react";

const createPostSchema = z.object({
  content: z
    .string()
    .min(1, "Content is required")
    .max(1000, "Content must be less than 1000 characters"),
  platform: z
    .enum(["twitter", "facebook", "instagram", "linkedin"])
    .refine((value) => !!value, {
      message: "Please select a platform",
    }),
  scheduledAt: z.string().optional(),
});

export type CreatePostFormData = z.infer<typeof createPostSchema>;

export function CreatePostForm({
  onSuccess,
  editingPost,
}: {
  onSuccess: () => void;
  editingPost?: Post;
}) {
  console.log("editingPost", editingPost);
  const form = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      content: "",
      platform: "facebook",
      scheduledAt: "",
    },
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (editingPost) {
      const scheduledAt = editingPost.scheduledAt
        ? new Date(editingPost.scheduledAt).toISOString().slice(0, 16)
        : "";

      form.reset({
        content: editingPost.content,
        platform: editingPost.platform,
        scheduledAt,
      });
    }
  }, [editingPost]);

  const platforms = ["twitter", "facebook", "instagram", "linkedin"];

  const createMutation = useMutation({
    mutationFn: createPost,
    mutationKey: ["create-post"],
    onSuccess: () => {
      toast.success("Post created sucessfully");
      queryClient.invalidateQueries({ queryKey: ["get-posts"] });
      onSuccess();
    },
    onError: (err: ApiError) => {
      toast.error(err.response?.data.message || "Error creating post");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updatePost,
    mutationKey: ["update-post"],
    onSuccess: () => {
      toast.success("Post updated sucessfully");
      queryClient.invalidateQueries({ queryKey: ["get-posts"] });
      onSuccess();
    },
    onError: (err: ApiError) => {
      toast.error(err.response?.data.message || "Error updating post");
    },
  });

  const onSubmit = async (data: CreatePostFormData) => {
    if (editingPost) {
      let postStatus = "draft";
      if (data.scheduledAt) {
        postStatus = "scheduled";
      }
      const payload = {
        ...data,
        status: postStatus,
        id: editingPost._id,
      };
      updateMutation.mutate(payload);

      return;
    } else {
      let postStatus = "draft";
      if (data.scheduledAt) {
        postStatus = "scheduled";
      }
      const payload = {
        ...data,
        status: postStatus,
      };
      console.log("creat post data", payload);
      createMutation.mutate(payload);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* CONTENT */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Post Content</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="What's on your mind?"
                  className="min-h-[120px]"
                />
              </FormControl>
              <FormMessage />
              <p className="text-xs text-muted-foreground">
                {form.watch("content").length}/1000 characters
              </p>
            </FormItem>
          )}
        />

        {/* PLATFORMS */}
        <FormField
          control={form.control}
          name="platform"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Platform</FormLabel>
              <div className="space-y-2">
                {platforms.map((platform) => (
                  <FormItem
                    key={platform}
                    className="flex items-center space-x-2"
                  >
                    <FormControl>
                      <input
                        type="radio"
                        value={platform}
                        checked={field.value === platform}
                        onChange={() => field.onChange(platform)}
                        className="cursor-pointer"
                      />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      {platform}
                    </FormLabel>
                  </FormItem>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="scheduledAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Schedule Post (Optional)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="datetime-local"
                  placeholder="Select date and time"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {editingPost ? "Update Post" : "Create Post"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
