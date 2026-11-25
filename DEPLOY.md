# رفع ضاد إلى GitHub Pages

الموقع المطلوب: <https://yaass24.github.io/DHAD/>
المستودع: <https://github.com/yaass24/DHAD> (الفرع `main`)

المستودع فيه حاليًا ملفان فقط: `README.md` و`.github/workflows/deploy.yml`.
ملف الـ workflow الموجود عندك سليم ويكفي، فإن رفعت بقية الملفات فقط سيعمل البناء.

---

## الطريقة الأولى: من المتصفح (الأسهل)

1. فُكّ ضغط `DHAD-github-pages.zip`.
2. افتح <https://github.com/yaass24/DHAD> ثم **Add file → Upload files**.
3. اسحب **كل الملفات والمجلدات ما عدا مجلد `.github`**:
   `src`, `public`, `index.html`, `package.json`, `tsconfig.json`, `vite.config.ts`, `README.md`, `DEPLOY.md`, `.gitignore`
   (المتصفح لا يرفع المجلدات التي تبدأ بنقطة، ولا حاجة إليه لأن الـ workflow موجود عندك.)
4. اكتب في خانة الوصف: `Add full DHAD app` ثم **Commit changes**.
5. مرة واحدة فقط: **Settings → Pages → Build and deployment → Source → GitHub Actions**.
6. تابع التنفيذ في تبويب **Actions**. عند اكتمال الخطوتين (build ثم deploy) افتح الرابط.

## الطريقة الثانية: من الطرفية (أمر واحد)

```bash
unzip DHAD-github-pages.zip -d DHAD-ready
cd DHAD-ready
bash deploy-to-github.sh
```

أو يدويًا:

```bash
git init
git remote add origin https://github.com/yaass24/DHAD.git
git checkout -b main
git add -A
git commit -m "Add full DHAD app and fix GitHub Pages deployment"
git push -u origin main --force
```

`--force` هنا آمن لأن المستودع لا يحتوي إلا على README وملف workflow.

---

## بعد الرفع

- أول بناء يأخذ دقيقة إلى ثلاث دقائق.
- إن ظهر خطأ في تبويب Actions، افتح الخطوة الحمراء وانسخ آخر عشرة أسطر.
- إن فتحت الصفحة وظهرت بيضاء، جرّب تحديثًا قسريًا (Ctrl+Shift+R) لأن متصفحك قد يكون حافظًا لنسخة 404 القديمة.

## إن غيّرت اسم المستودع

بدّل `/DHAD/` في `vite.config.ts` وفي `public/404.html` إلى الاسم الجديد.
للنشر على نطاق خاص أو صفحة مستخدم: `DHAD_BASE=/ npm run build`.
