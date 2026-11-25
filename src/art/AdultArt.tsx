import type { AdultBackdrop, AdultId, AdultMood } from '../types';
import { Grain } from './ArtDefs';

/** Mature, flat visual-novel style for مواقف ضاد: muted palette, thin lines, soft shading. */
const LINE = '#1E2B27';

interface AdultLook {
  name: string;
  role: string;
  skin: string;
  shade: string;
  head: 'hijab' | 'ghutra' | 'hair';
  wrap: string;
  outfit: string;
  inner: string;
  glasses?: boolean;
  beard?: boolean;
  hair?: string;
}

export const ADULTS: Record<AdultId, AdultLook> = {
  fahad: { name: 'أ. فهد', role: 'مدير الموارد البشرية', skin: '#C68E64', shade: '#A9714C', head: 'ghutra', wrap: '#F4F1EA', outfit: '#F4F1EA', inner: '#E4DFD3', beard: true, hair: '#1E1510' },
  muna: { name: 'أ. منى', role: 'مديرة الفريق', skin: '#E2AE87', shade: '#C48F6A', head: 'hijab', wrap: '#245742', outfit: '#2E3A45', inner: '#E9E2D0' },
  sara: { name: 'سارة', role: 'زميلة في خدمة العملاء', skin: '#D9A27A', shade: '#BC8560', head: 'hijab', wrap: '#B9846B', outfit: '#4E7FA0', inner: '#F1E9DA' },
  abdullah: { name: 'عبدالله', role: 'عميل', skin: '#B7825E', shade: '#9A6847', head: 'hair', wrap: '#2A1D16', outfit: '#8FA7B5', inner: '#7D95A3', beard: true, hair: '#2A1D16' },
  reem: { name: 'م. ريم', role: 'مديرة المشتريات في الشركة العميلة', skin: '#E0A983', shade: '#C38C67', head: 'hijab', wrap: '#3B3F5C', outfit: '#C9B79C', inner: '#F4EFE6', glasses: true },
};

function AdultFace({ mood, look }: { mood: AdultMood; look: AdultLook }) {
  const cy = -232;
  const ey = cy - 4;
  const ex = 21;
  const by = ey - 17;
  const brow = (x: number, inner: number, outer: number) => {
    const s = Math.sign(x);
    return <path key={x} d={`M ${x - s * 11} ${by + inner} Q ${x} ${by - 4} ${x + s * 11} ${by + outer}`} fill="none" stroke={look.hair ?? '#2A1D16'} strokeWidth={3.4} strokeLinecap="round" />;
  };
  const openEye = (x: number, dx = 0, squint = false) => (
    <g key={x}>
      <path d={`M ${x - 10} ${ey} Q ${x} ${ey - (squint ? 5 : 9)} ${x + 10} ${ey} Q ${x} ${ey + (squint ? 3 : 6)} ${x - 10} ${ey} Z`} fill="#FBF7EF" />
      <circle cx={x + dx} cy={ey - 1} r={4.6} fill="#2B1E17" />
      <circle cx={x + dx + 1.5} cy={ey - 2.6} r={1.3} fill="#fff" />
      <path d={`M ${x - 11} ${ey} Q ${x} ${ey - (squint ? 6 : 10)} ${x + 11} ${ey}`} fill="none" stroke={LINE} strokeWidth={2.2} strokeLinecap="round" />
    </g>
  );
  const closedEye = (x: number) => <path key={x} d={`M ${x - 10} ${ey} Q ${x} ${ey - 7} ${x + 10} ${ey}`} fill="none" stroke={LINE} strokeWidth={2.6} strokeLinecap="round" />;
  const my = cy + 30;

  let eyes, brows, mouth;
  switch (mood) {
    case 'smile':
      eyes = [openEye(-ex, 0, true), openEye(ex, 0, true)];
      brows = [brow(-ex, 1, 2), brow(ex, 1, 2)];
      mouth = <path d={`M -14 ${my - 2} Q 0 ${my + 9} 14 ${my - 2}`} fill="none" stroke="#8C4A3E" strokeWidth={3} strokeLinecap="round" />;
      break;
    case 'pleased':
      eyes = [closedEye(-ex), closedEye(ex)];
      brows = [brow(-ex, 0, 2), brow(ex, 0, 2)];
      mouth = <path d={`M -15 ${my - 3} Q 0 ${my + 12} 15 ${my - 3} Q 0 ${my + 3} -15 ${my - 3} Z`} fill="#8C4A3E" />;
      break;
    case 'concerned':
      eyes = [openEye(-ex), openEye(ex)];
      brows = [brow(-ex, -5, 3), brow(ex, -5, 3)];
      mouth = <path d={`M -11 ${my + 3} Q 0 ${my - 4} 11 ${my + 3}`} fill="none" stroke="#8C4A3E" strokeWidth={3} strokeLinecap="round" />;
      break;
    case 'upset':
      eyes = [openEye(-ex, 0, true), openEye(ex, 0, true)];
      brows = [brow(-ex, 7, -3), brow(ex, 7, -3)];
      mouth = <path d={`M -13 ${my + 4} Q 0 ${my - 6} 13 ${my + 4}`} fill="none" stroke="#8C4A3E" strokeWidth={3.4} strokeLinecap="round" />;
      break;
    case 'thinking':
      eyes = [openEye(-ex, -3), openEye(ex, -3)];
      brows = [brow(-ex, 2, 0), brow(ex, -2, -6)];
      mouth = <path d={`M -10 ${my} L 8 ${my - 2}`} fill="none" stroke="#8C4A3E" strokeWidth={3} strokeLinecap="round" />;
      break;
    default:
      eyes = [openEye(-ex), openEye(ex)];
      brows = [brow(-ex, 0, 1), brow(ex, 0, 1)];
      mouth = <path d={`M -11 ${my} Q 0 ${my + 3} 11 ${my}`} fill="none" stroke="#8C4A3E" strokeWidth={3} strokeLinecap="round" />;
  }
  return (
    <g>
      {brows}
      {eyes}
      <path d={`M 2 ${cy + 2} Q 8 ${cy + 14} 0 ${cy + 16}`} fill="none" stroke={look.shade} strokeWidth={2.6} strokeLinecap="round" />
      {look.beard && (
        <path d={`M -50 ${cy - 6} Q -48 ${cy + 56} 0 ${cy + 62} Q 48 ${cy + 56} 50 ${cy - 6} Q 40 ${cy + 26} 22 ${cy + 26} Q 0 ${cy + 20} -22 ${cy + 26} Q -40 ${cy + 26} -50 ${cy - 6} Z`} fill={look.hair} opacity={0.9} />
      )}
      {look.beard && <path d={`M -16 ${my - 8} Q 0 ${my - 14} 16 ${my - 8} Q 0 ${my - 10} -16 ${my - 8} Z`} fill={look.hair} />}
      {mouth}
      {look.glasses && (
        <g fill="none" stroke={LINE} strokeWidth={2.4}>
          <rect x={-ex - 15} y={ey - 12} width={30} height={22} rx={8} />
          <rect x={ex - 15} y={ey - 12} width={30} height={22} rx={8} />
          <path d={`M ${-ex + 15} ${ey - 2} Q 0 ${ey - 7} ${ex - 15} ${ey - 2}`} />
        </g>
      )}
    </g>
  );
}

