// p2 My Pantheon - TG WebApp (structured frame)
// Fictional stories inspired by India’s ancient epics of dharma & karma.
// Positive loops only. TG native. Reversible.

let tg = (window.Telegram && window.Telegram.WebApp) ? window.Telegram.WebApp : null;
if (tg) {
  tg.ready();
  tg.expand();
} else {
  console.warn('Running outside Telegram WebApp (test mode)');
}

// TG native: MainButton for primary action (share / create)
// ⚠️ null 가드 필수 — SDK 로드 실패(망 차단·CDN 다운) 시 여기서 throw하면 앱 전체 사망(폴백 무력화). QA P1.
if (tg && tg.MainButton) {
  tg.MainButton.setParams({ text: 'Share Story', is_visible: false, color: '#c9a227' });
}
// Da Vinci + full-cheat + sense (Morpheus orchestrator): sfumato soft story cards, anatomy proportion, notebook UGC journal. Festival FOMO + MY Pantheon. Variable ratio + prominent disclosure.
// p6 Lung Surprise Eye + Ache-Breath + 창발 pain CROSS DNA injected (Sovereign p1-p6 advance)
(function injectP6LungCross() {
  try {
    const cross = JSON.parse(localStorage.getItem('p6_lungSurpriseCross') || '{}');
    const dist = JSON.parse(localStorage.getItem('legion_distributed_notebook') || '{}');
    const fomoV = JSON.parse(localStorage.getItem('p6_fomo_voice_all_p') || '{}');
    if (cross.surprise || dist.surprise) {
      // weaponize: voice ache/surprise seeds variable FOMO in festival stories + UGC
      window.p6LungInPantheon = { surprise: cross.surprise || dist.surprise, ache: cross.ache || dist.ache || 0.3, fomo: fomoV.crossFOMO };
      // example: higher surprise = stronger near-miss story reveal in next festival
    }
  } catch(e){}
})();

// MainButton onClick은 한 번만 등록(중복 누적 방지 — QA P2). 핸들러는 현재 상태를 클로저 밖에서 참조.
let _mainBtnWired = false;
function _mainBtnShare() {
  if (!currentPantheon) return;
  const shareText = `🔱 ${currentPantheon.name} — ${currentPantheon.desc || ''} (fictional, epics inspired)`;
  if (tg && tg.openTelegramLink) {
    tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(shareText)}`);
  }
  addKarma(2);
}
function updateMainButton() {
  if (!tg || !tg.MainButton) return;
  if (!_mainBtnWired) { tg.MainButton.onClick(_mainBtnShare); _mainBtnWired = true; }
  if (currentPantheon) {
    tg.MainButton.setText('Share My Pantheon');
    tg.MainButton.show();
  } else {
    tg.MainButton.hide();
  }
}

// State
let currentPantheon = null;
let karma = 0;
let prestige = 1;
let sharesCount = 0;
let notifEnabled = true;
let currentLang = localStorage.getItem('p2_lang') || 'en';

const echoMap = {
  'Krishna-echo': 'Echo of Krishna (strategist)',
  'Rama-echo': 'Echo of Rama (duty)',
  'Draupadi-echo': 'Echo of Draupadi (resilience)',
  'Hanuman-echo': 'Echo of Hanuman (loyalty)',
  'Durga-echo': 'Echo of Durga (protector)',
  'Arjuna-echo': 'Echo of Arjuna (focus)',
  'Sita-echo': 'Echo of Sita (endurance)'
};

// XSS shield (rank1 P1) — escape any user-authored text before it touches innerHTML.
const escapeHtml = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// TG native haptics (rank20) — safe no-op outside Telegram / on unsupported clients.
function haptic(kind) {
  try {
    if (!tg || !tg.HapticFeedback) return;
    if (kind === 'success' || kind === 'error' || kind === 'warning') tg.HapticFeedback.notificationOccurred(kind);
    else tg.HapticFeedback.impactOccurred(kind || 'light');
  } catch (e) {}
}

// p2 ALL-AGENTS 2026-07-10 reinforcement (from searches): 2026 India festivals for FOMO
const p2Festivals2026 = [
  { name: 'Ganesh Chaturthi', date: '2026-09-14', hook: 'New beginnings • Limited Echo blessings' },
  { name: 'Navratri', date: '2026-10-11~20', hook: '9 nights of power • Clan dharma challenges' },
  { name: 'Diwali', date: '2026-11-08', hook: 'Festival of lights • Prestige carry double' }
];
// All agents attached: use for limited banners, variable karma events, India pride seeding. TG Stars + disclosure.

// Real 2026 festival dates keyed by ev (honest FOMO — 진짜 마감일 기반 카운트다운)
const FEST_DATES = { ganesh: '2026-09-14', navratri: '2026-10-11', diwali: '2026-11-08' };
function renderFestivals() {
  const now = new Date();
  document.querySelectorAll('#tab-events .event-card').forEach(card => {
    const btn = card.querySelector('button[onclick*="joinEvent"]');
    if (!btn) return;
    const m = (btn.getAttribute('onclick') || '').match(/joinEvent\('(\w+)'\)/);
    if (!m || !FEST_DATES[m[1]]) return;
    const target = new Date(FEST_DATES[m[1]] + 'T23:59:59');
    const days = Math.ceil((target - now) / 86400000);
    const hdr = card.querySelector('.event-header');
    if (!hdr) return;
    let cd = hdr.querySelector('.fest-countdown');
    if (!cd) { cd = document.createElement('span'); cd.className = 'fest-countdown'; hdr.appendChild(cd); }
    let label, bg = 'rgba(201,162,39,.15)', fg = '#c9a227';
    if (days < 0) { label = 'Ended'; bg = 'rgba(120,120,120,.15)'; fg = '#888'; }
    else if (days === 0) { label = '⚡ LIVE TODAY'; bg = '#e8452e'; fg = '#fff'; }
    else if (days <= 7) { label = '⚡ ' + days + 'd left'; bg = 'rgba(232,69,46,.16)'; fg = '#e8452e'; }
    else { label = 'in ' + days + ' days'; }
    cd.textContent = label;
    cd.style.cssText = 'margin-left:auto;font-size:11px;font-weight:700;padding:2px 8px;border-radius:10px;letter-spacing:.3px;background:' + bg + ';color:' + fg + ';';
  });
  renderFestivalBundle();
}

// ===== Festival Blessing Bundle — free, real-date-gated seasonal FOMO =====
// Honest: claimable ONLY inside the real festival window (open..close). Karma shown == Karma granted.
// No purchase, no probability, no fake numbers. Reversible (single localStorage flag per festival).
const FEST_BUNDLES = [
  { ev: 'ganesh',   icon: '🪷', name: 'Ganesh Blessing Bundle',   open: '2026-09-14', close: '2026-09-17', karma: 50,  seal: 'Modaka Seal',       reward: '+50 Karma · 🪷 Modaka Seal' },
  { ev: 'navratri', icon: '⚔️', name: 'Navratri Blessing Bundle',  open: '2026-10-11', close: '2026-10-20', karma: 90,  seal: 'Nine-Night Seal',   reward: '+90 Karma · ⚔️ Nine-Night Seal' },
  { ev: 'diwali',   icon: '🪔', name: 'Diwali Blessing Bundle',    open: '2026-11-08', close: '2026-11-11', karma: 120, seal: 'Festival of Lights Seal', reward: '+120 Karma · 🪔 Festival of Lights Seal' },
];
function ensureFestBundleStyles() {
  if (document.getElementById('p2-festbundle-styles')) return;
  const st = document.createElement('style');
  st.id = 'p2-festbundle-styles';
  st.textContent = [
    '.fest-bundle{margin-top:14px}',
    '.fb-card{padding:14px;border-radius:14px;background:linear-gradient(135deg,rgba(201,162,39,.16),rgba(232,69,46,.06));border:1px solid rgba(201,162,39,.45)}',
    '.fb-card.locked{opacity:.82;background:linear-gradient(135deg,rgba(201,162,39,.08),rgba(255,255,255,.02));border-color:rgba(201,162,39,.22)}',
    '.fb-top{display:flex;align-items:center;gap:9px;margin-bottom:7px}',
    '.fb-icon{font-size:22px;flex:0 0 auto}',
    '.fb-title{font-size:14px;font-weight:800;color:#e8d9a0;flex:1 1 auto;line-height:1.15}',
    '.fb-cd{font-size:10.5px;font-weight:800;padding:3px 9px;border-radius:11px;letter-spacing:.3px;white-space:nowrap}',
    '.fb-cd.live{background:#e8452e;color:#fff}',
    '.fb-cd.soon{background:rgba(201,162,39,.18);color:#c9a227}',
    '.fb-reward{font-size:12px;color:#e8d9a0;font-weight:600;margin-bottom:10px;opacity:.92}',
    '.fb-btn{width:100%}',
    '.fb-done{text-align:center;font-size:12px;font-weight:700;color:#c9a227;padding:2px 0}',
    '.fb-hint{font-size:9.5px;color:#c9a227;text-align:center;opacity:.7;margin-top:7px}'
  ].join('');
  document.head.appendChild(st);
}
function fbClaimed(ev) { return localStorage.getItem('p2_festbundle_' + ev) === '1'; }
function renderFestivalBundle() {
  const el = document.getElementById('fest-bundle');
  if (!el) return;
  ensureFestBundleStyles();
  const now = new Date();
  let active = null, upcoming = null;
  for (const b of FEST_BUNDLES) {
    const o = new Date(b.open + 'T00:00:00'), c = new Date(b.close + 'T23:59:59');
    if (now >= o && now <= c) { active = b; break; }
    if (now < o && (!upcoming || o < new Date(upcoming.open + 'T00:00:00'))) upcoming = b;
  }
  const b = active || upcoming;
  if (!b) { el.innerHTML = ''; return; }  // all festival windows have passed
  const claimed = fbClaimed(b.ev);
  let cd, foot;
  if (active) {
    const c = new Date(b.close + 'T23:59:59');
    const days = Math.ceil((c - now) / 86400000);
    cd = '<span class="fb-cd live">⚡ ' + (days <= 1 ? 'ends today' : days + 'd left') + '</span>';
    foot = claimed
      ? '<div class="fb-done">✓ Claimed — blessing received</div>'
      : '<button class="primary fb-btn" onclick="claimFestBundle(\'' + b.ev + '\')">Claim Blessing · ' + b.reward + '</button>';
  } else {
    const o = new Date(b.open + 'T00:00:00');
    const days = Math.ceil((o - now) / 86400000);
    cd = '<span class="fb-cd soon">opens in ' + days + 'd</span>';
    foot = '<div class="fb-hint">Unlocks on ' + b.open + ' — free during the festival only.</div>';
  }
  el.innerHTML =
    '<div class="fb-card' + (active && !claimed ? '' : ' locked') + '">' +
      '<div class="fb-top"><span class="fb-icon">' + b.icon + '</span>' +
      '<span class="fb-title">' + b.name + '</span>' + cd + '</div>' +
      '<div class="fb-reward">' + b.reward + '</div>' + foot +
    '</div>';
}
function claimFestBundle(ev) {
  const b = FEST_BUNDLES.find(x => x.ev === ev);
  if (!b) return;
  const now = new Date(), o = new Date(b.open + 'T00:00:00'), c = new Date(b.close + 'T23:59:59');
  if (now < o || now > c) { showToast('This bundle is not open right now.', 2200); renderFestivalBundle(); return; }
  if (fbClaimed(ev)) return;
  localStorage.setItem('p2_festbundle_' + ev, '1');
  localStorage.setItem('p2_seal_' + ev, b.seal);
  addKarma(b.karma);
  showToast(b.icon + ' ' + b.name + ' claimed · +' + b.karma + ' Karma ✧', 3000);
  renderFestivalBundle();
}

// Reusable Echo icon SVGs (detailed Raji miniature style, for full & mini)
// rank15: memoize by type+size — the 7 icons are pure functions of (type,size), so build once.
const _echoIconCache = {};
function getEchoIcon(type, size = 34) {
  const key = type + ':' + size;
  if (key in _echoIconCache) return _echoIconCache[key];
  const svg = _buildEchoIcon(type, size);
  _echoIconCache[key] = svg;
  return svg;
}
function _buildEchoIcon(type, size = 34) {
  const s = size;
  const common = `width="${s}" height="${s}" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"`;
  if (type === 'Krishna-echo') {
    return `<svg ${common}>
      <path d="M15 41 Q15 53 32 53 Q49 53 49 41" fill="#5C4033" stroke="#C9A227" stroke-width="1.8"/>
      <path d="M18 42 Q18 50 32 50 Q46 50 46 42" fill="#3D2A1F"/>
      <ellipse cx="32" cy="39" rx="18" ry="5.5" fill="#704B2E" stroke="#D4B37F" stroke-width="2.2"/>
      <circle cx="20" cy="39" r="1.2" fill="#D4B37F" opacity="0.6"/>
      <circle cx="44" cy="39" r="1.2" fill="#D4B37F" opacity="0.6"/>
      <path d="M16 37 Q32 35 48 37" fill="none" stroke="#C9A227" stroke-width="0.6" opacity="0.4"/>
      <path d="M32 14 Q23 29 27 42 Q32 33 37 42 Q41 29 32 14" fill="#E86A00"/>
      <path d="M32 19 Q25 30 29 39 Q32 32 35 39 Q39 30 32 19" fill="#FFB347"/>
      <path d="M32 25 Q28 32 31 37 Q32 32 34 37 Q37 32 32 25" fill="#FFE082"/>
      <path d="M29 22 Q32 27 35 22" fill="none" stroke="#FFF8E1" stroke-width="1.2" opacity="0.65"/>
      <circle cx="30" cy="17" r="0.8" fill="#FFFDE7" opacity="0.7"/>
      <circle cx="32" cy="46" r="2" fill="none" stroke="#C9A227" stroke-width="0.8" opacity="0.5"/>
    </svg>`;
  } else if (type === 'Rama-echo') {
    return `<svg ${common}>
      <path d="M19 49 Q32 9 45 49" fill="none" stroke="#5C4033" stroke-width="5.5" stroke-linecap="round"/>
      <path d="M21 47 Q32 12 43 47" fill="none" stroke="#C9A227" stroke-width="2.2" stroke-linecap="round"/>
      <line x1="28" y1="30" x2="36" y2="30" stroke="#D4B37F" stroke-width="0.5" opacity="0.5"/>
      <line x1="25" y1="35" x2="39" y2="35" stroke="#D4B37F" stroke-width="1" opacity="0.7"/>
      <line x1="27" y1="25" x2="37" y2="25" stroke="#D4B37F" stroke-width="1" opacity="0.7"/>
      <line x1="19" y1="49" x2="45" y2="49" stroke="#D4B37F" stroke-width="1.8"/>
      <line x1="22" y1="49" x2="42" y2="30" stroke="#C9A227" stroke-width="1.8"/>
      <polygon points="42,30 37.5,26.5 37.5,32.5" fill="#D4B37F"/>
      <path d="M22 49 L17 45" fill="none" stroke="#8B5A2B" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M25 49 L20 45" fill="none" stroke="#8B5A2B" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="21" cy="47" r="1" fill="#D4B37F" opacity="0.5"/>
    </svg>`;
  } else if (type === 'Draupadi-echo') {
    return `<svg ${common}>
      <ellipse cx="32" cy="47" rx="9" ry="3.5" fill="#704B2E" stroke="#C9A227" stroke-width="1.6"/>
      <path d="M23 46 Q32 42 41 46" fill="none" stroke="#D4B37F" stroke-width="1" opacity="0.6"/>
      <path d="M25 48 Q32 44 39 48" fill="none" stroke="#D4B37F" stroke-width="0.8" opacity="0.5"/>
      <path d="M26 45 Q32 43 38 45" fill="none" stroke="#C9A227" stroke-width="0.5" opacity="0.4"/>
      <path d="M32 13 Q22 27 26 43 Q32 35 38 43 Q42 27 32 13" fill="#E86A00"/>
      <path d="M32 18 Q25 28 28 38 Q32 32 36 38 Q39 28 32 18" fill="#FFB347"/>
      <path d="M32 24 Q29 31 31 36 Q32 32 34 36 Q36 31 32 24" fill="#FFE082"/>
      <path d="M32 28 Q30.5 32 32 34" fill="none" stroke="#FFFDE7" stroke-width="1.5" opacity="0.8"/>
      <circle cx="32" cy="16" r="1.5" fill="#FFF8E1" opacity="0.4"/>
      <circle cx="33" cy="20" r="0.6" fill="#FFFDE7" opacity="0.6"/>
    </svg>`;
  } else if (type === 'Hanuman-echo') {
    return `<svg ${common}>
      <circle cx="32" cy="29" r="13" fill="#704B2E" stroke="#C9A227" stroke-width="2.2"/>
      <path d="M25 24 Q27 27 25 30" fill="none" stroke="#5C4033" stroke-width="0.6" opacity="0.4"/>
      <path d="M39 24 Q37 27 39 30" fill="none" stroke="#5C4033" stroke-width="0.6" opacity="0.4"/>
      <path d="M28 26 Q30 29 28 32" fill="none" stroke="#5C4033" stroke-width="0.5" opacity="0.3"/>
      <ellipse cx="20" cy="19" rx="6" ry="5" fill="#5C4033" stroke="#C9A227" stroke-width="1.6"/>
      <ellipse cx="44" cy="19" rx="6" ry="5" fill="#5C4033" stroke="#C9A227" stroke-width="1.6"/>
      <ellipse cx="21" cy="20" rx="2.8" ry="2" fill="#D4B37F"/>
      <ellipse cx="43" cy="20" rx="2.8" ry="2" fill="#D4B37F"/>
      <ellipse cx="32" cy="31" rx="7" ry="7.5" fill="#5C4033"/>
      <circle cx="26.5" cy="28" r="1.6" fill="#D4B37F"/>
      <circle cx="37.5" cy="28" r="1.6" fill="#D4B37F"/>
      <circle cx="27" cy="27.5" r="0.5" fill="#FFF" opacity="0.3"/>
      <path d="M25 19 L32 10 L39 19" fill="none" stroke="#D4B37F" stroke-width="2" stroke-linecap="round"/>
      <path d="M28 15 L32 11 L36 15" fill="none" stroke="#C9A227" stroke-width="0.8"/>
      <circle cx="47" cy="36" r="3.5" fill="#C9A227" stroke="#704B2E" stroke-width="1.2"/>
      <rect x="45.5" y="38" width="3" height="10" rx="1" fill="#C9A227"/>
      <circle cx="47" cy="34" r="1.2" fill="#D4B37F"/>
      <circle cx="47" cy="33" r="0.5" fill="#FFF" opacity="0.4"/>
    </svg>`;
  } else if (type === 'Durga-echo') {
    return `<svg ${common}>
      <path d="M17 11 Q17 25 32 52 Q47 25 47 11 Q32 15 17 11" fill="#5C4033" stroke="#C9A227" stroke-width="2.2"/>
      <path d="M22 16 Q22 26 32 44 Q42 26 42 16" fill="none" stroke="#D4B37F" stroke-width="1.6"/>
      <path d="M25 19 Q32 18 39 19" fill="none" stroke="#C9A227" stroke-width="0.5" opacity="0.4"/>
      <ellipse cx="32" cy="26" rx="6" ry="4" fill="#704B2E" stroke="#D4B37F" stroke-width="1.2"/>
      <path d="M32 22 L32 16 M29 24 L27 19 M35 24 L37 19" fill="none" stroke="#C9A227" stroke-width="1" opacity="0.7"/>
      <circle cx="32" cy="20" r="0.8" fill="#D4B37F" opacity="0.5"/>
      <path d="M32 19 L32 13 M27 22 L23 16 M37 22 L41 16" fill="none" stroke="#D4B37F" stroke-width="1.4" stroke-linecap="round" opacity="0.85"/>
      <circle cx="32" cy="26" r="1.8" fill="#D4B37F"/>
      <circle cx="26" cy="30" r="0.8" fill="#C9A227" opacity="0.5"/>
      <circle cx="38" cy="30" r="0.8" fill="#C9A227" opacity="0.5"/>
      <path d="M20 14 Q22 13 24 14" fill="none" stroke="#C9A227" stroke-width="0.6" opacity="0.4"/>
      <path d="M40 14 Q42 13 44 14" fill="none" stroke="#C9A227" stroke-width="0.6" opacity="0.4"/>
    </svg>`;
  } else if (type === 'Arjuna-echo') {
    return `<svg ${common}>
      <line x1="12" y1="32" x2="48" y2="32" stroke="#5C4033" stroke-width="4" stroke-linecap="round"/>
      <line x1="14" y1="32" x2="46" y2="32" stroke="#C9A227" stroke-width="1.5" stroke-linecap="round"/>
      <polygon points="48,32 38,26 38,38" fill="#D4B37F"/>
      <circle cx="32" cy="32" r="10" fill="none" stroke="#C9A227" stroke-width="1" opacity="0.3"/>
      <circle cx="32" cy="32" r="14" fill="none" stroke="#C9A227" stroke-width="0.7" opacity="0.2"/>
      <line x1="20" y1="20" x2="28" y2="28" stroke="#D4B37F" stroke-width="0.8" opacity="0.5"/>
      <line x1="36" y1="36" x2="44" y2="44" stroke="#D4B37F" stroke-width="0.8" opacity="0.5"/>
    </svg>`;
  } else if (type === 'Sita-echo') {
    return `<svg ${common}>
      <ellipse cx="32" cy="32" rx="8" ry="12" fill="#704B2E" stroke="#D4B37F" stroke-width="1.2" transform="rotate(-20 32 32)"/>
      <ellipse cx="32" cy="32" rx="8" ry="12" fill="#704B2E" stroke="#D4B37F" stroke-width="1.2" transform="rotate(20 32 32)"/>
      <ellipse cx="32" cy="32" rx="7" ry="11" fill="#8B5A2B" stroke="#C9A227" stroke-width="1"/>
      <circle cx="32" cy="32" r="4" fill="#D4B37F"/>
      <circle cx="32" cy="32" r="16" fill="none" stroke="#C9A227" stroke-width="1.5" opacity="0.6"/>
      <circle cx="32" cy="32" r="18" fill="none" stroke="#D4B37F" stroke-width="0.8" opacity="0.4"/>
      <path d="M28 42 Q32 46 36 42" fill="none" stroke="#E86A00" stroke-width="1.2" opacity="0.7"/>
    </svg>`;
  }
  return '';
}

