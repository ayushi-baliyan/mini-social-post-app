import React, { useState } from "react";
import api from "../api";

function CommentSection({ post, onCommentAdded }) {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleComment = async (e) => {
    e.preventDefault();

    if (!comment.trim()) return;

    try {
      setLoading(true);

      const response = await api.post(
        `/posts/${post._id}/comment`,
        {
          text: comment,
        }
      );

      onCommentAdded(response.data.post);

      setComment("");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to add comment."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comments-section">
      <div className="comments-list">
        {post.comments?.length === 0 ? (
          <p className="no-comments">
            No comments yet.
          </p>
        ) : (
          post.comments?.map((item) => (
            <div
              className="comment"
              key={item._id}
            >
              <div className="comment-avatar">
                {item.username
                  ?.charAt(0)
                  .toUpperCase()}
              </div>

              <div className="comment-content">
                <strong>{item.username}</strong>
                <p>{item.text}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <form
        className="comment-form"
        onSubmit={handleComment}
      >
        <input
          type="text"
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) =>
            setComment(e.target.value)
          }
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
}

export default CommentSection;