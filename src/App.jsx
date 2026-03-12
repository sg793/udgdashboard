import React, { useMemo, useState } from "react";

const projectsSeed = [
  {
    id: 1,
    name: "Rio Bank Elsa Expansion",
    client: "Rio Bank",
    company: "SGA",
    discipline: "Architecture",
    lead: "Sergio",
    phase: "Construction Admin",
    status: "Healthy",
    category: "Mid Size",
    startDate: "2025-01-10",
    expectedCompletion: "2025-11-20",
    milestone: "Submittal Review Package",
    milestoneDate: "2026-03-25",
    totalFee: 340000,
    billedToDate: 220000,
    remaining: 120000,
    estConstructionCost: 4200000,
    team: ["Sam", "Sergio", "Zuri"],
  },
  {
    id: 2,
    name: "Covenant High School",
    client: "CCA",
    company: "SGA",
    discipline: "Architecture",
    lead: "Sam",
    phase: "SD",
    status: "Watch",
    category: "Marquee",
    startDate: "2026-02-02",
    expectedCompletion: "2027-02-15",
    milestone: "Program Confirmation",
    milestoneDate: "2026-04-02",
    totalFee: 520000,
    billedToDate: 30000,
    remaining: 490000,
    estConstructionCost: 7800000,
    team: ["Sam", "Sergio"],
  },
  {
    id: 3,
    name: "iShine Corpus Christi",
    client: "iShine",
    company: "SGA",
    discipline: "Architecture",
    lead: "Kelley",
    phase: "Construction Docs",
    status: "Healthy",
    category: "Quick Cash",
    startDate: "2025-11-14",
    expectedCompletion: "2026-09-01",
    milestone: "Civil Submission",
    milestoneDate: "2026-04-08",
    totalFee: 150000,
    billedToDate: 90000,
    remaining: 60000,
    estConstructionCost: 1800000,
    team: ["Kelley", "Zuri"],
  },
  {
    id: 4,
    name: "STC Building K Renovation",
    client: "STC",
    company: "SGA",
    discipline: "Architecture",
    lead: "Sergio",
    phase: "Owner Review",
    status: "Watch",
    category: "Mid Size",
    startDate: "2025-08-20",
    expectedCompletion: "2026-05-30",
    milestone: "Receive Owner Comments",
    milestoneDate: "2026-03-18",
    totalFee: 180000,
    billedToDate: 110000,
    remaining: 70000,
    estConstructionCost: 2300000,
    team: ["Sergio", "Sam"],
  },
  {
    id: 5,
    name: "Edinburg Subdivision",
    client: "G&G Capital",
    company: "Rioplex",
    discipline: "Civil",
    lead: "Kelley",
    phase: "Preliminary Engineering",
    status: "Healthy",
    category: "Mid Size",
    startDate: "2026-01-05",
    expectedCompletion: "2026-12-20",
    milestone: "Preliminary Plat",
    milestoneDate: "2026-04-20",
    totalFee: 380000,
    billedToDate: 70000,
    remaining: 310000,
    estConstructionCost: 1000000,
    team: ["Kelley", "Sam"],
  },
  {
    id: 6,
    name: "Weslaco Fire Station",
    client: "City of Weslaco",
    company: "SGA",
    discipline: "Architecture",
    lead: "Zuri",
    phase: "DD",
    status: "Problem",
    category: "Marquee",
    startDate: "2025-10-11",
    expectedCompletion: "2026-10-10",
    milestone: "Owner Pricing Review",
    milestoneDate: "2026-04-15",
    totalFee: 410000,
    billedToDate: 225000,
    remaining: 185000,
    estConstructionCost: 6200000,
    team: ["Zuri", "Sam", "Sergio"],
  },
];

const opportunitiesSeed = [
  {
    id: 1,
    name: "Regional Rehab Hospital",
    client: "Healthcare System",
    company: "SGA",
    stage: "Relationship",
    probability: 25,
    fee: 5600000,
    lead: "Sam",
  },
  {
    id: 2,
    name: "SPI Condo Tower",
    client: "Developer",
    company: "SGA",
    stage: "Concept",
    probability: 30,
    fee: 920000,
    lead: "Sam",
  },
  {
    id: 3,
    name: "McAllen Fire Station",
    client: "Municipal",
    company: "SGA",
    stage: "RFQ Expected",
    probability: 50,
    fee: 420000,
    lead: "Sam",
  },
  {
    id: 4,
    name: "10-Acre Duplex Lots",
    client: "Private Landowner",
    company: "Rioplex",
    stage: "Proposal",
    probability: 70,
    fee: 380000,
    lead: "Kelley",
  },
];

