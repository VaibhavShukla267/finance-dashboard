import React from "react";
import { useApp } from "../../context/AppContext";
import { Menu, Palette } from "lucide-react";

const PAGE_TITLES = {
  dashboard: "Dashboard",
  transactions: "Transactions",
  insights: "Insights",
};

export default function Topbar({ onMenuOpen }) {
  const { activePage, role, setRole, theme, setTheme } = useApp();

  const THEMES = [
    { value: "light", label: "☀️ Light" },
    { value: "dark", label: "🌙 Dark" },
    { value: "cyberpunk", label: "🤖 Cyberpunk" },
    { value: "emerald", label: "🌲 Emerald" },
    { value: "midnight", label: "🌌 Midnight" },
    { value: "sunset", label: "🌅 Sunset" },
  ];

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

        <div className="theme-selector-wrap">
          <Palette size={16} className="theme-icon" />
          <select
            className="theme-select"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            {THEMES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}