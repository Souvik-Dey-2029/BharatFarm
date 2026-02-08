// ============================================
// SUBSCRIPTION FEATURE
// ============================================

function openSubscription() {
    const modal = document.getElementById('subscriptionModal');
    if (modal) {
        modal.style.display = 'flex';
        // Add class to body to prevent scrolling
        document.body.style.overflow = 'hidden';
    }
}

function closeSubscription() {
    const modal = document.getElementById('subscriptionModal');
    if (modal) {
        modal.style.display = 'none';
        // Restore scrolling
        document.body.style.overflow = '';
    }
}

function handleSubscribe() {
    alert("Feature will be added soon");
}

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('subscriptionModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeSubscription();
            }
        });
    }
});
