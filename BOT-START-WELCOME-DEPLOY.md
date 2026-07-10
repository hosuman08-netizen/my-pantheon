# My Pantheon — /start 환영 봇 배포 (텅 빈 /start → 꾸며진 환영)

문제: /start 눌러도 봇이 아무 응답 없음(백엔드 없음). 이 워커가 /start를 **이미지+브랜딩+런치버튼** 환영으로 만듦.

## 배포 3단계 (전부 네가 `!`로 — 비가역 외부행동)

### 1) 워커 배포
```
!cd ~/p2-my-pantheon && printf '%s' "봇토큰여기" | npx wrangler secret put BOT_TOKEN -c wrangler-bot.toml && npx wrangler deploy -c wrangler-bot.toml
```
→ 배포되면 워커 URL 나옴: `https://mypantheon-bot.<계정>.workers.dev`

### 2) 웹훅 연결 (봇 → 워커)
```
!curl "https://api.telegram.org/bot봇토큰여기/setWebhook?url=https://mypantheon-bot.<계정>.workers.dev"
```
→ `{"ok":true,"result":true,...}` 나오면 성공.

### 3) 확인
텔레그램에서 봇에게 /start → 🪷 이미지 + "My Pantheon / Build your Echoes..." + "✨ Open My Pantheon" 버튼 뜸.

## 워커가 처리하는 것
- `/start` → 히어로 이미지 + 브랜드 환영 + 런치버튼
- `/create` `/share` `/festival` → 각 안내 + 런치버튼
- 기타 메시지 → "🪷 Your Pantheon is waiting" + 런치버튼

## 커스터마이즈 (내가 조정 가능)
- 환영 카피: bot-worker.js `WELCOME_CAPTION`
- 히어로 이미지: `HERO_IMAGE` (GitHub Pages art/ 경로)
- 앱 URL: `WEBAPP_URL`

⚠️ 봇토큰은 BotFather에서 너만 발급. 배포/웹훅은 비가역 → 네 `!` 실행.
+ BotFather 프로필/설명 데코는 BOT-DECOR-SETUP.md 참조(프사·description·commands).
