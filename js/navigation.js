// ============================================
// NAVIGATION FUNCTIONS
// ============================================

function showSection(sectionId, button) {
    document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active'));
    if (button) button.classList.add('active');
    const nav = document.getElementById('mainNav');
    if (nav) nav.classList.remove('mobile-open');
}

function toggleMobileMenu() {
    const nav = document.getElementById('mainNav');
    if (nav) nav.classList.toggle('mobile-open');
}

function showAboutPage() {
    document.getElementById('aboutPage').style.display = 'block';
    document.getElementById('appContainer').style.display = 'none';
    document.getElementById('authPage').style.display = 'none';
}

function hideAboutPage() {
    document.getElementById('aboutPage').style.display = 'none';
    const currentUser = localStorage.getItem('bharatfarm_current_user');
    if (currentUser) {
        document.getElementById('appContainer').style.display = 'block';
    } else {
        document.getElementById('authPage').style.display = 'flex';
    }
}
