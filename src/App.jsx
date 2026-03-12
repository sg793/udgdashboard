import React, { useMemo, useState } from "react";

const projectsSeed = [
  { id: 1, jobNumber: "2025-001", jobName: "Rio Bank Elsa Expansion", client: "Rio Bank", lead: "Sergio", phase: "CA", status: "On Track", billingHealth: "healthy", contractAmount: 340000, totalBilled: 220000, totalCollected: 205000, remainingToBill: 120000, consultantBilled: 42000, consultantCollected: 38000, futureExpected: 95000, startDate: "2025-01-10", monthsActive: 15, consultants: [{ name: "MEP Consultant", billed: 28000, collected: 25000 }, { name: "Structural Consultant", billed: 14000, collected: 13000 }], notes: "Healthy CA project with billing runway still available." },
  { id: 2, jobNumber: "2025-002", jobName: "Weslaco Fire Station", client: "City of Weslaco", lead: "Jose", phase: "CA", status: "Watch", billingHealth: "warning", contractAmount: 410000, totalBilled: 390000, totalCollected: 360000, remainingToBill: 20000, consultantBilled: 61000, consultantCollected: 54000, futureExpected: 18000, startDate: "2025-02-03", monthsActive: 14, consultants: [{ name: "Civil Consultant", billed: 36000, collected: 30000 }, { name: "MEP Consultant", billed: 25000, collected: 24000 }], notes: "Close to fully billed. Should be watched carefully." },
  { id: 3, jobNumber: "2025-003", jobName: "STC Building K Renovation", client: "STC", lead: "Jose", phase: "CA", status: "Waiting on Owner", billingHealth: "underwater", contractAmount: 180000, totalBilled: 180000, totalCollected: 135000, remainingToBill: 0, consultantBilled: 22000, consultantCollected: 17000, futureExpected: 0, startDate: "2025-08-20", monthsActive: 7, consultants: [{ name: "MEP Consultant", billed: 22000, collected: 17000 }], notes: "Billing exhausted while project remains active." },
  { id: 4, jobNumber: "2025-004", jobName: "iShine Corpus Christi", client: "iShine", lead: "Zuri", phase: "CD", status: "On Track", billingHealth: "healthy", contractAmount: 150000, totalBilled: 90000, totalCollected: 90000, remainingToBill: 60000, consultantBilled: 18000, consultantCollected: 18000, futureExpected: 45000, startDate: "2025-11-14", monthsActive: 4, consultants: [{ name: "Civil Consultant", billed: 18000, collected: 18000 }], notes: "Strong production-phase job with good remaining billing." },
  { id: 5, jobNumber: "2025-005", jobName: "McAllen Tenant Finish", client: "Private Client", lead: "Zuri", phase: "CD", status: "On Track", billingHealth: "healthy", contractAmount: 62000, totalBilled: 28000, totalCollected: 24000, remainingToBill: 34000, consultantBilled: 6000, consultantCollected: 6000, futureExpected: 26000, startDate: "2026-01-08", monthsActive: 3, consultants: [{ name: "MEP Consultant", billed: 6000, collected: 6000 }], notes: "Quick-cash production work." },
  { id: 6, jobNumber: "2025-006", jobName: "Covenant High School", client: "CCA", lead: "Sergio", phase: "SD", status: "Program Shift", billingHealth: "healthy", contractAmount: 520000, totalBilled: 30000, totalCollected: 30000, remainingToBill: 490000, consultantBilled: 0, consultantCollected: 0, futureExpected: 150000, startDate: "2026-02-02", monthsActive: 2, consultants: [], notes: "Large front-end job with strong runway." },
  { id: 7, jobNumber: "2025-007", jobName: "Medical Office Renovation", client: "KMDG", lead: "Jose", phase: "CA", status: "On Track", billingHealth: "warning", contractAmount: 98000, totalBilled: 82000, totalCollected: 76000, remainingToBill: 16000, consultantBilled: 10000, consultantCollected: 9000, futureExpected: 12000, startDate: "2025-07-01", monthsActive: 8, consultants: [{ name: "MEP Consultant", billed: 10000, collected: 9000 }], notes: "Near break-even. Monitor scope creep." },
  { id: 8, jobNumber: "2025-008", jobName: "Bank Interior Refresh", client: "Regional Bank", lead: "Jose", phase: "CA", status: "On Track", billingHealth: "healthy", contractAmount: 76000, totalBilled: 42000, totalCollected: 39000, remainingToBill: 34000, consultantBilled: 8000, consultantCollected: 8000, futureExpected: 25000, startDate: "2025-12-01", monthsActive: 4, consultants: [{ name: "MEP Consultant", billed: 8000, collected: 8000 }], notes: "Steady CA work." },
  { id: 9, jobNumber: "2025-009", jobName: "Clinic Addition", client: "Healthcare Client", lead: "Jose", phase: "CA", status: "Submittals", billingHealth: "warning", contractAmount: 125000, totalBilled: 110000, totalCollected: 98000, remainingToBill: 15000, consultantBilled: 15000, consultantCollected: 13000, futureExpected: 10000, startDate: "2025-06-15", monthsActive: 9, consultants: [{ name: "Structural Consultant", billed: 15000, collected: 13000 }], notes: "Late-stage project with limited remaining fee." },
  { id: 10, jobNumber: "2025-010", jobName: "Warehouse Expansion", client: "Industrial Client", lead: "Jose", phase: "CA", status: "On Track", billingHealth: "healthy", contractAmount: 210000, totalBilled: 130000, totalCollected: 120000, remainingToBill: 80000, consultantBilled: 24000, consultantCollected: 22000, futureExpected: 65000, startDate: "2025-05-20", monthsActive: 10, consultants: [{ name: "Civil Consultant", billed: 24000, collected: 22000 }], notes: "Large active CA assignment." },
  { id: 11, jobNumber: "2025-011", jobName: "Retail Shell Building", client: "Developer", lead: "Jose", phase: "CA", status: "Punchlist", billingHealth: "underwater", contractAmount: 87000, totalBilled: 87000, totalCollected: 80000, remainingToBill: 0, consultantBilled: 9000, consultantCollected: 9000, futureExpected: 0, startDate: "2025-03-10", monthsActive: 12, consultants: [{ name: "MEP Consultant", billed: 9000, collected: 9000 }], notes: "Still active, but no billing runway remains." },
  { id: 12, jobNumber: "2025-012", jobName: "Church Fellowship Hall", client: "Church Client", lead: "Zuri", phase: "DD", status: "On Track", billingHealth: "healthy", contractAmount: 138000, totalBilled: 56000, totalCollected: 56000, remainingToBill: 82000, consultantBilled: 16000, consultantCollected: 16000, futureExpected: 60000, startDate: "2026-01-12", monthsActive: 3, consultants: [{ name: "MEP Consultant", billed: 9000, collected: 9000 }, { name: "Structural Consultant", billed: 7000, collected: 7000 }], notes: "Good production-stage project." },
  { id: 13, jobNumber: "2025-013", jobName: "School Admin Remodel", client: "School Client", lead: "Zuri", phase: "CD", status: "On Track", billingHealth: "healthy", contractAmount: 89000, totalBilled: 41000, totalCollected: 41000, remainingToBill: 48000, consultantBilled: 9000, consultantCollected: 9000, futureExpected: 32000, startDate: "2026-01-28", monthsActive: 2, consultants: [{ name: "MEP Consultant", billed: 9000, collected: 9000 }], notes: "Early production work." },
  { id: 14, jobNumber: "2025-014", jobName: "Office TI Package", client: "Private Tenant", lead: "Zuri", phase: "CD", status: "Permit Prep", billingHealth: "warning", contractAmount: 54000, totalBilled: 42000, totalCollected: 35000, remainingToBill: 12000, consultantBilled: 5000, consultantCollected: 5000, futureExpected: 8000, startDate: "2025-12-15", monthsActive: 4, consultants: [{ name: "MEP Consultant", billed: 5000, collected: 5000 }], notes: "Approaching billing edge." }
];

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
  { id: 3, client: "CCA", invoice: "2403", date: "2026-03-01", amount: 15000, project: "2025-006 | Covenant High School" },
  { id: 4, client: "iShine", invoice: "2404", date: "2025-12-22", amount: 22000, project: "2025-004 | iShine Corpus Christi" }
];

