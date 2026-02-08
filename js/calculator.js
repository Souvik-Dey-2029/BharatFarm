// ============================================
// CALCULATOR FUNCTIONS
// ============================================

let currentLandUnit = 'acre';
let calculatedCosts = null;

function setLandUnit(unit) {
    currentLandUnit = unit;
    document.querySelectorAll('.land-unit-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

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

function calculateCosts() {
    const cropKey = document.getElementById('calcCrop').value;
    const landSize = getLandSizeInAcres();

    if (!cropKey) {
        alert('Please select a crop!');
        return;
    }
    if (landSize <= 0) {
        alert('Please enter valid land size!');
        return;
    }

    selectedCrop = cropKey;
    const crop = cropData[cropKey];

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
    document.getElementById('revenueExplanation').textContent =
        `Based on ${landSize.toFixed(2)} acre(s) of ${crop.name}, expected yield: ${expectedYield.toLocaleString('en-IN')} kg, revenue: ₹${expectedRevenue.toLocaleString('en-IN')}.`;

    generateRoadmap(cropKey);
    generateNotifications(cropKey);
    
    // SAVE SESSION DATA
    const sessionData = {
        crop: cropKey,
        landSize: landSize,
        landUnit: currentLandUnit,
        startDate: new Date().toISOString(),
        costs: calculatedCosts
    };
    localStorage.setItem('bharatfarm_session', JSON.stringify(sessionData));
    
    updateDashboard();
}

function initLandSizeListener() {
    const landSizeInput = document.getElementById('landSize');
    if (landSizeInput) {
        landSizeInput.addEventListener('input', updateLandConversion);
    }
}
