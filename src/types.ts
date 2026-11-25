export type Level = 'beginner' | 'intermediate' | 'advanced';
export type Audience = 'children' | 'adults';

export type KidId = 'layan' | 'khalid' | 'noura' | 'mom' | 'dad' | 'teacher' | 'librarian' | 'seller' | 'dhaw';
export type Expression = 'happy' | 'curious' | 'surprised' | 'confused' | 'excited' | 'thinking';
export type KidBackground = 'home' | 'school' | 'classroom' | 'park' | 'parkEvening' | 'library' | 'street' | 'market';
export type PropId =
  | 'bag' | 'notebook' | 'breakfast' | 'butterfly' | 'birds' | 'swing' | 'flowers'
  | 'books' | 'card' | 'scale' | 'fruit' | 'basket' | 'bench'
  | 'chair' | 'table' | 'gift' | 'balloons' | 'garland' | 'door' | 'invites' | 'counter';

/** something a character holds in their hands */
export type HeldItem = 'list' | 'book' | 'notebook' | 'openBook' | 'bags' | 'gift' | 'balloons' | 'invites';

export interface SceneCharacter {
  id: KidId;
  expression: Expression;
  /** horizontal position in a 800-wide scene (centre of the character) */
  x: number;
  /** 1 = default size */
  scale?: number;
  /** faces left when true (default faces right) */
  flip?: boolean;
  /** ground line (default 405); smaller values place the character further back */
  y?: number;
  holding?: HeldItem;
  backpack?: boolean;
}

export interface SceneProp {
  id: PropId;
  x: number;
  y: number;
  scale?: number;
}

export interface StoryScene {
  id: string;
  background: KidBackground;
  /** narration shown above the question: sets the context */
  narration: string;
  speaker: KidId;
  /** use ____ (four underscores) for the missing word */
  dialogue: string;
  options: string[];
  correctAnswer: string;
  /** gentle hint shown after a wrong attempt */
  hint: string;
  /** short reviewed explanation shown after the right answer */
  explanation: string;
  /** what happens next in the story, shown once the scene is solved */
  reaction: string;
  characters: SceneCharacter[];
  /** expressions to switch to after the right answer */
  reactionExpressions?: Partial<Record<KidId, Expression>>;
  props?: SceneProp[];
  /** props shown once the scene is solved (replaces `props`) */
  reactionProps?: SceneProp[];
  /** what characters hold once the scene is solved */
  reactionHolding?: Partial<Record<KidId, HeldItem>>;
  points: number;
}

export interface Story {
  id: string;
  title: string;
  audience: 'children';
  level: Level;
  summary: string;
  vocabulary: string[];
  coverBackground: KidBackground;
  coverCharacters: SceneCharacter[];
  coverProps?: SceneProp[];
  accent: string;
  ending: string;
  scenes: StoryScene[];
}

/* ---------------- adults ---------------- */

export type AdultId = 'fahad' | 'muna' | 'sara' | 'abdullah' | 'reem';
export type AdultMood = 'neutral' | 'smile' | 'concerned' | 'upset' | 'pleased' | 'thinking';
export type AdultBackdrop = 'interview' | 'office' | 'meeting' | 'service' | 'boardroom';
/** The language topic a decision drills. */
export type Skill = 'plural' | 'cases' | 'parsing' | 'numbers' | 'diptote' | 'hamza' | 'rhetoric' | 'diction';

export type CriterionVerdict = 'good' | 'weak' | 'issue';
export interface OptionCriteria {
  /** إعراب الكلمات وعلاماته */
  grammar: CriterionVerdict;
  /** بنية الكلمة وصياغتها */
  morphology: CriterionVerdict;
  /** رسم الهمزة والألف والتاء */
  spelling: CriterionVerdict;
  /** دقة اللفظ في موضعه */
  diction: CriterionVerdict;
  /** وضوح الأسلوب وجودته */
  style: CriterionVerdict;
}

export interface DecisionOption {
  id: string;
  text: string;
  /** best = the preferred answer; acceptable = valid but weaker; unsuitable = not fitting */
  rating: 'best' | 'acceptable' | 'unsuitable';
  criteria: OptionCriteria;
  explanation: string;
}

/** A typed blank: the learner writes the correctly inflected word. */
export interface Blank {
  /** the sentence with ____ where the word goes */
  sentence: string;
  /** every spelling counted as correct (compared after stripping diacritics) */
  accept: string[];
  /** shown on request, before answering */
  hint: string;
  /** the rule, shown once the answer is in */
  rule: string;
  /** targeted notes for predictable wrong forms */
  misses?: { answer: string; note: string }[];
}

export interface Decision {
  id: string;
  speaker: AdultId;
  mood: AdultMood;
  /** what the other person says */
  line: string;
  /** context card: what the situation needs */
  context: string;
  prompt: string;
  skill: Skill;
  /** typed blank (preferred) */
  blank?: Blank;
  /** older multiple-choice form, kept for scenarios that still use it */
  options?: DecisionOption[];
  /** how the other person responds after the player gives the preferred answer */
  followUp: string;
  followUpMood: AdultMood;
  points: number;
}

export interface EmailCheck {
  id: string;
  label: string;
  /** every pattern must appear (any of them) for the check to pass */
  any: string[];
  /** if any of these appear, the check fails with `note` */
  avoid?: string[];
  note: string;
}

export interface EmailTask {
  id: string;
  title: string;
  level: Level;
  brief: string;
  /** who the message goes to, and what it must achieve */
  situation: string;
  checks: EmailCheck[];
  model: string;
  notes: string[];
}

export interface Scenario {
  id: string;
  title: string;
  audience: 'adults';
  level: Level;
  summary: string;
  focus: string;
  playerRole: string;
  backdrop: AdultBackdrop;
  cast: AdultId[];
  intro: string;
  outro: string;
  decisions: Decision[];
}

/* ---------- Rhetoric lessons (adults) ---------- */
export interface RhetoricConcept {
  term: string;
  definition: string;
  example: string;
  source?: string;
  note: string;
}
export interface RhetoricQuestion {
  id: string;
  prompt: string;
  quote?: string;
  source?: string;
  options: { id: string; text: string }[];
  correct: string;
  explanation: string;
}
export type LessonTrack = 'rhetoric' | 'grammar';

export interface RhetoricLesson {
  id: string;
  title: string;
  subtitle: string;
  track: LessonTrack;
  level: Level;
  icon: 'sparkle' | 'repeat' | 'target' | 'medal' | 'layers' | 'check' | 'book';
  summary: string;
  /** How the topic shows up in workplace writing. */
  atWork: string;
  concepts: RhetoricConcept[];
  questions: RhetoricQuestion[];
}
