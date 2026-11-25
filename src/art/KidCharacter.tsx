import type { ReactElement } from 'react';
import type { Expression, HeldItem, KidId } from '../types';

/** Original storybook cast. Every character is built from the same parts, so they stay consistent. */
const INK = '#3B2A22';

type HairStyle = 'ponytail' | 'short' | 'puffs' | 'hijab' | 'ghutra' | 'sideHair' | 'cap';
interface Look {
  adult: boolean;
  skin: string;
  hair: string;
  style: HairStyle;
  wrap?: string; // hijab colour / cap colour
  top: string;
  bottom: string;
  long?: boolean; // dress / thobe down to the feet
  skirt?: string;
  shoes: string;
  glasses?: boolean;
  beard?: boolean;
  mustache?: boolean;
  apron?: string;
  collar?: string;
  accessory?: string; // hair clip / bow colour
}

export const LOOKS: Record<Exclude<KidId, 'dhaw'>, Look> = {
  layan: { adult: false, skin: '#EDB993', hair: '#4A2C1D', style: 'ponytail', top: '#FF875F', bottom: '#8A5A44', skirt: '#FFD45E', shoes: '#245742', collar: '#FFF3D7', accessory: '#FFD45E' },
  khalid: { adult: false, skin: '#D9A27A', hair: '#2B1B14', style: 'short', top: '#4FA3D1', bottom: '#67916C', shoes: '#FF875F', collar: '#91C8E9' },
  noura: { adult: false, skin: '#C98B62', hair: '#2E1E18', style: 'puffs', top: '#B7A1E8', bottom: '#2F8F86', skirt: '#F7A7B5', shoes: '#FFD45E', accessory: '#FF875F', collar: '#FFF3D7' },
  mom: { adult: true, skin: '#E6AD86', hair: '#3a2418', style: 'hijab', wrap: '#B7A1E8', top: '#67916C', bottom: '#67916C', long: true, shoes: '#3B2A22', collar: '#FFF3D7' },
  dad: { adult: true, skin: '#C98B62', hair: '#22160f', style: 'ghutra', top: '#F7F4EC', bottom: '#F7F4EC', long: true, shoes: '#6B4A35', beard: true },
  teacher: { adult: true, skin: '#DDA47C', hair: '#2a1a12', style: 'hijab', wrap: '#1D89B4', top: '#FFD45E', bottom: '#245742', long: true, shoes: '#3B2A22', glasses: true },
  librarian: { adult: true, skin: '#C58A62', hair: '#6E5A4A', style: 'sideHair', top: '#245742', bottom: '#7B6552', shoes: '#3B2A22', glasses: true, mustache: true, collar: '#FFF3D7' },
  seller: { adult: true, skin: '#B97D55', hair: '#2a1a12', style: 'cap', wrap: '#FF875F', top: '#FFD45E', bottom: '#5B6B7A', shoes: '#3B2A22', mustache: true, apron: '#67916C' },
};

type Pose = 'down' | 'wave' | 'cheer' | 'chin' | 'scratch' | 'open' | 'hold';
const POSE: Record<Expression, Pose> = {
  happy: 'wave',
  curious: 'down',
  surprised: 'open',
  confused: 'scratch',
  excited: 'cheer',
  thinking: 'chin',
};

