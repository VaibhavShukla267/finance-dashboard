import React from "react";
import { useApp } from "../../context/AppContext";
import { Moon, Sun, Menu } from "lucide-react";

const PAGE_TITLES = {
  dashboard: "Dashboard",
  transactions: "Transactions",
  insights: "Insights",
};

export default function Topbar({ onMenuOpen }) {
  const { activePage, role, setRole, darkMode, setDarkMode } = useApp();

  return (
    <div className="topbar">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button className="icon-btn menu-btn" onClick={onMenuOpen}>
          <Menu size={18} />
        </button>
        <h1 className="topbar-title">{PAGE_TITLES[activePage]}</h1>
      </div>

      <div className="topbar-actions">
        <select
          className="role-select"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="admin">👤 Admin</option>
          <option value="viewer">👁️ Viewer</option>
        </select>

        <button className="icon-btn" onClick={() => setDarkMode((d) => !d)}>
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </div>
  );
}