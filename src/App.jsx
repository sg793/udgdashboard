
import React, { useEffect, useMemo, useState } from "react";

const PROJECTS_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRQkIsoeu_hacaCXYijobEMqKBIs_G_71qtJjnkyq_AGggQTs6Qqt6CnpnT51wyB9U1OL8dKIMqUB7f/pub?gid=0&single=true&output=csv";
const CONSULTANTS_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRQkIsoeu_hacaCXYijobEMqKBIs_G_71qtJjnkyq_AGggQTs6Qqt6CnpnT51wyB9U1OL8dKIMqUB7f/pub?gid=622686252&single=true&output=csv";
const FINANCIAL_HISTORY_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRQkIsoeu_hacaCXYijobEMqKBIs_G_71qtJjnkyq_AGggQTs6Qqt6CnpnT51wyB9U1OL8dKIMqUB7f/pub?gid=1382479765&single=true&output=csv";
const ANNUAL_TAX_SUMMARY_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRQkIsoeu_hacaCXYijobEMqKBIs_G_71qtJjnkyq_AGggQTs6Qqt6CnpnT51wyB9U1OL8dKIMqUB7f/pub?gid=2049060251&single=true&output=csv";

const proposalsSeed = [
  { id: 1, submissionType: "RFQ", jobName: "McAllen Fire Station 5", client: "City of McAllen", lead: "Sam", submissionDate: "2026-03-04", status: "Submitted", feeEstimate: 420000, fileName: "McAllen Fire Station 5 RFQ.pdf" },
  { id: 2, submissionType: "Proposal", jobName: "VLM Carwash San Antonio", client: "Granchelli Construction", lead: "Sam", submissionDate: "2026-03-11", status: "Submitted", feeEstimate: 65000, fileName: "VLM Proposal.pdf" },
  { id: 3, submissionType: "RFQ", jobName: "Regional Rehab Hospital", client: "Healthcare System", lead: "Sam", submissionDate: "2026-02-17", status: "Shortlisted", feeEstimate: 5600000, fileName: "Rehab Hospital RFQ.pdf" },
  { id: 4, submissionType: "Proposal", jobName: "Private School Campus Master Plan", client: "Private School", lead: "Sergio", submissionDate: "2026-01-29", status: "Lost", feeEstimate: 125000, fileName: "School Master Plan Proposal.pdf" }
];

const bankAccountsSeed = [
  { name: "Income", balance: 10000 },
  { name: "OPEX", balance: 740 },
  { name: "Payroll", balance: 13128 },
  { name: "Tax Withholding", balance: 188 },
  { name: "Profit First", balance: 1262 },
  { name: "Consultant Fees", balance: 4200 },
  { name: "Community Impact", balance: 900 },
  { name: "Education Expenses", balance: 350 }
];

const receivablesSeed = [
  { id: 1, client: "Rio Bank", invoice: "2401", date: "2026-02-20", amount: 18000, project: "2025-001 | Rio Bank Elsa Expansion" },
  { id: 2, client: "STC", invoice: "2402", date: "2026-01-31", amount: 32000, project: "2025-009 | STC Building K Renovations" },
  { id: 3, client: "CCA", invoice: "2403", date: "2026-03-01", amount: 15000, project: "2026-001 | CCA Vackar High School" },
  { id: 4, client: "iShine", invoice: "2404", date: "2025-12-22", amount: 22000, project: "2025-004 | iShine Corpus Christi" }
];

const payablesSeed = [
  { id: 1, vendor: "Trinity", invoice: "A112", date: "2026-02-25", amount: 2200, relatedTo: "Consultant" },
  { id: 2, vendor: "Rioplex", invoice: "R320", date: "2026-03-03", amount: 1800, relatedTo: "Intercompany" },
  { id: 3, vendor: "Click", invoice: "C091", date: "2026-02-18", amount: 340, relatedTo: "Software" },
  { id: 4, vendor: "Heffner", invoice: "H877", date: "2026-01-20", amount: 4800, relatedTo: "Consultant" },
  { id: 5, vendor: "Earth Co", invoice: "E445", date: "2026-03-05", amount: 2600, relatedTo: "Survey" }
];

const fallbackProjectsSeed = [
  { id: 1, jobNumber: "2025-001", jobName: "Rio Bank Elsa Expansion", client: "Rio Bank", projectType: "Commercial", lead: "Sergio", phase: "CA", status: "On Track", billingHealth: "healthy", contractAmount: 340000, totalBilled: 220000, totalCollected: 205000, remainingToBill: 120000, startDate: "2025-01-10", monthsActive: 15, notes: "Fallback sample data." },
  { id: 2, jobNumber: "2025-002", jobName: "Weslaco Fire Station", client: "City of Weslaco", projectType: "Civic", lead: "Jose", phase: "CA", status: "Watch", billingHealth: "warning", contractAmount: 410000, totalBilled: 390000, totalCollected: 360000, remainingToBill: 20000, startDate: "2025-02-03", monthsActive: 14, notes: "Fallback sample data." }
];

const fallbackConsultantsSeed = [
  { id: 1, jobNumber: "2025-001", discipline: "MEP", consultant: "Ethos", contractAmount: 28000, billedToDate: 12000, futureBilling: 16000, paidToDate: 10000, notes: "" },
  { id: 2, jobNumber: "2025-001", discipline: "Structural", consultant: "GRA", contractAmount: 14000, billedToDate: 9000, futureBilling: 5000, paidToDate: 8000, notes: "" }
];

const fallbackFinancialHistorySeed = [
  { id: 1, year: 2025, quarter: "Q1", grossRevenue: 325000, notes: "Fallback sample data." },
  { id: 2, year: 2025, quarter: "Q2", grossRevenue: 410000, notes: "Fallback sample data." },
  { id: 3, year: 2025, quarter: "Q3", grossRevenue: 285000, notes: "Fallback sample data." },
  { id: 4, year: 2025, quarter: "Q4", grossRevenue: 465000, notes: "Fallback sample data." }
];