function Face({ expr, cy, r, look }: { expr: Expression; cy: number; r: number; look: Look }) {
  const ex = r * 0.36;
  const ey = cy - r * 0.02;
  const my = cy + r * 0.4;
  const by = ey - r * 0.26;
  const s = r / 50; // scale details to head size
  const eye = (x: number, dx = 0, dy = 0, big = false) => (
    <g key={x}>
      {big ? (
        <>
          <ellipse cx={x} cy={ey} rx={7.5 * s} ry={9 * s} fill="#fff" stroke={INK} strokeWidth={2} />
          <circle cx={x + dx} cy={ey + dy + 1} r={4.2 * s} fill={INK} />
          <circle cx={x + dx + 1.5 * s} cy={ey + dy - 1.5 * s} r={1.5 * s} fill="#fff" />
        </>
      ) : (
        <>
          <ellipse cx={x + dx} cy={ey + dy} rx={4.4 * s} ry={5.6 * s} fill={INK} />
          <circle cx={x + dx + 1.4 * s} cy={ey + dy - 1.8 * s} r={1.4 * s} fill="#fff" />
        </>
      )}
    </g>
  );
  const smileEye = (x: number) => (
    <path key={x} d={`M ${x - 6 * s} ${ey + 2 * s} Q ${x} ${ey - 6 * s} ${x + 6 * s} ${ey + 2 * s}`} fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" />
  );
  const brow = (x: number, tilt: number, lift = 0) => (
    <path
      key={'b' + x}
      d={`M ${x - 7 * s} ${by - lift + tilt} Q ${x} ${by - lift - 4 * s} ${x + 7 * s} ${by - lift - tilt}`}
      fill="none"
      stroke={look.adult ? look.hair : INK}
      strokeWidth={2.6}
      strokeLinecap="round"
    />
  );

  let eyes: ReactElement[] = [];
  let brows: ReactElement[] = [];
  let mouth: ReactElement;
  switch (expr) {
    case 'happy':
      eyes = [smileEye(-ex), smileEye(ex)];
      brows = [brow(-ex, 0, 2), brow(ex, 0, 2)];
      mouth = <path d={`M ${-13 * s} ${my - 3 * s} Q 0 ${my + 14 * s} ${13 * s} ${my - 3 * s} Z`} fill="#8E3B33" stroke={INK} strokeWidth={2} strokeLinejoin="round" />;
      break;
    case 'excited':
      eyes = [eye(-ex, 0, 0, true), eye(ex, 0, 0, true)];
      brows = [brow(-ex, 0, 6), brow(ex, 0, 6)];
      mouth = (
        <g>
          <path d={`M ${-15 * s} ${my - 5 * s} Q 0 ${my + 20 * s} ${15 * s} ${my - 5 * s} Z`} fill="#8E3B33" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
          <path d={`M ${-7 * s} ${my + 6 * s} Q 0 ${my + 2 * s} ${7 * s} ${my + 6 * s} Q 0 ${my + 11 * s} ${-7 * s} ${my + 6 * s}`} fill="#F28C8C" />
        </g>
      );
      break;
    case 'curious':
      eyes = [eye(-ex, 2 * s, 0), eye(ex, 2 * s, 0)];
      brows = [brow(-ex, 0, 0), brow(ex, -2 * s, 6)];
      mouth = <path d={`M ${-6 * s} ${my} Q ${2 * s} ${my + 5 * s} ${9 * s} ${my - 2 * s}`} fill="none" stroke={INK} strokeWidth={2.8} strokeLinecap="round" />;
      break;
    case 'surprised':
      eyes = [eye(-ex, 0, 0, true), eye(ex, 0, 0, true)];
      brows = [brow(-ex, 0, 9), brow(ex, 0, 9)];
      mouth = <ellipse cx={0} cy={my + 2 * s} rx={6 * s} ry={8 * s} fill="#8E3B33" stroke={INK} strokeWidth={2} />;
      break;
    case 'confused':
      eyes = [eye(-ex, 0, 1), eye(ex, 0, 1)];
      brows = [brow(-ex, -3 * s, 2), brow(ex, 4 * s, 0)];
      mouth = <path d={`M ${-10 * s} ${my + 1 * s} q ${5 * s} ${-5 * s} ${10 * s} 0 t ${10 * s} 0`} fill="none" stroke={INK} strokeWidth={2.8} strokeLinecap="round" />;
      break;
    case 'thinking':
      eyes = [eye(-ex, 2.5 * s, -2.5 * s), eye(ex, 2.5 * s, -2.5 * s)];
      brows = [brow(-ex, 1 * s, 3), brow(ex, -1 * s, 4)];
      mouth = <path d={`M ${-3 * s} ${my + 2 * s} L ${9 * s} ${my}`} fill="none" stroke={INK} strokeWidth={2.8} strokeLinecap="round" />;
      break;
  }

  return (
    <g>
      <ellipse cx={-r * 0.56} cy={cy + r * 0.28} rx={8 * s} ry={5 * s} fill="#F28C8C" opacity={0.5} />
      <ellipse cx={r * 0.56} cy={cy + r * 0.28} rx={8 * s} ry={5 * s} fill="#F28C8C" opacity={0.5} />
      {brows}
      {eyes}
      <path d={`M ${-2 * s} ${cy + r * 0.12} q ${3 * s} ${4 * s} ${6 * s} 0`} fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" opacity={0.7} />
      {look.mustache && <path d={`M ${-12 * s} ${my - 6 * s} Q 0 ${my - 13 * s} ${12 * s} ${my - 6 * s} Q 0 ${my - 8 * s} ${-12 * s} ${my - 6 * s} Z`} fill={look.hair} />}
      {mouth}
      {look.glasses && (
        <g fill="none" stroke={INK} strokeWidth={2.2}>
          <circle cx={-ex} cy={ey} r={r * 0.22} />
          <circle cx={ex} cy={ey} r={r * 0.22} />
          <path d={`M ${-ex + r * 0.22} ${ey} Q 0 ${ey - 4} ${ex - r * 0.22} ${ey}`} />
        </g>
      )}
    </g>
  );
}

