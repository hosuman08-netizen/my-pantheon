# p2 My Pantheon — Deploy & TG Bot Setup (quick)

1. Host (for real TG test - HTTPS 필수)
   - 가장 빠름: Vercel (no git needed)
     cd p2-my-pantheon
     npx vercel --prod
     → 나오는 https://...vercel.app/index.html 복사
     (vercel.json 이미 있음 - SPA 라우팅 처리)
   - 대안: GitHub → Cloudflare Pages (무료, instant)
   - 로컬 테스트용: python3 -m http.server 8000 (but TG에서는 HTTPS 필요)

2. BotFather
   - /newbot → @YourPantheonBot
   - /setuserpic : use p2-my-pantheon/art/icon-512.png
   - /setwebapp : set the full https://.../index.html as Web App
   - Menu Button: Web App
   - /setdescription + /setabouttext with "Fictional stories inspired by the epics of dharma & karma. Positive UGC for 20-30s. All core free."
   - /setcommands: start, create, share

3. Framing test
   - Open in TG → verify header + all screens show "Fictional stories inspired by ancient epics..."

4. Stars (later)
   - Use @BotFather to enable Stars or via Bot API createInvoiceLink for premium.

5. Launch
   - See TAPPS-SUBMIT-READY.md
   - GO-NOGO-LAUNCH.md

Reversible until public listing. Sovereign y/n before submit.

Legion one.