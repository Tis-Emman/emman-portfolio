"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import type { User } from "../types/community";

export function useLikes(postId: string, user: User | null) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Toggle like on a post
  const toggleLike = async () => {
    if (!user) {
      return { success: false, error: "You must be signed in to like posts" };
    }

    setIsLoading(true);

    try {
      // Check if user already liked this post
      const { data: existingLike } = await supabase
        .from("post_likes")
        .select("*")
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .single();

      if (existingLike) {
        // Unlike
        const { error: deleteError } = await supabase
          .from("post_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user.id);

        if (deleteError) throw new Error(deleteError.message);
        setIsLiked(false);
        setLikesCount(Math.max(0, likesCount - 1));
      } else {
        // Like
        const { error: insertError } = await supabase
          .from("post_likes")
          .insert([
            {
              post_id: postId,
              user_id: user.id,
            },
          ]);

        if (insertError) throw new Error(insertError.message);
        setIsLiked(true);
        setLikesCount(likesCount + 1);
      }

      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err?.message || "Failed to toggle like" };
    }
  };

  return {
    isLiked,
    likesCount,
    isLoading,
    toggleLike,
    setLikesCount,
    setIsLiked,
  };
}