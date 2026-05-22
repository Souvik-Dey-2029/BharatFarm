// ============================================
// WEATHER FUNCTIONS (Production-ready Open-Meteo Integration)
// ============================================

const CONFIG = {
    WEATHER_API_BASE: 'https://api.open-meteo.com/v1/forecast',
    GEOCODING_API_BASE: 'https://geocoding-api.open-meteo.com/v1/search',
    DEFAULT_LOCATION: { lat: 22.4700, lon: 88.1100, name: 'Uluberia' },
    WEATHER_TIMEOUT_MS: 10000,
    GEOCODE_TIMEOUT_MS: 8000,
    RETRY_ATTEMPTS: 2,
    RETRY_DELAY_MS: 900,
    CACHE_TTL_MS: 10 * 60 * 1000,
    LOCATION_DEBOUNCE_MS: 650,
    GEOLOCATION_TIMEOUT_MS: 10000,
    GEOLOCATION_MAX_AGE_MS: 60000
};

const WEATHER_CACHE_KEY = 'bharatfarm_weather_cache_v2';

let isAPIOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
let weatherRequestSeq = 0;
let activeWeatherAbortController = null;
let activeWeatherPromise = null;
let activeWeatherPromiseKey = '';
let locationDebounceTimer = null;

let currentWeather = {
    temp: '--',
    humidity: '--',
    windSpeed: '--',
    visibility: 10,
    rainProbability: 0,
    soilMoisture: 'N/A',
    soilTemp: 'N/A',
    condition: 'Loading...',
    icon: 'fa-sun'
};

let userLocation = { lat: CONFIG.DEFAULT_LOCATION.lat, lon: CONFIG.DEFAULT_LOCATION.lon };
let userLocationName = CONFIG.DEFAULT_LOCATION.name;

function validateCoordinates(lat, lon) {
    const numericLat = Number(lat);
    const numericLon = Number(lon);

    const valid = Number.isFinite(numericLat)
        && Number.isFinite(numericLon)
        && numericLat >= -90
        && numericLat <= 90
        && numericLon >= -180
        && numericLon <= 180;

    return {
        valid,
        lat: numericLat,
        lon: numericLon,
        message: valid ? '' : 'Invalid location coordinates. Please choose a valid location.'
    };
}

function mapWeatherCode(code, isDay = 1, currentData = null) {
    const map = {
        clear: { label: 'Clear', icon: isDay ? 'fa-sun' : 'fa-moon', group: 'clear' },
        partlyCloudy: { label: 'Partly Cloudy', icon: isDay ? 'fa-cloud-sun' : 'fa-cloud-moon', group: 'cloudy' },
        cloudy: { label: 'Cloudy', icon: 'fa-cloud', group: 'cloudy' },
        overcast: { label: 'Overcast', icon: 'fa-cloud', group: 'cloudy' },
        fog: { label: 'Fog', icon: 'fa-smog', group: 'fog' },
        drizzle: { label: 'Drizzle', icon: 'fa-cloud-rain', group: 'rain' },
        rain: { label: 'Rain', icon: 'fa-cloud-showers-heavy', group: 'rain' },
        freezing: { label: 'Freezing Rain', icon: 'fa-icicles', group: 'rain' },
        snow: { label: 'Snow', icon: 'fa-snowflake', group: 'snow' },
        shower: { label: 'Rain Showers', icon: 'fa-cloud-sun-rain', group: 'rain' },
        thunder: { label: 'Thunderstorm', icon: 'fa-bolt', group: 'thunder' },
        unknown: { label: 'Unknown', icon: 'fa-cloud', group: 'cloudy' }
    };

    // Cross-validate precipitation codes against actual data to prevent false reports
    if (currentData) {
        const actualRain = Number(currentData.rain) || 0;
        const actualPrecip = Number(currentData.precipitation) || 0;
        const actualShowers = Number(currentData.showers) || 0;
        const cloudCover = Number(currentData.cloud_cover);
        const totalWet = actualRain + actualPrecip + actualShowers;

        // If weather_code says thunderstorm/rain but there's no actual precipitation,
        // downgrade to a cloud-based condition using cloud_cover percentage
        if (code >= 51 && totalWet < 0.1) {
            console.info(`[Weather] Code ${code} reports precipitation but actual rain=${actualRain}mm, precip=${actualPrecip}mm — downgrading to cloud-based condition.`);
            if (Number.isFinite(cloudCover)) {
                if (cloudCover < 20) return map.clear;
                if (cloudCover < 60) return map.partlyCloudy;
                if (cloudCover < 85) return map.cloudy;
                return map.overcast;
            }
            return map.cloudy;
        }
    }

    if (code === 0) return map.clear;
    if (code === 1) return map.partlyCloudy;
    if (code === 2) return map.cloudy;
    if (code === 3) return map.overcast;
    if (code >= 45 && code <= 48) return map.fog;
    if (code >= 51 && code <= 55) return map.drizzle;
    if (code >= 56 && code <= 57) return map.freezing;
    if (code >= 61 && code <= 65) return map.rain;
    if (code >= 66 && code <= 67) return map.freezing;
    if (code >= 71 && code <= 77) return map.snow;
    if (code >= 80 && code <= 82) return map.shower;
    if (code >= 85 && code <= 86) return map.snow;
    if (code >= 95 && code <= 99) return map.thunder;
    return map.unknown;
}