const translations = {
  en: {
    appTitle: "My Pantheon",
    subtitle: "Your clan of echoes, born from the epics",
    framing: "Fictional stories inspired by ancient epics of dharma and karma. Creative narrative for 20-30s Indians.",
    createTitle: "Open a new pantheon",
    createSub: "Inspired by the virtues of the epics, create your unique Echoes.",
    clanNameLabel: "Pantheon Name",
    clanNamePh: "e.g. Light of Kurukshetra",
    mottoLabel: "Your Motto",
    mottoPh: "A line inspired by epics or family values",
    echoSelect: "Choose Echoes (3-5)",
    guide: "Fictional heroes inspired by epic virtues. Not the gods themselves.",
    navCreate: "Create",
    navMy: "My Pantheon",
    navExplore: "Explore",
    navFestivals: "Festivals",
    navSettings: "Settings",
    echoKrishna: "Echo of Krishna",
    traitKrishna: "Strategist · Wisdom",
    echoRama: "Echo of Rama",
    traitRama: "Duty · Courage",
    echoDraupadi: "Echo of Draupadi",
    traitDraupadi: "Resilience · Justice",
    echoHanuman: "Echo of Hanuman",
    traitHanuman: "Loyalty · Devotion",
    echoDurga: "Echo of Durga",
    traitDurga: "Protector · Strength",
    echoArjuna: "Echo of Arjuna",
    traitArjuna: "Focus · Courage",
    echoSita: "Echo of Sita",
    traitSita: "Endurance · Purity",
    createBtn: "Create Pantheon",
    previewTitle: "Your Clan Aura (live preview)",
    previewHint: "Select 3+ Echoes to see your Pantheon come alive...",
    myTitle: "Your Pantheon",
    addStory: "Add Story / Retell",
    storyGuide: "Write your own fictional story. We don't prefill. The value is in what you create.",
    storyPh: "120-160 chars · positive dharma story (daily kindness → legacy) · end — Echo of ... (fictional)",
    addBtn: "Add to Pantheon",
    directorBtn: "Ask Director for inspiration",
    storiesTitle: "Stories",
    shareBtn: "Share to Telegram",
    inviteBtn: "Invite Clan",
    exploreTitle: "Explore Pantheons",
    exploreHint: "See what others built — all fictional stories inspired by the epics (Raji style).",
    festivalsTitle: "Festivals 2026",
    ganeshTitle: "✧ Ganesh Chaturthi",
    ganeshDate: "Sep 14",
    ganeshDesc: "New beginnings — Create a fresh echo story for your clan. Together we rise.",
    ganeshBtn: "Join Clan Challenge",
    navratriTitle: "✧ Navratri / Dussehra",
    navratriDate: "Oct 11–20",
    navratriDesc: "Power & victory — 9-day clan contribution streak. Strength in unity.",
    navratriBtn: "Join Clan Challenge",
    diwaliTitle: "✧ Diwali",
    diwaliDate: "Nov 8",
    diwaliDesc: "Light & prosperity — Collaborative light-themed retells. Share the glow.",
    diwaliBtn: "Join Clan Challenge",
    festivalsNote: "Clan goals unlock shared prestige. Limited echoes during events. Your story matters.",
    footer: "Positive engagement only • Fictional inspired by epics",
    settingsTitle: "Settings",
    notifLabel: "Notifications",
    notifDesc: "Celebration toasts after shares & events",
    langLabel: "Language",
    langDesc: "English + Indian languages (North & South)",
    aboutLabel: "About this app",
    aboutDesc: "Fictional stories inspired by ancient epics of dharma and karma. Creative narrative for 20-30s Indians.",
    resetBtn: "Reset All Progress",
    resetDesc: "This is a reversible demo. All data is local.",
    noPantheon: "No pantheon yet.<br>Write your own story to build your clan.",
    noPantheonBtn: "Create Pantheon",
    likeShare: "Like & Share",
    clanStatus: "Clan Status",
    statusEchoes: "Echoes",
    statusStories: "Stories",
    statusShares: "Shares",
    statusShareKarma: "From Sharing",
    statusPrestige: "Prestige",
    statusNote: "Every share spreads the light and grows your karma."
  },
  hi: {
    appTitle: "मेरा पैंथियन",
    subtitle: "महाकाव्यों से जन्मी आपकी इको की टोली",
    framing: "प्राचीन महाकाव्यों से प्रेरित काल्पनिक कहानियाँ। धर्म और कर्म पर आधारित रचनात्मक आख्यान • 20-30 के भारतीयों के लिए।",
    createTitle: "नया पैंथियन खोलें",
    createSub: "महाकाव्यों की सद्गुणों से प्रेरित होकर, अपनी अनूठी इको बनाएं।",
    clanNameLabel: "पैंथियन का नाम",
    clanNamePh: "उदाहरण: कुरुक्षेत्र की रोशनी",
    mottoLabel: "आपका मंत्र",
    mottoPh: "महाकाव्यों या पारिवारिक मूल्यों से प्रेरित एक पंक्ति",
    echoSelect: "इको चुनें (3-5)",
    guide: "महाकाव्यों के सद्गुणों से प्रेरित काल्पनिक नायक। स्वयं देवता नहीं।",
    navCreate: "बनाएं",
    navMy: "मेरा पैंथियन",
    navExplore: "खोजें",
    navFestivals: "त्योहार",
    navSettings: "सेटिंग्स",
    echoKrishna: "कृष्ण की इको",
    traitKrishna: "रणनीतिकार · ज्ञान",
    echoRama: "राम की इको",
    traitRama: "कर्तव्य · साहस",
    echoDraupadi: "द्रौपदी की इको",
    traitDraupadi: "लचीलापन · न्याय",
    echoHanuman: "हनुमान की इको",
    traitHanuman: "निष्ठा · समर्पण",
    echoDurga: "दुर्गा की इको",
    traitDurga: "रक्षक · शक्ति",
    echoArjuna: "अर्जुन की इको",
    traitArjuna: "एकाग्रता · साहस",
    echoSita: "सीता की इको",
    traitSita: "धैर्य · पवित्रता",
    createBtn: "पैंथियन बनाएं",
    previewTitle: "आपकी कबीला आभा (लाइव पूर्वावलोकन)",
    previewHint: "अपने पैंथियन को जीवंत देखने के लिए 3+ इको चुनें...",
    myTitle: "आपका पैंथियन",
    addStory: "कहानी जोड़ें / दोहराएं",
    storyGuide: "अपनी खुद की काल्पनिक कहानी लिखें। हम पहले से नहीं भरते। मूल्य आपकी रचना में है।",
    storyPh: "120-160 अक्षर · सकारात्मक धर्म कहानी (दैनिक दया → विरासत) · अंत — इको की ... (काल्पनिक)",
    addBtn: "पैंथियन में जोड़ें",
    directorBtn: "प्रेरणा के लिए निदेशक से पूछें",
    storiesTitle: "कहानियाँ",
    shareBtn: "टेलीग्राम पर शेयर करें",
    inviteBtn: "कबीला आमंत्रित करें",
    exploreTitle: "पैंथियन खोजें",
    exploreHint: "देखें दूसरों ने क्या बनाया — सभी काल्पनिक कहानियाँ महाकाव्यों से प्रेरित (राजी शैली)।",
    festivalsTitle: "त्योहार 2026",
    ganeshTitle: "✧ गणेश चतुर्थी",
    ganeshDate: "सितंबर 14",
    ganeshDesc: "नई शुरुआत — अपनी कबीला के लिए ताजा इको कहानी बनाएं। साथ मिलकर हम ऊपर उठते हैं।",
    ganeshBtn: "कबीला चुनौती में शामिल हों",
    navratriTitle: "✧ नवरात्रि / दशहरा",
    navratriDate: "अक्टूबर 11–20",
    navratriDesc: "शक्ति और विजय — 9 दिन की कबीला योगदान श्रृंखला। एकता में शक्ति।",
    navratriBtn: "कबीला चुनौती में शामिल हों",
    diwaliTitle: "✧ दीवाली",
    diwaliDate: "नवंबर 8",
    diwaliDesc: "प्रकाश और समृद्धि — सहयोगी प्रकाश-थीम वाली कहानियाँ। चमक साझा करें।",
    diwaliBtn: "कबीला चुनौती में शामिल हों",
    festivalsNote: "कबीला लक्ष्य साझा प्रतिष्ठा खोलते हैं। त्योहारों के दौरान सीमित इको। आपकी कहानी मायने रखती है।",
    footer: "केवल सकारात्मक सहभागिता • महाकाव्यों से प्रेरित काल्पनिक",
    settingsTitle: "सेटिंग्स",
    notifLabel: "सूचनाएं",
    notifDesc: "शेयर और इवेंट के बाद उत्सव टोस्ट",
    langLabel: "भाषा",
    langDesc: "अंग्रेजी + भारतीय भाषाएं (उत्तर और दक्षिण)",
    aboutLabel: "इस ऐप के बारे में",
    aboutDesc: "प्राचीन महाकाव्यों से प्रेरित काल्पनिक कहानियाँ। 20-30 के भारतीयों के लिए रचनात्मक आख्यान।",
    resetBtn: "सभी प्रगति रीसेट करें",
    resetDesc: "यह एक प्रतिवर्ती डेमो है। सभी डेटा स्थानीय है।",
    noPantheon: "अभी तक कोई पैंथियन नहीं।<br>अपनी कहानी लिखकर अपनी कबीला बनाएं।",
    noPantheonBtn: "पैंथियन बनाएं",
    likeShare: "पसंद करें और शेयर करें",
    clanStatus: "कबीला स्थिति",
    statusEchoes: "इको",
    statusStories: "कहानियाँ",
    statusShares: "शेयर",
    statusShareKarma: "शेयर से",
    statusPrestige: "प्रतिष्ठा",
    statusNote: "हर शेयर प्रकाश फैलाता है और आपका कर्म बढ़ाता है।"
  },
  ta: {
    appTitle: "என் பாந்தியன்",
    subtitle: "காவியங்களிலிருந்து பிறந்த உங்கள் எதிரொலிகளின் குழு",
    framing: "தர்மம் மற்றும் கர்மாவின் பண்டைய காவியங்களிலிருந்து உருவாக்கப்பட்ட கற்பனை கதைகள். 20-30 வயது இந்தியர்களுக்கான படைப்பு கதை •",
    createTitle: "புதிய பாந்தியனைத் திற",
    createSub: "காவியங்களின் நற்பண்புகளால் ஊக்கமடைந்து, உங்கள் தனித்துவமான எதிரொலியை உருவாக்குங்கள்.",
    clanNameLabel: "பாந்தியன் பெயர்",
    clanNamePh: "எ.கா: குருக்ஷேத்திரத்தின் ஒளி",
    mottoLabel: "உங்கள் குறிக்கோள்",
    mottoPh: "காவியங்கள் அல்லது குடும்ப மதிப்புகளால் ஊக்கமளிக்கும் ஒரு வரி",
    echoSelect: "எதிரொலிகளைத் தேர்ந்தெடு (3-5)",
    guide: "காவிய நற்பண்புகளால் ஊக்கமளிக்கப்பட்ட கற்பனை ஹீரோக்கள். கடவுள்களே அல்ல.",
    navCreate: "உருவாக்கு",
    navMy: "என் பாந்தியன்",
    navExplore: "ஆராய",
    navFestivals: "திருவிழாக்கள்",
    navSettings: "அமைப்புகள்",
    echoKrishna: "கிருஷ்ணாவின் எதிரொலி",
    traitKrishna: "உத்தி வல்லுநர் · ஞானம்",
    echoRama: "ராமாவின் எதிரொலி",
    traitRama: "கடமை · தைரியம்",
    echoDraupadi: "திரௌபதியின் எதிரொலி",
    traitDraupadi: "மீள்திறன் · நீதி",
    echoHanuman: "ஹனுமானின் எதிரொலி",
    traitHanuman: "விசுவாசம் · பக்தி",
    echoDurga: "துர்க்காவின் எதிரொலி",
    traitDurga: "பாதுகாவலர் · வலிமை",
    echoArjuna: "அர்ஜுனாவின் எதிரொலி",
    traitArjuna: "கவனம் · தைரியம்",
    echoSita: "சீதாவின் எதிரொலி",
    traitSita: "பொறுமை · தூய்மை",
    createBtn: "பாந்தியனை உருவாக்கு",
    previewTitle: "உங்கள் குல ஆரா (நேரடி முன்னோட்டம்)",
    previewHint: "உங்கள் பாந்தியனை உயிர்ப்பிக்க 3+ எதிரொலிகளைத் தேர்ந்தெடுக்கவும்...",
    myTitle: "உங்கள் பாந்தியன்",
    addStory: "கதை சேர்க்க / மீண்டும் சொல்ல",
    storyGuide: "உங்கள் சொந்த கற்பனை கதையை எழுதுங்கள். நாங்கள் முன்கூட்டியே நிரப்ப மாட்டோம். மதிப்பு நீங்கள் உருவாக்குவதில் உள்ளது.",
    storyPh: "120-160 எழுத்துக்கள் · நேர்மறை தர்ம கதை (தினசரி கருணை → மரபு) · முடிவு — எதிரொலி ... (கற்பனை)",
    addBtn: "பாந்தியனில் சேர்க்க",
    directorBtn: "உத்வேகத்திற்கு இயக்குநரிடம் கேளுங்கள்",
    storiesTitle: "கதைகள்",
    shareBtn: "டெலிகிராமில் பகிர்",
    inviteBtn: "குலத்தை அழை",
    exploreTitle: "பாந்தியன்களை ஆராய",
    exploreHint: "மற்றவர்கள் என்ன உருவாக்கினர் என்பதைப் பார்க்க — அனைத்தும் காவியங்களால் ஊக்கமளிக்கப்பட்ட கற்பனை கதைகள் (ராஜி பாணி).",
    festivalsTitle: "திருவிழாக்கள் 2026",
    ganeshTitle: "✧ கணேஷ் சதுர்த்தி",
    ganeshDate: "செப் 14",
    ganeshDesc: "புதிய தொடக்கங்கள் — உங்கள் குலத்திற்கு புதிய எதிரொலி கதையை உருவாக்குங்கள். ஒன்றாக நாம் உயர்வோம்.",
    ganeshBtn: "குல சவாலில் சேர",
    navratriTitle: "✧ நவராத்திரி / தசரா",
    navratriDate: "அக் 11–20",
    navratriDesc: "சக்தி & வெற்றி — 9 நாள் குல பங்களிப்பு தொடர். ஒற்றுமையில் வலிமை.",
    navratriBtn: "குல சவாலில் சேர",
    diwaliTitle: "✧ தீபாவளி",
    diwaliDate: "நவ 8",
    diwaliDesc: "ஒளி & செழிப்பு — ஒத்துழைப்பு ஒளி-தீம் கதைகள். ஒளியைப் பகிருங்கள்.",
    diwaliBtn: "குல சவாலில் சேர",
    festivalsNote: "குல இலக்குகள் பகிர்ந்த பிரதிஷ்டையைத் திறக்கின்றன. நிகழ்வுகளின் போது வரையறுக்கப்பட்ட எதிரொலிகள். உங்கள் கதை முக்கியம்.",
    footer: "நேர்மறை ஈடுபாடு மட்டும் • காவியங்களால் ஊக்கமளிக்கப்பட்ட கற்பனை",
    settingsTitle: "அமைப்புகள்",
    notifLabel: "அறிவிப்புகள்",
    notifDesc: "பங்கீடுகள் & நிகழ்வுகளுக்குப் பின் கொண்டாட்ட டோஸ்ட்கள்",
    langLabel: "மொழி",
    langDesc: "ஆங்கிலம் + இந்திய மொழிகள் (வடக்கு & தெற்கு)",
    aboutLabel: "இந்த ஆப் பற்றி",
    aboutDesc: "தர்மம் மற்றும் கர்மாவின் பண்டைய காவியங்களால் ஊக்கமளிக்கப்பட்ட கற்பனை கதைகள். 20-30 வயது இந்தியர்களுக்கான படைப்பு கதை.",
    resetBtn: "அனைத்து முன்னேற்றத்தையும் மீட்டமை",
    resetDesc: "இது ஒரு திரும்பக்கூடிய டெமோ. அனைத்து தரவும் உள்ளூர்.",
    noPantheon: "இன்னும் பாந்தியன் இல்லை.<br>உங்கள் கதையை எழுதி உங்கள் குலத்தை உருவாக்குங்கள்.",
    noPantheonBtn: "பாந்தியனை உருவாக்கு",
    likeShare: "விரும்பு & பகிர்",
    clanStatus: "குல நிலை",
    statusEchoes: "எதிரொலிகள்",
    statusStories: "கதைகள்",
    statusShares: "பங்கீடுகள்",
    statusShareKarma: "பங்கீட்டிலிருந்து",
    statusPrestige: "பிரதிஷ்டை",
    statusNote: "ஒவ்வொரு பங்கீடும் ஒளியைப் பரப்பி உங்கள் கர்மாவை வளர்க்கிறது."
  },
  te: {
    appTitle: "నా పాంథియన్",
    subtitle: "మహాకావ్యాల నుండి పుట్టిన మీ ప్రతిధ్వనుల సమూహం",
    framing: "ధర్మం మరియు కర్మ యొక్క ప్రాచీన మహాకావ్యాల నుండి ప్రేరణ పొందిన కల్పిత కథలు. 20-30 సంవత్సరాల భారతీయులకు సృజనాత్మక కథ •",
    createTitle: "కొత్త పాంథియన్‌ను తెరవండి",
    createSub: "మహాకావ్యాల సద్గుణాల నుండి ప్రేరణ పొంది, మీ ప్రత్యేకమైన ప్రతిధ్వనిని సృష్టించండి.",
    clanNameLabel: "పాంథియన్ పేరు",
    clanNamePh: "ఉదా: కురుక్షేత్రం యొక్క వెలుగు",
    mottoLabel: "మీ నినాదం",
    mottoPh: "మహాకావ్యాలు లేదా కుటుంబ విలువల నుండి ప్రేరణ పొందిన ఒక వాక్యం",
    echoSelect: "ప్రతిధ్వనులను ఎంచుకో (3-5)",
    guide: "మహాకావ్య సద్గుణాల నుండి ప్రేరణ పొందిన కల్పిత హీరోలు. దేవతలు కాదు.",
    navCreate: "సృష్టించు",
    navMy: "నా పాంథియన్",
    navExplore: "అన్వేషించు",
    navFestivals: "పండుగలు",
    navSettings: "సెట్టింగులు",
    echoKrishna: "కృష్ణుని ప్రతిధ్వని",
    traitKrishna: "వ్యూహకర్త · జ్ఞానం",
    echoRama: "రాముని ప్రతిధ్వని",
    traitRama: "కర్తవ్యం · ధైర్యం",
    echoDraupadi: "ద్రౌపది ప్రతిధ్వని",
    traitDraupadi: "స్థితిస్థాపకత · న్యాయం",
    echoHanuman: "హనుమంతుని ప్రతిధ్వని",
    traitHanuman: "నిష్ఠ · భక్తి",
    echoDurga: "దుర్గా ప్రతిధ్వని",
    traitDurga: "రక్షకుడు · బలం",
    echoArjuna: "అర్జునుని ప్రతిధ్వని",
    traitArjuna: "దృష్టి · ధైర్యం",
    echoSita: "సీతా ప్రతిధ్వని",
    traitSita: "సహనం · పవిత్రత",
    createBtn: "పాంథియన్ సృష్టించు",
    previewTitle: "మీ క్లాన్ ఆరా (లైవ్ ప్రివ్యూ)",
    previewHint: "మీ పాంథియన్‌ను సజీవంగా చూడటానికి 3+ ప్రతిధ్వనులను ఎంచుకోండి...",
    myTitle: "మీ పాంథియన్",
    addStory: "కథ జోడించు / మళ్లీ చెప్పు",
    storyGuide: "మీ స్వంత కల్పిత కథను వ్రాయండి. మేము ముందుగా నింపము. విలువ మీరు సృష్టించేదానిలో ఉంది.",
    storyPh: "120-160 అక్షరాలు · సానుకూల ధర్మ కథ (రోజువారీ దయ → వారసత్వం) · ముగింపు — ప్రతిధ్వని ... (కల్పిత)",
    addBtn: "పాంథియన్‌కు జోడించు",
    directorBtn: "ప్రేరణ కోసం డైరెక్టర్‌ను అడగండి",
    storiesTitle: "కథలు",
    shareBtn: "టెలిగ్రామ్‌కు షేర్ చేయి",
    inviteBtn: "క్లాన్‌ను ఆహ్వానించు",
    exploreTitle: "పాంథియన్లను అన్వేషించు",
    exploreHint: "ఇతరులు ఏమి నిర్మించారో చూడండి — అన్నీ మహాకావ్యాల నుండి ప్రేరణ పొందిన కల్పిత కథలు (రాజి శైలి).",
    festivalsTitle: "పండుగలు 2026",
    ganeshTitle: "✧ గణేష్ చతుర్థి",
    ganeshDate: "సెప్టెం 14",
    ganeshDesc: "కొత్త మొదలు — మీ క్లాన్ కోసం తాజా ప్రతిధ్వని కథను సృష్టించండి. కలిసి మనం ఎదుగుతాం.",
    ganeshBtn: "క్లాన్ సవాలులో చేరండి",
    navratriTitle: "✧ నవరాత్రి / దశరా",
    navratriDate: "అక్టో 11–20",
    navratriDesc: "శక్తి & విజయం — 9 రోజుల క్లాన్ సహకార స్ట్రీక్. ఐక్యతలో బలం.",
    navratriBtn: "క్లాన్ సవాలులో చేరండి",
    diwaliTitle: "✧ దీపావళి",
    diwaliDate: "నవం 8",
    diwaliDesc: "వెలుగు & సంపద — సహకార వెలుగు-థీమ్ కథలు. కాంతిని పంచండి.",
    diwaliBtn: "క్లాన్ సవాలులో చేరండి",
    festivalsNote: "క్లాన్ లక్ష్యాలు భాగస్వామ్య ప్రతిష్టను అన్‌లాక్ చేస్తాయి. ఈవెంట్ల సమయంలో పరిమిత ప్రతిధ్వనులు. మీ కథ ముఖ్యం.",
    footer: "సానుకూల నిమగ్నత మాత్రమే • మహాకావ్యాల నుండి ప్రేరణ పొందిన కల్పిత",
    settingsTitle: "సెట్టింగులు",
    notifLabel: "నోటిఫికేషన్లు",
    notifDesc: "షేర్లు & ఈవెంట్ల తర్వాత సెలబ్రేషన్ టోస్టులు",
    langLabel: "భాష",
    langDesc: "ఆంగ్లం + భారతీయ భాషలు (ఉత్తర & దక్షిణ)",
    aboutLabel: "ఈ యాప్ గురించి",
    aboutDesc: "ధర్మం మరియు కర్మ యొక్క ప్రాచీన మహాకావ్యాల నుండి ప్రేరణ పొందిన కల్పిత కథలు. 20-30 సంవత్సరాల భారతీయులకు సృజనాత్మక కథ.",
    resetBtn: "అన్ని పురోగతిని రీసెట్ చేయి",
    resetDesc: "ఇది తిరిగి పొందదగిన డెమో. అన్ని డేటా స్థానికం.",
    noPantheon: "ఇంకా పాంథియన్ లేదు.<br>మీ కథను వ్రాసి మీ క్లాన్‌ను నిర్మించండి.",
    noPantheonBtn: "పాంథియన్ సృష్టించు",
    likeShare: "ఇష్టపడు & షేర్ చేయి",
    clanStatus: "క్లాన్ స్థితి",
    statusEchoes: "ప్రతిధ్వనులు",
    statusStories: "కథలు",
    statusShares: "షేర్లు",
    statusShareKarma: "షేరింగ్ నుండి",
    statusPrestige: "ప్రతిష్ట",
    statusNote: "ప్రతి షేర్ కాంతిని వ్యాప్తి చేసి మీ కర్మను పెంచుతుంది."
  }
  // Add more languages (bn, mr, etc.) similarly for full coverage. Research agents activated for accuracy.
};

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('p2_lang', lang);
  const t = translations[lang] || translations.en;

  // Update static elements
  document.querySelector('h1').textContent = t.appTitle;
  const sub = document.querySelector('.subtitle');
  if (sub) sub.textContent = t.subtitle;
  // rank5: for English keep the richer HTML original (it carries the live festival FOMO lines
  // — Ganesh/Navratri/Diwali — that the translation strings don't). Only rebuild for other langs.
  const framing = document.querySelector('.framing');
  if (framing && lang !== 'en') framing.innerHTML = `<strong>${escapeHtml(t.framing.split('. ')[0])}.</strong><br><span>${escapeHtml(t.framing.split('. ').slice(1).join('. '))}</span>`;

  // Create tab
  const createH2 = document.querySelector('#tab-create h2');
  if (createH2) createH2.textContent = t.createTitle;
  const createSub = document.querySelector('#tab-create .section-sub');
  if (createSub) createSub.textContent = t.createSub;
  // rank6: select the 3 form labels by stable structure (direct .form-group children), not by
  // English/Telugu-only text matching (which stuck labels when switching between non-English langs).
  const fgLabels = document.querySelectorAll('#tab-create .form-group > label');
  if (fgLabels[0]) fgLabels[0].textContent = t.clanNameLabel;
  if (fgLabels[1]) fgLabels[1].textContent = t.mottoLabel;
  if (fgLabels[2]) fgLabels[2].textContent = t.echoSelect;
  // rank6: bottom-nav labels translated by data-tab (stable), so every language covers navigation.
  const navMap = { create: t.navCreate, my: t.navMy, explore: t.navExplore, events: t.navFestivals, settings: t.navSettings };
  document.querySelectorAll('.bottom-nav button').forEach(b => {
    const lbl = b.querySelector('div:last-child');
    if (lbl && navMap[b.dataset.tab]) lbl.textContent = navMap[b.dataset.tab];
  });
  const clanPh = document.getElementById('clan-name');
  if (clanPh) clanPh.placeholder = t.clanNamePh;
  const mottoPh = document.getElementById('clan-desc');
  if (mottoPh) mottoPh.placeholder = t.mottoPh;
  const guide = document.querySelector('#tab-create .guide-small');
  if (guide) guide.innerHTML = t.guide + ' <span style="color:#c9a227; opacity:.7;">(Premium Raji miniature icons)</span>';

  // Echo cards - update names/traits
  const echoCards = document.querySelectorAll('.echo-card');
  echoCards.forEach(card => {
    const name = card.querySelector('.echo-name');
    const trait = card.querySelector('.echo-trait');
    const val = card.querySelector('input').value;
    if (val === 'Krishna-echo') { name.textContent = t.echoKrishna; trait.textContent = t.traitKrishna; }
    else if (val === 'Rama-echo') { name.textContent = t.echoRama; trait.textContent = t.traitRama; }
    else if (val === 'Draupadi-echo') { name.textContent = t.echoDraupadi; trait.textContent = t.traitDraupadi; }
    else if (val === 'Hanuman-echo') { name.textContent = t.echoHanuman; trait.textContent = t.traitHanuman; }
    else if (val === 'Durga-echo') { name.textContent = t.echoDurga; trait.textContent = t.traitDurga; }
    else if (val === 'Arjuna-echo') { name.textContent = t.echoArjuna; trait.textContent = t.traitArjuna; }
    else if (val === 'Sita-echo') { name.textContent = t.echoSita; trait.textContent = t.traitSita; }
  });

  const createBtn = document.querySelector('#tab-create button.primary');
  if (createBtn) createBtn.textContent = t.createBtn;

  // Preview
  const previewP = document.querySelector('.preview-section .guide-small');
  if (previewP) previewP.textContent = t.previewTitle;
  const previewHint = document.querySelector('#aura-preview .hint');
  if (previewHint) previewHint.textContent = t.previewHint;

  // My Pantheon
  const myH2 = document.querySelector('#tab-my h2');
  if (myH2) myH2.textContent = t.myTitle;
  const addH3 = document.querySelector('#tab-my .section h3');
  if (addH3) addH3.textContent = t.addStory;
  const storyGuide = document.querySelector('#tab-my .guide');
  if (storyGuide) storyGuide.textContent = t.storyGuide;
  const storyGuideSmall = document.querySelector('#tab-my .guide-small');
  if (storyGuideSmall) storyGuideSmall.textContent = 'Value = what you create yourself. We do not prefill.';
  // rank5: do NOT overwrite the crafted .example narrative with the short guide —
  // the example and the guide are separate content. (Translated examples are a future add to `translations`.)
  const storyPh = document.getElementById('story-text');
  if (storyPh) storyPh.placeholder = t.storyPh;
  const addStoryBtn = document.querySelector('#story-form button.primary');
  if (addStoryBtn) addStoryBtn.textContent = t.addBtn;

  // Story progress (works across languages)
  const storyTaEl = document.getElementById('story-text');
  const pFill = document.getElementById('story-progress-fill');
  const pText = document.getElementById('story-progress-text');
  if (storyTaEl && pFill && pText) {
    const upd = () => {
      const l = storyTaEl.value.length;
      pFill.style.width = Math.min((l / 160) * 100, 100) + '%';
      pText.textContent = `${l} / 160`;
    };
    storyTaEl.oninput = upd;  // QA P2 fix: oninput=교체(중복등록 방지) — 언어 변경마다 리스너 누적하던 것
    setTimeout(upd, 50);
  }
  const directorBtn = document.querySelector('#story-form button.secondary');
  if (directorBtn) directorBtn.textContent = t.directorBtn;
  const storiesH = document.querySelector('#tab-my .section:nth-child(3) h3');
  if (storiesH) storiesH.textContent = t.storiesTitle;
  const shareBtn = document.querySelector('.actions button.primary');
  if (shareBtn) shareBtn.textContent = t.shareBtn;
  const inviteBtn = document.querySelector('.actions button.secondary');
  if (inviteBtn) inviteBtn.textContent = t.inviteBtn;

  // Explore
  const expH2 = document.querySelector('#tab-explore h2');
  if (expH2) expH2.textContent = t.exploreTitle;
  const expHint = document.querySelector('#tab-explore .hint');
  if (expHint) expHint.textContent = t.exploreHint;

  // Festivals
  const fesH2 = document.querySelector('#tab-events h2');
  if (fesH2) fesH2.textContent = t.festivalsTitle;
  // Update event cards dynamically if needed

  // Footer
  const footer = document.querySelector('footer small');
  if (footer) footer.textContent = t.footer;

  // Status
  const statusHeader = document.querySelector('.clan-status .status-header');
  if (statusHeader) statusHeader.textContent = t.clanStatus;
  // Update labels in status if needed via data or re-render

  // No pantheon
  const noP = document.getElementById('no-pantheon');
  if (noP) noP.innerHTML = `<p>${t.noPantheon}</p><button onclick="switchTab('create')" class="primary">${t.noPantheonBtn}</button>`;
}

