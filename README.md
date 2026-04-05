# Finance Dashboard UI

A bespoke, heavily-styled frontend dashboard designed for a high-end financial user experience. This application focuses on delivering structural elegance, expansive customization, and intuitive usability.

## Overview
This project was built to address core requirements for a modern finance dashboard interface: visual excellence, robust state management, responsive interactions, and deep data insight capabilities. Instead of relying on standard templates or heavy UI libraries, this dashboard uses **pure, vanilla React and CSS** to construct a customized 'Glassmorphism' design language. 

### Key Features
* **6-Mode Theme Engine:** Moves far beyond simple "Light" and "Dark" mode by introducing six distinct fluid themes (*Light, Dark, Cyberpunk, Emerald, Midnight, Sunset*).
* **Responsive Glassmorphism:** Features ultra-modern frosted glass UI elements (`backdrop-filter`) that beautifully adapt to any screen size (from 4K desktop to narrow smartphone viewports).
* **Role-Based Access Simulation:** Includes a UI toggle allowing you to switch between `Admin` (full Add/Edit/Delete access) and `Viewer` (Read-only data access).
* **Data Visualization:** Employs vibrant `recharts` components that are dynamically hooked into the CSS theme variables, ensuring charts perfectly integrate with the selected color scheme.
* **Persistent State Management:** Features a lightweight Context API implementation storing simulated transaction data configurations inside browser `localStorage`.
* **Deep Interaction:** Offers real-time transaction searching, multi-axis sorting, and comprehensive category/type filtering.

---

## 🚀 Setup Instructions

This project is built using Create React App. To get started locally:

1. **Clone & Navigate**
   Ensure you are in the project root directory.

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Development Server**
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

---

## 🧠 Technical Architecture & Approach

### 1. State Management & Data Flow
I opted for **React Context API** (`AppContext.js`) because it offers a native, clean solution for a dashboard of this size without the boilerplate of Redux.
* **Persistent Storage:** The Context automatically synchronizes state changes to `localStorage` via a `useEffect` hook, preserving simulated transactions and the active visual theme across sessions.
* **Centralized Logic:** Derivations like `totalIncome`, `totalExpenses`, and current balances are computed within the Context provider, feeding clean props directly to the presentation layers.

### 2. Styling Rules & CSS Variables
I intentionally avoided UI component libraries (like MUI) and utility frameworks (like Tailwind) to demonstrate strong classical CSS proficiency. 
* All styling is governed exclusively by `App.css`.
* The design uses a **CSS Custom Property (Variable) Token System**. A central parameter block manages spacing, radiuses, shadows, and over 14 color tokens.
* Switching themes via the UI instantly updates `data-theme` on the root DOM element, triggering a rapid, animated recoloring of the entire application.

### 3. Component Modularity
* **Pages (`src/pages/`):** Separated into massive distinct views (`Dashboard.jsx`, `Insights.jsx`, `Transactions.jsx`) for dedicated routing (currently simulated via state).
* **UI Elements (`src/components/UI/`):** Contains modular components like the responsive `TransactionModal.jsx`.
* **Layouts (`src/components/Layout/`):** Contains the `Topbar.jsx` and `Sidebar.jsx`, heavily optimized for mobile collapsing and contextual controls.

## 📈 Dashboard Capabilities Breakdown

### Dashboard Overview
* Renders real-time financial aggregates (Net Balance, Savings Rate, total transaction counts).
* Embeds a multi-gradient Area Chart tracking 6-month historical income versus expenses.
* Presents an interactive Doughnut Chart mapping categorical spending habits.

### Transactions Table
* Rich grid mapping comprehensive data.
* **Smart Search:** Live character filtering by description.
* **Sorting Capabilities:** Configurable Ascending/Descending sorts over Dates, Descriptions, and Amounts.
* **Filtering:** Categorical dropdowns cleanly isolating specific spend types.

### Insights Engine
* Aggregates standard data into actionable observations.
* Computes savings percentage thresholds to offer gamified encouragement.
* Compares current month metrics to the prior month's burn rate.
* Deploys progress-bar breakdowns charting the categorical hierarchy. 

---

*Thank you for reviewing! Feel free to switch directly to the "Cyberpunk" theme and click around the responsive layout.*
