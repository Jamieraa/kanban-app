// src/components/NotificationsDemo.jsx
import React from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function NotificationsDemo() {
  const trigger = () => {
    toast.info("Owner sent a notification — (demo)", { position: "top-right", autoClose: 3000 });
  };

  return (
    <div style={{ position: "fixed", left: 16, bottom: 16, zIndex: 2000 }}>
      <button onClick={trigger} style={{ padding: "10px 14px", background: "#2563eb", color: "white", border: "none", borderRadius: 6 }}>
        Trigger Notification (owner)
      </button>
      <ToastContainer />
    </div>
  );
}