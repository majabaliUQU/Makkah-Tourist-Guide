/**
 * js/app.js
 * ─────────────────────────────────────────────
 * Application Controller
 * Manages state, orchestrates DB calls, wires
 * all events, and calls ui.js renderers.
 *
 * State shape:
 *   currentTab   — 'all' | 'favorites' | 'add'
 *   searchQuery  — string
 * ─────────────────────────────────────────────
 */

/* ── State ───────────────────────────────── */
let state = {
  currentTab:  'all',
  searchQuery: '',
};

/* ── DOM References ──────────────────────── */
const $statsBar  = () => document.getElementById('statsBar');
const $tabBtns   = () => document.querySelectorAll('.tab');
const $content   = () => document.getElementById('tabContent');

/* ── Tab Management ──────────────────────── */
function setTab(tab) {
  state.currentTab  = tab;
  state.searchQuery = '';
  render();
}

function syncTabUI() {
  const tabs = ['all', 'favorites', 'add'];
  $tabBtns().forEach((btn, i) => {
    btn.classList.toggle('tab--active', tabs[i] === state.currentTab);
    btn.setAttribute('aria-selected', tabs[i] === state.currentTab ? 'true' : 'false');
  });
}

/* ── Render ──────────────────────────────── */
async function render() {
  const [places, favs, notes] = await Promise.all([
    dbGetAll('places'),
    dbGetAll('favorites'),
    dbGetAll('notes'),
  ]);

  const favIds   = new Set(favs.map(f => f.id));
  const notesMap = Object.fromEntries(notes.map(n => [n.id, n.text]));

  /* Update stats */
  $statsBar().innerHTML = renderStats({
    totalPlaces: places.length,
    totalFavs:   favIds.size,
    totalNotes:  notes.length,
    userAdded:   places.filter(p => p.userAdded).length,
  });

  syncTabUI();

  /* Render tab content */
  if (state.currentTab === 'add') {
    $content().innerHTML = renderAddForm();
    bindAddForm();
    return;
  }

  let list = places;
  if (state.currentTab === 'favorites') {
    list = places.filter(p => favIds.has(p.id));
  }
  if (state.searchQuery) {
    const q = state.searchQuery;
    list = list.filter(p =>
      p.name.includes(q) || p.desc.includes(q) || p.category.includes(q)
    );
  }

  /* Search bar + grid */
  $content().innerHTML = `
    <div class="search-wrap" role="search">
      <span class="search-icon" aria-hidden="true">🔍</span>
      <input
        class="search-input"
        id="searchInput"
        type="search"
        placeholder="ابحث عن مكان بالاسم أو الفئة أو الوصف…"
        value="${state.searchQuery}"
        aria-label="بحث في الأماكن السياحية"
      />
    </div>
    ${renderPlacesGrid(list, favIds, notesMap, state.currentTab)}
  `;

  bindContentEvents();
}

/* ── Event Binding ───────────────────────── */

/** Bind events inside the dynamically rendered content area. */
function bindContentEvents() {
  const content = $content();

  /* Search input — debounced */
  const searchEl = document.getElementById('searchInput');
  if (searchEl) {
    let debounceTimer;
    searchEl.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        state.searchQuery = e.target.value.trim();
        render();
      }, 250);
    });
    /* Restore cursor/scroll to end */
    searchEl.focus();
    searchEl.setSelectionRange(searchEl.value.length, searchEl.value.length);
  }

  /* Favorite buttons (event delegation) */
  content.addEventListener('click', async (e) => {
    const favBtn  = e.target.closest('.fav-btn');
    const saveBtn = e.target.closest('[data-save]');

    if (favBtn) {
      const id = Number(favBtn.dataset.id);
      await toggleFavorite(id);
    }

    if (saveBtn) {
      const id     = Number(saveBtn.dataset.save);
      const noteEl = document.getElementById(`note-${id}`);
      if (noteEl) await saveNote(id, noteEl.value);
    }
  });
}

/** Bind Add Place form submit. */
function bindAddForm() {
  const btn = document.getElementById('submitAddBtn');
  if (!btn) return;
  btn.addEventListener('click', handleAddPlace);

  /* Allow Enter in name field to submit */
  const nameEl = document.getElementById('f-name');
  if (nameEl) {
    nameEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleAddPlace();
    });
    nameEl.focus();
  }
}

/* ── Actions ─────────────────────────────── */

async function toggleFavorite(id) {
  const favs  = await dbGetAll('favorites');
  const isFav = favs.some(f => f.id === id);
  if (isFav) await dbDelete('favorites', id);
  else       await dbPut('favorites', { id });
  render();
}

async function saveNote(id, text) {
  await dbPut('notes', { id, text });
  const msgEl = document.getElementById(`saved-${id}`);
  if (msgEl) {
    msgEl.style.display = 'block';
    setTimeout(() => { msgEl.style.display = 'none'; }, 2200);
  }
}

async function handleAddPlace() {
  const nameEl  = document.getElementById('f-name');
  const catEl   = document.getElementById('f-cat');
  const descEl  = document.getElementById('f-desc');
  const emojiEl = document.getElementById('f-emoji');
  const errEl   = document.getElementById('add-err');

  const name = nameEl?.value.trim();
  if (!name) {
    if (errEl) errEl.style.display = 'block';
    nameEl?.focus();
    return;
  }
  if (errEl) errEl.style.display = 'none';

  const newPlace = {
    id:        Date.now(),
    name,
    category:  catEl?.value || 'أخرى',
    desc:      descEl?.value.trim() || 'لا يوجد وصف متاح.',
    emoji:     emojiEl?.value.trim() || '📍',
    userAdded: true,
  };

  await dbPut('places', newPlace);
  setTab('all');
}

/* ── Tab click events ────────────────────── */
function bindTabEvents() {
  $tabBtns().forEach((btn, i) => {
    const tabs = ['all', 'favorites', 'add'];
    btn.addEventListener('click', () => setTab(tabs[i]));
  });
}

/* ── Init ────────────────────────────────── */
async function init() {
  await seedIfEmpty(DEFAULT_PLACES);
  bindTabEvents();
  render();
}

document.addEventListener('DOMContentLoaded', init);
