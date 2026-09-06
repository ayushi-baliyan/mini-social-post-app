const Post = require("../models/Post");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// CREATE POST
const createPost = async (req, res) => {
  try {
    const text = req.body.text || "";

    // Text ya image me se kam se kam ek required hai
    if (!text.trim() && !req.file) {
      return res.status(400).json({
        message: "Post must contain text or image."
      });
    }

    let imageUrl = "";

    // Cloudinary configuration
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    // Upload image to Cloudinary
    if (req.file) {
      // Check Cloudinary environment variables
      if (
        !process.env.CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET
      ) {
        console.error("Cloudinary environment variables are missing.");

        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }

        return res.status(500).json({
          message: "Cloudinary configuration is missing."
        });
      }

      const result = await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: "social-post-app"
        }
      );

      imageUrl = result.secure_url;

      // Delete temporary local image
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }

    // Create post in MongoDB
    const post = await Post.create({
      userId: req.user._id,
      username: req.user.username,
      text: text.trim(),
      image: imageUrl,
      likes: [],
      comments: []
    });

    return res.status(201).json({
      message: "Post created successfully.",
      post
    });

  } catch (error) {
    console.error("Create post error:", error);

    // Delete temporary file if something goes wrong
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({
      message: error.message || "Server error while creating post."
    });
  }
};


// GET PUBLIC FEED
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 });

    return res.json({
      posts
    });

  } catch (error) {
    console.error("Get posts error:", error);

    return res.status(500).json({
      message: "Server error while fetching posts."
    });
  }
};


// LIKE / UNLIKE POST
const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found."
      });
    }

    const username = req.user.username;

    const alreadyLiked = post.likes.includes(username);

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (name) => name !== username
      );
    } else {
      post.likes.push(username);
    }

    await post.save();

    return res.json({
      message: alreadyLiked
        ? "Post unliked."
        : "Post liked.",
      post
    });

  } catch (error) {
    console.error("Like error:", error);

    return res.status(500).json({
      message: "Server error while liking post."
    });
  }
};


// ADD COMMENT
const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        message: "Comment cannot be empty."
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found."
      });
    }

    post.comments.push({
      username: req.user.username,
      text: text.trim()
    });

    await post.save();

    return res.status(201).json({
      message: "Comment added successfully.",
      post
    });

  } catch (error) {
    console.error("Comment error:", error);

    return res.status(500).json({
      message: "Server error while adding comment."
    });
  }
};


module.exports = {
  createPost,
  getPosts,
  toggleLike,
  addComment
};