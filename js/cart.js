// ============================================
// CART SYSTEM — BharatFarm Marketplace
// ============================================

let cartState = {
    items: []  // { product, qty }
};

// ─── Core Cart Operations ────────────────────────────────────────────────────

function isCartEmpty() {
    return cartState.items.length === 0;
}

function addToCart(productId) {
    const product = marketplaceState.products.find(p => p.id === productId);
    if (!product) return;

    const existing = cartState.items.find(i => i.product.id === productId);
    if (existing) {
        existing.qty += 1;
    } else {
        cartState.items.push({ product, qty: 1 });
    }

    updateCartBadge();
    showCartToast(product.name);
    renderCartDrawer();
}

function removeFromCart(productId) {
    cartState.items = cartState.items.filter(i => i.product.id !== productId);
    updateCartBadge();
    renderCartDrawer();
    renderCheckoutSummary();
}

function updateCartQty(productId, delta) {
    const item = cartState.items.find(i => i.product.id === productId);
    if (!item) return;
    item.qty = Math.max(1, item.qty + delta);
    renderCartDrawer();
    renderCheckoutSummary();
    updateCartBadge();
}

function clearCart() {
    cartState.items = [];
    updateCartBadge();
    renderCartDrawer();
}

// ─── Cart Badge ──────────────────────────────────────────────────────────────

function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    const total = cartState.items.reduce((sum, i) => sum + i.qty, 0);
    if (badge) {
        badge.textContent = total;
        badge.style.display = total > 0 ? 'flex' : 'none';
    }
}

// ─── Cart Drawer ─────────────────────────────────────────────────────────────

function openCartDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (drawer) drawer.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    renderCartDrawer();
}

function closeCartDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
}

