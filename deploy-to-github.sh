#!/usr/bin/env bash
# يرفع المشروع إلى https://github.com/yaass24/DHAD على الفرع main.
# يطلب منك GitHub اسم المستخدم و Personal Access Token عند الدفع.
set -e
REPO="${1:-https://github.com/yaass24/DHAD.git}"
BRANCH="${2:-main}"

command -v git >/dev/null || { echo "git غير مثبّت. ثبّته أولًا: https://git-scm.com/downloads"; exit 1; }
[ -f package.json ] || { echo "شغّل هذا الملف من داخل مجلد المشروع (حيث يوجد package.json)."; exit 1; }

[ -d .git ] || git init -q
git remote remove origin 2>/dev/null || true
git remote add origin "$REPO"
git add -A
git commit -q -m "Add full DHAD app and fix GitHub Pages deployment" || echo "لا تغييرات جديدة للحفظ."
git branch -M "$BRANCH"
echo "جارٍ الدفع إلى $REPO ($BRANCH)…"
git push -u origin "$BRANCH" --force

cat <<'DONE'

تم الرفع.
الخطوة الأخيرة مرة واحدة: Settings → Pages → Build and deployment → Source → GitHub Actions
ثم تابع تبويب Actions، وبعد اكتماله افتح: https://yaass24.github.io/DHAD/
DONE
