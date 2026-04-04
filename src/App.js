import{ useState } from "react";
import "./App.css";
import { AppProvider, useApp } from "./context/AppContext";
import Sidebar from "./components/Layout/Sidebar";
import Topbar from "./components/Layout/Topbar";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Insights from "./pages/Insights";

function AppContent() {
  const { activePage } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const Page = {
    dashboard: Dashboard,
    transactions: Transactions,
    insights: Insights,
  }[activePage] || Dashboard;

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div
        className="main-content"
        onClick={() => sidebarOpen && setSidebarOpen(false)}
      >
        <Topbar onMenuOpen={() => setSidebarOpen(true)} />
        <Page />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}