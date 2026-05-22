// ============================================================
//  BharatFarm — Email OTP Authentication System
//  All auth flows require real Email OTP verification.
//  No registration or login is possible without it.
// ============================================================

// ── State ────────────────────────────────────────────────────
let currentUser       = null;  // active session user
let otpFlowState      = null;  // { action, email, formData }
let otpCountdownTimer = null;  // setInterval handle

const COUNTDOWN_SECS  = 60;   // resend OTP cooldown

// ── Email validation ──────────────────────────────────────────
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

// ── Tab switcher ─────────────────────────────────────────────
function switchAuthTab(tab) {
    // Hide OTP step if going back to a form tab
    hideOTPStep();

    document.querySelectorAll('.auth-tabs button').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`.auth-tabs button[data-tab="${tab}"]`);
    if (activeBtn) activeBtn.classList.add('active');

    const loginForm    = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const authTitle    = document.getElementById('authTitle');
    const authSubtitle = document.getElementById('authSubtitle');

    loginForm.style.display    = 'none';
    registerForm.style.display = 'none';

    if (tab === 'login') {
        loginForm.style.display = 'block';
        authTitle.textContent   = 'Welcome Back';
        authSubtitle.textContent = 'Login to your farming dashboard';
    } else if (tab === 'register') {
        registerForm.style.display = 'block';
        authTitle.textContent      = 'Create Account';
        authSubtitle.textContent   = 'Register to start smart farming';
    }
}

// ════════════════════════════════════════════════════════════
//  STEP 1 — Initiate OTP
//  action: 'login' | 'register'
// ════════════════════════════════════════════════════════════

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();

    if (!validateEmail(email)) {
        return showAuthError('loginError', 'Please enter a valid email address.');
    }

    clearAuthError('loginError');
    await initiateOTP('login', email, { email });
}

async function handleRegister(e) {
    e.preventDefault();
    const name     = document.getElementById('regName').value.trim();
    const email    = document.getElementById('regEmail').value.trim();
    const userType = document.getElementById('regUserType').value;

    if (!name || name.length < 2) return showAuthError('registerError', 'Name must be at least 2 characters.');
    if (!validateEmail(email))    return showAuthError('registerError', 'Please enter a valid email address.');
    if (!userType)                return showAuthError('registerError', 'Please select your user type.');

    clearAuthError('registerError');
    await initiateOTP('register', email, { name, email, userType });
}

// Core: call /api/otp/send and reveal OTP step
async function initiateOTP(action, email, formData) {
    const btnMap = {
        login:    'loginSubmitBtn',
        register: 'registerSubmitBtn'
    };
    const btn = document.getElementById(btnMap[action]);
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending OTP…'; }

    try {
        const res  = await fetch('/api/otp/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, action })
        });
        const data = await res.json();

        if (!data.success) {
            showAuthError(`${action}Error`, data.error || 'Failed to send OTP. Please try again.');
            return;
        }

        // Save state for step 2
        otpFlowState = { action, email, formData };

        // Show OTP UI
        showOTPStep(email, action);

    } catch (err) {
        const errId = `${action}Error`;
        showAuthError(errId, 'Server error. Make sure the server is running and SMTP is configured in .env');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send OTP to Email';
        }
    }
}

// ════════════════════════════════════════════════════════════
//  OTP  STEP  UI
// ════════════════════════════════════════════════════════════

function showOTPStep(email, action) {
    // Hide all forms
    document.getElementById('loginForm').style.display    = 'none';
    document.getElementById('registerForm').style.display = 'none';
    document.querySelectorAll('.auth-tabs').forEach(el => el.style.display = 'none');

    const otpStep = document.getElementById('otpStep');
    otpStep.style.display = 'block';
    otpStep.classList.add('otp-step-enter');
    setTimeout(() => otpStep.classList.remove('otp-step-enter'), 400);

    document.getElementById('otpEmailDisplay').textContent = email;

    const actionLabels = {
        login:    'Verify to Login',
        register: 'Verify to Register'
    };
    document.getElementById('otpActionLabel').textContent = actionLabels[action] || 'Verify Email';

    // Clear inputs
    document.querySelectorAll('.otp-box').forEach(el => { el.value = ''; el.classList.remove('otp-box-error', 'otp-box-success'); });
    clearAuthError('otpError');

    // Focus first box
    const firstBox = document.querySelector('.otp-box');
    if (firstBox) setTimeout(() => firstBox.focus(), 100);

    // Start countdown
    startOTPCountdown();
}

