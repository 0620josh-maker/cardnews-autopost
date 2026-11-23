// 카드뉴스 2026-11-24 — "26평이 한 번에 6.4억 올랐다?" (일일 신고가)
// node build.js  → out/instagram_2026-11-24_{n}of5.png (1080x1350), out/threads_2026-11-24_{n}of5.png (1080x1080)
const { chromium } = require('playwright');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const DATE = '2026-11-24';
const N = 5;
const OUT = path.join(__dirname, 'out');
fs.mkdirSync(OUT, { recursive: true });

const C = { bg: '#F4F1EA', ink: '#0E2A5C', red: '#D12828', mute: '#6B7385', line: '#D9D3C4', card: '#FFFFFF', soft: '#E7EDF7', villa: '#E9A23B' };

// ---------- SVG illustrations ----------
const jump = (w = 820) => `
<svg viewBox="0 0 820 300" width="${w}" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="150" width="270" height="130" rx="22" fill="#fff" stroke="${C.ink}" stroke-width="6"/>
  <text x="145" y="195" text-anchor="middle" font-size="30" font-weight="700" fill="${C.mute}">4월 9일 거래</text>
  <text x="145" y="250" text-anchor="middle" font-size="60" font-weight="900" fill="${C.ink}">10억</text>
  <rect x="540" y="20" width="270" height="130" rx="22" fill="${C.red}"/>
  <text x="675" y="65" text-anchor="middle" font-size="30" font-weight="700" fill="#fff">11월 13일 거래</text>
  <text x="675" y="120" text-anchor="middle" font-size="60" font-weight="900" fill="#fff">16.4억</text>
  <path d="M300 200 C380 200 420 120 500 90" fill="none" stroke="${C.red}" stroke-width="14" stroke-linecap="round"/>
  <path d="M470 60 L525 82 L488 130 Z" fill="${C.red}"/>
</svg>`;

