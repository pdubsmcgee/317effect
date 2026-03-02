const path = window.location.pathname;

function normalizePath(input) {
  if (!input) return '/';
  const normalized = input.replace(/\/index\.html$/, '');
  if (normalized.length > 1 && normalized.endsWith('/')) return normalized.slice(0, -1);
  return normalized || '/';
}

const baseUrl = document.querySelector('meta[name="site-base"]')?.content || '/';

document.querySelectorAll('.links a').forEach((link) => {
  const href = link.getAttribute('href');
  if (!href) return;
  if (normalizePath(href) === normalizePath(path)) link.classList.add('active');
});

async function loadReports() {
  const reportsUrl = new URL('data/reports.json', window.location.origin + baseUrl);
  const res = await fetch(reportsUrl);
  if (!res.ok) throw new Error('Failed to load reports index');
  return res.json();
}

function formatDate(input) {
  return new Date(input).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

async function renderLatest() {
  const list = document.querySelector('[data-latest-reports]');
  if (!list) return;
  try {
    const reports = await loadReports();
    list.innerHTML = reports.slice(0, 3).map((report) => `
      <li class="report-item">
        <a href="/residue-reports/${report.slug}/">${report.title}</a>
        <div class="meta">${formatDate(report.date)} · ${report.timestamp} · ${report.severity}</div>
      </li>`).join('');
  } catch (error) {
    console.error(error);
    list.innerHTML = '<li class="meta">Report feed is temporarily unavailable.</li>';
  }
}

async function renderReportList() {
  const mount = document.querySelector('[data-report-list]');
  if (!mount) return;
  try {
    const reports = await loadReports();
    mount.innerHTML = reports.map((report) => `
      <article class="panel report-item">
        <div class="meta">${formatDate(report.date)} · ${report.timestamp}</div>
        <h3><a href="/residue-reports/${report.slug}/">${report.title}</a></h3>
        <p>${report.summary}</p>
        <div class="report-tags">
          <span class="badge ${report.severity}">${report.severity}</span>
          ${report.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}
        </div>
      </article>`).join('');
  } catch (error) {
    console.error(error);
    mount.innerHTML = '<article class="panel"><p class="meta">Unable to load report index right now. Please try again shortly.</p></article>';
  }
}

function setupMap() {
  const panel = document.querySelector('[data-map-detail]');
  if (!panel) return;
  const notes = {
    'Doorway Threshold': 'Threshold transitions often produce a brief intent cache miss. Observer note: pause and note your previous objective before crossing.',
    'Text Loop': 'Repeated line scanning may indicate delayed semantic commit. Observer note: mark the line and compare elapsed time perception.',
    'Object Misplacement': 'Item location drift can occur during minor world-state rebases. Observer note: document last confirmed placement and context.',
    'Name-Recall Delay': 'Transient lookup latency in autobiographical index. Observer note: capture recovery time and emotional baseline.',
    '3:17 Awakening': 'Common synchronization edge event when local patch queue flushes. Observer note: log environmental audio and dream continuity.'
  };

  document.querySelectorAll('[data-map-node]').forEach((button) => {
    button.addEventListener('click', () => {
      const key = button.dataset.mapNode;
      panel.textContent = notes[key] || 'No observation notes available.';
    });
  });
}

function setupStatus() {
  const clock = document.querySelector('[data-clock]');
  const countdown = document.querySelector('[data-countdown]');
  const banner = document.querySelector('[data-status-banner]');
  const latency = document.querySelector('[data-latency]');
  const density = document.querySelector('[data-density]');
  const log = document.querySelector('[data-system-log]');
  if (!clock || !countdown || !banner || !latency || !density || !log) return;

  const states = ['STABLE', 'DRIFTING', 'PATCH IN PROGRESS'];
  const logs = [
    'Observer relay verified baseline continuity.',
    'Doorway threshold anomalies below action limit.',
    'Narrative checksum mismatch auto-resolved.',
    'Echo packet delayed 230ms in sector local.',
    'Routine patch queue synchronized to 03:17 index.'
  ];

  function next317(now) {
    const next = new Date(now);
    next.setHours(3, 17, 0, 0);
    if (next <= now) next.setDate(next.getDate() + 1);
    return next;
  }

  setInterval(() => {
    const now = new Date();
    const marker = new Date(now);
    marker.setHours(3, 17, 0, 0);
    const diffMarker = Math.abs(now - marker) / 60000;

    clock.textContent = now.toLocaleTimeString();
    const target = next317(now);
    const diff = target - now;
    const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
    const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
    countdown.textContent = diffMarker <= 5 ? 'MAINTENANCE WINDOW ACTIVE' : `${h}:${m}:${s} until next 03:17`;

    banner.textContent = diffMarker <= 5 ? 'PATCH IN PROGRESS' : states[now.getSeconds() % states.length];
    banner.classList.toggle('active', diffMarker <= 5);

    latency.textContent = `${18 + Math.floor(Math.random() * 37)} ms`;
    density.textContent = `${0.42 + Math.random() * 0.5}`.slice(0, 4);

    if (now.getSeconds() % 4 === 0) {
      const p = document.createElement('p');
      p.textContent = `[${now.toLocaleTimeString()}] ${logs[Math.floor(Math.random() * logs.length)]}`;
      log.prepend(p);
      while (log.children.length > 6) log.removeChild(log.lastChild);
    }
  }, 1000);
}

renderLatest();
renderReportList();
setupMap();
setupStatus();
