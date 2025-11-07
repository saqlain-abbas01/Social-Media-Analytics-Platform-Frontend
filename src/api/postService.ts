import type { CreatePostFormData } from "@/components/forms/create-post-form";
import api from "./api";
import type { FilteredPostsResponse, PostAnalytics } from "@/types/post";

interface GetPostsParams {
  page?: number;
  limit?: number;
  search?: string;
  platform?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
}

export const createPost = async (data: CreatePostFormData) => {
  try {
    const response = await api.post("/posts", data);
    return response.data;
  } catch (err) {
    console.log("err", err);
    throw err;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updatePost = async (data: any) => {
  try {
    const response = await api.put(`/posts/${data.id}`, data);
    return response.data;
  } catch (err) {
    console.log("err", err);
    throw err;
  }
};

export const getPosts = async (
  params: GetPostsParams = {}
): Promise<FilteredPostsResponse> => {
  try {
    // Clone params to avoid mutating the original object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const queryParams: Record<string, any> = { ...params };

    // Remove 'status' if it's 'all'
    if (queryParams.status === "all") {
      delete queryParams.status;
    }
    console.log("queryParams", queryParams);
    const response = await api.get("/posts", { params: queryParams });
    return response.data;
  } catch (err) {
    console.error("Error fetching posts:", err);
    throw err;
  }
};

export const deletePost = async (id: string) => {
  try {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getPostAnalytics = async (id: string): Promise<PostAnalytics> => {
  try {
    const response = await api.get(`/posts/${id}/analytics`);
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
