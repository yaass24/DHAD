<div align="center">

<img src="public/dhad-logo.png" alt="شعار ضاد" width="140" />

# ضاد | DHAD

**عِش الحكاية، واختر كلماتك.**

لعبة تعليمية عربية (فصحى، RTL) تُقوّي اللغة في بيئة العمل: نحوٌ وبلاغة وكتابة رسائل.

[![الموقع](https://img.shields.io/badge/%D8%AC%D8%B1%D9%91%D8%A8%D9%87%D8%A7-yaass24.github.io%2FDHAD-07533E)](https://yaass24.github.io/DHAD/)
![React](https://img.shields.io/badge/React-19-0877B8)
![TypeScript](https://img.shields.io/badge/TypeScript-5-245742)
![Vite](https://img.shields.io/badge/Vite-7-F5AF22)
![No AI](https://img.shields.io/badge/%D8%A8%D9%84%D8%A7%20%D8%B0%D9%83%D8%A7%D8%A1%20%D8%A7%D8%B5%D8%B7%D9%86%D8%A7%D8%B9%D9%8A-C63C32)

</div>

## لماذا ضاد؟

العربية الفصحى في مكان العمل تتآكل: تقارير تُكتب بالعامية، ومراسلات فيها «أرجوا» و«خمس أيام» و«إنشاء الله»،
ومصطلحات تقنية تُنقل كما هي. وضاد مشروع يعالج هذا من جهتين:

- **تعزيز العربية داخل الشركات:** تدريبات على جمل حقيقية من التقارير والمراسلات، لا تمارين مدرسية مجرّدة.
- **تحسين بيئة العمل:** كتابة رسائل مهنية صحيحة (طلب إجازة، متابعة، اعتذار عن تأخير) تُختصر بها دورات المراجعة
  وسوء الفهم بين الفرق.

وهو مشروع في **نظم المعلومات الحاسوبية (Computer Information Systems)**: يجمع بين تحليل حاجة واقعية في المنشآت،
وتصميم تجربة استخدام، وهندسة واجهة أمامية تعمل بلا خادم ولا حسابات، ونشر آليّ عبر GitHub Actions.

## التجربتان

- **حكايات ضاد** (للصغار): قصص مصوّرة تُكمل فيها حوار الشخصيات بالكلمة المناسبة، مع نجوم وشارات.
- **ضاد للكبار**: ثلاثة مسارات —
  - **تدريبات نحوية:** تكتب الكلمة الناقصة بصيغتها الصحيحة (المثنى وجمع المذكر السالم، النصب والجر، العدد
    والتمييز والهمزة، إعراب الجملة والممنوع من الصرف)، ولكل خطأ متوقَّع شرحه الإعرابي.
  - **دروس البلاغة:** السجع والجناس، والطباق والمقابلة، والتشبيه والاستعارة، والكناية — بشواهد من القرآن الكريم
    والحديث الشريف والشعر العربي، مع موضع كل أسلوب في الكتابة المهنية.
  - **اكتب رسالة:** تكتب الرسالة بنفسك، ثم تُفحص بقائمة تدقيق محدّدة مسبقًا (عناصر مطلوبة وأخطاء شائعة)،
    ويُعرض نموذج للمقارنة.

> **بلا ذكاء اصطناعي:** كل سؤال وكل شرح وكل عنصر تدقيق مكتوب مسبقًا في ملفات المحتوى ومراجَع. لا نموذج لغوي،
> ولا خادم، ولا حسابات، ولا تتبّع. ويُحفظ تقدّمك في `localStorage` على جهازك وحده.

---

An interactive Arabic (MSA) learning game with two experiences:

- **حكايات ضاد** (children): illustrated, comic-style stories. Complete each character's line with the right word, get gentle hints, collect stars and badges.
- **ضاد للكبار** (teens & adults): three tracks — typed grammar drills on sentences from reports and letters, rhetoric lessons with sourced classical examples and their place in professional writing, and a writing track where the learner composes a real message that a predefined checklist then reviews.

No AI, no backend, no accounts. All answers and explanations come from reviewed content files. Progress is saved in `localStorage`.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npm run preview    # serve the production build
npm run typecheck  # optional TypeScript check
```

Requires Node 18+. The build uses `base: '/DHAD/'` (override with `DHAD_BASE`) and hash routing (`#/kids/...`), so `dist/` can be served from any static host or sub-folder (GitHub Pages, Netlify, S3, a plain folder) with no rewrite rules.

## What's inside

| Area | Content |
| --- | --- |
| Children's stories | 5 stories, 25 interactive scenes (beginner ×2, intermediate ×2, advanced ×1) |
| Grammar drills | 4 drills, 20 typed blanks with targeted feedback for predictable wrong forms |
| Rhetoric lessons | 4 lessons, 24 questions, 8 concept cards with sourced examples, each with its place in workplace writing |
| Writing tasks | 3 messages (leave request, follow-up, apology) with 19 predefined checks and model answers |
| Pages | Home, Choose experience, Kids world, Story library, Story details, Story player, Story completion, Rewards, Adults world, Scenario library, Scenario details, Conversation player, Results, Learning progress, Rhetoric lessons library, Lesson player, Lesson result, How to play, About, My progress, Settings, 404 |
| Gamification | points, stars, progress bars, story badges, 11 achievements, unlockable stories/scenarios, replay, resume from the saved scene |
| Sound | Original Web Audio effects (correct, try-again, transition, click, completion, achievement), mute + volume, saved locally, never autoplayed |
| Accessibility | `lang="ar"` + RTL, semantic landmarks, skip link, keyboard play (keys 1–4 to answer, ← for next), visible focus, live-region feedback, icons + text (never colour alone), reduced-motion setting, 44px+ touch targets |

## Deploy to GitHub Pages

The site is published by GitHub Actions from `.github/workflows/deploy.yml`:
it installs dependencies, runs `npm run build`, and uploads `dist/`.

One-time setup in the repository: **Settings → Pages → Build and deployment → Source = GitHub Actions**.
Then every push to `main` redeploys. The live URL is <https://yaass24.github.io/DHAD/>.

### Base path

`vite.config.ts` builds with `base: '/DHAD/'`, which is what a project page under
`yaass24.github.io/DHAD/` needs. Override it for any other host:

```bash
DHAD_BASE=/ npm run build      # a user/organisation page or a custom domain
DHAD_BASE=./ npm run build     # any subfolder, or opening dist/index.html from disk
```

If you rename the repository, change `/DHAD/` in `vite.config.ts` and in `public/404.html`.

### Routing

The app uses hash routes (`/DHAD/#/kids/play/layan-morning`), so refreshing or
sharing a deep link works on a static host with no rewrite rules. `public/404.html`
additionally catches path-style links such as `/DHAD/kids` and forwards them to the
matching hash route.

### Assets

Fonts, the emblem and every icon are imported from `src/`, so Vite fingerprints them
and rewrites their URLs with the base path. Files in `public/` (favicon, PWA icons,
manifest, service worker) are referenced relatively, so they resolve correctly from
any base. `public/.nojekyll` keeps GitHub from running Jekyll over the output.

## Project structure

```text
src/
  assets/           DHAD emblem + Thmanyah Serif Text fonts
  art/              original SVG art: storybook cast (6 expressions each), ضوء mascot,
                    story backgrounds & props, adult portraits & office backdrops, logo
  components/       Navbar, Footer, ExperienceCard, StoryCard, ScenarioCard, DialogueBubble,
                    AnswerOption, FeedbackMessage, ScoreCounter/Stars, ProgressBar, SoundToggle,
                    LevelSelector, AchievementCard, AchievementToaster, Modal, Sparkles/Confetti, Icon
  features/
    children/       StoryPlayer — the reusable story engine
    adults/         ConversationPlayer — the reusable conversation engine
    achievements/   achievement rules
  data/
    stories/        one file per story
    scenarios/      one file per scenario
    index.ts        registry, levels, unlocking, scoring
  pages/            one component per route
  state/store.tsx   game state + localStorage persistence
  utils/            hash router, sound synthesis
  styles/global.css design system (palette from the DHAD Figma identity)
```

## Adding content

1. Copy a file in `src/data/stories/` (or `scenarios/`), keep the same shape (`src/types.ts` documents every field).
2. Add it to `STORIES` (or `SCENARIOS`) in `src/data/index.ts`.

That's all: the library, details page, player, completion screen, progress and achievements pick it up automatically. Scenes are composed from:

- **backgrounds:** `home`, `school`, `classroom`, `park`, `parkEvening`, `library`, `street`, `market`
- **characters:** `layan`, `khalid`, `noura`, `mom`, `dad`, `teacher`, `librarian`, `seller`, each with an expression (`happy`, `curious`, `surprised`, `confused`, `excited`, `thinking`) and optionally `holding` (`list`, `book`, `notebook`, `openBook`, `bags`, `gift`, `balloons`, `invites`), `backpack`, `scale` and `y` (to place someone further back)
- **props:** `bag`, `notebook`, `breakfast`, `butterfly`, `birds`, `swing`, `flowers`, `books`, `card`, `scale`, `fruit`, `basket`, `bench`, `chair`, `table`, `gift`, `balloons`, `garland`, `door`, `invites`, `counter`
- **after the right answer:** `reactionExpressions`, `reactionHolding` and `reactionProps` change the picture to match the `reaction` text.

The speech bubble positions itself over the speaker automatically.

**Rule of thumb:** everything the narration says is visible must be in the picture, and nothing in the picture should give the answer away.

Write the missing word as `____` (four underscores) in `dialogue`. For scenarios, give each option a `rating` (`best` / `acceptable` / `unsuitable`), the five `criteria`, and an explanation. Rate on context, and don't label a valid sentence as a grammar error.

## Technical notes

- **Dependencies:** only `react` and `react-dom` at runtime. Routing (a ~60-line hash router), icons (a small inline SVG set) and animations (CSS) are built in. This keeps the bundle small and avoids extra packages; React Router, Lucide or Motion can be swapped in later without touching game logic.
- **Styling:** a hand-written design system in `global.css` (CSS variables, no Tailwind build step).
- **Font:** Thmanyah Serif Text (Regular, Medium, Bold, Black), bundled locally in `src/assets/fonts/` as WOFF subsets (Arabic + basic Latin), so the app works offline with no external font requests.
- **Scoring:** children get 10 / 5 / 2 points for a scene solved on the first, second or a later try. Stars are based on extra attempts: 3 stars for ≤1, 2 stars for ≤3, otherwise 1. In scenarios only the first choice counts: 20 points for the best option, 8 for an acceptable one, 0 for an unsuitable one.
- **Unlocking:** the first item of each level is always open, and each next item at that level opens when the previous one is completed.
