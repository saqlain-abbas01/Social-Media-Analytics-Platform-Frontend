// src/store/usePostsStore.ts
import type { Post } from "@/types/post";
import { create } from "zustand";

interface PostsState {
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;
  updatePost: (updatedPost: Post) => void;
  removePost: (id: string) => void;
  clearPosts: () => void;
}

export const usePostsStore = create<PostsState>((set) => ({
  posts: [],

  setPosts: (posts) => set({ posts }),

  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),

  updatePost: (updatedPost) =>
    set((state) => ({
      posts: state.posts.map((p) =>
        p._id === updatedPost._id ? updatedPost : p
      ),
    })),

  removePost: (id) =>
    set((state) => ({
      posts: state.posts.filter((p) => p._id !== id),
    })),

  clearPosts: () => set({ posts: [] }),
}));
