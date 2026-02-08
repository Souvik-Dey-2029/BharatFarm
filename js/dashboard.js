// ============================================
// DASHBOARD UPDATE FUNCTIONS
// ============================================

function updateDashboard() {
    document.getElementById('dashWeatherStatus').textContent = currentWeather.temp + '°C';

    const safety = document.getElementById('dashWeatherSafety');
    if (currentWeather.rainProbability >= 70) {
        safety.textContent = 'NOT SAFE';
        safety.className = 'status unsafe';
    } else {
        safety.textContent = 'SAFE';
        safety.className = 'status safe';
    }

    if (selectedCrop) {
        document.getElementById('dashNextActivity').textContent = cropData[selectedCrop].roadmap[0].activity;
    }

    if (calculatedCosts) {
        document.getElementById('dashTotalCost').textContent = '₹' + calculatedCosts.totalCost.toLocaleString('en-IN');
        document.getElementById('dashRevenue').textContent = '₹' + calculatedCosts.expectedRevenue.toLocaleString('en-IN');
    }

    updateSessionDashboard();
}

function updateSessionDashboard() {
    const sessionData = localStorage.getItem('bharatfarm_session');
    const card = document.getElementById('farmingSessionCard');

    if (!sessionData) {
        card.style.display = 'none';
        return;
    }

    const session = JSON.parse(sessionData);
    const crop = cropData[session.crop];

    // Show card
    card.style.display = 'block';

    // Update Crop Info
    document.getElementById('sessionCropName').textContent = crop.name;
    document.getElementById('sessionCropIcon').innerHTML = crop.icon;

    // Update Dates
    const startDate = new Date(session.startDate);

    // Parse duration: extract all numbers and take the maximum (e.g., "120-150 days" -> 150)
    const durationMatches = crop.duration.match(/\d+/g);
    const durationDays = durationMatches ? Math.max(...durationMatches.map(Number)) : 120; // Default to 120 if parse fails

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + durationDays);

    document.getElementById('sessionStartDate').textContent = startDate.toLocaleDateString();
    document.getElementById('sessionEndDate').textContent = endDate.toLocaleDateString();

    // Update Progress
    const today = new Date();
    const totalTime = endDate - startDate;
    const elapsedTime = today - startDate;
    let progress = (elapsedTime / totalTime) * 100;
    progress = Math.min(Math.max(progress, 0), 100); // Clamp between 0 and 100

    const daysRemaining = Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)));

    document.getElementById('sessionProgressBar').style.width = progress + '%';
    document.getElementById('sessionDaysRemaining').textContent = daysRemaining + ' days remaining';

    // Update Stats
    document.getElementById('sessionLandSize').textContent = session.landSize + ' Acres';
    document.getElementById('sessionYield').textContent = session.costs.expectedYield.toLocaleString('en-IN') + ' kg';
    document.getElementById('sessionExpenses').textContent = '₹' + session.costs.totalCost.toLocaleString('en-IN');
    document.getElementById('sessionRevenue').textContent = '₹' + session.costs.expectedRevenue.toLocaleString('en-IN');
}

function endFarmingSession() {
    if (confirm('Are you sure you want to end the current farming session? This will clear the dashboard data.')) {
        localStorage.removeItem('bharatfarm_session');
        updateSessionDashboard();
    }
}

// Call on load
document.addEventListener('DOMContentLoaded', updateDashboard);
