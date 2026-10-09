/* ----------------------------------------------------------------------------
   app.js — Enterprise Search › Features (Routines, Meetings) with the shared
   AudiencePicker. Exposes window.AccessProto for driving from the console.
---------------------------------------------------------------------------- */
(function () {
  'use strict';

  // ---- directory -------------------------------------------------------------
  const NAMES = [
    ['Olivia Rhye', 'Product Designer'], ['Phoenix Baker', 'Engineering Manager'], ['Lana Steiner', 'Product Manager'],
    ['Demi Wilkinson', 'Frontend Engineer'], ['Candice Wu', 'Account Executive'], ['Natali Craig', 'Customer Success Lead'],
    ['Drew Cano', 'Backend Engineer'], ['Orlando Diggs', 'Solutions Engineer'], ['Roger Martin', 'Legal Counsel'],
    ['Vanessa Ortiz', 'Finance Analyst'], ['Kate Morrison', 'Head of People'], ['Koray Okumus', 'Data Scientist'],
    ['Ava Wright', 'Support Engineer'], ['Eve Leroy', 'Recruiter'], ['Zahir Mays', 'Platform Engineer'],
    ['Joshua Wilson', 'Sales Director'], ['Amélie Laurent', 'UX Researcher'], ['Sienna Hewitt', 'Product Marketing'],
    ['Lily-Rose Chedjou', 'Support Specialist'], ['Mollie Hall', 'Account Manager'], ['Rhea Levine', 'Security Engineer'],
    ['Loki Bright', 'Site Reliability Engineer'], ['Isla Allison', 'Controller'], ['Kari Rasmussen', 'Design Lead'],
    ['Adem Lane', 'Mobile Engineer'], ['Noah Pierre', 'Customer Success Manager'], ['Alisa Hester', 'Paralegal'],
    ['Rene Wells', 'Sales Engineer'], ['Owen Garcia', 'QA Engineer'], ['Anaiah Whitten', 'People Partner'],
    ['Lyle Kauffman', 'VP Engineering'], ['Mathilde Lewis', 'Content Designer'], ['Priya Raman', 'Support Lead'],
    ['Marco Kelly', 'Account Executive'], ['Zara Bush', 'Data Engineer'], ['Nikolas Gibbons', 'CFO'],
    ['Florence Shaw', 'Chief of Staff'], ['Ammar Foley', 'Engineering Intern'], ['Aliah Lane', 'Revenue Operations'],
    ['Sophia Perez', 'CEO'], ['Wade Warren', 'Support Specialist'], ['Jenny Wilson', 'Account Executive'],
    ['Cody Fisher', 'Backend Engineer'], ['Bessie Cooper', 'Office Manager'], ['Arlene McCoy', 'Customer Success Manager'],
    ['Devon Lane', 'Product Manager'], ['Ralph Edwards', 'Security Analyst'], ['Theresa Webb', 'Procurement'],
  ];
  const people = NAMES.map(([name, title], i) => ({
    id: 'p' + i, name, title,
    email: name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z ]/g, '').split(' ').join('.') + '@acme.com',
  }));
  const by = n => people.find(p => p.name === n).id;
  const T = (id, name, desc, members) => ({ id, name, desc, members: members.map(by) });
  const teams = [
    T('t-design', 'Design', 'Product design & research', ['Olivia Rhye', 'Amélie Laurent', 'Kari Rasmussen', 'Mathilde Lewis', 'Lana Steiner']),
    T('t-eng', 'Engineering — Platform', 'Core services', ['Phoenix Baker', 'Drew Cano', 'Zahir Mays', 'Loki Bright', 'Cody Fisher', 'Owen Garcia', 'Lyle Kauffman', 'Zara Bush']),
    T('t-web', 'Engineering — Web & Mobile', 'Clients', ['Demi Wilkinson', 'Adem Lane', 'Ammar Foley', 'Phoenix Baker']),
    T('t-sales', 'Sales — North America', 'AE & SE', ['Candice Wu', 'Joshua Wilson', 'Marco Kelly', 'Jenny Wilson', 'Rene Wells', 'Orlando Diggs']),
    T('t-cs', 'Customer Success', 'Post-sale', ['Natali Craig', 'Noah Pierre', 'Arlene McCoy', 'Mollie Hall']),
    T('t-support', 'Support Tier 2', 'Escalations', ['Ava Wright', 'Priya Raman', 'Lily-Rose Chedjou', 'Wade Warren']),
    T('t-legal', 'Legal', 'Contracts & privacy', ['Roger Martin', 'Alisa Hester']),
    T('t-fin', 'Finance', 'FP&A, controllership', ['Vanessa Ortiz', 'Isla Allison', 'Nikolas Gibbons', 'Theresa Webb']),
    T('t-people', 'People Ops', 'HR & recruiting', ['Kate Morrison', 'Eve Leroy', 'Anaiah Whitten', 'Bessie Cooper']),
    T('t-sec', 'Security', 'AppSec & GRC', ['Rhea Levine', 'Ralph Edwards', 'Loki Bright']),
    T('t-lead', 'Leadership', 'Exec team', ['Sophia Perez', 'Nikolas Gibbons', 'Lyle Kauffman', 'Florence Shaw', 'Kate Morrison']),
    T('t-gtm', 'Go-to-Market Ops', 'RevOps & marketing', ['Aliah Lane', 'Sienna Hewitt', 'Devon Lane']),
  ];
  const directory = { teams, people };

  // ---- state -----------------------------------------------------------------
  const S = {
    page: 'meetings',
    published: null,
    meetings: {
      enabled: true, access: 'specific',
      audience: {
        // 15 picks: 5 teams + 10 users, none of the users already inside a picked team
        teams: ['t-design', 't-eng', 't-sales', 't-legal', 't-sec'],
        people: ['Natali Craig', 'Vanessa Ortiz', 'Kate Morrison', 'Ava Wright', 'Priya Raman', 'Noah Pierre', 'Isla Allison', 'Sophia Perez', 'Florence Shaw', 'Aliah Lane'].map(by),
      },
      caps: { transcription: true, cues: true, summary: true, brief: false },
    },
    routines: {
      enabled: false, access: 'everyone',
      audience: { teams: [], people: [] },
      notif: { inapp: false, email: true },
    },
  };
  S.published = JSON.stringify([S.meetings, S.routines]);

  const pane = document.getElementById('pane');
  const dirtyEl = document.getElementById('dirty');
  let picker = null;
  // dist/access-picker.html injects window.AP_ASSETS (data URIs) so the file works standalone
  const A = n => (window.AP_ASSETS && window.AP_ASSETS[n]) || 'assets/' + n;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function markDirty() { dirtyEl.classList.toggle('is-on', JSON.stringify([S.meetings, S.routines]) !== S.published); }

  // ---- shared blocks -----------------------------------------------------------
  const toggle = (on, attrs = '', sm = false) => `<button type="button" role="switch" class="tg${sm ? ' tg--sm' : ''}" aria-checked="${on}" ${attrs}></button>`;

  function accessBlock(f, noun) {
    const cfg = S[f];
    const hasKept = cfg.access === 'everyone' && (cfg.audience.teams.length + cfg.audience.people.length) > 0;
    return `
      <div class="row">
        <div class="row__label">
          <div class="row__l"><span class="t-sm">Access</span><img alt="" src='${A('clock1.svg')}' title="Applies to everyone who opens ${noun} in Enterprise Search"></div>
          <p class="t-xs c-3">Who can ${f === 'routines' ? 'create routines' : 'use ' + noun}</p>
        </div>
        <div class="row__ctl">
          <div class="radios" role="radiogroup" aria-label="Access">
            <button type="button" role="radio" class="radio" data-access="everyone" aria-checked="${cfg.access === 'everyone'}"><span class="radio__dot"></span><span class="radio__t t-sm-m">Everyone in the workspace</span></button>
            <button type="button" role="radio" class="radio" data-access="specific" aria-checked="${cfg.access === 'specific'}"><span class="radio__dot"></span><span class="radio__t t-sm-m">Specific teams and users</span></button>
          </div>
          ${hasKept ? `<p class="row__hint t-xs">Your earlier selection is kept if you switch back.</p>` : ''}
        </div>
      </div>
      <div class="reveal${cfg.access === 'specific' ? ' is-open' : ''}" id="reveal">
        <div class="row">
          <div class="row__label">
            <div class="row__l"><span class="t-sm">Teams and users</span><span class="row__req t-sm">*</span></div>
            <p class="t-xs c-3">Every user in a chosen team gets access, including users who join it later</p>
          </div>
          <div class="row__ctl"><div id="picker"></div></div>
        </div>
      </div>`;
  }

  function header(f, icon, title, sub) {
    return `<div class="fh" data-node-id="8324:353025">
      <span class="fh__icon"><img alt="" src='${A(icon)}'></span>
      <div class="fh__text"><div class="fh__title">${title}</div><p class="t-xs c-3">${sub}</p></div>
      <label class="fh__enable t-sm-m">Enable ${toggle(S[f].enabled, 'data-act="enable"')}</label>
    </div>`;
  }
  const retention = rows => `<section class="sec"><h2 class="t-md-m">Retention</h2><div class="card card--list">${rows.map(([t, d]) => `
      <div class="ret"><div class="ret__t"><p class="t-sm-m">${t}</p><p class="t-xs c-3">${d}</p></div>
      <label class="num"><input type="text" inputmode="numeric" placeholder="90" aria-label="${t} in days"><span class="num__unit t-sm">Days<img alt="" src='${A('chevron-down-sm1.svg')}'></span></label></div>`).join('')}</div></section>`;

  // ---- pages -----------------------------------------------------------------------
  function meetings() {
    const c = S.meetings.caps;
    const cap = (k, icon, t, d) => `<div class="li"><div class="li__c"><span class="li__icon"><img alt="" src='${A(icon)}'></span><div><p class="t-sm-m">${t}</p><p class="t-xs c-3">${d}</p></div></div>
      <div class="li__actions"><button type="button" class="icon-btn" aria-label="Configure ${t}" ${c[k] ? '' : 'hidden'}><img alt="" src='${A('settings04.svg')}'></button>${toggle(c[k], `data-cap="${k}" aria-label="${t}"`, true)}</div></div>`;
    return header('meetings', 'calendar.svg', 'Meetings', 'Choose who can use Meetings and what it can do') + `
      <div class="scroll"><div class="col${S.meetings.enabled ? '' : ' is-off'}">
        ${S.meetings.enabled ? '' : offBanner('meetings', 'Meetings')}
        <section class="sec"><h2 class="t-md-m">Set Up</h2><div class="card">${accessBlock('meetings', 'Meetings')}</div></section>
        <section class="sec"><h2 class="t-md-m">Capabilities</h2><div class="card card--list">
          ${cap('transcription', 'microphone01.svg', 'Transcription', 'Records meetings in the desktop app and writes the transcript that Cues and Summary use')}
          ${cap('cues', 'lightbulb05.svg', 'Cues', 'Answers questions during the meeting, once the user turns Cues on')}
          ${cap('summary', 'ai-summary.svg', 'Summary', 'Writes the summary and action items after each meeting')}
          ${cap('brief', 'file05.svg', 'Brief', 'Prepares a brief before each calendar meeting, from the invite and the user’s apps')}
        </div></section>
        ${retention([['Transcript Retention', 'Transcripts older than this are deleted; summaries and notes remain'], ['Brief Retention', 'Briefs older than this are deleted']])}
      </div></div>`;
  }
  function routines() {
    const n = S.routines.notif;
    const li = (k, t, d) => `<div class="li"><div class="li__c"><div><p class="t-sm-m">${t}</p><p class="t-xs c-3">${d}</p></div></div><div class="li__actions"><button type="button" class="icon-btn" aria-label="Configure ${t}" ${n[k] ? '' : 'hidden'}><img alt="" src='${A('settings04.svg')}'></button>${toggle(n[k], `data-notif="${k}" aria-label="${t}"`, true)}</div></div>`;
    return header('routines', 'routine-clock.svg', 'Routines', 'Choose who can create routines and how they run') + `
      <div class="scroll"><div class="col${S.routines.enabled ? '' : ' is-off'}">
        ${S.routines.enabled ? '' : offBanner('routines', 'Routines')}
        <section class="sec"><h2 class="t-md-m">Set Up</h2><div class="card">${accessBlock('routines', 'Routines')}</div></section>
        <section class="sec"><h2 class="t-md-m">Notifications</h2><div class="card card--list">
          ${li('inapp', 'In-App Notifications', 'Notify routine owners in Enterprise Search when a routine runs')}
          ${li('email', 'Email Notifications', 'Allow routine owners to receive run results by email')}
        </div></section>
        ${retention([['Run History Retention', 'Runs older than this are deleted']])}
      </div></div>`;
  }
  // One place to turn a feature on. The frames had both a header toggle AND an
  // "Enable Routines" button under a greyed-out form.
  const offBanner = (f, noun) => `<div class="off-banner"><div class="off-banner__t"><p class="t-sm-m">${noun} is off</p><p class="t-xs c-3">Turn it on to choose who can use it. Your settings below are kept.</p></div><button type="button" class="btn btn--brand btn--sm t-xs-m" data-act="enable-on">Turn on ${noun}</button></div>`;

  // ---- render -----------------------------------------------------------------------
  function render() {
    document.querySelectorAll('.snav__subitem').forEach(b => b.classList.toggle('is-active', b.dataset.page === S.page));
    pane.innerHTML = S.page === 'meetings' ? meetings() : routines();
    pane.querySelector('.scroll').classList.add('page-enter');
    mountPicker();
  }
  function mountPicker() {
    const f = S.page, el = pane.querySelector('#picker');
    picker = AudiencePicker.create(el, {
      directory, value: S[f].audience,
      feature: f === 'meetings' ? 'Meetings' : 'Routines',
      onChange(v) { S[f].audience = v; markDirty(); },
    });
  }

  function setAccess(mode) {
    const f = S.page, cfg = S[f];
    if (cfg.access === mode) return;
    cfg.access = mode;
    pane.querySelectorAll('.radio').forEach(r => r.setAttribute('aria-checked', String(r.dataset.access === mode)));
    const reveal = pane.querySelector('#reveal');
    reveal.classList.toggle('is-open', mode === 'specific');
    const hint = pane.querySelector('.row__hint');
    if (hint) hint.remove();
    if (mode === 'everyone') {
      picker.close(false); picker.clearError();
      if (picker.count()) pane.querySelector('.radios').insertAdjacentHTML('afterend', `<p class="row__hint t-xs">Your earlier selection is kept if you switch back.</p>`);
    } else {
      // empty selection → open the picker straight away, saving a click
      setTimeout(() => { picker.refit(); if (!picker.count()) picker.open(); }, 280);
    }
    markDirty();
  }

  // ---- events ------------------------------------------------------------------------
  document.querySelector('.snav__sub').addEventListener('click', e => {
    const b = e.target.closest('[data-page]'); if (!b || b.dataset.page === S.page) return;
    S.page = b.dataset.page; render();
  });
  pane.addEventListener('click', e => {
    const radio = e.target.closest('.radio'); if (radio) return setAccess(radio.dataset.access);
    const act = e.target.closest('[data-act]');
    if (act && (act.dataset.act === 'enable' || act.dataset.act === 'enable-on')) {
      e.preventDefault();
      S[S.page].enabled = act.dataset.act === 'enable-on' ? true : !S[S.page].enabled;
      render(); markDirty(); return;
    }
    const cap = e.target.closest('[data-cap]');
    if (cap) { const k = cap.dataset.cap; S.meetings.caps[k] = !S.meetings.caps[k]; cap.setAttribute('aria-checked', S.meetings.caps[k]); cap.previousElementSibling.hidden = !S.meetings.caps[k]; markDirty(); return; }
    const nt = e.target.closest('[data-notif]');
    if (nt) { const k = nt.dataset.notif; S.routines.notif[k] = !S.routines.notif[k]; nt.setAttribute('aria-checked', S.routines.notif[k]); nt.previousElementSibling.hidden = !S.routines.notif[k]; markDirty(); }
  });
  pane.addEventListener('keydown', e => {
    // arrow keys move between the two access radios
    const r = e.target.closest('.radio'); if (!r) return;
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      e.preventDefault();
      const next = r.dataset.access === 'everyone' ? 'specific' : 'everyone';
      setAccess(next); pane.querySelector(`.radio[data-access="${next}"]`).focus();
    }
  });
  document.getElementById('publish').addEventListener('click', () => {
    for (const f of ['meetings', 'routines']) {
      const cfg = S[f];
      if (cfg.enabled && cfg.access === 'specific' && !(cfg.audience.teams.length + cfg.audience.people.length)) {
        if (S.page !== f) { S.page = f; render(); }
        picker.validate();
        pane.querySelector('#picker').scrollIntoView({ block: 'center', behavior: 'smooth' });
        AudiencePicker.toast(`Can’t publish yet — choose who can use ${f === 'meetings' ? 'Meetings' : 'Routines'}`);
        return;
      }
    }
    S.published = JSON.stringify([S.meetings, S.routines]);
    markDirty();
    AudiencePicker.toast('Published to Enterprise Search');
  });
  window.addEventListener('resize', () => picker && picker.refit());

  render();
  window.AccessProto = { S, render, directory, get picker() { return picker; }, setAccess };
})();
