// ============================================
// SMART LEAF SCANNER & DISEASE DETECTOR
// ============================================

let mobileNetModel = null;
let isModelLoading = false;

// Initialize Scanner and Load Model
document.addEventListener('DOMContentLoaded', () => {
    initScannerDragDrop();
    loadModel();
});

async function loadModel() {
    try {
        isModelLoading = true;
        console.log('Loading MobileNet model...');
        mobileNetModel = await mobilenet.load();
        console.log('MobileNet model loaded successfully');
        isModelLoading = false;
    } catch (error) {
        console.error('Error loading model:', error);
        isModelLoading = false;
    }
}

function handleLeafUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const img = document.getElementById('leafPreviewImg');
            img.src = event.target.result;
            // storing original image for canvas processing
            img.onload = () => {
                document.getElementById('scannerPreview').style.display = 'block';
                document.getElementById('analyzeBtn').style.display = 'inline-flex';
                document.getElementById('scanResult').style.display = 'none';

                // Reset any previous error alerts
                const existingAlert = document.querySelector('.scanner-alert');
                if (existingAlert) existingAlert.remove();
            };
        };
        reader.readAsDataURL(file);
    }
}

function openCamera() {
    const input = document.getElementById('leafInput');
    input.setAttribute('capture', 'environment');
    input.click();
}

async function analyzeLeaf() {
    const img = document.getElementById('leafPreviewImg');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const loadingEl = document.getElementById('scanLoading');
    const resultEl = document.getElementById('scanResult');

    if (!mobileNetModel) {
        alert("AI Model is still loading. Please wait a moment and try again.");
        if (!isModelLoading) loadModel();
        return;
    }

    analyzeBtn.style.display = 'none';
    loadingEl.classList.remove('hidden');
    resultEl.style.display = 'none';

    // Clear previous debug info
    const prevDebug = document.getElementById('scanDebugInfo');
    if (prevDebug) prevDebug.remove();

    try {
        // Step 1: Object Detection
        const predictions = await mobileNetModel.classify(img);
        console.log('AI Predictions:', predictions);

        // --- DEBUGGING: Show user what AI sees ---
        const topPrediction = predictions[0].className;
        const debugDiv = document.createElement('div');
        debugDiv.id = 'scanDebugInfo';
        debugDiv.style.marginTop = '10px';
        debugDiv.style.fontSize = '0.9rem';
        debugDiv.style.color = '#666';
        debugDiv.innerHTML = `<strong>AI Detected:</strong> ${topPrediction} (${Math.round(predictions[0].probability * 100)}%)`;
        document.getElementById('scannerPreview').appendChild(debugDiv);
        // ------------------------------------------

        // ------------------------------------------
        // STRICT BLOCKLIST (Reject Humans/Objects immediately)
        // ------------------------------------------
        const BLOCKLIST = [
            'person', 'man', 'woman', 'girl', 'boy', 'human', 'people', 'baby', 'child',
            'face', 'hair', 'hand', 'leg', 'arm', 'foot', 'finger', 'toe', 'skin',
            'shirt', 't-shirt', 'pants', 'jeans', 'dress', 'skirt', 'jacket', 'coat', 'suit',
            'tie', 'hat', 'cap', 'glasses', 'sunglasses', 'shoe', 'sock', 'glove', 'mask',
            'room', 'wall', 'floor', 'ceiling', 'door', 'window', 'furniture', 'chair', 'table',
            'bed', 'sofa', 'couch', 'lamp', 'light', 'computer', 'phone', 'screen', 'keyboard',
            'book', 'paper', 'pen', 'pencil', 'cup', 'bottle', 'glass', 'plate', 'dish', 'toy'
        ];

        // Check if ANY of the top 3 predictions match the blocklist
        const top3 = predictions.slice(0, 3);
        const blockedMatch = top3.find(p => BLOCKLIST.some(blocked => p.className.toLowerCase().includes(blocked)));

        if (blockedMatch) {
            showError(`Detected <strong>${blockedMatch.className}</strong>. <br>Please simply scan a <strong>Leaf</strong>.`);
            loadingEl.classList.add('hidden');
            analyzeBtn.style.display = 'inline-flex';
            return;
        }

        // ------------------------------------------
        // COLOR ANALYSIS (RGB -> HSL)
        // ------------------------------------------
        const { status, disease, debugStats, greenRatio } = analyzeLeafHealthHSL(img);

        // Show Debug Stats in UI for verification
        debugDiv.innerHTML += `<br><small style="color: #888;">${debugStats}</small>`;

        // STRICT PLANT CHECK: Must have enough GREEN in HSL space
        // logic: if it's not a known plant keyword AND green ratio is low -> Reject
        const plantKeywords = ['leaf', 'plant', 'tree', 'flower', 'vegetable', 'fruit', 'crop', 'agriculture', 'grass', 'herb', 'shrub'];
        const isAIPlant = top3.some(p => plantKeywords.some(k => p.className.toLowerCase().includes(k)));

        // NEW LOGIC: If AI doesn't overtly say "PLANT", we require at least 15% GREEN.
        // This stops "wok", "jersey", or random objects from passing just because they match "brown/yellow" hues.
        if (!isAIPlant && greenRatio < 0.15) {
            showError(`No plant detected. (Green coverage too low: ${Math.round(greenRatio * 100)}%). <br>Please scan a <strong>Leaf</strong> close up.`);
            loadingEl.classList.add('hidden');
            analyzeBtn.style.display = 'inline-flex';
            return;
        }

        // Additional safeguard: If it is a plant, but green is < 1%? Likely a dead leaf or error, but let's allow "Rust" to catch it if heavily diseased.
        // But if Green ratio is < 5% and we have high confidence it's NOT a plant, we reject.

        // Step 3: Display Results
        displayResult(disease);
        loadingEl.classList.add('hidden');

    } catch (error) {
        console.error('Analysis error:', error);
        showError("An error occurred during analysis. Please try again.");
        loadingEl.classList.add('hidden');
        analyzeBtn.style.display = 'inline-flex';
    }
}