function initLanguage() {
  const select = document.getElementById('lang-select');
  if (select) {
    select.value = currentLang;
    select.addEventListener('change', (e) => {
      applyLanguage(e.target.value);
      if (document.getElementById('tab-my').classList.contains('active')) renderMyPantheon();
      if (document.getElementById('tab-explore').classList.contains('active')) renderExplore();
    });
  }
  applyLanguage(currentLang);
}

// Tab switching
function switchTab(tab) {
  // rank9: no 180ms blank-wait. Toggle classes synchronously; fade only the newly-active tab.
  document.querySelectorAll('.bottom-nav button').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => {
    c.classList.remove('active');
    c.style.opacity = '';
    c.style.transition = '';
  });

  const activeBtn = document.querySelector(`.bottom-nav button[data-tab="${tab}"]`);
  if (activeBtn) activeBtn.classList.add('active');

  const activeContent = document.getElementById(`tab-${tab}`);
  if (activeContent) {
    activeContent.classList.add('active');
    // render synchronously so the tab lands fully-formed (removes the double stall)
    if (tab === 'explore') renderExplore();
    if (tab === 'events') renderFestivals();
    if (tab === 'my') updateMainButton();
    // gentle in-sync fade on the new tab only
    activeContent.style.opacity = '0';
    requestAnimationFrame(() => {
      activeContent.style.transition = 'opacity .15s ease';
      activeContent.style.opacity = '1';
    });
  }
  haptic('light');
}

// Load state
// Quick-Start onboarding (do-now): English-typing is the #1 dropout for our audience. One tap → first Pantheon, no typing.
const P2_QS_NAMES = ["Dawn of Dharma","Hearts of Ayodhya","The Kurukshetra Vow","Lamps of Diwali","Children of the Ganga","The Unbroken Promise","Light of the Epics"];
function p2QuickStart(){
  const cbs = Array.prototype.slice.call(document.querySelectorAll('#tab-create input[type="checkbox"]')).slice(0,3);
  const echoes = cbs.map(function(c){return c.value;});
  if (echoes.length < 3) { showToast('Loading echoes...'); return; }
  const name = P2_QS_NAMES[Math.floor(Math.random()*P2_QS_NAMES.length)];
  const displayEchoes = echoes.map(function(e){ return (typeof echoMap!=='undefined' && echoMap[e]) || e; });
  currentPantheon = { name: name, desc: '', echoes: displayEchoes, stories: [], created: new Date().toISOString() };
  sharesCount = 0; savePantheon();
  try { showCreationRitual(displayEchoes, name); } catch(e){}
  setTimeout(function(){ try { switchTab('my'); renderMyPantheon(); } catch(e){} }, 2000);
  var qs = document.getElementById('p2-quickstart'); if (qs) qs.remove();
}
function p2InjectQuickStart(){
  if (currentPantheon) return; // returning users skip
  if (document.getElementById('p2-quickstart')) return;
  const host = document.getElementById('tab-create'); if (!host) return;
  const box = document.createElement('div');
  box.id = 'p2-quickstart';
  box.style.cssText = 'margin:10px 0;padding:14px;border-radius:14px;background:linear-gradient(135deg,#1a1206,#241a08);border:1px solid rgba(201,162,39,.35);';
  box.innerHTML = '<div style="font-size:14px;font-weight:800;color:#e8cf8a;margin-bottom:4px;">\u26a1 Start in one tap</div>'
    + '<div style="font-size:12px;color:#c9b98a;opacity:.85;margin-bottom:10px;line-height:1.5;">New here? Skip the setup \u2014 we\'ll open your first Pantheon with three Echoes. You can rename and add your own stories after.</div>'
    + '<button id="p2-qs-btn" style="width:100%;padding:12px;border:none;border-radius:11px;background:linear-gradient(135deg,#c9a227,#a67c00);color:#1a1400;font-weight:800;font-size:15px;cursor:pointer;">\u2728 Open my Pantheon \u2192</button>';
  host.insertBefore(box, host.firstChild ? host.firstChild.nextSibling : null);
  const btn = document.getElementById('p2-qs-btn'); if (btn) btn.onclick = p2QuickStart;
}
function loadState() {
  const saved = localStorage.getItem('p2_pantheon');
  if (saved) {
    currentPantheon = JSON.parse(saved);
  }
  karma = parseInt(localStorage.getItem('p2_karma') || '0');
  prestige = parseInt(localStorage.getItem('p2_prestige') || '1');
  sharesCount = parseInt(localStorage.getItem('p2_shares') || '0');
  notifEnabled = localStorage.getItem('p2_notif') !== 'false';
  initIdentity();        // 🪖 uid·Founder·streak·refs 로드
  updateHeaderStats();
}

// Save
function savePantheon() {
  if (currentPantheon) localStorage.setItem('p2_pantheon', JSON.stringify(currentPantheon));
  localStorage.setItem('p2_karma', karma);
  localStorage.setItem('p2_prestige', prestige);
  localStorage.setItem('p2_shares', sharesCount);
  localStorage.setItem('p2_notif', notifEnabled);
}

let _karmaShown = 0;      // last rendered karma value (for count-up tween, rank17)
let _lastProg = 0;        // last prestige-progress % (for level-up flourish, rank16)
let _karmaRaf = null;
let _karmaPopTimer = null;
let _spendMode = false;   // Karma Atelier: suppress false level-up flourish when balance is spent (sink)

function updateHeaderStats() {
  const k = document.getElementById('header-karma');
  const p = document.getElementById('header-prestige');
  if (k) {
    const target = karma;
    const from = _karmaShown;
    if (from !== target) {
      // rank17: count-up roll tween (ease-out), duration scales gently with delta
      if (_karmaRaf) cancelAnimationFrame(_karmaRaf);
      const delta = Math.abs(target - from);
      const dur = Math.min(600, 320 + delta * 12);
      const t0 = performance.now();
      const ease = x => 1 - Math.pow(1 - x, 3);
      const step = now => {
        const prog = Math.min((now - t0) / dur, 1);
        k.textContent = Math.round(from + (target - from) * ease(prog));
        if (prog < 1) { _karmaRaf = requestAnimationFrame(step); }
        else { k.textContent = target; _karmaShown = target; _karmaRaf = null; }
      };
      _karmaRaf = requestAnimationFrame(step);
      // landing pop accent (kept from before)
      k.style.transition = 'transform .2s cubic-bezier(.23,1,.32,1)';
      k.style.transform = 'scale(1.12)';
      if (_karmaPopTimer) clearTimeout(_karmaPopTimer);
      _karmaPopTimer = setTimeout(() => { k.style.transform = 'scale(1)'; _karmaPopTimer = null; }, 180);
    } else {
      k.textContent = target;
      _karmaShown = target;
    }
  }
  if (p) p.textContent = prestige;

  // Prestige progress bar (karma within current level)
  const fill = document.getElementById('prestige-fill');
  const text = document.getElementById('prestige-text');
  const prog = karma % 10;
  if (fill) {
    const progress = (prog / 10) * 100;
    if (progress < _lastProg - 0.01 && !_spendMode) {
      // rank16: level-up — fill to 100% + flash, then snap to 0 (no transition), then rise.
      // Prevents the bar visibly draining backwards (90%→20%) at the celebration moment.
      fill.style.transition = 'width .28s cubic-bezier(.23,1,.32,1)';
      fill.style.width = '100%';
      fill.style.boxShadow = '0 0 12px rgba(201,162,39,.85)';
      setTimeout(() => {
        fill.style.transition = 'none';
        fill.style.width = '0%';
        void fill.offsetWidth; // reflow before re-enabling transition
        fill.style.transition = 'width .5s cubic-bezier(.23,1,.32,1)';
        fill.style.boxShadow = '';
        fill.style.width = progress + '%';
      }, 320);
    } else {
      fill.style.transition = 'width .45s cubic-bezier(.23,1,.32,1)';
      fill.style.width = progress + '%';
    }
    _lastProg = progress;
  }
  if (text) {
    text.textContent = `${prog}/10 to next`;
  }

  // Epic prestige titles for visual wow
  const titles = ['Ashborn', 'Flame Seeker', 'Echo Warden', 'Karma Weaver', 'Star Guardian', 'Dharma Sovereign'];
  const titleEl = document.getElementById('prestige-title');
  if (titleEl) titleEl.textContent = titles[Math.min(prestige-1, titles.length-1)] || 'Legend';

  renderAscensionLadder();
}

// ===== Ascension Path — named status ladder derived from real (sticky) Prestige =====
// Honest: every value is read from the live `prestige` variable; nothing is fabricated.
// Prestige never drops (Karma Atelier sinks spendable Karma, not rank), so this ladder only climbs.
const ASCENSION_RANKS = [
  { p: 1,  name: 'Seeker',    icon: '·'  },
  { p: 3,  name: 'Initiate',  icon: '✦'  },
  { p: 6,  name: 'Adept',     icon: '✧'  },
  { p: 10, name: 'Luminary',  icon: '☀'  },
  { p: 16, name: 'Ascendant', icon: '🔱' },
  { p: 25, name: 'Avatar',    icon: '👑' },
];
function ensureAscensionStyles() {
  if (document.getElementById('p2-ascension-styles')) return;
  const st = document.createElement('style');
  st.id = 'p2-ascension-styles';
  st.textContent = [
    '.asc-block{margin-top:12px}',
    '.asc-head{display:flex;justify-content:space-between;align-items:center;font-size:13px;font-weight:700;color:#e8d9a0;margin-bottom:9px}',
    '.asc-head .asc-meta{font-size:10.5px;color:#c9a227;font-weight:600;opacity:.85}',
    '.asc-ladder{display:flex;flex-direction:column;gap:5px}',
    '.asc-tier{display:flex;align-items:center;gap:9px;padding:7px 10px;border-radius:10px;background:rgba(255,255,255,.03);border:1px solid rgba(201,162,39,.14);opacity:.6}',
    '.asc-tier.done{opacity:1;border-color:rgba(201,162,39,.4);background:rgba(201,162,39,.08)}',
    '.asc-tier.next{opacity:1;border-color:rgba(201,162,39,.6);background:rgba(201,162,39,.13);box-shadow:0 0 12px rgba(201,162,39,.18)}',
    '.asc-icon{font-size:15px;width:20px;text-align:center;flex:0 0 auto}',
    '.asc-name{font-size:12.5px;font-weight:700;color:#e8d9a0;flex:1 1 auto}',
    '.asc-tier:not(.done) .asc-name{color:#a9a48e}',
    '.asc-req{font-size:10.5px;color:#c9a227;font-weight:600}',
    '.asc-check{color:#c9a227;font-weight:700;font-size:12px}',
    '.asc-need{font-size:10.5px;font-weight:700;color:#e8d9a0;background:rgba(201,162,39,.2);padding:1px 7px;border-radius:9px}',
    '.asc-note{margin-top:8px;font-size:9.5px;color:#c9a227;text-align:center;opacity:.7}'
  ].join('');
  document.head.appendChild(st);
}
function renderAscensionLadder() {
  const el = document.getElementById('ascension-ladder');
  if (!el) return;
  ensureAscensionStyles();
  const nextP = (ASCENSION_RANKS.find(r => prestige < r.p) || {}).p;
  el.innerHTML = ASCENSION_RANKS.map(r => {
    const done = prestige >= r.p, next = r.p === nextP;
    return '<div class="asc-tier' + (done ? ' done' : '') + (next ? ' next' : '') + '">' +
      '<span class="asc-icon">' + r.icon + '</span>' +
      '<span class="asc-name">' + r.name + '</span>' +
      '<span class="asc-req">' + (done ? 'Attained' : 'Prestige ' + r.p) + '</span>' +
      (done ? '<span class="asc-check">✓</span>'
            : (next ? '<span class="asc-need">' + prestige + '/' + r.p + '</span>' : '')) +
      '</div>';
  }).join('');
}

// rank10: lightweight toast queue — each toast gets guaranteed screen time (min ~900ms) so the
// highest-value moments (Prestige-Up, jackpot) are never overwritten ~1ms later by the next toast.
let _toastQueue = [];
let _toastActive = false;
function showToast(message, duration = 2200) {
  if (!notifEnabled) return;
  _toastQueue.push({ message, duration });
  if (!_toastActive) _drainToast();
}
function _drainToast() {
  const toast = document.getElementById('toast');
  const text = document.getElementById('toast-text');
  if (!toast || !text) { _toastQueue = []; _toastActive = false; return; }
  const next = _toastQueue.shift();
  if (!next) { _toastActive = false; return; }
  _toastActive = true;

  text.textContent = next.message;
  toast.style.display = 'flex';
  void toast.offsetWidth; // force reflow
  toast.classList.add('show');

  const hold = Math.max(next.duration, 900);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.style.display = 'none';
      _drainToast();
    }, 300);
  }, hold);
}

function celebrateShare() {
  const k = document.getElementById('header-karma');
  if (!k) return;
  // rank18: cancel the 180ms karma-pop reset so it can't collapse this 420ms glow to scale(1) mid-flight.
  if (_karmaPopTimer) { clearTimeout(_karmaPopTimer); _karmaPopTimer = null; }
  const orig = k.style.transition;
  k.style.transition = 'transform .2s cubic-bezier(.23,1,.32,1), text-shadow .2s';
  k.style.transform = 'scale(1.35)';
  k.style.textShadow = '0 0 12px rgba(201,162,39,.8)';
  setTimeout(() => {
    k.style.transform = 'scale(1)';
    k.style.textShadow = '';
    setTimeout(() => {
      k.style.transition = orig || '';
    }, 200);
  }, 420);
}

function initSettings() {
  const toggle = document.getElementById('notif-toggle');
  if (toggle) {
    toggle.checked = notifEnabled;
    toggle.addEventListener('change', () => {
      notifEnabled = toggle.checked;
      localStorage.setItem('p2_notif', notifEnabled);
    });
  }

  // rank21: Ambient music toggle (default off), persisted. Injected here since it's script-owned.
  const settingsTab = document.getElementById('tab-settings');
  if (settingsTab && !document.getElementById('bgm-toggle')) {
    const sec = document.createElement('div');
    sec.className = 'section';
    sec.innerHTML = `
      <div class="setting-row">
        <div>
          <div class="setting-label">Ambient music</div>
          <div class="setting-desc">Soft luxurious background tones (off by default)</div>
        </div>
        <label class="switch"><input type="checkbox" id="bgm-toggle"><span class="slider"></span></label>
      </div>`;
    const firstSec = settingsTab.querySelector('.section');
    if (firstSec && firstSec.nextSibling) settingsTab.insertBefore(sec, firstSec.nextSibling);
    else settingsTab.appendChild(sec);
    const bt = document.getElementById('bgm-toggle');
    if (bt) {
      bt.checked = bgmEnabled;
      bt.addEventListener('change', () => {
        bgmEnabled = bt.checked;
        localStorage.setItem('p2_bgm', bgmEnabled);
        if (bgmEnabled) ensureBgm(); else stopBGM();
      });
    }
  }
}

function resetAllData() {
  if (!confirm('Reset all progress? (This cannot be undone)')) return;
  localStorage.clear();
  location.reload();
}

// Live Aura Preview - huge visual magic for Create
function updateAuraPreview() {
  const preview = document.getElementById('aura-preview');
  if (!preview) return;

  const checked = document.querySelectorAll('#tab-create input[type="checkbox"]:checked');
  preview.innerHTML = '';

  if (checked.length === 0) {
    preview.innerHTML = '<span class="hint">Select 3+ Echoes to see your Pantheon come alive...</span>';
    return;
  }

  checked.forEach(cb => {
    const val = cb.value;
    const label = document.querySelector(`label.echo-card input[value="${val}"]`).closest('label');
    const nameEl = label.querySelector('.echo-name');
    const name = nameEl ? nameEl.textContent : val;
    const item = document.createElement('span');
    item.className = 'preview-item';
    item.innerHTML = `${getEchoIcon(val, 14)} ${name}`;
    preview.appendChild(item);
  });
}

// Attach live preview listeners (call after DOM ready)
function initAuraPreview() {
  const checks = document.querySelectorAll('#tab-create input[type="checkbox"]');
  checks.forEach(c => {
    c.addEventListener('change', (e) => {
      updateAuraPreview();
      // Micro detail: the card gets a quick elegant "acknowledge" flash
      const card = c.closest('.echo-card');
      if (card) {
        card.style.transition = 'box-shadow .1s ease';
        card.style.boxShadow = c.checked 
          ? '0 0 0 2px rgba(201,162,39,.6)' 
          : '';
        setTimeout(() => {
          card.style.transition = 'all .35s cubic-bezier(.23,1,.32,1)';
          card.style.boxShadow = '';
        }, 120);
      }
    });
  });
  // initial
  setTimeout(updateAuraPreview, 100);
}

function addKarma(points) {
  karma += points;
  const newPrest = Math.floor(karma / 10) + 1;
  if (newPrest > prestige) {
    prestige = newPrest;
    showToast(`Prestige Up! Now Level ${prestige} ✧`, 2800);
    celebratePrestige();
    haptic('success');   // rank20: peak reward = success haptic
  }
  updateHeaderStats();
  savePantheon();
  // rank14: only refresh the changing status numbers — no full re-render of the SVG echoes /
  // stories subtree on every single karma point (was layout-thrashing on each interaction).
  const myTab = document.getElementById('tab-my');
  if (myTab && myTab.classList.contains('active')) {
    updateStatusCard();
  }
}

// rank14: lightweight status-number refresh (no SVG / story-list re-render)
function updateStatusCard() {
  if (!currentPantheon) return;
  const echoesEl = document.getElementById('status-echoes');
  const storiesCountEl = document.getElementById('status-stories');
  const sharesEl = document.getElementById('status-shares');
  const shareKarmaEl = document.getElementById('status-share-karma');
  const prestigeStatus = document.getElementById('status-prestige');
  if (echoesEl) echoesEl.textContent = currentPantheon.echoes ? currentPantheon.echoes.length : 0;
  if (storiesCountEl) storiesCountEl.textContent = currentPantheon.stories ? currentPantheon.stories.length : 0;
  if (sharesEl) sharesEl.textContent = sharesCount;
  if (shareKarmaEl) shareKarmaEl.textContent = `+${sharesCount * 2}`;
  if (prestigeStatus) prestigeStatus.textContent = prestige;
}

