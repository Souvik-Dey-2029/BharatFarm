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
        treatment_tips: "Treatment Tips",
        // Crop section
        crop_search_placeholder: "Search crops (e.g., Tomato, Rice...)",
        crop_search_desc: "Search for any crop to see detailed farming recommendations from the global database.",
        cat_all: "All",
        cat_cereal: "Cereal",
        cat_vegetable: "Vegetable",
        cat_fruit: "Fruit",
        cat_oilseed: "Oilseed",
        searching_crops: "Searching crop database...",
        no_crops_found: "No crops found matching your search. Try a different name or category.",
        previous: "Previous",
        next: "Next",
        scientific_name: "Scientific Name",
        climate_requirement: "Climate Requirement",
        soil_type: "Soil Type",
        total_duration: "Total Duration",
        water_requirement: "Water Requirement",
        harvesting_period: "Harvesting Period",
        ai_insights: "AI Growing Insights",
        view_roadmap_btn: "View Roadmap",
        calculate_costs_btn: "Calculate Costs",
        crop_info_label: "Crop Information",
        cropNames: {
            tomato: "Tomato", potato: "Potato", onion: "Onion", carrot: "Carrot",
            cabbage: "Cabbage", spinach: "Spinach", brinjal: "Brinjal (Eggplant)",
            cauliflower: "Cauliflower", okra: "Okra (Lady's Finger)", capsicum: "Capsicum (Bell Pepper)",
            mango: "Mango", banana: "Banana", apple: "Apple", papaya: "Papaya",
            guava: "Guava", orange: "Orange", grapes: "Grapes", pomegranate: "Pomegranate",
            watermelon: "Watermelon", pineapple: "Pineapple",
            rice: "Rice", wheat: "Wheat", maize: "Maize (Corn)", barley: "Barley", oats: "Oats",
            mustard: "Mustard", soybean: "Soybean", sunflower: "Sunflower", groundnut: "Groundnut (Peanut)"
        },
        categoryNames: {
            vegetable: "VEGETABLE", fruit: "FRUIT", cereal: "CEREAL", oilseed: "OILSEED"
        },
        // Schemes
        schemes_title: "Government Scheme Matchmaker",
        schemes_subtitle: "Find government schemes & subsidies you are eligible for",
        schemes_step1_title: "Farm Size",
        schemes_step1_label: "How much land do you farm?",
        schemes_step1_placeholder: "Enter land size in acres",
        schemes_step2_title: "Your State",
        schemes_step2_label: "Select your state",
        schemes_step2_placeholder: "-- Select State --",
        schemes_step3_title: "Main Crop",
        schemes_step3_label: "What is your main crop?",
        schemes_step3_placeholder: "e.g. Rice, Wheat, Tomato...",
        schemes_prev: "Previous",
        schemes_next: "Next",
        schemes_find: "Find My Schemes",
        schemes_finding: "Finding Schemes...",
        schemes_back: "Search Again",
        schemes_eligible: "Eligible Schemes",
        schemes_matched: "Schemes Matched",
        schemes_empty_title: "No Schemes Found",
        schemes_empty_msg: "We couldn't find any specific schemes matching your profile. Check back later or adjust your inputs.",
        schemes_try_again: "Try Again",
        schemes_eligibility: "Eligibility",
        schemes_benefits: "Benefits / Profit",
        schemes_apply: "Apply Now",
        schemes_any_size: "Any Size",
        schemes_all_states: "All States",
        schemes_all_crops: "All Crops",
        schemes_central: "Central",
        schemes_state: "State",
        schemes_centralstate: "Central/State",
        marketplace_title: "Marketplace",
        marketplace_label: "Buy & Sell",
        marketplace_status: "Open",
        schemes_title_short: "Govt Schemes",
        schemes_check_eligibility: "Check Eligibility",
        schemes_matchmaker: "Matchmaker",
        premium_marketplace: "AI-Driven Marketplace",
        premium_trade: "Direct-to-Buyer Trade",
        premium_commission: "Zero Commission Sales",
        premium_leaf_scanner: "Leaf Disease Scanner",
        premium_roadmap: "Farming Activity Roadmap",
        premium_weather: "Advanced Weather Alerts",
        premium_revenue: "Revenue Predictions",
        premium_support: "Priority Support",
        premium_ad_free: "Ad-free Experience",
        premium_plan_title: "Choose Your Farming Plan",
        premium_plan_subtitle: "Unlock advanced tools to maximize your yield",
        premium_free_month: "1st month is FREE for all new users!",
        free_version: "Free Version",
        free_dashboard: "Basic Dashboard",
        free_weather: "Weather Updates",
        free_calculator: "Cost Calculator",
        free_marketplace: "Browse Marketplace",
        free_roadmap: "Detailed Activity Roadmap",
        free_support: "Expert Support",
        schemes_loading_msg_1: "Helping our Annadata... Finding the best government schemes for your prosperity.",
        schemes_loading_msg_2: "Sowing the seeds of information... Fetching the latest updates for your farm.",
        // Redesigned Dashboard Keys
        hero_title: "Your AI Companion for",
        hero_accent: "Smarter Farming",
        hero_sub: "Welcome, <strong><span id=\"welcomeName\">Farmer</span></strong>! Empowering Indian agriculture with real-time intelligence, voice-first assistance, and direct market access.",
        hero_get_started: "Get Started",
        hero_explore: "Explore Ecosystem",
        float_weather_label: "Weather Alert",
        float_activity_label: "Next Activity",
        float_activity_value: "Select crop",
        float_roadmap_status: "View Roadmap",
        ecosystem_tag: "THE ECOSYSTEM",
        ecosystem_title: "Cultivating the Future",
        kb_title: "KrishiBot: Voice First AI",
        kb_desc: "Talk to your farm. Get advice in your local dialect on irrigation, pest control, and market trends.",
        kb_cta: "Talk Now",
        ls_title: "Leaf Scanner",
        ls_desc: "Instant Gemini-powered crop disease diagnosis from a single photograph.",
        ls_cta: "Launch Scan",
        sm_title: "Smart Market",
        sm_desc: "Sell direct to urban clusters. Cut the middleman.",
        sm_cta: "Open Market",
        ha_title: "Hyperlocal Analytics",
        ha_desc: "Soil moisture, nutrient levels, and precision weather forecasting for your specific coordinates.",
        ha_input_label: "Input Cost",
        ha_revenue_label: "Revenue",
        gs_title: "Govt Schemes",
        gs_desc: "Check eligibility for PM-KISAN, PMFBY, and state-specific subsidies.",
        gs_cta: "Matchmaker",
        impact_title: "From Soil to Soul.",
        impact_desc: "We don't just provide data; we provide a bridge between the hardworking farmer and the conscious consumer. Join an ecosystem that respects the land and rewards the labor.",
        impact_stat1_title: "Sustainability First",
        impact_stat1_desc: "Reducing fertilizer waste by 30% through AI precision",
        impact_stat2_title: "Fair Pricing",
        impact_stat2_desc: "Direct distribution ensures farmers get 85% of retail price",
        // Marketplace & Header
        header_premium: "Premium",
        header_logout: "Logout",
        mk_browse: "Browse Market",
        mk_sell: "Sell Produce",
        mk_role_buyer: "Buyer",
        mk_role_farmer: "Farmer",
        mk_switch_role: "Switch Role",
        mk_search_placeholder: "Search crops, farmers or regions...",
        mk_add_listing: "Add New Listing",
        mk_product_name: "Product Name",
        mk_crop_placeholder: "Type or select a crop...",
        mk_category: "Category",
        mk_price: "Price (Rs.)",
        mk_unit: "Unit",
        mk_quantity: "Quantity",
        mk_state: "State",
        mk_district: "District",
        mk_locality: "Locality",
        mk_submit_listing: "List Product",
        mk_cat_veg: "Vegetables",
        mk_cat_fruit: "Fruits",
        mk_cat_grain: "Grains & Pulses",
        mk_cat_seed: "Seeds & Fertilizers",
        mk_cat_machinery: "Machinery",
        unit_kg: "Per kg",
        unit_quintal: "Per quintal",
        unit_piece: "Per piece",
        unit_ton: "Per ton",

        // Gamification
        gami_xp: "Experience",
        gami_take_quiz: "Take Daily Quiz",
        gami_correct: "Correct!",
        gami_incorrect: "Incorrect.",
        gami_got_it: "Awesome, Got It!",
        gami_lvl: "Lvl"
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
        treatment_tips: "उपचार सुझाव",
        // Crop section
        crop_search_placeholder: "फसल खोजें (जैसे, टमाटर, चावल...)",
        crop_search_desc: "किसी भी फसल की विस्तृत खेती सिफारिशें देखने के लिए खोजें।",
        cat_all: "सभी",
        cat_cereal: "अनाज",
        cat_vegetable: "सब्ज़ी",
        cat_fruit: "फल",
        cat_oilseed: "तिलहन",
        searching_crops: "फसल डेटाबेस खोज रहे हैं...",
        no_crops_found: "आपकी खोज से मेल खाती कोई फसल नहीं मिली। कोई अन्य नाम या श्रेणी आज़माएं।",
        previous: "पिछला",
        next: "अगला",
        scientific_name: "वैज्ञानिक नाम",
        climate_requirement: "जलवायु आवश्यकता",
        soil_type: "मिट्टी का प्रकार",
        total_duration: "कुल अवधि",
        water_requirement: "पानी की आवश्यकता",
        harvesting_period: "कटाई की अवधि",
        ai_insights: "एआई उगाने की जानकारी",
        view_roadmap_btn: "रोडमैप देखें",
        calculate_costs_btn: "लागत गणना करें",
        crop_info_label: "फसल जानकारी",
        cropNames: {
            tomato: "टमाटर", potato: "आलू", onion: "प्याज", carrot: "गाजर",
            cabbage: "पत्तागोभी", spinach: "पालक", brinjal: "बैंगन",
            cauliflower: "फूलगोभी", okra: "भिंडी", capsicum: "शिमला मिर्च",
            mango: "आम", banana: "केला", apple: "सेब", papaya: "पपीता",
            guava: "अमरूद", orange: "संतरा", grapes: "अंगूर", pomegranate: "अनार",
            watermelon: "तरबूज", pineapple: "अनानास",
            rice: "चावल", wheat: "गेहूं", maize: "मक्का", barley: "जौ", oats: "जई",
            mustard: "सरसों", soybean: "सोयाबीन", sunflower: "सूरजमुखी", groundnut: "मूंगफली"
        },
        categoryNames: {
            vegetable: "सब्ज़ी", fruit: "फल", cereal: "अनाज", oilseed: "तिलहन"
        },
        // Schemes
        schemes_title: "सरकारी योजना मिलान",
        schemes_subtitle: "पता करें कि आप किन सरकारी योजनाओं और सब्सिडी के पात्र हैं",
        schemes_step1_title: "खेत का आकार",
        schemes_step1_label: "आप कितनी भूमि पर खेती करते हैं?",
        schemes_step1_placeholder: "एकड़ में जमीन का आकार दर्ज करें",
        schemes_step2_title: "आपका राज्य",
        schemes_step2_label: "अपना राज्य चुनें",
        schemes_step2_placeholder: "-- राज्य चुनें --",
        schemes_step3_title: "मुख्य फसल",
        schemes_step3_label: "आपकी मुख्य फसल क्या है?",
        schemes_step3_placeholder: "जैसे, चावल, गेहूं, टमाटर...",
        schemes_prev: "पिछला",
        schemes_next: "अगला",
        schemes_find: "योजनाएं खोजें",
        schemes_finding: "योजनाएं खोजी जा रही हैं...",
        schemes_back: "फिर से खोजें",
        schemes_eligible: "पात्र योजनाएं",
        schemes_matched: "योजनाएं मिलीं",
        schemes_empty_title: "कोई योजना नहीं मिली",
        schemes_empty_msg: "आपकी प्रोफाइल से मेल खाती कोई योजना नहीं मिली। बाद में दोबारा देखें या जानकारी बदलें।",
        schemes_try_again: "फिर से कोशिश करें",
        schemes_eligibility: "पात्रता",
        schemes_benefits: "लाभ / मुनाफा",
        schemes_apply: "अभी आवेदन करें",
        schemes_any_size: "कोई भी आकार",
        schemes_all_states: "सभी राज्य",
        schemes_all_crops: "सभी फसलें",
        schemes_central: "केंद्रीय",
        schemes_state: "राज्य",
        schemes_centralstate: "केंद्र/राज्य",
        marketplace_title: "बाज़ार",
        marketplace_label: "खरीदें और बेचें",
        marketplace_status: "खुला है",
        schemes_title_short: "सरकारी योजनाएं",
        schemes_check_eligibility: "पात्रता जांचें",
        schemes_matchmaker: "मैचमेकर",
        premium_marketplace: "एआई-संचालित बाज़ार",
        premium_trade: "सीधे खरीদার से व्यापार",
        premium_commission: "जीरो कमीशन बिक्री",
        premium_leaf_scanner: "पत्ती रोग स्कैनर",
        premium_roadmap: "खेती गतिविधि रोडमैপ",
        premium_weather: "उन्नत मौसम अलर्ट",
        premium_revenue: "राजस्व भविष्यवाणी",
        premium_support: "प्राथमिकता सहायता",
        premium_ad_free: "विज्ञापन-मुक्त अनुभव",
        premium_plan_title: "अपनी खेती योजना चुनें",
        premium_plan_subtitle: "अपनी उपज बढ़ाने के लिए उन्नत टूल्स अनलॉक करें",
        premium_free_month: "सभी नए उपयोगकर्ताओं के लिए पहला महीना मुफ़्त है!",
        free_version: "मुफ्त संस्करण",
        free_dashboard: "मूल डैशबोर्ड",
        free_weather: "मौसम ओपडेट",
        free_calculator: "लागत कैलकुलेटर",
        free_marketplace: "बाज़ार ब्राउज़ करें",
        free_roadmap: "विस्तृत गतिविधि रोडमैप",
        free_support: "विशेषज्ञ सहायता",
        schemes_loading_msg_1: "हमारे अन्नदाता की मदद कर रहे हैं... आपकी समृद्धि के लिए बेहतरीन सरकारी योजनाएं खोज रहे हैं।",
        schemes_loading_msg_2: "सूचना के बीज बो रहे हैं... आपके खेत के लिए नवीनतम अपडेट प्राप्त कर रहे हैं।",
        // Redesigned Dashboard HI Keys
        hero_title: "आपका एआई साथ",
        hero_accent: "स्मार्ट खेती के लिए",
        hero_sub: "स्वागत है, <strong><span id=\"welcomeName\">किसान</span></strong>! वास्तविक समय की जानकारी, आवाज-आधारित सहायता और सीधे बाजार पहुंच के साथ भारतीय कृषि को सशक्त बनाना।",
        hero_get_started: "शुरू करें",
        hero_explore: "इकोसिस्टम देखें",
        float_weather_label: "मौसम अलर्ट",
        float_activity_label: "अगली गतिविधि",
        float_activity_value: "फसल चुनें",
        float_roadmap_status: "रोडमैप देखें",
        ecosystem_tag: "इकोसिस्टम",
        ecosystem_title: "भविष्य की खेती",
        kb_title: "कृषिबॉट: वॉयस फर्स्ट एआई",
        kb_desc: "अपने खेत से बात करें। सिंचाई, कीट नियंत्रण और बाजार के रुझानों पर अपनी स्थानीय भाषा में सलाह लें।",
        kb_cta: "अभी बात करें",
        ls_title: "पत्ती स्कैनर",
        ls_desc: "एक ही फोटो से त्वरित जेमिनाई-संचालित फसल रोग निदान।",
        ls_cta: "स्वैन शुरू करें",
        sm_title: "स्मार्ट मार्केट",
        sm_desc: "सीधे शहरी समूहों को बेचें। बिचौलियों को खत्म करें।",
        sm_cta: "मार्केट खोलें",
        ha_title: "हाइपरलोकल एनालिटिक्स",
        ha_desc: "आपके विशिष्ट स्थान के लिए मिट्टी की नमी, पोषक तत्व स्तर और सटीक मौसम पूर्वानुमान।",
        ha_input_label: "इनपुट लागत",
        ha_revenue_label: "राजस्व",
        gs_title: "सरकारी योजनाएं",
        gs_desc: "पीएम-किसान, पीएमएफबीवाई और राज्य-विशिष्ट सब्सिडी के लिए पात्रता जांचें।",
        gs_cta: "मैचमेकर",
        impact_title: "मिट्टी से आत्मा तक।",
        impact_desc: "हम सिर्फ डेटा प्रदान नहीं करते हैं; हम मेहनती किसान और जागरूक उपभोक्ता के बीच एक सेतु प्रदान करते हैं।",
        impact_stat1_title: "स्थिरता पहले",
        impact_stat1_desc: "एआई सटीकता के माध्यम से उर्वरक कचरे को 30% कम करना",
        impact_stat2_title: "उचित मूल्य",
        impact_stat2_desc: "सीधे वितरण सुनिश्चित करता है कि किसानों को खुदरा मूल्य का 85% मिले",
        // Marketplace & Header HI
        header_premium: "प्रीमियम",
        header_logout: "लॉगआउट",
        mk_browse: "बाज़ार देखें",
        mk_sell: "उपज बेचें",
        mk_role_buyer: "खरीददार",
        mk_role_farmer: "किसान",
        mk_switch_role: "भूमिका बदलें",
        mk_search_placeholder: "फसलें, किसान या क्षेत्र खोजें...",
        mk_add_listing: "नई लिस्टिंग जोड़ें",
        mk_product_name: "उत्पाद का नाम",
        mk_crop_placeholder: "फसल चुनें या टाइप करें...",
        mk_category: "श्रेणी",
        mk_price: "कीमत (रुपये)",
        mk_unit: "इकाई",
        mk_quantity: "मात्रा",
        mk_state: "राज्य",
        mk_district: "जिला",
        mk_locality: "इलाका",
        mk_submit_listing: "उत्पाद सूचीबद्ध करें",
        mk_cat_veg: "सब्जियां",
        mk_cat_fruit: "फल",
        mk_cat_grain: "अनाज और दालें",
        mk_cat_seed: "बीज और उर्वरक",
        mk_cat_machinery: "मशीनरी",
        unit_kg: "प्रति किलो",
        unit_quintal: "प्रति क्विंटल",
        unit_piece: "प्रति नग",
        unit_ton: "प्रति टन",

        // Gamification
        gami_xp: "अनुभव",
        gami_take_quiz: "दैनिक प्रश्नोत्तरी लें",
        gami_correct: "सही!",
        gami_incorrect: "गलत।",
        gami_got_it: "बहुत बढ़िया, समझ गया!",
        gami_lvl: "स्तर"
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
        treatment_tips: "চিকিৎসা টিপস",
        // Crop section
        crop_search_placeholder: "ফসল খুঁজুন (যেমন, টমেটো, ধান...)",
        crop_search_desc: "যেকোনো ফসলের বিস্তারিত কৃষি সুপারিশ দেখতে অনুসন্ধান করুন।",
        cat_all: "সব",
        cat_cereal: "শস্য",
        cat_vegetable: "সবজি",
        cat_fruit: "ফল",
        cat_oilseed: "তৈলবীজ",
        searching_crops: "ফসল ডাটাবেস খোঁজা হচ্ছে...",
        no_crops_found: "আপনার অনুসন্ধানের সাথে কোনো ফসল পাওয়া যায়নি। অন্য নাম বা শ্রেণী চেষ্টা করুন।",
        previous: "পূর্ববর্তী",
        next: "পরবর্তী",
        scientific_name: "বৈজ্ঞানিক নাম",
        climate_requirement: "জলবায়ু প্রয়োজনীয়তা",
        soil_type: "মাটির ধরন",
        total_duration: "মোট সময়কাল",
        water_requirement: "পানির প্রয়োজনীয়তা",
        harvesting_period: "ফসল কাটার সময়কাল",
        ai_insights: "এআই চাষের অন্তর্দৃষ্টি",
        view_roadmap_btn: "রোডম্যাপ দেখুন",
        calculate_costs_btn: "খরচ হিসাব করুন",
        crop_info_label: "ফসল তথ্য",
        cropNames: {
            tomato: "টমেটো", potato: "আলু", onion: "পেঁয়াজ", carrot: "গাজর",
            cabbage: "বাঁধাকপি", spinach: "পালং শাক", brinjal: "বেগুন",
            cauliflower: "ফুলকপি", okra: "ঢেঁড়স", capsicum: "ক্যাপসিকাম",
            mango: "আম", banana: "কলা", apple: "আপেল", papaya: "পেঁপে",
            guava: "পেয়ারা", orange: "কমলা", grapes: "আঙুর", pomegranate: "ডালিম",
            watermelon: "তরমুজ", pineapple: "আনারস",
            rice: "ধান", wheat: "গম", maize: "ভুট্টা", barley: "যব", oats: "ওটস",
            mustard: "সরিষা", soybean: "সয়াবিন", sunflower: "সূর্যমুখী", groundnut: "চিনাবাদাম"
        },
        categoryNames: {
            vegetable: "সবজি", fruit: "ফল", cereal: "শস্য", oilseed: "তৈলবীজ"
        },
        // Schemes
        schemes_title: "সরকারি প্রকল্প খোঁজক",
        schemes_subtitle: "আপনি কোন সরকারি প্রকল্প ও ভর্তুকির যোগ্য তা খুঁজে বের করুন",
        schemes_step1_title: "জমির আকার",
        schemes_step1_label: "আপনি কত জমিতে চাষ করেন?",
        schemes_step1_placeholder: "একরে জমির আকার দিন",
        schemes_step2_title: "আপনার রাজ্য",
        schemes_step2_label: "আপনার রাজ্য নির্বাচন করুন",
        schemes_step2_placeholder: "-- রাজ্য নির্বাচন করুন --",
        schemes_step3_title: "প্রধান ফসল",
        schemes_step3_label: "আপনার প্রধান ফসল কী?",
        schemes_step3_placeholder: "যেমন ধান, গম, টমেটো...",
        schemes_prev: "পূর্ববর্তী",
        schemes_next: "পরবর্তী",
        schemes_find: "আমার প্রকল্প খুঁজুন",
        schemes_finding: "প্রকল্প খোঁজা হচ্ছে...",
        schemes_back: "আবার খুঁজুন",
        schemes_eligible: "যোগ্য প্রকল্পসমূহ",
        schemes_matched: "প্রকল্প পাওয়া গেছে",
        schemes_empty_title: "কোনো প্রকল্প পাওয়া যায়নি",
        schemes_empty_msg: "আপনার প্রোফাইলের সাথে মেলে এমন কোনো প্রকল্প পাওয়া যায়নি। পরে আবার চেষ্টা করুন।",
        schemes_try_again: "আবার চেষ্টা করুন",
        schemes_eligibility: "যোগ্যতা",
        schemes_benefits: "সুবিধা / লাভ",
        schemes_apply: "এখনই আবেদন করুন",
        schemes_any_size: "যেকোনো আকার",
        schemes_all_states: "সব রাজ্য",
        schemes_all_crops: "সব ফসল",
        schemes_central: "কেন্দ্রীয়",
        schemes_state: "রাজ্য",
        schemes_centralstate: "কেন্দ্র/রাজ্য",
        marketplace_title: "মার্কেটপ্লেস",
        marketplace_label: "কেনা ও বেচা",
        marketplace_status: "খোলা আছে",
        schemes_title_short: "সরকারি প্রকল্প",
        schemes_check_eligibility: "যোগ্যতা যাচাই করুন",
        schemes_matchmaker: "ম্যাচমেকার",
        premium_marketplace: "এআই-চালিত মার্কেটপ্লেস",
        premium_trade: "সরাসরি ক্রেতার সাথে বাণিজ্য",
        premium_commission: "শূন্য কমিশন বিক্রয়",
        premium_leaf_scanner: "পাতার রোগ স্ক্যানার",
        premium_roadmap: "কৃষি কার্যক্রম রোডম্যাপ",
        premium_weather: "উন্নত আবহাওয়া সতর্কতা",
        premium_revenue: "আয় পূর্বাভাস",
        premium_support: "অগ্রাধিকার সহায়তা",
        premium_ad_free: "বিজ্ঞাপন-মুক্ত অভিজ্ঞতা",
        premium_plan_title: "আপনার কৃষি পরিকল্পনা নির্বাচন করুন",
        premium_plan_subtitle: "আপনার ফলন বাড়াতে উন্নত সরঞ্জাম আনলক করুন",
        premium_free_month: "নতুন ব্যবহারকারীদের জন্য প্রথম মাস সম্পূর্ণ বিনামূল্যে!",
        free_version: "ফ্রি ভার্সন",
        free_dashboard: "বেসিক ড্যাশবোর্ড",
        free_weather: "আবহাওয়া আপডেট",
        free_calculator: "খরচ ক্যালকুলেটর",
        free_marketplace: "মার্কেটপ্লেস ব্রাউজ",
        free_roadmap: "বিস্তারিত টিপস ও কার্যক্রম",
        free_support: "বিশেষজ্ঞ সহায়তা",
        schemes_loading_msg_1: "মাটির সেবায় আমরা পাশে আছি... আপনার জন্য সেরা সরকারি যোজনাগুলি খোঁজা হচ্ছে।",
        schemes_loading_msg_2: "আপনার খামারের উন্নতির লক্ষে সঠিক তথ্যের সন্ধান চলছে... একটু অপেক্ষা করুন।",
        // Redesigned Dashboard BN Keys
        hero_title: "আপনার স্মার্ট চাষের",
        hero_accent: "এআই সঙ্গী",
        hero_sub: "স্বাগতম, <strong><span id=\"welcomeName\">কৃষক</span></strong>! রিয়েল-টাইম ইন্টেলিজেন্স, ভয়েস-ফার্স্ট সহায়তা এবং সরাসরি বাজারে প্রবেশের মাধ্যমে ভারতীয় কৃষিকে শক্তিশালী করছে।",
        hero_get_started: "শুরু করুন",
        hero_explore: "ইকোসিস্টেম দেখুন",
        float_weather_label: "আবহাওয়ার সতর্কবার্তা",
        float_activity_label: "পরবর্তী কাজ",
        float_activity_value: "ফসল নির্বাচন করুন",
        float_roadmap_status: "রোডম্যাপ দেখুন",
        ecosystem_tag: "ইকোসিস্টেম",
        ecosystem_title: "ভবিষ্যতের চাষাবাদ",
        kb_title: "কৃষিবট: ভয়েস ফার্স্ট এআই",
        kb_desc: "আপনার খামারের সাথে কথা বলুন। সেচ, কীটপতঙ্গ নিয়ন্ত্রণ এবং বাজারের প্রবণতা সম্পর্কে আপনার স্থানীয় ভাষায় পরামর্শ নিন।",
        kb_cta: "এখনই কথা বলুন",
        ls_title: "পাতা স্ক্যানার",
        ls_desc: "একটি ছবি থেকেই দ্রুত জেমিনাই-চালিত ফসলের রোগ নির্ণয়।",
        ls_cta: "স্ক্যান শুরু করুন",
        sm_title: "স্মার্ট মার্কেট",
        sm_desc: "সরাসরি শহুরে গ্রাহকদের কাছে বিক্রি করুন। মধ্যস্বত্বভোগী সরান।",
        sm_cta: "মার্কেট খুলুন",
        ha_title: "হাইপারলোকাল অ্যানালিটিক্স",
        ha_desc: "আপনার অবস্থানের জন্য মাটির আর্দ্রতা, পুষ্টির মাত্রা এবং সঠিক আবহাওয়ার পূর্বাভাস।",
        ha_input_label: "ইনপুট খরচ",
        ha_revenue_label: "আয়",
        gs_title: "সরকারি প্রকল্প",
        gs_desc: "পিএম-কিষাণ, পিএমএফবিওয়াই এবং রাজ্য-নির্দিষ্ট ভর্তুকির যোগ্যতা যাচাই করুন।",
        gs_cta: "ম্যাচমেকার",
        impact_title: "মাটি থেকে মন পর্যন্ত।",
        impact_desc: "আমরা শুধু তথ্য দিই না; আমরা পরিশ্রমী কৃষক এবং সচেতন ভোক্তার মধ্যে একটি সেতু তৈরি করি।",
        impact_stat1_title: "স্থায়ীত্ব সবার আগে",
        impact_stat1_desc: "এআই এর মাধ্যমে সারের অপচয় ৩০% কমানো",
        impact_stat2_title: "ন্যায্য মূল্য",
        impact_stat2_desc: "সরাসরি বিক্রয় নিশ্চিত করে যে কৃষকরা খুচরা মূল্যের ৮৫% পান",
        // Marketplace & Header BN
        header_premium: "প্রিমিয়াম",
        header_logout: "লগআউট",
        mk_browse: "মার্কেটপ্লেস দেখুন",
        mk_sell: "ফসল বিক্রি করুন",
        mk_role_buyer: "ক্রেতা",
        mk_role_farmer: "কৃষক",
        mk_switch_role: "ভূমিকা পরিবর্তন",
        mk_search_placeholder: "ফসল, কৃষক বা অঞ্চল খুঁজুন...",
        mk_add_listing: "নতুন তালিকা যোগ করুন",
        mk_product_name: "পণ্যের নাম",
        mk_crop_placeholder: "ফসল টাইপ বা নির্বাচন করুন...",
        mk_category: "বিভাগ",
        mk_price: "মূল্য (টাকা)",
        mk_unit: "একক",
        mk_quantity: "পরিমাণ",
        mk_state: "রাজ্য",
        mk_district: "জেলা",
        mk_locality: "এলাকা",
        mk_submit_listing: "পণ্য তালিকাভুক্ত করুন",
        mk_cat_veg: "শাকসবজি",
        mk_cat_fruit: "ফলমূল",
        mk_cat_grain: "শস্য ও ডাল",
        mk_cat_seed: "বীজ ও সার",
        mk_cat_machinery: "যন্ত্রপাতি",
        unit_kg: "প্রতি কেজি",
        unit_quintal: "প্রতি কুইন্টাল",
        unit_piece: "প্রতি পিস",
        unit_ton: "প্রতি টন",

        // Gamification
        gami_xp: "অভিজ্ঞতা",
        gami_take_quiz: "দৈনিক কুইজ খেলুন",
        gami_correct: "সঠিক!",
        gami_incorrect: "ভুল।",
        gami_got_it: "চমৎকার, বুঝতে পেরেছি!",
        gami_lvl: "স্তর"
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

