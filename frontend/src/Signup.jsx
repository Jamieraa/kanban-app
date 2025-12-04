// Signup.jsx
import React, { useState } from "react";
import "./Signup.css";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();

    // basic validation
    if (!username.trim() || !email.trim() || !password.trim()) {
      alert("All fields are required.");
      return;
    }

    // get stored users or start with empty array
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

    // check if username already taken
    if (existingUsers.some((u) => u.username === username)) {
      alert("Username already exists.");
      return;
    }

    // create new user
    const newUser = { username, email, password };
    existingUsers.push(newUser);

    // save back to localStorage
    localStorage.setItem("users", JSON.stringify(existingUsers));

    alert("Account created! You can now log in.");
    navigate("/"); // go back to login page
  };

  return (
    <div className="signup-page">
      <h1 className="signup-title">Create Account</h1>
      <p className="signup-subtitle">Join SmartTask Tool</p>

      <div className="signup-card">
        <form onSubmit={handleSignup}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            placeholder="Enter username"
            onChange={(e) => setUsername(e.target.value)}
          />

          <label>Email</label>
          <input
            type="email"
            value={email}
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="signup-btn">
            Create Account
          </button>
        </form>

        <p className="login-text">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/")}
            style={{
              background: "transparent",
              border: "none",
              color: "#4dafff",
              cursor: "pointer",
              textDecoration: "underline",
              padding: 0,
            }}
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}