// Backward-compatible wrappers used elsewhere.
function weatherCodeToCondition(code, currentData = null) {
    return mapWeatherCode(code, 1, currentData).label;
}

function weatherCodeToIcon(code, isDay = 1, currentData = null) {
    return mapWeatherCode(code, isDay, currentData).icon;
}

function showWeatherError(message, options = {}) {
    const fallback = options.fallback || 'Weather data is temporarily unavailable. Please try again shortly.';
    const finalMessage = (message || '').trim() || fallback;

    const errorEl = document.getElementById('weatherError');
    const offlineEl = document.getElementById('weatherOfflineNote');

    if (errorEl) {
        errorEl.textContent = finalMessage;
        errorEl.classList.remove('hidden');
    }

    if (offlineEl && !navigator.onLine) {
        offlineEl.classList.remove('hidden');
    }

    if (!errorEl) {
        console.warn('[Weather] ' + finalMessage);
    }
}

function hideWeatherError() {
    const errorEl = document.getElementById('weatherError');
    if (errorEl) errorEl.classList.add('hidden');
}

function setWeatherLoading(isLoading) {
    const loadingEl = document.getElementById('weatherLoading');
    const contentEl = document.getElementById('weatherContent');

    if (loadingEl) loadingEl.classList.toggle('hidden', !isLoading);
    if (contentEl) {
        contentEl.classList.toggle('weather-fade', true);
        contentEl.classList.toggle('weather-loading-state', isLoading);
        if (isLoading) {
            contentEl.style.opacity = '0.55';
        } else {
            contentEl.style.opacity = '1';
        }
    }
}

function setWeatherRefreshEnabled(enabled) {
    const btn = document.getElementById('weatherRefreshBtn');
    if (!btn) return;
    btn.disabled = !enabled;
    btn.setAttribute('aria-busy', String(!enabled));
}

function setOfflineStatus() {
    const offlineEl = document.getElementById('weatherOfflineNote');
    if (!offlineEl) return;
    if (navigator.onLine) {
        offlineEl.classList.add('hidden');
    } else {
        offlineEl.classList.remove('hidden');
    }
}

function getWeatherCacheKey(lat, lon) {
    return `${Number(lat).toFixed(3)}:${Number(lon).toFixed(3)}`;
}

function readWeatherCache() {
    try {
        const raw = localStorage.getItem(WEATHER_CACHE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') return null;
        return parsed;
    } catch (err) {
        console.warn('[Weather] Cache read failed:', err.message);
        return null;
    }
}

function writeWeatherCache(entry) {
    try {
        localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify(entry));
    } catch (err) {
        console.warn('[Weather] Cache write failed:', err.message);
    }
}

function getCachedWeatherIfFresh(lat, lon) {
    const cache = readWeatherCache();
    if (!cache || !cache.key || !cache.timestamp) return null;
    if (cache.key !== getWeatherCacheKey(lat, lon)) return null;
    if ((Date.now() - cache.timestamp) > CONFIG.CACHE_TTL_MS) return null;
    return cache;
}

function getCachedWeatherStale() {
    const cache = readWeatherCache();
    if (!cache || !cache.data || !cache.locationName) return null;
    return cache;
}

