// 카드뉴스 2026-11-20 — 공시가격 현실화율 69% 동결 유력
// node build.js  → out/instagram_2026-11-20_{n}of5.png (1080x1350), out/threads_2026-11-20_{n}of5.png (1080x1080)
const { chromium } = require('playwright');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const DATE = '2026-11-20';
const N = 5;
const OUT = path.join(__dirname, 'out');
fs.mkdirSync(OUT, { recursive: true });

const C = { bg: '#F4F1EA', ink: '#0E2A5C', red: '#D12828', mute: '#6B7385', line: '#D9D3C4', card: '#FFFFFF', soft: '#E7EDF7', villa: '#E9A23B' };

// ---------- SVG illustrations ----------
const houseTag = (w = 760) => `
<svg viewBox="0 0 760 330" width="${w}" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="300" width="760" height="30" fill="${C.line}"/>
  <polygon points="60,150 200,50 340,150" fill="${C.ink}"/>
  <rect x="85" y="150" width="230" height="150" fill="#fff" stroke="${C.ink}" stroke-width="8"/>
  <rect x="120" y="185" width="56" height="50" fill="${C.soft}" stroke="${C.ink}" stroke-width="5"/>
  <rect x="230" y="215" width="50" height="85" fill="${C.ink}"/>
  <rect x="420" y="70" width="300" height="190" rx="24" fill="#fff" stroke="${C.ink}" stroke-width="8"/>
  <text x="570" y="125" text-anchor="middle" font-size="34" font-weight="700" fill="${C.mute}">현실화율</text>
  <text x="570" y="215" text-anchor="middle" font-size="96" font-weight="900" fill="${C.red}">69%</text>
  <path d="M345 170 L410 170" stroke="${C.ink}" stroke-width="8" stroke-linecap="round" stroke-dasharray="4 14"/>
</svg>`;

const icon = {
  doc: `<svg viewBox="0 0 64 64" width="64"><path d="M14 6 H40 L52 18 V58 H14 Z" fill="#fff" stroke="${C.ink}" stroke-width="5"/><path d="M22 28 H44 M22 38 H44 M22 48 H36" stroke="${C.ink}" stroke-width="4"/></svg>`,
  pct: `<svg viewBox="0 0 64 64" width="64"><circle cx="32" cy="32" r="26" fill="#fff" stroke="${C.ink}" stroke-width="5"/><path d="M22 44 L42 20" stroke="${C.red}" stroke-width="5" stroke-linecap="round"/><circle cx="23" cy="24" r="5" fill="${C.ink}"/><circle cx="41" cy="40" r="5" fill="${C.ink}"/></svg>`,
  home: `<svg viewBox="0 0 64 64" width="72"><path d="M8 32 L32 10 L56 32 V56 H8 Z" fill="${C.ink}"/><rect x="26" y="38" width="12" height="18" fill="#fff"/></svg>`,
  tax: `<svg viewBox="0 0 64 64" width="72"><circle cx="32" cy="32" r="26" fill="${C.red}"/><text x="32" y="43" text-anchor="middle" font-size="32" font-weight="900" fill="#fff">세</text></svg>`,
  cal: `<svg viewBox="0 0 64 64" width="72"><rect x="8" y="12" width="48" height="44" rx="6" fill="#fff" stroke="${C.ink}" stroke-width="5"/><rect x="8" y="12" width="48" height="14" fill="${C.ink}"/><path d="M20 36 H44 M20 46 H36" stroke="${C.ink}" stroke-width="4"/></svg>`,
};

const gbar = (label, v, color, max) => `
    <div class="bar-row">
      <div class="bar-label">${label}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${(v / max) * 100}%;background:${color}"></div></div>
      <div class="bar-val" style="color:${color}">${v}%</div>
    </div>`;

// ---------- cards ----------
function cards(k) {
  return [
  // 1 HOOK
  `<div class="badge">국토부·한국부동산원 공청회 11/20</div>
   <h1 class="hook">내 집 공시가,<br>내년에도<br><span class="red">동결?</span></h1>
   <div class="illo">${houseTag(Math.round(820*k))}</div>
   <div class="hook-sub"><b>현실화율</b> <span class="red">69%</span> 동결 유력 · 목표는 <span class="red">90%</span></div>`,

  // 2 FORMULA
  `<div class="kicker">공시가격, 이렇게 정해져요</div>
   <h2>공시가격 =<br>시세 × <span class="red">현실화율</span></h2>
   <div class="panel">
     ${gbar('올해·내년 유력', 69, C.red, 100)}
     ${gbar('중장기 목표', 90, C.ink, 100)}
     <div class="note">현실화율 = 시세 대비 공시가격 비율</div>
   </div>
   <p class="body">2023년 이후 <b>4년째 69%</b> 동결 가능성이 커요. 정부 중장기 목표는 90%입니다.</p>`,

  // 3 CONTROVERSY
  `<div class="kicker">올해 쟁점</div>
   <h2>매년 <span class="red">1.5%p</span> 올린다?<br>국토부는 "아니다"</h2>
   <div class="facts">
     <div class="fact">${icon.doc}<div><div class="f-t">국토연구원 중간보고서</div><div class="f-s">지난달 7일, 김은혜 의원이 근거로 제시</div></div></div>
     <div class="fact">${icon.pct}<div><div class="f-t">연 <span class="red">1.5%p</span> 인상안 검토 주장</div><div class="f-s">국토부는 부인하며 해명</div></div></div>
     <div class="fact">${icon.cal}<div><div class="f-t">11/20 공청회</div><div class="f-s">내년도 부동산 가격공시 추진방안 공개</div></div></div>
   </div>`,

  // 4 TAX CONTEXT
  `<div class="kicker">세금과 연결되는 숫자</div>
   <h2>동결이어도<br>확인할 건 <span class="red">더 있다</span></h2>
   <div class="facts">
     <div class="fact">${icon.home}<div><div class="f-t">9억 이하 1주택자</div><div class="f-s">재산세율 0.05%p 인하 특례, 2029년까지 연장</div></div></div>
     <div class="fact">${icon.tax}<div><div class="f-t">종부세 1주택 <span class="red">12억 초과</span></div><div class="f-s">공시가격 기준</div></div></div>
     <div class="fact">${icon.pct}<div><div class="f-t">공정시장가액비율 43~45%</div><div class="f-s">1주택자, 내년 적용분은 미확정</div></div></div>
   </div>`,

  // 5 CTA
  `<div class="kicker">공청회 이후 체크</div>
   <div class="checks">
     <div class="chk">${icon.pct}<div><b>현실화율</b> 69% 동결 확정인지</div></div>
     <div class="chk">${icon.cal}<div><b>공정시장가액비율</b> 내년 적용 수치</div></div>
     <div class="chk">${icon.doc}<div><b>우리 집 공시가</b> 공개 시 확인</div></div>
   </div>
   <div class="cta">
     <div class="cta-q">내년 보유세, 어떻게 될까?</div>
     <div class="opts"><div class="opt">① 동결로 부담 유지</div><div class="opt">② 시세 올라 부담 증가</div><div class="opt">③ 공청회 보고 판단</div></div>
     <div class="cta-s">💬 번호로 댓글 남겨주세요</div>
   </div>
   <div class="src">출처: 매일신문(11/17·18) · 국토부·한국부동산원 공청회 일정(11/20) · 공청회 결과 발표 전 보도 기준 · 투자 권유 아님</div>`,
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