// ==========================================
// HSL COLOR ANALYSIS ALGORITHM
// ==========================================
function analyzeLeafHealthHSL(imgElement) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = imgElement.naturalWidth || imgElement.width;
    canvas.height = imgElement.naturalHeight || imgElement.height;
    ctx.drawImage(imgElement, 0, 0);

    const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = frame.data;
    const length = data.length;

    let greenCount = 0;
    let yellowCount = 0;
    let brownCount = 0;
    let whiteCount = 0;
    let blackCount = 0;
    let totalPixels = 0;

    for (let i = 0; i < length; i += 4) { // i += 4 for RGBA
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Skip transparent or very whitish-gray background pixels if any (simple check)
        // But for camera photos, we count everything usually.

        const [h, s, l] = rgbToHsl(r, g, b); // H: 0-360, S: 0-100, L: 0-100

        // 1. GREEN (Healthy) - Hue 70 to 160
        if (h >= 70 && h <= 170 && s > 15 && l > 15 && l < 85) {
            greenCount++;
        }
        // 2. YELLOW (Chlorosis/Deficiency) - Hue 40 to 70
        else if (h >= 40 && h < 70 && s > 20 && l > 20) {
            yellowCount++;
        }
        // 3. BROWN/RUST (Disease) - Hue 10-40 OR Hue 340-360 (Reddish-Brown)
        // High saturation usually means fresh rust, lower means dried
        else if ((h >= 10 && h < 40) || (h >= 340 && h <= 360) || (h < 10 && s > 30)) {
            // Exclude very dark/black (handled below) or very light (handled below)
            if (l > 15 && l < 75) brownCount++;
        }
        // 4. WHITE/GRAY (Powdery Mildew) - Low Saturation, High Lightness
        else if (s < 10 && l > 50) {
            whiteCount++;
        }
        // 5. BLACK/DARK (Necrosis/Spots) - Very Low Lightness
        else if (l < 15) {
            blackCount++;
        }

        totalPixels++;
    }

    const greenRatio = greenCount / totalPixels;
    const yellowRatio = yellowCount / totalPixels;
    const brownRatio = brownCount / totalPixels;
    const whiteRatio = whiteCount / totalPixels; // Careful, this can be background
    const blackRatio = blackCount / totalPixels; // Careful, shadows

    // DEBUG STATS STRING
    const debugStats = `G:${Math.round(greenRatio * 100)}% Y:${Math.round(yellowRatio * 100)}% Br:${Math.round(brownRatio * 100)}% W:${Math.round(whiteRatio * 100)}% Bl:${Math.round(blackRatio * 100)}%`;

    // ------------------------------------------
    // DECISION LOGIC
    // ------------------------------------------

    // 1. IS IT EVEN A PLANT?
    // If less than 25% Green, and we have high White/Black (could be wall/shadow), fail it.
    // However, a completely brown leaf is still a leaf.
    const totalPlantColor = greenRatio + yellowRatio + brownRatio;
    if (totalPlantColor < 0.25) {
        return { status: 'not_plant', disease: null, debugStats, greenRatio };
    }

    // 2. IS IT HEALTHY?
    // If Green is dominant over others
    // RE-INTRODUCED SAFEGUARD: If Green is extremely high (> 60%), we are likely looking at a healthy plant with shadows.
    // Shadows often register as "Black", so we must permit higher black ratios if Green is high.
    if (greenRatio > 0.60) {
        // If mostly green, ignore "Blight" unless black is VERY dominant (shadows vs rot)
        // Allow up to 30% black/shadows if the leaf is 60%+ Green.
        if (blackRatio < 0.30 && yellowRatio < 0.15 && brownRatio < 0.15 && whiteRatio < 0.15) {
            return { status: 'plant', disease: 'healthy', debugStats, greenRatio };
        }
    }

    // Standard Healthy Check (for less green leaves)
    if (greenRatio > 0.40 && greenRatio > (yellowRatio + brownRatio + blackRatio) * 1.5) {
        return { status: 'plant', disease: 'healthy', debugStats, greenRatio };
    }

    // 3. DISEASE IDENTIFICATION
    // Normalize ratios relative to "Plant Area" (Green+Yellow+Brown) to ignore background?
    // For now, raw ratios are safer if background is busy.

    if (brownRatio > 0.15) return { status: 'plant', disease: 'rust', debugStats, greenRatio };
    if (yellowRatio > 0.15) return { status: 'plant', disease: 'nutrient_deficiency', debugStats, greenRatio };
    if (whiteRatio > 0.15 && whiteRatio < 0.5) return { status: 'plant', disease: 'powdery_mildew', debugStats, greenRatio }; // < 0.5 to usually avoid wall backgrounds
    if (blackRatio > 0.10) return { status: 'plant', disease: 'leaf_blight', debugStats, greenRatio };

    // Default to healthy if unclear but green is present
    return { status: 'plant', disease: 'healthy', debugStats, greenRatio };
}

