// ============================================
// DATA: DISEASE DATABASE & CROP DATA
// ============================================

// Disease Database
const diseaseDatabase = {
    healthy: {
        name: 'Healthy Plant',
        description: 'Your plant appears healthy with no visible signs of disease.',
        fertilizers: [
            'NPK 19-19-19 for balanced nutrition',
            'Organic compost for soil health',
            'Micronutrient mix for optimal growth'
        ],
        treatments: [
            'Continue regular watering schedule',
            'Monitor for any changes',
            'Maintain proper sunlight exposure'
        ]
    },
    leaf_blight: {
        name: 'Leaf Blight',
        description: 'Fungal infection causing brown/yellow spots and leaf death.',
        fertilizers: [
            'Potash (MOP) - strengthens plant immunity',
            'Calcium-based fertilizer',
            'Reduce nitrogen temporarily'
        ],
        treatments: [
            'Apply Mancozeb fungicide (2g/L water)',
            'Remove infected leaves immediately',
            'Improve air circulation',
            'Avoid overhead watering'
        ]
    },
    powdery_mildew: {
        name: 'Powdery Mildew',
        description: 'White powdery coating on leaves caused by fungus.',
        fertilizers: [
            'Sulphur-based fertilizer',
            'Potassium-rich fertilizer',
            'Avoid excess nitrogen'
        ],
        treatments: [
            'Spray neem oil solution (5ml/L)',
            'Apply sulphur dust',
            'Increase plant spacing',
            'Water at soil level only'
        ]
    },
    bacterial_spot: {
        name: 'Bacterial Leaf Spot',
        description: 'Dark water-soaked spots caused by bacteria.',
        fertilizers: [
            'Copper-based fertilizer',
            'Balanced NPK with extra potassium',
            'Avoid high nitrogen'
        ],
        treatments: [
            'Apply copper hydroxide spray',
            'Remove severely infected plants',
            'Disinfect tools after use',
            'Rotate crops next season'
        ]
    },
    nutrient_deficiency: {
        name: 'Nutrient Deficiency',
        description: 'Yellowing or discoloration due to lack of nutrients.',
        fertilizers: [
            'Complete NPK 20-20-20',
            'Micronutrient spray (Zn, Fe, Mn)',
            'Organic manure application'
        ],
        treatments: [
            'Soil testing recommended',
            'Apply foliar spray for quick absorption',
            'Add organic matter to soil',
            'Maintain proper pH (6.0-7.0)'
        ]
    },
    rust: {
        name: 'Rust Disease',
        description: 'Orange-brown pustules on leaf undersides.',
        fertilizers: [
            'High potassium fertilizer',
            'Phosphorus supplement',
            'Reduce nitrogen'
        ],
        treatments: [
            'Apply Propiconazole fungicide',
            'Remove infected debris',
            'Improve drainage',
            'Plant resistant varieties'
        ]
    }
};

