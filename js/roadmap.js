// ============================================
// ROADMAP FUNCTIONS
// ============================================

function generateRoadmap(cropKey) {
    const crop = cropData[cropKey];
    const timeline = document.getElementById('roadmapTimeline');
    document.getElementById('noRoadmap').style.display = 'none';
    timeline.style.display = 'block';
    document.getElementById('roadmapCropName').textContent =
        `Activity Schedule for ${crop.name} (${crop.duration})`;

    timeline.innerHTML = crop.roadmap.map(item => {
        const typeClass = item.type === 'water' ? 'water' :
            item.type === 'fertilizer' ? 'fertilizer' :
                item.type === 'harvest' ? 'harvest' : '';
        const icon = item.type === 'water' ? 'fa-tint' :
            item.type === 'fertilizer' ? 'fa-flask' :
                item.type === 'seed' ? 'fa-seedling' :
                    item.type === 'harvest' ? 'fa-cut' : 'fa-tasks';

        return `
            <div class="timeline-item ${typeClass}">
                <span class="day-badge">Day ${item.day}</span>
                <h3>${item.activity}</h3>
                <p>${item.desc}</p>
                <i class="fas ${icon} activity-icon"></i>
            </div>
        `;
    }).join('');
}
