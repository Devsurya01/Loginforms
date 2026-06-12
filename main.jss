let mode = 'login';
const usersDB = JSON.parse(localStorage.getItem('usersDB')) || {};

function saveUsersToStorage() {
  localStorage.setItem('usersDB', JSON.stringify(usersDB));
}

// Track mouse movement to create a parallax effect on background bubbles
document.addEventListener('mousemove', (e) => {
  const x = e.clientX - window.innerWidth / 2;
  const y = e.clientY - window.innerHeight / 2;
  document.documentElement.style.setProperty('--mouse-x', `${x}px`);
  document.documentElement.style.setProperty('--mouse-y', `${y}px`);
});

document.addEventListener('DOMContentLoaded', () => {
  const signupPass = document.getElementById('signup-password');
  if (signupPass) {
    signupPass.addEventListener('input', (e) => {
      const pw = e.target.value;
      const wrap = document.getElementById('pw-strength');
      const fill = document.getElementById('pw-fill');
      const text = document.getElementById('pw-text');
      
      if (!pw) {
        wrap.style.display = 'none';
        return;
      }
      wrap.style.display = 'block';
      
      let score = 0;
      if (pw.length > 5) score++;
      if (pw.length >= 8) score++;
      if (/[A-Z]/.test(pw)) score++;
      if (/[0-9]/.test(pw)) score++;
      if (/[^A-Za-z0-9]/.test(pw)) score++;
      
      let w = '33%', c = '#ff4d4d', l = 'Weak';
      if (score >= 3 && score < 5) { w = '66%'; c = '#f0c400'; l = 'Medium'; }
      else if (score >= 5) { w = '100%'; c = '#38A169'; l = 'Strong'; }
      
      fill.style.width = w;
      fill.style.backgroundColor = c;
      text.textContent = l;
      text.style.color = c;
    });
  }
});

function switchTo(target) {
  if (target === mode) return;
  mode = target;
  const card = document.getElementById('card');

  if (target === 'signup') {
    card.classList.add('signup');
  } else {
    card.classList.remove('signup');
  }
}

function handleLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass  = document.getElementById('login-password').value;
  const errorMsg = document.getElementById('login-error');
  errorMsg.style.display = 'none';

  if (!email || !pass) { shakeBtn('login'); return; }

  if (!usersDB[email]) {
    errorMsg.textContent = "Account not found. Please create a new account.";
    errorMsg.style.display = 'block';
    shakeBtn('login');
    return;
  }
  if (usersDB[email].pass !== pass) {
    errorMsg.textContent = "Incorrect password.";
    errorMsg.style.display = 'block';
    shakeBtn('login');
    return;
  }

  showWelcome(usersDB[email].user, false, { email, pass });
}

function handleSignup() {
  const user = document.getElementById('signup-username').value.trim();
  const email= document.getElementById('signup-email').value.trim();
  const pass = document.getElementById('signup-password').value;
  const errorMsg = document.getElementById('signup-error');
  errorMsg.style.display = 'none';

  if (!user || !email || !pass) { shakeBtn('signup'); return; }
  if (usersDB[email]) {
    errorMsg.textContent = "An account with this email already exists.";
    errorMsg.style.display = 'block';
    shakeBtn('signup');
    return;
  }
  if (pass.length < 8) {
    const el = document.getElementById('signup-password');
    el.classList.add('shake');
    el.addEventListener('animationend',()=>el.classList.remove('shake'),{once:true});
    return;
  }

  usersDB[email] = { user, pass };
  saveUsersToStorage();
  showWelcome(user, true, { email, pass });
}

async function socialAuth(providerName) {
  try {
    // Dynamically import Firebase Auth modules
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js");
    const { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js");

    // Initialize Firebase only once per session
    if (!window.firebaseApp) {
      // IMPORTANT: Replace this configuration with your actual Firebase Project config!
      const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_PROJECT_ID.appspot.com",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID"
      };
      window.firebaseApp = initializeApp(firebaseConfig);
      window.firebaseAuth = getAuth(window.firebaseApp);
    }

    let provider;
    if (providerName === 'Google') {
      provider = new GoogleAuthProvider();
      // Force account selection so users can choose between multiple emails
      provider.setCustomParameters({ prompt: 'select_account' });
    } else if (providerName === 'GitHub') {
      provider = new GithubAuthProvider();
    }

    // Open the login popup
    const result = await signInWithPopup(window.firebaseAuth, provider);
    const user = result.user;
    
    // Store them in the local database and show the welcome screen
    usersDB[user.email] = { user: user.displayName || user.email.split('@')[0], pass: `Connected via ${providerName}` };
    saveUsersToStorage();
    
    showWelcome(user.displayName || user.email.split('@')[0], false, { email: user.email, pass: `Connected via ${providerName}` });
  } catch (error) {
    console.error("Auth error:", error);
    alert("Authentication failed! Make sure you added your Firebase config. Error: " + error.message);
  }
}

function showWelcome(name, isNew, details = null) {
  const wp   = document.getElementById('welcome-page');
  const wName= document.getElementById('w-name');
  const wSub = document.getElementById('w-sub');
  const wTag = document.getElementById('w-tag');
  const wEmoji = document.getElementById('w-emoji');
  const wDetails = document.getElementById('w-details');

  wName.textContent = name;
  wTag.textContent  = isNew ? 'Account created!' : "You're in";
  wEmoji.textContent= isNew ? '🎉' : '👋';
  wSub.textContent  = isNew
    ? 'Thank you for creating your account. Welcome to the community!'
    : 'Great to have you back. Everything is right where you left it.';

  if (details && wDetails) {
    wDetails.style.display = 'grid';
    wDetails.innerHTML = `<div class="detail-row"><strong>Email</strong><span>${details.email}</span></div><div class="detail-row"><strong>Password</strong><span>${details.pass}</span></div>`;
  } else if (wDetails) {
    wDetails.style.display = 'none';
    wDetails.innerHTML = '';
  }

  // reset animations
  [wp.querySelector('.w-emoji'),wp.querySelector('.w-tag'),
   wp.querySelector('.w-title'), wName, wp.querySelector('.w-line'), wSub, wDetails, wp.querySelector('.btn-logout')]
    .forEach(el => {
      if (el) { el.style.animation='none'; void el.offsetWidth; el.style.animation=''; }
    });

  wp.classList.add('show');
}

function handleLogout() {
  document.getElementById('welcome-page').classList.remove('show');
  
  // Clear the input fields
  document.getElementById('login-email').value = '';
  const lp = document.getElementById('login-password');
  lp.value = ''; lp.type = 'password';
  document.getElementById('signup-username').value = '';
  document.getElementById('signup-email').value = '';
  const sp = document.getElementById('signup-password');
  sp.value = ''; sp.type = 'password';
  
  // Reset toggle buttons to default closed eye
  const eyeIcon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
  document.querySelectorAll('.btn-toggle-pw').forEach(btn => btn.innerHTML = eyeIcon);

  document.getElementById('login-error').style.display = 'none';
  document.getElementById('signup-error').style.display = 'none';
  document.getElementById('pw-strength').style.display = 'none';
  
  switchTo('login');
}

function shakeBtn(panel) {
  const btn = document.querySelector(`#${panel}-panel .btn-primary`);
  btn.classList.add('shake');
  btn.addEventListener('animationend',()=>btn.classList.remove('shake'),{once:true});
}

function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';
  } else {
    input.type = 'password';
    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
  }
}