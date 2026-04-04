import React from "react";
import { useApp } from "../../context/AppContext";
import {
  LayoutDashboard, ArrowLeftRight, Lightbulb, X
} from "lucide-react";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "transactions", label: "Transactions", icon: ArrowLeftRight },
  { id: "insights", label: "Insights", icon: Lightbulb },
];

export default function Sidebar({ open, onClose }) {
  const { activePage, setActivePage, role } = useApp();

  const handleNav = (id) => {
    setActivePage(id);
    onClose();
  };

  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <div className="sidebar-logo">
        <div className="logo-icon">💰</div>
        <div className="logo-text">Fin<span>Dash</span></div>
        <button
          onClick={onClose}
          style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}
          className="menu-btn"
        >
          <X size={18} />
        </button>
      </div>

      <div className="sidebar-nav">
        <div className="nav-section-label">Menu</div>
        {NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`nav-item ${activePage === id ? "active" : ""}`}
            onClick={() => handleNav(id)}
          >
            <Icon size={17} className="nav-icon" />
            {label}
          </button>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="role-badge">
          <div className={`role-dot ${role === "viewer" ? "viewer" : ""}`} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>
              {role === "admin" ? "Admin" : "Viewer"}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>
              {role === "admin" ? "Full Access" : "Read Only"}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}