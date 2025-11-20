import React from "react";

export default function Notifications({ notifications = [], markRead }) {
  const unread = notifications.filter((n) => !n.read).length;
  return (
    <div style={{ minWidth: 260 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <strong>Notifications</strong>
        <span style={{ background: unread ? "red" : "gray", color: "white", borderRadius: 12, padding: "2px 8px", fontSize: 12 }}>{unread}</span>
      </div>

      <div style={{ marginTop: 8, maxHeight: 220, overflowY: "auto", background: "#222", padding: 8, borderRadius: 6 }}>
        {notifications.length === 0 ? <div style={{ color: "#999" }}>No notifications</div> :
          notifications.map((n, i) => (
            <div key={i} style={{ padding: 8, borderBottom: "1px solid #333", opacity: n.read ? 0.6 : 1 }}>
              <div style={{ fontSize: 13 }}>{n.message}</div>
              <div style={{ fontSize: 11, color: "#999" }}>{n.timestamp}</div>
              {markRead && !n.read && <button onClick={() => markRead(i)} style={{ marginTop: 6, padding: "6px 8px", background: "#0af", color: "white", border: "none", borderRadius: 4 }}>Mark read</button>}
            </div>
          ))
        }
      </div>
    </div>
  );
}