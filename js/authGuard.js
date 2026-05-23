// ============================================
// AUTH GUARD — Protect Pages
// ============================================
(function () {
    'use strict';
    const STORAGE_KEY = 'bharatfarm_current_user';

    function getAuthUser() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return null;
            const user = JSON.parse(raw);
            if (!user || !user.loggedIn) return null;
            return user;
        } catch (e) {
            return null;
        }
    }

    function guardPage() {
        const user = getAuthUser();
        if (!user) {
            // Show auth page instead of redirecting
            if (document.getElementById('authPage')) {
                document.getElementById('authPage').style.display = 'flex';
            }
            if (document.getElementById('appContainer')) {
                document.getElementById('appContainer').classList.remove('active');
            }
            return false;
        }
        return true;
    }

    // Call guardPage initially to setup UI state if on app.html
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    if (currentPage === 'app.html') {
        // Wait for DOM to load before manipulating UI
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', guardPage);
        } else {
            guardPage();
        }
    }

    window.BharatFarmAuth = {
        getUser: getAuthUser,
        isAuthenticated: function () { return getAuthUser() !== null; },
        guard: guardPage
    };
})();