function hideOTPStep() {
    const otpStep = document.getElementById('otpStep');
    if (otpStep) otpStep.style.display = 'none';
    document.querySelectorAll('.auth-tabs').forEach(el => el.style.display = 'flex');
    stopOTPCountdown();
}

function backFromOTP() {
    if (!otpFlowState) { switchAuthTab('login'); return; }
    const tab = otpFlowState.action;
    otpFlowState = null;
    switchAuthTab(tab);
}

// ── OTP Countdown ─────────────────────────────────────────────
function startOTPCountdown() {
    stopOTPCountdown();
    let secs = COUNTDOWN_SECS;
    const countdownEl = document.getElementById('otpCountdown');
    const timerEl     = document.getElementById('otpTimerText');
    const resendBtn   = document.getElementById('otpResendBtn');

    if (resendBtn) resendBtn.style.display = 'none';
    if (timerEl)   timerEl.style.display   = 'inline';

    function tick() {
        if (countdownEl) countdownEl.textContent = secs;
        if (secs <= 0) {
            stopOTPCountdown();
            if (timerEl)   timerEl.style.display   = 'none';
            if (resendBtn) resendBtn.style.display  = 'inline-flex';
        } else {
            secs--;
        }
    }
    tick();
    otpCountdownTimer = setInterval(tick, 1000);
}

function stopOTPCountdown() {
    if (otpCountdownTimer) { clearInterval(otpCountdownTimer); otpCountdownTimer = null; }
}

async function resendOTP() {
    if (!otpFlowState) return;
    const { action, email, formData } = otpFlowState;
    hideOTPStep();
    await initiateOTP(action, email, formData);
}

// ── OTP box keyboard & paste handling ────────────────────────
function initOTPBoxes() {
    const boxes = document.querySelectorAll('.otp-box');

    boxes.forEach((box, idx) => {
        // Allow only digits
        box.addEventListener('input', () => {
            box.value = box.value.replace(/\D/g, '').slice(-1);
            if (box.value && idx < boxes.length - 1) boxes[idx + 1].focus();
        });

        box.addEventListener('keydown', e => {
            if (e.key === 'Backspace' && !box.value && idx > 0) {
                boxes[idx - 1].focus();
            }
            if (e.key === 'ArrowLeft'  && idx > 0)              boxes[idx - 1].focus();
            if (e.key === 'ArrowRight' && idx < boxes.length-1) boxes[idx + 1].focus();
            if (e.key === 'Enter') verifyOTPAndProceed();
        });

        // Handle paste — spread 6 digits across boxes
        box.addEventListener('paste', e => {
            e.preventDefault();
            const pasted = (e.clipboardData || window.clipboardData)
                .getData('text').replace(/\D/g, '').slice(0, 6);
            [...pasted].forEach((ch, i) => {
                if (boxes[idx + i]) boxes[idx + i].value = ch;
            });
            const nextEmpty = idx + pasted.length;
            if (nextEmpty < boxes.length) boxes[nextEmpty].focus();
            else boxes[boxes.length - 1].focus();
        });
    });
}

function getEnteredOTP() {
    return [...document.querySelectorAll('.otp-box')].map(b => b.value).join('');
}

// ════════════════════════════════════════════════════════════
//  STEP 2 — Verify OTP → Login / Register successfully
// ════════════════════════════════════════════════════════════