// Helper: RGB to HSL
function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h * 360, s * 100, l * 100];
}

function displayResult(diseaseKey) {
    // If null passed (e.g. from debug fallback), default to healthy
    if (!diseaseKey) diseaseKey = 'healthy';

    const result = diseaseDatabase[diseaseKey] || diseaseDatabase['healthy'];
    const resultSection = document.getElementById('scanResult');

    const statusEl = document.getElementById('diseaseStatus');
    const isHealthy = diseaseKey === 'healthy';

    statusEl.textContent = isHealthy ? 'Healthy Plant' : 'Issue Detected';
    statusEl.className = 'disease-badge ' + (isHealthy ? 'healthy' : 'diseased');

    document.getElementById('diseaseName').textContent = result.name;
    document.getElementById('diseaseDescription').textContent = result.description;

    const fertList = document.getElementById('fertilizerRecommendations');
    fertList.innerHTML = result.fertilizers.map(f =>
        `<div class="recommendation-item"><i class="fas fa-check-circle"></i><span>${f}</span></div>`
    ).join('');

    const treatList = document.getElementById('treatmentTips');
    treatList.innerHTML = result.treatments.map(t =>
        `<div class="recommendation-item"><i class="fas fa-check-circle"></i><span>${t}</span></div>`
    ).join('');

    resultSection.style.display = 'block';
}

function showError(message) {
    const preview = document.getElementById('scannerPreview');
    // Remove existing
    const existing = document.querySelector('.scanner-alert');
    if (existing) existing.remove();

    const div = document.createElement('div');
    div.className = 'scanner-alert';
    div.style.background = '#ffebee';
    div.style.color = '#c62828';
    div.style.padding = '10px';
    div.style.borderRadius = '8px';
    div.style.marginTop = '10px';
    div.style.fontWeight = 'bold';
    div.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;

    preview.appendChild(div);
}

// Drag and drop setup
function initScannerDragDrop() {
    const scannerBox = document.getElementById('scannerBox');
    if (scannerBox) {
        scannerBox.addEventListener('dragover', (e) => {
            e.preventDefault();
            scannerBox.classList.add('dragover');
        });

        scannerBox.addEventListener('dragleave', () => {
            scannerBox.classList.remove('dragover');
        });

        scannerBox.addEventListener('drop', (e) => {
            e.preventDefault();
            scannerBox.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                document.getElementById('leafInput').files = e.dataTransfer.files;
                handleLeafUpload({ target: { files: [file] } });
            }
        });
    }
}