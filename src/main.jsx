import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import Papa from 'papaparse';
import { Chart, registerables } from 'chart.js';
import './styles.css';

Chart.register(...registerables);

const CONFIG = {
  dataSources: {
    projects: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRQkIsoeu_hacaCXYijobEMqKBIs_G_71qtJjnkyq_AGggQTs6Qqt6CnpnT51wyB9U1OL8dKIMqUB7f/pub?gid=0&single=true&output=csv',
    consultants: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRQkIsoeu_hacaCXYijobEMqKBIs_G_71qtJjnkyq_AGggQTs6Qqt6CnpnT51wyB9U1OL8dKIMqUB7f/pub?gid=622686252&single=true&output=csv',
    financialHistory: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRQkIsoeu_hacaCXYijobEMqKBIs_G_71qtJjnkyq_AGggQTs6Qqt6CnpnT51wyB9U1OL8dKIMqUB7f/pub?gid=1382479765&single=true&output=csv',
    annualTaxSummary: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRQkIsoeu_hacaCXYijobEMqKBIs_G_71qtJjnkyq_AGggQTs6Qqt6CnpnT51wyB9U1OL8dKIMqUB7f/pub?gid=2049060251&single=true&output=csv'
  },
  phaseOrder: ['SD', 'DD', 'CD', 'BN', 'CA'],
  currency: 'USD'
};

const aliases = {
  projects: {
    jobNumber: ['jobnumber', 'job_number', 'job no', 'job no.', 'number'],
    jobName: ['jobname', 'job_name', 'projectname', 'project_name'],
    client: ['client', 'owner'],
    projectType: ['projecttype', 'project_type', 'type'],
    lead: ['lead', 'pm', 'projectmanager', 'project_manager'],
    phase: ['phase'],
    status: ['status'],
    billingHealth: ['billinghealth', 'billing_health'],
    contractAmount: ['contractamount', 'contract_amount', 'fee', 'contract'],
    totalBilled: ['totalbilled', 'total_billed', 'billed'],
    totalCollected: ['totalcollected', 'total_collected', 'collected'],
    remainingToBill: ['remainingtobill', 'remaining_to_bill'],
    startDate: ['startdate', 'start_date', 'start']
  },
  consultants: {
    project: ['project', 'jobname', 'job_name'],
    consultant: ['consultant', 'consultantname', 'name'],
    discipline: ['discipline', 'type', 'consultanttype'],
    status: ['status'],
    fee: ['fee', 'consultantfee', 'contractamount', 'amount'],
    paid: ['paid', 'totalpaid'],
    balance: ['balance', 'remaining', 'unpaid']
  },
  financialHistory: {
    year: ['year'],
    quarter: ['quarter'],
    grossRevenue: ['grossrevenue', 'gross_revenue', 'gross'],
    notes: ['notes', 'note']
  },
  annualTaxSummary: {
    year: ['year'],
    ordinaryBusinessIncome: ['ordinarybusinessincome', 'ordinary_business_income', 'obi'],
    notes: ['notes', 'note']
  }
};

const activeStatuses = new Set(['active', 'in progress', 'underway', 'current']);
const quarterSort = { Q1: 1, Q2: 2, Q3: 3, Q4: 4 };

function normalizeHeader(value) {
  return String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function normalizeRow(row, schemaName) {
  const schema = aliases[schemaName];
  const normalized = {};
  const normalizedRow = Object.fromEntries(Object.entries(row).map(([k, v]) => [normalizeHeader(k), v]));

  for (const [target, possible] of Object.entries(schema)) {
    const match = possible.find((key) => Object.prototype.hasOwnProperty.call(normalizedRow, normalizeHeader(key)));
    normalized[target] = match ? normalizedRow[normalizeHeader(match)] : '';
  }

  return normalized;
}

function parseCurrency(value) {
  if (value === null || value === undefined || value === '') return 0;
  const raw = String(value).trim();
  if (!raw) return 0;
  const negative = raw.includes('(') && raw.includes(')');
  const cleaned = raw.replace(/[$,%()\s,]/g, '');
  const num = Number(cleaned);
  return Number.isFinite(num) ? (negative ? -num : num) : 0;
}

function parseInteger(value) {
  const num = Number(String(value || '').trim());
  return Number.isFinite(num) ? num : 0;
}

function formatCurrency(value, compact = false) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: CONFIG.currency,
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: compact ? 1 : 0
  }).format(value || 0);
}

function formatPercent(value) {
  return `${Math.round((value || 0) * 100)}%`;
}

function formatNumber(value) {
  return new Intl.NumberFormat('en-US').format(value || 0);
}

