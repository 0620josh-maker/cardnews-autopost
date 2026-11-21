// 카드뉴스 2026-11-22 — "집값 오르자 1인당 주담대 반등"
// node build.js  → out/instagram_2026-11-22_{n}of5.png (1080x1350), out/threads_2026-11-22_{n}of5.png (1080x1080)
const { chromium } = require('playwright');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const DATE = '2026-11-22';
const N = 5;
const OUT = path.join(__dirname, 'out');
fs.mkdirSync(OUT, { recursive: true });

const C = { bg: '#F4F1EA', ink: '#0E2A5C', red: '#D12828', mute: '#6B7385', line: '#D9D3C4', card: '#FFFFFF', soft: '#E7EDF7', villa: '#E9A23B' };

// ---------- SVG illustrations ----------
const houseIllo = (w = 760) => `
<svg viewBox="0 0 760 300" width="${w}" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="270" width="760" height="30" fill="${C.line}"/>
  <polygon points="90,150 220,50 350,150" fill="${C.ink}"/>
  <rect x="115" y="150" width="210" height="120" fill="#fff" stroke="${C.ink}" stroke-width="6"/>
  <rect x="195" y="200" width="50" height="70" fill="${C.ink}"/>
  <rect x="135" y="170" width="40" height="34" fill="${C.soft}" stroke="${C.ink}" stroke-width="4"/>
  <rect x="265" y="170" width="40" height="34" fill="${C.soft}" stroke="${C.ink}" stroke-width="4"/>
  ${[0,1,2,3].map(i=>`<rect x="${430+i*75}" y="${270-(50+i*45)}" width="56" height="${50+i*45}" fill="${i==3?C.red:'#C9CFDA'}" rx="6"/>`).join('')}
  <path d="M430 110 L520 90 L590 95 L670 30" fill="none" stroke="${C.red}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M640 26 L700 16 L688 76 Z" fill="${C.red}"/>
</svg>`;

const icon = {
  home: `<svg viewBox="0 0 64 64" width="72"><path d="M8 32 L32 10 L56 32" fill="none" stroke="${C.ink}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/><rect x="16" y="32" width="32" height="24" fill="${C.ink}"/></svg>`,
  bank: `<svg viewBox="0 0 64 64" width="72"><path d="M6 24 L32 8 L58 24 Z" fill="${C.ink}"/><path d="M14 28 V50 M26 28 V50 M38 28 V50 M50 28 V50 M8 54 H56" stroke="${C.ink}" stroke-width="6"/></svg>`,
  down: `<svg viewBox="0 0 64 64" width="72"><circle cx="32" cy="32" r="26" fill="#fff" stroke="${C.ink}" stroke-width="5"/><path d="M32 18 V44 M20 34 L32 46 L44 34" fill="none" stroke="${C.red}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  pin: `<svg viewBox="0 0 64 64" width="72"><path d="M32 60 C32 60 12 38 12 24 A20 20 0 0 1 52 24 C52 38 32 60 32 60Z" fill="${C.red}"/><circle cx="32" cy="24" r="8" fill="#fff"/></svg>`,
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
  const pct = v => v.toFixed(1) + '%';
  const man = v => (v > 0 ? '+' : '−') + Math.abs(v).toLocaleString('en-US') + '만';
  return [
  // 1 HOOK
  `<div class="badge">한국은행 3분기 차주별 가계부채</div>
   <h1 class="hook">집값 오르자<br><span class="red">주담대</span>도<br>다시 늘었다</h1>
   <div class="illo">${houseIllo(Math.round(820*k))}</div>
   <div class="hook-sub"><b>1인당 신규 주담대</b>  <span class="red">2억 1,451만원</span> (+622만원)</div>`,

  // 2 AGE SHARE
  `<div class="kicker">3분기 신규 주담대 · 연령별 비중</div>
   <h2>빌린 돈의 절반 가까이<br><span class="red">30대</span>가 가져갔다</h2>
   <div class="panel">
     ${bars([
       { label: '30대', v: 46.4, color: C.red },
       { label: '40대', v: 23.7, color: C.ink },
       { label: '50대', v: 14.5, color: '#8A93A6' },
       { label: '60대+', v: 9.1, color: '#8A93A6' },
       { label: '20대', v: 6.3, color: '#8A93A6' },
     ], 50, pct)}
     <div class="note">30대 비중 직전 분기 43.7% → 46.4%</div>
   </div>
   <p class="body">30대 비중은 <b>역대 최고</b>예요.</p>`,

  // 3 CHANGE BY AGE
  `<div class="kicker">1인당 신규 주담대 · 전분기 대비 증감</div>
   <h2>30·40대는 늘고<br><span class="red">20대</span>는 줄었다</h2>
   <div class="panel">
     ${bars([
       { label: '30대', v: 776, color: C.red },
       { label: '40대', v: 647, color: C.ink },
       { label: '50대', v: -237, color: '#8A93A6' },
       { label: '20대', v: -746, color: '#8A93A6' },
     ], 800, man)}
   </div>
   <p class="body">20대는 <b>746만원</b> 줄었어요.</p>`,

  // 4 CONTEXT
  `<div class="kicker">숫자로 보는 배경</div>
   <h2>전체 신규 대출은<br>오히려 줄었다</h2>
   <div class="facts">
     <div class="fact">${icon.down}<div><div class="f-t">가계대출 신규 <span class="red">3,028만원</span></div><div class="f-s">전분기보다 386만원 감소</div></div></div>
     <div class="fact">${icon.home}<div><div class="f-t">주담대 평균 잔액 <span class="red">1억 6,340만원</span></div><div class="f-s">전분기보다 147만원 증가</div></div></div>
     <div class="fact">${icon.bank}<div><div class="f-t">30대 평균 잔액 2억 3,766만원</div><div class="f-s">20대 2억 745만 · 40대 1억 8,807만</div></div></div>
   </div>
   <p class="body">신용대출은 줄고(−328만원)<br>집 담보 대출만 <b>반등</b>했어요.</p>`,

  // 5 CTA
  `<div class="kicker">정리하면</div>
   <div class="checks">
     <div class="chk">${icon.pin}<div><b>1인당 신규 주담대</b> 2억 1,451만원</div></div>
     <div class="chk">${icon.pin}<div><b>30대 비중</b> 46.4%, 역대 최고</div></div>
     <div class="chk">${icon.pin}<div><b>전체 신규 대출</b> 386만원 감소</div></div>
   </div>
   <div class="cta">
     <div class="cta-q">내 대출, 괜찮을까?</div>
     <div class="opts"><div class="opt">① 이자 부담 크다</div><div class="opt">② 감당할 만하다</div><div class="opt">③ 아직 대출 없음</div></div>
     <div class="cta-s">💬 번호로 댓글 남겨주세요</div>
   </div>
   <div class="src">출처: 글로벌이코노믹(11/20) 보도, 한국은행 차주별 가계부채 통계(11/20 발표) · 3분기 신규취급 기준 · 투자 권유 아님</div>`,
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
  .bar-row{display:grid;grid-template-columns:${s(200)} 1fr ${s(190)};align-items:center;gap:${s(18)}}
  .bar-label{font-size:${s(34)};font-weight:700}
  .bar-track{height:${s(56)};background:${C.soft};border-radius:${s(12)};overflow:hidden}
  .bar-fill{height:100%;border-radius:${s(12)}}
  .bar-val{white-space:nowrap;font-size:${s(46)};font-weight:900;text-align:right}
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