function renderCartDrawer() {
    const body = document.getElementById('cartBody');
    const footer = document.getElementById('cartFooter');
    if (!body) return;

    if (cartState.items.length === 0) {
        body.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-basket"></i>
                <h3>Your cart is empty</h3>
                <p>Add items from the marketplace to begin</p>
            </div>`;
        if (footer) footer.style.display = 'none';
        return;
    }

    if (footer) footer.style.display = 'block';

    const total = cartState.items.reduce((sum, i) => sum + i.product.price * i.qty, 0);

    body.innerHTML = cartState.items.map(i => `
        <div class="cart-item" id="ci-${i.product.id}">
            <div class="cart-item-img-wrap">
                <img src="${i.product.image || ''}" class="cart-item-img" alt="${i.product.name}"
                     onerror="this.style.display='none';this.parentNode.style.background='#e8f5e9'">
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${i.product.name}</div>
                <div class="cart-item-meta">
                    <span><i class="fas fa-user-tie"></i> ${i.product.farmerName}</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${i.product.location}</span>
                </div>
                <div class="cart-item-price">&#8377;${i.product.price.toLocaleString('en-IN')} / ${i.product.unit}</div>
                <div class="cart-item-controls">
                    <div class="qty-control">
                        <button class="qty-btn" onclick="updateCartQty('${i.product.id}', -1)"><i class="fas fa-minus"></i></button>
                        <span class="qty-val">${i.qty}</span>
                        <button class="qty-btn" onclick="updateCartQty('${i.product.id}', 1)"><i class="fas fa-plus"></i></button>
                    </div>
                    <div class="cart-item-subtotal">= &#8377;${(i.product.price * i.qty).toLocaleString('en-IN')}</div>
                    <button class="cart-remove-btn" onclick="removeFromCart('${i.product.id}')" title="Remove">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        </div>`).join('');

    const totalEl = document.getElementById('cartTotal');
    if (totalEl) totalEl.textContent = `\u20B9${total.toLocaleString('en-IN')}`;
}

// ─── Checkout ────────────────────────────────────────────────────────────────

function openCheckout() {
    closeCartDrawer();
    const modal = document.getElementById('checkoutModal');
    if (modal) modal.style.display = 'flex';
    renderCheckoutSummary();
}

function closeCheckout() {
    const modal = document.getElementById('checkoutModal');
    if (modal) modal.style.display = 'none';
}

function renderCheckoutSummary() {
    const container = document.getElementById('checkoutItems');
    if (!container || cartState.items.length === 0) return;

    const subtotal = cartState.items.reduce((sum, i) => sum + i.product.price * i.qty, 0);

    container.innerHTML = cartState.items.map(i => `
        <div class="co-item">
            <div class="co-item-left">
                <div class="co-item-name">${i.product.name}</div>
                <div class="co-item-meta">${i.qty} × &#8377;${i.product.price.toLocaleString('en-IN')} / ${i.product.unit}</div>
            </div>
            <div class="co-item-price">&#8377;${(i.product.price * i.qty).toLocaleString('en-IN')}</div>
        </div>`).join('');

    const subtotalEl = document.getElementById('coSubtotal');
    const totalEl    = document.getElementById('coTotal');
    if (subtotalEl) subtotalEl.textContent = `\u20B9${subtotal.toLocaleString('en-IN')}`;
    if (totalEl)    totalEl.textContent    = `\u20B9${subtotal.toLocaleString('en-IN')}`;
}

function placeOrder() {
    const nameEl  = document.getElementById('buyerName');
    const phoneEl = document.getElementById('buyerPhone');
    const name    = nameEl?.value.trim();
    const phone   = phoneEl?.value.trim();

    if (!name || !phone || phone.length < 10) {
        shakeElement(nameEl);
        shakeElement(phoneEl);
        return;
    }

    // Group items by farmer
    const byFarmer = {};
    cartState.items.forEach(i => {
        const key = i.product.whatsapp || (i.product.contact ? i.product.contact.replace(/\D/g, '') : '');
        if (!byFarmer[key]) byFarmer[key] = { farmer: i.product.farmerName, location: i.product.location, items: [] };
        byFarmer[key].items.push(i);
    });

    // Send one WhatsApp message per farmer
    Object.entries(byFarmer).forEach(([waNum, group]) => {
        const lines = group.items.map(i =>
            `• ${i.product.name} — Qty: ${i.qty} ${i.product.unit} — ₹${i.product.price.toLocaleString('en-IN')}/${i.product.unit}`
        ).join('%0A');

        const totalForFarmer = group.items.reduce((s, i) => s + i.product.price * i.qty, 0);
        const msg = encodeURIComponent(
            `🌾 *BharatFarm Order Request*\n\n` +
            `Hello ${group.farmer},\n` +
            `I found your listing on BharatFarm.\n\nOrder Details:\n`
        ) + lines +
            `%0A%0ATotal: ₹${totalForFarmer.toLocaleString('en-IN')}%0A%0ABuyer: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}`;

        window.open(`https://wa.me/${waNum}?text=${msg}`, '_blank');
    });

    // Confirmation screen
    const body = document.getElementById('checkoutBody');
    if (body) {
        body.innerHTML = `
            <div class="co-success">
                <div class="co-success-icon"><i class="fas fa-check-circle"></i></div>
                <h2>Order Sent!</h2>
                <p>Your order has been sent via WhatsApp to ${Object.keys(byFarmer).length} farmer(s).<br>They will contact you shortly.</p>
                <button class="sell-submit-btn" onclick="closeCheckout(); clearCart();" style="margin-top:20px;">
                    <i class="fas fa-check"></i> Done
                </button>
            </div>`;
    }
}

function shakeElement(el) {
    if (!el) return;
    el.style.borderColor = '#e53e3e';
    el.style.animation = 'mkShake 0.4s ease';
    setTimeout(() => { el.style.animation = ''; el.style.borderColor = ''; }, 500);
}

// ─── Toast ───────────────────────────────────────────────────────────────────

function showCartToast(name) {
    const t = document.createElement('div');
    t.className = 'mk-toast';
    t.innerHTML = `<i class="fas fa-cart-plus"></i> ${name} added to cart`;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
}
