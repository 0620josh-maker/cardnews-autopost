// 카드뉴스 2026-11-23 — "동탄 거래 줄자 병점 2배 — 경기 규제지역 풍선효과"
// node build.js  → out/instagram_2026-11-23_{n}of5.png (1080x1350), out/threads_2026-11-23_{n}of5.png (1080x1080)
const { chromium } = require('playwright');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const DATE = '2026-11-23';
const N = 5;
const OUT = path.join(__dirname, 'out');
fs.mkdirSync(OUT, { recursive: true });

const C = { bg: '#F4F1EA', ink: '#0E2A5C', red: '#D12828', mute: '#6B7385', line: '#D9D3C4', card: '#FFFFFF', soft: '#E7EDF7', villa: '#E9A23B' };

// ---------- SVG illustrations ----------
const moveIllo = (w = 760) => `
<svg viewBox="0 0 760 300" width="${w}" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="270" width="760" height="30" fill="${C.line}"/>
  <rect x="40" y="70" width="170" height="200" fill="#B9C1D0"/>
  ${[0,1,2,3,4].map(r=>[0,1,2].map(c=>`<rect x="${58+c*50}" y="${88+r*38}" width="30" height="22" fill="#EEF1F6"/>`).join('')).join('')}
  <text x="125" y="55" text-anchor="middle" font-size="28" font-weight="700" fill="${C.mute}">동탄구</text>
  <rect x="520" y="40" width="190" height="230" fill="${C.ink}"/>
  ${[0,1,2,3,4,5].map(r=>[0,1,2].map(c=>`<rect x="${540+c*54}" y="${58+r*38}" width="32" height="22" fill="#fff"/>`).join('')).join('')}
  <text x="615" y="28" text-anchor="middle" font-size="28" font-weight="900" fill="${C.ink}">병점구</text>
  <path d="M250 150 Q380 60 480 130" fill="none" stroke="${C.red}" stroke-width="14" stroke-linecap="round"/>
  <path d="M470 90 L510 138 L452 150 Z" fill="${C.red}"/>
</svg>`;

