// ============================================
// USER PROFILE & ACTIVITY TRACKING
// ============================================

// Initialize user profile data structure
function initUserProfile() {
    const currentUserRaw = localStorage.getItem('bharatfarm_current_user');
    if (!currentUserRaw) return;

    let current;
    try { current = JSON.parse(currentUserRaw); } catch(e) { return; }

    const users = JSON.parse(localStorage.getItem('bharatfarm_users') || '[]');
    let userIndex = users.findIndex(u => u.id === current.id || (current.email && u.email === current.email));

    if (userIndex === -1) {
        users.push(current);
        userIndex = users.length - 1;
    }

    if (!users[userIndex].profile) {
        users[userIndex].profile = {
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
        
        current.profile = users[userIndex].profile;
        localStorage.setItem('bharatfarm_current_user', JSON.stringify(current));
    }
}

// Get user profile
function getUserProfile() {
    const currentUserData = localStorage.getItem('bharatfarm_current_user');


    if (!currentUserData) return null;

    // Auth system stores the entire user object as JSON, not just username
    let currentUser;
    try {
        currentUser = JSON.parse(currentUserData);

    } catch (e) {
        console.error('Error parsing current user:', e);
        return null;
    }

    // If currentUser object exists (from auth.js), use it directly
    if (currentUser && (currentUser.id || currentUser.email || currentUser.phone || currentUser.username)) {
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
            
            // Sync to global users array
            const users = JSON.parse(localStorage.getItem('bharatfarm_users') || '[]');
            const userIndex = users.findIndex(u => u.id === currentUser.id || (currentUser.email && u.email === currentUser.email));
            if (userIndex !== -1) {
                users[userIndex].profile = currentUser.profile;
            } else {
                users.push(currentUser);
            }
            localStorage.setItem('bharatfarm_users', JSON.stringify(users));
        }

        return currentUser;
    }

    // If we're not logged in, return a default mock user so it always works
    let mockUser = {
        username: 'guest_user',
        name: 'Guest Farmer',
        phone: '1234567890',
        profile: {
            memberSince: new Date().toISOString().split('T')[0],
            location: 'Guest Location',
            preferences: { crops: [], landSize: '' },
            statistics: { totalScans: 0, weatherChecks: 0, calculations: 0, cropsTracked: 0 },
            profileImage: localStorage.getItem('bharatfarm_custom_profile_image') || ''
        }
    };

    return mockUser;
}

// Handle Profile Image Upload
function updateProfileImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imageData = e.target.result;
            // Save to localStorage
            localStorage.setItem('bharatfarm_custom_profile_image', imageData);

            // Update all profile images on the UI
            applyProfileImage(imageData);
        };
        reader.readAsDataURL(file);
    }
}

function applyProfileImage(imageData) {
    if (!imageData) return;

    // Header image
    const headerImg = document.getElementById('headerProfileImg');
    const headerIcon = document.getElementById('headerProfileIcon');
    if (headerImg && headerIcon) {
        headerImg.src = imageData;
        headerImg.style.display = 'block';
        headerIcon.style.display = 'none';
    }

    // Main profile page image
    const mainImg = document.getElementById('mainProfileImg');
    const mainIcon = document.getElementById('mainProfileIcon');
    if (mainImg && mainIcon) {
        mainImg.src = imageData;
        mainImg.style.display = 'block';
        mainIcon.style.display = 'none';
    }
}

// Hook into init to apply custom image on load
document.addEventListener('DOMContentLoaded', () => {
    const customImage = localStorage.getItem('bharatfarm_custom_profile_image');
    if (customImage) applyProfileImage(customImage);
});

