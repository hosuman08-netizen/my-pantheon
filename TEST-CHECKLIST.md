# p2 My Pantheon - TG Real Client Test (5분 풀 테스트)

**목적**: 실제 Telegram 클라이언트에서 전체 플로우 검증 (iOS/Android 둘 다 추천)

## 사전 준비 (1-2분)
1. 폴더 전체 HTTPS 호스팅 (필수)
   - 추천 빠른 방법: Vercel (무료)
     ```
     cd p2-my-pantheon
     npx vercel --prod
     ```
     (또는 GitHub + Cloudflare Pages)
   - URL 예: https://my-pantheon-xxx.vercel.app/index.html
2. BotFather에서 Web App 설정
   - /setwebapp → 해당 URL
   - /setuserpic → art/icon-512.png
   - 설명에 "Fictional stories inspired by ancient epics of dharma and karma." 포함

## 테스트 플로우 (순서대로, 5분 내)
1. **접속 & 초기화**
   - TG에서 봇 열기 또는 WebApp 링크 클릭
   - 앱이 열리면 Om meditation bar + framing 확인
   - 언어 변경 (Settings) 테스트 (en/hi/ta/te)

2. **Create Pantheon**
   - Clan name 입력 (예: "Winds of Duty")
   - Motto 입력
   - Echo 3개 이상 선택 (Krishna, Rama, Draupadi 등)
   - Submit → Ritual 애니메이션 + My 탭 자동 이동
   - Karma +5, Prestige 시작 확인

3. **My Pantheon + Story UGC**
   - Pantheon 이름, Echo icons, MY fusion 텍스트 보이는지
   - "Add Story / Retell" 에 긍정적 dharma 스토리 작성 (120자+)
   - "Ask Director for inspiration" 클릭 → 프롬프트 예시 삽입 확인
   - Add → Stories 리스트에 추가 + Karma 증가
   - Status grid (Echoes, Stories, Shares, Prestige) 업데이트 확인

4. **Share**
   - "Share to Telegram" 또는 MainButton (TG에서) 클릭
   - TG 공유 창 열림 + framing 문구 포함 확인
   - Karma + 증가

5. **Festivals (FOMO 테스트)**
   - Events 탭 열기
   - Ganesh / Navratri / Diwali 카드 확인
   - "Join Clan Challenge" 클릭 → variable Karma (8~25) + scarcity 메시지
   - Festival boost 표시되는지

6. **Explore & Inspire**
   - Explore 탭 → 다른 Pantheon 카드 보이는지
   - "Inspire My Story" 클릭 → My 탭으로 이동 + 텍스트 복사
   - "Like & Share" 클릭 → toast + Karma

7. **Streak & Invite (Referral)**
   - Daily Devotion "Claim Daily Karma" 클릭
   - Invite link 공유
   - ref count / ladder 업데이트

8. **Settings**
   - Language 변경 후 UI 텍스트 반영
   - Privacy / Terms 모달 열기 (영어, fictional 강조)
   - Reset All Progress (주의)

## 통과 기준 (P0)
- 크래시 없이 전체 플로우 완료
- Fictional framing 모든 화면에 보임 (헤더 + 스토리)
- Karma/Prestige 즉시 반영 + 애니메이션
- TG share 정상 동작 (framing 포함)
- Multi-lang (특히 Hindi) 작동
- 로컬 데이터 유지 (새로고침 후)

## 실패 시
- 스크린샷 찍고 이 파일에 메모
- script.js / index.html 수정 후 재호스팅

**테스트 완료 후**: Sovereign에게 결과 보고 → GO/NO-GO 결정

Fictional only. Positive loops. Legion one.