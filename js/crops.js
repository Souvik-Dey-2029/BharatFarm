// ============================================
// CROPS FUNCTIONS
// ============================================

let selectedCrop = null;

function initCropGrid() {
    const grid = document.getElementById('cropGrid');
    grid.innerHTML = '';
    Object.keys(cropData).forEach(key => {
        const crop = cropData[key];
        const card = document.createElement('div');
        card.className = 'crop-card';
        card.onclick = () => selectCrop(key);
        card.innerHTML = `
            <div class="crop-icon">${crop.icon}</div>
            <h3>${crop.name}</h3>
            <p>${crop.duration}</p>
        `;
        grid.appendChild(card);
    });
}

function selectCrop(cropKey) {
    selectedCrop = cropKey;
    const crop = cropData[cropKey];

    document.querySelectorAll('.crop-card').forEach((c, i) => {
        c.classList.toggle('selected', Object.keys(cropData)[i] === cropKey);
    });

    document.getElementById('cropInfo').classList.add('visible');
    document.getElementById('selectedCropName').textContent = crop.name;
    document.getElementById('cropDuration').textContent = crop.duration;
    document.getElementById('cropWatering').textContent = crop.wateringFrequency;
    document.getElementById('cropFertilizers').textContent = crop.fertilizers;
    document.getElementById('cropFertSchedule').textContent = crop.fertilizerSchedule;
    document.getElementById('calcCrop').value = cropKey;

    generateRoadmap(cropKey);
    generateNotifications(cropKey);
    updateDashboard();
}