// Crop Data
const cropData = {
    rice: {
        name: 'Rice',
        icon: '🌾',
        duration: '120-150 days',
        wateringFrequency: 'Every 3-4 days',
        fertilizers: 'Urea, DAP, Potash',
        fertilizerSchedule: 'Day 15, 35, 55',
        seedRate: 25,
        seedPrice: 45,
        fertilizerRate: 100,
        fertilizerPrice: 30,
        yieldPerAcre: 2000,
        marketPrice: 22,
        roadmap: [
            { day: 1, activity: 'Land Preparation', desc: 'Plough and level field.', type: 'prep' },
            { day: 3, activity: 'Seed Sowing', desc: 'Sow seeds or transplant.', type: 'seed' },
            { day: 5, activity: 'First Watering', desc: 'Maintain 2-3 inches water.', type: 'water' },
            { day: 15, activity: 'Apply Urea', desc: 'First dose Urea.', type: 'fertilizer' },
            { day: 35, activity: 'Apply DAP', desc: 'Phosphorus boost.', type: 'fertilizer' },
            { day: 55, activity: 'Apply Potash', desc: 'Final fertilizer.', type: 'fertilizer' },
            { day: 120, activity: 'Harvest', desc: 'Harvest when 80% golden.', type: 'harvest' }
        ]
    },
    wheat: {
        name: 'Wheat',
        icon: '🌾',
        duration: '100-120 days',
        wateringFrequency: 'Every 20-25 days',
        fertilizers: 'Urea, DAP, MOP',
        fertilizerSchedule: 'Day 21, 45, 70',
        seedRate: 40,
        seedPrice: 35,
        fertilizerRate: 120,
        fertilizerPrice: 28,
        yieldPerAcre: 1800,
        marketPrice: 25,
        roadmap: [
            { day: 1, activity: 'Land Preparation', desc: 'Deep ploughing.', type: 'prep' },
            { day: 2, activity: 'Seed Sowing', desc: 'Sow at 3-5 cm depth.', type: 'seed' },
            { day: 5, activity: 'First Irrigation', desc: 'Light irrigation.', type: 'water' },
            { day: 21, activity: 'Apply Urea', desc: 'First Urea dose.', type: 'fertilizer' },
            { day: 45, activity: 'Apply DAP', desc: 'Tillering stage.', type: 'fertilizer' },
            { day: 70, activity: 'Apply MOP', desc: 'Grain development.', type: 'fertilizer' },
            { day: 115, activity: 'Harvest', desc: 'Harvest when golden.', type: 'harvest' }
        ]
    },
    potato: {
        name: 'Potato',
        icon: '🥔',
        duration: '90-120 days',
        wateringFrequency: 'Every 7-10 days',
        fertilizers: 'NPK Complex, Urea',
        fertilizerSchedule: 'Day 0, 30, 60',
        seedRate: 600,
        seedPrice: 25,
        fertilizerRate: 150,
        fertilizerPrice: 32,
        yieldPerAcre: 8000,
        marketPrice: 15,
        roadmap: [
            { day: 1, activity: 'Land Preparation', desc: 'Deep ploughing, ridges.', type: 'prep' },
            { day: 2, activity: 'Planting', desc: 'Plant tubers 5-7 cm deep.', type: 'seed' },
            { day: 5, activity: 'First Irrigation', desc: 'Light irrigation.', type: 'water' },
            { day: 30, activity: 'Apply Urea', desc: 'Top dressing.', type: 'fertilizer' },
            { day: 60, activity: 'Final Fertilizer', desc: 'Light potash.', type: 'fertilizer' },
            { day: 100, activity: 'Harvest', desc: 'Harvest when dry.', type: 'harvest' }
        ]
    },
    mustard: {
        name: 'Mustard',
        icon: '🌻',
        duration: '110-140 days',
        wateringFrequency: 'Every 25-30 days',
        fertilizers: 'Urea, SSP, Sulphur',
        fertilizerSchedule: 'Day 0, 25, 50',
        seedRate: 2,
        seedPrice: 120,
        fertilizerRate: 80,
        fertilizerPrice: 25,
        yieldPerAcre: 600,
        marketPrice: 55,
        roadmap: [
            { day: 1, activity: 'Land Preparation', desc: 'Fine tilth.', type: 'prep' },
            { day: 2, activity: 'Seed Sowing', desc: 'Line sowing.', type: 'seed' },
            { day: 25, activity: 'Apply Urea', desc: 'Top dressing.', type: 'fertilizer' },
            { day: 50, activity: 'Apply Sulphur', desc: 'Oil content boost.', type: 'fertilizer' },
            { day: 125, activity: 'Harvest', desc: 'When 75% yellow.', type: 'harvest' }
        ]
    },
    vegetables: {
        name: 'Vegetables',
        icon: '🥬',
        duration: '60-90 days',
        wateringFrequency: 'Every 4-5 days',
        fertilizers: 'Vermicompost, NPK, Urea',
        fertilizerSchedule: 'Day 0, 15, 30, 45',
        seedRate: 1.5,
        seedPrice: 800,
        fertilizerRate: 120,
        fertilizerPrice: 35,
        yieldPerAcre: 6000,
        marketPrice: 20,
        roadmap: [
            { day: 1, activity: 'Land Preparation', desc: 'Raised beds.', type: 'prep' },
            { day: 2, activity: 'Sowing/Transplanting', desc: 'Direct or transplant.', type: 'seed' },
            { day: 15, activity: 'First Top Dressing', desc: 'Urea application.', type: 'fertilizer' },
            { day: 30, activity: 'Second Top Dressing', desc: 'NPK for fruiting.', type: 'fertilizer' },
            { day: 60, activity: 'Start Harvest', desc: 'Begin harvesting.', type: 'harvest' }
        ]
    },
    maize: {
        name: 'Maize',
        icon: '🌽',
        duration: '90-120 days',
        wateringFrequency: 'Every 8-10 days',
        fertilizers: 'Urea, DAP, Zinc Sulphate',
        fertilizerSchedule: 'Day 0, 25, 45',
        seedRate: 8,
        seedPrice: 350,
        fertilizerRate: 100,
        fertilizerPrice: 30,
        yieldPerAcre: 2500,
        marketPrice: 18,
        roadmap: [
            { day: 1, activity: 'Land Preparation', desc: 'Deep ploughing.', type: 'prep' },
            { day: 2, activity: 'Seed Sowing', desc: '60x20 cm spacing.', type: 'seed' },
            { day: 25, activity: 'First Urea', desc: '1/3 Urea dose.', type: 'fertilizer' },
            { day: 45, activity: 'Second Urea', desc: 'Remaining Urea.', type: 'fertilizer' },
            { day: 100, activity: 'Harvest', desc: 'When husks brown.', type: 'harvest' }
        ]
    }
};
