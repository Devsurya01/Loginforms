/* ─── PANEL SWITCHING ─── */
const card=document.getElementById('card');
function switchTo(mode) {
  if (mode === 'signup') card.classList.add('signup');
  else card.classList.remove('signup');
}

/* ─── PASSWORD TOGGLE ─── */
function togglePassword(id,btn){
  const inp=document.getElementById(id);
  const show=inp.type==='password';
  inp.type=show?'text':'password';
  btn.innerHTML=show
    ?`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
    :`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
}

/* ─── PASSWORD STRENGTH (Unique Feature #1) ─── */
function checkStrength(pw){
  const fill=document.getElementById('pw-fill');
  const label=document.getElementById('pw-text');
  const wrap=document.getElementById('pw-strength');
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
['login-email','login-password','signup-username','signup-email','signup-password'].forEach(id=>{
  const el=document.getElementById(id);
  if(!el)return;
  el.addEventListener('input',()=>{
    const field=el.closest('.field');
    if(field.classList.contains('err'))field.classList.remove('err');
    if(id==='signup-password') checkStrength(el.value);
  });
  el.addEventListener('blur',()=>{
    if(id==='login-email'&&el.value&&!isEmail(el.value))el.closest('.field').classList.add('err');
    if(id==='signup-email'&&el.value&&!isEmail(el.value))el.closest('.field').classList.add('err');
    if((id==='login-password'||id==='signup-password')&&el.value&&el.value.length<8)el.closest('.field').classList.add('err');
    if(id==='signup-username'&&el.value)el.closest('.field').classList.add('ok');
    if(el.value&&!el.closest('.field').classList.contains('err'))el.closest('.field').classList.add('ok');
  });
});

/* ─── LOGIN SUBMIT ─── */
function handleLogin() {
  const email=document.getElementById('login-email').value.trim();
  const pw=document.getElementById('login-password').value;
  const errorDiv=document.getElementById('login-error');
  let ok=true;

  if(!email||!isEmail(email)){ok=false;errorDiv.textContent='Valid email required.';}
  else if(!pw||pw.length<8){ok=false;errorDiv.textContent='Password must be at least 8 chars.';}

  if(!ok){
    errorDiv.style.display='block';
    shakeForm('login-panel');
    return;
  }

  errorDiv.style.display='none';
  const btn=document.querySelector('#login-panel .btn-primary');
  const originalText = btn.textContent;
  btn.disabled=true;
  btn.textContent='Signing in…';

  setTimeout(()=>{
    btn.disabled=false;
    btn.textContent=originalText;
    document.getElementById('welcome-page').classList.add('show');
    document.getElementById('w-name').textContent=email.split('@')[0];
  },1800);
}

/* ─── SIGNUP SUBMIT ─── */
function handleSignup() {
  const name=document.getElementById('signup-username').value.trim();
  const email=document.getElementById('signup-email').value.trim();
  const pw=document.getElementById('signup-password').value;
  const errorDiv=document.getElementById('signup-error');
  let ok=true;

  if(!name){ok=false;errorDiv.textContent='Username required.';}
  else if(!email||!isEmail(email)){ok=false;errorDiv.textContent='Valid email required.';}
  else if(!pw||pw.length<8){ok=false;errorDiv.textContent='Password must be at least 8 chars.';}

  if(!ok){
    errorDiv.style.display='block';
    shakeForm('signup-panel');
    return;
  }

  errorDiv.style.display='none';
  const btn=document.querySelector('#signup-panel .btn-primary');
  const originalText = btn.textContent;
  btn.disabled=true;
  btn.textContent='Creating account…';

  setTimeout(()=>{
    btn.disabled=false;
    btn.textContent=originalText;
    switchTo('login'); // smoothly slide back to login screen
  },2000);
}

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

/* ─── SOCIAL AUTH & LOGOUT ─── */
function socialAuth(provider) {
  alert(`Authenticating with ${provider}...`);
}
function handleLogout() {
  document.getElementById('welcome-page').classList.remove('show');
  document.getElementById('login-email').value = '';
  document.getElementById('login-password').value = '';
}

/* ─── UNIQUE FEATURE #2: Keyboard shortcut hint ─── */
document.addEventListener('keydown',e=>{
  if(e.ctrlKey&&e.key==='ArrowRight'){e.preventDefault();card.classList.add('signup')}
  if(e.ctrlKey&&e.key==='ArrowLeft'){e.preventDefault();card.classList.remove('signup')}
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
addSuggestion('login-email');
addSuggestion('signup-email');