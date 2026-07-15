# 🚀 My Pantheon — BotFather 런칭 원스톱 (전부 준비됨)

> **@BotFather** 열고 아래 순서대로. 복사(copy) + 이미지 드래그만 하면 끝. 봇: **@MyPantheonEchoBot**
> 웹앱 라이브: `https://hosuman08-netizen.github.io/my-pantheon/` ✅ (200 확인됨)

---

## ① 봇 프로필 사진 — `/setuserpic`
1. `/setuserpic` 입력 → @MyPantheonEchoBot 선택
2. 이 이미지 드래그 업로드 (1024×1024, 준비됨):
   ```
   ~/p2-my-pantheon/art/icon-bot-premium.jpg
   ```

## ② 소개(About) — `/setabouttext`  *(프로필/공유 노출, 120자)*
`/setabouttext` → 봇 선택 → 붙여넣기:
```
Craft your legend of dharma & karma. Collect fictional heroes, grow your Pantheon, share your story. ✧
```

## ③ 설명(Description) — `/setdescription`  *(시작화면 노출, 512자)*
`/setdescription` → 봇 선택 → 붙여넣기:
```
✧ My Pantheon — your story of dharma & karma.

Create your OWN fictional heroes inspired by the virtues of ancient epics — duty, courage, kindness. Grow their echoes, collect a living Pantheon, and share your legend with friends.

• Positive, empowering stories only
• Fictional — not real gods or deities
• Free to play · optional cosmetics

Tap below to begin your first hero. 🪔
```

## ④ 미니앱 등록 — `/newapp`  *(첫유저 문 — 가장 중요)*
`/newapp` → 봇 선택 → 순서대로 입력:
| 항목 | 값 (복사/입력) |
|---|---|
| **Title** | `My Pantheon` |
| **Short description** | ③의 설명 텍스트 그대로 |
| **Photo (640×360)** | `~/p2-my-pantheon/art/promo-640x360.png` (준비됨) 드래그 |
| **GIF (선택)** | 건너뛰기(`/empty` 또는 스킵) |
| **Web App URL** | `https://hosuman08-netizen.github.io/my-pantheon/` |
| **Short name** | `play` |
→ 완료되면 딥링크: **`t.me/MyPantheonEchoBot/play`**

## ⑤ 메뉴 버튼 — `/setmenubutton`
`/setmenubutton` → 봇 선택 → URL: `https://hosuman08-netizen.github.io/my-pantheon/` → 버튼명: `✨ Open` (또는 `Play`)

## ⑥ (선택) 명령어 — `/setcommands`
`/setcommands` → 봇 선택 → 붙여넣기:
```
start - Begin your Pantheon ✧
```

---

## 🇮🇳 힌디 대안 (인도 특화하려면 ②③ 대신 사용)
**About(HI):** `धर्म-कर्म की अपनी गाथा रचें। काल्पनिक नायक इकट्ठा करें, अपना Pantheon बढ़ाएँ, कहानी साझा करें। ✧`

**Description(HI):**
```
✧ My Pantheon — धर्म और कर्म की आपकी कहानी।

महाकाव्यों के सद्गुणों — कर्तव्य, साहस, दया — से प्रेरित अपने काल्पनिक नायक बनाएँ। उनकी गूँज बढ़ाएँ, जीवंत Pantheon इकट्ठा करें, दोस्तों संग गाथा साझा करें।

• केवल सकारात्मक, प्रेरक कहानियाँ
• काल्पनिक — वास्तविक देवी-देवता नहीं
• मुफ़्त · वैकल्पिक कॉस्मेटिक

पहला नायक बनाने हेतु नीचे टैप करें। 🪔
```
> 추천: **영어 primary** (앱이 유저 언어로 자동 현지화 + 글로벌 도달). 힌디는 선택.

---

## ✅ 런칭 상태 (Morpheus 확인 2026-07-16)
- 웹앱 라이브 200 · 게이트 GREEN · 인도 결제공개문 · 결제(p2_featured 60★) 라이브 검증됨
- 브랜딩: favicon·PWA·og:image·클린 title 배포됨
- **남은 것: 위 ①~⑤ (네 GUI 2분) → 첫유저 문 열림**
- 문 열면 시딩 시작 (귀속 태그 `startapp=c-...` 자동 작동)

## ⚠️ 실드 (그대로 유지 — 법 회피 핵심)
"fictional / not real gods / positive only" 문구 = 종교민감성·인도규제 회피. 소개문에서 이 부분 지우지 말 것.
