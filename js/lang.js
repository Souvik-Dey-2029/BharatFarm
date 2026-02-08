// ============================================
// LANGUAGE SELECTION & TRANSLATION SYSTEM
// ============================================

// Current language (default: English)
let currentLanguage = localStorage.getItem('bharatfarm_language') || 'en';

// Translations object (from your HTML file)
const translations = {
    en: {
        loading_subtitle: "Preparing your smart farming dashboard...",
        login_tagline: "Your smart farming companion for better crop planning and higher productivity",
        welcome_back: "Welcome Back", 
        login_subtitle: "Login to access your farming dashboard",
        login: "Login", 
        register: "Register", 
        phone_number: "Phone Number", 
        password: "Password",
        full_name: "Full Name", 
        confirm_password: "Confirm Password", 
        logout: "Logout",
        dashboard: "Dashboard", 
        leaf_scanner: "Leaf Scanner", 
        weather: "Weather", 
        crops: "Crops",
        calculator: "Calculator", 
        roadmap: "Roadmap", 
        alerts: "Alerts", 
        welcome: "Welcome",
        dashboard_subtitle: "Your smart farming companion for better crop planning",
        weather_status: "Weather", 
        scan_now: "Scan Now", 
        detect_disease: "Detect Disease",
        next_activity: "Next Activity", 
        view_roadmap: "View Roadmap", 
        input_cost: "Input Cost",
        calculate: "Calculate", 
        revenue: "Revenue", 
        view_details: "Details",
        quick_tips: "Quick Tips for Today", 
        get_started: "Get Started", 
        scan_leaf: "Scan Leaf",
        check_weather: "Check Weather", 
        select_crop: "Select Crop", 
        calculate_costs: "Calculate Costs",
        leaf_disease_scanner: "Leaf Disease Scanner",
        scanner_desc: "Upload or capture a photo of any plant leaf to detect diseases and get fertilizer recommendations.",
        upload_leaf: "Upload Leaf Image", 
        click_or_drag: "Click to upload or drag and drop",
        take_photo: "Take Photo", 
        browse_files: "Browse Files", 
        analyze_leaf: "Analyze Leaf",
        analyzing: "Analyzing leaf image...", 
        enter_location: "Enter Your Location",
        get_weather: "Get Weather", 
        rain_probability: "Rain", 
        humidity: "Humidity", 
        wind: "Wind",
        visibility: "Visibility", 
        safe_farming: "SAFE for Farming",
        safe_msg: "Weather conditions are suitable for farming activities.",
        unsafe_farming: "NOT SAFE for Farming",
        unsafe_msg: "High rain probability. Avoid fertilizer application.",
        crop_desc: "Choose a crop to see detailed farming recommendations.",
        crop_info: "Crop Info", 
        duration: "Duration", 
        watering: "Watering", 
        fertilizers: "Fertilizers",
        schedule: "Schedule", 
        cost_calculator: "Seed & Fertilizer Cost Calculator",
        cost_note: "Only seed & fertilizer costs. 2024 India market rates.",
        land_unit: "Select Land Unit", 
        land_size: "Land Size", 
        cost_breakdown: "Cost Breakdown",
        seed_qty: "Seed Quantity", 
        seed_cost: "Seed Cost", 
        fert_qty: "Fertilizer Quantity",
        fert_cost: "Fertilizer Cost", 
        total_cost: "TOTAL INPUT COST",
        revenue_prediction: "Revenue Prediction", 
        expected_revenue: "Expected Revenue",
        revenue_note: "Select a crop and enter land size to see your expected revenue.",
        expected_yield: "Expected Yield", 
        market_price: "Market Price", 
        profit_margin: "Profit Margin",
        crop_roadmap: "Crop Activity Roadmap", 
        select_crop_first: "Select a crop to view schedule",
        select_crop_roadmap: "Please select a crop first to generate roadmap.",
        notifications: "Notifications & Alerts",
        tip_morning: "Morning: Best time for watering - reduces evaporation.",
        tip_afternoon: "Afternoon: Inspect crops for pests during warm hours.",
        tip_evening: "Evening: Apply fertilizers for better absorption.",
        healthy_plant: "Healthy Plant", 
        disease_detected: "Disease Detected",
        recommended_fertilizers: "Recommended Fertilizers", 
        treatment_tips: "Treatment Tips"
    },
    hi: {
        loading_subtitle: "आपका स्मार्ट फार्मिंग डैशबोर्ड तैयार हो रहा है...",
        login_tagline: "बेहतर फसल योजना और उच्च उत्पादकता के लिए आपका स्मार्ट खेती साथी",
        welcome_back: "वापस स्वागत है", 
        login_subtitle: "अपने खेती डैशबोर्ड तक पहुंचने के लिए लॉगिन करें",
        login: "लॉगिन", 
        register: "रजिस्टर", 
        phone_number: "फोन नंबर", 
        password: "पासवर्ड",
        full_name: "पूरा नाम", 
        confirm_password: "पासवर्ड की पुष्टि करें", 
        logout: "लॉगआउट",
        dashboard: "डैशबोर्ड", 
        leaf_scanner: "पत्ती स्कैनर", 
        weather: "मौसम", 
        crops: "फसलें",
        calculator: "कैलकुलेटर", 
        roadmap: "रोडमैप", 
        alerts: "अलर्ट", 
        welcome: "स्वागत है",
        dashboard_subtitle: "बेहतर फसल योजना के लिए आपका स्मार्ट खेती साथी",
        weather_status: "मौसम", 
        scan_now: "स्कैन करें", 
        detect_disease: "रोग पता करें",
        next_activity: "अगली गतिविधि", 
        view_roadmap: "रोडमैप देखें", 
        input_cost: "इनपुट लागत",
        calculate: "गणना करें", 
        revenue: "राजस्व", 
        view_details: "विवरण",
        quick_tips: "आज के लिए त्वरित सुझाव", 
        get_started: "शुरू करें", 
        scan_leaf: "पत्ती स्कैन करें",
        check_weather: "मौसम जांचें", 
        select_crop: "फसल चुनें", 
        calculate_costs: "लागत गणना करें",
        leaf_disease_scanner: "पत्ती रोग स्कैनर",
        scanner_desc: "रोग का पता लगाने और उर्वरक सिफारिशें प्राप्त करने के लिए किसी भी पौधे की पत्ती की फोटो अपलोड करें।",
        upload_leaf: "पत्ती की छवि अपलोड करें", 
        click_or_drag: "अपलोड करने के लिए क्लिक करें",
        take_photo: "फोटो लें", 
        browse_files: "फाइलें ब्राउज़ करें", 
        analyze_leaf: "पत्ती का विश्लेषण करें",
        analyzing: "पत्ती का विश्लेषण हो रहा है...", 
        enter_location: "अपना स्थान दर्ज करें",
        get_weather: "मौसम प्राप्त करें", 
        rain_probability: "बारिश", 
        humidity: "आर्द्रता", 
        wind: "हवा",
        visibility: "दृश्यता", 
        safe_farming: "खेती के लिए सुरक्षित",
        safe_msg: "मौसम की स्थिति खेती गतिविधियों के लिए उपयुक्त है।",
        unsafe_farming: "खेती के लिए असुरक्षित", 
        unsafe_msg: "बारिश की उच्च संभावना। उर्वरक न डालें।",
        crop_desc: "विस्तृत खेती सिफारिशें देखने के लिए फसल चुनें।",
        crop_info: "फसल जानकारी", 
        duration: "अवधि", 
        watering: "सिंचाई", 
        fertilizers: "उर्वरक",
        schedule: "अनुसूची", 
        cost_calculator: "बीज और उर्वरक लागत कैलकुलेटर",
        cost_note: "केवल बीज और उर्वरक लागत। 2024 भारत बाजार दरें।",
        land_unit: "भूमि इकाई चुनें", 
        land_size: "भूमि का आकार", 
        cost_breakdown: "लागत विवरण",
        seed_qty: "बीज मात्रा", 
        seed_cost: "बीज लागत", 
        fert_qty: "उर्वरक मात्रा",
        fert_cost: "उर्वरक लागत", 
        total_cost: "कुल इनपुट लागत",
        revenue_prediction: "राजस्व भविष्यवाणी", 
        expected_revenue: "अपेक्षित राजस्व",
        revenue_note: "अपेक्षित राजस्व देखने के लिए फसल और भूमि आकार चुनें।",
        expected_yield: "अपेक्षित उपज", 
        market_price: "बाजार मूल्य", 
        profit_margin: "लाभ मार्जिन",
        crop_roadmap: "फसल गतिविधि रोडमैप", 
        select_crop_first: "अनुसूची देखने के लिए फसल चुनें",
        select_crop_roadmap: "रोडमैप बनाने के लिए पहले फसल चुनें।",
        notifications: "सूचनाएं और अलर्ट",
        tip_morning: "सुबह: सिंचाई का सबसे अच्छा समय - वाष्पीकरण कम होता है।",
        tip_afternoon: "दोपहर: गर्म घंटों में कीटों की जांच करें।",
        tip_evening: "शाम: बेहतर अवशोषण के लिए उर्वरक डालें।",
        healthy_plant: "स्वस्थ पौधा", 
        disease_detected: "रोग पाया गया",
        recommended_fertilizers: "अनुशंसित उर्वरक", 
        treatment_tips: "उपचार सुझाव"
    },
    bn: {
        loading_subtitle: "আপনার স্মার্ট ফার্মিং ড্যাশবোর্ড প্রস্তুত হচ্ছে...",
        login_tagline: "উন্নত ফসল পরিকল্পনা এবং উচ্চ উৎপাদনশীলতার জন্য আপনার স্মার্ট কৃষি সহায়ক",
        welcome_back: "স্বাগতম", 
        login_subtitle: "আপনার কৃষি ড্যাশবোর্ডে প্রবেশ করতে লগইন করুন",
        login: "লগইন", 
        register: "নিবন্ধন", 
        phone_number: "ফোন নম্বর", 
        password: "পাসওয়ার্ড",
        full_name: "পুরো নাম", 
        confirm_password: "পাসওয়ার্ড নিশ্চিত করুন", 
        logout: "লগআউট",
        dashboard: "ড্যাশবোর্ড", 
        leaf_scanner: "পাতা স্ক্যানার", 
        weather: "আবহাওয়া", 
        crops: "ফসল",
        calculator: "ক্যালকুলেটর", 
        roadmap: "রোডম্যাপ", 
        alerts: "সতর্কতা", 
        welcome: "স্বাগতম",
        dashboard_subtitle: "উন্নত ফসল পরিকল্পনার জন্য আপনার স্মার্ট কৃষি সহায়ক",
        weather_status: "আবহাওয়া", 
        scan_now: "স্ক্যান করুন", 
        detect_disease: "রোগ সনাক্ত করুন",
        next_activity: "পরবর্তী কাজ", 
        view_roadmap: "রোডম্যাপ দেখুন", 
        input_cost: "ইনপুট খরচ",
        calculate: "গণনা করুন", 
        revenue: "আয়", 
        view_details: "বিবরণ",
        quick_tips: "আজকের দ্রুত টিপস", 
        get_started: "শুরু করুন", 
        scan_leaf: "পাতা স্ক্যান করুন",
        check_weather: "আবহাওয়া দেখুন", 
        select_crop: "ফসল নির্বাচন করুন", 
        calculate_costs: "খরচ গণনা করুন",
        leaf_disease_scanner: "পাতার রোগ স্ক্যানার",
        scanner_desc: "রোগ সনাক্ত করতে এবং সার সুপারিশ পেতে যেকোনো গাছের পাতার ছবি আপলোড করুন।",
        upload_leaf: "পাতার ছবি আপলোড করুন", 
        click_or_drag: "আপলোড করতে ক্লিক করুন",
        take_photo: "ছবি তুলুন", 
        browse_files: "ফাইল ব্রাউজ করুন", 
        analyze_leaf: "পাতা বিশ্লেষণ করুন",
        analyzing: "পাতা বিশ্লেষণ হচ্ছে...", 
        enter_location: "আপনার অবস্থান দিন",
        get_weather: "আবহাওয়া দেখুন", 
        rain_probability: "বৃষ্টি", 
        humidity: "আর্দ্রতা", 
        wind: "বাতাস",
        visibility: "দৃশ্যমানতা", 
        safe_farming: "কৃষির জন্য নিরাপদ",
        safe_msg: "আবহাওয়া কৃষি কাজের জন্য উপযুক্ত।",
        unsafe_farming: "কৃষির জন্য অনিরাপদ", 
        unsafe_msg: "বৃষ্টির উচ্চ সম্ভাবনা। সার দেবেন না।",
        crop_desc: "বিস্তারিত কৃষি সুপারিশ দেখতে ফসল নির্বাচন করুন।",
        crop_info: "ফসল তথ্য", 
        duration: "সময়কাল", 
        watering: "সেচ", 
        fertilizers: "সার",
        schedule: "সময়সূচী", 
        cost_calculator: "বীজ ও সার খরচ ক্যালকুলেটর",
        cost_note: "শুধু বীজ ও সার খরচ। ২০২৪ ভারত বাজার দর।",
        land_unit: "জমির একক নির্বাচন করুন", 
        land_size: "জমির আকার", 
        cost_breakdown: "খরচ বিবরণ",
        seed_qty: "বীজ পরিমাণ", 
        seed_cost: "বীজ খরচ", 
        fert_qty: "সার পরিমাণ",
        fert_cost: "সার খরচ", 
        total_cost: "মোট ইনপুট খরচ",
        revenue_prediction: "আয় পূর্বাভাস", 
        expected_revenue: "প্রত্যাশিত আয়",
        revenue_note: "প্রত্যাশিত আয় দেখতে ফসল এবং জমির আকার নির্বাচন করুন।",
        expected_yield: "প্রত্যাশিত ফলন", 
        market_price: "বাজার মূল্য", 
        profit_margin: "লাভের হার",
        crop_roadmap: "ফসল কার্যক্রম রোডম্যাপ", 
        select_crop_first: "সময়সূচী দেখতে ফসল নির্বাচন করুন",
        select_crop_roadmap: "রোডম্যাপ তৈরি করতে প্রথমে ফসল নির্বাচন করুন।",
        notifications: "বিজ্ঞপ্তি ও সতর্কতা",
        tip_morning: "সকাল: সেচের সেরা সময় - বাষ্পীভবন কম হয়।",
        tip_afternoon: "দুপুর: গরম সময়ে পোকামাকড় পরীক্ষা করুন।",
        tip_evening: "সন্ধ্যা: ভালো শোষণের জন্য সার দিন।",
        healthy_plant: "সুস্থ গাছ", 
        disease_detected: "রোগ সনাক্ত হয়েছে",
        recommended_fertilizers: "প্রস্তাবিত সার", 
        treatment_tips: "চিকিৎসা টিপস"
    }
};