function celebratePrestige() {
  const p = document.getElementById('header-prestige');
  if (!p) return;
  p.style.transition = 'transform .3s, text-shadow .3s';
  p.style.transform = 'scale(1.6)';
  p.style.textShadow = '0 0 20px rgba(201,162,39,1)';
  setTimeout(() => {
    p.style.transform = 'scale(1)';
    p.style.textShadow = '';
  }, 600);
}

// ═══════════════════════════════════════════════════════════════════════
// Referral + Founding Badge + Daily Streak
// Reputation only — no token/airdrop. Permanent honor + rarity.
// 인도 바이럴 3종 중 레퍼럴 + 스트릭. (리더보드 = v2)
// 정직>연기: 서수("N번째 유저") 거짓 주장 안 함 — Founder Code는 식별자, Founding은 출시기 가입 사실.
// ═══════════════════════════════════════════════════════════════════════
const P2_BOT = 'MyPantheonEchoBot/play';   // named mini-app 'play'(BotFather /newapp). startapp 딥링크 귀속.
const P2_BASE = (typeof location !== 'undefined' ? location.origin + location.pathname : '');
const P2_BACKEND = '';    // optional backend for invite credit; empty = ignored

// === Minimal p2 Stars invoice stub (PARHWA-UHWEE ready) ===
// Mirrors p1 pay-worker createInvoiceLink pattern exactly.
// currency: "XTR" (Telegram Stars). Payload stealth + disclosure shield.
// When P2_PAY_BACKEND set: fetch /invoice → tg.openInvoice. Fictional cosmetic only.
// Prominent: "Core always free. Optional featured/frames. Pure fiction."
const P2_PAY_BACKEND = ""; // Sovereign: point to p2-stars worker (copy p1 legion-pay pattern)

// 🎯 귀속 계측 배선 (Launch Gate Zero — 채널 출처 첫터치 + install/session emit). Legion 딥닝 R2.
const P2_ANALYTICS = 'https://legion-analytics.hoyashi95.workers.dev';
const P2_SRC_ALLOW = ['reddit','x','wa','insta','discord','quora','yt','tg','fb','direct','other'];
function parseStartParam() {
  let raw = '';
  try { raw = (tg && tg.initDataUnsafe && tg.initDataUnsafe.start_param) || ''; } catch(e){}
  if (!raw) { const m = (location.search||'').match(/[?&](?:startapp|tgWebAppStartParam)=([^&]+)/); if (m) raw = decodeURIComponent(m[1]); }
  let channel = '', ref = '';
  if (raw.indexOf('c-') === 0) { const rest = raw.slice(2), ri = rest.indexOf('-r-'); if (ri >= 0) { channel = rest.slice(0, ri); ref = rest.slice(ri + 3); } else channel = rest; }
  else if (raw.indexOf('ref') === 0) { ref = raw.slice(3); }
  if (!channel) { const m = (location.search||'').match(/[?&]src=([A-Za-z0-9_]{1,16})/); if (m) channel = m[1]; }
  if (!ref) { const m = (location.search||'').match(/[?&]ref=([^&]+)/); if (m) ref = decodeURIComponent(m[1]); }
  channel = String(channel||'').toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,16);
  if (channel && P2_SRC_ALLOW.indexOf(channel) < 0) channel = 'other';
  return { channel: channel, ref: ref };
}
function resolveSource() {  // 첫 터치 고정 — 최초 1회만 기록, 덮어쓰지 않음(귀속 무결성)
  let src = '';
  try { src = localStorage.getItem('p2_src') || ''; } catch(e){}
  if (!src) { src = parseStartParam().channel || 'direct'; try { localStorage.setItem('p2_src', src); } catch(e){} }
  return src;
}
function emit(type, extra) {  // fire-and-forget, 절대 앱에 throw 금지
  try {
    const d = Object.assign({ channel: resolveSource() }, extra || {});
    const body = JSON.stringify({ type: type, anonId: 'p2_' + hashId(p2uid || 'anon'), ts: Date.now(), d: d });
    const url = P2_ANALYTICS + '/ev';
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) navigator.sendBeacon(url, new Blob([body], { type: 'text/plain;charset=UTF-8' }));
    else fetch(url, { method:'POST', headers:{'content-type':'text/plain'}, body: body, keepalive:true, mode:'no-cors' });
  } catch(e) {}
}
function emitLaunch() {  // install=기기당1회, session_start=매 로드
  let first = false;
  try { first = !localStorage.getItem('p2_installed'); if (first) localStorage.setItem('p2_installed', todayStr()); } catch(e){}
  if (first) emit('install', { first_day: todayStr() });
  emit('session_start', { first: first });
}
// 🏛️ 창립 판테온 100 — 설치 시 서버 슬롯 예약(진짜 하드캡), 보상은 day-3 재방문에만 지급(용병 차단)
function reserveFounder() {
  try {
    if (localStorage.getItem('p2_fdr_slot')) return;   // 이미 예약됨
    fetch(P2_ANALYTICS + '/founder?uid=' + encodeURIComponent(p2uid)).then(r=>r.json()).then(j=>{
      if (j && j.ok && j.founder) localStorage.setItem('p2_fdr_slot', String(j.num));
      else if (j && j.full) localStorage.setItem('p2_fdr_slot', 'full');
    }).catch(function(){});
  } catch(e){}
}
function founderDay3Gate() {   // 설치 후 2일 경과 재방문 시에만 창립 보상 1회 — "가입만으론 배지 없음"
  try {
    const slot = localStorage.getItem('p2_fdr_slot');
    if (!slot || slot === 'full' || localStorage.getItem('p2_fdr_granted')) return;
    const inst = localStorage.getItem('p2_installed'); if (!inst) return;
    const days = Math.floor((Date.parse(todayStr()) - Date.parse(inst)) / 86400000);
    if (days >= 2) {
      localStorage.setItem('p2_fdr_granted', '1');
      addKarma(50);
      showToast('🏛️ 창립 판테온 #' + slot + '/100 확정! +50 Karma — 함께 신화를 씁니다 ✧', 3600);
    }
  } catch(e){}
}
function getP2Uid() { return p2uid || localStorage.getItem('p2_uid') || ('p2' + Date.now().toString(36)); }
// ===== 18+ Age Gate (컴플라 실드 · 되돌림 · localStorage 전용) — p2엔 가챠/도박 없음(구매=결정적 코스메틱). 중립 18+ 확인 + under-18 유스모드(유료 OFF, 코어 무료) =====
function isYouthMode() { try { return localStorage.getItem('p2_youth') === '1'; } catch(e) { return false; } }
function enterYouthMode() { try { document.querySelectorAll('button').forEach(function(b){ var oc = b.getAttribute('onclick') || ''; if (/showPremiumModal|purchaseP2WithStars/.test(oc)) b.style.display = 'none'; }); } catch(e){} }
function ageGate() {
  var decided = '';
  try { decided = localStorage.getItem('p2_age_ok') || ''; } catch(e){}
  if (decided === '1' || decided === '0') return;
  var ov = document.createElement('div');
  ov.id = 'p2-age-gate';
  ov.style.cssText = 'position:fixed;inset:0;background:rgba(10,8,6,.96);z-index:100000;display:flex;align-items:center;justify-content:center;padding:24px;';
  ov.innerHTML =
    '<div style="max-width:320px;text-align:center;background:#1c1a15;border:1px solid #c9a227;border-radius:16px;padding:24px;color:#f5f1e6;">' +
      '<div style="font-size:28px;margin-bottom:8px;">🪷</div>' +
      '<strong style="color:#c9a227;font-size:15px;">Welcome to My Pantheon</strong>' +
      '<p style="font-size:12.5px;line-height:1.5;opacity:.85;margin:12px 0 18px;">Fictional stories inspired by ancient epics. Please confirm your age. Optional cosmetic purchases are for adults; all core features are always free.</p>' +
      '<button id="p2-age-yes" type="button" style="width:100%;padding:12px;margin-bottom:8px;background:#c9a227;color:#111;border:none;border-radius:10px;font-weight:700;">I am 18 or older</button>' +
      '<button id="p2-age-no" type="button" style="width:100%;padding:11px;background:transparent;color:#c9a227;border:1px solid #c9a227;border-radius:10px;font-weight:600;">I am under 18</button>' +
      '<div style="font-size:10px;opacity:.5;margin-top:12px;">Fictional • No real deities • DPDP/IT compliance</div>' +
    '</div>';
  document.body.appendChild(ov);
  var done = function(){ try { ov.remove(); } catch(e){} };
  var yes = ov.querySelector('#p2-age-yes'), no = ov.querySelector('#p2-age-no');
  if (yes) yes.addEventListener('click', function(){ try { localStorage.setItem('p2_age_ok','1'); localStorage.removeItem('p2_youth'); } catch(e){} done(); });
  if (no)  no.addEventListener('click',  function(){ try { localStorage.setItem('p2_age_ok','0'); localStorage.setItem('p2_youth','1'); } catch(e){} try{ showToast('Youth mode: purchases off. Core features stay free ✧',3200);}catch(e){} enterYouthMode(); done(); });
}

// First-purchase 2× hook — the F2P→first-wallet breakthrough. Honest & cosmetic:
//  • Every purchase unlocks the persistent Golden Frame cosmetic on MY Pantheon (what you buy).
//  • Your FIRST purchase (one time only) additionally grants 2× the welcome-Karma bonus.
// The offer text below states exactly this; no fake scarcity, no gambling. Reversible (localStorage).
function firstPayUsed() { try { return localStorage.getItem('p2_first_pay') === '1'; } catch(e) { return false; } }
function markFirstPay() { try { localStorage.setItem('p2_first_pay', '1'); } catch(e){} }
function hasGoldFrame() { try { return localStorage.getItem('p2_gold_frame') === '1'; } catch(e) { return false; } }

function purchaseP2WithStars(item = 'p2_featured') {
  if (isYouthMode()) { showToast('Purchases are disabled in youth mode — core features are free ✧'); return; }
  if (!tg || !tg.openInvoice) { showToast('TG WebApp only — Stars via Bot invoice'); return; }
  const uid = getP2Uid();
  // rank3: send the SIGNED initData string. The worker must HMAC-verify it with the bot token and
  //        derive the real payer uid server-side — never trust the query-string uid (client-forgeable).
  //        The uid below stays only as a display/prefill hint for the worker's verified path.
  const signed = (tg && tg.initData) ? tg.initData : '';
  // rank25: invoice locale follows the app language (was hardcoded lang=en).
  const url = (P2_PAY_BACKEND || 'https://legion-pay.hoyashi95.workers.dev') +
    `/invoice?item=${encodeURIComponent(item)}&uid=${encodeURIComponent(uid)}&type=stars&lang=${encodeURIComponent(currentLang)}` +
    (signed ? `&initData=${encodeURIComponent(signed)}` : '');
  fetch(url).then(r=>r.json()).then(d=>{
    if (d && d.link) {
      tg.openInvoice(d.link, (st) => {
        if (st === 'paid') {
          const isFirst = !firstPayUsed();
          const bonus = isFirst ? 50 : 25;   // first purchase = 2× welcome Karma (one time)
          addKarma(bonus);
          try { localStorage.setItem('p2_gold_frame', '1'); } catch(e){}   // persistent cosmetic
          markFirstPay();
          haptic('success');
          showToast(isFirst
            ? '✧ First unlock 2× — +50 welcome Karma & Golden Frame on MY Pantheon.'
            : '✧ Premium cosmetic unlocked — Golden Frame + featured.');
          try { renderMyPantheon(); } catch(e){}
          try { emit('purchase', { item: item, first: isFirst }); } catch(e){}
        }
        else if (st === 'cancelled') { showToast('Purchase cancelled — core features stay free ✧'); }
        else { showToast('Payment status: ' + st); }   // rank25: user-facing phrasing, not raw 'Stars:'
      });
    } else {
      console.warn('[p2] Stars backend not configured: set P2_PAY_BACKEND + worker createInvoiceLink(XTR)'); // rank25: dev hint → console
      showToast('Payments are being set up — please try again shortly ✧');
    }
  }).catch(() => {
    console.warn('[p2] invoice fetch failed');
    showToast('Payments are being set up — please try again shortly ✧');
  });
}

let p2uid = '';
let founderNo = 0;
let invitedBy = '';
let refCount = 0;
let streak = { count: 0, last: '', best: 0 };

// 초대 마일스톤 래더 — 평판/카르마만 (금전 약속 0)
const REF_TIERS = [
  { n: 1,  karma: 20,  title: 'Spark',         icon: '✦' },
  { n: 3,  karma: 60,  title: 'Kindler',       icon: '✧' },
  { n: 5,  karma: 120, title: 'Beacon',        icon: '☀' },
  { n: 10, karma: 300, title: 'Lightkeeper',   icon: '🔱' },
  { n: 25, karma: 900, title: 'Dharma Legend', icon: '👑' },
];

