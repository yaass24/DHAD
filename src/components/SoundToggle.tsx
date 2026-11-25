import { useDispatch, useGame } from '../state/store';
import { playSound } from '../utils/sound';
import { Icon } from './Icon';

export function SoundToggle({ compact = false }: { compact?: boolean }) {
  const { sound } = useGame();
  const dispatch = useDispatch();
  const on = sound.enabled;
  return (
    <button
      type="button"
      className={'icon-btn sound-toggle' + (on ? '' : ' is-off')}
      aria-pressed={on}
      aria-label={on ? 'كتم الأصوات' : 'تشغيل الأصوات'}
      title={on ? 'الأصوات تعمل' : 'الأصوات مكتومة'}
      onClick={() => {
        dispatch({ type: 'setSound', enabled: !on });
        if (!on) setTimeout(() => playSound('click'), 30);
      }}
    >
      <Icon name={on ? 'volume' : 'mute'} />
      {!compact && <span className="sr-only-sm">{on ? 'الصوت' : 'صامت'}</span>}
    </button>
  );
}