async function fetchWithTimeout(url, options = {}, timeoutMs = CONFIG.WEATHER_TIMEOUT_MS) {
    const timeoutController = new AbortController();
    const externalSignal = options.signal;
    let timeoutId = null;

    // Critical: tie caller abort + timeout abort into one signal path.
    if (externalSignal) {
        if (externalSignal.aborted) {
            throw new DOMException('Request aborted', 'AbortError');
        }
        externalSignal.addEventListener('abort', () => timeoutController.abort(), { once: true });
    }

    timeoutId = setTimeout(() => timeoutController.abort(), timeoutMs);

    try {
        const response = await fetch(url, {
            ...options,
            signal: timeoutController.signal
        });
        return response;
    } finally {
        clearTimeout(timeoutId);
    }
}

async function fetchJsonWithRetry(url, options = {}, config = {}) {
    const retries = Number.isInteger(config.retries) ? config.retries : CONFIG.RETRY_ATTEMPTS;
    const timeoutMs = config.timeoutMs || CONFIG.WEATHER_TIMEOUT_MS;
    const retryDelayMs = config.retryDelayMs || CONFIG.RETRY_DELAY_MS;

    let lastError = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const response = await fetchWithTimeout(url, options, timeoutMs);
            if (!response.ok) {
                throw new Error(`Server error ${response.status}`);
            }
            return await response.json();
        } catch (err) {
            lastError = err;
            if (err && err.name === 'AbortError') {
                throw err;
            }
            if (attempt < retries) {
                await new Promise(resolve => setTimeout(resolve, retryDelayMs * (attempt + 1)));
            }
        }
    }

    throw lastError || new Error('Network request failed');
}

function buildWeatherUrl(lat, lon) {
    const params = new URLSearchParams({
        latitude: String(lat),
        longitude: String(lon),
        current: [
            'temperature_2m',
            'relative_humidity_2m',
            'apparent_temperature',
            'rain',
            'showers',
            'snowfall',
            'weather_code',
            'cloud_cover',
            'wind_speed_10m',
            'wind_direction_10m',
            'wind_gusts_10m',
            'is_day',
            'precipitation'
        ].join(','),
        hourly: [
            'temperature_2m',
            'relative_humidity_2m',
            'dew_point_2m',
            'precipitation_probability',
            'precipitation',
            'rain',
            'showers',
            'visibility',
            'soil_temperature_0cm',
            'soil_moisture_0_to_1cm',
            'wind_speed_10m',
            'uv_index',
            'cloud_cover'
        ].join(','),
        daily: [
            'weather_code',
            'temperature_2m_max',
            'temperature_2m_min',
            'sunrise',
            'sunset',
            'uv_index_max',
            'precipitation_sum',
            'rain_sum',
            'precipitation_probability_max'
        ].join(','),
        timezone: 'auto',
        forecast_days: '1'
    });

    return `${CONFIG.WEATHER_API_BASE}?${params.toString()}`;
}

function debounceWeatherUpdate(fn, wait = CONFIG.LOCATION_DEBOUNCE_MS) {
    return function debounced(...args) {
        clearTimeout(locationDebounceTimer);
        locationDebounceTimer = setTimeout(() => fn.apply(this, args), wait);
    };
}

async function checkAPIStatus() {
    isAPIOnline = navigator.onLine;
    setOfflineStatus();
}

