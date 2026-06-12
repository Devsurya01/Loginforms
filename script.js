/* ─── PANEL SWITCHING ─── */
const wrapper=document.getElementById('authWrapper');
document.getElementById('goSignup').addEventListener('click',()=>wrapper.classList.add('show-signup'));
document.getElementById('goLogin').addEventListener('click',()=>wrapper.classList.remove('show-signup'));
document.getElementById('linkSignup').addEventListener('click',(e)=>{ e.preventDefault(); wrapper.classList.add('show-signup'); });
document.getElementById('linkLogin').addEventListener('click',(e)=>{ e.preventDefault(); wrapper.classList.remove('show-signup'); });

/* ─── PASSWORD TOGGLE ─── */
function togglePw(id,btn){
  const inp=document.getElementById(id);
  const show=inp.type==='password';
  inp.type=show?'text':'password';
  btn.innerHTML=show
    ?`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
    :`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
}

/* ─── PASSWORD STRENGTH (Unique Feature #1) ─── */
function checkStrength(pw){
  const fill=document.getElementById('strengthFill');
  const label=document.getElementById('strengthLabel');
  const wrap=document.getElementById('strengthWrap');
  wrap.style.display='block';
  if(!pw){fill.style.width='0%';label.textContent='Type a password to check strength';return}

  let score=0;
  if(pw.length>=8)score++;
  if(pw.length>=12)score++;
  if(/[A-Z]/.test(pw))score++;
  if(/[0-9]/.test(pw))score++;
  if(/[^A-Za-z0-9]/.test(pw))score++;

  const levels=[
    {w:'20%',c:'#E53E3E',t:'Very weak'},
    {w:'40%',c:'#F6AD55',t:'Weak'},
    {w:'60%',c:'#F5C518',t:'Fair'},
    {w:'80%',c:'#68D391',t:'Strong'},
    {w:'100%',c:'#38A169',t:'Very strong ✦'}
  ];
  const l=levels[Math.min(score,4)];
  fill.style.width=l.w;
  fill.style.background=l.c;
  label.textContent=l.t;
  label.style.color=l.c;
}

/* ─── VALIDATION HELPERS ─── */
function isEmail(v){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())}
function setErr(fieldId,errId,show){
  const f=document.getElementById(fieldId);
  f.classList.toggle('err',show);
  f.classList.toggle('ok',!show&&document.getElementById(errId).closest('.field').querySelector('input').value);
}

/* Real-time clear on input */
['lg-email','lg-pw','sg-name','sg-email','sg-pw'].forEach(id=>{
  const el=document.getElementById(id);
  if(!el)return;
  el.addEventListener('input',()=>{
    const field=el.closest('.field');
    if(field.classList.contains('err'))field.classList.remove('err');
  });
  el.addEventListener('blur',()=>{
    if(id==='lg-email'&&el.value&&!isEmail(el.value))el.closest('.field').classList.add('err');
    if(id==='sg-email'&&el.value&&!isEmail(el.value))el.closest('.field').classList.add('err');
    if((id==='lg-pw'||id==='sg-pw')&&el.value&&el.value.length<8)el.closest('.field').classList.add('err');
    if(id==='sg-name'&&el.value)el.closest('.field').classList.add('ok');
    if(el.value&&!el.closest('.field').classList.contains('err'))el.closest('.field').classList.add('ok');
  });
});

/* ─── LOGIN SUBMIT ─── */
document.getElementById('loginForm').addEventListener('submit',function(e){
  e.preventDefault();
  const email=document.getElementById('lg-email').value.trim();
  const pw=document.getElementById('lg-pw').value;
  let ok=true;

  document.getElementById('lg-email-field').classList.remove('err','ok');
  document.getElementById('lg-pw-field').classList.remove('err','ok');

  if(!email||!isEmail(email)){document.getElementById('lg-email-field').classList.add('err');ok=false}
  else document.getElementById('lg-email-field').classList.add('ok');

  if(!pw||pw.length<8){document.getElementById('lg-pw-field').classList.add('err');ok=false}
  else document.getElementById('lg-pw-field').classList.add('ok');

  if(!ok){shakeForm('loginForm');return}

  const btn=document.getElementById('loginBtn');
  btn.disabled=true;btn.classList.add('loading');
  btn.querySelector('.btn-text').textContent='Signing in…';

  setTimeout(()=>{
    btn.disabled=false;btn.classList.remove('loading');
    btn.querySelector('.btn-text').textContent='Sign In →';
    document.getElementById('loginSuccess').classList.add('show');
  },1800);
});

