import type { ReactElement } from 'react';
import type { KidBackground, PropId, SceneCharacter, SceneProp } from '../types';
import { Grain } from './ArtDefs';
import { KidCharacter } from './KidCharacter';

const INK = '#3B2A22';
const W = 800;
const H = 450;

function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const BOOK_COLORS = ['#FF875F', '#FFD45E', '#91C8E9', '#67916C', '#B7A1E8', '#F7A7B5', '#245742', '#D9533D', '#1D89B4'];

/* ---------------- small reusable bits ---------------- */

function Sun({ x, y, r = 34 }: { x: number; y: number; r?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="sun-spin">
        {Array.from({ length: 10 }).map((_, i) => (
          <path key={i} d={`M 0 ${-r - 10} L 5 ${-r - 26} L -5 ${-r - 26} Z`} fill="#FFD45E" transform={`rotate(${i * 36})`} opacity={0.85} />
        ))}
      </g>
      <circle r={r} fill="#FFD45E" stroke={INK} strokeWidth={3} />
      <circle r={r - 9} fill="#FFE38A" />
    </g>
  );
}

function Cloud({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="cloud-drift">
        <path d="M 0 20 Q -4 0 18 2 Q 26 -16 48 -6 Q 66 -14 74 6 Q 92 8 88 22 Z" fill="#FFF9EE" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
      </g>
    </g>
  );
}

function Palm({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth={2.5} strokeLinejoin="round">
      <path d="M -6 0 Q -2 -60 4 -120 L 12 -120 Q 8 -60 8 0 Z" fill="#9A6A42" />
      {[-70, -30, 10, 50, 95, 140].map((a, i) => (
        <path key={i} d="M 8 -120 Q 40 -140 70 -118 Q 40 -128 8 -114 Z" fill={i % 2 ? '#3E8E5B' : '#2F7A4C'} transform={`rotate(${a} 8 -118)`} />
      ))}
    </g>
  );
}

function Tree({ x, y, s = 1, tone = 0 }: { x: number; y: number; s?: number; tone?: number }) {
  const c = tone ? ['#4F9A57', '#6DB36A'] : ['#3F8A4F', '#5FA764'];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth={3} strokeLinejoin="round">
      <path d="M -12 0 L -8 -110 Q 0 -118 8 -110 L 12 0 Z" fill="#8A5A3B" />
      <path d="M -6 -80 L -30 -105 M 6 -70 L 30 -98" fill="none" />
      <path d="M -70 -120 Q -86 -170 -40 -190 Q -20 -240 30 -220 Q 80 -230 82 -175 Q 104 -140 70 -112 Q 40 -90 0 -100 Q -50 -88 -70 -120 Z" fill={c[0]} />
      <g stroke="none" fill={c[1]}>
        <circle cx={-30} cy={-165} r={16} />
        <circle cx={22} cy={-190} r={13} />
        <circle cx={48} cy={-140} r={11} />
      </g>
    </g>
  );
}

function StarFrame({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} stroke={INK} strokeWidth={2.5}>
      <rect x={-34} y={-34} width={68} height={68} rx={6} fill="#245742" />
      <g fill="#FFD45E">
        <rect x={-16} y={-16} width={32} height={32} />
        <rect x={-16} y={-16} width={32} height={32} transform="rotate(45)" />
      </g>
      <circle r={7} fill="#FF875F" />
    </g>
  );
}

/* ---------------- backgrounds ---------------- */