function updateWeatherUI(location) {
    try {
        const tempEl = document.getElementById('temperature');
        const humidEl = document.getElementById('humidity');
        const windEl = document.getElementById('windSpeed');
        const visEl = document.getElementById('visibility');
        const rainEl = document.getElementById('rainProbability');
        const condEl = document.getElementById('weatherCondition');
        const locEl = document.getElementById('weatherLocation');
        const iconEl = document.getElementById('weatherIcon');

        if (tempEl) tempEl.textContent = currentWeather.temp;
        if (humidEl) humidEl.textContent = currentWeather.humidity;
        if (windEl) windEl.textContent = currentWeather.windSpeed;
        if (visEl) visEl.textContent = currentWeather.visibility;
        if (rainEl) rainEl.textContent = currentWeather.rainProbability;
        if (condEl) condEl.textContent = currentWeather.condition;
        if (locEl) locEl.textContent = location;

        if (iconEl) {
            iconEl.className = 'fas ' + (currentWeather.icon || 'fa-sun');
        }

        const alertDiv = document.getElementById('weatherAlert');
        if (alertDiv) {
            if (currentWeather.rainProbability >= 70) {
                alertDiv.className = 'weather-alert unsafe';
                alertDiv.innerHTML = '<i class="fas fa-exclamation-triangle"></i><div><h3>NOT SAFE for Farming</h3><p>High rain chance (' + currentWeather.rainProbability + '%). Avoid fertilizer and seed application today.</p></div>';
            } else {
                alertDiv.className = 'weather-alert safe';
                alertDiv.innerHTML = '<i class="fas fa-check-circle"></i><div><h3>SAFE for Farming Activities</h3><p>Weather conditions are suitable for normal farming operations.</p></div>';
            }
        }

        window.lastWeatherLogged = window.lastWeatherLogged || 0;
        if (typeof logActivity === 'function' && (!window.lastWeatherLogged || Date.now() - window.lastWeatherLogged > 60000)) {
            try {
                logActivity('weather', 'Checked weather for ' + location);
                if (typeof updateUserStatistic === 'function') {
                    updateUserStatistic('weatherChecks');
                }
            } catch (err) {
                console.warn('Logging activity failed:', err);
            }
            window.lastWeatherLogged = Date.now();
        }

        if (typeof updateDashboard === 'function') {
            updateDashboard();
        }
    } catch (err) {
        console.error('Error updating weather UI:', err);
    }

    updateFarmingTips();
    getAIWeatherAdvice(location);
}

function processOpenMeteoData(data, locationName) {
    const c = data && data.current ? data.current : null;
    if (!c) {
        throw new Error('Unexpected weather response. Please try again.');
    }

    // Determine current hour index for hourly arrays
    let currentHourIdx = 0;
    if (data.hourly && Array.isArray(data.hourly.time) && c.time) {
        const currentTimeStr = c.time.substring(0, 13); // e.g. '2026-05-22T16'
        currentHourIdx = data.hourly.time.findIndex(t => t.startsWith(currentTimeStr));
        if (currentHourIdx < 0) currentHourIdx = 0;
    }

    // Use remaining hours from now for rain probability (more accurate than first 12)
    const rainSeries = data.hourly && Array.isArray(data.hourly.precipitation_probability)
        ? data.hourly.precipitation_probability.slice(currentHourIdx, currentHourIdx + 12)
        : [];
    const rainProb = rainSeries.length ? Math.max(...rainSeries.map(n => Number(n) || 0)) : 0;

    // Use current hour's visibility, not always index 0
    const visibilityMeters = data.hourly && Array.isArray(data.hourly.visibility)
        ? Number(data.hourly.visibility[currentHourIdx]) || 10000
        : 10000;
    const avgVisibility = Math.max(0, (visibilityMeters / 1000)).toFixed(1);

    const soilMoistureRaw = data.hourly && Array.isArray(data.hourly.soil_moisture_0_to_1cm)
        ? Number(data.hourly.soil_moisture_0_to_1cm[currentHourIdx])
        : NaN;
    const soilTempRaw = data.hourly && Array.isArray(data.hourly.soil_temperature_0cm)
        ? Number(data.hourly.soil_temperature_0cm[currentHourIdx])
        : NaN;

    // UV Index for current hour
    const uvIndex = data.hourly && Array.isArray(data.hourly.uv_index)
        ? Number(data.hourly.uv_index[currentHourIdx]) || 0
        : 0;

    // Cloud cover from current data (more accurate than hourly)
    const cloudCover = Number.isFinite(Number(c.cloud_cover)) ? Number(c.cloud_cover) : null;

    // Dew point for current hour
    const dewPoint = data.hourly && Array.isArray(data.hourly.dew_point_2m)
        ? Number(data.hourly.dew_point_2m[currentHourIdx])
        : NaN;

    // Apparent (feels-like) temperature from current data
    const feelsLike = Number.isFinite(Number(c.apparent_temperature)) ? Math.round(Number(c.apparent_temperature)) : null;

    // Wind gusts
    const windGusts = Number.isFinite(Number(c.wind_gusts_10m)) ? Math.round(Number(c.wind_gusts_10m)) : null;

    // Daily summary data
    const daily = data.daily || {};
    const tempMax = daily.temperature_2m_max && daily.temperature_2m_max[0] != null ? Math.round(Number(daily.temperature_2m_max[0])) : null;
    const tempMin = daily.temperature_2m_min && daily.temperature_2m_min[0] != null ? Math.round(Number(daily.temperature_2m_min[0])) : null;
    const sunrise = daily.sunrise && daily.sunrise[0] ? daily.sunrise[0].split('T')[1] : null;
    const sunset = daily.sunset && daily.sunset[0] ? daily.sunset[0].split('T')[1] : null;
    const uvMax = daily.uv_index_max && daily.uv_index_max[0] != null ? Number(daily.uv_index_max[0]).toFixed(1) : null;
    const dailyRainSum = daily.rain_sum && daily.rain_sum[0] != null ? Number(daily.rain_sum[0]) : 0;
    const dailyPrecipProbMax = daily.precipitation_probability_max && daily.precipitation_probability_max[0] != null ? Number(daily.precipitation_probability_max[0]) : 0;

    // Cross-validate weather code with actual precipitation data
    const weatherMeta = mapWeatherCode(Number(c.weather_code), Number(c.is_day || 1), c);

    currentWeather = {
        temp: Math.round(Number(c.temperature_2m) || 0),
        feelsLike: feelsLike,
        humidity: Math.round(Number(c.relative_humidity_2m) || 0),
        windSpeed: Math.round(Number(c.wind_speed_10m) || 0),
        windGusts: windGusts,
        visibility: avgVisibility,
        rainProbability: Math.round(rainProb),
        cloudCover: cloudCover,
        uvIndex: Number(uvIndex).toFixed(1),
        dewPoint: Number.isFinite(dewPoint) ? Math.round(dewPoint) : null,
        soilMoisture: Number.isFinite(soilMoistureRaw) ? `${(soilMoistureRaw * 100).toFixed(1)}%` : 'N/A',
        soilTemp: Number.isFinite(soilTempRaw) ? `${Math.round(soilTempRaw)}°C` : 'N/A',
        condition: weatherMeta.label,
        icon: weatherMeta.icon,
        // Daily summary
        tempMax: tempMax,
        tempMin: tempMin,
        sunrise: sunrise,
        sunset: sunset,
        uvMax: uvMax,
        dailyRainSum: dailyRainSum,
        dailyPrecipProbMax: dailyPrecipProbMax
    };

    console.info('[Weather] Processed:', {
        code: c.weather_code,
        condition: weatherMeta.label,
        rain: c.rain,
        precip: c.precipitation,
        showers: c.showers,
        cloudCover: c.cloud_cover,
        rainProb,
        location: locationName
    });

    updateWeatherUI(locationName);
}

