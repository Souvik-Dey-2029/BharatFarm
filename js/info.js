// =========================================================================
// INFO PAGE LOGIC - BHARATFARM
// Handles dynamic content loading based on URL parameters
// =========================================================================

const infoContent = {
    faq: {
        title: "Frequently Asked Questions",
        label: "Help Center",
        body: `
            <div class="faq-item">
                <h3>Is the AI Leaf Scanner reliable?</h3>
                <p>Our Leaf Scanner uses advanced vision models trained on thousands of agricultural datasets. It provides a high-confidence analysis, but we always recommend confirming with a local agricultural expert for critical decisions.</p>
            </div>
            <div class="faq-item">
                <h3>Is the data available offline?</h3>
                <p>Yes, the crop intelligence database and farming roadmap are stored locally on your device once initial sync is complete, allowing you to access them even in low-connectivity areas.</p>
            </div>
            <div class="faq-item">
                <h3>How do I contact sellers in the marketplace?</h3>
                <p>BharatFarm provides a direct contact system. When you view a listing, you can see the farmer's verified phone number to initiate trade directly.</p>
            </div>
        `
    },
    terms: {
        title: "Terms & Conditions",
        label: "Legal Information",
        body: `
            <h2>1. Platform Usage</h2>
            <p>BharatFarm is a demonstrative smart agriculture platform. All AI-generated advice should be verified before final implementation.</p>
            <h2>2. User Accounts</h2>
            <p>Users are responsible for maintaining the confidentiality of their credentials and for all activities that occur under their account.</p>
            <h2>3. Marketplace Rules</h2>
            <p>BharatFarm acts as a bridge between farmers and buyers. We do not participate in financial transactions or take commissions.</p>
        `
    },
    privacy: {
        title: "Privacy Policy",
        label: "Data Privacy",
        body: `
            <h2>Data Collection</h2>
            <p>We collect minimal personal data (Name, Phone) solely for authentication and marketplace visibility.</p>
            <h2>AI Data Processing</h2>
            <p>Images uploaded for leaf analysis are processed securely and are not stored permanently unless opted-in for dataset improvement.</p>
            <h2>Your Rights</h2>
            <p>You have full control over your data. You can delete your account and associated information at any time via the profile settings.</p>
        `
    },
    disclaimer: {
        title: "Disclaimer",
        label: "Notice",
        body: `
            <p>The information provided by BharatFarm (including weather, AI scanner, and yield calculators) is for informational purposes only.</p>
            <p>Farming involves numerous variables including soil quality, local climate nuances, and seed quality. Users are advised to use their judgment and consult with local agricultural offices for high-stakes decisions.</p>
            <p>Digital Agri-India Portal is a trade facilitator; users trade at their own risk.</p>
        `
    },
    methodology: {
        title: "AI Methodology",
        label: "Technology",
        body: `
            <h2>Platform Intelligence</h2>
            <p>BharatFarm utilizes <strong>Gemini 2.0 Flash</strong> for high-speed voice and text interactions, providing real-time agricultural logic.</p>
            <h2>Vision Intelligence</h2>
            <p>Our Leaf Scanner leverages specialized Vision-Language models to identify patterns in leaf discoloration, spotting pests, fungi, and nutritional deficiencies.</p>
            <h2>Weather Core</h2>
            <p>Real-time data is aggregated from global weather APIs and processed locally to generate safety alerts tailored for farming activities.</p>
        `
    },

    dataprotection: {
        title: "Data Protection",
        label: "Security",
        body: `
            <h2>Security Infrastructure</h2>
            <p>BharatFarm uses banking-grade encryption for all user communications. Your data is stored on secure cloud servers with multi-layer firewalls.</p>
            <h2>Zero-Storage Vision</h2>
            <p>By default, we follow a privacy-first approach where your farm photos are processed in memory and immediately discarded after analysis results are generated.</p>
        `
    },
    accessibility: {
        title: "Accessibility",
        label: "Inclusion",
        body: `
            <h2>For Every Farmer</h2>
            <p>We are committed to making technology accessible. Our KrishiBot features full Voice-to-Voice support in multiple Indian languages (Hindi, Bengali, English).</p>
            <h2>Visual Support</h2>
            <p>The interface uses high-contrast accessibility tokens and adjustable font sizes to ensure readability in sunlight and for users with varying visual needs.</p>
        `
    },
    about: {
        title: "About Bharat Farm",
        label: "Our Mission",
        body: `
            <h2>Empowering Indian Agriculture</h2>
            <p>Bharat Farm is a comprehensive web application designed to empower Indian farmers with modern technology and data-driven insights. Our platform provides intelligent tools for crop planning, disease detection, weather monitoring, and financial planning to help farmers make smarter decisions and increase productivity.</p>
            <h2>Our Vision</h2>
            <p>To bridge the gap between traditional farming practices and modern technology, making advanced agricultural tools accessible to every farmer in India. We believe that with the right information and tools, farmers can significantly improve their yields, reduce costs, and make more informed decisions.</p>
            <div style="margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 10px; border-left: 4px solid var(--primary);">
                <p style="margin: 0; font-style: italic;">"Made with ❤️ for Indian Farmers"</p>
            </div>
        `
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const pageKey = urlParams.get('page') || 'about';
    
    const titleEl = document.getElementById('infoTitle');
    const labelEl = document.getElementById('infoLabel');
    const contentEl = document.getElementById('infoContent');
    const backLink = document.getElementById('backLink');

    // Handle back logic: if coming from app.html, go back to app.html
    if (document.referrer.includes('app.html')) {
        backLink.href = 'app.html';
        backLink.querySelector('span').textContent = 'Back to App';
    }

    const data = infoContent[pageKey];
    
    if (data) {
        titleEl.textContent = data.title;
        labelEl.textContent = data.label;
        contentEl.innerHTML = data.body;
        document.title = `${data.title} - BharatFarm`;
    } else {
        titleEl.textContent = "Page Not Found";
        contentEl.innerHTML = "<p>The requested documentation page could not be found.</p>";
    }
});
