// ============================================
// USER PROFILE & ACTIVITY TRACKING
// ============================================

// Initialize user profile data structure
function initUserProfile() {
    const currentUser = localStorage.getItem('bharatfarm_current_user');
    if (!currentUser) return;

    const users = JSON.parse(localStorage.getItem('bharatfarm_users') || '[]');
    const user = users.find(u => u.username === currentUser);

    if (user && !user.profile) {
        user.profile = {
            memberSince: new Date().toISOString().split('T')[0],
            location: '',
            preferences: {
                crops: [],
                landSize: ''
            },
            statistics: {
                totalScans: 0,
                weatherChecks: 0,
                calculations: 0,
                cropsTracked: 0
            }
        };
        localStorage.setItem('bharatfarm_users', JSON.stringify(users));
    }
}

// Get user profile
function getUserProfile() {
    const currentUserData = localStorage.getItem('bharatfarm_current_user');
    console.log('Current user data from localStorage:', currentUserData);

    if (!currentUserData) return null;

    // Auth system stores the entire user object as JSON, not just username
    let currentUser;
    try {
        currentUser = JSON.parse(currentUserData);
        console.log('Parsed current user:', currentUser);
    } catch (e) {
        console.error('Error parsing current user:', e);
        return null;
    }

    // If currentUser is already the full user object (from auth.js), use it directly
    if (currentUser && currentUser.username) {
        console.log('Using current user object directly');

        // Initialize profile if it doesn't exist
        if (!currentUser.profile) {
            console.log('User found but no profile, initializing...');
            currentUser.profile = {
                memberSince: new Date().toISOString().split('T')[0],
                location: '',
                preferences: {
                    crops: [],
                    landSize: ''
                },
                statistics: {
                    totalScans: 0,
                    weatherChecks: 0,
                    calculations: 0,
                    cropsTracked: 0
                }
            };
            // Save back to localStorage
            localStorage.setItem('bharatfarm_current_user', JSON.stringify(currentUser));
        }

        return currentUser;
    }

    return null;
}

// Update user statistics
function updateUserStatistic(statKey) {
    const currentUserData = localStorage.getItem('bharatfarm_current_user');
    if (!currentUserData) return;

    try {
        const currentUser = JSON.parse(currentUserData);
        if (!currentUser || !currentUser.username) return;

        // Initialize profile if needed
        if (!currentUser.profile) {
            initUserProfile();
            return updateUserStatistic(statKey);
        }

        // Update statistic
        currentUser.profile.statistics[statKey]++;

        // Save back to localStorage
        localStorage.setItem('bharatfarm_current_user', JSON.stringify(currentUser));
    } catch (e) {
        console.error('Error updating user statistic:', e);
    }
}

// Activity logging
function logActivity(type, details, result = '') {
    const activities = JSON.parse(localStorage.getItem('bharatfarm_activities') || '[]');

    const activity = {
        id: Date.now().toString(),
        type: type, // 'scan', 'weather', 'calculation', 'crop'
        timestamp: new Date().toISOString(),
        details: details,
        result: result
    };

    activities.unshift(activity); // Add to beginning

    // Keep only last 100 activities
    if (activities.length > 100) {
        activities.pop();
    }

    localStorage.setItem('bharatfarm_activities', JSON.stringify(activities));
}

// Get activities with optional filter
function getActivities(filterType = 'all', limit = 50) {
    const activities = JSON.parse(localStorage.getItem('bharatfarm_activities') || '[]');

    let filtered = activities;
    if (filterType !== 'all') {
        filtered = activities.filter(a => a.type === filterType);
    }

    return filtered.slice(0, limit);
}

// Display profile page
function showProfilePage() {
    console.log('showProfilePage called');

    const user = getUserProfile();
    console.log('User profile:', user);

    if (!user) {
        console.error('No user found - this should not happen if logged in');
        alert('Error: User not found. Please try logging out and logging in again.');
        return; // MUST return here to prevent accessing undefined user
    }

    try {
        // Update profile info
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        const profileUsername = document.getElementById('profileUsername');

        if (!profileName || !profileEmail || !profileUsername) {
            console.error('Profile elements not found');
            return;
        }

        profileName.textContent = user.name || user.username;
        profileEmail.textContent = user.email || 'Not provided';
        profileUsername.textContent = '@' + user.username;

        const profile = user.profile || {};
        document.getElementById('profileMemberSince').textContent = formatDate(profile.memberSince || new Date().toISOString());
        document.getElementById('profileLocation').textContent = profile.location || 'Not set';

        // Update statistics
        const stats = profile.statistics || { totalScans: 0, weatherChecks: 0, calculations: 0, cropsTracked: 0 };
        document.getElementById('statScans').textContent = stats.totalScans;
        document.getElementById('statWeather').textContent = stats.weatherChecks;
        document.getElementById('statCalculations').textContent = stats.calculations;
        document.getElementById('statCrops').textContent = stats.cropsTracked;

        // Update preferences
        const prefs = profile.preferences || { crops: [], landSize: '' };
        document.getElementById('prefCrops').textContent = prefs.crops.length > 0 ? prefs.crops.join(', ') : 'None selected';
        document.getElementById('prefLandSize').textContent = prefs.landSize || 'Not set';

        // Display activities
        displayActivities('all');

        // Show profile section
        console.log('Calling showSection with profile');
        if (typeof showSection === 'function') {
            showSection('profile');
            console.log('Profile section should now be visible');
        } else {
            console.error('showSection function not found');
        }
    } catch (error) {
        console.error('Error in showProfilePage:', error);
        alert('Error loading profile: ' + error.message);
    }
}

// Display activities in timeline
function displayActivities(filterType = 'all') {
    const activities = getActivities(filterType);
    const timeline = document.getElementById('activityTimeline');

    if (activities.length === 0) {
        timeline.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-history"></i>
                <p>No activities yet. Start using BharatFarm to see your farming history!</p>
            </div>
        `;
        return;
    }

    timeline.innerHTML = activities.map(activity => {
        const icon = getActivityIcon(activity.type);
        const typeLabel = getActivityLabel(activity.type);

        return `
            <div class="activity-item">
                <div class="activity-header">
                    <div class="activity-type">
                        <i class="fas ${icon}"></i>
                        <span>${typeLabel}</span>
                    </div>
                    <div class="activity-time">${formatTimeAgo(activity.timestamp)}</div>
                </div>
                <div class="activity-details">${activity.details}</div>
                ${activity.result ? `<div class="activity-result"><strong>Result:</strong> ${activity.result}</div>` : ''}
            </div>
        `;
    }).join('');
}

// Filter activities
function filterActivities(type) {
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Display filtered activities
    displayActivities(type);
}

// Helper functions
function getActivityIcon(type) {
    const icons = {
        'scan': 'fa-camera',
        'weather': 'fa-cloud-sun',
        'calculation': 'fa-calculator',
        'crop': 'fa-leaf'
    };
    return icons[type] || 'fa-circle';
}

function getActivityLabel(type) {
    const labels = {
        'scan': 'Leaf Scan',
        'weather': 'Weather Check',
        'calculation': 'Cost Calculation',
        'crop': 'Crop Selection'
    };
    return labels[type] || 'Activity';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatTimeAgo(timestamp) {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return formatDate(timestamp);
}

// Initialize profile on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUserProfile);
} else {
    initUserProfile();
}

// Make functions globally accessible
window.showProfilePage = showProfilePage;
window.filterActivities = filterActivities;
window.logActivity = logActivity;
window.updateUserStatistic = updateUserStatistic;

console.log('Profile.js loaded - showProfilePage is available:', typeof showProfilePage);