async function reverseGeocode(lat, lon) {
    try {
        const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
        const response = await fetchJsonWithRetry(url, {}, {
            retries: 1,
            timeoutMs: CONFIG.GEOCODE_TIMEOUT_MS,
            retryDelayMs: 600
        });

        const locality = response.locality || response.city || response.principalSubdivision;
        const state = response.principalSubdivision;

        if (locality && state && locality !== state) {
            userLocationName = `${locality}, ${state}`;
        } else if (locality) {
            userLocationName = locality;
        } else {
            userLocationName = CONFIG.DEFAULT_LOCATION.name;
        }

        const input = document.getElementById('locationInput');
        if (input) input.value = userLocationName;
    } catch (err) {
        console.warn('[Weather] Reverse geocode failed:', err.message);
    }
}

async function fetchWeatherByLocation(locationName, options = {}) {
    const trimmedName = (locationName || '').trim();
    if (!trimmedName) {
        showWeatherError('Please enter a village or city name.');
        return null;
    }

    hideWeatherError();
    setWeatherLoading(true);
    setWeatherRefreshEnabled(false);

    try {
        let geoUrl = `${CONFIG.GEOCODING_API_BASE}?name=${encodeURIComponent(trimmedName)}&count=1&language=en&format=json`;
        let geoData = await fetchJsonWithRetry(geoUrl, {}, {
            retries: 1,
            timeoutMs: CONFIG.GEOCODE_TIMEOUT_MS,
            retryDelayMs: 500
        });

        if ((!geoData || !geoData.results || geoData.results.length === 0) && trimmedName.includes(',')) {
            const firstPart = trimmedName.split(',')[0].trim();
            if (firstPart.length > 2) {
                geoUrl = `${CONFIG.GEOCODING_API_BASE}?name=${encodeURIComponent(firstPart)}&count=1&language=en&format=json`;
                geoData = await fetchJsonWithRetry(geoUrl, {}, {
                    retries: 1,
                    timeoutMs: CONFIG.GEOCODE_TIMEOUT_MS,
                    retryDelayMs: 500
                });
            }
        }

        if (!geoData || !geoData.results || geoData.results.length === 0) {
            showWeatherError('Location not found. Try city name only, like Kolkata or Haldia.');
            return null;
        }

        const place = geoData.results[0];
        const coordCheck = validateCoordinates(place.latitude, place.longitude);
        if (!coordCheck.valid) {
            showWeatherError(coordCheck.message);
            return null;
        }

        let resolvedName = place.name;
        if (place.admin1) resolvedName += `, ${place.admin1}`;
        else if (place.country) resolvedName += `, ${place.country}`;

        userLocation = { lat: coordCheck.lat, lon: coordCheck.lon };
        userLocationName = resolvedName;

        const input = document.getElementById('locationInput');
        if (input) input.value = resolvedName;

        return await fetchWeatherByCoords(coordCheck.lat, coordCheck.lon, resolvedName, options);
    } catch (err) {
        console.error('Weather geocoding error:', err);

        // Graceful stale-cache fallback for poor connectivity.
        const stale = getCachedWeatherStale();
        if (stale) {
            processOpenMeteoData(stale.data, stale.locationName + ' (Cached)');
            showWeatherError('Showing last saved weather due to network issue.', {
                fallback: 'Showing last saved weather due to network issue.'
            });
            return stale.data;
        }

        showWeatherError('Unable to fetch weather right now. Please check your internet and try again.');
        return null;
    } finally {
        setWeatherLoading(false);
        setWeatherRefreshEnabled(true);
    }
}

