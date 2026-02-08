// ============================================
// MAIN APPLICATION INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    loadSavedTheme();

    const savedUser = localStorage.getItem('bharatfarm_current_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showApp();
        // Auto-detect location and fetch weather
        autoDetectLocation();
    }

    // Initialize drag and drop for scanner
    initScannerDragDrop();

    // Initialize land size listener
    initLandSizeListener();
});
