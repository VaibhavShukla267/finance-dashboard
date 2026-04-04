import React, { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/constants";
import TransactionModal from "../components/UI/TransactionModal";
import { Search, Plus, Pencil, Trash2, ArrowUpDown } from "lucide-react";

function fmt(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

export default function Transactions() {
  const { role, transactions, addTransaction, editTransaction, deleteTransaction, filters, setFilters } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTx, setEditTx] = useState(null);

  const filtered = useMemo(() => {
    let list = [...transactions];

    if (filters.search)
      list = list.filter((tx) =>
        tx.description.toLowerCase().includes(filters.search.toLowerCase())
      );

    if (filters.type !== "all")
      list = list.filter((tx) => tx.type === filters.type);

    if (filters.category !== "all")
      list = list.filter((tx) => tx.category === filters.category);

    list.sort((a, b) => {
      let av = a[filters.sortBy], bv = b[filters.sortBy];
      if (filters.sortBy === "date") { av = new Date(av); bv = new Date(bv); }
      if (filters.sortBy === "amount") { av = Number(av); bv = Number(bv); }
      return filters.sortDir === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });

    return list;
  }, [transactions, filters]);

  const toggleSort = (col) => {
    setFilters((f) => ({
      ...f,
      sortBy: col,
      sortDir: f.sortBy === col && f.sortDir === "desc" ? "asc" : "desc",
    }));
  };

  const handleSave = (form) => {
    if (editTx) {
      editTransaction(editTx.id, form);
    } else {
      addTransaction(form);
    }
    setModalOpen(false);
    setEditTx(null);
  };

  const handleEdit = (tx) => {
    setEditTx(tx);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditTx(null);
    setModalOpen(true);
  };

  const SortIcon = ({ col }) => (
    <ArrowUpDown
      size={12}
      style={{ marginLeft: 4, opacity: filters.sortBy === col ? 1 : 0.3 }}
    />
  );

  return (
    <div className="page">
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2 className="page-title">Transactions</h2>
          <p className="page-subtitle">{filtered.length} of {transactions.length} records</p>
        </div>
        {role === "admin" && (
          <button className="btn btn-primary" onClick={handleAdd}>
            <Plus size={15} /> Add Transaction
          </button>
        )}
      </div>

      <div className="table-card">
        <div className="table-toolbar">
          <div className="search-box">
            <Search size={14} className="search-icon" />
            <input
              placeholder="Search transactions..."
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            />
          </div>

          <select
            className="filter-select"
            value={filters.type}
            onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select
            className="filter-select"
            value={filters.category}
            onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
          >
            <option value="all">All Categories</option>
            {Object.entries(CATEGORIES).map(([key, { label, emoji }]) => (
              <option key={key} value={key}>{emoji} {label}</option>
            ))}
          </select>

          {(filters.search || filters.type !== "all" || filters.category !== "all") && (
            <button
              className="btn btn-ghost"
              onClick={() => setFilters((f) => ({ ...f, search: "", type: "all", category: "all" }))}
            >
              Clear
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <div className="empty-state-text">No transactions match your filters</div>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th onClick={() => toggleSort("description")}>
                    Description <SortIcon col="description" />
                  </th>
                  <th className="hide-mobile">Category</th>
                  <th onClick={() => toggleSort("date")}>
                    Date <SortIcon col="date" />
                  </th>
                  <th>Type</th>
                  <th onClick={() => toggleSort("amount")}>
                    Amount <SortIcon col="amount" />
                  </th>
                  {role === "admin" && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map((tx) => (
                  <tr key={tx.id}>
                    <td style={{ fontWeight: 500 }}>{tx.description}</td>
                    <td className="hide-mobile">
                      <span className="category-pill">
                        {CATEGORIES[tx.category]?.emoji} {CATEGORIES[tx.category]?.label}
                      </span>
                    </td>
                    <td style={{ color: "var(--text-secondary)" }}>
                      {new Date(tx.date).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric"
                      })}
                    </td>
                    <td>
                      <span className={`tx-type-badge ${tx.type}`}>
                        {tx.type === "income" ? "↑" : "↓"} {tx.type}
                      </span>
                    </td>
                    <td className={`tx-amount ${tx.type}`}>
                      {tx.type === "income" ? "+" : "-"}{fmt(tx.amount)}
                    </td>
                    {role === "admin" && (
                      <td>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            className="btn btn-ghost"
                            style={{ padding: "4px 8px" }}
                            onClick={() => handleEdit(tx)}
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            className="btn btn-danger"
                            style={{ padding: "4px 8px" }}
                            onClick={() => deleteTransaction(tx.id)}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <TransactionModal
          tx={editTx}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditTx(null); }}
        />
      )}
    </div>
  );
}