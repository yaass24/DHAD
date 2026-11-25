import type { AdultId, KidId } from '../types';

export const KID_NAMES: Record<KidId, string> = {
  layan: 'ليان',
  khalid: 'خالد',
  noura: 'نورة',
  mom: 'الأم',
  dad: 'الأب',
  teacher: 'المعلمة',
  librarian: 'أمين المكتبة',
  seller: 'البائع',
  dhaw: 'ضوء',
};

export const CAST: { id: Exclude<KidId, 'dhaw'>; name: string; trait: string }[] = [
  { id: 'layan', name: 'ليان', trait: 'فضولية وودودة، تحب أن تسأل عن كل شيء.' },
  { id: 'khalid', name: 'خالد', trait: 'نشيط ويحب المساعدة، ولا يهدأ أبدًا.' },
  { id: 'noura', name: 'نورة', trait: 'هادئة ومبدعة، تحب القصص والرسم.' },
];

export const ADULT_IDS: AdultId[] = ['muna', 'sara', 'fahad', 'abdullah', 'reem'];
