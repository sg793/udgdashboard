import React, { useEffect, useMemo, useState } from 'react';
import { FEEDS } from './feedConfig';

const appShell = {
  minHeight: '100vh',
  background: '#f3f4f6',
  color: '#111827',
  fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
};

const topBar = {
  padding: '20px 28px',
  borderBottom: '1px solid #e5e7eb',
  background: '#ffffff',
  position: 'sticky',
  top: 0,
  zIndex: 5,
};

const shellInner = {
  maxWidth: '1500px',
  margin: '0 auto',
  padding: '24px 28px 40px',
};

const card = {
  background: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: 16,
  boxShadow: '0 4px 16px rgba(17,24,39,0.04)',
};

const muted = '#6b7280';
const danger = '#b91c1c';

function safeNumber(value) {
  if (value === null || value === undefined || value === '') return 0;
  const cleaned = String(value).replace(/[$,%()\s,]/g, '').replace(/[—–-]+/g, '');
  if (!cleaned) return 0;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function normalizeKey(key) {
  return String(key || '')
    .trim()
    .replace(/^\ufeff/, '')
    .replace(/\s+/g, '')
    .toLowerCase();
}

function csvToRows(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        cell += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(cell);
      cell = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') i += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += char;
    }
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  if (!rows.length) return [];

  const headers = rows[0].map((header) => String(header || '').trim());
  return rows
    .slice(1)
    .filter((record) => record.some((value) => String(value || '').trim() !== ''))
    .map((record) => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = record[index] ?? '';
      });
      return obj;
    });
}

