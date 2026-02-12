"use client";

import React from "react";
import { Heart } from "lucide-react";
import type { Post, User } from "../../types/community";
import { useLikes } from "../../hooks/useLikes";

interface PostListProps {
  posts: Post[];
  user: User | null;
}

export function PostList({ posts, user }: PostListProps) {
  return (
    <div className="posts-list">
      {posts.map((post) => (
        <article key={post.id} className="post-card">
          <div className="post-header">
            <div className="author-info">
              <span className="author-avatar">{post.avatar}</span>
              <div>
                <h4 className="author-name">{post.author}</h4>
                <div className="post-meta">
                  <span className="post-time">{post.timeAgo}</span>
                  <span className="post-badge">{post.badge}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="post-content">
            <h3 className="post-title">{post.title}</h3>
            <p className="post-text">{post.content}</p>
          </div>

          <div className="post-footer">
            <LikeButton postId={post.id} user={user} initialLikes={post.likesCount || 0} initialLiked={post.likedByUser || false} />
          </div>
        </article>
      ))}
    </div>
  );
}

interface LikeButtonProps {
  postId: string;
  user: User | null;
  initialLikes: number;
  initialLiked: boolean;
}

function LikeButton({ postId, user, initialLikes, initialLiked }: LikeButtonProps) {
  const { isLiked, likesCount, isLoading, toggleLike, setLikesCount, setIsLiked } = useLikes(postId, user);

  // Initialize with data from post
  React.useEffect(() => {
    setLikesCount(initialLikes);
    setIsLiked(initialLiked);
  }, [postId]);

  const handleClick = async () => {
    if (!user) {
      alert("Sign in to like posts");
      return;
    }
    await toggleLike();
  };

  return (
    <button
      className={`like-btn ${isLiked ? "liked" : ""}`}
      onClick={handleClick}
      disabled={isLoading || !user}
      title={!user ? "Sign in to like posts" : ""}
    >
      <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
      <span className="likes-count">{likesCount}</span>
    </button>
  );
}