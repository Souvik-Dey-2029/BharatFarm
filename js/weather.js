// ============================================
// WEATHER FUNCTIONS
// ============================================

let isAPIOnline = false;
let currentWeather = {
    temp: 32,
    humidity: 45,
    windSpeed: 12,
    visibility: 10,
    rainProbability: 25,
    condition: 'Clear Sky',
    icon: 'fa-sun'
};

let userLocation = null; // Store user's detected location
let userLocationName = ''; // Store the location name

async function checkAPIStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        isAPIOnline = response.ok;
    } catch {
        isAPIOnline = false;
    }
}

function fetchWeather() {
    const locationInput = document.getElementById('locationInput').value.trim();

    // Check if user manually entered a location
    if (locationInput && locationInput !== userLocationName && locationInput !== 'Detecting location...') {
        // User entered a location manually
        fetchWeatherByLocation(locationInput);
    } else if (userLocation) {
        // Use stored user location
        fetchWeatherByCoords(userLocation.lat, userLocation.lon);
    } else {
        // Try to get location
        autoDetectLocation();
    }
}

function updateWeatherUI(location) {
    document.getElementById('temperature').textContent = currentWeather.temp;
    document.getElementById('humidity').textContent = currentWeather.humidity;
    document.getElementById('windSpeed').textContent = currentWeather.windSpeed;
    document.getElementById('visibility').textContent = currentWeather.visibility;
    document.getElementById('rainProbability').textContent = currentWeather.rainProbability;
    document.getElementById('weatherCondition').textContent = currentWeather.condition;
    document.getElementById('weatherLocation').textContent = location;
    document.getElementById('weatherIcon').className = 'fas ' + currentWeather.icon;

    const alertDiv = document.getElementById('weatherAlert');
    if (currentWeather.rainProbability >= 70) {
        alertDiv.className = 'weather-alert unsafe';
        alertDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i><div><h3>NOT SAFE for Farming</h3><p>High rain chance (${currentWeather.rainProbability}%). Avoid fertilizer/seeds today.</p></div>`;
    } else {
        alertDiv.className = 'weather-alert safe';
        alertDiv.innerHTML = `<i class="fas fa-check-circle"></i><div><h3>SAFE for Farming Activities</h3><p>Weather conditions are suitable for farming.</p></div>`;
    }

    updateDashboard();
}

// Auto-detect user location using browser geolocation
function autoDetectLocation() {
    if (navigator.geolocation) {
        document.getElementById('weatherLoading').classList.remove('hidden');
        document.getElementById('weatherContent').style.display = 'none';
        document.getElementById('locationInput').value = 'Detecting location...';

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                userLocation = { lat, lon };

                // FIRST: Get location name using reverse geocoding
                await reverseGeocode(lat, lon);

                // THEN: Fetch weather
                fetchWeatherByCoords(lat, lon);
            },
            (error) => {
                console.log('Geolocation error:', error.message);
                document.getElementById('locationInput').value = '';
                document.getElementById('weatherLoading').classList.add('hidden');
                document.getElementById('weatherContent').style.display = 'block';
                alert('Please enable location access to get accurate weather data for your area.');
            }
        );
    } else {
        alert('Geolocation is not supported by your browser. Please enter your location manually.');
        document.getElementById('weatherLoading').classList.add('hidden');
        document.getElementById('weatherContent').style.display = 'block';
    }
}

// Reverse geocode coordinates to get location name FIRST
async function reverseGeocode(lat, lon) {
    try {
        const API_KEY = 'ad56bd42df68a127ce54e35ce12c33f4';
        const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;

        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            if (data && data.length > 0) {
                const place = data[0];
                userLocationName = `${place.name}, ${place.state || place.country}`;
                document.getElementById('locationInput').value = userLocationName;
            }
        }
    } catch (error) {
        console.log('Reverse geocoding error:', error);
        // Continue anyway, weather will still work
    }
}

// Fetch weather by location name using Visual Crossing API
async function fetchWeatherByLocation(locationName) {
    document.getElementById('weatherLoading').classList.remove('hidden');
    document.getElementById('weatherContent').style.display = 'none';

    try {
        const API_KEY = 'AHWNC24HN789FFACZVX338UF3';
        const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(locationName)}?unitGroup=metric&key=${API_KEY}&contentType=json`;

        const response = await fetch(url);

        if (response.ok) {
            const data = await response.json();
            processVisualCrossingData(data, locationName);
        } else {
            document.getElementById('weatherLoading').classList.add('hidden');
            document.getElementById('weatherContent').style.display = 'block';
            alert('Unable to find weather for this location. Please try a different location.');
        }
    } catch (error) {
        console.log('Weather API error:', error);
        document.getElementById('weatherLoading').classList.add('hidden');
        document.getElementById('weatherContent').style.display = 'block';
        alert('Unable to fetch weather data. Please check your internet connection.');
    }
}

// Fetch weather using coordinates with Visual Crossing API
async function fetchWeatherByCoords(lat, lon) {
    document.getElementById('weatherLoading').classList.remove('hidden');
    document.getElementById('weatherContent').style.display = 'none';

    try {
        const API_KEY = 'AHWNC24HN789FFACZVX338UF3';
        const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}?unitGroup=metric&key=${API_KEY}&contentType=json`;

        const response = await fetch(url);

        if (response.ok) {
            const data = await response.json();
            // Use the location name we already got from reverse geocoding
            processVisualCrossingData(data, userLocationName || data.resolvedAddress);
        } else {
            document.getElementById('weatherLoading').classList.add('hidden');
            document.getElementById('weatherContent').style.display = 'block';
            alert('Unable to fetch weather data. Please try again later.');
        }
    } catch (error) {
        console.log('Weather API error:', error);
        document.getElementById('weatherLoading').classList.add('hidden');
        document.getElementById('weatherContent').style.display = 'block';
        alert('Unable to fetch weather data. Please check your internet connection.');
    }
}

// Process Visual Crossing API data
function processVisualCrossingData(data, locationName) {
    const current = data.currentConditions;

    currentWeather = {
        temp: Math.round(current.temp),
        humidity: Math.round(current.humidity),
        windSpeed: Math.round(current.windspeed),
        visibility: Math.round(current.visibility),
        rainProbability: Math.round(current.precipprob || 0),
        condition: current.conditions,
        icon: getWeatherIconFromCondition(current.icon)
    };

    updateWeatherUI(locationName);
    document.getElementById('weatherLoading').classList.add('hidden');
    document.getElementById('weatherContent').style.display = 'block';
}

// Get appropriate icon for Visual Crossing weather condition
function getWeatherIconFromCondition(icon) {
    const iconMap = {
        'clear-day': 'fa-sun',
        'clear-night': 'fa-moon',
        'cloudy': 'fa-cloud',
        'partly-cloudy-day': 'fa-cloud-sun',
        'partly-cloudy-night': 'fa-cloud-moon',
        'rain': 'fa-cloud-showers-heavy',
        'snow': 'fa-snowflake',
        'wind': 'fa-wind',
        'fog': 'fa-smog',
        'sleet': 'fa-cloud-rain',
        'hail': 'fa-cloud-meatball',
        'thunderstorm': 'fa-bolt'
    };
    return iconMap[icon] || 'fa-cloud-sun';
}
