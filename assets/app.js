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
    'Doorway Threshold': 'Threshold transitions can produce brief intent cache misses, especially during routine movement. Observer prompt: note objective before crossing, elapsed pause length, and what restored task memory.',
    'Text Loop': 'Repeated line scanning may indicate delayed semantic commit rather than visual failure. Observer prompt: mark the exact phrase, compare silent vs spoken reading, and record comprehension recovery trigger.',
    'Object Misplacement': 'Item location drift is usually reported after context switching between rooms or tasks. Observer prompt: document last confirmed placement, intermediary actions, and whether location was later validated.',
    'Name-Recall Delay': 'Transient lookup latency appears as a familiar-name stall with rapid recovery. Observer prompt: capture recovery time, emotional baseline, and whether a contextual cue resolved recall.',
    '3:17 Awakening': 'Common synchronization edge event when local patch queue flushes in the archive fiction model. Observer prompt: log ambient audio, first thought, dream continuity, and return-to-sleep latency.'
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

  const states = ['STABLE', 'MONITORING DRIFT', 'CALIBRATING', 'PATCH STAGING'];
  const logs = [
    'Observer relay verified baseline continuity.',
    'Doorway threshold anomalies below action limit.',
    'Narrative checksum mismatch auto-resolved.',
    'Echo packet delayed 230ms in sector local.',
    'Routine patch queue synchronized to 03:17 index.',
    'Cross-region drift estimate narrowed to ±3 minutes.',
    'Field annotation backlog reconciled with report index.',
    'Coffee ring detected on console B; no signal contamination observed.',
    'Two contradictory timestamps converged after context refresh.',
    'Ambient déjà vu elevated; advisory: label your tabs before the window.',
    'Mirror-node handshake completed with acceptable existential overhead.',
    'Mnemonic cache warmed and serving likely outcomes.'
  ];

  function next317(now) {
    const next = new Date(now);
    next.setHours(3, 17, 0, 0);
    if (next <= now) next.setDate(next.getDate() + 1);
    return next;
  }

  let currentStateIndex = 0;
  let stateCooldown = 0;
  let nextLogAt = 0;

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

    if (diffMarker <= 5) {
      banner.textContent = 'PATCH IN PROGRESS';
      banner.classList.add('active');
    } else {
      banner.classList.remove('active');
      if (stateCooldown <= 0) {
        currentStateIndex = (currentStateIndex + 1) % states.length;
        stateCooldown = 14;
      }
      banner.textContent = states[currentStateIndex];
      stateCooldown -= 1;
    }

    latency.textContent = `${18 + Math.floor(Math.random() * 37)} ms`;
    density.textContent = `${0.42 + Math.random() * 0.5}`.slice(0, 4);

    if (!nextLogAt || now.getTime() >= nextLogAt) {
      const p = document.createElement('p');
      p.textContent = `[${now.toLocaleTimeString()}] ${logs[Math.floor(Math.random() * logs.length)]}`;
      log.prepend(p);
      while (log.children.length > 10) log.removeChild(log.lastChild);
      nextLogAt = now.getTime() + (5000 + Math.floor(Math.random() * 5000));
    }
  }, 1000);
}

renderLatest();
renderReportList();
setupMap();
setupStatus();
