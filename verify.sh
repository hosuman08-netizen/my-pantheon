#!/bin/bash
# p2 My Pantheon 배포게이트 — 신택스 + 런타임크래시 + 계측계약. p1 게이트 이식(2026-07-16 Morpheus).
# 통과(exit 0)해야 배포. 🔴면 배포 중단.
cd "$(dirname "$0")" || exit 1
FAIL=0

echo "── 1) 문법 체크"
for f in script.js bot-worker.js; do
  [ -f "$f" ] || continue
  if node --check "$f" 2>/dev/null; then echo "  ✅ $f"; else echo "  🔴 $f 신택스 에러"; FAIL=1; fi
done

echo "── 2) 런타임 크래시 게이트(부팅+핵심화면)"
if node test/runtime-check.js >/tmp/p2-rt.log 2>&1; then
  echo "  ✅ 런타임 클린"
else
  echo "  🔴 런타임 크래시:"; tail -6 /tmp/p2-rt.log | sed 's/^/    /'; FAIL=1
fi

echo "── 3) 계측 계약(emit ⊆ analytics-worker ALLOWED)"
WORKER="$HOME/daedalus-conquest/analytics-worker.js"
if [ -f "$WORKER" ]; then
  ALLOWED=$(grep -A30 "const ALLOWED" "$WORKER" | grep -oE "\"[a-z_]+\"" | tr -d '"')
  MISS=""
  for e in $(grep -oE "emit\('[A-Za-z0-9_]+'" script.js | sed "s/emit('//;s/'//" | sort -u); do
    echo "$ALLOWED" | grep -qx "$e" || MISS="$MISS $e"
  done
  if [ -z "$MISS" ]; then echo "  ✅ 계측 계약 OK — 모든 emit이 워커 허용"; else echo "  🔴 워커가 폐기할 이벤트:$MISS (analytics-worker ALLOWED에 추가 필요)"; FAIL=1; fi
else
  echo "  ⚠️ 워커 파일 못찾음 — 계약검사 스킵"
fi

echo "──────────────"
if [ "$FAIL" -eq 0 ]; then echo "🟢 검증 통과 — 배포 OK"; exit 0; else echo "🔴 검증 실패 — 배포 중단"; exit 1; fi
