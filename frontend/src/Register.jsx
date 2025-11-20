// src/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    birthday: "",
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.firstName || !form.lastName || !form.username || !form.password || !form.birthday) {
      toast.error("Please fill out all fields.");
      return;
    }

    const newUser = {
      ...form,
      role: "member",
    };

    localStorage.setItem("user", JSON.stringify(newUser));
    toast.success(`Account created for ${form.firstName}!`);
    navigate("/login");
  };

  return (
    <div style={{ padding: 20, background: "#222", color: "white", minHeight: "100vh" }}>
      <ToastContainer position="top-right" autoClose={2500} />
      <h1>Create Account</h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
        <label>First Name</label>
        <input name="firstName" value={form.firstName} onChange={handleChange} />

        <label>Last Name</label>
        <input name="lastName" value={form.lastName} onChange={handleChange} />

        <label>Birthday</label>
        <input type="date" name="birthday" value={form.birthday} onChange={handleChange} />

        <label>Username</label>
        <input name="username" value={form.username} onChange={handleChange} />

        <label>Password</label>
        <input type="password" name="password" value={form.password} onChange={handleChange} />

        <button type="submit" style={{ marginTop: 10 }}>Create Account</button>

        <div style={{ marginTop: 12 }}>
          <button onClick={() => navigate("/login")}>Back to Login</button>
        </div>
      </form>
    </div>
  );
}