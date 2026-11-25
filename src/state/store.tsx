import { createContext, useContext, useEffect, useReducer, type Dispatch, type ReactNode } from 'react';
import type { Level } from '../types';
import { configureSound } from '../utils/sound';

export type Experience = 'kids' | 'adults';
export type MotionPref = 'system' | 'reduce' | 'full';

export interface StoryProgress {
  status: 'in-progress' | 'completed';
  currentScene: number;
  runPoints: number;
  runMistakes: number;
  /** index of the scene already solved in this run (so a reload doesn't lose or double-count it) */
  solvedScene: number;
  bestStars: number;
  bestPoints: number;
  timesCompleted: number;
}

export interface ScenarioProgress {
  status: 'in-progress' | 'completed';
  currentStep: number;
  /** id of the first option chosen at each step of the current run */
  runAnswers: string[];
  runPoints: number;
  lastAnswers: string[];
  bestScore: number; // 0..100
  bestPoints: number;
  timesCompleted: number;
}

export interface LessonProgress {
  status: 'in-progress' | 'completed';
  currentStep: number;
  /** option id chosen for each question in the current run (first choice only) */
  runAnswers: string[];
  runPoints: number;
  bestScore: number; // 0..100
  timesCompleted: number;
}

export interface GameState {
  version: 1;
  experience: Experience | null;
  kidsLevel: Level | 'all';
  adultsLevel: Level | 'all';
  sound: { enabled: boolean; volume: number };
  motion: MotionPref;
  points: number;
  stories: Record<string, StoryProgress>;
  scenarios: Record<string, ScenarioProgress>;
  lessons: Record<string, LessonProgress>;
  /** writing tasks: the draft and whether every check passed */
  emails: Record<string, { text: string; done: boolean }>;
  achievements: Record<string, number>;
  last: { kind: 'story' | 'scenario' | 'lesson'; id: string } | null;
}

export const initialState: GameState = {
  version: 1,
  experience: null,
  kidsLevel: 'all',
  adultsLevel: 'all',
  sound: { enabled: true, volume: 0.6 },
  motion: 'system',
  points: 0,
  stories: {},
  scenarios: {},
  lessons: {},
  emails: {},
  achievements: {},
  last: null,
};

export type Action =
  | { type: 'setExperience'; experience: Experience }
  | { type: 'setLevel'; audience: Experience; level: Level | 'all' }
  | { type: 'setSound'; enabled?: boolean; volume?: number }
  | { type: 'setMotion'; motion: MotionPref }
  | { type: 'startStory'; id: string; restart?: boolean }
  | { type: 'solveScene'; id: string; points: number; mistakes: number }
  | { type: 'nextScene'; id: string }
  | { type: 'completeStory'; id: string }
  | { type: 'startScenario'; id: string; restart?: boolean }
  | { type: 'answerDecision'; id: string; step: number; optionId: string; points: number }
  | { type: 'nextStep'; id: string }
  | { type: 'completeScenario'; id: string; score: number }
  | { type: 'startLesson'; id: string; restart?: boolean }
  | { type: 'answerLesson'; id: string; step: number; optionId: string; points: number }
  | { type: 'nextLessonStep'; id: string }
  | { type: 'completeLesson'; id: string; score: number }
  | { type: 'saveEmail'; id: string; text: string; done: boolean }
  | { type: 'unlockAchievements'; ids: string[] }
  | { type: 'reset' };

export function starsFor(mistakes: number) {
  if (mistakes <= 1) return 3;
  if (mistakes <= 3) return 2;
  return 1;
}

const freshStory = (prev?: StoryProgress): StoryProgress => ({
  status: 'in-progress',
  currentScene: 0,
  runPoints: 0,
  runMistakes: 0,
  solvedScene: -1,
  bestStars: prev?.bestStars ?? 0,
  bestPoints: prev?.bestPoints ?? 0,
  timesCompleted: prev?.timesCompleted ?? 0,
});

const freshScenario = (prev?: ScenarioProgress): ScenarioProgress => ({
  status: 'in-progress',
  currentStep: 0,
  runAnswers: [],
  runPoints: 0,
  lastAnswers: prev?.lastAnswers ?? [],
  bestScore: prev?.bestScore ?? 0,
  bestPoints: prev?.bestPoints ?? 0,
  timesCompleted: prev?.timesCompleted ?? 0,
});