const payablesSeed = [
  { id: 1, vendor: "Trinity", invoice: "A112", date: "2026-02-25", amount: 2200, relatedTo: "Consultant" },
  { id: 2, vendor: "Rioplex", invoice: "R320", date: "2026-03-03", amount: 1800, relatedTo: "Intercompany" },
  { id: 3, vendor: "Click", invoice: "C091", date: "2026-02-18", amount: 340, relatedTo: "Software" },
  { id: 4, vendor: "Heffner", invoice: "H877", date: "2026-01-20", amount: 4800, relatedTo: "Consultant" },
  { id: 5, vendor: "Earth Co", invoice: "E445", date: "2026-03-05", amount: 2600, relatedTo: "Survey" }
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
  const [selectedProjectId, setSelectedProjectId] = useState(projectsSeed[0].id);

  const leadOptions = ["All", ...Array.from(new Set(projectsSeed.map((p) => p.lead)))];
  const phaseOptions = ["All", ...Array.from(new Set(projectsSeed.map((p) => p.phase)))];

  const filteredProjects = useMemo(() => [...projectsSeed].filter((p) => (leadFilter === "All" ? true : p.lead === leadFilter)).filter((p) => (phaseFilter === "All" ? true : p.phase === phaseFilter)).sort((a, b) => a.jobNumber.localeCompare(b.jobNumber)), [leadFilter, phaseFilter]);
  const selectedProject = projectsSeed.find((p) => p.id === selectedProjectId) || projectsSeed[0];

  const workloadRows = useMemo(() => {
    const grouped = projectsSeed.reduce((acc, project) => {
      if (!acc[project.lead]) acc[project.lead] = { id: project.lead, lead: project.lead, totalProjects: 0, phases: {}, contractAmount: 0, remainingToBill: 0 };
      acc[project.lead].totalProjects += 1;
      acc[project.lead].contractAmount += project.contractAmount;
      acc[project.lead].remainingToBill += project.remainingToBill;
      acc[project.lead].phases[project.phase] = (acc[project.lead].phases[project.phase] || 0) + 1;
      return acc;
    }, {});
    return Object.values(grouped).map((row) => ({ ...row, phaseMix: Object.entries(row.phases).map(([phase, count]) => `${count} ${phase}`).join(" · ") })).sort((a, b) => b.totalProjects - a.totalProjects);
  }, []);

  const totalContracts = projectsSeed.reduce((sum, p) => sum + p.contractAmount, 0);
  const totalRemaining = projectsSeed.reduce((sum, p) => sum + p.remainingToBill, 0);
  const totalCollected = projectsSeed.reduce((sum, p) => sum + p.totalCollected, 0);
  const phaseDistribution = Object.entries(projectsSeed.reduce((acc, p) => { acc[p.phase] = (acc[p.phase] || 0) + 1; return acc; }, {})).map(([label, value]) => ({ label, value, display: value }));

  const receivables = receivablesSeed.map((r) => { const ageDays = diffDays(r.date); return { ...r, ageDays, bucket: agingBucket(ageDays) }; });
  const payables = payablesSeed.map((p) => { const ageDays = diffDays(p.date); return { ...p, ageDays, bucket: agingBucket(ageDays) }; });
  const cashTotal = bankAccountsSeed.reduce((sum, a) => sum + a.balance, 0);
  const currentAR = receivables.reduce((sum, r) => sum + r.amount, 0);
  const currentAP = payables.reduce((sum, p) => sum + p.amount, 0);
  const arAgingRows = ["0-30", "31-60", "61-90", "90+"].map((bucket) => ({ label: bucket, value: receivables.filter((r) => r.bucket === bucket).reduce((sum, r) => sum + r.amount, 0), display: shortCurrency(receivables.filter((r) => r.bucket === bucket).reduce((sum, r) => sum + r.amount, 0)) }));
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
            {[
              ["projects", "Projects"],
              ["workload", "Workload"],
              ["proposals", "Proposals"],
              ["financial", "Financial"]
            ].map(([key, label]) => <button key={key} onClick={() => setTab(key)} style={{ borderRadius: 14, padding: "10px 16px", border: tab === key ? "1px solid #0f172a" : "1px solid #cbd5e1", background: tab === key ? "#0f172a" : "white", color: tab === key ? "white" : "#334155", cursor: "pointer", fontWeight: 600 }}>{label}</button>)}
          </div>
        </header>

        {tab === "projects" && <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 16 }}>
            <MetricCard label="Active Projects" value={projectsSeed.length} note="SGA only" />
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
                    <div style={{ fontWeight: 700, ...billingColorClasses[project.billingHealth] }}>{project.jobNumber}</div>
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
                  <div><div style={{ fontSize: 22, fontWeight: 700, ...billingColorClasses[selectedProject.billingHealth] }}>{selectedProject.jobNumber}</div><div style={{ fontSize: 26, fontWeight: 700, marginTop: 4 }}>{selectedProject.jobName}</div><div style={{ color: "#64748b", marginTop: 4 }}>{selectedProject.client}</div></div>
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
                  <div><div style={{ fontSize: 14, color: "#94a3b8", marginBottom: 8 }}>Consultants</div><div style={{ display: "grid", gap: 8 }}>{selectedProject.consultants.length ? selectedProject.consultants.map((consultant) => <div key={consultant.name} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 10, fontSize: 14 }}><div style={{ fontWeight: 600 }}>{consultant.name}</div><div style={{ color: "#64748b", marginTop: 4 }}>Billed {currency(consultant.billed)} · Collected {currency(consultant.collected)}</div></div>) : <div style={{ color: "#64748b", fontSize: 14 }}>No consultants assigned yet.</div>}</div></div>
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
            <div style={card}><SectionTitle title="Remaining Billing by Project" subtitle="Largest live contract runway" /><SimpleBarChart rows={[...projectsSeed].sort((a, b) => b.remainingToBill - a.remainingToBill).slice(0, 5).map((p) => ({ label: p.jobNumber, value: p.remainingToBill, display: shortCurrency(p.remainingToBill) }))} color="#4f46e5" /></div>
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