function Home() {
  return (
    <g>
      <rect width={W} height={340} fill="#FFE9C7" />
      <g fill="#F6D6A6" opacity={0.6}>
        {Array.from({ length: 12 }).map((_, i) =>
          Array.from({ length: 6 }).map((__, j) => <circle key={i + '-' + j} cx={30 + i * 68 + (j % 2) * 34} cy={30 + j * 52} r={4} />),
        )}
      </g>
      <rect y={340} width={W} height={110} fill="#E3B987" />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M 0 ${365 + i * 30} L ${W} ${365 + i * 30}`} stroke="#C99A66" strokeWidth={2} />
      ))}
      <rect y={332} width={W} height={12} fill="#C98B5A" stroke={INK} strokeWidth={2.5} />
      {/* window */}
      <g stroke={INK} strokeWidth={3}>
        <rect x={548} y={48} width={180} height={160} rx={10} fill="#FFF9EE" />
        <rect x={562} y={62} width={152} height={132} rx={4} fill="url(#skyMorning)" />
      </g>
      <Sun x={660} y={120} r={22} />
      <path d="M 638 62 L 638 194 M 562 128 L 714 128" stroke="#FFF9EE" strokeWidth={8} />
      <path d="M 540 40 Q 560 130 548 214 L 520 214 Q 532 120 520 40 Z M 736 40 Q 716 130 728 214 L 756 214 Q 744 120 756 40 Z" fill="#FF875F" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      <rect x={510} y={30} width={256} height={12} rx={6} fill="#245742" stroke={INK} strokeWidth={2.5} />
      {/* shelf */}
      <g stroke={INK} strokeWidth={3}>
        <rect x={70} y={156} width={200} height={12} rx={4} fill="#C98B5A" />
        <rect x={92} y={110} width={14} height={46} fill="#91C8E9" />
        <rect x={108} y={116} width={12} height={40} fill="#FFD45E" />
        <rect x={122} y={104} width={16} height={52} fill="#67916C" />
        <path d="M 210 156 L 214 126 L 246 126 L 250 156 Z" fill="#FF875F" />
        <path d="M 230 126 Q 210 96 222 84 Q 232 104 230 126 Q 244 92 258 92 Q 248 112 230 126" fill="#67916C" />
      </g>
      <StarFrame x={170} y={70} />
      {/* clock */}
      <g transform="translate(400 80)" stroke={INK} strokeWidth={3}>
        <circle r={30} fill="#FFF9EE" />
        <path d="M 0 0 L 0 -18 M 0 0 L 13 6" strokeLinecap="round" />
        <circle r={3} fill={INK} />
      </g>
      <ellipse cx={400} cy={418} rx={260} ry={22} fill="#D9533D" opacity={0.25} />
    </g>
  );
}

function School({ library = false }: { library?: boolean }) {
  return (
    <g>
      <rect width={W} height={H} fill="url(#skyMorning)" />
      <Sun x={100} y={80} />
      <Cloud x={220} y={60} />
      <Cloud x={600} y={40} s={0.8} />
      <Palm x={60} y={350} s={1.1} />
      <Palm x={250} y={340} s={0.8} />
      {/* building with najdi-style parapet */}
      <g stroke={INK} strokeWidth={3} strokeLinejoin="round">
        <rect x={330} y={140} width={440} height={220} fill={library ? '#E9D3B0' : '#F2C48D'} />
        <path d={'M 330 140 ' + Array.from({ length: 11 }).map((_, i) => `L ${330 + i * 40 + 20} 118 L ${330 + i * 40 + 40} 140`).join(' ')} fill="#E7AE70" />
        {[370, 450, 610, 690].map((x) => (
          <g key={x}>
            <rect x={x} y={190} width={50} height={56} rx={25} fill="#91C8E9" />
            <path d={`M ${x + 25} 190 L ${x + 25} 246`} stroke="#FFF9EE" strokeWidth={4} />
          </g>
        ))}
        <path d="M 520 360 L 520 270 Q 550 236 580 270 L 580 360 Z" fill="#245742" />
        <rect x={470} y={152} width={160} height={34} rx={8} fill="#245742" />
      </g>
      {library ? (
        <g stroke="#FFF9EE" strokeWidth={2.5} strokeLinejoin="round" fill="none">
          <path d="M 550 160 L 528 156 L 528 180 L 550 184 L 572 180 L 572 156 Z M 550 160 L 550 184" />
        </g>
      ) : (
        <text x={550} y={176} textAnchor="middle" fontSize={20} fontWeight={700} fill="#FFF9EE" fontFamily="var(--font-kids)">
          مدرسة النور
        </text>
      )}
      <rect y={360} width={W} height={90} fill="#9CC48A" />
      <path d="M 0 400 Q 400 380 800 405 L 800 450 L 0 450 Z" fill="#EADBB8" stroke={INK} strokeWidth={2.5} />
      <g fill="#6FA864" stroke={INK} strokeWidth={2.5}>
        <ellipse cx={300} cy={365} rx={40} ry={18} />
        <ellipse cx={780} cy={368} rx={40} ry={18} />
      </g>
    </g>
  );
}

function Classroom() {
  const letters = ['أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ'];
  return (
    <g>
      <rect width={W} height={340} fill="#E8EFD8" />
      <rect y={340} width={W} height={110} fill="#D6B98C" />
      <rect y={332} width={W} height={12} fill="#67916C" stroke={INK} strokeWidth={2.5} />
      <g stroke={INK} strokeWidth={3}>
        <rect x={240} y={70} width={340} height={170} rx={8} fill="#C98B5A" />
        <rect x={252} y={82} width={316} height={146} rx={4} fill="#245742" />
      </g>
      <text x={410} y={190} textAnchor="middle" fontSize={34} fill="#FFF9EE" fontFamily="var(--font-kids)" opacity={0.92}>
        صباح الخير
      </text>
      <path d="M 300 212 q 20 -10 40 0 t 40 0" fill="none" stroke="#FFD45E" strokeWidth={3} opacity={0.8} />
      <circle cx={530} cy={206} r={10} fill="none" stroke="#F7A7B5" strokeWidth={3} opacity={0.8} />
      <g>
        {letters.map((l, i) => (
          <g key={l} transform={`translate(${250 + i * 50} 24)`}>
            <rect width={40} height={36} rx={6} fill={BOOK_COLORS[i]} stroke={INK} strokeWidth={2.5} />
            <text x={20} y={26} textAnchor="middle" fontSize={20} fontWeight={700} fill="#203D35" fontFamily="var(--font-kids)">
              {l}
            </text>
          </g>
        ))}
      </g>
      <g stroke={INK} strokeWidth={3}>
        <rect x={40} y={80} width={140} height={150} rx={8} fill="#FFF9EE" />
        <rect x={52} y={92} width={116} height={126} fill="url(#skyMorning)" />
        <path d="M 110 92 L 110 218" stroke="#FFF9EE" strokeWidth={6} />
      </g>
      <Tree x={90} y={240} s={0.4} />
      <g stroke={INK} strokeWidth={3}>
        <rect x={640} y={250} width={130} height={14} rx={4} fill="#FFD45E" />
        <rect x={650} y={264} width={10} height={70} fill="#C98B5A" />
        <rect x={750} y={264} width={10} height={70} fill="#C98B5A" />
        <rect x={668} y={226} width={22} height={24} fill="#FF875F" />
        <rect x={694} y={232} width={30} height={18} fill="#91C8E9" />
      </g>
    </g>
  );
}

function Park({ evening = false }: { evening?: boolean }) {
  return (
    <g>
      <rect width={W} height={H} fill={evening ? 'url(#dusk)' : 'url(#skyMorning)'} />
      {evening ? (
        <g>
          <circle cx={660} cy={215} r={46} fill="#FF9B5E" opacity={0.35} />
          <circle cx={660} cy={215} r={32} fill="#FF875F" stroke={INK} strokeWidth={3} />
        </g>
      ) : (
        <Sun x={680} y={70} r={30} />
      )}
      <Cloud x={120} y={50} />
      <Cloud x={420} y={80} s={0.7} />
      <path d="M 0 250 Q 200 180 420 240 Q 620 190 800 240 L 800 450 L 0 450 Z" fill={evening ? '#9DBF82' : '#B5D99A'} stroke={INK} strokeWidth={2.5} />
      <path d="M 0 320 Q 300 270 800 310 L 800 450 L 0 450 Z" fill={evening ? '#7FAE6A' : '#94C77B'} stroke={INK} strokeWidth={2.5} />
      <path d="M 260 450 Q 360 360 560 330 L 620 334 Q 460 380 420 450 Z" fill="#EAD9B0" stroke={INK} strokeWidth={2.5} />
      <Tree x={110} y={345} s={1.05} />
      <Tree x={690} y={330} s={0.85} tone={1} />
      <Tree x={470} y={262} s={0.45} tone={1} />
      <g>
        {Array.from({ length: 14 }).map((_, i) => {
          const r = rng(i + 4);
          const x = 20 + i * 18 + r() * 8;
          const y = 420 + r() * 22;
          return (
            <g key={i} transform={`translate(${x} ${y})`}>
              <path d="M 0 0 L 0 -16" stroke="#3F8A4F" strokeWidth={2.5} />
              <circle cy={-18} r={6} fill={['#FF875F', '#FFD45E', '#F7A7B5', '#B7A1E8'][i % 4]} stroke={INK} strokeWidth={1.8} />
              <circle cy={-18} r={2} fill="#FFF9EE" />
            </g>
          );
        })}
      </g>
    </g>
  );
}

function Library() {
  const shelf = (x0: number, seed: number) => {
    const r = rng(seed);
    const rows = [72, 140, 208, 276];
    return (
      <g key={x0}>
        <rect x={x0} y={40} width={200} height={300} rx={6} fill="#B9805A" stroke={INK} strokeWidth={3} />
        <rect x={x0 + 10} y={50} width={180} height={280} fill="#8F5D3E" />
        {rows.map((ry) => {
          let x = x0 + 14;
          const books: ReactElement[] = [];
          while (x < x0 + 180) {
            const w = 10 + Math.floor(r() * 12);
            const h = 40 + Math.floor(r() * 18);
            if (x + w > x0 + 186) break;
            const lean = r() > 0.92;
            books.push(
              <rect
                key={x}
                x={x}
                y={ry + 56 - h}
                width={w}
                height={h}
                rx={2}
                fill={BOOK_COLORS[Math.floor(r() * BOOK_COLORS.length)]}
                stroke={INK}
                strokeWidth={1.8}
                transform={lean ? `rotate(-8 ${x + w} ${ry + 56})` : undefined}
              />,
            );
            x += w + 2;
          }
          return (
            <g key={ry}>
              {books}
              <rect x={x0 + 6} y={ry + 56} width={188} height={8} fill="#C98B5A" stroke={INK} strokeWidth={2} />
            </g>
          );
        })}
      </g>
    );
  };
  return (
    <g>
      <rect width={W} height={340} fill="#F6E6C6" />
      <rect y={340} width={W} height={110} fill="#C99B6B" />
      <rect y={332} width={W} height={12} fill="#245742" stroke={INK} strokeWidth={2.5} />
      {shelf(24, 11)}
      {shelf(576, 29)}
      <g stroke={INK} strokeWidth={3}>
        <rect x={300} y={22} width={200} height={40} rx={10} fill="#245742" />
      </g>
      <text x={400} y={50} textAnchor="middle" fontSize={22} fontWeight={700} fill="#FFF9EE" fontFamily="var(--font-kids)">
        المكتبة
      </text>
      {/* reading corner window */}
      <g stroke={INK} strokeWidth={3}>
        <path d="M 300 290 L 300 140 Q 400 60 500 140 L 500 290 Z" fill="#FFF9EE" />
        <path d="M 314 280 L 314 146 Q 400 80 486 146 L 486 280 Z" fill="url(#skyWarm)" />
      </g>
      <Palm x={372} y={282} s={0.55} />
      <Palm x={440} y={282} s={0.42} />
      <ellipse cx={400} cy={420} rx={300} ry={26} fill="#D9533D" stroke={INK} strokeWidth={2.5} />
      <ellipse cx={400} cy={420} rx={250} ry={17} fill="none" stroke="#FFD45E" strokeWidth={3} strokeDasharray="10 8" />
    </g>
  );
}

function Market() {
  const stall = (x: number, stripe: string, fruits: string[], seed: number) => {
    const r = rng(seed);
    return (
      <g transform={`translate(${x} 0)`}>
        <g stroke={INK} strokeWidth={3} strokeLinejoin="round">
          <rect x={10} y={110} width={10} height={230} fill="#9A6A42" />
          <rect x={250} y={110} width={10} height={230} fill="#9A6A42" />
          <path d={'M 0 90 L 270 90 L 270 128 ' + Array.from({ length: 9 }).map((_, i) => `Q ${270 - i * 30 - 15} 150 ${270 - (i + 1) * 30} 128`).join(' ') + ' Z'} fill={stripe} />
          {Array.from({ length: 5 }).map((_, i) => (
            <rect key={i} x={i * 60 + 4} y={92} width={28} height={36} fill="#FFF9EE" stroke="none" />
          ))}
          <path d="M 0 90 L 270 90" />
          <rect x={0} y={270} width={270} height={70} rx={6} fill="#C98B5A" />
          <rect x={14} y={236} width={110} height={40} rx={4} fill="#E3B987" />
          <rect x={146} y={236} width={110} height={40} rx={4} fill="#E3B987" />
        </g>
        {[0, 1].map((c) => (
          <g key={c}>
            {Array.from({ length: 9 }).map((_, i) => (
              <circle key={i} cx={30 + c * 132 + (i % 5) * 19 + (i > 4 ? 9 : 0)} cy={i > 4 ? 226 : 240} r={10 + r() * 2} fill={fruits[c]} stroke={INK} strokeWidth={2} />
            ))}
          </g>
        ))}
      </g>
    );
  };
  return (
    <g>
      <rect width={W} height={H} fill="url(#skyWarm)" />
      <rect y={60} width={W} height={290} fill="#E8CFA4" />
      {[60, 220, 380, 540, 700].map((x) => (
        <path key={x} d={`M ${x} 350 L ${x} 150 Q ${x + 50} 90 ${x + 100} 150 L ${x + 100} 350`} fill="#D9B886" stroke={INK} strokeWidth={2.5} />
      ))}
      <path d="M 0 60 L 800 60" stroke={INK} strokeWidth={3} />
      <path d="M 0 40 Q 200 80 400 40 Q 600 80 800 40" fill="none" stroke={INK} strokeWidth={2} />
      {Array.from({ length: 9 }).map((_, i) => (
        <circle key={i} className="twinkle" cx={40 + i * 90} cy={52 + (i % 2) * 10} r={6} fill={['#FFD45E', '#FF875F', '#91C8E9'][i % 3]} stroke={INK} strokeWidth={1.5} />
      ))}
      {stall(20, '#FF875F', ['#E0453A', '#FFB02E'], 5)}
      {stall(510, '#67916C', ['#F5D547', '#9BC53D'], 9)}
      <rect y={340} width={W} height={110} fill="#D9C29A" />
      {Array.from({ length: 9 }).map((_, i) => (
        <path key={i} d={`M ${i * 100} 340 L ${i * 100 - 40} 450`} stroke="#C4A97B" strokeWidth={2} />
      ))}
      <path d="M 0 340 L 800 340" stroke={INK} strokeWidth={3} />
    </g>
  );
}

const BACKGROUNDS: Record<KidBackground, () => ReactElement> = {
  home: Home,
  school: () => <School />,
  classroom: Classroom,
  park: () => <Park />,
  parkEvening: () => <Park evening />,
  library: Library,
  street: () => <School library />,
  market: Market,
};

/* ---------------- props ---------------- */

function Prop({ id }: { id: PropId }) {
  switch (id) {
    case 'bag':
      return (
        <g stroke={INK} strokeWidth={3} strokeLinejoin="round">
          <path d="M -18 -60 Q 0 -84 18 -60" fill="none" strokeWidth={5} />
          <rect x={-34} y={-62} width={68} height={74} rx={18} fill="#FF875F" />
          <rect x={-22} y={-20} width={44} height={26} rx={8} fill="#FFD45E" />
          <path d="M -34 -40 L 34 -40" />
        </g>
      );
    case 'notebook':
      return (
        <g stroke={INK} strokeWidth={3} strokeLinejoin="round">
          <rect x={-30} y={-40} width={60} height={78} rx={5} fill="#1D89B4" />
          <rect x={-18} y={-26} width={36} height={16} rx={3} fill="#FFF9EE" />
          {[-30, -14, 2, 18].map((y) => (
            <circle key={y} cx={-30} cy={y} r={3.5} fill="#FFF9EE" />
          ))}
        </g>
      );
    case 'breakfast':
      return (
        <g stroke={INK} strokeWidth={3} strokeLinejoin="round">
          <rect x={-130} y={-6} width={260} height={16} rx={6} fill="#C98B5A" />
          <rect x={-114} y={10} width={12} height={70} fill="#9A6A42" />
          <rect x={102} y={10} width={12} height={70} fill="#9A6A42" />
          <ellipse cx={-40} cy={-12} rx={46} ry={10} fill="#FFF9EE" />
          <ellipse cx={-52} cy={-16} rx={14} ry={7} fill="#FFF" />
          <circle cx={-52} cy={-17} r={5} fill="#FFD45E" stroke="none" />
          <path d="M -30 -14 Q -16 -30 2 -16 Z" fill="#E8B46A" />
          <rect x={40} y={-40} width={28} height={34} rx={5} fill="#FFFFFF" />
          <rect x={43} y={-34} width={22} height={6} fill="#F3EEE3" stroke="none" />
          <path d="M 68 -32 q 12 4 0 16" fill="none" />
        </g>
      );
    case 'butterfly':
      return (
        <g className="flutter">
          <g stroke={INK} strokeWidth={2.5} strokeLinejoin="round">
            <path className="wing" d="M 0 0 Q -28 -30 -30 -6 Q -30 14 0 4 Z" fill="#FF875F" />
            <path className="wing wing-r" d="M 0 0 Q 28 -30 30 -6 Q 30 14 0 4 Z" fill="#FFD45E" />
            <ellipse cx={0} cy={0} rx={3.5} ry={13} fill={INK} />
            <path d="M -1 -12 q -6 -10 -10 -10 M 1 -12 q 6 -10 10 -10" fill="none" strokeWidth={1.8} />
          </g>
        </g>
      );
    case 'birds':
      return (
        <g className="bob">
          {[
            [0, 0, '#91C8E9'],
            [44, -18, '#FF875F'],
          ].map(([x, y, c]) => (
            <g key={String(x)} transform={`translate(${x} ${y})`} stroke={INK} strokeWidth={2.5} strokeLinejoin="round">
              <ellipse rx={16} ry={12} fill={c as string} />
              <circle cx={12} cy={-8} r={8} fill={c as string} />
              <path d="M 19 -9 l 8 3 l -8 3 z" fill="#FFD45E" />
              <circle cx={14} cy={-10} r={1.8} fill={INK} />
              <path d="M -4 -4 q -10 -12 -18 -2" fill="none" />
            </g>
          ))}
          <path d="M -30 16 Q 30 8 90 14" stroke="#8A5A3B" strokeWidth={6} fill="none" strokeLinecap="round" />
        </g>
      );
    case 'swing':
      return (
        <g stroke={INK} strokeWidth={3.5} strokeLinejoin="round" fill="none">
          <path d="M -80 0 L -60 -190 L 60 -190 L 80 0" stroke="#D9533D" strokeWidth={9} strokeLinecap="round" />
          <path d="M -80 0 L -60 -190 L 60 -190 L 80 0" />
          <g className="swing-seat">
            <path d="M -22 -186 L -22 -58 M 22 -186 L 22 -58" strokeWidth={2.5} />
            <rect x={-30} y={-60} width={60} height={12} rx={4} fill="#FFD45E" />
          </g>
        </g>
      );
    case 'flowers':
      return (
        <g>
          <ellipse cx={0} cy={0} rx={90} ry={22} fill="#8A5A3B" stroke={INK} strokeWidth={3} />
          {Array.from({ length: 9 }).map((_, i) => {
            const x = -70 + i * 17;
            const h = 24 + (i % 3) * 8;
            const c = ['#FF875F', '#FFD45E', '#B7A1E8', '#F7A7B5', '#D9533D'][i % 5];
            return (
              <g key={i} transform={`translate(${x} -4)`} stroke={INK} strokeWidth={2}>
                <path d={`M 0 0 L 0 ${-h}`} stroke="#3F8A4F" strokeWidth={3} />
                {[0, 72, 144, 216, 288].map((a) => (
                  <ellipse key={a} cx={0} cy={-h - 7} rx={4.5} ry={7} fill={c} transform={`rotate(${a} 0 ${-h})`} />
                ))}
                <circle cy={-h} r={4} fill="#FFF3D7" />
              </g>
            );
          })}
        </g>
      );
    case 'books':
      return (
        <g stroke={INK} strokeWidth={3}>
          <rect x={-40} y={-16} width={80} height={16} rx={3} fill="#67916C" />
          <rect x={-34} y={-32} width={70} height={16} rx={3} fill="#FFD45E" />
          <rect x={-38} y={-48} width={76} height={16} rx={3} fill="#B7A1E8" />
          <path d="M -26 -78 L 0 -66 L 26 -78 L 26 -50 L 0 -38 L -26 -50 Z" fill="#FFF9EE" />
          <path d="M 0 -66 L 0 -38" />
        </g>
      );
    case 'card':
      return (
        <g stroke={INK} strokeWidth={3}>
          <rect x={-36} y={-24} width={72} height={48} rx={6} fill="#FFF9EE" />
          <rect x={-36} y={-24} width={72} height={14} rx={6} fill="#245742" />
          <circle cx={-18} cy={6} r={9} fill="#B7A1E8" strokeWidth={2} />
          <path d="M -2 2 L 26 2 M -2 12 L 18 12" strokeWidth={2.5} />
        </g>
      );
    case 'scale':
      return (
        <g stroke={INK} strokeWidth={3} strokeLinejoin="round">
          <rect x={-46} y={-30} width={92} height={46} rx={10} fill="#FFF9EE" />
          <circle cx={0} cy={-8} r={16} fill="#FFF" />
          <path className="needle" d="M 0 -8 L 10 -20" strokeLinecap="round" stroke="#D9533D" />
          <ellipse cx={0} cy={-38} rx={52} ry={9} fill="#C9CED3" />
          <g fill="#E0453A" strokeWidth={2}>
            <circle cx={-22} cy={-52} r={10} />
            <circle cx={0} cy={-55} r={10} />
            <circle cx={22} cy={-52} r={10} />
            <circle cx={-10} cy={-68} r={10} />
            <circle cx={12} cy={-68} r={10} />
          </g>
        </g>
      );
    case 'fruit':
      return (
        <g stroke={INK} strokeWidth={3}>
          <path d="M -50 0 L -42 -40 L 42 -40 L 50 0 Z" fill="#C98B5A" />
          <g strokeWidth={2}>
            {[-30, -10, 10, 30].map((x, i) => (
              <circle key={x} cx={x} cy={-46} r={11} fill={['#FFB02E', '#E0453A', '#F5D547', '#9BC53D'][i]} />
            ))}
          </g>
        </g>
      );
    case 'basket':
      return (
        <g stroke={INK} strokeWidth={3} strokeLinejoin="round">
          <path d="M -30 -40 Q 0 -80 30 -40" fill="none" strokeWidth={5} />
          <circle cx={-12} cy={-42} r={10} fill="#E0453A" strokeWidth={2} />
          <circle cx={10} cy={-44} r={10} fill="#F5D547" strokeWidth={2} />
          <path d="M -38 -38 L 38 -38 L 30 0 L -30 0 Z" fill="#E3B987" />
          <path d="M -34 -24 L 34 -24 M -31 -10 L 31 -10" strokeWidth={2} />
        </g>
      );
    case 'chair':
      return (
        <g stroke={INK} strokeWidth={3} strokeLinejoin="round">
          <rect x={-36} y={-120} width={14} height={120} rx={4} fill="#C98B5A" />
          <rect x={-40} y={-58} width={80} height={14} rx={4} fill="#E3B987" />
          <rect x={28} y={-44} width={10} height={44} rx={3} fill="#C98B5A" />
          <rect x={-36} y={-44} width={10} height={44} rx={3} fill="#C98B5A" />
        </g>
      );
    case 'table':
      return (
        <g stroke={INK} strokeWidth={3} strokeLinejoin="round">
          <rect x={-90} y={-76} width={180} height={16} rx={6} fill="#C98B5A" />
          <path d="M -80 -62 L -90 -60 L -84 0 L -74 0 Z M 80 -62 L 90 -60 L 84 0 L 74 0 Z" fill="#9A6A42" />
          <path d="M -86 -60 Q 0 -40 86 -60" fill="none" stroke="#F7A7B5" strokeWidth={5} />
        </g>
      );
    case 'gift':
      return (
        <g stroke={INK} strokeWidth={3} strokeLinejoin="round">
          <rect x={-34} y={-56} width={68} height={56} rx={4} fill="#D9533D" />
          <rect x={-38} y={-66} width={76} height={14} rx={3} fill="#E06A52" />
          <path d="M 0 -66 L 0 0" stroke="#FFD45E" strokeWidth={8} />
          <path d="M 0 -66 q -24 -24 -26 -6 q 6 12 26 6 q 24 -24 26 -6 q -6 12 -26 6" fill="#FFD45E" />
          <g fill="#FFF3B8" stroke="none" opacity={0.8}>
            <circle cx={-20} cy={-30} r={3} />
            <circle cx={18} cy={-18} r={3} />
            <circle cx={-14} cy={-10} r={2.5} />
          </g>
        </g>
      );
    case 'balloons':
      return (
        <g stroke={INK} strokeWidth={2.5}>
          {[
            [-34, -150, '#FF875F'],
            [0, -190, '#FFD45E'],
            [34, -156, '#B7A1E8'],
            [-8, -120, '#91C8E9'],
          ].map(([dx, dy, c]) => (
            <g key={String(c)} className="bob">
              <path d={`M 0 0 Q ${(dx as number) / 2} ${(dy as number) / 2} ${dx} ${(dy as number) + 26}`} fill="none" strokeWidth={1.5} />
              <ellipse cx={dx as number} cy={dy as number} rx={24} ry={28} fill={c as string} />
              <ellipse cx={(dx as number) - 8} cy={(dy as number) - 10} rx={6} ry={8} fill="#fff" opacity={0.5} stroke="none" />
            </g>
          ))}
          <rect x={-8} y={-6} width={16} height={8} rx={2} fill="#245742" />
        </g>
      );
    case 'garland':
      return (
        <g stroke={INK} strokeWidth={2}>
          <path d="M -260 0 Q 0 60 260 0" fill="none" />
          {Array.from({ length: 11 }).map((_, i) => {
            const t = i / 10;
            const x = -260 + 520 * t;
            const y = 60 * 2 * t * (1 - t);
            return <path key={i} d={`M ${x - 13} ${y} L ${x + 13} ${y} L ${x} ${y + 26} Z`} fill={['#FF875F', '#FFD45E', '#91C8E9', '#B7A1E8', '#67916C'][i % 5]} strokeLinejoin="round" />;
          })}
        </g>
      );
    case 'door':
      return (
        <g stroke={INK} strokeWidth={3} strokeLinejoin="round">
          <rect x={-58} y={-250} width={116} height={250} rx={6} fill="#9A6A42" />
          <rect x={-48} y={-240} width={96} height={240} fill="#FFF3D7" />
          <path d="M -48 -240 L -48 0 L -88 14 L -88 -224 Z" fill="#245742" />
          <circle cx={-78} cy={-110} r={5} fill="#FFD45E" />
        </g>
      );
    case 'invites':
      return (
        <g stroke={INK} strokeWidth={2.5} strokeLinejoin="round">
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${-44 + i * 26} ${-8 - i * 4}) rotate(${-8 + i * 8})`}>
              <rect x={0} y={-30} width={48} height={34} rx={3} fill={['#FFF9EE', '#F7A7B5', '#FFF3B8'][i]} />
              <path d="M 0 -30 L 24 -10 L 48 -30" fill="none" />
              <circle cx={24} cy={-9} r={4.5} fill="#D9533D" strokeWidth={1.5} />
            </g>
          ))}
        </g>
      );
    case 'counter':
      return (
        <g stroke={INK} strokeWidth={3} strokeLinejoin="round">
          <rect x={-90} y={-112} width={180} height={16} rx={5} fill="#C98B5A" />
          <rect x={-82} y={-96} width={164} height={96} fill="#245742" />
          <rect x={-66} y={-80} width={132} height={60} rx={6} fill="#2F6B52" strokeWidth={2} />
          <g transform="translate(-50 -112)" strokeWidth={2}>
            <rect x={0} y={-14} width={14} height={14} fill="#FFD45E" />
            <rect x={16} y={-18} width={12} height={18} fill="#FF875F" />
          </g>
        </g>
      );
    case 'bench':
      return (
        <g stroke={INK} strokeWidth={3} strokeLinejoin="round">
          <rect x={-80} y={-50} width={160} height={14} rx={4} fill="#C98B5A" />
          <rect x={-84} y={-30} width={168} height={14} rx={4} fill="#C98B5A" />
          <path d="M -66 -16 L -70 0 M 66 -16 L 70 0" strokeWidth={6} />
        </g>
      );
  }
}