const fallbackAnnualTaxSummarySeed = [
  { id: 1, year: 2023, ordinaryBusinessIncome: 118000, notes: "Fallback sample data." },
  { id: 2, year: 2024, ordinaryBusinessIncome: 146000, notes: "Fallback sample data." },
  { id: 3, year: 2025, ordinaryBusinessIncome: 172000, notes: "Fallback sample data." }
];

const billingColorClasses = {
  healthy: { color: "#16a34a" },
  warning: { color: "#d97706" },
  underwater: { color: "#dc2626" }
};

const statusPills = {
  "On Track": { background: "#ecfdf5", color: "#047857", border: "1px solid #a7f3d0" },
  "Watch": { background: "#fffbeb", color: "#b45309", border: "1px solid #fde68a" },
  "Waiting on Owner": { background: "#fff7ed", color: "#c2410c", border: "1px solid #fdba74" },
  "Program Shift": { background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe" },
  "Submittals": { background: "#f0f9ff", color: "#0369a1", border: "1px solid #bae6fd" },
  "Punchlist": { background: "#f8fafc", color: "#475569", border: "1px solid #cbd5e1" },
  "Permit Prep": { background: "#faf5ff", color: "#7e22ce", border: "1px solid #e9d5ff" }
};

const page = { background: "#f8fafc", minHeight: "100vh", color: "#0f172a", fontFamily: "Inter, Arial, sans-serif", padding: "24px" };
const container = { maxWidth: "1280px", margin: "0 auto", display: "grid", gap: "24px" };
const card = { background: "white", border: "1px solid #e2e8f0", borderRadius: "18px", padding: "18px", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" };

function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    const next = line[i + 1];
    if (ch === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result.map((v) => v.trim());
}

function parseCSV(text) {
  const lines = text.replace(/\r/g, "").split("\n").filter(Boolean);
  if (!lines.length) return [];
  const headers = parseCSVLine(lines[0]);
  return lines.slice(1).map((line, idx) => {
    const values = parseCSVLine(line);
    const row = { id: idx + 1 };
    headers.forEach((h, i) => {
      row[h] = values[i] ?? "";
    });
    return row;
  });
}

function toNumber(value, fallback = 0) {
  if (value === undefined || value === null || value === "") return fallback;
  const raw = String(value).trim();
  if (!raw) return fallback;
  const isParenNegative = /^\(.*\)$/.test(raw);
  const cleaned = raw.replace(/[\$,]/g, "").replace(/^\((.*)\)$/, "$1");
  const num = Number(cleaned);
  if (!Number.isFinite(num)) return fallback;
  return isParenNegative ? -num : num;
}

function normalizeProject(row, index) {
  return {
    id: row.id ?? index + 1,
    jobNumber: row.jobNumber || row["job number"] || "",
    jobName: row.jobName || row["job name"] || "",
    client: row.client || "",
    projectType: row.projectType || row["project type"] || "",
    lead: row.lead || "",
    phase: row.phase || "",
    status: row.status || "On Track",
    billingHealth: (row.billingHealth || row["billing health"] || "healthy").toLowerCase(),
    contractAmount: toNumber(row.contractAmount || row["contract amount"]),
    totalBilled: toNumber(row.totalBilled || row["total billed"]),
    totalCollected: toNumber(row.totalCollected || row["total collected"]),
    remainingToBill: toNumber(row.remainingToBill || row["remaining to bill"]),
    startDate: row.startDate || row["start date"] || "",
    monthsActive: toNumber(row.monthsActive || row["months active"], 0),
    notes: row.notes || ""
  };
}

function normalizeConsultant(row, index) {
  return {
    id: row.id ?? index + 1,
    jobNumber: row.jobNumber || row["job number"] || "",
    discipline: row.discipline || "",
    consultant: row.consultant || "",
    contractAmount: toNumber(row.contractAmount || row["contract amount"]),
    billedToDate: toNumber(row.billedToDate || row["billed to date"]),
    futureBilling: toNumber(row.futureBilling || row["future billing"]),
    paidToDate: toNumber(row.paidToDate || row["paid to date"]),
    notes: row.notes || ""
  };
}

function normalizeFinancialHistory(row, index) {
  return {
    id: row.id ?? index + 1,
    year: toNumber(row.year, 0),
    quarter: String(row.quarter || "").trim().toUpperCase(),
    grossRevenue: toNumber(row.grossRevenue || row["gross revenue"]),
    notes: row.notes || ""
  };
}

function normalizeAnnualTaxSummary(row, index) {
  return {
    id: row.id ?? index + 1,
    year: toNumber(row.year, 0),
    ordinaryBusinessIncome: toNumber(row.ordinaryBusinessIncome || row["ordinary business income"]),
    notes: row.notes || ""
  };
}

function currency(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value || 0);
}
function shortCurrency(value) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
  return currency(value || 0);
}
function diffDays(dateString) {
  const today = new Date("2026-03-12T00:00:00");
  const date = new Date(`${dateString}T00:00:00`);
  return Math.max(0, Math.floor((today - date) / (1000 * 60 * 60 * 24)));
}
function agingBucket(days) {
  if (days <= 30) return "0-30";
  if (days <= 60) return "31-60";
  if (days <= 90) return "61-90";
  return "90+";
}
function SectionTitle({ title, subtitle }) {
  return React.createElement("div", { style: { marginBottom: 14 } },
    React.createElement("div", { style: { fontSize: 22, fontWeight: 700 } }, title),
    subtitle ? React.createElement("div", { style: { color: "#64748b", fontSize: 14, marginTop: 4 } }, subtitle) : null
  );
}
function MetricCard({ label, value, note }) {
  return React.createElement("div", { style: card },
    React.createElement("div", { style: { fontSize: 14, color: "#64748b" } }, label),
    React.createElement("div", { style: { fontSize: 30, fontWeight: 700, marginTop: 8 } }, value),
    note ? React.createElement("div", { style: { fontSize: 13, color: "#94a3b8", marginTop: 8 } }, note) : null
  );
}
function MonthSquares({ count }) {
  return React.createElement("div", { style: { display: "flex", gap: 4, flexWrap: "wrap" } },
    Array.from({ length: count || 0 }).map((_, i) => React.createElement("span", { key: i, style: { width: 12, height: 12, background: "#16a34a", borderRadius: 2, display: "inline-block" } }))
  );
}
function SimpleBarChart({ rows, color = "#0f172a" }) {
  const numericValues = rows.map((r) => Number(r.value) || 0);
  const maxPositive = Math.max(...numericValues, 0);
  const maxNegativeMagnitude = Math.max(...numericValues.map((v) => Math.abs(Math.min(v, 0))), 0);
  const span = maxPositive + maxNegativeMagnitude || 1;

  return React.createElement("div", { style: { display: "grid", gap: 12 } },
    rows.map((row) => {
      const value = Number(row.value) || 0;
      const positiveWidth = value > 0 ? `${(value / span) * 100}%` : "0%";
      const negativeWidth = value < 0 ? `${(Math.abs(value) / span) * 100}%` : "0%";
      const baselineOffset = `${(maxNegativeMagnitude / span) * 100}%`;
      return React.createElement("div", { key: row.label },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 6 } },
          React.createElement("span", { style: { color: "#475569" } }, row.label),
          React.createElement("span", { style: { color: "#64748b" } }, row.display)
        ),
        React.createElement("div", { style: { position: "relative", background: "#e2e8f0", height: 10, borderRadius: 999, overflow: "hidden" } },
          (maxNegativeMagnitude > 0 && maxPositive > 0) ? React.createElement("div", { style: { position: "absolute", left: baselineOffset, top: 0, bottom: 0, width: 1, background: "#94a3b8", zIndex: 2 } }) : null,
          value < 0 ? React.createElement("div", { style: { position: "absolute", left: `calc(${baselineOffset} - ${negativeWidth})`, top: 0, height: 10, width: negativeWidth, background: "#dc2626", borderRadius: 999 } }) : null,
          value >= 0 ? React.createElement("div", { style: { position: "absolute", left: baselineOffset, top: 0, height: 10, width: positiveWidth, background: color, borderRadius: 999 } }) : null
        )
      );
    })
  );
}
function DataTable({ columns, rows }) {
  return React.createElement("div", { style: { ...card, padding: 0, overflowX: "auto" } },
    React.createElement("table", { style: { width: "100%", borderCollapse: "collapse" } },
      React.createElement("thead", { style: { background: "#f8fafc", borderBottom: "1px solid #e2e8f0" } },
        React.createElement("tr", null,
          columns.map((col) => React.createElement("th", { key: col.key, style: { padding: "12px 14px", textAlign: "left", fontSize: 12, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" } }, col.label))
        )
      ),
      React.createElement("tbody", null,
        rows.map((row) => React.createElement("tr", { key: row.id, style: { borderBottom: "1px solid #f1f5f9" } },
          columns.map((col) => React.createElement("td", { key: col.key, style: { padding: "12px 14px", fontSize: 14, color: "#334155", verticalAlign: "top" } }, col.render ? col.render(row) : row[col.key]))
        ))
      )
    )
  );
}

export default function App() {
  const [tab, setTab] = useState("projects");
  const [leadFilter, setLeadFilter] = useState("All");
  const [phaseFilter, setPhaseFilter] = useState("All");
  const [projects, setProjects] = useState(fallbackProjectsSeed);
  const [consultants, setConsultants] = useState(fallbackConsultantsSeed);
  const [financialHistory, setFinancialHistory] = useState(fallbackFinancialHistorySeed);
  const [annualTaxSummary, setAnnualTaxSummary] = useState(fallbackAnnualTaxSummarySeed);
  const [selectedProjectId, setSelectedProjectId] = useState(fallbackProjectsSeed[0].id);
  const [loading, setLoading] = useState(true);
  const [feedWarning, setFeedWarning] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [projectsResponse, consultantsResponse, financialHistoryResponse, annualTaxSummaryResponse] = await Promise.all([
          fetch(PROJECTS_CSV_URL, { cache: "no-store" }),
          fetch(CONSULTANTS_CSV_URL, { cache: "no-store" }),
          fetch(FINANCIAL_HISTORY_CSV_URL, { cache: "no-store" }),
          fetch(ANNUAL_TAX_SUMMARY_CSV_URL, { cache: "no-store" })
        ]);
        if (!projectsResponse.ok) throw new Error(`Projects feed failed: ${projectsResponse.status}`);
        if (!consultantsResponse.ok) throw new Error(`Consultants feed failed: ${consultantsResponse.status}`);
        if (!financialHistoryResponse.ok) throw new Error(`Financial history feed failed: ${financialHistoryResponse.status}`);
        if (!annualTaxSummaryResponse.ok) throw new Error(`Annual tax summary feed failed: ${annualTaxSummaryResponse.status}`);
        const [projectsText, consultantsText, financialHistoryText, annualTaxSummaryText] = await Promise.all([projectsResponse.text(), consultantsResponse.text(), financialHistoryResponse.text(), annualTaxSummaryResponse.text()]);
        const parsedProjects = parseCSV(projectsText).map(normalizeProject).filter((p) => p.jobNumber || p.jobName);
        const parsedConsultants = parseCSV(consultantsText).map(normalizeConsultant).filter((c) => c.jobNumber || c.consultant);
        const parsedFinancialHistory = parseCSV(financialHistoryText).map(normalizeFinancialHistory).filter((r) => r.year && r.quarter && Number.isFinite(r.grossRevenue));
        const parsedAnnualTaxSummary = parseCSV(annualTaxSummaryText).map(normalizeAnnualTaxSummary).filter((r) => r.year);
        if (!parsedProjects.length) throw new Error("No project rows found.");
        setProjects(parsedProjects);
        setConsultants(parsedConsultants);
        if (parsedFinancialHistory.length) setFinancialHistory(parsedFinancialHistory);
        if (parsedAnnualTaxSummary.length) setAnnualTaxSummary(parsedAnnualTaxSummary);
        setSelectedProjectId(parsedProjects[0].id);
        setFeedWarning("");
      } catch (err) {
        setFeedWarning(`Live feed warning: ${err.message}. Showing fallback data where needed.`);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const consultantsByJob = useMemo(() => {
    const grouped = {};
    consultants.forEach((c) => {
      if (!grouped[c.jobNumber]) grouped[c.jobNumber] = [];
      grouped[c.jobNumber].push(c);
    });
    return grouped;
  }, [consultants]);

  const projectsWithConsultantTotals = useMemo(() => {
    return projects.map((project) => {
      const jobConsultants = consultantsByJob[project.jobNumber] || [];
      const consultantContractTotal = jobConsultants.reduce((sum, c) => sum + c.contractAmount, 0);
      const consultantBilledTotal = jobConsultants.reduce((sum, c) => sum + c.billedToDate, 0);
      const consultantFutureTotal = jobConsultants.reduce((sum, c) => sum + c.futureBilling, 0);
      const consultantPaidTotal = jobConsultants.reduce((sum, c) => sum + c.paidToDate, 0);
      const consultantOutstanding = consultantBilledTotal - consultantPaidTotal;
      const architectNetFee = project.contractAmount - consultantContractTotal;
      return { ...project, jobConsultants, consultantContractTotal, consultantBilledTotal, consultantFutureTotal, consultantPaidTotal, consultantOutstanding, architectNetFee };
    });
  }, [projects, consultantsByJob]);

  const leadOptions = ["All", ...Array.from(new Set(projectsWithConsultantTotals.map((p) => p.lead).filter(Boolean)))];
  const phaseOptions = ["All", ...Array.from(new Set(projectsWithConsultantTotals.map((p) => p.phase).filter(Boolean)))];

  const filteredProjects = useMemo(() => [...projectsWithConsultantTotals].filter((p) => (leadFilter === "All" ? true : p.lead === leadFilter)).filter((p) => (phaseFilter === "All" ? true : p.phase === phaseFilter)).sort((a, b) => String(a.jobNumber).localeCompare(String(b.jobNumber))), [projectsWithConsultantTotals, leadFilter, phaseFilter]);
  const selectedProject = projectsWithConsultantTotals.find((p) => p.id === selectedProjectId) || projectsWithConsultantTotals[0] || fallbackProjectsSeed[0];

  const workloadRows = useMemo(() => {
    const grouped = projectsWithConsultantTotals.reduce((acc, project) => {
      const key = project.lead || "(Unassigned)";
      if (!acc[key]) acc[key] = { id: key, lead: key, totalProjects: 0, phases: {}, contractAmount: 0, remainingToBill: 0 };
      acc[key].totalProjects += 1;
      acc[key].contractAmount += project.contractAmount;
      acc[key].remainingToBill += project.remainingToBill;
      acc[key].phases[project.phase || "Unassigned"] = (acc[key].phases[project.phase || "Unassigned"] || 0) + 1;
      return acc;
    }, {});
    return Object.values(grouped).map((row) => ({ ...row, phaseMix: Object.entries(row.phases).map(([phase, count]) => `${count} ${phase}`).join(" · ") })).sort((a, b) => b.totalProjects - a.totalProjects);
  }, [projectsWithConsultantTotals]);

  const totalContracts = projectsWithConsultantTotals.reduce((sum, p) => sum + p.contractAmount, 0);
  const totalRemaining = projectsWithConsultantTotals.reduce((sum, p) => sum + p.remainingToBill, 0);
  const totalCollected = projectsWithConsultantTotals.reduce((sum, p) => sum + p.totalCollected, 0);
  const totalConsultantExposure = projectsWithConsultantTotals.reduce((sum, p) => sum + p.consultantOutstanding, 0);

  const phaseOrder = ["SD", "DD", "CD", "BN", "CA"];

  const phaseCounts = projectsWithConsultantTotals.reduce((acc, p) => {
    const phase = (p.phase || "").trim() || "Unassigned";
    acc[phase] = (acc[phase] || 0) + 1;
    return acc;
  }, {});

  const orderedPhaseRows = phaseOrder
    .filter((phase) => phaseCounts[phase])
    .map((phase) => ({ label: phase, value: phaseCounts[phase], display: phaseCounts[phase] }));

  const unorderedExtraRows = Object.entries(phaseCounts)
    .filter(([phase]) => !phaseOrder.includes(phase))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([label, value]) => ({ label, value, display: value }));

  const phaseDistribution = [...orderedPhaseRows, ...unorderedExtraRows];
  const consultantExposureRows = useMemo(() => {
    const grouped = consultants.reduce((acc, c) => {
      const key = c.consultant || "(Unnamed)";
      if (!acc[key]) acc[key] = 0;
      acc[key] += (c.billedToDate - c.paidToDate);
      return acc;
    }, {});
    return Object.entries(grouped).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([label, value]) => ({ label, value, display: shortCurrency(value) }));
  }, [consultants]);

  const quarterOrder = { Q1: 1, Q2: 2, Q3: 3, Q4: 4 };

  const orderedFinancialHistory = useMemo(() => [...financialHistory]
    .filter((row) => row.year && row.quarter && row.grossRevenue !== undefined)
    .sort((a, b) => (a.year - b.year) || ((quarterOrder[a.quarter] || 99) - (quarterOrder[b.quarter] || 99))), [financialHistory]);

  const financialHistoryChartRows = orderedFinancialHistory.map((row) => ({
    label: `${row.year}-${row.quarter}`,
    value: row.grossRevenue,
    display: shortCurrency(row.grossRevenue)
  }));

  const annualGrossRows = useMemo(() => {
    const grouped = orderedFinancialHistory.reduce((acc, row) => {
      if (!acc[row.year]) acc[row.year] = 0;
      acc[row.year] += row.grossRevenue;
      return acc;
    }, {});
    return Object.entries(grouped)
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .map(([year, value]) => ({ label: String(year), value, display: shortCurrency(value) }));
  }, [orderedFinancialHistory]);

  const annualTaxRows = useMemo(() => [...annualTaxSummary]
    .filter((row) => row.year)
    .sort((a, b) => a.year - b.year)
    .map((row) => ({ label: String(row.year), value: row.ordinaryBusinessIncome, display: shortCurrency(row.ordinaryBusinessIncome) })), [annualTaxSummary]);

  const trailingFourQuarterGross = orderedFinancialHistory.slice(-4).reduce((sum, row) => sum + row.grossRevenue, 0);
  const bestQuarter = financialHistoryChartRows.reduce((best, row) => (!best || row.value > best.value ? row : best), null);
  const bestYear = annualGrossRows.reduce((best, row) => (!best || row.value > best.value ? row : best), null);
  const bestOrdinaryIncomeYear = annualTaxRows.reduce((best, row) => (!best || row.value > best.value ? row : best), null);

  const receivables = receivablesSeed.map((r) => { const ageDays = diffDays(r.date); return { ...r, ageDays, bucket: agingBucket(ageDays) }; });
  const payables = payablesSeed.map((p) => { const ageDays = diffDays(p.date); return { ...p, ageDays, bucket: agingBucket(ageDays) }; });
  const cashTotal = bankAccountsSeed.reduce((sum, a) => sum + a.balance, 0);
  const currentAR = receivables.reduce((sum, r) => sum + r.amount, 0);
  const currentAP = payables.reduce((sum, p) => sum + p.amount, 0);
  const arAgingRows = ["0-30", "31-60", "61-90", "90+"].map((bucket) => {
    const value = receivables.filter((r) => r.bucket === bucket).reduce((sum, r) => sum + r.amount, 0);
    return { label: bucket, value, display: shortCurrency(value) };
  });
  const proposalSummary = { submitted: proposalsSeed.filter((p) => p.status === "Submitted").length, shortlisted: proposalsSeed.filter((p) => p.status === "Shortlisted").length, won: proposalsSeed.filter((p) => p.status === "Won").length, lost: proposalsSeed.filter((p) => p.status === "Lost").length };

  return React.createElement("div", { style: page },
    React.createElement("div", { style: container },
      React.createElement("header", { style: { display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-end", flexWrap: "wrap" } },
        React.createElement("div", null,
          React.createElement("div", { style: { fontSize: 12, textTransform: "uppercase", letterSpacing: "0.22em", color: "#64748b" } }, "Sam Garcia Architect"),
          React.createElement("h1", { style: { fontSize: 40, margin: "8px 0 0 0" } }, "SGA Operating Dashboard"),
          React.createElement("div", { style: { color: "#64748b", marginTop: 8, maxWidth: 860 } }, "Projects, workload, proposals, and financial command in one place. Project and consultant data are now tied live through job number.")
        ),
        React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" } },
          [["projects","Projects"],["workload","Workload"],["proposals","Proposals"],["financial","Financial"]].map(([key,label]) =>
            React.createElement("button", { key, onClick: () => setTab(key), style: { borderRadius: 14, padding: "10px 16px", border: tab === key ? "1px solid #0f172a" : "1px solid #cbd5e1", background: tab === key ? "#0f172a" : "white", color: tab === key ? "white" : "#334155", cursor: "pointer", fontWeight: 600 } }, label)
          )
        )
      ),

      (loading || feedWarning) ? React.createElement("div", { style: { ...card, background: loading ? "#eff6ff" : "#fff7ed", borderColor: loading ? "#bfdbfe" : "#fdba74" } },
        React.createElement("strong", null, loading ? "Loading live Google Sheets data..." : "Live feed warning"),
        React.createElement("div", { style: { marginTop: 6, color: "#475569" } }, loading ? "The dashboard is pulling projects, consultants, financial history, and annual tax summary from Google Sheets." : feedWarning)
      ) : null,

      tab === "projects" ? React.createElement(React.Fragment, null,
        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: 16 } },
          React.createElement(MetricCard, { label: "Active Projects", value: projectsWithConsultantTotals.length, note: "Live from Google Sheets" }),
          React.createElement(MetricCard, { label: "Total Contracts", value: shortCurrency(totalContracts), note: "Signed project volume" }),
          React.createElement(MetricCard, { label: "Remaining to Bill", value: shortCurrency(totalRemaining), note: "Live billing runway" }),
          React.createElement(MetricCard, { label: "Total Collected", value: shortCurrency(totalCollected), note: "Cash already received" }),
          React.createElement(MetricCard, { label: "Consultant Exposure", value: shortCurrency(totalConsultantExposure), note: "Billed minus paid" })
        ),
        React.createElement("div", { style: { ...card, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" } },
          React.createElement("div", null,
            React.createElement("div", { style: { color: "#64748b", fontSize: 14 } }, "Board Filters"),
            React.createElement("div", { style: { fontWeight: 600, marginTop: 4 } }, "Lean board, sorted by job number")
          ),
          React.createElement("div", { style: { display: "flex", gap: 12, flexWrap: "wrap" } },
            React.createElement("select", { value: leadFilter, onChange: (e) => setLeadFilter(e.target.value), style: { padding: "10px 14px", borderRadius: 12, border: "1px solid #cbd5e1" } }, leadOptions.map((opt) => React.createElement("option", { key: opt }, opt))),
            React.createElement("select", { value: phaseFilter, onChange: (e) => setPhaseFilter(e.target.value), style: { padding: "10px 14px", borderRadius: 12, border: "1px solid #cbd5e1" } }, phaseOptions.map((opt) => React.createElement("option", { key: opt }, opt)))
          )
        ),
        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24, alignItems: "start" } },
          React.createElement("div", { style: card },
            React.createElement(SectionTitle, { title: "Project Board", subtitle: "Job number, job name, lead, phase, and status. Job number color shows billing health." }),
            React.createElement("div", { style: { display: "grid", gap: 10 } },
              filteredProjects.map((project) => React.createElement("button", { key: project.id, onClick: () => setSelectedProjectId(project.id), style: { width: "100%", textAlign: "left", borderRadius: 14, border: selectedProjectId === project.id ? "1px solid #0f172a" : "1px solid #e2e8f0", padding: "12px 14px", background: selectedProjectId === project.id ? "#f8fafc" : "white", cursor: "pointer" } },
                React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1.2fr 2.5fr 1fr 1fr 1fr", gap: 12, alignItems: "center" } },
                  React.createElement("div", { style: { fontWeight: 700, ...(billingColorClasses[project.billingHealth] || billingColorClasses.healthy) } }, project.jobNumber),
                  React.createElement("div", { style: { fontWeight: 600 } }, project.jobName),
                  React.createElement("div", { style: { fontSize: 14, color: "#475569" } }, project.lead),
                  React.createElement("div", { style: { fontSize: 14, color: "#475569" } }, project.phase),
                  React.createElement("div", { style: { display: "flex", justifyContent: "flex-end" } }, React.createElement("span", { style: { ...(statusPills[project.status] || statusPills["On Track"]), padding: "4px 8px", borderRadius: 999, fontSize: 12, fontWeight: 700 } }, project.status))
                )
              ))
            )
          ),
          React.createElement("div", { style: { display: "grid", gap: 24 } },
            React.createElement("div", { style: card },
              React.createElement(SectionTitle, { title: "Project Detail", subtitle: "Live project economics plus consultant exposure" }),
              selectedProject ? React.createElement("div", { style: { display: "grid", gap: 16 } },
                React.createElement("div", null,
                  React.createElement("div", { style: { fontSize: 22, fontWeight: 700, ...(billingColorClasses[selectedProject.billingHealth] || billingColorClasses.healthy) } }, selectedProject.jobNumber),
                  React.createElement("div", { style: { fontSize: 26, fontWeight: 700, marginTop: 4 } }, selectedProject.jobName),
                  React.createElement("div", { style: { color: "#64748b", marginTop: 4 } }, selectedProject.client)
                ),
                React.createElement("div", null,
                  React.createElement("div", { style: { fontSize: 14, color: "#94a3b8", marginBottom: 8 } }, "Job Age"),
                  React.createElement(MonthSquares, { count: selectedProject.monthsActive }),
                  React.createElement("div", { style: { fontSize: 12, color: "#64748b", marginTop: 8 } }, `${selectedProject.monthsActive} active months`)
                ),
                React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 14 } },
                  React.createElement("div", null, React.createElement("div", { style: { color: "#94a3b8" } }, "Lead"), React.createElement("div", { style: { fontWeight: 600, marginTop: 4 } }, selectedProject.lead)),
                  React.createElement("div", null, React.createElement("div", { style: { color: "#94a3b8" } }, "Project Type"), React.createElement("div", { style: { fontWeight: 600, marginTop: 4 } }, selectedProject.projectType)),
                  React.createElement("div", null, React.createElement("div", { style: { color: "#94a3b8" } }, "Phase"), React.createElement("div", { style: { fontWeight: 600, marginTop: 4 } }, selectedProject.phase)),
                  React.createElement("div", null, React.createElement("div", { style: { color: "#94a3b8" } }, "Status"), React.createElement("div", { style: { fontWeight: 600, marginTop: 4 } }, selectedProject.status))
                ),
                React.createElement("div", { style: { background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 14, padding: 14 } },
                  React.createElement("div", { style: { fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", color: "#94a3b8" } }, "Project Economics"),
                  React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12, fontSize: 14 } },
                    React.createElement("div", null, React.createElement("div", { style: { color: "#94a3b8" } }, "Contract Amount"), React.createElement("div", { style: { fontWeight: 700, marginTop: 4 } }, currency(selectedProject.contractAmount))),
                    React.createElement("div", null, React.createElement("div", { style: { color: "#94a3b8" } }, "Architect Net Fee"), React.createElement("div", { style: { fontWeight: 700, marginTop: 4 } }, currency(selectedProject.architectNetFee))),
                    React.createElement("div", null, React.createElement("div", { style: { color: "#94a3b8" } }, "Total Billed"), React.createElement("div", { style: { fontWeight: 700, marginTop: 4 } }, currency(selectedProject.totalBilled))),
                    React.createElement("div", null, React.createElement("div", { style: { color: "#94a3b8" } }, "Total Collected"), React.createElement("div", { style: { fontWeight: 700, marginTop: 4 } }, currency(selectedProject.totalCollected))),
                    React.createElement("div", null, React.createElement("div", { style: { color: "#94a3b8" } }, "Remaining to Bill"), React.createElement("div", { style: { fontWeight: 700, marginTop: 4 } }, currency(selectedProject.remainingToBill))),
                    React.createElement("div", null, React.createElement("div", { style: { color: "#94a3b8" } }, "Notes"), React.createElement("div", { style: { fontWeight: 500, marginTop: 4 } }, selectedProject.notes || "-"))
                  )
                ),
                React.createElement("div", { style: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 14 } },
                  React.createElement("div", { style: { fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", color: "#94a3b8" } }, "Consultant Summary"),
                  React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12, fontSize: 14 } },
                    React.createElement("div", null, React.createElement("div", { style: { color: "#94a3b8" } }, "Consultant Contracts"), React.createElement("div", { style: { fontWeight: 700, marginTop: 4 } }, currency(selectedProject.consultantContractTotal))),
                    React.createElement("div", null, React.createElement("div", { style: { color: "#94a3b8" } }, "Consultants Billed"), React.createElement("div", { style: { fontWeight: 700, marginTop: 4 } }, currency(selectedProject.consultantBilledTotal))),
                    React.createElement("div", null, React.createElement("div", { style: { color: "#94a3b8" } }, "Consultants Paid"), React.createElement("div", { style: { fontWeight: 700, marginTop: 4 } }, currency(selectedProject.consultantPaidTotal))),
                    React.createElement("div", null, React.createElement("div", { style: { color: "#94a3b8" } }, "Consultant Outstanding"), React.createElement("div", { style: { fontWeight: 700, marginTop: 4 } }, currency(selectedProject.consultantOutstanding))),
                    React.createElement("div", { style: { gridColumn: "1 / span 2" } }, React.createElement("div", { style: { color: "#94a3b8" } }, "Future Consultant Billing"), React.createElement("div", { style: { fontWeight: 700, marginTop: 4 } }, currency(selectedProject.consultantFutureTotal)))
                  )
                ),
                React.createElement("div", null,
                  React.createElement("div", { style: { fontSize: 14, color: "#94a3b8", marginBottom: 8 } }, "Consultants on This Project"),
                  React.createElement("div", { style: { display: "grid", gap: 8 } },
                    selectedProject.jobConsultants.length ? selectedProject.jobConsultants.map((consultant) =>
                      React.createElement("div", { key: consultant.id, style: { border: "1px solid #e2e8f0", borderRadius: 12, padding: 10, fontSize: 14 } },
                        React.createElement("div", { style: { fontWeight: 600 } }, `${consultant.discipline} · ${consultant.consultant}`),
                        React.createElement("div", { style: { color: "#64748b", marginTop: 4 } }, `Contract ${currency(consultant.contractAmount)} · Billed ${currency(consultant.billedToDate)} · Future ${currency(consultant.futureBilling)} · Paid ${currency(consultant.paidToDate)}`)
                      )
                    ) : React.createElement("div", { style: { color: "#64748b", fontSize: 14 } }, "No consultants listed for this project.")
                  )
                )
              ) : null
            ),
            React.createElement("div", { style: card },
              React.createElement(SectionTitle, { title: "Phase Distribution", subtitle: "Current project mix" }),
              React.createElement(SimpleBarChart, { rows: phaseDistribution, color: "#0f172a" })
            )
          )
        )
      ) : null,

      tab === "workload" ? React.createElement(React.Fragment, null,
        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 16 } },
          ["Jose", "Zuri", "Sergio", "Sam"].map((name) => {
            const row = workloadRows.find((r) => r.lead === name);
            return React.createElement(MetricCard, { key: name, label: name, value: row ? row.totalProjects : 0, note: row ? row.phaseMix : "No projects" });
          })
        ),
        React.createElement(SectionTitle, { title: "Current Workload by Person", subtitle: "Who is carrying what, and in which phase" }),
        React.createElement(DataTable, { columns: [{ key: "lead", label: "Person" }, { key: "totalProjects", label: "Active Projects" }, { key: "phaseMix", label: "Phase Mix" }, { key: "contractAmount", label: "Contract Volume", render: (r) => currency(r.contractAmount) }, { key: "remainingToBill", label: "Remaining to Bill", render: (r) => currency(r.remainingToBill) }], rows: workloadRows })
      ) : null,

      tab === "proposals" ? React.createElement(React.Fragment, null,
        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 16 } },
          React.createElement(MetricCard, { label: "Submitted", value: proposalSummary.submitted, note: "Awaiting decision" }),
          React.createElement(MetricCard, { label: "Shortlisted", value: proposalSummary.shortlisted, note: "Still alive" }),
          React.createElement(MetricCard, { label: "Won", value: proposalSummary.won, note: "Successes logged" }),
          React.createElement(MetricCard, { label: "Lost", value: proposalSummary.lost, note: "Closed out" })
        ),
        React.createElement(SectionTitle, { title: "RFQs + Proposals Tracker", subtitle: "Track submissions and link back to the source file" }),
        React.createElement(DataTable, { columns: [{ key: "submissionType", label: "Type" }, { key: "jobName", label: "Pursuit" }, { key: "client", label: "Client" }, { key: "lead", label: "Lead" }, { key: "submissionDate", label: "Submitted" }, { key: "status", label: "Status" }, { key: "feeEstimate", label: "Fee Estimate", render: (r) => currency(r.feeEstimate) }, { key: "fileName", label: "Submission File" }], rows: proposalsSeed })
      ) : null,

      tab === "financial" ? React.createElement(React.Fragment, null,
        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" } },
          React.createElement("div", { style: { display: "grid", gap: 16 } },
            React.createElement("div", null,
              React.createElement(SectionTitle, { title: "Accounts Receivable", subtitle: "Invoice dates and aging" }),
              React.createElement(DataTable, { columns: [{ key: "client", label: "Client" }, { key: "project", label: "Project" }, { key: "invoice", label: "Invoice" }, { key: "date", label: "Date" }, { key: "ageDays", label: "Age", render: (r) => `${r.ageDays} days` }, { key: "amount", label: "Amount", render: (r) => currency(r.amount) }], rows: receivables })
            ),
            React.createElement("div", { style: card }, React.createElement(SectionTitle, { title: "AR Aging", subtitle: "Collection pressure by bucket" }), React.createElement(SimpleBarChart, { rows: arAgingRows, color: "#16a34a" }))
          ),
          React.createElement("div", { style: { display: "grid", gap: 16 } },
            React.createElement("div", null,
              React.createElement(SectionTitle, { title: "Accounts Payable", subtitle: "Vendor obligations" }),
              React.createElement(DataTable, { columns: [{ key: "vendor", label: "Vendor" }, { key: "relatedTo", label: "Type" }, { key: "invoice", label: "Invoice" }, { key: "date", label: "Date" }, { key: "ageDays", label: "Age", render: (r) => `${r.ageDays} days` }, { key: "amount", label: "Amount", render: (r) => currency(r.amount) }], rows: payables })
            ),
            React.createElement("div", { style: card }, React.createElement(SectionTitle, { title: "AP Aging", subtitle: "Vendor obligations by bucket" }), React.createElement(SimpleBarChart, { rows: apAgingRows, color: "#dc2626" }))
          )
        ),
        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: 16 } },
          React.createElement(MetricCard, { label: "Cash in Bank", value: shortCurrency(cashTotal), note: "Across tracked accounts" }),
          React.createElement(MetricCard, { label: "Current AR", value: shortCurrency(currentAR), note: "Earned but uncollected" }),
          React.createElement(MetricCard, { label: "Trailing 4Q Gross", value: shortCurrency(trailingFourQuarterGross), note: "From financialHistory" }),
          React.createElement(MetricCard, { label: "Best Quarter", value: bestQuarter ? bestQuarter.display : "$0", note: bestQuarter ? bestQuarter.label : "No data" }),
          React.createElement(MetricCard, { label: "Best OBI Year", value: bestOrdinaryIncomeYear ? bestOrdinaryIncomeYear.display : "$0", note: bestOrdinaryIncomeYear ? bestOrdinaryIncomeYear.label : "No data" })
        ),
        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 24 } },
          React.createElement("div", { style: card }, React.createElement(SectionTitle, { title: "Cash by Account", subtitle: "Current cash buckets" }), React.createElement(SimpleBarChart, { rows: bankAccountsSeed.map((a) => ({ label: a.name, value: a.balance, display: shortCurrency(a.balance) })), color: "#0f172a" })),
          React.createElement("div", { style: card }, React.createElement(SectionTitle, { title: "Remaining Billing by Project", subtitle: "Largest live contract runway" }), React.createElement(SimpleBarChart, { rows: [...projectsWithConsultantTotals].sort((a, b) => b.remainingToBill - a.remainingToBill).slice(0, 5).map((p) => ({ label: p.jobNumber, value: p.remainingToBill, display: shortCurrency(p.remainingToBill) })), color: "#4f46e5" })),
          React.createElement("div", { style: card }, React.createElement(SectionTitle, { title: "Consultant Exposure by Firm", subtitle: "Billed minus paid" }), React.createElement(SimpleBarChart, { rows: consultantExposureRows.length ? consultantExposureRows : [{ label: "None", value: 0, display: "$0" }], color: "#dc2626" }))
        ),
        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" } },
          React.createElement("div", { style: card }, React.createElement(SectionTitle, { title: "Annual Gross Revenue", subtitle: "Summed from quarterly history" }), React.createElement(SimpleBarChart, { rows: annualGrossRows.length ? annualGrossRows : [{ label: "No data", value: 0, display: "$0" }], color: "#4f46e5" })),
          React.createElement("div", { style: card }, React.createElement(SectionTitle, { title: "Annual Ordinary Business Income", subtitle: "From annualTaxSummary tab" }), React.createElement(SimpleBarChart, { rows: annualTaxRows.length ? annualTaxRows : [{ label: "No data", value: 0, display: "$0" }], color: "#16a34a" }))
        ),
        React.createElement("div", { style: card },
          React.createElement(SectionTitle, { title: "Financial History Notes", subtitle: "Owner-level context" }),
          React.createElement("div", { style: { display: "grid", gap: 12, fontSize: 14, color: "#334155" } },
            React.createElement("div", null, React.createElement("strong", null, "Highest Grossing Year: "), bestYear ? `${bestYear.label} · ${bestYear.display}` : "No data"),
            React.createElement("div", null, React.createElement("strong", null, "Highest Quarter: "), bestQuarter ? `${bestQuarter.label} · ${bestQuarter.display}` : "No data"),
            React.createElement("div", null, React.createElement("strong", null, "Tax Metric: "), "Ordinary Business Income reflects filed S-corporation returns and may differ from internal management reporting."),
            React.createElement("div", null, React.createElement("strong", null, "Data Structure: "), "Quarterly gross revenue comes from financialHistory. Annual OBI comes from annualTaxSummary.")
          )
        ),
        React.createElement("div", { style: card }, React.createElement(SectionTitle, { title: "Quarterly Gross Revenue", subtitle: "Live from financialHistory tab" }), React.createElement(SimpleBarChart, { rows: financialHistoryChartRows.length ? financialHistoryChartRows : [{ label: "No data", value: 0, display: "$0" }], color: "#0f172a" }))
      ) : null
    )
  );
}
