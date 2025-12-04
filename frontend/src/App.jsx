import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import ProjectSelection from "./ProjectSelection";
import Board from "./components/Board";

// Simple helper: read user from localStorage on load
function loadUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function App() {
  const [user, setUser] = useState(() => loadUser());

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <Router>
      <Routes>
        {/* root -> login */}
        <Route path="/" element={<Login setUser={setUser} />} />

        {/* signup */}
        <Route path="/signup" element={<Signup setUser={setUser} />} />

        {/* projects (protected) */}
        <Route
          path="/projects"
          element={
            user ? <ProjectSelection user={user} /> : <Navigate to="/" replace />
          }
        />

        {/* board per project (protected) */}
        <Route
          path="/board/:projectId"
          element={
            user ? (
              <Board
                user={user}
                onLogout={() => setUser(null)}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* fallback */}
        <Route
          path="*"
          element={<Navigate to={user ? "/projects" : "/"} replace />}
        />
      </Routes>
    </Router>
  );
}
