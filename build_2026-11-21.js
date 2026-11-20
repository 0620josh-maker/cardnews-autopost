// 카드뉴스 2026-11-21 — 다음 주 청약 6295가구, 전주의 3.7배
// node build.js  → out/instagram_2026-11-21_{n}of5.png (1080x1350), out/threads_2026-11-21_{n}of5.png (1080x1080)
const { chromium } = require('playwright');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const DATE = '2026-11-21';
const N = 5;
const OUT = path.join(__dirname, 'out');
fs.mkdirSync(OUT, { recursive: true });

const C = { bg: '#F4F1EA', ink: '#0E2A5C', red: '#D12828', mute: '#6B7385', line: '#D9D3C4', card: '#FFFFFF', soft: '#E7EDF7', villa: '#E9A23B' };

// ---------- SVG illustrations ----------
const towers = (w = 760) => `
<svg viewBox="0 0 860 330" width="${w}" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="300" width="860" height="30" fill="${C.line}"/>
  <rect x="40" y="200" width="110" height="100" fill="#B9C1D0"/>
  <text x="95" y="185" text-anchor="middle" font-size="30" font-weight="700" fill="${C.mute}">전주</text>
  <text x="95" y="260" text-anchor="middle" font-size="30" font-weight="900" fill="${C.ink}">1,681</text>
  <rect x="260" y="60" width="150" height="240" fill="${C.ink}"/>
  ${[0,1,2,3,4,5].map(r=>[0,1,2].map(c=>`<rect x="${278+c*42}" y="${78+r*38}" width="24" height="22" fill="#EEF1F6"/>`).join('')).join('')}
  <rect x="440" y="30" width="150" height="270" fill="${C.red}"/>
  ${[0,1,2,3,4,5,6].map(r=>[0,1,2].map(c=>`<rect x="${458+c*42}" y="${48+r*36}" width="24" height="20" fill="#FFF"/>`).join('')).join('')}
  <text x="640" y="150" font-size="30" font-weight="700" fill="${C.mute}">다음 주</text>
  <text x="640" y="205" font-size="52" font-weight="900" fill="${C.red}">6,295</text>
</svg>`;