/* ─── SIGNUP SUBMIT ─── */
document.getElementById('signupForm').addEventListener('submit',function(e){
  e.preventDefault();
  const name=document.getElementById('sg-name').value.trim();
  const email=document.getElementById('sg-email').value.trim();
  const pw=document.getElementById('sg-pw').value;
  let ok=true;

  ['sg-name-field','sg-email-field','sg-pw-field'].forEach(id=>document.getElementById(id).classList.remove('err','ok'));

  if(!name){document.getElementById('sg-name-field').classList.add('err');ok=false}
  else document.getElementById('sg-name-field').classList.add('ok');
  if(!email||!isEmail(email)){document.getElementById('sg-email-field').classList.add('err');ok=false}
  else document.getElementById('sg-email-field').classList.add('ok');
  if(!pw||pw.length<8){document.getElementById('sg-pw-field').classList.add('err');ok=false}
  else document.getElementById('sg-pw-field').classList.add('ok');

  if(!ok){shakeForm('signupForm');return}

  const btn=document.getElementById('signupBtn');
  btn.disabled=true;btn.classList.add('loading');
  btn.querySelector('.btn-text').textContent='Creating account…';

  setTimeout(()=>{
    btn.disabled=false;btn.classList.remove('loading');
    btn.querySelector('.btn-text').textContent='Create Account →';
    document.getElementById('signupSuccess').classList.add('show');
  },2000);
});

/* ─── SHAKE ANIMATION ─── */
const shakeKF=document.createElement('style');
shakeKF.textContent='@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}';
document.head.appendChild(shakeKF);
function shakeForm(id){
  const f=document.getElementById(id);
  f.style.animation='none';void f.offsetWidth;
  f.style.animation='shake .4s ease';
  setTimeout(()=>f.style.animation='',500);
}

/* ─── SUCCESS RESET ─── */
function resetSuccess(type){
  if(type==='login'){
    document.getElementById('loginSuccess').classList.remove('show');
    document.getElementById('loginForm').reset();
    ['lg-email-field','lg-pw-field'].forEach(id=>document.getElementById(id).classList.remove('err','ok'));
  } else {
    document.getElementById('signupSuccess').classList.remove('show');
    document.getElementById('signupForm').reset();
    ['sg-name-field','sg-email-field','sg-pw-field'].forEach(id=>document.getElementById(id).classList.remove('err','ok'));
    document.getElementById('strengthFill').style.width='0%';
    document.getElementById('strengthLabel').textContent='Type a password to check strength';
    document.getElementById('strengthWrap').style.display='none';
  }
}

/* ─── UNIQUE FEATURE #2: Keyboard shortcut hint ─── */
document.addEventListener('keydown',e=>{
  if(e.ctrlKey&&e.key==='ArrowRight'){e.preventDefault();wrapper.classList.add('show-signup')}
  if(e.ctrlKey&&e.key==='ArrowLeft'){e.preventDefault();wrapper.classList.remove('show-signup')}
});

/* ─── UNIQUE FEATURE #3: Live email domain suggestion ─── */
const commonDomains=['gmail.com','yahoo.com','outlook.com','hotmail.com','icloud.com'];
function addSuggestion(inputId){
  const inp=document.getElementById(inputId);
  let tip=document.createElement('div');
  tip.style.cssText='position:absolute;right:12px;font-size:.72rem;color:#888;pointer-events:none;white-space:nowrap;transition:opacity .2s;opacity:0;';
  inp.parentElement.style.position='relative';
  inp.parentElement.appendChild(tip);
  inp.addEventListener('input',()=>{
    const v=inp.value;const atIdx=v.indexOf('@');
    if(atIdx>0&&v.length>atIdx+1){
      const partial=v.slice(atIdx+1).toLowerCase();
      const match=commonDomains.find(d=>d.startsWith(partial)&&d!==partial);
      if(match){tip.textContent=match.slice(partial.length);tip.style.opacity='1'}
      else{tip.style.opacity='0'}
    } else{tip.style.opacity='0'}
  });
}
addSuggestion('lg-email');
addSuggestion('sg-email');