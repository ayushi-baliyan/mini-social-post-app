# Mini Social Post Application

A full-stack mini social media application where users can create posts, upload images, like posts, and comment on posts.

## 🚀 Live Demo

Frontend: Coming soon

Backend API: Coming soon

## 📌 Features

- User Signup and Login
- Secure password hashing using bcrypt
- JWT-based authentication
- Create text posts
- Create image posts
- Create posts with both text and image
- Public social feed
- Like and unlike posts
- Add comments to posts
- Display total likes and comments
- Store usernames of users who liked a post
- Store usernames of users who commented
- Image upload using Cloudinary
- MongoDB database
- Responsive and clean user interface
- Protected API routes

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- Axios
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Multer
- Cloudinary

## 📂 Project Structure

```text
mini-social-post-app/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── CreatePost.jsx
│   │   │   ├── PostCard.jsx
│   │   │   └── CommentSection.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── Feed.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── main.jsx
│   │   └── styles.css
│   │
│   ├── package.json
│   └── .env
│
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Post.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── postRoutes.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   └── postController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── .gitignore
└── README.md