function reducer(state: GameState, a: Action): GameState {
  switch (a.type) {
    case 'setExperience':
      return { ...state, experience: a.experience };
    case 'setLevel':
      return a.audience === 'kids' ? { ...state, kidsLevel: a.level } : { ...state, adultsLevel: a.level };
    case 'setSound':
      return { ...state, sound: { enabled: a.enabled ?? state.sound.enabled, volume: a.volume ?? state.sound.volume } };
    case 'setMotion':
      return { ...state, motion: a.motion };
    case 'startStory': {
      const prev = state.stories[a.id];
      const keep = prev && prev.status === 'in-progress' && !a.restart;
      return {
        ...state,
        experience: 'kids',
        last: { kind: 'story', id: a.id },
        stories: { ...state.stories, [a.id]: keep ? prev : freshStory(prev) },
      };
    }
    case 'solveScene': {
      const p = state.stories[a.id];
      if (!p || p.status !== 'in-progress' || p.solvedScene === p.currentScene) return state;
      return {
        ...state,
        points: state.points + a.points,
        stories: {
          ...state.stories,
          [a.id]: { ...p, solvedScene: p.currentScene, runPoints: p.runPoints + a.points, runMistakes: p.runMistakes + a.mistakes },
        },
      };
    }
    case 'nextScene': {
      const p = state.stories[a.id];
      if (!p || p.solvedScene !== p.currentScene) return state;
      return { ...state, stories: { ...state.stories, [a.id]: { ...p, currentScene: p.currentScene + 1 } } };
    }
    case 'completeStory': {
      const p = state.stories[a.id];
      if (!p || p.status === 'completed') return state;
      const stars = starsFor(p.runMistakes);
      return {
        ...state,
        stories: {
          ...state.stories,
          [a.id]: {
            ...p,
            status: 'completed',
            bestStars: Math.max(p.bestStars, stars),
            bestPoints: Math.max(p.bestPoints, p.runPoints),
            timesCompleted: p.timesCompleted + 1,
          },
        },
      };
    }
    case 'startScenario': {
      const prev = state.scenarios[a.id];
      const keep = prev && prev.status === 'in-progress' && !a.restart;
      return {
        ...state,
        experience: 'adults',
        last: { kind: 'scenario', id: a.id },
        scenarios: { ...state.scenarios, [a.id]: keep ? prev : freshScenario(prev) },
      };
    }
    case 'answerDecision': {
      const p = state.scenarios[a.id];
      if (!p || p.runAnswers[a.step]) return state; // only the first choice counts
      const runAnswers = [...p.runAnswers];
      runAnswers[a.step] = a.optionId;
      return {
        ...state,
        points: state.points + a.points,
        scenarios: { ...state.scenarios, [a.id]: { ...p, runAnswers, runPoints: p.runPoints + a.points } },
      };
    }
    case 'nextStep': {
      const p = state.scenarios[a.id];
      if (!p || !p.runAnswers[p.currentStep]) return state;
      return { ...state, scenarios: { ...state.scenarios, [a.id]: { ...p, currentStep: p.currentStep + 1 } } };
    }
    case 'completeScenario': {
      const p = state.scenarios[a.id];
      if (!p || p.status === 'completed') return state;
      return {
        ...state,
        scenarios: {
          ...state.scenarios,
          [a.id]: {
            ...p,
            status: 'completed',
            lastAnswers: p.runAnswers,
            bestScore: Math.max(p.bestScore, a.score),
            bestPoints: Math.max(p.bestPoints, p.runPoints),
            timesCompleted: p.timesCompleted + 1,
          },
        },
      };
    }
    case 'startLesson': {
      const prev = state.lessons[a.id];
      const keep = prev && prev.status === 'in-progress' && !a.restart;
      const fresh: LessonProgress = { status: 'in-progress', currentStep: 0, runAnswers: [], runPoints: 0, bestScore: prev?.bestScore ?? 0, timesCompleted: prev?.timesCompleted ?? 0 };
      return { ...state, experience: 'adults', last: { kind: 'lesson', id: a.id }, lessons: { ...state.lessons, [a.id]: keep ? prev : fresh } };
    }
    case 'answerLesson': {
      const p = state.lessons[a.id];
      if (!p || p.status !== 'in-progress' || p.runAnswers[a.step]) return state;
      const runAnswers = [...p.runAnswers];
      runAnswers[a.step] = a.optionId;
      return { ...state, points: state.points + a.points, lessons: { ...state.lessons, [a.id]: { ...p, runAnswers, runPoints: p.runPoints + a.points } } };
    }
    case 'nextLessonStep': {
      const p = state.lessons[a.id];
      if (!p || !p.runAnswers[p.currentStep]) return state;
      return { ...state, lessons: { ...state.lessons, [a.id]: { ...p, currentStep: p.currentStep + 1 } } };
    }
    case 'completeLesson': {
      const p = state.lessons[a.id];
      if (!p || p.status === 'completed') return state;
      return { ...state, lessons: { ...state.lessons, [a.id]: { ...p, status: 'completed', bestScore: Math.max(p.bestScore, a.score), timesCompleted: p.timesCompleted + 1 } } };
    }
    case 'saveEmail': {
      const prev = state.emails?.[a.id];
      return { ...state, experience: 'adults', emails: { ...state.emails, [a.id]: { text: a.text, done: a.done || !!prev?.done } } };
    }
    case 'unlockAchievements': {
      const now = Date.now();
      const achievements = { ...state.achievements };
      a.ids.forEach((id) => (achievements[id] = achievements[id] ?? now));
      return { ...state, achievements };
    }
    case 'reset':
      return { ...initialState, sound: state.sound, motion: state.motion };
  }
}

const KEY = 'dhad:progress:v1';

function load(): GameState {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as Partial<GameState>;
    if (parsed.version !== 1) return initialState;
    const stories: Record<string, StoryProgress> = {};
    Object.entries(parsed.stories ?? {}).forEach(([k, v]) => (stories[k] = { ...v, solvedScene: v.solvedScene ?? -1 }));
    return { ...initialState, ...parsed, stories, lessons: parsed.lessons ?? {}, emails: parsed.emails ?? {}, sound: { ...initialState.sound, ...parsed.sound } };
  } catch {
    return initialState;
  }
}

const StateCtx = createContext<GameState>(initialState);
const DispatchCtx = createContext<Dispatch<Action>>(() => undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);

  useEffect(() => {
    configureSound(state.sound);
  }, [state.sound]);

  useEffect(() => {
    const root = document.documentElement;
    const systemReduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const reduce = state.motion === 'reduce' || (state.motion === 'system' && systemReduce);
    root.classList.toggle('reduce-motion', reduce);
  }, [state.motion]);

  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable (private mode / sandbox): progress lives in memory for this visit */
    }
  }, [state]);

  return (
    <StateCtx.Provider value={state}>
      <DispatchCtx.Provider value={dispatch}>{children}</DispatchCtx.Provider>
    </StateCtx.Provider>
  );
}

export const useGame = () => useContext(StateCtx);
export const useDispatch = () => useContext(DispatchCtx);
