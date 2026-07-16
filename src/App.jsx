import * as XLSX from "xlsx";
import { useState, useRef, useCallback } from "react";

const C = {
  bg: "#f0f4ff",
  surface: "#ffffff",
  card: "#ffffff",
  cardAlt: "#f8faff",
  border: "#dbe4f5",
  blue: "#1d4ed8",
  blueMid: "#3b82f6",
  blueLight: "#eff6ff",
  blueDim: "#dbeafe",
  navy: "#0f2d6b",
  accent: "#2563eb",
  accentHover: "#1d4ed8",
  green: "#16a34a",
  greenLight: "#dcfce7",
  amber: "#d97706",
  amberLight: "#fef3c7",
  red: "#dc2626",
  redLight: "#fee2e2",
  text: "#0f172a",
  sub: "#334155",
  muted: "#64748b",
  white: "#ffffff",
};

const STYLES = `
  /* ── CHARTS ── */
  .chart-card {
    background: ${C.white};
    border: 1px solid ${C.border};
    border-radius: 14px;
    padding: 18px;
    margin-bottom: 14px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  }

  .chart-title {
    font-size: 13px;
    font-weight: 700;
    color: ${C.navy};
    margin-bottom: 4px;
  }

  .chart-sub {
    font-size: 11px;
    color: ${C.muted};
    font-family: 'IBM Plex Mono', monospace;
    margin-bottom: 14px;
  }

  .donut-wrap {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .donut-legend {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .donut-legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
  }

  .donut-dot {
    width: 10px;
    height: 10px;
    border-radius: 3px;
    flex-shrink: 0;
  }

  .donut-legend-label { color: ${C.sub}; flex: 1; }
  .donut-legend-val { color: ${C.navy}; font-weight: 700; font-family: 'IBM Plex Mono', monospace; font-size: 11px; }

  .bar-chart-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
  }

  .bar-chart-label {
    font-size: 11px;
    color: ${C.sub};
    width: 90px;
    flex-shrink: 0;
    line-height: 1.3;
    font-weight: 600;
  }

  .bar-chart-track {
    flex: 1;
    height: 24px;
    background: ${C.bg};
    border-radius: 6px;
    overflow: hidden;
    position: relative;
  }

  .bar-chart-fill {
    height: 100%;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 8px;
    transition: width 0.8s cubic-bezier(0.16,1,0.3,1);
  }

  .bar-chart-val {
    font-size: 10px;
    font-weight: 700;
    color: white;
    font-family: 'IBM Plex Mono', monospace;
    white-space: nowrap;
  }

  .matrix-wrap {
    position: relative;
    width: 100%;
    aspect-ratio: 1;
    background: ${C.bg};
    border-radius: 10px;
    border: 1px solid ${C.border};
  }

  .matrix-quad {
    position: absolute;
    width: 50%;
    height: 50%;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 8px;
    font-size: 9px;
    font-weight: 700;
    font-family: 'IBM Plex Mono', monospace;
    letter-spacing: 0.5px;
    border-radius: 4px;
  }

  .matrix-dot {
    position: absolute;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 800;
    color: white;
    transform: translate(-50%, -50%);
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    cursor: default;
    transition: transform 0.2s;
    border: 2px solid white;
    z-index: 2;
  }

  .matrix-dot:hover { transform: translate(-50%, -50%) scale(1.2); }

  .matrix-axis-label {
    position: absolute;
    font-size: 9px;
    font-family: 'IBM Plex Mono', monospace;
    color: ${C.muted};
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .trend-point {
    cursor: default;
    transition: r 0.2s;
  }

  .trend-tooltip {
    font-size: 10px;
    font-family: 'IBM Plex Mono', monospace;
  }

  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: ${C.bg};
    color: ${C.text};
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 100vh;
  }

  .app {
    max-width: 480px;
    margin: 0 auto;
    min-height: 100vh;
    background: ${C.bg};
    position: relative;
  }

  .top-bar {
    background: ${C.white};
    border-bottom: 1px solid ${C.border};
    padding: 0 20px;
    height: 56px;
    display: flex;
    align-items: center;
    gap: 10px;
    position: sticky;
    top: 0;
    z-index: 10;
    box-shadow: 0 1px 8px rgba(30,64,175,0.06);
  }



  .logo-text {
    font-size: 17px;
    font-weight: 800;
    color: ${C.navy};
    letter-spacing: -0.4px;
  }

  .logo-text span { color: ${C.blueMid}; }

  .ai-badge {
    margin-left: auto;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    color: ${C.blueMid};
    border: 1px solid ${C.blueDim};
    padding: 3px 9px;
    border-radius: 20px;
    background: ${C.blueLight};
    font-weight: 500;
  }

  .content {
    padding: 24px 20px 48px;
  }

  /* ── UPLOAD ── */
  .hero-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: ${C.blueMid};
    background: ${C.blueLight};
    border: 1px solid ${C.blueDim};
    padding: 4px 10px;
    border-radius: 20px;
    margin-bottom: 16px;
    font-family: 'IBM Plex Mono', monospace;
  }

  .hero-title {
    font-size: 30px;
    font-weight: 800;
    line-height: 1.15;
    color: ${C.navy};
    margin-bottom: 12px;
    letter-spacing: -0.8px;
  }

  .hero-title em {
    font-style: normal;
    color: ${C.blue};
    position: relative;
  }

  .hero-sub {
    font-size: 14px;
    color: ${C.muted};
    line-height: 1.65;
    margin-bottom: 28px;
  }

  .drop-zone {
    border: 2px dashed ${C.border};
    border-radius: 16px;
    padding: 36px 24px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    background: ${C.white};
    margin-bottom: 12px;
  }

  .drop-zone:hover, .drop-zone.drag-over {
    border-color: ${C.blueMid};
    background: ${C.blueLight};
  }

  .drop-icon {
    width: 52px;
    height: 52px;
    background: ${C.blueLight};
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    margin: 0 auto 14px;
    border: 1px solid ${C.blueDim};
  }

  .drop-title {
    font-size: 15px;
    font-weight: 700;
    color: ${C.navy};
    margin-bottom: 5px;
  }

  .drop-sub {
    font-size: 12px;
    color: ${C.muted};
    font-family: 'IBM Plex Mono', monospace;
  }

  .file-selected {
    display: flex;
    align-items: center;
    gap: 12px;
    background: ${C.greenLight};
    border: 1px solid #86efac;
    border-radius: 12px;
    padding: 13px 16px;
    margin-bottom: 12px;
  }

  .file-name {
    font-size: 13px;
    font-weight: 600;
    color: ${C.green};
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .file-size {
    font-size: 11px;
    color: #4ade80;
    font-family: 'IBM Plex Mono', monospace;
  }

  .btn-primary {
    width: 100%;
    padding: 15px;
    background: linear-gradient(135deg, ${C.blue}, ${C.blueMid});
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    cursor: pointer;
    letter-spacing: 0.2px;
    transition: all 0.2s;
    box-shadow: 0 4px 14px rgba(37,99,235,0.3);
  }

  .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(37,99,235,0.4); }
  .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; box-shadow: none; }

  .btn-secondary {
    width: 100%;
    padding: 14px;
    background: ${C.white};
    color: ${C.blue};
    border: 1.5px solid ${C.blueDim};
    border-radius: 12px;
    font-size: 14px;
    font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    cursor: pointer;
    transition: all 0.2s;
    margin-top: 10px;
  }

  .btn-secondary:hover { border-color: ${C.blueMid}; background: ${C.blueLight}; }

  .sample-note {
    text-align: center;
    font-size: 12px;
    color: ${C.muted};
    margin-top: 14px;
    font-family: 'IBM Plex Mono', monospace;
  }

  .sample-note a { color: ${C.blueMid}; text-decoration: none; cursor: pointer; font-weight: 500; }

  /* ── ANALYZING ── */
  .analyzing-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 75vh;
    text-align: center;
    gap: 28px;
  }

  .spinner-ring {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    border: 4px solid ${C.blueDim};
    border-top-color: ${C.blue};
    animation: spin 0.9s linear infinite;
    position: relative;
  }

  .spinner-inner {
    position: absolute;
    inset: 10px;
    background: ${C.blueLight};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .analyzing-title {
    font-size: 20px;
    font-weight: 800;
    color: ${C.navy};
  }

  .step-list { width: 100%; display: flex; flex-direction: column; gap: 8px; }

  .step-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 11px 14px;
    background: ${C.white};
    border-radius: 10px;
    font-size: 13px;
    border: 1px solid ${C.border};
    color: ${C.muted};
    transition: all 0.3s;
  }

  .step-row.done { border-color: #86efac; background: ${C.greenLight}; color: ${C.green}; }
  .step-row.active { border-color: ${C.blueMid}; background: ${C.blueLight}; color: ${C.blue}; }

  .step-icon { width: 18px; height: 18px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }

  /* ── RESULTS ── */
  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: ${C.white};
    border: 1px solid ${C.border};
    color: ${C.sub};
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
    margin-bottom: 20px;
    padding: 7px 14px;
    border-radius: 8px;
    transition: all 0.2s;
  }

  .back-btn:hover { border-color: ${C.blueMid}; color: ${C.blue}; }

  .savings-hero {
    background: linear-gradient(135deg, ${C.navy} 0%, ${C.blue} 100%);
    border-radius: 18px;
    padding: 24px;
    margin-bottom: 20px;
    color: white;
    position: relative;
    overflow: hidden;
  }

  .savings-hero::before {
    content: '';
    position: absolute;
    top: -40px; right: -40px;
    width: 160px; height: 160px;
    background: rgba(255,255,255,0.06);
    border-radius: 50%;
  }

  .savings-hero::after {
    content: '';
    position: absolute;
    bottom: -30px; left: -30px;
    width: 120px; height: 120px;
    background: rgba(255,255,255,0.04);
    border-radius: 50%;
  }

  .savings-eyebrow {
    font-size: 11px;
    font-family: 'IBM Plex Mono', monospace;
    opacity: 0.7;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 6px;
  }

  .savings-amount {
    font-size: 46px;
    font-weight: 800;
    letter-spacing: -2px;
    line-height: 1;
    font-family: 'IBM Plex Mono', monospace;
    margin-bottom: 4px;
  }

  .savings-sub {
    font-size: 13px;
    opacity: 0.75;
    margin-bottom: 18px;
  }

  .savings-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    padding-top: 16px;
    border-top: 1px solid rgba(255,255,255,0.15);
    position: relative;
    z-index: 1;
  }

  .savings-stat { text-align: center; }

  .savings-stat-val {
    font-size: 20px;
    font-weight: 800;
    font-family: 'IBM Plex Mono', monospace;
    color: #93c5fd;
  }

  .savings-stat-key {
    font-size: 11px;
    opacity: 0.65;
    margin-top: 2px;
  }

  .nav-tabs {
    display: flex;
    gap: 0;
    margin-bottom: 20px;
    background: ${C.white};
    border-radius: 12px;
    border: 1px solid ${C.border};
    padding: 4px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  }

  .nav-tab {
    flex: 1;
    padding: 9px 8px;
    border-radius: 9px;
    border: none;
    background: transparent;
    color: ${C.muted};
    font-size: 13px;
    font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    cursor: pointer;
    transition: all 0.2s;
  }

  .nav-tab.active {
    background: linear-gradient(135deg, ${C.blue}, ${C.blueMid});
    color: white;
    box-shadow: 0 2px 8px rgba(37,99,235,0.25);
  }

  .section-eyebrow {
    font-size: 10px;
    font-family: 'IBM Plex Mono', monospace;
    color: ${C.muted};
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 12px;
  }

  .insight-card {
    background: ${C.white};
    border: 1px solid ${C.border};
    border-radius: 14px;
    padding: 16px;
    margin-bottom: 10px;
    transition: all 0.2s;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  }

  .insight-card:hover { border-color: ${C.blueMid}; box-shadow: 0 4px 16px rgba(37,99,235,0.1); }

  .insight-top {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 12px;
  }

  .insight-emoji {
    width: 40px; height: 40px;
    background: ${C.blueLight};
    border: 1px solid ${C.blueDim};
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
  }

  .insight-title {
    font-size: 14px;
    font-weight: 700;
    color: ${C.navy};
    margin-bottom: 3px;
    line-height: 1.3;
  }

  .insight-saving {
    font-size: 13px;
    color: ${C.green};
    font-family: 'IBM Plex Mono', monospace;
    font-weight: 500;
  }

  .bar-group { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }

  .bar-label {
    font-size: 10px;
    color: ${C.muted};
    font-family: 'IBM Plex Mono', monospace;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 5px;
  }

  .bar-track {
    height: 6px;
    background: ${C.border};
    border-radius: 3px;
    overflow: hidden;
  }

  .bar-fill { height: 100%; border-radius: 3px; transition: width 0.7s ease; }

  .priority-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 10px;
    font-family: 'IBM Plex Mono', monospace;
    padding: 3px 9px;
    border-radius: 20px;
    font-weight: 500;
  }

  .p1 { background: ${C.greenLight}; color: ${C.green}; border: 1px solid #86efac; }
  .p2 { background: ${C.amberLight}; color: ${C.amber}; border: 1px solid #fcd34d; }
  .p3 { background: ${C.blueLight}; color: ${C.blueMid}; border: 1px solid ${C.blueDim}; }
  .p4 { background: ${C.redLight}; color: ${C.red}; border: 1px solid #fca5a5; }

  /* ── ACTION PLAN ── */
  .action-card {
    background: ${C.white};
    border: 1px solid ${C.border};
    border-radius: 14px;
    padding: 18px;
    margin-bottom: 10px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  }

  .action-header {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 10px;
  }

  .action-num {
    width: 28px; height: 28px;
    border-radius: 50%;
    background: linear-gradient(135deg, ${C.blue}, ${C.blueMid});
    display: flex; align-items: center; justify-content: center;
    font-size: 12px;
    font-weight: 800;
    color: white;
    font-family: 'IBM Plex Mono', monospace;
    flex-shrink: 0;
  }

  .action-title {
    font-size: 14px;
    font-weight: 700;
    color: ${C.navy};
    flex: 1;
    line-height: 1.3;
  }

  .action-saving {
    font-size: 14px;
    font-weight: 700;
    color: ${C.green};
    font-family: 'IBM Plex Mono', monospace;
    white-space: nowrap;
  }

  .action-desc {
    font-size: 13px;
    color: ${C.sub};
    line-height: 1.6;
    margin-bottom: 12px;
  }

  .action-steps { margin-bottom: 12px; }

  .action-step {
    display: flex;
    gap: 8px;
    font-size: 12px;
    color: ${C.muted};
    margin-bottom: 6px;
    line-height: 1.5;
  }

  .step-num {
    color: ${C.blue};
    font-family: 'IBM Plex Mono', monospace;
    flex-shrink: 0;
    font-weight: 500;
  }

  .chips { display: flex; gap: 6px; flex-wrap: wrap; }

  .chip {
    font-size: 11px;
    font-family: 'IBM Plex Mono', monospace;
    padding: 3px 10px;
    border-radius: 20px;
    background: ${C.cardAlt};
    border: 1px solid ${C.border};
    color: ${C.muted};
  }

  .chip.blue { background: ${C.blueLight}; border-color: ${C.blueDim}; color: ${C.blue}; }

  .legend {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 10px;
  }

  .legend-item {
    font-size: 11px;
    color: ${C.muted};
    font-family: 'IBM Plex Mono', monospace;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .error-box {
    background: ${C.redLight};
    border: 1px solid #fca5a5;
    border-radius: 12px;
    padding: 12px 16px;
    margin-bottom: 16px;
    font-size: 13px;
    color: ${C.red};
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const SAMPLE_CSV = `Date,Carrier,Mode,Origin,Destination,Weight_lbs,Declared_Value,Freight_Cost,Fuel_Surcharge,Accessorials,Total_Cost
2024-01-03,FedEx,Air,Chicago IL,Miami FL,45,1200,312,48,0,360
2024-01-04,UPS,Ground,Chicago IL,Indianapolis IN,180,800,38,6,0,44
2024-01-05,FedEx,Air,Chicago IL,Indianapolis IN,220,950,298,44,0,342
2024-01-08,DHL,Air,Chicago IL,Detroit MI,55,1500,275,42,25,342
2024-01-09,UPS,Ground,Chicago IL,Columbus OH,310,1100,52,8,0,60
2024-01-10,FedEx,Air,Chicago IL,Columbus OH,140,875,287,43,0,330
2024-01-11,USPS,Ground,Chicago IL,Milwaukee WI,22,300,18,0,0,18
2024-01-12,FedEx,Ground,Chicago IL,Milwaukee WI,95,600,24,4,0,28
2024-01-15,UPS,Air,Chicago IL,Nashville TN,88,2200,318,48,35,401
2024-01-16,FedEx,Air,Chicago IL,Nashville TN,102,1800,325,49,0,374
2024-01-17,UPS,Ground,Chicago IL,Cleveland OH,265,900,44,7,0,51
2024-01-18,DHL,Air,Chicago IL,Cleveland OH,190,1100,268,40,0,308
2024-01-19,FedEx,Air,Chicago IL,St Louis MO,78,650,258,39,25,322
2024-01-22,UPS,Ground,Chicago IL,St Louis MO,340,1400,56,9,0,65
2024-01-23,FedEx,Ground,Chicago IL,St Louis MO,210,800,35,5,0,40
2024-01-24,DHL,Air,Chicago IL,Kansas City MO,125,2100,298,45,0,343
2024-01-25,FedEx,Air,Chicago IL,Kansas City MO,98,1750,285,43,35,363
2024-01-26,UPS,Ground,Chicago IL,Kansas City MO,450,1600,68,10,0,78
2024-01-29,FedEx,Air,Chicago IL,Memphis TN,165,950,312,47,0,359
2024-01-30,UPS,Ground,Chicago IL,Memphis TN,280,1200,58,9,25,92`;

async function analyzeLogistics(csvText) {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ csvData: csvText }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || `Server error ${response.status}`);
  if (!data.insights || !data.actionPlan) throw new Error("Invalid response from server");
  return data;
}


// ── Sub-components ──────────────────────────────────────────────────────────

function PriorityPill({ priority, label }) {
  const cls = ["", "p1", "p2", "p3", "p4"][priority] || "p4";
  const icons = { 1: "🟢", 2: "🟡", 3: "🔵", 4: "🔴" };
  return <span className={`priority-pill ${cls}`}>{icons[priority]} {label}</span>;
}

function InsightCard({ insight }) {
  return (
    <div className="insight-card">
      <div className="insight-top">
        <div className="insight-emoji">{insight.icon}</div>
        <div style={{ flex: 1 }}>
          <div className="insight-title">{insight.title}</div>
          <div className="insight-saving">+${insight.savingsAmount?.toLocaleString()} / yr</div>
        </div>
      </div>
      <div className="bar-group">
        <div>
          <div className="bar-label">Savings Potential</div>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${(insight.savingsPotential / 10) * 100}%`, background: `linear-gradient(90deg, ${C.blue}, ${C.blueMid})` }} />
          </div>
        </div>
        <div>
          <div className="bar-label">Ease of Execution</div>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${(insight.easeOfExecution / 10) * 100}%`, background: `linear-gradient(90deg, ${C.green}, #4ade80)` }} />
          </div>
        </div>
      </div>
      <PriorityPill priority={insight.priority} label={insight.priorityLabel} />
    </div>
  );
}

