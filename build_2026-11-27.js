// 카드뉴스 2026-11-27 — "94주째 상승인데 상승률 0.01%"
// node build.js  → out/instagram_2026-11-27_{n}of5.png (1080x1350), out/threads_2026-11-27_{n}of5.png (1080x1080)
const { chromium } = require('playwright');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const DATE = '2026-11-27';
const N = 5;
const OUT = path.join(__dirname, 'out');
fs.mkdirSync(OUT, { recursive: true });

const C = { bg: '#F4F1EA', ink: '#0E2A5C', red: '#D12828', mute: '#6B7385', line: '#D9D3C4', card: '#FFFFFF', soft: '#E7EDF7', villa: '#E9A23B' };

// ---------- SVG illustrations ----------
const villaRow = (w = 760) => `
<svg viewBox="0 0 760 330" width="${w}" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="300" width="760" height="30" fill="${C.line}"/>
  <!-- apartment tower (grey, left) -->
  <rect x="20" y="70" width="150" height="230" fill="#B9C1D0"/>
  ${[0,1,2,3,4,5].map(r=>[0,1,2].map(c=>`<rect x="${38+c*44}" y="${88+r*34}" width="26" height="20" fill="#EEF1F6"/>`).join('')).join('')}
  <text x="95" y="60" text-anchor="middle" font-size="26" font-weight="700" fill="${C.mute}">아파트</text>
  <!-- villas -->
  ${[0,1,2].map(i=>{const x=200+i*170, h=[170,200,150][i], y=300-h, col=['#F2C27A','#E9A23B','#F5D29B'][i];
    return `<rect x="${x}" y="${y}" width="150" height="${h}" fill="${col}"/>
    <rect x="${x-6}" y="${y-14}" width="162" height="16" fill="${C.ink}"/>
    ${[0,1,2,3].filter(r=>y+20+r*42<280).map(r=>[0,1].map(c=>`<rect x="${x+22+c*62}" y="${y+22+r*42}" width="44" height="26" fill="#FFF8EC" stroke="${C.ink}" stroke-width="3"/>`).join('')).join('')}
    <rect x="${x+58}" y="262" width="34" height="38" fill="${C.ink}"/>`}).join('')}
  <text x="455" y="80" text-anchor="middle" font-size="28" font-weight="900" fill="${C.ink}">빌라(연립·다세대)</text>
  <!-- rising arrow -->
  <path d="M210 250 L360 190 L450 215 L640 90" fill="none" stroke="${C.red}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M600 80 L668 70 L652 136 Z" fill="${C.red}"/>
</svg>`;