interface Props {
  id: Exclude<KidId, 'dhaw'>;
  expression: Expression;
  x: number;
  y?: number;
  scale?: number;
  flip?: boolean;
  holding?: HeldItem;
  backpack?: boolean;
}

/** Things a character can hold. Drawn in the character's own coordinates. */
function Held({ item, hL, hR, top, cy, r }: { item: HeldItem; hL: { x: number; y: number }; hR: { x: number; y: number }; top: number; cy: number; r: number }) {
  switch (item) {
    case 'openBook':
      return (
        <g stroke={INK} strokeWidth={2.5} strokeLinejoin="round">
          <path d={`M 0 ${top + 38} L -40 ${top + 30} L -40 ${top + 66} L 0 ${top + 74} L 40 ${top + 66} L 40 ${top + 30} Z`} fill="#67916C" />
          <path d={`M 0 ${top + 40} L -36 ${top + 33} L -36 ${top + 63} L 0 ${top + 70} Z M 0 ${top + 40} L 36 ${top + 33} L 36 ${top + 63} L 0 ${top + 70} Z`} fill="#FFF9EE" />
          <path d={`M -30 ${top + 42} L -8 ${top + 46} M -30 ${top + 50} L -8 ${top + 54} M 8 ${top + 46} L 30 ${top + 42} M 8 ${top + 54} L 30 ${top + 50}`} strokeWidth={1.6} opacity={0.5} />
        </g>
      );
    case 'book':
      return (
        <g stroke={INK} strokeWidth={2.5}>
          <rect x={-26} y={top + 30} width={52} height={42} rx={4} fill="#B7A1E8" />
          <rect x={-26} y={top + 30} width={9} height={42} fill="#8E78C9" />
          <rect x={-8} y={top + 40} width={26} height={10} rx={2} fill="#FFF9EE" strokeWidth={1.5} />
        </g>
      );
    case 'notebook':
      return (
        <g stroke={INK} strokeWidth={2.5}>
          <rect x={-24} y={top + 26} width={48} height={50} rx={4} fill="#1D89B4" />
          <rect x={-14} y={top + 36} width={28} height={12} rx={2} fill="#FFF9EE" strokeWidth={1.5} />
          {[top + 34, top + 50, top + 66].map((yy) => (
            <circle key={yy} cx={-24} cy={yy} r={3} fill="#FFF9EE" strokeWidth={1.5} />
          ))}
        </g>
      );
    case 'gift':
      return (
        <g stroke={INK} strokeWidth={2.5} strokeLinejoin="round">
          <rect x={-32} y={top + 26} width={64} height={50} rx={4} fill="#D9533D" />
          <path d={`M 0 ${top + 26} L 0 ${top + 76} M -32 ${top + 48} L 32 ${top + 48}`} stroke="#FFD45E" strokeWidth={7} />
          <path d={`M 0 ${top + 26} q -18 -18 -20 -4 q 4 10 20 4 q 18 -18 20 -4 q -4 10 -20 4`} fill="#FFD45E" />
        </g>
      );
    case 'list':
      return (
        <g stroke={INK} strokeWidth={2} transform={`rotate(-8 ${hR.x} ${hR.y})`}>
          <rect x={hR.x - 26} y={hR.y - 36} width={34} height={46} rx={3} fill="#FFF9EE" />
          <path d={`M ${hR.x - 20} ${hR.y - 26} l 4 4 l 6 -8 M ${hR.x - 20} ${hR.y - 14} l 4 4 l 6 -8 M ${hR.x - 6} ${hR.y - 26} l 10 0 M ${hR.x - 6} ${hR.y - 14} l 10 0 M ${hR.x - 20} ${hR.y - 2} l 22 0`} fill="none" strokeWidth={1.8} />
        </g>
      );
    case 'invites':
      return (
        <g stroke={INK} strokeWidth={2} strokeLinejoin="round">
          {[0, 1].map((i) => (
            <g key={i} transform={`translate(${hR.x - 30 + i * 8} ${hR.y - 30 - i * 8}) rotate(${-6 + i * 10})`}>
              <rect width={40} height={28} rx={3} fill={i ? '#F7A7B5' : '#FFF9EE'} />
              <path d="M 0 0 L 20 15 L 40 0" fill="none" />
              <circle cx={20} cy={16} r={4} fill="#D9533D" strokeWidth={1.5} />
            </g>
          ))}
        </g>
      );
    case 'bags':
      return (
        <g stroke={INK} strokeWidth={2.5} strokeLinejoin="round">
          {[hL, hR].map((h, i) => (
            <g key={i}>
              <path d={`M ${h.x - 8} ${h.y + 10} Q ${h.x} ${h.y - 8} ${h.x + 8} ${h.y + 10}`} fill="none" />
              <circle cx={h.x - 6} cy={h.y + 10} r={7} fill={i ? '#E0453A' : '#F5D547'} strokeWidth={1.8} />
              <circle cx={h.x + 7} cy={h.y + 9} r={6} fill={i ? '#9BC53D' : '#FFB02E'} strokeWidth={1.8} />
              <path d={`M ${h.x - 17} ${h.y + 10} L ${h.x + 17} ${h.y + 10} L ${h.x + 14} ${h.y + 46} L ${h.x - 14} ${h.y + 46} Z`} fill="#E3B987" />
            </g>
          ))}
        </g>
      );
    case 'balloons':
      return (
        <g stroke={INK} strokeWidth={2.5}>
          {[
            [-40, -95, '#FF875F'],
            [6, -125, '#FFD45E'],
            [50, -92, '#B7A1E8'],
          ].map(([dx, dy, c]) => (
            <g key={String(c)}>
              <path d={`M ${hR.x} ${hR.y} Q ${hR.x + (dx as number) / 2} ${cy - r} ${hR.x + (dx as number) * 0.6} ${cy + (dy as number) + 24}`} fill="none" strokeWidth={1.5} />
              <ellipse cx={hR.x + (dx as number) * 0.6} cy={cy + (dy as number)} rx={20} ry={24} fill={c as string} />
              <ellipse cx={hR.x + (dx as number) * 0.6 - 6} cy={cy + (dy as number) - 8} rx={5} ry={7} fill="#fff" opacity={0.5} stroke="none" />
            </g>
          ))}
        </g>
      );
  }
}