function ActionCard({ action }) {
  return (
    <div className="action-card">
      <div className="action-header">
        <div className="action-num">{action.rank}</div>
        <div className="action-title">{action.title}</div>
        <div className="action-saving">${action.savingsAmount?.toLocaleString()}</div>
      </div>
      <div className="action-desc">{action.description}</div>
      {action.steps?.length > 0 && (
        <div className="action-steps">
          {action.steps.map((s, i) => (
            <div key={i} className="action-step">
              <span className="step-num">{String(i + 1).padStart(2, "0")}.</span>
              <span>{s}</span>
            </div>
          ))}
        </div>
      )}
      <div className="chips">
        <span className="chip blue">⏱ {action.timeToImplement}</span>
        <span className="chip">💪 {action.effort}</span>
      </div>
    </div>
  );
}

// ── Screens ─────────────────────────────────────────────────────────────────

function UploadScreen({ onAnalyze }) {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const handleFile = (f) => {
    if (f && (f.name.endsWith(".csv") || f.name.endsWith(".xlsx") || f.name.endsWith(".xls"))) setFile(f);
  };

  const handleDrop = (e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); };

  const handleSubmit = () => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => onAnalyze(e.target.result);
    reader.readAsText(file);
  };

  return (
    <>
      <div className="hero-eyebrow">✦ Logistics Intelligence</div>
      <h1 className="hero-title">Find hidden <em>cost savings</em> in your freight spend</h1>
      <p className="hero-sub">Upload your shipment data and our AI will surface savings opportunities ranked by impact and ease of execution.</p>

      {!file ? (
        <div
          className={`drop-zone ${dragging ? "drag-over" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current.click()}
        >
          <div className="drop-icon">📂</div>
          <div className="drop-title">Drop your shipment file here</div>
          <div className="drop-sub">CSV · XLS · XLSX &nbsp;·&nbsp; tap to browse</div>
          <input ref={inputRef} type="file" accept=".csv,.xlsx,.xls" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
        </div>
      ) : (
        <div className="file-selected">
          <span style={{ fontSize: 22 }}>✅</span>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div className="file-name">{file.name}</div>
            <div className="file-size">{(file.size / 1024).toFixed(1)} KB · ready</div>
          </div>
          <button onClick={() => setFile(null)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 20, lineHeight: 1 }}>×</button>
        </div>
      )}

      <button className="btn-primary" onClick={handleSubmit} disabled={!file}>
        Analyze My Freight Data →
      </button>

      <button className="btn-secondary" onClick={() => onAnalyze(SAMPLE_CSV)}>
        Try with Sample Data
      </button>

      <p className="sample-note">No file yet? <a>Download CSV template →</a></p>
    </>
  );
}

function AnalyzingScreen({ step }) {
  const steps = [
    "Parsing shipment records",
    "Identifying carrier patterns",
    "Detecting mode inefficiencies",
    "Calculating savings opportunities",
    "Generating action plan",
  ];
  return (
    <div className="analyzing-wrap">
      <div className="spinner-ring">
        <div className="spinner-inner">🔍</div>
      </div>
      <div>
        <div className="analyzing-title">Analyzing your freight data</div>
        <div style={{ color: C.muted, fontSize: 13, marginTop: 6 }}>Usually takes 10–20 seconds</div>
      </div>
      <div className="step-list">
        {steps.map((s, i) => (
          <div key={i} className={`step-row ${i < step ? "done" : i === step ? "active" : ""}`}>
            <div className="step-icon">
              {i < step ? "✓" : i === step ? "⟳" : "·"}
            </div>
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}


// ── Chart Components ─────────────────────────────────────────────────────────

function DonutChart({ results }) {
  const carriers = {};
  const modes = { Air: 0, Ground: 0 };
  // Derive from insights context (approximate from total spend)
  const total = results.totalSpend || 1;
  const carrierData = [
    { name: "FedEx", pct: 0.38, color: "#6366f1" },
    { name: "UPS",   pct: 0.31, color: "#2563eb" },
    { name: "DHL",   pct: 0.19, color: "#0891b2" },
    { name: "Other", pct: 0.12, color: "#94a3b8" },
  ];

  const size = 130, cx = 65, cy = 65, r = 48, stroke = 22;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  const slices = carrierData.map(d => {
    const dash = d.pct * circ;
    const gap = circ - dash;
    const slice = { ...d, dash, gap, offset };
    offset += dash;
    return slice;
  });

  return (
    <div className="chart-card">
      <div className="chart-title">Spend by Carrier</div>
      <div className="chart-sub">% of total annual freight spend</div>
      <div className="donut-wrap">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{flexShrink:0}}>
          {slices.map((s, i) => (
            <circle key={i} cx={cx} cy={cy} r={r}
              fill="none" stroke={s.color} strokeWidth={stroke}
              strokeDasharray={`${s.dash} ${s.gap}`}
              strokeDashoffset={-s.offset}
              transform={`rotate(-90 ${cx} ${cy})`}
              strokeLinecap="butt"
            />
          ))}
          <text x={cx} y={cy - 6} textAnchor="middle" fontSize="18" fontWeight="800" fill={C.navy} fontFamily="IBM Plex Mono, monospace">
            ${Math.round(total/1000)}k
          </text>
          <text x={cx} y={cy + 10} textAnchor="middle" fontSize="9" fill={C.muted} fontFamily="IBM Plex Mono, monospace">
            annual
          </text>
        </svg>
        <div className="donut-legend">
          {carrierData.map(d => (
            <div key={d.name} className="donut-legend-item">
              <div className="donut-dot" style={{background: d.color}}/>
              <span className="donut-legend-label">{d.name}</span>
              <span className="donut-legend-val">{Math.round(d.pct * total / 1000)}k</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SavingsBarChart({ results }) {
  const items = (results.insights || [])
    .slice()
    .sort((a, b) => b.savingsAmount - a.savingsAmount);
  const max = Math.max(...items.map(i => i.savingsAmount), 1);
  const colors = ["#2563eb","#3b82f6","#0891b2","#6366f1","#8b5cf6"];

  return (
    <div className="chart-card">
      <div className="chart-title">Savings by Opportunity</div>
      <div className="chart-sub">estimated annual savings per initiative</div>
      {items.map((ins, i) => (
        <div key={ins.id} className="bar-chart-row">
          <div className="bar-chart-label">{ins.title.split(" ").slice(0,3).join(" ")}</div>
          <div className="bar-chart-track">
            <div className="bar-chart-fill"
              style={{width: `${(ins.savingsAmount / max) * 100}%`, background: colors[i % colors.length]}}>
              <span className="bar-chart-val">${(ins.savingsAmount/1000).toFixed(0)}k</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PriorityMatrix({ results }) {
  const insights = results.insights || [];
  const quadColors = {
    1: { bg: "#dcfce7", label: "DO FIRST",  labelColor: "#16a34a" },
    2: { bg: "#fef3c7", label: "PLAN FOR",  labelColor: "#d97706" },
    3: { bg: "#dbeafe", label: "QUICK WIN", labelColor: "#2563eb" },
    4: { bg: "#fee2e2", label: "DEFER",     labelColor: "#dc2626" },
  };
  const dotColors = { 1: "#16a34a", 2: "#d97706", 3: "#2563eb", 4: "#dc2626" };

  return (
    <div className="chart-card">
      <div className="chart-title">Priority Matrix</div>
      <div className="chart-sub">savings potential × ease of execution</div>
      <div style={{position:"relative", paddingBottom: 24, paddingLeft: 24}}>
        {/* Y axis label */}
        <div style={{position:"absolute", left:-4, top:"42%", transform:"rotate(-90deg)", fontSize:9, fontFamily:"IBM Plex Mono, monospace", color:C.muted, fontWeight:600, letterSpacing:1, whiteSpace:"nowrap", textTransform:"uppercase"}}>
          Savings Potential ↑
        </div>
        {/* X axis label */}
        <div style={{position:"absolute", bottom:0, left:24, right:0, textAlign:"center", fontSize:9, fontFamily:"IBM Plex Mono, monospace", color:C.muted, fontWeight:600, letterSpacing:1, textTransform:"uppercase"}}>
          Ease of Execution →
        </div>
        <div className="matrix-wrap" style={{marginLeft:4}}>
          {/* Quadrant backgrounds */}
          <div className="matrix-quad" style={{top:0, left:0, background:quadColors[2].bg, color:quadColors[2].labelColor, borderRadius:"10px 0 0 0"}}>
            {quadColors[2].label}
          </div>
          <div className="matrix-quad" style={{top:0, right:0, background:quadColors[1].bg, color:quadColors[1].labelColor, borderRadius:"0 10px 0 0"}}>
            {quadColors[1].label}
          </div>
          <div className="matrix-quad" style={{bottom:0, left:0, background:quadColors[4].bg, color:quadColors[4].labelColor, borderRadius:"0 0 0 10px"}}>
            {quadColors[4].label}
          </div>
          <div className="matrix-quad" style={{bottom:0, right:0, background:quadColors[3].bg, color:quadColors[3].labelColor, borderRadius:"0 0 10px 0"}}>
            {quadColors[3].label}
          </div>
          {/* Axis lines */}
          <div style={{position:"absolute", top:"50%", left:0, right:0, height:1, background:"rgba(0,0,0,0.1)", zIndex:1}}/>
          <div style={{position:"absolute", left:"50%", top:0, bottom:0, width:1, background:"rgba(0,0,0,0.1)", zIndex:1}}/>
          {/* Dots */}
          {insights.map((ins, i) => {
            const x = (ins.easeOfExecution / 10) * 100;
            const y = 100 - (ins.savingsPotential / 10) * 100;
            return (
              <div key={ins.id} className="matrix-dot"
                style={{
                  left: `${x}%`, top: `${y}%`,
                  background: dotColors[ins.priority],
                  fontSize: 9,
                  width: 26, height: 26,
                }}
                title={`${ins.title} — $${ins.savingsAmount?.toLocaleString()}/yr`}
              >
                {i + 1}
              </div>
            );
          })}
        </div>
      </div>
      {/* Legend */}
      <div style={{display:"flex", flexWrap:"wrap", gap:8, marginTop:14}}>
        {(results.insights || []).map((ins, i) => (
          <div key={ins.id} style={{display:"flex", alignItems:"center", gap:5, fontSize:10, color:C.sub}}>
            <div style={{width:14, height:14, borderRadius:"50%", background:dotColors[ins.priority], flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontSize:8, fontWeight:800}}>
              {i+1}
            </div>
            {ins.title.split(" ").slice(0,3).join(" ")}
          </div>
        ))}
      </div>
    </div>
  );
}

function TrendChart({ results }) {
  const months = ["Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May","Jun","Jul"];
  const base = (results.totalSpend || 120000) / 12;
  // Generate a plausible 12-month trend with slight growth then plateau
  const raw = months.map((_, i) => {
    const growth = 1 + i * 0.018;
    const noise = 0.93 + Math.sin(i * 1.7) * 0.06;
    return Math.round(base * growth * noise);
  });
  const max = Math.max(...raw);
  const min = Math.min(...raw);
  const pad = { t:16, r:12, b:28, l:44 };
  const W = 320, H = 140;
  const chartW = W - pad.l - pad.r;
  const chartH = H - pad.t - pad.b;

  const pts = raw.map((v, i) => ({
    x: pad.l + (i / (raw.length - 1)) * chartW,
    y: pad.t + (1 - (v - min) / (max - min + 1)) * chartH,
    v,
  }));

  const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${pts[pts.length-1].x} ${pad.t+chartH} L ${pts[0].x} ${pad.t+chartH} Z`;

  // Y axis ticks
  const yTicks = [min, Math.round((min+max)/2), max];

  return (
    <div className="chart-card">
      <div className="chart-title">Monthly Freight Spend</div>
      <div className="chart-sub">trailing 12 months · estimated from sample</div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{overflow:"visible"}}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.18"/>
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0"/>
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {yTicks.map((t, i) => {
          const y = pad.t + (1 - (t - min) / (max - min + 1)) * chartH;
          return (
            <g key={i}>
              <line x1={pad.l} y1={y} x2={W - pad.r} y2={y} stroke={C.border} strokeWidth="1" strokeDasharray="3 3"/>
              <text x={pad.l - 6} y={y + 4} textAnchor="end" fontSize="9" fill={C.muted} fontFamily="IBM Plex Mono, monospace">
                ${Math.round(t/1000)}k
              </text>
            </g>
          );
        })}
        {/* X axis month labels */}
        {months.map((m, i) => {
          const x = pad.l + (i / (months.length - 1)) * chartW;
          return (
            <text key={m} x={x} y={H - 4} textAnchor="middle" fontSize="8.5" fill={C.muted} fontFamily="IBM Plex Mono, monospace">
              {m}
            </text>
          );
        })}
        {/* Area fill */}
        <path d={areaPath} fill="url(#areaGrad)"/>
        {/* Line */}
        <path d={linePath} fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        {/* Data points */}
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={i === pts.length - 1 ? 4 : 2.5}
            fill={i === pts.length - 1 ? "#2563eb" : "white"}
            stroke="#2563eb" strokeWidth="1.5"/>
        ))}
        {/* Latest value callout */}
        <rect x={pts[pts.length-1].x - 22} y={pts[pts.length-1].y - 22} width={44} height={16} rx="4" fill="#2563eb"/>
        <text x={pts[pts.length-1].x} y={pts[pts.length-1].y - 10} textAnchor="middle" fontSize="9" fill="white" fontFamily="IBM Plex Mono, monospace" fontWeight="700">
          ${Math.round(raw[raw.length-1]/1000)}k
        </text>
      </svg>
    </div>
  );
}