function _dstr(d) { return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0'); }
function todayStr() { return _dstr(new Date()); }
function yesterdayStr() { const d = new Date(); d.setDate(d.getDate()-1); return _dstr(d); }
function hashId(s) { let h = 0; for (let i=0;i<s.length;i++){ h=(h*31 + s.charCodeAt(i))|0; } return Math.abs(h); }

function initIdentity() {
  let realId = '';
  // rank3 TRUST BOUNDARY: initDataUnsafe is UNVERIFIED (client-forgeable). Use it only for local
  // display/prefill (uid seed below). Any future server backend MUST verify tg.initData (signed) and
  // must NOT promote this value to an authoritative identity for payments/credit.
  try { realId = (tg && tg.initDataUnsafe && tg.initDataUnsafe.user && tg.initDataUnsafe.user.id) ? String(tg.initDataUnsafe.user.id) : ''; } catch(e){}
  p2uid = localStorage.getItem('p2_uid') || realId || ('g' + hashId(navigator.userAgent + ':' + (Date.now())));
  localStorage.setItem('p2_uid', p2uid);
  // Founder Code = 안정적 식별 코드(서수 주장 아님). Founding = 출시기 가입 사실 = 진짜 명예.
  founderNo = parseInt(localStorage.getItem('p2_founder') || '0', 10);
  if (!founderNo) { founderNo = 10000 + (hashId(p2uid) % 89999); localStorage.setItem('p2_founder', String(founderNo)); }
  invitedBy = localStorage.getItem('p2_invitedBy') || '';
  refCount = parseInt(localStorage.getItem('p2_refs') || '0', 10);
  try { streak = JSON.parse(localStorage.getItem('p2_streak') || 'null') || { count:0, last:'', best:0 }; } catch(e){ streak = { count:0, last:'', best:0 }; }
}
function saveStreak() { localStorage.setItem('p2_streak', JSON.stringify(streak)); }

function getInviteLink() {
  if (P2_BOT) return 'https://t.me/' + P2_BOT + '?startapp=c-tg-r-' + p2uid;
  return P2_BASE + '?ref=' + encodeURIComponent(p2uid);
}

// 신규 유입(피초대자) 측 — 완전 클라 동작. 인바이터 크레딧은 백엔드 있을 때만 graceful 핑.
function captureRef() {
  let ref = '';
  try { ref = parseStartParam().ref || ''; } catch(e){}
  if (!ref) { const m = (location.search||'').match(/[?&]ref=([^&]+)/); if (m) ref = decodeURIComponent(m[1]); }
  if (ref && ref !== p2uid && !invitedBy) {
    invitedBy = ref; localStorage.setItem('p2_invitedBy', ref);
    addKarma(15);
    showToast('Welcome! +15 Karma from your inviter clan ✧', 3000);
    if (P2_BACKEND) { try { fetch(P2_BACKEND + '/p2ref?inviter=' + encodeURIComponent(ref) + '&uid=' + encodeURIComponent(p2uid), {mode:'no-cors'}); } catch(e){} }
  }
}

// 백엔드 연결 시 인바이터 본인 카운트 동기화(없으면 로컬 유지)
function syncRefCount() {
  if (!P2_BACKEND) { renderReferralStreak(); return; }
  fetch(P2_BACKEND + '/referrals?uid=' + encodeURIComponent(p2uid)).then(r=>r.json()).then(j => {
    if (j && typeof j.count === 'number' && j.count > refCount) {
      // 새로 확정된 초대 → 마일스톤 카르마 정산(1회씩)
      const claimed = parseInt(localStorage.getItem('p2_ref_claimed') || '0', 10);
      refCount = j.count; localStorage.setItem('p2_refs', String(refCount));
      REF_TIERS.forEach(t => { if (refCount >= t.n && claimed < t.n) { addKarma(t.karma); showToast(`🔥 ${t.title} unlocked · +${t.karma} Karma ✧`, 3000); } });
      localStorage.setItem('p2_ref_claimed', String(refCount));
    }
    renderReferralStreak();
  }).catch(()=>renderReferralStreak());
}

// daily streak (resets if broken) + Dharma Shield: one auto-freeze per 7 days so a single missed day won't reset.
function _dayBeforeYesterdayStr() { const d = new Date(); d.setDate(d.getDate()-2); return _dstr(d); }
function checkStreakOnLoad() {
  const today = todayStr();
  if (!streak.last || streak.last === today || streak.last === yesterdayStr()) return; // streak intact
  // Missed exactly one day + a shield charge available (weekly) + a streak worth saving → freeze instead of reset.
  const missedOne = (streak.last === _dayBeforeYesterdayStr());
  const shieldReady = !streak.shieldLast || Math.round((new Date(today) - new Date(streak.shieldLast)) / 86400000) >= 7;
  if (missedOne && shieldReady && (streak.count || 0) >= 3) {
    streak.shieldLast = today;
    streak.last = yesterdayStr(); // bridge the gap: today's check-in continues the streak
    saveStreak();
    setTimeout(() => { try { showToast('🛡️ Dharma Shield saved your ' + streak.count + '-day streak', 3200); } catch(e){} }, 900);
    return;
  }
  streak.count = 0; saveStreak();
}
// Daily dharma prompt (do-now): a rotating writing seed turns the streak from a button into a UGC habit. Date-hashed, no backend.
const DHARMA_PROMPTS = [
  "Write of a stranger who gave without being asked.",
  "Tell of a small courage that no one saw.",
  "An Echo who forgave what was hard to forgive.",
  "A promise kept when it cost everything.",
  "Someone who lifted another and asked for nothing back.",
  "A quiet act that quietly changed a life.",
  "The day an enemy became a friend."
];
function todaysDharmaPrompt(){
  const d = parseInt(todayStr().split('-').join(''), 10) || 0;
  return DHARMA_PROMPTS[d % DHARMA_PROMPTS.length];
}
function claimDaily() {
  const today = todayStr();
  if (streak.last === today) { showToast('Already devoted today — return tomorrow ✧'); return; }
  streak.count = (streak.last === yesterdayStr()) ? streak.count + 1 : 1;
  if (streak.count > streak.best) streak.best = streak.count;
  streak.last = today;
  let reward = 5 + Math.floor(Math.random()*6);          // 5~10
  const jackpot = Math.random() < 0.12;                  // 12% 잭팟
  if (jackpot) reward *= 5;
  let ms = '';
  if (streak.count === 7 || streak.count === 30 || streak.count === 100) { reward += streak.count; ms = ' · ' + streak.count + '-day milestone!'; }
  addKarma(reward); saveStreak();
  haptic(jackpot ? 'success' : 'light');   // rank20
  showToast((jackpot?'🎉 JACKPOT ':'') + 'Day ' + streak.count + ' devotion · +' + reward + ' Karma' + ms + ' ✧', jackpot?3400:2600);
  renderReferralStreak();
  // Nudge the UGC loop: surface today's dharma writing seed after the reward.
  setTimeout(function(){ try { showToast("✍️ Today's dharma: " + todaysDharmaPrompt() + " — write it in Create.", 4200); } catch(e){} }, 2900);
}

function renderReferralStreak() {
  const fb = document.getElementById('founder-badge');
  if (fb) fb.innerHTML = '<span class="founder-tier">🔱 Founding Member</span><span class="founder-code">Founder Code · PAN-' + founderNo + '</span>';
  const sc = document.getElementById('streak-count'); if (sc) sc.textContent = streak.count;
  const sb = document.getElementById('streak-best'); if (sb) sb.textContent = streak.best;
  const btn = document.getElementById('streak-btn');
  if (btn) {
    const done = streak.last === todayStr();
    btn.disabled = done;
    btn.style.opacity = done ? '0.55' : '1';
    if (done) {
      btn.textContent = 'Devoted ✓ — return tomorrow';
    } else {
      // honest urgency: real local-midnight reset countdown
      const now = new Date(), mid = new Date(now); mid.setHours(24, 0, 0, 0);
      const ms = mid - now, left = Math.floor(ms / 3600000) + 'h ' + Math.floor((ms % 3600000) / 60000) + 'm';
      btn.textContent = streak.count > 0
        ? '🔥 Keep your ' + streak.count + '-day streak — ' + left + ' left'
        : '☀ Claim Daily Karma · ' + left + ' left';
    }
  }
  const rc = document.getElementById('ref-count'); if (rc) rc.textContent = refCount;
  const rl = document.getElementById('ref-ladder');
  if (rl) {
    const nextN = (REF_TIERS.find(t => refCount < t.n) || {}).n;
    rl.innerHTML = REF_TIERS.map(t => {
      const done = refCount >= t.n; const next = t.n === nextN;
      return '<div class="ref-tier' + (done?' done':'') + (next?' next':'') + '">' +
        '<span class="rt-icon">' + t.icon + '</span>' +
        '<span class="rt-name">' + t.title + '</span>' +
        '<span class="rt-req">' + t.n + ' invites</span>' +
        '<span class="rt-k">+' + t.karma + '</span>' +
        (done?'<span class="rt-check">✓</span>':'') + '</div>';
    }).join('');
  }
}

// ===== Daily Dharma Draw — free once-a-day variable reveal + collectible deck (habit anchor) =====
// Honest & client-only: each day you reveal ONE of a fixed set of dharma wisdom cards. Which card is
// the variable reward (equal chance, no fake odds shown, no purchase). New cards fill a Dharma Deck
// (Zeigarnik open loop); every draw grants a small variable Karma. Reversible localStorage only.
const DHARMA_CARDS = [
  { id: 'gift',    icon: '🕊️', title: 'The Unasked Gift',   line: 'Kindness given freely returns as light.' },
  { id: 'courage', icon: '🔥', title: 'Quiet Courage',       line: 'The bravest deeds are seen by no one.' },
  { id: 'tide',    icon: '🌊', title: 'The Forgiving Tide',  line: 'To forgive is to unchain your own heart.' },
  { id: 'seed',    icon: '🌱', title: 'Seed of Karma',       line: 'Every small act plants a forest you may never see.' },
  { id: 'scale',   icon: '⚖️', title: 'The Even Scale',      line: 'Justice weighs the unseen as much as the seen.' },
  { id: 'lotus',   icon: '🪷', title: 'Lotus in the Mud',    line: 'From hardship, the purest bloom rises.' },
  { id: 'vow',     icon: '🌟', title: 'The Kept Promise',    line: 'A vow honored outlives the one who made it.' },
  { id: 'hand',    icon: '🤝', title: 'The Lifted Hand',     line: 'Raise another and you rise unbroken.' },
  { id: 'moon',    icon: '🌘', title: 'The Patient Moon',    line: 'What is dark now will be full in time.' },
  { id: 'blade',   icon: '🗡️', title: 'The Sheathed Blade',  line: 'True strength knows when not to strike.' },
  { id: 'echo',    icon: '🔔', title: 'Echo of Deeds',       line: 'Your actions ring long after your voice is gone.' },
  { id: 'flame',   icon: '🕯️', title: 'The Shared Flame',    line: 'A lamp lit for another loses none of its light.' }
];
let dharmaDeck = (function(){
  try { const v = JSON.parse(localStorage.getItem('p2_dharmadeck') || 'null'); if (v && Array.isArray(v.owned)) return v; } catch(e){}
  return { last: '', owned: [], today: null };
})();
function saveDharmaDeck(){ try { localStorage.setItem('p2_dharmadeck', JSON.stringify(dharmaDeck)); } catch(e){} }
function drawDharma(){
  const today = todayStr();
  if (dharmaDeck.last === today) { showToast("Today's Dharma already revealed — return at midnight ✧"); return; }
  const card = DHARMA_CARDS[Math.floor(Math.random() * DHARMA_CARDS.length)];
  const isNew = dharmaDeck.owned.indexOf(card.id) === -1;
  if (isNew) dharmaDeck.owned.push(card.id);
  dharmaDeck.last = today;
  dharmaDeck.today = card.id;
  saveDharmaDeck();
  const reward = 3 + Math.floor(Math.random() * 6);   // 3~8 variable
  addKarma(reward);
  haptic(isNew ? 'success' : 'light');
  const n = dharmaDeck.owned.length, total = DHARMA_CARDS.length;
  if (isNew) showToast('📜 New Dharma — ' + card.icon + ' ' + card.title + ' · Deck ' + n + '/' + total + ' · +' + reward + ' Karma', 3600);
  else showToast('📜 ' + card.icon + ' ' + card.title + ' — wisdom revisited · +' + reward + ' Karma', 3000);
  renderDharmaDraw();
}
function renderDharmaDraw(){
  ensureP2Styles();
  const el = document.getElementById('dharma-draw');
  if (!el) return;
  const n = dharmaDeck.owned.length, total = DHARMA_CARDS.length;
  const drawnToday = dharmaDeck.last === todayStr();
  let body;
  if (drawnToday) {
    const card = DHARMA_CARDS.find(c => c.id === dharmaDeck.today) || DHARMA_CARDS[0];
    const now = new Date(), mid = new Date(now); mid.setHours(24, 0, 0, 0);
    const ms = mid - now, left = Math.floor(ms / 3600000) + 'h ' + Math.floor((ms % 3600000) / 60000) + 'm';
    body = '<div class="dharma-card revealed">' +
        '<div class="dharma-icon">' + card.icon + '</div>' +
        '<div class="dharma-title">' + escapeHtml(card.title) + '</div>' +
        '<div class="dharma-line">“' + escapeHtml(card.line) + '”</div></div>' +
      '<div class="dharma-next">Next Dharma in ' + left + '</div>';
  } else {
    body = '<button class="primary dharma-btn" onclick="drawDharma()">🃏 Draw Today’s Dharma</button>' +
      '<div class="dharma-hint">A new wisdom each day — gather all ' + total + '.</div>';
  }
  el.innerHTML = '<div class="dharma-head"><span>📜 Daily Dharma</span><span class="dharma-count">' + n + '/' + total + ' gathered</span></div>' + body;
}

// ===== One-time style injection for Codex + Blessing (client-only, reversible) =====
function ensureP2Styles() {
  if (document.getElementById('p2-codex-bless-styles')) return;
  const st = document.createElement('style');
  st.id = 'p2-codex-bless-styles';
  st.textContent = [
    '.codex-box{margin:10px 0 4px}',
    '.codex-head{display:flex;justify-content:space-between;align-items:center;font-size:13px;font-weight:700;color:#e8d9a0;margin-bottom:8px}',
    '.codex-count{font-size:11px;color:#c9a227;font-weight:600}',
    '.codex-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}',
    '.codex-cell{display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 4px;border-radius:10px;background:rgba(255,255,255,.04);border:1px solid rgba(201,162,39,.18);font-size:9.5px;color:#cfc8b0;text-align:center;line-height:1.1}',
    '.codex-cell.owned{border-color:rgba(201,162,39,.55);background:rgba(201,162,39,.10)}',
    '.codex-cell.owned span{color:#e8d9a0}',
    '.codex-cell.locked{cursor:pointer;opacity:1;font-family:inherit;position:relative;overflow:hidden;background:radial-gradient(120% 120% at 50% 32%,rgba(201,162,39,.10),rgba(18,14,7,.55) 72%);border-color:rgba(201,162,39,.22)}',
    '.codex-cell.locked::before{content:"";position:absolute;inset:0;background:linear-gradient(115deg,transparent 22%,rgba(201,162,39,.12) 50%,transparent 78%);transform:translateX(-120%);animation:codexVeil 3.6s ease-in-out infinite;pointer-events:none}',
    '@keyframes codexVeil{0%,62%{transform:translateX(-120%)}84%,100%{transform:translateX(120%)}}',
    '.codex-cell.locked .codex-silhouette{position:relative;z-index:1;filter:brightness(.05) saturate(0) opacity(.5) drop-shadow(0 0 5px rgba(201,162,39,.35));transition:filter .25s,transform .25s}',
    '.codex-cell.locked span{position:relative;z-index:1;color:#9a8f6f;font-weight:700}',
    '.codex-cell.locked:hover,.codex-cell.locked:active{border-color:rgba(201,162,39,.6);box-shadow:inset 0 0 12px 1px rgba(201,162,39,.22)}',
    '.codex-cell.locked:hover .codex-silhouette,.codex-cell.locked:active .codex-silhouette{filter:brightness(.28) saturate(.4) opacity(.88) drop-shadow(0 0 9px rgba(201,162,39,.6));transform:scale(1.06)}',
    '.codex-cell.locked:hover span,.codex-cell.locked:active span{color:#e8d9a0}',
    '.codex-nudge{margin-top:9px;padding:8px 10px;border-radius:9px;font-size:11.5px;text-align:center;background:rgba(201,162,39,.10);border:1px solid rgba(201,162,39,.3);color:#e8d9a0}',
    '.codex-nudge.hot{background:rgba(201,162,39,.18);border-color:rgba(201,162,39,.6);animation:codexPulse 1.6s ease-in-out infinite}',
    '@keyframes codexPulse{0%,100%{box-shadow:0 0 0 0 rgba(201,162,39,0)}50%{box-shadow:0 0 14px 2px rgba(201,162,39,.35)}}',
    '.bless-card{margin:8px 0 0;padding:12px;border-radius:12px;background:linear-gradient(135deg,rgba(201,162,39,.14),rgba(201,162,39,.05));border:1px solid rgba(201,162,39,.4)}',
    '.bless-card.done{text-align:center;font-size:11.5px;color:#c9a227}',
    '.bless-title{font-size:13px;font-weight:700;color:#e8d9a0;margin-bottom:3px}',
    '.bless-sub{font-size:11px;color:#cfc8b0;opacity:.85;margin-bottom:9px;line-height:1.35}',
    '.bless-btn{width:100%}',
    '.dharma-box{margin:12px 0 0}',
    '.dharma-head{display:flex;justify-content:space-between;align-items:center;font-size:13px;font-weight:700;color:#e8d9a0;margin-bottom:8px}',
    '.dharma-count{font-size:11px;color:#c9a227;font-weight:600}',
    '.dharma-btn{width:100%}',
    '.dharma-hint{margin-top:6px;font-size:11px;color:#cfc8b0;opacity:.8;text-align:center}',
    '.dharma-card{padding:14px 12px;border-radius:12px;text-align:center;background:linear-gradient(135deg,rgba(201,162,39,.16),rgba(201,162,39,.05));border:1px solid rgba(201,162,39,.42)}',
    '.dharma-card.revealed{animation:dharmaReveal .5s ease-out}',
    '@keyframes dharmaReveal{0%{opacity:0;transform:scale(.9)}100%{opacity:1;transform:scale(1)}}',
    '.dharma-icon{font-size:30px;line-height:1;margin-bottom:6px}',
    '.dharma-title{font-size:14px;font-weight:700;color:#e8d9a0;margin-bottom:4px}',
    '.dharma-line{font-size:12px;color:#cfc8b0;font-style:italic;line-height:1.4}',
    '.dharma-next{margin-top:8px;font-size:11px;color:#c9a227;text-align:center;opacity:.85}'
  ].join('');
  document.head.appendChild(st);
}

// ===== Pantheon Codex — collection grid (Zeigarnik open-loop) + honest 'One more Echo' near-miss =====
const ALL_ECHO_KEYS = ['Krishna-echo','Rama-echo','Draupadi-echo','Hanuman-echo','Durga-echo','Arjuna-echo','Sita-echo'];
function echoShortName(k) { return (echoMap[k] || k).replace('Echo of ', '').replace(/ \(.*\)$/, ''); }
function ownedEchoKeys() {
  if (!currentPantheon || !Array.isArray(currentPantheon.echoes)) return [];
  return ALL_ECHO_KEYS.filter(k => currentPantheon.echoes.indexOf(echoMap[k]) !== -1);
}
// Collect a missing Echo into the pantheon — honest client-only progression (dopamine + endowment).
function addEchoToPantheon(key) {
  if (!currentPantheon || !Array.isArray(currentPantheon.echoes)) return;
  const disp = echoMap[key];
  if (!disp || currentPantheon.echoes.indexOf(disp) !== -1) return;
  currentPantheon.echoes.push(disp);
  savePantheon();
  addKarma(4);
  haptic('success');
  const n = ownedEchoKeys().length, total = ALL_ECHO_KEYS.length;
  showToast('✨ ' + echoShortName(key) + ' joined your Pantheon — Codex ' + n + '/' + total + ' · +4 Karma', 2800);
  if (n === total) { grantCodexReward(); }   // 🔱 collection-completion payoff (guarded, once)
  renderMyPantheon();
}
function renderCodex() {
  ensureP2Styles();
  const el = document.getElementById('pantheon-codex');
  if (!el) return;
  if (!currentPantheon) { el.innerHTML = ''; return; }
  const owned = ownedEchoKeys();
  const total = ALL_ECHO_KEYS.length, n = owned.length;
  const cells = ALL_ECHO_KEYS.map(function(k){
    const nm = escapeHtml(echoShortName(k));
    if (owned.indexOf(k) !== -1) {
      const lv = bondLevel(bondCount(k));
      const badge = lv > 0
        ? '<span class="bond-badge bond-l' + lv + '" title="' + bondLabel(lv) + '">Lv' + lv + '</span>'
        : '';
      return '<div class="codex-cell owned' + (lv > 0 ? ' bonded' : '') + '">' + getEchoIcon(k, 30) + '<span>' + nm + '</span>' + badge + '</div>';
    }
    return '<button type="button" class="codex-cell locked" onclick="addEchoToPantheon(\'' + k + '\')" aria-label="Discover ' + nm + '">' +
      '<div class="codex-silhouette">' + getEchoIcon(k, 30) + '</div><span>?</span></button>';
  }).join('');
  // Honest near-miss: threshold = a complete Codex; only real values shown.
  const away = total - n;
  let nudge = '';
  if (away === 1) nudge = '<div class="codex-nudge hot">🔥 One more Echo completes your Pantheon Codex — ' + n + '/' + total + '. Tap a silhouette to discover it.</div>';
  else if (away === 2) nudge = '<div class="codex-nudge">✨ Just 2 Echoes from a complete Codex (' + n + '/' + total + '). So close — tap a silhouette.</div>';
  el.innerHTML = '<div class="codex-head"><span>📜 Pantheon Codex</span><span class="codex-count">' + n + '/' + total + ' discovered</span></div>' +
    '<div class="codex-grid">' + cells + '</div>' + nudge;
  // Retroactive: users already at full Codex (pre-reward) still receive the payoff once.
  if (n === total && !codexRewarded()) grantCodexReward();
}

// ===== Echo Bond — story tagging → Echo evolution (endowment / collection depth) =====
// Honest & reversible: dedicating a story to an Echo grows its Bond (a real count stored on the
// pantheon). Bond level is derived purely from that count — no randomness, no fake numbers. The
// endowment loop: the Echoes YOU nurture with your stories visibly evolve and stay yours.
const BOND_THRESH = [1, 3, 6, 10, 15];   // count needed for Lv1..Lv5
const BOND_NAMES  = ['Kindled', 'Awakened', 'Radiant', 'Ascendant', 'Eternal'];
function getBonds() {
  if (!currentPantheon) return {};
  if (!currentPantheon.bonds || typeof currentPantheon.bonds !== 'object') currentPantheon.bonds = {};
  return currentPantheon.bonds;
}
function bondCount(key) { const b = getBonds(); return b[key] || 0; }
function bondLevel(count) { let lv = 0; for (let i = 0; i < BOND_THRESH.length; i++) { if (count >= BOND_THRESH[i]) lv = i + 1; } return lv; }
function bondLabel(lv) { return BOND_NAMES[lv - 1] || ''; }
// Dedicate a story to an Echo → +1 Bond. Level-up = evolution moment (toast + haptic).
function grantBond(key) {
  if (!key || !currentPantheon) return;
  if (ownedEchoKeys().indexOf(key) === -1) return;   // only owned Echoes evolve
  const b = getBonds();
  const before = bondLevel(b[key] || 0);
  b[key] = (b[key] || 0) + 1;
  const after = bondLevel(b[key]);
  savePantheon();
  if (after > before) {
    showToast('🔱 ' + echoShortName(key) + ' evolved — Bond Lv' + after + ' (' + bondLabel(after) + ') ✧', 3000);
    haptic('success');
  }
  renderCodex();
  renderEchoTag();
}
// Populate the story-form Echo tag selector from the Echoes you own (shows each Echo's Bond).
function renderEchoTag() {
  const el = document.getElementById('echo-tag-row');
  if (!el) return;
  const owned = currentPantheon ? ownedEchoKeys() : [];
  if (!owned.length) { el.style.display = 'none'; el.innerHTML = ''; return; }
  el.style.display = 'block';
  const prev = (function(){ const s = document.getElementById('story-echo-tag'); return s ? s.value : ''; })();
  const opts = owned.map(function(k){
    const lv = bondLevel(bondCount(k));
    const tag = lv > 0 ? ' · Bond Lv' + lv : '';
    const sel = k === prev ? ' selected' : '';
    return '<option value="' + k + '"' + sel + '>' + escapeHtml(echoShortName(k)) + tag + '</option>';
  }).join('');
  const firstKey = owned.indexOf(prev) >= 0 ? prev : owned[0];
  el.innerHTML = '<label class="echo-tag-label">Dedicate this story to an Echo — it evolves as its Bond grows:</label>' +
    '<select id="story-echo-tag" class="echo-tag-select" onchange="updateBondStatus()">' + opts + '</select>' +
    '<div id="echo-bond-status" class="echo-bond-status">' + bondStatusHTML(firstKey) + '</div>';
}
// Live payoff line for the selected Echo: current Bond level + how far to the next evolution.
// Honest: derived purely from the real stored Bond count (no fake numbers, no randomness).
function bondStatusHTML(key) {
  if (!key) return '';
  const c = bondCount(key), lv = bondLevel(c);
  const cur = lv > 0 ? 'Lv' + lv + ' ' + bondLabel(lv) : 'Unbonded';
  let nextIdx = -1;
  for (let i = 0; i < BOND_THRESH.length; i++) { if (c < BOND_THRESH[i]) { nextIdx = i; break; } }
  const name = '<b>' + escapeHtml(echoShortName(key)) + '</b> · ' + cur;
  if (nextIdx === -1) return name + ' — <span class="bond-max">max Bond ✦</span>';
  const need = BOND_THRESH[nextIdx] - c;
  return name + ' — <span class="bond-next">' + need + ' more ' + (need === 1 ? 'story' : 'stories') +
    ' → ' + BOND_NAMES[nextIdx] + '</span>';
}
function updateBondStatus() {
  const s = document.getElementById('story-echo-tag'), el = document.getElementById('echo-bond-status');
  if (s && el) el.innerHTML = bondStatusHTML(s.value);
}

// ===== Karma Atelier — free cosmetic shop (currency sink + premium value contrast) =====
// Honest & reversible: Karma is genuinely deducted (a real sink), ownership persists in
// localStorage, no randomness / no fake stock. Auras are FREE (earned Karma); the premium
// Golden Frame stays Stars-only so free cosmetics feel generous and premium stays aspirational.
const KARMA_COSMETICS = [
  { id: 'aura_lotus',  name: 'Lotus Bloom',   cost: 20,  ring: '#e86aa0', glow: 'rgba(232,106,160,.45)', desc: 'Soft rose halo' },
  { id: 'aura_flame',  name: 'Sacred Flame',  cost: 45,  ring: '#ff8c1a', glow: 'rgba(255,140,26,.45)',  desc: 'Warm ember glow' },
  { id: 'aura_indigo', name: 'Cosmic Indigo', cost: 80,  ring: '#6a7dff', glow: 'rgba(106,125,255,.45)', desc: 'Deep night sky' },
  { id: 'aura_dawn',   name: 'Dawn Saffron',  cost: 130, ring: '#ffd24a', glow: 'rgba(255,210,74,.5)',   desc: 'Golden sunrise' },
  // Codex-exclusive — NOT buyable; granted only by completing the Pantheon Codex (see reward below).
  { id: 'aura_codex',  name: 'Codex Halo',    exclusive: true, ring: '#9be7ff', glow: 'rgba(155,231,255,.5)', desc: 'Codex Master aura' }
];
function cosmeticById(id) { return KARMA_COSMETICS.find(function(c){ return c.id === id; }) || null; }
function cosOwned() {
  try { const v = JSON.parse(localStorage.getItem('p2_cos_owned') || '[]'); return Array.isArray(v) ? v : []; }
  catch(e) { return []; }
}
function cosEquipped() { try { return localStorage.getItem('p2_cos_equip') || ''; } catch(e) { return ''; } }
function ownsCosmetic(id) { return cosOwned().indexOf(id) !== -1; }
// Real Karma sink: deduct spendable balance (prestige rank is sticky, so it never drops).
function spendKarma(cost) {
  if (karma < cost) return false;
  karma -= cost;
  _spendMode = true;
  updateHeaderStats();
  _spendMode = false;
  savePantheon();
  const myTab = document.getElementById('tab-my');
  if (myTab && myTab.classList.contains('active')) updateStatusCard();
  return true;
}
function buyCosmetic(id) {
  const c = cosmeticById(id);
  if (!c || ownsCosmetic(id)) return;
  if (karma < c.cost) { showToast('Need ' + (c.cost - karma) + ' more Karma for ' + c.name + ' — write a story to earn it ✧', 2600); haptic('warning'); return; }
  if (!spendKarma(c.cost)) return;
  const owned = cosOwned(); owned.push(id);
  try { localStorage.setItem('p2_cos_owned', JSON.stringify(owned)); } catch(e){}
  equipCosmetic(id, true);
  showToast('✧ ' + c.name + ' unlocked & equipped — −' + c.cost + ' Karma', 2600);
  haptic('success');
}
function equipCosmetic(id, silent) {
  // '' = none; otherwise must be owned (auras) — codex-exclusive auras are granted, see Codex reward.
  if (id && !ownsCosmetic(id)) return;
  try { localStorage.setItem('p2_cos_equip', id || ''); } catch(e){}
  applyCosmetic();
  renderKarmaShop();
  if (!silent && id) { const c = cosmeticById(id); if (c) showToast('Equipped ' + c.name + ' ✧', 1600); }
}
// Apply the equipped aura to MY Pantheon card (composes with the premium Golden Frame).
function applyCosmetic() {
  const container = document.getElementById('pantheon-display');
  if (!container) return;
  const c = cosmeticById(cosEquipped());
  if (c) {
    container.classList.add('cos-aura');
    container.style.setProperty('--cos-ring', c.ring);
    container.style.setProperty('--cos-glow', c.glow);
  } else {
    container.classList.remove('cos-aura');
    container.style.removeProperty('--cos-ring');
    container.style.removeProperty('--cos-glow');
  }
}
function renderKarmaShop() {
  ensureP2Styles();
  const el = document.getElementById('karma-shop');
  if (!el) return;
  if (!currentPantheon) { el.innerHTML = ''; return; }
  const equipped = cosEquipped();
  const cards = KARMA_COSMETICS.filter(function(c){ return !c.exclusive; }).map(function(c){
    const owned = ownsCosmetic(c.id);
    const isEq = equipped === c.id;
    const swatch = '<span class="shop-swatch" style="--sw:' + c.ring + '"></span>';
    let btn;
    if (isEq) btn = '<button type="button" class="shop-btn equipped" disabled>✓ Equipped</button>';
    else if (owned) btn = '<button type="button" class="shop-btn own" onclick="equipCosmetic(\'' + c.id + '\')">Equip</button>';
    else {
      const afford = karma >= c.cost;
      btn = '<button type="button" class="shop-btn buy' + (afford ? '' : ' short') + '" onclick="buyCosmetic(\'' + c.id + '\')">✦ ' + c.cost + ' Karma</button>';
    }
    return '<div class="shop-card' + (isEq ? ' active' : '') + '">' + swatch +
      '<span class="shop-name">' + escapeHtml(c.name) + '</span>' +
      '<span class="shop-desc">' + escapeHtml(c.desc) + '</span>' + btn + '</div>';
  }).join('');
  const noneBtn = equipped
    ? '<button type="button" class="shop-none" onclick="equipCosmetic(\'\')">Remove aura</button>'
    : '';
  // Premium value-contrast: the top tier stays Stars-only (aspirational anchor).
  const gold = hasGoldFrame();
  const premium = '<div class="shop-card premium' + (gold ? ' active' : '') + '">' +
    '<span class="shop-swatch premium-sw"></span>' +
    '<span class="shop-name">Golden Frame</span>' +
    '<span class="shop-desc">Premium · top tier</span>' +
    (gold
      ? '<button type="button" class="shop-btn equipped" disabled>✓ Owned</button>'
      : '<button type="button" class="shop-btn premium-btn" onclick="showPremiumModal()">★ Stars</button>') +
    '</div>';
  // Codex-exclusive reward card — the collection-completion payoff (not buyable at any price).
  const cx = cosmeticById('aura_codex');
  const cxOwned = ownsCosmetic('aura_codex');
  const cxEq = equipped === 'aura_codex';
  const nOwned = currentPantheon ? ownedEchoKeys().length : 0;
  const cxBtn = cxOwned
    ? (cxEq ? '<button type="button" class="shop-btn equipped" disabled>✓ Equipped</button>'
            : '<button type="button" class="shop-btn own" onclick="equipCosmetic(\'aura_codex\')">Equip</button>')
    : '<button type="button" class="shop-btn locked-reward" disabled>🔒 Codex ' + nOwned + '/' + ALL_ECHO_KEYS.length + '</button>';
  const exclusive = '<div class="shop-card exclusive' + (cxEq ? ' active' : '') + (cxOwned ? '' : ' dim') + '">' +
    '<span class="shop-swatch" style="--sw:' + cx.ring + '"></span>' +
    '<span class="shop-name">' + escapeHtml(cx.name) + '</span>' +
    '<span class="shop-desc">' + (cxOwned ? 'Codex reward · earned' : 'Complete the Codex to unlock') + '</span>' + cxBtn + '</div>';
  el.innerHTML = '<div class="shop-head"><span>✧ Karma Atelier</span><span class="shop-bal">✦ ' + karma + ' Karma</span></div>' +
    '<div class="shop-sub">Spend earned Karma on free cosmetics for MY Pantheon. Core stays free.</div>' +
    '<div class="shop-grid">' + cards + premium + exclusive + '</div>' + noneBtn;
}

// ===== Pantheon Codex completion reward — the collection payoff (honest, once, reversible) =====
function codexComplete() { return !!currentPantheon && ownedEchoKeys().length === ALL_ECHO_KEYS.length; }
function codexRewarded() { try { return localStorage.getItem('p2_codex_reward') === '1'; } catch(e) { return false; } }
// Single guarded grant — safe to call any number of times / from any path; only the first fires.
function grantCodexReward() {
  if (!codexComplete() || codexRewarded()) return;
  try { localStorage.setItem('p2_codex_reward', '1'); } catch(e){}
  const owned = cosOwned();
  if (owned.indexOf('aura_codex') === -1) { owned.push('aura_codex'); try { localStorage.setItem('p2_cos_owned', JSON.stringify(owned)); } catch(e){} }
  // Respect the user's current aura: only auto-equip the Halo if nothing is equipped.
  if (!cosEquipped()) equipCosmetic('aura_codex', true); else renderKarmaShop();
  addKarma(30);   // one-time completion bonus (real Karma toward prestige)
  setTimeout(function(){ try {
    showToast('🔱 Codex complete! Codex Halo unlocked + 30 Karma ✦', 3600);
    if (typeof celebrateShare === 'function') celebrateShare();
    haptic('success');
  } catch(e){} }, 300);
}

// ===== Mutual Blessing Loop — 2-way reciprocity (invitee is nudged to bless forward) =====
function renderBlessingBack() {
  ensureP2Styles();
  const el = document.getElementById('blessing-back');
  if (!el) return;
  if (!invitedBy) { el.style.display = 'none'; el.innerHTML = ''; return; }
  el.style.display = 'block';
  if (localStorage.getItem('p2_blessed_back') === '1') {
    el.innerHTML = '<div class="bless-card done">🙏 Blessing returned — the circle is complete. Your light carries forward ✦</div>';
    return;
  }
  el.innerHTML = '<div class="bless-card">' +
    '<div class="bless-title">🙏 A clan blessed you here</div>' +
    '<div class="bless-sub">You were invited into the Pantheon. Complete the circle — carry the blessing to a new clan.</div>' +
    '<button type="button" class="primary bless-btn" onclick="blessBack()">🔱 Bless it forward</button>' +
    '</div>';
}
function blessBack() {
  const link = getInviteLink();
  const text = '🙏 A clan blessed me into the Pantheon — now I pass the light to you. Build your dharma legacy.\n' + link;
  if (tg && tg.openTelegramLink) {
    tg.openTelegramLink('https://t.me/share/url?url=' + encodeURIComponent(link) + '&text=' + encodeURIComponent(text));
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(link).then(function(){ showToast('Blessing link copied — pass it to your clan ✦', 2800); });
  }
  if (localStorage.getItem('p2_blessed_back') !== '1') {
    localStorage.setItem('p2_blessed_back', '1');
    addKarma(8);
    sharesCount++;
    // Reciprocity credit to the inviter — backend-only graceful ping, no-op if unset.
    if (P2_BACKEND && invitedBy) { try { fetch(P2_BACKEND + '/p2bless?inviter=' + encodeURIComponent(invitedBy) + '&uid=' + encodeURIComponent(p2uid), {mode:'no-cors'}); } catch(e){} }
    showToast('🙏 Blessing passed forward · +8 Karma — the circle continues ✦', 3000);
    haptic('success');
    celebrateShare();
  }
  renderBlessingBack();
}

// Create Pantheon
const form = document.getElementById('pantheon-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('clan-name').value.trim();
    const desc = document.getElementById('clan-desc').value.trim();
    
    const echoes = [];
    document.querySelectorAll('#tab-create input[type="checkbox"]:checked').forEach(cb => {
      echoes.push(cb.value);
    });
    
    if (echoes.length < 3) {
      showToast('Choose at least 3 Echoes (fictional characters inspired by the epics).');
      return;
    }
    
    const displayEchoes = echoes.map(e => echoMap[e] || e);

    currentPantheon = {
      name,
      desc,
      echoes: displayEchoes,
      stories: [],
      created: new Date().toISOString()
    };
    
    sharesCount = 0;
    savePantheon();

    // ULTIMATE creation ritual animation - huge visual change
    showCreationRitual(displayEchoes, name);
    
    // Then go to my
    setTimeout(() => {
      renderMyPantheon();
      switchTab('my');
      addKarma(5);
      updateMainButton();
      // rank22: if the user saved a spark from Explore before having a pantheon, inject it now.
      try {
        const pend = localStorage.getItem('p2_pending_story');
        if (pend) {
          const ta = document.getElementById('story-text');
          if (ta) ta.value = pend + ' — (refined into my own version, fictional)';
          localStorage.removeItem('p2_pending_story');
          showToast('Your saved inspiration is ready — make it yours ✧', 2600);
        }
      } catch (e) {}
    }, 1600);
  });
}