function closeLanguageModal() {
    const modal = document.getElementById('languageModal');
    if (modal) {
        modal.classList.remove('active');
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
    
    // Update Subscription Modal
    const subTitle = document.querySelector('.subscription-header h2');
    if (subTitle) subTitle.textContent = t.premium_plan_title;
    const subSub = document.querySelector('.subscription-header p');
    if (subSub) subSub.textContent = t.premium_plan_subtitle;
    const highlightNote = document.querySelector('.highlight-note');
    if (highlightNote) highlightNote.innerHTML = `<i class="fas fa-gift"></i> ${t.premium_free_month}`;
    
    // Update stat cards
    updateStatCard(0, t.weather_status);
    updateStatCard(1, t.leaf_scanner, t.scan_now, t.detect_disease);
    updateStatCard(2, t.next_activity, null, t.view_roadmap);
    updateStatCard(3, t.input_cost, null, t.calculate);
    updateStatCard(4, t.revenue, null, t.view_details);
    updateStatCard(5, t.marketplace_title, t.marketplace_label, t.marketplace_status);
    updateStatCard(6, t.schemes_title_short, t.schemes_check_eligibility, t.schemes_matchmaker);
    
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

    // Update Free Version Card
    const freeHeader = document.querySelector('.pricing-card.free h3');
    if (freeHeader) freeHeader.textContent = t.free_version;
    updateElementHTML('freeDashboard', `<i class="fas fa-check"></i> ${t.free_dashboard}`);
    updateElementHTML('freeWeather', `<i class="fas fa-check"></i> ${t.free_weather}`);
    updateElementHTML('freeCalculator', `<i class="fas fa-check"></i> ${t.free_calculator}`);
    updateElementHTML('freeMarketplace', `<i class="fas fa-check"></i> ${t.free_marketplace}`);
    updateElementHTML('lockedLeafScanner', `<i class="fas fa-times"></i> ${t.premium_leaf_scanner}`);
    updateElementHTML('lockedRoadmap', `<i class="fas fa-times"></i> ${t.free_roadmap}`);
    updateElementHTML('lockedSupport', `<i class="fas fa-times"></i> ${t.free_support}`);

    // Update Premium Features List
    updateElementHTML('premiumLeafScanner', `<i class="fas fa-check-circle"></i> <strong>${t.premium_leaf_scanner}</strong>`);
    updateElementHTML('premiumRoadmap', `<i class="fas fa-check-circle"></i> <strong>${t.premium_roadmap}</strong>`);
    updateElementHTML('premiumMarketplace', `<i class="fas fa-check-circle"></i> <strong>${t.premium_marketplace}</strong>`);
    updateElementHTML('premiumTrade', `<i class="fas fa-check"></i> ${t.premium_trade}`);
    updateElementHTML('premiumCommission', `<i class="fas fa-check"></i> ${t.premium_commission}`);
    updateElementHTML('premiumWeather', `<i class="fas fa-check"></i> ${t.premium_weather}`);
    updateElementHTML('premiumRevenue', `<i class="fas fa-check"></i> ${t.premium_revenue}`);
    updateElementHTML('premiumSupport', `<i class="fas fa-check"></i> ${t.premium_support}`);
    updateElementHTML('premiumAdFree', `<i class="fas fa-check"></i> ${t.premium_ad_free}`);
    
    // Update tips
    updateTips(t);
    
    // Update Crop Section
    updateCropSection(t);
    
    // Update Schemes Section
    updateSchemesSection(t);
    
    // Update New Dashboard Redesign Section
    updateDashboardSection(t);
    
    // Update Marketplace Section
    updateMarketplaceSection(t);

    // Update Header Components
    updateElementHTML('headerPremiumLabel', t.header_premium);
    updateElementHTML('headerLogoutLabel', t.header_logout);
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

function updateStatCard(index, title, valueText, status) {
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards[index]) {
        const h3 = statCards[index].querySelector('h3');
        if (h3 && title) h3.textContent = title;
        
        if (valueText) {
            const valueEl = statCards[index].querySelector('.value');
            if (valueEl) valueEl.textContent = valueText;
        }
        
        if (status) {
            const statusEl = statCards[index].querySelector('.status');
            if (statusEl) statusEl.textContent = status;
        }
    }
}

function updateElementHTML(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
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
// UPDATE CROP SECTION WITH TRANSLATIONS
// ============================================
function updateCropSection(t) {
    // Update category filter buttons
    const catMap = { all: t.cat_all, cereal: t.cat_cereal, vegetable: t.cat_vegetable, fruit: t.cat_fruit, oilseed: t.cat_oilseed };
    document.querySelectorAll('.category-filters .filter-btn').forEach(btn => {
        const cat = btn.getAttribute('data-category');
        if (cat && catMap[cat]) btn.textContent = catMap[cat];
    });

    // Update search placeholder
    const searchInput = document.getElementById('cropSearchInput');
    if (searchInput) searchInput.placeholder = t.crop_search_placeholder;

    // Update crop section description
    const cropDesc = document.querySelector('#crops .card > p');
    if (cropDesc) cropDesc.textContent = t.crop_search_desc;

    // Update loading text
    const cropLoading = document.querySelector('#cropLoading p');
    if (cropLoading) cropLoading.textContent = t.searching_crops;

    // Update empty state text
    const cropEmpty = document.querySelector('#cropEmptyState .empty-state p');
    if (cropEmpty) cropEmpty.textContent = t.no_crops_found;

    // Update pagination buttons
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');
    if (prevBtn) prevBtn.textContent = t.previous;
    if (nextBtn) nextBtn.textContent = t.next;

    // Update crop info detail labels (index-based since order is fixed)
    const infoItems = document.querySelectorAll('#cropInfo .info-item h4');
    const labelOrder = [t.scientific_name, t.climate_requirement, t.soil_type, t.total_duration, t.water_requirement, t.harvesting_period];
    infoItems.forEach((h4, idx) => {
        if (labelOrder[idx]) h4.textContent = labelOrder[idx];
    });

    // Update AI insights label
    const aiLabel = document.querySelector('#cropAIInsights > div:first-child');
    if (aiLabel) aiLabel.innerHTML = `<i class="fas fa-robot"></i> ${t.ai_insights}`;

    // Update View Roadmap and Calculate Costs buttons in crop info
    const cropBtns = document.querySelectorAll('#cropInfo .mt-lg button');
    if (cropBtns[0]) cropBtns[0].innerHTML = `<i class="fas fa-road"></i> ${t.view_roadmap_btn}`;
    if (cropBtns[1]) cropBtns[1].innerHTML = `<i class="fas fa-calculator"></i> ${t.calculate_costs_btn}`;

    // Re-render crop cards with translated names
    if (typeof fetchCrops === 'function') {
        fetchCrops();
    }
}

// ============================================
// UPDATE SCHEMES SECTION WITH TRANSLATIONS
// ============================================
function updateSchemesSection(t) {
    if (!t.schemes_title) return; // keys not loaded yet

    // Header
    const schTitle = document.getElementById('schemesPageTitle');
    if (schTitle) schTitle.textContent = t.schemes_title;
    const schSub = document.getElementById('schemesPageSubtitle');
    if (schSub) schSub.textContent = t.schemes_subtitle;

    // Step labels
    const st1Label = document.getElementById('schemesStep1Label');
    if (st1Label) st1Label.textContent = t.schemes_step1_label;
    const st1Input = document.getElementById('schemeLandSize');
    if (st1Input) st1Input.placeholder = t.schemes_step1_placeholder;

    const st2Label = document.getElementById('schemesStep2Label');
    if (st2Label) st2Label.textContent = t.schemes_step2_label;
    const st2Opt = document.getElementById('schemesStateDefaultOpt');
    if (st2Opt) st2Opt.textContent = t.schemes_step2_placeholder;

    const st3Label = document.getElementById('schemesStep3Label');
    if (st3Label) st3Label.textContent = t.schemes_step3_label;
    const st3Input = document.getElementById('schemeCropSelect');
    if (st3Input) st3Input.placeholder = t.schemes_step3_placeholder;

    // Nav buttons
    const prevBtns = document.querySelectorAll('.schemes-prev-btn');
    prevBtns.forEach(b => b.textContent = t.schemes_prev);
    const nextBtns = document.querySelectorAll('.schemes-next-btn');
    nextBtns.forEach(b => { b.innerHTML = `${t.schemes_next} <i class="fas fa-arrow-right"></i>`; });
    const findBtn = document.getElementById('schemesSubmitBtn');
    if (findBtn) findBtn.innerHTML = `<i class="fas fa-search"></i> ${t.schemes_find}`;

    // Results header
    const eligibleTitle = document.getElementById('schemesEligibleTitle');
    if (eligibleTitle) eligibleTitle.textContent = t.schemes_eligible;
    const backBtn = document.getElementById('schemesBackBtn');
    if (backBtn) backBtn.innerHTML = `<i class="fas fa-arrow-left"></i> ${t.schemes_back}`;

    // Re-render matched schemes with new language (if results are visible)
    const resultsEl = document.getElementById('schemesResults');
    if (resultsEl && resultsEl.classList.contains('active')) {
        if (typeof matchSchemes === 'function') matchSchemes();
    }
}

// ============================================
// UPDATE NEW DASHBOARD REDESIGN SECTION
// ============================================
function updateDashboardSection(t) {
    if (!t.hero_title) return;

    // Hero Section
    updateElementHTML('dashHeroTitle', t.hero_title);
    updateElementHTML('dashHeroAccent', t.hero_accent);
    
    // For hero_sub, we need to be careful not to overwrite the name if it's already set
    const heroSub = document.getElementById('dashHeroSub');
    if (heroSub) {
        const currentName = document.getElementById('welcomeName')?.textContent || 'Farmer';
        heroSub.innerHTML = t.hero_sub;
        const newWelcomeName = document.getElementById('welcomeName');
        if (newWelcomeName) newWelcomeName.textContent = currentName;
    }
    
    updateButtonTextByID('dashHeroBtnStart', t.hero_get_started, 'fa-seedling');
    updateButtonTextByID('dashHeroBtnExplore', t.hero_explore, 'fa-leaf');

    // Floating Cards
    updateElementHTML('dashFloatWeatherLabel', t.float_weather_label);
    updateElementHTML('dashFloatActivityLabel', t.float_activity_label);
    const activityStatus = document.getElementById('dashNextActivityStatus');
    if (activityStatus) activityStatus.textContent = t.float_roadmap_status;

    // Section Header
    updateElementHTML('dashEcosystemTag', t.ecosystem_tag);
    updateElementHTML('dashEcosystemTitle', t.ecosystem_title);

    // Feature Grid
    updateElementHTML('dashKbTitle', t.kb_title);
    updateElementHTML('dashKbDesc', t.kb_desc);
    updateElementHTML('dashKbCtaLabel', ` ${t.kb_cta}`);

    updateElementHTML('dashLsTitle', t.ls_title);
    updateElementHTML('dashLsDesc', t.ls_desc);
    updateElementHTML('dashLsCtaLabel', t.ls_cta);

    updateElementHTML('dashSmTitle', t.sm_title);
    updateElementHTML('dashSmDesc', t.sm_desc);
    updateElementHTML('dashSmCtaLabel', t.sm_cta);

    updateElementHTML('dashHaTitle', t.ha_title);
    updateElementHTML('dashHaDesc', t.ha_desc);
    updateElementHTML('dashHaInputLabel', t.ha_input_label);
    updateElementHTML('dashHaRevenueLabel', t.ha_revenue_label);

    updateElementHTML('dashGsTitle', t.gs_title);
    updateElementHTML('dashGsDesc', t.gs_desc);
    updateElementHTML('dashGsCtaLabel', t.gs_cta);

    // Impact Section
    updateElementHTML('dashImpactTitle', t.impact_title);
    updateElementHTML('dashImpactDesc', t.impact_desc);
    updateElementHTML('dashImpactStat1Title', t.impact_stat1_title);
    updateElementHTML('dashImpactStat1Desc', t.impact_stat1_desc);
    updateElementHTML('dashImpactStat2Title', t.impact_stat2_title);
    updateElementHTML('dashImpactStat2Desc', t.impact_stat2_desc);

    // Gamification Section
    updateElementHTML('gami-xp-label', t.gami_xp);
    const gamiBtn = document.getElementById('gami-daily-btn');
    if(gamiBtn) gamiBtn.textContent = t.gami_take_quiz;
    const gamiBtnLvl = document.getElementById('gami-level');
    if(gamiBtnLvl) gamiBtnLvl.innerHTML = `<i class="fas fa-medal"></i> ${t.gami_lvl} ${window.bfGamification ? window.bfGamification.state.level : 1}`;
}

function updateButtonTextByID(id, text, iconClass) {
    const btn = document.getElementById(id);
    if (btn) {
        if (iconClass) {
            btn.innerHTML = `<i class="fas ${iconClass}"></i> ${text}`;
        } else {
            btn.textContent = text;
        }
    }
}

// ============================================
// UPDATE MARKETPLACE SECTION
// ============================================
function updateMarketplaceSection(t) {
    if (!t.mk_browse) return;

    // Marketplace Header/Tabs
    updateElementHTML('mkTabBrowseLabel', t.mk_browse);
    updateElementHTML('mkTabSellLabel', t.mk_sell);
    updateElementHTML('mkSwitchRoleLabel', t.mk_switch_role);
    
    const mkRoleLabel = document.getElementById('mkRoleLabel');
    if (mkRoleLabel) {
        if (mkRoleLabel.textContent === 'Buyer') mkRoleLabel.textContent = t.mk_role_buyer;
        else if (mkRoleLabel.textContent === 'Farmer') mkRoleLabel.textContent = t.mk_role_farmer;
    }

    // Search
    const mkSearch = document.getElementById('marketplaceSearch');
    if (mkSearch) mkSearch.placeholder = t.mk_search_placeholder;

    // Add Listing Form
    updateElementHTML('mkAddListingTitle', t.mk_add_listing);
    updateElementHTML('mkLabelProductName', t.mk_product_name);
    const prodInput = document.getElementById('sellProductName');
    if (prodInput) prodInput.placeholder = t.mk_crop_placeholder;

    updateElementHTML('mkLabelCategory', t.mk_category);
    updateElementHTML('optVeg', t.mk_cat_veg);
    updateElementHTML('optFruits', t.mk_cat_fruit);
    updateElementHTML('optGrains', t.mk_cat_grain);
    updateElementHTML('optSeeds', t.mk_cat_seed);
    updateElementHTML('optMachinery', t.mk_cat_machinery);

    updateElementHTML('mkLabelPrice', t.mk_price);
    updateElementHTML('mkLabelUnit', t.mk_unit);
    updateElementHTML('unitKg', t.unit_kg);
    updateElementHTML('unitQuintal', t.unit_quintal);
    updateElementHTML('unitPiece', t.unit_piece);
    updateElementHTML('unitTon', t.unit_ton);

    updateElementHTML('mkLabelQuantity', t.mk_quantity);
    updateElementHTML('mkLabelState', t.mk_state);
    updateElementHTML('mkLabelDistrict', t.mk_district);
    updateElementHTML('mkLabelLocality', t.mk_locality);
    updateElementHTML('mkSubmitBtn', t.mk_submit_listing);
}

// ============================================
// MAKE FUNCTIONS GLOBALLY ACCESSIBLE
// ============================================
window.selectLanguage = selectLanguage;
window.showLanguageModal = showLanguageModal;
window.closeLanguageModal = closeLanguageModal;
window.updateLanguage = updateLanguage;
window.updateSchemesSection = updateSchemesSection;
window.currentLanguage = currentLanguage;
window.translations = translations;