const icon = {
  apt: `<svg viewBox="0 0 64 64" width="72"><rect x="12" y="8" width="40" height="52" rx="3" fill="${C.ink}"/>${[0,1,2,3].map(r=>[0,1].map(c=>`<rect x="${20+c*16}" y="${16+r*10}" width="8" height="6" fill="#fff"/>`).join('')).join('')}</svg>`,
  key: `<svg viewBox="0 0 64 64" width="72"><circle cx="22" cy="32" r="14" fill="none" stroke="${C.ink}" stroke-width="7"/><path d="M34 32 H58 M50 32 V42 M58 32 V42" stroke="${C.ink}" stroke-width="7" stroke-linecap="round"/></svg>`,
  pin: `<svg viewBox="0 0 64 64" width="72"><path d="M32 60 C32 60 12 38 12 24 A20 20 0 0 1 52 24 C52 38 32 60 32 60Z" fill="${C.red}"/><circle cx="32" cy="24" r="8" fill="#fff"/></svg>`,
  doc: `<svg viewBox="0 0 64 64" width="64"><path d="M14 6 H40 L52 18 V58 H14 Z" fill="#fff" stroke="${C.ink}" stroke-width="5"/><path d="M22 28 H44 M22 38 H44 M22 48 H36" stroke="${C.ink}" stroke-width="4"/></svg>`,
  pct: `<svg viewBox="0 0 64 64" width="64"><circle cx="32" cy="32" r="26" fill="#fff" stroke="${C.ink}" stroke-width="5"/><path d="M22 44 L42 20" stroke="${C.red}" stroke-width="5" stroke-linecap="round"/><circle cx="23" cy="24" r="5" fill="${C.ink}"/><circle cx="41" cy="40" r="5" fill="${C.ink}"/></svg>`,
  swap: `<svg viewBox="0 0 64 64" width="64"><circle cx="32" cy="32" r="26" fill="#fff" stroke="${C.ink}" stroke-width="5"/><path d="M18 26 H44 L38 20 M46 38 H20 L26 44" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

const flatSvg = (w = 760) => `
<svg viewBox="0 0 760 300" width="${w}" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="270" width="760" height="30" fill="${C.line}"/>
  <path d="M30 60 L190 70 L330 110 L470 165 L600 205 L730 215" fill="none" stroke="${C.ink}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M30 215 L730 215" stroke="${C.red}" stroke-width="5" stroke-dasharray="14 12"/>
  ${[['0.13%',30,60],['0.03%',470,165],['0.01%',730,215]].map(([t,x,y])=>`<circle cx="${x}" cy="${y}" r="14" fill="${t==='0.01%'?C.red:C.ink}"/><text x="${Math.min(Math.max(x,70),690)}" y="${y-28}" text-anchor="middle" font-size="34" font-weight="900" fill="${t==='0.01%'?C.red:C.ink}">${t}</text>`).join('')}
</svg>`;

function sbars(items, max) {
  return items.map(it => `
    <div class="bar-row">
      <div class="bar-label">${it.label}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${(Math.abs(it.v) / max) * 100}%;background:${it.color}"></div></div>
      <div class="bar-val" style="color:${it.color}">${it.v > 0 ? '+' : '-'}${Math.abs(it.v).toFixed(2)}%</div>
    </div>`).join('');
}

function cards(k) {
  return [
  `<div class="badge">한국부동산원 11월 4주 · 11/23 기준</div>
   <h1 class="hook">94주째 상승인데<br>상승률이<br><span class="red">0.01%?</span></h1>
   <div class="illo">${flatSvg(Math.round(820*k))}</div>
   <div class="hook-sub"><b>서울 아파트 매매</b>  전주 0.03% → <span class="red">0.01%</span></div>`,

  `<div class="kicker">서울 아파트 매매 · 주간 변동률</div>
   <h2>강남3구는<br><span class="red">이미 하락 중</span></h2>
   <div class="panel">
     ${sbars([
       { label: '송파구', v: -0.50, color: C.red },
       { label: '강남구', v: -0.34, color: C.red },
       { label: '서초구', v: -0.30, color: C.red },
     ], 0.55)}
     <div class="note">한국부동산원, 11월 4주(11/23 기준)</div>
   </div>
   <p class="body">하락 구는 서울 25개 중 <b>9곳</b>까지 늘었어요.</p>`,

  `<div class="kicker">같은 주, 강북은 반대로</div>
   <h2>강북 14개 구는<br><span class="red">+0.15%</span> 올랐다</h2>
   <div class="panel">
     ${sbars([
       { label: '성북구', v: 0.33, color: C.ink },
       { label: '노원구', v: 0.27, color: C.ink },
       { label: '서대문구', v: 0.25, color: C.ink },
     ], 0.4)}
     <div class="note">한국부동산원, 11월 4주(11/23 기준)</div>
   </div>
   <p class="body">서울 안에서도 <b>강남 하락·강북 상승</b>으로 온도차가 커요.</p>`,

  `<div class="kicker">숫자로 보는 배경</div>
   <h2>금리는 오르고<br>매수세는 <span class="red">주춤</span></h2>
   <div class="facts">
     <div class="fact">${icon.pct}<div><div class="f-t">기준금리 <span class="red">3.00→3.25%</span></div><div class="f-s">한국은행, 11/26 인상</div></div></div>
     <div class="fact">${icon.apt}<div><div class="f-t">서울 매물 <span class="red">약 8.3만 건</span></div><div class="f-s">연초 대비 +45.6% (국토부 발표)</div></div></div>
     <div class="fact">${icon.key}<div><div class="f-t">서울 전셋값 <span class="red">+0.14%</span></div><div class="f-s">전주와 같은 주간 상승률</div></div></div>
   </div>
   <div class="trend">
     <div class="trend-h">서울 상승폭은 <b>6주 연속 축소</b></div>
     <div class="trend-row">${[['10월 3주','0.13'],['11월 3주','0.03'],['11월 4주','0.01']].map(([m,v])=>`<div class="tr"><div class="tr-v">${v}%</div><div class="tr-m">${m}</div></div>`).join('<div class="tr-arrow">›</div>')}</div>
   </div>`,

  `<div class="kicker">전문가 시각</div>
   <div class="checks">
     <div class="chk">${icon.pct}<div>함영진 우리은행 랩장 <b>곧 보합 근접 전망</b></div></div>
     <div class="chk">${icon.pin}<div>다만 <b>외곽·중저가는 아직 강세</b></div></div>
     <div class="chk">${icon.swap}<div>매수 심리 위축은 <b>연말까지 이어질 수도</b></div></div>
   </div>
   <div class="cta">
     <div class="cta-q">서울 집값, 이제 어디로?</div>
     <div class="opts"><div class="opt">① 보합 후 조정</div><div class="opt">② 외곽은 계속 상승</div><div class="opt">③ 금리에 달렸다</div></div>
     <div class="cta-s">💬 번호로 댓글 남겨주세요</div>
   </div>
   <div class="src">출처: 한국부동산원 11월 4주 주간동향(11/26 발표) · 서울신문·뉴스웍스·이투데이 11/27 · 투자 권유 아님</div>`,
  ];
}

function html(body, n, W, H, k) {
  const s = v => `${Math.round(v * k)}px`;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{width:${W}px;height:${H}px;background:${C.bg};font-family:'Noto Sans CJK KR','Noto Sans KR',sans-serif;color:${C.ink};overflow:hidden}
  .frame{position:absolute;inset:0;padding:${s(72)} ${s(76)} ${s(64)};display:flex;flex-direction:column;gap:${s(26)}}
  .safe{flex:1;display:flex;flex-direction:column;gap:${s(26)};justify-content:center}
  .top{display:flex;justify-content:space-between;align-items:center;font-size:${s(26)};font-weight:700;color:${C.mute}}
  .brandline{display:flex;align-items:center;gap:12px}.brandline i{width:${s(14)};height:${s(14)};background:${C.red};border-radius:50%;display:block}
  .cnt{width:${s(64)};height:${s(64)};border-radius:50%;background:${C.ink};color:#fff;display:flex;align-items:center;justify-content:center;font-size:${s(24)}}
  .red{color:${C.red}} .ink{color:${C.ink}}
  .badge{align-self:flex-start;background:${C.ink};color:#fff;font-size:${s(30)};font-weight:700;padding:${s(12)} ${s(26)};border-radius:999px}
  .hook{font-size:${s(124)};line-height:1.12;font-weight:900;letter-spacing:-2px}
  .illo{display:flex;justify-content:center}
  .hook-sub{font-size:${s(36)};font-weight:700;background:#fff;border:3px solid ${C.ink};border-radius:${s(20)};padding:${s(20)} ${s(28)};text-align:center}
  .kicker{font-size:${s(32)};font-weight:700;color:${C.red}}
  h2{font-size:${s(84)};line-height:1.18;font-weight:900;letter-spacing:-1.5px}
  .panel{background:${C.card};border-radius:${s(28)};padding:${s(40)} ${s(36)};display:flex;flex-direction:column;gap:${s(30)};box-shadow:0 6px 0 ${C.line}}
  .bar-row{display:grid;grid-template-columns:${s(230)} 1fr ${s(150)};align-items:center;gap:${s(18)}}
  .bar-label{font-size:${s(34)};font-weight:700}
  .bar-track{height:${s(56)};background:${C.soft};border-radius:${s(12)};overflow:hidden}
  .bar-fill{height:100%;border-radius:${s(12)}}
  .bar-val{font-size:${s(46)};font-weight:900;text-align:right}
  .note{font-size:${s(28)};color:${C.mute};text-align:right}
  .body{font-size:${s(40)};line-height:1.5;font-weight:500}
  .duo{flex-direction:row;justify-content:space-around;align-items:flex-end;padding-bottom:${s(30)}}
  .col{display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:${s(16)}}
  .vb-val.red{color:${C.red}} .vb-val.ink{color:${C.ink}}
  .col-h{font-size:${s(34)};font-weight:900}
  .vbars{display:flex;gap:${s(36)};align-items:flex-end}
  .vb{display:flex;flex-direction:column;align-items:center;gap:${s(10)}}
  .vb-bar{width:${s(110)};border-radius:${s(12)} ${s(12)} 0 0}
  .vb-val{font-size:${s(38)};font-weight:900;color:${C.mute}}
  .vb-y{font-size:${s(30)};font-weight:700;color:${C.mute}}
  .facts{display:flex;flex-direction:column;gap:${s(20)}}
  .fact{display:flex;align-items:center;gap:${s(26)};background:#fff;border-radius:${s(24)};padding:${s(24)} ${s(30)}}
  .fact svg{width:${s(72)};height:${s(72)};flex:none}
  .f-t{font-size:${s(42)};font-weight:900}
  .f-s{font-size:${s(30)};color:${C.mute};margin-top:4px}
  .trend{border:3px dashed ${C.ink};border-radius:${s(24)};padding:${s(24)} ${s(28)};display:flex;flex-direction:column;gap:${s(16)}}
  .trend-h{font-size:${s(34)}}
  .trend-row{display:flex;justify-content:space-between;align-items:center}
  .tr{text-align:center}.tr-v{font-size:${s(42)};font-weight:900}.tr-m{font-size:${s(28)};color:${C.mute}}
  .tr:last-child .tr-v{color:${C.red}}
  .tr-arrow{font-size:${s(48)};color:${C.mute}}
  .checks{display:flex;flex-direction:column;gap:${s(16)}}
  .chk{display:flex;align-items:center;gap:${s(22)};font-size:${s(38)};background:#fff;border-radius:${s(22)};padding:${s(18)} ${s(26)}}
  .chk svg{width:${s(60)};height:${s(60)};flex:none}
  .cta{background:${C.ink};color:#fff;border-radius:${s(30)};padding:${s(36)};display:flex;flex-direction:column;gap:${s(20)}}
  .cta-q{font-size:${s(64)};font-weight:900}
  .opts{display:flex;flex-direction:column;gap:${s(12)}}
  .opt{background:rgba(255,255,255,.12);border-radius:${s(16)};padding:${s(14)} ${s(24)};font-size:${s(40)};font-weight:700}
  .cta-s{font-size:${s(36)};font-weight:700;color:#FFD3D3}
  .src{font-size:${s(24)};color:${C.mute};line-height:1.4}
  </style></head><body><div class="frame">
    <div class="top"><div class="brandline"><i></i>오늘의 부동산 카드</div><div class="cnt">${n}/${N}</div></div>
    <div class="safe">${body}</div>
  </div></body></html>`;
}

