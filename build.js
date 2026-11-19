// 카드뉴스 2026-11-19 — "서울 아파트 7곳이 떨어졌다"
// node build.js  → out/instagram_2026-11-19_{n}of5.png (1080x1350), out/threads_2026-11-19_{n}of5.png (1080x1080)
const { chromium } = require('playwright');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const DATE = '2026-11-19';
const N = 5;
const OUT = path.join(__dirname, 'out');
fs.mkdirSync(OUT, { recursive: true });

const C = { bg: '#F4F1EA', ink: '#0E2A5C', red: '#D12828', mute: '#6B7385', line: '#D9D3C4', card: '#FFFFFF', soft: '#E7EDF7', villa: '#E9A23B' };

// ---------- SVG illustrations ----------
const skyline = (w = 760) => `
<svg viewBox="0 0 760 300" width="${w}" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="270" width="760" height="30" fill="${C.line}"/>
  ${[[30,150],[130,210],[230,120],[330,190],[430,140],[530,170],[630,110]].map(([x,h],i)=>`<rect x="${x}" y="${270-h}" width="80" height="${h}" fill="${i%2?'#B9C1D0':C.ink}"/>${[0,1,2,3].filter(r=>r*36+24<h-20).map(r=>`<rect x="${x+16}" y="${270-h+16+r*36}" width="18" height="16" fill="#EEF1F6"/><rect x="${x+46}" y="${270-h+16+r*36}" width="18" height="16" fill="#EEF1F6"/>`).join('')}`).join('')}
  <path d="M60 40 L250 110 L360 80 L600 200" fill="none" stroke="${C.red}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M640 215 L560 205 L600 150 Z" fill="${C.red}"/>
</svg>`;

const icon = {
  home: `<svg viewBox="0 0 64 64" width="72"><path d="M8 30 L32 8 L56 30 V56 H8 Z" fill="${C.ink}"/><rect x="26" y="36" width="12" height="20" fill="#fff"/></svg>`,
  key: `<svg viewBox="0 0 64 64" width="72"><circle cx="22" cy="32" r="14" fill="none" stroke="${C.ink}" stroke-width="7"/><path d="M34 32 H58 M50 32 V42 M58 32 V42" stroke="${C.ink}" stroke-width="7" stroke-linecap="round"/></svg>`,
  pin: `<svg viewBox="0 0 64 64" width="72"><path d="M32 60 C32 60 12 38 12 24 A20 20 0 0 1 52 24 C52 38 32 60 32 60Z" fill="${C.red}"/><circle cx="32" cy="24" r="8" fill="#fff"/></svg>`,
};

function negBars(items, max) {
  return items.map(it => `
    <div class="bar-row">
      <div class="bar-label">${it.label}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${(Math.abs(it.v) / max) * 100}%;background:${it.color}"></div></div>
      <div class="bar-val" style="color:${it.color}">${it.v.toFixed(2)}%</div>
    </div>`).join('');
}

// ---------- cards ----------
function cards(k) {
  const trend = [['10/12','0.16'],['10/19','0.13'],['10/26','0.09'],['11/2','0.07'],['11/9','0.07'],['11/16','0.03']];
  return [
  // 1 HOOK
  `<div class="badge">한국부동산원 11월 3주 주간동향</div>
   <h1 class="hook">서울 아파트<br><span class="red">7곳</span>이<br>떨어졌다</h1>
   <div class="illo">${skyline(Math.round(820*k))}</div>
   <div class="hook-sub"><b>서울 이번 주</b> <span class="red">+0.03%</span> · 하락 구 5곳 → <span class="red">7곳</span></div>`,

  // 2 DECLINING DISTRICTS
  `<div class="kicker">11월 3주 서울 아파트 매매 · 전주 대비</div>
   <h2>하락한 구,<br><span class="red">송파가 -0.42%</span></h2>
   <div class="panel">
     ${negBars([
       { label: '송파구', v: -0.42, color: C.red },
       { label: '서초구', v: -0.31, color: C.red },
       { label: '강남구', v: -0.30, color: C.red },
       { label: '성동구', v: -0.04, color: C.ink },
       { label: '용산구', v: -0.02, color: C.ink },
       { label: '강동구', v: -0.01, color: '#8A93A6' },
       { label: '동작구', v: -0.01, color: '#8A93A6' },
     ], 0.45)}
   </div>
   <p class="body">용산은 6주 만에, 동작은 이번 주 <b>하락 전환</b>했어요.</p>`,

  // 3 TREND
  `<div class="kicker">서울 아파트 주간 상승률 · 기준일</div>
   <h2>상승폭이 6주 새<br><span class="red">0.16% → 0.03%</span></h2>
   <div class="panel duo">
     <div class="vbars" style="gap:${Math.round(26*k)}px">
       ${trend.map(([d,v],i)=>`<div class="vb"><div class="vb-val ${i===5?'red':''}" style="font-size:${Math.round(34*k)}px">${v}%</div><div class="vb-bar" style="width:${Math.round(96*k)}px;height:${Math.round(+v*k*1500)}px;background:${i===5?C.red:'#C9CFDA'}"></div><div class="vb-y" style="font-size:${Math.round(26*k)}px">${d}</div></div>`).join('')}
     </div>
   </div>
   <p class="body">그래도 상승은 작년 2월 첫째 주부터<br><b>93주 연속</b>이에요.</p>`,

  // 4 GYEONGGI + JEONSE
  `<div class="kicker">서울 밖, 그리고 전세</div>
   <h2>매매는 식고<br><span class="red">전세</span>는 더 올랐다</h2>
   <div class="facts">
     <div class="fact">${icon.pin}<div><div class="f-t">경기 <span class="red">+0.21%</span> · 서울의 7배</div><div class="f-s">수원 권선 0.62% 전국 1위 · 안양 동안 0.61%</div></div></div>
     <div class="fact">${icon.key}<div><div class="f-t">서울 전세 올해 누적 <span class="red">+9.43%</span></div><div class="f-s">같은 기간 매매 누적 8.91%</div></div></div>
     <div class="fact">${icon.home}<div><div class="f-t">강남구 매매 -0.30%, 전세 <span class="red">+0.22%</span></div><div class="f-s">송파 전세 +0.09% · 서초 +0.01%</div></div></div>
   </div>`,

  // 5 CTA
  `<div class="kicker">정리하면</div>
   <div class="checks">
     <div class="chk"><div><b>서울 상승폭</b> 6주 새 0.16%→0.03%, 하락 구 7곳</div></div>
     <div class="chk"><div><b>강남3구</b> 모두 하락, 전세는 아직 상승</div></div>
     <div class="chk"><div><b>경기</b> 10주 연속 서울 상승률 웃돌아</div></div>
   </div>
   <div class="cta">
     <div class="cta-q">서울 집값, 어디로?</div>
     <div class="opts"><div class="opt">① 조정 시작</div><div class="opt">② 곧 다시 상승</div><div class="opt">③ 경기·수도권이 대세</div></div>
     <div class="cta-s">💬 번호로 댓글 남겨주세요</div>
   </div>
   <div class="src">출처: 한국부동산원 11월 3주(16일 기준, 19일 발표) 주간 아파트가격 동향, 이투데이·아시아경제 보도 · 투자 권유 아님</div>`,
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
