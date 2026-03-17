const CONFIG = window.DASHBOARD_CONFIG || { dataSources: {}, phaseOrder: ['SD', 'DD', 'CD', 'BN', 'CA'], currency: 'USD' };
const charts = {};
const state = {
  projects: [],
  consultants: [],
  financialHistory: [],
  annualTaxSummary: [],
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
    startDate: ['startdate', 'start_date', 'start'],
  },
  consultants: {
    project: ['project', 'jobname', 'job_name'],
    consultant: ['consultant', 'consultantname', 'name'],
    discipline: ['discipline', 'type', 'consultanttype'],
    status: ['status'],
    fee: ['fee', 'consultantfee', 'contractamount', 'amount'],
    paid: ['paid', 'totalpaid'],
    balance: ['balance', 'remaining', 'unpaid'],
  },
  financialHistory: {
    year: ['year'],
    quarter: ['quarter'],
    grossRevenue: ['grossrevenue', 'gross_revenue', 'gross'],
    notes: ['notes', 'note'],
  },
  annualTaxSummary: {
    year: ['year'],
    ordinaryBusinessIncome: ['ordinarybusinessincome', 'ordinary_business_income', 'obi'],
    notes: ['notes', 'note'],
  }
};

function normalizeHeader(value) {
  return String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function normalizeRow(row, schemaName) {
  const schema = aliases[schemaName];
  const normalized = {};
  const normalizedRow = Object.fromEntries(Object.entries(row).map(([k, v]) => [normalizeHeader(k), v]));

  for (const [target, possible] of Object.entries(schema)) {
    const match = possible.find(key => Object.prototype.hasOwnProperty.call(normalizedRow, normalizeHeader(key)));
    normalized[target] = match ? normalizedRow[normalizeHeader(match)] : '';
  }
  return normalized;
}

function parseCurrency(value) {
  if (value === null || value === undefined || value === '') return 0;
  const cleaned = String(value).replace(/[$,()%\s]/g, '').trim();
  if (!cleaned) return 0;
  const negative = String(value).includes('(') && String(value).includes(')');
  const num = Number(cleaned);
  return Number.isFinite(num) ? (negative ? -num : num) : 0;
}

function parseInteger(value) {
  const num = Number(String(value || '').trim());
  return Number.isFinite(num) ? num : 0;
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: CONFIG.currency || 'USD', maximumFractionDigits: 0 }).format(value || 0);
}

function formatCompactCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: CONFIG.currency || 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(value || 0);
}

function formatNumber(value) {
  return new Intl.NumberFormat('en-US').format(value || 0);
}

function showAlert(message) {
  const el = document.getElementById('globalAlert');
  el.textContent = message;
  el.classList.remove('hidden');
}

function clearAlert() {
  document.getElementById('globalAlert').classList.add('hidden');
}

