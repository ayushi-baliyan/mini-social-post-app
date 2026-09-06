import React, { useState } from "react";
import api from "../api";

function CreatePost({ onPostCreated }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim() && !image) {
      alert("Please add text or an image.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("text", text);

      if (image) {
        formData.append("image", image);
      }

      const response = await api.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      onPostCreated(response.data.post);

      setText("");
      setImage(null);
      setPreview("");

      e.target.reset();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to create post."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post card">
      <h3>Create a Post</h3>

      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows="4"
        />

        {preview && (
          <div className="image-preview">
            <img src={preview} alt="Preview" />
          </div>
        )}

        <div className="post-actions">
          <label className="image-btn">
            📷 Add Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />
          </label>

          <button
            type="submit"
            className="post-btn"
            disabled={loading}
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePost;