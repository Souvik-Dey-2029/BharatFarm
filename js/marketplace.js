// ============================================
// MARKETPLACE LOGIC — Role-Based (Buyer / Farmer)
// ============================================

let marketplaceState = {
    role: null,          // 'buyer' | 'farmer'
    activeTab: 'buyer',
    category: 'all',
    query: '',
    products: [...MARKETPLACE_PRODUCTS],
    myListings: []       // listings added by this farmer in current session
};

// Ensure marketplace is only initialized once per session
function checkMarketplaceInit() {

}

// ─── Role Picker ────────────────────────────────────────────────────────────

function openMarketplace() {
    // Show role picker first; called from navigation instead of showSection directly
    const overlay = document.getElementById('rolePickerOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
        // Prevent body scroll while picker is open
        document.body.style.overflow = 'hidden';
    }
}

function selectMarketplaceRole(role) {
    marketplaceState.role = role;
    // Hide role picker
    const overlay = document.getElementById('rolePickerOverlay');
    if (overlay) overlay.style.display = 'none';
    document.body.style.overflow = '';

    // Update role badge
    const badge = document.getElementById('mkRoleLabel');
    if (badge) badge.textContent = role === 'farmer' ? 'Farmer' : 'Buyer';

    // Switch to the appropriate default tab
    if (role === 'farmer') {
        switchMkTab('farmer');
    } else {
        switchMkTab('buyer');
    }

    // Initialise marketplace content
    initMarketplace();
}