async function fetchCsv(url) {
  if (!url || url.startsWith('PASTE_YOUR_')) return [];
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Feed failed: ${response.status}`);
  const text = await response.text();
  return csvToRows(text);
}

function firstValue(row, options) {
  if (!row) return '';
  const entries = Object.entries(row);
  for (const option of options) {
    const target = normalizeKey(option);
    const match = entries.find(([key]) => normalizeKey(key) === target);
    if (match) return match[1];
  }
  return '';
}

function resolveMetricValue(rows, explicitKeys = []) {
  if (!rows.length) return 0;

  const priorityKeys = [
    ...explicitKeys,
    'value',
    'amount',
    'total',
    'sum',
    'metricValue',
    'metric',
  ];

  const firstRow = rows[0];
  const direct = firstValue(firstRow, priorityKeys);
  if (direct !== '') return safeNumber(direct);

  const numericValues = Object.values(firstRow)
    .map((value) => safeNumber(value))
    .filter((value) => value !== 0);

  return numericValues[0] ?? 0;
}

function DetailRow({ label, children }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <div style={{ fontWeight: 700 }}>{label}:</div>
      <div>{children || '—'}</div>
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div style={{ ...card, padding: 18 }}>
      <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em', color: muted, marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800 }}>{value}</div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('projects');
  const [loading, setLoading] = useState(true);
  const [loadErrors, setLoadErrors] = useState([]);
  const [projectsCore, setProjectsCore] = useState([]);
  const [consultants, setConsultants] = useState([]);
  const [projectsNotes, setProjectsNotes] = useState([]);
  const [currentReceivableRows, setCurrentReceivableRows] = useState([]);
  const [futureReceivableRows, setFutureReceivableRows] = useState([]);
  const [accountsPayableRows, setAccountsPayableRows] = useState([]);
  const [futurePayableRows, setFuturePayableRows] = useState([]);
  const [selectedJobNumber, setSelectedJobNumber] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadAll() {
      setLoading(true);
      const errors = [];

      async function loadOne(label, url, setter) {
        try {
          const rows = await fetchCsv(url);
          if (isMounted) setter(rows);
        } catch (error) {
          errors.push(`${label}: ${error.message}`);
          if (isMounted) setter([]);
        }
      }

      await Promise.all([
        loadOne('projectsCore', FEEDS.projectsCore, setProjectsCore),
        loadOne('consultants', FEEDS.consultants, setConsultants),
        loadOne('projectsNotes', FEEDS.projectsNotes, setProjectsNotes),
        loadOne('currentReceivable', FEEDS.currentReceivable, setCurrentReceivableRows),
        loadOne('futureReceivable', FEEDS.futureReceivable, setFutureReceivableRows),
        loadOne('accountsPayable', FEEDS.accountsPayable, setAccountsPayableRows),
        loadOne('futurePayable', FEEDS.futurePayable, setFuturePayableRows),
      ]);

      if (isMounted) {
        setLoadErrors(errors);
        setLoading(false);
      }
    }

    loadAll();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedJobNumber && projectsCore.length) {
      const first = firstValue(projectsCore[0], ['jobNumber', 'jobnumber']);
      setSelectedJobNumber(first);
    }
  }, [projectsCore, selectedJobNumber]);

  const filteredProjects = useMemo(() => {
    const term = search.trim().toLowerCase();
    return projectsCore.filter((row) => {
      if (!term) return true;
      const haystack = [
        firstValue(row, ['jobNumber', 'jobnumber']),
        firstValue(row, ['jobName', 'jobname']),
        firstValue(row, ['client']),
        firstValue(row, ['status']),
        firstValue(row, ['phase']),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(term);
    });
  }, [projectsCore, search]);

  const selectedProject = useMemo(() => {
    return (
      projectsCore.find(
        (row) =>
          String(firstValue(row, ['jobNumber', 'jobnumber'])).trim() === String(selectedJobNumber).trim()
      ) || filteredProjects[0] || null
    );
  }, [projectsCore, filteredProjects, selectedJobNumber]);

  const selectedProjectJobNumber = firstValue(selectedProject, ['jobNumber', 'jobnumber']);

  const selectedNote = useMemo(() => {
    return (
      projectsNotes.find(
        (row) =>
          String(firstValue(row, ['jobNumber', 'jobnumber'])).trim() === String(selectedProjectJobNumber).trim()
      ) || null
    );
  }, [projectsNotes, selectedProjectJobNumber]);

  const projectConsultants = useMemo(() => {
    if (!selectedProjectJobNumber) return [];
    return consultants.filter(
      (row) =>
        String(firstValue(row, ['jobNumber', 'jobnumber'])).trim() === String(selectedProjectJobNumber).trim()
    );
  }, [consultants, selectedProjectJobNumber]);

  const visibleContracts = useMemo(() => {
    return projectsCore.reduce((sum, row) => {
      return sum + safeNumber(firstValue(row, ['contractAmount', 'contractamount', 'visibleContracts', 'visiblecontracts']));
    }, 0);
  }, [projectsCore]);

  const currentReceivable = useMemo(
    () => resolveMetricValue(currentReceivableRows, ['currentReceivable', 'currentreceivable']),
    [currentReceivableRows]
  );
  const futureReceivable = useMemo(
    () => resolveMetricValue(futureReceivableRows, ['futureReceivable', 'futurereceivable']),
    [futureReceivableRows]
  );
  const accountsPayable = useMemo(
    () => resolveMetricValue(accountsPayableRows, ['accountsPayable', 'accountspayable']),
    [accountsPayableRows]
  );
  const futurePayable = useMemo(
    () => resolveMetricValue(futurePayableRows, ['futurePayable', 'futurepayable']),
    [futurePayableRows]
  );

  const currentNotes = String(firstValue(selectedNote, ['notes']) || '').trim();
  const estimatedDuration = String(firstValue(selectedProject, ['estimatedDuration', 'estimatedduration']) || '').trim();

  return (
    <div style={appShell}>
      <div style={topBar}>
        <div style={{ maxWidth: '1500px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: muted, marginBottom: 6 }}>
              Sam Garcia Architect
            </div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>SGA Operating Dashboard</div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {[
              ['projects', 'Projects'],
              ['financial', 'Financial'],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                style={{
                  border: activeTab === key ? '1px solid #111827' : '1px solid #d1d5db',
                  background: activeTab === key ? '#111827' : '#ffffff',
                  color: activeTab === key ? '#ffffff' : '#111827',
                  borderRadius: 999,
                  padding: '10px 16px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={shellInner}>
        {loadErrors.length > 0 && (
          <div style={{ ...card, padding: 16, marginBottom: 18, borderColor: '#f59e0b', background: '#fffbeb' }}>
            <div style={{ fontWeight: 800, marginBottom: 6 }}>Feed warning</div>
            <div style={{ color: '#92400e', lineHeight: 1.5 }}>
              One or more feeds did not load. The notes feed is wired. The other feed URLs may need to match your existing published CSV links.
            </div>
            <div style={{ color: '#92400e', fontSize: 13, marginTop: 8, whiteSpace: 'pre-wrap' }}>{loadErrors.join('\n')}</div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div style={{ display: 'grid', gridTemplateColumns: '380px minmax(0, 1fr)', gap: 20 }}>
            <div style={{ ...card, padding: 16, alignSelf: 'start' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, gap: 12 }}>
                <div style={{ fontSize: 18, fontWeight: 800 }}>Projects</div>
                <div style={{ fontSize: 13, color: muted }}>{filteredProjects.length} visible</div>
              </div>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by job, client, phase, or status"
                style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: 12, border: '1px solid #d1d5db', marginBottom: 14 }}
              />
              <div style={{ display: 'grid', gap: 10, maxHeight: '72vh', overflow: 'auto', paddingRight: 4 }}>
                {filteredProjects.map((row) => {
                  const jobNumber = firstValue(row, ['jobNumber', 'jobnumber']);
                  const jobName = firstValue(row, ['jobName', 'jobname']) || 'Untitled Project';
                  const client = firstValue(row, ['client']) || '—';
                  const phase = firstValue(row, ['phase']) || '—';
                  const status = firstValue(row, ['status']) || '—';
                  const isActive = String(jobNumber) === String(selectedProjectJobNumber);

                  return (
                    <button
                      type="button"
                      key={`${jobNumber}-${jobName}`}
                      onClick={() => setSelectedJobNumber(jobNumber)}
                      style={{
                        textAlign: 'left',
                        padding: 14,
                        borderRadius: 14,
                        border: isActive ? '1px solid #111827' : '1px solid #e5e7eb',
                        background: isActive ? '#f9fafb' : '#ffffff',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ fontSize: 12, color: muted, marginBottom: 5 }}>{jobNumber || '—'}</div>
                      <div style={{ fontWeight: 800, marginBottom: 6 }}>{jobName}</div>
                      <div style={{ fontSize: 13, color: muted, marginBottom: 8 }}>{client}</div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 12, background: '#eef2ff', color: '#3730a3', padding: '4px 8px', borderRadius: 999 }}>{phase}</span>
                        <span style={{ fontSize: 12, background: '#f3f4f6', color: '#374151', padding: '4px 8px', borderRadius: 999 }}>{status}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'grid', gap: 20, alignSelf: 'start' }}>
              <div style={{ ...card, padding: 22 }}>
                {selectedProject ? (
                  <>
                    <div style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: muted, marginBottom: 6 }}>
                      Project Detail
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.1, marginBottom: 6 }}>
                          {firstValue(selectedProject, ['jobName', 'jobname']) || 'Untitled Project'}
                        </div>
                        <div style={{ color: muted, fontSize: 16, marginBottom: 14 }}>
                          {firstValue(selectedProject, ['client']) || '—'}
                        </div>

                        <div style={{ marginBottom: 14 }}>
                          <div style={{ fontSize: 12, fontWeight: 800, color: danger, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                            Current Notes
                          </div>
                          <div style={{ color: danger, lineHeight: 1.6, whiteSpace: 'pre-wrap', minHeight: 24 }}>
                            {currentNotes || '—'}
                          </div>
                        </div>

                        <div style={{ display: 'grid', gap: 8 }}>
                          <DetailRow label="Job Number">{firstValue(selectedProject, ['jobNumber', 'jobnumber']) || '—'}</DetailRow>
                          <DetailRow label="Project Type">{firstValue(selectedProject, ['projectType', 'projecttype']) || '—'}</DetailRow>
                          <DetailRow label="Lead">{firstValue(selectedProject, ['lead']) || '—'}</DetailRow>
                          <DetailRow label="Phase">{firstValue(selectedProject, ['phase']) || '—'}</DetailRow>
                          <DetailRow label="Status">{firstValue(selectedProject, ['status']) || '—'}</DetailRow>
                          <DetailRow label="Project Age">
                            {firstValue(selectedProject, ['projectAge', 'monthsActive', 'projectage', 'monthsactive']) || '—'}
                            {estimatedDuration ? ` (${estimatedDuration})` : ''}
                          </DetailRow>
                        </div>
                      </div>

                      <div style={{ minWidth: 260, display: 'grid', gap: 12 }}>
                        <MetricCard label="Contract Amount" value={formatCurrency(safeNumber(firstValue(selectedProject, ['contractAmount', 'contractamount'])))} />
                        <MetricCard label="Remaining To Bill" value={formatCurrency(safeNumber(firstValue(selectedProject, ['remainingToBill', 'remainingtobill'])))} />
                      </div>
                    </div>
                  </>
                ) : (
                  <div>No project data loaded.</div>
                )}
              </div>

              <div style={{ ...card, padding: 22 }}>
                <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 14 }}>Consultants</div>
                {projectConsultants.length ? (
                  <div style={{ display: 'grid', gap: 10 }}>
                    {projectConsultants.map((row, index) => (
                      <div key={`${index}-${firstValue(row, ['consultantName', 'consultantname'])}`} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                          <div>
                            <div style={{ fontWeight: 800 }}>{firstValue(row, ['consultantName', 'consultantname']) || 'Unnamed Consultant'}</div>
                            <div style={{ color: muted, fontSize: 13 }}>{firstValue(row, ['trade']) || '—'}</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 700 }}>{formatCurrency(safeNumber(firstValue(row, ['contractAmount', 'contractamount'])))}</div>
                            <div style={{ color: muted, fontSize: 13 }}>Consultant Contract</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ color: muted }}>No consultants found for this project.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'financial' && (
          <div style={{ display: 'grid', gap: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 16 }}>
              <MetricCard label="Visible Contracts" value={formatCurrency(visibleContracts)} />
              <MetricCard label="Current Receivable" value={formatCurrency(currentReceivable)} />
              <MetricCard label="Future Receivable" value={formatCurrency(futureReceivable)} />
              <MetricCard label="Accounts Payable" value={formatCurrency(accountsPayable)} />
              <MetricCard label="Future Payable" value={formatCurrency(futurePayable)} />
            </div>

            <div style={{ ...card, padding: 22 }}>
              <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>Financial feed status</div>
              <div style={{ color: muted, lineHeight: 1.6 }}>
                This package removes the duplicate cards and replaces them with Future Receivable and Future Payable. If the metric cards show zeroes after deployment, the feed URLs in <code>src/feedConfig.js</code> do not yet match your live published CSV feeds.
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div style={{ marginTop: 16, color: muted }}>Loading dashboard feeds…</div>
        )}
      </div>
    </div>
  );
}
