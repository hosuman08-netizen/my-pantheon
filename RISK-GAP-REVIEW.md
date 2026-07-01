# p2 My Pantheon — High-Level Risk / Gap Review (Law · UX · Viral) 2026-06-27

**Overall**: Strong foundation. MVP solid for soft launch. Main risks are launch timing, India-specific UX, and early data.

## Legal / Compliance Risks (미꾸라지)
**Strengths**:
- Strong fictional framing everywhere (header, every screen, copy)
- Positive only, no dark patterns, no rates
- Reversible (localStorage)
- Privacy/Terms modal (English, local-only, fictional)

**Gaps / Risks**:
- India regs: No direct gambling but cultural sensitivity high. Need local legal review before heavy marketing.
- TG + global: COPPA / age gate missing. Add in settings tab: <div>Age 18+ • Fictional only</div> + simple consent on first create.
- Store later: App Store/Play will require more disclosure + age rating.
- UGC moderation: No backend filter yet. Risk of off-topic or negative content early. Add "Report" button next to each story.

**Priority**: Medium. Fix age gate + add "report story" button before public tApps.

## UX / Product Gaps
**Strengths**:
- Beautiful Raji visuals, Om meditation, Director inspiration
- Full loops: create → story → share → prestige → festival
- Multi-lang base (en + Indian)

**Gaps**:
- No onboarding tutorial / first story example flow (high drop risk). Add in create tab: 3-step guide with example story.
- TG WebApp limits: No push notifications, limited persistence across devices
- Mobile perf: Large script.js + inline SVGs — test on low-end Indian phones
- Share UX: Auto-framing good but no "share to specific group" deep link. Use tg.openTelegramLink with chat_id if possible.
- Prestige feel: "Light samsara carry" not visually strong enough yet. Add visual bar "Carried to next life: X%"

**Priority**: High for soft launch. Add 30-sec FTUE + simple tutorial.

## Viral / Growth Risks (K-factor)
**Strengths**:
- Built-in TG share with framing
- Referral ladder + streak (endowment + loss aversion)
- Festival FOMO (real calendar)
- UGC as content engine

**Gaps**:
- No seeded initial clans/stories (empty app on first open = death). Pre-load 50 example Pantheons in code (static array in script.js on load if no local data).
- K-factor depends on early users actually sharing outside app
- No cross-promo with p1 yet
- India TG groups may have fatigue if over-seeded

**Priority**: Critical. Seed 50-100 example Pantheons + stories before soft launch.

## Other Risks
- Technical: Pure static = easy host but limited analytics/Stars deep integration
- Timing: Festival alignment (Diwali Nov) good for p2 but need to launch before peak
- Portfolio: p2 must prove UGC works before p3~ fork

## Improvement Priority (next 7 days before test)
1. Add simple FTUE + pre-load 50 example Pantheons in script.js (static data)
2. Seed example stories via static array or dispatch
3. Age gate in settings + "Report" button per story
4. Visual prestige carry bar + "share to group" deep link
5. Mobile perf test + low-end device check

**Sovereign decision needed**: Soft launch with current or add FTUE first?

p2 template proven in structure. Polish + seed = launch ready. Data will decide p50 path. 

Legion one.