async function fetchCsv(url) {
  if (!url) return [];
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Failed to load ${url}`);
  const csv = await response.text();
  const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true });
  if (parsed.errors?.length) {
    console.warn(parsed.errors);
  }
  return parsed.data;
}

async function loadAllData() {
  clearAlert();
  const issues = [];
  const sources = CONFIG.dataSources || {};

  const jobs = [
    ['projects', sources.projects],
    ['consultants', sources.consultants],
    ['financialHistory', sources.financialHistory],
    ['annualTaxSummary', sources.annualTaxSummary]
  ];

  for (const [key, url] of jobs) {
    try {
      const raw = await fetchCsv(url);
      state[key] = raw.map(row => normalizeRow(row, key));
    } catch (error) {
      state[key] = [];
      issues.push(`${key} did not load`);
      console.error(error);
    }
  }

  if (!sources.projects) {
    issues.unshift('Projects CSV URL is not set in config.js');
  }

  if (issues.length) {
    showAlert(`Data warning: ${issues.join(' · ')}`);
  }

  preprocessData();
  renderAll();
}

function preprocessData() {
  state.projects = state.projects.map(row => ({
    ...row,
    contractAmount: parseCurrency(row.contractAmount),
    totalBilled: parseCurrency(row.totalBilled),
    totalCollected: parseCurrency(row.totalCollected),
    remainingToBill: parseCurrency(row.remainingToBill),
    phase: String(row.phase || '').trim().toUpperCase(),
  }));

  state.consultants = state.consultants.map(row => ({
    ...row,
    fee: parseCurrency(row.fee),
    paid: parseCurrency(row.paid),
    balance: parseCurrency(row.balance),
  }));

  state.financialHistory = state.financialHistory
    .map(row => ({
      ...row,
      year: parseInteger(row.year),
      quarter: String(row.quarter || '').trim().toUpperCase(),
      grossRevenue: parseCurrency(row.grossRevenue),
    }))
    .filter(row => row.year && row.quarter);

  state.annualTaxSummary = state.annualTaxSummary
    .map(row => ({
      ...row,
      year: parseInteger(row.year),
      ordinaryBusinessIncome: parseCurrency(row.ordinaryBusinessIncome),
    }))
    .filter(row => row.year);

  state.financialHistory.sort((a, b) => (a.year - b.year) || (quarterOrder(a.quarter) - quarterOrder(b.quarter)));
  state.annualTaxSummary.sort((a, b) => a.year - b.year);
}

function quarterOrder(q) {
  return ['Q1', 'Q2', 'Q3', 'Q4'].indexOf(q);
}

function makeKpiCard(title, value, subtext = '') {
  return `<div class="kpi-card"><h3>${title}</h3><div class="value">${value}</div><div class="subtext">${subtext}</div></div>`;
}

function renderAll() {
  renderOverview();
  renderProjects();
  renderConsultants();
  renderFinancials();
  document.getElementById('lastUpdated').textContent = `Updated ${new Date().toLocaleString()}`;
}

function renderOverview() {
  const projects = state.projects;
  const activeStatuses = new Set(['active', 'in progress', 'underway', 'current']);
  const activeProjects = projects.filter(p => activeStatuses.has(String(p.status || '').trim().toLowerCase())).length;
  const totalContract = projects.reduce((sum, p) => sum + p.contractAmount, 0);
  const totalBilled = projects.reduce((sum, p) => sum + p.totalBilled, 0);
  const totalCollected = projects.reduce((sum, p) => sum + p.totalCollected, 0);
  const remainingToBill = projects.reduce((sum, p) => sum + p.remainingToBill, 0);

  document.getElementById('overviewKpis').innerHTML = [
    makeKpiCard('Total Projects', formatNumber(projects.length), 'All rows in the projects log'),
    makeKpiCard('Active Projects', formatNumber(activeProjects), 'Based on active-style status labels'),
    makeKpiCard('Contract Value', formatCompactCurrency(totalContract), 'Total contract amount'),
    makeKpiCard('Total Billed', formatCompactCurrency(totalBilled), 'Cumulative billed'),
    makeKpiCard('Total Collected', formatCompactCurrency(totalCollected), 'Cumulative collected'),
    makeKpiCard('Remaining to Bill', formatCompactCurrency(remainingToBill), 'Unbilled contract balance'),
  ].join('');

  const byStatus = countBy(projects, 'status');
  const byBilling = countBy(projects, 'billingHealth');
  const byLead = countBy(projects, 'lead', 8);

  const phaseMap = new Map(CONFIG.phaseOrder.map(phase => [phase, 0]));
  projects.forEach(project => {
    if (phaseMap.has(project.phase)) phaseMap.set(project.phase, phaseMap.get(project.phase) + 1);
  });

  renderChart('statusChart', 'doughnut', byStatus.labels, byStatus.values);
  renderChart('billingHealthChart', 'doughnut', byBilling.labels, byBilling.values);
  renderChart('leadChart', 'bar', byLead.labels, byLead.values);
  renderChart('phaseChart', 'bar', CONFIG.phaseOrder, CONFIG.phaseOrder.map(phase => phaseMap.get(phase) || 0));
}

function renderProjects() {
  const projects = state.projects;
  const activeStatuses = new Set(['active', 'in progress', 'underway', 'current']);
  const projectsInCA = projects.filter(p => p.phase === 'CA').length;
  const avgCollectionRate = projects.length
    ? projects.reduce((sum, p) => sum + (p.totalBilled ? (p.totalCollected / p.totalBilled) : 0), 0) / projects.length
    : 0;

  document.getElementById('projectKpis').innerHTML = [
    makeKpiCard('Current CA Projects', formatNumber(projectsInCA), 'Projects currently in construction administration'),
    makeKpiCard('Average Collection Rate', `${Math.round(avgCollectionRate * 100)}%`, 'Collected ÷ billed across all projects'),
    makeKpiCard('High-Risk Billing Count', formatNumber(projects.filter(p => String(p.billingHealth || '').toLowerCase().includes('risk')).length), 'Rows tagged as risk in billing health'),
    makeKpiCard('Active Status Count', formatNumber(projects.filter(p => activeStatuses.has(String(p.status || '').trim().toLowerCase())).length), 'Based on project status'),
  ].join('');

  renderTable(
    'projectsTable',
    ['jobNumber', 'jobName', 'client', 'projectType', 'lead', 'phase', 'status', 'billingHealth', 'contractAmount', 'totalBilled', 'totalCollected', 'remainingToBill'],
    projects,
    { contractAmount: formatCurrency, totalBilled: formatCurrency, totalCollected: formatCurrency, remainingToBill: formatCurrency }
  );

  document.getElementById('projectSearch').addEventListener('input', (event) => {
    const query = event.target.value.trim().toLowerCase();
    const filtered = !query ? projects : projects.filter(project =>
      ['jobNumber', 'jobName', 'client', 'lead'].some(key => String(project[key] || '').toLowerCase().includes(query))
    );
    renderTable(
      'projectsTable',
      ['jobNumber', 'jobName', 'client', 'projectType', 'lead', 'phase', 'status', 'billingHealth', 'contractAmount', 'totalBilled', 'totalCollected', 'remainingToBill'],
      filtered,
      { contractAmount: formatCurrency, totalBilled: formatCurrency, totalCollected: formatCurrency, remainingToBill: formatCurrency }
    );
  }, { once: true });
}

function renderConsultants() {
  const consultants = state.consultants;
  const totalFee = consultants.reduce((sum, row) => sum + row.fee, 0);
  const totalPaid = consultants.reduce((sum, row) => sum + row.paid, 0);
  const totalBalance = consultants.reduce((sum, row) => sum + row.balance, 0);

  document.getElementById('consultantKpis').innerHTML = [
    makeKpiCard('Consultant Rows', formatNumber(consultants.length), 'All rows in the consultant log'),
    makeKpiCard('Total Consultant Fee', formatCompactCurrency(totalFee), 'Total committed consultant fee'),
    makeKpiCard('Total Paid', formatCompactCurrency(totalPaid), 'Paid to date'),
    makeKpiCard('Open Consultant Balance', formatCompactCurrency(totalBalance), 'Remaining consultant balance'),
  ].join('');

  const byStatus = countBy(consultants, 'status');
  const byDisciplineFee = sumBy(consultants, 'discipline', 'fee');
  renderChart('consultantStatusChart', 'doughnut', byStatus.labels, byStatus.values);
  renderChart('consultantDisciplineChart', 'bar', byDisciplineFee.labels, byDisciplineFee.values);

  renderTable(
    'consultantsTable',
    ['project', 'consultant', 'discipline', 'status', 'fee', 'paid', 'balance'],
    consultants,
    { fee: formatCurrency, paid: formatCurrency, balance: formatCurrency }
  );
}

function renderFinancials() {
  const history = [...state.financialHistory].sort((a, b) => (a.year - b.year) || (quarterOrder(a.quarter) - quarterOrder(b.quarter)));
  const annualTax = [...state.annualTaxSummary].sort((a, b) => a.year - b.year);
  const annualGrossMap = new Map();
  history.forEach(row => annualGrossMap.set(row.year, (annualGrossMap.get(row.year) || 0) + row.grossRevenue));
  const annualGross = [...annualGrossMap.entries()].sort((a, b) => a[0] - b[0]);
  const latest4Q = history.slice(-4).reduce((sum, row) => sum + row.grossRevenue, 0);
  const bestQuarter = history.reduce((best, row) => !best || row.grossRevenue > best.grossRevenue ? row : best, null);
  const bestYear = annualGross.reduce((best, row) => !best || row[1] > best[1] ? row : best, null);
  const latestObi = annualTax[annualTax.length - 1];

  document.getElementById('financialKpis').innerHTML = [
    makeKpiCard('Highest Quarter', bestQuarter ? formatCompactCurrency(bestQuarter.grossRevenue) : '$0', bestQuarter ? `${bestQuarter.year} ${bestQuarter.quarter}` : 'No data'),
    makeKpiCard('Highest Gross Year', bestYear ? formatCompactCurrency(bestYear[1]) : '$0', bestYear ? `${bestYear[0]}` : 'No data'),
    makeKpiCard('Trailing 4-Quarter Gross', formatCompactCurrency(latest4Q), 'Most recent four quarters'),
    makeKpiCard('Latest OBI', latestObi ? formatCompactCurrency(latestObi.ordinaryBusinessIncome) : '$0', latestObi ? `${latestObi.year}` : 'No data'),
  ].join('');

  renderChart('quarterlyGrossChart', 'line', history.map(r => `${r.year}-${r.quarter}`), history.map(r => r.grossRevenue));
  renderChart('annualGrossChart', 'bar', annualGross.map(r => String(r[0])), annualGross.map(r => r[1]));
  renderChart('obiChart', 'bar', annualTax.map(r => String(r.year)), annualTax.map(r => r.ordinaryBusinessIncome));

  const overlapYears = annualTax.filter(item => annualGrossMap.has(item.year)).map(item => item.year);
  renderMultiSeriesChart(
    'grossVsObiChart',
    overlapYears.map(String),
    [
      { label: 'Annual Gross Revenue', data: overlapYears.map(year => annualGrossMap.get(year) || 0) },
      { label: 'Ordinary Business Income', data: overlapYears.map(year => annualTax.find(x => x.year === year)?.ordinaryBusinessIncome || 0) }
    ]
  );
}

function countBy(rows, key, limit = null) {
  const map = new Map();
  rows.forEach(row => {
    const label = String(row[key] || 'Unspecified').trim() || 'Unspecified';
    map.set(label, (map.get(label) || 0) + 1);
  });
  let entries = [...map.entries()].sort((a, b) => b[1] - a[1]);
  if (limit) entries = entries.slice(0, limit);
  return { labels: entries.map(x => x[0]), values: entries.map(x => x[1]) };
}

function sumBy(rows, groupKey, valueKey) {
  const map = new Map();
  rows.forEach(row => {
    const label = String(row[groupKey] || 'Unspecified').trim() || 'Unspecified';
    map.set(label, (map.get(label) || 0) + (row[valueKey] || 0));
  });
  const entries = [...map.entries()].sort((a, b) => b[1] - a[1]);
  return { labels: entries.map(x => x[0]), values: entries.map(x => x[1]) };
}

function renderTable(tableId, columns, rows, formatters = {}) {
  const table = document.getElementById(tableId);
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');

  thead.innerHTML = `<tr>${columns.map(col => `<th>${humanize(col)}</th>`).join('')}</tr>`;
  tbody.innerHTML = rows.length ? rows.map(row => `
    <tr>
      ${columns.map(col => {
        const value = row[col];
        const rendered = formatters[col] ? formatters[col](value) : value || '';
        if (['phase', 'status', 'billingHealth'].includes(col) && value) {
          return `<td><span class="badge">${rendered}</span></td>`;
        }
        return `<td>${rendered}</td>`;
      }).join('')}
    </tr>`).join('') : `<tr><td colspan="${columns.length}">No data loaded.</td></tr>`;
}

function humanize(text) {
  return String(text || '').replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()).trim();
}

function renderChart(canvasId, type, labels, data) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  if (charts[canvasId]) charts[canvasId].destroy();
  charts[canvasId] = new Chart(ctx, {
    type,
    data: { labels, datasets: [{ label: humanize(canvasId), data, borderWidth: 2, tension: 0.25 }] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: type !== 'bar' && type !== 'line' } },
      scales: type === 'doughnut' ? {} : {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => Math.abs(value) >= 1000 ? formatCompactCurrency(value) : value
          }
        }
      }
    }
  });
}

function renderMultiSeriesChart(canvasId, labels, datasets) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  if (charts[canvasId]) charts[canvasId].destroy();
  charts[canvasId] = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets: datasets.map(set => ({ ...set, borderWidth: 1 })) },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: true } },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: (value) => formatCompactCurrency(value) }
        }
      }
    }
  });
}

function bindNav() {
  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => link.addEventListener('click', () => {
    links.forEach(item => item.classList.remove('active'));
    document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
    link.classList.add('active');
    const view = link.dataset.view;
    document.getElementById(`view-${view}`).classList.add('active');
    document.getElementById('viewTitle').textContent = humanize(view);
  }));

  document.getElementById('refreshBtn').addEventListener('click', loadAllData);
}

bindNav();
loadAllData();