const icon = {
  pin: `<svg viewBox="0 0 64 64" width="72"><path d="M32 60 C32 60 12 38 12 24 A20 20 0 0 1 52 24 C52 38 32 60 32 60Z" fill="${C.red}"/><circle cx="32" cy="24" r="8" fill="#fff"/></svg>`,
  apt: `<svg viewBox="0 0 64 64" width="72"><rect x="12" y="8" width="40" height="52" rx="3" fill="${C.ink}"/>${[0,1,2,3].map(r=>[0,1].map(c=>`<rect x="${20+c*16}" y="${16+r*10}" width="8" height="6" fill="#fff"/>`).join('')).join('')}</svg>`,
  cal: `<svg viewBox="0 0 64 64" width="72"><rect x="8" y="12" width="48" height="44" rx="6" fill="#fff" stroke="${C.ink}" stroke-width="5"/><rect x="8" y="12" width="48" height="14" fill="${C.ink}"/><path d="M20 36 H44 M20 46 H36" stroke="${C.ink}" stroke-width="4"/></svg>`,
  doc: `<svg viewBox="0 0 64 64" width="64"><path d="M14 6 H40 L52 18 V58 H14 Z" fill="#fff" stroke="${C.ink}" stroke-width="5"/><path d="M22 28 H44 M22 38 H44 M22 48 H36" stroke="${C.ink}" stroke-width="4"/></svg>`,
  pct: `<svg viewBox="0 0 64 64" width="64"><circle cx="32" cy="32" r="26" fill="#fff" stroke="${C.ink}" stroke-width="5"/><path d="M22 44 L42 20" stroke="${C.red}" stroke-width="5" stroke-linecap="round"/><circle cx="23" cy="24" r="5" fill="${C.ink}"/><circle cx="41" cy="40" r="5" fill="${C.ink}"/></svg>`,
  swap: `<svg viewBox="0 0 64 64" width="64"><circle cx="32" cy="32" r="26" fill="#fff" stroke="${C.ink}" stroke-width="5"/><path d="M18 26 H44 L38 20 M46 38 H20 L26 44" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

const gbar = (label, v, color, max, txt) => `
    <div class="bar-row">
      <div class="bar-label">${label}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${(v / max) * 100}%;background:${color}"></div></div>
      <div class="bar-val" style="color:${color}">${txt}</div>
    </div>`;

// ---------- cards ----------
function cards(k) {
  return [
  // 1 HOOK
  `<div class="badge">11/23~27 청약 · 리얼투데이 집계</div>
   <h1 class="hook">다음 주 청약,<br><span class="red">3.7배</span><br>쏟아진다</h1>
   <div class="illo">${towers(Math.round(820*k))}</div>
   <div class="hook-sub"><b>전국 15곳</b> <span class="red">6,295가구</span> vs 전주 1,681가구</div>`,

  // 2 WEEK COMPARE
  `<div class="kicker">청약 접수 물량 · 주간 비교</div>
   <h2>한 주 만에<br><span class="red">4,614가구</span> 늘었다</h2>
   <div class="panel">
     ${gbar('전주', 1681, '#8A93A6', 6295, '1,681')}
     ${gbar('11/23~27', 6295, C.red, 6295, '6,295')}
     <div class="note">공공분양·오피스텔·임대 포함, 행복주택 제외</div>
   </div>
   <p class="body">전주보다 <b>약 3.7배</b>, 접수 단지는 <b>전국 15곳</b>이에요.</p>`,

  // 3 REGION
  `<div class="kicker">어디에서 나오나</div>
   <h2>물량의 <span class="red">53.9%</span>는<br>지방이에요</h2>
   <div class="panel">
     ${gbar('수도권 8곳', 46.1, C.ink, 60, '46.1%')}
     ${gbar('지방 7곳', 53.9, C.red, 60, '53.9%')}
     <div class="note">수도권 2,904가구 · 지방 3,391가구</div>
   </div>
   <div class="fact">${icon.pin}<div><div class="f-t">경북 구미 <span class="red">1,355가구</span></div><div class="f-s">구미 파크원 데시앙 · 지방 물량의 약 40%</div></div></div>`,

  // 4 SEOUL
  `<div class="kicker">서울 접수 단지</div>
   <h2>서울에서는<br><span class="red">두 곳</span>이 접수해요</h2>
   <div class="facts">
     <div class="fact">${icon.apt}<div><div class="f-t">해링턴 플레이스 문래 <span class="red">218가구</span></div><div class="f-s">영등포구 · 11/24 1순위 · 전 가구 전용 84㎡</div></div></div>
     <div class="fact">${icon.cal}<div><div class="f-t">경희궁 에피트 <span class="red">134가구</span></div><div class="f-s">종로구 · 11/26 1순위 · 총 228가구 중 일반분양</div></div></div>
     <div class="fact">${icon.pin}<div><div class="f-t">중랑구 오피스텔 74실</div><div class="f-s">중화역 라온프라이빗 센트로</div></div></div>
   </div>`,

  // 5 CHECK + CTA
  `<div class="kicker">청약 넣기 전 체크</div>
   <div class="checks">
     <div class="chk">${icon.doc}<div><b>입주자모집공고</b> 자격·분양가 직접 확인</div></div>
     <div class="chk">${icon.pct}<div><b>집계 범위</b> 오피스텔·임대 포함 수치예요</div></div>
     <div class="chk">${icon.cal}<div><b>접수일</b> 단지마다 1순위 날짜가 달라요</div></div>
   </div>
   <div class="cta">
     <div class="cta-q">다음 주 청약, 넣어볼까?</div>
     <div class="opts"><div class="opt">① 서울 단지 도전</div><div class="opt">② 지방 단지 눈여겨봄</div><div class="opt">③ 이번엔 관망</div></div>
     <div class="cta-s">번호로 댓글 남겨주세요</div>
   </div>
   <div class="src">출처: 한국금융신문 11/20 '[11월 4주 청약]'(리얼투데이 자료) · 접수 일정 변동 가능 · 투자 권유 아님</div>`,
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
