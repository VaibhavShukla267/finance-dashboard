import { useState, useEffect } from "react";
import { CATEGORIES } from "../../data/constants";
import { X } from "lucide-react";

const DEFAULT = {
  description: "",
  amount: "",
  category: "food",
  type: "expense",
  date: new Date().toISOString().split("T")[0],
};

export default function TransactionModal({ tx, onSave, onClose }) {
  const [form, setForm] = useState(tx || DEFAULT);

  useEffect(() => {
    setForm(tx || DEFAULT);
  }, [tx]);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = () => {
    if (!form.description.trim() || !form.amount || isNaN(form.amount)) return;
    onSave({ ...form, amount: Number(form.amount) });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div className="modal-title">{tx ? "Edit Transaction" : "Add Transaction"}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
            <X size={20} />
          </button>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <input
            className="form-input"
            placeholder="e.g. Zomato Order"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Amount (₹)</label>
            <input
              className="form-input"
              type="number"
              placeholder="0"
              value={form.amount}
              onChange={(e) => set("amount", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              className="form-input"
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Type</label>
            <select className="form-input" value={form.type} onChange={(e) => set("type", e.target.value)}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-input" value={form.category} onChange={(e) => set("category", e.target.value)}>
              {Object.entries(CATEGORIES).map(([key, { label, emoji }]) => (
                <option key={key} value={key}>{emoji} {label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {tx ? "Save Changes" : "Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}