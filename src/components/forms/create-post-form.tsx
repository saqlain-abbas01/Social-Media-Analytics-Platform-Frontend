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
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const createPostSchema = z.object({
  content: z
    .string()
    .min(1, "Content is required")
    .max(1000, "Content must be less than 1000 characters"),
  platforms: z.array(z.string()).min(1, "Select at least one platform"),
  hashtags: z.string().optional(),
});

type CreatePostFormData = z.infer<typeof createPostSchema>;

export function CreatePostForm({ onSuccess }: { onSuccess: () => void }) {
  const form = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      content: "",
      platforms: [],
      hashtags: "",
    },
  });

  const platforms = ["Twitter", "Facebook", "Instagram", "LinkedIn"];

  const onSubmit = async (data: CreatePostFormData) => {
    try {
      console.log("POST DATA", data);

      toast.success("Post created successfully");
      onSuccess();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log(err);

      toast.error("Failed to create post");
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
          name="platforms"
          render={() => (
            <FormItem>
              <FormLabel>Platforms</FormLabel>
              <div className="space-y-2">
                {platforms.map((platform) => {
                  const selected = form.watch("platforms");

                  return (
                    <FormItem
                      key={platform}
                      className="flex items-center space-x-2"
                    >
                      <FormControl>
                        <Checkbox
                          checked={selected.includes(platform)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              form.setValue("platforms", [
                                ...selected,
                                platform,
                              ]);
                            } else {
                              form.setValue(
                                "platforms",
                                selected.filter((p) => p !== platform)
                              );
                            }
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        {platform}
                      </FormLabel>
                    </FormItem>
                  );
                })}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* HASHTAGS */}
        <FormField
          control={form.control}
          name="hashtags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hashtags (Optional)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="#marketing #socialmedia" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
          <Button type="submit">Create Post</Button>
        </div>
      </form>
    </Form>
  );
}