async function verifyOTPAndProceed() {
    if (!otpFlowState) return;
    const { action, email, formData } = otpFlowState;
    const otp = getEnteredOTP();

    if (otp.length !== 6) {
        return showAuthError('otpError', 'Please enter all 6 digits of your OTP.');
    }

    // Highlight boxes
    document.querySelectorAll('.otp-box').forEach(b => b.classList.remove('otp-box-error'));

    const verifyBtn = document.getElementById('verifyOTPBtn');
    if (verifyBtn) { verifyBtn.disabled = true; verifyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying…'; }

    try {
        // 1. Verify & Authenticate
        const vRes  = await fetch('/api/otp/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp, action, ...formData })
        });
        const vData = await vRes.json();

        if (!vData.success) {
            document.querySelectorAll('.otp-box').forEach(b => b.classList.add('otp-box-error'));
            showAuthError('otpError', vData.error || 'OTP verification failed.');
            if (verifyBtn) { verifyBtn.disabled = false; verifyBtn.innerHTML = '<i class="fas fa-check-circle"></i> Verify & Continue'; }
            return;
        }

        // Show tick in all boxes
        document.querySelectorAll('.otp-box').forEach(b => { b.classList.remove('otp-box-error'); b.classList.add('otp-box-success'); });

        // Save session & boot app!
        currentUser = vData.user;
        localStorage.setItem('bharatfarm_current_user', JSON.stringify(vData.user));
        otpFlowState = null;
        showLoadingPage();

    } catch (err) {
        showAuthError('otpError', 'Server error during verification. Please try again.');
    }

    if (verifyBtn) { verifyBtn.disabled = false; verifyBtn.innerHTML = '<i class="fas fa-check-circle"></i> Verify & Continue'; }
}


// ════════════════════════════════════════════════════════════
//  UI  HELPERS
// ════════════════════════════════════════════════════════════

function showAuthError(id, message, type = 'error') {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent  = message;
    el.className    = `auth-message auth-message--${type}`;
    el.style.display = 'block';
}

function clearAuthError(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent   = '';
    el.style.display = 'none';
}

// ════════════════════════════════════════════════════════════
//  SESSION  /  APP  INIT
// ════════════════════════════════════════════════════════════

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('bharatfarm_current_user');
    document.getElementById('authPage').style.display = 'flex';
    document.getElementById('appContainer').classList.remove('active');
    switchAuthTab('login');
}

function showApp() {
    document.getElementById('authPage').style.display = 'none';
    document.getElementById('appContainer').classList.add('active');
    const userNameEl   = document.getElementById('userName');
    const welcomeNameEl = document.getElementById('welcomeName');
    if (userNameEl)    userNameEl.textContent    = currentUser.name;
    if (welcomeNameEl) welcomeNameEl.textContent = currentUser.name.split(' ')[0];
    initCropGrid();
    initDefaultNotifications();
    checkAPIStatus();
    fetchWeather();
    if (typeof showSection === 'function') showSection('dashboard');
}

function showLoadingPage() {
    document.getElementById('authPage').style.display = 'none';
    document.getElementById('loadingPage').classList.add('active');

    const statusEl = document.getElementById('loadingStatus');
    const messages = [
        'Initializing…', 'Loading weather data…', 'Preparing crop database…',
        'Setting up scanner…', 'Almost ready…', 'Welcome!'
    ];
    let i = 0;
    const iv = setInterval(() => {
        if (++i < messages.length && statusEl) statusEl.textContent = messages[i];
    }, 450);

    setTimeout(() => {
        clearInterval(iv);
        document.getElementById('loadingPage').classList.remove('active');
        showApp();
    }, 2800);
}

// ── Boot: restore session ─────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initOTPBoxes();

    const saved = localStorage.getItem('bharatfarm_current_user');
    if (saved) {
        try {
            currentUser = JSON.parse(saved);
            showApp();
            return;
        } catch (_) { localStorage.removeItem('bharatfarm_current_user'); }
    }
    switchAuthTab('login');
});

// ─────────────────────────────────────────────────────────────
//  Password visibility toggle
// ─────────────────────────────────────────────────────────────
function togglePwVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    const icon = btn.querySelector('i');
    if (icon) icon.className = show ? 'fas fa-eye-slash' : 'fas fa-eye';
}
