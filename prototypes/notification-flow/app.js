/* Notification flow — interaction layer.
   Frames 1-5 of Section 1 as one path: landing (unread badge) -> hover the avatar ->
   account menu -> Notifications -> panel with Notifications / What's New tabs.
   The logo expands the rail; the layout-left button collapses it (frame 5).
   Panel: one store shared by both tabs, so reading / dismissing carries across.
   Interactions: Notifications / What's New toggle, All / Agents / Team filter, Unreads
   switch, Approve / Reject, open (marks read), dismiss, row click (marks read). */
(function () {
  'use strict';

  // dist/notification-flow.html injects window.NF_ASSETS (data URIs) so the file works standalone
  var A = function (n) { return (window.NF_ASSETS && window.NF_ASSETS[n]) || 'assets/' + n; };

  var store = {
    // Counts in the design are literal "5"s; they show until the first interaction,
    // after which every count is the real number of unread items in that filter.
    touched: false,
    notifs: [
      { id: 'n1', kind: 'agent', who: 'Formula Falcon Agent', time: '2m ago', text: 'I’ve finished adding my notes. Artfiact Excel Formula is complete', lead: 'agent', unread: true, end: 'open' },
      { id: 'n2', kind: 'agent', who: 'Morning Brief Routine', time: '1h 39 m ago', text: 'Need permission to connect to Granola to proceed.', lead: 'clock', unread: true, end: 'open', actions: true },
      { id: 'n3', kind: 'team', who: 'Teams Meetings notes ready', time: '2d ago ', text: 'Design- dev stand up with TeleCoin executives ready for your review.', lead: 'calendar', unread: true, end: 'open' },
      { id: 'n4', kind: 'team', who: 'Katherine Moss', time: '2d ago ', text: 'I’ve finished adding my notes. Happy for us to review whenever you’re ready!', lead: 'terracotta', unread: false, end: 'open', actions: true },
      { id: 'n5', kind: 'team', who: 'TeleCoin Mobile Ventures', time: '2d 12h ago ', text: '@Roger Moore Gave you edit rights to the artifact -RFP for TeleCoin Mobile Ventures', lead: 'md', unread: false, end: 'open' },
      { id: 'n6', kind: 'team', who: 'Kashmere Moss', time: '2d ago ', text: 'I’ve finished adding my notes. Happy for us to review whenever you’re ready!', lead: 'violet', unread: true, end: 'close' }
    ],
    news: [
      { id: 'w1', title: 'Parallel connector is here', text: 'Add web search, page extraction, and cited deep research to your Lovable app with the Parallel…', time: '14 days ago', unread: true },
      { id: 'w2', title: 'Parallel connector is here', text: 'Add web search, page extraction, and cited deep research to your Lovable app with the Parallel…', time: '14 days ago', unread: true },
      { id: 'w3', title: 'Parallel connector is here', text: 'Add web search, page extraction, and cited deep research to your Lovable app with the Parallel…', time: '14 days ago', unread: true }
    ]
  };

  var q = new URLSearchParams(location.search);
  var ui = { panel: { view: 'notif', filter: 'all', unreadsOnly: false } };

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function img(name) { return '<img alt="" src=\'' + A(name) + '\'>'; }

  function lead(kind) {
    switch (kind) {
      case 'agent': return '<div class="ico ico--brand"><div class="ico__avatar">' + img('ai-avatar.svg') + '</div></div>';
      case 'clock': return '<div class="ico ico--brand"><div class="ico__glyph">' + img('clock.svg') + '</div></div>';
      case 'calendar': return '<div class="ico ico--brand-50"><div class="ico__glyph">' + img('calendar.svg') + '</div></div>';
      case 'terracotta': return '<div class="ico ico--round ico--terracotta"><span class="ico__init">K</span></div>';
      case 'violet': return '<div class="ico ico--round ico--violet"><span class="ico__init">K</span></div>';
      case 'md': return '<div class="ico ico--file"><div class="ico__md">' + img('md.svg') + '</div></div>';
    }
    return '';
  }

  function unitHTML(n) {
    var acts = '';
    if (n.resolved) {
      acts = '<div class="acts"><span class="resolved">' + esc(n.resolved) + '</span></div>';
    } else if (n.actions) {
      acts = '<div class="acts">' +
        '<button class="btn btn--secondary" data-act="reject" data-id="' + n.id + '"><span>Reject</span></button>' +
        '<button class="btn btn--primary" data-act="approve" data-id="' + n.id + '"><span>Approve</span></button></div>';
    }
    return '<article class="unit" data-id="' + n.id + '" data-node-id="unit-' + n.id + '">' +
      '<div class="unit__in" data-act="read" data-id="' + n.id + '">' +
        '<div class="unit__main">' +
          '<div class="unit__lead">' + lead(n.lead) + '</div>' +
          '<div class="unit__col">' +
            '<div class="unit__txt">' +
              '<div class="unit__top"><span class="t-name">' + esc(n.who) + '</span><span class="t-time">' + esc(n.time) + '</span></div>' +
              '<p class="t-sup">' + esc(n.text) + '</p>' +
            '</div>' + acts +
          '</div>' +
        '</div>' +
        '<div class="unit__end">' +
          '<img class="dot" alt="" src=\'' + A(n.unread ? 'dot.svg' : 'dot-read.svg') + '\'>' +
          '<button class="ibtn" data-act="' + (n.end === 'close' ? 'dismiss' : 'open') + '" data-id="' + n.id + '" aria-label="' + (n.end === 'close' ? 'Dismiss' : 'Open') + '">' + img(n.end === 'close' ? 'close.svg' : 'arrow-up-right.svg') + '</button>' +
        '</div>' +
      '</div>' +
    '</article>';
  }

  function wnHTML(w) {
    return '<article class="wn" data-act="read-new" data-id="' + w.id + '" data-node-id="wn-' + w.id + '">' +
      '<div class="wn__img">' + img('es-image-1.png') + '<p class="wn__lbl">parallel</p></div>' +
      '<div class="wn__txt">' +
        '<div class="wn__title"><p class="t-name">' + esc(w.title) + '</p><img class="dot" alt="" src=\'' + A(w.unread ? 'dot.svg' : 'dot-read.svg') + '\'></div>' +
        '<p class="t-sup wn__desc">' + esc(w.text) + '</p>' +
        '<p class="t-time wn__time">' + esc(w.time) + '</p>' +
      '</div>' +
    '</article>';
  }

  function visibleNotifs(st) {
    return store.notifs.filter(function (n) {
      return (st.filter === 'all' || n.kind === st.filter) && (!st.unreadsOnly || n.unread);
    });
  }

  function count(filter) {
    if (!store.touched) return '5';
    return String(store.notifs.filter(function (n) { return n.unread && (filter === 'all' || n.kind === filter); }).length);
  }

  function pill(st, key, label) {
    return '<button class="pill' + (st.filter === key ? ' is-on' : '') + '" data-act="filter" data-f="' + key + '" aria-pressed="' + (st.filter === key) + '">' +
      '<span class="pill__in"><span>' + label + '</span><span>' + count(key) + '</span></span></button>';
  }

  function render(id) {
    var el = document.getElementById(id), st = ui[id], notif = st.view === 'notif';
    var html = '<div class="np__head"><div class="seg" role="group" aria-label="Panel view">' +
      '<button class="seg__btn' + (notif ? ' is-on' : '') + '" data-act="view" data-v="notif" aria-pressed="' + notif + '">Notifications</button>' +
      '<button class="seg__btn' + (notif ? '' : ' is-on') + '" data-act="view" data-v="new" aria-pressed="' + (!notif) + '">What’s New</button>' +
    '</div></div>';
    if (notif) {
      html += '<div class="np__filters"><div class="np__pills">' + pill(st, 'all', 'All') + pill(st, 'agent', 'Agents') + pill(st, 'team', 'Team') + '</div>' +
        '<button class="sw" role="switch" data-act="unreads" aria-checked="' + st.unreadsOnly + '"><span>Unreads</span><span class="sw__track"><span class="sw__knob"></span></span></button></div>';
    }
    var rows = notif ? visibleNotifs(st).map(unitHTML).join('') : store.news.map(wnHTML).join('');
    if (!rows) rows = '<p class="empty">You’re all caught up</p>';
    html += '<div class="np__body"><div class="np__scroll"><div class="np__list' + (notif ? ' np__list--notif' : '') + '">' + rows + '</div></div>' +
      '<div class="sb" aria-hidden="true"><div class="sb__track"><div class="sb__bar"></div></div></div></div>';
    el.setAttribute('data-view', st.view);
    el.innerHTML = html;
    syncBar(el);
  }

  function syncBar(el) {
    var sc = el.querySelector('.np__scroll'), bar = el.querySelector('.sb__bar');
    if (!sc || !bar) return;
    var over = sc.scrollHeight - sc.clientHeight;
    if (over > 1) {
      var track = 606 - 8, ratio = sc.clientHeight / sc.scrollHeight, h = Math.max(24, track * ratio);
      var top = (track - h) * (sc.scrollTop / over);
      bar.style.top = top + 'px';
      bar.style.bottom = 'auto';
      bar.style.height = h + 'px';
    } else {
      bar.style.top = ''; bar.style.bottom = ''; bar.style.height = '';
    }
  }

  function renderAll() { Object.keys(ui).forEach(render); }
  function find(list, id) { return list.filter(function (x) { return x.id === id; })[0]; }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-act]');
    if (!t) return;
    var panel = t.closest('.np'); if (!panel) return;
    e.stopPropagation();
    var st = ui[panel.id], act = t.getAttribute('data-act'), id = t.getAttribute('data-id');
    var n = id && find(store.notifs, id), w = id && find(store.news, id);

    if (act === 'view') { st.view = t.getAttribute('data-v'); render(panel.id); return; }
    if (act === 'filter') { st.filter = t.getAttribute('data-f'); render(panel.id); return; }
    if (act === 'unreads') { st.unreadsOnly = !st.unreadsOnly; render(panel.id); return; }

    store.touched = true;
    if (act === 'approve' || act === 'reject') {
      e.stopPropagation();
      n.unread = false; n.actions = false; n.resolved = act === 'approve' ? 'Approved' : 'Rejected';
      renderAll(); return;
    }
    if (act === 'dismiss') {
      e.stopPropagation();
      var row = panel.querySelector('.unit[data-id="' + id + '"]');
      store.notifs = store.notifs.filter(function (x) { return x.id !== id; });
      if (row) { row.classList.add('is-leaving'); setTimeout(renderAll, 180); } else renderAll();
      return;
    }
    if (act === 'open' || act === 'read') { if (n) n.unread = false; renderAll(); return; }
    if (act === 'read-new') { if (w) w.unread = false; renderAll(); }
  });

  document.addEventListener('scroll', function (e) {
    if (e.target.classList && e.target.classList.contains('np__scroll')) syncBar(e.target.closest('.np'));
  }, true);


  /* ------------------------------------------------------------------ flow */
  var frame = document.getElementById('frame');
  var panelEl = document.getElementById('panel');
  var menus = { collapsed: document.getElementById('menu-collapsed'), expanded: document.getElementById('menu-expanded') };
  var triggers = { collapsed: document.querySelector('[data-menu-trigger="collapsed"]'), expanded: document.querySelector('[data-menu-trigger="expanded"]') };
  var closeTimer = null;

  function railMode() { return frame.getAttribute('data-rail'); }
  function setMenu(open) {
    var mode = railMode();
    Object.keys(menus).forEach(function (k) {
      var on = open && k === mode;
      menus[k].hidden = !on;
      triggers[k].setAttribute('aria-expanded', String(on));
    });
  }
  function menuOpen() { return !menus[railMode()].hidden; }
  function openPanel(view) {
    setMenu(false);
    ui.panel.view = view || 'notif';
    panelEl.hidden = false;
    frame.classList.add('is-read');           // frames 2-4: the avatar loses its unread badge
    render('panel');
  }
  function closePanel() { panelEl.hidden = true; }

  // Frame 2 is labelled "on hover": hovering the avatar opens the menu; leaving both closes it.
  ['collapsed', 'expanded'].forEach(function (k) {
    [triggers[k], menus[k]].forEach(function (el) {
      el.addEventListener('mouseenter', function () { clearTimeout(closeTimer); if (railMode() === k) setMenu(true); });
      el.addEventListener('mouseleave', function () { clearTimeout(closeTimer); closeTimer = setTimeout(function () { setMenu(false); }, 220); });
    });
    triggers[k].addEventListener('click', function (e) { e.stopPropagation(); clearTimeout(closeTimer); setMenu(true); }); // hover already opened it; a click must not toggle it shut
  });

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-act]');
    var act = t && t.getAttribute('data-act');
    if (act === 'open-notifications') { openPanel('notif'); return; }
    if (act === 'expand') { frame.setAttribute('data-rail', 'expanded'); setMenu(false); return; }
    if (act === 'collapse') { frame.setAttribute('data-rail', 'collapsed'); setMenu(false); return; }
    if (e.target.closest('.menu')) return;
    if (menuOpen()) setMenu(false);
    if (!panelEl.hidden && document.contains(e.target) && !panelEl.contains(e.target)) closePanel(); // re-rendered rows are detached: not an outside click
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (menuOpen()) setMenu(false); else if (!panelEl.hidden) closePanel();
  });

  // scale the 1440x900 artboard to the window
  function fit() {   // scale set here, not via a CSS custom property: verify.sh requires every var() to be a DS token
    var k = Math.min(1, window.innerWidth / 1440, window.innerHeight / 900);
    frame.style.setProperty('--fit', k); frame.style.transform = 'scale(' + k + ')';
  }
  window.addEventListener('resize', fit); fit();

  renderAll();

  // ?state=menu|notifications|whatsnew|expanded-menu opens a frame directly (used for the 1:1 diffs)
  var st0 = new URLSearchParams(location.search).get('state');
  if (st0 === 'menu') setMenu(true);
  if (st0 === 'notifications') openPanel('notif');
  if (st0 === 'whatsnew') openPanel('new');
  if (st0 === 'expanded-menu') { frame.setAttribute('data-rail', 'expanded'); frame.classList.add('is-read'); setMenu(true); }
})();
