const express = require("express");
const multer = require("multer");

const protect = require("../middleware/authMiddleware");

const {
  createPost,
  getPosts,
  toggleLike,
  addComment
} = require("../controllers/postController");

const router = express.Router();

// Store uploaded files temporarily
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + file.originalname.replace(/\s+/g, "-");

    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024
  },

  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed."));
    }
  }
});

// Public feed
router.get("/", getPosts);

// Create post
router.post(
  "/",
  protect,
  upload.single("image"),
  createPost
);

// Like / Unlike
router.put(
  "/:id/like",
  protect,
  toggleLike
);

// Comment
router.post(
  "/:id/comment",
  protect,
  addComment
);

module.exports = router;