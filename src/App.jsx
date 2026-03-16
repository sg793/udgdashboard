import React, { useEffect, useMemo, useState } from "react";

const PROJECTS_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRQkIsoeu_hacaCXYijobEMqKBIs_G_71qtJjnkyq_AGggQTs6Qqt6CnpnT51wyB9U1OL8dKIMqUB7f/pub?gid=0&single=true&output=csv";

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
  { id: 2, client: "STC", invoice: "2402", date: "2026-01-31", amount: 32000, project: "2025-003 | STC Building K Renovation" },
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
  { id: 1, jobNumber: "2025-001", jobName: "Rio Bank Elsa Expansion", client: "Rio Bank", lead: "Sergio", phase: "CA", status: "On Track", billingHealth: "healthy", contractAmount: 340000, totalBilled: 220000, totalCollected: 205000, remainingToBill: 120000, consultantBilled: 42000, consultantCollected: 38000, futureExpected: 95000, startDate: "2025-01-10", monthsActive: 15, consultants: [], notes: "Fallback sample data." },
  { id: 2, jobNumber: "2025-002", jobName: "Weslaco Fire Station", client: "City of Weslaco", lead: "Jose", phase: "CA", status: "Watch", billingHealth: "warning", contractAmount: 410000, totalBilled: 390000, totalCollected: 360000, remainingToBill: 20000, consultantBilled: 61000, consultantCollected: 54000, futureExpected: 18000, startDate: "2025-02-03", monthsActive: 14, consultants: [], notes: "Fallback sample data." }
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
  const cleaned = String(value).replace(/[$,]/g, "");
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : fallback;
}

function normalizeProject(row, index) {
  return {
    id: row.id ?? index + 1,
    jobNumber: row.jobNumber || row["job number"] || "",
    jobName: row.jobName || row["job name"] || "",
    client: row.client || "",
    lead: row.lead || "",
    phase: row.phase || "",
    status: row.status || "On Track",
    billingHealth: (row.billingHealth || row["billing health"] || "healthy").toLowerCase(),
    contractAmount: toNumber(row.contractAmount || row["contract amount"]),
    totalBilled: toNumber(row.totalBilled || row["total billed"]),
    totalCollected: toNumber(row.totalCollected || row["total collected"]),
    remainingToBill: toNumber(row.remainingToBill || row["remaining to bill"]),
    consultantBilled: toNumber(row.consultantBilled || row["consultant billed"]),
    consultantCollected: toNumber(row.consultantCollected || row["consultant collected"]),
    futureExpected: toNumber(row.futureExpected || row["future expected"]),
    startDate: row.startDate || row["start date"] || "",
    monthsActive: toNumber(row.monthsActive || row["months active"], 0),
    consultants: [],
    notes: row.notes || ""
  };
}

