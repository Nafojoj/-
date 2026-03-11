// ── CURSOR ──
const cur = document.getElementById('cur');
const curT = document.getElementById('curT');
let mx=0, my=0;
document.addEventListener('mousemove', e => {
  mx=e.clientX; my=e.clientY;
  cur.style.left=mx+'px'; cur.style.top=my+'px';
  setTimeout(()=>{ curT.style.left=mx+'px'; curT.style.top=my+'px'; }, 80);
});
document.querySelectorAll('.tl-c,.cc,.sc,.ag-c,.plat-row,.fi,.g-btn').forEach(el => {
  el.addEventListener('mouseenter', ()=>cur.classList.add('big'));
  el.addEventListener('mouseleave', ()=>cur.classList.remove('big'));
});

// ── TL POPUP ──
const tlp = document.getElementById('tlp');
document.querySelectorAll('.tl-c').forEach(card => {
  card.addEventListener('mouseenter', () => {
    document.getElementById('tlp-y').textContent = card.dataset.y;
    document.getElementById('tlp-t').textContent = card.dataset.e;
    document.getElementById('tlp-b').textContent = card.dataset.b;
    document.getElementById('tlp-tag').textContent = card.dataset.t;
    tlp.classList.add('on');
  });
  card.addEventListener('mousemove', e => {
    let x=e.clientX+20, y=e.clientY+20;
    if(x+330>window.innerWidth) x=e.clientX-330;
    if(y+220>window.innerHeight) y=e.clientY-230;
    tlp.style.left=x+'px'; tlp.style.top=y+'px';
  });
  card.addEventListener('mouseleave', ()=>tlp.classList.remove('on'));
});

// ── CASES MOBILE ──
document.querySelectorAll('.cc').forEach(c => {
  c.addEventListener('click', ()=>{ if(window.innerWidth<=640) c.classList.toggle('op'); });
});

// ── SCROLL REVEAL ──
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('on'); });
}, { threshold: 0.1 });
document.querySelectorAll('.rv').forEach(el => obs.observe(el));

// ════════════════════════════════════
// POPUP GAME
// ════════════════════════════════════
const DURATION = 30;
const POPUP_DATA = [
  { bar:'Реклама 1998', body:'Нажмите ЗДЕСЬ и получите бесплатный интернет навсегда!', cta:'ПОЛУЧИТЬ' },
  { bar:'Вы победитель!', body:'Вы — 1 000 000-й посетитель! Заберите свой приз прямо сейчас.', cta:'ЗАБРАТЬ ПРИЗ' },
  { bar:'Вирус найден!', body:'Ваш компьютер заражён 3 вирусами. Скачайте антивирус!', cta:'СКАЧАТЬ' },
  { bar:'Горячие скидки!', body:'Купи 2 телевизора — получи 3-й в подарок! Только сегодня!', cta:'КУПИТЬ' },
  { bar:'Вы выбраны!', body:'Заполните форму и выиграйте новый iPhone уже сейчас!', cta:'ВЫИГРАТЬ' },
  { bar:'Срочно!', body:'Ваш аккаунт будет заблокирован через 5 минут! Действуйте!', cta:'РАЗБЛОКИРОВАТЬ' },
  { bar:'Flash Player', body:'Обновите Flash Player для продолжения просмотра видео!', cta:'ОБНОВИТЬ' },
  { bar:'Знакомства', body:'Одинокие люди рядом с вами ищут общения прямо сейчас!', cta:'СМОТРЕТЬ' },
  { bar:'Бесплатно!', body:'Скачайте 1000 рингтонов АБСОЛЮТНО БЕСПЛАТНО для Nokia!', cta:'СКАЧАТЬ' },
  { bar:'Поздравляем!', body:'Вы выиграли круиз на Карибы! Нажмите чтобы узнать детали.', cta:'УЗНАТЬ' },
  { bar:'Ваш IQ', body:'Проверьте свой IQ! Результаты шокируют. Жмите немедленно!', cta:'ПРОВЕРИТЬ' },
  { bar:'AdWords 2000', body:'Разместите рекламу в Google — всего 1 цент за клик!', cta:'РАЗМЕСТИТЬ' },
];

let state = 'idle';
let score = 0, misses = 0, timeLeft = DURATION, best = 0;
let timerInt = null, spawnTmt = null;

const arena = document.getElementById('arena');
const missFlash = document.getElementById('missFlash');
const tBar = document.getElementById('tBar');
const hScore = document.getElementById('hScore');
const hMiss = document.getElementById('hMiss');
const hTime = document.getElementById('hTime');
const ovStart = document.getElementById('ovStart');
const ovOver = document.getElementById('ovOver');

function startGame() {
  score=0; misses=0; timeLeft=DURATION; state='playing';
  ovStart.style.display='none'; ovOver.style.display='none';
  arena.querySelectorAll('.fp').forEach(p=>p.remove());
  arena.querySelectorAll('.s-pop').forEach(p=>p.remove());
  tBar.style.width='100%'; tBar.style.background='var(--accent)';
  document.getElementById('btnPause').style.display='inline-block';
  updateHUD();

  timerInt = setInterval(()=>{
    timeLeft -= 0.1;
    const pct = Math.max(0, timeLeft/DURATION*100);
    tBar.style.width = pct+'%';
    if(timeLeft<=8) tBar.style.background='#ff3300';
    hTime.textContent = Math.ceil(Math.max(0,timeLeft));
    if(timeLeft<=0) endGame();
  }, 100);

  spawnNext(1600);
}

