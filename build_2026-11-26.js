// 카드뉴스 2026-11-26 — "서울 떠나도 경기 전세도 귀하다"
// node build.js  → out/instagram_2026-11-26_{n}of5.png (1080x1350), out/threads_2026-11-26_{n}of5.png (1080x1080)
const { chromium } = require('playwright');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const DATE = '2026-11-26';
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

function bars(items, max, w = 820) {
  // horizontal bars
  return items.map(it => `
    <div class="bar-row">
      <div class="bar-label">${it.label}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${(it.v / max) * 100}%;background:${it.color}"></div></div>
      <div class="bar-val" style="color:${it.color}">${it.v.toFixed(2)}%</div>
    </div>`).join('');
}

// ---------- cards ----------
const won = n => n.toLocaleString('en-US');
function cntBars(items, max) {
  return items.map(it => `
    <div class="bar-row">
      <div class="bar-label">${it.label}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${(it.v / max) * 100}%;background:${it.color}"></div></div>
      <div class="bar-val" style="color:${it.color}">${won(it.v)}건</div>
    </div>`).join('');
}
const gyeonggiIllo = (w = 760) => `
<svg viewBox="0 0 760 300" width="${w}" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="270" width="760" height="30" fill="${C.line}"/>
  <rect x="30" y="90" width="150" height="180" fill="#B9C1D0"/>
  ${[0,1,2,3,4].map(r=>[0,1,2].map(c=>`<rect x="${48+c*44}" y="${106+r*34}" width="26" height="20" fill="#EEF1F6"/>`).join('')).join('')}
  <rect x="230" y="50" width="150" height="220" fill="${C.ink}"/>
  ${[0,1,2,3,4,5].map(r=>[0,1,2].map(c=>`<rect x="${248+c*44}" y="${66+r*34}" width="26" height="20" fill="#fff"/>`).join('')).join('')}
  <path d="M190 170 L215 170" stroke="${C.mute}" stroke-width="8" stroke-linecap="round"/>
  <path d="M440 220 L520 160 L580 190 L700 80" fill="none" stroke="${C.red}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M660 72 L716 62 L706 122 Z" fill="${C.red}"/>
  <text x="105" y="70" text-anchor="middle" font-size="28" font-weight="700" fill="${C.mute}">서울</text>
  <text x="305" y="34" text-anchor="middle" font-size="28" font-weight="700" fill="${C.ink}">경기</text>
  <text x="570" y="262" text-anchor="middle" font-size="28" font-weight="700" fill="${C.red}">전셋값</text>
</svg>`;

function cards(k) {
  return [
  // 1 HOOK
  `<div class="badge">경기 아파트 전세 · 11월</div>
   <h1 class="hook">서울 떠나도<br>경기 전세도<br><span class="red">귀하다</span></h1>
   <div class="illo">${gyeonggiIllo(Math.round(820*k))}</div>
   <div class="hook-sub"><b>전세 매물</b> <span class="red">-28.8%</span> · <b>올해 전셋값</b> <span class="red">+6.88%</span></div>`,

  // 2 RENT BARS
  `<div class="kicker">경기 아파트 전셋값 · 올해 누계</div>
   <h2>경기 평균 <span class="red">6.88%</span>,<br>광명은 16%대</h2>
   <div class="panel">
     ${bars([
       { label: '경기 평균', v: 6.88, color: C.ink },
       { label: '광명', v: 16.23, color: C.red },
       { label: '동탄(화성)', v: 16.06, color: C.red },
       { label: '기흥(용인)', v: 14.26, color: '#8A93A6' },
       { label: '하남', v: 12.49, color: '#8A93A6' },
     ], 18)}
     <div class="note">한국부동산원 11월 3주(16일 기준)</div>
   </div>
   <p class="body">작년 같은 기간 경기 평균은 <b>1.29%</b>.<br>올해는 5배 넘게 올랐어요.</p>`,

  // 3 LISTINGS
  `<div class="kicker">경기 아파트 전세 매물</div>
   <h2>1년 새 매물<br><span class="red">28.8%</span> 사라졌다</h2>
   <div class="panel duo">
     <div class="col"><div class="col-h">경기 전체</div><div class="vbars">
       <div class="vb"><div class="vb-val">19,029</div><div class="vb-bar" style="height:${250*k}px;background:#C9CFDA"></div><div class="vb-y">1년 전</div></div>
       <div class="vb"><div class="vb-val red">13,558</div><div class="vb-bar" style="height:${13558/19029*250*k}px;background:${C.red}"></div><div class="vb-y">11/24</div></div>
     </div></div>
     <div class="col"><div class="col-h">광명</div><div class="vbars">
       <div class="vb"><div class="vb-val">1,955</div><div class="vb-bar" style="height:${250*k}px;background:#C9CFDA"></div><div class="vb-y">1년 전</div></div>
       <div class="vb"><div class="vb-val red">585</div><div class="vb-bar" style="height:${585/1955*250*k}px;background:${C.red}"></div><div class="vb-y">11/24</div></div>
     </div></div>
   </div>
   <p class="body">광명은 <b>-70.1%</b>, 과천 -61.6%·군포 -54.3%<br><span class="sm">출처: 부동산 빅데이터 업체 아실(뉴시스 인용)</span></p>`,

  // 4 WHY
  `<div class="kicker">왜 이렇게 부족할까</div>
   <h2>서울에서 경기로<br><span class="red">더 많이</span> 넘어왔다</h2>
   <div class="facts">
     <div class="fact">${icon.key}<div><div class="f-t">전세수급지수 <span class="red">110.7</span></div><div class="f-s">2021년 8월 이후 최고 · 11월 2주(한국부동산원)</div></div></div>
     <div class="fact">${icon.pin}<div><div class="f-t">서울→경기 순이동 <span class="red">3만 8,394명</span></div><div class="f-s">작년 1~9월 2만 7,374명, +40.3%(국가데이터처)</div></div></div>
     <div class="fact">${icon.apt}<div><div class="f-t">서울→경기 22만 3,416명</div><div class="f-s">경기→서울 18만 5,022명 (올해 1~9월)</div></div></div>
   </div>
   <p class="body sm">수급지수는 100을 넘으면 전세 수요가 공급보다 많다는 뜻이에요.</p>`,

  // 5 CHECK + CTA
  `<div class="kicker">전문가는 이렇게 봐요</div>
   <div class="checks">
     <div class="chk">${icon.swap}<div>서울 전셋값 오르자 <b>임대 수요가 경기로 이동</b></div></div>
     <div class="chk">${icon.pct}<div>공급 대책 없으면 <b>월세 전환·주거비 부담</b> 우려(박원갑 KB 수석전문위원)</div></div>
   </div>
   <div class="cta">
     <div class="cta-q">전세 만기가 다가온다면,<br>어떻게 하실래요?</div>
     <div class="opts"><div class="opt">① 같은 동네 재계약</div><div class="opt">② 더 먼 곳으로 이동</div><div class="opt">③ 월세로 전환</div></div>
     <div class="cta-s">💬 번호로 댓글 남겨주세요</div>
   </div>
   <div class="src">출처: 뉴시스(파이낸셜뉴스 11/25) · 한국부동산원·아실·국가데이터처 인용 · 투자 권유 아님</div>`,
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
  .bar-val{font-size:${s(38)};font-weight:900;text-align:right}
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
  .sm{font-size:${s(30)};color:${C.mute};font-weight:500}
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