async function fetchWeatherByCoords(lat, lon, locationName, options = {}) {
    const coordCheck = validateCoordinates(lat, lon);
    if (!coordCheck.valid) {
        showWeatherError(coordCheck.message);
        return null;
    }

    const force = !!options.force;
    const requestKey = getWeatherCacheKey(coordCheck.lat, coordCheck.lon);

    hideWeatherError();
    setWeatherLoading(true);
    setWeatherRefreshEnabled(false);

    // Avoid duplicate API calls for the same location while one is in-flight.
    if (!force && activeWeatherPromise && activeWeatherPromiseKey === requestKey) {
        try {
            return await activeWeatherPromise;
        } finally {
            setWeatherLoading(false);
            setWeatherRefreshEnabled(true);
        }
    }

    // Serve fresh cache first for slow rural networks and low-end phones.
    const cached = !force ? getCachedWeatherIfFresh(coordCheck.lat, coordCheck.lon) : null;
    if (cached && cached.data) {
        processOpenMeteoData(cached.data, cached.locationName || locationName || userLocationName);
        setWeatherLoading(false);
        setWeatherRefreshEnabled(true);
        return cached.data;
    }

    const thisRequestId = ++weatherRequestSeq;

    if (activeWeatherAbortController) {
        activeWeatherAbortController.abort();
    }
    activeWeatherAbortController = new AbortController();

    const run = (async () => {
        try {
            if (!navigator.onLine) {
                const stale = getCachedWeatherStale();
                if (stale) {
                    processOpenMeteoData(stale.data, stale.locationName + ' (Cached)');
                    showWeatherError('You are offline. Showing the most recent saved weather.');
                    return stale.data;
                }
                showWeatherError('You are offline. Connect to the internet to fetch live weather.');
                return null;
            }

            const url = buildWeatherUrl(coordCheck.lat, coordCheck.lon);
            const data = await fetchJsonWithRetry(url, { signal: activeWeatherAbortController.signal }, {
                retries: CONFIG.RETRY_ATTEMPTS,
                timeoutMs: CONFIG.WEATHER_TIMEOUT_MS,
                retryDelayMs: CONFIG.RETRY_DELAY_MS
            });

            // Ignore stale responses to prevent race-condition UI corruption.
            if (thisRequestId !== weatherRequestSeq) {
                return null;
            }

            const finalName = locationName || userLocationName || `${coordCheck.lat.toFixed(2)}, ${coordCheck.lon.toFixed(2)}`;
            processOpenMeteoData(data, finalName);

            const mapInput = document.getElementById('locationMapInput');
            if (mapInput && !mapInput.value.trim()) {
                mapInput.value = `https://www.google.com/maps?q=${coordCheck.lat},${coordCheck.lon}`;
            }

            writeWeatherCache({
                key: requestKey,
                timestamp: Date.now(),
                locationName: finalName,
                data
            });

            return data;
        } catch (err) {
            if (err && err.name === 'AbortError') {
                return null;
            }

            console.error('Open-Meteo error:', err);
            const stale = getCachedWeatherStale();
            if (stale) {
                processOpenMeteoData(stale.data, stale.locationName + ' (Cached)');
                showWeatherError('Network is unstable. Showing last saved weather data.');
                return stale.data;
            }

            showWeatherError('Unable to fetch weather data now. Please retry in a moment.');
            return null;
        }
    })();

    activeWeatherPromise = run;
    activeWeatherPromiseKey = requestKey;

    try {
        return await run;
    } finally {
        if (activeWeatherPromise === run) {
            activeWeatherPromise = null;
            activeWeatherPromiseKey = '';
        }
        setWeatherLoading(false);
        setWeatherRefreshEnabled(true);
    }
}

