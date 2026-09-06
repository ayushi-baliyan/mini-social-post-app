import React, { useState } from "react";
import api from "../api";
import CommentSection from "./CommentSection";

function PostCard({ post, onPostUpdated }) {
  const [showComments, setShowComments] = useState(false);
  const [liking, setLiking] = useState(false);

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const isLiked = user
    ? post.likes?.includes(user.username)
    : false;

  const handleLike = async () => {
    if (liking) return;

    try {
      setLiking(true);

      const response = await api.put(
        `/posts/${post._id}/like`
      );

      onPostUpdated(response.data.post);
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to like post."
      );
    } finally {
      setLiking(false);
    }
  };

  return (
    <div className="post-card card">
      {/* Post Header */}
      <div className="post-header">
        <div className="post-avatar">
          {post.username
            ?.charAt(0)
            .toUpperCase()}
        </div>

        <div>
          <h4>{post.username}</h4>

          <small>
            {post.createdAt
              ? new Date(
                  post.createdAt
                ).toLocaleString()
              : ""}
          </small>
        </div>
      </div>

      {/* Post Text */}
      {post.text && (
        <p className="post-text">
          {post.text}
        </p>
      )}

      {/* Post Image */}
      {post.image && (
        <div className="post-image">
          <img
            src={post.image}
            alt="Post"
          />
        </div>
      )}

      {/* Stats */}
      <div className="post-stats">
        <span>
          ❤️ {post.likes?.length || 0} likes
        </span>

        <span>
          💬 {post.comments?.length || 0} comments
        </span>
      </div>

      {/* Buttons */}
      <div className="post-buttons">
        <button
          className={isLiked ? "liked" : ""}
          onClick={handleLike}
          disabled={liking}
        >
          {isLiked ? "❤️ Liked" : "♡ Like"}
        </button>

        <button
          onClick={() =>
            setShowComments(!showComments)
          }
        >
          💬 Comment
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <CommentSection
          post={post}
          onCommentAdded={onPostUpdated}
        />
      )}
    </div>
  );
}

export default PostCard;