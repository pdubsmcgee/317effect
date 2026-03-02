import { reports } from '../data/reports.js';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setActiveNav() {
  const page = document.body.dataset.page;
  document.querySelectorAll('.nav-links a').forEach((link) => {
    if (link.dataset.page === page) link.classList.add('active');
  });
}

function applyStabilityIndex() {
  const meter = document.querySelector('[data-stability-meter]');
  const valueNode = document.querySelector('[data-stability-value]');
  if (!meter || !valueNode) return;

  const sessionKey = 'stabilityIndex';
  let value = Number(sessionStorage.getItem(sessionKey));
  if (!value) {
    value = 68 + Math.floor(Math.random() * 13) - 6;
    sessionStorage.setItem(sessionKey, String(value));
  }
  meter.value = value;
  valueNode.textContent = `${value}/100`;
}

function setupGapEvent() {
  if (reducedMotion || sessionStorage.getItem('gapPlayed')) return;
  const overlay = document.querySelector('.gap-overlay');
  if (!overlay) return;

  document.querySelectorAll('a[data-gap-link]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const href = link.getAttribute('href');
      overlay.style.transition = 'opacity 130ms ease';
      overlay.style.opacity = '0.9';
      setTimeout(() => {
        overlay.style.transition = 'opacity 170ms ease';
        overlay.style.opacity = '0';
      }, 150 + Math.random() * 220);
      setTimeout(() => {
        sessionStorage.setItem('gapPlayed', '1');
        window.location.href = href;
      }, 310);
    }, { once: true });
  });
}

function setupGlitch() {
  if (reducedMotion) return;
  const words = document.querySelectorAll('.glitch');
  words.forEach((word) => {
    if (Math.random() > 0.28) return;
    setInterval(() => {
      word.classList.add('active');
      setTimeout(() => word.classList.remove('active'), 140);
    }, 6000 + Math.random() * 9000);
  });
}

function setupReports() {
  const list = document.querySelector('[data-reports-list]');
  if (!list) return;
  const chipContainer = document.querySelector('[data-report-chips]');
  const randomButton = document.querySelector('[data-random-report]');
  const tags = ['all', ...new Set(reports.flatMap((item) => item.tags))];
  let activeTag = 'all';

  const render = () => {
    const items = reports.filter((item) => activeTag === 'all' || item.tags.includes(activeTag));
    list.innerHTML = items.map((item) => `
      <article>
        <p class="meta">${item.id} · ${item.date} · ${item.tags.join(' / ')}</p>
        <h3>${item.title}</h3>
        <p>${item.summary}</p>
      </article>
    `).join('');
  };

  chipContainer.innerHTML = tags.map((tag) =>
    `<button class="chip ${tag === 'all' ? 'active' : ''}" data-tag="${tag}">${tag}</button>`).join('');

  chipContainer.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) return;
    activeTag = target.dataset.tag || 'all';
    chipContainer.querySelectorAll('.chip').forEach((chip) => chip.classList.remove('active'));
    target.classList.add('active');
    render();
  });

  randomButton?.addEventListener('click', () => {
    const item = reports[Math.floor(Math.random() * reports.length)];
    activeTag = 'all';
    chipContainer.querySelectorAll('.chip').forEach((chip) => {
      chip.classList.toggle('active', chip.dataset.tag === 'all');
    });
    list.innerHTML = `
      <article>
        <p class="meta">${item.id} · ${item.date} · ${item.tags.join(' / ')}</p>
        <h3>${item.title}</h3>
        <p>${item.summary}</p>
      </article>
    `;
  });

  render();
}

setActiveNav();
applyStabilityIndex();
setupGapEvent();
setupGlitch();
setupReports();
