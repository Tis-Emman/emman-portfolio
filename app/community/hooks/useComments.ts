"use client";

import { useState, useCallback } from "react";
import { supabase } from "../lib/supabase";
import type { User } from "../types/community";

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  author: string;
  avatar: string;
  content: string;
  timeAgo: string;
  isAuthor: boolean;
  created_at?: string;
}

export function useComments(postId: string, user: User | null) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch comments for a post
  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const { data, error: fetchError } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", postId)
        .order("created_at", { ascending: false });

      if (fetchError) {
        throw new Error(fetchError.message || "Failed to fetch comments");
      }

      if (!data || data.length === 0) {
        setComments([]);
        setIsLoading(false);
        return;
      }

      // Fetch user profiles for each comment
      const commentsWithProfiles = await Promise.all(
        data.map(async (comment) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("first_name, last_name")
            .eq("id", comment.user_id)
            .single();

          const fullName = profile
            ? `${profile.first_name} ${profile.last_name}`
            : "Anonymous User";

          const avatar = profile?.first_name
            ? profile.first_name.charAt(0).toUpperCase()
            : "?";

          const timeAgo = getTimeAgo(comment.created_at);

          return {
            id: comment.id,
            postId: comment.post_id,
            userId: comment.user_id,
            author: fullName,
            avatar: avatar,
            content: comment.content,
            timeAgo: timeAgo,
            isAuthor: user?.id === comment.user_id,
            created_at: comment.created_at,
          };
        })
      );

      setComments(commentsWithProfiles);
    } catch (err: any) {
      console.error("Error fetching comments:", err);
      setError(err?.message || "Failed to load comments");
      setComments([]);
    } finally {
      setIsLoading(false);
    }
  }, [postId, user]);

  // Add a new comment
  const addComment = async (content: string) => {
    if (!user) {
      return { success: false, error: "You must be signed in to comment" };
    }

    if (!content.trim()) {
      return { success: false, error: "Comment cannot be empty" };
    }

    setError("");

    try {
      const { error: insertError } = await supabase
        .from("comments")
        .insert([
          {
            post_id: postId,
            user_id: user.id,
            content: content.trim(),
          },
        ]);

      if (insertError) {
        throw new Error(insertError.message || "Failed to add comment");
      }

      // Refresh comments
      await fetchComments();

      return { success: true };
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to add comment";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Delete a comment
  const deleteComment = async (commentId: string) => {
    if (!user) {
      return { success: false, error: "You must be signed in to delete a comment" };
    }

    setError("");

    try {
      const { error: deleteError } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId)
        .eq("user_id", user.id);

      if (deleteError) {
        throw new Error(deleteError.message || "Failed to delete comment");
      }

      // Refresh comments
      await fetchComments();

      return { success: true };
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to delete comment";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  return {
    comments,
    isLoading,
    error,
    fetchComments,
    addComment,
    deleteComment,
  };
}

// Helper function to calculate time ago
function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}