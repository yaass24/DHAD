import { useEffect, type ReactElement } from 'react';
import { RouterProvider, matchRoute, usePath } from './utils/router';
import { GameProvider } from './state/store';
import { ArtDefs } from './art/ArtDefs';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BottomTabBar } from './components/BottomTabBar';
import { AchievementToaster } from './components/AchievementToaster';
import { Home } from './pages/Home';
import { Start } from './pages/Start';
import { KidsWorld } from './pages/KidsWorld';
import { AdultsWorld } from './pages/AdultsWorld';
import { HowToPlay } from './pages/HowToPlay';
import { About } from './pages/About';
import { StoryLibrary } from './pages/StoryLibrary';
import { StoryDetails } from './pages/StoryDetails';
import { StoryPlay } from './pages/StoryPlay';
import { StoryComplete } from './pages/StoryComplete';
import { Rewards } from './pages/Rewards';
import { ScenarioLibrary } from './pages/ScenarioLibrary';
import { ScenarioDetails } from './pages/ScenarioDetails';
import { ScenarioPlay } from './pages/ScenarioPlay';
import { ScenarioResults } from './pages/ScenarioResults';
import { MyProgress } from './pages/MyProgress';
import { Settings } from './pages/Settings';
import { LessonLibrary } from './pages/LessonLibrary';
import { LessonPlay } from './pages/LessonPlay';
import { LessonComplete } from './pages/LessonComplete';
import { EmailLibrary, WriteEmail } from './pages/WriteEmail';
import { NotFound } from './pages/NotFound';

type Route = { path: string; render: (p: Record<string, string>) => ReactElement; title: string; immersive?: boolean };

const ROUTES: Route[] = [
  { path: '/', render: () => <Home />, title: 'الرئيسية' },
  { path: '/start', render: () => <Start />, title: 'اختر تجربتك' },
  { path: '/kids', render: () => <KidsWorld />, title: 'حكايات ضاد' },
  { path: '/kids/library', render: () => <StoryLibrary />, title: 'مكتبة الحكايات' },
  { path: '/kids/story/:id', render: (p) => <StoryDetails id={p.id} />, title: 'تفاصيل الحكاية' },
  { path: '/kids/play/:id', render: (p) => <StoryPlay id={p.id} />, title: 'الحكاية', immersive: true },
  { path: '/kids/complete/:id', render: (p) => <StoryComplete id={p.id} />, title: 'اكتملت الحكاية' },
  { path: '/achievements', render: () => <Rewards />, title: 'الإنجازات' },
  { path: '/kids/rewards', render: () => <Rewards />, title: 'الإنجازات' },
  { path: '/adults', render: () => <AdultsWorld />, title: 'ضاد للكبار' },
  { path: '/adults/library', render: () => <ScenarioLibrary />, title: 'مكتبة المواقف' },
  { path: '/adults/scenario/:id', render: (p) => <ScenarioDetails id={p.id} />, title: 'تفاصيل التدريب' },
  { path: '/adults/play/:id', render: (p) => <ScenarioPlay id={p.id} />, title: 'التدريب', immersive: true },
  { path: '/adults/results/:id', render: (p) => <ScenarioResults id={p.id} />, title: 'نتيجة التدريب' },
  { path: '/adults/write', render: () => <EmailLibrary />, title: 'اكتب رسالة' },
  { path: '/adults/write/:id', render: (p) => <WriteEmail id={p.id} />, title: 'كتابة رسالة' },
  { path: '/adults/rhetoric', render: () => <LessonLibrary />, title: 'دروس البلاغة' },
  { path: '/adults/lesson/:id', render: (p) => <LessonPlay id={p.id} />, title: 'درس بلاغة', immersive: true },
  { path: '/adults/lesson-done/:id', render: (p) => <LessonComplete id={p.id} />, title: 'نتيجة الدرس' },
  { path: '/adults/progress', render: () => <MyProgress />, title: 'تقدّمي' },
  { path: '/how', render: () => <HowToPlay />, title: 'كيف نلعب؟' },
  { path: '/about', render: () => <About />, title: 'عن ضاد' },
  { path: '/progress', render: () => <MyProgress />, title: 'تقدّمي' },
  { path: '/settings', render: () => <Settings />, title: 'الإعدادات' },
];

function Shell() {
  const path = usePath();
  let match: { route: Route; params: Record<string, string> } | null = null;
  for (const r of ROUTES) {
    const params = matchRoute(r.path, path);
    if (params) {
      match = { route: r, params };
      break;
    }
  }
  const immersive = !!match?.route.immersive;

  const title = match ? match.route.title : 'صفحة غير موجودة';
  useEffect(() => {
    window.scrollTo({ top: 0 });
    document.title = title + ' | ضاد DHAD';
    document.body.dataset.world = path.startsWith('/kids') ? 'kids' : path.startsWith('/adults') ? 'adults' : 'main';
    document.body.dataset.immersive = immersive ? '1' : '0';
    document.body.dataset.page = path === '/' ? 'home' : 'page';
  }, [path, title, immersive]);

  return (
    <>
      <a href="#main" className="skip-link" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }}>
        تخطَّ إلى المحتوى
      </a>
      {!immersive && <Navbar />}
      {immersive ? (
        <div key={path} className="page-anim">{match!.route.render(match!.params)}</div>
      ) : (
        <main id="main" tabIndex={-1} key={path} className="page-anim">
          {match ? match.route.render(match.params) : <NotFound />}
        </main>
      )}
      {!immersive && <Footer />}
      {!immersive && <BottomTabBar />}
      <AchievementToaster />
    </>
  );
}

export default function App() {
  return (
    <GameProvider>
      <RouterProvider>
        <ArtDefs />
        <Shell />
      </RouterProvider>
    </GameProvider>
  );
}