export function AdultPortrait({ id, mood, x, y, scale = 1, flip = false }: { id: AdultId; mood: AdultMood; x: number; y: number; scale?: number; flip?: boolean }) {
  const L = ADULTS[id];
  const cy = -232;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`} className="adult-portrait">
      {/* back of head covering */}
      {L.head === 'hijab' && <path d={`M -74 ${cy + 8} C -84 ${cy - 100} 84 ${cy - 100} 74 ${cy + 8} C 74 ${cy + 70} 110 -150 120 -120 L -120 -120 C -110 -150 -74 ${cy + 70} -74 ${cy + 8} Z`} fill={L.wrap} />}
      {L.head === 'ghutra' && <path d={`M -70 ${cy - 20} C -80 ${cy - 104} 80 ${cy - 104} 70 ${cy - 20} L 96 -130 L 40 -150 L -40 -150 L -96 -130 Z`} fill={L.wrap} stroke="#D8D2C4" strokeWidth={2} />}
      {/* shoulders */}
      <path d="M -170 0 Q -168 -118 -70 -138 L 70 -138 Q 168 -118 170 0 Z" fill={L.outfit} />
      <path d="M -40 -140 L 0 -70 L 40 -140 Z" fill={L.inner} />
      {L.head !== 'ghutra' && (
        <>
          <path d="M -70 -138 L -26 -60 L -46 -138 Z M 70 -138 L 26 -60 L 46 -138 Z" fill="#000" opacity={0.12} />
          <path d="M -112 -40 L -112 0" stroke="#000" strokeOpacity={0.12} strokeWidth={4} />
        </>
      )}
      {L.head === 'ghutra' && <path d="M 0 -136 L 0 -40" stroke="#CFC8B8" strokeWidth={3} />}
      {/* neck */}
      <path d={`M -22 ${cy + 50} L -24 -130 Q 0 -118 24 -130 L 22 ${cy + 50} Z`} fill={L.shade} />
      {/* head */}
      {L.head === 'hair' && (
        <g fill={L.skin}>
          <ellipse cx={-56} cy={cy + 4} rx={9} ry={14} />
          <ellipse cx={56} cy={cy + 4} rx={9} ry={14} />
        </g>
      )}
      <ellipse cx={0} cy={cy} rx={L.head === 'hair' ? 56 : 50} ry={L.head === 'hair' ? 66 : 60} fill={L.skin} />
      <path d={`M 30 ${cy - 50} Q 56 ${cy} 34 ${cy + 52} Q 54 ${cy + 4} 30 ${cy - 50} Z`} fill={L.shade} opacity={0.35} />
      {L.head === 'hair' && (
        <path d={`M -58 ${cy - 4} C -66 ${cy - 92} 66 ${cy - 92} 58 ${cy - 4} Q 54 ${cy - 44} 30 ${cy - 52} Q -10 ${cy - 40} -40 ${cy - 50} Q -56 ${cy - 40} -58 ${cy - 4} Z`} fill={L.hair} />
      )}
      {L.head === 'hijab' && <path d={`M -52 ${cy - 10} Q -48 ${cy - 72} 0 ${cy - 72} Q 48 ${cy - 72} 52 ${cy - 10} Q 40 ${cy - 54} 0 ${cy - 56} Q -40 ${cy - 54} -52 ${cy - 10} Z`} fill={L.wrap} />}
      {L.head === 'hijab' && <path d={`M -52 ${cy + 20} Q -58 ${cy + 70} -20 ${cy + 92} L -60 ${cy + 96} Z M 52 ${cy + 20} Q 58 ${cy + 70} 20 ${cy + 92} L 60 ${cy + 96} Z`} fill={L.wrap} />}
      {L.head === 'ghutra' && (
        <g>
          <path d={`M -54 ${cy} Q -52 ${cy - 76} 0 ${cy - 78} Q 52 ${cy - 76} 54 ${cy} Q 44 ${cy - 52} 0 ${cy - 56} Q -44 ${cy - 52} -54 ${cy} Z`} fill={L.wrap} stroke="#D8D2C4" strokeWidth={2} />
          <ellipse cx={0} cy={cy - 62} rx={52} ry={11} fill="none" stroke="#1B1B1B" strokeWidth={7} />
        </g>
      )}
      <AdultFace mood={mood} look={L} />
    </g>
  );
}

/* ---------------- backdrops (1000 x 560) ---------------- */

function CityWindow({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const bars = [0.1, 0.22, 0.36, 0.5, 0.63, 0.78, 0.9];
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="url(#skyCity)" />
      {bars.map((b, i) => {
        const bh = h * (0.25 + ((i * 37) % 50) / 100);
        return <rect key={i} x={x + w * b - 22} y={y + h - bh} width={44} height={bh} fill="#8FA5AC" opacity={0.7} />;
      })}
      <rect x={x + w * 0.44} y={y + h * 0.18} width={26} height={h * 0.82} fill="#7D939A" />
      <path d={`M ${x + w * 0.44 + 13} ${y + h * 0.05} L ${x + w * 0.44 + 13} ${y + h * 0.18}`} stroke="#7D939A" strokeWidth={4} />
      {[1, 2, 3].map((i) => (
        <path key={i} d={`M ${x + (w * i) / 4} ${y} L ${x + (w * i) / 4} ${y + h}`} stroke="#E9E2D0" strokeWidth={8} />
      ))}
      <rect x={x} y={y} width={w} height={h} fill="none" stroke="#E9E2D0" strokeWidth={10} />
    </g>
  );
}

function Plant({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M -26 0 L -20 -50 L 20 -50 L 26 0 Z" fill="#B9846B" />
      {[-40, -15, 10, 35].map((a, i) => (
        <ellipse key={i} cx={0} cy={-90} rx={12} ry={42} fill={i % 2 ? '#4F7D62' : '#3D6B52'} transform={`rotate(${a} 0 -50)`} />
      ))}
    </g>
  );
}

function Backdrop({ kind }: { kind: AdultBackdrop }) {
  switch (kind) {
    case 'interview':
      return (
        <g>
          <rect width={1000} height={560} fill="#E9E2D0" />
          <rect y={420} width={1000} height={140} fill="#B9A98C" />
          <CityWindow x={560} y={60} w={380} h={280} />
          <rect x={80} y={70} width={160} height={110} fill="#1F3B33" />
          <rect x={96} y={86} width={128} height={78} fill="#C9B79C" />
          <path d="M 110 150 L 150 110 L 180 135 L 210 100" fill="none" stroke="#245742" strokeWidth={5} />
          <Plant x={480} y={420} />
          <rect x={0} y={440} width={1000} height={36} fill="#5B4636" />
          <rect x={0} y={476} width={1000} height={84} fill="#4A392C" />
        </g>
      );
    case 'office':
      return (
        <g>
          <rect width={1000} height={560} fill="#DCE5E2" />
          <rect y={400} width={1000} height={160} fill="#A9B5AE" />
          <CityWindow x={40} y={50} w={420} h={250} />
          {[560, 760].map((x) => (
            <g key={x}>
              <rect x={x} y={300} width={180} height={14} fill="#5B6B70" />
              <rect x={x + 40} y={220} width={100} height={70} rx={4} fill="#2E3A45" />
              <rect x={x + 46} y={226} width={88} height={56} fill="#7FA3B0" />
              <rect x={x + 84} y={290} width={12} height={12} fill="#2E3A45" />
              <rect x={x + 10} y={314} width={10} height={90} fill="#5B6B70" />
              <rect x={x + 160} y={314} width={10} height={90} fill="#5B6B70" />
            </g>
          ))}
          <Plant x={520} y={400} />
          <rect x={600} y={80} width={300} height={60} rx={8} fill="#245742" />
          <text x={750} y={120} textAnchor="middle" fontSize={26} fill="#E9E2D0" fontFamily="var(--font-ui)" fontWeight={600}>
            فريق خدمة العملاء
          </text>
        </g>
      );
    case 'meeting':
    case 'boardroom':
      return (
        <g>
          <rect width={1000} height={560} fill={kind === 'boardroom' ? '#E4DCCB' : '#E9E2D0'} />
          <CityWindow x={kind === 'boardroom' ? 40 : 560} y={50} w={400} h={270} />
          <rect x={kind === 'boardroom' ? 560 : 60} y={70} width={360} height={210} rx={6} fill="#1F3B33" />
          <rect x={kind === 'boardroom' ? 580 : 80} y={90} width={320} height={170} fill="#F4EFE6" />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={(kind === 'boardroom' ? 610 : 110) + i * 70} y={240 - (40 + i * 30)} width={40} height={40 + i * 30} fill={i === 3 ? '#245742' : '#9DB3A8'} />
          ))}
          <path d="M 0 430 L 1000 430 L 1000 560 L 0 560 Z" fill="#8E7A62" />
          <path d="M 120 420 L 880 420 L 940 470 L 60 470 Z" fill="#5B4636" />
          <rect x={300} y={404} width={90} height={14} fill="#F4EFE6" transform="rotate(-4 345 411)" />
          <rect x={620} y={404} width={90} height={14} fill="#F4EFE6" transform="rotate(5 665 411)" />
        </g>
      );
    case 'service':
      return (
        <g>
          <rect width={1000} height={560} fill="#E6EBE4" />
          {[0, 1, 2].map((r) => (
            <g key={r}>
              <rect x={540} y={80 + r * 100} width={420} height={10} fill="#9A8670" />
              {Array.from({ length: 8 }).map((_, i) => (
                <rect key={i} x={560 + i * 50} y={40 + r * 100} width={36} height={40} rx={4} fill={['#C9B79C', '#9DB3A8', '#4E7FA0', '#D9C29A'][(i + r) % 4]} />
              ))}
            </g>
          ))}
          <rect x={60} y={60} width={360} height={90} rx={10} fill="#245742" />
          <text x={240} y={118} textAnchor="middle" fontSize={30} fill="#E9E2D0" fontFamily="var(--font-ui)" fontWeight={600}>
            خدمة العملاء
          </text>
          <rect x={60} y={190} width={260} height={150} rx={8} fill="#2E3A45" />
          <rect x={72} y={202} width={236} height={110} fill="#C4D3D6" />
          <path d="M 90 230 L 280 230 M 90 255 L 240 255 M 90 280 L 260 280" stroke="#2E3A45" strokeWidth={6} opacity={0.5} />
          <rect y={430} width={1000} height={130} fill="#5B6B70" />
          <rect y={410} width={1000} height={24} fill="#3E4C50" />
        </g>
      );
  }
}

export function AdultStage({
  backdrop,
  speaker,
  mood,
  label,
}: {
  backdrop: AdultBackdrop;
  speaker: AdultId;
  mood: AdultMood;
  label?: string;
}) {
  return (
    <svg viewBox="0 0 1000 560" className="adult-stage" role="img" aria-label={label} preserveAspectRatio="xMidYMid slice">
      <Backdrop kind={backdrop} />
      <rect width={1000} height={560} fill="#0E1A16" opacity={0.08} />
      <g key={speaker + mood} className="portrait-enter">
        <AdultPortrait id={speaker} mood={mood} x={330} y={560} scale={1.42} />
      </g>
      <Grain w={1000} h={560} opacity={0.08} />
    </svg>
  );
}

export function AdultAvatar({ id, mood = 'smile', size = 56 }: { id: AdultId; mood?: AdultMood; size?: number }) {
  return (
    <svg viewBox="-90 -320 180 180" width={size} height={size} aria-hidden="true" style={{ background: '#E9E2D0', borderRadius: '50%' }}>
      <AdultPortrait id={id} mood={mood} x={0} y={0} />
    </svg>
  );
}
