/* ----------------------------------------------------------------------------
   audience-picker.js — "who can use this", one Teams-and-Users control for the whole platform

   const p = AudiencePicker.create(mountEl, {
     directory: { teams: [{id, name, members:[personId]}], people: [{id, name, email, title}] },
     value:     { teams: [teamId], people: [personId] },
     feature:   'Meetings',               // used in copy: "Who can use Meetings"
     onChange:  value => {},
   });
   p.getValue()  p.setValue(v)  p.open(tab)  p.close()  p.validate()  p.reach()

   Behaviour (each item fixes something in the source frames, section 8324:361899):
   - ONE field for teams and users. The frames split them into "Teams" and a
     mislabelled "Category*" field, so the admin had to know in advance which
     list a person lived in.
   - Filter tabs All / Teams / Users / Selected (n) — the Selected view is the
     only way to audit a long selection without scrolling every row.
   - A person already covered by a selected team is shown checked-but-muted with
     "via <Team>", so nobody gets added twice and the admin sees why.
   - Teams expand in place to show who is in them (frames: "17 Users" on every
     row, no way to look inside).
   - Selected rows are pinned to the top when the menu opens (snapshot, so rows
     never jump while you click).
   - Paste a list of emails/names to bulk-add.
   - Keyboard: ↑ ↓ move, Enter/Space toggle, → / ← expand a team, Esc close,
     Backspace in an empty search removes the last pick.
   - Field keeps one line; overflow collapses to "+N", which opens the Selected
     view instead of being a dead label.
   - Reach summary under the field; "See all N" opens the Selected tab.
   - Every removal is undoable from a toast.
---------------------------------------------------------------------------- */
(function () {
  'use strict';

  // Icons — paths copied from shared/svg-icons and the frame's own exports
  // (check 7209:26658, user-01z 72617:70514); stroke switched to currentColor.
  const I = {
    users: '<svg viewBox="0 0 14 14" fill="none"><path d="M12.8333 12.25V11.0833C12.8333 9.99609 12.0897 9.08253 11.0833 8.82351M9.04167 1.91961C9.89678 2.26575 10.5 3.1041 10.5 4.08333C10.5 5.06257 9.89678 5.90091 9.04167 6.24706M9.91667 12.25C9.91667 11.1628 9.91667 10.6192 9.73905 10.1904C9.50223 9.61867 9.04799 9.16443 8.47626 8.92761C8.04746 8.75 7.50386 8.75 6.41667 8.75H4.66667C3.57947 8.75 3.03587 8.75 2.60707 8.92761C2.03534 9.16443 1.5811 9.61867 1.34428 10.1904C1.16667 10.6192 1.16667 11.1628 1.16667 12.25M7.875 4.08333C7.875 5.372 6.83033 6.41667 5.54167 6.41667C4.253 6.41667 3.20833 5.372 3.20833 4.08333C3.20833 2.79467 4.253 1.75 5.54167 1.75C6.83033 1.75 7.875 2.79467 7.875 4.08333Z" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    x: '<svg viewBox="0 0 16 16" fill="none"><path d="M11.3333 4.66667L4.66667 11.3333M4.66667 4.66667L11.3333 11.3333" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    search: '<svg viewBox="0 0 14 14" fill="none"><path d="M12.25 12.25L9.7125 9.7125M11.0833 6.41667C11.0833 8.994 8.994 11.0833 6.41667 11.0833C3.83934 11.0833 1.75 8.994 1.75 6.41667C1.75 3.83934 3.83934 1.75 6.41667 1.75C8.994 1.75 11.0833 3.83934 11.0833 6.41667Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chevDown: '<svg viewBox="0 0 16 16" fill="none"><path d="M6 6.52881L8.19157 9.19548L10.3333 6.52881" stroke="currentColor" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chevRight: '<svg viewBox="0 0 14 14" fill="none"><path d="M5.83333 9.33333L8.16667 7L5.83333 4.66667" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    check: '<svg viewBox="0 0 10 10" fill="none"><path d="M8.33333 2.5L3.75 7.08333L1.66667 5" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    info: '<svg viewBox="0 0 14 14" fill="none"><path d="M7 9.33333V7M7 4.66667H7.00583M12.8333 7C12.8333 10.2217 10.2217 12.8333 7 12.8333C3.77834 12.8333 1.16667 10.2217 1.16667 7C1.16667 3.77834 3.77834 1.16667 7 1.16667C10.2217 1.16667 12.8333 3.77834 12.8333 7Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    plus: '<svg viewBox="0 0 14 14" fill="none"><path d="M7 1.40709V13.0738M1.28124 7.24043H12.7188" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  };

  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const initial = name => esc(name.trim()[0].toUpperCase());
  const plural = (n, one, many) => `${n} ${n === 1 ? one : (many || one + 's')}`;
  function hl(text, q) {
    if (!q) return esc(text);
    const i = text.toLowerCase().indexOf(q.toLowerCase());
    if (i < 0) return esc(text);
    return esc(text.slice(0, i)) + '<mark>' + esc(text.slice(i, i + q.length)) + '</mark>' + esc(text.slice(i + q.length));
  }
  function listNames(names) {
    if (names.length <= 1) return names.join('');
    return names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1];
  }

  // ---- toast ---------------------------------------------------------------
  let toastHost;
  function toast(msg, undo) {
    if (!toastHost) { toastHost = document.createElement('div'); toastHost.className = 'ap-toasts'; toastHost.setAttribute('role', 'status'); document.body.appendChild(toastHost); }
    toastHost.innerHTML = '';
    const t = document.createElement('div');
    t.className = 'ap-toast';
    t.innerHTML = `<span>${msg}</span>` + (undo ? '<button class="ap-toast__undo" type="button">Undo</button>' : '');
    toastHost.appendChild(t);
    let timer;
    const kill = () => { clearTimeout(timer); t.classList.add('is-leaving'); setTimeout(() => t.remove(), 170); };
    if (undo) t.querySelector('.ap-toast__undo').onclick = () => { undo(); kill(); };
    timer = setTimeout(kill, undo ? 6000 : 3200);
  }

  // ---- picker ----------------------------------------------------------------
  function create(mount, opts) {
    const dir = opts.directory;
    const teamById = new Map(dir.teams.map(t => [t.id, t]));
    const personById = new Map(dir.people.map(p => [p.id, p]));
    const feature = opts.feature || 'this feature';

    const S = {
      teams: new Set((opts.value && opts.value.teams) || []),
      people: new Set((opts.value && opts.value.people) || []),
      open: false, q: '', tab: 'all', active: 0, expanded: new Set(),
      pinTeams: [], pinPeople: [], error: '',
    };

    mount.classList.add('ap');
    mount.innerHTML = `
      <button type="button" class="ap-field" role="combobox" aria-haspopup="listbox" aria-expanded="false">
        <span class="ap-field__chips"></span>
        <span class="ap-field__chev">${I.chevDown}</span>
      </button>
      <div class="ap-menu" hidden role="dialog" aria-label="Choose teams and users">
        <div class="ap-menu__head">
          <label class="ap-search">${I.search}<input type="text" placeholder="Search teams or users, or paste emails" aria-label="Search teams or users" autocomplete="off" spellcheck="false"><button type="button" class="ap-search__clear" aria-label="Clear search" hidden>${I.x}</button></label>
          <div class="ap-tabs" role="tablist"></div>
        </div>
        <div class="ap-menu__list" role="listbox" aria-multiselectable="true"></div>
        <div class="ap-menu__foot">
          <span class="ap-menu__count t-xs"></span>
          <button type="button" class="ap-btn ap-btn--ghost" data-act="clear">Clear all</button>
          <button type="button" class="ap-btn ap-btn--brand" data-act="done">Done</button>
        </div>
      </div>
      <div class="ap-under"></div>`;

    const field = mount.querySelector('.ap-field');
    const chipsEl = mount.querySelector('.ap-field__chips');
    const menu = mount.querySelector('.ap-menu');
    const input = menu.querySelector('input');
    const clearQ = menu.querySelector('.ap-search__clear');
    const tabsEl = menu.querySelector('.ap-tabs');
    const listEl = menu.querySelector('.ap-menu__list');
    const countEl = menu.querySelector('.ap-menu__count');
    const under = mount.querySelector('.ap-under');

    // ---- derived -----------------------------------------------------------
    function coveringTeams(pid) {
      const out = [];
      S.teams.forEach(tid => { const t = teamById.get(tid); if (t && t.members.includes(pid)) out.push(t); });
      return out;
    }
    function reachSet() {
      const r = new Set(S.people);
      S.teams.forEach(tid => teamById.get(tid).members.forEach(pid => r.add(pid)));
      return r;
    }
    const total = () => S.teams.size + S.people.size;
    function value() { return { teams: [...S.teams], people: [...S.people] }; }
    function changed() { if (S.error && total()) setError(''); renderField(); if (S.open) renderMenu(); opts.onChange && opts.onChange(value()); }

    // ---- mutations (all undoable from the field/drawer) ---------------------
    function toggleTeam(id) { S.teams.has(id) ? S.teams.delete(id) : S.teams.add(id); changed(); }
    function togglePerson(id) {
      if (!S.people.has(id) && coveringTeams(id).length) return; // inherited
      S.people.has(id) ? S.people.delete(id) : S.people.add(id); changed();
    }
    function remove(kind, id, viaToast = true) {
      const set = kind === 'team' ? S.teams : S.people;
      if (!set.has(id)) return;
      set.delete(id); changed();
      if (viaToast) {
        const name = kind === 'team' ? teamById.get(id).name : personById.get(id).name;
        toast(`Removed ${esc(name)}`, () => { set.add(id); changed(); });
      }
    }

    // ---- field --------------------------------------------------------------
    let shown = new Set(); // chip keys already on screen — only new ones animate in
    function chipHTML(kind, id) {
      const fresh = shown.size && !shown.has(kind + id) ? ' is-new' : '';
      if (kind === 'team') {
        const t = teamById.get(id);
        return `<span class="ap-chip${fresh}" data-kind="team" data-id="${id}" title="${esc(t.name)} · ${plural(t.members.length, 'user', 'users')}"><span class="ap-av">${I.users}</span><span class="ap-chip__label t-xs-m">${esc(t.name)}</span><button type="button" class="ap-chip__x" aria-label="Remove ${esc(t.name)}">${I.x}</button></span>`;
      }
      const p = personById.get(id);
      return `<span class="ap-chip${fresh}" data-kind="person" data-id="${id}" title="${esc(p.name)} · ${esc(p.email)}"><span class="ap-av t-xxs-m">${initial(p.name)}</span><span class="ap-chip__label t-xs-m">${esc(p.name.split(' ')[0])}</span><button type="button" class="ap-chip__x" aria-label="Remove ${esc(p.name)}">${I.x}</button></span>`;
    }
    function renderField() {
      field.setAttribute('aria-expanded', String(S.open));
      if (!total()) {
        chipsEl.innerHTML = `<span class="ap-field__placeholder t-sm">Search or select teams and users</span>`;
      } else {
        chipsEl.innerHTML = [...S.teams].map(id => chipHTML('team', id)).join('') + [...S.people].map(id => chipHTML('person', id)).join('') + `<span class="ap-chip ap-chip--more t-xs-m" role="button" tabindex="-1" hidden></span>`;
        fitChips();
      }
      shown = new Set([...[...S.teams].map(i => 'team' + i), ...[...S.people].map(i => 'person' + i)]);
      if (!shown.size) shown.add('');
      renderUnder();
    }
    // keep ONE line: hide chips that do not fit and roll them into "+N"
    function fitChips() {
      const chips = [...chipsEl.querySelectorAll('.ap-chip:not(.ap-chip--more)')];
      const more = chipsEl.querySelector('.ap-chip--more');
      chips.forEach(c => (c.hidden = false));
      more.hidden = true;
      const avail = chipsEl.clientWidth + 0.5;
      if (chipsEl.scrollWidth <= avail) return;
      more.hidden = false;
      for (let n = chips.length - 1; n >= 0; n--) {
        chips[n].hidden = true;
        const hiddenCount = chips.length - n;
        more.textContent = `+${hiddenCount}`;
        more.title = `${hiddenCount} more — click to review`;
        if (chipsEl.scrollWidth <= avail) break;
      }
    }
    function renderUnder() {
      if (S.error) {
        under.innerHTML = `<div class="ap-error t-xs">${I.info}<span>${esc(S.error)}</span></div>`;
        return;
      }
      if (!total()) { under.innerHTML = ''; return; }
      const r = reachSet().size;
      under.innerHTML = `<div class="ap-summary t-xs"><span><b>${plural(r, 'user', 'users')}</b> can use ${esc(feature)}</span><span class="ap-summary__dot">·</span><button type="button" class="ap-link t-xs" data-act="view">See all ${total()}</button></div>`;
    }

    // ---- menu ---------------------------------------------------------------
    function openMenu(tab) {
      if (S.open) { if (tab) { S.tab = tab; renderMenu(); } return; }
      S.open = true; S.q = ''; input.value = ''; S.tab = tab || 'all'; S.active = 0;
      // snapshot pin order so rows don't jump while clicking
      S.pinTeams = [...S.teams]; S.pinPeople = [...S.people];
      menu.hidden = false;
      mount.classList.add('is-open');
      place();
      renderField(); renderMenu();
      requestAnimationFrame(() => input.focus());
      document.addEventListener('pointerdown', onOutside, true);
    }
    function closeMenu(refocus) {
      if (!S.open) return;
      S.open = false; menu.hidden = true; mount.classList.remove('is-open');
      S.expanded.clear();
      document.removeEventListener('pointerdown', onOutside, true);
      renderField();
      if (refocus) field.focus();
    }
    function onOutside(e) { if (!mount.contains(e.target) && !(toastHost && toastHost.contains(e.target))) closeMenu(false); }
    function place() {
      const r = field.getBoundingClientRect();
      const below = window.innerHeight - r.bottom, above = r.top;
      menu.dataset.place = below < 360 && above > below ? 'above' : 'below';
    }

    function parsePaste(q) {
      if (!/[,;\n]/.test(q) && !/@.+\..+/.test(q)) return null;
      const toks = q.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean);
      if (!toks.length) return null;
      const found = [], missed = [];
      toks.forEach(tok => {
        const l = tok.toLowerCase();
        const p = dir.people.find(p => p.email.toLowerCase() === l || p.name.toLowerCase() === l);
        p ? found.push(p) : missed.push(tok);
      });
      if (toks.length < 2 && !found.length) return null;
      return { found, missed };
    }

    function rows() {
      const q = S.q.trim().toLowerCase();
      const pinIdx = (arr, id) => { const i = arr.indexOf(id); return i < 0 ? 1e6 : i; };
      let teams = dir.teams.filter(t => !q || t.name.toLowerCase().includes(q));
      let people = dir.people.filter(p => !q || p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q) || (p.title || '').toLowerCase().includes(q));
      if (S.tab === 'selected') { teams = teams.filter(t => S.teams.has(t.id)); people = people.filter(p => S.people.has(p.id)); }
      teams.sort((a, b) => pinIdx(S.pinTeams, a.id) - pinIdx(S.pinTeams, b.id));
      people.sort((a, b) => pinIdx(S.pinPeople, a.id) - pinIdx(S.pinPeople, b.id));
      if (S.tab === 'teams') people = [];
      if (S.tab === 'people') teams = [];
      return { teams, people };
    }

    function renderMenu() {
      const { teams, people } = rows();
      const paste = parsePaste(S.q);
      clearQ.hidden = !S.q;

      const tabs = [['all', 'All'], ['teams', 'Teams'], ['people', 'Users'], ['selected', 'Selected', total()]];
      tabsEl.innerHTML = tabs.map(([k, l, n]) => `<button type="button" role="tab" class="ap-tab t-xs-m" data-tab="${k}" aria-selected="${S.tab === k}">${l}${n !== undefined ? ` <span class="ap-tab__n">${n}</span>` : ''}</button>`).join('');

      const flat = []; // interactive rows in order, for keyboard
      let html = '';
      if (paste) {
        const addable = paste.found.filter(p => !S.people.has(p.id) && !coveringTeams(p.id).length);
        flat.push({ kind: 'paste', addable });
        html += `<div class="ap-item" data-idx="0" data-kind="paste"><div class="ap-paste">
          <div class="ap-item__row" style="padding:0"><span class="ap-av ap-av--20">${I.plus}</span><span class="ap-item__text"><span class="ap-item__name t-sm-m">${addable.length ? `Add ${plural(addable.length, 'user', 'users')} from your list` : 'Everyone in your list already has access'}</span><span class="ap-item__sub t-xxs">${plural(paste.found.length, 'match', 'matches')} found in the directory · press Enter</span></span></div>
          ${paste.missed.length ? `<div class="ap-paste__miss t-xxs">Not found: ${esc(paste.missed.join(', '))}</div>` : ''}
        </div></div>`;
      }

      const q = S.q.trim();
      if (!paste && teams.length) {
        const unselected = teams.filter(t => !S.teams.has(t.id));
        html += `<div class="ap-group"><span>Teams · ${teams.length}</span>${q && unselected.length > 1 ? `<button type="button" class="ap-link t-xxs" data-act="all-teams">Select all ${unselected.length}</button>` : ''}</div>`;
        teams.forEach(t => {
          const on = S.teams.has(t.id), exp = S.expanded.has(t.id);
          const idx = flat.push({ kind: 'team', id: t.id }) - 1;
          html += `<div class="ap-item${on ? ' is-checked' : ''}" data-idx="${idx}" data-kind="team" data-id="${t.id}" role="option" aria-selected="${on}">
            <div class="ap-item__row">
              <span class="ap-check">${I.check}</span>
              <span class="ap-av ap-av--20">${I.users}</span>
              <span class="ap-item__text"><span class="ap-item__name t-sm">${hl(t.name, q)}</span><span class="ap-item__sub t-xxs">${plural(t.members.length, 'user', 'users')}${t.desc ? ' · ' + esc(t.desc) : ''}</span></span>
              <button type="button" class="ap-expand t-xxs" data-act="expand" aria-expanded="${exp}" aria-label="${exp ? 'Hide' : 'Show'} members of ${esc(t.name)}">Members${I.chevRight}</button>
            </div>
            ${exp ? membersHTML(t) : ''}
          </div>`;
        });
      }
      if (!paste && people.length) {
        const pickable = people.filter(p => !S.people.has(p.id) && !coveringTeams(p.id).length);
        html += `<div class="ap-group"><span>Users · ${people.length}</span>${q && pickable.length > 1 ? `<button type="button" class="ap-link t-xxs" data-act="all-people">Select all ${pickable.length}</button>` : ''}</div>`;
        people.forEach(p => {
          const on = S.people.has(p.id);
          const via = on ? [] : coveringTeams(p.id);
          const covered = via.length > 0;
          const idx = flat.push({ kind: 'person', id: p.id, covered }) - 1;
          html += `<div class="ap-item${on ? ' is-checked' : ''}${covered ? ' is-covered' : ''}" data-idx="${idx}" data-kind="person" data-id="${p.id}" role="option" aria-selected="${on || covered}" ${covered ? `aria-disabled="true" title="Already has access through ${esc(listNames(via.map(t => t.name)))}"` : ''}>
            <div class="ap-item__row">
              <span class="ap-check">${I.check}</span>
              <span class="ap-av ap-av--20 t-xxs-m">${initial(p.name)}</span>
              <span class="ap-item__text"><span class="ap-item__name t-sm">${hl(p.name, q)}</span><span class="ap-item__sub t-xxs">${hl(p.email, q)}${p.title ? ' · ' + hl(p.title, q) : ''}</span></span>
              ${covered ? `<span class="ap-via t-xxs">via ${esc(via[0].name)}${via.length > 1 ? ' +' + (via.length - 1) : ''}</span>` : ''}
            </div>
          </div>`;
        });
      }
      if (!flat.length) {
        html = S.tab === 'selected' && !q
          ? `<div class="ap-empty t-sm"><b>Nothing selected yet</b><span class="t-xs">Pick teams or users from the All tab.</span></div>`
          : `<div class="ap-empty t-sm"><b>No teams or users match “${esc(q)}”</b><span class="t-xs">Check the spelling, or paste a list of work emails.</span></div>`;
      }
      listEl.innerHTML = html;
      S.flat = flat;
      if (S.active >= flat.length) S.active = Math.max(0, flat.length - 1);
      paintActive(false);

      const r = reachSet().size;
      countEl.innerHTML = total()
        ? `<b>${total()} selected</b> · ${plural(r, 'user', 'users')} can use ${esc(feature)}`
        : `Nothing selected`;
      menu.querySelector('[data-act="clear"]').disabled = !total();
    }
    function membersHTML(t) {
      const show = t.members.slice(0, 6).map(pid => personById.get(pid));
      return `<div class="ap-members">${show.map(p => `<div class="ap-members__row t-xs"><span class="ap-av t-xxs-m">${initial(p.name)}</span>${esc(p.name)}</div>`).join('')}${t.members.length > 6 ? `<div class="ap-members__more t-xxs">and ${t.members.length - 6} more</div>` : ''}</div>`;
    }
    function paintActive(scroll) {
      listEl.querySelectorAll('.ap-item.is-active').forEach(el => el.classList.remove('is-active'));
      const el = listEl.querySelector(`.ap-item[data-idx="${S.active}"]`);
      if (!el) return;
      el.classList.add('is-active');
      if (scroll) el.scrollIntoView({ block: 'nearest' });
    }
    function activate(i) {
      const r = S.flat[i]; if (!r) return;
      if (r.kind === 'team') toggleTeam(r.id);
      else if (r.kind === 'person') togglePerson(r.id);
      else if (r.kind === 'paste') {
        r.addable.forEach(p => S.people.add(p.id));
        const n = r.addable.length;
        S.q = ''; input.value = ''; changed();
        if (n) toast(`Added ${plural(n, 'user', 'users')}`);
      }
    }

    // ---- events ---------------------------------------------------------------
    field.addEventListener('click', e => {
      const x = e.target.closest('.ap-chip__x');
      if (x) { e.stopPropagation(); const c = x.closest('.ap-chip'); remove(c.dataset.kind, c.dataset.id); return; }
      if (e.target.closest('.ap-chip--more')) { e.stopPropagation(); openMenu('selected'); return; }
      S.open ? closeMenu(false) : openMenu();
    });
    field.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openMenu(); }
    });
    under.addEventListener('click', e => { if (e.target.closest('[data-act="view"]')) openMenu('selected'); });

    input.addEventListener('input', () => { S.q = input.value; S.active = 0; if (S.q && S.tab === 'selected') S.tab = 'all'; renderMenu(); listEl.scrollTop = 0; });
    input.addEventListener('paste', () => setTimeout(() => { S.q = input.value; renderMenu(); }));
    clearQ.addEventListener('click', e => { e.preventDefault(); S.q = ''; input.value = ''; renderMenu(); input.focus(); });

    menu.addEventListener('keydown', e => {
      const n = (S.flat || []).length;
      if (e.key === 'ArrowDown') { e.preventDefault(); S.active = Math.min(n - 1, S.active + 1); paintActive(true); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); S.active = Math.max(0, S.active - 1); paintActive(true); }
      else if (e.key === 'Enter' || (e.key === ' ' && document.activeElement !== input)) { e.preventDefault(); activate(S.active); }
      else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const r = S.flat && S.flat[S.active];
        if (r && r.kind === 'team' && (document.activeElement !== input || !S.q || input.selectionStart === input.value.length)) {
          if (e.key === 'ArrowRight') S.expanded.add(r.id); else S.expanded.delete(r.id);
          renderMenu();
        }
      }
      else if (e.key === 'Escape') { e.preventDefault(); closeMenu(true); }
      else if (e.key === 'Tab') { closeMenu(false); }
      else if (e.key === 'Backspace' && document.activeElement === input && !input.value) {
        const lastP = [...S.people].pop(), lastT = [...S.teams].pop();
        if (lastP) remove('person', lastP); else if (lastT) remove('team', lastT);
      }
    });
    menu.addEventListener('click', e => {
      const tab = e.target.closest('.ap-tab');
      if (tab) { S.tab = tab.dataset.tab; S.active = 0; renderMenu(); input.focus(); return; }
      const act = e.target.closest('[data-act]');
      if (act) {
        const a = act.dataset.act;
        if (a === 'done') return closeMenu(true);
        if (a === 'clear') {
          const prev = value();
          S.teams.clear(); S.people.clear(); changed();
          toast(`Cleared ${plural(prev.teams.length + prev.people.length, 'selection')}`, () => { prev.teams.forEach(i => S.teams.add(i)); prev.people.forEach(i => S.people.add(i)); changed(); });
          return input.focus();
        }
        if (a === 'expand') {
          const id = act.closest('.ap-item').dataset.id;
          S.expanded.has(id) ? S.expanded.delete(id) : S.expanded.add(id);
          renderMenu(); return;
        }
        if (a === 'all-teams') { rows().teams.forEach(t => S.teams.add(t.id)); changed(); return; }
        if (a === 'all-people') { rows().people.forEach(p => { if (!coveringTeams(p.id).length) S.people.add(p.id); }); changed(); return; }
      }
      const item = e.target.closest('.ap-item');
      if (item) { S.active = +item.dataset.idx; activate(S.active); input.focus(); }
    });
    menu.addEventListener('pointermove', e => {
      const item = e.target.closest('.ap-item'); if (!item) return;
      const i = +item.dataset.idx; if (i !== S.active) { S.active = i; paintActive(false); }
    });
    new ResizeObserver(() => { if (total()) fitChips(); }).observe(chipsEl);
    if (document.fonts) document.fonts.ready.then(() => { if (total()) fitChips(); });

    function setError(msg) { S.error = msg; mount.classList.toggle('is-error', !!msg); renderUnder(); }

    renderField();
    return {
      getValue: value,
      setValue(v) { S.teams = new Set(v.teams || []); S.people = new Set(v.people || []); changed(); },
      open: openMenu, close: closeMenu,
      reach: () => reachSet().size,
      count: total,
      validate() {
        if (total()) { setError(''); return true; }
        setError(`Choose at least one team or user, or switch to Everyone.`);
        return false;
      },
      clearError() { setError(''); },
      refit() { if (total()) fitChips(); },
      el: mount,
    };
  }

  window.AudiencePicker = { create, toast, icons: I };
})();
