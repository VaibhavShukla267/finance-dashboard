import React, { useMemo } from "react";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/constants";
import { monthlyData} from "../data/mockData";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

function fmt(n) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n}`;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 10, padding: "10px 14px", boxShadow: "var(--shadow-lg)"
    }}>
      <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ fontSize: 13, fontWeight: 600, color: p.color }}>
          {p.name}: {fmt(p.value)}
        </div>
      ))}
    </div>
  );
};

export default function Insights() {
  const { transactions, totalIncome, totalExpenses } = useApp();

  const catSpend = useMemo(() => {
    const map = {};
    transactions
      .filter((tx) => tx.type === "expense")
      .forEach((tx) => {
        map[tx.category] = (map[tx.category] || 0) + tx.amount;
      });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([cat, amount]) => ({
        cat,
        label: CATEGORIES[cat]?.label || cat,
        emoji: CATEGORIES[cat]?.emoji || "📦",
        color: CATEGORIES[cat]?.color || "#6b7280",
        amount,
        pct: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
      }));
  }, [transactions, totalExpenses]);

  const top = catSpend[0];
  const savingsRate = totalIncome > 0
    ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100)
    : 0;

  const avgMonthlyExpense = monthlyData.length
    ? Math.round(monthlyData.reduce((s, m) => s + m.expenses, 0) / monthlyData.length)
    : 0;

  const lastTwo = monthlyData.slice(-2);
  const expChange = lastTwo.length === 2
    ? Math.round(((lastTwo[1].expenses - lastTwo[0].expenses) / lastTwo[0].expenses) * 100)
    : 0;

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Insights</h2>
        <p className="page-subtitle">Understand your financial patterns</p>
      </div>

      <div className="insights-grid">
        <div className="insight-card">
          <div className="insight-label">Top Spending Category</div>
          {top ? (
            <>
              <div className="insight-value">{top.emoji} {top.label}</div>
              <div className="insight-sub">{fmt(top.amount)} — {top.pct}% of expenses</div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${top.pct}%`, background: top.color }} />
              </div>
            </>
          ) : (
            <div className="insight-sub">No expense data</div>
          )}
        </div>

        <div className="insight-card">
          <div className="insight-label">Savings Rate</div>
          <div className="insight-value" style={{ color: savingsRate >= 20 ? "var(--green)" : "var(--amber)" }}>
            {savingsRate}%
          </div>
          <div className="insight-sub">
            {savingsRate >= 30
              ? "🎉 Excellent savings discipline!"
              : savingsRate >= 15
              ? "👍 Good, aim for 30%+"
              : "⚠️ Consider reducing expenses"}
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${Math.min(savingsRate, 100)}%`,
                background: savingsRate >= 20 ? "var(--green)" : "var(--amber)"
              }}
            />
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-label">Avg Monthly Expense</div>
          <div className="insight-value">{fmt(avgMonthlyExpense)}</div>
          <div className="insight-sub">
            {expChange > 0
              ? `📈 Up ${expChange}% vs last month`
              : expChange < 0
              ? `📉 Down ${Math.abs(expChange)}% vs last month`
              : "Same as last month"}
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-label">Income vs Expenses</div>
          <div className="insight-value">{fmt(totalIncome - totalExpenses)}</div>
          <div className="insight-sub">Net surplus across all transactions</div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${totalIncome > 0 ? Math.min((totalExpenses / totalIncome) * 100, 100) : 0}%`,
                background: "var(--red)"
              }}
            />
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="split-grid">
        <div className="chart-card">
          <div className="chart-title">Monthly Comparison</div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} tickFormatter={fmt} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="income" name="Income" fill="var(--green)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="var(--red)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-title">Category Breakdown</div>
          {catSpend.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📊</div>
              <div className="empty-state-text">No expense data</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
              {catSpend.slice(0, 6).map(({ cat, label, emoji, color, amount, pct }) => (
                <div key={cat}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 13 }}>{emoji} {label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{fmt(amount)} <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>({pct}%)</span></span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Balance trend */}
      <div className="chart-card">
        <div className="chart-title">Balance Trend (6 months)</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} tickFormatter={fmt} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="balance" name="Net Balance" fill="var(--accent)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}