function currency(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}
function shortCurrency(value) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
  return currency(value);
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
  return <div style={{ marginBottom: 14 }}><div style={{ fontSize: 22, fontWeight: 700 }}>{title}</div>{subtitle ? <div style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>{subtitle}</div> : null}</div>;
}
function MetricCard({ label, value, note }) {
  return <div style={card}><div style={{ fontSize: 14, color: "#64748b" }}>{label}</div><div style={{ fontSize: 30, fontWeight: 700, marginTop: 8 }}>{value}</div>{note ? <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 8 }}>{note}</div> : null}</div>;
}
function MonthSquares({ count }) {
  return <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{Array.from({ length: count }).map((_, i) => <span key={i} style={{ width: 12, height: 12, background: "#16a34a", borderRadius: 2, display: "inline-block" }} />)}</div>;
}
function SimpleBarChart({ rows, color = "#0f172a" }) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  return <div style={{ display: "grid", gap: 12 }}>{rows.map((row) => <div key={row.label}><div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 6 }}><span style={{ color: "#475569" }}>{row.label}</span><span style={{ color: "#64748b" }}>{row.display}</span></div><div style={{ background: "#e2e8f0", height: 10, borderRadius: 999 }}><div style={{ width: `${(row.value / max) * 100}%`, background: color, height: 10, borderRadius: 999 }} /></div></div>)}</div>;
}
function DataTable({ columns, rows }) {
  return <div style={{ ...card, padding: 0, overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse" }}><thead style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}><tr>{columns.map((col) => <th key={col.key} style={{ padding: "12px 14px", textAlign: "left", fontSize: 12, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>{col.label}</th>)}</tr></thead><tbody>{rows.map((row) => <tr key={row.id} style={{ borderBottom: "1px solid #f1f5f9" }}>{columns.map((col) => <td key={col.key} style={{ padding: "12px 14px", fontSize: 14, color: "#334155" }}>{col.render ? col.render(row) : row[col.key]}</td>)}</tr>)}</tbody></table></div>;
}

export default function App() {
  const [tab, setTab] = useState("projects");
  const [leadFilter, setLeadFilter] = useState("All");
  const [phaseFilter, setPhaseFilter] = useState("All");
  const [projects, setProjects] = useState(fallbackProjectsSeed);
  const [selectedProjectId, setSelectedProjectId] = useState(fallbackProjectsSeed[0].id);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectsError, setProjectsError] = useState("");

  useEffect(() => {
    async function loadProjects() {
      try {
        setLoadingProjects(true);
        const response = await fetch(PROJECTS_CSV_URL, { cache: "no-store" });
        if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
        const text = await response.text();
        const parsed = parseCSV(text).map(normalizeProject).filter((p) => p.jobNumber || p.jobName);
        if (!parsed.length) throw new Error("No project rows found in CSV.");
        setProjects(parsed);
        setSelectedProjectId(parsed[0].id);
        setProjectsError("");
      } catch (err) {
        setProjectsError(`Live Google Sheets feed failed. Showing fallback sample data. ${err.message}`);
      } finally {
        setLoadingProjects(false);
      }
    }
    loadProjects();
  }, []);

  const leadOptions = ["All", ...Array.from(new Set(projects.map((p) => p.lead).filter(Boolean)))];
  const phaseOptions = ["All", ...Array.from(new Set(projects.map((p) => p.phase).filter(Boolean)))];
  const filteredProjects = useMemo(() => [...projects].filter((p) => (leadFilter === "All" ? true : p.lead === leadFilter)).filter((p) => (phaseFilter === "All" ? true : p.phase === phaseFilter)).sort((a, b) => String(a.jobNumber).localeCompare(String(b.jobNumber))), [projects, leadFilter, phaseFilter]);
  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0] || fallbackProjectsSeed[0];

  const workloadRows = useMemo(() => {
    const grouped = projects.reduce((acc, project) => {
      const key = project.lead || "(Unassigned)";
      if (!acc[key]) acc[key] = { id: key, lead: key, totalProjects: 0, phases: {}, contractAmount: 0, remainingToBill: 0 };
      acc[key].totalProjects += 1;
      acc[key].contractAmount += project.contractAmount;
      acc[key].remainingToBill += project.remainingToBill;
      acc[key].phases[project.phase || "Unassigned"] = (acc[key].phases[project.phase || "Unassigned"] || 0) + 1;
      return acc;
    }, {});
    return Object.values(grouped).map((row) => ({ ...row, phaseMix: Object.entries(row.phases).map(([phase, count]) => `${count} ${phase}`).join(" · ") })).sort((a, b) => b.totalProjects - a.totalProjects);
  }, [projects]);

  const totalContracts = projects.reduce((sum, p) => sum + p.contractAmount, 0);
  const totalRemaining = projects.reduce((sum, p) => sum + p.remainingToBill, 0);
  const totalCollected = projects.reduce((sum, p) => sum + p.totalCollected, 0);
  const phaseDistribution = Object.entries(projects.reduce((acc, p) => { acc[p.phase || "Unassigned"] = (acc[p.phase || "Unassigned"] || 0) + 1; return acc; }, {})).map(([label, value]) => ({ label, value, display: value }));

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

  return (
    <div style={page}>
      <div style={container}>
        <header style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.22em", color: "#64748b" }}>Sam Garcia Architect</div>
            <h1 style={{ fontSize: 40, margin: "8px 0 0 0" }}>SGA Operating Dashboard</h1>
            <div style={{ color: "#64748b", marginTop: 8, maxWidth: 860 }}>Projects, workload, proposals, and financial command in one place. Built around job numbers, billing health, and staff balance.</div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[["projects","Projects"],["workload","Workload"],["proposals","Proposals"],["financial","Financial"]].map(([key,label]) =>
              <button key={key} onClick={() => setTab(key)} style={{ borderRadius: 14, padding: "10px 16px", border: tab === key ? "1px solid #0f172a" : "1px solid #cbd5e1", background: tab === key ? "#0f172a" : "white", color: tab === key ? "white" : "#334155", cursor: "pointer", fontWeight: 600 }}>{label}</button>
            )}
          </div>
        </header>

        {(loadingProjects || projectsError) && (
          <div style={{ ...card, background: loadingProjects ? "#eff6ff" : "#fff7ed", borderColor: loadingProjects ? "#bfdbfe" : "#fdba74" }}>
            <strong>{loadingProjects ? "Loading live Google Sheets data..." : "Projects feed warning"}</strong>
            <div style={{ marginTop: 6, color: "#475569" }}>{loadingProjects ? "The dashboard is pulling the current projects tab from Google Sheets." : projectsError}</div>
          </div>
        )}

        {tab === "projects" && <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 16 }}>
            <MetricCard label="Active Projects" value={projects.length} note="Live from Google Sheets" />
            <MetricCard label="Total Contracts" value={shortCurrency(totalContracts)} note="Signed project volume" />
            <MetricCard label="Remaining to Bill" value={shortCurrency(totalRemaining)} note="Live billing runway" />
            <MetricCard label="Total Collected" value={shortCurrency(totalCollected)} note="Cash already received" />
          </div>

          <div style={{ ...card, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div><div style={{ color: "#64748b", fontSize: 14 }}>Board Filters</div><div style={{ fontWeight: 600, marginTop: 4 }}>Lean board, sorted by job number</div></div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <select value={leadFilter} onChange={(e) => setLeadFilter(e.target.value)} style={{ padding: "10px 14px", borderRadius: 12, border: "1px solid #cbd5e1" }}>{leadOptions.map((opt) => <option key={opt}>{opt}</option>)}</select>
              <select value={phaseFilter} onChange={(e) => setPhaseFilter(e.target.value)} style={{ padding: "10px 14px", borderRadius: 12, border: "1px solid #cbd5e1" }}>{phaseOptions.map((opt) => <option key={opt}>{opt}</option>)}</select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24, alignItems: "start" }}>
            <div style={card}>
              <SectionTitle title="Project Board" subtitle="Job number, job name, lead, phase, and status. Job number color shows billing health." />
              <div style={{ display: "grid", gap: 10 }}>
                {filteredProjects.map((project) => <button key={project.id} onClick={() => setSelectedProjectId(project.id)} style={{ width: "100%", textAlign: "left", borderRadius: 14, border: selectedProjectId === project.id ? "1px solid #0f172a" : "1px solid #e2e8f0", padding: "12px 14px", background: selectedProjectId === project.id ? "#f8fafc" : "white", cursor: "pointer" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1.2fr 2.5fr 1fr 1fr 1fr", gap: 12, alignItems: "center" }}>
                    <div style={{ fontWeight: 700, ...(billingColorClasses[project.billingHealth] || billingColorClasses.healthy) }}>{project.jobNumber}</div>
                    <div style={{ fontWeight: 600 }}>{project.jobName}</div>
                    <div style={{ fontSize: 14, color: "#475569" }}>{project.lead}</div>
                    <div style={{ fontSize: 14, color: "#475569" }}>{project.phase}</div>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}><span style={{ ...(statusPills[project.status] || statusPills["On Track"]), padding: "4px 8px", borderRadius: 999, fontSize: 12, fontWeight: 700 }}>{project.status}</span></div>
                  </div>
                </button>)}
              </div>
            </div>

            <div style={{ display: "grid", gap: 24 }}>
              <div style={card}>
                <SectionTitle title="Project Detail" subtitle="Deeper economics and consultant profile" />
                <div style={{ display: "grid", gap: 16 }}>
                  <div><div style={{ fontSize: 22, fontWeight: 700, ...(billingColorClasses[selectedProject.billingHealth] || billingColorClasses.healthy) }}>{selectedProject.jobNumber}</div><div style={{ fontSize: 26, fontWeight: 700, marginTop: 4 }}>{selectedProject.jobName}</div><div style={{ color: "#64748b", marginTop: 4 }}>{selectedProject.client}</div></div>
                  <div><div style={{ fontSize: 14, color: "#94a3b8", marginBottom: 8 }}>Job Age</div><MonthSquares count={selectedProject.monthsActive} /><div style={{ fontSize: 12, color: "#64748b", marginTop: 8 }}>{selectedProject.monthsActive} active months</div></div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 14 }}>
                    <div><div style={{ color: "#94a3b8" }}>Lead</div><div style={{ fontWeight: 600, marginTop: 4 }}>{selectedProject.lead}</div></div>
                    <div><div style={{ color: "#94a3b8" }}>Phase</div><div style={{ fontWeight: 600, marginTop: 4 }}>{selectedProject.phase}</div></div>
                    <div><div style={{ color: "#94a3b8" }}>Status</div><div style={{ fontWeight: 600, marginTop: 4 }}>{selectedProject.status}</div></div>
                    <div><div style={{ color: "#94a3b8" }}>Started</div><div style={{ fontWeight: 600, marginTop: 4 }}>{selectedProject.startDate}</div></div>
                  </div>
                  <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 14, padding: 14 }}>
                    <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", color: "#94a3b8" }}>Project Economics</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12, fontSize: 14 }}>
                      <div><div style={{ color: "#94a3b8" }}>Contract Amount</div><div style={{ fontWeight: 700, marginTop: 4 }}>{currency(selectedProject.contractAmount)}</div></div>
                      <div><div style={{ color: "#94a3b8" }}>Total Billed</div><div style={{ fontWeight: 700, marginTop: 4 }}>{currency(selectedProject.totalBilled)}</div></div>
                      <div><div style={{ color: "#94a3b8" }}>Total Collected</div><div style={{ fontWeight: 700, marginTop: 4 }}>{currency(selectedProject.totalCollected)}</div></div>
                      <div><div style={{ color: "#94a3b8" }}>Remaining to Bill</div><div style={{ fontWeight: 700, marginTop: 4 }}>{currency(selectedProject.remainingToBill)}</div></div>
                      <div><div style={{ color: "#94a3b8" }}>Consultants Billed</div><div style={{ fontWeight: 700, marginTop: 4 }}>{currency(selectedProject.consultantBilled)}</div></div>
                      <div><div style={{ color: "#94a3b8" }}>Consultants Collected</div><div style={{ fontWeight: 700, marginTop: 4 }}>{currency(selectedProject.consultantCollected)}</div></div>
                      <div style={{ gridColumn: "1 / span 2" }}><div style={{ color: "#94a3b8" }}>Future Expected Amounts</div><div style={{ fontWeight: 700, marginTop: 4 }}>{currency(selectedProject.futureExpected)}</div></div>
                    </div>
                  </div>
                  <div style={{ fontSize: 14, color: "#475569" }}>{selectedProject.notes}</div>
                </div>
              </div>

              <div style={card}>
                <SectionTitle title="Phase Distribution" subtitle="Current project mix" />
                <SimpleBarChart rows={phaseDistribution} color="#0f172a" />
              </div>
            </div>
          </div>
        </>}

        {tab === "workload" && <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 16 }}>
            {["Jose", "Zuri", "Sergio", "Sam"].map((name) => {
              const row = workloadRows.find((r) => r.lead === name);
              return <MetricCard key={name} label={name} value={row ? row.totalProjects : 0} note={row ? row.phaseMix : "No projects"} />;
            })}
          </div>
          <SectionTitle title="Current Workload by Person" subtitle="Who is carrying what, and in which phase" />
          <DataTable columns={[{ key: "lead", label: "Person" }, { key: "totalProjects", label: "Active Projects" }, { key: "phaseMix", label: "Phase Mix" }, { key: "contractAmount", label: "Contract Volume", render: (r) => currency(r.contractAmount) }, { key: "remainingToBill", label: "Remaining to Bill", render: (r) => currency(r.remainingToBill) }]} rows={workloadRows} />
        </>}

        {tab === "proposals" && <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 16 }}>
            <MetricCard label="Submitted" value={proposalSummary.submitted} note="Awaiting decision" />
            <MetricCard label="Shortlisted" value={proposalSummary.shortlisted} note="Still alive" />
            <MetricCard label="Won" value={proposalSummary.won} note="Successes logged" />
            <MetricCard label="Lost" value={proposalSummary.lost} note="Closed out" />
          </div>
          <SectionTitle title="RFQs + Proposals Tracker" subtitle="Track submissions and link back to the source file" />
          <DataTable columns={[{ key: "submissionType", label: "Type" }, { key: "jobName", label: "Pursuit" }, { key: "client", label: "Client" }, { key: "lead", label: "Lead" }, { key: "submissionDate", label: "Submitted" }, { key: "status", label: "Status" }, { key: "feeEstimate", label: "Fee Estimate", render: (r) => currency(r.feeEstimate) }, { key: "fileName", label: "Submission File" }]} rows={proposalsSeed} />
        </>}

        {tab === "financial" && <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 16 }}>
            <MetricCard label="Cash in Bank" value={shortCurrency(cashTotal)} note="Across tracked accounts" />
            <MetricCard label="Current AR" value={shortCurrency(currentAR)} note="Earned but uncollected" />
            <MetricCard label="Current AP" value={shortCurrency(currentAP)} note="Obligations due" />
            <MetricCard label="Net Cash View" value={shortCurrency(cashTotal + currentAR - currentAP)} note="Cash + AR - AP" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 24 }}>
            <div style={card}><SectionTitle title="Cash by Account" subtitle="Current cash buckets" /><SimpleBarChart rows={bankAccountsSeed.map((a) => ({ label: a.name, value: a.balance, display: shortCurrency(a.balance) }))} color="#0f172a" /></div>
            <div style={card}><SectionTitle title="AR Aging" subtitle="Collection pressure by bucket" /><SimpleBarChart rows={arAgingRows} color="#16a34a" /></div>
            <div style={card}><SectionTitle title="Remaining Billing by Project" subtitle="Largest live contract runway" /><SimpleBarChart rows={[...projects].sort((a, b) => b.remainingToBill - a.remainingToBill).slice(0, 5).map((p) => ({ label: p.jobNumber, value: p.remainingToBill, display: shortCurrency(p.remainingToBill) }))} color="#4f46e5" /></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div><SectionTitle title="Accounts Receivable" subtitle="Invoice dates and aging" /><DataTable columns={[{ key: "client", label: "Client" }, { key: "project", label: "Project" }, { key: "invoice", label: "Invoice" }, { key: "date", label: "Date" }, { key: "ageDays", label: "Age", render: (r) => `${r.ageDays} days` }, { key: "amount", label: "Amount", render: (r) => currency(r.amount) }]} rows={receivables} /></div>
            <div><SectionTitle title="Accounts Payable" subtitle="Vendor obligations" /><DataTable columns={[{ key: "vendor", label: "Vendor" }, { key: "relatedTo", label: "Type" }, { key: "invoice", label: "Invoice" }, { key: "date", label: "Date" }, { key: "ageDays", label: "Age", render: (r) => `${r.ageDays} days` }, { key: "amount", label: "Amount", render: (r) => currency(r.amount) }]} rows={payables} /></div>
          </div>
        </>}
      </div>
    </div>
  );
}