const icon = {
  pin: `<svg viewBox="0 0 64 64" width="72"><path d="M32 60 C32 60 12 38 12 24 A20 20 0 0 1 52 24 C52 38 32 60 32 60Z" fill="${C.red}"/><circle cx="32" cy="24" r="8" fill="#fff"/></svg>`,
  doc: `<svg viewBox="0 0 64 64" width="64"><path d="M14 6 H40 L52 18 V58 H14 Z" fill="#fff" stroke="${C.ink}" stroke-width="5"/><path d="M22 28 H44 M22 38 H44 M22 48 H36" stroke="${C.ink}" stroke-width="4"/></svg>`,
  down: `<svg viewBox="0 0 64 64" width="72"><circle cx="32" cy="32" r="26" fill="#fff" stroke="${C.ink}" stroke-width="5"/><path d="M32 16 V44 M20 34 L32 46 L44 34" fill="none" stroke="${C.red}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  cal: `<svg viewBox="0 0 64 64" width="64"><rect x="8" y="12" width="48" height="46" rx="6" fill="#fff" stroke="${C.ink}" stroke-width="5"/><path d="M8 26 H56" stroke="${C.ink}" stroke-width="5"/><path d="M20 6 V16 M44 6 V16" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/></svg>`,
};

function bars(items, max) {
  return items.map(it => `
    <div class="bar-row">
      <div class="bar-label">${it.label}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${(it.v / max) * 100}%;background:${it.color}"></div></div>
      <div class="bar-val" style="color:${it.color}">+${it.v.toFixed(1)}억</div>
    </div>`).join('');
}

// ---------- cards ----------
function cards(k) {
  return [
  // 1 HOOK
  `<div class="badge">국토부 실거래가 · 일일 신고가</div>
   <h1 class="hook">26평이<br>7개월 새<br><span class="red">6.4억</span> 올랐다?</h1>
   <div class="illo">${jump(Math.round(820*k))}</div>
   <div class="hook-sub"><b>송파 풍납동 신성노바빌</b>  직전 거래 대비 <span class="red">+64.0%</span></div>`,

  // 2 BARS
  `<div class="kicker">서울 신고가 · 직전 거래 대비 오른 금액</div>
   <h2>직전 거래보다<br><span class="red">5억 이상</span> 뛴 5곳</h2>
   <div class="panel">
     ${bars([
       { label: '송파 풍납', v: 6.4, color: C.red },
       { label: '송파 송파동', v: 6.0, color: C.ink },
       { label: '상도 e편한', v: 6.0, color: C.ink },
       { label: '상도 캐슬', v: 5.6, color: '#8A93A6' },
       { label: '서초 방배', v: 5.3, color: '#8A93A6' },
     ], 7)}
     <div class="note">상도 e편한=e편한세상상도노빌리티 · 상도 캐슬=상도역롯데캐슬파크엘</div>
   </div>
   <p class="body">모두 <b>직전 거래</b>와 비교한 값이에요.</p>`,

  // 3 DETAIL
  `<div class="kicker">송파구 풍납동 · 신성노바빌아파트</div>
   <h2>전용 84.96㎡<br><span class="red">10억 → 16.4억</span></h2>
   <div class="facts">
     <div class="fact">${icon.cal}<div><div class="f-t">4월 9일 <span class="red">10억원</span></div><div class="f-s">직전 거래</div></div></div>
     <div class="fact">${icon.pin}<div><div class="f-t">11월 13일 <span class="red">16억 4000만원</span></div><div class="f-s">이번 신고가</div></div></div>
     <div class="fact">${icon.doc}<div><div class="f-t">+6억 4000만원 (<span class="red">+64.0%</span>)</div><div class="f-s">서울·전국 상승액 1위(기사 기준)</div></div></div>
   </div>`,

  // 4 OTHERS + CAVEAT
  `<div class="kicker">나머지 4곳은?</div>
   <h2>상승률은<br><span class="red">25~31%</span></h2>
   <div class="facts">
     <div class="fact"><div><div class="f-t">송파동 아르누보팰리스 <span class="red">+25.5%</span></div><div class="f-s">23억5000만→29억5000만 (136.54㎡)</div></div></div>
     <div class="fact"><div><div class="f-t">상도동 e편한세상 <span class="red">+30.8%</span></div><div class="f-s">19억5000만→25억5000만 (108.98㎡)</div></div></div>
     <div class="fact"><div><div class="f-t">상도역롯데캐슬파크엘 <span class="red">+27.5%</span></div><div class="f-s">20억4000만→26억 (110.99㎡)</div></div></div>
     <div class="fact"><div><div class="f-t">방배아이파크 <span class="red">+27.9%</span></div><div class="f-s">19억→24억3000만 (84.32㎡)</div></div></div>
   </div>
   <div class="trend"><div class="trend-h">직전 거래 시점은 <b>2024년 11월~2026년 4월</b>로 제각각이에요</div></div>`,

  // 5 CONTEXT + CTA
  `<div class="kicker">같이 봐야 할 숫자</div>
   <div class="checks">
     <div class="chk">${icon.down}<div>같은 주 <b>송파구 매매가 -0.42%</b><br>서초 -0.31% · 강남 -0.30%</div></div>
     <div class="chk">${icon.doc}<div>서울 아파트 <b>+0.03%</b> (전주 0.07%)<br>한국부동산원 11/16 주간</div></div>
   </div>
   <div class="cta">
     <div class="cta-q">이 신고가, 어떻게 보세요?</div>
     <div class="opts"><div class="opt">① 반등 신호</div><div class="opt">② 개별 거래일 뿐</div><div class="opt">③ 아직 모르겠다</div></div>
     <div class="cta-s">💬 번호로 댓글 남겨주세요</div>
   </div>
   <div class="src">출처: 한국금융신문 11/23 [일일 신고가](국토부 실거래가) · 한국부동산원 11/16 주간동향 · 단건 거래 기준, 시장 전체 추세 아님 · 투자 권유 아님</div>`,
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
  .fact .f-t{line-height:1.25}
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
