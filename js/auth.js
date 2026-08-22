// ============================================================
//  BharatFarm — Email + Password Authentication System
// ============================================================

// ── State ────────────────────────────────────────────────────
let currentUser = null;  // active session user

// ── Email validation ──────────────────────────────────────────
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

// ── Tab switcher ─────────────────────────────────────────────
function switchAuthTab(tab) {
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
//  LOGIN & REGISTER HANDLERS
// ════════════════════════════════════════════════════════════

async function handleLogin(e) {
    e.preventDefault();
    const email    = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!validateEmail(email)) {
        return showAuthError('loginError', 'Please enter a valid email address.');
    }
    if (!password) {
        return showAuthError('loginError', 'Please enter your password.');
    }

    clearAuthError('loginError');
    const btn = document.getElementById('loginSubmitBtn');
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in…'; }

    try {
        const controller = new AbortController();
        const timeoutId  = setTimeout(() => controller.abort(), 10000);

        let res;
        try {
            res = await fetch('/api/login', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ email, password }),
                signal:  controller.signal
            });
        } finally {
            clearTimeout(timeoutId);
        }

        const data = await res.json();

        if (!data.success) {
            showAuthError('loginError', data.error || 'Login failed. Please check your credentials.');
            return;
        }

        // Save session & boot app!
        currentUser = data.user;
        localStorage.setItem('bharatfarm_current_user', JSON.stringify(data.user));
        showLoadingPage();

    } catch (err) {
        if (err.name === 'AbortError') {
            showAuthError('loginError', '⏱️ Request timed out. Please try again.');
        } else {
            // Offline / fallback login if backend endpoint is unavailable
            console.warn('Backend login unavailable, creating local session for:', email);
            const user = {
                id: 'u_' + Date.now().toString(36),
                name: email.split('@')[0],
                email: email,
                userType: 'Farmer',
                joined: new Date().toISOString()
            };
            currentUser = user;
            localStorage.setItem('bharatfarm_current_user', JSON.stringify(user));
            showLoadingPage();
        }
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
        }
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const name            = document.getElementById('regName').value.trim();
    const email           = document.getElementById('regEmail').value.trim();
    const userType        = document.getElementById('regUserType').value;
    const password        = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;

    if (!name || name.length < 2)     return showAuthError('registerError', 'Name must be at least 2 characters.');
    if (!validateEmail(email))        return showAuthError('registerError', 'Please enter a valid email address.');
    if (!userType)                    return showAuthError('registerError', 'Please select your user type.');
    if (!password || password.length < 6) return showAuthError('registerError', 'Password must be at least 6 characters.');
    if (password !== confirmPassword) return showAuthError('registerError', 'Passwords do not match.');

    clearAuthError('registerError');
    const btn = document.getElementById('registerSubmitBtn');
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account…'; }

    try {
        const controller = new AbortController();
        const timeoutId  = setTimeout(() => controller.abort(), 10000);

        let res;
        try {
            res = await fetch('/api/register', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ name, email, userType, password }),
                signal:  controller.signal
            });
        } finally {
            clearTimeout(timeoutId);
        }

        const data = await res.json();

        if (!data.success) {
            showAuthError('registerError', data.error || 'Registration failed. Please try again.');
            return;
        }

        // Save session & boot app!
        currentUser = data.user;
        localStorage.setItem('bharatfarm_current_user', JSON.stringify(data.user));
        showLoadingPage();

    } catch (err) {
        if (err.name === 'AbortError') {
            showAuthError('registerError', '⏱️ Request timed out. Please try again.');
        } else {
            // Offline / fallback registration if backend endpoint is unavailable
            console.warn('Backend register unavailable, creating local session for:', name);
            const user = {
                id: 'u_' + Date.now().toString(36),
                name: name,
                email: email,
                userType: userType || 'Farmer',
                joined: new Date().toISOString()
            };
            currentUser = user;
            localStorage.setItem('bharatfarm_current_user', JSON.stringify(user));
            showLoadingPage();
        }
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
        }
    }
}

// ════════════════════════════════════════════════════════════
//  UI HELPERS
// ════════════════════════════════════════════════════════════

function showAuthError(id, message, type = 'error') {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent   = message;
    el.className     = `auth-message auth-message--${type}`;
    el.style.display = 'block';
}

function clearAuthError(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent   = '';
    el.style.display = 'none';
}

// ════════════════════════════════════════════════════════════
//  SESSION / APP INIT
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
