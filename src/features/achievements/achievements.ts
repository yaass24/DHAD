import { SCENARIOS, STORIES } from '../../data';
import { LESSONS } from '../../data/lessons';
import { EMAILS } from '../../data/emails';
import type { GameState } from '../../state/store';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: 'star' | 'book' | 'sparkle' | 'trophy' | 'chat' | 'medal' | 'repeat' | 'target';
  audience: 'kids' | 'adults' | 'all';
  check: (s: GameState) => boolean;
}

const storiesDone = (s: GameState) => STORIES.filter((x) => (s.stories[x.id]?.timesCompleted ?? 0) > 0).length;
const lessonsDone = (s: GameState) => LESSONS.filter((x) => (s.lessons?.[x.id]?.timesCompleted ?? 0) > 0).length;
const scenariosDone = (s: GameState) => SCENARIOS.filter((x) => (s.scenarios[x.id]?.timesCompleted ?? 0) > 0).length;

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-story', title: 'الحكاية الأولى', description: 'أكمل أول حكاية في حكايات ضاد.', icon: 'book', audience: 'kids', check: (s) => storiesDone(s) >= 1 },
  { id: 'three-stars', title: 'ثلاث نجوم', description: 'احصل على ثلاث نجوم في حكاية واحدة.', icon: 'star', audience: 'kids', check: (s) => Object.values(s.stories).some((p) => p.bestStars >= 3) },
  { id: 'three-stories', title: 'قارئ نشيط', description: 'أكمل ثلاث حكايات مختلفة.', icon: 'sparkle', audience: 'kids', check: (s) => storiesDone(s) >= 3 },
  { id: 'all-stories', title: 'صديق الحكايات', description: 'أكمل جميع حكايات ضاد.', icon: 'trophy', audience: 'kids', check: (s) => storiesDone(s) === STORIES.length },
  { id: 'first-scenario', title: 'التدريب الأول', description: 'أكمل أول تدريب نحوي.', icon: 'chat', audience: 'adults', check: (s) => scenariosDone(s) >= 1 },
  { id: 'perfect-scenario', title: 'ضابط الإعراب', description: 'أنهِ تدريبًا بنسبة 100% من أول محاولة في كل قرار.', icon: 'target', audience: 'adults', check: (s) => Object.values(s.scenarios).some((p) => p.bestScore >= 100) },
  { id: 'all-scenarios', title: 'محترف التدريبات', description: 'أكمل جميع التدريبات النحوية.', icon: 'medal', audience: 'adults', check: (s) => scenariosDone(s) === SCENARIOS.length },
  { id: 'first-lesson', title: 'أول درس بلاغة', description: 'أكمل أول درس في دروس البلاغة.', icon: 'sparkle', audience: 'adults', check: (s) => lessonsDone(s) >= 1 },
  { id: 'all-lessons', title: 'بليغ ضاد', description: 'أكمل جميع دروس البلاغة.', icon: 'trophy', audience: 'adults', check: (s) => lessonsDone(s) === LESSONS.length },
  { id: 'first-email', title: 'كاتب رسائل', description: 'اكتب رسالة تجتاز كل عناصر التدقيق.', icon: 'book', audience: 'adults', check: (s) => EMAILS.some((e) => s.emails?.[e.id]?.done) },
  { id: 'points-200', title: 'جامع النقاط', description: 'اجمع 200 نقطة.', icon: 'sparkle', audience: 'all', check: (s) => s.points >= 200 },
  { id: 'replay', title: 'المثابر', description: 'أعد حكاية أو تدريبًا أو درسًا أكملته من قبل.', icon: 'repeat', audience: 'all', check: (s) => [...Object.values(s.stories), ...Object.values(s.scenarios), ...Object.values(s.lessons ?? {})].some((p) => p.timesCompleted >= 2) },
];

export function newlyUnlocked(state: GameState): string[] {
  return ACHIEVEMENTS.filter((a) => !state.achievements[a.id] && a.check(state)).map((a) => a.id);
}
