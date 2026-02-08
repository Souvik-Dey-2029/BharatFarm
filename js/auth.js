// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================

let currentUser = null;

function switchAuthTab(tab) {
    document.querySelectorAll('.auth-tabs button').forEach(btn => btn.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }

    if (tab === 'login') {
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('registerForm').style.display = 'none';
        document.getElementById('forgotPasswordForm').style.display = 'none';
        document.getElementById('authTitle').textContent = 'Welcome Back';
        document.getElementById('authSubtitle').textContent = 'Login to access your farming dashboard';
    } else if (tab === 'register') {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'block';
        document.getElementById('forgotPasswordForm').style.display = 'none';
        document.getElementById('authTitle').textContent = 'Create Account';
        document.getElementById('authSubtitle').textContent = 'Register to start smart farming';
    } else if (tab === 'forgot') {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'none';
        document.getElementById('forgotPasswordForm').style.display = 'block';
        document.getElementById('authTitle').textContent = 'Reset Password';
        document.getElementById('authSubtitle').textContent = 'Enter your phone number to reset your password';
        // Reset the form state
        document.getElementById('newPasswordGroup').style.display = 'none';
        document.getElementById('confirmNewPasswordGroup').style.display = 'none';
        document.getElementById('forgotPasswordBtn').innerHTML = '<i class="fas fa-search"></i> Verify Phone Number';
    }
}

function handleLogin(e) {
    e.preventDefault();
    const phone = document.getElementById('loginPhone').value;
    const password = document.getElementById('loginPassword').value;

    const users = JSON.parse(localStorage.getItem('bharatfarm_users') || '[]');
    const user = users.find(u => u.phone === phone && u.password === password);

    if (user) {
        currentUser = user;
        localStorage.setItem('bharatfarm_current_user', JSON.stringify(user));
        showLoadingPage();
    } else {
        alert('Invalid phone number or password!');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const phone = document.getElementById('regPhone').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    const users = JSON.parse(localStorage.getItem('bharatfarm_users') || '[]');
    if (users.find(u => u.phone === phone)) {
        alert('Phone number already registered!');
        return;
    }

    const newUser = {
        id: Date.now(),
        name,
        phone,
        password,
        createdAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem('bharatfarm_users', JSON.stringify(users));

    currentUser = newUser;
    localStorage.setItem('bharatfarm_current_user', JSON.stringify(newUser));
    showLoadingPage();
}

let forgotPasswordStep = 1; // Track the step in forgot password flow

function handleForgotPassword(e) {
    e.preventDefault();

    if (forgotPasswordStep === 1) {
        // Step 1: Verify phone number
        const phone = document.getElementById('forgotPhone').value;
        const users = JSON.parse(localStorage.getItem('bharatfarm_users') || '[]');
        const user = users.find(u => u.phone === phone);

        if (!user) {
            alert('Phone number not found! Please check and try again.');
            return;
        }

        // Phone verified, show password reset fields
        document.getElementById('newPasswordGroup').style.display = 'block';
        document.getElementById('confirmNewPasswordGroup').style.display = 'block';
        document.getElementById('forgotPasswordBtn').innerHTML = '<i class="fas fa-key"></i> Reset Password';
        document.getElementById('authSubtitle').textContent = 'Enter your new password';
        document.getElementById('forgotPhone').disabled = true;
        forgotPasswordStep = 2;

    } else if (forgotPasswordStep === 2) {
        // Step 2: Reset password
        const phone = document.getElementById('forgotPhone').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;

        if (newPassword !== confirmNewPassword) {
            alert('Passwords do not match!');
            return;
        }

        if (newPassword.length < 6) {
            alert('Password must be at least 6 characters long!');
            return;
        }

        // Update password in localStorage
        const users = JSON.parse(localStorage.getItem('bharatfarm_users') || '[]');
        const userIndex = users.findIndex(u => u.phone === phone);

        if (userIndex !== -1) {
            users[userIndex].password = newPassword;
            localStorage.setItem('bharatfarm_users', JSON.stringify(users));

            alert('Password reset successful! Please login with your new password.');

            // Reset form and switch to login
            document.getElementById('forgotPasswordForm').reset();
            document.getElementById('forgotPhone').disabled = false;
            forgotPasswordStep = 1;
            switchAuthTab('login');
        } else {
            alert('An error occurred. Please try again.');
        }
    }
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('bharatfarm_current_user');
    document.getElementById('authPage').style.display = 'flex';
    document.getElementById('appContainer').classList.remove('active');
}

function showApp() {
    document.getElementById('authPage').style.display = 'none';
    document.getElementById('appContainer').classList.add('active');
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('welcomeName').textContent = currentUser.name.split(' ')[0];
    initCropGrid();
    initDefaultNotifications();
    checkAPIStatus();
    fetchWeather();
}

function showLoadingPage() {
    document.getElementById('authPage').style.display = 'none';
    document.getElementById('loadingPage').classList.add('active');

    const statusEl = document.getElementById('loadingStatus');
    const messages = [
        'Initializing...',
        'Loading weather data...',
        'Preparing crop database...',
        'Setting up scanner...',
        'Almost ready...',
        'Welcome!'
    ];

    let messageIndex = 0;
    const statusInterval = setInterval(() => {
        messageIndex++;
        if (messageIndex < messages.length) {
            statusEl.textContent = messages[messageIndex];
        }
    }, 450);

    setTimeout(() => {
        clearInterval(statusInterval);
        document.getElementById('loadingPage').classList.remove('active');
        showApp();
    }, 2800);
}