async function autoDetectLocation(options = {}) {
    hideWeatherError();
    const input = document.getElementById('locationInput');
    if (input && !input.value.trim()) {
        input.value = 'Detecting location...';
    }

    if (!navigator.geolocation) {
        return fetchWeatherByCoords(
            CONFIG.DEFAULT_LOCATION.lat,
            CONFIG.DEFAULT_LOCATION.lon,
            CONFIG.DEFAULT_LOCATION.name,
            options
        );
    }

    return new Promise(resolve => {
        navigator.geolocation.getCurrentPosition(
            async position => {
                const coordCheck = validateCoordinates(position.coords.latitude, position.coords.longitude);
                if (!coordCheck.valid) {
                    showWeatherError('Could not validate your device location. Using default location instead.');
                    const data = await fetchWeatherByCoords(
                        CONFIG.DEFAULT_LOCATION.lat,
                        CONFIG.DEFAULT_LOCATION.lon,
                        CONFIG.DEFAULT_LOCATION.name,
                        options
                    );
                    resolve(data);
                    return;
                }

                userLocation = { lat: coordCheck.lat, lon: coordCheck.lon };
                await reverseGeocode(coordCheck.lat, coordCheck.lon);
                const data = await fetchWeatherByCoords(coordCheck.lat, coordCheck.lon, userLocationName, options);
                resolve(data);
            },
            async error => {
                console.warn('Geolocation error:', error.message);
                showWeatherError('Location access denied. Showing weather for default location.');
                const data = await fetchWeatherByCoords(
                    CONFIG.DEFAULT_LOCATION.lat,
                    CONFIG.DEFAULT_LOCATION.lon,
                    CONFIG.DEFAULT_LOCATION.name,
                    options
                );
                resolve(data);
            },
            {
                enableHighAccuracy: false,
                timeout: CONFIG.GEOLOCATION_TIMEOUT_MS,
                maximumAge: CONFIG.GEOLOCATION_MAX_AGE_MS
            }
        );
    });
}

async function fetchWeather(options = {}) {
    hideWeatherError();
    setOfflineStatus();

    try {
        const inputEl = document.getElementById('locationInput');
        const locationInput = inputEl ? inputEl.value.trim() : '';

        if (options && validateCoordinates(options.lat, options.lon).valid) {
            return await fetchWeatherByCoords(options.lat, options.lon, options.locationName || userLocationName, options);
        }

        if (locationInput && locationInput !== 'Detecting location...' && locationInput !== userLocationName) {
            return await fetchWeatherByLocation(locationInput, options);
        }

        if (validateCoordinates(userLocation.lat, userLocation.lon).valid) {
            return await fetchWeatherByCoords(userLocation.lat, userLocation.lon, userLocationName || CONFIG.DEFAULT_LOCATION.name, options);
        }

        return await autoDetectLocation(options);
    } catch (err) {
        console.error('[Weather] fetchWeather failed:', err);
        showWeatherError('Could not update weather right now. Please try again.');
        return null;
    }
}

const debouncedFetchWeather = debounceWeatherUpdate(() => {
    fetchWeather({ force: false }).catch(err => {
        console.warn('[Weather] Debounced fetch failed:', err.message);
    });
});