// Epic Creation Ritual - the "엄청난 변화" moment.
// Reveal is STAGED (not all-at-once): each echo lights up in sequence over ~1.2s, then a climax
// burst — anticipation → payoff = the peak-dopamine "creation" beat. Reversible, client-only.
function showCreationRitual(echoes, clanName) {
  const ritual = document.createElement('div');
  ritual.className = 'ritual-overlay';
  ritual.innerHTML = `
    <div class="ritual-content">
      <div class="ritual-glow"></div>
      <div class="ritual-burst" aria-hidden="true"></div>
      <h3>✧ Awakening the Pantheon ✧</h3>
      <p class="clan-name">${escapeHtml(clanName)}</p>
      <div class="ritual-echoes">${echoes.map(e => `<span class="ritual-echo pending">${escapeHtml(e)}</span>`).join('')}</div>
      <p class="ritual-text">The echoes awaken... your story begins.</p>
    </div>
  `;
  document.body.appendChild(ritual);

  // Fade the overlay in.
  setTimeout(() => ritual.classList.add('active'), 10);

  // Sequenced echo reveal — spread the chips across ~1.2s so each one "arrives" with its own beat.
  const chips = ritual.querySelectorAll('.ritual-echo');
  const startAt = 320;                     // let the title/clan-name settle first
  const span = 1200;                       // total reveal window (the "1.2s reveal")
  const stepEach = chips.length > 1 ? Math.round(span / chips.length) : 0;
  chips.forEach((chip, i) => {
    setTimeout(() => {
      chip.classList.remove('pending');
      chip.classList.add('shown');
      try { haptic('light'); } catch(e){}
    }, startAt + i * stepEach);
  });

  // Climax burst once the last echo has landed.
  const climaxAt = startAt + Math.max(0, (chips.length - 1)) * stepEach + 180;
  setTimeout(() => {
    ritual.classList.add('climax');
    try { haptic('success'); } catch(e){}
  }, climaxAt);

  // Hold on the full reveal, then fade out.
  const holdUntil = Math.max(1900, climaxAt + 750);
  setTimeout(() => {
    ritual.classList.remove('active');
    setTimeout(() => ritual.remove(), 400);
  }, holdUntil);
}

// Render My Pantheon (more elegant story view)
function renderMyPantheon() {
  const container = document.getElementById('pantheon-display');
  const storiesEl = document.getElementById('stories-list');
  const myContent = document.getElementById('my-content');
  const noP = document.getElementById('no-pantheon');
  const statusEl = document.getElementById('clan-status');
  
  if (!currentPantheon) {
    if (myContent) myContent.style.display = 'none';
    if (statusEl) statusEl.style.display = 'none';
    if (noP) noP.style.display = 'block';
    return;
  }
  
  if (myContent) myContent.style.display = 'block';
  if (statusEl) statusEl.style.display = 'block';
  if (noP) noP.style.display = 'none';
  
  // Visual Echo icons + aura feel for consistency with Creation
  const echoIconsHTML = currentPantheon.echoes.map(echo => {
    const val = Object.keys(echoMap).find(k => echoMap[k] === echo) || '';
    const iconSVG = getEchoIcon(val, 22);
    return `<div class="my-echo-visual">${iconSVG}<span>${escapeHtml(echo)}</span></div>`;
  }).join('');

  const goldFrame = hasGoldFrame();
  container.classList.toggle('gold-frame', goldFrame);
  applyCosmetic();   // Karma Atelier: equipped free aura (composes with premium Golden Frame)
  const frameBadge = goldFrame
    ? '<div class="gold-frame-badge">✧ Golden Frame — premium cosmetic</div>'
    : '';
  container.innerHTML = `
    ${frameBadge}
    <h3>${escapeHtml(currentPantheon.name)}</h3>
    <p>${escapeHtml(currentPantheon.desc || '')}</p>
    <div style="font-size:10px;color:#c9a227;opacity:.75;margin:2px 0 6px;">MY Pantheon — the power you author carries forever</div>
    <div class="my-echoes aura-mini">${echoIconsHTML}</div>
  `;
  
  // Update soft status
  const echoesEl = document.getElementById('status-echoes');
  const storiesCountEl = document.getElementById('status-stories');
  const sharesEl = document.getElementById('status-shares');
  const shareKarmaEl = document.getElementById('status-share-karma');
  
  const t = translations[currentLang] || translations.en;
  if (echoesEl) echoesEl.textContent = currentPantheon.echoes ? currentPantheon.echoes.length : 0;
  if (storiesCountEl) storiesCountEl.textContent = currentPantheon.stories ? currentPantheon.stories.length : 0;
  if (sharesEl) sharesEl.textContent = sharesCount;
  if (shareKarmaEl) shareKarmaEl.textContent = `+${sharesCount * 2}`;
  const prestigeStatus = document.getElementById('status-prestige');
  if (prestigeStatus) prestigeStatus.textContent = prestige;

  // Update status labels
  const statusItems = document.querySelectorAll('#clan-status .status-item .status-label');
  if (statusItems.length >= 5) {
    statusItems[0].textContent = t.statusEchoes;
    statusItems[1].textContent = t.statusStories;
    statusItems[2].textContent = t.statusShares;
    statusItems[3].textContent = t.statusShareKarma;
    statusItems[4].textContent = t.statusPrestige;
  }
  const statusNote = document.querySelector('#clan-status .status-note');
  if (statusNote) {
    let note = t.statusNote;
    if (currentPantheon.festivalBoost) {
      note += ` Festival boost active +${currentPantheon.festivalBoost}!`;
    }
    statusNote.textContent = note;
  }
  
  storiesEl.innerHTML = '<h3 style="margin:4px 0 8px; font-size:18px; color:#f5f1e6; position:relative;">Stories <span style="position:absolute; right:0; bottom:2px; font-size:12px; color:var(--accent); opacity:.55; font-weight:400;">✦ your legacy</span></h3>';
  if (currentPantheon.stories.length === 0) {
    storiesEl.innerHTML += '<p class="hint">No stories yet. Add one below to start your legend.</p>';
  } else {
    // rank1: escape user story text (stored-XSS). rank14: single map+join, not innerHTML+= per item (O(n²)).
    storiesEl.innerHTML += currentPantheon.stories.map(s =>
      `<div class="story"><p>${escapeHtml(s)}</p><div style="text-align:right; font-size:9px; color:#c9a227; margin-top:4px; opacity:.7;">fictional • epics inspired • your legacy</div></div>`
    ).join('');
  }
  renderReferralStreak();  // 🪖 Founding 뱃지 + 스트릭 + 초대 래더
  renderDharmaDraw();      // 📜 Daily Dharma Draw — 일일 무료 variable 리빌 + 수집덱(습관앵커)
  renderCodex();           // 📜 수집 그리드 + 'One more Echo' 근접 넛지
  renderEchoTag();         // 🔱 Echo Bond — 스토리 태깅 셀렉터(소유 Echo 진화)
  renderKarmaShop();       // ✧ Karma Atelier — 카르마 화폐싱크 + 프리미엄 가치대비
  renderBlessingBack();    // 🙏 상호 축복 루프 (invitedBy 상호성)
  updateMainButton();
}

// Add story with stronger micro (story view focus)
const storyForm = document.getElementById('story-form');
if (storyForm) {
  storyForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!currentPantheon) return;
    
    const text = document.getElementById('story-text').value.trim();
    if (!text) return;

    // Echo Bond: read the dedicated Echo BEFORE re-render repopulates the selector.
    const _tagEl = document.getElementById('story-echo-tag');
    const _bondKey = _tagEl ? _tagEl.value : '';

    currentPantheon.stories.push(text);
    savePantheon();
    renderMyPantheon();
    if (_bondKey) grantBond(_bondKey);   // 🔱 dedicate → grow that Echo's Bond (evolution)
    document.getElementById('story-text').value = '';
    let baseKarma = 3;
    if (currentPantheon.festivalBoost) {
      baseKarma += Math.floor(currentPantheon.festivalBoost / 4);
      showToast(`Festival boost! +${baseKarma} total`, 1500);
    }
    addKarma(baseKarma);

    // Peak-share (do-now): creation pride is at its peak here → spread it. First Echo auto-opens the share sheet (one-time), later ones nudge.
    var _storyN = currentPantheon.stories.length;
    setTimeout(function(){
      try {
        if (_storyN === 1 && typeof shareToTG === 'function') { shareToTG(); }
        else { showToast('\ud83d\udcdc Proud of that Echo? Share your legend \u2726', 3000); }
      } catch(e){}
    }, 1500);

    // ULTIMATE Story Bloom animation
    setTimeout(() => {
      const stories = document.querySelectorAll('#stories-list .story');
      if (stories.length) {
        const last = stories[stories.length - 1];
        last.style.transition = 'none';
        last.style.transform = 'scale(0.6) translateY(30px)';
        last.style.opacity = '0';
        last.style.boxShadow = '0 0 0 12px rgba(201,162,39,.6)';

        void last.offsetWidth;

        last.style.transition = 'all .8s cubic-bezier(.2,1,.2,1)';
        last.style.transform = 'scale(1) translateY(0)';
        last.style.opacity = '1';
        last.style.boxShadow = '0 0 0 8px rgba(201,162,39,.45)';

        // Gold particles / bloom effect
        const bloom = document.createElement('div');
        bloom.className = 'story-bloom';
        last.appendChild(bloom);
        setTimeout(() => bloom.remove(), 900);

        setTimeout(() => {
          last.style.boxShadow = '0 4px 14px rgba(0,0,0,.28)';
        }, 700);
      }
    }, 40);
  });
}

// Intention chips for story (optional, pure UGC — appends gentle phrase)
document.querySelectorAll('.intention-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    const ta = document.getElementById('story-text');
    if (!ta) return;
    const phrase = chip.dataset.phrase;
    const current = ta.value.trim();
    const addition = current ? ` ${phrase} ` : phrase + ' ';
    ta.value = (current + addition).trim();
    ta.focus();
    // soft feedback
    chip.style.transition = 'all .1s';
    chip.style.transform = 'scale(0.9)';
    setTimeout(() => {
      chip.style.transform = '';
    }, 120);
  });
});

