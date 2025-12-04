import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

export default function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    console.log("Login clicked");

    // TEMP: mock login so you can move to next page
    const fakeUser = {
      username: username || "testuser",
      id: "12345",
    };

    setUser(fakeUser);         // store user
    navigate("/projects");     // go to next page
  };

  return (
    <div className="login-page">
      <h1 className="login-title">SmartTask Tool</h1>
      <p className="login-subtitle">Collaborate. Track. Achieve.</p>

      <div className="login-card">
        <form onSubmit={handleLogin}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />

          <button type="submit" className="login-btn">
            Log In
          </button>
        </form>

        <p className="signup-text">
          Don’t have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/signup")}
            style={{
              background: "transparent",
              border: "none",
              color: "#4dafff",
              cursor: "pointer",
              textDecoration: "underline",
              padding: 0,
            }}
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}

