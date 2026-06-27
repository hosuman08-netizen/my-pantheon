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
if (tg.MainButton) {
  tg.MainButton.setParams({ text: 'Share Story', is_visible: false, color: '#c9a227' });
}

function updateMainButton() {
  if (!tg || !tg.MainButton) return;
  if (currentPantheon) {
    tg.MainButton.setText('Share My Pantheon');
    tg.MainButton.onClick(() => {
      const shareText = `🔱 ${currentPantheon.name} — ${currentPantheon.desc || ''} (fictional, epics inspired)`;
      if (tg.openTelegramLink) {
        tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(shareText)}`);
      }
      addKarma(2);
    });
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

// Reusable Echo icon SVGs (detailed Raji miniature style, for full & mini)
function getEchoIcon(type, size = 34) {
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
    echoSelect: "Echo Selection (3~5)",
    guide: "Fictional heroes inspired by epic virtues. Not the gods themselves.",
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
    echoSelect: "इको चयन (3~5)",
    guide: "महाकाव्यों के सद्गुणों से प्रेरित काल्पनिक नायक। स्वयं देवता नहीं।",
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
    echoSelect: "எதிரொலி தேர்வு (3~5)",
    guide: "காவிய நற்பண்புகளால் ஊக்கமளிக்கப்பட்ட கற்பனை ஹீரோக்கள். கடவுள்களே அல்ல.",
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
    echoSelect: "ప్రతిధ్వని ఎంపిక (3~5)",
    guide: "మహాకావ్య సద్గుణాల నుండి ప్రేరణ పొందిన కల్పిత హీరోలు. దేవతలు కాదు.",
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
  const framing = document.querySelector('.framing');
  if (framing) framing.innerHTML = `<strong>${t.framing.split('. ')[0]}.</strong><br><span>${t.framing.split('. ').slice(1).join('. ')}</span>`;

  // Create tab
  const createH2 = document.querySelector('#tab-create h2');
  if (createH2) createH2.textContent = t.createTitle;
  const createSub = document.querySelector('#tab-create .section-sub');
  if (createSub) createSub.textContent = t.createSub;
  const labels = document.querySelectorAll('#tab-create label');
  labels.forEach(l => {
    if (l.textContent.includes('Pantheon Name') || l.textContent.includes('పాంథియన్ పేరు')) l.textContent = t.clanNameLabel;
    if (l.textContent.includes('Your Motto') || l.textContent.includes('మీ నినాదం')) l.textContent = t.mottoLabel;
    if (l.textContent.includes('Echo Selection')) l.textContent = t.echoSelect;
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
  const storyEx = document.querySelector('#tab-my .example');
  if (storyEx) storyEx.textContent = t.storyGuide; // simplified
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
    storyTaEl.addEventListener('input', upd);
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
  document.querySelectorAll('.bottom-nav button').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => {
    c.style.transition = 'opacity .2s';
    c.style.opacity = '0';
  });
  
  setTimeout(() => {
    document.querySelectorAll('.tab-content').forEach(c => {
      c.classList.remove('active');
      c.style.opacity = '';
    });
    
    const activeBtn = document.querySelector(`.bottom-nav button[data-tab="${tab}"]`);
    if (activeBtn) activeBtn.classList.add('active');
    
    const activeContent = document.getElementById(`tab-${tab}`);
    if (activeContent) {
      activeContent.classList.add('active');
      activeContent.style.opacity = '1';
      if (tab === 'explore') renderExplore();
      if (tab === 'my') updateMainButton();
    }
  }, 180);
}

// Load state
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

function updateHeaderStats() {
  const k = document.getElementById('header-karma');
  const p = document.getElementById('header-prestige');
  if (k) {
    const old = k.textContent;
    k.textContent = karma;
    if (old !== String(karma)) {
      // Micro detail: karma number "pops" softly on change
      k.style.transition = 'transform .2s cubic-bezier(.23,1,.32,1)';
      k.style.transform = 'scale(1.12)';
      setTimeout(() => {
        k.style.transform = 'scale(1)';
      }, 180);
    }
  }
  if (p) p.textContent = prestige;

  // Prestige progress bar (karma within current level)
  const fill = document.getElementById('prestige-fill');
  const text = document.getElementById('prestige-text');
  const prog = karma % 10;
  if (fill) {
    const progress = (prog / 10) * 100;
    // Add a tiny "wave" on update for that "detail" feel
    fill.style.transition = 'none';
    fill.style.width = (progress - 3) + '%';
    void fill.offsetWidth; // reflow
    fill.style.transition = 'width .45s cubic-bezier(.23,1,.32,1)';
    fill.style.width = progress + '%';
  }
  if (text) {
    text.textContent = `${prog}/10 to next`;
  }

  // Epic prestige titles for visual wow
  const titles = ['Ashborn', 'Flame Seeker', 'Echo Warden', 'Karma Weaver', 'Star Guardian', 'Dharma Sovereign'];
  const titleEl = document.getElementById('prestige-title');
  if (titleEl) titleEl.textContent = titles[Math.min(prestige-1, titles.length-1)] || 'Legend';
}

function showToast(message, duration = 2200) {
  if (!notifEnabled) return;
  const toast = document.getElementById('toast');
  const text = document.getElementById('toast-text');
  if (!toast || !text) return;

  text.textContent = message;
  toast.style.display = 'flex';
  // force reflow
  void toast.offsetWidth;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.style.display = 'none';
    }, 300);
  }, duration);
}

function celebrateShare() {
  const k = document.getElementById('header-karma');
  if (!k) return;
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
}

function resetAllData() {
  if (!confirm('모든 진행 상황을 초기화할까요? (되돌릴 수 없음)')) return;
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
  const oldPrestige = prestige;
  karma += points;
  const newPrest = Math.floor(karma / 10) + 1;
  if (newPrest > prestige) {
    prestige = newPrest;
    showToast(`Prestige Up! Now Level ${prestige} ✧`, 2800);
    celebratePrestige();
  }
  updateHeaderStats();
  savePantheon();
  // Refresh status card if on My tab
  const myTab = document.getElementById('tab-my');
  if (myTab && myTab.classList.contains('active')) {
    renderMyPantheon();
  }
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
const P2_BOT = '';        // p2 봇 핸들(예: 'my_pantheon_bot'). 있으면 startapp 딥링크, 없으면 web URL ?ref= 폴백.
const P2_BASE = (typeof location !== 'undefined' ? location.origin + location.pathname : '');
const P2_BACKEND = '';    // optional backend for invite credit; empty = ignored

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
  if (P2_BOT) return 'https://t.me/' + P2_BOT + '?startapp=ref' + p2uid;
  return P2_BASE + '?ref=' + encodeURIComponent(p2uid);
}

// 신규 유입(피초대자) 측 — 완전 클라 동작. 인바이터 크레딧은 백엔드 있을 때만 graceful 핑.
function captureRef() {
  let ref = '';
  try { const sp = (tg && tg.initDataUnsafe && tg.initDataUnsafe.start_param) || ''; if (sp.indexOf('ref') === 0) ref = sp.slice(3); } catch(e){}
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

// daily streak (resets if broken)
function checkStreakOnLoad() {
  const today = todayStr();
  if (streak.last && streak.last !== today && streak.last !== yesterdayStr()) { streak.count = 0; saveStreak(); }
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
  showToast((jackpot?'🎉 JACKPOT ':'') + 'Day ' + streak.count + ' devotion · +' + reward + ' Karma' + ms + ' ✧', jackpot?3400:2600);
  renderReferralStreak();
}

function renderReferralStreak() {
  const fb = document.getElementById('founder-badge');
  if (fb) fb.innerHTML = '<span class="founder-tier">🔱 Founding Member</span><span class="founder-code">Founder Code · PAN-' + founderNo + '</span>';
  const sc = document.getElementById('streak-count'); if (sc) sc.textContent = streak.count;
  const sb = document.getElementById('streak-best'); if (sb) sb.textContent = streak.best;
  const btn = document.getElementById('streak-btn');
  if (btn) { const done = streak.last === todayStr(); btn.disabled = done; btn.textContent = done ? 'Devoted ✓ — return tomorrow' : '☀ Claim Daily Karma'; btn.style.opacity = done ? '0.55' : '1'; }
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
      showToast('에코를 3개 이상 선택하세요 (서사시 영감 허구 캐릭터).');
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
    }, 1600);
  });
}

// Epic Creation Ritual - the "엄청난 변화" moment
function showCreationRitual(echoes, clanName) {
  const ritual = document.createElement('div');
  ritual.className = 'ritual-overlay';
  ritual.innerHTML = `
    <div class="ritual-content">
      <div class="ritual-glow"></div>
      <h3>✧ Awakening the Pantheon ✧</h3>
      <p class="clan-name">${clanName}</p>
      <div class="ritual-echoes">${echoes.map(e => `<span class="ritual-echo">${e}</span>`).join('')}</div>
      <p class="ritual-text">The echoes awaken... your story begins.</p>
    </div>
  `;
  document.body.appendChild(ritual);

  // Animate
  setTimeout(() => ritual.classList.add('active'), 10);

  // Remove after
  setTimeout(() => {
    ritual.classList.remove('active');
    setTimeout(() => ritual.remove(), 400);
  }, 1400);
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
    return `<div class="my-echo-visual">${iconSVG}<span>${echo}</span></div>`;
  }).join('');

  container.innerHTML = `
    <h3>${currentPantheon.name}</h3>
    <p>${currentPantheon.desc || ''}</p>
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
  
  storiesEl.innerHTML = '<h4 style="margin:18px 0 8px; font-size:15px; position:relative;">Stories <span style="position:absolute; right:0; font-size:12px; color:var(--accent); opacity:.5;">✦ your legacy</span></h4>';
  if (currentPantheon.stories.length === 0) {
    storiesEl.innerHTML += '<p class="hint">No stories yet. Add one below to start your legend.</p>';
  } else {
    currentPantheon.stories.forEach((s) => {
      storiesEl.innerHTML += `<div class="story"><p>${s}</p><div style="text-align:right; font-size:9px; color:#c9a227; margin-top:4px; opacity:.7;">fictional • epics inspired • your legacy</div></div>`;
    });
  }
  renderReferralStreak();  // 🪖 Founding 뱃지 + 스트릭 + 초대 래더
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
    
    currentPantheon.stories.push(text);
    savePantheon();
    renderMyPantheon();
    document.getElementById('story-text').value = '';
    let baseKarma = 3;
    if (currentPantheon.festivalBoost) {
      baseKarma += Math.floor(currentPantheon.festivalBoost / 4);
      showToast(`Festival boost! +${baseKarma} total`, 1500);
    }
    addKarma(baseKarma);

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
function shareToTG() {
  if (!currentPantheon) return;
  
  const framing = "\n\n고대 서사시에서 영감을 받은 허구의 이야기. 다르마(맥락 속 의무와 미덕)와 카르마(긍정적 행동의 선순환 성장)를 모티브로 한 창작 서사 • 20~30대 인도인 대상 테스트";
  const text = `My Pantheon: ${currentPantheon.name}\n${currentPantheon.desc || ''}\n\n${currentPantheon.stories.slice(-1)[0] || ''}${framing}`;
  
  if (tg && tg.openTelegramLink) {
    tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`);
  } else {
    navigator.clipboard?.writeText(text).then(() => showToast('프레이밍 포함 복사됨! TG 그룹에 공유하세요. (허구 서사)'));
  }
  sharesCount++;
  const reach = Math.floor(Math.random() * 180) + 70;
  addKarma(2);
  showToast(`Shared! Reached ${reach} friends • +2 Karma ✧`, 2600);
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
  celebrateShare();
  if (document.getElementById('tab-my').classList.contains('active')) renderMyPantheon();
}

// === Festivals ===
function joinEvent(name) {
  if (!currentPantheon) { showToast('먼저 판테온을 만드세요!'); switchTab('create'); return; }
  const rewards = { ganesh: [8,12], navratri: [12,18], diwali: [15,25] };
  const base = rewards[name] || [5,10];
  const bonus = Math.floor(Math.random() * (base[1]-base[0]+1)) + base[0];
  const scarcity = name==='diwali' ? 'Limited window — this cycle only!' : 'Scarcity active. Claim now.';
  currentPantheon.festivalBoost = (currentPantheon.festivalBoost||0) + bonus;
  addKarma(bonus);
  showToast(`✧ Festival +${bonus} Karma. ${scarcity} — MY Pantheon power grows.`, 3200);
  renderMyPantheon();
}

function playClanAnthem() {
  const txt = "Clan Anthem (arts synthesis):\nIn the harmony of many voices, we rise as one...\nWu wei • Karma carries.\n(Fictional, positive only)";
  const div = document.createElement('div');
  div.style.cssText='position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#25221d;border:1px solid #c9a227;padding:12px 16px;border-radius:12px;font-size:12px;max-width:280px;z-index:9999;';
  div.innerHTML = `<strong>🎵 Clan Anthem</strong><br><pre style="white-space:pre-wrap;margin:6px 0 0;font-size:11px;line-height:1.3">${txt}</pre><button onclick="this.parentNode.remove();addKarma(1)" style="margin-top:8px">Sing +1 Karma</button>`;
  document.body.appendChild(div);
}

function showPremiumModal() {
  const modal = document.createElement('div');
  modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:9999;';
  modal.innerHTML = `
    <div style="background:#25221d;border:1px solid #c9a227;border-radius:16px;padding:20px;max-width:300px;text-align:center;">
      <strong>Premium (TG Stars)</strong><br><br>
      <span style="font-size:12px;opacity:0.8">Featured slot, extra stories, custom frames — cosmetic only.<br>
      Core (create, stories, karma, share, festivals) is always free.<br><br>
      <strong>Fictional stories inspired by epics. Optional purchase.</strong></span><br><br>
      <button onclick="this.closest('div[style*=\"position:fixed\"]').remove(); showToast('Stars 결제는 Bot에서 처리됩니다. (데모)');" style="margin:4px;padding:8px 16px;background:#c9a227;color:#111;border:none;border-radius:8px;">Purchase with Stars (demo)</button>
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
function renderExplore() {
  const list = document.getElementById('explore-list');
  if (!list) return;
  
  const dummies = [
    { 
      name: "Winds of Duty", 
      echoes: "Echo of Rama, Echo of Hanuman", 
      stories: 7, 
      karma: 42,
      example: "몬순 폭우 속 아버지 병환에 도시 꿈 접고 가족 의무(다르마) 다하며 매일 돌봤다. 순수한 마음으로 작은 친절 이어감. 8년 뒤 작은 찻집이 마을 중심. '네가 돌아온 그 바람이 우리 가문을 살렸다' — 라마와 하누만의 메아리처럼."
    },
    { 
      name: "Bloom of Small Kindness", 
      echoes: "Echo of Krishna, Echo of Draupadi", 
      stories: 12, 
      karma: 89,
      example: "가난 속 매일 '가족과 이웃에 대한 작은 의무(다르마)를 다하자' 다짐하며 순수한 마음(의도)으로 할머니 약을 사주고 아이들 도시락 나눴다. '카르마는 선한 행동의 선순환' 믿었다. 15년 뒤, 도와준 손자가 돌아와 '할머니가 당신 이야기를 매일...' 하며 가게와 사업 기회 줌. 가난 속 뿌린 친절이, 마침내 거대한 풍요로 피어났다. — 크리슈나와 드라우파디의 메아리처럼."
    },
    { 
      name: "Shield of Warmth", 
      echoes: "Echo of Durga, Echo of Hanuman", 
      stories: 5, 
      karma: 31,
      example: "남편 잃은 후 매일 고난 속 '이웃에 대한 의무(다르마)와 순수한 친절(의도)'로 나눔. 오래전 도와준 아이 성공 후 후원. '어머니처럼...' 하며 학교 세움. 슬픔 속 베푼 마음이 모두의 빛 — 두르가와 하누만의 메아리처럼."
    }
  ];
  
  list.innerHTML = '';
  dummies.forEach(d => {
    // Mini icons for visual consistency
    const echoVals = d.echoes.split(', ').map(e => {
      if (e.includes('Krishna')) return 'Krishna-echo';
      if (e.includes('Rama')) return 'Rama-echo';
      if (e.includes('Draupadi')) return 'Draupadi-echo';
      if (e.includes('Hanuman')) return 'Hanuman-echo';
      if (e.includes('Durga')) return 'Durga-echo';
      return '';
    });
    const miniIcons = echoVals.map(v => v ? getEchoIcon(v, 16) : '').join('');
    
    list.innerHTML += `
      <div class="card">
        <div style="display:flex; align-items:center; gap:6px;">
          <div style="display:flex; gap:2px;">${miniIcons}</div>
          <strong>${d.name}</strong>
        </div>
        <div class="meta">${d.echoes} • ${d.stories} stories • ${d.karma} karma</div>
        <p class="example">"${d.example}"</p>
        <button class="small" onclick="likePantheon('${d.name}')">Like & Share</button>
        <button class="small" onclick="useAsInspiration('${d.example.replace(/'/g, "\\'")}')">Inspire My Story</button>
      </div>
    `;
  });
}

function useAsInspiration(text) {
  const ta = document.getElementById('story-text');
  if (ta) {
    ta.value = text + ' — (내 버전으로 다듬음, fictional)';
    switchTab('my');
    showToast('영감 복사됨. 수정해서 추가하세요. (허구 프레임 유지)');
  } else {
    showToast('My Pantheon 탭에서 스토리를 추가하세요.');
    switchTab('my');
  }
}

function likePantheon(name) {
  const reach = Math.floor(Math.random() * 120) + 50;
  showToast(`Shared "${name}"! Reached ${reach} • +2 Karma ✧`);
  sharesCount++;
  addKarma(2);
  celebrateShare();
  if (document.getElementById('tab-my').classList.contains('active')) {
    renderMyPantheon();
  }
}



// Festivals with stronger, more celebratory micro (still elegant)
function joinEvent(ev) {
  const messages = {
    ganesh: "Joined Ganesh challenge! +8 karma for clan story.",
    navratri: "9-day power streak started. Daily contribution +3.",
    diwali: "Diwali light retell mission accepted. +10 on complete."
  };
  
  const btns = document.querySelectorAll('#tab-events button');
  let targetBtn = null;
  
  btns.forEach(b => {
    if (b.textContent.includes('Join')) {
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
    const tab = btn.dataset.tab;
    switchTab(tab);
    document.querySelectorAll('.bottom-nav button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if (tab === 'explore') renderExplore();
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
          showToast('명상이 마음을 가라앉혔습니다 • +1 Karma', 1400);
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

// Auto start clean luxurious BGM (subtle, always on for premium feel)
setTimeout(() => {
  startBGM();
}, 1200);

// (Ducking is handled inside startOm / stopOm for clean control)

// Flashy high-quality micro for Echo selection (luxurious artifact feel)
document.querySelectorAll('.echo-card').forEach(card => {
  card.addEventListener('click', () => {
    const input = card.querySelector('input');
    if (!input) return;

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
    if (names.some(n => n.includes('크리슈나') || n.includes('Krishna')) && names.some(n => n.includes('라마') || n.includes('Rama'))) {
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
  "몬순 폭우가 쏟아지던 밤, 아버지가 쓰러지자 나는 도시로 가려던 발걸음을 돌렸다. 매일 아버지 곁에서 '가족이 내 다르마'라 다짐하며 약을 달이고 손을 잡았다. 바람이 잦아들고 별이 뜬 8년 뒤, 우리가 함께 세운 작은 찻집은 마을의 심장이 되었다. 아버지는 '네가 돌아온 그 바람이 우리 가문을 살렸다'고 말씀하신다. — 라마와 하누만의 메아리처럼.",
  "가난한 골목 끝에서 나는 매일 '오늘도 누군가를 따뜻하게 하자' 다짐했다. 할머니가 아프면 약을 사다 드리고, 배고픈 아이들에게 도시락을 나누어주었다. '바보'라는 말에도 미소로 '카르마는 먼 길을 돌아온다' 믿었다. 몬순이 지나간 마을 길, 15년 뒤 도와준 할머니의 손자가 성공해 돌아왔다. 그는 눈물 흘리며 '할머니가 당신 이야기를 매일 들려주셨어요. 이제 제 차례입니다'라며 가게를 열어주고 마을 사업을 함께 하자고 했다. 가난 속 뿌린 작은 친절이, 마침내 거대한 풍요의 연꽃으로 피어났다. — 크리슈나와 드라우파디의 메아리처럼.",
  "남편을 잃고 혼자 아이를 키우며 매일이 전쟁이었다. '이 고난이 나를 더 따뜻한 사람으로 빚을 거야'라 되뇌며 가진 것을 이웃과 아낌없이 나누었다. 동네 사람들이 힘겨울 때 내 문을 두드리곤 했다. 어느 비 오는 날, 오래전 도와준 소년이 큰 회사를 일으켜 돌아왔다. '어머니처럼 따뜻한 사람이 있다는 걸 세상에 보여주고 싶었습니다'라며 마을 학교를 세워주었다. 슬픔이 만든 방패가, 이제 모두의 빛이 되었다. — 두르가와 하누만의 메아리처럼.",
  "가난한 마을 소년은 매일 새벽 우물을 파고 돌을 날랐다. '내 손이 마을의 생명'이라 믿으며 땀을 흘렸다. 12년 뒤 마을에 처음으로 맑은 물이 솟아오르자, 아이들이 웃고 농사가 살아났다. 손자 손녀가 '할아버지가 판 우물이 우리를 살렸다'고 말할 때, 그는 '작은 약속이 이렇게 큰 강이 되는구나' 생각했다. — 하누만과 두르가의 메아리처럼.",
  "축제 디왈리 전날, 마을 여인은 혼자 등불을 만들며 이웃의 아픈 손을 잡아주고, 가난한 아이들에게 간식을 나눴다. '빛은 나누는 것'이라 속삭였다. 10년 뒤, 그녀가 도와준 아이들이 성공해 돌아와 마을 전체를 환하게 밝히는 대형 등불 행사를 열었다. '어머니가 준 작은 빛이 우리 모두의 축제가 되었습니다.' 이제 그녀의 집 앞은 매년 가장 밝은 별이 된다. — 드라우파디와 크리슈나의 메아리처럼."
];

function askDirector() {
  const theme = prompt('Pantheon Director (Kurosawa·Ray·Rajamouli·Tagore·에픽 융합): 주제를 말해주세요 (예: 마을 우물, 축제 도움, 친구 일으켜 세움, 할머니 선행)');
  const ta = document.getElementById('story-text');
  if (!ta) return;

  let chosen = DIRECTOR_VAULT[1]; // default core touching karma story
  const t = (theme || '').toLowerCase();

  if (t.includes('우물') || t.includes('water') || t.includes('마을')) chosen = DIRECTOR_VAULT[3];
  else if (t.includes('축제') || t.includes('diwali') || t.includes('빛') || t.includes('festival')) chosen = DIRECTOR_VAULT[4];
  else if (t.includes('아버지') || t.includes('가족') || t.includes('duty') || t.includes('의무')) chosen = DIRECTOR_VAULT[0];
  else if (t.includes('친구') || t.includes('friend') || t.includes('일으켜')) chosen = DIRECTOR_VAULT[2];
  else if (t.includes('할머니') || t.includes('선행') || t.includes('kind') || t.includes('가난')) chosen = DIRECTOR_VAULT[1];
  else {
    chosen = DIRECTOR_VAULT[Math.floor(Math.random() * DIRECTOR_VAULT.length)];
  }

  const prefix = '고대 서사시에서 영감을 받은 허구의 이야기. ';
  ta.value = prefix + chosen;
  ta.focus();

  setTimeout(() => {
    const hint = document.createElement('div');
    hint.style.cssText = 'font-size:11px;color:#c9a227;margin-top:4px;';
    hint.textContent = 'Director 영감 주입. 당신만의 말로 다듬어 주세요.';
    if (ta.parentNode) ta.parentNode.appendChild(hint);
    setTimeout(() => hint && hint.remove(), 2400);
  }, 90);

  addKarma(1);
}

// Init
window.onload = () => {
  loadState();
  captureRef();          // 🪖 피초대자 환영 보너스 + invitedBy 기록(1회)
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
