// ============================================
// CALCULATOR FUNCTIONS
// ============================================

let currentLandUnit = 'acre';
let calculatedCosts = null;

function setLandUnit(unit) {
    currentLandUnit = unit;
    document.querySelectorAll('.land-unit-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`.land-unit-btn[onclick*="'${unit}'"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }

    const labels = { acre: 'Acres', bigha: 'Bigha', katha: 'Katha' };
    document.getElementById('landUnitLabel').textContent = labels[unit];
    updateLandConversion();
}

function updateLandConversion() {
    const value = parseFloat(document.getElementById('landSize').value) || 0;
    const convEl = document.getElementById('landConversion');

    let acres, bigha, katha;
    if (currentLandUnit === 'acre') {
        acres = value;
        katha = value * LAND_CONVERSIONS.kathaPerAcre;
        bigha = value * LAND_CONVERSIONS.bighaPerAcre;
    } else if (currentLandUnit === 'bigha') {
        bigha = value;
        acres = value * LAND_CONVERSIONS.acrePerBigha;
        katha = value * LAND_CONVERSIONS.kathaPerBigha;
    } else {
        katha = value;
        bigha = value / LAND_CONVERSIONS.kathaPerBigha;
        acres = bigha * LAND_CONVERSIONS.acrePerBigha;
    }

    convEl.textContent = `= ${acres.toFixed(2)} Acre = ${katha.toFixed(2)} Katha = ${bigha.toFixed(2)} Bigha`;
}

function getLandSizeInAcres() {
    const value = parseFloat(document.getElementById('landSize').value) || 0;
    if (currentLandUnit === 'acre') return value;
    if (currentLandUnit === 'bigha') return value * LAND_CONVERSIONS.acrePerBigha;
    return (value / LAND_CONVERSIONS.kathaPerBigha) * LAND_CONVERSIONS.acrePerBigha;
}

const aiCostCache = {};

async function calculateCosts() {
    const cropInput = document.getElementById('calcCrop').value.trim();
    const landSize = getLandSizeInAcres();
    const cropErrorEl = document.getElementById('calcCropError');

    // Hide previous error
    if (cropErrorEl) cropErrorEl.style.display = 'none';

    if (!cropInput) {
        if (cropErrorEl) cropErrorEl.style.display = 'block';
        return;
    }
    if (landSize <= 0) {
        alert('Please enter valid land size!');
        return;
    }

    // Try to find the crop in our existing data (case insensitive)
    let cropKey = Object.keys(cropData).find(k => k.toLowerCase() === cropInput.toLowerCase() || cropData[k].name.toLowerCase() === cropInput.toLowerCase());
    let cropName = cropKey ? cropData[cropKey].name : cropInput;
    let actualCropKey = cropKey || cropInput.toLowerCase().replace(/\s+/g, '_');

    selectedCrop = actualCropKey;
    
    // UI Feedback: Loading state on button
    const calcBtns = document.querySelectorAll('button[onclick="calculateCosts()"]');
    const btnTexts = [];
    calcBtns.forEach((btn, idx) => {
        btnTexts[idx] = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching please wait Krishibhai';
        btn.disabled = true;
    });

    try {
        let crop = cropKey ? { ...cropData[cropKey] } : { name: cropName, icon: '🌿' };
        
        // Fetch AI data if not already cached
        if (!aiCostCache[actualCropKey]) {
            const fetchedData = await fetchAICostData(crop.name);
            if (fetchedData && fetchedData.error) {
                if (cropErrorEl) cropErrorEl.style.display = 'block';
                return;
            } else if (fetchedData) {
                aiCostCache[actualCropKey] = fetchedData;
            }
        }
        
        // Override static data with AI real-time data if available
        if (aiCostCache[actualCropKey]) {
            crop = { ...crop, ...aiCostCache[actualCropKey] };
            // If it's a new crop, store it in cropData so it persists
            if (!cropData[actualCropKey]) {
                cropData[actualCropKey] = crop;
            }
        } else if (!cropKey) {
            // No local data, and AI failed
            throw new Error(`Could not generate cost data for "${crop.name}". Check your connection or try another crop.`);
        }

        const seedQty = crop.seedRate * landSize;
        const seedCost = seedQty * crop.seedPrice;
        const fertQty = crop.fertilizerRate * landSize;
        const fertCost = fertQty * crop.fertilizerPrice;
        const totalCost = seedCost + fertCost;
        const expectedYield = crop.yieldPerAcre * landSize;
        const expectedRevenue = expectedYield * crop.marketPrice;
        const profitMargin = (((expectedRevenue - totalCost) / expectedRevenue) * 100).toFixed(1);

        calculatedCosts = { seedQty, seedCost, fertQty, fertCost, totalCost, expectedYield, expectedRevenue, profitMargin };

        document.getElementById('seedQty').textContent = seedQty.toFixed(1) + ' kg';
        document.getElementById('seedCost').textContent = '₹' + seedCost.toLocaleString('en-IN');
        document.getElementById('fertQty').textContent = fertQty.toFixed(1) + ' kg';
        document.getElementById('fertCost').textContent = '₹' + fertCost.toLocaleString('en-IN');
        document.getElementById('totalCost').textContent = '₹' + totalCost.toLocaleString('en-IN');
        document.getElementById('expectedYield').textContent = expectedYield.toLocaleString('en-IN') + ' kg';
        document.getElementById('marketPrice').textContent = '₹' + crop.marketPrice + '/kg';
        document.getElementById('expectedRevenue').textContent = '₹' + expectedRevenue.toLocaleString('en-IN');
        document.getElementById('profitMargin').textContent = profitMargin + '%';
        
        const sourceNotice = aiCostCache[actualCropKey] ? 'AI Market Data' : 'Estimated Defaults';
        document.getElementById('revenueExplanation').textContent =
            `Based on ${landSize.toFixed(2)} acre(s) of ${crop.name}, expected yield: ${expectedYield.toLocaleString('en-IN')} kg, revenue: ₹${expectedRevenue.toLocaleString('en-IN')}. (${sourceNotice})`;

        if (typeof generateRoadmap === 'function') generateRoadmap(actualCropKey);
        if (typeof generateNotifications === 'function') generateNotifications(actualCropKey);
        
        // SAVE SESSION DATA
        const sessionData = {
            crop: cropKey,
            landSize: landSize,
            landUnit: currentLandUnit,
            startDate: new Date().toISOString(),
            costs: calculatedCosts
        };
        localStorage.setItem('bharatfarm_session', JSON.stringify(sessionData));
        
        if (typeof logActivity === 'function') {
            logActivity('calculation', `Calculated cost for ${landSize.toFixed(2)} acre(s) of ${crop.name}`, `Est. Profit: ${profitMargin}%`);
            updateUserStatistic('calculations');
        }
        
        if (typeof updateDashboard === 'function') updateDashboard();
        
    } catch (e) {
        console.error("Error calculating costs: ", e);
        alert("Calculator Error: " + e.message + "\n\nSee console for details.");
    } finally {
        calcBtns.forEach((btn, idx) => {
            btn.innerHTML = btnTexts[idx];
            btn.disabled = false;
        });
    }
}

async function fetchAICostData(cropName) {
    try {
        const systemPrompt = `You are an expert Indian agricultural economist. Analyze the following input to determine if it is a real farming crop, vegetable, fruit, seed, or spice (including local/regional names in any language, slang, or alternative spellings like "Alu", "Bhindi", etc.). 
If it is NOT an authentic plant-based agricultural product (e.g., if it is an animal, machinery, car, phone, tool, person, or any non-plant item), you MUST return STRICTLY and ONLY {"error": "not_a_crop"}.
If it IS a valid crop, seed, vegetable, fruit, or spice, provide current average farming cost data for India in pure JSON format. Return ONLY the raw JSON object, without markdown formatting, backticks, or additional text.
Required JSON keys (MUST all be numbers):
{
  "seedRate": <number: kg needed per acre>,
  "seedPrice": <number: cost in ₹ per kg>,
  "fertilizerRate": <number: total kg of primary fertilizers needed per acre>,
  "fertilizerPrice": <number: average cost in ₹ per kg of fertilizer>,
  "yieldPerAcre": <number: average yield in kg per acre>,
  "marketPrice": <number: average selling price in ₹ per kg>
}`;

        const content = await aiCall({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Input: ${cropName}` }
            ],
            temperature: 0.1 // Low temperature for consistent JSON output
        });

        if (!content) return null;

        // Clean up markdown block if model ignored instructions
        let cleanContent = content.trim();
        if (cleanContent.startsWith('```json')) cleanContent = cleanContent.substring(7);
        if (cleanContent.startsWith('```')) cleanContent = cleanContent.substring(3);
        if (cleanContent.endsWith('```')) cleanContent = cleanContent.substring(0, cleanContent.length - 3);

        const parsed = JSON.parse(cleanContent.trim());

        if (parsed.error) {
            return parsed;
        }

        // Simple validation to ensure all required fields are numbers
        const requiredFields = ['seedRate', 'seedPrice', 'fertilizerRate', 'fertilizerPrice', 'yieldPerAcre', 'marketPrice'];
        for (const field of requiredFields) {
            if (typeof parsed[field] !== 'number' || isNaN(parsed[field])) {
                throw new Error(`Invalid data received for ${field}`);
            }
        }

        return parsed;
    } catch (error) {
        console.warn("AI Data fetch failed, falling back to local dataset:", error);
        return null;
    }
}

function initLandSizeListener() {
    const landSizeInput = document.getElementById('landSize');
    if (landSizeInput) {
        landSizeInput.addEventListener('input', updateLandConversion);
    }
}