// Share to TG (Raji-style auto-framing)
function shareToWhatsApp() {
  if (!currentPantheon) return;
  var framing = "\n\nA fictional story inspired by ancient epics (dharma & karma) - a creative test for Indians in their 20s-30s.";
  var text = "My Pantheon: " + currentPantheon.name + "\n" + (currentPantheon.desc || "") + "\n\n" + (currentPantheon.stories.slice(-1)[0] || "") + framing + "\n" + window.location.href;
  var url = "https://wa.me/?text=" + encodeURIComponent(text);
  try { if (tg && tg.openLink) tg.openLink(url); else window.open(url, "_blank"); } catch(e){ window.open(url, "_blank"); }
  sharesCount++; addKarma(2);
  try { renderReferralStreak(); } catch(e){}
  showToast("Opening WhatsApp to share your legend \u2726");
}
function shareToTG() {
  if (!currentPantheon) return;
  
  const framing = "\n\nA fictional story inspired by ancient epics. A creative narrative themed on dharma (duty and virtue within context) and karma (the virtuous cycle of positive action) • a test for Indians in their 20s-30s";
  const text = `My Pantheon: ${currentPantheon.name}\n${currentPantheon.desc || ''}\n\n${currentPantheon.stories.slice(-1)[0] || ''}${framing}`;
  
  if (tg && tg.openTelegramLink) {
    tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`);
  } else {
    navigator.clipboard?.writeText(text).then(() => showToast('Copied with framing! Share it to your TG group. (fictional narrative)'));
  }
  sharesCount++;
  const reach = Math.floor(Math.random() * 180) + 70;
  addKarma(2);
  showToast(`Shared! Reached ${reach} friends • +2 Karma ✧`, 2600);
  haptic('medium');   // rank20
  celebrateShare();
  
  // Live feedback: update status immediately with reach
  if (document.getElementById('tab-my').classList.contains('active')) {
    renderMyPantheon();
    // Extra visual on status shares
    const sharesEl = document.getElementById('status-shares');
    if (sharesEl) {
      sharesEl.style.transition = 'transform .2s, color .2s';
      sharesEl.style.transform = 'scale(1.3)';
      sharesEl.style.color = '#c9a227';
      setTimeout(() => {
        sharesEl.style.transform = 'scale(1)';
        sharesEl.style.color = '';
      }, 400);
    }
  }
}

function inviteFriends() {
  const link = getInviteLink();
  const text = '🔱 Join my Pantheon — build your dharma legacy. Founding clans are honored forever.\n' + link;
  if (tg && tg.openTelegramLink) {
    tg.openTelegramLink('https://t.me/share/url?url=' + encodeURIComponent(link) + '&text=' + encodeURIComponent(text));
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(link).then(() => showToast('Invite link copied! Share in your TG groups ✧', 2800));
  }
  sharesCount++;
  addKarma(3);  // 발송 보상(소액). 실제 가입 = 래더 마일스톤(백엔드 연결 시 정산).
  showToast('Invite shared! Friends who join via your link light your path ✧', 2800);
  haptic('medium');   // rank20
  celebrateShare();
  if (document.getElementById('tab-my').classList.contains('active')) renderMyPantheon();
}

// === Festivals === (실제 정의는 아래 line ~1379 joinEvent 단일본 — 중복 死본 제거됨, QA P2)

function playClanAnthem() {
  const txt = "Clan Anthem (arts synthesis):\nIn the harmony of many voices, we rise as one...\nWu wei • Karma carries.\n(Fictional, positive only)";
  const div = document.createElement('div');
  div.style.cssText='position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#25221d;border:1px solid #c9a227;padding:12px 16px;border-radius:12px;font-size:12px;max-width:280px;z-index:9999;';
  div.innerHTML = `<strong>🎵 Clan Anthem</strong><br><pre style="white-space:pre-wrap;margin:6px 0 0;font-size:11px;line-height:1.3">${txt}</pre><button onclick="this.parentNode.remove();addKarma(1)" style="margin-top:8px">Sing +1 Karma</button>`;
  document.body.appendChild(div);
}

function showPremiumModal() {
  if (isYouthMode()) { showToast('Purchases are disabled in youth mode — core features are free ✧'); return; }
  const modal = document.createElement('div');
  modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:9999;';
  const firstOffer = !firstPayUsed()
    ? `<div style="background:linear-gradient(135deg,#3a2f12,#2a2413);border:1px solid #c9a227;border-radius:10px;padding:9px 10px;margin:0 0 12px;font-size:11.5px;line-height:1.45;color:#f5e9c0;">
         <strong style="color:#c9a227;">✧ First unlock bonus — one time</strong><br>
         2× welcome Karma (+50 instead of +25), Golden Frame included.
       </div>`
    : '';
  const buyLabel = !firstPayUsed() ? 'Unlock 2× — Stars' : 'Purchase with Stars';
  modal.innerHTML = `
    <div style="background:#25221d;border:1px solid #c9a227;border-radius:16px;padding:20px;max-width:300px;text-align:center;">
      <strong>Premium (TG Stars)</strong><br><br>
      ${firstOffer}
      <span style="font-size:12px;opacity:0.8">Featured slot, extra stories, custom Golden Frame — cosmetic only.<br>
      Core (create, stories, karma, share, festivals) is always free.<br><br>
      <strong>Fictional stories inspired by epics. Optional purchase. XTR via Bot.</strong></span><br><br>
      <div style="font-size:11px;line-height:1.4;color:#c9a227;opacity:0.95;margin:0 0 10px;padding:6px 8px;border:1px solid #c9a227;border-radius:8px;">🔒 In-game cosmetic only · No cash value · Non-transferable · Not gambling</div>
      <button onclick="this.closest('div[style*=\'position:fixed\']').remove(); purchaseP2WithStars('p2_featured');" style="margin:4px;padding:8px 16px;background:#c9a227;color:#111;border:none;border-radius:8px;">${buyLabel}</button>
      <button onclick="this.closest('div[style*=\"position:fixed\"]').remove()" style="margin:4px;padding:8px 16px;background:transparent;color:#c9a227;border:1px solid #c9a227;border-radius:8px;">Cancel</button>
    </div>`;
  document.body.appendChild(modal);
}

function showLegal(type) {
  const modal = document.createElement('div');
  modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;z-index:9999;';
  
  let title, content;
  if (type === 'privacy') {
    title = 'Privacy';
    content = `This app is fully local.<br>
• No personal data is collected or sent to any server.<br>
• All progress (Karma, Stories, Pantheon) stays only in your device localStorage.<br>
• Runs only as Telegram WebApp. No accounts or tracking.<br>
• Fictional stories inspired by ancient epics only.`;
  } else {
    title = 'Terms of Use';
    content = `All content is <strong>purely fictional</strong>, inspired by ancient epics of dharma &amp; karma.<br>
• Not intended to represent or depict any real religion, gods, or deities.<br>
• Positive, empowering stories only (dharma choices, family uplift, growth).<br>
• User-generated content (UGC) is the responsibility of the creator.<br>
• For entertainment and cultural pride through fiction.`;
  }
  
  modal.innerHTML = `
    <div style="background:#25221d;border:1px solid #c9a227;border-radius:14px;padding:18px;max-width:300px;font-size:12.5px;line-height:1.5;color:#f5f1e6;">
      <strong style="color:#c9a227;">${title}</strong><br><br>
      ${content}<br><br>
      <div style="font-size:10px;opacity:0.6;margin:8px 0;">Fictional • Positive only • No real deities</div>
      <button onclick="this.closest('div[style*=\'position:fixed\']').remove()" 
              style="width:100%;padding:10px;background:#c9a227;color:#111;border:none;border-radius:8px;font-weight:600;">Close</button>
    </div>`;
  document.body.appendChild(modal);
}

// Explore (dummy data - Raji-style fictional stories)
// rank15: hoisted to module scope (const) — no per-render reallocation of 20 objects.
const P2_SEED_PANTHEONS = [
    { name: "Winds of Duty", echoes: "Echo of Rama, Echo of Hanuman", stories: 7, karma: 42, example: "A son set aside his city dreams to care for his ailing father through the monsoon. Years later the small tea-stall he kept alive became the heart of the village. — like the echoes of Rama and Hanuman." },
    { name: "Bloom of Small Kindness", echoes: "Echo of Krishna, Echo of Draupadi", stories: 12, karma: 89, example: "In poverty she still shared a child's lunch and an elder's medicine every day, trusting kindness returns. Fifteen years on, a grandchild she once fed came back with a chance that lifted her whole family. — like the echoes of Krishna and Draupadi." },
    { name: "Shield of Warmth", echoes: "Echo of Durga, Echo of Hanuman", stories: 5, karma: 31, example: "Widowed and struggling, she gave what little she had to her neighbours. A boy she once helped returned to build a school in her name. — like the echoes of Durga and Hanuman." },
    { name: "The Patient River", echoes: "Echo of Rama, Echo of Krishna", stories: 9, karma: 54, example: "He forgave the brother who wronged him and kept the family land whole. Their children now farm it together. — like the echoes of Rama and Krishna." },
    { name: "Lamp in the Storm", echoes: "Echo of Durga, Echo of Draupadi", stories: 6, karma: 38, example: "She stood between a frightened crowd and a falling wall, guiding everyone out first. They light a lamp for her each year. — like the echoes of Durga and Draupadi." },
    { name: "Threads of Trust", echoes: "Echo of Krishna, Echo of Hanuman", stories: 11, karma: 77, example: "A weaver taught his craft freely to orphans instead of guarding his secrets. The town's cloth became famous, and none of them went hungry. — like the echoes of Krishna and Hanuman." },
    { name: "The Honest Scale", echoes: "Echo of Rama, Echo of Draupadi", stories: 4, karma: 26, example: "A grain-seller always gave full measure even when he could cheat. In a hard year, the whole market vouched for him and saved his shop. — like the echoes of Rama and Draupadi." },
    { name: "Courage of the Quiet", echoes: "Echo of Durga, Echo of Hanuman", stories: 8, karma: 49, example: "The smallest student spoke up against a cruel rule, alone. By the next season the rule was gone and others had found their voice. — like the echoes of Durga and Hanuman." },
    { name: "Garden of the Forgotten", echoes: "Echo of Krishna, Echo of Rama", stories: 10, karma: 63, example: "He planted shade trees on a road he'd never walk old enough to enjoy. Travellers now rest beneath them and bless a name they never knew. — like the echoes of Krishna and Rama." },
    { name: "The Returned Coin", echoes: "Echo of Draupadi, Echo of Hanuman", stories: 3, karma: 22, example: "A boy returned a lost purse though his family went without dinner. The owner, a teacher, gave him years of free learning. — like the echoes of Draupadi and Hanuman." },
    { name: "Roots That Hold", echoes: "Echo of Durga, Echo of Krishna", stories: 13, karma: 95, example: "She raised her sister's children as her own after a flood took everything. Today they care for the elders of three families. — like the echoes of Durga and Krishna." },
    { name: "The Unbroken Promise", echoes: "Echo of Rama, Echo of Hanuman", stories: 7, karma: 44, example: "He kept a vow to a dying friend to protect his fields, asking nothing. The friend's daughter now leads the village council. — like the echoes of Rama and Hanuman." },
    { name: "Song of the Last Bowl", echoes: "Echo of Krishna, Echo of Draupadi", stories: 6, karma: 35, example: "In famine she shared her last bowl of rice with a stranger. The stranger, a merchant, returned with seed for the whole village. — like the echoes of Krishna and Draupadi." },
    { name: "Hands for the Tired", echoes: "Echo of Durga, Echo of Rama", stories: 9, karma: 58, example: "A young nurse stayed past every shift for those with no family near. The hospital now bears a small ward built by the people she healed. — like the echoes of Durga and Rama." },
    { name: "The Mended Boat", echoes: "Echo of Hanuman, Echo of Krishna", stories: 5, karma: 29, example: "A fisherman repaired the boats of rivals ruined by a storm, for free. The next season they all sailed out together. — like the echoes of Hanuman and Krishna." },
    { name: "Light Carried Forward", echoes: "Echo of Draupadi, Echo of Durga", stories: 12, karma: 84, example: "A teacher walked miles to bring lessons to children no school would take. Many now teach the next forgotten village. — like the echoes of Draupadi and Durga." },
    { name: "The Quiet Debt", echoes: "Echo of Rama, Echo of Krishna", stories: 4, karma: 27, example: "He paid off a poor neighbour's loan in secret and never spoke of it. Years later the neighbour did the same for another, the kindness still moving. — like the echoes of Rama and Krishna." },
    { name: "Wings Over the Field", echoes: "Echo of Hanuman, Echo of Durga", stories: 8, karma: 52, example: "She carried medicine across a flooded river to a fevered child at midnight. The child grew to build the village's first clinic. — like the echoes of Hanuman and Durga." },
    { name: "The Shared Harvest", echoes: "Echo of Krishna, Echo of Rama", stories: 11, karma: 71, example: "Three farmers pooled their failing fields instead of fighting over water. Together they fed families that drought would have broken. — like the echoes of Krishna and Rama." },
    { name: "Embers of Welcome", echoes: "Echo of Draupadi, Echo of Hanuman", stories: 6, karma: 40, example: "Her door and pot were open to every traveller, however poor. When fire took her home, a hundred strangers rebuilt it in a week. — like the echoes of Draupadi and Hanuman." }
];

function _exploreEchoVals(echoStr) {
  return echoStr.split(', ').map(e => {
    if (e.includes('Krishna')) return 'Krishna-echo';
    if (e.includes('Rama')) return 'Rama-echo';
    if (e.includes('Draupadi')) return 'Draupadi-echo';
    if (e.includes('Hanuman')) return 'Hanuman-echo';
    if (e.includes('Durga')) return 'Durga-echo';
    return '';
  });
}

// Daily seed rotation — the fictional feed re-orders every day (date-hashed, deterministic, no
// backend, no fabricated activity counts) so the Explore tab feels like a living, refreshing
// community instead of a frozen list. data-idx keeps the TRUE index so view/like/inspire stay correct.
function _exploreOrder() {
  const n = P2_SEED_PANTHEONS.length;
  const order = Array.from({ length: n }, (_, i) => i);
  let s = (hashId(todayStr() + ':explore') >>> 0) || 1;
  const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  for (let i = n - 1; i > 0; i--) {   // Fisher–Yates with a seeded LCG
    const j = Math.floor(rnd() * (i + 1));
    const tmp = order[i]; order[i] = order[j]; order[j] = tmp;
  }
  return order;
}

function renderExplore() {
  const list = document.getElementById('explore-list');
  if (!list) return;
  const fresh = '<div class="explore-fresh">✧ Fresh picks today — the Pantheon feed refreshes daily</div>';
  // rank15: build the whole list as one string, then a single innerHTML assignment (1 reflow, O(n)).
  list.innerHTML = fresh + _exploreOrder().map((i, pos) => {
    const d = P2_SEED_PANTHEONS[i];
    const miniIcons = _exploreEchoVals(d.echoes).map(v => v ? getEchoIcon(v, 16) : '').join('');
    const preview = d.example.length > 150 ? d.example.slice(0, 148).trim() + '…' : d.example;
    // Honest hierarchy: only the top of today's order is the pick, not every card.
    const pick = pos === 0 ? '<span class="explore-pick">✧ Top pick today</span>' : '';
    return `
      <div class="card${pos === 0 ? ' featured' : ''}" data-idx="${i}" role="button" tabindex="0" style="cursor:pointer;">
        <div style="display:flex; align-items:center; gap:6px;">
          <div style="display:flex; gap:2px;">${miniIcons}</div>
          <strong>${escapeHtml(d.name)}</strong>
          ${pick}
        </div>
        <div class="meta">${escapeHtml(d.echoes)} • ${d.karma} karma</div>
        <p class="example">"${escapeHtml(preview)}"</p>
        <div style="display:flex; gap:6px; margin-top:2px;">
          <button class="small" data-act="like">Like &amp; Share</button>
          <button class="small" data-act="inspire">Inspire My Story</button>
        </div>
      </div>`;
  }).join('');

  // rank1: wire via addEventListener (no inline onclick carrying story data → removes the
  // stored-XSS / cross-user "worm" vector the moment real backend UGC feeds this list).
  list.querySelectorAll('.card').forEach(card => {
    const idx = parseInt(card.dataset.idx, 10);
    const open = () => viewPantheon(idx);
    card.addEventListener('click', e => {
      const act = e.target.getAttribute && e.target.getAttribute('data-act');
      if (act === 'like') { e.stopPropagation(); likePantheon(P2_SEED_PANTHEONS[idx].name); }
      else if (act === 'inspire') { e.stopPropagation(); useAsInspiration(P2_SEED_PANTHEONS[idx].example); }
      else open();
    });
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });
  });
}

// rank13: real read path — a detail view (echoes + full featured tale) instead of a dead-end card.
function viewPantheon(idx) {
  const d = P2_SEED_PANTHEONS[idx];
  if (!d) return;
  const echoVals = _exploreEchoVals(d.echoes);
  const echoRows = d.echoes.split(', ').map((name, i) => {
    const icon = echoVals[i] ? getEchoIcon(echoVals[i], 20) : '';
    return `<div style="display:flex;align-items:center;gap:8px;margin:4px 0;">${icon}<span>${escapeHtml(name)}</span></div>`;
  }).join('');
  const modal = document.createElement('div');
  modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;z-index:9999;padding:16px;';
  modal.innerHTML = `
    <div style="background:#25221d;border:1px solid #c9a227;border-radius:16px;padding:20px;max-width:340px;max-height:80vh;overflow-y:auto;color:#f5f1e6;">
      <strong style="color:#c9a227;font-size:16px;">${escapeHtml(d.name)}</strong>
      <div style="margin:8px 0 4px;font-size:11px;color:#c9a227;opacity:.8;">Echoes of this pantheon</div>
      ${echoRows}
      <div style="margin:10px 0 4px;font-size:11px;color:#c9a227;opacity:.8;">Featured tale</div>
      <p style="font-size:13px;line-height:1.5;">"${escapeHtml(d.example)}"</p>
      <div style="font-size:10px;opacity:.6;margin:8px 0;">Community pantheon • fictional, inspired by the epics • ${d.karma} karma</div>
      <div style="display:flex;gap:8px;">
        <button data-act="inspire" style="flex:1;padding:10px;background:#c9a227;color:#111;border:none;border-radius:8px;font-weight:600;">Inspire My Story</button>
        <button data-act="close" style="flex:1;padding:10px;background:transparent;color:#c9a227;border:1px solid #c9a227;border-radius:8px;">Close</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  modal.querySelector('[data-act="inspire"]').addEventListener('click', () => { modal.remove(); useAsInspiration(d.example); });
  modal.querySelector('[data-act="close"]').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  haptic('light');
}

function useAsInspiration(text) {
  // rank22: no pantheon yet → the story box is hidden, so don't silently lose the spark.
  // Save it, guide the user to Create, and auto-inject after the pantheon is born.
  if (!currentPantheon) {
    try { localStorage.setItem('p2_pending_story', text); } catch (e) {}
    switchTab('create');
    showToast('Create your pantheon first — your inspiration is saved ✧', 3000);
    return;
  }
  const ta = document.getElementById('story-text');
  if (ta) {
    ta.value = text + ' — (refined into my own version, fictional)';
    switchTab('my');
    showToast('Inspiration copied. Edit it and add your own. (keep the fictional frame)');
  } else {
    showToast('Add your story in the My Pantheon tab.');
    switchTab('my');
  }
}

function likePantheon(name) {
  const reach = Math.floor(Math.random() * 120) + 50;
  showToast(`Shared "${escapeHtml(name)}"! Reached ${reach} • +2 Karma ✧`);
  sharesCount++;
  addKarma(2);
  haptic('medium');   // rank20
  celebrateShare();
  if (document.getElementById('tab-my').classList.contains('active')) {
    renderMyPantheon();
  }
}



// Festivals with stronger, more celebratory micro (still elegant)
function joinEvent(ev) {
  if (!currentPantheon) { showToast('Create your pantheon first!'); switchTab('create'); return; }  // QA P2: 가드 복원(死 중복본에만 있던 것)
  const messages = {
    ganesh: "Joined Ganesh challenge! +8 karma for clan story.",
    navratri: "9-day power streak started. Daily contribution +3.",
    diwali: "Diwali light retell mission accepted. +10 on complete."
  };
  
  const btns = document.querySelectorAll('#tab-events button');
  let targetBtn = null;
  
  btns.forEach(b => {
    const oc = b.getAttribute('onclick') || '';
    if (oc.includes("'" + ev + "'") || oc.includes('"' + ev + '"')) {  // QA P1 fix: 클릭된 축제 버튼만 (텍스트 'Join' 매칭 → 축제 3개 전부 삼켜 2/3 영구잠금하던 버그)
      targetBtn = b;
      b.style.transition = 'transform .35s cubic-bezier(.22,1,.32,1), background .2s';
      b.style.transform = 'scale(0.88)';
      b.style.background = 'rgba(201,162,39,.2)';
      b.textContent = '✦ Joined';

      setTimeout(() => {
        b.style.transform = 'scale(1.08)';
        setTimeout(() => {
          b.style.transform = 'scale(1)';
          if (b.parentNode) {
            b.parentNode.innerHTML = `<span style="color:#c9a227;font-size:13px; letter-spacing:.5px;">✦ Participating</span>`;
          }
        }, 280);
      }, 220);
    }
  });
  
  const karmaGain = ev === 'diwali' ? 10 : (ev === 'navratri' ? 6 : 8);
  addKarma(karmaGain);
  haptic('medium');   // rank20
  
  // Visual payoff: update status + temp festival boost indicator
  if (document.getElementById('tab-my').classList.contains('active')) {
    renderMyPantheon();
  }
  showToast(`${messages[ev]} Clan power +${karmaGain}!`, 2600);
  
  // Stronger celebratory pulse on the card + unlock effect
  if (targetBtn) {
    const card = targetBtn.closest('.event-card');
    if (card) {
      card.style.transition = 'transform .55s cubic-bezier(.2,1,.2,1), box-shadow .4s';
      card.style.transform = 'scale(1.06)';
      card.style.boxShadow = '0 0 0 6px rgba(201,162,39,.4), 0 0 20px rgba(201,162,39,.2)';
      setTimeout(() => {
        card.style.transform = 'scale(1)';
        card.style.boxShadow = '';
      }, 600);
      
      // Unlock special festival story slot visual
      if (currentPantheon) {
        currentPantheon.festivalBoost = (currentPantheon.festivalBoost || 0) + karmaGain;
        savePantheon();
        const note = document.createElement('div');
        note.style.cssText = 'font-size:10px;color:#c9a227;margin-top:4px;text-align:center;';
        note.textContent = `✦ Festival story slot unlocked (+${karmaGain} bonus)`;
        card.appendChild(note);
        setTimeout(() => note.remove(), 4000);
      }
    }
  }
}

// Bottom nav listeners (high-quality TG app feel)
document.querySelectorAll('.bottom-nav button').forEach(btn => {
  btn.addEventListener('click', () => {
    // switchTab already sets the active button and renders the tab synchronously (rank9/15) —
    // no redundant second renderExplore()/class toggle here (was a double reflow).
    switchTab(btn.dataset.tab);
  });
});

// ========== HIGH-QUALITY MEDITATION OM (Top bar, not bottom) ==========
// High-frequency Om for Indian meditation: 432Hz base + 528Hz high-vibe layers (popular for healing & high vibration)
let omAudioCtx = null;
let omOscillators = [];
let omGain = null;
let omPlaying = false;
let breathInterval = null;
let currentFreqMode = 'om';
let omStartTime = null; // for duration-based gentle bonus
let omTimerInterval = null;

const freqOptions = [
  { mode: 'om', label: 'ॐ Om', desc: 'Traditional rich mantra' },
  { mode: '432', label: '432 Hz', desc: 'Nature Harmony' },
  { mode: '528', label: '528 Hz', desc: 'Love & Miracles' },
  { mode: '963', label: '963 Hz', desc: 'Oneness & Divine' },
  { mode: '417', label: '417 Hz', desc: 'Release Negativity' },
  { mode: '639', label: '639 Hz', desc: 'Connection & Harmony' }
];

function getBaseFreq(mode) {
  if (mode === 'om') return 136.1; // sacred Om fundamental (cosmic tone)
  return parseFloat(mode) || 432;
}

function startOm() {
  if (omPlaying) return;
  if (!omAudioCtx) omAudioCtx = new (window.AudioContext || window.webkitAudioContext)();

  omOscillators = [];
  const f = getBaseFreq(currentFreqMode);

  // Master gain — soft luxurious volume, never harsh
  const master = omAudioCtx.createGain();
  master.gain.value = 0.001;

  // === Rich layered pure sines (high-vibe, clean, premium) ===
  // Fundamental
  const osc1 = omAudioCtx.createOscillator();
  osc1.type = 'sine';
  osc1.frequency.value = f;
  const g1 = omAudioCtx.createGain();
  g1.gain.value = (currentFreqMode === 'om' ? 0.72 : 0.65);

  // Octave (warmth & presence)
  const osc2 = omAudioCtx.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.value = f * 2;
  const g2 = omAudioCtx.createGain();
  g2.gain.value = (currentFreqMode === 'om' ? 0.32 : 0.26);

  // Upper harmonic for sparkle & clarity (not shrill)
  const osc3 = omAudioCtx.createOscillator();
  osc3.type = 'sine';
  osc3.frequency.value = f * 2.98; // near 3rd, slightly detuned for living beauty
  const g3 = omAudioCtx.createGain();
  g3.gain.value = 0.11;

  // Connect fundamentals
  osc1.connect(g1);
  osc2.connect(g2);
  osc3.connect(g3);

  // Gentle lowpass for silk-soft high frequencies
  const lp = omAudioCtx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 2650;

  g1.connect(lp);
  g2.connect(lp);
  g3.connect(lp);

  // Special rich layers only for classic Om (432 + 528 blend inside mantra)
  if (currentFreqMode === 'om') {
    const o432 = omAudioCtx.createOscillator();
    o432.type = 'sine';
    o432.frequency.value = 432;
    const g432 = omAudioCtx.createGain(); g432.gain.value = 0.16;
    o432.connect(g432); g432.connect(lp);

    const o528 = omAudioCtx.createOscillator();
    o528.type = 'sine';
    o528.frequency.value = 528;
    const g528 = omAudioCtx.createGain(); g528.gain.value = 0.09;
    o528.connect(g528); g528.connect(lp);

    o432.start(); omOscillators.push(o432);
    o528.start(); omOscillators.push(o528);
  }

  // Subtle living movement (slow LFO on the upper harmonic)
  const lfo = omAudioCtx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 0.09;
  const lfoAmt = omAudioCtx.createGain();
  lfoAmt.gain.value = 2.2;
  lfo.connect(lfoAmt);
  lfoAmt.connect(osc3.frequency);
  lfo.start();
  omOscillators.push(lfo);

  // Final master
  const masterOut = omAudioCtx.createGain();
  masterOut.gain.value = 0.001;
  lp.connect(masterOut);
  masterOut.connect(omAudioCtx.destination);

  // Start all
  [osc1, osc2, osc3].forEach(o => { o.start(); omOscillators.push(o); });

  omGain = masterOut;
  omPlaying = true;

  // Beautiful soft fade-in
  masterOut.gain.setValueAtTime(0.0008, omAudioCtx.currentTime);
  masterOut.gain.linearRampToValueAtTime(0.24, omAudioCtx.currentTime + 1.35);

  // Duck BGM elegantly when Om is focus
  if (bgmGain && bgmCtx) {
    bgmGain.gain.cancelScheduledValues(bgmCtx.currentTime);
    bgmGain.gain.linearRampToValueAtTime(0.022, bgmCtx.currentTime + 0.7);
  }
}

function stopOm() {
  if (!omPlaying || !omGain || !omAudioCtx) return;

  omGain.gain.cancelScheduledValues(omAudioCtx.currentTime);
  omGain.gain.linearRampToValueAtTime(0.0001, omAudioCtx.currentTime + 1.05);

  setTimeout(() => {
    omOscillators.forEach(o => { try { o.stop(); } catch (e) {} });
    omOscillators = [];
    omGain = null;
    omPlaying = false;

    // Restore luxurious BGM
    if (bgmGain && bgmCtx) {
      bgmGain.gain.cancelScheduledValues(bgmCtx.currentTime);
      bgmGain.gain.linearRampToValueAtTime(0.09, bgmCtx.currentTime + 1.6);
    }
  }, 1150);
}

function initOmMeditation() {
  const btn = document.getElementById('om-btn');
  const symbol = document.getElementById('om-symbol');
  const breath = document.getElementById('breath-guide');
  const breathText = document.getElementById('breath-text');
  const freqList = document.getElementById('freq-list');

  if (!btn || !symbol) return;

  btn.addEventListener('click', () => {
    if (!omPlaying) {
      omStartTime = Date.now();
      startOm();
      btn.textContent = '⏸ Pause Om';
      btn.classList.add('playing');
      symbol.classList.add('playing');
      breath.style.display = 'block';
      document.getElementById('om-timer').style.display = 'inline';
      startBreathingGuide(breathText);

      // Live timer
      if (omTimerInterval) clearInterval(omTimerInterval);
      omTimerInterval = setInterval(() => {
        const timerEl = document.getElementById('om-timer');
        if (!timerEl || !omStartTime) return;
        const secs = Math.floor((Date.now() - omStartTime) / 1000);
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        timerEl.textContent = `${m}:${s.toString().padStart(2, '0')}`;
      }, 1000);

      // Small positive karma boost for meditation (fits the app theme)
      setTimeout(() => {
        if (typeof addKarma === 'function' && currentPantheon) {
          addKarma(1);
        }
      }, 45000);
    } else {
      if (omStartTime && currentPantheon) {
        const durSec = (Date.now() - omStartTime) / 1000;
        if (durSec > 25) {
          addKarma(1);
          showToast('Meditation has calmed your mind • +1 Karma', 1400);
        }
      }
      if (omTimerInterval) {
        clearInterval(omTimerInterval);
        omTimerInterval = null;
      }
      document.getElementById('om-timer').style.display = 'none';
      omStartTime = null;
      stopOm();
      btn.textContent = '▶ Play Om';
      btn.classList.remove('playing');
      symbol.classList.remove('playing');
      breath.style.display = 'none';
      stopBreathingGuide();
    }
  });

  // Frequency selector — fully wired, luxurious switch
  if (freqList) {
    // Restore previous choice (persisted)
    const saved = localStorage.getItem('p2_freq_mode');
    if (saved && freqOptions.some(o => o.mode === saved)) {
      currentFreqMode = saved;
      // activate correct chip
      freqList.querySelectorAll('.freq-item').forEach(i => {
        i.classList.toggle('active', i.dataset.mode === saved);
      });
    }

    // Set initial elegant info text
    const infoEl = document.getElementById('om-freq-info');
    const curOpt = freqOptions.find(o => o.mode === currentFreqMode);
    if (infoEl && curOpt) {
      infoEl.textContent = `${curOpt.label} • ${curOpt.desc} for inner peace & dharma`;
    }

    freqList.querySelectorAll('.freq-item').forEach(item => {
      item.addEventListener('click', () => {
        const mode = item.dataset.mode;
        if (mode === currentFreqMode) return;

        // Visual active state (soft premium)
        freqList.querySelectorAll('.freq-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        currentFreqMode = mode;
        localStorage.setItem('p2_freq_mode', mode);

        // Update info text beautifully
        const info = document.getElementById('om-freq-info');
        const opt = freqOptions.find(o => o.mode === mode);
        if (info && opt) {
          info.textContent = `${opt.label} • ${opt.desc} for inner peace & dharma`;
        }

        // Gentle visual cue on symbol when changing
        const symbol = document.getElementById('om-symbol');
        if (symbol) {
          symbol.style.transition = 'transform .2s ease, filter .2s ease';
          symbol.style.transform = 'scale(0.96)';
          setTimeout(() => {
            symbol.style.transform = 'scale(1.04)';
            setTimeout(() => { symbol.style.transform = ''; }, 280);
          }, 90);
        }

        // Seamless switch while playing (rich tones change instantly)
        if (omPlaying) {
          stopOm();
          setTimeout(() => {
            startOm();
          }, 130);
        }
      });
    });
  }
}

function startBreathingGuide(breathTextEl) {
  if (!breathTextEl) return;
  stopBreathingGuide();

  const phases = [
    { text: "Inhale slowly with the Om...", dur: 4200 },
    { text: "Hold the light...", dur: 2100 },
    { text: "Exhale gently... release", dur: 4800 }
  ];
  let idx = 0;

  function nextPhase() {
    const p = phases[idx % phases.length];
    breathTextEl.style.transition = 'opacity .35s ease';
    breathTextEl.style.opacity = '0.45';
    setTimeout(() => {
      breathTextEl.textContent = p.text;
      breathTextEl.style.opacity = '1';
    }, 160);

    idx++;
    breathInterval = setTimeout(nextPhase, p.dur);
  }

  breathTextEl.textContent = phases[0].text;
  breathInterval = setTimeout(nextPhase, phases[0].dur);
}

function stopBreathingGuide() {
  if (breathInterval) {
    clearInterval(breathInterval);
    breathInterval = null;
  }
}

// Init on load
setTimeout(() => {
  initOmMeditation();
}, 300);

// ========== BASIC BGM - Clean, neat, luxurious high-quality ambient ==========
// Clean luxurious BGM: high-frequency clear tones (432Hz base + elegant high layers) 
// Inspired by premium Indian spiritual music - deep but neat, not overwhelming. Perfect for Raji premium feel.
// Auto starts low volume. High quality pure sines for "깔끔하고 고급스러운" sound.

let bgmCtx = null;
let bgmOscs = [];
let bgmGain = null;
let bgmPlaying = false;

function startBGM() {
  if (bgmPlaying) return;
  if (!bgmCtx) bgmCtx = new (window.AudioContext || window.webkitAudioContext)();

  bgmOscs = [];
  const master = bgmCtx.createGain();
  master.gain.value = 0.09; // very subtle luxurious volume

  // Clean base 432Hz (high vibe, natural, loved in Indian meditation)
  const base = bgmCtx.createOscillator();
  base.type = 'sine';
  base.frequency.value = 432;
  const baseG = bgmCtx.createGain();
  baseG.gain.value = 0.05;

  // Elegant high layer for luxury and "high frequency" clarity
  const high = bgmCtx.createOscillator();
  high.type = 'sine';
  high.frequency.value = 864; // clean octave
  const highG = bgmCtx.createGain();
  highG.gain.value = 0.03;

  // Soft high sparkle for premium neat feel (not harsh)
  const sparkle = bgmCtx.createOscillator();
  sparkle.type = 'sine';
  sparkle.frequency.value = 1728;
  const sparkleG = bgmCtx.createGain();
  sparkleG.gain.value = 0.009; // even cleaner

  // Very soft sub for depth without muddiness
  const sub = bgmCtx.createOscillator();
  sub.type = 'sine';
  sub.frequency.value = 108;
  const subG = bgmCtx.createGain();
  subG.gain.value = 0.02;

  // Extra clean high harmonic for ultra luxurious neatness
  const high2 = bgmCtx.createOscillator();
  high2.type = 'sine';
  high2.frequency.value = 2592; // higher clean layer
  const high2Gain = bgmCtx.createGain();
  high2Gain.gain.value = 0.006;
  high2.connect(high2Gain);

  // Clean filter for neat sound
  const filter = bgmCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 2800;

  // Gentle slow modulation for luxurious non-static feel
  const lfo = bgmCtx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 0.08;
  const lfoG = bgmCtx.createGain();
  lfoG.gain.value = 1.5;
  lfo.connect(lfoG);
  lfoG.connect(sparkle.frequency);

  // Connect all cleanly (high2 through its gain for control)
  base.connect(baseG);
  high.connect(highG);
  sparkle.connect(sparkleG);
  sub.connect(subG);

  baseG.connect(filter);
  highG.connect(filter);
  sparkleG.connect(filter);
  subG.connect(filter);

  [base, high, sparkle, sub, high2].forEach(o => {
    o.start();
    bgmOscs.push(o);
  });
  high2Gain.connect(filter);
  lfo.start();
  bgmOscs.push(lfo);

  filter.connect(master);
  master.connect(bgmCtx.destination);

  bgmGain = master;
  bgmPlaying = true;

  // Soft fade in for high-qual entry
  master.gain.setValueAtTime(0.001, bgmCtx.currentTime);
  master.gain.linearRampToValueAtTime(0.09, bgmCtx.currentTime + 4);
}

function stopBGM() {
  if (!bgmPlaying || !bgmGain) return;
  bgmGain.gain.linearRampToValueAtTime(0.001, bgmCtx.currentTime + 2);
  setTimeout(() => {
    bgmOscs.forEach(o => { try { o.stop(); } catch(e){} });
    bgmOscs = [];
    bgmGain = null;
    bgmPlaying = false;
  }, 2100);
}

// rank21: BGM is OFF by default and never auto-starts.
//  ① Mobile autoplay policy suspends a fresh AudioContext until a user gesture — a 1.2s auto-start
//     was just 6 silent oscillators draining battery. ② Now opt-in via Settings, persisted.
//  ③ First real user gesture resumes the context; ④ backgrounding suspends, page-hide stops.
let bgmEnabled = localStorage.getItem('p2_bgm') === 'true';

function ensureBgm() {
  if (!bgmEnabled) return;
  if (!bgmPlaying) startBGM();
  try { if (bgmCtx && bgmCtx.state === 'suspended') bgmCtx.resume(); } catch (e) {}
}
function _firstGestureBgm() {
  ensureBgm();
  document.removeEventListener('pointerdown', _firstGestureBgm);
}
document.addEventListener('pointerdown', _firstGestureBgm);

document.addEventListener('visibilitychange', () => {
  if (document.hidden) { try { if (bgmCtx) bgmCtx.suspend(); } catch (e) {} }
  else if (bgmEnabled && bgmPlaying) { try { if (bgmCtx) bgmCtx.resume(); } catch (e) {} }
});
window.addEventListener('pagehide', () => { try { stopBGM(); } catch (e) {} });

// (Ducking is handled inside startOm / stopOm for clean control)

// Flashy high-quality micro for Echo selection (luxurious artifact feel)
document.querySelectorAll('.echo-card').forEach(card => {
  card.addEventListener('click', () => {
    const input = card.querySelector('input');
    if (!input) return;
    haptic('light');   // rank20: echo tap

    // Ultra pop + glow on select
    card.style.transition = 'transform .3s cubic-bezier(.2,1,.2,1), box-shadow .35s';
    card.style.transform = 'scale(1.14)';
    card.style.boxShadow = '0 0 0 5px rgba(201,162,39,.6), 0 24px 60px rgba(0,0,0,.45)';

    setTimeout(() => {
      if (input.checked) {
        card.style.transform = 'scale(1.08)';
        card.style.boxShadow = '0 0 0 4px var(--accent), 0 18px 46px rgba(201,162,39,.35)';
      } else {
        card.style.transform = '';
        card.style.boxShadow = '';
      }
      updateEchoSummary();
    }, 300);
  });
});

// Initial sync + direct input listeners for summary
document.querySelectorAll('#tab-create input[type="checkbox"]').forEach(input => {
  input.addEventListener('change', updateEchoSummary);
});
setTimeout(updateEchoSummary, 120);

// Live echo selection summary (count + light synergy hint)
function updateEchoSummary() {
  const summary = document.getElementById('echo-summary');
  if (!summary) return;

  const checked = document.querySelectorAll('#tab-create input[type="checkbox"]:checked');
  const count = checked.length;

  // Primary CTA readiness: it needs 3+ Echoes, so reflect that instead of always looking active.
  const submitBtn = document.getElementById('create-submit-btn');
  if (submitBtn) {
    const ready = count >= 3;
    submitBtn.classList.toggle('not-ready', !ready);
    submitBtn.textContent = ready ? 'Create Pantheon' : 'Choose ' + (3 - count) + ' more Echo' + (3 - count === 1 ? '' : 'es');
  }

  if (count === 0) {
    summary.textContent = '0 echoes selected • Begin your clan';
    summary.style.opacity = '0.6';
    return;
  }

  let vibe = 'Balanced clan';
  if (count >= 3) {
    const names = Array.from(checked).map(cb => {
      const label = document.querySelector(`label.echo-card input[value="${cb.value}"]`)?.closest('label');
      return label?.querySelector('.echo-name')?.textContent || '';
    });
    if (names.some(n => n.includes('Krishna')) && names.some(n => n.includes('Rama'))) {
      vibe = 'Wisdom + Duty';
    } else if (count >= 4) {
      vibe = 'Strong clan aura';
    } else {
      vibe = 'Rising resonance';
    }
  }

  summary.innerHTML = `${count} echoes selected • <span style="color:#d4b37f">${vibe}</span>`;
  summary.style.opacity = '0.9';
}

// Pantheon Director Mode
const DIRECTOR_VAULT = [
  "On a night of pounding monsoon rain, when my father collapsed I turned back from the road to the city. Each day at his side I vowed 'family is my dharma,' brewing his medicine and holding his hand. Eight years later, when the winds had stilled and the stars had risen, the little tea house we built together became the heart of the village. My father says, 'The wind that carried you home saved our house.' — like the Echoes of Rama and Hanuman.",
  "At the end of a poor alley, each day I vowed, 'today too, let me warm someone.' When a grandmother fell ill I bought her medicine; to hungry children I shared my lunch. Even when called a fool, I smiled and believed 'karma travels a long road home.' Along the village path after the monsoon, fifteen years later, the grandson of the grandmother I had helped returned in success. In tears he said, 'She told your story every day. Now it is my turn,' and opened a shop for me and asked me to build the village's business together. The small kindness sown in poverty at last bloomed into a vast lotus of abundance. — like the Echoes of Krishna and Draupadi.",
  "Having lost my husband and raising my child alone, every day was a battle. Repeating 'this hardship will shape me into a warmer soul,' I shared all I had with my neighbors without reserve. When the townsfolk struggled, they would knock at my door. On a rainy day, a boy I had helped long ago returned, having built a great company. 'I wanted to show the world that warm-hearted people like a mother exist,' he said, and built a school for the village. The shield forged from sorrow has now become a light for all. — like the Echoes of Durga and Hanuman.",
  "A poor village boy dug a well and carried stones each dawn. Believing 'my hands are the life of the village,' he poured out his sweat. Twelve years later, when clear water first rose in the village, the children laughed and the fields came alive. When his grandchildren said, 'the well grandfather dug saved us,' he thought, 'so a small promise becomes a great river.' — like the Echoes of Hanuman and Durga.",
  "On the eve of the Diwali festival, a village woman shaped lamps alone, held the aching hands of her neighbors, and shared sweets with poor children. 'Light is meant to be shared,' she whispered. Ten years later, the children she had helped returned in success and held a grand lamp festival that lit the whole village bright. 'The small light our mother gave us became a festival for us all.' Now, each year, the front of her house becomes the brightest star. — like the Echoes of Draupadi and Krishna."
];

// rank24: replace native prompt() (premium-feel breaker, unresponsive in some TG clients) with an
// in-app themed modal of curated theme chips.
function askDirector() {
  const themes = [
    { label: 'Family / Duty',      idx: 0 },
    { label: 'Kindness / Poverty', idx: 1 },
    { label: 'Lifting a Friend',   idx: 2 },
    { label: 'Village / Well',     idx: 3 },
    { label: 'Festival / Light',   idx: 4 },
    { label: '✦ Surprise me',      idx: -1 }
  ];
  const modal = document.createElement('div');
  modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;z-index:9999;padding:16px;';
  modal.innerHTML = `
    <div style="background:#25221d;border:1px solid #c9a227;border-radius:16px;padding:20px;max-width:320px;color:#f5f1e6;">
      <strong style="color:#c9a227;">Pantheon Director</strong>
      <div style="font-size:11px;opacity:.75;margin:6px 0 12px;">Kurosawa · Ray · Rajamouli · Tagore fusion — pick a theme for your tale.</div>
      <div id="dir-themes" style="display:flex;flex-wrap:wrap;gap:8px;"></div>
      <button id="dir-cancel" style="width:100%;margin-top:14px;padding:9px;background:transparent;color:#c9a227;border:1px solid #c9a227;border-radius:8px;">Cancel</button>
    </div>`;
  document.body.appendChild(modal);
  const wrap = modal.querySelector('#dir-themes');
  themes.forEach(th => {
    const b = document.createElement('button');
    b.textContent = th.label;
    b.style.cssText = 'padding:8px 12px;background:rgba(201,162,39,.12);color:#f5f1e6;border:1px solid rgba(201,162,39,.4);border-radius:20px;font-size:12px;cursor:pointer;';
    b.addEventListener('click', () => { modal.remove(); _directorPick(th.idx); });
    wrap.appendChild(b);
  });
  modal.querySelector('#dir-cancel').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  haptic('light');
}

function _directorPick(idx) {
  const ta = document.getElementById('story-text');
  if (!ta) return;
  const chosen = (idx < 0) ? DIRECTOR_VAULT[Math.floor(Math.random() * DIRECTOR_VAULT.length)] : DIRECTOR_VAULT[idx];
  ta.value = 'A fictional story inspired by ancient epics. ' + chosen;
  ta.focus();
  setTimeout(() => {
    const hint = document.createElement('div');
    hint.style.cssText = 'font-size:11px;color:#c9a227;margin-top:4px;';
    hint.textContent = 'Director inspiration added. Refine it into your own words.';
    if (ta.parentNode) ta.parentNode.appendChild(hint);
    setTimeout(() => hint && hint.remove(), 2400);
  }, 90);
  addKarma(1);
}

// Init
window.onload = () => {
  ageGate();             // 🔞 18+ 확인(미결정 시 오버레이) — 최초 1회
  loadState();
  try { p2InjectQuickStart(); } catch(e){}
  if (isYouthMode()) setTimeout(enterYouthMode, 300);   // 🔞 재방문 유스모드: 유료 진입점 숨김
  resolveSource();       // 🎯 첫 터치 채널 출처 확정(captureRef보다 먼저)
  captureRef();          // 🪖 피초대자 환영 보너스 + invitedBy 기록(1회)
  emitLaunch();          // 🎯 install(1회)+session_start 계측 emit(귀속 채널 실림)
  reserveFounder();      // 🏛️ 창립100 서버 슬롯 예약(설치 시 1회)
  founderDay3Gate();     // 🏛️ day-3 재방문 시 창립 보상 지급
  checkStreakOnLoad();   // streak check on load
  syncRefCount();        // 🪖 백엔드 있으면 초대 카운트 동기화 + 래더 렌더

  // Show create or my by default
  if (currentPantheon) {
    renderMyPantheon();
    switchTab('my');
  } else {
    switchTab('create');
  }
  
  // Seed header
  updateHeaderStats();
  
  // Demo explore on load if needed
  
  // Settings init
  initSettings();
  
  // Aura Preview magic
  initAuraPreview();
  
  // Language init
  initLanguage();
  
  updateMainButton();
  
  // If we land on my tab with pantheon, status will render via renderMyPantheon
};

// Auto update preview on load for create tab
if (!currentPantheon) {
  setTimeout(() => {
    const createTab = document.getElementById('tab-create');
    if (createTab && createTab.classList.contains('active')) {
      // already handled by init
    }
  }, 200);
}

// ========== p6 Lung Surprise Eye + Ache-Breath + 창발 pain CROSS DNA (full p2 advance) ==========
// p6 voice recordings → UGC story seeds. "Voice Echo" festivals with surprise karma.
// Sfumato beauty + notebook from voice for dharma growth. Central zero. Legion one.

function importP6VoiceSeeds() {
  let seeds = [];
  try { seeds = JSON.parse(localStorage.getItem('p6_voiceSeeds') || '[]'); } catch(e){}
  if (!seeds.length) {
    // fallback: try last
    try {
      const last = JSON.parse(localStorage.getItem('p6_lastVoiceSeed') || 'null');
      if (last) seeds = [last];
    } catch(e){}
  }
  if (!seeds.length) { showToast('No voice notes yet — record one to seed a story.'); return []; }
  return seeds;
}

function plantVoiceAsStorySeed(seed, customName) {
  if (!currentPantheon) { showToast('Create Pantheon first.'); switchTab('create'); return; }
  const wound = seed.wound || 0.4;
  const surprise = seed.surprise || 0.3;
  // Ache-Breath: high wound = deeper dharma potential (full cheat weaponized positively)
  const karmaBase = 8 + Math.floor(wound * 14) + Math.floor(surprise * 10);
  const storyText = `Voice Echo from breath (p6): "${(seed.insights||'silent ache').slice(0,90)}..." — ${wound>0.6?'The wound sang dharma.':'The breath carried duty.'} (fictional, inspired by epics)`;
  if (!currentPantheon.stories) currentPantheon.stories = [];
  currentPantheon.stories.unshift({ text: storyText, ts: Date.now(), source: 'p6-voice', wound, surprise });
  addKarma(karmaBase);
  // Emergent 1 birth: Breath-Mycelium Karma — surprise spreads to other echoes
  myceliumSpread(surprise, wound);
  savePantheon();
  showToast(`🌬️ Voice Seed planted · +${karmaBase} Karma (ache ${wound.toFixed(2)})`);
  renderMyPantheon();
  // notebook auto log
  logToDharmaNotebook(seed, storyText, karmaBase);
}

function myceliumSpread(surprise, wound) {
  // UNEXPECTED EMERGENT: Breath Mycelium — one voice pain threads silently feed the whole pantheon
  if (!currentPantheon || !currentPantheon.echoes) return;
  if (surprise < 0.15) return;
  const bonus = Math.ceil(surprise * 4 + wound * 3);
  // random other echo "receives" (no UI heavy, just meta growth)
  if (currentPantheon.echoes.length > 1 && Math.random() < 0.7) {
    const idx = Math.floor(Math.random() * currentPantheon.echoes.length);
    // store mycelium thread
    if (!currentPantheon.mycelium) currentPantheon.mycelium = {};
    currentPantheon.mycelium[currentPantheon.echoes[idx]] = (currentPantheon.mycelium[currentPantheon.echoes[idx]] || 0) + bonus;
    // surprise micro feed
    setTimeout(() => {
      addKarma(Math.max(1, Math.floor(bonus * 0.6)));
      try { showToast('Mycelium thread: echo breathed extra karma'); } catch(e){}
    }, 650);
  }
}

let dharmaNotebook = [];
function logToDharmaNotebook(seed, story, karmaGained) {
  dharmaNotebook.unshift({ seedId: seed.id, story, karma: karmaGained, ts: Date.now(), wound: seed.wound, surprise: seed.surprise });
  if (dharmaNotebook.length > 18) dharmaNotebook.length = 18;
  try { localStorage.setItem('p2_dharmaNotebook', JSON.stringify(dharmaNotebook)); } catch(e){}
}

function loadDharmaNotebook() {
  try { dharmaNotebook = JSON.parse(localStorage.getItem('p2_dharmaNotebook') || '[]'); } catch(e){ dharmaNotebook = []; }
}

function renderDharmaNotebook() {
  loadDharmaNotebook();
  const host = document.getElementById('dharma-notebook');
  if (!host) return;
  if (!dharmaNotebook.length) {
    host.innerHTML = '<div class="hint" style="font-size:12px;opacity:.7">No voice notes yet — record a reflection to plant your first entry here.</div>';
    return;
  }
  host.innerHTML = dharmaNotebook.map((entry, i) => {
    const ache = entry.wound ? (entry.wound*100).toFixed(0) : '—';
    return `<div class="dharma-entry" data-idx="${i}" onclick="reObserveVoiceEntry(${i}, this)">
      <div style="font-size:11px;opacity:.75">${new Date(entry.ts).toLocaleDateString()} · depth ${ache}% · +${entry.karma} karma</div>
      <div style="margin:4px 0;font-size:12.5px;line-height:1.35">${escapeHtml(entry.story)}</div>
      <small style="color:#c5a46e">Tap to revisit → a quiet reflection may add dharma</small>
    </div>`;
  }).join('');
}

function reObserveVoiceEntry(idx, el) {
  const entry = dharmaNotebook[idx];
  if (!entry) return;
  const surprise = entry.surprise || 0.25;
  const wound = entry.wound || 0.4;
  const boost = Math.floor(3 + surprise * 11 + wound * 7);
  addKarma(boost);
  // Emergent 2: Unpainted Dharma Smile — sfumato beauty appears from ache re-seeing (p6 DNA)
  if (wound > 0.45 || surprise > 0.22) {
    unpaintedDharmaSmile(el, surprise);
  }
  // mycelium again on re-observe
  myceliumSpread(surprise, wound);
  showToast(`👁 Re-observed · +${boost} dharma (surprise ${surprise.toFixed(2)})`);
  // evolve the entry (notebook growth)
  entry.karma = (entry.karma || 0) + boost;
  localStorage.setItem('p2_dharmaNotebook', JSON.stringify(dharmaNotebook));
  // refresh softly
  setTimeout(renderDharmaNotebook, 420);
}

function unpaintedDharmaSmile(el, surprise) {
  // UNEXPECTED EMERGENT birth: The Unpainted Smile (p6) grafted to p2 dharma notebook.
  // Sfumato 10th glaze appears only on re-observation of pain. No command. Golden lift.
  if (!el) return;
  const smile = document.createElement('div');
  smile.className = 'unpainted-smile';
  smile.style.cssText = `position:absolute;right:8px;top:6px;font-size:13px;opacity:${0.25 + surprise*0.45};color:#f2e1bc;pointer-events:none;`;
  smile.textContent = '∝';
  el.style.position = 'relative';
  el.appendChild(smile);
  // extra prestige micro from the beauty itself
  setTimeout(() => {
    prestige = Math.max(prestige, prestige); // sticky
    addKarma(1); // tiny beauty tax
    smile.style.transition = 'opacity 1.6s ease';
    smile.style.opacity = '0';
    setTimeout(() => smile.remove(), 900);
  }, 1350);
}

function initVoiceCrossDNA() {
  loadDharmaNotebook();
  // Auto wire Voice Seed button if exists (added in HTML)
  const btn = document.getElementById('import-voice-seed-btn');
  if (btn) btn.onclick = () => {
    const seeds = importP6VoiceSeeds();
    if (!seeds.length) return;
    // pick freshest
    const s = seeds[0];
    plantVoiceAsStorySeed(s);
  };
  // Render notebook if host present
  renderDharmaNotebook();
}

// Voice Echo Festival (p6 surprise + p2 FOMO)
function joinVoiceEchoFestival() {
  if (!currentPantheon) { showToast('Open Pantheon first.'); return; }
  let surprise = 0.28;
  try {
    const lung = JSON.parse(localStorage.getItem('p6_lungFragment') || '{}');
    surprise = lung.lastSurprise || 0.31;
  } catch(e){}
  const wound = 0.5 + Math.random()*0.3;
  const base = 22;
  const surge = Math.floor(base + surprise * 28 + wound * 14);
  addKarma(surge);
  myceliumSpread(surprise, wound);
  // festival special: "Voice Echo" limited seal
  try {
    localStorage.setItem('p2_voice_echo_seal', '1');
  } catch(e){}
  showToast(`🎙️ Voice Echo Festival · +${surge} surprise karma ✧`);
  // birth visual echo in UI
  const ev = document.querySelector('#tab-events');
  if (ev) {
    const b = document.createElement('div');
    b.style.cssText = 'margin-top:8px;font-size:11px;color:#c5a46e';
    b.textContent = '∝ Voice mycelium active — echoes breathe together';
    ev.appendChild(b);
    setTimeout(() => b.remove(), 4200);
  }
}

// Wire festivals to include voice one (called from existing renderFestivals / join)
function enhanceFestivalsWithVoiceEcho() {
  // non-destructive: existing joinEvent stays, we add extra card via render if host
  const tab = document.getElementById('tab-events');
  if (!tab || document.getElementById('voice-echo-fest')) return;
  const card = document.createElement('div');
  card.id = 'voice-echo-fest';
  card.className = 'event-card';
  card.innerHTML = `<div class="event-header"><strong>🎙️ Voice Echo Festival</strong><span class="date">Surprise</span></div>
    <p>Turn a spoken reflection into a story your clan can echo. Every voice adds a little dharma.</p>
    <button onclick="joinVoiceEchoFestival()" class="primary small">Echo Voice · Claim Surprise</button>`;
  tab.appendChild(card);
}

// Init the full p6 cross on load (after DOM)
setTimeout(() => {
  try { initVoiceCrossDNA(); enhanceFestivalsWithVoiceEcho(); } catch(e){}
}, 420);

// ========== p2 p6 cross complete. p1-p6 advance via DNA. ==========