// ============================================
// INITIALIZE LANGUAGE SYSTEM
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Check if language is already selected
    const selectedLang = localStorage.getItem('bharatfarm_language');
    
    if (!selectedLang) {
        // First-time user - show language modal
        showLanguageModal();
    } else {
        // Apply saved language
        currentLanguage = selectedLang;
        updateLanguage();
    }
});

// ============================================
// SHOW LANGUAGE MODAL
// ============================================
function showLanguageModal() {
    const modal = document.getElementById('languageModal');
    if (modal) {
        modal.classList.add('active');
    }
}

// ============================================
// SELECT LANGUAGE
// ============================================
function selectLanguage(lang) {
    // Save language preference
    localStorage.setItem('bharatfarm_language', lang);
    currentLanguage = lang;
    
    // Hide modal
    const modal = document.getElementById('languageModal');
    if (modal) {
        modal.classList.remove('active');
    }
    
    // Apply translations
    updateLanguage();
    
    console.log('Language selected:', lang);
}

// ============================================
// UPDATE ALL UI TEXT WITH TRANSLATIONS
// ============================================
function updateLanguage() {
    const t = translations[currentLanguage];
    
    // Update Loading Page
    const loadingSubtitle = document.querySelector('.loading-subtitle');
    if (loadingSubtitle) loadingSubtitle.textContent = t.loading_subtitle;
    
    // Update Login Page
    const loginTagline = document.querySelector('.login-left p');
    if (loginTagline) loginTagline.textContent = t.login_tagline;
    
    const authTitle = document.getElementById('authTitle');
    if (authTitle && authTitle.textContent === 'Welcome Back') {
        authTitle.textContent = t.welcome_back;
    }
    
    const authSubtitle = document.getElementById('authSubtitle');
    if (authSubtitle && authSubtitle.textContent === 'Login to access your farming dashboard') {
        authSubtitle.textContent = t.login_subtitle;
    }
    
    // Update form labels (Auth page)
    updateLabelText('Phone Number', t.phone_number);
    updateLabelText('Password', t.password);
    updateLabelText('Full Name', t.full_name);
    updateLabelText('Confirm Password', t.confirm_password);
    
    // Update buttons
    updateButtonText('Login', t.login, 'fa-sign-in-alt');
    updateButtonText('Register', t.register, 'fa-user-plus');
    updateButtonText('Logout', t.logout, 'fa-sign-out-alt');
    
    // Update Dashboard
    const dashboardSubtitle = document.querySelector('.dashboard-hero p');
    if (dashboardSubtitle) {
        dashboardSubtitle.textContent = t.dashboard_subtitle;
    }
    
    // Update stat cards
    updateStatCard(0, t.weather_status);
    updateStatCard(1, t.scan_now, t.detect_disease);
    updateStatCard(2, t.next_activity, t.view_roadmap);
    updateStatCard(3, t.input_cost, t.calculate);
    updateStatCard(4, t.revenue, t.view_details);
    
    // Update Card Headers
    updateCardHeader('Quick Tips for Today', t.quick_tips, 'fa-lightbulb');
    updateCardHeader('Leaf Disease Scanner', t.leaf_disease_scanner, 'fa-leaf');
    updateCardHeader('Enter Your Location', t.enter_location, 'fa-map-marker-alt');
    updateCardHeader('Crop Information', t.crop_info, 'fa-seedling');
    updateCardHeader('Seed & Fertilizer Cost Calculator', t.cost_calculator, 'fa-calculator');
    updateCardHeader('Cost Breakdown', t.cost_breakdown, 'fa-receipt');
    updateCardHeader('Revenue Prediction', t.revenue_prediction, 'fa-chart-line');
    updateCardHeader('Crop Activity Roadmap', t.crop_roadmap, 'fa-road');
    updateCardHeader('Notifications & Alerts', t.notifications, 'fa-bell');
    
    // Update Scanner Section
    const scannerBox = document.querySelector('.scanner-box');
    if (scannerBox) {
        const h3 = scannerBox.querySelector('h3');
        const p = scannerBox.querySelector('p');
        if (h3) h3.textContent = t.upload_leaf;
        if (p) p.textContent = t.click_or_drag;
    }
    
    const analyzeBtn = document.getElementById('analyzeBtn');
    if (analyzeBtn) {
        analyzeBtn.innerHTML = `<i class="fas fa-search"></i> ${t.analyze_leaf}`;
    }
    
    const cameraBtn = document.querySelector('.camera-btn');
    if (cameraBtn) {
        cameraBtn.innerHTML = `<i class="fas fa-camera"></i> ${t.take_photo}`;
    }
    
    // Update Weather Section
    const getWeatherBtn = document.querySelector('.location-input button');
    if (getWeatherBtn) {
        getWeatherBtn.innerHTML = `<i class="fas fa-search"></i> ${t.get_weather}`;
    }
    
    // Update weather detail cards
    updateWeatherLabel('Rain Probability', t.rain_probability);
    updateWeatherLabel('Humidity', t.humidity);
    updateWeatherLabel('Wind Speed', t.wind);
    updateWeatherLabel('Visibility', t.visibility);
    
    // Update Calculator Section
    updateLabelText('Select Crop', t.select_crop);
    updateLabelText('Select Land Unit', t.land_unit);
    updateLabelText('Land Size', t.land_size);
    
    const calcBtn = document.querySelector('#calculator .btn-primary');
    if (calcBtn && calcBtn.textContent.includes('Calculate')) {
        calcBtn.innerHTML = `<i class="fas fa-calculator"></i> ${t.calculate}`;
    }
    
    // Update tips
    updateTips(t);
    
    console.log('Language updated to:', currentLanguage);
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function updateLabelText(oldText, newText) {
    const labels = document.querySelectorAll('label');
    labels.forEach(label => {
        if (label.textContent.trim() === oldText) {
            label.textContent = newText;
        }
    });
}

function updateButtonText(oldText, newText, iconClass) {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        const text = button.textContent.trim();
        if (text === oldText || text.includes(oldText)) {
            if (iconClass) {
                button.innerHTML = `<i class="fas ${iconClass}"></i> ${newText}`;
            } else {
                button.textContent = newText;
            }
        }
    });
}

