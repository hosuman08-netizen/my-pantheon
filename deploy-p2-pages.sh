#!/bin/bash
# p2 My Pantheon — GitHub Pages 배포 (neo가 터미널에서 직접 실행)
# repo 생성 + push + Pages 활성화. 비공개 tApps 등재는 별도(소프트테스트 후 승인).
set -euo pipefail
cd ~/p2-my-pantheon

REPO="my-pantheon"
USER="imhogyun"

echo "▶ [1/3] GitHub repo 생성 + 푸시 ($USER/$REPO)"
if gh repo view "$USER/$REPO" >/dev/null 2>&1; then
  echo "  (repo 이미 존재 — 푸시만)"
  git remote get-url origin >/dev/null 2>&1 || git remote add origin "https://github.com/$USER/$REPO.git"
  git push -u origin HEAD:main
else
  gh repo create "$REPO" --public --source=. --remote=origin --push
fi

echo "▶ [2/3] GitHub Pages 활성화 (main / root)"
gh api -X POST "repos/$USER/$REPO/pages" -f "source[branch]=main" -f "source[path]=/" 2>/dev/null \
  || gh api -X PUT "repos/$USER/$REPO/pages" -f "source[branch]=main" -f "source[path]=/" 2>/dev/null \
  || echo "  (Pages 이미 설정됨이거나 곧 활성화)"

echo "▶ [3/3] 완료 — 빌드에 1~2분 걸림"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ p2 URL:  https://$USER.github.io/$REPO/"
echo "   (1~2분 후 열림. 텔레그램 미니앱 등록은 이 URL로 BotFather 설정)"
echo "   다음: DEPLOY.md 2번(BotFather) → 소프트테스트 → neo 승인 후 tApps 등재"