function switchRole() {
    const overlay = document.getElementById('rolePickerOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// ─── Tab Switching ───────────────────────────────────────────────────────────

function switchMkTab(tab) {
    marketplaceState.activeTab = tab;

    // Toggle tab buttons
    document.getElementById('tabBuyer')?.classList.toggle('active', tab === 'buyer');
    document.getElementById('tabFarmer')?.classList.toggle('active', tab === 'farmer');

    // Toggle tab content
    const buyerContent = document.getElementById('buyerTab');
    const farmerContent = document.getElementById('farmerTab');
    if (buyerContent) buyerContent.classList.toggle('active', tab === 'buyer');
    if (farmerContent) farmerContent.classList.toggle('active', tab === 'farmer');
}

// ─── Location Data & Logic ───────────────────────────────────────────────────
const INDIAN_STATES = {
    // States
    "Andhra Pradesh": ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", "Prakasam", "Srikakulam", "Visakhapatnam", "West Godavari"],
    "Arunachal Pradesh": ["Tawang", "Papum Pare", "East Kameng", "West Kameng"],
    "Assam": ["Baksa", "Barpeta", "Cachar", "Darrang", "Dhubri", "Dibrugarh", "Guwahati", "Nagaon"],
    "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Ara", "Begusarai", "Katihar"],
    "Chhattisgarh": ["Bastar", "Bijapur", "Bilaspur", "Dantewada", "Durg", "Raipur", "Rajnandgaon", "Surguja"],
    "Goa": ["North Goa", "South Goa"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar", "Kachchh"],
    "Haryana": ["Faridabad", "Gurugram", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal", "Sonipat"],
    "Himachal Pradesh": ["Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu", "Mandi", "Shimla"],
    "Jharkhand": ["Bokaro", "Deoghar", "Dhanbad", "Dumka", "Hazaribagh", "Jamshedpur", "Ranchi"],
    "Karnataka": ["Bengaluru", "Mysuru", "Hubballi-Dharwad", "Mangaluru", "Belagavi", "Vijayapura", "Ballari", "Tumakuru"],
    "Kerala": ["Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kochi", "Kozhikode", "Malappuram", "Palakkad", "Thiruvananthapuram"],
    "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna", "Ratlam", "Rewa"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Amravati", "Kolhapur", "Jalgaon"],
    "Manipur": ["Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West"],
    "Meghalaya": ["East Garo Hills", "East Khasi Hills", "Ri Bhoi", "West Garo Hills", "West Khasi Hills"],
    "Mizoram": ["Aizawl", "Champhai", "Kolasib", "Lawngtlai", "Lunglei", "Mamit", "Saiha", "Serchhip"],
    "Nagaland": ["Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung", "Mon", "Peren", "Phek", "Tuensang", "Wokha", "Zunheboto"],
    "Odisha": ["Balasore", "Bhubaneswar", "Cuttack", "Ganjam", "Khurda", "Puri", "Sambalpur"],
    "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Hoshiarpur", "Mohali", "Batala", "Pathankot"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara", "Alwar", "Bharatpur", "Sikar"],
    "Sikkim": ["East Sikkim", "North Sikkim", "South Sikkim", "West Sikkim"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Vellore", "Erode", "Thoothukudi"],
    "Telangana": ["Adilabad", "Hyderabad", "Karimnagar", "Khammam", "Mahbubnagar", "Medak", "Nalgonda", "Nizamabad", "Warangal"],
    "Tripura": ["Dhalai", "Gomati", "Khowai", "North Tripura", "Sepahijala", "South Tripura", "Unakoti", "West Tripura"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Meerut", "Prayagraj", "Bareilly", "Aligarh", "Moradabad"],
    "Uttarakhand": ["Almora", "Dehradun", "Haridwar", "Nainital", "Pauri Garhwal", "Pithoragarh", "Tehri Garhwal", "Udham Singh Nagar"],
    "West Bengal": ["Kolkata", "Howrah", "Darjeeling", "Kalimpong", "Jalpaiguri", "Alipurduar", "Cooch Behar", "Dakshin Dinajpur", "Uttar Dinajpur", "Malda", "Murshidabad", "Birbhum", "Nadia", "North 24 Parganas", "South 24 Parganas", "Hooghly", "Purba Bardhaman", "Paschim Bardhaman", "Purba Medinipur", "Paschim Medinipur", "Jhargram", "Purulia", "Bankura"],
    
    // Union Territories
    "Andaman and Nicobar Islands": ["Nicobar", "North and Middle Andaman", "South Andaman"],
    "Chandigarh": ["Chandigarh"],
    "Dadra and Nagar Haveli and Daman and Diu": ["Dadra and Nagar Haveli", "Daman", "Diu"],
    "Delhi": ["Central Delhi", "East Delhi", "New Delhi", "North Delhi", "South Delhi", "West Delhi"],
    "Jammu and Kashmir": ["Anantnag", "Baramulla", "Jammu", "Kathua", "Rajouri", "Srinagar", "Udhampur"],
    "Ladakh": ["Kargil", "Leh"],
    "Lakshadweep": ["Lakshadweep"],
    "Puducherry": ["Karaikal", "Mahe", "Puducherry", "Yanam"]
};

function populateStatesDropdowns() {
    const mkStateSelect = document.getElementById('stateSelect');
    const schemeStateSelect = document.getElementById('schemeStateSelect');
    
    const sortedStates = Object.keys(INDIAN_STATES).sort();

    const generateOptions = (selectElement) => {
        if (!selectElement) return;
        selectElement.innerHTML = '<option value="" disabled selected>Select State</option>';
        sortedStates.forEach(state => {
            const option = document.createElement('option');
            option.value = state;
            option.textContent = state;
            selectElement.appendChild(option);
        });
    };

    generateOptions(mkStateSelect);
    generateOptions(schemeStateSelect);
}

document.addEventListener('DOMContentLoaded', populateStatesDropdowns);

function populateDistricts() {
    const stateSelect = document.getElementById('stateSelect');
    const districtSelect = document.getElementById('districtSelect');

    if (!stateSelect || !districtSelect) return;

    districtSelect.innerHTML = '<option value="" disabled selected>Select District</option>';
    const selectedState = stateSelect.value;

    if (INDIAN_STATES[selectedState]) {
        INDIAN_STATES[selectedState].forEach(district => {
            const option = document.createElement('option');
            option.value = district;
            option.textContent = district;
            districtSelect.appendChild(option);
        });
    }
}

function getCurrentLocationMap() {
    const mapInput = document.getElementById('locationMapInput');
    if (!mapInput) return;

    if (navigator.geolocation) {
        mapInput.placeholder = "Getting location...";
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            mapInput.value = `https://www.google.com/maps?q=${lat},${lng}`;
            mapInput.placeholder = "Paste Map Link or Get GPS";
        }, error => {
            alert("Unable to fetch exact location. Falling back to default.");
            const lat = 22.0667;
            const lng = 88.0698;
            mapInput.value = `https://www.google.com/maps?q=${lat},${lng}`;
            mapInput.placeholder = "Paste Map Link or Get GPS";
        }, { enableHighAccuracy: true });
    } else {
        alert("Geolocation is not supported by your browser.");
        const lat = 22.0667;
        const lng = 88.0698;
        mapInput.value = `https://www.google.com/maps?q=${lat},${lng}`;
    }
}

// ─── Init ────────────────────────────────────────────────────────────────────

function initMarketplace() {
    populateSellProductDropdown();
    renderMarketplaceCategories();
    renderMarketplaceProducts();
    renderFarmerListings();
}

function populateSellProductDropdown() {
    const dataList = document.getElementById('cropNamesList');
    if (!dataList || typeof CROPS_DATABASE === 'undefined') return;

    dataList.innerHTML = '';

    Object.values(CROPS_DATABASE).forEach(crop => {
        const option = document.createElement('option');
        option.value = crop.commonName;
        // Storing data globally to look up on input
        dataList.appendChild(option);
    });
}

let sellProductTimer = null;

function updateSellProductImage() {
    const input = document.getElementById('sellProductName');
    const imagePreview = document.getElementById('sellProductImage');
    const icon = document.getElementById('sellProductIcon');
    const categorySelect = document.querySelector('select[name="category"]');

    if (!input) return;

    const cropName = input.value.trim().toLowerCase();
    
    if (sellProductTimer) clearTimeout(sellProductTimer);

    if (cropName.length === 0) {
        if (imagePreview) imagePreview.style.display = 'none';
        if (icon) icon.style.display = 'block';
        const noListingDiv = document.querySelector('.farmer-no-listing');
        if (noListingDiv && marketplaceState.myListings.length === 0) {
            noListingDiv.innerHTML = `
                <i class="fas fa-seedling"></i>
                <p>Your published listings will appear here</p>
            `;
        }
        return;
    }

    let matchedCrop = null;

    // Find crop in database (case insensitive match)
    if (typeof CROPS_DATABASE !== 'undefined') {
        matchedCrop = Object.values(CROPS_DATABASE).find(c => c.commonName.toLowerCase() === cropName);
    }

    if (matchedCrop && matchedCrop.imageUrl) {
        if (imagePreview) {
            imagePreview.src = matchedCrop.imageUrl;
            imagePreview.style.display = 'block';
        }
        if (icon) icon.style.display = 'none';

        if (categorySelect) {
            const cat = matchedCrop.category;
            let mappedCat = cat;
            if (cat === 'vegetable') mappedCat = 'vegetables';
            else if (cat === 'fruit') mappedCat = 'fruits';
            else if (cat === 'cereal') mappedCat = 'grains';
            else if (cat === 'oilseed') mappedCat = 'seeds';

            categorySelect.value = mappedCat;
        }
        
        const noListingDiv = document.querySelector('.farmer-no-listing');
        if (noListingDiv && marketplaceState.myListings.length === 0) {
            noListingDiv.innerHTML = `
                <img src="${matchedCrop.imageUrl}" style="max-width: 100%; max-height: 200px; border-radius: 12px; object-fit: cover; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <p style="font-weight: 500; font-size: 1.1rem; color: var(--text-primary); margin-bottom: 5px;">${matchedCrop.commonName} Preview</p>
                <p style="font-size: 0.9rem;">Fill the form to publish your listing</p>
            `;
        }
    } else {
        if (imagePreview) imagePreview.style.display = 'none';
        if (icon) icon.style.display = 'block';
        
        const noListingDiv = document.querySelector('.farmer-no-listing');
        if (noListingDiv && marketplaceState.myListings.length === 0) {
            noListingDiv.innerHTML = `
                <div style="width: 120px; height: 120px; border-radius: 50%; background: #e8f5e9; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                    <i class="fas fa-spinner fa-spin" style="font-size: 4rem; color: #4caf50;"></i>
                </div>
                <p style="font-weight: 500; font-size: 1.1rem; color: var(--text-primary); margin-bottom: 5px;">Searching please wait Krishibhai</p>
                <p style="font-size: 0.9rem;">Finding crop details for you...</p>
            `;
        }
        
        sellProductTimer = setTimeout(async () => {
            if (cropName === input.value.trim().toLowerCase() && typeof fetchAICropMetadata === 'function') {
                const aiCrop = await fetchAICropMetadata(input.value.trim());
                if (aiCrop && aiCrop.imageUrl) {
                    // Force refresh preview now that it's in CROPS_DATABASE
                    if (input.value.trim().toLowerCase() === aiCrop.commonName.toLowerCase()) {
                        updateSellProductImage();
                    }
                } else {
                    if (noListingDiv && marketplaceState.myListings.length === 0 && input.value.trim().toLowerCase() === cropName) {
                        noListingDiv.innerHTML = `
                            <div style="width: 120px; height: 120px; border-radius: 50%; background: #ffebee; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                                <i class="fas fa-times-circle" style="font-size: 4rem; color: #f44336;"></i>
                            </div>
                            <p style="font-weight: 500; font-size: 1.1rem; color: #f44336; margin-bottom: 5px;">Enter a valid crop</p>
                            <p style="font-size: 0.9rem;">Please enter a real crop or vegetable</p>
                        `;
                    }
                }
            }
        }, 1200);
    }
}

// ─── Render Categories ───────────────────────────────────────────────────────

function renderMarketplaceCategories() {
    const container = document.getElementById('marketplaceCategories');
    if (!container) return;
    container.innerHTML = MARKETPLACE_CATEGORIES.map(cat => `
        <div class="category-chip ${marketplaceState.category === cat.id ? 'active' : ''}"
             onclick="filterMarketplace('${cat.id}')">
            <i class="fas ${cat.icon}"></i>
            <span>${cat.name}</span>
        </div>
    `).join('');
}

// ─── Render Buyer Product Grid ───────────────────────────────────────────────

function renderMarketplaceProducts() {
    const grid = document.getElementById('marketplaceGrid');
    if (!grid) return;

    const filtered = marketplaceState.products.filter(p => {
        const cat = marketplaceState.category === 'all' || p.category === marketplaceState.category;
        const q = marketplaceState.query.toLowerCase();
        const search = !q ||
            p.name.toLowerCase().includes(q) ||
            (p.farmerName && p.farmerName.toLowerCase().includes(q)) ||
            (p.location && p.location.toLowerCase().includes(q));
        return cat && search;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="marketplace-empty-state">
                <i class="fas fa-box-open"></i>
                <h3>No listings found</h3>
                <p>Try a different category or search term</p>
            </div>`;
        return;
    }

    grid.innerHTML = filtered.map(p => {

        return `
        <div class="premium-card">
            ${p.verified ? '<div class="verified-seal" title="Govt Verified"><i class="fas fa-shield-alt"></i></div>' : ''}
            <div class="premium-card-img-wrapper">
                <img src="${p.image || ''}"
                     class="premium-card-img"
                     alt="${p.name}"
                     loading="lazy"
                     onerror="this.style.display='none';this.parentNode.style.background='linear-gradient(135deg,#e8f5e9,#c8e6c9,#a5d6a7)';this.parentNode.innerHTML+='<div style=\\'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:2.5rem;\\'>🌿</div>'">
                <div class="premium-card-category">${MARKETPLACE_CATEGORIES.find(c => c.id === p.category)?.name || p.category}</div>
            </div>
            <div class="premium-card-body">
                <div class="premium-card-title">${p.name}</div>
                <div class="premium-card-info">
                    <div class="info-badge"><i class="fas fa-user-tie"></i> ${p.farmerName || 'Registered Farmer'}</div>
                    ${p.mapLink ? 
                        `<a href="${p.mapLink.startsWith('http') ? p.mapLink : 'https://' + p.mapLink}" target="_blank" class="info-badge" style="text-decoration:none; color:inherit; cursor:pointer; background:#e3f2fd; border-color:#90caf9;" title="View exact location on Google Maps"><i class="fas fa-map-marked-alt" style="color:#1976d2;"></i> ${p.location}</a>` :
                        `<div class="info-badge"><i class="fas fa-map-marker-alt"></i> ${p.location}</div>`
                    }
                    <div class="info-badge"><i class="fas fa-cubes"></i> ${p.quantity}</div>
                </div>
                <div class="premium-card-footer">
                    <div class="premium-card-price">&#8377;${p.price.toLocaleString('en-IN')}<span>/${p.unit}</span></div>
                    <div class="premium-action-btns" id="contact-actions-${p.id}" style="display:flex; flex-direction:column; gap:8px;">
                        <button class="p-btn p-btn-cart" style="width:100%; border-radius:8px;" onclick="addToCart('${p.id}')" title="Add to Cart">
                            <i class="fas fa-cart-plus"></i> Add to Cart
                        </button>
                        <div style="display:flex; flex-direction:column; gap: 8px; width:100%; animation: fadeIn 0.4s ease-out; margin-top: 5px;">
                            <a href="https://wa.me/${p.whatsapp || (p.contact ? p.contact.replace(/\D/g, '') : '')}" target="_blank" style="background: linear-gradient(135deg, #25D366, #128C7E); color: white; border-radius: 12px; padding: 12px; text-decoration: none; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 10px rgba(37, 211, 102, 0.3);">
                                <i class="fab fa-whatsapp" style="font-size: 1.2rem;"></i> WhatsApp Chat
                            </a>
                            <a href="tel:${p.contact}" style="background: linear-gradient(135deg, #007bff, #0056b3); color: white; border-radius: 12px; padding: 12px; text-decoration: none; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 10px rgba(0, 123, 255, 0.3);">
                                <i class="fas fa-phone-alt" style="font-size: 1.1rem;"></i> Call Farmer
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }).join('');
}

// ─── Render Farmer's Own Listings ────────────────────────────────────────────

function renderFarmerListings() {
    const container = document.getElementById('farmerActiveListings');
    if (!container) return;

    if (marketplaceState.myListings.length === 0) {
        container.innerHTML = `
            <div class="farmer-no-listing">
                <i class="fas fa-seedling"></i>
                <p>Your published listings will appear here</p>
            </div>`;
        return;
    }

    container.innerHTML = marketplaceState.myListings.map(p => `
        <div class="farmer-listing-row">
            <div class="flr-name">${p.name}</div>
            <div class="flr-meta">
                <span><i class="fas fa-tag"></i> &#8377;${p.price.toLocaleString('en-IN')}/${p.unit}</span>
                <span><i class="fas fa-cubes"></i> ${p.quantity}</span>
                <span><i class="fas fa-map-marker-alt"></i> ${p.location}</span>
            </div>
            <span class="flr-live"><i class="fas fa-circle"></i> Live</span>
        </div>`).join('');
}

// ─── Filter & Search ─────────────────────────────────────────────────────────

function filterMarketplace(category) {
    marketplaceState.category = category;
    marketplaceState.query = '';
    const input = document.getElementById('marketplaceSearch');
    if (input) input.value = '';
    renderMarketplaceCategories();
    renderMarketplaceProducts();
}

function searchMarketplace(query) {
    marketplaceState.query = query.trim();
    renderMarketplaceProducts();
}

// ─── Sell Submit ─────────────────────────────────────────────────────────────

async function handleSellSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Publish Listing';
    
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    }

    try {
        const fd = new FormData(form);

        const phone = fd.get('contact').replace(/\D/g, '');
        const cropNameInput = fd.get('name').trim();

        // Look up the image if it's a known crop
        let imageUrl = 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&q=75';
        
        if (typeof CROPS_DATABASE !== 'undefined') {
            let matchedCrop = Object.values(CROPS_DATABASE).find(c => c.commonName.toLowerCase() === cropNameInput.toLowerCase());
            
            // If not found instantly, user probably submitted before AI was done
            if (!matchedCrop && typeof fetchAICropMetadata === 'function') {
                matchedCrop = await fetchAICropMetadata(cropNameInput);
            }
            
            if (matchedCrop && matchedCrop.imageUrl) {
                imageUrl = matchedCrop.imageUrl;
            } else if (!matchedCrop) {
                alert(`"${cropNameInput}" does not seem to be a valid crop. Please correct the name before publishing.`);
                return;
            }
        }

    const newProduct = {
        id: 'my' + Date.now(),
        name: cropNameInput,
        category: fd.get('category'),
        price: parseFloat(fd.get('price')),
        unit: fd.get('unit'),
        quantity: fd.get('quantity'),
        location: fd.get('district') + ', ' + fd.get('state'),
        mapLink: fd.get('locationMap'),
        farmerName: 'You',
        contact: '+91 ' + fd.get('contact'),
        whatsapp: '91' + phone,
        image: imageUrl,
        verified: false,
        createdAt: new Date().toISOString().split('T')[0]
    };

    // Add to both master list and farmer's own list
    marketplaceState.products.unshift(newProduct);
    marketplaceState.myListings.unshift(newProduct);

    renderMarketplaceProducts();
    renderFarmerListings();
    form.reset();
    updateSellProductImage();

        // Toast
        const toast = document.createElement('div');
        toast.className = 'mk-toast';
        toast.innerHTML = '<i class="fas fa-check-circle"></i> Listing published successfully!';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
        
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    }
}

// ─── Legacy stubs (kept for compatibility) ───────────────────────────────────
function openSellModal() { switchMkTab('farmer'); }
function closeSellModal() { }