function updateStatCard(index, title, status) {
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards[index]) {
        const h3 = statCards[index].querySelector('h3');
        if (h3) h3.textContent = title;
        
        if (status) {
            const statusEl = statCards[index].querySelector('.status');
            if (statusEl) statusEl.textContent = status;
        }
    }
}

function updateCardHeader(oldText, newText, iconClass) {
    const headers = document.querySelectorAll('.card-header h2');
    headers.forEach(header => {
        if (header.textContent.includes(oldText)) {
            if (iconClass) {
                const parent = header.parentElement;
                parent.innerHTML = `<i class="fas ${iconClass}"></i><h2>${newText}</h2>`;
            } else {
                header.textContent = newText;
            }
        }
    });
}

function updateWeatherLabel(oldText, newText) {
    const labels = document.querySelectorAll('.weather-detail-card .label');
    labels.forEach(label => {
        if (label.textContent === oldText) {
            label.textContent = newText;
        }
    });
}

function updateTips(t) {
    const tipsDiv = document.getElementById('dashboardTips');
    if (tipsDiv) {
        tipsDiv.innerHTML = `
            <p><strong><i class="fas fa-check-circle" style="color: var(--success);"></i> ${t.tip_morning.split(':')[0]}:</strong> ${t.tip_morning.split(':')[1]}</p>
            <p style="margin-top: var(--spacing-sm);"><strong><i class="fas fa-check-circle" style="color: var(--success);"></i> ${t.tip_afternoon.split(':')[0]}:</strong> ${t.tip_afternoon.split(':')[1]}</p>
            <p style="margin-top: var(--spacing-sm);"><strong><i class="fas fa-check-circle" style="color: var(--success);"></i> ${t.tip_evening.split(':')[0]}:</strong> ${t.tip_evening.split(':')[1]}</p>
        `;
    }
}

// ============================================
// MAKE FUNCTIONS GLOBALLY ACCESSIBLE
// ============================================
window.selectLanguage = selectLanguage;
window.showLanguageModal = showLanguageModal;
window.updateLanguage = updateLanguage;
window.currentLanguage = currentLanguage;
window.translations = translations;

console.log('Language.js loaded successfully');