// Update user statistics
function updateUserStatistic(statKey) {
    const currentUserData = localStorage.getItem('bharatfarm_current_user');
    if (!currentUserData) return;

    try {
        const currentUser = JSON.parse(currentUserData);
        if (!currentUser || (!currentUser.id && !currentUser.email && !currentUser.username && !currentUser.phone)) return;

        // Initialize profile if needed
        if (!currentUser.profile) {
            console.log('Profile missing, initiating initialization...');
            initUserProfile();
            
            // Re-fetch user to see if profile was created
            const refreshedUser = JSON.parse(localStorage.getItem('bharatfarm_current_user') || '{}');
            if (!refreshedUser.profile) {
                console.warn('Could not initialize profile for statistic update. Using guest-safe path.');
                return; // Stop recursion if profile still missing
            }
            return updateUserStatistic(statKey); 
        }

        // Update statistic
        if (currentUser.profile.statistics[statKey] === undefined) {
            currentUser.profile.statistics[statKey] = 0;
        }
        currentUser.profile.statistics[statKey]++;

        // Save back to localStorage
        localStorage.setItem('bharatfarm_current_user', JSON.stringify(currentUser));
        
        // Sync to global users array
        const users = JSON.parse(localStorage.getItem('bharatfarm_users') || '[]');
        const userIndex = users.findIndex(u => u.id === currentUser.id || (currentUser.email && u.email === currentUser.email));
        if (userIndex !== -1) {
            users[userIndex].profile = currentUser.profile;
        } else {
            users.push(currentUser);
        }
        localStorage.setItem('bharatfarm_users', JSON.stringify(users));
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


    const user = getUserProfile();


    if (!user) {
        console.error('No user found - this should not happen if logged in');
        alert('Error: User not found. Please try logging out and logging in again.');
        return; // MUST return here to prevent accessing undefined user
    }

    try {
        // Update profile info
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');

        if (!profileName || !profileEmail) {
            console.error('Profile elements not found');
            return;
        }

        profileName.textContent = user.name || user.username;
        profileEmail.textContent = user.email || 'Not provided';

        const profile = user.profile || {};
        
        const locElem = document.getElementById('profileLocation');
        locElem.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Locating...';

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    locElem.textContent = `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
                    
                    // Attempt reverse geocoding for a readable name
                    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
                        .then(res => res.json())
                        .then(data => {
                            if (data && data.address) {
                                const place = data.address.city || data.address.town || data.address.village || data.address.county;
                                const state = data.address.state;
                                if (place) locElem.textContent = `${place}, ${state}`;
                            }
                        }).catch(e => console.warn('Geocoding failed in profile:', e));
                },
                (error) => {
                    console.warn("Geolocation failed in profile:", error);
                    locElem.textContent = profile.location || 'Uluberia, West Bengal'; // Fallback
                },
                { enableHighAccuracy: true }
            );
        } else {
            locElem.textContent = profile.location || 'Not Supported';
        }

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

        if (typeof showSection === 'function') {
            showSection('profile');

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
    const activeBtn = document.querySelector(`.filter-btn[onclick*="'${type}'"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }

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
window.exportActivityPDF = exportActivityPDF;
window.startNameEdit = startNameEdit;
window.saveNameEdit = saveNameEdit;
window.cancelNameEdit = cancelNameEdit;

// ==========================================
// NAME EDITING
// ==========================================
function startNameEdit() {
    const currentName = document.getElementById('profileName').textContent.trim();
    document.getElementById('nameEditInput').value = currentName;
    document.getElementById('nameEditRow').style.display = 'flex';
    document.getElementById('editNameBtn').style.display = 'none';
    document.getElementById('nameEditInput').focus();
}

function cancelNameEdit() {
    document.getElementById('nameEditRow').style.display = 'none';
    document.getElementById('editNameBtn').style.display = 'flex';
}

function saveNameEdit() {
    const newName = document.getElementById('nameEditInput').value.trim();
    if (!newName) {
        alert('Name cannot be empty!');
        return;
    }

    // Update the visible profile name
    document.getElementById('profileName').textContent = newName;

    // Persist to localStorage
    try {
        const currentUserData = localStorage.getItem('bharatfarm_current_user');
        if (currentUserData) {
            const currentUser = JSON.parse(currentUserData);
            currentUser.name = newName;
            localStorage.setItem('bharatfarm_current_user', JSON.stringify(currentUser));

            // Sync to global users list
            const users = JSON.parse(localStorage.getItem('bharatfarm_users') || '[]');
            const userIndex = users.findIndex(u => u.id === currentUser.id || (currentUser.email && u.email === currentUser.email));
            if (userIndex !== -1) {
                users[userIndex].name = newName;
                localStorage.setItem('bharatfarm_users', JSON.stringify(users));
            }
        }
    } catch (e) {
        console.error('Error saving name to localStorage:', e);
    }

    // Update dashboard greeting if it exists on the page
    const welcomeName = document.getElementById('welcomeName');
    if (welcomeName) welcomeName.textContent = newName;

    // Exit edit mode
    cancelNameEdit();
}

// Request PDF Export
function exportActivityPDF() {
    const activityTimeline = document.getElementById('activityTimeline');
    if (!activityTimeline || activityTimeline.innerText.includes('No activities yet')) {
        alert('No activities to export!');
        return;
    }

    // Temporary styles to ensure full render
    const oldMaxHeight = activityTimeline.style.maxHeight;
    const oldOverflow = activityTimeline.style.overflow;
    activityTimeline.style.maxHeight = 'none';
    activityTimeline.style.overflow = 'visible';

    // Create a container
    const pdfContainer = document.createElement('div');
    pdfContainer.style.padding = '20px';
    pdfContainer.style.fontFamily = 'Arial, sans-serif';
    pdfContainer.style.color = '#333';

    const header = document.createElement('h2');
    header.innerText = 'BharatFarm - My Farming Activity History';
    header.style.textAlign = 'center';
    header.style.marginBottom = '10px';
    header.style.color = '#2e7d32';
    header.style.borderBottom = '2px solid #eee';
    header.style.paddingBottom = '10px';

    const dateText = document.createElement('p');
    dateText.innerText = 'Generated on: ' + new Date().toLocaleString();
    dateText.style.textAlign = 'center';
    dateText.style.color = '#666';
    dateText.style.marginBottom = '30px';
    dateText.style.fontSize = '0.9rem';

    // Clone the timeline
    const activitiesClone = activityTimeline.cloneNode(true);
    activitiesClone.style.background = '#fff';

    pdfContainer.appendChild(header);
    pdfContainer.appendChild(dateText);
    pdfContainer.appendChild(activitiesClone);

    const opt = {
        margin: 10,
        filename: 'Farming_History.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(pdfContainer).set(opt).save().then(() => {
        // Restore styles
        activityTimeline.style.maxHeight = oldMaxHeight;
        activityTimeline.style.overflow = oldOverflow;
    });
}