(async () => {
  const browser = await chromium.launch();
  const sets = [
    { name: 'instagram', W: 1080, H: 1350, k: 1 },
    { name: 'threads', W: 1080, H: 1080, k: 0.78 },
  ];
  let problems = [];
  for (const set of sets) {
    const page = await browser.newPage({ viewport: { width: set.W, height: set.H }, deviceScaleFactor: 2 });
    const list = cards(set.k);
    for (let i = 0; i < list.length; i++) {
      await page.setContent(html(list[i], i + 1, set.W, set.H, set.k), { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      const of = await page.evaluate(() => {
        const safe = document.querySelector('.safe').getBoundingClientRect();
        const frame = document.querySelector('.frame');
        const bad = [];
        document.querySelectorAll('.safe *').forEach(el => {
          const r = el.getBoundingClientRect();
          if (r.width && (r.bottom > window.innerHeight - 40 || r.right > window.innerWidth - 40 || r.top < 0)) bad.push(el.className || el.tagName);
        });
        const sh = document.querySelector('.safe');
        if (sh.scrollHeight > sh.clientHeight + 2) bad.push('safe-overflow:' + (sh.scrollHeight - sh.clientHeight));
        return bad;
      });
      if (of.length) problems.push(`${set.name} ${i + 1}: ${[...new Set(of)].join(',')}`);
      const buf = await page.screenshot();
      const file = path.join(OUT, `${set.name}_${DATE}_${i + 1}of${N}.png`);
      await sharp(buf).resize(set.W, set.H).png().toFile(file);
      await sharp(buf).resize(set.W, set.H).jpeg({ quality: 92 }).toFile(file.replace('.png', '.jpg'));
    }
    await page.close();
  }
  await browser.close();
  console.log(problems.length ? 'OVERFLOW:\n' + problems.join('\n') : 'overflowCount 0');
})();