const bankAccountsSeed = [
  { name: "Income", balance: 10000 },
  { name: "OPEX", balance: 740 },
  { name: "Payroll", balance: 13128 },
  { name: "Tax Withholding", balance: 188 },
  { name: "Profit First", balance: 1262 },
  { name: "Consultant Fees", balance: 4200 },
  { name: "Community Impact", balance: 900 },
  { name: "Education Expenses", balance: 350 },
];

const receivablesSeed = [
  { id: 1, client: "Rio Bank", invoice: "2401", date: "2026-02-20", amount: 18000, project: "Rio Bank Elsa Expansion" },
  { id: 2, client: "STC", invoice: "2402", date: "2026-01-31", amount: 32000, project: "STC Building K Renovation" },
  { id: 3, client: "CCA", invoice: "2403", date: "2026-03-01", amount: 15000, project: "Covenant High School" },
  { id: 4, client: "iShine", invoice: "2404", date: "2025-12-22", amount: 22000, project: "iShine Corpus Christi" },
];

const futureReceivablesSeed = [
  { id: 1, project: "Covenant High School", client: "CCA", totalContract: 520000, billedToDate: 30000, remaining: 490000 },
  { id: 2, project: "Edinburg Subdivision", client: "G&G Capital", totalContract: 380000, billedToDate: 70000, remaining: 310000 },
  { id: 3, project: "Weslaco Fire Station", client: "City of Weslaco", totalContract: 410000, billedToDate: 225000, remaining: 185000 },
  { id: 4, project: "Rio Bank Elsa Expansion", client: "Rio Bank", totalContract: 340000, billedToDate: 220000, remaining: 120000 },
];

const payablesSeed = [
  { id: 1, vendor: "Trinity", invoice: "A112", date: "2026-02-25", amount: 2200, relatedTo: "Consultant" },
  { id: 2, vendor: "Rioplex", invoice: "R320", date: "2026-03-03", amount: 1800, relatedTo: "Intercompany" },
  { id: 3, vendor: "Click", invoice: "C091", date: "2026-02-18", amount: 340, relatedTo: "Software" },
  { id: 4, vendor: "Heffner", invoice: "H877", date: "2026-01-20", amount: 4800, relatedTo: "Consultant" },
  { id: 5, vendor: "Earth Co", invoice: "E445", date: "2026-03-05", amount: 2600, relatedTo: "Survey" },
];

const forecastSeed = [
  { month: "Apr 2026", amount: 320000 },
  { month: "May 2026", amount: 285000 },
  { month: "Jun 2026", amount: 410000 },
];

const statusClasses = {
  Healthy: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Watch: "bg-amber-50 text-amber-700 border-amber-200",
  Problem: "bg-rose-50 text-rose-700 border-rose-200",
};

function currency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
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

function SectionTitle({ title, subtitle, action }) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function MetricCard({ label, value, note, dark = false }) {
  return (
    <div className={`${dark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200"} rounded-2xl border p-5 shadow-sm`}>
      <div className={`${dark ? "text-slate-400" : "text-slate-500"} text-sm`}>{label}</div>
      <div className="text-2xl font-semibold mt-2">{value}</div>
      {note ? <div className={`${dark ? "text-slate-400" : "text-slate-400"} text-sm mt-2`}>{note}</div> : null}
    </div>
  );
}

