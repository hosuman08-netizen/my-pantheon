# My Pantheon Bot Decoration Setup (2026-07-10)

## 1. Profile Picture (가장 중요 - "MP" → Raji medallion)
BotFather에서:
1. `/setuserpic`
2. 업로드할 파일:
   - 추천: `art/icon-512.png` (기존, 완성도 높음)
   - 또는 새 `art/icon-bot-premium.jpg` (방금 생성한 고퀄 medallion)

→ 정사각형, 중앙 정렬된 로터스+불꽃 메달리온. Premium Raji.

## 2. Chat Background 꾸미기
사용자가 직접 설정:
- Telegram 채팅창 길게 누르기 → Set Background (또는 Settings > Chat Background)
- 업로드: `art/chat-bg-premium.jpg`
- 또는 채팅에 사진으로 보내고 "Set as Background" 선택.

배경: 어두운 Raji 스타일, 금빛 연꽃/덩굴 미묘 패턴. 말풍선 가독성 좋게 low contrast.

## 3. Bot Info 업데이트 (TAPPS-BOTFATHER-COPY.md 전체 사용 추천)
BotFather:
- `/setdescription`
  Fictional Echo clan builder. Create heroes, write positive dharma stories, grow karma. India 20-30s. All core free.

- `/setabouttext`
  Fictional stories inspired by ancient epics of dharma and karma. Build original Echoes, share UGC clan lore, join 2026 festivals. Positive only. Pure fiction — no real deities.

- `/setcommands`
  ```
  start - Open My Pantheon
  create - Build your clan
  share - Spread your story
  festival - Join clan challenges
  ```

## 4. Web App
- `/setwebapp` → https://... (배포 URL) index.html

## 5. 즉시 확인
- BotFather 설정 후 TG에서 @MyPantheonBot 열기
- 프로필 사진 + 채팅 배경 확인
- 미니앱 열어서 header icon, gold accents, Om, framing 모두 premium인지 Cmd+Shift+R 강제 새로고침

모두 Raji (Pahari miniature) 통일: saffron #c9a227, gold, terracotta, deep brown.

Fictional framing은 모든 곳에 이미 prominent.

Done. 이제 bot이 MP doodle에서 premium India epic으로 변신.
