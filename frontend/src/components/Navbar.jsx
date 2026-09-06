import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div
          className="logo"
          onClick={() => navigate("/feed")}
        >
          SocialPost
        </div>

        <div className="nav-right">
          {user && (
            <div className="nav-user">
              <div className="avatar">
                {user.username?.charAt(0).toUpperCase()}
              </div>

              <span>{user.username}</span>
            </div>
          )}

          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;