function SimpleBarChart({ rows, valueKey = "value", labelKey = "label", colorClass = "bg-slate-800" }) {
  const max = Math.max(...rows.map((r) => r[valueKey]), 1);
  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row[labelKey]}>
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="text-slate-600">{row[labelKey]}</span>
            <span className="text-slate-500">{row.display ?? row[valueKey]}</span>
          </div>
          <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
            <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${(row[valueKey] / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function DataTable({ columns, rows, dense = false }) {
  return (
    <div className="overflow-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={`px-4 ${dense ? "py-2" : "py-3"} text-xs font-semibold uppercase tracking-wide text-slate-500`}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={row.id ?? rowIndex} className="border-b last:border-b-0 border-slate-100">
              {columns.map((col) => (
                <td key={col.key} className={`px-4 ${dense ? "py-2.5" : "py-3.5"} text-sm text-slate-700`}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function UDGDashboardApp() {
  const [appTab, setAppTab] = useState("operations");
  const [roleView, setRoleView] = useState("office");
  const [companyFilter, setCompanyFilter] = useState("All");
  const [leadFilter, setLeadFilter] = useState("All");
  const [selectedProjectId, setSelectedProjectId] = useState(1);

  const companyOptions = ["All", ...Array.from(new Set(projectsSeed.map((p) => p.company)))];
  const leadOptions = ["All", ...Array.from(new Set(projectsSeed.map((p) => p.lead)))];

  const filteredProjects = useMemo(() => {
    return projectsSeed.filter((p) => {
      const companyPass = companyFilter === "All" || p.company === companyFilter;
      const leadPass = leadFilter === "All" || p.lead === leadFilter;
      return companyPass && leadPass;
    });
  }, [companyFilter, leadFilter]);

  const selectedProject = projectsSeed.find((p) => p.id === selectedProjectId) ?? projectsSeed[0];

  const totalFees = filteredProjects.reduce((sum, p) => sum + p.totalFee, 0);
  const totalRemaining = filteredProjects.reduce((sum, p) => sum + p.remaining, 0);
  const projectsInCA = filteredProjects.filter((p) => p.phase === "Construction Admin").length;
  const awaitingClient = filteredProjects.filter((p) => p.phase === "Owner Review" || p.status === "Watch").length;

  const phaseRows = useMemo(() => {
    const grouped = filteredProjects.reduce((acc, p) => {
      acc[p.phase] = (acc[p.phase] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(grouped).map(([label, value]) => ({ label, value, display: value }));
  }, [filteredProjects]);

  const companyMixRows = useMemo(() => {
    const grouped = filteredProjects.reduce((acc, p) => {
      acc[p.company] = (acc[p.company] || 0) + p.remaining;
      return acc;
    }, {});
    return Object.entries(grouped).map(([label, value]) => ({ label, value, display: shortCurrency(value) }));
  }, [filteredProjects]);

  const milestoneRows = [...filteredProjects]
    .sort((a, b) => new Date(a.milestoneDate) - new Date(b.milestoneDate))
    .slice(0, 6);

  const weightedPipeline = opportunitiesSeed.reduce((sum, o) => sum + (o.fee * o.probability) / 100, 0);

  const bankTotal = bankAccountsSeed.reduce((sum, a) => sum + a.balance, 0);

  const receivables = receivablesSeed.map((r) => {
    const days = diffDays(r.date);
    return { ...r, ageDays: days, bucket: agingBucket(days) };
  });

  const payables = payablesSeed.map((p) => {
    const days = diffDays(p.date);
    return { ...p, ageDays: days, bucket: agingBucket(days) };
  });

  const currentAR = receivables.reduce((sum, r) => sum + r.amount, 0);
  const futureAR = futureReceivablesSeed.reduce((sum, r) => sum + r.remaining, 0);
  const currentAP = payables.reduce((sum, p) => sum + p.amount, 0);
  const trueLiquidity = bankTotal + currentAR - currentAP;

  const arAgingRows = ["0-30", "31-60", "61-90", "90+"].map((bucket) => {
    const amount = receivables.filter((r) => r.bucket === bucket).reduce((sum, r) => sum + r.amount, 0);
    return { label: bucket, value: amount, display: shortCurrency(amount) };
  });

  const apAgingRows = ["0-30", "31-60", "61-90", "90+"].map((bucket) => {
    const amount = payables.filter((p) => p.bucket === bucket).reduce((sum, p) => sum + p.amount, 0);
    return { label: bucket, value: amount, display: shortCurrency(amount) };
  });

  const contractRunwayRows = [...futureReceivablesSeed]
    .sort((a, b) => b.remaining - a.remaining)
    .slice(0, 5)
    .map((r) => ({ label: r.project, value: r.remaining, display: shortCurrency(r.remaining) }));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Unified Design Group</p>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mt-1">Operations + Financial Command Dashboard</h1>
            <p className="text-slate-600 mt-2 max-w-3xl">
              V1 internal app for project visibility, leadership pipeline, cash awareness, receivables, payables, and future contract runway.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              className={`px-4 py-2 rounded-2xl shadow-sm ${appTab === "operations" ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-700"}`}
              onClick={() => setAppTab("operations")}
            >
              Operations
            </button>
            <button
              className={`px-4 py-2 rounded-2xl shadow-sm ${appTab === "financial" ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-700"}`}
              onClick={() => setAppTab("financial")}
            >
              Financial Command
            </button>
            {appTab === "operations" && (
              <button
                className={`px-4 py-2 rounded-2xl shadow-sm ${roleView === "leadership" ? "bg-indigo-600 text-white" : "bg-white border border-slate-200 text-slate-700"}`}
                onClick={() => setRoleView(roleView === "office" ? "leadership" : "office")}
              >
                {roleView === "office" ? "Switch to Leadership" : "Switch to Office"}
              </button>
            )}
          </div>
        </header>

        {appTab === "operations" && (
          <>
            <section className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
              <div>
                <div className="text-sm text-slate-500">View Mode</div>
                <div className="font-medium mt-1">{roleView === "office" ? "Whole Office Mission Control" : "Leadership Intelligence Layer"}</div>
              </div>
              <div className="flex flex-wrap gap-3">
                <select value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)} className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50">
                  {companyOptions.map((opt) => <option key={opt}>{opt}</option>)}
                </select>
                <select value={leadFilter} onChange={(e) => setLeadFilter(e.target.value)} className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50">
                  {leadOptions.map((opt) => <option key={opt}>{opt}</option>)}
                </select>
              </div>
            </section>

            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard label="Active Projects" value={filteredProjects.length} note="Visible under current filters" />
              <MetricCard label="Projects in CA" value={projectsInCA} note="Current construction administration load" />
              <MetricCard label="Awaiting Client / Review" value={awaitingClient} note="Needs close attention" />
              <MetricCard label="Remaining Fee" value={shortCurrency(totalRemaining)} note="Active contracted runway" />
            </section>

            <section className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <SectionTitle
                  title="Project Board"
                  subtitle="The office sees status, phase, milestone, and ownership. Leadership also sees fee intelligence on the detail panel."
                />
                <div className="grid md:grid-cols-2 gap-4">
                  {filteredProjects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => setSelectedProjectId(project.id)}
                      className={`text-left rounded-2xl border p-5 transition ${selectedProjectId === project.id ? "border-slate-900 bg-slate-50" : "border-slate-200 bg-white hover:bg-slate-50"}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-lg leading-tight">{project.name}</h3>
                          <p className="text-sm text-slate-500 mt-1">{project.client}</p>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full border ${statusClasses[project.status]}`}>
                          {project.status}
                        </span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2 text-sm">
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">{project.company}</span>
                        <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">{project.discipline}</span>
                        <span className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700">Lead: {project.lead}</span>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <div className="text-slate-400 text-xs uppercase tracking-wide">Phase</div>
                          <div className="font-medium mt-1">{project.phase}</div>
                        </div>
                        <div>
                          <div className="text-slate-400 text-xs uppercase tracking-wide">Category</div>
                          <div className="font-medium mt-1">{project.category}</div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="text-slate-400 text-xs uppercase tracking-wide">Next Milestone</div>
                        <div className="font-medium mt-1">{project.milestone}</div>
                        <div className="text-sm text-slate-500 mt-1">{project.milestoneDate}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                  <SectionTitle title="Project Detail" subtitle="Selected project intelligence" />
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">{selectedProject.name}</h3>
                      <p className="text-sm text-slate-500 mt-1">{selectedProject.client}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-slate-400">Company</div>
                        <div className="font-medium mt-1">{selectedProject.company}</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Lead</div>
                        <div className="font-medium mt-1">{selectedProject.lead}</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Phase</div>
                        <div className="font-medium mt-1">{selectedProject.phase}</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Status</div>
                        <div className="font-medium mt-1">{selectedProject.status}</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Start</div>
                        <div className="font-medium mt-1">{selectedProject.startDate}</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Expected Completion</div>
                        <div className="font-medium mt-1">{selectedProject.expectedCompletion}</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-sm">Team</div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedProject.team.map((person) => (
                          <span key={person} className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-sm">{person}</span>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                      <div className="text-slate-400 text-xs uppercase tracking-wide">Next Milestone</div>
                      <div className="font-medium mt-1">{selectedProject.milestone}</div>
                      <div className="text-sm text-slate-500 mt-1">{selectedProject.milestoneDate}</div>
                    </div>
                    {roleView === "leadership" && (
                      <div className="rounded-2xl bg-slate-900 text-white border border-slate-800 p-4">
                        <div className="text-slate-400 text-xs uppercase tracking-wide">Leadership Financials</div>
                        <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
                          <div>
                            <div className="text-slate-400">Total Fee</div>
                            <div className="font-semibold mt-1">{currency(selectedProject.totalFee)}</div>
                          </div>
                          <div>
                            <div className="text-slate-400">Billed to Date</div>
                            <div className="font-semibold mt-1">{currency(selectedProject.billedToDate)}</div>
                          </div>
                          <div>
                            <div className="text-slate-400">Fee Remaining</div>
                            <div className="font-semibold mt-1">{currency(selectedProject.remaining)}</div>
                          </div>
                          <div>
                            <div className="text-slate-400">Est. Construction</div>
                            <div className="font-semibold mt-1">{currency(selectedProject.estConstructionCost)}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                  <SectionTitle title="Upcoming Milestones" subtitle="Next critical moves across the office" />
                  <div className="space-y-3">
                    {milestoneRows.map((project) => (
                      <div key={project.id} className="rounded-2xl border border-slate-200 p-4">
                        <div className="font-medium text-sm">{project.name}</div>
                        <div className="text-sm text-slate-500 mt-1">{project.milestone}</div>
                        <div className="text-xs text-slate-400 mt-1">{project.milestoneDate}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <SectionTitle title="Phase Distribution" subtitle="Where current workload sits" />
                <SimpleBarChart rows={phaseRows} valueKey="value" labelKey="label" colorClass="bg-slate-800" />
              </div>
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <SectionTitle title="Company Mix by Remaining Fee" subtitle="Active contracted runway by company" />
                <SimpleBarChart rows={companyMixRows} valueKey="value" labelKey="label" colorClass="bg-indigo-600" />
              </div>
            </section>

            {roleView === "leadership" && (
              <section className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-sm">
                <SectionTitle title="Leadership Pipeline Layer" subtitle="Restricted to principals" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <MetricCard dark label="Total Contract Fees" value={shortCurrency(totalFees)} note="Filtered active projects" />
                  <MetricCard dark label="Remaining Fees" value={shortCurrency(totalRemaining)} note="Current active backlog" />
                  <MetricCard dark label="Weighted Opportunity" value={shortCurrency(weightedPipeline)} note="Future pipeline value" />
                  <MetricCard dark label="90-Day Forecast" value={shortCurrency(forecastSeed.reduce((s, m) => s + m.amount, 0))} note="Next three months" />
                </div>
                <div className="grid lg:grid-cols-2 gap-6 mt-6">
                  <div className="bg-slate-800 rounded-3xl border border-slate-700 p-6">
                    <SectionTitle title="Revenue Radar" subtitle="Forecasted billing by month" />
                    <SimpleBarChart rows={forecastSeed.map((m) => ({ label: m.month, value: m.amount, display: shortCurrency(m.amount) }))} valueKey="value" labelKey="label" colorClass="bg-emerald-500" />
                  </div>
                  <div className="bg-slate-800 rounded-3xl border border-slate-700 p-6">
                    <SectionTitle title="Opportunity Pipeline" subtitle="Weighted growth radar" />
                    <div className="space-y-3">
                      {opportunitiesSeed.map((o) => {
                        const weighted = (o.fee * o.probability) / 100;
                        return (
                          <div key={o.id} className="rounded-2xl bg-slate-900/60 border border-slate-700 p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="font-medium">{o.name}</div>
                                <div className="text-sm text-slate-400 mt-1">{o.client} · {o.stage}</div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold">{o.probability}%</div>
                                <div className="text-xs text-slate-400">probability</div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-sm mt-3">
                              <span className="text-slate-400">Estimated Fee</span>
                              <span>{shortCurrency(o.fee)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm mt-1">
                              <span className="text-slate-400">Weighted Value</span>
                              <span>{shortCurrency(weighted)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </section>
            )}
          </>
        )}

        {appTab === "financial" && (
          <>
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard label="Cash in Bank" value={shortCurrency(bankTotal)} note="Across designated operating buckets" />
              <MetricCard label="Current AR" value={shortCurrency(currentAR)} note="Earned but uncollected" />
              <MetricCard label="Future Receivables" value={shortCurrency(futureAR)} note="Contracted but unbilled" />
              <MetricCard label="Current AP" value={shortCurrency(currentAP)} note="Near-term obligations" />
            </section>

            <section className="grid lg:grid-cols-4 gap-4">
              <MetricCard label="True Liquidity" value={shortCurrency(trueLiquidity)} note="Cash + AR - AP" />
              <MetricCard label="OPEX Reserve" value={shortCurrency(bankAccountsSeed.find((a) => a.name === "OPEX")?.balance ?? 0)} note="Current operating cushion" />
              <MetricCard label="Payroll Reserve" value={shortCurrency(bankAccountsSeed.find((a) => a.name === "Payroll")?.balance ?? 0)} note="Current payroll account" />
              <MetricCard label="Profit / Tax Buckets" value={shortCurrency((bankAccountsSeed.find((a) => a.name === "Profit First")?.balance ?? 0) + (bankAccountsSeed.find((a) => a.name === "Tax Withholding")?.balance ?? 0))} note="Protected internal allocations" />
            </section>

            <section className="grid lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <SectionTitle title="Cash by Account" subtitle="Profit First style allocations" />
                <SimpleBarChart rows={bankAccountsSeed.map((a) => ({ label: a.name, value: a.balance, display: shortCurrency(a.balance) }))} valueKey="value" labelKey="label" colorClass="bg-slate-800" />
              </div>
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <SectionTitle title="AR Aging" subtitle="Collection pressure by age bucket" />
                <SimpleBarChart rows={arAgingRows} valueKey="value" labelKey="label" colorClass="bg-emerald-600" />
              </div>
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <SectionTitle title="AP Aging" subtitle="Payables pressure by age bucket" />
                <SimpleBarChart rows={apAgingRows} valueKey="value" labelKey="label" colorClass="bg-rose-600" />
              </div>
            </section>

            <section className="grid lg:grid-cols-2 gap-6">
              <div>
                <SectionTitle title="Accounts Receivable" subtitle="Live receivables with invoice age" />
                <DataTable
                  columns={[
                    { key: "client", label: "Client" },
                    { key: "project", label: "Project" },
                    { key: "invoice", label: "Invoice" },
                    { key: "date", label: "Date" },
                    { key: "ageDays", label: "Age", render: (r) => `${r.ageDays} days` },
                    { key: "amount", label: "Amount", render: (r) => currency(r.amount) },
                  ]}
                  rows={receivables}
                />
              </div>
              <div>
                <SectionTitle title="Accounts Payable" subtitle="Vendor obligations with invoice age" />
                <DataTable
                  columns={[
                    { key: "vendor", label: "Vendor" },
                    { key: "relatedTo", label: "Type" },
                    { key: "invoice", label: "Invoice" },
                    { key: "date", label: "Date" },
                    { key: "ageDays", label: "Age", render: (r) => `${r.ageDays} days` },
                    { key: "amount", label: "Amount", render: (r) => currency(r.amount) },
                  ]}
                  rows={payables}
                />
              </div>
            </section>

            <section className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <SectionTitle title="Future Receivables" subtitle="What remains on signed contracts" />
                <DataTable
                  dense
                  columns={[
                    { key: "project", label: "Project" },
                    { key: "client", label: "Client" },
                    { key: "totalContract", label: "Contract", render: (r) => currency(r.totalContract) },
                    { key: "billedToDate", label: "Billed", render: (r) => currency(r.billedToDate) },
                    { key: "remaining", label: "Remaining", render: (r) => currency(r.remaining) },
                  ]}
                  rows={futureReceivablesSeed}
                />
              </div>
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <SectionTitle title="Largest Unbilled Contract Runway" subtitle="Projects carrying the most future billing power" />
                <SimpleBarChart rows={contractRunwayRows} valueKey="value" labelKey="label" colorClass="bg-indigo-600" />
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
