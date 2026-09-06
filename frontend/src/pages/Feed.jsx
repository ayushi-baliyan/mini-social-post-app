import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api";
import Navbar from "../components/Navbar";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";

function Feed() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get("/posts");

      setPosts(response.data.posts || []);
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts((previousPosts) => [
      newPost,
      ...previousPosts,
    ]);
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts((previousPosts) =>
      previousPosts.map((post) =>
        post._id === updatedPost._id
          ? updatedPost
          : post
      )
    );
  };

  return (
    <>
      <Navbar />

      <main className="feed-container">
        <CreatePost
          onPostCreated={handlePostCreated}
        />

        <div className="feed-title">
          <h2>Public Feed</h2>
          <p>See what everyone is sharing.</p>
        </div>

        {loading ? (
          <div className="loading">
            Loading posts...
          </div>
        ) : posts.length === 0 ? (
          <div className="empty-state card">
            <h3>No posts yet</h3>
            <p>
              Be the first person to create a post!
            </p>
          </div>
        ) : (
          <div className="posts-list">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onPostUpdated={handlePostUpdated}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}

export default Feed;