// ============================================
// NOTIFICATIONS FUNCTIONS
// ============================================

function generateNotifications(cropKey) {
    const crop = cropData[cropKey];
    const list = document.getElementById('notificationList');
    const notifications = [];

    if (currentWeather.rainProbability >= 70) {
        notifications.push({
            type: 'weather',
            icon: 'fa-cloud-rain',
            title: 'Weather Alert',
            message: `Rain expected (${currentWeather.rainProbability}%). Avoid fertilizer today.`,
            time: 'Now'
        });
    }

    notifications.push({
        type: 'water',
        icon: 'fa-tint',
        title: 'Watering Reminder',
        message: `Today is watering day for your ${crop.name} crop.`,
        time: '6:00 AM'
    });

    notifications.push({
        type: 'fertilizer',
        icon: 'fa-flask',
        title: 'Fertilizer Application',
        message: `Apply ${crop.fertilizers.split(', ')[0]} to your ${crop.name}.`,
        time: 'Tomorrow'
    });

    notifications.push({
        type: 'success',
        icon: 'fa-lightbulb',
        title: 'Farming Tip',
        message: `${crop.name} grows best with ${crop.wateringFrequency.toLowerCase()} watering.`,
        time: 'Tip'
    });

    list.innerHTML = notifications.map(n => `
        <div class="notification-item ${n.type}">
            <div class="notif-icon"><i class="fas ${n.icon}"></i></div>
            <div class="notif-content">
                <h4>${n.title}</h4>
                <p>${n.message}</p>
            </div>
            <span class="notif-time">${n.time}</span>
        </div>
    `).join('');
}

function initDefaultNotifications() {
    document.getElementById('notificationList').innerHTML = `
        <div class="notification-item success">
            <div class="notif-icon"><i class="fas fa-leaf"></i></div>
            <div class="notif-content">
                <h4>Welcome to BharatFarm!</h4>
                <p>Select a crop to receive personalized notifications.</p>
            </div>
            <span class="notif-time">Now</span>
        </div>
        <div class="notification-item water">
            <div class="notif-icon"><i class="fas fa-tint"></i></div>
            <div class="notif-content">
                <h4>Watering Reminder</h4>
                <p>Select a crop to get watering notifications.</p>
            </div>
            <span class="notif-time">Pending</span>
        </div>
    `;
}