export function KidScene({
  background,
  characters,
  props = [],
  label,
  className = '',
}: {
  background: KidBackground;
  characters: SceneCharacter[];
  props?: SceneProp[];
  label?: string;
  className?: string;
}) {
  const Bg = BACKGROUNDS[background];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={'kid-scene ' + className} role="img" aria-label={label} preserveAspectRatio="xMidYMid slice">
      <Bg />
      {props
        .filter((p) => p.y <= 300)
        .map((p, i) => (
          <g key={'pb' + i} transform={`translate(${p.x} ${p.y}) scale(${p.scale ?? 1})`}>
            <Prop id={p.id} />
          </g>
        ))}
      {[...characters].sort((a, b) => (a.y ?? 405) - (b.y ?? 405)).map((c) =>
        c.id === 'dhaw' ? null : (
          <g key={c.id} className="char-enter">
            <KidCharacter id={c.id} expression={c.expression} x={c.x} y={c.y} scale={c.scale ?? 1} flip={c.flip} holding={c.holding} backpack={c.backpack} />
          </g>
        ),
      )}
      {props
        .filter((p) => p.y > 300)
        .map((p, i) => (
          <g key={'pf' + i} transform={`translate(${p.x} ${p.y}) scale(${p.scale ?? 1})`}>
            <Prop id={p.id} />
          </g>
        ))}
      <Grain w={W} h={H} />
    </svg>
  );
}