// ── Farming Tips Logic ───────────────────────
function updateFarmingTips() {
    let dos = [];
    let donts = [];

    if (currentWeather.rainProbability >= 70) {
        dos.push('Ensure proper drainage in fields to prevent waterlogging.');
        dos.push('Protect harvested crops or seedlings with temporary covers.');
        donts.push('Do not apply fertilizers or pesticides during heavy rain.');
        donts.push('Avoid new sowing until rainfall intensity decreases.');
    } else if (currentWeather.rainProbability > 30) {
        dos.push('Light rain expected. Reduce manual irrigation accordingly.');
        donts.push('Delay spraying chemicals when possible.');
    } else {
        dos.push('Good window for fertilizer and crop care activities.');
    }

    if (currentWeather.temp > 38) {
        dos.push('Irrigate early morning or late evening to reduce evaporation.');
        donts.push('Avoid heavy field work during peak afternoon heat.');
    } else if (currentWeather.temp < 10) {
        dos.push('Use crop cover to reduce frost stress on young plants.');
        donts.push('Avoid late evening irrigation in cold weather.');
    }

    if (currentWeather.windSpeed > 25) {
        dos.push('Secure small structures and support taller plants.');
        donts.push('Do not spray chemicals in strong wind.');
    }

    if (currentWeather.humidity > 80 && currentWeather.temp > 25 && currentWeather.rainProbability < 70) {
        dos.push('Inspect crops for fungal spots and early pest symptoms.');
        donts.push('Avoid dense canopy conditions that trap moisture.');
    }

    if (dos.length === 0) {
        dos.push('Weather is stable. Continue routine field activities.');
    }
    if (donts.length === 0) {
        donts.push('No major restrictions. Keep monitoring changing conditions.');
    }

    const doHTML = dos.map(item => `<li>${item}</li>`).join('');
    const dontHTML = donts.map(item => `<li>${item}</li>`).join('');

    const elDo = document.getElementById('whatToDoList');
    const elDont = document.getElementById('whatNotToDoList');
    if (elDo) elDo.innerHTML = doHTML;
    if (elDont) elDont.innerHTML = dontHTML;
}

// ── OpenRouter AI advice for farmers ─────────
async function getAIWeatherAdvice(location) {
    const summaryDiv = document.getElementById('weatherAISummary');
    const textDiv = document.getElementById('weatherAIText');
    if (!summaryDiv || !textDiv) return;

    summaryDiv.style.display = 'block';
    textDiv.innerHTML = '<span style="color:#999"><i class="fas fa-spinner fa-spin"></i> Generating advice...</span>';

    try {
        const prompt = `You are a crop weather expert. Today's weather in ${location}: Temperature ${currentWeather.temp}°C, Humidity ${currentWeather.humidity}%, Rain probability ${currentWeather.rainProbability}%, Visibility ${currentWeather.visibility}km, Soil Moisture ${currentWeather.soilMoisture}, Soil Temp ${currentWeather.soilTemp}, Condition ${currentWeather.condition}. Provide two short, practical sentences for farmers.`;

        const advice = await aiCall({
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 200,
            temperature: 0.6
        });

        if (advice) {
            textDiv.textContent = advice;
            return;
        }
    } catch (err) {
        console.warn('[Weather AI] failed:', err.message);
    }

    let fallback = '';
    if (currentWeather.rainProbability >= 70) {
        fallback = 'High rain expected. Avoid fertilizer application and maintain drainage channels.';
    } else if (currentWeather.temp > 38) {
        fallback = 'High heat today. Irrigate in cool hours and avoid midday field stress.';
    } else if (currentWeather.humidity > 80) {
        fallback = 'High humidity can trigger fungal issues. Monitor leaves and improve airflow.';
    } else {
        fallback = 'Weather looks suitable for regular farming activities today.';
    }
    textDiv.textContent = fallback;
}

function initializeWeatherUX() {
    setOfflineStatus();

    const input = document.getElementById('locationInput');
    if (input) {
        input.addEventListener('input', () => {
            const val = input.value.trim();
            if (val.length >= 3) {
                debouncedFetchWeather();
            }
        });
    }

    window.addEventListener('online', () => {
        isAPIOnline = true;
        setOfflineStatus();
    });

    window.addEventListener('offline', () => {
        isAPIOnline = false;
        setOfflineStatus();
        showWeatherError('You are offline. Showing cached weather when available.');
    });
}

document.addEventListener('DOMContentLoaded', initializeWeatherUX);
