import React from "react";
import { useApp } from "../context/AppContext";
import {CATEGORIES} from "../data/constants"
import { monthlyData } from "../data/mockData";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react";

function fmt(n) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n}`;
}

function SummaryCard({ icon, label, value, valueClass, change, bg }) {
  return (
    <div className="card">
      <div className="card-icon" style={{ background: bg }}>
        {icon}
      </div>
      <div className="card-label">{label}</div>
      <div className={`card-value ${valueClass}`}>{value}</div>
      {change && <div className="card-change">{change}</div>}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 10, padding: "12px 16px", boxShadow: "var(--shadow-lg)"
    }}>
      <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ fontSize: 13, fontWeight: 600, color: p.color, marginBottom: 2 }}>
          {p.name}: {fmt(p.value)}
        </div>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { totalIncome, totalExpenses, balance, transactions } = useApp();

  // Spending by category
  const catSpend = {};
  transactions
    .filter((tx) => tx.type === "expense")
    .forEach((tx) => {
      catSpend[tx.category] = (catSpend[tx.category] || 0) + tx.amount;
    });

  const pieData = Object.entries(catSpend)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([cat, value]) => ({
      name: CATEGORIES[cat]?.label || cat,
      value,
      color: CATEGORIES[cat]?.color || "#6b7280",
    }));

  const savingsRate = totalIncome > 0
    ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100)
    : 0;

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Overview</h2>
        <p className="page-subtitle">Your financial summary at a glance</p>
      </div>

      <div className="cards-grid">
        <SummaryCard
          icon={<Wallet size={22} color="var(--accent)" />}
          label="Net Balance"
          value={fmt(balance)}
          valueClass="accent"
          bg="var(--accent-light)"
          change={`Savings rate: ${savingsRate}%`}
        />
        <SummaryCard
          icon={<TrendingUp size={22} color="var(--green)" />}
          label="Total Income"
          value={fmt(totalIncome)}
          valueClass="green"
          bg="var(--green-light)"
          change={`${transactions.filter(t => t.type === "income").length} transactions`}
        />
        <SummaryCard
          icon={<TrendingDown size={22} color="var(--red)" />}
          label="Total Expenses"
          value={fmt(totalExpenses)}
          valueClass="red"
          bg="var(--red-light)"
          change={`${transactions.filter(t => t.type === "expense").length} transactions`}
        />
        <SummaryCard
          icon={<ArrowUpRight size={22} color="var(--amber)" />}
          label="Transactions"
          value={transactions.length}
          valueClass=""
          bg="var(--amber-light)"
          change="All time"
        />
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-title">Income vs Expenses (6 months)</div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--green)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--green)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--red)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--red)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} tickFormatter={(v) => fmt(v)} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="income" name="Income" stroke="var(--green)" strokeWidth={3} fill="url(#incomeGrad)" />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="var(--red)" strokeWidth={3} fill="url(#expenseGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-title">Spending Breakdown</div>
          {pieData.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📊</div>
              <div className="empty-state-text">No expense data yet</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => fmt(v)} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="chart-card">
        <div className="chart-title">Recent Transactions</div>
        {transactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <div className="empty-state-text">No transactions yet</div>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Category</th>
                <th>Date</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {[...transactions]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 5)
                .map((tx) => (
                  <tr key={tx.id}>
                    <td style={{ fontWeight: 500 }}>{tx.description}</td>
                    <td>
                      <span className="category-pill">
                        {CATEGORIES[tx.category]?.emoji} {CATEGORIES[tx.category]?.label}
                      </span>
                    </td>
                    <td style={{ color: "var(--text-secondary)" }}>
                      {new Date(tx.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </td>
                    <td className={`tx-amount ${tx.type}`}>
                      {tx.type === "income" ? "+" : "-"}{fmt(tx.amount)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}