function humanize(text) {
  return String(text || '')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

async function fetchCsv(url) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Failed to load ${url}`);
  const csv = await response.text();
  const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true });
  return parsed.data;
}

function countBy(rows, key, limit = null) {
  const map = new Map();
  rows.forEach((row) => {
    const label = String(row[key] || 'Unspecified').trim() || 'Unspecified';
    map.set(label, (map.get(label) || 0) + 1);
  });
  let entries = [...map.entries()].sort((a, b) => b[1] - a[1]);
  if (limit) entries = entries.slice(0, limit);
  return { labels: entries.map((x) => x[0]), values: entries.map((x) => x[1]) };
}

function sumBy(rows, groupKey, valueKey) {
  const map = new Map();
  rows.forEach((row) => {
    const label = String(row[groupKey] || 'Unspecified').trim() || 'Unspecified';
    map.set(label, (map.get(label) || 0) + (row[valueKey] || 0));
  });
  const entries = [...map.entries()].sort((a, b) => b[1] - a[1]);
  return { labels: entries.map((x) => x[0]), values: entries.map((x) => x[1]) };
}

function preprocessData(data) {
  const projects = (data.projects || []).map((row) => ({
    ...row,
    contractAmount: parseCurrency(row.contractAmount),
    totalBilled: parseCurrency(row.totalBilled),
    totalCollected: parseCurrency(row.totalCollected),
    remainingToBill: parseCurrency(row.remainingToBill),
    phase: String(row.phase || '').trim().toUpperCase()
  }));

  const consultants = (data.consultants || []).map((row) => ({
    ...row,
    fee: parseCurrency(row.fee),
    paid: parseCurrency(row.paid),
    balance: parseCurrency(row.balance)
  }));

  const financialHistory = (data.financialHistory || [])
    .map((row) => ({
      ...row,
      year: parseInteger(row.year),
      quarter: String(row.quarter || '').trim().toUpperCase(),
      grossRevenue: parseCurrency(row.grossRevenue)
    }))
    .filter((row) => row.year && quarterSort[row.quarter])
    .sort((a, b) => (a.year - b.year) || (quarterSort[a.quarter] - quarterSort[b.quarter]));

  const annualTaxSummary = (data.annualTaxSummary || [])
    .map((row) => ({
      ...row,
      year: parseInteger(row.year),
      ordinaryBusinessIncome: parseCurrency(row.ordinaryBusinessIncome)
    }))
    .filter((row) => row.year)
    .sort((a, b) => a.year - b.year);

  return { projects, consultants, financialHistory, annualTaxSummary };
}

function useChart(canvasRef, config) {
  useEffect(() => {
    if (!canvasRef.current || !config) return undefined;
    const chart = new Chart(canvasRef.current, config);
    return () => chart.destroy();
  }, [canvasRef, config]);
}

function ChartPanel({ title, chartRef, config, note }) {
  useChart(chartRef, config);
  return (
    <section className="panel">
      <h3>{title}</h3>
      <canvas ref={chartRef} />
      {note ? <div className="note">{note}</div> : null}
    </section>
  );
}

function KpiCard({ title, value, subtext }) {
  return (
    <div className="kpi-card">
      <h3>{title}</h3>
      <div className="value">{value}</div>
      <div className="subtext">{subtext}</div>
    </div>
  );
}

function DataTable({ columns, rows, formatters = {}, badgeColumns = [] }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>{columns.map((col) => <th key={col}>{humanize(col)}</th>)}</tr>
        </thead>
        <tbody>
          {rows.length ? rows.map((row, idx) => (
            <tr key={`${idx}-${columns.map((col) => row[col]).join('|')}`}>
              {columns.map((col) => {
                const value = row[col];
                const rendered = formatters[col] ? formatters[col](value) : (value || '');
                return (
                  <td key={col}>
                    {badgeColumns.includes(col) && value ? <span className="badge">{rendered}</span> : (rendered || <span className="empty-cell">—</span>)}
                  </td>
                );
              })}
            </tr>
          )) : (
            <tr>
              <td colSpan={columns.length}>No data loaded.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function chartConfig(type, labels, data, datasetLabel, multi = false) {
  if (multi) {
    return {
      type: 'bar',
      data: { labels, datasets: data.map((item) => ({ ...item, borderWidth: 1 })) },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: true } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { callback: (value) => formatCurrency(value, true) }
          }
        }
      }
    };
  }

  return {
    type,
    data: {
      labels,
      datasets: [{ label: datasetLabel, data, borderWidth: 2, tension: 0.25 }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: type !== 'bar' && type !== 'line' } },
      scales: type === 'doughnut' ? {} : {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => Math.abs(value) >= 1000 ? formatCurrency(value, true) : value
          }
        }
      }
    }
  };
}

function App() {
  const [view, setView] = useState('overview');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  const [data, setData] = useState({ projects: [], consultants: [], financialHistory: [], annualTaxSummary: [] });

  const statusChartRef = useRef(null);
  const billingChartRef = useRef(null);
  const leadChartRef = useRef(null);
  const phaseChartRef = useRef(null);
  const consultantStatusChartRef = useRef(null);
  const consultantDisciplineChartRef = useRef(null);
  const quarterlyGrossChartRef = useRef(null);
  const annualGrossChartRef = useRef(null);
  const obiChartRef = useRef(null);
  const grossVsObiChartRef = useRef(null);

  async function loadData() {
    setLoading(true);
    const issues = [];
    const rawData = { projects: [], consultants: [], financialHistory: [], annualTaxSummary: [] };

    for (const key of Object.keys(CONFIG.dataSources)) {
      try {
        const raw = await fetchCsv(CONFIG.dataSources[key]);
        rawData[key] = raw.map((row) => normalizeRow(row, key));
      } catch (error) {
        rawData[key] = [];
        issues.push(`${key} did not load`);
        console.error(error);
      }
    }

    setData(preprocessData(rawData));
    setAlert(issues.length ? `Data warning: ${issues.join(' · ')}` : '');
    setLastUpdated(`Updated ${new Date().toLocaleString()}`);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const overview = useMemo(() => {
    const projects = data.projects;
    const totalContract = projects.reduce((sum, p) => sum + p.contractAmount, 0);
    const totalBilled = projects.reduce((sum, p) => sum + p.totalBilled, 0);
    const totalCollected = projects.reduce((sum, p) => sum + p.totalCollected, 0);
    const remainingToBill = projects.reduce((sum, p) => sum + p.remainingToBill, 0);
    const activeProjects = projects.filter((p) => activeStatuses.has(String(p.status || '').trim().toLowerCase())).length;
    const byStatus = countBy(projects, 'status');
    const byBilling = countBy(projects, 'billingHealth');
    const byLead = countBy(projects, 'lead', 8);
    const phaseMap = new Map(CONFIG.phaseOrder.map((phase) => [phase, 0]));
    projects.forEach((project) => {
      if (phaseMap.has(project.phase)) phaseMap.set(project.phase, phaseMap.get(project.phase) + 1);
    });

    return {
      kpis: [
        { title: 'Total Projects', value: formatNumber(projects.length), subtext: 'All rows in the projects log' },
        { title: 'Active Projects', value: formatNumber(activeProjects), subtext: 'Based on active-style status labels' },
        { title: 'Contract Value', value: formatCurrency(totalContract, true), subtext: 'Total contract amount' },
        { title: 'Total Billed', value: formatCurrency(totalBilled, true), subtext: 'Cumulative billed' },
        { title: 'Total Collected', value: formatCurrency(totalCollected, true), subtext: 'Cumulative collected' },
        { title: 'Remaining to Bill', value: formatCurrency(remainingToBill, true), subtext: 'Unbilled contract balance' }
      ],
      status: chartConfig('doughnut', byStatus.labels, byStatus.values, 'Status'),
      billing: chartConfig('doughnut', byBilling.labels, byBilling.values, 'Billing Health'),
      lead: chartConfig('bar', byLead.labels, byLead.values, 'Projects by Lead'),
      phase: chartConfig('bar', CONFIG.phaseOrder, CONFIG.phaseOrder.map((phase) => phaseMap.get(phase) || 0), 'Projects by Phase')
    };
  }, [data.projects]);

  const projectsView = useMemo(() => {
    const projects = data.projects;
    const projectsInCA = projects.filter((p) => p.phase === 'CA').length;
    const avgCollectionRate = projects.length
      ? projects.reduce((sum, p) => sum + (p.totalBilled ? (p.totalCollected / p.totalBilled) : 0), 0) / projects.length
      : 0;
    const filtered = !search.trim()
      ? projects
      : projects.filter((project) => ['jobNumber', 'jobName', 'client', 'lead'].some((key) => String(project[key] || '').toLowerCase().includes(search.trim().toLowerCase())));

    return {
      kpis: [
        { title: 'Current CA Projects', value: formatNumber(projectsInCA), subtext: 'Projects currently in construction administration' },
        { title: 'Average Collection Rate', value: formatPercent(avgCollectionRate), subtext: 'Collected ÷ billed across all projects' },
        { title: 'High-Risk Billing Count', value: formatNumber(projects.filter((p) => String(p.billingHealth || '').toLowerCase().includes('risk')).length), subtext: 'Rows tagged as risk in billing health' },
        { title: 'Active Status Count', value: formatNumber(projects.filter((p) => activeStatuses.has(String(p.status || '').trim().toLowerCase())).length), subtext: 'Based on project status' }
      ],
      rows: filtered
    };
  }, [data.projects, search]);

  const consultantsView = useMemo(() => {
    const consultants = data.consultants;
    const totalFee = consultants.reduce((sum, row) => sum + row.fee, 0);
    const totalPaid = consultants.reduce((sum, row) => sum + row.paid, 0);
    const totalBalance = consultants.reduce((sum, row) => sum + row.balance, 0);
    const byStatus = countBy(consultants, 'status');
    const byDisciplineFee = sumBy(consultants, 'discipline', 'fee');

    return {
      kpis: [
        { title: 'Consultant Rows', value: formatNumber(consultants.length), subtext: 'All rows in the consultant log' },
        { title: 'Total Consultant Fee', value: formatCurrency(totalFee, true), subtext: 'Total committed consultant fee' },
        { title: 'Total Paid', value: formatCurrency(totalPaid, true), subtext: 'Paid to date' },
        { title: 'Open Consultant Balance', value: formatCurrency(totalBalance, true), subtext: 'Remaining consultant balance' }
      ],
      status: chartConfig('doughnut', byStatus.labels, byStatus.values, 'Consultant Status'),
      discipline: chartConfig('bar', byDisciplineFee.labels, byDisciplineFee.values, 'Fee by Discipline')
    };
  }, [data.consultants]);

  const financialView = useMemo(() => {
    const history = data.financialHistory;
    const annualTax = data.annualTaxSummary;
    const annualGrossMap = new Map();
    history.forEach((row) => annualGrossMap.set(row.year, (annualGrossMap.get(row.year) || 0) + row.grossRevenue));
    const annualGross = [...annualGrossMap.entries()].sort((a, b) => a[0] - b[0]);
    const latest4Q = history.slice(-4).reduce((sum, row) => sum + row.grossRevenue, 0);
    const bestQuarter = history.reduce((best, row) => (!best || row.grossRevenue > best.grossRevenue ? row : best), null);
    const bestYear = annualGross.reduce((best, row) => (!best || row[1] > best[1] ? row : best), null);
    const latestObi = annualTax[annualTax.length - 1];
    const overlapYears = annualTax.filter((item) => annualGrossMap.has(item.year)).map((item) => item.year);

    return {
      kpis: [
        { title: 'Highest Quarter', value: bestQuarter ? formatCurrency(bestQuarter.grossRevenue, true) : '$0', subtext: bestQuarter ? `${bestQuarter.year} ${bestQuarter.quarter}` : 'No data' },
        { title: 'Highest Gross Year', value: bestYear ? formatCurrency(bestYear[1], true) : '$0', subtext: bestYear ? `${bestYear[0]}` : 'No data' },
        { title: 'Trailing 4-Quarter Gross', value: formatCurrency(latest4Q, true), subtext: 'Most recent four quarters' },
        { title: 'Latest OBI', value: latestObi ? formatCurrency(latestObi.ordinaryBusinessIncome, true) : '$0', subtext: latestObi ? `${latestObi.year}` : 'No data' }
      ],
      quarterlyGross: chartConfig('line', history.map((r) => `${r.year}-${r.quarter}`), history.map((r) => r.grossRevenue), 'Quarterly Gross Revenue'),
      annualGross: chartConfig('bar', annualGross.map((r) => String(r[0])), annualGross.map((r) => r[1]), 'Annual Gross Revenue'),
      obi: chartConfig('bar', annualTax.map((r) => String(r.year)), annualTax.map((r) => r.ordinaryBusinessIncome), 'Ordinary Business Income'),
      grossVsObi: chartConfig('bar', overlapYears.map(String), [
        { label: 'Annual Gross Revenue', data: overlapYears.map((year) => annualGrossMap.get(year) || 0) },
        { label: 'Ordinary Business Income', data: overlapYears.map((year) => annualTax.find((x) => x.year === year)?.ordinaryBusinessIncome || 0) }
      ], 'Gross vs OBI', true)
    };
  }, [data.financialHistory, data.annualTaxSummary]);

  const navItems = [
    ['overview', 'Overview'],
    ['projects', 'Projects'],
    ['consultants', 'Consultants'],
    ['financials', 'Financials']
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="eyebrow">SGA Owner View</div>
          <h1>Operating Dashboard</h1>
          <p>Live Google Sheet dashboard for projects, consultant commitments, financial history, and annual S-corp tax summary.</p>
        </div>

        <nav className="nav-links">
          {navItems.map(([key, label]) => (
            <button key={key} className={`nav-link ${view === key ? 'active' : ''}`} onClick={() => setView(key)}>{label}</button>
          ))}
        </nav>

        <div className="sidebar-footnote">
          Phase order is fixed as SD, DD, CD, BN, CA.
        </div>
      </aside>

      <main className="main-content">
        <div className="topbar">
          <div>
            <div className="eyebrow">Live view</div>
            <h2>{humanize(view)}</h2>
          </div>
          <div>
            <button className="button-secondary" onClick={loadData}>{loading ? 'Loading…' : 'Refresh data'}</button>
          </div>
        </div>

        {alert ? <div className="alert">{alert}</div> : null}

        <section className={`view ${view === 'overview' ? 'active' : ''}`}>
          <div className="kpi-grid">
            {overview.kpis.map((kpi) => <KpiCard key={kpi.title} {...kpi} />)}
          </div>
          <div className="chart-grid two-up">
            <ChartPanel title="Project Status" chartRef={statusChartRef} config={overview.status} />
            <ChartPanel title="Billing Health" chartRef={billingChartRef} config={overview.billing} />
            <ChartPanel title="Projects by Lead" chartRef={leadChartRef} config={overview.lead} />
            <ChartPanel title="Projects by Phase" chartRef={phaseChartRef} config={overview.phase} />
          </div>
        </section>

        <section className={`view ${view === 'projects' ? 'active' : ''}`}>
          <div className="kpi-grid">
            {projectsView.kpis.map((kpi) => <KpiCard key={kpi.title} {...kpi} />)}
          </div>
          <div className="inline-controls">
            <input type="search" placeholder="Search by job number, project, client, or lead" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <section className="panel table-panel">
            <h3>Project Log</h3>
            <DataTable
              columns={['jobNumber', 'jobName', 'client', 'projectType', 'lead', 'phase', 'status', 'billingHealth', 'contractAmount', 'totalBilled', 'totalCollected', 'remainingToBill']}
              rows={projectsView.rows}
              formatters={{
                contractAmount: (v) => formatCurrency(v),
                totalBilled: (v) => formatCurrency(v),
                totalCollected: (v) => formatCurrency(v),
                remainingToBill: (v) => formatCurrency(v)
              }}
              badgeColumns={['phase', 'status', 'billingHealth']}
            />
          </section>
        </section>

        <section className={`view ${view === 'consultants' ? 'active' : ''}`}>
          <div className="kpi-grid">
            {consultantsView.kpis.map((kpi) => <KpiCard key={kpi.title} {...kpi} />)}
          </div>
          <div className="chart-grid two-up">
            <ChartPanel title="Consultant Status" chartRef={consultantStatusChartRef} config={consultantsView.status} />
            <ChartPanel title="Fee by Discipline" chartRef={consultantDisciplineChartRef} config={consultantsView.discipline} />
          </div>
          <section className="panel table-panel">
            <h3>Consultant Log</h3>
            <DataTable
              columns={['project', 'consultant', 'discipline', 'status', 'fee', 'paid', 'balance']}
              rows={data.consultants}
              formatters={{ fee: (v) => formatCurrency(v), paid: (v) => formatCurrency(v), balance: (v) => formatCurrency(v) }}
              badgeColumns={['status']}
            />
          </section>
        </section>

        <section className={`view ${view === 'financials' ? 'active' : ''}`}>
          <div className="kpi-grid">
            {financialView.kpis.map((kpi) => <KpiCard key={kpi.title} {...kpi} />)}
          </div>
          <div className="chart-grid two-up">
            <ChartPanel title="Quarterly Gross Revenue" chartRef={quarterlyGrossChartRef} config={financialView.quarterlyGross} />
            <ChartPanel title="Annual Gross Revenue" chartRef={annualGrossChartRef} config={financialView.annualGross} />
            <ChartPanel title="Ordinary Business Income" chartRef={obiChartRef} config={financialView.obi} note="Ordinary Business Income is based on filed S-corporation tax returns and may differ from internal management reporting." />
            <ChartPanel title="Gross Revenue vs OBI" chartRef={grossVsObiChartRef} config={financialView.grossVsObi} />
          </div>
        </section>

        <div className="note" style={{ marginTop: '18px' }}>{lastUpdated}</div>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