function spawnNext(delay) {
  if(state!=='playing') return;
  spawnTmt = setTimeout(()=>{
    if(state!=='playing') return;
    spawnPopup();
    const elapsed = DURATION - timeLeft;
    const nd = Math.max(500, 1600 - elapsed*38);
    spawnNext(nd);
  }, delay);
}

function spawnPopup() {
  const W = arena.offsetWidth, H = arena.offsetHeight;
  const pw = Math.min(206, W - 24), ph=148, hudH=54;
  const x = Math.random()*(W-pw-16)+8;
  const y = Math.random()*(H-ph-hudH-16)+hudH+8;
  const d = POPUP_DATA[Math.floor(Math.random()*POPUP_DATA.length)];

  const p = document.createElement('div');
  p.className='fp';
  p.style.left=x+'px'; p.style.top=y+'px';
  p.style.width=pw+'px';
  p.innerHTML=`
    <div class="fp-bar">
      <span class="fp-bar-t">${d.bar}</span>
      <span class="fp-x">✕</span>
    </div>
    <div class="fp-body">${d.body}</div>
    <button class="fp-cta">${d.cta}</button>
  `;

  // ✕ = correct close
  p.querySelector('.fp-x').addEventListener('click', e=>{
    e.stopPropagation();
    if(state!=='playing') return;
    killPopup(p, true, x, y);
  });
  // CTA = miss
  p.querySelector('.fp-cta').addEventListener('click', e=>{
    e.stopPropagation();
    if(state!=='playing') return;
    registerMiss();
    p.classList.remove('shake'); void p.offsetWidth; p.classList.add('shake');
  });
  // Body click = miss
  p.addEventListener('click', ()=>{
    if(state!=='playing') return;
    registerMiss();
    p.classList.remove('shake'); void p.offsetWidth; p.classList.add('shake');
  });

  arena.appendChild(p);

  // Auto-escape after 4.5-7s
  p._esc = setTimeout(()=>{
    if(p.parentNode && state==='playing') {
      p.classList.add('dying');
      setTimeout(()=>{ if(p.parentNode) p.remove(); }, 200);
    }
  }, 4500 + Math.random()*2500);
}

function killPopup(p, scored, x, y) {
  clearTimeout(p._esc);
  p.classList.add('dying');
  if(scored){
    score++;
    updateHUD();
    const sp = document.createElement('div');
    sp.className='s-pop';
    sp.textContent='+1';
    sp.style.left=(x+80)+'px';
    sp.style.top=(y+16)+'px';
    arena.appendChild(sp);
    setTimeout(()=>sp.remove(), 680);
  }
  setTimeout(()=>{ if(p.parentNode) p.remove(); }, 200);
}

function registerMiss(){
  misses++;
  updateHUD();
  missFlash.classList.add('on');
  setTimeout(()=>missFlash.classList.remove('on'), 180);
}

function updateHUD(){
  hScore.textContent=score;
  hMiss.textContent=misses;
  hMiss.className='hud-val'+(misses>4?' red':'');
}

function pauseGame(){
  if(state==='playing'){
    state='paused';
    clearInterval(timerInt); clearTimeout(spawnTmt);
    document.getElementById('btnPause').textContent='Продолжить';
  } else if(state==='paused'){
    state='playing';
    document.getElementById('btnPause').textContent='Пауза';
    timerInt=setInterval(()=>{
      timeLeft-=0.1;
      tBar.style.width=Math.max(0,timeLeft/DURATION*100)+'%';
      if(timeLeft<=8) tBar.style.background='#ff3300';
      hTime.textContent=Math.ceil(Math.max(0,timeLeft));
      if(timeLeft<=0) endGame();
    },100);
    const elapsed=DURATION-timeLeft;
    spawnNext(Math.max(500,1600-elapsed*38));
  }
}

function endGame(){
  state='over';
  clearInterval(timerInt); clearTimeout(spawnTmt);
  arena.querySelectorAll('.fp').forEach(p=>{ clearTimeout(p._esc); p.remove(); });
  if(score>best) best=score;
  document.getElementById('btnPause').style.display='none';
  document.getElementById('gFinalScore').textContent=score;
  document.getElementById('gFinalMiss').textContent=misses;
  document.getElementById('gBest').textContent=best;
  const grades=[
    [22,'Легенда! Ты закрывал поп-апы быстрее любого антивируса 2003 года.'],
    [15,'Отлично! В 2000-х ты бы выжил без единого вируса.'],
    [8,'Неплохо. Но пару троянов ты бы всё-таки поймал.'],
    [0,'В 2003-м твой компьютер был бы полон malware уже через 10 минут.'],
  ];
  document.getElementById('gGrade').textContent = grades.find(g=>score>=g[0])[1];
  tBar.style.width='0%';
  ovOver.style.display='flex';
}

document.getElementById('btnStart').addEventListener('click', startGame);
document.getElementById('btnRestart').addEventListener('click', startGame);