import { createContext, useContext, useState, useEffect } from "react";
import { mockTransactions } from "../data/mockData";

const AppContext = createContext();

const STORAGE_KEY = "financeapp_transactions";

export function AppProvider({ children }) {
  const [role, setRole] = useState("admin"); // "admin" | "viewer"
  const [darkMode, setDarkMode] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : mockTransactions;
  });

  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    category: "all",
    sortBy: "date",
    sortDir: "desc",
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const addTransaction = (tx) => {
    const newTx = { ...tx, id: Date.now() };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const editTransaction = (id, updated) => {
    setTransactions((prev) => prev.map((tx) => (tx.id === id ? { ...tx, ...updated } : tx)));
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  };

  const totalIncome = transactions
    .filter((tx) => tx.type === "income")
    .reduce((s, tx) => s + tx.amount, 0);

  const totalExpenses = transactions
    .filter((tx) => tx.type === "expense")
    .reduce((s, tx) => s + tx.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <AppContext.Provider
      value={{
        role, setRole,
        darkMode, setDarkMode,
        activePage, setActivePage,
        transactions, addTransaction, editTransaction, deleteTransaction,
        filters, setFilters,
        totalIncome, totalExpenses, balance,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);