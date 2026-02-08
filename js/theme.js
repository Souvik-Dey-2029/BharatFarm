// ============================================
// THEME MANAGEMENT
// ============================================

function toggleTheme() {
    const html = document.documentElement;
    const newTheme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('farmassist-theme', newTheme);
}

function loadSavedTheme() {
    const savedTheme = localStorage.getItem('farmassist-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}