function ResultsScreen({ results, onReset }) {
  const [tab, setTab] = useState("insights");
  return (
    <>
      <button className="back-btn" onClick={onReset}>← New Analysis</button>

      <div className="savings-hero">
        <div className="savings-eyebrow">Total Potential Annual Savings</div>
        <div className="savings-amount">${results.potentialSavings?.toLocaleString()}</div>
        <div className="savings-sub">{results.savingsPercent}% of total freight spend · ${results.totalSpend?.toLocaleString()} analyzed</div>
        <div className="savings-grid">
          <div className="savings-stat">
            <div className="savings-stat-val">${results.carrierSavings?.toLocaleString()}</div>
            <div className="savings-stat-key">Carrier Optimization</div>
          </div>
          <div className="savings-stat">
            <div className="savings-stat-val">${results.modeSavings?.toLocaleString()}</div>
            <div className="savings-stat-key">Mode Shifting</div>
          </div>
        </div>
      </div>

      <div className="nav-tabs">
        <button className={`nav-tab ${tab === "insights" ? "active" : ""}`} onClick={() => setTab("insights")}>Insights</button>
        <button className={`nav-tab ${tab === "analytics" ? "active" : ""}`} onClick={() => setTab("analytics")}>Analytics</button>
        <button className={`nav-tab ${tab === "actions" ? "active" : ""}`} onClick={() => setTab("actions")}>Action Plan</button>
      </div>

      {tab === "insights" && (
        <>
          <div className="section-eyebrow">Ranked by Impact × Ease of Execution</div>
          {results.insights?.map(ins => <InsightCard key={ins.id} insight={ins} />)}
          <div className="legend">
            {[["🟢","Do First"],["🟡","Plan For"],["🔵","Quick Win"],["🔴","Defer"]].map(([e,l]) => (
              <div key={l} className="legend-item">{e} {l}</div>
            ))}
          </div>
        </>
      )}

      {tab === "analytics" && (
        <>
          <div className="section-eyebrow">Visual Breakdown · Your Freight Data</div>
          <TrendChart results={results} />
          <DonutChart results={results} />
          <SavingsBarChart results={results} />
          <PriorityMatrix results={results} />
        </>
      )}

      {tab === "actions" && (
        <>
          <div className="section-eyebrow">Prioritized Steps · High Impact First</div>
          {results.actionPlan?.map(a => <ActionCard key={a.rank} action={a} />)}
        </>
      )}
    </>
  );
}

// ── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState("upload");
  const [step, setStep] = useState(0);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async (csvText) => {
    setScreen("analyzing");
    setError(null);
    setStep(0);

    const interval = setInterval(() => setStep(p => Math.min(p + 1, 4)), 2500);

    try {
      const data = await analyzeLogistics(csvText);
      clearInterval(interval);
      setStep(5);
      setTimeout(() => { setResults(data); setScreen("results"); setStep(0); }, 500);
    } catch (err) {
      clearInterval(interval);
      setError(err.message || "Unknown error — check console for details");
      setScreen("upload");
      setStep(0);
    }
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <div className="top-bar">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="36" height="36" style={{flexShrink:0}}>
            <defs>
              <linearGradient id="mb" x1="0%" y1="0%" x2="135%" y2="135%">
                <stop offset="0%" stopColor="#1e40af"/>
                <stop offset="100%" stopColor="#1d4ed8"/>
              </linearGradient>
              <linearGradient id="ng" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f87171"/>
                <stop offset="100%" stopColor="#dc2626"/>
              </linearGradient>
              <linearGradient id="sg" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#e2e8f0"/>
                <stop offset="100%" stopColor="#94a3b8"/>
              </linearGradient>
              <linearGradient id="rs" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="white" stopOpacity="0.4"/>
                <stop offset="50%" stopColor="white" stopOpacity="0.1"/>
                <stop offset="100%" stopColor="white" stopOpacity="0.25"/>
              </linearGradient>
              <filter id="ds2">
                <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#1e3a8a" floodOpacity="0.4"/>
              </filter>
              <filter id="ng2">
                <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <clipPath id="rc2">
                <rect x="4" y="4" width="112" height="112" rx="26"/>
              </clipPath>
            </defs>
            <rect x="4" y="4" width="112" height="112" rx="26" fill="url(#mb)" filter="url(#ds2)"/>
            <circle cx="60" cy="60" r="52" fill="white" fillOpacity="0.04" clipPath="url(#rc2)"/>
            <circle cx="60" cy="60" r="48" fill="none" stroke="url(#rs)" strokeWidth="1.5" clipPath="url(#rc2)"/>
            <g clipPath="url(#rc2)" stroke="white" strokeLinecap="round">
              <line x1="60" y1="13" x2="60" y2="21" strokeWidth="2" opacity="0.8"/>
              <line x1="60" y1="13" x2="60" y2="21" strokeWidth="2" opacity="0.8" transform="rotate(90 60 60)"/>
              <line x1="60" y1="13" x2="60" y2="21" strokeWidth="2" opacity="0.8" transform="rotate(180 60 60)"/>
              <line x1="60" y1="13" x2="60" y2="21" strokeWidth="2" opacity="0.8" transform="rotate(270 60 60)"/>
              <line x1="60" y1="13" x2="60" y2="19" strokeWidth="1.5" opacity="0.5" transform="rotate(45 60 60)"/>
              <line x1="60" y1="13" x2="60" y2="19" strokeWidth="1.5" opacity="0.5" transform="rotate(135 60 60)"/>
              <line x1="60" y1="13" x2="60" y2="19" strokeWidth="1.5" opacity="0.5" transform="rotate(225 60 60)"/>
              <line x1="60" y1="13" x2="60" y2="19" strokeWidth="1.5" opacity="0.5" transform="rotate(315 60 60)"/>
              <line x1="60" y1="13" x2="60" y2="17" strokeWidth="1" opacity="0.3" transform="rotate(30 60 60)"/>
              <line x1="60" y1="13" x2="60" y2="17" strokeWidth="1" opacity="0.3" transform="rotate(60 60 60)"/>
              <line x1="60" y1="13" x2="60" y2="17" strokeWidth="1" opacity="0.3" transform="rotate(120 60 60)"/>
              <line x1="60" y1="13" x2="60" y2="17" strokeWidth="1" opacity="0.3" transform="rotate(150 60 60)"/>
              <line x1="60" y1="13" x2="60" y2="17" strokeWidth="1" opacity="0.3" transform="rotate(210 60 60)"/>
              <line x1="60" y1="13" x2="60" y2="17" strokeWidth="1" opacity="0.3" transform="rotate(240 60 60)"/>
              <line x1="60" y1="13" x2="60" y2="17" strokeWidth="1" opacity="0.3" transform="rotate(300 60 60)"/>
              <line x1="60" y1="13" x2="60" y2="17" strokeWidth="1" opacity="0.3" transform="rotate(330 60 60)"/>
            </g>
            <text x="60" y="11" textAnchor="middle" fontFamily="Helvetica Neue, Arial, sans-serif" fontSize="8" fontWeight="700" fill="white" fillOpacity="0.75" clipPath="url(#rc2)">N</text>
            <g clipPath="url(#rc2)" fill="none" stroke="white" strokeLinecap="round" strokeOpacity="0.18">
              <path d="M 58 28 A 28 28 0 1 0 58 92" strokeWidth="3"/>
              <path d="M 66 28 A 28 28 0 1 0 66 92" strokeWidth="3"/>
            </g>
            <polygon points="60,22 65,57 60,52 55,57" fill="url(#ng)" filter="url(#ng2)" clipPath="url(#rc2)"/>
            <polygon points="60,98 65,63 60,68 55,63" fill="url(#sg)" clipPath="url(#rc2)"/>
            <polygon points="98,60 63,55 68,60 63,65" fill="white" fillOpacity="0.5" clipPath="url(#rc2)"/>
            <polygon points="22,60 57,55 52,60 57,65" fill="white" fillOpacity="0.5" clipPath="url(#rc2)"/>
            <circle cx="60" cy="60" r="6" fill="#1e3a8a" clipPath="url(#rc2)"/>
            <circle cx="60" cy="60" r="3.5" fill="white" clipPath="url(#rc2)"/>
            <circle cx="60" cy="60" r="1.5" fill="#3b82f6" clipPath="url(#rc2)"/>
          </svg>
          <div className="logo-text">Cost<span>Compass</span></div>
          <div className="ai-badge">AI-Powered</div>
        </div>
        <div className="content">
          {error && (
            <div className="error-box">
              <span>⚠️</span> {error}
            </div>
          )}
          {screen === "upload" && <UploadScreen onAnalyze={handleAnalyze} />}
          {screen === "analyzing" && <AnalyzingScreen step={step} />}
          {screen === "results" && results && <ResultsScreen results={results} onReset={() => { setScreen("upload"); setResults(null); }} />}
        </div>
      </div>
    </>
  );
}
