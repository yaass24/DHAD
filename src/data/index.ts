import type { Level, Scenario, SceneCharacter, SceneProp, Skill, Story, StoryScene } from '../types';
import { layanMorning } from './stories/layan-morning';
import { parkDay } from './stories/park-day';
import { libraryVisit } from './stories/library-visit';
import { friendSurprise } from './stories/friend-surprise';
import { marketTrip } from './stories/market-trip';
import { firstDay } from './scenarios/first-day';
import { jobInterview } from './scenarios/job-interview';
import { customerService } from './scenarios/customer-service';
import { negotiation } from './scenarios/negotiation';
import type { GameState } from '../state/store';

/** To add a story or scenario: create a data file and append it here. The engine does the rest. */
export const STORIES: Story[] = [layanMorning, parkDay, libraryVisit, friendSurprise, marketTrip];
export const SCENARIOS: Scenario[] = [firstDay, jobInterview, customerService, negotiation];

export const getStory = (id: string) => STORIES.find((s) => s.id === id);
export const getScenario = (id: string) => SCENARIOS.find((s) => s.id === id);

export const LEVEL_LABEL: Record<Level, string> = {
  beginner: 'مبتدئ',
  intermediate: 'متوسط',
  advanced: 'متقدّم',
};

export const KIDS_LEVEL_HINT: Record<Level, string> = {
  beginner: 'كلمات يومية بسيطة وأسماء مألوفة',
  intermediate: 'جمل أطول وفهم للسياق',
  advanced: 'مفردات أدقّ وفهم حوارات قصيرة',
};

export const ADULTS_LEVEL_HINT: Record<Level, string> = {
  beginner: 'تعبيرات رسمية شائعة',
  intermediate: 'محادثات مهنية ومفرداتها',
  advanced: 'مصطلحات دقيقة واختيارات سياقية دقيقة',
};

export const SKILL_LABEL: Record<Skill, string> = {
  formality: 'الرسمية',
  tone: 'النبرة',
  precision: 'الدقة',
  clarity: 'الوضوح',
  courtesy: 'اللباقة',
  persuasion: 'الإقناع',
};

export const CRITERIA_LABEL = {
  grammar: 'القواعد',
  meaning: 'المعنى',
  tone: 'النبرة',
  formality: 'الرسمية',
  context: 'السياق',
} as const;

export const SCENARIO_POINTS = { best: 20, acceptable: 8, unsuitable: 0 } as const;

/**
 * Unlocking: the first item of each level is always open;
 * the next item of the same level opens once the previous one is completed.
 */
function lockedWithin<T extends { id: string; level: Level }>(list: T[], id: string, done: (id: string) => boolean): T | null {
  const item = list.find((x) => x.id === id);
  if (!item) return null;
  const sameLevel = list.filter((x) => x.level === item.level);
  const idx = sameLevel.findIndex((x) => x.id === id);
  if (idx <= 0) return null;
  const prev = sameLevel[idx - 1];
  return done(prev.id) ? null : prev;
}

export function storyLockedBy(state: GameState, id: string): Story | null {
  return lockedWithin(STORIES, id, (sid) => (state.stories[sid]?.timesCompleted ?? 0) > 0);
}

export function scenarioLockedBy(state: GameState, id: string): Scenario | null {
  return lockedWithin(SCENARIOS, id, (sid) => (state.scenarios[sid]?.timesCompleted ?? 0) > 0);
}

/** Stable shuffle so answer order is varied but the same on every visit. */
export function stableShuffle<T>(items: T[], seedText: string): T[] {
  let seed = 0;
  for (const ch of seedText) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    seed = (seed * 1103515245 + 12345) >>> 0;
    const j = seed % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function scenarioScore(sc: Scenario, answers: string[]) {
  let points = 0;
  const max = sc.decisions.reduce((s, d) => s + d.points, 0);
  sc.decisions.forEach((d, i) => {
    const opt = d.options.find((o) => o.id === answers[i]);
    if (opt) points += SCENARIO_POINTS[opt.rating];
  });
  return { points, max, percent: max ? Math.round((points / max) * 100) : 0 };
}

/** The picture of a scene: before the answer, or after it (reaction expressions, held items and props). */
export function sceneState(scene: StoryScene, solved: boolean): { characters: SceneCharacter[]; props: SceneProp[] } {
  if (!solved) return { characters: scene.characters, props: scene.props ?? [] };
  return {
    characters: scene.characters.map((c) => ({
      ...c,
      expression: scene.reactionExpressions?.[c.id] ?? c.expression,
      holding: scene.reactionHolding?.[c.id] ?? c.holding,
    })),
    props: scene.reactionProps ?? scene.props ?? [],
  };
}
