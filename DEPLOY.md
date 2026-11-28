# النشر والصيانة

- الموقع: <https://yaass24.github.io/DHAD/>
- المستودع: <https://github.com/yaass24/DHAD> (الفرع `main`)

## كيف يُنشر الموقع

النشر آليّ. كل push إلى `main` يشغّل workflow في `.github/workflows/deploy.yml`:
يثبّت الاعتماديات، ينفّذ `npm run build`، ثم يرفع مجلد `dist/` إلى GitHub Pages.

```bash
git add -A
git commit -m "وصف التغيير"
git push
```

ثم تُتابَع الحالة في تبويب **Actions**. البناء والنشر يأخذان دقيقة إلى ثلاث دقائق.

إعداد يُضبط مرة واحدة فقط (وهو مضبوط بالفعل):
**Settings → Pages → Build and deployment → Source = GitHub Actions**.

## قبل الدفع

```bash
npm run typecheck
npm run build
npm run preview
```

## إن ظهر خطأ

- **فشل في تبويب Actions:** افتح الخطوة الحمراء واقرأ آخر أسطرها؛ الخطأ غالبًا في `npm run build`، ويظهر محليًّا بالأمر نفسه.
- **صفحة بيضاء بعد النشر:** حدّث تحديثًا قسريًّا (Ctrl+Shift+R)؛ قد يكون المتصفح حافظًا لنسخة قديمة.
- **روابط أو صور مكسورة:** تحقّق من `base` في `vite.config.ts`؛ يجب أن يطابق اسم المستودع.

## إن غُيّر اسم المستودع أو المضيف

بدّل `/DHAD/` في `vite.config.ts` وفي `public/404.html`. وللنشر على نطاق خاص أو صفحة مستخدم:

```bash
DHAD_BASE=/ npm run build
```

## الإعلانات

`src/config/ads.ts` فارغ، فلا يُحمَّل أي كود إعلانات ما دام `client` خاليًا. ولتفعيل AdSense: ضع معرّف الناشر ومعرّفات الوحدات في الملف، وانسخ `public/ads.txt.example` إلى `public/ads.txt` بعد وضع المعرّف فيه. وراجِع حينها سطر «غير تجاري» في صفحة «عن ضاد».