export function KidCharacter({ id, expression, x, y = 405, scale = 1, flip = false, holding, backpack }: Props) {
  const L = LOOKS[id];
  const legH = L.adult ? 92 : 58;
  const torsoH = L.adult ? 120 : 88;
  const tw = L.adult ? 86 : 76;
  const r = L.adult ? 40 : 50;
  const hipY = -legH;
  const top = hipY - torsoH;
  const cy = top - r + (L.adult ? 4 : 10);
  const pose: Pose = holding ? 'hold' : POSE[expression];

  // arms
  const shL = { x: -tw / 2 + 6, y: top + 14 };
  const shR = { x: tw / 2 - 6, y: top + 14 };
  const down = (side: 1 | -1) => ({ x: side * (tw / 2 + 8), y: top + torsoH * 0.82 });
  let hL = down(-1);
  let hR = down(1);
  if (pose === 'cheer') {
    hL = { x: -(tw / 2 + 30), y: top - 50 };
    hR = { x: tw / 2 + 30, y: top - 50 };
  } else if (pose === 'wave') {
    hR = { x: tw / 2 + 30, y: top - 40 };
  } else if (pose === 'chin') {
    hR = { x: r * 0.28, y: cy + r * 0.9 };
  } else if (pose === 'scratch') {
    hR = { x: r * 0.98, y: cy - r * 0.3 };
  } else if (pose === 'open') {
    hL = { x: -(tw / 2 + 30), y: top + 26 };
    hR = { x: tw / 2 + 30, y: top + 26 };
  } else if (pose === 'hold') {
    if (holding === 'openBook' || holding === 'book' || holding === 'notebook' || holding === 'gift') {
      hL = { x: -22, y: top + 54 };
      hR = { x: 22, y: top + 54 };
    } else if (holding === 'list' || holding === 'invites') {
      hR = { x: 16, y: top + 50 };
    } else if (holding === 'balloons') {
      hR = { x: tw / 2 + 24, y: top - 4 };
    }
  }
  const arm = (sh: { x: number; y: number }, h: { x: number; y: number }, side: 1 | -1, key: string) => {
    const ex = (sh.x + h.x) / 2 + side * 14;
    const ey = (sh.y + h.y) / 2 + 6;
    const d = `M ${sh.x} ${sh.y} Q ${ex} ${ey} ${h.x} ${h.y}`;
    const w = L.adult ? 17 : 19;
    return (
      <g key={key}>
        <path d={d} fill="none" stroke={INK} strokeWidth={w + 5} strokeLinecap="round" />
        <path d={d} fill="none" stroke={L.top} strokeWidth={w} strokeLinecap="round" />
        <circle cx={h.x} cy={h.y} r={L.adult ? 9 : 10} fill={L.skin} stroke={INK} strokeWidth={2.5} />
      </g>
    );
  };

  const torsoPath = L.long
    ? `M ${-tw / 2} ${top + 18} Q ${-tw / 2} ${top} ${-tw / 2 + 18} ${top} L ${tw / 2 - 18} ${top} Q ${tw / 2} ${top} ${tw / 2} ${top + 18} L ${tw / 2 + 16} -10 L ${-tw / 2 - 16} -10 Z`
    : `M ${-tw / 2} ${top + 18} Q ${-tw / 2} ${top} ${-tw / 2 + 18} ${top} L ${tw / 2 - 18} ${top} Q ${tw / 2} ${top} ${tw / 2} ${top + 18} L ${tw / 2 + 5} ${hipY + 4} L ${-tw / 2 - 5} ${hipY + 4} Z`;

  const faceCy = L.style === 'hijab' || L.style === 'ghutra' ? cy + 3 : cy;
  const faceR = L.style === 'hijab' || L.style === 'ghutra' ? r * 0.86 : r;

  const hairBack = () => {
    switch (L.style) {
      case 'ponytail':
        return (
          <g fill={L.hair} stroke={INK} strokeWidth={3}>
            <ellipse cx={r * 0.95} cy={cy - r * 0.05} rx={20} ry={38} transform={`rotate(-28 ${r * 0.95} ${cy - r * 0.05})`} />
            <ellipse cx={0} cy={cy + 6} rx={r + 7} ry={r + 4} />
          </g>
        );
      case 'puffs':
        return (
          <g fill={L.hair} stroke={INK} strokeWidth={3}>
            <circle cx={-r * 0.92} cy={cy - r * 0.8} r={r * 0.5} />
            <circle cx={r * 0.92} cy={cy - r * 0.8} r={r * 0.5} />
          </g>
        );
      case 'hijab':
        return (
          <path
            d={`M ${-r * 1.16} ${cy} C ${-r * 1.3} ${cy - r * 1.45} ${r * 1.3} ${cy - r * 1.45} ${r * 1.16} ${cy} C ${r * 1.1} ${cy + r * 0.8} ${tw / 2 + 10} ${top + 8} ${tw / 2 + 6} ${top + 34} L ${-tw / 2 - 6} ${top + 34} C ${-tw / 2 - 10} ${top + 8} ${-r * 1.1} ${cy + r * 0.8} ${-r * 1.16} ${cy} Z`}
            fill={L.wrap}
            stroke={INK}
            strokeWidth={3}
            strokeLinejoin="round"
          />
        );
      case 'ghutra':
        return (
          <path
            d={`M ${-r * 1.12} ${cy - r * 0.2} C ${-r * 1.25} ${cy - r * 1.5} ${r * 1.25} ${cy - r * 1.5} ${r * 1.12} ${cy - r * 0.2} L ${r * 1.3} ${top + 40} L ${r * 0.5} ${top + 22} L ${-r * 0.5} ${top + 22} L ${-r * 1.3} ${top + 40} Z`}
            fill="#FBF8F1"
            stroke={INK}
            strokeWidth={3}
            strokeLinejoin="round"
          />
        );
      default:
        return null;
    }
  };

  const hairFront = () => {
    switch (L.style) {
      case 'ponytail':
        return (
          <g>
            <path d={`M ${-r - 2} ${cy + 6} C ${-r - 4} ${cy - r * 1.35} ${r + 4} ${cy - r * 1.35} ${r + 2} ${cy + 6} Q ${r * 0.55} ${cy - r * 0.42} ${-r * 0.05} ${cy - r * 0.52} Q ${-r * 0.6} ${cy - r * 0.35} ${-r - 2} ${cy + 6} Z`} fill={L.hair} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
            <path d={`M ${r * 0.55} ${cy - r * 0.92} l 12 -6 l 2 13 z`} fill={L.accessory} stroke={INK} strokeWidth={2} />
          </g>
        );
      case 'short':
        return (
          <path
            d={`M ${-r - 1} ${cy - 2} C ${-r - 3} ${cy - r * 1.3} ${r + 3} ${cy - r * 1.3} ${r + 1} ${cy - 2} L ${r * 0.72} ${cy - r * 0.5} L ${r * 0.38} ${cy - r * 0.38} L ${r * 0.02} ${cy - r * 0.58} L ${-r * 0.38} ${cy - r * 0.4} L ${-r * 0.74} ${cy - r * 0.52} Z`}
            fill={L.hair}
            stroke={INK}
            strokeWidth={3}
            strokeLinejoin="round"
          />
        );
      case 'puffs':
        return (
          <g>
            <path d={`M ${-r - 1} ${cy} C ${-r - 3} ${cy - r * 1.32} ${r + 3} ${cy - r * 1.32} ${r + 1} ${cy} Q ${r * 0.7} ${cy - r * 0.62} ${r * 0.15} ${cy - r * 0.6} Q ${-r * 0.5} ${cy - r * 0.6} ${-r - 1} ${cy} Z`} fill={L.hair} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
            <path d={`M ${-r * 0.95} ${cy - r * 1.25} l -10 -8 l 0 16 z M ${-r * 0.95} ${cy - r * 1.25} l 10 -8 l 0 16 z`} fill={L.accessory} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
          </g>
        );
      case 'hijab':
        return <path d={`M ${-faceR * 0.92} ${cy - r * 0.35} Q 0 ${cy - r * 1.22} ${faceR * 0.92} ${cy - r * 0.35}`} fill="none" stroke={INK} strokeWidth={2} opacity={0.35} />;
      case 'ghutra':
        return (
          <g>
            <path d={`M ${-faceR * 0.98} ${cy - r * 0.2} Q 0 ${cy - r * 1.3} ${faceR * 0.98} ${cy - r * 0.2}`} fill="none" stroke="#D9533D" strokeWidth={3} strokeDasharray="4 5" opacity={0.7} />
            <ellipse cx={0} cy={cy - r * 0.78} rx={r * 0.92} ry={9} fill="none" stroke="#222" strokeWidth={6} />
          </g>
        );
      case 'sideHair':
        return (
          <g fill={L.hair} stroke={INK} strokeWidth={2.5}>
            <path d={`M ${-r - 1} ${cy + 4} Q ${-r - 4} ${cy - r * 0.7} ${-r * 0.45} ${cy - r * 0.9} L ${-r * 0.5} ${cy - r * 0.45} Q ${-r * 0.8} ${cy - r * 0.2} ${-r * 0.82} ${cy + 4} Z`} />
            <path d={`M ${r + 1} ${cy + 4} Q ${r + 4} ${cy - r * 0.7} ${r * 0.45} ${cy - r * 0.9} L ${r * 0.5} ${cy - r * 0.45} Q ${r * 0.8} ${cy - r * 0.2} ${r * 0.82} ${cy + 4} Z`} />
          </g>
        );
      case 'cap':
        return (
          <g stroke={INK} strokeWidth={3} strokeLinejoin="round">
            <path d={`M ${-r - 2} ${cy - r * 0.48} C ${-r - 2} ${cy - r * 1.5} ${r + 2} ${cy - r * 1.5} ${r + 2} ${cy - r * 0.48} Z`} fill={L.wrap} />
            <path d={`M ${r * 0.2} ${cy - r * 0.52} L ${r * 1.5} ${cy - r * 0.46} Q ${r * 1.45} ${cy - r * 0.32} ${r * 0.2} ${cy - r * 0.38} Z`} fill={L.wrap} />
          </g>
        );
    }
  };

  const extras = () => {
    const side = flip ? -1 : 1;
    if (expression === 'confused')
      return (
        <text x={side * (r + 22)} y={cy - r * 0.9} fontSize={34} fontWeight={800} fill="#FF875F" stroke={INK} strokeWidth={1} textAnchor="middle" fontFamily="sans-serif">
          ؟
        </text>
      );
    if (expression === 'excited')
      return (
        <g className="twinkle" fill="#FFD45E" stroke={INK} strokeWidth={1.5}>
          <path d={`M ${-r - 26} ${cy - r} l 5 -13 l 5 13 l 13 5 l -13 5 l -5 13 l -5 -13 l -13 -5 z`} />
          <path d={`M ${r + 22} ${cy - r * 0.6} l 3 -8 l 3 8 l 8 3 l -8 3 l -3 8 l -3 -8 l -8 -3 z`} />
        </g>
      );
    if (expression === 'surprised')
      return (
        <g stroke={INK} strokeWidth={3} strokeLinecap="round">
          <path d={`M ${-r * 0.7} ${cy - r * 1.35} l -6 -12 M 0 ${cy - r * 1.45} l 0 -13 M ${r * 0.7} ${cy - r * 1.35} l 6 -12`} />
        </g>
      );
    return null;
  };

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} className="kid-char">
      <ellipse cx={0} cy={-2} rx={tw * 0.72} ry={9} fill="#3B2A22" opacity={0.16} />
      <g transform={flip ? 'scale(-1 1)' : undefined} filter="url(#wobble)">
        {hairBack()}
        {/* legs */}
        {!L.long && (
          <g stroke={INK} strokeWidth={3}>
            <rect x={-tw / 2 + 10} y={hipY - 2} width={L.adult ? 26 : 22} height={legH - 6} rx={9} fill={L.bottom} />
            <rect x={tw / 2 - 10 - (L.adult ? 26 : 22)} y={hipY - 2} width={L.adult ? 26 : 22} height={legH - 6} rx={9} fill={L.bottom} />
          </g>
        )}
        <g stroke={INK} strokeWidth={3}>
          <ellipse cx={-tw / 4 - 2} cy={-8} rx={L.adult ? 19 : 17} ry={9} fill={L.shoes} />
          <ellipse cx={tw / 4 + 2} cy={-8} rx={L.adult ? 19 : 17} ry={9} fill={L.shoes} />
        </g>
        {backpack && <rect x={-tw / 2 - 7} y={top + 6} width={tw + 14} height={70} rx={16} fill="#FF875F" stroke={INK} strokeWidth={3} />}
        {/* torso */}
        <path d={torsoPath} fill={L.top} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
        {L.long && L.style === 'ghutra' && <path d={`M 0 ${top + 8} L 0 ${top + 70}`} stroke={INK} strokeWidth={2} opacity={0.35} />}
        {L.long && L.style === 'hijab' && <path d={`M ${-tw / 2 + 4} ${hipY + 20} Q 0 ${hipY + 30} ${tw / 2 - 4} ${hipY + 20}`} fill="none" stroke={INK} strokeWidth={2} opacity={0.3} />}
        {L.skirt && (
          <path d={`M ${-tw / 2 - 5} ${hipY - 8} L ${tw / 2 + 5} ${hipY - 8} L ${tw / 2 + 18} ${hipY + 26} Q 0 ${hipY + 34} ${-tw / 2 - 18} ${hipY + 26} Z`} fill={L.skirt} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
        )}
        {L.apron && <path d={`M ${-tw / 2 + 12} ${top + 34} L ${tw / 2 - 12} ${top + 34} L ${tw / 2 - 4} ${hipY + 8} L ${-tw / 2 + 4} ${hipY + 8} Z`} fill={L.apron} stroke={INK} strokeWidth={2.5} />}
        {L.collar && L.style !== 'hijab' && <path d={`M -16 ${top + 2} L 0 ${top + 16} L 16 ${top + 2}`} fill={L.collar} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />}
        {L.style === 'short' && <circle cx={-12} cy={top + 40} r={9} fill="#FFD45E" stroke={INK} strokeWidth={2} />}
        {backpack && (
          <g stroke={INK} strokeWidth={2.5}>
            <path d={`M ${-tw / 2 + 12} ${top + 1} L ${-tw / 2 + 16} ${top + 46}`} stroke="#C9573B" strokeWidth={8} strokeLinecap="round" />
            <path d={`M ${tw / 2 - 12} ${top + 1} L ${tw / 2 - 16} ${top + 46}`} stroke="#C9573B" strokeWidth={8} strokeLinecap="round" />
          </g>
        )}
        {arm(shL, hL, -1, 'l')}
        {pose !== 'chin' && pose !== 'scratch' && arm(shR, hR, 1, 'r')}
        {/* head */}
        {L.style !== 'hijab' && L.style !== 'ghutra' && (
          <g fill={L.skin} stroke={INK} strokeWidth={3}>
            <circle cx={-r * 0.96} cy={cy + 6} r={L.adult ? 8 : 10} />
            <circle cx={r * 0.96} cy={cy + 6} r={L.adult ? 8 : 10} />
          </g>
        )}
        <ellipse cx={0} cy={faceCy} rx={faceR} ry={faceR * (L.adult ? 1.06 : 0.98)} fill={L.skin} stroke={INK} strokeWidth={3} />
        {L.beard && (
          <path d={`M ${-faceR * 0.9} ${faceCy + 2} Q ${-faceR * 0.8} ${faceCy + faceR * 1.15} 0 ${faceCy + faceR * 1.12} Q ${faceR * 0.8} ${faceCy + faceR * 1.15} ${faceR * 0.9} ${faceCy + 2} Q ${faceR * 0.55} ${faceCy + faceR * 0.75} 0 ${faceCy + faceR * 0.72} Q ${-faceR * 0.55} ${faceCy + faceR * 0.75} ${-faceR * 0.9} ${faceCy + 2} Z`} fill={L.hair} opacity={0.92} />
        )}
        <Face expr={expression} cy={faceCy} r={faceR} look={L} />
        {hairFront()}
        {(pose === 'chin' || pose === 'scratch') && arm(shR, hR, 1, 'r')}
        {holding && <Held item={holding} hL={hL} hR={hR} top={top} cy={cy} r={r} />}
        {holding && holding !== 'bags' && holding !== 'balloons' && (
          <g fill={L.skin} stroke={INK} strokeWidth={2.5}>
            {holding !== 'list' && holding !== 'invites' && <circle cx={hL.x} cy={hL.y} r={L.adult ? 9 : 10} />}
            <circle cx={hR.x} cy={hR.y} r={L.adult ? 9 : 10} />
          </g>
        )}
      </g>
      {extras()}
    </g>
  );
}

/** A framed head-and-shoulders avatar for cards / UI */
export function KidAvatar({ id, expression = 'happy', size = 64, bg = '#FFF3D7' }: { id: Exclude<KidId, 'dhaw'>; expression?: Expression; size?: number; bg?: string }) {
  const adult = LOOKS[id].adult;
  // frame the head region of the 405-ground figure
  const vb = adult ? '-75 95 150 150' : '-80 135 160 160';
  return (
    <svg viewBox={vb} width={size} height={size} role="img" aria-hidden="true" style={{ background: bg, borderRadius: '50%' }}>
      <KidCharacter id={id} expression={expression} x={0} y={405} />
    </svg>
  );
}
