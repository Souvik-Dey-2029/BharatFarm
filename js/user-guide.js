// ============================================
// USER GUIDE SYSTEM
// ============================================

let guideActive = false;
let currentGuideStep = 0;

const guideSteps = [
    {
        target: '.dashboard-hero',
        title: 'Welcome to BharatFarm!',
        content: 'Your smart agriculture companion. This dashboard shows your farming overview with weather alerts, crop status, and quick tips.',
        icon: 'fa-tractor',
        position: 'bottom'
    },
    {
        target: '.stat-card:nth-child(1)',
        title: 'Weather Monitoring',
        content: 'Check real-time weather conditions and farming safety alerts. Click on this card to see detailed forecasts.',
        icon: 'fa-cloud-sun',
        position: 'right'
    },
    {
        target: '.stat-card:nth-child(2)',
        title: 'Leaf Disease Scanner',
        content: 'Upload or capture photos of plant leaves to detect diseases using AI-powered analysis.',
        icon: 'fa-leaf',
        position: 'right'
    },
    {
        target: '.stat-card:nth-child(3)',
        title: 'Next Activity',
        content: 'View your upcoming farming activities and crop roadmap for better planning.',
        icon: 'fa-seedling',
        position: 'left'
    },
    {
        target: '.stat-card:nth-child(4)',
        title: 'Cost Calculator',
        content: 'Calculate farming costs including seeds, fertilizers, labor, and track your expenses.',
        icon: 'fa-calculator',
        position: 'left'
    },
    {
        target: '.stat-card:nth-child(5)',
        title: 'Revenue Estimator',
        content: 'Get revenue predictions based on your crop selection, land size, and market prices.',
        icon: 'fa-chart-line',
        position: 'left'
    },
    {
        target: '#dashboardTips',
        title: 'Daily Farming Tips',
        content: 'Get personalized tips based on weather conditions and your selected crops. Updated daily!',
        icon: 'fa-lightbulb',
        position: 'top'
    }
];

function initUserGuide() {
    // Wait for page to be fully loaded
    if (document.readyState !== 'complete') {
        window.addEventListener('load', initUserGuide);
        return;
    }

    // Check if guide has been completed
    const guideCompleted = localStorage.getItem('bharatfarm_guide_completed');

    // Create guide overlay
    if (!document.getElementById('guideOverlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'guide-overlay';
        overlay.id = 'guideOverlay';
        document.body.appendChild(overlay);
    }

    // Create guide tooltip
    if (!document.getElementById('guideTooltip')) {
        const tooltip = document.createElement('div');
        tooltip.className = 'guide-tooltip';
        tooltip.id = 'guideTooltip';
        document.body.appendChild(tooltip);
    }

    // Create guide start button
    if (!document.getElementById('guideStartBtn')) {
        const startBtn = document.createElement('button');
        startBtn.className = 'guide-start-btn';
        startBtn.id = 'guideStartBtn';
        startBtn.innerHTML = '<i class="fas fa-question-circle"></i>';
        startBtn.title = 'Start User Guide';
        startBtn.onclick = function () { startGuide(); };
        document.body.appendChild(startBtn);
        console.log('User guide button created');
    }

    // Auto-start guide for new users
    if (!guideCompleted) {
        setTimeout(() => {
            const currentUser = localStorage.getItem('bharatfarm_current_user');
            if (currentUser && confirm('Welcome to BharatFarm! Would you like a quick tour of the features?')) {
                startGuide();
            } else {
                localStorage.setItem('bharatfarm_guide_completed', 'skipped');
            }
        }, 2000);
    }
}

function startGuide() {
    guideActive = true;
    currentGuideStep = 0;

    // Make sure we're on dashboard
    if (typeof showSection === 'function') {
        showSection('dashboard');
    }

    // Wait a moment for dashboard to render
    setTimeout(() => {
        // Show overlay
        const overlay = document.getElementById('guideOverlay');
        const startBtn = document.getElementById('guideStartBtn');

        if (overlay) overlay.classList.add('active');
        if (startBtn) startBtn.classList.add('hidden');

        // Show first step
        showGuideStep(0);
    }, 300);
}

function showGuideStep(stepIndex) {
    if (stepIndex < 0 || stepIndex >= guideSteps.length) {
        endGuide();
        return;
    }

    currentGuideStep = stepIndex;
    const step = guideSteps[stepIndex];

    // Remove previous highlights
    document.querySelectorAll('.guide-highlight').forEach(el => {
        el.classList.remove('guide-highlight');
        el.style.position = '';
        el.style.zIndex = '';
    });

    // Highlight target element
    const targetElement = document.querySelector(step.target);
    if (targetElement) {
        // Make sure element is visible
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

        setTimeout(() => {
            targetElement.classList.add('guide-highlight');

            // Ensure element is above overlay
            const originalPosition = window.getComputedStyle(targetElement).position;
            if (originalPosition === 'static') {
                targetElement.style.position = 'relative';
            }

            // Position and show tooltip
            showTooltip(targetElement, step, stepIndex);
        }, 500);
    } else {
        console.warn('Guide target not found:', step.target);
        // Skip to next step if target not found
        showGuideStep(stepIndex + 1);
    }
}

function showTooltip(targetElement, step, stepIndex) {
    const tooltip = document.getElementById('guideTooltip');
    if (!tooltip) return;

    // Build tooltip content
    tooltip.innerHTML = `
        <div class="guide-tooltip-header">
            <i class="fas ${step.icon}"></i>
            <h3>${step.title}</h3>
        </div>
        <div class="guide-tooltip-content">
            ${step.content}
        </div>
        <div class="guide-tooltip-footer">
            <div class="guide-progress">Step ${stepIndex + 1} of ${guideSteps.length}</div>
            <div class="guide-controls">
                <button class="guide-btn guide-btn-skip" onclick="endGuide()">Skip Tour</button>
                ${stepIndex > 0 ? '<button class="guide-btn guide-btn-prev" onclick="prevGuideStep()">Previous</button>' : ''}
                <button class="guide-btn guide-btn-next" onclick="nextGuideStep()">
                    ${stepIndex === guideSteps.length - 1 ? 'Finish' : 'Next'}
                </button>
            </div>
        </div>
    `;

    // Show tooltip first to get dimensions
    tooltip.classList.add('active');
    tooltip.classList.remove('arrow-top', 'arrow-bottom');

    // Wait for next frame to get accurate dimensions
    requestAnimationFrame(() => {
        const rect = targetElement.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const offset = 20;

        // Calculate available space
        const spaceAbove = rect.top - offset;
        const spaceBelow = viewportHeight - (rect.bottom + offset);
        const spaceLeft = rect.left - offset;
        const spaceRight = viewportWidth - (rect.right + offset);

        // Best fit logic
        let placement = step.position || 'bottom';
        let fits = false;

        // Check fitness based on placement
        if (placement === 'bottom') fits = spaceBelow >= tooltipRect.height;
        else if (placement === 'top') fits = spaceAbove >= tooltipRect.height;
        else if (placement === 'left') fits = spaceLeft >= tooltipRect.width;
        else if (placement === 'right') fits = spaceRight >= tooltipRect.width;

        // If preferred doesn't fit, check alternatives
        if (!fits) {
            // Priority: Flip Axis -> Rotate -> Best Space
            if (placement === 'bottom' || placement === 'top') {
                if (placement === 'bottom' && spaceAbove >= tooltipRect.height) placement = 'top';
                else if (placement === 'top' && spaceBelow >= tooltipRect.height) placement = 'bottom';
            } else {
                if (placement === 'left' && spaceRight >= tooltipRect.width) placement = 'right';
                else if (placement === 'right' && spaceLeft >= tooltipRect.width) placement = 'left';
            }
        }

        // Apply placement
        let top, left;

        // Remove all arrow classes first
        tooltip.classList.remove('arrow-top', 'arrow-bottom', 'arrow-left', 'arrow-right');

        if (placement === 'bottom') {
            top = rect.bottom + offset;
            left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
            tooltip.classList.add('arrow-top');
        } else if (placement === 'top') {
            top = rect.top - tooltipRect.height - offset;
            left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
            tooltip.classList.add('arrow-bottom');
        } else if (placement === 'left') {
            top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
            left = rect.left - tooltipRect.width - offset;
            tooltip.classList.add('arrow-right');
        } else if (placement === 'right') {
            top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
            left = rect.right + offset;
            tooltip.classList.add('arrow-left');
        }

        // CLAMP VERTICALLY
        if (top < 10) top = 10;
        if (top + tooltipRect.height > viewportHeight - 10) {
            top = viewportHeight - tooltipRect.height - 10;
        }

        // CLAMP HORIZONTALLY
        if (left < 10) left = 10;
        if (left + tooltipRect.width > viewportWidth - 10) {
            left = viewportWidth - tooltipRect.width - 10;
        }

        tooltip.style.top = top + 'px';
        tooltip.style.left = left + 'px';
    });
}

function nextGuideStep() {
    showGuideStep(currentGuideStep + 1);
}

function prevGuideStep() {
    showGuideStep(currentGuideStep - 1);
}

function endGuide() {
    guideActive = false;

    // Remove highlights
    document.querySelectorAll('.guide-highlight').forEach(el => {
        el.classList.remove('guide-highlight');
        el.style.position = '';
        el.style.zIndex = '';
    });

    // Hide overlay and tooltip
    const overlay = document.getElementById('guideOverlay');
    const tooltip = document.getElementById('guideTooltip');
    const startBtn = document.getElementById('guideStartBtn');

    if (overlay) overlay.classList.remove('active');
    if (tooltip) tooltip.classList.remove('active');
    if (startBtn) startBtn.classList.remove('hidden');

    // Mark guide as completed
    localStorage.setItem('bharatfarm_guide_completed', 'true');
}

// Initialize guide when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUserGuide);
} else {
    initUserGuide();
}

// Make functions globally accessible
window.startGuide = startGuide;
window.nextGuideStep = nextGuideStep;
window.prevGuideStep = prevGuideStep;
window.endGuide = endGuide;
window.filterActivities = filterActivities;

console.log('User-guide.js loaded - functions available');