const icon = {
  loan: `<svg viewBox="0 0 64 64" width="72"><path d="M6 24 L32 8 L58 24 Z" fill="${C.ink}"/><path d="M14 28 V50 M26 28 V50 M38 28 V50 M50 28 V50 M8 54 H56" stroke="${C.ink}" stroke-width="6"/></svg>`,
  pin: `<svg viewBox="0 0 64 64" width="72"><path d="M32 60 C32 60 12 38 12 24 A20 20 0 0 1 52 24 C52 38 32 60 32 60Z" fill="${C.red}"/><circle cx="32" cy="24" r="8" fill="#fff"/></svg>`,
  swap: `<svg viewBox="0 0 64 64" width="72"><circle cx="32" cy="32" r="26" fill="#fff" stroke="${C.ink}" stroke-width="5"/><path d="M18 26 H44 L38 20 M46 38 H20 L26 44" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  doc: `<svg viewBox="0 0 64 64" width="64"><path d="M14 6 H40 L52 18 V58 H14 Z" fill="#fff" stroke="${C.ink}" stroke-width="5"/><path d="M22 28 H44 M22 38 H44 M22 48 H36" stroke="${C.ink}" stroke-width="4"/></svg>`,
  pct: `<svg viewBox="0 0 64 64" width="64"><circle cx="32" cy="32" r="26" fill="#fff" stroke="${C.ink}" stroke-width="5"/><path d="M22 44 L42 20" stroke="${C.red}" stroke-width="5" stroke-linecap="round"/><circle cx="23" cy="24" r="5" fill="${C.ink}"/><circle cx="41" cy="40" r="5" fill="${C.ink}"/></svg>`,
};

function bars(items, max, fmt) {
  return items.map(it => `
    <div class="bar-row">
      <div class="bar-label">${it.label}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${(Math.abs(it.v) / max) * 100}%;background:${it.color}"></div></div>
      <div class="bar-val" style="color:${it.color}">${fmt(it.v)}</div>
    </div>`).join('');
}

// ---------- cards ----------
function cards(k) {
  const sp = v => (v > 0 ? '+' : '−') + Math.abs(v).toFixed(1) + '%';
  const H = v => Math.round(v / 1310 * 270 * k);
  return [
  // 1 HOOK
  `<div class="badge">국토부 실거래가 · 경기 3분기(7~9월)</div>
   <h1 class="hook">동탄 거래 줄자<br>옆동네 <span class="red">병점</span>이<br>2배 뛰었다</h1>
   <div class="illo">${moveIllo(Math.round(820*k))}</div>
   <div class="hook-sub"><b>3분기 거래</b>  동탄구 <span class="red">−772건</span> · 병점구 <span class="red">+594건</span></div>`,

  // 2 REGULATED vs NON
  `<div class="kicker">경기 아파트 매매 · 3분기 전년 동기 대비</div>
   <h2>전체는 늘었는데<br><span class="red">규제지역</span>만 줄었다</h2>
   <div class="panel">
     ${bars([
       { label: '경기 전체', v: 16.0, color: C.ink },
       { label: '규제지역 15곳', v: -25.7, color: C.red },
       { label: '비규제지역', v: 49.3, color: '#8A93A6' },
     ], 52, sp)}
     <div class="note">경기 전체 3만851건 → 3만5788건</div>
   </div>
   <p class="body">규제지역 거래 비중이<br><b>44.4% → 28.5%</b>로 낮아졌어요.</p>`,

  // 3 DONGTAN vs BYEONGJEOM
  `<div class="kicker">같은 화성시 · 3분기 거래량</div>
   <h2>동탄은 <span class="red">반토막</span>,<br>병점은 <span class="red">2배 넘게</span></h2>
   <div class="panel duo">
     <div class="col">
       <div class="col-h">동탄구(규제)</div>
       <div class="vbars">
         <div class="vb"><div class="vb-val">1,310</div><div class="vb-bar" style="height:${H(1310)}px;background:#C9CFDA"></div><div class="vb-y">작년</div></div>
         <div class="vb"><div class="vb-val ink">538</div><div class="vb-bar" style="height:${H(538)}px;background:${C.ink}"></div><div class="vb-y">올해</div></div>
       </div>
     </div>
     <div class="col">
       <div class="col-h">병점구(비규제)</div>
       <div class="vbars">
         <div class="vb"><div class="vb-val">466</div><div class="vb-bar" style="height:${H(466)}px;background:#C9CFDA"></div><div class="vb-y">작년</div></div>
         <div class="vb"><div class="vb-val red">1,060</div><div class="vb-bar" style="height:${H(1060)}px;background:${C.red}"></div><div class="vb-y">올해</div></div>
       </div>
     </div>
   </div>
   <p class="body">동탄 <b>−58.9%</b> · 병점 <b>+127.5%</b><br>거래량 순서가 뒤바뀌었어요.</p>`,

  // 4 BACKGROUND
  `<div class="kicker">숫자로 보는 배경</div>
   <h2>규제 직후<br>거래가 옮겨갔다</h2>
   <div class="facts">
     <div class="fact">${icon.loan}<div><div class="f-t">LTV 비규제 <span class="red">70%</span> · 규제 40%</div><div class="f-s">동탄·기흥·구리 7/1부터 규제 적용</div></div></div>
     <div class="fact">${icon.swap}<div><div class="f-t">신규 규제 3곳 <span class="red">−46.3%</span></div><div class="f-s">3분기 2,958건 → 1,589건</div></div></div>
     <div class="fact">${icon.pin}<div><div class="f-t">군포 +117.4% · 권선 +110.4%</div><div class="f-s">오산 +99.3% · 부천 원미 +94.2%</div></div></div>
   </div>
   <div class="trend">
     <div class="trend-h">신규 규제 3곳, <b>상반기엔 거래 급증</b></div>
     <div class="trend-row"><div class="tr"><div class="tr-v">6,309건</div><div class="tr-m">작년 상반기</div></div><div class="tr-arrow">›</div><div class="tr"><div class="tr-v">1만4,264건</div><div class="tr-m">올해 상반기 (+126.1%)</div></div></div>
   </div>`,

  // 5 SUMMARY + CTA
  `<div class="kicker">한눈에 정리</div>
   <div class="checks">
     <div class="chk">${icon.pct}<div><b>거래</b> 규제 15곳 −25.7%, 비규제 +49.3%</div></div>
     <div class="chk">${icon.doc}<div><b>가격</b> 11월 3주 권선구 0.62% · 동탄구 0.35%</div></div>
     <div class="chk">${icon.swap}<div><b>대출</b> 규제 여부에 따라 LTV 70% vs 40%</div></div>
   </div>
   <div class="cta">
     <div class="cta-q">풍선효과, 어떻게 보세요?</div>
     <div class="opts"><div class="opt">① 규제 효과가 있다</div><div class="opt">② 거래만 옮겨간 것</div><div class="opt">③ 아직 잘 모르겠다</div></div>
     <div class="cta-s">💬 번호로 댓글 남겨주세요</div>
   </div>
   <div class="src">출처: 이투데이 2026-11-23 '동탄 아파트 거래 772건 줄 때 병점은 594건 늘었다'(국토교통부 실거래가 분석) · 한국부동산원 11월 3주 · 3분기 거래 기준 · 투자 권유 아님</div>`,
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
