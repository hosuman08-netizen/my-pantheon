# p2 My Pantheon — Metrics Plan (D7 / K-factor / UGC / ARPU) 2026-06-27

**North Star (shared with p1)**: D7 Engaged-Payer Rate + K-Factor
- D7 Engaged-Payer: % of users who are active (story/share/festival) on D7 AND have made at least 1 Stars purchase.
- K-Factor: (new users invited via share/referral) / existing users. Target >0.3 for virality.

## Core Metrics (Oracle Dashboard per pN)

### 1. Retention & Engagement (D7 focus)
- D1 / D3 / D7 / D30 Retention (any session)
- D7 Engaged User: Created story OR joined festival OR shared
- Avg sessions per user (D7)
- Prestige growth curve (median karma at D7)
- Story creation rate (stories / active user)

### 2. Virality (K-factor)
- Shares sent (TG share button + invite)
- Referral installs / shares
- Clan invite acceptance rate
- UGC virality: % stories that get shared outside app
- K-factor by cohort (week 1 vs week 2)

### 3. UGC Volume (core loop health)
- Total stories created (cumulative + daily)
- Avg stories per Pantheon
- Story length & quality proxy (word count, repeat visits)
- Festival participation rate (% users who joined at least 1 challenge)
- Echo creation diversity (unique Echo combos)

### 4. Monetization (ARPU / LTV)
- TG Stars conversion rate (payers / active)
- ARPU (revenue / monthly active)
- ARPPU (revenue / paying user)
- LTV estimate (based on prestige spend velocity)
- Premium feature uptake (extra slots, featured clans)
- Festival pack conversion during events

### 5. Quality & Compliance Signals
- Fictional framing visibility (A/B or survey)
- Negative feedback rate (crashes, complaints)
- UGC policy violations (rare, positive only)
- Age / India geo distribution (if trackable)

## Data Collection (MVP - local + simple backend later)
- Client events (match script.js): createPantheon, addStory, joinEvent (festival), sharePantheon, prestigeUp, premiumView, claimDaily, likePantheon
- Use TG WebApp initData for user tracking + startapp param for referrals (e.g. ?start=ref123)
- Send to simple Oracle worker or log (later integrate daedalus-oracle-metrics)
- TG Stars events via Bot API
- Manual early cohort tracking (first 500 users)

## Targets (first 2 weeks soft launch)
- D7 Retention >25%
- D7 Engaged-Payer >5%
- K-factor >0.25
- Avg 1.5+ stories per active user by D7
- ARPU >0.3 USD in first month (Stars)

## Handoff to Oracle (CDO)
**File created**: p2-my-pantheon/METRICS-PLAN.md
**Request to Oracle**:
- Build simple dashboard for p2 (D7, K, UGC vol, ARPU)
- Extend daedalus-oracle-metrics skill for story/UGC/festival events
- Weekly ranking vs p1 and future pNs
- Predict porting potential (D7 + K > threshold)

**Next**: Morpheus implements event logging in app. Niobe uses for seeding optimization. Sovereign reviews weekly.

p2 data = fuel for p50 portfolio. Legion one.