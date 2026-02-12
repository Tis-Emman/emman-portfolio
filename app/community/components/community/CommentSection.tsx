"use client";

import { useState, useEffect } from "react";
import { Trash2, Loader, Send } from "lucide-react";
import type { User } from "../../types/community";
import { useComments } from "../../hooks/useComments";

interface CommentSectionProps {
  postId: string;
  user: User | null;
}

export function CommentSection({ postId, user }: CommentSectionProps) {
  const { comments, isLoading, error, fetchComments, addComment, deleteComment } = useComments(postId, user);

  const [newCommentContent, setNewCommentContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    const result = await addComment(newCommentContent);

    if (result.success) {
      setNewCommentContent("");
      setSubmitError("");
    } else {
      setSubmitError(result.error || "Failed to add comment");
    }

    setIsSubmitting(false);
  };

  const handleDeleteComment = async (commentId: string) => {
    if (confirm("Delete this comment?")) {
      await deleteComment(commentId);
    }
  };

  return (
    <div className="comment-section">
      {/* Comment Input */}
      {user ? (
        <form onSubmit={handleAddComment} className="comment-input-form">
          <div className="comment-input-wrapper">
            <input
              type="text"
              value={newCommentContent}
              onChange={(e) => setNewCommentContent(e.target.value)}
              placeholder="Add a comment..."
              disabled={isSubmitting}
              className="comment-input"
              maxLength={500}
            />
            <button
              type="submit"
              disabled={isSubmitting || !newCommentContent.trim()}
              className="btn-submit-comment"
              title="Post comment"
            >
              {isSubmitting ? (
                <Loader size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </div>

          {submitError && (
            <div className="comment-error-message">{submitError}</div>
          )}
        </form>
      ) : (
        <div className="comment-sign-in-prompt">
          <p>Sign in to add comments</p>
        </div>
      )}

      {/* Comments List */}
      <div className="comments-list">
        {isLoading && comments.length === 0 ? (
          <div className="comments-loading">
            <Loader size={20} className="animate-spin" />
            <span>Loading comments...</span>
          </div>
        ) : error ? (
          <div className="comments-error">{error}</div>
        ) : comments.length === 0 ? (
          <div className="comments-empty">No comments yet. Be the first to comment!</div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-card">
              <div className="comment-header">
                <div className="comment-author-info">
                  <span className="comment-avatar">{comment.avatar}</span>
                  <div className="comment-author-details">
                    <h5 className="comment-author-name">
                      {comment.author}
                      {comment.isAuthor && <span className="author-badge">You</span>}
                    </h5>
                    <span className="comment-time">{comment.timeAgo}</span>
                  </div>
                </div>
              </div>

              <p className="comment-content">{comment.content}</p>

              <div className="comment-actions">
                {comment.isAuthor && (
                  <button
                    className="comment-action-btn delete-btn"
                    onClick={() => handleDeleteComment(comment.id)}
                    title="Delete comment"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}